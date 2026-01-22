#!/bin/bash

# Gemini Software - Production Deployment Script
# This script builds and deploys both frontend and backend

set -e  # Exit on error

echo "🚀 Starting Gemini Software Deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/gemini-backend"
FRONTEND_DIR="$PROJECT_ROOT/gemini-astro"
BACKUP_DIR="$PROJECT_ROOT/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create logs directory
mkdir -p logs
mkdir -p "$BACKUP_DIR"

echo ""
echo "${BLUE}📦 Step 1: Backing up database...${NC}"
if [ -f "$BACKEND_DIR/prisma/prod.db" ]; then
  cp "$BACKEND_DIR/prisma/prod.db" "$BACKUP_DIR/prod_${TIMESTAMP}.db"
  echo "${GREEN}✓ Database backed up to: backups/prod_${TIMESTAMP}.db${NC}"
else
  echo "${YELLOW}⚠  No existing database found (first deployment?)${NC}"
fi

echo ""
echo "${BLUE}📦 Step 2: Installing dependencies...${NC}"

# Backend dependencies
echo "   Backend..."
cd "$BACKEND_DIR"
npm ci --production=false
echo "${GREEN}   ✓ Backend dependencies installed${NC}"

# Frontend dependencies
echo "   Frontend..."
cd "$FRONTEND_DIR"
npm ci --production=false
echo "${GREEN}   ✓ Frontend dependencies installed${NC}"

echo ""
echo "${BLUE}🏗️  Step 3: Building Backend...${NC}"
cd "$BACKEND_DIR"

# Generate Prisma Client
echo "   Generating Prisma Client..."
npx prisma generate
echo "${GREEN}   ✓ Prisma Client generated${NC}"

# Build TypeScript
echo "   Compiling TypeScript..."
npm run build
echo "${GREEN}   ✓ Backend built successfully${NC}"

# Run migrations
echo "   Running database migrations..."
npx prisma migrate deploy
echo "${GREEN}   ✓ Migrations completed${NC}"

echo ""
echo "${BLUE}🏗️  Step 4: Building Frontend...${NC}"
cd "$FRONTEND_DIR"

# Build Astro
echo "   Building Astro (this may take a minute)..."
npm run build:prod
echo "${GREEN}   ✓ Frontend built successfully${NC}"

echo ""
echo "${BLUE}🔄 Step 5: Managing PM2 processes...${NC}"

# Stop existing processes
pm2 stop ecosystem.config.js || true
echo "${YELLOW}   Stopped existing processes${NC}"

# Start new processes
cd "$PROJECT_ROOT"
pm2 start ecosystem.config.js --env production
echo "${GREEN}   ✓ PM2 processes started${NC}"

# Save PM2 configuration
pm2 save
echo "${GREEN}   ✓ PM2 configuration saved${NC}"

echo ""
echo "${BLUE}🔍 Step 6: Health Check...${NC}"

sleep 5  # Wait for services to start

# Check backend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/projects | grep -q "200"; then
  echo "${GREEN}   ✓ Backend is healthy (Port 3001)${NC}"
else
  echo "${RED}   ✗ Backend health check failed${NC}"
  pm2 logs gemini-backend --lines 20
  exit 1
fi

# Check frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4321 | grep -q "200"; then
  echo "${GREEN}   ✓ Frontend is healthy (Port 4321)${NC}"
else
  echo "${RED}   ✗ Frontend health check failed${NC}"
  pm2 logs gemini-frontend --lines 20
  exit 1
fi

echo ""
echo "${BLUE}📊 Step 7: Post-Deployment Info${NC}"
echo "   PM2 Status:"
pm2 status
echo ""
echo "   Disk Usage:"
du -sh "$BACKEND_DIR/dist" "$FRONTEND_DIR/dist"
echo ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "${BLUE}Services:${NC}"
echo "   Backend API:  http://localhost:3001"
echo "   Frontend:     http://localhost:4321"
echo ""
echo "${BLUE}Useful Commands:${NC}"
echo "   ${YELLOW}pm2 logs${NC}              - View all logs"
echo "   ${YELLOW}pm2 logs gemini-backend${NC}    - Backend logs"
echo "   ${YELLOW}pm2 logs gemini-frontend${NC}   - Frontend logs"
echo "   ${YELLOW}pm2 restart all${NC}       - Restart all services"
echo "   ${YELLOW}pm2 stop all${NC}          - Stop all services"
echo ""
echo "🎉 Happy deploying!"
