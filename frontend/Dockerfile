# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Empty by default: production is served same-origin and nginx proxies
# /api and /uploads to the backend container.
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
# Template is processed by the nginx image entrypoint (envsubst):
# ${BACKEND_URL} is provided at container start.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
