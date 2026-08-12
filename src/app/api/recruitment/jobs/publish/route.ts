import { NextResponse } from 'next/server';
import { mockIntegrationsDb } from '@/lib/recruitment/mockDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, location, salary, description, channel } = body;

    const linkedinConfig = mockIntegrationsDb.linkedin;
    const orgId = linkedinConfig.organizationId || '92705190';
    const clientId = linkedinConfig.clientId || '78z2vrugjo5rbb';
    
    // Si el frontend envía la cadena ofuscada, tomamos la llave secreta real desde las variables de Vercel
    let clientSecret = linkedinConfig.clientSecret;
    if (clientSecret === '••••••••••••••••' || !clientSecret) {
      clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';
    }

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
        const aclRes = await fetch('https://api.linkedin.com/v2/organizationAcls?q=roleAssignee', {
          headers: {
            'Authorization': `Bearer ${clientSecret}`,
            'X-Restli-Protocol-Version': '2.0.0',
          }
        });
        const aclData = await aclRes.json();
        const isAdmin = aclData?.elements?.some((acl: any) => acl.organization.includes(orgId.trim()));
        let debugMsg = isAdmin ? 'Eres Admin de la página.' : 'NO eres Admin de la página o falta permiso r_organization_admin.';

        // Payload oficial v2 (REST Posts API)
        const postsPayload = {
          author: `urn:li:organization:${orgId.trim()}`,
          commentary: `💼 ¡CONVOCATORIA ABIERTA! ${title}\n\n${description}\n\n📍 Ubicación: ${location}\n\n🌐 Postúlate directamente en nuestro Portal de Reclutamiento AACOM:\nhttps://aacom-reclutamiento-promotoria.vercel.app/recruitment/apply\n\n#ReclutamientoAACOM #SociosComerciales #VacanteComercial #BancaPatrimonial`,
          visibility: 'PUBLIC',
          distribution: {
            feedDistribution: 'MAIN_FEED',
            targetEntities: [],
            thirdPartyDistributionChannels: []
          },
          lifecycleState: 'PUBLISHED',
          isReshareDisabledByAuthor: false
        };

        let response = await fetch('https://api.linkedin.com/rest/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'LinkedIn-Version': '202401',
            'X-Restli-Protocol-Version': '2.0.0',
            'Authorization': `Bearer ${clientSecret}`,
          },
          body: JSON.stringify(postsPayload),
        });

        let usedFallback = false;

        // Si falla con la empresa, intentar hacer fallback al perfil personal del usuario
        if (!response.ok && aclData?.elements?.length > 0) {
          const personUrn = aclData.elements[0].roleAssignee;
          console.warn(`[LINKEDIN] Falló post a org, intentando fallback a perfil personal: ${personUrn}`);
          postsPayload.author = personUrn;
          
          response = await fetch('https://api.linkedin.com/rest/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'LinkedIn-Version': '202401',
              'X-Restli-Protocol-Version': '2.0.0',
              'Authorization': `Bearer ${clientSecret}`,
            },
            body: JSON.stringify(postsPayload),
          });
          usedFallback = true;
        }

        if (response.ok || response.status === 201) {
          // En /rest/posts a veces no regresa body, el ID viene en el header x-restli-id
          const postId = response.headers.get('x-restli-id') || 'OK';
          const msg = usedFallback 
            ? `¡Publicado exitosamente! (En tu Muro Personal porque el Token no tenía permisos de Empresa). ID: ${postId}`
            : `¡Publicación exitosa en el muro de tu EMPRESA LinkedIn! ID Post: ${postId}`;
            
          return NextResponse.json({
            success: true,
            message: msg,
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
        } else {
          const errData = await response.text();
          console.error('[LINKEDIN POST ERROR]', errData);
          return NextResponse.json({ success: false, error: `API Error (Diagnóstico: ${debugMsg}) | Detalles: ${response.status} - ${errData} | Roles: ${JSON.stringify(aclData)}` }, { status: 400 });
        }
      } catch (err: any) {
        console.error('[LINKEDIN API POST EXCEPTION]', err.message);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ success: false, error: "Client Secret no configurado correctamente en Vercel." }, { status: 400 });
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
