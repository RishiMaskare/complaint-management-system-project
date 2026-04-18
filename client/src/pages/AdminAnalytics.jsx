import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../services/analyticsService';
import StatsCard from '../components/Analytics/StatsCard';
import CategoryChart from '../components/Analytics/CategoryChart';
import StatusChart from '../components/Analytics/StatusChart';
import TimelineChart from '../components/Analytics/TimelineChart';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { FileText, CheckCircle, Clock, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to load analytics data');
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

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into complaint management
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Complaints"
            value={analytics.totalComplaints}
            subtitle="All time"
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Resolution Rate"
            value={`${analytics.resolutionRate}%`}
            subtitle="Of all complaints"
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Avg Resolution Time"
            value={`${analytics.avgResolutionTime} days`}
            subtitle="For resolved complaints"
            icon={Calendar}
            color="purple"
          />
          <StatsCard
            title="High Priority"
            value={analytics.complaintsByPriority.find(p => p.priority === 'High')?.count || 0}
            subtitle="Requires attention"
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CategoryChart data={analytics.complaintsByCategory} />
          <StatusChart data={analytics.complaintsByStatus} />
        </div>

        {/* Charts Row 2 */}
        <div className="mb-6">
          <TimelineChart data={analytics.complaintsOverTime} />
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {analytics.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {analytics.recentActivity.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      by {activity.createdBy?.name || 'Unknown'} on{' '}
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      activity.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : activity.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
