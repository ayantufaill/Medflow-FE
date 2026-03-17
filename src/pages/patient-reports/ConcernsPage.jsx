import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Tabs, Tab, Button, Divider } from '@mui/material';

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

  // Use the data structure from the image
  const jawJointData = {
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
  };

  return (
    <Box>
      {/* Top Navigation Bar - Report Sections */}
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

      {/* Main Content Card with Header */}
      <Paper sx={{ p: 3, bgcolor: '#fbfdff', maxWidth: 1000, margin: 'auto' }}>
        {/* Header Section with Logo and Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: '#61c057ff', 
              fontSize: '0.95rem',
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            INFORMED CONSENT DOCUMENTATION
          </Typography>
          {/* Mock Logo */}
          <Box sx={{ 
            border: '1px solid #61c057ff', 
            p: 0.5, 
            color: '#61c057ff', 
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            fn
          </Box>
        </Box>

        {/* Subtitle */}
        <Typography 
          sx={{ 
            color: '#000000', 
            mb: 2, 
            fontSize: '1rem',
            fontFamily: 'Roboto, sans-serif'
          }}
        >
          {jawJointData.subtitle}
        </Typography>

        {/* Description */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#444', 
            lineHeight: 1.6, 
            mb: 2,
            fontSize: '0.85rem',
            fontFamily: 'Roboto, sans-serif'
          }}
        >
          {jawJointData.description}
        </Typography>

        {/* Decorative Tri-Color Line */}
        <Box sx={{ display: 'flex', height: '2px', mb: 4 }}>
          <Box sx={{ flex: 1, bgcolor: '#9cb99e' }} />
          <Box sx={{ flex: 1, bgcolor: '#f1c40f' }} />
          <Box sx={{ flex: 1, bgcolor: '#e74c3c' }} />
        </Box>

        {/* Frequently Asked Questions Section */}
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: '#9cb99e', 
            mb: 2, 
            fontSize: '0.975rem',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500
          }}
        >
          Frequently Asked Questions
        </Typography>

        {jawJointData.questions.map((q, index) => (
          <Box key={q.id} sx={{ mb: 4 }}>
            {/* Two-Column Layout for Each Question */}
            <Grid container spacing={3}>
              {/* Left Column: Text Content */}
              <Grid size={{ xs: 12, lg: 7 }}>
                {/* Question Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#61c057ff', 
                    mb: 2,
                    fontSize: '0.95rem',
                    fontFamily: 'Roboto, sans-serif'
                  }}
                >
                  {q.question}
                </Typography>

                {/* Answer Text */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2, 
                    color: '#000000',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    fontFamily: 'Roboto, sans-serif'
                  }}
                >
                  {q.answer}
                </Typography>

                {/* Risk Factors */}
                {q.riskFactorsTitle && (
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 1.5, 
                      color: '#000000',
                      fontSize: '0.95rem',
                      fontFamily: 'Roboto, sans-serif'
                    }}
                  >
                    {q.riskFactorsTitle}
                  </Typography>
                )}

                {q.items && (
                  <Box sx={{ ml: 1.5 }}>
                    {q.items.map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          mb: 1
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#000000',
                            mr: 1.5,
                            flexShrink: 0,
                            mt: 0.75
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#000000',
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            fontFamily: 'Roboto, sans-serif'
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Protocol Section */}
                {q.protocolTitle && (
                  <>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 1.5, 
                        color: '#000000',
                        fontSize: '0.95rem',
                        fontFamily: 'Roboto, sans-serif'
                      }}
                    >
                      {q.protocolTitle}
                    </Typography>
                    
                    {q.protocols.map((p, idx) => (
                      <Box key={idx} sx={{ mb: 1.5, ml: 1.5 }}>
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
                              bgcolor: '#000000',
                              mr: 1.5,
                              flexShrink: 0,
                              mt: 0.75
                            }}
                          />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#000000',
                              fontSize: '0.875rem',
                              lineHeight: 1.5,
                              fontFamily: 'Roboto, sans-serif'
                            }}
                          >
                            {p.label}
                          </Typography>
                        </Box>
                        
                        {p.subItems && (
                          <Box sx={{ ml: 3, mt: 0.5 }}>
                            {p.subItems.map((sub, sIdx) => (
                              <Typography 
                                key={sIdx}
                                variant="body2" 
                                sx={{ 
                                  color: '#000000',
                                  fontSize: '0.875rem',
                                  lineHeight: 1.5,
                                  mb: 0.5,
                                  fontFamily: 'Roboto, sans-serif'
                                }}
                              >
                                • {sub}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2, 
                        color: '#000000',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        fontFamily: 'Roboto, sans-serif'
                      }}
                    >
                      {q.footer}
                    </Typography>
                  </>
                )}
              </Grid>

              {/* Right Column: Images */}
              <Grid size={{ xs: 12, lg: 5 }}>
                {q.image && (
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={q.image} 
                      alt={q.imageCaption || "Illustration"} 
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block',
                        borderRadius: '8px'
                      }} 
                    />
                    {q.imageCaption && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#666666',
                          fontSize: '0.75rem',
                          mt: 0.5,
                          display: 'block',
                          fontFamily: 'Roboto, sans-serif'
                        }}
                      >
                        {q.imageCaption}
                      </Typography>
                    )}
                  </Box>
                )}

                {q.diagramImage && (
                  <Box sx={{ 
                    mb: 2, 
                    bgcolor: '#1a2735', 
                    p: 1, 
                    borderRadius: '8px' 
                  }}>
                    <img 
                      src={q.diagramImage} 
                      alt={q.diagramCaption || "Medical diagram"} 
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block',
                        borderRadius: '4px'
                      }} 
                    />
                    {q.diagramCaption && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          mt: 0.5,
                          display: 'block',
                          fontFamily: 'Roboto, sans-serif'
                        }}
                      >
                        {q.diagramCaption}
                      </Typography>
                    )}
                  </Box>
                )}

                {q.warningImage && (
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={q.warningImage} 
                      alt={q.warningCaption || "Warning illustration"} 
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block',
                        borderRadius: '8px'
                      }} 
                    />
                    {q.warningCaption && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#f44336',
                          fontSize: '0.75rem',
                          mt: 0.5,
                          display: 'block',
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 500
                        }}
                      >
                        {q.warningCaption}
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Divider between questions (except last) */}
            {index < jawJointData.questions.length - 1 && (
              <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />
            )}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default ConcernsPage;