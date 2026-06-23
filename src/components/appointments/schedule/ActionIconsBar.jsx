import { Box, IconButton } from '@mui/material';
import {
  NoteAdd,
  PersonAdd,
  Science,
  Description,
  FilterAlt,
  VisibilityOff,
  IndeterminateCheckBox,
  Print,
  Person,
  AttachMoney,
  MoreVert,
} from '@mui/icons-material';
import VerticalDivider from '../../common/VerticalDivider';

const ICONS = [
  { icon: <NoteAdd />, title: 'New Note', active: true },
  { icon: <PersonAdd />, title: 'Add Patient' },
  { icon: <Science />, title: 'Lab' },
  { icon: <Description />, title: 'Notes' },
  { icon: <FilterAlt />, title: 'Filter' },
  { icon: <VisibilityOff />, title: 'Hide' },
  { icon: <IndeterminateCheckBox />, title: 'Block' },
  { icon: <Print />, title: 'Print' },
  { icon: <Person />, title: 'Provider' },
  { icon: <AttachMoney />, title: 'Billing' },
  { divider: true },
  { icon: <MoreVert />, title: 'More' },
];

const ActionIconsBar = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      border: '1px solid #e0e5eb',
      borderRadius: '10px',
      px: '4px',
      py: '4px',
      flexShrink: 0,
    }}
  >
    {ICONS.map((item, i) =>
      item.divider ? (
        <VerticalDivider key={`divider-${i}`} height="20px" />
      ) : (
        <IconButton
          key={item.title}
          size="small"
          title={item.title}
          sx={{
            width: '24px',
            height: '24px',
            borderRadius: '5px',
            color: item.active ? '#2262ef' : '#5c646f',
            backgroundColor: item.active ? 'rgba(34, 98, 239, 0.10)' : 'transparent',
            '& .MuiSvgIcon-root': { fontSize: '15px' },
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
