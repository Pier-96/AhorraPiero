# Despliegue

## Frontend — Vercel

1. Sube este repositorio a GitHub y crea un proyecto en Vercel importándolo.
2. Vercel detecta Vite. Usa `npm run build` como comando de build y `dist` como directorio de salida.
3. En **Settings → Environment Variables**, crea `VITE_API_URL` con la URL del backend de Render seguida de `/api`, por ejemplo `https://ahorrapiero-api.onrender.com/api`.
4. Despliega de nuevo. `vercel.json` permite que las rutas de React funcionen al recargar una página.

## Backend — Render

1. Crea un **Web Service** importando el repositorio del backend.
2. Configura `Build Command` como `npm ci` y `Start Command` como `npm start`.
3. Añade las variables privadas que ya utilizas localmente: `GEMINI_API_KEY`, `GEMINI_MODEL`, `GOOGLE_SHEET_ID`, `GOOGLE_CREDENTIALS_JSON` y `APORTACION_FIJA_INVERSION`. Añade también `FRONTEND_ORIGIN` con la URL final de Vercel, sin `/` al final.
4. No definas `PORT`: Render lo proporciona automáticamente.
5. Tras el primer despliegue, comprueba `https://TU-SERVICIO.onrender.com/api/health`; después usa esa URL en `VITE_API_URL` en Vercel.

Render Free entra en reposo tras inactividad; la primera consulta puede tardar alrededor de un minuto. No guardes extractos en el disco del servidor: Render Free usa almacenamiento efímero. Esta API ya procesa el PDF en memoria y conserva datos en Google Sheets, por lo que es compatible.
