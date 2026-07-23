import { NextResponse } from 'next/server';
import { mockIntegrationsDb } from '@/lib/recruitment/mockDb';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockIntegrationsDb,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.twilio) {
      mockIntegrationsDb.twilio = {
        ...mockIntegrationsDb.twilio,
        ...body.twilio,
      };
    }

    if (body.gemini) {
      mockIntegrationsDb.gemini = {
        ...mockIntegrationsDb.gemini,
        ...body.gemini,
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Credenciales e integraciones (Twilio & Gemini) actualizadas exitosamente.',
      data: mockIntegrationsDb,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al guardar credenciales' },
      { status: 500 }
    );
  }
}
