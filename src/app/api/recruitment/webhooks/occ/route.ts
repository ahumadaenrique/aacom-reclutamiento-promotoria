import { NextResponse } from 'next/server';
import { evaluateCandidate } from '@/lib/recruitment/evaluatorEngine';
import { analyzeCandidateWithGemini } from '@/lib/recruitment/geminiService';
import { mockCandidatesDb } from '@/lib/recruitment/mockDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = body.name || body.fullName || 'Candidato OCC';
    const email = body.email || 'occ.applicant@ejemplo.com';
    const phone = body.phone || '+525598765432';
    const background = body.experienceArea || body.background || 'Asesoría Inmobiliaria Residencial (Medio-Alto)';
    const university = body.university || 'Universidad Anáhuac';
    const income = body.income || '30k-50k';
    const hasCar = body.hasVehicle !== undefined ? Boolean(body.hasVehicle) : true;
    const cvUrl = body.resumeUrl || 'https://aacom-blob-storage.public.blob.vercel-storage.com/cvs/cv_occ_import.pdf';

    // 1. Evaluador de Negocio
    const evaluation = evaluateCandidate({
      fullName,
      email,
      phone,
      city: body.city || 'Ciudad de México',
      hasCar,
      financialBufferMonths: Number(body.financialBufferMonths || 3),
      commissionOnly: true,
      salesExperienceYears: Number(body.salesExperienceYears || 4),
      background,
      targetUniversity: university,
      previousIncomeRange: income,
      cvFileUrl: cvUrl,
      notes: 'Postulación ingresada automáticamente via OCC Mundial Employer API Webhook.',
    });

    // 2. Diagnóstico 360° con Agente Screener (Gemini)
    const geminiResult = await analyzeCandidateWithGemini({
      candidateName: fullName,
      background,
      hasCar,
      financialBufferMonths: 3,
      commissionOnly: true,
      salesExperienceYears: 4,
      targetUniversity: university,
      previousIncomeRange: income,
      cvFileUrl: cvUrl,
      notesOrCvText: `Postulación recibida desde OCC Mundial API. Área: ${background}, Universidad: ${university}.`,
    });

    const candidateRecord = {
      id: `cand_occ_${Date.now()}`,
      fullName,
      email,
      phone,
      city: body.city || 'Ciudad de México',
      hasCar,
      financialBufferMonths: 3,
      commissionOnly: true,
      salesExperienceYears: 4,
      background,
      targetUniversity: university,
      universityTier: evaluation.universityTier,
      previousIncomeRange: income,
      cvFileUrl: cvUrl,
      notes: 'Importado de forma autónoma desde OCC Mundial Employer API.',
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

    mockCandidatesDb.unshift(candidateRecord);

    return NextResponse.json({
      success: true,
      source: 'OCC_MUNDIAL_API',
      candidateId: candidateRecord.id,
      status: candidateRecord.status,
      score: candidateRecord.score,
    });
  } catch (error: any) {
    console.error('[OCC WEBHOOK ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar webhook de OCC Mundial' },
      { status: 500 }
    );
  }
}
