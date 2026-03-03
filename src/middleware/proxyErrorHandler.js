/**
 * Handles errors that occur when proxying requests to downstream services.
 * Attached to each createProxyMiddleware instance via the `on.error` callback.
 */
export function proxyErrorHandler(err, req, res) {
  const target = req.proxyTarget || 'unknown';

  console.error(
    `[Proxy Error] ${req.method} ${req.originalUrl} -> ${target} : ${err.code || err.message}`
  );

  // Don't attempt to send headers if they have already been sent
  if (res.headersSent) {
    return;
  }

  const statusMap = {
    ECONNREFUSED: 503,
    ETIMEDOUT: 504,
    ECONNRESET: 502,
    ENOTFOUND: 502,
  };

  const statusCode = statusMap[err.code] || 502;

  const messageMap = {
    503: 'Service unavailable. The downstream service is not running.',
    504: 'Gateway timeout. The downstream service took too long to respond.',
    502: 'Bad gateway. Could not reach the downstream service.',
  };

  res.status(statusCode).json({
    success: false,
    message: messageMap[statusCode] || 'An unexpected proxy error occurred.',
    service: target,
  });
}
