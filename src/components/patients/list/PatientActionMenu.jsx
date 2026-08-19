import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Visibility as VisibilityIcon, PersonOff as PersonOffIcon } from '@mui/icons-material';

// Row-level kebab menu (View Details / Mark Active-Inactive) shared by every
// row in the patients table.
const PatientActionMenu = ({ actionMenu, onClose, onViewDetails, onToggleInactive }) => (
  <Menu
    anchorEl={actionMenu.anchorEl}
    open={Boolean(actionMenu.anchorEl)}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    PaperProps={{
      elevation: 0,
      sx: {
        mt: 1,
        minWidth: 180,
        borderRadius: '12px',
        border: '1px solid #e0e5eb',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        '& .MuiList-root': {
          p: 1,
        },
        '& .MuiMenuItem-root': {
          px: 1.5,
          py: 1,
          borderRadius: '8px',
          fontFamily: 'Inter',
          fontSize: '13px',
          fontWeight: 500,
          color: '#1e293b',
          mb: 0.5,
          '&:last-child': { mb: 0 },
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
          '& .MuiListItemIcon-root': {
            minWidth: 32,
            color: '#64748b',
          }
        },
      }
    }}
  >
    <MenuItem onClick={() => onViewDetails(actionMenu.patientId)}>
      <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
      View Details
    </MenuItem>
    <MenuItem
      onClick={() => onToggleInactive(actionMenu.patientId, actionMenu.patientName, actionMenu.isActive)}
      sx={{ 
        color: actionMenu.isActive ? '#ef4444 !important' : '#10b981 !important',
        '& .MuiListItemIcon-root': {
          color: actionMenu.isActive ? '#ef4444 !important' : '#10b981 !important',
        },
        '&:hover': {
          backgroundColor: actionMenu.isActive ? '#fef2f2 !important' : '#ecfdf5 !important',
        }
      }}
    >
      <ListItemIcon>
        <PersonOffIcon fontSize="small" />
      </ListItemIcon>
      {actionMenu.isActive ? 'Mark Inactive' : 'Mark Active'}
    </MenuItem>
  </Menu>
);

export default PatientActionMenu;
