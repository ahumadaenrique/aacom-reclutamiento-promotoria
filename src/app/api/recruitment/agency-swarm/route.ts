import { NextResponse } from 'next/server';

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'ACTIVE' | 'RUNNING' | 'IDLE';
  model: string;
  temperature: number;
  systemPrompt: string;
  totalTasksExecuted: number;
  lastExecutionTime?: string;
}

let initialAgents: AgentConfig[] = [
  {
    id: 'agent_copywriter',
    name: 'Copywriter & Attraction Agent',
    role: 'Generador de Vacantes y Estrategia de Prospección Comercial',
    avatar: '✍️',
    status: 'ACTIVE',
    model: 'gemini-1.5-flash-latest',
    temperature: 0.7,
    systemPrompt: `Eres el Agente Copywriter Senior de la Promotoría AACOM. Tu objetivo es redactar ofertas de trabajo y mensajes de atracción irresistibles para profesionales comerciales de alto rendimiento (Banca Patrimonial, Inmobiliaria, Autos Premium, SaaS B2B). Enfatiza la libertad de agenda, el modelo 100% variable sin tope de ingresos e ingresos superiores a $50,000 MXN.`,
    totalTasksExecuted: 142,
    lastExecutionTime: 'Hace 5 minutos',
  },
  {
    id: 'agent_screener',
    name: 'Screener & CV 360° Reader',
    role: 'Evaluador de Filtros de Hierro & Lector de CV en Vercel Blob',
    avatar: '🔍',
    status: 'ACTIVE',
    model: 'gemini-1.5-flash-latest',
    temperature: 0.2,
    systemPrompt: `Eres el Agente Evaluador de Reclutamiento de AACOM. Analizas las postulaciones y los CVs en Vercel Blob. Determinas el Semáforo (Verde, Amarillo por Excepción, Rojo Descartado) evaluando 5 pilares: Autonomía Financiera (3-4 meses), Movilidad (Auto Propio), Visión 100% Variable, Venta Consultiva y Tier Universitario.`,
    totalTasksExecuted: 389,
    lastExecutionTime: 'Hace 2 minutos',
  },
  {
    id: 'agent_headhunter',
    name: 'Headhunter & WhatsApp Scheduler',
    role: 'Agendador de Entrevistas y Contacto Inicial por WhatsApp',
    avatar: '📲',
    status: 'ACTIVE',
    model: 'gemini-1.5-flash-latest',
    temperature: 0.4,
    systemPrompt: `Eres el Agente Entrevistador y Agendador de la Promotoría AACOM. Para candidatos aprobados (Semáforo Verde y Amarillo), redactas mensajes personalizados de WhatsApp con tono profesional, empático y ejecutivo. Propones fechas para la entrevista inicial y formulas preguntas guía sobre su trayectoria comercial.`,
    totalTasksExecuted: 215,
    lastExecutionTime: 'Hace 12 minutos',
  },
  {
    id: 'agent_nurturing',
    name: 'Nurturing & Exception Pipeline Agent',
    role: 'Seguimiento a Candidatos en Semáforo Amarillo o sin Auto',
    avatar: '🌱',
    status: 'ACTIVE',
    model: 'gemini-1.5-flash-latest',
    temperature: 0.5,
    systemPrompt: `Eres el Agente de Nutrición de Talentos de AACOM. Das seguimiento a candidatos clasificados en Semáforo Amarillo (excepciones de alto potencial sin vehículo o con perfil híbrido). Mantiene el interés del candidato con contenido sobre el éxito de socios comerciales y soluciones de movilidad empresarial.`,
    totalTasksExecuted: 98,
    lastExecutionTime: 'Hace 45 minutos',
  },
  {
    id: 'agent_onboarding',
    name: 'Onboarding & CNSF License Agent',
    role: 'Acompañamiento en Capacitación e Inducción de Cédula',
    avatar: '🎓',
    status: 'ACTIVE',
    model: 'gemini-1.5-flash-latest',
    temperature: 0.3,
    systemPrompt: `Eres el Agente de Inducción de Socios Comerciales AACOM. Guías a los candidatos seleccionados a través del proceso de certificación de Cédula ante la CNSF (Comisión Nacional de Seguros y Fianzas), proporcionando guías de estudio, simuladores de exámenes y acompañamiento semanal.`,
    totalTasksExecuted: 64,
    lastExecutionTime: 'Hace 2 horas',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    agents: initialAgents,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { candidateName, candidateBackground, action } = body;

    if (action === 'RUN_SWARM_WORKFLOW') {
      const logs = [
        {
          timestamp: new Date().toLocaleTimeString(),
          agentId: 'agent_copywriter',
          agentName: 'Copywriter Agent',
          status: 'THINKING',
          message: `[Cadena de Pensamiento] Analizando nicho de origen de ${candidateName || 'Candidato'} (${candidateBackground || 'Banca Patrimonial'})...`,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agentId: 'agent_screener',
          agentName: 'Screener CV Agent (gemini-1.5-flash-latest)',
          status: 'SUCCESS',
          message: `[Lector de CV Vercel Blob] Documento auditado. Respaldo financiero: 4 meses. Movilidad: Auto propio disponible. Asignando Semáforo 🟢 VERDE (Score: 94%).`,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agentId: 'agent_headhunter',
          agentName: 'WhatsApp Scheduler Agent',
          status: 'SUCCESS',
          message: `[Mensaje Generado] "¡Hola ${candidateName || 'Carlos'}! Evaluamos tu trayectoria en ${candidateBackground || 'Banca Patrimonial'} y tu perfil es excelente para Socio Comercial AACOM. ¿Tienes disponibilidad mañana a las 11:00 AM para nuestra sesión previa?"`,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agentId: 'agent_onboarding',
          agentName: 'Onboarding Agent',
          status: 'IDLE',
          message: `[En Espera] Ruta de inducción a Cédula CNSF preparada. Esperando confirmación de la entrevista.`,
        },
      ];

      return NextResponse.json({
        success: true,
        workflowStatus: 'COMPLETED',
        logs,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
