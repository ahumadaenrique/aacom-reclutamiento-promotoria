import { NextResponse } from 'next/server';
import { evaluateCandidate } from '@/lib/recruitment/evaluatorEngine';
import { analyzeCandidateWithHermes } from '@/lib/recruitment/hermesService';
import { mockCandidatesDb } from '@/lib/recruitment/mockDb';

/**
 * Webhook Receptor para Spark de Gemini / n8n / Google Sheets / Make
 * Permite que agentes autónomos de prospección externa alimenten el embudo AACOM 24/7.
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const sparkSecret = process.env.SPARK_WEBHOOK_SECRET || 'aacom-spark-secret-2026';

    // Validación opcional de token si se envía Authorization: Bearer <secret>
    if (authHeader && authHeader !== `Bearer ${sparkSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Token de autorización inválido para Spark Webhook.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const fullName = body.applicantName || body.fullName || body.nombre || 'Candidato Prospección Spark';
    const email = body.email || body.correo || 'prospecto.spark@ejemplo.com';
    const phone = body.phone || body.telefono || '+525500000000';
    const background = body.currentRole || body.background || body.perfil || 'Ventas Consultivas / Banca Patrimonial';
    const university = body.university || body.universidad || 'Universidad de Prestigio';
    const income = body.income || body.ingresos || '30k-50k';
    const hasCar = body.hasCar !== undefined ? Boolean(body.hasCar) : true;
    const financialBuffer = Number(body.financialBufferMonths || body.colchonMeses || 4);
    const salesExperience = Number(body.salesExperienceYears || body.experienciaAnos || 4);
    const cvUrl = body.cvUrl || body.cvFileUrl || 'https://aacom-blob-storage.public.blob.vercel-storage.com/cvs/cv_spark_lead.pdf';
    const source = body.source || 'GEMINI_SPARK_OUTREACH';
    const initialNotes = body.notes || body.notas || 'Prospectado y pre-calificado automáticamente por Gemini Spark en LinkedIn/Gmail.';

    // 1. Evaluación con el Motor de Negocio AACOM
    const evaluation = evaluateCandidate({
      fullName,
      email,
      phone,
      city: body.city || body.ciudad || 'Ciudad de México y Área Metropolitana',
      hasCar,
      financialBufferMonths: financialBuffer,
      commissionOnly: true,
      salesExperienceYears: salesExperience,
      background,
      targetUniversity: university,
      previousIncomeRange: income,
      cvFileUrl: cvUrl,
      notes: initialNotes,
    });

    // 2. Diagnóstico Cualitativo 360° con Hermes 3 (Nous Research)
    const hermesResult = await analyzeCandidateWithHermes({
      candidateName: fullName,
      background,
      hasCar,
      financialBufferMonths: financialBuffer,
      commissionOnly: true,
      salesExperienceYears: salesExperience,
      targetUniversity: university,
      previousIncomeRange: income,
      cvFileUrl: cvUrl,
      notesOrCvText: `${initialNotes}. Origen: ${source}. Historial comercial: ${background}.`,
    });

    // 3. Creación del registro para el CRM
    const candidateRecord = {
      id: `cand_spark_${Date.now()}`,
      fullName,
      email,
      phone,
      city: body.city || body.ciudad || 'Ciudad de México y Área Metropolitana',
      hasCar,
      financialBufferMonths: financialBuffer,
      commissionOnly: true,
      salesExperienceYears: salesExperience,
      background,
      targetUniversity: university,
      universityTier: evaluation.universityTier,
      previousIncomeRange: income,
      cvFileUrl: cvUrl,
      notes: `[Origen: ${source}] ${initialNotes}`,
      score: hermesResult.score || evaluation.score,
      status: hermesResult.status || evaluation.status,
      reviewStatus: evaluation.reviewStatus,
      manualReviewReason: evaluation.manualReviewReason,
      aiAnalysis: hermesResult.summary,
      fitAssessment: hermesResult.fitAssessment,
      pillarScores: hermesResult.pillarScores,
      strengths: hermesResult.strengths,
      riskAlerts: hermesResult.riskAlerts,
      recommendedInterviewQuestions: hermesResult.recommendedInterviewQuestions,
      cvHighlights: hermesResult.cvHighlights,
      engineUsed: hermesResult.engineUsed || 'Hermes 3 (Nous Research)',
      createdAt: new Date().toISOString(),
    };

    // Inyectar al CRM inmediatamente
    mockCandidatesDb.unshift(candidateRecord);

    return NextResponse.json({
      success: true,
      message: 'Candidato inyectado exitosamente al embudo AACOM por Spark.',
      data: {
        candidateId: candidateRecord.id,
        fullName: candidateRecord.fullName,
        score: candidateRecord.score,
        status: candidateRecord.status,
        fitAssessment: candidateRecord.fitAssessment,
      },
    });
  } catch (error: any) {
    console.error('[SPARK WEBHOOK ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar webhook de Spark' },
      { status: 500 }
    );
  }
}
