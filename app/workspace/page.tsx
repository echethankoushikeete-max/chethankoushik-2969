'use client';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

type CameraFacing = 'user' | 'environment';

type SelectedFile = {
  id: string;
  file: File;
  preview?: string;
};

export default function Workspace() {
  const [mode, setMode] = useState<'life' | 'study'>('life');
  const [text, setText] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraFacing>('environment');
  const [cameraError, setCameraError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && window.innerWidth < 900);
    setIsMobile(mobile);

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOpen(false);
  }, []);

  const startCamera = useCallback(async (facing: CameraFacing = 'environment') => {
    try {
      setCameraError('');
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is unavailable. Use HTTPS or localhost.');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      setCameraFacing(facing);
      setCameraOpen(true);

      requestAnimationFrame(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try { await videoRef.current.play(); } catch { /* browser may require a user gesture */ }
        }
      });
    } catch (error) {
      console.error(error);
      setCameraError('Camera access failed. Allow camera permission and try again.');
      setCameraOpen(false);
    }
  }, []);

  const openCamera = () => startCamera('environment');

  const switchCamera = async () => {
    if (!isMobile) return;
    await startCamera(cameraFacing === 'environment' ? 'user' : 'environment');
  };

  const addFile = (file: File, preview?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setSelectedFiles((current) => [...current, { id, file, preview }]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => addFile(file, String(reader.result));
        reader.readAsDataURL(file);
      } else {
        addFile(file);
      }
    });
    event.target.value = '';
  };

  const removeFile = (id: string) => {
    setSelectedFiles((current) => current.filter((item) => item.id !== id));
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError('Camera is not ready yet. Try again in a moment.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;

    if (cameraFacing === 'user') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const preview = canvas.toDataURL('image/jpeg', 0.92);
    canvas.toBlob((blob) => {
      if (!blob) return;
      addFile(new File([blob], `LIFEOS-Capture-${Date.now()}.jpg`, { type: 'image/jpeg' }), preview);
      stopCamera();
    }, 'image/jpeg', 0.92);
  };

  const ask = async () => {
    if (!text.trim() && selectedFiles.length === 0) return;

    setLoading(true);
    setReply('');

    try {
      const formData = new FormData();
      formData.append(
        'message',
        `Mode: ${mode === 'life' ? 'LIFE MODE' : 'STUDY MODE'}\n\n${text}`
      );

      if (selectedFiles[0]) formData.append('file', selectedFiles[0].file);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setReply(data.reply || data.error || 'No response.');
    } catch {
      setReply('LIFEOS could not connect to the AI backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="workspace glass-workspace">
      <header className="workspace-top glass-topbar">
        <div className="workspace-heading">
          <a className="workspace-back" href="/">← BACK TO MINA</a>
          <div className="workspace-brand">LIFEOS<span className="workspace-brand-mark">•</span></div>
          <div className="small">Your personal intelligence space</div>
        </div>
        <div className="workspace-status"><span /> AI WORKSPACE</div>
      </header>

      <div className="workspace-welcome">
        <div>
          <p className="workspace-kicker">YOUR DAY, WITH CLARITY</p>
          <h1 className="workspace-hero">{mode === 'life' ? 'Make room for what matters.' : 'Learn with more clarity.'}</h1>
          <p className="workspace-copy">
            {mode === 'life'
              ? 'Bring your notes, questions, images and everyday tasks into one calm space.'
              : 'Work through academic questions, assignments and concepts at your own pace.'}
          </p>
        </div>
        <div className="workspace-mode-switch" aria-label="Choose workspace mode">
          <button className={`mode-tab ${mode === 'life' ? 'active' : ''}`} onClick={() => setMode('life')}><span>✳</span> LIFE MODE</button>
          <button className={`mode-tab ${mode === 'study' ? 'active' : ''}`} onClick={() => setMode('study')}><span>⌘</span> STUDY MODE</button>
        </div>
      </div>

      <section className="workspace-main">
        <div className="workspace-card glass-card">
          <div className="workspace-card-heading">
            <div><span className="workspace-card-kicker">01 / INPUT</span><h2>{mode === 'life' ? 'What would you like to work on?' : 'What would you like to understand?'}</h2></div>
            <span className="workspace-orb">✦</span>
          </div>
          <textarea
            className="workspace-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={mode === 'life' ? 'Paste your notice, message, bill or question here…' : 'Paste your academic problem here…'}
          />

          <div className="workspace-actions">
            <button className="mode-tab ask-button" onClick={ask} disabled={loading}>
              {loading ? 'Thinking…' : 'Ask LIFEOS'} <span>↗</span>
            </button>
            <button className="mode-tab tool-button" onClick={openCamera}><span>◎</span> Open camera</button>
            <button className="mode-tab tool-button" onClick={() => fileInputRef.current?.click()}><span>＋</span> Upload files</button>
            <button className="mode-tab clear-button" onClick={() => { setText(''); setSelectedFiles([]); setReply(''); }}>Clear</button>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              multiple
              accept="image/*,.pdf,.txt,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv"
              onChange={handleFileChange}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="workspace-files" aria-label="Attached files">
              {selectedFiles.map((item) => (
                <div className="workspace-file" key={item.id}>
                  {item.preview ? <img src={item.preview} alt="Attached preview" /> : <span className="workspace-file-icon">📄</span>}
                  <span title={item.file.name}>{item.file.name}</span>
                  <button onClick={() => removeFile(item.id)} aria-label={`Remove ${item.file.name}`}>×</button>
                </div>
              ))}
            </div>
          )}

          {cameraError && <div className="workspace-error">{cameraError}</div>}

          {cameraOpen && (
            <div className="camera-panel">
              <div className="camera-panel-heading"><span>LIVE CAMERA</span><button className="camera-close" onClick={stopCamera}>CLOSE ×</button></div>
              <div className="camera-box">
                <video ref={videoRef} autoPlay playsInline muted />
                <div className="camera-controls">
                  <button className="mode-tab ask-button" onClick={capturePhoto}>◎ Capture</button>
                  <button className="mode-tab tool-button" onClick={switchCamera} disabled={!isMobile} title={isMobile ? 'Switch front/back camera' : 'Camera flip is available on phones only'}>↻ Flip camera</button>
                  <button className="mode-tab tool-button" onClick={stopCamera}>Close camera</button>
                </div>
              </div>
            </div>
          )}

          {reply && <div className="workspace-result"><div className="workspace-response-label">LIFEOS RESPONSE</div>{reply}</div>}
        </div>
      </section>
    </main>
  );
}
