import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { AutoAwesome as ShowcaseIcon } from '@mui/icons-material';
import PatientSummaryCard from '../../components/patient-detail/PatientSummaryCard';
import SectionCard from '../../components/shared/SectionCard';
import ClickableReportImage from '../../components/patient-reports/ClickableReportImage';
import { usePatient } from '../../hooks/redux/usePatient';
import { COLORS } from '../../constants/colors';
import { radius, bodySx, captionSx } from '../../constants/styles';
import { usePatientReport } from '../../hooks/queries/usePatientReport';

const ShowcasePage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

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

  const { data: reportData, isLoading } = usePatientReport(patientId);
  const treatments = reportData?.showcase?.completedTreatments || [];

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
              Before and after comparisons of completed treatments
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : !reportData || treatments.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>No completed treatments found for this patient.</Typography>
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
              bgcolor: '#bdbdbd',
              minHeight: '400px',
              flexShrink: 0
            }} />

            {/* Right Side - Content */}
            <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 0 }}>
              <Box>
                {treatments.map((treatment, idx) => (
                  <SectionCard
                    key={idx}
                    title={treatment.title}
                    subtitle={`Completed: ${treatment.date}`}
                    icon={ShowcaseIcon}
                    collapsible
                    defaultExpanded={false}
                  >
                    <Typography sx={{ ...bodySx, color: COLORS.TEXT_SECONDARY, mb: 2 }}>
                      {treatment.description}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography sx={{ ...captionSx, fontWeight: 600, color: COLORS.TEXT_PRIMARY, mb: 1, textAlign: 'center', textTransform: 'uppercase' }}>
                          Before
                        </Typography>
                        <Box
                          component="img"
                          src={treatment.beforeImage || '/before_treatment.png'}
                          alt={`Before ${treatment.title}`}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: radius.md,
                            border: `1px solid ${COLORS.BORDER}`
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography sx={{ ...captionSx, fontWeight: 600, color: COLORS.TEXT_PRIMARY, mb: 1, textAlign: 'center', textTransform: 'uppercase' }}>
                          After
                        </Typography>
                        <Box
                          component="img"
                          src={treatment.afterImage || '/repaired_teeth.png'}
                          alt={`After ${treatment.title}`}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: radius.md,
                            border: `1px solid ${COLORS.BORDER}`
                          }}
                        />
                      </Grid>
                    </Grid>
                  </SectionCard>
                ))}
              </Box>
            </Box>
          </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ShowcasePage;
