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
  AccountCircle
} from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import InitialsAvatar from '../../../components/shared/InitialsAvatar';

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

const TaskItemRow = ({ item }) => {
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <InitialsAvatar name={item.name} size={28} fontSize={11} bg={COLORS.PRIMARY} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
              {item.name}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>
              ({item.patientId})
            </Typography>
          </Box>
          {item.planId && (
            <Typography sx={{ fontSize: '11px', color: COLORS.TEXT_SECONDARY }}>
              Plan ID: {item.planId}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {item.balance && (
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: COLORS.SUCCESS, mr: 1 }}>
            {item.balance} <span style={{ color: COLORS.TEXT_MUTED, fontWeight: 400 }}>{item.payment}</span>
          </Typography>
        )}
        {item.icons.map((iconName, idx) => (
          <Tooltip key={idx} title={iconName} placement="top">
            <IconButton size="small" sx={{ p: 0.5 }}>
              {ICON_MAP[iconName] || <PendingOutlined fontSize="small" />}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default TaskItemRow;
