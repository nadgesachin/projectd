import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  selectPostsLoading,
} from '../../features/posts/postSlice';
import { selectUser as selectAuthUser } from '../../features/auth/authSlice';
import { commentSchema } from '../../utils/validations';
import Button from '../common/Button';
import Loader from '../common/Loader';

const Comment = ({ comment, postId, onReply }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);
  const loading = useSelector(selectPostsLoading);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isOwnComment = currentUser?.id === comment.author?.id;
  const isLiked = comment.isLiked || false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      content: comment.content || '',
    },
  });

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await dispatch(likeComment({ postId, commentId: comment.id })).unwrap();
    } catch (error) {
      toast.error('Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const handleEdit = async (data) => {
    try {
      await dispatch(updateComment({
        postId,
        commentId: comment.id,
        commentData: data,
      })).unwrap();
      setIsEditing(false);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment({ postId, commentId: comment.id })).unwrap();
        toast.success('Comment deleted successfully');
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const handleReply = (data) => {
    if (onReply) {
      onReply(data, comment.id);
    }
    setIsReplying(false);
    reset();
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

  return (
    <div className="flex space-x-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {comment.author?.profileImage ? (
            <img
              src={comment.author.profileImage}
              alt={`${comment.author.firstName} ${comment.author.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-gray-700">
              {comment.author?.firstName?.charAt(0) || 'U'}{comment.author?.lastName?.charAt(0) || 'P'}
            </span>
          )}
        </div>
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-3">
            <div>
              <textarea
                {...register('content')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Edit your comment..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={loading}
              >
                {loading ? <Loader size="sm" /> : 'Save'}
              </Button>
            </div>
          </form>
        ) : (
          <>
            {/* Comment Header */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {comment.author?.firstName} {comment.author?.lastName}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(comment.createdAt)}
              </span>
              {comment.editedAt && comment.editedAt !== comment.createdAt && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>

            {/* Comment Text */}
            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-2">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>

            {/* Comment Actions */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center space-x-1 hover:text-gray-700 ${
                  isLiked ? 'text-red-600' : ''
                }`}
              >
                <svg
                  className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`}
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
                <span>{comment.likesCount || 0}</span>
              </button>

              <button
                onClick={() => setIsReplying(!isReplying)}
                className="hover:text-gray-700"
              >
                Reply
              </button>

              {isOwnComment && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="hover:text-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="hover:text-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* Reply Form */}
            {isReplying && (
              <div className="mt-3">
                <form onSubmit={handleSubmit(handleReply)} className="space-y-3">
                  <div>
                    <textarea
                      {...register('content')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                      placeholder={`Reply to ${comment.author?.firstName}...`}
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsReplying(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={loading}
                    >
                      {loading ? <Loader size="sm" /> : 'Reply'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 ml-4 space-y-3">
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                    onReply={onReply}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
