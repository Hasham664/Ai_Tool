import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDFs allowed' },
        { status: 400 }
      );
    }

    // Convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use pdf-extraction instead of pdf-parse
    const { default: pdfExtract } = await import('pdf-extraction');
    const data = await pdfExtract(buffer);

    // pdf-extraction returns an object with `text` containing extracted text
    const text = data?.text || '';

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error('parse-pdf handler error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to parse PDF' },
      { status: 500 }
    );
  }
}
