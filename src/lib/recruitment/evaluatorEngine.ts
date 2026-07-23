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
  highNetWorthAccess: boolean;
  notes?: string;
}

export interface EvaluationResult {
  score: number; // 0 - 100
  status: 'GREEN' | 'YELLOW' | 'RED';
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  manualReviewReason?: string;
  breakdown: {
    financialScore: number;
    mobilityScore: number;
    mindsetScore: number;
    backgroundScore: number;
    capitalSocialScore: number;
  };
  aiRecommendation: string;
}

export const evaluateCandidate = (data: CandidateSubmission): EvaluationResult => {
  let score = 0;
  let isRed = false;
  let isYellowException = false;
  let yellowReason = '';

  // 1. Filtro Innegociable: Aversión al sueldo fijo (Debe aceptar 100% variable)
  if (!data.commissionOnly) {
    isRed = true;
    yellowReason += 'Buscando sueldo fijo. El modelo AACOM requiere visión 100% comisionista. ';
  }

  // 2. Filtro Innegociable: Respaldo financiero (Mínimo 3 meses)
  const financialScore = Math.min(30, (data.financialBufferMonths / 4) * 30);
  if (data.financialBufferMonths < 3) {
    isRed = true;
    yellowReason += `Respaldo financiero insuficiente (${data.financialBufferMonths} meses vs 3-4 requeridos). `;
  }

  // 3. Movilidad y la Regla Excepcional del Semáforo Amarillo
  let mobilityScore = 0;
  if (data.hasCar) {
    mobilityScore = 25;
  } else {
    // Evaluación de Excepción para Semáforo Amarillo:
    // No tiene auto, PERO tiene mercado alto (HNW) O viene de universidad de prestigio O alta experiencia en ventas consultivas (3+ años)
    const isPrestigeUniversity = Boolean(
      data.targetUniversity && data.targetUniversity.trim().length > 2
    );
    const hasHighValueMarket = data.highNetWorthAccess;
    const hasHighExperience = data.salesExperienceYears >= 3;

    if (hasHighValueMarket || isPrestigeUniversity || hasHighExperience) {
      isYellowException = true;
      const exceptionTriggers = [];
      if (hasHighValueMarket) exceptionTriggers.push('Acceso a Mercado Alto / Contactos de Alto Valor');
      if (isPrestigeUniversity) exceptionTriggers.push(`Universidad de Prestigio (${data.targetUniversity})`);
      if (hasHighExperience) exceptionTriggers.push(`Experiencia Consolidada (${data.salesExperienceYears} años)`);

      yellowReason = `REVISIÓN MANUAL RECOMENDADA: El candidato no tiene auto propio actualmente, pero califica por EXCEPCIÓN debido a: ${exceptionTriggers.join(', ')}.`;
      mobilityScore = 15; // Puntaje parcial por potencial
    } else {
      isRed = true;
      yellowReason += 'Sin vehículo propio y sin factores compensatorios de mercado alto/red de contactos. ';
    }
  }

  // 4. Background profesional relevante (Inmobiliario, Banca, Autos Premium, Tech B2B)
  let backgroundScore = 15;
  const relevantBackgrounds = ['Inmobiliaria', 'Banca', 'Autos Premium', 'Tech B2B'];
  if (relevantBackgrounds.includes(data.background)) {
    backgroundScore = 25;
  }

  // 5. Capital Social / Red de Contactos
  let capitalSocialScore = 10;
  if (data.highNetWorthAccess) {
    capitalSocialScore = 20;
  }

  // Cálculo de Score Total (0 - 100)
  score = Math.round(financialScore + mobilityScore + backgroundScore + capitalSocialScore);

  // Determinación final del Semáforo
  let status: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
  let reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';

  if (isRed) {
    status = 'RED';
    reviewStatus = 'REJECTED';
    if (!yellowReason) yellowReason = 'No cumple con los requisitos indispensables de autonomía y perfil comercial AACOM.';
  } else if (isYellowException || score < 80) {
    status = 'YELLOW';
    reviewStatus = 'PENDING';
  } else {
    status = 'GREEN';
    reviewStatus = 'APPROVED';
  }

  // Generación de diagnóstico preliminar
  let aiRecommendation = '';
  if (status === 'GREEN') {
    aiRecommendation = `🟢 CANDIDATO IDEAL (Score: ${score}%): Cumple el 100% de los Filtros de Hierro. Posee auto, colchón de ${data.financialBufferMonths} meses, perfil emprendedor y background relevante en ${data.background}. Se recomienda agendar entrevista inmediatamente.`;
  } else if (status === 'YELLOW') {
    aiRecommendation = `🟡 REVISIÓN MANUAL (Score: ${score}%): ${yellowReason}`;
  } else {
    aiRecommendation = `🔴 CANDIDATO DESCARTADO (Score: ${score}%): ${yellowReason}`;
  }

  return {
    score,
    status,
    reviewStatus,
    manualReviewReason: status === 'YELLOW' ? yellowReason : undefined,
    breakdown: {
      financialScore,
      mobilityScore,
      mindsetScore: data.commissionOnly ? 20 : 0,
      backgroundScore,
      capitalSocialScore,
    },
    aiRecommendation,
  };
};
