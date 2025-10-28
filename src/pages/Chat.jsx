import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';

import {
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  selectMessages,
  selectCurrentConversation,
  selectChatLoading,
  selectChatSending,
  selectTypingUsers,
  setCurrentConversation,
  addMessage,
  markMessageAsRead,
  setTypingUser,
} from '../features/chat/chatSlice';
import { selectUser as selectAuthUser } from '../features/auth/authSlice';
import { useSocket } from '../services/socketService';
import Message from '../components/chat/Message';
import ConversationList from '../components/chat/ConversationList';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  
  const currentUser = useSelector(selectAuthUser);
  const messages = useSelector(selectMessages);
  const currentConversation = useSelector(selectCurrentConversation);
  const loading = useSelector(selectChatLoading);
  const isSending = useSelector(selectChatSending);
  const typingUsers = useSelector(selectTypingUsers);
  
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { socket, isConnected, sendMessage: socketSendMessage, joinConversation, leaveConversation, markMessageAsRead: socketMarkMessageAsRead, startTyping, stopTyping } = useSocket();

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle file drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/*': ['.pdf', '.doc', '.docx', '.txt'],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      handleSendMessage('', 'file', acceptedFiles);
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} is too large. Maximum size is 10MB.`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} is not a supported file type.`);
          }
        });
      });
    },
  });

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages({ conversationId, page: 1, limit: 50 }));
      dispatch(setCurrentConversation(conversationId));
      
      // Join conversation room
      if (isConnected) {
        joinConversation(conversationId);
      }
    }
    
    return () => {
      if (conversationId && isConnected) {
        leaveConversation(conversationId);
      }
    };
  }, [conversationId, dispatch, isConnected, joinConversation, leaveConversation]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Mark messages as read when conversation is active
  useEffect(() => {
    if (conversationId && messages[conversationId] && isConnected) {
      const unreadMessages = messages[conversationId].filter(
        msg => msg.senderId !== currentUser.id && !msg.readBy?.includes(currentUser.id)
      );
      
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg.id);
        dispatch(markMessagesAsRead({ conversationId, messageIds }));
        
        // Mark as read via socket
        unreadMessages.forEach(msg => {
          socketMarkMessageAsRead(conversationId, msg.id);
        });
      }
    }
  }, [conversationId, messages, currentUser.id, isConnected, dispatch, socketMarkMessageAsRead]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.conversationId === conversationId) {
        dispatch(addMessage({ conversationId, message }));
        
        // Mark as read if conversation is active
        if (message.senderId !== currentUser.id) {
          socketMarkMessageAsRead(conversationId, message.id);
        }
      }
    };

    const handleMessageRead = (data) => {
      if (data.conversationId === conversationId) {
        dispatch(markMessageAsRead({
          conversationId: data.conversationId,
          messageId: data.messageId,
          userId: data.userId,
        }));
      }
    };

    const handleTypingStart = (data) => {
      if (data.conversationId === conversationId && data.userId !== currentUser.id) {
        dispatch(setTypingUser({
          conversationId: data.conversationId,
          userId: data.userId,
          isTyping: true,
        }));
      }
    };

    const handleTypingStop = (data) => {
      if (data.conversationId === conversationId && data.userId !== currentUser.id) {
        dispatch(setTypingUser({
          conversationId: data.conversationId,
          userId: data.userId,
          isTyping: false,
        }));
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_read', handleMessageRead);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_read', handleMessageRead);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, [socket, conversationId, currentUser.id, dispatch, socketMarkMessageAsRead]);

  const handleSendMessage = async (content = message, type = 'text', attachments = []) => {
    if (!content.trim() && attachments.length === 0) return;
    if (!conversationId) return;

    try {
      const messageData = {
        content: content.trim(),
        type,
        attachments,
        replyTo: replyTo?.id,
      };

      // Send via socket for real-time delivery
      if (isConnected) {
        socketSendMessage(conversationId, messageData);
      }

      // Also send via API for persistence
      await dispatch(sendMessage({
        conversationId,
        content: messageData.content,
        type: messageData.type,
        attachments: messageData.attachments,
      })).unwrap();

      setMessage('');
      setReplyTo(null);
      stopTyping(conversationId);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      startTyping(conversationId);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(conversationId);
    }, 1000);
  };

  const handleReply = (message) => {
    setReplyTo(message);
    messageInputRef.current?.focus();
  };

  const handleForward = (message) => {
    // TODO: Implement forward functionality
    toast.info('Forward functionality coming soon');
  };

  const getTypingText = () => {
    const typingUserIds = typingUsers[conversationId] || new Set();
    const typingCount = typingUserIds.size;
    
    if (typingCount === 0) return null;
    if (typingCount === 1) return 'Someone is typing...';
    return `${typingCount} people are typing...`;
  };

  const renderEmptyState = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose a conversation from the list to start messaging.
        </p>
      </div>
    </div>
  );

  const renderLoadingSkeleton = () => (
    <div className="flex-1 flex items-center justify-center">
      <Loader size="lg" text="Loading messages..." />
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Chat - ThriveUnity</title>
        <meta name="description" content="Connect and chat with your network" />
      </Helmet>

      <div className="flex h-screen bg-gray-50">
        {/* Conversation List */}
        <div className="w-80 flex-shrink-0">
          <ConversationList
            onConversationSelect={(conversation) => {
              navigate(`/chat/${conversation.id}`);
            }}
            selectedConversationId={conversationId}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!conversationId ? (
            renderEmptyState()
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {currentConversation?.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {currentConversation?.name || 'Conversation'}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {isConnected ? 'Online' : 'Connecting...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 7h5l-5-5v5z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6" {...getRootProps()}>
                <input {...getInputProps()} />
                
                {loading ? (
                  renderLoadingSkeleton()
                ) : (
                  <div className="space-y-4">
                    {messages[conversationId]?.map((message) => (
                      <Message
                        key={message.id}
                        message={message}
                        conversationId={conversationId}
                        onReply={handleReply}
                        onForward={handleForward}
                      />
                    ))}
                    
                    {/* Typing Indicator */}
                    {getTypingText() && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span>{getTypingText()}</span>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Reply Preview */}
              {replyTo && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Replying to:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {replyTo.sender?.firstName} {replyTo.sender?.lastName}
                      </span>
                    </div>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {replyTo.content}
                  </p>
                </div>
              )}

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      ref={messageInputRef}
                      value={message}
                      onChange={handleTyping}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!message.trim() || isSending}
                      variant="primary"
                    >
                      {isSending ? (
                        <Loader size="sm" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
