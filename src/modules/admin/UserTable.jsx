import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, CheckCircle, XCircle, Shield, Ban, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const UserTable = ({ users, onUpdateStatus, onUpdateRole, onDelete, onVerify }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-purple-100 text-purple-800',
      mentor: 'bg-blue-100 text-blue-800',
      investor: 'bg-green-100 text-green-800',
      entrepreneur: 'bg-orange-100 text-orange-800',
    };
    return badges[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      banned: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || badges.pending;
  };

  const handleMenuToggle = (userId) => {
    if (selectedUser === userId) {
      setShowMenu(!showMenu);
    } else {
      setSelectedUser(userId);
      setShowMenu(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Link to={`/profile/${user._id}`}>
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Link>
                    <div className="ml-4">
                      <Link
                        to={`/profile/${user._id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {user.name}
                      </Link>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block">
                    <button
                      onClick={() => handleMenuToggle(user._id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {showMenu && selectedUser === user._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowMenu(false)}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        
                        {!user.isVerified && (
                          <button
                            onClick={() => {
                              onVerify(user._id);
                              setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Verify User
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onUpdateRole(user._id, user.role === 'admin' ? 'entrepreneur' : 'admin');
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Change Role
                        </button>

                        {user.status === 'active' ? (
                          <button
                            onClick={() => {
                              onUpdateStatus(user._id, 'suspended');
                              setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onUpdateStatus(user._id, 'active');
                              setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Activate
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                              onDelete(user._id);
                            }
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;

