import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  fetchConversations,
  selectConversations,
  selectChatLoading,
  selectOnlineUsers,
  selectUnreadCount,
} from '../../features/chat/chatSlice';
import { selectUser as selectAuthUser } from '../../features/auth/authSlice';

const ConversationList = ({ onConversationSelect, selectedConversationId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);
  const conversations = useSelector(selectConversations);
  const loading = useSelector(selectChatLoading);
  const onlineUsers = useSelector(selectOnlineUsers);
  const unreadCount = useSelector(selectUnreadCount);
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return date.toLocaleDateString();
  };

  const getConversationName = (conversation) => {
    if (conversation.type === 'group') {
      return conversation.name || 'Group Chat';
    }
    
    const otherParticipant = conversation.participants?.find(
      p => p.id !== currentUser.id
    );
    
    return otherParticipant 
      ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
      : 'Unknown User';
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.type === 'group') {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-lg">
            {conversation.name?.charAt(0) || 'G'}
          </span>
        </div>
      );
    }
    
    const otherParticipant = conversation.participants?.find(
      p => p.id !== currentUser.id
    );
    
    if (otherParticipant?.profileImage) {
      return (
        <div className="relative">
          <img
            src={otherParticipant.profileImage}
            alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          {onlineUsers.has(otherParticipant.id) && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
      );
    }
    
    return (
      <div className="relative">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-700 font-medium">
            {otherParticipant?.firstName?.charAt(0) || 'U'}{otherParticipant?.lastName?.charAt(0) || 'P'}
          </span>
        </div>
        {onlineUsers.has(otherParticipant?.id) && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
    );
  };

  const getLastMessage = (conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    
    const { lastMessage } = conversation;
    const isOwnMessage = lastMessage.senderId === currentUser.id;
    
    let content = lastMessage.content;
    if (lastMessage.type === 'image') {
      content = isOwnMessage ? 'You sent a photo' : 'Sent a photo';
    } else if (lastMessage.type === 'file') {
      content = isOwnMessage ? 'You sent a file' : 'Sent a file';
    } else if (lastMessage.type === 'system') {
      content = lastMessage.content;
    }
    
    return content;
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    const name = getConversationName(conversation).toLowerCase();
    const lastMessage = getLastMessage(conversation).toLowerCase();
    
    return name.includes(searchQuery.toLowerCase()) || 
           lastMessage.includes(searchQuery.toLowerCase());
  });

  const renderEmptyState = () => (
    <div className="text-center py-8">
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
      <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
      <p className="mt-1 text-sm text-gray-500">
        Start a conversation with someone from your network.
      </p>
    </div>
  );

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="h-3 bg-gray-300 rounded w-8 animate-pulse"></div>
            <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          renderLoadingSkeleton()
        ) : filteredConversations.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onConversationSelect?.(conversation)}
                className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  {getConversationAvatar(conversation)}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {getConversationName(conversation)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.updatedAt)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 truncate">
                      {getLastMessage(conversation)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{conversations.length} conversations</span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
