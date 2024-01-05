import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//
const mm = '🌀🌀🌀🌀 main';
async function bootstrap() {
  console.log(`${mm} ... bootstrap started for Gemini Backend ...`);
  const app = await NestFactory.create(AppModule);
  //app.use({origin: true})
  const port = process.env.PORT || 3000;
  const key = process.env.GEMINI_API_KEY;
  console.log(`${mm} Gemini AI API key: ${key}`);
  await app.listen(port);
  console.log(`${mm} Gemini Backend started OK 🌿🌿🌿 PORT: ${port}`);
}

bootstrap();
