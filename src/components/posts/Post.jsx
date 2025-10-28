import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  likePost,
  unlikePost,
  deletePost,
  selectPostsLoading,
} from '../../features/posts/postSlice';
import { selectUser as selectAuthUser } from '../../features/auth/authSlice';
import Button from '../common/Button';
import Modal from '../common/Modal';

const Post = ({ post, onComment, onShare, showActions = true }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);
  const loading = useSelector(selectPostsLoading);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isOwnPost = currentUser?.id === post.author?.id;
  const isLiked = post.isLiked || false;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (isLiked) {
        await dispatch(unlikePost(post.id)).unwrap();
      } else {
        await dispatch(likePost(post.id)).unwrap();
      }
    } catch (error) {
      toast.error('Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePost(post.id)).unwrap();
      toast.success('Post deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(post);
    } else {
      setShowComments(!showComments);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post);
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: 'Check out this post on ThriveUnity',
          text: post.content,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    return (
      <div className="mt-4">
        {post.media.map((media, index) => (
          <div key={index} className="mb-2">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={`Post media ${index + 1}`}
                className="w-full h-auto rounded-lg object-cover max-h-96"
                loading="lazy"
              />
            ) : media.type === 'video' ? (
              <video
                src={media.url}
                controls
                className="w-full h-auto rounded-lg max-h-96"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {media.name || 'Download file'}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTags = () => {
    if (!post.tags || post.tags.length === 0) return null;

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag, index) => (
          <Link
            key={index}
            to={`/hashtag/${tag}`}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            #{tag}
          </Link>
        ))}
      </div>
    );
  };

  const renderComments = () => {
    if (!showComments || !post.comments || post.comments.length === 0) return null;

    return (
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="space-y-3">
          {post.comments.slice(0, 3).map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">
                    {comment.author?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {comment.author?.firstName} {comment.author?.lastName}
                  </p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
                <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                  <span>{formatTimeAgo(comment.createdAt)}</span>
                  <button className="hover:text-gray-700">Like</button>
                  <button className="hover:text-gray-700">Reply</button>
                </div>
              </div>
            </div>
          ))}
          {post.comments.length > 3 && (
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View all {post.commentsCount} comments
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.author?.id}`} className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {post.author?.profileImage ? (
                <img
                  src={post.author.profileImage}
                  alt={`${post.author.firstName} ${post.author.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-700">
                  {post.author?.firstName?.charAt(0) || 'U'}{post.author?.lastName?.charAt(0) || 'P'}
                </span>
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              to={`/profile/${post.author?.id}`}
              className="text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              {post.author?.firstName} {post.author?.lastName}
            </Link>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {isOwnPost && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-gray-400 hover:text-red-600 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        {renderMedia()}
        {renderTags()}
      </div>

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-4">
          {post.likesCount > 0 && (
            <span>{post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}</span>
          )}
          {post.commentsCount > 0 && (
            <span>{post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}</span>
          )}
          {post.sharesCount > 0 && (
            <span>{post.sharesCount} {post.sharesCount === 1 ? 'share' : 'shares'}</span>
          )}
        </div>
      </div>

      {/* Post Actions */}
      {showActions && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>Like</span>
          </button>

          <button
            onClick={handleComment}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Comment</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span>Share</span>
          </button>
        </div>
      )}

      {/* Comments Section */}
      {renderComments()}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post"
        size="sm"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Post;
