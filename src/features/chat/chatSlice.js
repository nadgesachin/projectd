import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../../services/chatService';

// Initial state
const initialState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  typingUsers: {},
  onlineUsers: [], // Changed from Set to Array for Redux serialization
  isLoading: false,
  isSending: false,
  error: null,
  lastUpdated: null,
  unreadCount: 0,
  socketConnected: false,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (participantId, { rejectWithValue }) => {
    try {
      const response = await chatService.createConversation(participantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create conversation');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ conversationId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await chatService.getMessages(conversationId, { page, limit });
      return { conversationId, messages: response.data, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, content, type = 'text', attachments = [] }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(conversationId, {
        content,
        type,
        attachments,
      });
      return { conversationId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'chat/markMessagesAsRead',
  async ({ conversationId, messageIds }, { rejectWithValue }) => {
    try {
      const response = await chatService.markMessagesAsRead(conversationId, messageIds);
      return { conversationId, messageIds };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async ({ conversationId, messageId }, { rejectWithValue }) => {
    try {
      await chatService.deleteMessage(conversationId, messageId);
      return { conversationId, messageId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
  }
);

export const updateMessage = createAsyncThunk(
  'chat/updateMessage',
  async ({ conversationId, messageId, content }, { rejectWithValue }) => {
    try {
      const response = await chatService.updateMessage(conversationId, messageId, content);
      return { conversationId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update message');
    }
  }
);

export const uploadFile = createAsyncThunk(
  'chat/uploadFile',
  async (file, { rejectWithValue }) => {
    try {
      const response = await chatService.uploadFile(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload file');
    }
  }
);

// Chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChatError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
      state.lastUpdated = Date.now();
    },
    updateMessageLocal: (state, action) => {
      const { conversationId, message } = action.payload;
      if (state.messages[conversationId]) {
        const index = state.messages[conversationId].findIndex(m => m.id === message.id);
        if (index !== -1) {
          state.messages[conversationId][index] = message;
        }
      }
      state.lastUpdated = Date.now();
    },
    removeMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].filter(
          m => m.id !== messageId
        );
      }
      state.lastUpdated = Date.now();
    },
    markMessageAsRead: (state, action) => {
      const { conversationId, messageId, userId } = action.payload;
      if (state.messages[conversationId]) {
        const message = state.messages[conversationId].find(m => m.id === messageId);
        if (message && !message.readBy.includes(userId)) {
          message.readBy.push(userId);
        }
      }
    },
    setTypingUser: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(userId)) {
          state.typingUsers[conversationId].push(userId);
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(id => id !== userId);
      }
    },
    setUserOnline: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    setUserOffline: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },
    updateConversation: (state, action) => {
      const updatedConversation = action.payload;
      const index = state.conversations.findIndex(c => c.id === updatedConversation.id);
      if (index !== -1) {
        state.conversations[index] = { ...state.conversations[index], ...updatedConversation };
      } else {
        state.conversations.unshift(updatedConversation);
      }
      state.lastUpdated = Date.now();
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    clearChatData: (state) => {
      state.conversations = [];
      state.currentConversation = null;
      state.messages = {};
      state.typingUsers = {};
      state.onlineUsers = [];
      state.unreadCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create conversation
      .addCase(createConversation.fulfilled, (state, action) => {
        const conversation = action.payload;
        const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
        if (existingIndex === -1) {
          state.conversations.unshift(conversation);
        }
        state.lastUpdated = Date.now();
      })
      
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { conversationId, messages, page } = action.payload;
        
        if (page === 1) {
          state.messages[conversationId] = messages;
        } else {
          state.messages[conversationId] = [...messages, ...(state.messages[conversationId] || [])];
        }
        state.lastUpdated = Date.now();
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        const { conversationId, message } = action.payload;
        
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message);
        state.lastUpdated = Date.now();
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      
      // Mark messages as read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const { conversationId, messageIds } = action.payload;
        if (state.messages[conversationId]) {
          state.messages[conversationId].forEach(message => {
            if (messageIds.includes(message.id)) {
              message.readBy = message.readBy || [];
              if (!message.readBy.includes(message.senderId)) {
                message.readBy.push(message.senderId);
              }
            }
          });
        }
        state.lastUpdated = Date.now();
      })
      
      // Delete message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { conversationId, messageId } = action.payload;
        if (state.messages[conversationId]) {
          state.messages[conversationId] = state.messages[conversationId].filter(
            m => m.id !== messageId
          );
        }
        state.lastUpdated = Date.now();
      })
      
      // Update message
      .addCase(updateMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        if (state.messages[conversationId]) {
          const index = state.messages[conversationId].findIndex(m => m.id === message.id);
          if (index !== -1) {
            state.messages[conversationId][index] = message;
          }
        }
        state.lastUpdated = Date.now();
      });
  },
});

export const {
  clearChatError,
  setCurrentConversation,
  clearCurrentConversation,
  addMessage,
  updateMessageLocal,
  removeMessage,
  markMessageAsRead,
  setTypingUser,
  setUserOnline,
  setUserOffline,
  updateConversation,
  setSocketConnected,
  updateUnreadCount,
  clearChatData,
} = chatSlice.actions;

// Selectors
export const selectConversations = (state) => state.chat.conversations;
export const selectCurrentConversation = (state) => state.chat.currentConversation;
export const selectMessages = (state) => state.chat.messages;
export const selectTypingUsers = (state) => state.chat.typingUsers;
export const selectOnlineUsers = (state) => state.chat.onlineUsers;
export const selectChatLoading = (state) => state.chat.isLoading;
export const selectChatSending = (state) => state.chat.isSending;
export const selectChatError = (state) => state.chat.error;
export const selectUnreadCount = (state) => state.chat.unreadCount;
export const selectSocketConnected = (state) => state.chat.socketConnected;
export const selectChatLastUpdated = (state) => state.chat.lastUpdated;

export default chatSlice.reducer;
