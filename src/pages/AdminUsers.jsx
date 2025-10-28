import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, UserPlus } from 'lucide-react';
import {
  fetchUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  verifyUser,
  selectUsers,
  selectUserFilters,
  selectUserPagination,
  selectAdminLoading,
  setUserFilters,
} from '../features/admin/adminSlice';
import UserTable from '../modules/admin/UserTable';
import UserFilters from '../modules/admin/UserFilters';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const filters = useSelector(selectUserFilters);
  const pagination = useSelector(selectUserPagination);
  const loading = useSelector(selectAdminLoading);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 20, filters }));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    dispatch(setUserFilters(newFilters));
  };

  const handleUpdateStatus = async (userId, status) => {
    try {
      await dispatch(updateUserStatus({ userId, status })).unwrap();
      toast.success('User status updated successfully');
    } catch (err) {
      toast.error(err || 'Failed to update user status');
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await dispatch(updateUserRole({ userId, role })).unwrap();
      toast.success('User role updated successfully');
    } catch (err) {
      toast.error(err || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err || 'Failed to delete user');
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await dispatch(verifyUser(userId)).unwrap();
      toast.success('User verified successfully');
    } catch (err) {
      toast.error(err || 'Failed to verify user');
    }
  };

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      dispatch(fetchUsers({
        page: pagination.currentPage + 1,
        limit: 20,
        filters,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage all users, roles, and permissions</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Filters */}
        <UserFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{pagination.totalItems}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Suspended</p>
            <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'suspended').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Banned</p>
            <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'banned').length}</p>
          </div>
        </div>

        {/* User Table */}
        {loading && users.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            <UserTable
              users={users}
              onUpdateStatus={handleUpdateStatus}
              onUpdateRole={handleUpdateRole}
              onDelete={handleDeleteUser}
              onVerify={handleVerifyUser}
            />

            {/* Pagination */}
            {pagination.currentPage < pagination.totalPages && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

