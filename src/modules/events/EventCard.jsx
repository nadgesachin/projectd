import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Video, Building } from 'lucide-react';
import { format } from 'date-fns';

const EventCard = ({ event, onRSVP, userRSVP }) => {
  const {
    _id,
    title,
    description,
    eventType,
    startDate,
    endDate,
    location,
    image,
    attendeeCount,
    maxAttendees,
    category,
    organizer,
  } = event;

  const handleRSVP = (e) => {
    e.preventDefault();
    const newStatus = userRSVP === 'going' ? 'not_going' : 'going';
    onRSVP(_id, newStatus);
  };

  const getEventTypeIcon = () => {
    switch (eventType) {
      case 'online':
        return <Video className="w-4 h-4" />;
      case 'in-person':
        return <Building className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getEventTypeBadge = () => {
    const badges = {
      online: 'bg-green-100 text-green-800',
      'in-person': 'bg-blue-100 text-blue-800',
      hybrid: 'bg-purple-100 text-purple-800',
    };
    return badges[eventType] || badges['in-person'];
  };

  const isFull = maxAttendees && attendeeCount >= maxAttendees;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Event Image */}
      <Link to={`/events/${_id}`}>
        <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
              {title.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getEventTypeBadge()}`}>
              {getEventTypeIcon()}
              {eventType}
            </span>
          </div>
          
          {/* Date Badge */}
          <div className="absolute bottom-3 left-3 bg-white rounded-lg p-2 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {format(new Date(startDate), 'd')}
              </div>
              <div className="text-xs text-gray-600 uppercase">
                {format(new Date(startDate), 'MMM')}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Event Details */}
      <div className="p-4">
        {category && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full mb-2">
            {category}
          </span>
        )}

        <Link to={`/events/${_id}`}>
          <h3 className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Event Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {format(new Date(startDate), 'PPP')} at {format(new Date(startDate), 'p')}
            </span>
          </div>

          {location && eventType !== 'online' && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{location}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {attendeeCount || 0} {maxAttendees ? `/ ${maxAttendees}` : ''} attending
            </span>
          </div>

          {organizer && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">Organized by</span>
              <Link to={`/profile/${organizer._id}`} className="font-semibold text-indigo-600 hover:underline">
                {organizer.name}
              </Link>
            </div>
          )}
        </div>

        {/* RSVP Button */}
        <button
          onClick={handleRSVP}
          disabled={isFull && userRSVP !== 'going'}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
            userRSVP === 'going'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : isFull
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isFull && userRSVP !== 'going' 
            ? 'Event Full' 
            : userRSVP === 'going' 
            ? '✓ Going' 
            : 'RSVP'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;

