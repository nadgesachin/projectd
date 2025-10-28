import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const ReportsList = ({ reports, onResolve }) => {
  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return badges[priority] || badges.medium;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || badges.pending;
  };

  const getContentTypeIcon = (type) => {
    return <Flag className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getContentTypeIcon(report.contentType)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {report.reason}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/profile/${report.reporter._id}`}
                    className="flex items-center hover:text-blue-600"
                  >
                    <div className="flex-shrink-0 h-8 w-8">
                      {report.reporter.profileImage ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={report.reporter.profileImage}
                          alt={report.reporter.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                          {report.reporter.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">
                        {report.reporter.name}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{report.contentType}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadge(report.priority)}`}>
                    {report.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(report.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {report.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onResolve(report._id, 'approve')}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onResolve(report._id, 'reject')}
                        className="text-red-600 hover:text-red-900"
                        title="Reject"
                      >
                        <AlertTriangle className="w-5 h-5" />
                      </button>
                      <Link
                        to={`/admin/reports/${report._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <Flag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsList;

