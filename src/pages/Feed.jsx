import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  fetchPosts,
  selectPosts,
  selectPostsLoading,
  selectPostsError,
  selectHasMorePosts,
  selectPostsPage,
  clearPostError,
  resetPage,
} from '../features/posts/postSlice';
import { selectUser as selectAuthUser } from '../features/auth/authSlice';
import Post from '../components/posts/Post';
import PostForm from '../components/posts/PostForm';
import Loader from '../components/common/Loader';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Feed = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const hasMore = useSelector(selectHasMorePosts);
  const currentPage = useSelector(selectPostsPage);
  
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, following, trending

  // Load initial posts
  useEffect(() => {
    dispatch(resetPage());
    dispatch(fetchPosts({ page: 1, limit: 10, type: filter }));
  }, [dispatch, filter]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearPostError());
    }
  }, [error, dispatch]);

  // Load more posts
  const loadMorePosts = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchPosts({ page: currentPage + 1, limit: 10, type: filter }));
    }
  }, [dispatch, loading, hasMore, currentPage, filter]);

  // Refresh posts
  const refreshPosts = useCallback(() => {
    setRefreshing(true);
    dispatch(resetPage());
    dispatch(fetchPosts({ page: 1, limit: 10, type: filter, refresh: true }))
      .finally(() => setRefreshing(false));
  }, [dispatch, filter]);

  // Handle post creation success
  const handlePostCreated = () => {
    refreshPosts();
  };

  // Handle post comment
  const handlePostComment = (post) => {
    // This could open a comment modal or navigate to post detail
    console.log('Comment on post:', post.id);
  };

  // Handle post share
  const handlePostShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on ThriveUnity',
        text: post.content,
        url: `${window.location.origin}/post/${post.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      toast.success('Post link copied to clipboard');
    }
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
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
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        {filter === 'following'
          ? "You're not following anyone yet. Discover new people to follow!"
          : "Be the first to share something with the community!"}
      </p>
      {filter === 'following' && (
        <div className="mt-6">
          <button
            onClick={() => setFilter('all')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Discover Posts
          </button>
        </div>
      )}
    </div>
  );

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-300 rounded w-1/6 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex space-x-6">
              <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Feed - ThriveUnity</title>
        <meta name="description" content="Stay updated with the latest posts from your network" />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feed</h1>
          <p className="text-lg text-gray-600">
            Stay updated with the latest from your network
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', label: 'All Posts' },
                { id: 'following', label: 'Following' },
                { id: 'trending', label: 'Trending' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Post Form */}
        <div className="mb-8">
          <PostForm onSuccess={handlePostCreated} />
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {loading && posts.length === 0 ? (
            renderLoadingSkeleton()
          ) : posts.length === 0 ? (
            renderEmptyState()
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={loadMorePosts}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center py-8">
                  <Loader size="md" text="Loading more posts..." />
                </div>
              }
              endMessage={
                <div className="text-center py-8">
                  <p className="text-gray-500">You've reached the end of the feed</p>
                </div>
              }
              refreshFunction={refreshPosts}
              pullDownToRefresh
              pullDownToRefreshContent={
                <div className="text-center py-4">
                  <p className="text-gray-500">Pull down to refresh</p>
                </div>
              }
              releaseToRefreshContent={
                <div className="text-center py-4">
                  <p className="text-gray-500">Release to refresh</p>
                </div>
              }
            >
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onComment={handlePostComment}
                  onShare={handlePostShare}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>

        {/* Refresh Button */}
        {posts.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={refreshPosts}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {refreshing ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Feed
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Feed;
