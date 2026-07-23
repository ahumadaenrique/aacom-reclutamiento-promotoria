# Guía de Integración Rápida (Drop-In) & Despliegue en Vercel / NeonTech

## 🚀 Pasos para integrar a tu SaaS Principal (< 5 Minutos)

### Paso 1: Copiar Carpetas Aisladas
Copia las siguientes carpetas a tu proyecto principal de Next.js 14:
1. `src/app/recruitment/` ➔ Pégala en `src/app/recruitment/`
2. `src/app/api/recruitment/` ➔ Pégala en `src/app/api/recruitment/`
3. `src/lib/recruitment/` ➔ Pégala en `src/lib/recruitment/`

### Paso 2: Anexar Modelos de Prisma
Abre `prisma/schema.prisma` en tu proyecto principal y pega al final los modelos del módulo (todos llevan el prefijo `Rec_` y usan relaciones débiles por lo que **no modifican ni ponen en riesgo tus tablas de usuarios o datos existentes**):

```prisma
model Rec_User {
  id                 String   @id @default(uuid())
  name               String
  email              String   @unique
  password           String
  role               String   @default("RECRUITER")
  status             String   @default("ACTIVE")
  mustChangePassword Boolean  @default(true)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Rec_Candidate {
  id                    String   @id @default(uuid())
  fullName              String
  email                 String
  phone                 String
  city                  String
  hasCar                Boolean  @default(false)
  financialBufferMonths Int      @default(0)
  commissionOnly        Boolean  @default(false)
  salesExperienceYears  Int      @default(0)
  background            String
  targetUniversity      String?
  highNetWorthAccess    Boolean  @default(false)
  notes                 String?
  score                 Float    @default(0)
  status                String   @default("YELLOW")
  reviewStatus          String   @default("PENDING")
  manualReviewReason    String?
  aiAnalysis            String?
  userId                String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model Rec_AIRule {
  id                String   @id @default(uuid())
  ruleKey           String   @unique
  title             String
  description       String
  weight            Float    @default(1.0)
  isMandatory       Boolean  @default(false)
  minScoreThreshold Float    @default(70.0)
  category          String   @default("GENERAL")
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Rec_AIPromptSetting {
  id               String   @id @default(uuid())
  systemPrompt     String
  temperature      Float    @default(0.2)
  greenThreshold   Float    @default(80.0)
  yellowThreshold  Float    @default(60.0)
  modelName        String   @default("gemini-1.5-pro")
  updatedAt        DateTime @updatedAt
}

model Rec_IntegrationConfig {
  id               String   @id @default(uuid())
  provider         String   @unique
  accountSid       String?
  authToken        String?
  fromPhone        String?
  adminNotifyPhone String?
  apiKey           String?
  isEnabled        Boolean  @default(false)
  updatedAt        DateTime @updatedAt
}
```

Ejecuta el comando para actualizar tu base de datos:
```bash
npx prisma db push
```

### Paso 3: Sustituir la Autenticación (1 Línea)
En el archivo `src/lib/recruitment/mockAuth.ts`, reemplaza la función `getMockUser()` por la función de tu sistema real `getCurrentUser()` o `getServerSession()`.

---

## 🌐 Configuración para Vercel & NeonTech (PostgreSQL)

1. **Crear Base de Datos en NeonTech (neon.tech):**
   - Crea un proyecto nuevo en Neon.
   - Copia la cadena de conexión de PostgreSQL (Connection String).

2. **Configurar Variables de Entorno en Vercel:**
   - `DATABASE_URL`: Tu URL de NeonTech (`postgres://...`)
   - `TWILIO_ACCOUNT_SID`: Tu SID de Twilio
   - `TWILIO_AUTH_TOKEN`: Tu Auth Token de Twilio
   - `TWILIO_SMS_NUMBER`: Tu número emisor de Twilio
   - `TWILIO_ADMIN_NOTIFY_PHONE`: Tu teléfono donde recibirás alertas SMS de nuevos candidatos 🟢 o 🟡
   - `GEMINI_API_KEY`: Tu API Key de Google Gemini AI

3. **Despliegue:**
   - Conecta tu repositorio de GitHub a Vercel.
   - Vercel ejecutará automáticamente `npx prisma generate` y desplegará la app en producción.
