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
        title: 'Oral Hygiene Routine',
        subtitle: 'Your daily brushing and cleaning habits',
        description: 'Based on our examination and your reported habits, we\'ve evaluated your current oral hygiene routine and identified areas for improvement.',
        findingsTitle: 'Current Status',
        issues: [
          { id: 1, label: 'Brushing frequency', value: 'Twice daily' },
          { id: 2, label: 'Brushing duration', value: '2-3 minutes' },
          { id: 3, label: 'Toothbrush type', value: 'Electric toothbrush' },
          { id: 4, label: 'Plaque buildup', value: 'Moderate in posterior regions' },
          { id: 5, label: 'Brushing technique', value: 'Needs improvement - circular motion recommended' },
        ],
        comment: 'Your brushing routine shows good consistency, but there\'s room for improvement in technique and thoroughness.',
        explanations: [
          'We noticed moderate plaque accumulation in the back teeth areas, which are often missed during regular brushing.',
          'Your electric toothbrush is an excellent choice, but proper angulation is crucial for optimal plaque removal.',
          'Consider spending extra time on the molars and premolars where we observed the most buildup.',
        ],
      },
      flossing: {
        title: 'Flossing Habits',
        subtitle: 'Interdental cleaning practices',
        description: 'Regular flossing is essential for removing plaque and food particles between teeth where your toothbrush cannot reach.',
        findingsTitle: 'Assessment Findings',
        issues: [
          { id: 1, label: 'Flossing frequency', value: '2-3 times per week' },
          { id: 2, label: 'Floss type used', value: 'Waxed mint floss' },
          { id: 3, label: 'Gum bleeding', value: 'Occasional bleeding when flossing' },
          { id: 4, label: 'Technique', value: 'Inconsistent C-shape motion' },
        ],
        comment: 'Your flossing routine needs significant improvement to maintain optimal gum health.',
        explanations: [
          'Flossing only 2-3 times per week leaves plaque between your teeth for extended periods, increasing decay risk.',
          'The occasional bleeding you experience is actually a sign of gingivitis and will improve with consistent daily flossing.',
          'Proper C-shape technique around each tooth is more effective than up-and-down motions.',
        ],
        recommendations: [
          'Floss at least once daily, preferably before bedtime',
          'Use gentle sawing motion to insert floss between teeth',
          'Curve floss into C-shape against each tooth surface',
          'Slide gently under the gumline, about 2-3mm deep',
        ],
      },
      products: {
        title: 'Recommended Products',
        subtitle: 'Tools and products for optimal care',
        description: 'Using the right oral care products can significantly improve your dental health outcomes and make your home care routine more effective.',
        findingsTitle: 'Product Recommendations',
        issues: [
          { id: 1, label: 'Current toothpaste', value: 'Regular fluoride toothpaste' },
          { id: 2, label: 'Mouthwash usage', value: 'Occasionally' },
          { id: 3, label: 'Tongue cleaner', value: 'Not using' },
        ],
        comment: 'Upgrading your oral care products can enhance your daily routine effectiveness.',
        productRecommendations: [
          {
            category: 'Toothpaste',
            recommendation: 'Sensodyne Pronamel or Colgate Total',
            reason: 'Provides enhanced enamel protection and antibacterial action'
          },
          {
            category: 'Mouthwash',
            recommendation: 'Listerine Total Care or Therabreath',
            reason: 'Alcohol-free formula with fluoride for additional protection'
          },
          {
            category: 'Interdental Brushes',
            recommendation: 'TePe Interdental Brushes (size 2)',
            reason: 'For larger spaces between back teeth where floss may not be as effective'
          },
          {
            category: 'Tongue Scraper',
            recommendation: 'Stainless steel tongue scraper',
            reason: 'Removes bacteria and freshens breath more effectively than brushing'
          },
        ],
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
