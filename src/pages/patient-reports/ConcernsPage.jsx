import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Tabs, Tab, Button } from '@mui/material';
import CategoryTabContent from '../../components/shared/CategoryTabContent';

const ConcernsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);

  // Navigation sections for the report pages
  const reportSections = [
    { id: 'risk', label: 'RISK ASSESSMENT', path: `/patients/${patientId}/report/risk` },
    { id: 'homecare', label: 'HOME CARE', path: `/patients/${patientId}/report/homecare` },
    { id: 'concerns', label: 'CONCERNS', path: `/patients/${patientId}/report/concerns` },
    { id: 'showcase', label: 'SHOWCASE', path: `/patients/${patientId}/report/showcase` },
  ];

  // Mock data - replace with actual API calls
  const mockDentalAssessment = {
    categories: {
      currentConcerns: {
        score: 55,
        status: 'concern',
        issues: [
          { id: 1, title: 'Tooth sensitivity', severity: 'moderate', description: 'Patient reports sensitivity to cold beverages' },
          { id: 2, title: 'Gum bleeding', severity: 'mild', description: 'Occasional bleeding during brushing' },
          { id: 3, title: 'Jaw pain', severity: 'moderate', description: 'Discomfort in TMJ area upon waking' },
        ],
      },
      treatmentNeeds: {
        score: 60,
        status: 'concern',
        issues: [
          { id: 4, title: 'Fillings needed', severity: 'severe', description: 'Two cavities require immediate attention' },
          { id: 5, title: 'Cleaning overdue', severity: 'moderate', description: 'Last prophylaxis was 8 months ago' },
        ],
      },
    },
  };

  const categories = Object.values(mockDentalAssessment.categories);

  // Navigation categories for Concerns
  const concernsCategories = [
    'Current Concerns',
    'Treatment Needs',
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
              bgcolor: section.id === 'concerns' ? 'primary.main' : 'grey.100',
              color: section.id === 'concerns' ? 'primary.contrastText' : 'text.primary',
              minWidth: 'auto',
              '&:hover': {
                bgcolor: section.id === 'concerns' ? 'primary.dark' : 'grey.200',
              },
            }}
          >
            {section.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Current dental issues and recommended treatments
        </Typography>
      </Box>

      {/* Unified Card with Navigation */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="flex-start">
          {/* Left Side - Visual */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box>
              <img 
                src="/report_visual.png" 
                alt="Dental Concerns Visualization"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Box>
          </Grid>

          {/* Right Side - Content with Navigation */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {/* Category Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={activeCategory}
                onChange={(event, newValue) => setActiveCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {concernsCategories.map((name) => (
                  <Tab 
                    key={name} 
                    label={name} 
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      minHeight: 48,
                    }} 
                  />
                ))}
              </Tabs>
            </Box>

            {/* Content for Selected Category */}
            <Box sx={{ p: 0 }}>
              <CategoryTabContent category={categories[activeCategory]} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ConcernsPage;
