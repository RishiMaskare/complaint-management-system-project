import React, { useState, useEffect } from 'react';
import { getComplaints, updateComplaint, deleteComplaint } from '../services/complaintService';
import ComplaintCard from '../components/Complaints/ComplaintCard';
import ComplaintFilter from '../components/Complaints/ComplaintFilter';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    priority: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
      };

      const response = await getComplaints(params);
      setComplaints(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: response.pagination.totalPages,
      }));
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [pagination.page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      priority: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusUpdate = async (id, data) => {
    try {
      await updateComplaint(id, data);
      toast.success('Complaint updated successfully');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update complaint');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted successfully');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete complaint');
    }
  };

  // Filter complaints by search term locally
  const filteredComplaints = complaints.filter((complaint) => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      complaint.title.toLowerCase().includes(searchLower) ||
      complaint.description.toLowerCase().includes(searchLower) ||
      complaint.createdBy?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">All Complaints</h1>
          <p className="text-gray-600 mt-1">
            Manage and respond to all student complaints
          </p>
        </div>

        {/* Filters */}
        <ComplaintFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Complaints List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No complaints found matching your filters</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                  isAdmin={true}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(prev.totalPages, prev.page + 1),
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
