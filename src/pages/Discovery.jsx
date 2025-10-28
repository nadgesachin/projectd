import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

import GoogleMap from '../components/maps/GoogleMap';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { selectUser as selectAuthUser } from '../features/auth/authSlice';
import { useChat } from '../hooks/useChat';

const Discovery = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);
  const { startConversation } = useChat();
  
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: '',
    distance: 10,
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data for demonstration
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      role: 'entrepreneur',
      location: { lat: 40.7589, lng: -73.9851 },
      distance: 2.3,
      bio: 'Tech entrepreneur focused on AI solutions',
      interests: ['AI', 'Machine Learning', 'Startups'],
      profileImage: null,
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'investor',
      location: { lat: 40.7505, lng: -73.9934 },
      distance: 5.1,
      bio: 'Venture capitalist with 10+ years experience',
      interests: ['Fintech', 'Healthcare', 'SaaS'],
      profileImage: null,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'mentor',
      location: { lat: 40.7614, lng: -73.9776 },
      distance: 1.8,
      bio: 'Serial entrepreneur and startup advisor',
      interests: ['Leadership', 'Strategy', 'Growth'],
      profileImage: null,
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      role: 'entrepreneur',
      location: { lat: 40.7282, lng: -73.7949 },
      distance: 8.5,
      bio: 'Founder of sustainable fashion startup',
      interests: ['Sustainability', 'Fashion', 'E-commerce'],
      profileImage: null,
    },
  ];

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Using default location.');
        }
      );
    }
  }, []);

  // Filter users based on current filters
  useEffect(() => {
    let filteredUsers = mockUsers;

    // Filter by role
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }

    // Filter by distance (if user location is available)
    if (userLocation) {
      filteredUsers = filteredUsers.filter(user => user.distance <= filters.distance);
    }

    setNearbyUsers(filteredUsers);
  }, [filters, userLocation]);

  const handleMapClick = (location) => {
    console.log('Map clicked at:', location);
    // Could implement functionality to search users in clicked area
  };

  const handleMarkerClick = (user) => {
    setSelectedUser(user);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleConnect = (userId) => {
    toast.success(`Connection request sent to user ${userId}`);
    // Implement connection request logic
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'entrepreneur':
        return 'bg-green-100 text-green-800';
      case 'investor':
        return 'bg-blue-100 text-blue-800';
      case 'mentor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'entrepreneur':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'investor':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'mentor':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Create markers for the map
  const mapMarkers = nearbyUsers.map(user => ({
    position: user.location,
    title: user.name,
    user: user,
  }));

  return (
    <>
      <Helmet>
        <title>Discovery - ThriveUnity</title>
        <meta name="description" content="Discover and connect with entrepreneurs, investors, and mentors in your area" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discovery</h1>
            <p className="text-lg text-gray-600">
              Find and connect with entrepreneurs, investors, and mentors in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Map View</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Click on markers to view user details
                  </p>
                </div>
                <div className="p-6">
                  <GoogleMap
                    center={mapCenter}
                    zoom={12}
                    markers={mapMarkers}
                    onMarkerClick={handleMarkerClick}
                    onMapClick={handleMapClick}
                    className="w-full h-96"
                  />
                </div>
              </div>
            </div>

            {/* Filters and Results */}
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) => handleFilterChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Roles</option>
                      <option value="entrepreneur">Entrepreneur</option>
                      <option value="investor">Investor</option>
                      <option value="mentor">Mentor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance
                    </label>
                    <select
                      value={filters.distance}
                      onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5 km</option>
                      <option value={10}>10 km</option>
                      <option value={25}>25 km</option>
                      <option value={50}>50 km</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interests
                    </label>
                    <div className="space-y-2">
                      {['AI', 'Fintech', 'Healthcare', 'SaaS', 'Sustainability'].map((interest) => (
                        <label key={interest} className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Nearby Users ({nearbyUsers.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {nearbyUsers.length > 0 ? (
                      nearbyUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedUser?.id === user.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {user.name}
                                </h4>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                  {getRoleIcon(user.role)}
                                  <span className="ml-1 capitalize">{user.role}</span>
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{user.bio}</p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                  {user.distance} km away
                                </p>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startConversation(user.id);
                                    }}
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Chat
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConnect(user.id);
                                    }}
                                  >
                                    Connect
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No users found matching your criteria</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-700">
                          {selectedUser.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{selectedUser.name}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                          {getRoleIcon(selectedUser.role)}
                          <span className="ml-1 capitalize">{selectedUser.role}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Bio</h5>
                      <p className="text-sm text-gray-600">{selectedUser.bio}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Interests</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedUser.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => handleConnect(selectedUser.id)}
                      >
                        Connect
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedUser(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Discovery;