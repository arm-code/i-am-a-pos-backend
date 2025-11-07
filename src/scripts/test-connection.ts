// src/scripts/test-connection.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

async function testConnection() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.BD_HOST,
    port: Number(process.env.BD_PORT),
    username: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_DATABASENAME,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Verificar tablas existentes
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📊 Tablas existentes en la base de datos:');
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }
}

testConnection();