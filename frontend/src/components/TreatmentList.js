import React, { useState } from 'react';
import { treatmentService } from '../services/api';

const TreatmentList = ({ treatments, loading, onTreatmentDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDeleteClick = (treatmentId) => {
    setConfirmDeleteId(treatmentId);
    setDeleteError(null);
  };

  const handleConfirmDelete = async (treatmentId) => {
    setDeletingId(treatmentId);
    setDeleteError(null);

    try {
      await treatmentService.deleteTreatment(treatmentId);
      setConfirmDeleteId(null);
      onTreatmentDeleted();
    } catch (error) {
      console.error('Error deleting treatment:', error);
      setDeleteError(error.error || 'Failed to delete treatment. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setDeleteError(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading treatments...</p>
      </div>
    );
  }

  if (treatments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No treatments found</h3>
        <p>Start by adding your first treatment record using the "Add New Treatment" button above.</p>
      </div>
    );
  }

  return (
    <div className="treatment-list">
      {deleteError && (
        <div className="error-message">
          {deleteError}
        </div>
      )}

      <div className="treatments-count">
        Showing {treatments.length} treatment{treatments.length !== 1 ? 's' : ''}
      </div>

      <div className="treatments-grid">
        {treatments.map((treatment) => (
          <div key={treatment.id} className="treatment-card">
            <div className="treatment-header">
              <h3 className="patient-name">{treatment.patient_name}</h3>
              <span className={`treatment-type type-${treatment.treatment_type.toLowerCase()}`}>
                {treatment.treatment_type}
              </span>
            </div>

            <div className="treatment-details">
              <div className="detail-row">
                <span className="detail-label">Treatment Date:</span>
                <span className="detail-value">{formatDate(treatment.treatment_date)}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Record Created:</span>
                <span className="detail-value">{formatDateTime(treatment.created_at)}</span>
              </div>

              {treatment.notes && (
                <div className="detail-row notes-row">
                  <span className="detail-label">Notes:</span>
                  <p className="detail-value notes-text">{treatment.notes}</p>
                </div>
              )}
            </div>

            <div className="treatment-actions">
              {confirmDeleteId === treatment.id ? (
                <div className="delete-confirmation">
                  <p>Are you sure you want to delete this treatment?</p>
                  <div className="confirmation-buttons">
                    <button
                      onClick={() => handleConfirmDelete(treatment.id)}
                      disabled={deletingId === treatment.id}
                      className="confirm-delete-button"
                    >
                      {deletingId === treatment.id ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      disabled={deletingId === treatment.id}
                      className="cancel-delete-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleDeleteClick(treatment.id)}
                  disabled={deletingId === treatment.id}
                  className="delete-button"
                >
                  {deletingId === treatment.id ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Alternative table view for larger screens */}
      <div className="treatments-table-container">
        <table className="treatments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Treatment Type</th>
              <th>Treatment Date</th>
              <th>Notes</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => (
              <tr key={treatment.id}>
                <td className="patient-name-cell">{treatment.patient_name}</td>
                <td>
                  <span className={`treatment-type-badge type-${treatment.treatment_type.toLowerCase()}`}>
                    {treatment.treatment_type}
                  </span>
                </td>
                <td>{formatDate(treatment.treatment_date)}</td>
                <td className="notes-cell">
                  {treatment.notes ? (
                    <div className="notes-preview" title={treatment.notes}>
                      {treatment.notes.length > 50 
                        ? `${treatment.notes.substring(0, 50)}...` 
                        : treatment.notes
                      }
                    </div>
                  ) : (
                    <span className="no-notes">—</span>
                  )}
                </td>
                <td className="created-cell">{formatDateTime(treatment.created_at)}</td>
                <td className="actions-cell">
                  {confirmDeleteId === treatment.id ? (
                    <div className="table-delete-confirmation">
                      <button
                        onClick={() => handleConfirmDelete(treatment.id)}
                        disabled={deletingId === treatment.id}
                        className="confirm-delete-button small"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        disabled={deletingId === treatment.id}
                        className="cancel-delete-button small"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDeleteClick(treatment.id)}
                      disabled={deletingId === treatment.id}
                      className="delete-button small"
                      title="Delete treatment"
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreatmentList;