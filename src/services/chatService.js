import { apiService, API_ENDPOINTS } from './api';

class ChatService {
  // Get all conversations
  async getConversations() {
    const response = await apiService.get(API_ENDPOINTS.CHAT.CONVERSATIONS);
    return response;
  }

  // Create a new conversation
  async createConversation(participantId) {
    const response = await apiService.post(API_ENDPOINTS.CHAT.CONVERSATIONS, {
      participantId,
    });
    return response;
  }

  // Get conversation by ID
  async getConversation(conversationId) {
    const response = await apiService.get(`${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}`);
    return response;
  }

  // Update conversation
  async updateConversation(conversationId, data) {
    const response = await apiService.put(`${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}`, data);
    return response;
  }

  // Delete conversation
  async deleteConversation(conversationId) {
    const response = await apiService.delete(`${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}`);
    return response;
  }

  // Get messages for a conversation
  async getMessages(conversationId, { page = 1, limit = 50, before = null } = {}) {
    const params = { page, limit };
    if (before) {
      params.before = before;
    }
    
    const response = await apiService.get(`${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages`, {
      params,
    });
    return response;
  }

  // Send a message
  async sendMessage(conversationId, messageData) {
    const formData = new FormData();
    
    // Add message content
    formData.append('content', messageData.content);
    formData.append('type', messageData.type || 'text');
    
    // Add attachments if provided
    if (messageData.attachments && messageData.attachments.length > 0) {
      messageData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }
    
    // Add reply to message ID if provided
    if (messageData.replyTo) {
      formData.append('replyTo', messageData.replyTo);
    }

    const response = await apiService.upload(`${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages`, formData);
    return response;
  }

  // Update a message
  async updateMessage(conversationId, messageId, content) {
    const response = await apiService.put(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/${messageId}`,
      { content }
    );
    return response;
  }

  // Delete a message
  async deleteMessage(conversationId, messageId) {
    const response = await apiService.delete(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/${messageId}`
    );
    return response;
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId, messageIds) {
    const response = await apiService.put(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/read`,
      { messageIds }
    );
    return response;
  }

  // Mark all messages in conversation as read
  async markAllMessagesAsRead(conversationId) {
    const response = await apiService.put(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/read-all`
    );
    return response;
  }

  // Upload file for chat
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiService.upload(`${API_ENDPOINTS.CHAT.MESSAGES}/upload`, formData);
    return response;
  }

  // Get unread message count
  async getUnreadCount() {
    const response = await apiService.get(`${API_ENDPOINTS.CHAT.MESSAGES}/unread-count`);
    return response;
  }

  // Search messages
  async searchMessages(query, { conversationId = null, page = 1, limit = 20 } = {}) {
    const params = { q: query, page, limit };
    if (conversationId) {
      params.conversationId = conversationId;
    }
    
    const response = await apiService.get(`${API_ENDPOINTS.CHAT.MESSAGES}/search`, {
      params,
    });
    return response;
  }

  // Get message by ID
  async getMessage(conversationId, messageId) {
    const response = await apiService.get(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/${messageId}`
    );
    return response;
  }

  // React to a message
  async reactToMessage(conversationId, messageId, emoji) {
    const response = await apiService.post(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/${messageId}/react`,
      { emoji }
    );
    return response;
  }

  // Remove reaction from message
  async removeReaction(conversationId, messageId, emoji) {
    const response = await apiService.delete(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/${messageId}/react`,
      { data: { emoji } }
    );
    return response;
  }

  // Forward message
  async forwardMessage(conversationId, messageId, targetConversationIds) {
    const response = await apiService.post(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/${messageId}/forward`,
      { targetConversationIds }
    );
    return response;
  }

  // Pin message
  async pinMessage(conversationId, messageId) {
    const response = await apiService.post(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/${messageId}/pin`
    );
    return response;
  }

  // Unpin message
  async unpinMessage(conversationId, messageId) {
    const response = await apiService.delete(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/${messageId}/pin`
    );
    return response;
  }

  // Get pinned messages
  async getPinnedMessages(conversationId) {
    const response = await apiService.get(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/messages/pinned`
    );
    return response;
  }

  // Archive conversation
  async archiveConversation(conversationId) {
    const response = await apiService.put(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/archive`
    );
    return response;
  }

  // Unarchive conversation
  async unarchiveConversation(conversationId) {
    const response = await apiService.put(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/unarchive`
    );
    return response;
  }

  // Mute conversation
  async muteConversation(conversationId, duration = null) {
    const response = await apiService.put(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/mute`,
      { duration }
    );
    return response;
  }

  // Unmute conversation
  async unmuteConversation(conversationId) {
    const response = await apiService.put(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/unmute`
    );
    return response;
  }

  // Block user in conversation
  async blockUser(conversationId, userId) {
    const response = await apiService.post(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/block`,
      { userId }
    );
    return response;
  }

  // Unblock user in conversation
  async unblockUser(conversationId, userId) {
    const response = await apiService.delete(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/block/${userId}`
    );
    return response;
  }

  // Get conversation participants
  async getParticipants(conversationId) {
    const response = await apiService.get(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/participants`
    );
    return response;
  }

  // Add participant to conversation
  async addParticipant(conversationId, userId) {
    const response = await apiService.post(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/participants`,
      { userId }
    );
    return response;
  }

  // Remove participant from conversation
  async removeParticipant(conversationId, userId) {
    const response = await apiService.delete(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/participants/${userId}`
    );
    return response;
  }

  // Get conversation settings
  async getConversationSettings(conversationId) {
    const response = await apiService.get(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/settings`
    );
    return response;
  }

  // Update conversation settings
  async updateConversationSettings(conversationId, settings) {
    const response = await apiService.put(
      `${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}/settings`,
      settings
    );
    return response;
  }
}

export const chatService = new ChatService();
