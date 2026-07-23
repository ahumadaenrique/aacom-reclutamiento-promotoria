# Guía de Despliegue Autónomo para la Promotoría AACOM
## (Proyecto Nuevo en Vercel + Base de Datos en NeonTech)

Esta guía te permite lanzar el sistema **100% independiente** hoy mismo para tu Promotoría, sin tocar tu SaaS principal.

---

### Paso 1: Crear la Base de Datos en NeonTech (Gratis)
1. Ve a [neon.tech](https://neon.tech) e inicia sesión o crea una cuenta.
2. Haz clic en **"Create Project"**.
3. Ponle de nombre: `aacom-reclutamiento-db` y selecciona la región más cercana (ej. `us-east-1` o `us-east-2`).
4. Al crearse el proyecto, Neon te mostrará tu **Connection String** (URL de conexión).
   * Ejemplo: `postgres://alex:password123@ep-cool-pool-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
5. Copia esa URL completa.

---

### Paso 2: Subir el Código a GitHub
1. Crea un nuevo repositorio en tu cuenta de GitHub (ej. `aacom-reclutamiento-standalone`).
2. Sube la carpeta de este proyecto a tu repositorio:
   ```bash
   git init
   git add .
   git commit -m "Sistema de Reclutamiento AACOM Autopilot"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/aacom-reclutamiento-standalone.git
   git push -u origin main
   ```

---

### Paso 3: Crear el Nuevo Proyecto en Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión.
2. Haz clic en **"Add New..." ➔ "Project"**.
3. Selecciona tu nuevo repositorio `aacom-reclutamiento-standalone`.
4. En la sección **Environment Variables**, agrega las siguientes llaves:

   | Variable | Valor | Descripción |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgres://...` | La URL de NeonTech del Paso 1. |
   | `GEMINI_API_KEY` | `AIzaSy...` | Tu llave de Google AI Studio. |
   | `TWILIO_ACCOUNT_SID` | `AC...` | (Opcional) Tu Account SID de Twilio. |
   | `TWILIO_AUTH_TOKEN` | `auth_token` | (Opcional) Tu Auth Token de Twilio. |
   | `TWILIO_SMS_NUMBER` | `+1800...` | (Opcional) Número emisor SMS. |
   | `TWILIO_ADMIN_NOTIFY_PHONE` | `+5255...` | Tu teléfono para recibir alertas SMS. |

5. Haz clic en **"Deploy"**.

---

### Paso 4: Inicializar las Tablas en NeonTech
Una vez desplegado en Vercel, ejecuta este comando localmente apuntando a tu base de datos de NeonTech para crear las tablas:

```bash
# Setea la variable DATABASE_URL temporalmente en tu terminal
set DATABASE_URL="tu_url_de_neontech"

# Crea la estructura en NeonTech
npx prisma db push
```

¡Listo! En menos de 3 minutos tendrás tu sistema funcionando en una URL pública de Vercel (ej. `https://aacom-reclutamiento.vercel.app`) para probar con candidatos reales en tu Promotoría.
