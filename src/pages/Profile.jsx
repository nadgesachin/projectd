import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

import {
  fetchUserProfile,
  selectUserProfile,
  selectUserLoading,
  selectUserError,
  clearUserError,
} from '../features/user/userSlice';
import { selectUser as selectAuthUser } from '../features/auth/authSlice';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Profile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const currentUser = useSelector(selectAuthUser);
  const profile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  
  const [activeTab, setActiveTab] = useState('overview');
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    } else {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="lg" text="Loading profile..." />
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
            <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist.</p>
            <Link to="/discovery">
              <Button variant="primary">Discover Users</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'connections', label: 'Connections' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Connections</p>
                    <p className="text-2xl font-semibold text-gray-900">{profile.connectionsCount || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Projects</p>
                    <p className="text-2xl font-semibold text-gray-900">{profile.projectsCount || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Events</p>
                    <p className="text-2xl font-semibold text-gray-900">{profile.eventsCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {profile.recentActivity?.length > 0 ? (
                    profile.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">About</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Bio</h4>
                  <p className="text-gray-700">
                    {profile.bio || 'No bio available'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-700">
                    {profile.location || 'Location not specified'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Website</h4>
                  {profile.website ? (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      {profile.website}
                    </a>
                  ) : (
                    <p className="text-gray-500">No website provided</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests?.length > 0 ? (
                      profile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No interests specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Experience</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {profile.experience?.length > 0 ? (
                  profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-medium text-gray-900">{exp.title}</h4>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                      <p className="text-gray-700 mt-2">{exp.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No experience information available</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'connections':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Connections</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.connections?.length > 0 ? (
                  profile.connections.map((connection, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {connection.name?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {connection.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {connection.role}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4 col-span-full">No connections yet</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>{profile.firstName} {profile.lastName} - ThriveUnity</title>
        <meta name="description" content={`View ${profile.firstName} ${profile.lastName}'s profile on ThriveUnity`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600">
                      {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-lg text-gray-600 capitalize">{profile.role}</p>
                <p className="text-sm text-gray-500">{profile.location}</p>
                
                {/* Action Buttons */}
                <div className="mt-4 flex space-x-3">
                  {isOwnProfile ? (
                    <Link to="/edit-profile">
                      <Button variant="primary">Edit Profile</Button>
                    </Link>
                  ) : (
                    <>
                      <Button variant="primary">Connect</Button>
                      <Button variant="outline">Message</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
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

        {/* Tab Content */}
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
