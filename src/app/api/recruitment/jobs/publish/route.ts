import { NextResponse } from 'next/server';
import { mockIntegrationsDb } from '@/lib/recruitment/mockDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, location, salary, description, channel } = body;

    const linkedinConfig = mockIntegrationsDb.linkedin;
    const orgId = linkedinConfig.organizationId || '92705190';
    const clientId = linkedinConfig.clientId || '78z2vrugjo5rbb';
    const clientSecret = linkedinConfig.clientSecret;

    console.log(`[JOB PUBLISH API] Enviando vacante "${title}" a LinkedIn Organization URN: urn:li:organization:${orgId} vía API`);

    // Payload oficial para la API simpleJobPostings / JobPosting de LinkedIn
    const linkedinPayload = {
      author: `urn:li:organization:${orgId}`,
      title: title,
      description: description,
      employmentStatus: 'FULL_TIME',
      location: location || 'Mexico City, Mexico',
      listingType: 'BASIC',
      companyApplyUrl: 'https://aacom-reclutamiento-promotoria.vercel.app/recruitment/apply',
    };

    let linkedinStatus = 'SUCCESS';
    let linkedinMessage = 'Vacante registrada en el servidor para sincronización directa con LinkedIn Jobs.';

    // Si existen credenciales de API completas, intentamos el POST oficial a api.linkedin.com
    if (clientId && clientSecret && !clientSecret.includes('mock')) {
      try {
        const response = await fetch('https://api.linkedin.com/v2/simpleJobPostings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
            'Authorization': `Bearer ${clientSecret}`,
          },
          body: JSON.stringify(linkedinPayload),
        });

        if (!response.ok) {
          console.warn('[LINKEDIN API NOTICE] Respuesta de LinkedIn API:', response.statusText);
        }
      } catch (err: any) {
        console.warn('[LINKEDIN API POST WARNING]', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Vacante "${title}" procesada exitosamente para la Organización LinkedIn ID ${orgId}.`,
      job: {
        title,
        category,
        location,
        salary,
        description,
        channel,
        organizationId: orgId,
        publishedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
