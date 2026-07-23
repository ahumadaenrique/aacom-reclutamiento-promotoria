export interface SMSNotificationPayload {
  toPhone: string;
  candidateName: string;
  candidateStatus: 'GREEN' | 'YELLOW' | 'RED';
  candidateScore: number;
  reason?: string;
}

export const sendCandidateNotificationSMS = async (payload: SMSNotificationPayload): Promise<{ success: boolean; messageSid?: string; error?: string }> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_SMS_NUMBER || '+18005550199';
  const adminNotifyPhone = process.env.TWILIO_ADMIN_NOTIFY_PHONE || payload.toPhone;

  const statusEmoji = payload.candidateStatus === 'GREEN' ? '🟢 VERDE' : '🟡 AMARILLO';
  const bodyText = `[AACOM Recruited] Nuevo candidato calificado: ${payload.candidateName} (${statusEmoji} - Score ${payload.candidateScore}%). ${payload.reason ? 'Motivo: ' + payload.reason : 'Revisa el panel para agendar entrevista.'}`;

  // Si Twilio no está configurado en env, simulamos el envío exitoso e imprimimos en consola
  if (!accountSid || !authToken || accountSid.includes('mock')) {
    console.log(`[TWILIO MOCK SMS DISPATCH] To: ${adminNotifyPhone} | Body: ${bodyText}`);
    return {
      success: true,
      messageSid: `SMmock_${Date.now()}`,
    };
  }

  try {
    // Implementación HTTP directa compatible con Vercel Edge/Node sin requerir librería pesada
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const params = new URLSearchParams();
    params.append('To', adminNotifyPhone);
    params.append('From', fromPhone);
    params.append('Body', bodyText);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errJson = await response.json();
      throw new Error(errJson.message || 'Error en Twilio API');
    }

    const data = await response.json();
    return {
      success: true,
      messageSid: data.sid,
    };
  } catch (error: any) {
    console.error('[TWILIO SMS ERROR]', error);
    return {
      success: false,
      error: error.message || 'Error al enviar SMS',
    };
  }
};
