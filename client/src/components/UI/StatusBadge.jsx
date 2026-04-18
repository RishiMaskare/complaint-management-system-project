import React from 'react';

const statusStyles = {
  Pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  'In Progress': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  Resolved: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
};

const StatusBadge = ({ status, showDot = true }) => {
  const styles = statusStyles[status] || statusStyles.Pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles.bg} ${styles.text} ${styles.border}`}
    >
      {showDot && (
        <span className={`w-2 h-2 rounded-full mr-2 ${styles.dot}`}></span>
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
