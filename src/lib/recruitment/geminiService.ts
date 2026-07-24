import { getUniversityTier } from './evaluatorEngine';

export interface GeminiEvaluationRequest {
  candidateName: string;
  background: string;
  hasCar: boolean;
  financialBufferMonths: number;
  commissionOnly: boolean;
  salesExperienceYears: number;
  targetUniversity?: string;
  previousIncomeRange: string;
  notesOrCvText?: string;
}

export interface GeminiEvaluationResponse {
  score: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  summary: string;
  strengths: string[];
  riskAlerts: string[];
  recommendedInterviewQuestions: string[];
}

export const analyzeCandidateWithGemini = async (
  request: GeminiEvaluationRequest
): Promise<GeminiEvaluationResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;
  const uniTier = getUniversityTier(request.targetUniversity);

  const isGreen = request.hasCar && request.financialBufferMonths >= 3 && request.commissionOnly;
  const isYellow = !request.hasCar && (uniTier !== 'STANDARD' || ['30k-50k', '50k-80k', '>80k'].includes(request.previousIncomeRange));

  const defaultSummary = isGreen
    ? `Candidato de alto impacto para la Promotoría AACOM. Demuestra sólida capacidad financiera (${request.financialBufferMonths} meses), movilidad y perfil comisionista en la industria de ${request.background}.`
    : isYellow
    ? `Candidato calificado para REVISIÓN MANUAL EXCEPCIONAL (Semáforo Amarillo). A pesar de no contar con automóvil en este momento, resalta por su nivel de ingresos previos (${request.previousIncomeRange}) y formación universitaria (${request.targetUniversity || 'Enfoque comercial'}).`
    : `Candidato descartado por no cumplir con los requisitos mínimos de autonomía comercial o respaldo financiero.`;

  const fallbackResponse: GeminiEvaluationResponse = {
    score: isGreen ? 92 : isYellow ? 76 : 38,
    status: isGreen ? 'GREEN' : isYellow ? 'YELLOW' : 'RED',
    summary: defaultSummary,
    strengths: [
      `Trayectoria en la industria de ${request.background}`,
      `Nivel de ingresos previos: ${request.previousIncomeRange}`,
      uniTier !== 'STANDARD' ? `Egresado de Universidad de Prestigio (${request.targetUniversity})` : 'Disposición al esquema de altas comisiones',
    ],
    riskAlerts: [
      !request.hasCar ? 'No cuenta con automóvil actualmente (Requiere estrategia de movilidad)' : 'Movilidad completa con vehículo propio',
      request.financialBufferMonths < 3 ? 'Respaldo financiero menor a 3 meses' : 'Finanzas personales preparadas para el arranque',
    ],
    recommendedInterviewQuestions: [
      '¿Cómo fue la transición en tus empleos anteriores hacia la venta consultiva de mayor ticket?',
      '¿Cuál ha sido la estrategia que mejor te ha funcionado para generar prospección propia?',
      '¿Cómo organizas tu agenda cuando no tienes supervisión directa de un jefe?',
    ],
  };

  if (!apiKey || apiKey.includes('mock')) {
    return fallbackResponse;
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `
Eres el Director de Reclutamiento y Selección para la Promotoría AACOM.
Evalúa a los candidatos buscando resiliencia, autonomía financiera y perfil comercial de alto valor.

Reglas clave:
- Candidato Ideal (🟢 VERDE): Auto propio + 3-4 meses de respaldo financiero + 100% comisiones.
- Excepción (🟡 AMARILLO): Si NO tiene auto, pero posee un historial de ingresos previos de más de $30,000 MXN, egresó de una Universidad de Prestigio (Tec, ITAM, Ibero, Anáhuac, ITESO, UP, UNAM, etc.) o tiene 3+ años en ventas, asígnalo como AMARILLO para revisión manual.

Genera la respuesta estrictamente en JSON:
{
  "score": número (0-100),
  "status": "GREEN" | "YELLOW" | "RED",
  "summary": "Resumen cualitativo riguroso y profesional del perfil",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "riskAlerts": ["riesgo 1", "riesgo 2"],
  "recommendedInterviewQuestions": ["pregunta 1", "pregunta 2"]
}
`;

    const promptText = `${systemPrompt}\n\nDatos del Candidato:\n${JSON.stringify({ ...request, universityTier: uniTier }, null, 2)}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) return fallbackResponse;

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(rawText);

    return {
      score: parsed.score || fallbackResponse.score,
      status: parsed.status || fallbackResponse.status,
      summary: parsed.summary || fallbackResponse.summary,
      strengths: parsed.strengths || fallbackResponse.strengths,
      riskAlerts: parsed.riskAlerts || fallbackResponse.riskAlerts,
      recommendedInterviewQuestions: parsed.recommendedInterviewQuestions || fallbackResponse.recommendedInterviewQuestions,
    };
  } catch (err) {
    console.error('[GEMINI AI SERVICE ERROR]', err);
    return fallbackResponse;
  }
};
