import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const priorityConfig = {
  High: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: AlertTriangle,
  },
  Medium: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: AlertCircle,
  },
  Low: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: CheckCircle,
  },
};

const PriorityBadge = ({ priority, showIcon = true }) => {
  const config = priorityConfig[priority] || priorityConfig.Low;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {priority}
    </span>
  );
};

export default PriorityBadge;
