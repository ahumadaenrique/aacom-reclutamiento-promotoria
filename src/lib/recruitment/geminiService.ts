export interface GeminiEvaluationRequest {
  candidateName: string;
  background: string;
  hasCar: boolean;
  financialBufferMonths: number;
  commissionOnly: boolean;
  salesExperienceYears: number;
  targetUniversity?: string;
  highNetWorthAccess: boolean;
  notesOrCvText?: string;
  customSystemPrompt?: string;
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

  const systemPrompt = request.customSystemPrompt || `
Eres el Director de Reclutamiento y Selección para la Promotoría AACOM. 
Tu misión es evaluar candidatos para el rol de "Socio Comercial Ideal (AACOM)".
Criterios Innegociables (Filtros de hierro):
1. Respaldo Financiero (Mínimo 3 a 4 meses).
2. Auto propio para visitas corporativas y de alto valor.
3. Aversión al sueldo fijo / Visión 100% comisionista sin tope.
REGLA DE EXCEPCIÓN (SEMÁFORO AMARILLO):
Si el candidato NO tiene auto propio, pero posee un mercado de alto valor (contactos HNW) O egresó de una universidad de prestigio O tiene 3+ años en ventas consultivas, asígnalo como SEMÁFORO AMARILLO (Revisión Manual Excepcional).

Analiza el perfil y responde en formato JSON estricto con los siguientes campos:
{
  "score": número del 0 al 100,
  "status": "GREEN", "YELLOW" o "RED",
  "summary": "Resumen ejecutivo del perfil",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "riskAlerts": ["riesgo 1", "riesgo 2"],
  "recommendedInterviewQuestions": ["pregunta 1", "pregunta 2"]
}
`;

  // Fallback si no hay clave de API configurada
  if (!apiKey || apiKey.includes('mock')) {
    const isGreen = request.hasCar && request.financialBufferMonths >= 3 && request.commissionOnly;
    const isYellow = !request.hasCar && (request.highNetWorthAccess || Boolean(request.targetUniversity));

    return {
      score: isGreen ? 92 : isYellow ? 74 : 35,
      status: isGreen ? 'GREEN' : isYellow ? 'YELLOW' : 'RED',
      summary: isGreen
        ? 'El candidato cumple al 100% el perfil de Socio Comercial AACOM. Posee alta capacidad financiera, movilidad y enfoque comisionista.'
        : isYellow
        ? 'Candidato asignado a Semáforo Amarillo por Excepción. Llama la atención por su acceso a mercado/prestigio a pesar de no contar con auto actualmente.'
        : 'Candidato descartado por no cumplir con el perfil mínimo de autonomía comercial o respaldo financiero.',
      strengths: [
        `Fuerza en background: ${request.background}`,
        request.highNetWorthAccess ? 'Red de contactos de alto valor (HNW)' : 'Experiencia comercial directa',
        request.commissionOnly ? 'Mentalidad 100% comisionista sin tope' : 'Disposición al trabajo',
      ],
      riskAlerts: [
        !request.hasCar ? 'No cuenta con vehículo propio (Requiere validación de movilidad)' : 'Sin alertas de movilidad',
        request.financialBufferMonths < 3 ? 'Respaldo financiero menor a 3 meses' : 'Finanzas personales sólidas',
      ],
      recommendedInterviewQuestions: [
        '¿Cómo planeas estructurar tu prospección en los primeros 30 días?',
        '¿Cuál ha sido tu venta consultiva de mayor ticket y cómo la cerraste?',
        '¿Cómo manejas un periodo de 3 semanas sin cierres de pólizas?',
      ],
    };
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const promptText = `${systemPrompt}\n\nDatos del Candidato:\n${JSON.stringify(request, null, 2)}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en Gemini API status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(rawText);

    return {
      score: parsed.score || 70,
      status: parsed.status || 'YELLOW',
      summary: parsed.summary || 'Evaluación procesada con Gemini AI.',
      strengths: parsed.strengths || [],
      riskAlerts: parsed.riskAlerts || [],
      recommendedInterviewQuestions: parsed.recommendedInterviewQuestions || [],
    };
  } catch (err: any) {
    console.error('[GEMINI API ERROR]', err);
    return {
      score: 70,
      status: 'YELLOW',
      summary: `Evaluación procesada por motor estándar debido a un error temporal en la API de Gemini: ${err.message}`,
      strengths: ['Experiencia evaluada por sistema'],
      riskAlerts: ['Revisión manual sugerida'],
      recommendedInterviewQuestions: ['Indagar sobre experiencia previa en ventas consultivas'],
    };
  }
};
