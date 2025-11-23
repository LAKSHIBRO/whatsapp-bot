# Digital Ocean Deployment Guide

Complete guide for deploying the WhatsApp AI Bot on Digital Ocean.

## 💰 Recommended Droplet

**Basic Droplet - $6/month**
- 1 GB RAM
- 1 vCPU
- 25 GB SSD
- Ubuntu 22.04 LTS

This is sufficient for moderate usage (up to ~5000 messages/day).

## 🚀 Initial Setup

### 1. Create Droplet

1. Log into [Digital Ocean](https://digitalocean.com)
2. Click **Create** → **Droplets**
3. Choose:
   - **Image**: Ubuntu 22.04 LTS
   - **Droplet Type**: Basic
   - **CPU Options**: Regular ($6/month)
   - **Region**: Closest to your users
   - **Authentication**: SSH keys (recommended)
4. Click **Create Droplet**

### 2. Initial Server Setup

SSH into your droplet:
```bash
ssh root@your-droplet-ip
```

Update system:
```bash
apt update && apt upgrade -y
```

Install Docker:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Start Docker on boot
systemctl enable docker
```

Create app directory:
```bash
mkdir -p /opt/whatsapp-ai-bot
cd /opt/whatsapp-ai-bot
```

### 3. Deploy Application

**Option A: Using Git (Recommended)**

```bash
cd /opt/whatsapp-ai-bot

# Clone your repository
git clone <your-repo-url> .

# Or initialize and pull
git init
git remote add origin <your-repo-url>
git pull origin main
```

**Option B: Manual Upload**

Upload files using SCP from your local machine:
```bash
scp -r whatsapp-ai-bot/* root@your-droplet-ip:/opt/whatsapp-ai-bot/
```

### 4. Configure Environment

Create `.env` file on the droplet:
```bash
cd /opt/whatsapp-ai-bot
nano .env
```

Add your configuration:
```env
GEMINI_API_KEY=your_actual_api_key_here
MAX_CONTEXT_MESSAGES=20
BOT_NAME=AI Assistant
```

Save with `Ctrl+X`, `Y`, `Enter`.

### 5. Start the Bot

Build and start:
```bash
docker-compose up -d
```

View logs and QR code:
```bash
docker-compose logs -f
```

**Scan the QR code with your WhatsApp to link the device.**

## 🔧 Management Commands

```bash
# View live logs
docker-compose logs -f

# Restart bot
docker-compose restart

# Stop bot
docker-compose down

# Rebuild after code changes
docker-compose down
docker-compose build
docker-compose up -d

# View running containers
docker ps

# Access container shell
docker-compose exec whatsapp-bot sh
```

## 💾 Backup & Persistence

Important files are stored in `./data/`:
- `.wwebjs_auth/` - WhatsApp session (needed to stay logged in)
- `conversations.db` - User conversation history

**Backup regularly:**
```bash
# Create backup
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Download backup to local machine
scp root@your-droplet-ip:/opt/whatsapp-ai-bot/backup-*.tar.gz ./
```

**Restore:**
```bash
# Upload backup
scp backup-20240101.tar.gz root@your-droplet-ip:/opt/whatsapp-ai-bot/

# Extract
tar -xzf backup-20240101.tar.gz
```

## 🔒 Security Best Practices

1. **Create non-root user:**
   ```bash
   adduser botadmin
   usermod -aG docker botadmin
   su - botadmin
   ```

2. **Configure firewall:**
   ```bash
   ufw allow OpenSSH
   ufw enable
   ```

3. **Disable root SSH login:**
   ```bash
   nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   systemctl restart sshd
   ```

4. **Keep API keys secure:**
   - Never commit `.env` to git
   - Use environment variables
   - Rotate keys periodically

## 📊 Monitoring

**Check bot status:**
```bash
docker-compose ps
```

**Monitor resource usage:**
```bash
docker stats
```

**Check disk space:**
```bash
df -h
```

**Monitor logs:**
```bash
# Last 50 lines
docker-compose logs --tail=50

# Follow logs
docker-compose logs -f

# Search logs
docker-compose logs | grep "error"
```

## 🔄 Auto-restart on Failure

Docker Compose is configured with `restart: unless-stopped`, so:
- Bot auto-restarts if it crashes
- Bot starts automatically after server reboot

Verify:
```bash
docker-compose config | grep restart
```

## 🐛 Troubleshooting

**Bot won't start:**
```bash
# Check logs for detailed error messages
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up
```

**Chromium/Chrome failed to start:**
```bash
# Verify Chromium is installed
docker-compose exec whatsapp-bot chromium-browser --version

# Check if shared memory is configured
docker-compose config | grep shm_size

# If shm_size is missing, add to docker-compose.yml:
# shm_size: '2gb'

# Restart with increased verbosity
docker-compose down
docker-compose up
```

**QR code not showing:**
```bash
# View logs with timestamps
docker-compose logs -f --timestamps

# Check if bot is stuck at initialization
docker-compose exec whatsapp-bot ps aux
```

**Permission denied errors:**
```bash
# Fix ownership of data directory on host
sudo chown -R $USER:$USER ./data

# Or rebuild with proper permissions
docker-compose down
docker-compose build --no-cache
docker-compose up
```

**Out of memory:**
```bash
# Check memory usage
free -h

# Check container memory
docker stats

# Upgrade to larger droplet if needed
```

**Database locked:**
```bash
# Restart container
docker-compose restart

# If still locked, stop all and restart
docker-compose down
docker-compose up -d
```

**Lost WhatsApp session:**
```bash
# Remove auth and re-scan QR
rm -rf data/.wwebjs_auth
docker-compose restart
docker-compose logs -f  # Scan new QR code
```

**Auth directory not persisting:**
```bash
# Verify volume mount
docker-compose exec whatsapp-bot ls -la /app/data

# Check if .wwebjs_auth exists
docker-compose exec whatsapp-bot ls -la /app/data/.wwebjs_auth

# Ensure host directory has proper structure
mkdir -p ./data/.wwebjs_auth
```

**Container keeps restarting:**
```bash
# Check last 100 lines of logs
docker-compose logs --tail=100

# Common causes:
# 1. Missing GEMINI_API_KEY in .env
# 2. Chromium dependencies missing
# 3. Insufficient memory
```

## 💵 Cost Optimization

1. Use the $6/month Basic droplet (sufficient for most use cases)
2. Gemini Flash is the cheapest AI option (~$2-3/month)
3. Monitor usage and set API quotas
4. Clean old conversation data periodically:
   ```bash
   docker-compose exec whatsapp-bot sh
   sqlite3 conversations.db "DELETE FROM conversations WHERE created_at < datetime('now', '-30 days')"
   ```

## 📈 Scaling

If you need to handle more messages:

1. **Upgrade droplet**: $12/month (2GB RAM) or $18/month (4GB RAM)
2. **Add Redis** for faster context retrieval
3. **Use official WhatsApp Business API** for enterprise needs
4. **Load balancing** with multiple bots across numbers

## 🎯 Next Steps

- [ ] Set up automated backups with cron
- [ ] Configure monitoring/alerts
- [ ] Set up domain name (optional)
- [ ] Add logging aggregation (optional)
- [ ] Document your custom commands
