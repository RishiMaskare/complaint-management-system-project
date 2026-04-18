import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, AlertCircle } from 'lucide-react';
import { getComplaints } from '../services/complaintService';
import ComplaintCard from '../components/Complaints/ComplaintCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import StatusBadge from '../components/UI/StatusBadge';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getComplaints();
      setComplaints(response.data);
      
      // Calculate stats
      const data = response.data;
      setStats({
        total: data.length,
        pending: data.filter((c) => c.status === 'Pending').length,
        inProgress: data.filter((c) => c.status === 'In Progress').length,
        resolved: data.filter((c) => c.status === 'Resolved').length,
      });
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
            <p className="text-gray-600 mt-1">
              Track and manage your campus complaints
            </p>
          </div>
          <Link
            to="/student/submit"
            className="mt-4 sm:mt-0 btn-primary flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Submit New Complaint
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="card border-l-4 border-l-yellow-400">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="card border-l-4 border-l-blue-400">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="card border-l-4 border-l-green-400">
            <p className="text-sm font-medium text-gray-600">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          </div>
        </div>

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No complaints yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't submitted any complaints. Click the button below to get started.
            </p>
            <Link to="/student/submit" className="btn-primary inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
