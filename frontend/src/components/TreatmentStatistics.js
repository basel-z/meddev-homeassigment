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
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Paper,
  Divider,
  LinearProgress,
  Tooltip,
  Avatar,
  Fade,
  Grow,
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  DateRange,
  LocalHospital,
  Timeline,
  BarChart,
  CalendarMonth,
  MedicalServices,
} from '@mui/icons-material';

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

  // Calculate average treatments per month
  const avgTreatmentsPerMonth = Object.keys(monthStats).length > 0 
    ? (totalTreatments / Object.keys(monthStats).length).toFixed(1)
    : 0;

  // Get treatment type colors
  const getTypeColor = (type) => {
    const colors = {
      'Physiotherapy': 'primary',
      'Ultrasound': 'secondary', 
      'Stimulation': 'success'
    };
    return colors[type] || 'default';
  };

  // Calculate time span in a more readable format
  const getTimeSpanText = (start, end) => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.round(diffDays / 30)} months`;
    return `${Math.round(diffDays / 365)} years`;
  };

  // Empty state handling
  if (totalTreatments === 0) {
    return (
      <Grow in timeout={800}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 3
          }}
        >
          <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 64, height: 64 }}>
            <Assessment sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom color="primary">
            Treatment Statistics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No treatments to analyze yet. Start adding treatment records to see insightful statistics!
          </Typography>
        </Paper>
      </Grow>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 4,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          <BarChart sx={{ fontSize: 40, color: 'primary.main' }} />
          Treatment Statistics & Analytics
        </Typography>
        
        {/* Overview Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={800}>
              <Card 
                elevation={4} 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease' }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <LocalHospital sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    {totalTreatments}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Total Treatments
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={1000}>
              <Card 
                elevation={4} 
                sx={{ 
                  height: '100%',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease' }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                    <MedicalServices sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h3" color="secondary" fontWeight="bold" sx={{ mb: 1 }}>
                    {Object.keys(typeStats).length}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Treatment Types
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={1200}>
              <Card 
                elevation={4} 
                sx={{ 
                  height: '100%',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease' }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'success.main', width: 56, height: 56 }}>
                    <TrendingUp sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h3" color="success.main" fontWeight="bold" sx={{ mb: 1 }}>
                    {avgTreatmentsPerMonth}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Avg/Month
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={1400}>
              <Card 
                elevation={4} 
                sx={{ 
                  height: '100%',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease' }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'info.main', width: 56, height: 56 }}>
                    <CalendarMonth sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h3" color="info.main" fontWeight="bold" sx={{ mb: 1 }}>
                    {Object.keys(monthStats).length}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Active Months
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Detailed Statistics Breakdown */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in timeout={1600}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <Timeline />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                      Treatment Distribution
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(typeStats)
                      .sort(([,a], [,b]) => b - a)
                      .map(([type, count]) => {
                        const percentage = ((count / totalTreatments) * 100).toFixed(1);
                        return (
                          <Box key={type}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Chip 
                                label={type} 
                                color={getTypeColor(type)}
                                variant="outlined"
                                size="small"
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {count} ({percentage}%)
                                </Typography>
                              </Box>
                            </Box>
                            <Tooltip title={`${count} treatments (${percentage}%)`}>
                              <LinearProgress 
                                variant="determinate" 
                                value={Number(percentage)} 
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  bgcolor: 'grey.200',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                  }
                                }}
                                color={getTypeColor(type)}
                              />
                            </Tooltip>
                          </Box>
                        );
                      })
                    }
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grow in timeout={1800}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                      <DateRange />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                      Monthly Activity
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(monthStats)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .slice(0, 6)
                      .map(([monthKey, data]) => (
                        <Box key={monthKey} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'grey.50',
                          '&:hover': { bgcolor: 'grey.100' }
                        }}>
                          <Typography variant="body1" fontWeight="medium">
                            {data.name}
                          </Typography>
                          <Chip 
                            label={data.count} 
                            size="small" 
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                      ))
                    }
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Enhanced Date Range Information */}
          {oldestDate && newestDate && (
            <Grid item xs={12}>
              <Grow in timeout={2000}>
                <Card elevation={3}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'warning.main' }}>
                        <Assessment />
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold">
                        Treatment Timeline
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                          <Typography variant="caption" color="success.main" fontWeight="bold">
                            FIRST TREATMENT
                          </Typography>
                          <Typography variant="h6" sx={{ mt: 1 }}>
                            {oldestDate.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
                          <Typography variant="caption" color="info.main" fontWeight="bold">
                            LATEST TREATMENT
                          </Typography>
                          <Typography variant="h6" sx={{ mt: 1 }}>
                            {newestDate.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Typography>
                        </Paper>
                      </Grid>
                      {oldestDate !== newestDate && (
                        <Grid item xs={12} sm={4}>
                          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
                            <Typography variant="caption" color="warning.main" fontWeight="bold">
                              TOTAL SPAN
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 1 }}>
                              {getTimeSpanText(oldestDate, newestDate)}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          )}
        </Grid>
      </Box>
    </Fade>
  );
};

export default TreatmentStatistics;