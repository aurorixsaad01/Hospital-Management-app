# Docker Quick Reference

## Essential Commands Cheat Sheet

### Image Management

```bash
# Build image
docker build -t hms-app:latest .

# List images
docker images

# Remove image
docker rmi hms-app:latest

# View image history and layers
docker history hms-app:latest

# Inspect image details
docker inspect hms-app:latest
```

### Container Management

```bash
# Run container (foreground)
docker run -p 8080:8080 hms-app:latest

# Run container (background)
docker run -d -p 8080:8080 --name hms-app hms-app:latest

# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop hms-app

# Start container
docker start hms-app

# Remove container
docker rm hms-app

# Restart container
docker restart hms-app
```

### Logs & Debugging

```bash
# View container logs
docker logs hms-app

# Follow logs (tail)
docker logs -f hms-app

# Show last 50 lines
docker logs --tail 50 hms-app

# Execute command in running container
docker exec -it hms-app sh

# View resource usage
docker stats hms-app
```

### Common Workflow

```bash
# Build
docker build -t hms-app:dev .

# Run with port mapping
docker run -d -p 8080:8080 --name hms-app hms-app:dev

# Test health endpoint
curl http://localhost:8080/health

# View logs
docker logs hms-app

# Stop and cleanup
docker stop hms-app && docker rm hms-app
```

### Docker Compose (If using)

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Run one-off command
docker-compose exec app sh
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 8080 already in use | Use `-p 9000:8080` to map to different port |
| Container exits immediately | Check logs: `docker logs <name>` |
| Can't connect to localhost:8080 | Ensure container is running: `docker ps` |
| Large image size | Check `.dockerignore` excludes node_modules |
| Permission denied errors | Run with `sudo` or add user to docker group |

## Environment Variables

```bash
# Run with environment variables
docker run -d -p 8080:8080 \
  --env NODE_ENV=production \
  --env PORT=8080 \
  hms-app:latest
```

## Mount Volumes (for Firebase config)

```bash
# Mount entire directory
docker run -d -p 8080:8080 \
  -v $(pwd)/config:/app/config \
  hms-app:latest

# Mount single file (read-only)
docker run -d -p 8080:8080 \
  -v $(pwd)/firebase-config.json:/app/config/firebase-config.json:ro \
  hms-app:latest
```

## Network Connectivity

```bash
# Create a network
docker network create hms-network

# Run container on network
docker run -d --name hms-app --network hms-network hms-app:latest

# Connect existing container to network
docker network connect hms-network existing-container
```

## Optimization Tips

1. **Use .dockerignore** to exclude unnecessary files
2. **Multi-stage builds** reduce final image size
3. **Use alpine images** for smaller base images
4. **Pin versions** (node:20-alpine not node:latest)
5. **Layer caching** - put frequently changing code last

## Useful Patterns

### Quick cleanup

```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune

# Remove all unused volumes
docker volume prune
```

### Restart policy

```bash
docker run -d \
  --restart always \
  -p 8080:8080 \
  hms-app:latest
```

Restart policies: `no`, `always`, `unless-stopped`, `on-failure`

### Resource limits

```bash
docker run -d \
  --memory 512m \
  --cpus 1.0 \
  -p 8080:8080 \
  hms-app:latest
```

---

For detailed documentation, see `DOCKER_SETUP.md`
