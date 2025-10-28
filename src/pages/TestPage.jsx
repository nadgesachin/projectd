import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Shield,
  RefreshCw,
} from 'lucide-react';
import mockApiService from '../mocks/mockApiService';
import mockData from '../mocks/mockData';
import { isMockMode } from '../config/apiConfig';
import { toast } from 'react-toastify';

const TestPage = () => {
  const dispatch = useDispatch();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const tests = [
    {
      id: 'mock-mode',
      name: 'Mock Mode Status',
      category: 'Setup',
      test: async () => {
        return { success: isMockMode(), message: isMockMode() ? 'Mock mode is enabled' : 'Mock mode is disabled' };
      },
    },
    {
      id: 'mock-data',
      name: 'Mock Data Loaded',
      category: 'Setup',
      test: async () => {
        const hasData = mockData.users.length > 0 && mockData.communities.length > 0 && mockData.events.length > 0;
        return {
          success: hasData,
          message: hasData
            ? `Loaded ${mockData.users.length} users, ${mockData.communities.length} communities, ${mockData.events.length} events`
            : 'Mock data not loaded',
        };
      },
    },
    {
      id: 'auth-login',
      name: 'Authentication - Login',
      category: 'Auth',
      test: async () => {
        try {
          const result = await mockApiService.login({ email: 'test@example.com', password: 'password123' });
          return { success: !!result.data.token, message: 'Login successful, token received' };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'communities-list',
      name: 'Communities - Fetch List',
      category: 'Communities',
      test: async () => {
        try {
          const result = await mockApiService.getCommunities({ page: 1, limit: 12 });
          return {
            success: result.data.communities.length > 0,
            message: `Fetched ${result.data.communities.length} communities`,
          };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'communities-create',
      name: 'Communities - Create',
      category: 'Communities',
      test: async () => {
        try {
          const result = await mockApiService.createCommunity({
            name: 'Test Community',
            description: 'A test community',
            category: 'Technology',
            privacy: 'public',
          });
          return { success: !!result.data._id, message: 'Community created successfully' };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'communities-join',
      name: 'Communities - Join',
      category: 'Communities',
      test: async () => {
        try {
          const result = await mockApiService.joinCommunity('comm1');
          return { success: result.data.isMember, message: 'Joined community successfully' };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'events-list',
      name: 'Events - Fetch List',
      category: 'Events',
      test: async () => {
        try {
          const result = await mockApiService.getEvents({ page: 1, limit: 12 });
          return { success: result.data.events.length > 0, message: `Fetched ${result.data.events.length} events` };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'events-create',
      name: 'Events - Create',
      category: 'Events',
      test: async () => {
        try {
          const result = await mockApiService.createEvent({
            title: 'Test Event',
            description: 'A test event',
            category: 'Networking',
            eventType: 'online',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
          });
          return { success: !!result.data._id, message: 'Event created successfully' };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'events-rsvp',
      name: 'Events - RSVP',
      category: 'Events',
      test: async () => {
        try {
          const result = await mockApiService.rsvpEvent('event1', 'going');
          return { success: result.data.userRSVP === 'going', message: 'RSVP successful' };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'posts-list',
      name: 'Posts - Fetch List',
      category: 'Posts',
      test: async () => {
        try {
          const result = await mockApiService.getPosts({ page: 1, limit: 20 });
          return { success: result.data.posts.length > 0, message: `Fetched ${result.data.posts.length} posts` };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'posts-create',
      name: 'Posts - Create',
      category: 'Posts',
      test: async () => {
        try {
          const result = await mockApiService.createPost({ content: 'Test post content' });
          return { success: !!result.data._id, message: 'Post created successfully' };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'chat-conversations',
      name: 'Chat - Fetch Conversations',
      category: 'Chat',
      test: async () => {
        try {
          const result = await mockApiService.getConversations();
          return {
            success: result.data.length > 0,
            message: `Fetched ${result.data.length} conversations`,
          };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'chat-messages',
      name: 'Chat - Fetch Messages',
      category: 'Chat',
      test: async () => {
        try {
          const result = await mockApiService.getMessages('conv1');
          return { success: result.data.length > 0, message: `Fetched ${result.data.length} messages` };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'admin-analytics',
      name: 'Admin - Analytics Overview',
      category: 'Admin',
      test: async () => {
        try {
          const result = await mockApiService.getAnalyticsOverview();
          return { success: !!result.data.totalUsers, message: `Analytics loaded: ${result.data.totalUsers} users` };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'admin-users',
      name: 'Admin - User Management',
      category: 'Admin',
      test: async () => {
        try {
          const result = await mockApiService.getUsers({ page: 1, limit: 20 });
          return { success: result.data.users.length > 0, message: `Fetched ${result.data.users.length} users` };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
    {
      id: 'admin-reports',
      name: 'Admin - Reports',
      category: 'Admin',
      test: async () => {
        try {
          const result = await mockApiService.getReports({ page: 1, limit: 20 });
          return { success: true, message: `Fetched ${result.data.reports.length} reports` };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },
    },
  ];

  const runAllTests = async () => {
    setTesting(true);
    setTestResults({});
    const results = {};

    for (const test of tests) {
      try {
        const result = await test.test();
        results[test.id] = result;
      } catch (error) {
        results[test.id] = { success: false, message: error.message };
      }
    }

    setTestResults(results);
    setTesting(false);

    const passedTests = Object.values(results).filter((r) => r.success).length;
    if (passedTests === tests.length) {
      toast.success(`All ${tests.length} tests passed! ✨`);
    } else {
      toast.warning(`${passedTests}/${tests.length} tests passed`);
    }
  };

  const runSingleTest = async (test) => {
    setTesting(true);
    try {
      const result = await test.test();
      setTestResults((prev) => ({ ...prev, [test.id]: result }));
      if (result.success) {
        toast.success(`Test passed: ${test.name}`);
      } else {
        toast.error(`Test failed: ${test.name}`);
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [test.id]: { success: false, message: error.message } }));
      toast.error(`Test error: ${test.name}`);
    }
    setTesting(false);
  };

  const categories = [...new Set(tests.map((t) => t.category))];

  const getStatusIcon = (testId) => {
    const result = testResults[testId];
    if (!result) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    return result.success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Setup: Shield,
      Auth: Users,
      Communities: MessageSquare,
      Events: Calendar,
      Posts: FileText,
      Chat: MessageSquare,
      Admin: Shield,
    };
    const Icon = icons[category] || AlertCircle;
    return <Icon className="w-5 h-5" />;
  };

  const getStats = () => {
    const total = tests.length;
    const tested = Object.keys(testResults).length;
    const passed = Object.values(testResults).filter((r) => r.success).length;
    const failed = tested - passed;
    return { total, tested, passed, failed };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frontend Testing Dashboard</h1>
          <p className="text-gray-600">
            Test all modules with mock data to ensure everything works before backend integration
          </p>
        </div>

        {/* Mock Mode Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Mock Mode: {isMockMode() ? 'Enabled' : 'Disabled'}</h3>
              <p className="text-sm text-blue-700">
                {isMockMode()
                  ? 'Using mock data for all API calls. Perfect for frontend testing!'
                  : 'Using real API endpoints'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Total Tests</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Tested</p>
            <p className="text-3xl font-bold text-blue-600">{stats.tested}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Passed</p>
            <p className="text-3xl font-bold text-green-600">{stats.passed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={testing}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        {/* Tests by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
                  <span className="ml-auto text-sm text-gray-600">
                    {tests.filter((t) => t.category === category).length} tests
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {tests
                  .filter((t) => t.category === category)
                  .map((test) => (
                    <div key={test.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {getStatusIcon(test.id)}
                          <div>
                            <h3 className="font-medium text-gray-900">{test.name}</h3>
                            {testResults[test.id] && (
                              <p
                                className={`text-sm mt-1 ${
                                  testResults[test.id].success ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                {testResults[test.id].message}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => runSingleTest(test)}
                          disabled={testing}
                          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          Run Test
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}

        {/* Mock Data Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mock Data Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Users</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.users.length}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Communities</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.communities.length}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Events</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.events.length}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Posts</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.posts.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
