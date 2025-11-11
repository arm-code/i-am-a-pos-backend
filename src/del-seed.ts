// src/dseed.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function deleteAll() {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const dataSource = appContext.get(DataSource);

  try {
    console.log('⚠️  Iniciando limpieza completa de la base de datos...');

    // Usa queryRunner para evitar problemas de claves foráneas
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    // Desactiva temporalmente las restricciones de foreign keys
    await queryRunner.query('SET session_replication_role = replica;');

    // Obtiene todas las tablas registradas en las entidades
    const tables = dataSource.entityMetadatas.map((meta) => `"${meta.tableName}"`);
    console.log(`🔍 Tablas detectadas: ${tables.join(', ')}`);

    for (const table of tables) {
      await queryRunner.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
      console.log(`🧹 Tabla vaciada: ${table}`);
    }

    // Reactiva las restricciones
    await queryRunner.query('SET session_replication_role = DEFAULT;');
    await queryRunner.release();

    console.log('✅ Base de datos limpiada exitosamente.');
  } catch (err) {
    console.error('❌ Error al limpiar la base de datos:', err);
    process.exitCode = 1;
  } finally {
    await appContext.close();
  }
}

deleteAll();
