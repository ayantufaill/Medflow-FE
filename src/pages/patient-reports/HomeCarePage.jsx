import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import CategoryTabContent from '../../components/shared/CategoryTabContent';
import PatientSummaryCard from '../../components/patient-detail/PatientSummaryCard';
import ClickableReportImage from '../../components/patient-reports/ClickableReportImage';
import { usePatient } from '../../hooks/redux/usePatient';
import { COLORS } from '../../constants/colors';
import { radius } from '../../constants/styles';
import { usePatientReport } from '../../hooks/queries/usePatientReport';
import { CircularProgress } from '@mui/material';

const HomeCarePage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);

  const { currentPatient: patient, fetchById } = usePatient();

  useEffect(() => {
    if (patientId) fetchById(patientId);
  }, [patientId, fetchById]);

  // Navigation sections for the report pages
  const reportSections = [
    { id: 'risk', label: 'RISK ASSESSMENT', path: `/patients/${patientId}/report/risk` },
    { id: 'homecare', label: 'HOME CARE', path: `/patients/${patientId}/report/homecare` },
    { id: 'concerns', label: 'CONCERNS', path: `/patients/${patientId}/report/concerns` },
    { id: 'showcase', label: 'SHOWCASE', path: `/patients/${patientId}/report/showcase` },
  ];

  const { data: reportData, isLoading, isError, error } = usePatientReport(patientId);

  const formatIssues = (issuesArr) => {
    if (!issuesArr || !Array.isArray(issuesArr)) return [];
    return issuesArr.map((issueStr, idx) => {
      const parts = issueStr.split(' — ');
      if (parts.length > 1) {
        return { id: idx, label: parts[0], value: parts.slice(1).join(' — ') };
      }
      return { id: idx, label: issueStr, value: '' };
    });
  };

  const categories = reportData?.homeCare ? [
    {
      title: 'Oral Hygiene Routine',
      subtitle: 'Your daily brushing and cleaning habits',
      description: 'Based on our examination and your reported habits, we\'ve evaluated your current oral hygiene routine and identified areas for improvement.',
      findingsTitle: 'Current Status',
      issues: formatIssues(reportData.homeCare.oralHygiene.issues),
      explanations: reportData.homeCare.oralHygiene.recommendations,
    },
    {
      title: 'Flossing Habits',
      subtitle: 'Interdental cleaning practices',
      description: 'Regular flossing is essential for removing plaque and food particles between teeth where your toothbrush cannot reach.',
      findingsTitle: 'Assessment Findings',
      issues: formatIssues(reportData.homeCare.flossing.issues),
      explanations: reportData.homeCare.flossing.recommendations,
    },
    {
      title: 'Recommended Products',
      subtitle: 'Tools and products for optimal care',
      description: 'Using the right oral care products can significantly improve your dental health outcomes and make your home care routine more effective.',
      findingsTitle: 'Product Recommendations',
      issues: formatIssues(reportData.homeCare.products.productRecommendations),
    }
  ] : [];

  // Navigation categories for Home Care
  const homeCareCategories = [
    'Oral Hygiene',
    'Flossing', 
    'Products',
  ];

  return (
    <Box>
      {/* Patient Header Card */}
      <Box sx={{
        mb: 2,
        p: 2,
        backgroundColor: COLORS.SURFACE_CARD,
        borderRadius: radius.xl,
        border: `0.8px solid ${COLORS.BORDER}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        {patient ? <PatientSummaryCard patient={patient} /> : <Box />}
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
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
      </Box>

      {/* Main Content Area */}
      <Box sx={{ pb: 4 }}>
        {/* Unified Card Layout */}
        <Box sx={{ 
          backgroundColor: COLORS.SURFACE_CARD, 
          borderRadius: radius.xl, 
          border: `1px solid ${COLORS.BORDER}`, 
          p: 3 
        }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography 
              sx={{ 
                fontWeight: 600, 
                fontSize: '0.90rem',
                color: COLORS.PRIMARY
              }}
            >
              Personalized oral hygiene recommendations and care instructions
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography color="error">Error loading report: {error?.response?.data?.error?.message || error?.message || 'Unknown error'}</Typography>
            </Box>
          ) : !reportData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>No clinical report data found.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left Side - Visual */}
          <Box sx={{ flex: '0 0 calc(50% - 12px)', maxWidth: 'calc(50% - 12px)' }}>
            <ClickableReportImage />
          </Box>

          {/* Vertical Divider */}
          <Box sx={{ 
            width: '1px', 
            bgcolor: COLORS.BORDER,
            minHeight: '400px',
            flexShrink: 0
          }} />

          {/* Right Side - Content with Navigation */}
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 0 }}>
            {/* Category Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: COLORS.BORDER, mb: 3 }}>
              <Tabs
                value={activeCategory}
                onChange={(event, newValue) => setActiveCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    color: COLORS.TEXT_MUTED,
                    '&.Mui-selected': { color: COLORS.PRIMARY }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: COLORS.PRIMARY
                  }
                }}
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
              <CategoryTabContent 
                category={categories[activeCategory]} 
                sectionNumber={activeCategory + 1}
              />
            </Box>
          </Box>
        </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HomeCarePage;
