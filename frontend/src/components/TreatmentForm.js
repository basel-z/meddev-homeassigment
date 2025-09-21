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
import {
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Save, Refresh, Cancel } from '@mui/icons-material';
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
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Treatment
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* Error Messages Display */}
        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Please fix the following errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Patient Name Input */}
          <TextField
            fullWidth
            id="patient_name"
            name="patient_name"
            label="Patient Name"
            value={formData.patient_name}
            onChange={handleInputChange}
            error={!!fieldErrors.patient_name}
            helperText={fieldErrors.patient_name}
            placeholder="Enter patient's full name"
            disabled={loading}
            required
            variant="outlined"
          />

          {/* Treatment Type Selection */}
          <FormControl fullWidth error={!!fieldErrors.treatment_type} required>
            <InputLabel id="treatment-type-label">Treatment Type</InputLabel>
            <Select
              labelId="treatment-type-label"
              id="treatment_type"
              name="treatment_type"
              value={formData.treatment_type}
              onChange={handleInputChange}
              label="Treatment Type"
              disabled={loading}
            >
              {treatmentTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {fieldErrors.treatment_type && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {fieldErrors.treatment_type}
              </Typography>
            )}
          </FormControl>

          {/* Treatment Date Input */}
          <TextField
            fullWidth
            id="treatment_date"
            name="treatment_date"
            label="Treatment Date"
            type="date"
            value={formData.treatment_date}
            onChange={handleInputChange}
            error={!!fieldErrors.treatment_date}
            helperText={fieldErrors.treatment_date}
            disabled={loading}
            required
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Notes Textarea */}
          <TextField
            fullWidth
            id="notes"
            name="notes"
            label="Notes (Optional)"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional notes about the treatment..."
            disabled={loading}
            variant="outlined"
            multiline
            rows={4}
          />

          {/* Form Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Creating...' : 'Create Treatment'}
            </Button>
            
            <Button
              type="button"
              onClick={handleReset}
              variant="outlined"
              startIcon={<Refresh />}
              disabled={loading}
            >
              Reset
            </Button>
            
            <Button
              type="button"
              onClick={onCancel}
              variant="outlined"
              color="secondary"
              startIcon={<Cancel />}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TreatmentForm;