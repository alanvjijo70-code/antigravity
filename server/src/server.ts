import { app } from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌱 AgriSense AI Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`🔒 Supabase URL: ${env.SUPABASE_URL}`);
  console.log(`🤖 Gemini AI Model: ${env.GEMINI_MODEL}`);
  console.log(`=======================================================`);
});
