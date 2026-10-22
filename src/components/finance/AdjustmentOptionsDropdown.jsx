import { Menu, MenuItem, Typography } from '@mui/material';

// Temporarily disabled entries stay in the list but render greyed out and
// unclickable — flip `disabled` back to false to re-enable one.
const options = [
  { label: "Credit (subtraction)", disabled: false },
  { label: "Debit (addition)", disabled: false },
  { label: "Insurance Write-Off", disabled: false },
  { label: "Membership Adjustment", disabled: true },
];

const AdjustmentOptionsDropdown = ({ anchorEl, open, onClose, onSelect }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          minWidth: 200
        }
      }}
    >
      {options.map((option, index) => (
        <MenuItem
          key={index}
          disabled={option.disabled}
          onClick={() => {
            onSelect(option.label);
            onClose();
          }}
          sx={{ py: 1 }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: option.disabled ? '#b0b0b0' : '#333',
            }}
          >
            {option.label}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default AdjustmentOptionsDropdown;
