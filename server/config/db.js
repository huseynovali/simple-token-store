
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',            
  host: 'localhost',           
  database: 'postgres',   
  password: 'Ali20031001a',   
  port: 5000,                  
});

module.exports = pool;
