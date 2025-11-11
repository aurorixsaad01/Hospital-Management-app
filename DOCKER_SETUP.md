# Docker Integration Guide

This document provides a comprehensive guide to building, running, and deploying the Hospital Management System using Docker.

## Overview

Docker containerization ensures your application runs consistently across development, testing, and production environments. The setup includes:

- **Multi-stage Dockerfile** for optimized production builds
- **Health check** endpoint for container orchestration
- **.dockerignore** to exclude unnecessary files
- **GitHub Actions CI/CD** for automated validation

## Prerequisites

- Docker 20.10+ and Docker Compose 2.0+ (optional)
- Node.js 20+ (for local development without Docker)
- Git

## Quick Start

### Build the Docker Image

```bash
docker build -t hms-app:latest .
```

### Run the Container Locally

```bash
docker run -d -p 8080:8080 --name hms-container hms-app:latest
```

Access the application:
- Main app: `http://localhost:8080`
- Health check: `http://localhost:8080/health`

### Stop and Remove the Container

```bash
docker stop hms-container
docker rm hms-container
```

## Development vs. Production

### Development (without Docker)

```bash
npm install
npm run dev  # Uses nodemon for auto-reload
```

### Production (with Docker)

```bash
docker build -t hms-app:prod .
docker run -d -p 8080:8080 --env NODE_ENV=production hms-app:prod
```

## Environment Variables

The Dockerfile sets default values, but you can override them at runtime:

```bash
docker run -d -p 8080:8080 \
  --env NODE_ENV=production \
  --env PORT=3000 \
  hms-app:latest
```

Common variables:
- `NODE_ENV`: Set to `production` for optimizations (default: `production`)
- `PORT`: Server port (default: `8080`)

## Firebase Configuration

Do NOT bake Firebase credentials into the Docker image. Instead:

1. Use environment variables for sensitive keys
2. Mount Firebase config files at runtime:

```bash
docker run -d -p 8080:8080 \
  -v $(pwd)/firebase-config.json:/app/config/firebase-config.json:ro \
  hms-app:latest
```

3. Or use Docker secrets (for Swarm/Kubernetes):

```bash
docker secret create firebase_config firebase-config.json
docker run -d -p 8080:8080 \
  --secret firebase_config \
  hms-app:latest
```

## Docker Compose (Optional)

For local development with multiple services, create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
```

Run with:

```bash
docker-compose up
```

## CI/CD Integration

### GitHub Actions

The included `.github/workflows/docker-build.yml` automatically:

1. **Builds** the Docker image on push to `main` and `develop` branches
2. **Validates** the build succeeds
3. **Tests** the container by running the `/health` endpoint

View workflow runs at: `https://github.com/your-username/Hospital-Management-app/actions`

### Manual Docker Build Test

```bash
# Build
docker build -t hms-app:test .

# Run
docker run -d -p 8080:8080 --name hms-test hms-app:test

# Test health endpoint
curl http://localhost:8080/health

# Check logs
docker logs hms-test

# Cleanup
docker stop hms-test && docker rm hms-test
```

## Deployment to Cloud Platforms

### Google Cloud Run

```bash
# Build and push to Google Container Registry
docker build -t gcr.io/your-project-id/hms-app:latest .
docker push gcr.io/your-project-id/hms-app:latest

# Deploy
gcloud run deploy hms-app \
  --image gcr.io/your-project-id/hms-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### AWS Elastic Container Service (ECS)

```bash
# Push to Amazon ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker build -t 123456789.dkr.ecr.us-east-1.amazonaws.com/hms-app:latest .
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/hms-app:latest
```

### Azure Container Instances

```bash
# Push to Azure Container Registry
az acr build --registry your-registry --image hms-app:latest .
az container create --resource-group your-rg \
  --name hms-app \
  --image your-registry.azurecr.io/hms-app:latest \
  --ports 8080 \
  --cpu 1 --memory 1
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs hms-container

# Run interactively
docker run -it hms-app:latest sh
```

### Port Already in Use

```bash
# Use a different host port
docker run -p 9000:8080 hms-app:latest

# Or find and stop the existing container
docker ps
docker stop <container-id>
```

### Image Size Too Large

The `.dockerignore` file prevents bloat. Verify:

```bash
# Check image size
docker images hms-app

# Inspect layers
docker history hms-app:latest
```

## Best Practices

1. **Always use tags**: `hms-app:v1.0.0` instead of relying on `latest`
2. **Pin Node version**: `node:20-alpine` ensures reproducibility
3. **Use `npm ci` over `npm install`**: Respects `package-lock.json` for deterministic builds
4. **Multi-stage builds**: Keeps final images small by excluding build dependencies
5. **Health checks**: Enable container orchestration platforms to detect unhealthy instances
6. **Environment-driven config**: Never hardcode secrets; use environment variables
7. **Regular updates**: Keep base images and dependencies current

## Files Added

- **`Dockerfile`**: Multi-stage build configuration
- **`.dockerignore`**: Excludes unnecessary files from build context
- **`server.js`**: Main Express application entry point
- **`package.json`**: Updated with `start` and `dev` scripts
- **`.github/workflows/docker-build.yml`**: GitHub Actions CI pipeline

## Next Steps

1. Test locally: `npm install && npm run dev`
2. Build Docker image: `docker build -t hms-app:dev .`
3. Run container: `docker run -p 8080:8080 hms-app:dev`
4. Push changes to GitHub to trigger CI/CD
5. Deploy to your chosen cloud platform

## Support

For issues or questions:
- Check Docker logs: `docker logs <container-name>`
- Review GitHub Actions: Visit your repository's Actions tab
- Consult Docker documentation: https://docs.docker.com/
