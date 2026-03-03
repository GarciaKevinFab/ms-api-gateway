import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { requestLogger } from '../../shared/middleware/requestLogger.js';
import { errorHandler, notFound } from '../../shared/middleware/errorHandler.js';
import { proxyRoutes } from './config/routes.js';
import { globalLimiter } from './config/rateLimits.js';
import { proxyErrorHandler } from './middleware/proxyErrorHandler.js';

const app = express();

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(cors());
app.use(globalLimiter);
app.use(requestLogger);

// ---------------------------------------------------------------------------
// Health endpoint - aggregates health from all downstream services
// ---------------------------------------------------------------------------
app.get('/health', async (_req, res) => {
  const results = {};
  const checks = proxyRoutes.map(async (route) => {
    const serviceName = route.path.replace('/api/', '');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${route.target}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      results[serviceName] = {
        status: response.ok ? 'healthy' : 'unhealthy',
        statusCode: response.status,
      };
    } catch (err) {
      results[serviceName] = {
        status: 'unavailable',
        error: err.cause?.code || err.message,
      };
    }
  });

  await Promise.allSettled(checks);

  const allHealthy = Object.values(results).every(
    (r) => r.status === 'healthy'
  );

  res.status(allHealthy ? 200 : 503).json({
    success: true,
    service: 'api-gateway',
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: results,
  });
});

// ---------------------------------------------------------------------------
// Proxy routes - register each downstream service
// ---------------------------------------------------------------------------
for (const route of proxyRoutes) {
  app.use(
    route.path,
    createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      pathRewrite: route.rewrite,
      on: {
        error: (err, req, res) => {
          req.proxyTarget = route.target;
          proxyErrorHandler(err, req, res);
        },
      },
    })
  );
}

// ---------------------------------------------------------------------------
// Fallback handlers
// ---------------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

export default app;
