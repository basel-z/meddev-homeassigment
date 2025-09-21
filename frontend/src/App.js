import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Alert,
  Stack,
  Paper,
} from '@mui/material';
import {
  Add,
  Refresh,
  Assessment,
  LocalHospital,
} from '@mui/icons-material';
import TreatmentForm from './components/TreatmentForm';
import TreatmentList from './components/TreatmentList';
import TreatmentFilters from './components/TreatmentFilters';
import TreatmentStatistics from './components/TreatmentStatistics';
import { treatmentService } from './services/api';

// Create Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

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
    if (!treatments || treatments.length === 0) {
      // Return default types if no treatments are loaded yet
      return ['Physiotherapy', 'Ultrasound', 'Stimulation'];
    }
    const types = [...new Set(treatments.map(t => t.treatment_type))].filter(Boolean);
    return types.length > 0 ? types.sort() : ['Physiotherapy', 'Ultrasound', 'Stimulation'];
  };

  const handleTreatmentCreated = async () => {
    setIsFormVisible(false);
    await loadTreatments();
  };

  const handleTreatmentDeleted = async () => {
    await loadTreatments();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Header */}
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Toolbar>
            <LocalHospital sx={{ mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h1">
                Digital Health Treatment Tracker
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage patient treatments efficiently
              </Typography>
            </Box>
            <Box
              component="img"
              src={require('./meddevlogo.png')}
              alt="Health Tracker Logo"
              sx={{ height: 40, ml: 2 }}
            />
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                {error}
              </Typography>
              <Button onClick={loadTreatments} variant="outlined" size="small">
                Retry
              </Button>
            </Alert>
          ) : (
            <Stack spacing={3}>
              {/* Action Bar */}
              <Paper elevation={1} sx={{ p: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    variant="contained"
                    startIcon={<Add />}
                    size="large"
                  >
                    {isFormVisible ? 'Cancel' : 'Add New Treatment'}
                  </Button>
                  
                  <Button
                    onClick={loadTreatments}
                    variant="outlined"
                    startIcon={<Refresh />}
                    disabled={loading}
                  >
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </Button>

                  <Button
                    onClick={() => setShowStatistics(!showStatistics)}
                    variant="outlined"
                    startIcon={<Assessment />}
                  >
                    {showStatistics ? 'Hide Statistics' : 'Show Statistics'}
                  </Button>
                </Stack>
              </Paper>

              {/* Treatment Form */}
              {isFormVisible && (
                <TreatmentForm
                  onTreatmentCreated={handleTreatmentCreated}
                  onCancel={() => setIsFormVisible(false)}
                />
              )}

              {/* Treatment Statistics */}
              {showStatistics && (
                <TreatmentStatistics treatments={getFilteredTreatments()} />
              )}

              {/* Treatment Filters */}
              <TreatmentFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableTypes={getAvailableTypes()}
              />

              {/* Treatment List */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  Treatment Records
                </Typography>
                <TreatmentList
                  treatments={getFilteredTreatments()}
                  loading={loading}
                  onTreatmentDeleted={handleTreatmentDeleted}
                />
              </Box>
            </Stack>
          )}
        </Container>

        {/* Footer */}
        <Paper component="footer" elevation={1} sx={{ py: 2, mt: 'auto' }}>
          <Container maxWidth="xl">
            <Typography variant="body2" color="text.secondary" align="center">
              &copy; 2025 Digital Health Treatment Tracker
            </Typography>
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;