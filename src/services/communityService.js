import mockApiService from '../mocks/mockApiService';

const communityService = {
  // Get all communities with pagination and filters
  getCommunities: async ({ page = 1, limit = 12, search = '', category = '' }) => {
    return mockApiService.getCommunities({ page, limit, filters: { search, category } });
  },

  // Get communities the user has joined
  getMyCommunities: async () => {
    return mockApiService.getCommunities({ page: 1, limit: 12 });
  },

  // Get a single community by ID
  getCommunityById: async (id) => {
    return mockApiService.getCommunityById(id);
  },

  // Create a new community
  createCommunity: async (communityData) => {
    return mockApiService.createCommunity(communityData);
  },

  // Update community details
  updateCommunity: async (id, data) => {
    return mockApiService.updateCommunity(id, data);
  },

  // Delete a community
  deleteCommunity: async (id) => {
    return mockApiService.deleteCommunity(id);
  },

  // Join a community
  joinCommunity: async (id) => {
    return mockApiService.joinCommunity(id);
  },

  // Leave a community
  leaveCommunity: async (id) => {
    return mockApiService.leaveCommunity(id);
  },

  // Get community members
  getCommunityMembers: async (id) => {
    return mockApiService.getCommunityMembers(id);
  },

  // Get community discussions/posts
  getCommunityDiscussions: async (id) => {
    return mockApiService.getDiscussions(id);
  },

  // Create a discussion in a community
  createDiscussion: async (communityId, data) => {
    return mockApiService.createDiscussion(communityId, data);
  },

  // Update a discussion
  updateDiscussion: async (communityId, discussionId, data) => {
    return mockApiService.updateDiscussion(communityId, discussionId, data);
  },

  // Delete a discussion
  deleteDiscussion: async (communityId, discussionId) => {
    return mockApiService.deleteDiscussion(communityId, discussionId);
  },

  // Search communities
  searchCommunities: async (query) => {
    return mockApiService.getCommunities({ page: 1, limit: 12, filters: { search: query } });
  },

  // Upload community image
  uploadCommunityImage: async (id, imageFile) => {
    return { data: { message: 'Image uploaded (mock)' } };
  },

  // Invite members to community
  inviteMembers: async (id, emails) => {
    return { data: { message: 'Invitations sent (mock)' } };
  },

  // Remove member from community (admin only)
  removeMember: async (communityId, userId) => {
    return { data: { message: 'Member removed (mock)' } };
  },

  // Update member role (admin only)
  updateMemberRole: async (communityId, userId, role) => {
    return { data: { message: 'Role updated (mock)' } };
  },

  // Get community categories
  getCategories: async () => {
    return { data: { categories: ['Technology', 'Business', 'Marketing', 'Design', 'Startup'] } };
  },

  // Get trending communities
  getTrendingCommunities: async () => {
    return mockApiService.getCommunities({ page: 1, limit: 12 });
  },

  // Get recommended communities based on user interests
  getRecommendedCommunities: async () => {
    return mockApiService.getCommunities({ page: 1, limit: 12 });
  },
};

export default communityService;
