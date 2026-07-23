import { NextResponse } from 'next/server';
import { mockCandidatesDb } from '@/lib/recruitment/mockDb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let results = [...mockCandidatesDb];

  if (status && status !== 'ALL') {
    results = results.filter((c) => c.status === status);
  }

  if (search) {
    const term = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.fullName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term) ||
        c.background.toLowerCase().includes(term)
    );
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    candidates: results,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, reviewStatus, status, notes } = body;

    const index = mockCandidatesDb.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Candidato no encontrado' },
        { status: 404 }
      );
    }

    if (reviewStatus) mockCandidatesDb[index].reviewStatus = reviewStatus;
    if (status) mockCandidatesDb[index].status = status;
    if (notes) mockCandidatesDb[index].notes = notes;

    mockCandidatesDb[index].updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      candidate: mockCandidatesDb[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar candidato' },
      { status: 500 }
    );
  }
}
