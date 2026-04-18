import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { getComplaints } from '../services/complaintService';
import { getAnalytics } from '../services/analyticsService';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import StatsCard from '../components/Analytics/StatsCard';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    resolutionRate: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch complaints and analytics in parallel
      const [complaintsRes, analyticsRes] = await Promise.all([
        getComplaints({ limit: 5 }),
        getAnalytics(),
      ]);

      const complaints = complaintsRes.data;
      const analytics = analyticsRes.data;

      setStats({
        total: analytics.totalComplaints,
        pending: analytics.complaintsByStatus.find(s => s.status === 'Pending')?.count || 0,
        inProgress: analytics.complaintsByStatus.find(s => s.status === 'In Progress')?.count || 0,
        resolved: analytics.complaintsByStatus.find(s => s.status === 'Resolved')?.count || 0,
        resolutionRate: analytics.resolutionRate,
      });

      setRecentComplaints(complaints.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of all campus complaints and system statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Complaints"
            value={stats.total}
            subtitle="All time complaints"
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            subtitle="Awaiting action"
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            subtitle="Being addressed"
            icon={AlertCircle}
            color="purple"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            subtitle={`${stats.resolutionRate}% resolution rate`}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/complaints"
              className="btn-primary flex items-center"
            >
              <FileText className="w-5 h-5 mr-2" />
              View All Complaints
            </Link>
            <Link
              to="/admin/analytics"
              className="btn-secondary flex items-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Analytics
            </Link>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
            <Link
              to="/admin/complaints"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No complaints submitted yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {complaint.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {complaint.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            complaint.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : complaint.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
