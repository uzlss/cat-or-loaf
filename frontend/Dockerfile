# Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy manifests first for better layer caching
COPY package*.json ./

# Use lockfile if present for reproducible builds; otherwise do a best-effort install
RUN sh -lc 'if [ -f package-lock.json ]; then npm ci; else npm install --no-audit --no-fund; fi'

# Build args / env
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Now copy the rest and build
COPY . .
RUN npm run build

# Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
