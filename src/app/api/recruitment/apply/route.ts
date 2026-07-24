import { NextResponse } from 'next/server';
import { evaluateCandidate } from '@/lib/recruitment/evaluatorEngine';
import { analyzeCandidateWithGemini } from '@/lib/recruitment/geminiService';
import { sendCandidateNotificationSMS } from '@/lib/recruitment/twilioService';
import { mockCandidatesDb } from '@/lib/recruitment/mockDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.cvFileUrl) {
      return NextResponse.json(
        { success: false, error: 'Es obligatorio adjuntar tu Currículum Vitae (PDF o Word) para continuar.' },
        { status: 400 }
      );
    }

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
      background: body.background || 'Otra Industria Comercial',
      targetUniversity: body.targetUniversity || '',
      previousIncomeRange: body.previousIncomeRange || '30k-50k',
      cvFileUrl: body.cvFileUrl,
      cvText: body.cvText || '',
      notes: body.notes || '',
    });

    // 2. Evaluación Cualitativa 360° con Gemini AI Lector de CV
    const geminiResult = await analyzeCandidateWithGemini({
      candidateName: body.fullName,
      background: body.background || 'Otra Industria Comercial',
      hasCar: Boolean(body.hasCar),
      financialBufferMonths: Number(body.financialBufferMonths),
      commissionOnly: Boolean(body.commissionOnly),
      salesExperienceYears: Number(body.salesExperienceYears),
      targetUniversity: body.targetUniversity,
      previousIncomeRange: body.previousIncomeRange || '30k-50k',
      cvFileUrl: body.cvFileUrl,
      notesOrCvText: body.cvText || body.notes,
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
      background: body.background || 'Otra Industria Comercial',
      targetUniversity: body.targetUniversity || '',
      universityTier: evaluation.universityTier,
      previousIncomeRange: body.previousIncomeRange || '30k-50k',
      cvFileUrl: body.cvFileUrl,
      notes: body.notes || '',
      score: evaluation.score,
      status: evaluation.status,
      reviewStatus: evaluation.reviewStatus,
      manualReviewReason: evaluation.manualReviewReason,
      aiAnalysis: geminiResult.summary,
      fitAssessment: geminiResult.fitAssessment,
      pillarScores: geminiResult.pillarScores,
      strengths: geminiResult.strengths,
      riskAlerts: geminiResult.riskAlerts,
      recommendedInterviewQuestions: geminiResult.recommendedInterviewQuestions,
      cvHighlights: geminiResult.cvHighlights,
      createdAt: new Date().toISOString(),
    };

    // Guardar candidato en el CRM
    mockCandidatesDb.unshift(candidateRecord);

    // 3. Notificación SMS simulada (Modo Pruebas sin costo)
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
      data: {
        id: candidateRecord.id,
        fullName: candidateRecord.fullName,
      },
    });
  } catch (error: any) {
    console.error('[APPLY API ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar postulación' },
      { status: 500 }
    );
  }
}
