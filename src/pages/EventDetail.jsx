import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Video,
  Building,
  Share2,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  fetchEventById,
  fetchEventAttendees,
  rsvpEvent,
  deleteEvent,
  selectCurrentEvent,
  selectEventAttendees,
  selectEventLoading,
  selectEventError,
} from '../features/events/eventSlice';
import { selectUser } from '../features/user/userSlice';
import AttendeesList from '../modules/events/AttendeesList';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { format, isPast, isFuture } from 'date-fns';

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const event = useSelector(selectCurrentEvent);
  const attendees = useSelector(selectEventAttendees);
  const loading = useSelector(selectEventLoading);
  const error = useSelector(selectEventError);
  const currentUser = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState('details');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
      dispatch(fetchEventAttendees(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRSVP = async (status) => {
    try {
      await dispatch(rsvpEvent({ id, status })).unwrap();
      toast.success(status === 'going' ? 'RSVP confirmed!' : 'RSVP cancelled');
    } catch (err) {
      toast.error(err || 'Failed to RSVP');
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await dispatch(deleteEvent(id)).unwrap();
        toast.success('Event deleted successfully');
        navigate('/events');
      } catch (err) {
        toast.error(err || 'Failed to delete event');
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
    setShowShareModal(false);
  };

  const handleExportToCalendar = () => {
    // Implement calendar export functionality
    toast.info('Calendar export coming soon!');
  };

  if (loading && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <Link to="/events" className="text-indigo-600 hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isOrganizer = event.organizer?._id === currentUser?._id;
  const userRSVP = event.userRSVP || 'not_going';
  const isEventPast = isPast(new Date(event.endDate));
  const isEventFull = event.maxAttendees && event.attendeeCount >= event.maxAttendees;

  const getEventTypeIcon = () => {
    switch (event.eventType) {
      case 'online':
        return <Video className="w-5 h-5" />;
      case 'in-person':
        return <Building className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getEventTypeBadge = () => {
    const badges = {
      online: 'bg-green-100 text-green-800',
      'in-person': 'bg-blue-100 text-blue-800',
      hybrid: 'bg-purple-100 text-purple-800',
    };
    return badges[event.eventType] || badges['in-person'];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Image */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="relative h-96 bg-gradient-to-r from-indigo-500 to-purple-600">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-9xl font-bold">
                {event.title.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Event Type Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getEventTypeBadge()}`}>
                {getEventTypeIcon()}
                {event.eventType}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleShare}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
              {isOrganizer && (
                <>
                  <Link
                    to={`/events/${id}/edit`}
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-5 h-5 text-gray-700" />
                  </Link>
                  <button
                    onClick={handleDeleteEvent}
                    className="p-3 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Status Badge */}
            {isEventPast && (
              <div className="absolute bottom-4 left-4">
                <span className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-semibold">
                  Event Ended
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Event Title */}
              <div className="mb-6">
                {event.category && (
                  <span className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-3">
                    {event.category}
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                {/* Organizer Info */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gray-600">Organized by</span>
                  <Link to={`/profile/${event.organizer?._id}`} className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    {event.organizer?.profileImage ? (
                      <img
                        src={event.organizer.profileImage}
                        alt={event.organizer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {event.organizer?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{event.organizer?.name}</p>
                      <p className="text-sm text-gray-600">{event.organizer?.role || 'Event Organizer'}</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Date & Time</p>
                    <p className="text-gray-600">
                      {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-gray-600">
                      {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                    </p>
                  </div>
                </div>

                {event.location && event.eventType !== 'online' && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                )}

                {event.onlineLink && event.eventType !== 'in-person' && (
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Online Meeting</p>
                      <a
                        href={event.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Join Online
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Attendees</p>
                    <p className="text-gray-600">
                      {event.attendeeCount || 0} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} attending
                    </p>
                  </div>
                </div>

                {event.price > 0 && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Price</p>
                      <p className="text-gray-600">${event.price}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-2 font-semibold transition-colors ${
                      activeTab === 'details'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('attendees')}
                    className={`px-4 py-2 font-semibold transition-colors ${
                      activeTab === 'attendees'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Attendees ({attendees.length})
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'details' && (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About this event</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                  </div>
                )}

                {activeTab === 'attendees' && (
                  <AttendeesList attendees={attendees} organizerId={event.organizer?._id} />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              {!isEventPast && !isOrganizer && (
                <>
                  {userRSVP === 'going' ? (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-green-600 mb-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">You're going!</span>
                      </div>
                      <button
                        onClick={() => handleRSVP('not_going')}
                        className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                      >
                        Cancel RSVP
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRSVP('going')}
                      disabled={isEventFull}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-4 ${
                        isEventFull
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isEventFull ? 'Event Full' : 'RSVP'}
                    </button>
                  )}
                </>
              )}

              {isOrganizer && (
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-800 font-semibold">You're the organizer</p>
                </div>
              )}

              <button
                onClick={handleExportToCalendar}
                className="w-full py-3 px-4 mb-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Add to Calendar
              </button>

              {/* Event Stats */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Attendees</span>
                  <span className="font-semibold text-gray-900">{event.attendeeCount || 0}</span>
                </div>
                {event.maxAttendees && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-semibold text-gray-900">{event.maxAttendees}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold text-gray-900">
                    {event.price > 0 ? `$${event.price}` : 'Free'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

