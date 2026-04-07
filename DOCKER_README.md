# DevOps Engineer Challenge - Docker Setup

Complete Docker containerization for the Student Management System with multi-container orchestration using Docker Compose.

## 📁 Files Created

| File | Location | Purpose |
|------|----------|---------|
| `Dockerfile` | `frontend/Dockerfile` | Multi-stage Node.js + Nginx build |
| `Dockerfile` | `backend/Dockerfile` | Optimized Node.js production image |
| `docker-compose.yml` | Root | Full stack orchestration |
| `nginx.conf` | `frontend/nginx.conf` | Nginx configuration with SPA routing |
| `.dockerignore` | `frontend/.dockerignore` | Optimized build context |
| `.dockerignore` | `backend/.dockerignore` | Optimized build context |
| `.env.docker.example` | Root | Environment configuration template |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network (bridge)                   │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌────────────┐  │
│  │  Frontend    │◄────►│   Backend    │◄────►│  Postgres  │  │
│  │  (Nginx)     │      │   (Node.js)  │      │  (DB)      │  │
│  │   Port: 80   │      │   Port: 5007 │      │ Port: 5432 │  │
│  └──────────────┘      └──────────────┘      └────────────┘  │
│        ▲                                                    │
│        │                                                    │
│   Exposed: 5173                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker Engine 20.10+ 
- Docker Compose 2.0+
- 2GB+ available RAM

### 1. Environment Setup

```bash
# Copy the environment template
cp .env.docker.example .env.docker

# Edit secrets (optional for local development)
nano .env.docker
```

### 2. Build and Launch

```bash
# Build all services and start
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 3. Verify Deployment

| Service | URL | Health Check |
|---------|-----|--------------|
| Frontend | http://localhost:5173 | N/A |
| Backend API | http://localhost:5007 | http://localhost:5007/api/v1/health |
| Database | localhost:5432 | Internal only |

**Demo Credentials:**
- Email: `admin@school-admin.com`
- Password: `3OU4zn3q6Zh9`

## 🔧 Docker Features Implemented

### Frontend Dockerfile
- **Multi-stage build**: Separate build and production stages
- **Layer caching**: Dependencies cached before source copy
- **Nginx serving**: Optimized static file serving
- **Gzip compression**: Enabled for better performance
- **Security headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **SPA routing**: Client-side routing support via Nginx try_files

### Backend Dockerfile
- **Alpine Linux**: Minimal attack surface (~5MB base)
- **Non-root user**: Runs as `nodejs` user (security best practice)
- **dumb-init**: Proper signal handling for graceful shutdown
- **Production dependencies only**: Smaller image size
- **Health checks**: Built-in container health monitoring

### Docker Compose
- **Service dependencies**: Backend waits for database to be healthy
- **Health checks**: All services have proper health monitoring
- **Named volumes**: Database persistence across restarts
- **Custom network**: Isolated bridge network for service communication
- **Restart policies**: `unless-stopped` for resilience
- **Environment variables**: Configurable via `.env.docker`

### Database Initialization
- **Automatic seeding**: `tables.sql` and `seed-db.sql` run on first startup
- **Persistent storage**: Data survives container restarts
- **Health checks**: PostgreSQL ready check before dependent services start

## 🛠️ Useful Commands

```bash
# View logs
docker-compose logs -f [service_name]

# Scale backend instances
docker-compose up -d --scale backend=3

# Restart specific service
docker-compose restart backend

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ DELETES DATABASE DATA)
docker-compose down -v

# Execute commands in containers
docker-compose exec postgres psql -U postgres -d school_mgmt
docker-compose exec backend sh

# Check container status
docker-compose ps

# Resource usage
docker stats
```

## 🔐 Security Considerations

### Secrets Management
- Never commit `.env.docker` to version control
- Use Docker Secrets or external vaults in production
- Rotate JWT and CSRF secrets regularly
- All secrets default to insecure values for development only

### Container Security
- Frontend runs as non-root user
- Backend uses minimal Alpine Linux image
- No sensitive data in image layers
- `.dockerignore` prevents secret leakage

### Network Security
- Services communicate via isolated Docker network
- Database not exposed externally (only via port mapping)
- CORS configured for local development

## 📊 Production Considerations

### Before Deploying to Production:

1. **Change all secrets** in `.env.docker`
2. **Enable HTTPS** (use reverse proxy like Traefik or Nginx)
3. **Remove port mappings** for database
4. **Configure log aggregation** (Fluentd, ELK stack)
5. **Set up monitoring** (Prometheus, Grafana)
6. **Use external database** (RDS, Cloud SQL)
7. **Enable backup strategy** for database

### Example Production docker-compose.yml modifications:

```yaml
services:
  frontend:
    environment:
      VITE_API_URL: https://api.yourdomain.com
    # Remove port binding, use reverse proxy
    
  backend:
    environment:
      DATABASE_URL: ${PROD_DATABASE_URL}  # External DB
      NODE_ENV: production
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## 🧪 Testing the Setup

```bash
# 1. Test health endpoint
curl http://localhost:5007/api/v1/health

# 2. Test authentication
curl -X POST http://localhost:5007/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school-admin.com","password":"3OU4zn3q6Zh9"}'

# 3. Verify database seeding
docker-compose exec postgres psql -U postgres -d school_mgmt -c "SELECT COUNT(*) FROM users;"
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change port mapping in `docker-compose.yml` |
| Database connection failed | Wait for postgres health check, then restart backend |
| Frontend blank page | Check browser console for CORS errors |
| Changes not reflecting | Rebuild with `docker-compose up --build` |
| Permission denied | Run `docker-compose` without sudo or add user to docker group |

## 📚 References

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
