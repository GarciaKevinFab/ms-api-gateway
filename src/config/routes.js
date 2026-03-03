export const proxyRoutes = [
  {
    path: '/api/auth',
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    rewrite: { '^/api/auth': '/auth' },
  },
  {
    path: '/api/users',
    target: process.env.USERS_SERVICE_URL || 'http://localhost:3002',
    rewrite: { '^/api/users': '/users' },
  },
  {
    path: '/api/notifications',
    target: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3003',
    rewrite: { '^/api/notifications': '/notifications' },
  },
  {
    path: '/api/payments',
    target: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3004',
    rewrite: { '^/api/payments': '/payments' },
  },
  {
    path: '/api/files',
    target: process.env.FILE_SERVICE_URL || 'http://localhost:3005',
    rewrite: { '^/api/files': '/files' },
  },
  {
    path: '/api/pdf',
    target: process.env.PDF_SERVICE_URL || 'http://localhost:3006',
    rewrite: { '^/api/pdf': '/pdf' },
  },
  {
    path: '/api/email',
    target: process.env.EMAIL_SERVICE_URL || 'http://localhost:3007',
    rewrite: { '^/api/email': '/email' },
  },
  {
    path: '/api/reniec',
    target: process.env.RENIEC_SERVICE_URL || 'http://localhost:3008',
    rewrite: { '^/api/reniec': '/reniec' },
  },
  {
    path: '/api/crypto',
    target: process.env.CRYPTO_SERVICE_URL || 'http://localhost:3009',
    rewrite: { '^/api/crypto': '/crypto' },
  },
];
