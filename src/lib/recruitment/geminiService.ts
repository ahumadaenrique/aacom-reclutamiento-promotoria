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
  cvFileUrl?: string;
  notesOrCvText?: string;
}

export interface GeminiEvaluationResponse {
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
}

export const analyzeCandidateWithGemini = async (
  request: GeminiEvaluationRequest
): Promise<GeminiEvaluationResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;
  const uniTier = getUniversityTier(request.targetUniversity);

  const isGreen = request.hasCar && request.financialBufferMonths >= 3 && request.commissionOnly;
  const isYellow = !request.hasCar && (uniTier !== 'STANDARD' || ['30k-50k', '50k-80k', '>80k'].includes(request.previousIncomeRange));

  const fallbackResponse: GeminiEvaluationResponse = {
    score: isGreen ? 94 : isYellow ? 78 : 38,
    status: isGreen ? 'GREEN' : isYellow ? 'YELLOW' : 'RED',
    summary: isGreen
      ? `Candidato de alto rendimiento para la Promotoría AACOM. Presenta una combinación idónea de autonomía financiera (${request.financialBufferMonths} meses de colchón), vehículo propio para cierres corporativos presenciales e historial consolidado en ${request.background}. Su nivel de ingresos prevíos (${request.previousIncomeRange}) confirma capacidad para negociar pólizas y tickets de alto valor.`
      : isYellow
      ? `Candidato calificado para REVISIÓN MANUAL EXCEPCIONAL (Semáforo Amarillo). Aunque no cuenta con automóvil propio en este momento, demuestra un alto potencial de mercado respaldado por su historial de ingresos (${request.previousIncomeRange}) y formación profesional en ${request.targetUniversity || 'Universidad de Prestigio (Tier 2: La Salle / Tec Milenio / UVM)'}.`
      : `Candidato no recomendado. Presenta brechas en el respaldo financiero inicial (${request.financialBufferMonths} meses) o preferencia por esquemas de sueldo fijo, lo cual contraviene la visión de negocio 100% comisionista de la Promotoría AACOM.`,
    fitAssessment: isGreen
      ? 'Ajuste de Negocio Excelente (95% Fit). Perfil altamente automotivado con visión de empresario, acostumbrado a gestionar su propio embudo de ventas sin requerir micromanagement.'
      : isYellow
      ? 'Ajuste por Excepción (78% Fit). Requiere definir estrategia de movilidad inicial, pero posee el perfil socioeconómico y el nivel comercial para generar ventas de alto ticket.'
      : 'Bajo Ajuste (38% Fit). Riesgo de deserción en los primeros 60 días debido a falta de respaldo económico o aversión al riesgo comercial.',
    pillarScores: {
      financialAutonomy: Math.min(100, (request.financialBufferMonths / 4) * 100),
      mobilityAndReach: request.hasCar ? 100 : 50,
      commissionMindset: request.commissionOnly ? 100 : 20,
      consultativeSalesExperience: Math.min(100, Math.max(40, request.salesExperienceYears * 20)),
      academicAndMarketTier: uniTier === 'TIER_1' ? 95 : uniTier === 'TIER_2' ? 85 : 65,
    },
    strengths: [
      `Experiencia comercial directa en la industria de ${request.background}`,
      `Nivel de ingresos previos registrado: ${request.previousIncomeRange} MXN`,
      request.financialBufferMonths >= 3 ? `Respaldo financiero sólido (${request.financialBufferMonths} meses de autonomía)` : 'Interés manifestado en el modelo comisionista',
      uniTier !== 'STANDARD' ? `Egresado de Universidad de Prestigio (${request.targetUniversity} - ${uniTier === 'TIER_1' ? 'Tier 1' : 'Tier 2'})` : 'Habilidad en ventas consultivas',
      request.hasCar ? 'Movilidad inmediata con vehículo propio para visitas a empresas' : 'Mercado objetivo de nivel medio-alto',
    ],
    riskAlerts: [
      !request.hasCar ? 'CRÍTICO: No posee automóvil actualmente. Se debe validar cómo realizará las visitas presenciales a clientes empresariales.' : 'Movilidad asegurada con auto propio.',
      request.financialBufferMonths < 3 ? 'RIESGO FINANCIERO: Menos de 3 meses de colchón. Podría presionar por resultados inmediatos antes de consolidar la cartera.' : 'Respaldo financiero adecuado para soportar la curva de arranque.',
      !request.commissionOnly ? 'RIESGO DE MENTALIDAD: Muestra inclinación por sueldo base. Requiere sensibilización sobre el modelo 100% variable.' : 'Comprensión clara del modelo comisionista sin tope.',
    ],
    recommendedInterviewQuestions: [
      '¿Cuál ha sido la venta de mayor ticket o la póliza/contrato más complejo que has cerrado y cuál fue tu proceso de prospección?',
      'En tu experiencia previa, ¿cómo estructurabas tu semana laboral entre prospección en frío, citas presenciales y seguimiento?',
      !request.hasCar ? 'Al no contar con vehículo en este momento, ¿cómo planeas resolver el traslado para citas corporativas en zonas empresariales?' : '¿Cómo manejas los periodos de 3 a 4 semanas sin cierres de ventas sin perder la disciplina operativa?',
      '¿Qué esperas lograr en términos de facturación mensual en tus primeros 6 meses en la Promotoría AACOM?',
    ],
    cvHighlights: request.notesOrCvText || `Currículum recibido en formato digital. Experiencia previa en ${request.background} con ${request.salesExperienceYears} años de trayectoria comercial. Nivel de ingresos declarado: ${request.previousIncomeRange}.`,
  };

  if (!apiKey || apiKey.includes('mock')) {
    return fallbackResponse;
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `
Eres el Director de Reclutamiento y Selección de Socios Comerciales para la Promotoría AACOM.
Tu tarea es realizar un Diagnóstico Ejecutivo 360° del candidato basándote en su CV y datos de postulación.

Evalúa los siguientes 5 Pilares (Score 0-100 para cada uno):
1. financialAutonomy: Autonomía financiera (colchón 3-4 meses).
2. mobilityAndReach: Movilidad y alcance presencial (auto propio).
3. commissionMindset: Perfil comisionista y aversión a sueldo fijo.
4. consultativeSalesExperience: Experiencia en venta consultiva / ticket alto.
5. academicAndMarketTier: Prestigio académico (Tier 1: Tec/ITAM/Anáhuac/Ibero/ITESO/UP; Tier 2: La Salle/Tec Milenio/UVM) e ingresos previos.

Responde estrictamente en JSON con la siguiente estructura:
{
  "score": número (0-100),
  "status": "GREEN" | "YELLOW" | "RED",
  "summary": "Resumen ejecutivo amplio y profesional de 3 a 4 párrafos cortos",
  "fitAssessment": "Evaluación de ajuste de negocio (Fit %)",
  "pillarScores": {
    "financialAutonomy": número,
    "mobilityAndReach": número,
    "commissionMindset": número,
    "consultativeSalesExperience": número,
    "academicAndMarketTier": número
  },
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3", "fortaleza 4"],
  "riskAlerts": ["alerta de riesgo 1", "alerta de riesgo 2", "alerta de riesgo 3"],
  "recommendedInterviewQuestions": ["pregunta 1", "pregunta 2", "pregunta 3", "pregunta 4"],
  "cvHighlights": "Extracto de los puntos más relevantes descubiertos en el CV"
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
      fitAssessment: parsed.fitAssessment || fallbackResponse.fitAssessment,
      pillarScores: parsed.pillarScores || fallbackResponse.pillarScores,
      strengths: parsed.strengths || fallbackResponse.strengths,
      riskAlerts: parsed.riskAlerts || fallbackResponse.riskAlerts,
      recommendedInterviewQuestions: parsed.recommendedInterviewQuestions || fallbackResponse.recommendedInterviewQuestions,
      cvHighlights: parsed.cvHighlights || fallbackResponse.cvHighlights,
    };
  } catch (err) {
    console.error('[GEMINI AI SERVICE ERROR]', err);
    return fallbackResponse;
  }
};
