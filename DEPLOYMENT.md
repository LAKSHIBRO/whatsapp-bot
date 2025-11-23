# Digital Ocean Deployment Guide

Simple guide to deploy WhatsApp AI bot on Digital Ocean.

## Prerequisites

- Digital Ocean account
- SSH key setup
- Gemini API key

## Step 1: Create Droplet

1. Go to Digital Ocean dashboard
2. Create → Droplets
3. Choose:
   - **Image**: Ubuntu 24.04 LTS
   - **Plan**: Basic ($6/month, 1GB RAM)
   - **Region**: Choose closest to you
   - **SSH Key**: Add your SSH key
4. Create Droplet
5. Note the IP address

## Step 2: Setup Server

SSH into your droplet:
```bash
ssh root@your-droplet-ip
```

Install Docker:
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify
docker --version
docker-compose --version
```

## Step 3: Deploy Bot

### Option A: Using Deploy Script (Recommended)

From your local machine:

```bash
# Set droplet IP
export DROPLET_IP=your-droplet-ip

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Copy files to server
- Create directories
- Setup environment
- Build and start Docker container

### Option B: Manual Deployment

From your local machine:

```bash
# Copy files to server
scp -r * root@your-droplet-ip:/root/whatsapp-bot/

# SSH into server
ssh root@your-droplet-ip

# Navigate to bot directory
cd /root/whatsapp-bot

# Setup environment
cp .env.example .env
nano .env  # Add your GEMINI_API_KEY

# Create auth directory
mkdir -p .wwebjs_auth

# Start bot
docker-compose up -d
```

## Step 4: Scan QR Code

View logs and scan QR:
```bash
docker-compose logs -f
```

1. QR code appears in logs
2. Open WhatsApp on phone
3. Settings → Linked Devices → Link a Device
4. Scan the QR code from terminal
5. Wait for "WhatsApp Bot is ready!" message

Press `Ctrl+C` to exit logs (bot keeps running).

## Managing the Bot

### View Logs
```bash
docker-compose logs -f
```

### Restart Bot
```bash
docker-compose restart
```

### Stop Bot
```bash
docker-compose down
```

### Start Bot
```bash
docker-compose up -d
```

### Update Code
```bash
# Stop bot
docker-compose down

# Pull latest code or make changes
# ...

# Rebuild and start
docker-compose up -d --build
```

## Troubleshooting

### Bot won't start
```bash
# Check logs
docker-compose logs

# Check if port is in use
netstat -tulpn | grep docker

# Restart Docker
systemctl restart docker
```

### QR code not appearing
```bash
# Remove old session and restart
rm -rf .wwebjs_auth
docker-compose restart
docker-compose logs -f
```

### Out of memory
```bash
# Check memory usage
free -h

# Restart bot
docker-compose restart
```

### WhatsApp disconnected
```bash
# Check logs
docker-compose logs -f

# If needed, rescan QR
rm -rf .wwebjs_auth
docker-compose restart
```

## Firewall Setup (Optional)

```bash
# Enable firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## Backup Session

Backup WhatsApp session data:

```bash
# From server
cd /root/whatsapp-bot
tar -czf session-backup.tar.gz .wwebjs_auth

# Download to local machine
scp root@your-droplet-ip:/root/whatsapp-bot/session-backup.tar.gz .
```

Restore session:
```bash
# Upload to server
scp session-backup.tar.gz root@your-droplet-ip:/root/whatsapp-bot/

# On server
cd /root/whatsapp-bot
tar -xzf session-backup.tar.gz
docker-compose restart
```

## Cost Estimate

- **Droplet**: $6/month (1GB RAM)
- **Gemini API**: ~$2/month (moderate usage)
- **Total**: ~$8/month

## Security Notes

⚠️ **Change default SSH port**
⚠️ **Setup firewall**
⚠️ **Use non-root user** (optional but recommended)
⚠️ **Keep `.env` file secure**
⚠️ **Regular backups of `.wwebjs_auth/`**

## Support

If bot stops working:
1. Check logs: `docker-compose logs`
2. Restart: `docker-compose restart`
3. Rescan QR: Delete `.wwebjs_auth` and restart
4. Check server resources: `htop` or `free -h`
