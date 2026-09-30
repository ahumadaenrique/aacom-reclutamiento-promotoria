# Reglas de Seguridad, Entorno y Ejecución

- **Ejecución Proactiva de Terminal:** El asistente (Antigravity) siempre debe encargarse de ejecutar directamente todos los comandos de terminal (como `git`, pruebas, compilaciones, migraciones, scripts, etc.) en favor del usuario. No se le debe pedir al usuario que copie o ejecute comandos en la terminal manualmente a menos que sea estrictamente indispensable.
- **Gestión de Secretos en Producción:** Las API Keys y credenciales sensibles (como `OPENROUTER_API_KEY`, `TOGETHER_API_KEY`, `TWILIO_AUTH_TOKEN`, `STRIPE_SECRET_KEY`) se administran **exclusivamente a través de las Variables de Entorno de Vercel (Vercel Environment Variables)**.
- **Seguridad en Repositorio y Local:** No se deben solicitar ni escribir API keys reales en archivos locales (`.env`, `.env.local`) ni en el código fuente. El código debe acceder a ellas mediante `process.env.<VARIABLE_NAME>`.
- **Despliegue Continuo:** El backend de Next.js en Vercel inyectará de forma segura y encriptada las variables durante la ejecución del servidor (Serverless Functions).
