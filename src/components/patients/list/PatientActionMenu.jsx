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
  >
    <MenuItem onClick={() => onViewDetails(actionMenu.patientId)}>
      <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
      <ListItemText>View Details</ListItemText>
    </MenuItem>
    <MenuItem
      onClick={() => onToggleInactive(actionMenu.patientId, actionMenu.patientName, actionMenu.isActive)}
      sx={{ color: actionMenu.isActive ? 'error.main' : 'success.main' }}
    >
      <ListItemIcon>
        <PersonOffIcon fontSize="small" color={actionMenu.isActive ? 'error' : 'success'} />
      </ListItemIcon>
      <ListItemText>{actionMenu.isActive ? 'Mark Inactive' : 'Mark Active'}</ListItemText>
    </MenuItem>
  </Menu>
);

export default PatientActionMenu;
