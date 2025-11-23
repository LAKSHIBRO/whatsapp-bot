# Name Recognition Feature

## Overview
The WhatsApp AI bot now has the ability to learn and remember user names, enabling more personalized conversations.

## How It Works

### 1. Automatic Name Detection
The bot automatically detects when users introduce themselves using common patterns:

**English patterns:**
- "My name is [Name]"
- "I'm [Name]" or "I am [Name]"
- "Call me [Name]"
- "This is [Name]"

**Sinhala patterns:**
- "මගේ නම [Name]"
- "මම [Name]"
- "මට කියන්න [Name]"

**Example:**
```
User: "Hi, my name is Lakshitha"
Bot: [Automatically saves "Lakshitha" and addresses them by name in future messages]
```

### 2. Manual Name Setting
Users can also set their name manually using the `/name` command:

```
/name YourName
```

**Example:**
```
User: "/name Kasun"
Bot: "✨ Nice to meet you, Kasun! මට ඔයාව මතක් තියෙන්නම්."
```

### 3. Personalized Responses
Once the bot knows a user's name, it will:
- Address them by name when natural and appropriate
- Use their name in the conversation context
- Create more personalized and warm interactions

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/name [YourName]` | Manually set your name | `/name Sanduni` |
| `/reset` | Clear conversation history (keeps name) | `/reset` |

## Technical Details

### Storage
- Names are stored in-memory (same as conversation history)
- Names persist across messages during the bot session
- Names are cleared when the bot restarts

### Pattern Matching
- Case-insensitive matching
- Automatically capitalizes the first letter
- Filters out common words to avoid false positives
- Supports both English and Sinhala text

### AI Integration
- User names are passed to the AI context when available
- AI is instructed to use names naturally (not in every message)
- Names appear in conversation history for better context

## Future Enhancements
Potential improvements could include:
- Persistent name storage (database/file)
- Multiple name support (nicknames)
- Name recognition from WhatsApp contact info
- Option to forget/change name
