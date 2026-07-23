import { NextResponse } from 'next/server';

const mockAIRulesDb = {
  settings: {
    systemPrompt: `Eres el Evaluador Inteligente de Socios Comerciales para AACOM.
Evalúa a los candidatos buscando autonomía financiera (colchón 3-4 meses), auto propio para cierres empresariales y visión 100% comisionista.
REGLA DE AMARILLO POR EXCEPCIÓN: Si el candidato NO tiene auto pero cuenta con acceso a Mercado Alto (HNW), egresó de Universidad de Prestigio o tiene 3+ años en ventas consultivas, marca Semáforo AMARILLO para revisión manual.`,
    temperature: 0.2,
    greenThreshold: 80.0,
    yellowThreshold: 60.0,
    modelName: 'gemini-1.5-flash',
  },
  rules: [
    {
      id: 'rule_01',
      title: 'Movilidad Independiente (Auto Propio)',
      description: 'Disponibilidad de automóvil propio para visitas de alto valor.',
      weight: 25,
      isMandatory: true,
      category: 'MANDATORY',
      isActive: true,
    },
    {
      id: 'rule_02',
      title: 'Respaldo Financiero (3-4 meses)',
      description: 'Colchón económico para la curva de arranque.',
      weight: 30,
      isMandatory: true,
      category: 'MANDATORY',
      isActive: true,
    },
    {
      id: 'rule_03',
      title: 'Aversión al Sueldo Fijo (100% Comisiones)',
      description: 'Preferencia por ingresos variables sin tope.',
      weight: 20,
      isMandatory: true,
      category: 'MANDATORY',
      isActive: true,
    },
    {
      id: 'rule_04',
      title: 'Excepción Mercado Alto / Universidad de Prestigio',
      description: 'Activa semáforo amarillo si falta auto pero sobra capital social.',
      weight: 20,
      isMandatory: false,
      category: 'EXCEPTION',
      isActive: true,
    },
  ],
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockAIRulesDb,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.settings) {
      mockAIRulesDb.settings = {
        ...mockAIRulesDb.settings,
        ...body.settings,
      };
    }

    if (body.rules) {
      mockAIRulesDb.rules = body.rules;
    }

    return NextResponse.json({
      success: true,
      message: 'Cerebro de IA actualizado correctamente. Las reglas se aplicarán a todas las nuevas evaluaciones.',
      data: mockAIRulesDb,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar reglas de IA' },
      { status: 500 }
    );
  }
}
