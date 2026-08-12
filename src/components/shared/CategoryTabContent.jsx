import { Box, Typography, Divider, Grid, Card, CardContent } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import FindingsListContent from './FindingsListContent';
import { COLORS } from '../../constants/colors';
import { headingPrimarySx, headingSecondarySx, bodySx, captionSx, radius } from '../../constants/styles';

const mockClinicalImages = [
  { id: 1, url: '/Damaged_teeth.png', type: 'Bitewing X-ray', date: '2024-01-15' },
  { id: 2, url: '/repaired_teeth.png', type: 'Panoramic X-ray', date: '2024-01-10' },
];

/**
 * CategoryTabContent Component
 * Displays complete content for a category tab including:
 * - Section header with title and description
 * - Findings list (using FindingsListContent component)
 * - Optional clinical images (only for Periodontal Health)
 */
const CategoryTabContent = ({ category, sectionNumber = 1 }) => {
  if (!category) return null;

  return (
    <Box>
      {/* Initial Findings Header - Only for Periodontal Health */}
      {category.title === 'Periodontal Health' && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ ...headingPrimarySx, color: COLORS.PRIMARY }}>
            Initial Findings
          </Typography>
        </Box>
      )}

      {/* Section Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ ...headingPrimarySx, mb: 1 }}>
          {sectionNumber}. {category.title || 'Periodontal Health'}{category.subtitle ? `: ${category.subtitle}` : ''}
        </Typography>
        
        {/* Descriptive Sub-header */}
        {category.description && (
          <Typography sx={{ ...bodySx, color: COLORS.TEXT_SECONDARY, lineHeight: 1.5 }}>
            {category.description}
          </Typography>
        )}

        {/* Introductory Acknowledgment Text (Section 5 only) */}
        {sectionNumber === 5 && category.introductoryText && (
          <Typography sx={{ ...bodySx, color: COLORS.TEXT_PRIMARY, lineHeight: 1.6, mt: 2 }}>
            {category.introductoryText}
          </Typography>
        )}

        {/* Contextual Lead-in (Section 5 only) */}
        {sectionNumber === 5 && category.contextualLeadIn && (
          <Typography sx={{ ...bodySx, fontWeight: 500, color: COLORS.PRIMARY, mt: 2 }}>
            {category.contextualLeadIn}
          </Typography>
        )}

        {/* Findings List Header */}
        {category.findingsTitle && sectionNumber !== 5 && (
          <Typography sx={{ ...headingSecondarySx, mt: 2 }}>
            {category.findingsTitle}
          </Typography>
        )}
      </Box>

      {/* Findings List Content */}
      {category.issues && category.issues.length > 0 ? (
        <FindingsListContent
          issues={category.issues}
          secondaryIssues={category.secondaryIssues}
          comment={category.comment}
          explanations={category.explanations}
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 4, bgcolor: COLORS.SURFACE_TINT, borderRadius: radius.md, border: `1px dashed ${COLORS.BORDER}` }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: COLORS.STATUS_SUCCESS, mb: 1 }} />
          <Typography sx={{ ...headingSecondarySx, color: COLORS.STATUS_SUCCESS }}>
            No issues detected in this category
          </Typography>
        </Box>
      )}

      {/* Clinical Images - Show for Periodontal Health OR when footerTitle exists */}
      {(category.title === 'Periodontal Health' || category.footerTitle) && (
        <>
          <Divider sx={{ my: 3, borderColor: COLORS.BORDER }} />

          <Typography sx={{ ...headingSecondarySx, mb: 2 }}>
            {category.footerTitle || 'Your Teeth'} 
          </Typography>
          <Grid container spacing={2}>
            {mockClinicalImages.map((image) => (
              <Grid item xs={6} key={image.id}>
                <Card 
                  elevation={0}
                  sx={{ 
                    cursor: 'pointer', 
                    borderRadius: radius.md,
                    border: `1px solid ${COLORS.BORDER}`,
                    '&:hover': { borderColor: COLORS.PRIMARY, bgcolor: COLORS.SURFACE_HOVER, transition: '0.2s' } 
                  }}
                >
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box 
                      component="img"
                      src={image.url}
                      alt={image.type}
                      sx={{ 
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: radius.sm,
                        mb: 1
                      }}
                    />
                    <Typography sx={{ ...bodySx, fontWeight: 600 }}>
                      {image.type}
                    </Typography>
                    <Typography sx={{ ...captionSx, color: COLORS.TEXT_MUTED }}>
                      {image.date}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default CategoryTabContent;
