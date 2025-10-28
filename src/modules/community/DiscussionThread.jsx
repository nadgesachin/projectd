import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, Share2, Clock, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const DiscussionThread = ({ discussion, onLike, onReply, onPin, isPinned, isAdmin }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(discussion._id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 ${isPinned ? 'border-l-4 border-blue-500' : ''}`}>
      {/* Discussion Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start flex-1">
          {/* Author Avatar */}
          <Link to={`/profile/${discussion.author._id}`}>
            {discussion.author.profileImage ? (
              <img
                src={discussion.author.profileImage}
                alt={discussion.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {discussion.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>

          {/* Author Info */}
          <div className="ml-3 flex-1">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${discussion.author._id}`}>
                <h4 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                  {discussion.author.name}
                </h4>
              </Link>
              {isPinned && (
                <Pin className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <Clock className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Pin Button (Admin Only) */}
        {isAdmin && (
          <button
            onClick={() => onPin(discussion._id)}
            className={`p-2 rounded-full transition-colors ${
              isPinned ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Discussion Title */}
      {discussion.title && (
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {discussion.title}
        </h3>
      )}

      {/* Discussion Content */}
      <div className="text-gray-700 mb-4">
        <p className="whitespace-pre-wrap">{discussion.content}</p>
        
        {/* Attachments */}
        {discussion.attachments && discussion.attachments.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {discussion.attachments.map((attachment, index) => (
              <img
                key={index}
                src={attachment}
                alt={`Attachment ${index + 1}`}
                className="rounded-lg w-full h-32 object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* Discussion Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
        <button
          onClick={() => onLike(discussion._id)}
          className={`flex items-center gap-1 text-sm transition-colors ${
            discussion.isLiked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${discussion.isLiked ? 'fill-current' : ''}`} />
          <span>{discussion.likes || 0}</span>
        </button>

        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{discussion.repliesCount || 0} Replies</span>
        </button>

        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <form onSubmit={handleSubmitReply}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Replies Preview */}
      {discussion.replies && discussion.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          {discussion.replies.slice(0, 2).map((reply) => (
            <div key={reply._id} className="mb-3">
              <div className="flex items-start gap-2">
                <img
                  src={reply.author.profileImage || `https://ui-avatars.com/api/?name=${reply.author.name}`}
                  alt={reply.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{reply.author.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
          {discussion.repliesCount > 2 && (
            <button className="text-sm text-blue-600 hover:underline">
              View all {discussion.repliesCount} replies
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscussionThread;

