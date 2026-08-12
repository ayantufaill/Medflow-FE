import { Box, Typography } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { bodySx, labelSx, captionSx } from '../../constants/styles';

/**
 * FindingsListContent Component
 * Displays a structured list of findings with label-value pairs,
 * optional secondary issues, and explanatory bullet points.
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
          <Typography sx={{ ...labelSx, color: COLORS.TEXT_PRIMARY, mb: 1 }}>
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
                  bgcolor: COLORS.ACCENT,
                  mr: 1.5,
                  flexShrink: 0,
                  mt: 0.5
                }}
              />
              <Typography
                sx={{
                  ...bodySx,
                  fontWeight: 500,
                  color: allergy.value === 'None' ? COLORS.STATUS_SUCCESS : COLORS.STATUS_ERROR,
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
                    bgcolor: COLORS.ACCENT,
                    mr: 1.5,
                    flexShrink: 0,
                    mt: 0.5
                  }}
                />
              ) : null}
              <Typography sx={{ ...bodySx, lineHeight: 1.5 }}>
                {issue.isCategoryHeader ? (
                  <>
                    <span style={{ color: COLORS.TEXT_PRIMARY, fontWeight: 500 }}>{issue.label}: </span>
                    <span style={{ color: issue.value === 'None' || issue.value?.toLowerCase().includes('none') ? COLORS.STATUS_SUCCESS : COLORS.STATUS_ERROR }}>
                      {issue.value}
                    </span>
                  </>
                ) : (
                  <>
                    {issue.label && <span style={{ color: COLORS.TEXT_PRIMARY, fontWeight: 500 }}>{issue.label}: </span>}
                    <span style={{ color: issue.value === 'None' || issue.value?.toLowerCase().includes('none') ? COLORS.STATUS_SUCCESS : COLORS.STATUS_ERROR }}>
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
                sx={{
                  ...bodySx,
                  width: '200px',
                  flexShrink: 0,
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                {issue.label ? `${issue.label}: ` : ''}
              </Typography>
              <Typography
                sx={{
                  ...bodySx,
                  fontWeight: 500,
                  color: issue.value === 'None' ? COLORS.STATUS_SUCCESS : COLORS.STATUS_ERROR,
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
          <Typography sx={{ ...labelSx, color: COLORS.TEXT_PRIMARY, mb: 1 }}>
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
                  bgcolor: COLORS.TEXT_MUTED,
                  mr: 1.5,
                  flexShrink: 0
                }}
              />
              <Typography sx={{ ...bodySx, color: COLORS.TEXT_SECONDARY, lineHeight: 1.5 }}>
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
