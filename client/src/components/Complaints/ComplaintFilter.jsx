import React from 'react';
import { Filter, Search, X } from 'lucide-react';

const ComplaintFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const categories = ['All', 'Electricity', 'Water', 'Hostel', 'Cleanliness', 'Classroom', 'Other'];
  const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];
  const priorities = ['All', 'Low', 'Medium', 'High'];

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={onClearFilters}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4 mr-1" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="input"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === 'All' ? '' : cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="input"
        >
          {statuses.map((status) => (
            <option key={status} value={status === 'All' ? '' : status}>
              {status === 'All' ? 'All Statuses' : status}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="input"
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority === 'All' ? '' : priority}>
              {priority === 'All' ? 'All Priorities' : `${priority} Priority`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ComplaintFilter;
