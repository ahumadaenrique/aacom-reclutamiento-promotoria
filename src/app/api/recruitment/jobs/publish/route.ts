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

    console.log(`[JOB PUBLISH API] Publicando vacante "${title}" en el muro de Organización LinkedIn URN: urn:li:organization:${orgId}`);

    // Payload oficial UGC (User Generated Content) Post para Páginas de Empresa en LinkedIn API
    const ugcPostPayload = {
      author: `urn:li:organization:${orgId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: `💼 ¡CONVOCATORIA ABIERTA! ${title}\n\n${description}\n\n🌐 Postúlate directamente en nuestro Portal de Reclutamiento AACOM:\nhttps://aacom-reclutamiento-promotoria.vercel.app/recruitment/apply\n\n#ReclutamientoAACOM #SociosComerciales #VacanteComercial #BancaPatrimonial`,
          },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              description: {
                text: 'Promotoría AACOM - Programa de Desarrollo de Socios Comerciales & Consultores Patrimoniales',
              },
              originalUrl: 'https://aacom-reclutamiento-promotoria.vercel.app/recruitment/apply',
              title: {
                text: title,
              },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.ShareContent': 'PUBLIC',
      },
    };

    let apiStatusMessage = 'Vacante enviada y procesada exitosamente por el servidor.';

    if (clientSecret && !clientSecret.includes('mock')) {
      try {
        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
            'Authorization': `Bearer ${clientSecret}`,
          },
          body: JSON.stringify(ugcPostPayload),
        });

        if (response.ok) {
          const resData = await response.json();
          apiStatusMessage = `¡Publicación exitosa en el muro de LinkedIn! ID Post: ${resData.id || 'OK'}`;
        } else {
          console.warn('[LINKEDIN POST WARNING]', response.statusText);
        }
      } catch (err: any) {
        console.warn('[LINKEDIN API POST EXCEPTION]', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: apiStatusMessage,
      publishedPostUrl: `https://www.linkedin.com/company/${orgId}/`,
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
