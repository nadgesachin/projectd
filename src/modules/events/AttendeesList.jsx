import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, CheckCircle } from 'lucide-react';

const AttendeesList = ({ attendees, organizerId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Attendees ({attendees.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {attendees.map((attendee) => (
          <div
            key={attendee._id}
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center flex-1">
              {/* Avatar */}
              <Link to={`/profile/${attendee._id}`}>
                <div className="relative">
                  {attendee.profileImage ? (
                    <img
                      src={attendee.profileImage}
                      alt={attendee.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {attendee.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {attendee.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
              </Link>

              {/* Attendee Info */}
              <div className="ml-3 flex-1">
                <Link to={`/profile/${attendee._id}`}>
                  <h4 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors flex items-center gap-2">
                    {attendee.name}
                    {attendee._id === organizerId && (
                      <Crown className="w-4 h-4 text-yellow-500" title="Organizer" />
                    )}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {attendee.role && (
                    <span className="text-xs text-gray-500">{attendee.role}</span>
                  )}
                  {attendee.rsvpStatus === 'going' && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      Going
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Connect Button */}
            {attendee._id !== organizerId && (
              <Link
                to={`/profile/${attendee._id}`}
                className="px-3 py-1.5 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                View Profile
              </Link>
            )}
          </div>
        ))}

        {attendees.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No attendees yet. Be the first to RSVP!
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeesList;

