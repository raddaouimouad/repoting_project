# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Backend Runner
FROM node:22-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend source
COPY backend/ ./

# Copy built frontend assets to where backend/app.js serves them
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
