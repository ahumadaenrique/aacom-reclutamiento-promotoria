import { NextResponse } from 'next/server';
import { evaluateCandidate } from '@/lib/recruitment/evaluatorEngine';
import { analyzeCandidateWithGemini } from '@/lib/recruitment/geminiService';
import { sendCandidateNotificationSMS } from '@/lib/recruitment/twilioService';
import { mockCandidatesDb } from '@/lib/recruitment/mockDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Evaluación con el Motor de Negocio AACOM
    const evaluation = evaluateCandidate({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      city: body.city || 'No especificada',
      hasCar: Boolean(body.hasCar),
      financialBufferMonths: Number(body.financialBufferMonths || 0),
      commissionOnly: Boolean(body.commissionOnly),
      salesExperienceYears: Number(body.salesExperienceYears || 0),
      background: body.background || 'Otro',
      targetUniversity: body.targetUniversity || '',
      highNetWorthAccess: Boolean(body.highNetWorthAccess),
      notes: body.notes || '',
    });

    // 2. Evaluación Cualitativa con Gemini AI
    const geminiResult = await analyzeCandidateWithGemini({
      candidateName: body.fullName,
      background: body.background,
      hasCar: Boolean(body.hasCar),
      financialBufferMonths: Number(body.financialBufferMonths),
      commissionOnly: Boolean(body.commissionOnly),
      salesExperienceYears: Number(body.salesExperienceYears),
      targetUniversity: body.targetUniversity,
      highNetWorthAccess: Boolean(body.highNetWorthAccess),
      notesOrCvText: body.notes,
    });

    const candidateRecord = {
      id: `cand_${Date.now()}`,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      city: body.city || 'No especificada',
      hasCar: Boolean(body.hasCar),
      financialBufferMonths: Number(body.financialBufferMonths),
      commissionOnly: Boolean(body.commissionOnly),
      salesExperienceYears: Number(body.salesExperienceYears),
      background: body.background || 'Otro',
      targetUniversity: body.targetUniversity || '',
      highNetWorthAccess: Boolean(body.highNetWorthAccess),
      notes: body.notes || '',
      score: evaluation.score,
      status: evaluation.status,
      reviewStatus: evaluation.reviewStatus,
      manualReviewReason: evaluation.manualReviewReason,
      aiAnalysis: geminiResult.summary,
      strengths: geminiResult.strengths,
      riskAlerts: geminiResult.riskAlerts,
      recommendedInterviewQuestions: geminiResult.recommendedInterviewQuestions,
      createdAt: new Date().toISOString(),
    };

    // Guardar en la base de datos simulada
    mockCandidatesDb.unshift(candidateRecord);

    // 3. Notificación SMS vía Twilio si el candidato es Verde 🟢 o Amarillo 🟡
    if (evaluation.status === 'GREEN' || evaluation.status === 'YELLOW') {
      await sendCandidateNotificationSMS({
        toPhone: body.phone,
        candidateName: body.fullName,
        candidateStatus: evaluation.status,
        candidateScore: evaluation.score,
        reason: evaluation.manualReviewReason,
      });
    }

    return NextResponse.json({
      success: true,
      data: candidateRecord,
      evaluation,
      geminiResult,
    });
  } catch (error: any) {
    console.error('[APPLY API ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar postulación' },
      { status: 500 }
    );
  }
}
