import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import studentRoutes from './routes/studentRoutes';

// Add interface for route layer
interface RouteLayer {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
  name?: string;
  handle: {
    stack: RouteLayer[];
  };
}

const app = express();
console.log('Creating Express app');

// 1. Trust proxy settings - multiple ways
app.enable('trust proxy');  // Try this instead of app.set
app.set('trust proxy', 1);  // And this with a number

// 2. Essential middleware only
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false  // Try disabling CSP temporarily
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Debug middleware
app.use((req, res, next) => {
  console.log('Request details:', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    ips: req.ips,
    proxy: req.get('x-forwarded-for')
  });
  next();
});

// 4. Routes
app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

app.get('/_health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/students', studentRoutes);

// 404 handler - add before error handler
app.use((req, res) => {
  console.log('404 Not Found:', {
    method: req.method,
    path: req.path,
    url: req.url
  });
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Add after mounting routes
console.log('Routes mounted:', {
  stack: app._router.stack
    .filter((r: RouteLayer) => r.route || (r.name === 'router' && r.handle.stack))
    .map((r: RouteLayer) => r.route ? 
      `${Object.keys(r.route.methods)} ${r.route.path}` : 
      'router middleware'
    )
});

// Add after routes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Add after all middleware
console.log('All middleware mounted');

// Add after routes
console.log('Final route stack:', app._router.stack.map((layer: RouteLayer) => ({
  name: layer.name,
  path: layer.route?.path,
  type: layer.route ? 'route' : (layer.name || 'middleware')
})));

export default app; 