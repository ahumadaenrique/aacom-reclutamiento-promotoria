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
    const { type, config } = body;

    if (type === 'twilio') {
      mockIntegrationsDb.twilio = { ...mockIntegrationsDb.twilio, ...config };
    } else if (type === 'gemini') {
      mockIntegrationsDb.gemini = { ...mockIntegrationsDb.gemini, ...config };
    } else if (type === 'linkedin') {
      mockIntegrationsDb.linkedin = { ...mockIntegrationsDb.linkedin, ...config };
    } else if (type === 'occ') {
      mockIntegrationsDb.occ = { ...mockIntegrationsDb.occ, ...config };
    } else {
      return NextResponse.json({ success: false, error: 'Tipo de integración inválido' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: mockIntegrationsDb,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al guardar configuración' },
      { status: 500 }
    );
  }
}
