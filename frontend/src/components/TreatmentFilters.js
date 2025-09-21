import React from 'react';

const TreatmentFilters = ({ 
  filters, 
  onFiltersChange, 
  availableTypes 
}) => {
  const handleDateFromChange = (e) => {
    onFiltersChange({
      ...filters,
      dateFrom: e.target.value
    });
  };

  const handleDateToChange = (e) => {
    onFiltersChange({
      ...filters,
      dateTo: e.target.value
    });
  };

  const handleTypeChange = (e) => {
    onFiltersChange({
      ...filters,
      treatmentType: e.target.value
    });
  };

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