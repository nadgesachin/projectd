import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon, List, TrendingUp } from 'lucide-react';
import {
  fetchEvents,
  fetchMyEvents,
  rsvpEvent,
  selectEvents,
  selectMyEvents,
  selectEventLoading,
  selectEventError,
  selectPagination,
  selectFilters,
  setFilters,
} from '../features/events/eventSlice';
import EventCard from '../modules/events/EventCard';
import EventCalendar from '../modules/events/EventCalendar';
import EventFilters from '../modules/events/EventFilters';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const myEvents = useSelector(selectMyEvents);
  const loading = useSelector(selectEventLoading);
  const error = useSelector(selectEventError);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);

  const [activeTab, setActiveTab] = useState('all'); // all, my, trending
  const [viewMode, setViewMode] = useState('grid'); // grid, calendar
  const [selectedDate, setSelectedDate] = useState(null);

  const categories = [
    'Networking',
    'Workshop',
    'Conference',
    'Meetup',
    'Webinar',
    'Hackathon',
    'Pitch Event',
    'Social',
    'Training',
    'Panel Discussion',
  ];

  useEffect(() => {
    if (activeTab === 'all') {
      dispatch(fetchEvents({ page: 1, limit: 12, filters }));
    } else if (activeTab === 'my') {
      dispatch(fetchMyEvents());
    }
  }, [dispatch, activeTab, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRSVP = async (eventId, status) => {
    try {
      await dispatch(rsvpEvent({ id: eventId, status })).unwrap();
      toast.success(status === 'going' ? 'RSVP confirmed!' : 'RSVP cancelled');
    } catch (err) {
      toast.error(err || 'Failed to RSVP');
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Filter events by selected date
    const dateStr = date.toISOString().split('T')[0];
    dispatch(setFilters({ ...filters, customDate: dateStr }));
  };

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      dispatch(fetchEvents({ 
        page: pagination.currentPage + 1, 
        limit: 12, 
        filters 
      }));
    }
  };

  const displayedEvents = activeTab === 'my' ? myEvents : events;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">
              Discover and join events to network and learn from the community
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Calendar View"
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
            </div>

            <Link
              to="/create-event"
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'my'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Events ({myEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'trending'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
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
            <EventFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Events</span>
                  <span className="font-bold text-gray-900">{pagination.totalItems || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Events</span>
                  <span className="font-bold text-indigo-600">{myEvents.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Events Content */}
          <div className="lg:col-span-3">
            {viewMode === 'calendar' ? (
              <EventCalendar
                events={displayedEvents}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            ) : loading && events.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : displayedEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onRSVP={handleRSVP}
                      userRSVP={event.userRSVP}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {activeTab === 'all' && pagination.currentPage < pagination.totalPages && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <CalendarIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeTab === 'my' ? 'No Events Yet' : 'No Events Found'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === 'my'
                      ? 'RSVP to events or create your own to get started'
                      : 'Try adjusting your filters or create a new event'}
                  </p>
                  {activeTab === 'my' ? (
                    <button
                      onClick={() => setActiveTab('all')}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Explore Events
                    </button>
                  ) : (
                    <Link
                      to="/create-event"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Create Event
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

export default Events;

