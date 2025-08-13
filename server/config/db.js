const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',            
  host: 'localhost',           
  database: 'postgres',   
  password: 'Ali20031001a',   
  port: 5000,                  
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL database bağlantısı başarılı');
});

pool.on('error', (err, client) => {
  console.error('❌ PostgreSQL database bağlantı hatası:', err);
});

module.exports = pool;
