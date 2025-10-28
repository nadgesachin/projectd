import { io } from 'socket.io-client';
import { store } from '../app/store';
import { selectToken, selectUser } from '../features/auth/authSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
  }

  // Initialize socket connection
  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const state = store.getState();
    const token = selectToken(state);
    const user = selectUser(state);

    if (!token || !user) {
      console.warn('No auth token or user found, cannot connect to socket');
      return null;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(socketUrl, {
      auth: {
        token,
        userId: user.id,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    this.setupEventListeners();
    return this.socket;
  }

  // Setup socket event listeners
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('socket_connected', { socketId: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('socket_disconnected', { reason });
      
      // Attempt to reconnect if not manually disconnected
      if (reason !== 'io client disconnect' && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('socket_error', { error: error.message });
    });

    // Authentication events
    this.socket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
      this.emit('socket_authenticated', data);
    });

    this.socket.on('authentication_error', (error) => {
      console.error('Socket authentication error:', error);
      this.emit('socket_auth_error', { error });
    });

    // Chat events
    this.socket.on('new_message', (message) => {
      this.emit('new_message', message);
    });

    this.socket.on('message_read', (data) => {
      this.emit('message_read', data);
    });

    this.socket.on('typing_start', (data) => {
      this.emit('typing_start', data);
    });

    this.socket.on('typing_stop', (data) => {
      this.emit('typing_stop', data);
    });

    this.socket.on('user_online', (data) => {
      this.emit('user_online', data);
    });

    this.socket.on('user_offline', (data) => {
      this.emit('user_offline', data);
    });

    // Notification events
    this.socket.on('notification', (notification) => {
      this.emit('notification', notification);
    });

    // Post events
    this.socket.on('post_like', (data) => {
      this.emit('post_like', data);
    });

    this.socket.on('post_comment', (data) => {
      this.emit('post_comment', data);
    });

    // Connection events
    this.socket.on('connection_request', (data) => {
      this.emit('connection_request', data);
    });

    this.socket.on('connection_accepted', (data) => {
      this.emit('connection_accepted', data);
    });
  }

  // Handle reconnection
  handleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, delay);
  }

  // Emit event to listeners
  emit(event, data) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket event listener for ${event}:`, error);
        }
      });
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  // Remove event listener
  off(event, callback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  // Send message
  sendMessage(conversationId, message) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('send_message', {
      conversationId,
      message,
    });
  }

  // Join conversation
  joinConversation(conversationId) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('join_conversation', { conversationId });
  }

  // Leave conversation
  leaveConversation(conversationId) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('leave_conversation', { conversationId });
  }

  // Mark message as read
  markMessageAsRead(conversationId, messageId) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('mark_message_read', {
      conversationId,
      messageId,
    });
  }

  // Start typing
  startTyping(conversationId) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('typing_start', { conversationId });
  }

  // Stop typing
  stopTyping(conversationId) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('typing_stop', { conversationId });
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Reconnect socket
  reconnect() {
    this.disconnect();
    return this.connect();
  }
}

// Create singleton instance
export const socketService = new SocketService();

// Export hook for React components
export const useSocket = () => {
  return {
    socket: socketService.socket,
    isConnected: socketService.isConnected,
    connect: () => socketService.connect(),
    disconnect: () => socketService.disconnect(),
    reconnect: () => socketService.reconnect(),
    on: (event, callback) => socketService.on(event, callback),
    off: (event, callback) => socketService.off(event, callback),
    sendMessage: (conversationId, message) => socketService.sendMessage(conversationId, message),
    joinConversation: (conversationId) => socketService.joinConversation(conversationId),
    leaveConversation: (conversationId) => socketService.leaveConversation(conversationId),
    markMessageAsRead: (conversationId, messageId) => socketService.markMessageAsRead(conversationId, messageId),
    startTyping: (conversationId) => socketService.startTyping(conversationId),
    stopTyping: (conversationId) => socketService.stopTyping(conversationId),
    getConnectionStatus: () => socketService.getConnectionStatus(),
  };
};
