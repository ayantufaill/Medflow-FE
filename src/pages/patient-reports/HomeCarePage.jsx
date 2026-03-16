import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Tabs, Tab, Button } from '@mui/material';
import CategoryTabContent from '../../components/shared/CategoryTabContent';

const HomeCarePage = () => {
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
      oralHygiene: {
        score: 70,
        status: 'moderate',
        issues: [
          { id: 1, title: 'Plaque buildup', severity: 'moderate', description: 'Moderate plaque accumulation in posterior regions' },
          { id: 2, title: 'Brushing technique', severity: 'mild', description: 'Needs improvement in circular motion' },
        ],
      },
      flossing: {
        score: 50,
        status: 'concern',
        issues: [
          { id: 3, title: 'Inconsistent flossing', severity: 'moderate', description: 'Patient reports flossing 2-3 times per week' },
        ],
      },
      products: {
        score: 80,
        status: 'good',
        issues: [],
      },
    },
  };

  const categories = Object.values(mockDentalAssessment.categories);

  // Navigation categories for Home Care
  const homeCareCategories = [
    'Oral Hygiene',
    'Flossing', 
    'Products',
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
              bgcolor: section.id === 'homecare' ? 'primary.main' : 'grey.100',
              color: section.id === 'homecare' ? 'primary.contrastText' : 'text.primary',
              minWidth: 'auto',
              '&:hover': {
                bgcolor: section.id === 'homecare' ? 'primary.dark' : 'grey.200',
              },
            }}
          >
            {section.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Personalized oral hygiene recommendations and care instructions
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
                alt="Home Care Visualization"
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
                {homeCareCategories.map((name) => (
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

export default HomeCarePage;
