import { Box, Typography } from '@mui/material';

/**
 * FindingsListContent Component
 * Displays a structured list of findings with label-value pairs,
 * optional secondary issues, and explanatory bullet points.
 * 
 * @param {Array} issues - Primary findings list (required)
 * @param {Array} secondaryIssues - Secondary/stable findings (optional)
 * @param {String} comment - Contextual comment in blue box (optional)
 * @param {Array} explanations - Explanatory bullet points (optional)
 * @param {String} allergiesTitle - Title for allergies section (optional)
 * @param {Array} allergies - Allergies list (optional)
 */
const FindingsListContent = ({ 
  issues = [], 
  secondaryIssues = [], 
  comment, 
  explanations,
  allergiesTitle,
  allergies
}) => {
  // Filter out anomaly items
  const normalIssues = issues.filter(i => !i.isAnomaly);
  const anomalyIssues = issues.filter(i => i.isAnomaly);

  return (
    <Box sx={{ mb: 2 }}>
      {/* Allergies Section (if present) */}
      {allergiesTitle && allergies && allergies.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              color: '#000000',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '0.875rem',
              mb: 1
            }}
          >
            {allergiesTitle}
          </Typography>
          {allergies.map((allergy) => (
            <Box
              key={allergy.id}
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                mb: 1,
                ml: 1.5
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#1976d2',
                  mr: 1.5,
                  flexShrink: 0,
                  mt: 0.5
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: allergy.value === 'None' ? '#4caf50' : '#f44336',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {allergy.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Primary Issues */}
      {normalIssues.length > 0 && (
        <Box>
          {normalIssues.map((issue) => (
            <Box
              key={issue.id}
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                mb: 1,
                ml: issue.isCategoryHeader ? 0 : 1.5,
              }}
            >
              {issue.isBulletPoint || issue.isCategoryHeader ? (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#1976d2',
                    mr: 1.5,
                    flexShrink: 0,
                    mt: 0.5
                  }}
                />
              ) : null}
              <Typography
                variant="body2"
                fontWeight={400}
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: 1.5
                }}
              >
                {issue.isCategoryHeader ? (
                  <>
                    <span style={{ color: '#000000' }}>{issue.label}: </span>
                    <span style={{ color: issue.value === 'None' || issue.value?.toLowerCase().includes('none') ? '#4caf50' : '#f44336' }}>
                      {issue.value}
                    </span>
                  </>
                ) : (
                  <>
                    {issue.label && <span style={{ color: '#000000' }}>{issue.label}: </span>}
                    <span style={{ color: issue.value === 'None' || issue.value?.toLowerCase().includes('none') ? '#4caf50' : '#f44336' }}>
                      {issue.value}
                    </span>
                  </>
                )}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Secondary Issues (if present) */}
      {secondaryIssues && secondaryIssues.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {secondaryIssues.map((issue) => (
            <Box
              key={issue.id}
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={400}
                sx={{
                  width: '200px',
                  flexShrink: 0,
                  color: '#000000',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '0.875rem'
                }}
              >
                {issue.label ? `${issue.label}: ` : ''}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: issue.value === 'None' ? '#4caf50' : '#f44336',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {issue.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Explanations (if present) */}
      {explanations && explanations.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              color: '#000000',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '0.875rem',
              mb: 1
            }}
          >
            What we found:
          </Typography>
          {explanations.map((explanation, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                mb: 1,
                ml: 1.5
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#1976d2',
                  mr: 1,
                  flexShrink: 0
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: '#424242',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: 1.5
                }}
              >
                {explanation}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FindingsListContent;
