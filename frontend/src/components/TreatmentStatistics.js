/**
 * TreatmentStatistics Component
 * 
 * A React component that calculates and displays comprehensive statistics
 * about treatment records, including counts by type, time periods, and trends.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.treatments - Array of treatment objects to analyze
 * 
 * @example
 * <TreatmentStatistics treatments={filteredTreatments} />
 */

import React from 'react';

const TreatmentStatistics = ({ treatments }) => {
  // Calculate basic statistics
  const totalTreatments = treatments.length;
  
  /**
   * Count treatments by type
   * @type {Object} Object with treatment types as keys and counts as values
   */
  const typeStats = treatments.reduce((acc, treatment) => {
    const type = treatment.treatment_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  /**
   * Count treatments by month for trend analysis
   * @type {Object} Object with month keys (YYYY-MM) and count/name values
   */
  const monthStats = treatments.reduce((acc, treatment) => {
    const date = new Date(treatment.treatment_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    acc[monthKey] = {
      name: monthName,
      count: (acc[monthKey]?.count || 0) + 1
    };
    return acc;
  }, {});

  // Get date range of treatments for time span analysis
  const dates = treatments.map(t => new Date(t.treatment_date)).sort((a, b) => a - b);
  const oldestDate = dates.length > 0 ? dates[0] : null;
  const newestDate = dates.length > 0 ? dates[dates.length - 1] : null;

  // Find most common treatment type(s)
  const maxCount = Math.max(...Object.values(typeStats));
  const mostCommonTypes = Object.entries(typeStats).filter(([type, count]) => count === maxCount);

  // Empty state handling
  if (totalTreatments === 0) {
    return (
      <div className="statistics-container">
        <h3>Treatment Statistics</h3>
        <p className="no-data">No treatments to analyze yet.</p>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <h3>Treatment Statistics</h3>
      
      {/* Overview Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalTreatments}</div>
          <div className="stat-label">Total Treatments</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{Object.keys(typeStats).length}</div>
          <div className="stat-label">Treatment Types</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">
            {mostCommonTypes.length > 0 
              ? mostCommonTypes.map(([type]) => type).join(', ') 
              : 'N/A'
            }
          </div>
          <div className="stat-label">Most Common Type{mostCommonTypes.length > 1 ? 's' : ''}</div>
          <div className="stat-subtext">
            ({mostCommonTypes.length > 0 ? mostCommonTypes[0][1] : 0} treatments each)
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{Object.keys(monthStats).length}</div>
          <div className="stat-label">Active Months</div>
        </div>
      </div>

      {/* Detailed Statistics Breakdown */}
      <div className="detailed-stats">
        <div className="stat-section">
          <h4>By Treatment Type</h4>
          <div className="type-stats">
            {Object.entries(typeStats)
              .sort(([,a], [,b]) => b - a) // Sort by count descending
              .map(([type, count]) => (
                <div key={type} className="stat-item">
                  <span className={`type-badge type-${type.toLowerCase()}`}>
                    {type}
                  </span>
                  <span className="count">{count}</span>
                </div>
              ))
            }
          </div>
        </div>

        <div className="stat-section">
          <h4>By Month</h4>
          <div className="month-stats">
            {Object.entries(monthStats)
              .sort(([a], [b]) => b.localeCompare(a)) // Sort by month descending (newest first)
              .slice(0, 6) // Show last 6 months only for readability
              .map(([monthKey, data]) => (
                <div key={monthKey} className="stat-item">
                  <span className="month-name">{data.name}</span>
                  <span className="count">{data.count}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Date Range Information */}
        {oldestDate && newestDate && (
          <div className="stat-section">
            <h4>Date Range</h4>
            <div className="date-range-info">
              <div className="date-item">
                <span className="date-label">From:</span>
                <span className="date-value">
                  {oldestDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="date-item">
                <span className="date-label">To:</span>
                <span className="date-value">
                  {newestDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              {oldestDate !== newestDate && (
                <div className="date-item">
                  <span className="date-label">Span:</span>
                  <span className="date-value">
                    {Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentStatistics;