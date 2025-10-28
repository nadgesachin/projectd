import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Settings, 
  UserPlus, 
  LogOut,
  MessageCircle,
  Image as ImageIcon,
  FileText,
  Lock,
  Globe
} from 'lucide-react';
import {
  fetchCommunityById,
  fetchCommunityMembers,
  fetchCommunityDiscussions,
  joinCommunity,
  leaveCommunity,
  createDiscussion,
  selectCurrentCommunity,
  selectCommunityMembers,
  selectCommunityDiscussions,
  selectCommunityLoading,
  selectCommunityError,
} from '../features/community/communitySlice';
import { selectUser } from '../features/user/userSlice';
import CommunityMembersList from '../modules/community/CommunityMembersList';
import DiscussionThread from '../modules/community/DiscussionThread';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const CommunityDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const community = useSelector(selectCurrentCommunity);
  const members = useSelector(selectCommunityMembers);
  const discussions = useSelector(selectCommunityDiscussions);
  const loading = useSelector(selectCommunityLoading);
  const error = useSelector(selectCommunityError);
  const currentUser = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState('discussions');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [discussionForm, setDiscussionForm] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchCommunityById(id));
      dispatch(fetchCommunityMembers(id));
      dispatch(fetchCommunityDiscussions(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleJoinCommunity = async () => {
    try {
      await dispatch(joinCommunity(id)).unwrap();
      toast.success('Successfully joined community!');
    } catch (err) {
      toast.error(err || 'Failed to join community');
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      await dispatch(leaveCommunity(id)).unwrap();
      toast.success('Successfully left community!');
      navigate('/communities');
    } catch (err) {
      toast.error(err || 'Failed to leave community');
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!discussionForm.title.trim() || !discussionForm.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await dispatch(createDiscussion({ 
        communityId: id, 
        data: discussionForm 
      })).unwrap();
      toast.success('Discussion created successfully!');
      setDiscussionForm({ title: '', content: '' });
      setShowNewDiscussion(false);
    } catch (err) {
      toast.error(err || 'Failed to create discussion');
    }
  };

  const handleLikeDiscussion = (discussionId) => {
    // Implement like functionality
    console.log('Like discussion:', discussionId);
  };

  const handleReplyToDiscussion = (discussionId, content) => {
    // Implement reply functionality
    console.log('Reply to discussion:', discussionId, content);
  };

  const handlePinDiscussion = (discussionId) => {
    // Implement pin functionality
    console.log('Pin discussion:', discussionId);
  };

  if (loading && !community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Community not found</h2>
          <Link to="/communities" className="text-blue-600 hover:underline">
            Back to Communities
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = community.creator?._id === currentUser?._id;
  const isMember = community.isMember || false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover Image */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
            {community.image ? (
              <img
                src={community.image}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-9xl font-bold">
                {community.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                community.privacy === 'private' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {community.privacy === 'private' ? (
                  <><Lock className="w-4 h-4" />Private</>
                ) : (
                  <><Globe className="w-4 h-4" />Public</>
                )}
              </span>
            </div>
          </div>

          {/* Community Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{community.name}</h1>
                {community.category && (
                  <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-3">
                    {community.category}
                  </span>
                )}
                <p className="text-gray-600 mb-4">{community.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 md:mt-0">
                {isAdmin ? (
                  <Link
                    to={`/community/${id}/settings`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                ) : isMember ? (
                  <button
                    onClick={handleLeaveCommunity}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={handleJoinCommunity}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Join Community
                  </button>
                )}
              </div>
            </div>

            {/* Community Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{community.memberCount || members.length} members</span>
              </div>
              {community.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{community.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created {format(new Date(community.createdAt), 'PPP')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'discussions'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Discussions
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'members'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'about'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              About
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'discussions' && (
          <div>
            {isMember && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                {!showNewDiscussion ? (
                  <button
                    onClick={() => setShowNewDiscussion(true)}
                    className="w-full px-4 py-3 text-left text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Start a new discussion...
                  </button>
                ) : (
                  <form onSubmit={handleCreateDiscussion} className="space-y-4">
                    <input
                      type="text"
                      value={discussionForm.title}
                      onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                      placeholder="Discussion title..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={discussionForm.content}
                      onChange={(e) => setDiscussionForm({ ...discussionForm, content: e.target.value })}
                      rows="4"
                      placeholder="What would you like to discuss?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewDiscussion(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Post Discussion
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {discussions.length > 0 ? (
              <div>
                {discussions.map((discussion) => (
                  <DiscussionThread
                    key={discussion._id}
                    discussion={discussion}
                    onLike={handleLikeDiscussion}
                    onReply={handleReplyToDiscussion}
                    onPin={handlePinDiscussion}
                    isPinned={discussion.isPinned}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No discussions yet</h3>
                <p className="text-gray-600">
                  {isMember ? 'Be the first to start a discussion!' : 'Join the community to participate in discussions'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <CommunityMembersList
            members={members}
            isAdmin={isAdmin}
            onRemoveMember={(memberId) => console.log('Remove member:', memberId)}
            onUpdateRole={(memberId, role) => console.log('Update role:', memberId, role)}
          />
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this community</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{community.description}</p>
              </div>

              {community.rules && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Rules</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{community.rules}</p>
                </div>
              )}

              {community.tags && community.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {community.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Created By</h3>
                <Link to={`/profile/${community.creator?._id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  {community.creator?.profileImage ? (
                    <img
                      src={community.creator.profileImage}
                      alt={community.creator.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {community.creator?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{community.creator?.name}</p>
                    <p className="text-sm text-gray-600">{community.creator?.role || 'Community Creator'}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;

