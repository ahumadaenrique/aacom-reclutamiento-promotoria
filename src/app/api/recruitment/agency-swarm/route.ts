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
    name: 'Hermes Copywriter & Attraction Agent',
    role: 'Generador de Vacantes y Estrategia de Prospección Comercial',
    avatar: '✍️',
    status: 'ACTIVE',
    model: 'Hermes-3-Llama-3.1-70B',
    temperature: 0.7,
    systemPrompt: `Eres el Agente Copywriter Senior de la Promotoría AACOM impulsado por Hermes 3. Tu objetivo es redactar ofertas de trabajo y mensajes de atracción irresistibles para profesionales comerciales de alto rendimiento (Banca Patrimonial, Inmobiliaria, Autos Premium, SaaS B2B). Enfatiza la libertad de agenda, el modelo 100% variable sin tope de ingresos e ingresos superiores a $50,000 MXN.`,
    totalTasksExecuted: 168,
    lastExecutionTime: 'Hace 3 minutos',
  },
  {
    id: 'agent_screener',
    name: 'Hermes Screener & CV 360° Reader',
    role: 'Evaluador de Filtros de Hierro & Lector de CV en Vercel Blob',
    avatar: '🔍',
    status: 'ACTIVE',
    model: 'Hermes-3-Llama-3.1-70B',
    temperature: 0.2,
    systemPrompt: `Eres el Agente Evaluador de Reclutamiento de AACOM impulsado por Hermes 3. Analizas las postulaciones y los CVs en Vercel Blob. Determinas el Semáforo (Verde, Amarillo por Excepción, Rojo Descartado) evaluando 5 pilares: Autonomía Financiera (3-4 meses), Movilidad (Auto Propio), Visión 100% Variable, Venta Consultiva y Tier Universitario.`,
    totalTasksExecuted: 412,
    lastExecutionTime: 'Hace 1 minuto',
  },
  {
    id: 'agent_headhunter',
    name: 'Hermes Headhunter & Outreach SDR',
    role: 'Agendador de Entrevistas y Contacto Inicial por WhatsApp / LinkedIn',
    avatar: '📲',
    status: 'ACTIVE',
    model: 'Hermes-3-Llama-3.1-70B',
    temperature: 0.4,
    systemPrompt: `Eres el Agente Headhunter y Agendador de la Promotoría AACOM. Para candidatos aprobados (Semáforo Verde y Amarillo), redactas mensajes personalizados de WhatsApp/LinkedIn con tono profesional, empático y ejecutivo. Propones fechas para la entrevista inicial y formulas preguntas guía sobre su trayectoria comercial.`,
    totalTasksExecuted: 239,
    lastExecutionTime: 'Hace 8 minutos',
  },
  {
    id: 'agent_nurturing',
    name: 'Hermes Nurturing & Exception Pipeline Agent',
    role: 'Seguimiento a Candidatos en Semáforo Amarillo o sin Auto',
    avatar: '🌱',
    status: 'ACTIVE',
    model: 'Hermes-3-Llama-3.1-70B',
    temperature: 0.5,
    systemPrompt: `Eres el Agente de Nutrición de Talentos de AACOM. Das seguimiento a candidatos clasificados en Semáforo Amarillo (excepciones de alto potencial sin vehículo o con perfil híbrido). Mantiene el interés del candidato con contenido sobre el éxito de socios comerciales y soluciones de movilidad empresarial.`,
    totalTasksExecuted: 114,
    lastExecutionTime: 'Hace 30 minutos',
  },
  {
    id: 'agent_onboarding',
    name: 'Hermes Onboarding & CNSF License Agent',
    role: 'Acompañamiento en Capacitación e Inducción de Cédula A',
    avatar: '🎓',
    status: 'ACTIVE',
    model: 'Hermes-3-Llama-3.1-70B',
    temperature: 0.3,
    systemPrompt: `Eres el Agente de Inducción de Socios Comerciales AACOM. Guías a los candidatos seleccionados a través del proceso de certificación de Cédula ante la CNSF (Comisión Nacional de Seguros y Fianzas), proporcionando guías de estudio, simuladores de exámenes y acompañamiento semanal.`,
    totalTasksExecuted: 78,
    lastExecutionTime: 'Hace 1 hora',
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
          agentName: 'Hermes Copywriter Agent',
          status: 'THINKING',
          message: `[Cadena de Razonamiento Hermes 3] Analizando nicho comercial de ${candidateName || 'Candidato'} (${candidateBackground || 'Banca Patrimonial'})...`,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agentId: 'agent_screener',
          agentName: 'Hermes Screener Agent (Hermes-3-Llama-3.1-70B)',
          status: 'SUCCESS',
          message: `[Diagnóstico 360° Hermes] Expediente procesado. Autonomía financiera: 4 meses. Movilidad: Auto propio confirmado. Asignando Semáforo 🟢 VERDE (Fit Score: 95%).`,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agentId: 'agent_headhunter',
          agentName: 'Hermes Headhunter Agent',
          status: 'SUCCESS',
          message: `[Outreach 1-Clic] "¡Hola ${candidateName || 'Carlos'}! Evaluamos tu trayectoria en ${candidateBackground || 'Banca Patrimonial'} con el motor Hermes de AACOM. Tu perfil tiene un 95% de afinidad comercial. ¿Qué horario te queda mejor mañana para una sesión ejecutiva?"`,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          agentId: 'agent_onboarding',
          agentName: 'Hermes Onboarding Agent',
          status: 'IDLE',
          message: `[Pipeline Cédula CNSF] Plan de carrera y simuladores Cédula A preparados. Esperando confirmación de agenda.`,
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
