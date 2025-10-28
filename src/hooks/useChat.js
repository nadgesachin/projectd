import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  createConversation,
  selectConversations,
  selectChatLoading,
} from '../features/chat/chatSlice';
import { selectUser as selectAuthUser } from '../features/auth/authSlice';

export const useChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const currentUser = useSelector(selectAuthUser);
  const conversations = useSelector(selectConversations);
  const loading = useSelector(selectChatLoading);

  // Start a conversation with a user
  const startConversation = useCallback(async (userId) => {
    if (!userId || userId === currentUser?.id) {
      toast.error('Cannot start conversation with yourself');
      return;
    }

    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.participants?.some(p => p.id === userId) && 
        conv.participants?.some(p => p.id === currentUser.id)
      );

      if (existingConversation) {
        navigate(`/chat/${existingConversation.id}`);
        return existingConversation;
      }

      // Create new conversation
      const response = await dispatch(createConversation(userId)).unwrap();
      navigate(`/chat/${response.id}`);
      toast.success('Conversation started');
      return response;
    } catch (error) {
      toast.error('Failed to start conversation');
      throw error;
    }
  }, [dispatch, navigate, currentUser?.id, conversations]);

  // Get conversation with a specific user
  const getConversationWithUser = useCallback((userId) => {
    return conversations.find(conv => 
      conv.participants?.some(p => p.id === userId) && 
      conv.participants?.some(p => p.id === currentUser.id)
    );
  }, [conversations, currentUser?.id]);

  // Check if user is online
  const isUserOnline = useCallback((userId) => {
    // This would be implemented with socket connection status
    // For now, return false as placeholder
    return false;
  }, []);

  // Get unread message count for a user
  const getUnreadCountForUser = useCallback((userId) => {
    const conversation = getConversationWithUser(userId);
    return conversation?.unreadCount || 0;
  }, [getConversationWithUser]);

  // Get last message with a user
  const getLastMessageWithUser = useCallback((userId) => {
    const conversation = getConversationWithUser(userId);
    return conversation?.lastMessage;
  }, [getConversationWithUser]);

  // Check if user has unread messages
  const hasUnreadMessages = useCallback((userId) => {
    return getUnreadCountForUser(userId) > 0;
  }, [getUnreadCountForUser]);

  return {
    startConversation,
    getConversationWithUser,
    isUserOnline,
    getUnreadCountForUser,
    getLastMessageWithUser,
    hasUnreadMessages,
    loading,
    conversations,
  };
};
