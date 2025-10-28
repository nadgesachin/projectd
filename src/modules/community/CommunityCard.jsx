import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Lock, Globe } from 'lucide-react';

const CommunityCard = ({ community, onJoin, onLeave, isJoined }) => {
  const {
    _id,
    name,
    description,
    category,
    image,
    memberCount,
    location,
    privacy,
    creator,
  } = community;

  const handleAction = (e) => {
    e.preventDefault();
    if (isJoined) {
      onLeave(_id);
    } else {
      onJoin(_id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Community Image */}
      <Link to={`/community/${_id}`}>
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              privacy === 'private' 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {privacy === 'private' ? (
                <><Lock className="inline w-3 h-3 mr-1" />Private</>
              ) : (
                <><Globe className="inline w-3 h-3 mr-1" />Public</>
              )}
            </span>
          </div>
        </div>
      </Link>

      {/* Community Details */}
      <div className="p-4">
        <Link to={`/community/${_id}`}>
          <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors mb-2">
            {name}
          </h3>
        </Link>

        {category && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full mb-2">
            {category}
          </span>
        )}

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Community Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{memberCount || 0} members</span>
          </div>
          {location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate max-w-[120px]">{location}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleAction}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
            isJoined
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isJoined ? 'Leave Community' : 'Join Community'}
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;

