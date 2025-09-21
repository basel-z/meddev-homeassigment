/**
 * TreatmentForm Component
 * 
 * A React component that provides a form interface for creating new treatment records.
 * Includes form validation, error handling, and loading states.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onTreatmentCreated - Callback function called when treatment is successfully created
 * @param {Function} props.onCancel - Callback function called when user cancels form
 * 
 * @example
 * <TreatmentForm 
 *   onTreatmentCreated={() => handleRefresh()}
 *   onCancel={() => setShowForm(false)}
 * />
 */

import React, { useState } from 'react';
import { treatmentService } from '../services/api';

const TreatmentForm = ({ onTreatmentCreated, onCancel }) => {
  /**
   * Form data state object containing all treatment fields
   * @type {Object}
   * @property {string} patient_name - Patient's full name
   * @property {string} treatment_type - Type of treatment (Physiotherapy/Ultrasound/Stimulation)
   * @property {string} treatment_date - Treatment date in YYYY-MM-DD format
   * @property {string} notes - Optional treatment notes
   */
  const [formData, setFormData] = useState({
    patient_name: '',
    treatment_type: '',
    treatment_date: '',
    notes: ''
  });
  
  /** @type {boolean} Loading state for form submission */
  const [loading, setLoading] = useState(false);
  
  /** @type {Array<string>} General form validation errors */
  const [errors, setErrors] = useState([]);
  
  /** @type {Object} Field-specific validation errors */
  const [fieldErrors, setFieldErrors] = useState({});

  /** @type {Array<string>} Available treatment types for dropdown */
  const treatmentTypes = ['Physiotherapy', 'Ultrasound', 'Stimulation'];

  /**
   * Handles input field changes and clears field-specific errors
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} e - Change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validates form data before submission
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = [];
    const newFieldErrors = {};

    // Validate patient name
    if (!formData.patient_name.trim()) {
      newErrors.push('Patient name is required');
      newFieldErrors.patient_name = 'Required';
    }

    // Validate treatment type
    if (!formData.treatment_type) {
      newErrors.push('Treatment type is required');
      newFieldErrors.treatment_type = 'Required';
    }

    // Validate treatment date
    if (!formData.treatment_date) {
      newErrors.push('Treatment date is required');
      newFieldErrors.treatment_date = 'Required';
    }

    setErrors(newErrors);
    setFieldErrors(newFieldErrors);
    return newErrors.length === 0;
  };

  /**
   * Handles form submission with validation and API call
   * @param {React.FormEvent<HTMLFormElement>} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      await treatmentService.createTreatment(formData);
      
      // Reset form to initial state
      setFormData({
        patient_name: '',
        treatment_type: '',
        treatment_date: '',
        notes: ''
      });
      
      // Notify parent component of successful creation
      onTreatmentCreated();
      
    } catch (error) {
      console.error('Error creating treatment:', error);
      
      // Handle different error response formats
      if (error.errors && Array.isArray(error.errors)) {
        setErrors(error.errors);
      } else {
        setErrors([error.error || 'Failed to create treatment. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets form to initial state
   */
  const handleReset = () => {
    setFormData({
      patient_name: '',
      treatment_type: '',
      treatment_date: '',
      notes: ''
    });
    setErrors([]);
    setFieldErrors({});
  };

  /**
   * Gets today's date in YYYY-MM-DD format for date input validation
   * @returns {string} Today's date in YYYY-MM-DD format
   */
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="treatment-form">
      <form onSubmit={handleSubmit} className="form">
        {/* Error Messages Display */}
        {errors.length > 0 && (
          <div className="error-messages">
            <h4>Please fix the following errors:</h4>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Patient Name Input */}
        <div className="form-group">
          <label htmlFor="patient_name" className="form-label">
            Patient Name *
          </label>
          <input
            type="text"
            id="patient_name"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleInputChange}
            className={`form-input ${fieldErrors.patient_name ? 'error' : ''}`}
            placeholder="Enter patient's full name"
            disabled={loading}
            required
          />
          {fieldErrors.patient_name && (
            <span className="field-error">{fieldErrors.patient_name}</span>
          )}
        </div>

        {/* Treatment Type Selection */}
        <div className="form-group">
          <label htmlFor="treatment_type" className="form-label">
            Treatment Type *
          </label>
          <select
            id="treatment_type"
            name="treatment_type"
            value={formData.treatment_type}
            onChange={handleInputChange}
            className={`form-select ${fieldErrors.treatment_type ? 'error' : ''}`}
            disabled={loading}
            required
          >
            <option value="">Select a treatment type</option>
            {treatmentTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldErrors.treatment_type && (
            <span className="field-error">{fieldErrors.treatment_type}</span>
          )}
        </div>

        {/* Treatment Date Input */}
        <div className="form-group">
          <label htmlFor="treatment_date" className="form-label">
            Treatment Date *
          </label>
          <input
            type="date"
            id="treatment_date"
            name="treatment_date"
            value={formData.treatment_date}
            onChange={handleInputChange}
            className={`form-input ${fieldErrors.treatment_date ? 'error' : ''}`}
            disabled={loading}
            required
          />
          {fieldErrors.treatment_date && (
            <span className="field-error">{fieldErrors.treatment_date}</span>
          )}
        </div>

        {/* Notes Textarea */}
        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Additional notes about the treatment..."
            rows="4"
            disabled={loading}
          />
        </div>

        {/* Form Action Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Treatment'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="reset-button"
            disabled={loading}
          >
            Reset
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TreatmentForm;