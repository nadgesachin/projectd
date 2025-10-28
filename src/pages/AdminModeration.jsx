import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, AlertTriangle } from 'lucide-react';
import {
  fetchReports,
  fetchModerationQueue,
  resolveReport,
  moderateContent,
  selectReports,
  selectModerationQueue,
  selectReportFilters,
  selectAdminLoading,
  setReportFilters,
} from '../features/admin/adminSlice';
import ReportsList from '../modules/admin/ReportsList';
import ModerationQueue from '../modules/admin/ModerationQueue';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const AdminModeration = () => {
  const dispatch = useDispatch();
  const reports = useSelector(selectReports);
  const moderationQueue = useSelector(selectModerationQueue);
  const filters = useSelector(selectReportFilters);
  const loading = useSelector(selectAdminLoading);

  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    dispatch(fetchReports({ page: 1, limit: 20, filters }));
    dispatch(fetchModerationQueue());
  }, [dispatch, filters]);

  const handleResolveReport = async (reportId, action) => {
    try {
      await dispatch(resolveReport({ reportId, action, reason: action })).unwrap();
      toast.success(`Report ${action}d successfully`);
    } catch (err) {
      toast.error(err || 'Failed to resolve report');
    }
  };

  const handleApproveContent = async (contentId, contentType) => {
    try {
      await dispatch(moderateContent({ contentId, contentType, action: 'approve', reason: 'Approved by admin' })).unwrap();
      toast.success('Content approved');
    } catch (err) {
      toast.error(err || 'Failed to approve content');
    }
  };

  const handleRejectContent = async (contentId, contentType) => {
    try {
      await dispatch(moderateContent({ contentId, contentType, action: 'reject', reason: 'Rejected by admin' })).unwrap();
      toast.success('Content rejected');
    } catch (err) {
      toast.error(err || 'Failed to reject content');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
          <p className="text-gray-600">Review and moderate flagged content and reports</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Moderation Queue</p>
                <p className="text-2xl font-bold text-gray-900">{moderationQueue.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'reports'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'queue'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Moderation Queue ({moderationQueue.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading && reports.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            {activeTab === 'reports' && (
              <ReportsList reports={reports} onResolve={handleResolveReport} />
            )}
            {activeTab === 'queue' && (
              <ModerationQueue
                queue={moderationQueue}
                onApprove={handleApproveContent}
                onReject={handleRejectContent}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminModeration;

