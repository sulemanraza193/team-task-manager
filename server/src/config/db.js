const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle unexpected connection errors
pool.on('error', (err) => {
  console.error('Unexpected DB error:', err.message);
});

pool.connect()
  .then(() => console.log('✅ Connected to Neon PostgreSQL'))
  .catch((err) => console.error('❌ DB connection error:', err.message));

module.exports = pool;
