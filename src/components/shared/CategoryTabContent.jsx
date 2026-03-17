import { Box, Typography, Divider, Grid, Card, CardContent } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import FindingsListContent from './FindingsListContent';

const mockClinicalImages = [
  { id: 1, url: '/Damaged_teeth.png', type: 'Bitewing X-ray', date: '2024-01-15' },
  { id: 2, url: '/cavity_teeth.png', type: 'Panoramic X-ray', date: '2024-01-10' },
];

/**
 * CategoryTabContent Component
 * Displays complete content for a category tab including:
 * - Section header with title and description
 * - Findings list (using FindingsListContent component)
 * - Optional clinical images (only for Periodontal Health)
 * 
 * @param {Object} category - Category data object containing:
 *   - title: Section title
 *   - subtitle: Section subtitle
 *   - description: Introductory text
 *   - findingsTitle: "Findings list" header text
 *   - issues: Array of primary findings
 *   - secondaryIssues: Array of secondary findings (optional)
 *   - comment: Contextual comment in blue box (optional)
 *   - explanations: Array of explanatory bullet points (optional)
 *   - footerTitle: Footer title before diagram (optional)
 *   - introductoryText: Acknowledgment text for Medical Factors section (optional)
 *   - contextualLeadIn: Lead-in text before findings list (optional)
 * @param {Number} sectionNumber - Section number to display (default: 1)
 */
const CategoryTabContent = ({ category, sectionNumber = 1 }) => {
  if (!category) return null;

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={400} gutterBottom sx={{ fontSize: '1.125rem', color: '#1976d2', fontFamily: 'Roboto, sans-serif' }}>
          {sectionNumber}- {category.title || 'Periodontal Health'}{category.subtitle ? `: ${category.subtitle}` : ''}
        </Typography>

        {/* Thick Blue Line */}
        <Box sx={{ height: '3px', bgcolor: '#1976d2', width: '100%', mb: 2, mt: 1 }} />
        
        {/* Descriptive Sub-header */}
        {category.description && (
          <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: '0.875rem', color: '#666666', lineHeight: 1.5, fontFamily: 'Roboto, sans-serif' }}>
            {category.description}
          </Typography>
        )}

        {/* Introductory Acknowledgment Text (Section 5 only) */}
        {sectionNumber === 5 && category.introductoryText && (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.875rem', 
              color: '#424242', 
              lineHeight: 1.6,
              mb: 2,
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            {category.introductoryText}
          </Typography>
        )}

        {/* Contextual Lead-in (Section 5 only) */}
        {sectionNumber === 5 && category.contextualLeadIn && (
          <Typography 
            variant="body2" 
            fontWeight={500}
            sx={{ 
              fontSize: '0.875rem', 
              color: '#1976d2',
              mb: 1,
              mt: 2,
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            {category.contextualLeadIn}
          </Typography>
        )}

        {/* Findings List Header */}
        {category.findingsTitle && sectionNumber !== 5 && (
          <Typography variant="subtitle1" fontWeight={400} gutterBottom sx={{ fontSize: '1rem', color: '#1976d2', fontFamily: 'Roboto, sans-serif', mt: 1 }}>
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
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" color="success.main">
            No issues detected in this category
          </Typography>
        </Box>
      )}

      {/* Clinical Images - Show for Periodontal Health OR when footerTitle exists */}
      {(category.title === 'Periodontal Health' || category.footerTitle) && (
        <>
          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={400} gutterBottom sx={{ fontSize: '0.95rem', color: '#1976d2', fontFamily: 'Roboto, sans-serif' }}>
            {category.footerTitle || 'Your Teeth'} 
          </Typography>
          <Grid container spacing={2}>
            {mockClinicalImages.map((image) => (
              <Grid item xs={12} sm={6} key={image.id}>
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.02)', transition: '0.2s' } }}>
                  <CardContent>
                    <Box 
                      component="img"
                      src={image.url}
                      alt={image.type}
                      sx={{ 
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 1
                      }}
                    />
                    <Typography variant="subtitle2" fontWeight="600">
                      {image.type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
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
