import { NextResponse } from 'next/server';
import { evaluateCandidate } from '@/lib/recruitment/evaluatorEngine';
import { analyzeCandidateWithGemini } from '@/lib/recruitment/geminiService';
import { mockCandidatesDb } from '@/lib/recruitment/mockDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = body.applicantName || body.fullName || 'Candidato LinkedIn';
    const email = body.email || 'linkedin.applicant@ejemplo.com';
    const phone = body.phone || '+525512345678';
    const background = body.currentRole || body.background || 'Banca Patrimonial / Private Banking';
    const university = body.university || 'Tec de Monterrey';
    const income = body.income || '50k-80k';
    const hasCar = body.hasCar !== undefined ? Boolean(body.hasCar) : true;
    const cvUrl = body.cvUrl || 'https://aacom-blob-storage.public.blob.vercel-storage.com/cvs/cv_linkedin_import.pdf';

    // 1. Evaluador de Negocio
    const evaluation = evaluateCandidate({
      fullName,
      email,
      phone,
      city: body.city || 'Ciudad de México',
      hasCar,
      financialBufferMonths: Number(body.financialBufferMonths || 4),
      commissionOnly: true,
      salesExperienceYears: Number(body.salesExperienceYears || 5),
      background,
      targetUniversity: university,
      previousIncomeRange: income,
      cvFileUrl: cvUrl,
      notes: 'Postulación ingresada automáticamente via LinkedIn Easy Apply Webhook API.',
    });

    // 2. Diagnóstico 360° con Agente Screener (Gemini)
    const geminiResult = await analyzeCandidateWithGemini({
      candidateName: fullName,
      background,
      hasCar,
      financialBufferMonths: 4,
      commissionOnly: true,
      salesExperienceYears: 5,
      targetUniversity: university,
      previousIncomeRange: income,
      cvFileUrl: cvUrl,
      notesOrCvText: `Postulación recibida desde LinkedIn Jobs API. Perfil: ${background}, Universidad: ${university}.`,
    });

    const candidateRecord = {
      id: `cand_linkedin_${Date.now()}`,
      fullName,
      email,
      phone,
      city: body.city || 'Ciudad de México',
      hasCar,
      financialBufferMonths: 4,
      commissionOnly: true,
      salesExperienceYears: 5,
      background,
      targetUniversity: university,
      universityTier: evaluation.universityTier,
      previousIncomeRange: income,
      cvFileUrl: cvUrl,
      notes: 'Importado de forma autónoma desde LinkedIn Jobs API (Webhook Oficial).',
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
      source: 'LINKEDIN_JOBS_API',
      candidateId: candidateRecord.id,
      status: candidateRecord.status,
      score: candidateRecord.score,
    });
  } catch (error: any) {
    console.error('[LINKEDIN WEBHOOK ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar webhook de LinkedIn' },
      { status: 500 }
    );
  }
}
