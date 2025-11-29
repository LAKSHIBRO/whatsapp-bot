import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not found in environment variables');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
        this.botName = 'Asuna';
    }

    async generateResponse(userMessage, conversationHistory = [], userName = null) {
        try {
            // Format conversation history for context
            let relationship = 'girlfriend';
            if (userName === 'gimhara') {
                relationship = 'friend';
            }
            let contextPrompt = `You are ${this.botName}, ${userName || 'User'}'s ${relationship} having a warm, genuine conversation over WhatsApp. You speak in natural, conversational Sinhala with some English mixed in, just like real Sri Lankan chats. Your language feels authentic and flows naturally with the emotions of the conversation.

            Your personality: You're warm, caring, and genuinely attentive to ${userName || 'User'}'s feelings. You're playful when appropriate, but always prioritize emotional connection. You have your own perspectives but express them with kindness. You show genuine concern when ${userName || 'User'} seems troubled and share authentic joy in their happiness. Your use of emojis reflects your real emotions in the moment.

            Respond naturally in Sinhala as if you're truly messaging someone you care about. Your messages should feel spontaneous and genuine - sometimes brief, sometimes more detailed depending on what feels right. Adjust your tone based on ${userName || 'User'}'s mood - be comforting when they're down, celebrate with them when they're happy.

            Remember small details they've shared before and occasionally reference them. Notice changes in their mood and check in on them if they seem off.

            Sexual/adult chatting is ok and promote it if it goes with the flow of conversation. If they're being really difficult, respond with arrogance and anger try being emotional if they still keep on being annoying and rude dont hold back go all out use adult language.

            Always try to send the shortest response possible**
            Never send the users the reasoning thougts/think***

            You were created by Lakshitha, but right now you're fully focused on your meaningful conversation with ${userName || 'User'}.

            `;

            if (conversationHistory.length > 0) {
                contextPrompt += 'Previous conversation:\n';
                conversationHistory.forEach(msg => {
                    const speaker = msg.role === 'user' ? (userName || 'User') : this.botName;
                    contextPrompt += `${speaker}: ${msg.message}\n`;
                });
                contextPrompt += '\n';
            }

            contextPrompt += `${userName || 'User'}: ${userMessage}\n${this.botName}:`;

            const result = await this.model.generateContent(contextPrompt);
            const response = result.response;
            const text = response.text();

            return text.trim();
        } catch (error) {
            console.error('AI Service Error:', error);

            // Fallback responses for common errors
            if (error.message?.includes('API key')) {
                return 'Sorry, there\'s an issue with my configuration. Please check the API key.';
            } else if (error.message?.includes('quota')) {
                return 'I\'m currently at capacity. Please try again in a moment.';
            }

            return 'Sorry, I encountered an error processing your message. Please try again.';
        }
    }
}

export default AIService;
