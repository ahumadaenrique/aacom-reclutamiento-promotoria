export interface CandidateSubmission {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  hasCar: boolean;
  financialBufferMonths: number;
  commissionOnly: boolean;
  salesExperienceYears: number;
  background: string;
  targetUniversity?: string;
  previousIncomeRange: string; // '<15k', '15k-30k', '30k-50k', '50k-80k', '>80k'
  notes?: string;
}

export interface EvaluationResult {
  score: number; // 0 - 100
  status: 'GREEN' | 'YELLOW' | 'RED';
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  manualReviewReason?: string;
  universityTier: 'TIER_1' | 'TIER_2' | 'STANDARD';
  breakdown: {
    financialScore: number;
    mobilityScore: number;
    mindsetScore: number;
    backgroundScore: number;
    incomeScore: number;
  };
  aiRecommendation: string;
}

// Clasificación de Universidades de Prestigio (Tiers)
const TIER_1_UNIVERSITIES = [
  'tec de monterrey', 'itesm', 'itam', 'anahuac', 'anáhuac', 'ibero', 
  'iberoamericana', 'iteso', 'panamericana', 'up', 'udla', 'udlap', 'escuela libre de derecho'
];

const TIER_2_UNIVERSITIES = [
  'unam', 'ipn', 'uam', 'uanl', 'udg', 'udeg', 'tec milenio', 'la salle'
];

export const getUniversityTier = (university?: string): 'TIER_1' | 'TIER_2' | 'STANDARD' => {
  if (!university || university.trim().length < 2) return 'STANDARD';
  const term = university.toLowerCase();
  
  if (TIER_1_UNIVERSITIES.some(u => term.includes(u))) return 'TIER_1';
  if (TIER_2_UNIVERSITIES.some(u => term.includes(u))) return 'TIER_2';
  return 'STANDARD';
};

export const evaluateCandidate = (data: CandidateSubmission): EvaluationResult => {
  let score = 0;
  let isRed = false;
  let isYellowException = false;
  let yellowReason = '';

  const uniTier = getUniversityTier(data.targetUniversity);

  // 1. Filtro de Modelo de Ingresos (Comisionista)
  if (!data.commissionOnly) {
    isRed = true;
    yellowReason += 'Perfil prefiere sueldo fijo. El modelo AACOM es 100% comisiones sin tope. ';
  }

  // 2. Respaldo Financiero (Mínimo 3 meses)
  const financialScore = Math.min(30, (data.financialBufferMonths / 4) * 30);
  if (data.financialBufferMonths < 3) {
    isRed = true;
    yellowReason += `Respaldo financiero de ${data.financialBufferMonths} meses (se recomiendan 3 a 4 meses). `;
  }

  // 3. Evaluador de Ingreso Previo (Sustituye la pregunta directa de contactos HNW)
  let incomeScore = 10;
  const highIncomeRanges = ['30k-50k', '50k-80k', '>80k'];
  const isHighPreviousIncome = highIncomeRanges.includes(data.previousIncomeRange);
  
  if (data.previousIncomeRange === '>80k') incomeScore = 20;
  else if (data.previousIncomeRange === '50k-80k') incomeScore = 18;
  else if (data.previousIncomeRange === '30k-50k') incomeScore = 15;
  else if (data.previousIncomeRange === '15k-30k') incomeScore = 12;

  // 4. Movilidad y Regla de Semáforo Amarillo por Tiers y Alto Ingreso
  let mobilityScore = 0;
  if (data.hasCar) {
    mobilityScore = 25;
  } else {
    // Si NO tiene auto, evaluar Excepción para Semáforo Amarillo:
    // Criterios compensatorios: Universidad Tier 1 / Tier 2 OR Ingreso Previo Alto (> $30k MXN) OR 3+ años en ventas consultivas
    const hasPrestigeUniversity = uniTier === 'TIER_1' || uniTier === 'TIER_2';
    const hasHighExperience = data.salesExperienceYears >= 3;

    if (hasPrestigeUniversity || isHighPreviousIncome || hasHighExperience) {
      isYellowException = true;
      const exceptionTriggers = [];
      if (hasPrestigeUniversity) exceptionTriggers.push(`Universidad de Prestigio (${uniTier === 'TIER_1' ? 'Tier 1' : 'Tier 2'}: ${data.targetUniversity})`);
      if (isHighPreviousIncome) exceptionTriggers.push(`Historial de Ingresos Alto (${data.previousIncomeRange})`);
      if (hasHighExperience) exceptionTriggers.push(`Experiencia Comercial Consolidada (${data.salesExperienceYears} años)`);

      yellowReason = `REVISIÓN MANUAL EXCEPCIONAL (Semáforo Amarillo): El candidato no cuenta con vehículo propio en este momento, pero califica por alto potencial debido a: ${exceptionTriggers.join(', ')}.`;
      mobilityScore = 15;
    } else {
      isRed = true;
      yellowReason += 'Sin vehículo propio y sin factores de excepción (universidad de prestigio o ingresos previos altos). ';
    }
  }

  // 5. Background Profesional Relevante
  let backgroundScore = 15;
  if (data.background) backgroundScore = 25;

  // Cálculo del Score Total (0 - 100)
  score = Math.round(financialScore + mobilityScore + backgroundScore + incomeScore);

  // Determinación del Semáforo
  let status: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
  let reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';

  if (isRed) {
    status = 'RED';
    reviewStatus = 'REJECTED';
    if (!yellowReason) yellowReason = 'No cumple con los requisitos indispensables de autonomía comercial o respaldo financiero.';
  } else if (isYellowException || score < 80) {
    status = 'YELLOW';
    reviewStatus = 'PENDING';
  } else {
    status = 'GREEN';
    reviewStatus = 'APPROVED';
  }

  const aiRecommendation = status === 'GREEN'
    ? `🟢 CANDIDATO IDEAL (Score: ${score}%): Excelente compatibilidad. Posee vehículo, respaldo financiero de ${data.financialBufferMonths} meses, ingresos previos de ${data.previousIncomeRange} e historial en ${data.background}.`
    : status === 'YELLOW'
    ? `🟡 REVISIÓN MANUAL RECOMENDADA (Score: ${score}%): ${yellowReason}`
    : `🔴 CANDIDATO DESCARTADO (Score: ${score}%): ${yellowReason}`;

  return {
    score,
    status,
    reviewStatus,
    manualReviewReason: status === 'YELLOW' ? yellowReason : undefined,
    universityTier: uniTier,
    breakdown: {
      financialScore,
      mobilityScore,
      mindsetScore: data.commissionOnly ? 20 : 0,
      backgroundScore,
      incomeScore,
    },
    aiRecommendation,
  };
};
