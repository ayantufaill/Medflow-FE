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

const RiskAssessmentPage = () => {
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
      const parts = issueStr.split(': ');
      if (parts.length > 1) {
        return { id: idx, label: parts[0], value: parts.slice(1).join(': ') };
      }
      return { id: idx, label: issueStr, value: '' };
    });
  };

  const categories = reportData?.riskAssessment ? [
    {
      ...reportData.riskAssessment.gumHealth,
      findingsTitle: 'Findings list',
      issues: formatIssues(reportData.riskAssessment.gumHealth.issues)
    },
    {
      ...reportData.riskAssessment.toothDecay,
      findingsTitle: 'Findings list',
      issues: formatIssues(reportData.riskAssessment.toothDecay.issues)
    },
    {
      ...reportData.riskAssessment.biteAlignment,
      findingsTitle: 'Findings list',
      issues: formatIssues(reportData.riskAssessment.biteAlignment.issues)
    },
    {
      ...reportData.riskAssessment.appearance,
      findingsTitle: 'Findings list',
      issues: formatIssues(reportData.riskAssessment.appearance.issues)
    },
    {
      ...reportData.riskAssessment.medicalFactors,
      findingsTitle: 'Findings list',
      issues: formatIssues(reportData.riskAssessment.medicalFactors.issues)
    }
  ] : [];

  // Navigation categories for Risk Assessment
  const riskCategories = [
    'Periodontal Health',
    'Tooth Structure', 
    'Bite & Jaw Joint',
    'Appearance',
    'Medical Factors',
  ];

  const handleQuadrantClick = (quadrant) => {
    switch (quadrant) {
      case 'topRight':
        setActiveCategory(0); // Periodontal Health
        break;
      case 'bottomRight':
        setActiveCategory(1); // Tooth Structure
        break;
      case 'bottomLeft':
        setActiveCategory(2); // Bite & Jaw Joint
        break;
      case 'topLeft':
        setActiveCategory(3); // Appearance
        break;
      default:
        break;
    }
  };

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
      </Box>

      {/* Main Content Area */}
      <Box sx={{ pb: 4 }}>
        {/* Unified Card with Navigation */}
        <Box sx={{ 
          backgroundColor: COLORS.SURFACE_CARD, 
          borderRadius: radius.xl, 
          border: `1px solid ${COLORS.BORDER}`, 
          p: 3 
        }}>
          {/* Main Concern - Centered */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                fontSize: '0.90rem',
                color: COLORS.PRIMARY
              }}
            >
              Main Concern: {reportData?.concerns?.primaryConcern || 'General Evaluation'}
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
            <ClickableReportImage onQuadrantClick={handleQuadrantClick} />
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RiskAssessmentPage;
