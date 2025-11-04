const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === 'production'
            ? {
                  // In production (e.g., on AWS RDS), we require SSL.
                  // `rejectUnauthorized: false` is often used with services like Heroku or self-signed certs.
                  // For AWS RDS, you might not need it if you use the CA cert.
                  rejectUnauthorized: false,
              }
            : false, // In local development, explicitly disable SSL.
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};