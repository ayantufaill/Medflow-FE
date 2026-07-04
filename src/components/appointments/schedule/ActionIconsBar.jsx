import { Box, IconButton } from '@mui/material';
import {
  NoteAddOutlined,
  PersonAddOutlined,
  ScienceOutlined,
  DescriptionOutlined,
  FilterAltOutlined,
  VisibilityOffOutlined,
  VolumeOffOutlined,
  PrintOutlined,
  PersonOutline,
  AttachMoney,
  MoreVert,
} from '@mui/icons-material';
import VerticalDivider from '../../common/VerticalDivider';
import { COLORS } from '../../../constants/colors';
import { radius } from '../../../constants/styles';

const ICONS = [
  { icon: <NoteAddOutlined />, title: 'New Note', active: true },
  { icon: <PersonAddOutlined />, title: 'Add Patient' },
  { icon: <ScienceOutlined />, title: 'Lab' },
  { icon: <DescriptionOutlined />, title: 'Notes' },
  { icon: <FilterAltOutlined />, title: 'Filter' },
  { icon: <VisibilityOffOutlined />, title: 'Hide' },
  { icon: <VolumeOffOutlined />, title: 'Block' },
  { icon: <PrintOutlined />, title: 'Print' },
  { icon: <PersonOutline />, title: 'Provider' },
  { icon: <AttachMoney />, title: 'Billing' },
  { divider: true },
  { icon: <MoreVert />, title: 'More' },
];

const ActionIconsBar = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '1px',
      border: `1px solid ${COLORS.BORDER}`,
      borderRadius: radius.lg,
      px: '3px',
      py: '3px',
      flexShrink: 0,
    }}
  >
    {ICONS.map((item, i) =>
      item.divider ? (
        <VerticalDivider key={`divider-${i}`} height="16px" />
      ) : (
        <IconButton
          key={item.title}
          title={item.title}
          sx={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            p: 0,
            color: item.active ? COLORS.ACCENT : COLORS.TEXT_SECONDARY,
            backgroundColor: item.active ? COLORS.ACCENT_BG : 'transparent',
            '& .MuiSvgIcon-root': { fontSize: '13px' },
            '&:hover': {
              backgroundColor: item.active ? 'rgba(34, 98, 239, 0.15)' : 'rgba(0,0,0,0.05)',
            },
          }}
        >
          {item.icon}
        </IconButton>
      )
    )}
  </Box>
);

export default ActionIconsBar;
