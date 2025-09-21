/**
 * TreatmentList Component
 * 
 * A React component that displays a list of treatment records in a card format.
 * Includes features for deletion with confirmation, loading states, and empty state handling.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.treatments - Array of treatment objects to display
 * @param {boolean} props.loading - Loading state indicator
 * @param {Function} props.onTreatmentDeleted - Callback function called when a treatment is deleted
 * 
 * @example
 * <TreatmentList
 *   treatments={filteredTreatments}
 *   loading={isLoading}
 *   onTreatmentDeleted={() => refreshTreatments()}
 * />
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import {
  Delete,
  Person,
  Schedule,
  Notes,
  LocalHospital,
} from '@mui/icons-material';
import { treatmentService } from '../services/api';

const TreatmentList = ({ treatments, loading, onTreatmentDeleted }) => {
  /** @type {number|null} ID of treatment currently being deleted */
  const [deletingId, setDeletingId] = useState(null);
  
  /** @type {string|null} Error message for delete operations */
  const [deleteError, setDeleteError] = useState(null);
  
  /** @type {number|null} ID of treatment awaiting delete confirmation */
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  /**
   * Initiates the delete confirmation process for a treatment
   * @param {number} treatmentId - ID of the treatment to delete
   */
  const handleDeleteClick = (treatmentId) => {
    setConfirmDeleteId(treatmentId);
    setDeleteError(null);
  };

  /**
   * Confirms and executes the deletion of a treatment record
   * @param {number} treatmentId - ID of the treatment to delete
   */
  const handleConfirmDelete = async (treatmentId) => {
    setDeletingId(treatmentId);
    setDeleteError(null);

    try {
      await treatmentService.deleteTreatment(treatmentId);
      setConfirmDeleteId(null);
      onTreatmentDeleted(); // Notify parent component to refresh list
    } catch (error) {
      console.error('Error deleting treatment:', error);
      setDeleteError(error.error || 'Failed to delete treatment. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Cancels the delete confirmation dialog
   */
  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setDeleteError(null);
  };

  /**
   * Formats a date string into a user-friendly display format
   * @param {string} dateString - Date string in YYYY-MM-DD format
   * @returns {string} Formatted date string (e.g., "Jan 15, 2025")
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Formats a datetime string into a user-friendly display format
   * @param {string} dateTimeString - ISO datetime string
   * @returns {string} Formatted datetime string (e.g., "Jan 15, 2025, 02:30 PM")
   */
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

  // Loading state display
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={4}>
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Loading treatments...
        </Typography>
      </Box>
    );
  }

  // Empty state display
  if (treatments.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
        <LocalHospital sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No treatments found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start by adding your first treatment record using the "Add New Treatment" button above.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Delete Error Display */}
      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteError}
        </Alert>
      )}

      {/* Treatments Count Display */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {treatments.length} treatment{treatments.length !== 1 ? 's' : ''}
      </Typography>

      {/* Treatment Cards Grid */}
      <Grid container spacing={3}>
        {treatments.map((treatment) => (
          <Grid item xs={12} md={6} lg={4} key={treatment.id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Card Header with Patient Name and Treatment Type */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="primary" />
                    {treatment.patient_name}
                  </Typography>
                  <Chip 
                    label={treatment.treatment_type}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Treatment Details */}
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule color="action" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      Treatment Date:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(treatment.treatment_date)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule color="action" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      Record Created:
                    </Typography>
                    <Typography variant="body2">
                      {formatDateTime(treatment.created_at)}
                    </Typography>
                  </Box>

                  {/* Optional Notes Display */}
                  {treatment.notes && (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Notes color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                          Notes:
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 3, fontStyle: 'italic' }}>
                        {treatment.notes}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>

              {/* Treatment Actions (Delete with Confirmation) */}
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  onClick={() => handleDeleteClick(treatment.id)}
                  disabled={deletingId === treatment.id}
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={deletingId === treatment.id ? <CircularProgress size={16} /> : <Delete />}
                  fullWidth
                >
                  {deletingId === treatment.id ? 'Deleting...' : 'Delete'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteId !== null}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this treatment record? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={deletingId !== null}>
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmDelete(confirmDeleteId)}
            disabled={deletingId !== null}
            color="error"
            variant="contained"
            startIcon={deletingId !== null ? <CircularProgress size={16} /> : <Delete />}
          >
            {deletingId !== null ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TreatmentList;