import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button, Divider, CircularProgress } from '@mui/material';
import { WarningAmber as ConcernsIcon, QuestionAnswer as QuestionIcon } from '@mui/icons-material';
import PatientSummaryCard from '../../components/patient-detail/PatientSummaryCard';
import SectionCard from '../../components/shared/SectionCard';
import ClickableReportImage from '../../components/patient-reports/ClickableReportImage';
import { usePatient } from '../../hooks/redux/usePatient';
import { COLORS } from '../../constants/colors';
import { radius, bodySx, captionSx, headingPrimarySx, headingSecondarySx } from '../../constants/styles';
import { usePatientReport } from '../../hooks/queries/usePatientReport';

const ConcernsPage = () => {
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

  const { data: reportData, isLoading } = usePatientReport(patientId);

  // Template data repository
  const templates = {
    'tmj-risk': {
      title: "INFORMED CONSENT DOCUMENTATION",
      subtitle: "Jaw Joint Problems",
      description: "A jaw joint problem arises when the temporomandibular joint, or TMJ, connecting your lower jaw to the base of your skull becomes painful and is unable to function normally. People with jaw joint problems may not be able to open or close their mouths fully or chew hard, sticky foods. They may also experience painful clicking or popping when they attempt to open and close their mouth.",
      questions: [
        {
          id: 1,
          question: "1. What causes a Jaw Joint Problem?",
          answer: "A jaw joint problem is caused by the components of the TMJ changing shape and becoming unstable when the joint moves. A small cushioning disc sits between your jaw bone and the base of your skull. Sometimes the ligaments holding this disc in place become stretched and the disc pops out of place; either in front of the jaw bone or behind it.",
          riskFactorsTitle: "The risk factors for a jaw joint problem are:",
          items: [
            "Trauma to the jaw",
            "An unbalanced bite",
            "Day or night time tooth grinding",
            "Being double-jointed",
            "Arthritis in other joints in the body",
            "Lifestyle choices that require repetitive or prolonged opening of your mouth such as singing"
          ],
          image: "/report_visual.png",
          imageCaption: "Facial, muscle or joint pain"
        },
        {
          id: 2,
          question: "2. What can I do to minimize my risk of future Jaw Joint Problems?",
          answer: "The first step in addressing a jaw joint problem is to have your dentist evaluate your individual risk factors and customize an appropriate Management Protocol for you.",
          protocolTitle: "Your Jaw Joint Management Protocol may include:",
          protocols: [
            { label: "Treating an unbalanced bite" },
            { label: "Managing tooth grinding" },
            { 
              label: "Decreasing stress to the jaw through the use of", 
              subItems: ["Oral splints", "Medication", "Lifestyle counseling"] 
            },
            { 
              label: "Increasing jaw mobility through the use of", 
              subItems: ["Jaw exercises", "Medication"] 
            }
          ],
          footer: "Your Jaw Joint Management Protocol has important steps that you must carry out on your own to decrease your risk of future jaw joint problems.",
          diagramImage: "/report_visual.png",
          diagramCaption: "TMJ Anatomy - Normal vs Displaced Disc"
        },
        {
          id: 3,
          question: "3. What will happen if I choose to do nothing about my Jaw Joint Problem?",
          answer: "Ignoring a jaw joint problem may lead to chronic, debilitating pain and an inability to function normally when chewing and speaking.",
          warningImage: "/report_visual.png",
          warningCaption: "Chronic pain and limited function"
        }
      ]
    },
    'periodontal-risk': {
      title: "INFORMED CONSENT DOCUMENTATION",
      subtitle: "Periodontal (Gum) Disease",
      description: "Periodontal disease is an infection of the tissues that hold your teeth in place. It's typically caused by poor brushing and flossing habits that allow plaque—a sticky film of bacteria—to build up on the teeth and harden.",
      questions: [
        {
          id: 1,
          question: "1. What causes Periodontal Disease?",
          answer: "It is caused by bacteria in dental plaque. If not removed, plaque hardens into calculus (tartar). The bacteria produce toxins that irritate the gums and cause them to turn red, swell, and bleed easily.",
          riskFactorsTitle: "Risk factors include:",
          items: [
            "Poor oral hygiene",
            "Smoking or chewing tobacco",
            "Genetics",
            "Crooked teeth that are hard to keep clean",
            "Pregnancy",
            "Diabetes"
          ]
        },
        {
          id: 2,
          question: "2. What can I do to minimize my risk?",
          answer: "The most important thing you can do is maintain excellent daily oral hygiene and follow your recommended professional cleaning schedule.",
          protocolTitle: "Your Management Protocol may include:",
          protocols: [
            { label: "Deep cleaning (scaling and root planing)" },
            { label: "More frequent professional cleanings (every 3-4 months)" },
            { label: "Prescription mouthwashes or medications" }
          ],
          footer: "Consistent home care is critical to halting the progression of gum disease."
        }
      ]
    },
    'caries-risk': {
      title: "INFORMED CONSENT DOCUMENTATION",
      subtitle: "Tooth Decay (Caries)",
      description: "Tooth decay is the destruction of your tooth enamel, the hard, outer layer of your teeth. It can be a problem for children, teens and adults.",
      questions: [
        {
          id: 1,
          question: "1. What causes Tooth Decay?",
          answer: "Plaque, a sticky film of bacteria, constantly forms on your teeth. When you eat or drink foods containing sugars, the bacteria in plaque produce acids that attack tooth enamel.",
          riskFactorsTitle: "Risk factors include:",
          items: [
            "Frequent snacking on sugary foods/drinks",
            "Poor oral hygiene",
            "Not getting enough fluoride",
            "Dry mouth",
            "Eating disorders or heartburn"
          ]
        },
        {
          id: 2,
          question: "2. What can I do to minimize my risk?",
          answer: "Reducing sugar intake and maintaining a strong oral hygiene routine are key.",
          protocolTitle: "Your Management Protocol may include:",
          protocols: [
            { label: "Prescription fluoride toothpaste" },
            { label: "Fluoride varnish treatments" },
            { label: "Dental sealants" },
            { label: "Dietary counseling" }
          ],
          footer: "Addressing early signs of decay can prevent the need for fillings or crowns."
        }
      ]
    }
  };

  const templateKey = reportData?.concerns?.templateKey || 'tmj-risk';
  const concernData = templates[templateKey] || templates['tmj-risk'];

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
      </Box>

      {/* Main Content Area */}
      <Box sx={{ pb: 4 }}>
        {/* Main Content Card with Header */}
        <Box sx={{ 
          p: 3, 
          bgcolor: COLORS.SURFACE_CARD, 
          borderRadius: radius.xl, 
          border: `1px solid ${COLORS.BORDER}` 
        }}>
          {/* Header Section with Logo and Title */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography 
              sx={{ 
                color: COLORS.PRIMARY, 
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              INFORMED CONSENT DOCUMENTATION
            </Typography>
            {/* Mock Logo */}
            <Box sx={{ 
              border: `1px solid ${COLORS.PRIMARY}`, 
              p: 0.5, 
              color: COLORS.PRIMARY, 
              fontWeight: 'bold',
              fontSize: '0.875rem',
              borderRadius: radius.sm
            }}>
              fn
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : !reportData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>No clinical report data found.</Typography>
            </Box>
          ) : (
            <>
          {/* Subtitle */}
          <Typography sx={{ ...headingPrimarySx, mb: 2 }}>
            {concernData.subtitle}
          </Typography>

          {/* Description */}
          <Typography sx={{ ...bodySx, color: COLORS.TEXT_SECONDARY, mb: 4, lineHeight: 1.6 }}>
            {concernData.description}
          </Typography>

          {/* Frequently Asked Questions Section */}
          <Typography sx={{ ...headingSecondarySx, color: COLORS.PRIMARY, mb: 3 }}>
            Frequently Asked Questions
          </Typography>

          {concernData.questions.map((q, index) => (
            <SectionCard
              key={q.id}
              title={q.question}
              icon={QuestionIcon}
              sx={{ mb: 4 }}
              collapsible={true}
              defaultExpanded={false}
            >
              <Grid container spacing={4}>
                {/* Left Column: Text Content */}
                <Grid size={{ xs: 12, md: 7, lg: 7 }}>
                  {/* Answer Text */}
                  <Typography sx={{ ...bodySx, mb: 3, lineHeight: 1.6 }}>
                    {q.answer}
                  </Typography>

                  {/* Risk Factors */}
                  {q.riskFactorsTitle && (
                    <Typography sx={{ ...headingSecondarySx, mb: 2 }}>
                      {q.riskFactorsTitle}
                    </Typography>
                  )}

                  {q.items && (
                    <Box sx={{ ml: 1, mb: 3 }}>
                      {q.items.map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            mb: 1.5
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: COLORS.ACCENT,
                              mr: 1.5,
                              flexShrink: 0,
                              mt: 0.75
                            }}
                          />
                          <Typography sx={{ ...bodySx, lineHeight: 1.5 }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Protocol Section */}
                  {q.protocolTitle && (
                    <>
                      <Typography sx={{ ...headingSecondarySx, mb: 2 }}>
                        {q.protocolTitle}
                      </Typography>
                      
                      {q.protocols.map((p, idx) => (
                        <Box key={idx} sx={{ mb: 2, ml: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              mb: 0.5
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: COLORS.ACCENT,
                                mr: 1.5,
                                flexShrink: 0,
                                mt: 0.75
                              }}
                            />
                            <Typography sx={{ ...bodySx, fontWeight: 500 }}>
                              {p.label}
                            </Typography>
                          </Box>
                          
                          {p.subItems && (
                            <Box sx={{ ml: 3, mt: 1 }}>
                              {p.subItems.map((sub, sIdx) => (
                                <Box key={sIdx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: COLORS.TEXT_MUTED, mr: 1 }} />
                                  <Typography sx={{ ...bodySx, color: COLORS.TEXT_SECONDARY }}>
                                    {sub}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                      
                      <Typography sx={{ ...bodySx, color: COLORS.TEXT_SECONDARY, mt: 3, p: 2, bgcolor: COLORS.SURFACE_TINT, borderRadius: radius.md }}>
                        {q.footer}
                      </Typography>
                    </>
                  )}
                </Grid>

                {/* Right Column: Images */}
                <Grid size={{ xs: 12, md: 5, lg: 5 }}>
                  {q.image && (
                    <Box sx={{ mb: 3 }}>
                      <ClickableReportImage 
                        src={q.image} 
                        sx={{ 
                          width: '100%', 
                          maxWidth: 280,
                          mx: 'auto',
                          display: 'block',
                          borderRadius: radius.md,
                          border: `1px solid ${COLORS.BORDER}`,
                          overflow: 'hidden'
                        }} 
                      />
                      {q.imageCaption && (
                        <Typography sx={{ ...captionSx, color: COLORS.TEXT_MUTED, mt: 1, textAlign: 'center' }}>
                          {q.imageCaption}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {q.diagramImage && (
                    <Box sx={{ mb: 3 }}>
                      <ClickableReportImage 
                        src={q.diagramImage} 
                        sx={{ 
                          width: '100%', 
                          maxWidth: 280,
                          mx: 'auto',
                          display: 'block',
                          borderRadius: radius.md,
                          border: `1px solid ${COLORS.BORDER}`,
                          overflow: 'hidden'
                        }} 
                      />
                      {q.diagramCaption && (
                        <Typography sx={{ ...captionSx, color: COLORS.TEXT_MUTED, mt: 1, textAlign: 'center' }}>
                          {q.diagramCaption}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {q.warningImage && (
                    <Box sx={{ mb: 3 }}>
                      <ClickableReportImage 
                        src={q.warningImage} 
                        sx={{ 
                          width: '100%', 
                          maxWidth: 280,
                          mx: 'auto',
                          display: 'block',
                          borderRadius: radius.md,
                          border: `1px solid ${COLORS.BORDER}`,
                          overflow: 'hidden'
                        }} 
                      />
                      {q.warningCaption && (
                        <Typography sx={{ ...captionSx, color: COLORS.STATUS_ERROR, fontWeight: 500, mt: 1, textAlign: 'center' }}>
                          {q.warningCaption}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </SectionCard>
          ))}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ConcernsPage;