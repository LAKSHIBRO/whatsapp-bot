/**
 * ContextManager - In-memory conversation history management
 * Stores conversation context per user without persistent database
 */
class ContextManager {
    constructor() {
        // In-memory storage: Map of userId -> array of messages
        this.conversations = new Map();
        this.maxMessages = parseInt(process.env.MAX_CONTEXT_MESSAGES) || 20;

        console.log('💾 Context Manager initialized (in-memory mode)');
    }

    /**
     * Get conversation history for a user
     * @param {string} userId - WhatsApp user ID
     * @returns {Array} Array of message objects with role and message
     */
    getContext(userId) {
        const userConversation = this.conversations.get(userId) || [];
        // Return last N messages in chronological order
        return userConversation.slice(-this.maxMessages);
    }

    /**
     * Save a message to user's conversation history
     * @param {string} userId - WhatsApp user ID
     * @param {string} role - Message role ('user' or 'assistant')
     * @param {string} message - Message content
     */
    saveMessage(userId, role, message) {
        if (!this.conversations.has(userId)) {
            this.conversations.set(userId, []);
        }

        const userConversation = this.conversations.get(userId);
        userConversation.push({
            role,
            message,
            created_at: new Date().toISOString()
        });

        // Automatically prune old messages
        this.pruneOldMessages(userId);
    }

    /**
     * Prune old messages to prevent memory bloat
     * Keeps only the last MAX_CONTEXT_MESSAGES * 2 messages per user
     * @param {string} userId - WhatsApp user ID
     */
    pruneOldMessages(userId) {
        const userConversation = this.conversations.get(userId);
        if (!userConversation) return;

        const limit = this.maxMessages * 2;
        if (userConversation.length > limit) {
            // Keep only the most recent messages
            const pruned = userConversation.slice(-limit);
            this.conversations.set(userId, pruned);
        }
    }

    /**
     * Clear all conversation history for a user
     * @param {string} userId - WhatsApp user ID
     */
    clearContext(userId) {
        this.conversations.delete(userId);
        console.log(`🗑️  Cleared context for user: ${userId}`);
    }

    /**
     * Get total number of users with active conversations
     * @returns {number} Number of active users
     */
    getActiveUsersCount() {
        return this.conversations.size;
    }

    /**
     * Close method for compatibility (no-op for in-memory storage)
     */
    close() {
        console.log('💾 Context Manager closed');
        this.conversations.clear();
    }
}

export default ContextManager;
