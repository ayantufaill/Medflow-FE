import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, Paper, Divider } from '@mui/material';

const ShowcasePage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  // Navigation sections for the report pages
  const reportSections = [
    { id: 'risk', label: 'RISK ASSESSMENT', path: `/patients/${patientId}/report/risk` },
    { id: 'homecare', label: 'HOME CARE', path: `/patients/${patientId}/report/homecare` },
    { id: 'concerns', label: 'CONCERNS', path: `/patients/${patientId}/report/concerns` },
    { id: 'showcase', label: 'SHOWCASE', path: `/patients/${patientId}/report/showcase` },
  ];

  // Mock data - replace with actual API calls
  const mockTreatments = [
    { 
      id: 1, 
      title: 'Teeth Whitening', 
      date: '2024-01-15', 
      beforeImage: '/Damaged_teeth.png',
      afterImage: '/white_teeth.png',
      description: 'Professional whitening treatment - 3 shades lighter' 
    },
    { 
      id: 2, 
      title: 'Composite Filling', 
      date: '2024-01-10', 
      beforeImage: '/cavity_teeth.png',
      afterImage: '/repaired_teeth.png',
      description: 'Tooth-colored restoration on molar' 
    },
    { 
      id: 3, 
      title: 'Dental Crown', 
      date: '2023-12-20', 
      beforeImage: '/before_treatment.png',
      afterImage: '/repaired_teeth.png',
      description: 'Porcelain crown on premolar' 
    },
  ];

  return (
    <Box>
      {/* Top Navigation Bar - Like Patient Pages */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {reportSections.map((section) => (
          <Button
            key={section.id}
            variant="text"
            size="small"
            onClick={() => navigate(section.path)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.02em',
              py: 1,
              px: 1.5,
              borderRadius: 1,
              bgcolor: section.id === 'showcase' ? 'primary.main' : 'grey.100',
              color: section.id === 'showcase' ? 'primary.contrastText' : 'text.primary',
              minWidth: 'auto',
              '&:hover': {
                bgcolor: section.id === 'showcase' ? 'primary.dark' : 'grey.200',
              },
            }}
          >
            {section.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Before and after comparisons of completed treatments
        </Typography>
      </Box>

      {/* Unified Card Layout */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left Side - Visual */}
          <Box sx={{ flex: '0 0 calc(50% - 12px)', maxWidth: 'calc(50% - 12px)' }}>
            <img 
              src="/report_visual.png" 
              alt="Treatment Showcase Visualization"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>

          {/* Vertical Divider */}
          <Box sx={{ 
            width: '1px', 
            bgcolor: '#bdbdbd',
            minHeight: '400px',
            flexShrink: 0
          }} />

          {/* Right Side - Content */}
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 0 }}>
            <Box>
              {mockTreatments.map((treatment) => (
              <Card key={treatment.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {treatment.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Completed: {treatment.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {treatment.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="subtitle2" gutterBottom textAlign="center">
                        Before
                      </Typography>
                      <Box 
                        component="img"
                        src={treatment.beforeImage}
                        alt={`Before ${treatment.title}`}
                        sx={{ 
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mb: 1
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="subtitle2" gutterBottom textAlign="center">
                        After
                      </Typography>
                      <Box 
                        component="img"
                        src={treatment.afterImage}
                        alt={`After ${treatment.title}`}
                        sx={{ 
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mb: 1
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ShowcasePage;
