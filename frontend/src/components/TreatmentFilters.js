/**
 * TreatmentFilters Component
 * 
 * A React component that provides filtering controls for the treatment list.
 * Allows users to filter treatments by date range and treatment type.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {string} props.filters.dateFrom - Start date filter (YYYY-MM-DD format)
 * @param {string} props.filters.dateTo - End date filter (YYYY-MM-DD format)
 * @param {string} props.filters.treatmentType - Treatment type filter
 * @param {Function} props.onFiltersChange - Callback function called when filters change
 * @param {Array<string>} props.availableTypes - Available treatment types for dropdown
 * 
 * @example
 * <TreatmentFilters
 *   filters={currentFilters}
 *   onFiltersChange={setFilters}
 *   availableTypes={['Physiotherapy', 'Ultrasound', 'Stimulation']}
 * />
 */

import React from 'react';

const TreatmentFilters = ({ 
  filters, 
  onFiltersChange, 
  availableTypes 
}) => {
  /**
   * Handles date range start change
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleDateFromChange = (e) => {
    onFiltersChange({
      ...filters,
      dateFrom: e.target.value
    });
  };

  /**
   * Handles date range end change
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleDateToChange = (e) => {
    onFiltersChange({
      ...filters,
      dateTo: e.target.value
    });
  };

  /**
   * Handles treatment type filter change
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
   */
  const handleTypeChange = (e) => {
    onFiltersChange({
      ...filters,
      treatmentType: e.target.value
    });
  };

  /**
   * Clears all filters and resets to default state
   */
  const handleClearFilters = () => {
    onFiltersChange({
      dateFrom: '',
      dateTo: '',
      treatmentType: ''
    });
  };

  return (
    <div className="treatment-filters">
      <h3>Filter Treatments</h3>
      
      <div className="filter-row">
        {/* Date Range Filters */}
        <div className="filter-group">
          <label htmlFor="dateFrom">From Date:</label>
          <input
            type="date"
            id="dateFrom"
            value={filters.dateFrom}
            onChange={handleDateFromChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="dateTo">To Date:</label>
          <input
            type="date"
            id="dateTo"
            value={filters.dateTo}
            onChange={handleDateToChange}
            className="filter-input"
          />
        </div>

        {/* Treatment Type Filter */}
        <div className="filter-group">
          <label htmlFor="treatmentType">Treatment Type:</label>
          <select
            id="treatmentType"
            value={filters.treatmentType}
            onChange={handleTypeChange}
            className="filter-input"
          >
            <option value="">All Types</option>
            {availableTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="filter-group">
          <button
            onClick={handleClearFilters}
            className="clear-filters-button"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentFilters;