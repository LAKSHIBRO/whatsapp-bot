#!/bin/bash

# WhatsApp AI Bot - Digital Ocean Deployment Script

set -e

echo "🚀 Deploying WhatsApp AI Bot to Digital Ocean..."

# Configuration
DROPLET_IP="${DROPLET_IP:-your-droplet-ip}"
SSH_USER="${SSH_USER:-root}"
APP_DIR="/opt/whatsapp-ai-bot"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📡 Connecting to droplet: $SSH_USER@$DROPLET_IP${NC}"

# Deploy via SSH
ssh $SSH_USER@$DROPLET_IP << 'ENDSSH'
set -e

APP_DIR="/opt/whatsapp-ai-bot"

# Create app directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
    echo "📁 Creating application directory..."
    mkdir -p $APP_DIR
    cd $APP_DIR
    
    # Initialize git if this is first deployment
    echo "🔄 Setting up repository..."
    git init
else
    cd $APP_DIR
fi

# Pull latest changes (or clone if needed)
echo "📥 Pulling latest code..."
git pull origin main || echo "Note: First deployment or no remote set"

# Create data directories if they don't exist
echo "📁 Creating required directories..."
mkdir -p data/.wwebjs_auth
chmod -R 755 data

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Please create .env file with your configuration"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Build and start containers
echo "🔨 Building Docker image..."
docker-compose build

echo "▶️  Starting containers..."
docker-compose up -d

# Wait for container to be ready
echo "⏳ Waiting for bot to initialize..."
sleep 5

# Show logs
echo "📋 Container logs:"
docker-compose logs --tail=50

echo "✅ Deployment complete!"
echo "📱 Please scan the QR code if this is first time setup"
echo "📊 View logs: docker-compose logs -f"
echo "🔄 Restart: docker-compose restart"
echo "🛑 Stop: docker-compose down"

ENDSSH

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
