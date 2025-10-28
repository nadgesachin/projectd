import React from 'react';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';

const EventFilters = ({ filters, onFilterChange, categories }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Events
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Date Range
          </label>
          <select
            value={filters.dateRange || ''}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="next-month">Next Month</option>
          </select>
        </div>

        {/* Custom Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Date
          </label>
          <input
            type="date"
            value={filters.customDate || ''}
            onChange={(e) => onFilterChange({ ...filters, customDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            placeholder="Enter city or address..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <select
            value={filters.price || ''}
            onChange={(e) => onFilterChange({ ...filters, price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'date-asc'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date-asc">Date (Earliest First)</option>
            <option value="date-desc">Date (Latest First)</option>
            <option value="popular">Most Popular</option>
            <option value="attendees">Most Attendees</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => onFilterChange({ 
            search: '', 
            category: '', 
            type: '', 
            dateRange: '', 
            customDate: '',
            location: '', 
            price: '',
            sortBy: 'date-asc' 
          })}
          className="w-full py-2 px-4 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default EventFilters;

