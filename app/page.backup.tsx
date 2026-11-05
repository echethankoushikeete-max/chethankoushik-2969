'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    try {
      setCameraError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
        audio: false,
      });

      streamRef.current = stream;

      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error(error);

      setCameraError(
        'Camera access was denied or is unavailable.'
      );
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    setCameraOpen(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    if (!context) return;

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          `lifeos-photo-${Date.now()}.jpg`,
          {
            type: 'image/jpeg',
          }
        );

        setSelectedFile(file);

        const imageURL = URL.createObjectURL(blob);
        setPreview(imageURL);

        stopCamera();
      },
      'image/jpeg',
      0.9
    );
  }

  function handleFileSelect(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  function removeFile() {
    setSelectedFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function askLifeOS() {
    if (!message.trim() && !selectedFile) {
      setReply(
        'Please type something, take a photo, or upload a file.'
      );
      return;
    }

    setLoading(true);
    setReply('');

    try {
      const formData = new FormData();

      formData.append('message', message);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'Something went wrong.'
        );
      }

      setReply(data.reply || 'No response received.');
    } catch (error) {
      console.error(error);

      setReply(
        'LIFEOS could not process your request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setMessage('');
    setReply('');
    removeFile();
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, #18233f 0%, #080b14 45%, #05060a 100%)',
        color: 'white',
        padding: '50px 20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* HEADER */}

        <section
          style={{
            marginBottom: '35px',
          }}
        >
          <p
            style={{
              color: '#66e3ff',
              fontSize: '14px',
              letterSpacing: '3px',
              fontWeight: 700,
            }}
          >
            LIFEOS AI
          </p>

          <h1
            style={{
              fontSize: 'clamp(50px, 10vw, 100px)',
              lineHeight: 0.9,
              margin: 0,
              fontWeight: 900,
            }}
          >
            action.
          </h1>

          <p
            style={{
              color: '#aeb7ca',
              fontSize: '18px',
              lineHeight: 1.6,
              maxWidth: '650px',
              marginTop: '20px',
            }}
          >
            Paste a notice, bill, message, screenshot or
            everyday information. LIFEOS turns it into
            clear next steps.
          </p>
        </section>

        {/* INPUT CARD */}

        <section
          style={{
            background: 'rgba(18, 23, 38, 0.8)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '28px',
            padding: '22px',
            backdropFilter: 'blur(20px)',
            boxShadow:
              '0 20px 80px rgba(0,0,0,0.35)',
          }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell LIFEOS what you need help with..."
            rows={6}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              background: '#080b14',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '18px',
              color: 'white',
              padding: '18px',
              fontSize: '17px',
              outline: 'none',
            }}
          />

          {/* FILE PREVIEW */}

          {selectedFile && (
            <div
              style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: '16px',
                background:
                  'rgba(102,227,255,0.08)',
                border:
                  '1px solid rgba(102,227,255,0.2)',
              }}
            >
              {preview && (
                <img
                  src={preview}
                  alt="Selected file"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    marginBottom: '10px',
                  }}
                />
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div>
                  <strong>{selectedFile.name}</strong>

                  <div
                    style={{
                      color: '#9ca7bb',
                      fontSize: '13px',
                      marginTop: '4px',
                    }}
                  >
                    {(
                      selectedFile.size /
                      1024 /
                      1024
                    ).toFixed(2)}{' '}
                    MB
                  </div>
                </div>

                <button
                  onClick={removeFile}
                  style={secondaryButton}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* BUTTONS */}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '18px',
            }}
          >
            <button
              onClick={askLifeOS}
              disabled={loading}
              style={primaryButton}
            >
              {loading
                ? 'Thinking...'
                : 'Ask LIFEOS →'}
            </button>

            <button
              onClick={startCamera}
              style={secondaryButton}
            >
              📷 Camera
            </button>

            <button
              onClick={() =>
                fileInputRef.current?.click()
              }
              style={secondaryButton}
            >
              📁 Upload File
            </button>

            <button
              onClick={clearAll}
              style={secondaryButton}
            >
              Clear
            </button>
          </div>

          {/* HIDDEN FILE INPUT */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.webp,.csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {/* CAMERA */}

          {cameraOpen && (
            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                borderRadius: '20px',
                background: '#05070d',
                border:
                  '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '14px',
                }}
              >
                <button
                  onClick={capturePhoto}
                  style={primaryButton}
                >
                  📸 Capture Photo
                </button>

                <button
                  onClick={stopCamera}
                  style={secondaryButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />

          {cameraError && (
            <p
              style={{
                color: '#ff8c8c',
                marginTop: '15px',
              }}
            >
              {cameraError}
            </p>
          )}
        </section>

        {/* RESPONSE */}

        <section
          style={{
            marginTop: '25px',
            padding: '24px',
            minHeight: '120px',
            background:
              'rgba(18, 23, 38, 0.65)',
            border:
              '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
          }}
        >
          <div
            style={{
              color: '#66e3ff',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            LIFEOS
          </div>

          <div
            style={{
              color: '#e8edf7',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.7,
              fontSize: '16px',
            }}
          >
            {loading
              ? 'LIFEOS is thinking...'
              : reply ||
                'Your AI response will appear here.'}
          </div>
        </section>

        {/* FEATURES */}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '25px',
          }}
        >
          <Feature
            icon="💬"
            title="Ask"
            text="Ask anything"
          />

          <Feature
            icon="📷"
            title="See"
            text="Capture anything"
          />

          <Feature
            icon="📁"
            title="Upload"
            text="Analyze files"
          />

          <Feature
            icon="🧠"
            title="Act"
            text="Get clear next steps"
          />
        </section>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '20px',
        background:
          'rgba(255,255,255,0.04)',
        border:
          '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ fontSize: '25px' }}>
        {icon}
      </div>

      <div
        style={{
          fontWeight: 700,
          marginTop: '10px',
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: '#8e99ad',
          fontSize: '14px',
          marginTop: '5px',
        }}
      >
        {text}
      </div>
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  border: 'none',
  borderRadius: '14px',
  padding: '13px 20px',
  background:
    'linear-gradient(135deg, #62e7ff, #4b9dff)',
  color: '#04101a',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: '14px',
};

const secondaryButton: React.CSSProperties = {
  border:
    '1px solid rgba(255,255,255,0.16)',
  borderRadius: '14px',
  padding: '13px 18px',
  background:
    'rgba(255,255,255,0.06)',
  color: 'white',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: '14px',
};