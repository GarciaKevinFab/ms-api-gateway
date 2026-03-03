FROM node:20-alpine

WORKDIR /app

# Copy shared code first (for layer caching)
COPY shared/ /app/shared/

# Copy service package files
COPY services/api-gateway/package*.json ./

RUN npm install --omit=dev

# Copy service source code
COPY services/api-gateway/ ./

EXPOSE 3000

CMD ["node", "server.js"]
