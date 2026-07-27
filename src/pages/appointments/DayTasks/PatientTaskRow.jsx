import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { 
  HistoryEdu, 
  ChatBubbleOutline, 
  CheckCircleOutline, 
  DescriptionOutlined, 
  PendingOutlined,
  AttachMoneyOutlined,
  MedicationOutlined,
  WarningAmberOutlined,
  ShieldOutlined,
  AddModeratorOutlined,
} from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';

const ICON_MAP = {
  history: <HistoryEdu fontSize="small" sx={{ color: COLORS.WARNING }} />,
  chat: <ChatBubbleOutline fontSize="small" sx={{ color: COLORS.PRIMARY }} />,
  check: <CheckCircleOutline fontSize="small" sx={{ color: COLORS.SUCCESS }} />,
  document: <DescriptionOutlined fontSize="small" sx={{ color: COLORS.PRIMARY }} />,
  pending: <CheckCircleOutline fontSize="small" sx={{ color: COLORS.TEXT_MUTED }} />, // greyed out check
  dollar: <AttachMoneyOutlined fontSize="small" sx={{ color: COLORS.SUCCESS }} />,
  rx: <MedicationOutlined fontSize="small" sx={{ color: COLORS.PRIMARY }} />,
  warning: <WarningAmberOutlined fontSize="small" sx={{ color: COLORS.WARNING }} />,
  shield: <ShieldOutlined fontSize="small" sx={{ color: COLORS.PRIMARY }} />,
  'shield-plus': <AddModeratorOutlined fontSize="small" sx={{ color: COLORS.PRIMARY }} />,
};

const PatientTaskRow = ({ task }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      py: 1.5,
      borderBottom: `1px solid ${COLORS.BORDER}`,
      '&:last-child': { borderBottom: 'none' },
      '&:hover': { bgcolor: COLORS.SURFACE_HOVER }
    }}>
      {/* Task Category Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
          {task.categoryTitle} {task.extraInfo && <span style={{ color: COLORS.TEXT_SECONDARY }}>{task.extraInfo}</span>}
        </Typography>
      </Box>

      {/* Action Icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {task.icons && task.icons.map((iconStr, idx) => (
          <Tooltip title={iconStr} key={idx} placement="top">
            <IconButton size="small" sx={{ p: 0.5 }}>
              {ICON_MAP[iconStr] || <CheckCircleOutline fontSize="small" />}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default PatientTaskRow;
