export let mockCandidatesDb: any[] = [
  {
    id: 'cand_001',
    fullName: 'Enrique Ahumada',
    email: 'enrique@pruebas.com',
    phone: '+525567556644',
    city: 'Ciudad de México',
    hasCar: true,
    financialBufferMonths: 4,
    commissionOnly: true,
    salesExperienceYears: 6,
    background: 'Banca Patrimonial / Private Banking',
    targetUniversity: 'La Salle',
    universityTier: 'TIER_2',
    previousIncomeRange: '50k-80k',
    cvFileUrl: 'https://aacom-blob-storage.public.blob.vercel-storage.com/cvs/cv_enrique_ahumada.pdf',
    notes: 'Ex-ejecutivo patrimonial especializado en la estructuración de portafolios de inversión corporativos.',
    score: 95,
    status: 'GREEN',
    reviewStatus: 'APPROVED',
    etapaActual: 4, // Etapa 4: Primera Cita (Agendado en Calendly)
    agenteExperimentado: true,
    popTestScore: 'Alto Perfil Comercial (96/100)',
    proyecto200Url: 'https://aacom-blob-storage.public.blob.vercel-storage.com/proyectos200/proyecto200_enrique.xlsx',
    documentosEstado: {
      identificacion: true,
      estudios: true,
      domicilio: true,
      fiscal: true,
      rfc: true,
      curp: true,
    },
    aiAnalysis: 'Candidato de alto impacto y rendimiento para la Promotoría AACOM. Presenta una combinación idónea de autonomía financiera (4 meses de colchón), vehículo propio para cierres corporativos e historial consolidado en Banca Patrimonial. Su nivel de ingresos previos de $50k-$80k MXN confirma su madurez para negociar pólizas empresariales de alto valor.',
    fitAssessment: 'Ajuste de Negocio Excelente (96% Fit). Perfil highly automotivado con visión de empresario, acostumbrado a gestionar su propio embudo de ventas de ticket alto sin requerir supervisión.',
    pillarScores: {
      financialAutonomy: 100,
      mobilityAndReach: 100,
      commissionMindset: 100,
      consultativeSalesExperience: 95,
      academicAndMarketTier: 90,
    },
    strengths: [
      'Trayectoria destacada en Banca Patrimonial / Private Banking con clientes de alto valor (HNW)',
      'Historial de ingresos elevados registrado ($50,000 a $80,000 MXN mensuales)',
      'Respaldo financiero sólido (4 meses de autonomía para la curva de arranque)',
      'Formación universitaria en La Salle (Tier 2 con excelente red de contactos)',
      'Movilidad presencial inmediata asegurada con vehículo propio'
    ],
    riskAlerts: [
      'ALTA AMBICIÓN FINANCIERA: Acostumbrado a ingresos altos. Requiere aceleración de cartera en los primeros 90 días.',
      'MANTENER RETENCIÓN: Perfil cotizado en el mercado corporativo. Conviene integrarlo rápido al plan de formación AACOM.'
    ],
    recommendedInterviewQuestions: [
      '¿Cuál ha sido el contrato o la estrategia de prospección patrimonial más compleja que cerraste en tu empleo anterior?',
      '¿Cómo fue tu proceso para construir tu cartera de clientes AAA partiendo de cero?',
      '¿Qué nivel de facturación mensual tienes proyectado alcanzar en tu primer trimestre con la Promotoría AACOM?',
      '¿Cómo organizas tu agenda semanal entre cierres corporativos presenciales y seguimiento telefónico?'
    ],
    cvHighlights: 'CV Verificado: 6 años de experiencia comercial en sector bancario/patrimonial. Licenciatura concluida en La Salle. Manejo avanzado de prospección B2B y cierre de cuentas clave.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'cand_002',
    fullName: 'Mariana Ríos',
    email: 'mariana.rios@ejemplo.com',
    phone: '+525587654321',
    city: 'Guadalajara',
    hasCar: false,
    financialBufferMonths: 3,
    commissionOnly: true,
    salesExperienceYears: 4,
    background: 'Asesoría Inmobiliaria Residencial (Medio-Alto)',
    targetUniversity: 'ITESO / Universidad de Prestigio',
    universityTier: 'TIER_1',
    previousIncomeRange: '30k-50k',
    cvFileUrl: 'https://aacom-blob-storage.public.blob.vercel-storage.com/cvs/cv_mariana_rios.pdf',
    notes: 'Excelente vendedora de desarrollo residencial de alto valor. Vendió su auto recientemente.',
    score: 78,
    status: 'YELLOW',
    reviewStatus: 'PENDING',
    etapaActual: 3, // Etapa 3: Prueba POP
    agenteExperimentado: false,
    popTestScore: 'Pendiente de Completar',
    proyecto200Url: null,
    documentosEstado: {
      identificacion: true,
      estudios: true,
      domicilio: false,
      fiscal: false,
      rfc: true,
      curp: true,
    },
    manualReviewReason: 'REVISIÓN MANUAL EXCEPCIONAL (Semáforo Amarillo): El candidato no cuenta con vehículo propio en este momento, pero califica por alto potencial debido a: Universidad de Prestigio (Tier 1: ITESO), Historial de Ingresos Alto (30k-50k).',
    aiAnalysis: 'Candidato calificado para REVISIÓN MANUAL EXCEPCIONAL (Semáforo Amarillo). A pesar de no contar con automóvil propio en este momento, demuestra un alto potencial de mercado respaldado por su historial de ingresos ($30k-$50k MXN) y formación profesional en ITESO (Tier 1).',
    fitAssessment: 'Ajuste por Excepción (78% Fit). Requiere definir estrategia de movilidad inicial para visitas, pero posee el perfil socioeconómico y el nivel comercial para generar ventas de alto ticket.',
    pillarScores: {
      financialAutonomy: 75,
      mobilityAndReach: 50,
      commissionMindset: 100,
      consultativeSalesExperience: 80,
      academicAndMarketTier: 95,
    },
    strengths: [
      'Egresada de Universidad de Prestigio Tier 1 (ITESO Guadalajara)',
      'Experiencia en ventas de alto valor en Asesoría Inmobiliaria Residencial',
      'Nivel de ingresos previo consolidado ($30,000 a $50,000 MXN mensuales)',
      'Comprensión completa del esquema 100% comisionista sin sueldo base'
    ],
    riskAlerts: [
      'CRÍTICO - MOVILIDAD: No posee automóvil en este momento. Se debe acordar en la entrevista su logística para visitas a clientes presenciales.',
      'Respaldo financiero justo de 3 meses.'
    ],
    recommendedInterviewQuestions: [
      'Al no contar con vehículo en este momento, ¿cuál es tu plan logístico para realizar visitas comerciales presenciales a clientes?',
      '¿Cómo realizabas la prospección de desarrollos residenciales de lujo en Guadalajara?',
      '¿Qué te motivó a dar el paso del sector inmobiliario al sector de seguros patrimoniales?'
    ],
    cvHighlights: 'CV Verificado: 4 años de experiencia en ventas inmobiliarias de segmento medio-alto. Red de contactos activa en zona metropolitana de Guadalajara.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

export let mockUsersDb: any[] = [
  {
    id: 'user_001',
    name: 'Director de Promotoría AACOM',
    email: 'admin@aacom.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    mustChangePassword: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_002',
    name: 'Sofía Reclutadora',
    email: 'sofia.recruiter@aacom.com',
    role: 'RECRUITER',
    status: 'ACTIVE',
    mustChangePassword: true,
    createdAt: new Date().toISOString(),
  }
];

export let mockIntegrationsDb = {
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'AC_mock_twilio_account_sid_123',
    authToken: process.env.TWILIO_AUTH_TOKEN ? '••••••••••••••••' : 'mock_auth_token_456',
    fromPhone: process.env.TWILIO_SMS_NUMBER || '+18005550199',
    adminNotifyPhone: process.env.TWILIO_ADMIN_NOTIFY_PHONE || '+525512345678',
    isEnabled: true,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY ? '••••••••••••••••' : 'AIzaSy_mock_gemini_key_789',
    model: 'gemini-3.6-flash',
    isEnabled: true,
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID || '78_mock_linkedin_client_id',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET ? '••••••••••••••••' : 'mock_linkedin_secret_xyz',
    organizationId: process.env.LINKEDIN_ORG_ID || 'aacom-promotoria-org',
    webhookUrl: 'https://aacom-reclutamiento-promotoria.vercel.app/api/recruitment/webhooks/linkedin',
    isEnabled: true,
  },
  occ: {
    apiKey: process.env.OCC_API_KEY || 'occ_mock_api_key_456',
    secretKey: process.env.OCC_SECRET_KEY ? '••••••••••••••••' : 'mock_occ_secret_789',
    employerId: process.env.OCC_EMPLOYER_ID || 'emp_aacom_99',
    webhookUrl: 'https://aacom-reclutamiento-promotoria.vercel.app/api/recruitment/webhooks/occ',
    isEnabled: true,
  },
};
