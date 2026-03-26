import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Tabs, Tab, Button, Divider } from '@mui/material';
import CategoryTabContent from '../../components/shared/CategoryTabContent';

const RiskAssessmentPage = () => {
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
      gumHealth: {
        score: 75,
        status: 'moderate',
        title: 'Periodontal Health',
        subtitle: 'Your gums and supporting bone',
        findingsTitle: 'Findings list',
        issues: [
          { id: 1, label: 'Bone Loss', value: 'None' },
          { id: 2, label: 'Recession', value: 'None' },
          { id: 3, label: 'Bleeding', value: '2, 3, 4, 5, 12, 13, 14, 15, 18, 19, 20' },
          { id: 4, label: 'Missing Teeth Due To Gum Disease', value: 'None' },
          { id: 5, label: '', value: '21, 28, 29, 30, 31' },
          { id: 6, label: 'Tooth Mobility Due To Bone Loss', value: 'None' },
        ],
        description: 'We carefully evaluated the current condition of your gums, as well as the bone that supports your teeth.',
      },
      toothDecay: {
        score: 60,
        status: 'concern',
        title: 'Active and repaired damage',
        subtitle: '',
        description: 'During your exam we carefully evaluated your tooth structure, existing fillings, crowns, and any signs of decay or erosion. Based on these findings, we can summarize the current condition of your teeth.',
        findingsTitle: 'Findings list',
        issues: [
          { id: 1, label: 'New decay', value: '5, 12' },
          { id: 2, label: 'Failed restorations', value: 'None' },
          { id: 3, label: 'Active Chemical or abrasive damage', value: '7, 8, 9, 10, 23, 24, 25, 26' },
          { id: 4, label: 'Root canal concerns', value: 'None' },
          { id: 5, label: 'Weakened teeth and restorations', value: 'None' },
          { id: 6, label: 'Questionable restorations', value: 'None' },
          { id: 7, label: 'Inactive chemical or abrasive damage', value: 'None' },
          { id: 8, label: 'Future root canal concerns', value: 'None' },
          { id: 9, label: 'Acceptable dental work', value: '3, 4, 13, 14, 15, 18, 19, 30, 31' },
          { id: 10, label: 'Missing teeth due to structural damage or decay', value: 'None' },
        ],
        comment: 'The fillings or crowns in your mouth are in very good condition. Your previous dentistry has given you an excellent foundation for good future dental health.',
        explanations: [
          'We discovered (2) areas of new decay that require attention.',
          'We also noted (8) teeth that are weaker due to loss of tooth structure from acids. These teeth have increased risk for decay and fracture.',
          'There are (9) areas of previous decay or damage which have been repaired with fillings or crowns. We will continue to monitor these at your next visit.',
        ],
      },
      biteAlignment: {
        score: 70,
        status: 'moderate',
        title: 'Bite & jaw joint health',
        subtitle: '',
        description: 'We have evaluated how your teeth, jaws and muscles work together during function (chewing, speaking, and at rest). A healthy bite system shows minimal wear on teeth, no discomfort or pain in the jaw joints or muscles, and no loose teeth from excessive forces.',
        findingsTitle: 'Findings list',
        issues: [
          { id: 1, label: 'Active existing tooth wear', value: 'None' },
          { id: 2, label: 'Loose teeth due to excessive force', value: 'None' },
          { id: 3, label: 'Jaw Joint Concerns', value: 'Joint symptoms' },
          { id: 4, label: 'Jaw Muscles Concerns', value: 'Tender Muscles' },
          { id: 5, label: 'History of bruxism', value: 'Yes' },
          { id: 6, label: 'Inactive existing tooth wear', value: 'None' },
          { id: 7, label: 'Missing teeth due to bite issues', value: '1, 16, 17, 32' },
        ],
        explanations: [
          'We found no tooth wear from grinding or clenching, which is excellent news for the long-term health of your teeth.',
          'You have reported that occasionally your jaw muscles are painful or tender. This can be related to clenching or grinding habits, especially during sleep.',
          'During our examination of your jaw joints (TMJ), we discovered moderate trauma to your jaw joint from your bite forces. This may cause occasional clicking, popping, or discomfort when opening wide or chewing.',
        ],
        footerTitle: 'Your Teeth',
      },
      brokenTeeth: {
        score: 85,
        status: 'good',
        title: 'Appearance',
        subtitle: 'Cosmetic aspects of your smile',
        findingsTitle: 'Findings list',
        issues: [
          { id: 1, label: 'Chipped enamel', value: '8' },
          { id: 2, label: 'Discoloration', value: 'None' },
          { id: 3, label: 'Gaps between teeth', value: 'None' },
        ],
        description: 'We evaluated the cosmetic appearance of your teeth, including color, alignment, and overall smile aesthetics.',
      },
      medicalFactors: {
        score: 65,
        status: 'moderate',
        title: 'Factors affecting your dental health',
        subtitle: '',
        findingsTitle: 'Findings list',
        introductoryText: 'Thank you for your candid and complete medical history review. We have made note of your medications, supplements, and any other factors that may influence your dental health, and you can be assured that we will review these carefully to ensure your safety and comfort during all phases of treatment.',
        contextualLeadIn: 'The specific issues you mentioned that may be important for your dental care include:',
        issues: [
          { 
            id: 1, 
            label: 'Allergies or allergic reactions, which we will avoid in providing your care', 
            value: 'Nickel, Penicillin',
            isCategoryHeader: true 
          },
          { 
            id: 2, 
            label: 'Medical conditions impacting dental health or requiring special management', 
            value: 'Diabetes (controlled), Hypertension',
            isCategoryHeader: true 
          },
          { 
            id: 3, 
            label: 'Medications increasing risk during dental procedures', 
            value: 'Blood thinners (Warfarin)',
            isCategoryHeader: true 
          },
          { 
            id: 4, 
            label: 'Medications causing dry mouth (increasing decay risk)', 
            value: 'Antihistamines, Antidepressants',
            isCategoryHeader: true 
          },
        ],
      },
    },
  };

  const categories = Object.values(mockDentalAssessment.categories);

  // Navigation categories for Risk Assessment
  const riskCategories = [
    'Periodontal Health',
    'Tooth Structure', 
    'Bite & Jaw Joint',
    'Appearance',
    'Medical Factors',
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
              bgcolor: section.id === 'risk' ? 'primary.main' : 'grey.100',
              color: section.id === 'risk' ? 'primary.contrastText' : 'text.primary',
              minWidth: 'auto',
              '&:hover': {
                bgcolor: section.id === 'risk' ? 'primary.dark' : 'grey.200',
              },
            }}
          >
            {section.label}
          </Button>
        ))}
      </Box>


      {/* Main Concern - Centered */}
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            fontSize: '0.90rem',
            color: '#1976d2'
          }}
        >
          Main Concern: Cracked tooth
        </Typography>
      </Box>

      {/* Unified Card with Navigation */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left Side - Visual */}
          <Box sx={{ flex: '0 0 calc(50% - 12px)', maxWidth: 'calc(50% - 12px)' }}>
            <img 
              src="/report_visual.png" 
              alt="Dental Assessment Visualization"
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

          {/* Right Side - Content with Navigation */}
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 0 }}>
            {/* Category Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={activeCategory}
                onChange={(event, newValue) => setActiveCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {riskCategories.map((name) => (
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
              <CategoryTabContent 
                category={categories[activeCategory]} 
                sectionNumber={activeCategory + 1}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RiskAssessmentPage;
