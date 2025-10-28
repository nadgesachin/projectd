// Mock API Service - Returns mock data instead of making real API calls
import mockData from './mockData';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
const mockApiService = {
  // Enable/Disable mock mode
  enabled: true,

  // Auth
  async login(credentials) {
    await delay();
    if (credentials.email && credentials.password) {
      return {
        data: {
          user: mockData.currentUser,
          token: 'mock-jwt-token-12345',
        },
      };
    }
    throw new Error('Invalid credentials');
  },

  async register(userData) {
    await delay();
    return {
      data: {
        user: { ...mockData.currentUser, ...userData },
        token: 'mock-jwt-token-12345',
      },
    };
  },

  async logout() {
    await delay(200);
    return { data: { message: 'Logged out successfully' } };
  },

  // Users
  async getUsers({ page = 1, limit = 20, filters = {} }) {
    await delay();
    let users = [...mockData.users];
    
    // Apply filters
    if (filters.role) {
      users = users.filter(u => u.role === filters.role);
    }
    if (filters.status) {
      users = users.filter(u => u.status === filters.status);
    }
    if (filters.search) {
      users = users.filter(u => 
        u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        u.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return {
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(users.length / limit),
          totalItems: users.length,
          itemsPerPage: limit,
        },
      },
    };
  },

  async getUserById(id) {
    await delay();
    const user = mockData.users.find(u => u._id === id);
    if (!user) throw new Error('User not found');
    return { data: user };
  },

  // Communities
  async getCommunities({ page = 1, limit = 12, search = '', category = '' }) {
    await delay();
    let communities = [...mockData.communities];

    if (search) {
      communities = communities.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      communities = communities.filter(c => c.category === category);
    }

    return {
      data: {
        communities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(communities.length / limit),
          totalItems: communities.length,
          itemsPerPage: limit,
        },
      },
    };
  },

  async getMyCommunities() {
    await delay();
    const myCommunities = mockData.communities.filter(c => c.isMember);
    return { data: myCommunities };
  },

  async getCommunityById(id) {
    await delay();
    const community = mockData.communities.find(c => c._id === id);
    if (!community) throw new Error('Community not found');
    return { data: community };
  },

  async createCommunity(data) {
    await delay();
    const newCommunity = {
      _id: `comm${mockData.communities.length + 1}`,
      ...data,
      memberCount: 1,
      creator: mockData.currentUser,
      isMember: true,
      createdAt: new Date().toISOString(),
    };
    mockData.communities.unshift(newCommunity);
    return { data: newCommunity };
  },

  async joinCommunity(id) {
    await delay();
    const community = mockData.communities.find(c => c._id === id);
    if (community) {
      community.isMember = true;
      community.memberCount++;
    }
    return { data: community };
  },

  async leaveCommunity(id) {
    await delay();
    const community = mockData.communities.find(c => c._id === id);
    if (community) {
      community.isMember = false;
      community.memberCount--;
    }
    return { data: { message: 'Left community successfully' } };
  },

  async getCommunityMembers(id) {
    await delay();
    return { data: mockData.users.slice(0, 5) };
  },

  async getCommunityDiscussions(id) {
    await delay();
    return { data: mockData.discussions };
  },

  async createDiscussion(communityId, data) {
    await delay();
    const newDiscussion = {
      _id: `disc${mockData.discussions.length + 1}`,
      ...data,
      author: mockData.currentUser,
      likes: 0,
      repliesCount: 0,
      isPinned: false,
      isLiked: false,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    mockData.discussions.unshift(newDiscussion);
    return { data: newDiscussion };
  },

  // Events
  async getEvents({ page = 1, limit = 12, filters = {} }) {
    await delay();
    let events = [...mockData.events];

    if (filters.category) {
      events = events.filter(e => e.category === filters.category);
    }
    if (filters.type) {
      events = events.filter(e => e.eventType === filters.type);
    }

    return {
      data: {
        events,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(events.length / limit),
          totalItems: events.length,
          itemsPerPage: limit,
        },
      },
    };
  },

  async getMyEvents() {
    await delay();
    const myEvents = mockData.events.filter(e => 
      e.userRSVP === 'going' || e.organizer._id === mockData.currentUser._id
    );
    return { data: myEvents };
  },

  async getEventById(id) {
    await delay();
    const event = mockData.events.find(e => e._id === id);
    if (!event) throw new Error('Event not found');
    return { data: event };
  },

  async createEvent(data) {
    await delay();
    const newEvent = {
      _id: `event${mockData.events.length + 1}`,
      ...data,
      attendeeCount: 1,
      organizer: mockData.currentUser,
      userRSVP: 'going',
      createdAt: new Date().toISOString(),
    };
    mockData.events.unshift(newEvent);
    return { data: newEvent };
  },

  async rsvpEvent(id, status) {
    await delay();
    const event = mockData.events.find(e => e._id === id);
    if (event) {
      event.userRSVP = status;
      if (status === 'going') {
        event.attendeeCount++;
      } else if (event.userRSVP === 'going' && status !== 'going') {
        event.attendeeCount--;
      }
    }
    return { data: event };
  },

  async getEventAttendees(id) {
    await delay();
    return { data: mockData.users.slice(0, 10) };
  },

  // Posts
  async getPosts({ page = 1, limit = 20 }) {
    await delay();
    return {
      data: {
        posts: mockData.posts,
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: mockData.posts.length,
          itemsPerPage: limit,
        },
      },
    };
  },

  async createPost(data) {
    await delay();
    const newPost = {
      _id: `post${mockData.posts.length + 1}`,
      ...data,
      author: mockData.currentUser,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    mockData.posts.unshift(newPost);
    return { data: newPost };
  },

  async likePost(id) {
    await delay();
    const post = mockData.posts.find(p => p._id === id);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
    }
    return { data: post };
  },

  // Chat
  async getConversations() {
    await delay();
    return { data: mockData.conversations };
  },

  async getMessages(conversationId) {
    await delay();
    return { data: mockData.messages[conversationId] || [] };
  },

  async sendMessage(conversationId, content) {
    await delay();
    const newMessage = {
      _id: `msg${Date.now()}`,
      content,
      sender: mockData.currentUser,
      timestamp: new Date().toISOString(),
      read: false,
    };
    if (!mockData.messages[conversationId]) {
      mockData.messages[conversationId] = [];
    }
    mockData.messages[conversationId].push(newMessage);
    return { data: newMessage };
  },

  // Admin - Analytics
  async getAnalyticsOverview() {
    await delay();
    return { data: mockData.analytics.overview };
  },

  async getUserStats(timeRange) {
    await delay();
    return { data: mockData.analytics.userStats };
  },

  async getContentStats(timeRange) {
    await delay();
    return { data: mockData.analytics.contentStats };
  },

  async getEngagementStats(timeRange) {
    await delay();
    return { data: mockData.analytics.engagementStats };
  },

  // Admin - Reports
  async getReports({ page = 1, limit = 20, filters = {} }) {
    await delay();
    return {
      data: {
        reports: mockData.reports,
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: mockData.reports.length,
          itemsPerPage: limit,
        },
      },
    };
  },

  async getModerationQueue() {
    await delay();
    return { data: mockData.moderationQueue };
  },

  async resolveReport(reportId, action, reason) {
    await delay();
    const report = mockData.reports.find(r => r._id === reportId);
    if (report) {
      report.status = 'resolved';
    }
    return { data: report };
  },

  async moderateContent(contentId, contentType, action, reason) {
    await delay();
    mockData.moderationQueue = mockData.moderationQueue.filter(item => item._id !== contentId);
    return { data: { message: 'Content moderated successfully' } };
  },

  async updateUserStatus(userId, status) {
    await delay();
    const user = mockData.users.find(u => u._id === userId);
    if (user) {
      user.status = status;
    }
    return { data: user };
  },

  async updateUserRole(userId, role) {
    await delay();
    const user = mockData.users.find(u => u._id === userId);
    if (user) {
      user.role = role;
    }
    return { data: user };
  },

  async deleteUser(userId) {
    await delay();
    mockData.users = mockData.users.filter(u => u._id !== userId);
    return { data: { message: 'User deleted successfully' } };
  },

  async verifyUser(userId) {
    await delay();
    const user = mockData.users.find(u => u._id === userId);
    if (user) {
      user.isVerified = true;
    }
    return { data: user };
  },
};

// Helper function to enable/disable mock mode
export const setMockMode = (enabled) => {
  mockApiService.enabled = enabled;
};

// Helper function to check if mock mode is enabled
export const isMockMode = () => mockApiService.enabled;

export default mockApiService;

