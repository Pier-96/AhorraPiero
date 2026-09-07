# Despliegue

## Frontend — Vercel

1. Sube este repositorio a GitHub y crea un proyecto en Vercel importándolo.
2. Vercel detecta Vite. Usa `npm run build` como comando de build y `dist` como directorio de salida.
3. El repositorio incluye `.env.production` con `VITE_API_URL=https://ahorrapiero-api.onrender.com/api`. En **Settings → Environment Variables** de Vercel, añade ese mismo valor para que quede explícito también en el panel.
4. Despliega de nuevo. `vercel.json` permite que las rutas de React funcionen al recargar una página.

## Backend — Render

1. Crea un **Web Service** importando el repositorio del backend.
2. Configura `Build Command` como `npm ci` y `Start Command` como `npm start`.
3. Añade las variables privadas que ya utilizas localmente: `GEMINI_API_KEY`, `GEMINI_MODEL`, `GOOGLE_SHEET_ID`, `GOOGLE_CREDENTIALS_JSON` y `APORTACION_FIJA_INVERSION`. Añade también `FRONTEND_ORIGIN=https://ahorra-piero.vercel.app`.
4. No definas `PORT`: Render lo proporciona automáticamente.
5. Comprueba `https://ahorrapiero-api.onrender.com/api/health` tras el despliegue.

Render Free entra en reposo tras inactividad; la primera consulta puede tardar alrededor de un minuto. No guardes extractos en el disco del servidor: Render Free usa almacenamiento efímero. Esta API ya procesa el PDF en memoria y conserva datos en Google Sheets, por lo que es compatible.
