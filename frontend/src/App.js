import React, { useState, useEffect } from 'react';
import TreatmentForm from './components/TreatmentForm';
import TreatmentList from './components/TreatmentList';
import TreatmentFilters from './components/TreatmentFilters';
import TreatmentStatistics from './components/TreatmentStatistics';
import { treatmentService } from './services/api';
import './styles.css';

function App() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    treatmentType: ''
  });
  const [showStatistics, setShowStatistics] = useState(false);

  // Load treatments on component mount
  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await treatmentService.getTreatments();
      setTreatments(data);
    } catch (err) {
      setError('Failed to load or set treatments. Please check if the server is running.');
      console.error('Error loading treatments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter treatments based on current filters
  const getFilteredTreatments = () => {
    return treatments.filter(treatment => {
      // Filter by date range
      if (filters.dateFrom) {
        const treatmentDate = new Date(treatment.treatment_date);
        const fromDate = new Date(filters.dateFrom);
        if (treatmentDate < fromDate) return false;
      }
      
      if (filters.dateTo) {
        const treatmentDate = new Date(treatment.treatment_date);
        const toDate = new Date(filters.dateTo);
        if (treatmentDate > toDate) return false;
      }
      
      // Filter by treatment type
      if (filters.treatmentType && treatment.treatment_type !== filters.treatmentType) {
        return false;
      }
      
      return true;
    });
  };

  // Get unique treatment types for filter dropdown
  const getAvailableTypes = () => {
    const types = [...new Set(treatments.map(t => t.treatment_type))];
    return types.sort();
  };

  const handleTreatmentCreated = async () => {
    setIsFormVisible(false);
    await loadTreatments();
  };

  const handleTreatmentDeleted = async () => {
    await loadTreatments();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img src={require('./meddevlogo.png')} alt="Health Tracker Logo" className="logo" />
          <div className="header-text">
            <h1>Digital Health Treatment Tracker</h1>
            <p>Manage patient treatments efficiently</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        {error ? (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={loadTreatments} className="retry-button">
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="action-bar">
              <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="primary-button"
              >
                {isFormVisible ? 'Cancel' : 'Add New Treatment'}
              </button>
              
              <button
                onClick={loadTreatments}
                className="secondary-button"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>

              <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="secondary-button"
              >
                {showStatistics ? 'Hide Statistics' : 'Show Statistics'}
              </button>
            </div>

            {isFormVisible && (
              <div className="form-section">
                <h2>Create New Treatment</h2>
                <TreatmentForm
                  onTreatmentCreated={handleTreatmentCreated}
                  onCancel={() => setIsFormVisible(false)}
                />
              </div>
            )}

            {showStatistics && (
              <div className="statistics-section">
                <TreatmentStatistics treatments={getFilteredTreatments()} />
              </div>
            )}

            <div className="filters-section">
              <TreatmentFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableTypes={getAvailableTypes()}
              />
            </div>

            <div className="list-section">
              <h2>Treatment Records</h2>
              <TreatmentList
                treatments={getFilteredTreatments()}
                loading={loading}
                onTreatmentDeleted={handleTreatmentDeleted}
              />
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Digital Health Treatment Tracker</p>
      </footer>
    </div>
  );
}

export default App;