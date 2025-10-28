import React, { useState } from 'react';
import { Crown, Shield, User, MoreVertical, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityMembersList = ({ members, isAdmin, onRemoveMember, onUpdateRole }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-yellow-100 text-yellow-800',
      moderator: 'bg-blue-100 text-blue-800',
      member: 'bg-gray-100 text-gray-800',
    };
    return badges[role] || badges.member;
  };

  const handleMenuToggle = (memberId) => {
    if (selectedMember === memberId) {
      setShowMenu(!showMenu);
    } else {
      setSelectedMember(memberId);
      setShowMenu(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Members ({members.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {members.map((member) => (
          <div
            key={member._id}
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center flex-1">
              {/* Avatar */}
              <Link to={`/profile/${member._id}`}>
                <div className="relative">
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {member.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
              </Link>

              {/* Member Info */}
              <div className="ml-3 flex-1">
                <Link to={`/profile/${member._id}`}>
                  <h4 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                    {member.name}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleBadge(member.role)}`}>
                    {getRoleIcon(member.role)}
                    {member.role}
                  </span>
                  {member.expertise && (
                    <span className="text-xs text-gray-500">• {member.expertise}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Menu (for admins) */}
            {isAdmin && member.role !== 'admin' && (
              <div className="relative">
                <button
                  onClick={() => handleMenuToggle(member._id)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {showMenu && selectedMember === member._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => {
                        onUpdateRole(member._id, member.role === 'moderator' ? 'member' : 'moderator');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      {member.role === 'moderator' ? 'Remove as Moderator' : 'Make Moderator'}
                    </button>
                    <button
                      onClick={() => {
                        onRemoveMember(member._id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <UserMinus className="w-4 h-4" />
                      Remove Member
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {members.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No members found
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityMembersList;

