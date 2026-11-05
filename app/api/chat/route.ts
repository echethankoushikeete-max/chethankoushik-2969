
import { NextResponse } from 'next/server';

const N8N_WEBHOOK =
  'https://lifeos-ai1.app.n8n.cloud/webhook/lifeos-ai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const message = formData.get('message');
    const file = formData.get('file');

    if (!message && !file) {
      return NextResponse.json(
        { error: 'Please enter a message or upload a file.' },
        { status: 400 }
      );
    }

    let fileData = null;

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: buffer.toString('base64'),
      };
    }

    const n8nResponse = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message || '',
        file: fileData,
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(
        `n8n returned ${n8nResponse.status}`
      );
    }

    const data = await n8nResponse.json();

    const result = Array.isArray(data) ? data[0] : data;

    const reply =
      result?.output ??
      result?.response ??
      result?.text ??
      result?.reply ??
      result?.message ??
      'I received your request, but no response was returned.';

    return NextResponse.json({
      reply,
      success: true,
    });
  } catch (error) {
    console.error('LIFEOS API ERROR:', error);

    return NextResponse.json(
      {
        error:
          'LIFEOS could not connect to the AI. Please try again.',
      },
      { status: 500 }
    );
  }
}