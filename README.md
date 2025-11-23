# WhatsApp AI Bot

Simple WhatsApp bot powered by Google Gemini AI. Easy to deploy on Digital Ocean.

## Features

- 🤖 AI responses using Google Gemini 2.5 Flash
- 💬 Remembers conversation context per user
- 🐳 Docker ready
- ⚡ Lightweight - no database
- 💰 Cheap (~$6-8/month)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_key_here
```

Get a free API key: https://makersuite.google.com/app/apikey

### 3. Run the Bot

```bash
npm start
```

### 4. Connect WhatsApp

1. QR code appears in terminal
2. Open WhatsApp on your phone
3. Go to Settings → Linked Devices → Link a Device
4. Scan the QR code
5. Done! Send a message to test

## Docker Deployment

### Local Docker

```bash
# Setup environment
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Start
docker-compose up -d

# View logs and scan QR
docker-compose logs -f
```

**Note**: Session data is stored in a Docker named volume `wwebjs_auth`.

### Digital Ocean

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

Quick version:
```bash
# Set your droplet IP
export DROPLET_IP=your-droplet-ip

# Deploy
chmod +x deploy.sh
./deploy.sh
```

## Configuration

Edit `.env`:

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional
MAX_CONTEXT_MESSAGES=20
BOT_NAME=AI Assistant
```

## Commands

Users can send:
- `/reset` - Clear conversation history

## Important Notes

⚠️ **Unofficial API**: Uses `whatsapp-web.js` (violates WhatsApp ToS). Use at your own risk.

⚠️ **Dedicated Number**: Use a separate phone number, not your personal WhatsApp.

⚠️ **Session Data**: 
- Local: `.wwebjs_auth/` folder stores your WhatsApp session
- Docker: Stored in `wwebjs_auth` named volume

⚠️ **Conversation Memory**: Stored in RAM. Cleared when bot restarts.

## Development

```bash
# Run with auto-reload
npm run dev
```

## License

MIT
