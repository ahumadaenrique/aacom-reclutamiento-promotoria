export interface SMSNotificationPayload {
  toPhone: string;
  candidateName: string;
  candidateStatus: 'GREEN' | 'YELLOW' | 'RED';
  candidateScore: number;
  reason?: string;
}

export const sendCandidateNotificationSMS = async (payload: SMSNotificationPayload): Promise<{ success: boolean; messageSid?: string; error?: string }> => {
  // MODO PRUEBAS CERO COSTO: Log silencioso en consola sin realizar peticiones cobradas a Twilio
  const statusEmoji = payload.candidateStatus === 'GREEN' ? '🟢 VERDE' : '🟡 AMARILLO';
  console.log(`[TWILIO SMS SIMULADO - MODO PRUEBAS SIN COSTO] Para: ${payload.toPhone} | Estatus: ${statusEmoji} | Candidato: ${payload.candidateName}`);

  return {
    success: true,
    messageSid: `SM_test_mock_${Date.now()}`,
  };
};
