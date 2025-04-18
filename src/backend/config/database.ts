import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';

const envPath = path.join(__dirname, '../../../.env');
console.log('Looking for .env file at:', envPath);

// Load .env from root directory
dotenv.config({ path: envPath });

// Debug environment variables
console.log('Loading environment variables:', {
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  NODE_ENV: process.env.NODE_ENV,
  envPath: envPath,
});

// Debug connection config
const dbConfig = {
  host: process.env.NODE_ENV === 'production' 
    ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
    : process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Remove port for production as it uses Unix socket
  ...(process.env.NODE_ENV !== 'production' && {
    port: Number(process.env.DB_PORT)
  })
};

// Remove excessive logging in production
if (process.env.NODE_ENV !== 'production') {
  console.log('Database config:', {
    host: dbConfig.host,
    database: dbConfig.database,
    user: dbConfig.user,
    NODE_ENV: process.env.NODE_ENV,
    hasPassword: !!dbConfig.password
  });
}

// Create and export pool once
export const pool = new Pool(dbConfig);

// Define PostgreSQL error type
interface PostgresError extends Error {
  code?: string;
}

// Test database connection
pool.connect()
  .then(client => {
    logger.info('Database connected successfully');
    client.release();
  })
  .catch(err => {
    logger.error('Database connection error:', {
      message: err.message,
      code: err.code,
    });
    // Don't exit in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  });

// Log connection details (remove in production)
console.log('Database connection config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

// Add error handling
pool.on('error', (err: Error & { code?: string }) => {
  console.error('Detailed pool error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    ...(err.code && { code: err.code })  // Only include code if it exists
  });
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Verify connection settings 