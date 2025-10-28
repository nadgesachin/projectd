import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Star } from 'lucide-react';
import {
  fetchCommunities,
  fetchMyCommunities,
  joinCommunity,
  leaveCommunity,
  searchCommunities,
  selectCommunities,
  selectMyCommunities,
  selectCommunityLoading,
  selectCommunityError,
  selectPagination,
} from '../features/community/communitySlice';
import CommunityCard from '../modules/community/CommunityCard';
import CommunityFilters from '../modules/community/CommunityFilters';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const Communities = () => {
  const dispatch = useDispatch();
  const communities = useSelector(selectCommunities);
  const myCommunities = useSelector(selectMyCommunities);
  const loading = useSelector(selectCommunityLoading);
  const error = useSelector(selectCommunityError);
  const pagination = useSelector(selectPagination);

  const [activeTab, setActiveTab] = useState('all'); // all, my, trending
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    privacy: '',
    sortBy: 'newest',
  });

  const categories = [
    'Technology',
    'Entrepreneurship',
    'Investment',
    'Mentorship',
    'Networking',
    'Marketing',
    'Design',
    'Development',
    'Business',
    'Social Impact',
  ];

  useEffect(() => {
    if (activeTab === 'all') {
      dispatch(fetchCommunities({ page: 1, limit: 12, ...filters }));
    } else if (activeTab === 'my') {
      dispatch(fetchMyCommunities());
    }
  }, [dispatch, activeTab, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleJoinCommunity = async (id) => {
    try {
      await dispatch(joinCommunity(id)).unwrap();
      toast.success('Successfully joined community!');
    } catch (err) {
      toast.error(err || 'Failed to join community');
    }
  };

  const handleLeaveCommunity = async (id) => {
    try {
      await dispatch(leaveCommunity(id)).unwrap();
      toast.success('Successfully left community!');
    } catch (err) {
      toast.error(err || 'Failed to leave community');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      dispatch(fetchCommunities({ 
        page: pagination.currentPage + 1, 
        limit: 12, 
        ...filters 
      }));
    }
  };

  const isUserMember = (communityId) => {
    return myCommunities.some(c => c._id === communityId);
  };

  const displayedCommunities = activeTab === 'my' ? myCommunities : communities;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
            <p className="text-gray-600">
              Join communities to connect with like-minded entrepreneurs and mentors
            </p>
          </div>
          <Link
            to="/create-community"
            className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create Community
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Communities
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'my'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Communities ({myCommunities.length})
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'trending'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CommunityFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Communities</span>
                  <span className="font-bold text-gray-900">{pagination.totalItems || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Communities</span>
                  <span className="font-bold text-blue-600">{myCommunities.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Communities Grid */}
          <div className="lg:col-span-3">
            {loading && communities.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : displayedCommunities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedCommunities.map((community) => (
                    <CommunityCard
                      key={community._id}
                      community={community}
                      onJoin={handleJoinCommunity}
                      onLeave={handleLeaveCommunity}
                      isJoined={isUserMember(community._id)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {activeTab === 'all' && pagination.currentPage < pagination.totalPages && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeTab === 'my' ? 'No Communities Yet' : 'No Communities Found'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === 'my'
                      ? 'Join communities to connect with like-minded people'
                      : 'Try adjusting your filters or create a new community'}
                  </p>
                  {activeTab === 'my' ? (
                    <button
                      onClick={() => setActiveTab('all')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Explore Communities
                    </button>
                  ) : (
                    <Link
                      to="/create-community"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Create Community
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities;

