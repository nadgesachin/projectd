import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  updateMessage,
  deleteMessage,
  selectChatSending,
} from '../../features/chat/chatSlice';
import { selectUser as selectAuthUser } from '../../features/auth/authSlice';
import Button from '../common/Button';

const Message = ({ message, conversationId, onReply, onForward }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);
  const isSending = useSelector(selectChatSending);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const messageRef = useRef(null);
  const menuRef = useRef(null);

  const isOwnMessage = currentUser?.id === message.senderId;
  const isRead = message.readBy && message.readBy.length > 1;
  const hasReactions = message.reactions && Object.keys(message.reactions).length > 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    
    try {
      await dispatch(updateMessage({
        conversationId,
        messageId: message.id,
        content: editContent,
      })).unwrap();
      setIsEditing(false);
      toast.success('Message updated');
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await dispatch(deleteMessage({
          conversationId,
          messageId: message.id,
        })).unwrap();
        toast.success('Message deleted');
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const handleReaction = async (emoji) => {
    // Reaction feature - to be implemented with backend
    toast.info(`Reaction ${emoji} (feature coming soon)`);
    setShowReactions(false);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return date.toLocaleDateString([], { weekday: 'long' });
    return date.toLocaleDateString();
  };

  const renderMessageContent = () => {
    if (message.type === 'text') {
      return (
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
      );
    }
    
    if (message.type === 'image') {
      return (
        <div className="space-y-2">
          <img
            src={message.attachments?.[0]?.url}
            alt="Shared image"
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(message.attachments[0].url, '_blank')}
          />
          {message.content && (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
        </div>
      );
    }
    
    if (message.type === 'file') {
      const file = message.attachments?.[0];
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file?.name || 'File'}
              </p>
              <p className="text-xs text-gray-500">
                {file?.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}
              </p>
            </div>
            <a
              href={file?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </a>
          </div>
          {message.content && (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
        </div>
      );
    }
    
    return <div className="whitespace-pre-wrap break-words">{message.content}</div>;
  };

  const renderReactions = () => {
    if (!hasReactions) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(message.reactions).map(([emoji, userIds]) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              userIds.includes(currentUser.id)
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{emoji}</span>
            <span>{userIds.length}</span>
          </button>
        ))}
      </div>
    );
  };

  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div
      ref={messageRef}
      className={`group flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwnMessage && (
          <div className="flex-shrink-0 mr-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {message.sender?.profileImage ? (
                <img
                  src={message.sender.profileImage}
                  alt={`${message.sender.firstName} ${message.sender.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-gray-700">
                  {message.sender?.firstName?.charAt(0) || 'U'}{message.sender?.lastName?.charAt(0) || 'P'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className={`flex-1 ${isOwnMessage ? 'mr-2' : ''}`}>
          {/* Sender Name */}
          {!isOwnMessage && (
            <div className="text-xs text-gray-500 mb-1">
              {message.sender?.firstName} {message.sender?.lastName}
            </div>
          )}

          {/* Message Bubble */}
          <div className="relative">
            {isEditing ? (
              <div className="bg-white border border-gray-300 rounded-lg p-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full resize-none border-none outline-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(message.content);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleEdit}
                    disabled={!editContent.trim() || isSending}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`relative px-4 py-2 rounded-lg ${
                  isOwnMessage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {renderMessageContent()}
                
                {/* Message Menu */}
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className={`p-1 rounded-full ${
                        isOwnMessage
                          ? 'text-white hover:bg-blue-700'
                          : 'text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    
                    {showMenu && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
                        <button
                          onClick={() => {
                            setShowReactions(!showReactions);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          React
                        </button>
                        <button
                          onClick={() => {
                            onReply?.(message);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            onForward?.(message);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Forward
                        </button>
                        {isOwnMessage && (
                          <>
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setShowMenu(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete();
                                setShowMenu(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reactions */}
            {renderReactions()}

            {/* Quick Reactions */}
            {showReactions && (
              <div className="absolute top-0 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20">
                <div className="flex space-x-1">
                  {commonReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        handleReaction(emoji);
                        setShowReactions(false);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Status */}
            <div className={`flex items-center space-x-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <span className="text-xs text-gray-500">
                {formatTime(message.createdAt)}
              </span>
              {isOwnMessage && (
                <div className="flex items-center">
                  {isRead ? (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
