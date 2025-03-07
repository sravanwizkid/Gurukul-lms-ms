import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger';

dotenv.config();

// Convert PORT to number explicitly
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = app.listen(port, '0.0.0.0', () => {
  logger.info(`Server is running on port ${port}`);
});

export default server;

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
}); 