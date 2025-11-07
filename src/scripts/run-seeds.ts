// src/scripts/run-seeds.ts
import { NestFactory } from '@nestjs/core';
import { SeedService } from '../seeds/seed.service';
import { SeedModule } from '../seeds/seed.module';



async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  
  try {
    await seedService.runSeeds();
    console.log('Seeds ejecutados exitosamente!');
  } catch (error) {
    console.error('Error ejecutando seeds:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();