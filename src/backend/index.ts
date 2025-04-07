import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger';

dotenv.config();

// Convert PORT to number explicitly
const port = Number(process.env.PORT) || 3000;

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', {
    reason,
    promise
  });
});

// Add graceful shutdown
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check endpoint: http://localhost:${port}/_health`);
});

// Enhanced error handling for server
server.on('error', (error: NodeJS.ErrnoException) => {
  console.error('Server error:', {
    code: error.code,
    message: error.message,
    stack: error.stack
  });

  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  }
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

export default server;
