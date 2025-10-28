import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Settings,
  BarChart3,
  Shield,
} from 'lucide-react';
import {
  fetchAnalyticsOverview,
  fetchUserStats,
  fetchContentStats,
  fetchEngagementStats,
  fetchModerationQueue,
  selectAnalyticsOverview,
  selectUserStats,
  selectContentStats,
  selectEngagementStats,
  selectModerationQueue,
  selectAdminLoading,
} from '../features/admin/adminSlice';
import StatCard from '../modules/admin/StatCard';
import AnalyticsChart from '../modules/admin/AnalyticsChart';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const Admin = () => {
  const dispatch = useDispatch();
  const overview = useSelector(selectAnalyticsOverview);
  const userStats = useSelector(selectUserStats);
  const contentStats = useSelector(selectContentStats);
  const engagementStats = useSelector(selectEngagementStats);
  const moderationQueue = useSelector(selectModerationQueue);
  const loading = useSelector(selectAdminLoading);

  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    dispatch(fetchAnalyticsOverview());
    dispatch(fetchUserStats(timeRange));
    dispatch(fetchContentStats(timeRange));
    dispatch(fetchEngagementStats(timeRange));
    dispatch(fetchModerationQueue());
  }, [dispatch, timeRange]);

  // Mock data for charts (replace with real data from backend)
  const userGrowthData = userStats?.chartData || [
    { name: 'Jan', users: 400, active: 240 },
    { name: 'Feb', users: 500, active: 300 },
    { name: 'Mar', users: 650, active: 390 },
    { name: 'Apr', users: 780, active: 470 },
    { name: 'May', users: 920, active: 552 },
    { name: 'Jun', users: 1050, active: 630 },
  ];

  const contentData = contentStats?.chartData || [
    { name: 'Posts', value: 450 },
    { name: 'Comments', value: 1200 },
    { name: 'Communities', value: 85 },
    { name: 'Events', value: 120 },
  ];

  const engagementData = engagementStats?.chartData || [
    { name: 'Mon', likes: 120, comments: 45, shares: 30 },
    { name: 'Tue', likes: 150, comments: 55, shares: 35 },
    { name: 'Wed', likes: 180, comments: 70, shares: 45 },
    { name: 'Thu', likes: 160, comments: 60, shares: 40 },
    { name: 'Fri', likes: 200, comments: 80, shares: 50 },
    { name: 'Sat', likes: 140, comments: 50, shares: 35 },
    { name: 'Sun', likes: 110, comments: 40, shares: 25 },
  ];

  const quickStats = [
    {
      title: 'Total Users',
      value: overview?.totalUsers || '1,234',
      change: overview?.userGrowth || 12.5,
      changeType: 'increase',
      icon: Users,
      color: 'blue',
      subtitle: overview?.newUsersThisMonth ? `${overview.newUsersThisMonth} new this month` : undefined,
    },
    {
      title: 'Active Posts',
      value: overview?.totalPosts || '5,678',
      change: overview?.postGrowth || 8.3,
      changeType: 'increase',
      icon: FileText,
      color: 'green',
      subtitle: overview?.postsToday ? `${overview.postsToday} posted today` : undefined,
    },
    {
      title: 'Events',
      value: overview?.totalEvents || '120',
      change: overview?.eventGrowth || -2.4,
      changeType: 'decrease',
      icon: Calendar,
      color: 'purple',
      subtitle: overview?.upcomingEvents ? `${overview.upcomingEvents} upcoming` : undefined,
    },
    {
      title: 'Communities',
      value: overview?.totalCommunities || '85',
      change: overview?.communityGrowth || 15.7,
      changeType: 'increase',
      icon: MessageSquare,
      color: 'orange',
      subtitle: overview?.activeCommunities ? `${overview.activeCommunities} active` : undefined,
    },
    {
      title: 'Engagement Rate',
      value: overview?.engagementRate || '67%',
      change: overview?.engagementChange || 5.2,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'indigo',
      subtitle: 'Average interaction rate',
    },
    {
      title: 'Pending Reports',
      value: overview?.pendingReports || moderationQueue?.length || '12',
      changeType: moderationQueue?.length > 0 ? 'increase' : undefined,
      icon: AlertTriangle,
      color: 'red',
      subtitle: 'Requires moderation',
    },
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      link: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Content Moderation',
      description: 'Review flagged content and reports',
      icon: Shield,
      link: '/admin/moderation',
      color: 'bg-red-500',
    },
    {
      title: 'Analytics & Reports',
      description: 'View detailed analytics and insights',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-green-500',
    },
    {
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-purple-500',
    },
  ];

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform statistics and activities</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex justify-end">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range === '7d' && 'Last 7 days'}
                {range === '30d' && 'Last 30 days'}
                {range === '90d' && 'Last 90 days'}
                {range === '1y' && 'Last year'}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            type="area"
            data={userGrowthData}
            title="User Growth"
            dataKeys={['users', 'active']}
            height={300}
          />
          <AnalyticsChart
            type="bar"
            data={engagementData}
            title="Engagement Metrics"
            dataKeys={['likes', 'comments', 'shares']}
            height={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            type="pie"
            data={contentData}
            title="Content Distribution"
            dataKeys={['value']}
            height={300}
          />
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { user: 'John Doe', action: 'created a new community', time: '5 min ago' },
                { user: 'Jane Smith', action: 'reported a post', time: '15 min ago' },
                { user: 'Mike Johnson', action: 'joined an event', time: '1 hour ago' },
                { user: 'Sarah Williams', action: 'posted an update', time: '2 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

