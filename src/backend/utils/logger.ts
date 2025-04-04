// Cloud Run structured logging
const cloudLogger = {
  info: (message: string, data?: any) => {
    console.log('INFO:', message, data ? JSON.stringify(data) : '');
  },

  error: (message: string, error?: any) => {
    console.error('ERROR:', message, error ? JSON.stringify(error) : '');
  },

  request: (req: any) => {
    console.log('REQUEST:', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      headers: req.headers
    });
  }
};

export default cloudLogger; 