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
import {
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';

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
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      treatmentType: value
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
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterList color="primary" />
        Filter Treatments
      </Typography>
      
      <Grid container spacing={3} alignItems="center">
        {/* Date Range Filters */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            type="date"
            label="From Date"
            value={filters.dateFrom}
            onChange={handleDateFromChange}
            variant="outlined"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            type="date"
            label="To Date"
            value={filters.dateTo}
            onChange={handleDateToChange}
            variant="outlined"
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* Treatment Type Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel 
              id="treatment-type-filter-label"
              shrink={true}
            >
              Treatment Type
            </InputLabel>
            <Select
              labelId="treatment-type-filter-label"
              id="treatment-type-filter"
              value={filters.treatmentType || ''}
              onChange={handleTypeChange}
              label="Treatment Type"
              displayEmpty
              notched={true}
              sx={{ 
                minWidth: 200,
                '& .MuiSelect-select': {
                  overflow: 'visible',
                  textOverflow: 'clip',
                  whiteSpace: 'nowrap',
                  paddingRight: '32px !important'
                }
              }}
              renderValue={(selected) => {
                if (!selected || selected === '') {
                  return 'All Types';
                }
                return selected;
              }}
            >
              <MenuItem value="">All Types</MenuItem>
              {availableTypes && availableTypes.length > 0 ? (
                availableTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))
              ) : (
                <>
                  <MenuItem value="Physiotherapy">Physiotherapy</MenuItem>
                  <MenuItem value="Ultrasound">Ultrasound</MenuItem>
                  <MenuItem value="Stimulation">Stimulation</MenuItem>
                </>
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Clear Filters Button */}
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            onClick={handleClearFilters}
            variant="outlined"
            startIcon={<Clear />}
            size="small"
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TreatmentFilters;