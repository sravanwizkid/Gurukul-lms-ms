// Simple structured logger for Cloud Run
export const logger = {
  info: (message: string, data?: any) => {
    console.log(JSON.stringify({
      severity: 'INFO',
      message,
      data
    }));
  },

  error: (message: string, error?: any) => {
    console.error(JSON.stringify({
      severity: 'ERROR',
      message,
      error: error instanceof Error ? error.message : error
    }));
  },

  warn: (message: string, data?: any) => {
    console.warn(JSON.stringify({
      severity: 'WARNING',
      message,
      data
    }));
  }
};
