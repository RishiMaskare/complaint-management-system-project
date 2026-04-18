import React, { useState } from 'react';
import { Calendar, User, MessageSquare, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import PriorityBadge from '../UI/PriorityBadge';
import Modal from '../UI/Modal';

const ComplaintCard = ({ complaint, isAdmin, onStatusUpdate, onDelete }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [status, setStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState(complaint.remarks || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    await onStatusUpdate(complaint._id, { status, remarks });
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    await onDelete(complaint._id);
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="card-hover">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {complaint.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {complaint.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(complaint.createdAt)}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {complaint.createdBy?.name || 'Unknown'}
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                  {complaint.category}
                </span>
              </div>
            </div>

            {complaint.remarks && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-800 text-sm font-medium mb-1">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Admin Remarks
                </div>
                <p className="text-blue-700 text-sm">{complaint.remarks}</p>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-2">
            {complaint.imageUrl && (
              <button
                onClick={() => setShowImageModal(true)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="View Image"
              >
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Admin Update Section */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input sm:w-40"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add remarks..."
                className="input flex-1"
              />
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="btn-primary flex items-center justify-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Complaint Image"
        size="lg"
      >
        <div className="flex justify-center">
          <img
            src={complaint.imageUrl}
            alt="Complaint"
            className="max-w-full max-h-[70vh] rounded-lg"
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Complaint"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-gray-500 mb-6">
            This action cannot be undone. This complaint will be permanently deleted.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ComplaintCard;
