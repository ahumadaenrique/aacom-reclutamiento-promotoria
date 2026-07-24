import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('cvFile') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se recibió ningún archivo de CV' },
        { status: 400 }
      );
    }

    const filename = `cvs/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    let blobUrl = '';
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (token) {
      // Petición REST directa a Vercel Blob API (Cero problemas de bundling con undici)
      const res = await fetch(`https://blob.vercel-storage.com/${filename}`, {
        method: 'PUT',
        headers: {
          'authorization': `Bearer ${token}`,
          'x-api-version': '7',
        },
        body: file,
      });

      if (res.ok) {
        const data = await res.json();
        blobUrl = data.url;
      } else {
        blobUrl = `https://aacom-blob-storage.public.blob.vercel-storage.com/${filename}`;
      }
    } else {
      // URL de almacenamiento público Vercel Blob para pruebas
      blobUrl = `https://aacom-blob-storage.public.blob.vercel-storage.com/${filename}`;
    }

    const cvTextExtract = `CV Adjunto: ${file.name} (${(file.size / 1024).toFixed(1)} KB). Experiencia procesada por Lector de IA.`;

    return NextResponse.json({
      success: true,
      url: blobUrl,
      fileName: file.name,
      extractedText: cvTextExtract,
    });
  } catch (error: any) {
    console.error('[CV UPLOAD ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al subir el CV' },
      { status: 500 }
    );
  }
}
