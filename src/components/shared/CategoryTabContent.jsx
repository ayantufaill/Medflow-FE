import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FindingsListContent from './FindingsListContent';
import { COLORS } from '../../constants/colors';
import { headingPrimarySx, headingSecondarySx, bodySx, captionSx, radius } from '../../constants/styles';

const diagnosisLabels = {
  healthy: 'Healthy', gingivitis: 'Gingivitis', periodontitis: 'Periodontitis',
  stage1: 'Stage I', stage2: 'Stage II', stage3: 'Stage III', stage4: 'Stage IV',
  gradeA: 'Grade A', gradeB: 'Grade B', gradeC: 'Grade C',
  localized: 'Localized', generalized: 'Generalized', 'molar-incisor': 'Molar-incisor',
};
const formatDate = value => {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not recorded' : date.toLocaleString();
};

/**
 * CategoryTabContent Component
 * Displays complete content for a category tab including:
 * - Section header with title and description
 * - Findings list (using FindingsListContent component)
 * - Saved periodontal source, diagnosis and statistics
 */
const CategoryTabContent = ({ category, sectionNumber = 1 }) => {
  if (!category) return null;

  const isPeriodontal = category.isPeriodontal || category.title === 'Periodontal Health' || category.title === 'Gum & Bone Health';

  return (
    <Box>
      {/* Initial Findings Header - Only for Periodontal Health */}
      {isPeriodontal && (
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

      {isPeriodontal && category.source && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={captionSx}>Chart appointment: {formatDate(category.source.examDate)}</Typography>
          <Typography sx={captionSx}>Last saved: {formatDate(category.source.savedAt)}</Typography>
        </Box>
      )}
      {isPeriodontal && category.diagnosis && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={headingSecondarySx}>Recorded diagnosis</Typography>
          <Typography sx={bodySx}>
            {[category.diagnosis.type, ...(category.diagnosis.type === 'periodontitis'
              ? [category.diagnosis.stage, category.diagnosis.distribution, category.diagnosis.grading] : [])]
              .filter(Boolean).map(v => diagnosisLabels[v] || v).join(' · ')}
          </Typography>
        </Box>
      )}
      {isPeriodontal && category.assessed && category.summary && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={headingSecondarySx}>Recorded chart summary</Typography>
          <Typography sx={bodySx}>Probing sites recorded: {category.summary.measuredSites} / {category.summary.totalSites}</Typography>
          <Typography sx={bodySx}>Maximum probing depth: {category.summary.maxProbingDepth == null ? 'Not recorded' : `${category.summary.maxProbingDepth} mm`}</Typography>
          <Typography sx={bodySx}>Marked bleeding sites: {category.summary.bleedingSites}</Typography>
          <Typography sx={bodySx}>Recorded sites with recession: {category.summary.recessionSites}</Typography>
          <Typography sx={bodySx}>Recorded pockets ≥5 mm: {category.summary.deepPocketSites}</Typography>
        </Box>
      )}

      {/* Findings List Content */}
      {isPeriodontal && category.assessed === false ? (
        <Box sx={{ p: 3, bgcolor: COLORS.SURFACE_TINT, borderRadius: radius.md }}>
          <Typography sx={headingSecondarySx}>Not assessed</Typography>
          <Typography sx={bodySx}>Save periodontal measurements or a diagnosis in Perio Charts to populate this section.</Typography>
        </Box>
      ) : category.issues && category.issues.length > 0 ? (
        <FindingsListContent
          issues={category.issues}
          secondaryIssues={category.secondaryIssues}
          comment={category.comment}
          explanations={category.explanations}
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 4, bgcolor: COLORS.SURFACE_TINT, borderRadius: radius.md, border: `1px dashed ${COLORS.BORDER}` }}>
          {!isPeriodontal && <CheckCircleIcon sx={{ fontSize: 48, color: COLORS.STATUS_SUCCESS, mb: 1 }} />}
          <Typography sx={{ ...headingSecondarySx, color: COLORS.STATUS_SUCCESS }}>
            {isPeriodontal ? 'No flagged measurements in the recorded chart' : 'No issues detected in this category'}
          </Typography>
        </Box>
      )}


    </Box>
  );
};

export default CategoryTabContent;
