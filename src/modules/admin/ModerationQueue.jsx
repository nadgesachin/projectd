import React from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const ModerationQueue = ({ queue, onApprove, onReject }) => {
  const getContentTypeBadge = (type) => {
    const badges = {
      post: 'bg-blue-100 text-blue-800',
      comment: 'bg-green-100 text-green-800',
      community: 'bg-purple-100 text-purple-800',
      event: 'bg-orange-100 text-orange-800',
      profile: 'bg-pink-100 text-pink-800',
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="divide-y divide-gray-200">
        {queue.map((item) => (
          <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getContentTypeBadge(item.contentType)}`}>
                    {item.contentType}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>

                {/* Author Info */}
                <Link
                  to={`/profile/${item.author._id}`}
                  className="flex items-center gap-2 mb-3 hover:text-blue-600"
                >
                  {item.author.profileImage ? (
                    <img
                      src={item.author.profileImage}
                      alt={item.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                      {item.author.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {item.author.name}
                  </span>
                </Link>

                {/* Content Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  {item.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  )}
                  <p className="text-sm text-gray-700 line-clamp-3">{item.content}</p>
                  {item.images && item.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {item.images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Content ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Flagged Reasons */}
                {item.flaggedReasons && item.flaggedReasons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.flaggedReasons.map((reason, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-4">
                <Link
                  to={`/admin/moderation/${item._id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                <button
                  onClick={() => onApprove(item._id, item.contentType)}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => onReject(item._id, item.contentType)}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {queue.length === 0 && (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-500">No items in the moderation queue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationQueue;

