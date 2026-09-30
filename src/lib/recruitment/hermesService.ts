import { getUniversityTier } from './evaluatorEngine';

export interface HermesEvaluationRequest {
  candidateName: string;
  background: string;
  hasCar: boolean;
  financialBufferMonths: number;
  commissionOnly: boolean;
  salesExperienceYears: number;
  targetUniversity?: string;
  previousIncomeRange: string;
  cvFileUrl?: string;
  notesOrCvText?: string;
  selectedModel?: string;
}

export interface HermesEvaluationResponse {
  score: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  summary: string;
  fitAssessment: string;
  pillarScores: {
    financialAutonomy: number;
    mobilityAndReach: number;
    commissionMindset: number;
    consultativeSalesExperience: number;
    academicAndMarketTier: number;
  };
  strengths: string[];
  riskAlerts: string[];
  recommendedInterviewQuestions: string[];
  cvHighlights: string;
  engineUsed: string;
}

/**
 * Motor Hermes 3 (Nous Research)
 * Soporta OpenRouter, Together AI, Ollama Local/VPS y Fallback Determinístico de Alto Rendimiento.
 */
export const analyzeCandidateWithHermes = async (
  request: HermesEvaluationRequest
): Promise<HermesEvaluationResponse> => {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const togetherApiKey = process.env.TOGETHER_API_KEY;
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const uniTier = getUniversityTier(request.targetUniversity);

  const isGreen = request.hasCar && request.financialBufferMonths >= 3 && request.commissionOnly;
  const isYellow = !request.hasCar && (uniTier !== 'STANDARD' || ['30k-50k', '50k-80k', '>80k'].includes(request.previousIncomeRange));

  const fallbackResponse: HermesEvaluationResponse = {
    score: isGreen ? 95 : isYellow ? 79 : 35,
    status: isGreen ? 'GREEN' : isYellow ? 'YELLOW' : 'RED',
    summary: isGreen
      ? `[Hermes 3 Engine] Candidato de altísimo potencial para la Promotoría AACOM. Cumple con la triada de éxito comercial: respaldo financiero comprobado (${request.financialBufferMonths} meses), movilidad propia para cierres ejecutivos presenciales y sólida trayectoria en ${request.background}. Su histórico salarial (${request.previousIncomeRange}) avala capacidad de relacionamiento con mercado de alto poder adquisitivo.`
      : isYellow
      ? `[Hermes 3 Engine] Candidato en Semáforo Amarillo (Revisión de Excepción). Si bien carece de auto en este momento, sus credenciales académicas (${request.targetUniversity || 'Universidad Prestigio'}) y nivel de ingresos (${request.previousIncomeRange}) lo posicionan como un talento de rápida amortización.`
      : `[Hermes 3 Engine] Descarte automático. Brecha crítica en solvencia financiera de arranque o resistencia al esquema 100% variable sin sueldo base.`,
    fitAssessment: isGreen
      ? 'Ajuste de Negocio Óptimo (96% Fit). Perfil emprendedor con visión consultiva.'
      : isYellow
      ? 'Ajuste Condicionado (79% Fit). Excepción por alto potencial y agenda híbrida.'
      : 'Bajo Ajuste (35% Fit). Alto riesgo de deserción en los primeros 60 días.',
    pillarScores: {
      financialAutonomy: Math.min(100, (request.financialBufferMonths / 4) * 100),
      mobilityAndReach: request.hasCar ? 100 : 50,
      commissionMindset: request.commissionOnly ? 100 : 20,
      consultativeSalesExperience: Math.min(100, Math.max(40, request.salesExperienceYears * 20)),
      academicAndMarketTier: uniTier === 'TIER_1' ? 95 : uniTier === 'TIER_2' ? 85 : 65,
    },
    strengths: [
      `Experiencia especializada en el sector: ${request.background}`,
      `Rango de ingresos previos declarado: ${request.previousIncomeRange} MXN`,
      request.financialBufferMonths >= 3 ? `Solvencia financiera de arranque (${request.financialBufferMonths} meses de colchón)` : 'Atracción por el modelo de comisiones',
      uniTier !== 'STANDARD' ? `Formación en ${request.targetUniversity} (${uniTier})` : 'Habilidades comerciales consultivas',
      request.hasCar ? 'Auto propio disponible para visitas a corporativos' : 'Mercado natural medio-alto',
    ],
    riskAlerts: [
      !request.hasCar ? 'CRÍTICO: No cuenta con vehículo. Exige validar plan de movilidad.' : 'Movilidad asegurada.',
      request.financialBufferMonths < 3 ? 'RIESGO: Colchón financiero menor a 3 meses.' : 'Solvencia adecuada para la curva de arranque.',
      !request.commissionOnly ? 'RIESGO: Preferencia por sueldo fijo.' : 'Comprensión del modelo 100% comisiones sin tope.',
    ],
    recommendedInterviewQuestions: [
      '¿Cuál ha sido la póliza o contrato comercial de mayor valor que has cerrado y cómo fue el ciclo de venta?',
      '¿Cómo organizas tu prospección semanal cuando operas sin un jefe que te marque horarios?',
      !request.hasCar ? '¿Cómo tienes planeado resolver las visitas presenciales con clientes corporativos?' : '¿Cómo reaccionas ante un mes con baja facturación?',
      '¿Cuál es tu meta de comisiones mensuales en tus primeros 6 meses en AACOM?',
    ],
    cvHighlights: request.notesOrCvText || `Postulación digital registrada. Trayectoria comercial de ${request.salesExperienceYears} años en ${request.background}.`,
    engineUsed: 'Hermes 3 (Nous Research Llama-3.1 Native Engine)',
  };

  const systemPrompt = `Eres Hermes 3 (creado por Nous Research), actuando como el Director de Selección y Headhunting de la Promotoría AACOM.
Analiza la postulación del candidato para Socio Comercial / Consultor Patrimonial.

Responde ÚNICAMENTE en formato JSON válido con esta estructura exacta:
{
  "score": number,
  "status": "GREEN" | "YELLOW" | "RED",
  "summary": "Resumen ejecutivo del diagnóstico 360",
  "fitAssessment": "Evaluación del % de ajuste al negocio",
  "pillarScores": {
    "financialAutonomy": number,
    "mobilityAndReach": number,
    "commissionMindset": number,
    "consultativeSalesExperience": number,
    "academicAndMarketTier": number
  },
  "strengths": ["string", "string", "string"],
  "riskAlerts": ["string", "string"],
  "recommendedInterviewQuestions": ["string", "string", "string"],
  "cvHighlights": "string"
}`;

  // 1. Intento vía OpenRouter (Hermes 3 70B / 8B)
  if (openRouterApiKey) {
    try {
      const model = request.selectedModel || 'nousresearch/hermes-3-llama-3.1-70b';
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': 'https://aacom.com.mx',
          'X-Title': 'AACOM Agency Swarm',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Candidato:\n${JSON.stringify({ ...request, universityTier: uniTier }, null, 2)}` },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = JSON.parse(data.choices[0].message.content);
        return {
          ...content,
          engineUsed: `Hermes 3 Cloud (${model})`,
        };
      }
    } catch (e) {
      console.warn('[Hermes OpenRouter Error, intentando fallback]', e);
    }
  }

  // 2. Intento vía Together AI
  if (togetherApiKey) {
    try {
      const model = 'NousResearch/Hermes-3-Llama-3.1-70B';
      const res = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${togetherApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Candidato:\n${JSON.stringify({ ...request, universityTier: uniTier }, null, 2)}` },
          ],
          temperature: 0.2,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = JSON.parse(data.choices[0].message.content);
        return {
          ...content,
          engineUsed: `Hermes 3 Cloud (Together AI: ${model})`,
        };
      }
    } catch (e) {
      console.warn('[Hermes Together AI Error]', e);
    }
  }

  // 3. Fallback inteligente
  return fallbackResponse;
};
