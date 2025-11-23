# WhatsApp AI Bot

A lightweight WhatsApp bot that uses AI (Google Gemini Flash) to respond to messages while maintaining conversation context for each user. Designed for cost-effective deployment on Digital Ocean.

## ✨ Features

- 🤖 AI-powered responses using Google Gemini 1.5 Flash
- 💬 Per-user conversation context management
- 💾 Lightweight SQLite database
- 🔄 Automatic session persistence
- 📱 Easy QR code authentication
- 🐳 Docker support for easy deployment
- 💰 Cost-effective (~$8-10/month total)

## 📋 Prerequisites

- Node.js 20+ (for local development)
- A dedicated phone number for WhatsApp (not your personal number)
- Google Gemini API key ([Get one free](https://makersuite.google.com/app/apikey))
- Digital Ocean account (for hosting)

## 🚀 Quick Start (Local Development)

1. **Clone and install dependencies**
   ```bash
   cd whatsapp-ai-bot
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Start the bot**
   ```bash
   npm start
   ```

4. **Scan QR code**
   - A QR code will appear in your terminal
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices → Link a Device
   - Scan the QR code

5. **Test it**
   - Send a message to the bot's WhatsApp number from another account
   - The bot will respond with an AI-generated message
   - Send follow-up messages to test context retention

## 🐳 Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **View logs and scan QR code**
   ```bash
   docker-compose logs -f
   ```

3. **Manage the bot**
   ```bash
   docker-compose restart  # Restart
   docker-compose down     # Stop
   docker-compose logs -f  # View logs
   ```

## ☁️ Digital Ocean Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Digital Ocean setup instructions.

**Quick deploy:**
```bash
# Set your droplet IP
export DROPLET_IP=your-droplet-ip

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

## ⚙️ Configuration

Edit `.env` file:

```env
# Required: Your Gemini API key
GEMINI_API_KEY=your_api_key_here

# Optional: Context settings
MAX_CONTEXT_MESSAGES=20

# Optional: Bot personality
BOT_NAME=AI Assistant
```

## 💬 Special Commands

Users can send these commands to the bot:

- `/reset` - Clear conversation history and start fresh

## 💰 Cost Breakdown

**Digital Ocean:** $6/month (Basic Droplet, 1GB RAM)  
**AI API (Gemini Flash):**
- ~1000 messages/day = 30,000/month
- ~$2-3/month at current pricing

**Total: ~$8-10/month**

## 🛠️ Development

**Run with auto-reload:**
```bash
npm run dev
```

**Check database:**
```bash
# View conversations
sqlite3 conversations.db "SELECT * FROM conversations LIMIT 10"

# Count messages per user
sqlite3 conversations.db "SELECT user_id, COUNT(*) FROM conversations GROUP BY user_id"
```

## ⚠️ Important Notes

1. **Unofficial API**: This uses `whatsapp-web.js` which violates WhatsApp's Terms of Service. For production, consider the official WhatsApp Business API.

2. **Dedicated Number**: Use a dedicated phone number, not your personal WhatsApp account.

3. **Session Persistence**: The `.wwebjs_auth` folder stores your session. Keep it backed up!

4. **Rate Limiting**: WhatsApp may rate limit your bot if it sends too many messages.

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.
