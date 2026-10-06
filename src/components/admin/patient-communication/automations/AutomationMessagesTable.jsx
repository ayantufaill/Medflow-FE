import { useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Switch,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';

import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';
import { formatTiming, splitMessage } from './automationConfig';

const headCellSx = {
  fontSize: fontSize.md,
  fontWeight: fontWeight.semibold,
  color: '#1E293B',
  bgcolor: '#FBFCFE',
  borderBottom: '1px solid #E5E9F2',
  py: 1.5,
};

const bodyCellSx = {
  fontSize: fontSize.md,
  color: COLORS.TEXT_BODY,
  borderBottom: '1px solid #F1F5F9',
  py: 1.25,
};

const MessagePreview = ({ body }) => (
  <Typography
    sx={{
      fontSize: fontSize.md,
      color: COLORS.TEXT_BODY,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}
  >
    {splitMessage(body).map((part, i) =>
      part.variable ? (
        <Box key={i} component="span" sx={{ fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
          {part.text}
        </Box>
      ) : (
        <span key={i}>{part.text}</span>
      )
    )}
  </Typography>
);

const AutomationMessagesTable = ({ messages, onToggleActive, onEdit, onDelete, togglingId }) => {
  const [menu, setMenu] = useState({ anchor: null, message: null });
  const closeMenu = () => setMenu({ anchor: null, message: null });

  if (messages.length === 0) {
    return (
      <Box sx={{ border: '1px dashed #E5E9F2', borderRadius: radius.lg, py: 6, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>
          No messages yet. Click <strong>New Message</strong> to create one.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ border: '1px solid #E5E9F2', borderRadius: radius.lg, overflow: 'hidden', bgcolor: COLORS.WHITE }}>
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headCellSx, width: '28%' }}>Timing</TableCell>
            <TableCell sx={headCellSx}>Message</TableCell>
            <TableCell sx={{ ...headCellSx, width: 110 }}>Channel</TableCell>
            <TableCell sx={{ ...headCellSx, width: 80 }}>Active</TableCell>
            <TableCell sx={{ ...headCellSx, width: 52 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ ...bodyCellSx, color: COLORS.TEXT_PRIMARY }}>
                <Typography noWrap sx={{ fontSize: 'inherit', color: 'inherit' }} title={formatTiming(message.timing)}>
                  {formatTiming(message.timing)}
                </Typography>
              </TableCell>
              <TableCell sx={bodyCellSx}>
                <MessagePreview body={message.body} />
              </TableCell>
              <TableCell sx={bodyCellSx}>{message.channel}</TableCell>
              <TableCell sx={bodyCellSx}>
                <Tooltip title={message.active ? 'Turn off' : 'Turn on'}>
                  <Switch
                    size="small"
                    checked={message.active}
                    disabled={togglingId === message.id}
                    onChange={(e) => onToggleActive(message, e.target.checked)}
                    inputProps={{ 'aria-label': `Active: ${formatTiming(message.timing)}` }}
                  />
                </Tooltip>
              </TableCell>
              <TableCell sx={{ ...bodyCellSx, textAlign: 'right' }}>
                <IconButton
                  size="small"
                  aria-label="Message actions"
                  onClick={(e) => setMenu({ anchor: e.currentTarget, message })}
                >
                  <MoreIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu
        anchorEl={menu.anchor}
        open={Boolean(menu.anchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { borderRadius: radius.md, border: `1px solid ${COLORS.BORDER}`, boxShadow: '0px 4px 20px rgba(0,0,0,0.12)' } }}
      >
        <MenuItem
          onClick={() => {
            onEdit(menu.message);
            closeMenu();
          }}
          sx={{ fontSize: fontSize.md }}
        >
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(menu.message);
            closeMenu();
          }}
          sx={{ fontSize: fontSize.md, color: COLORS.STATUS_ERROR }}
        >
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: COLORS.STATUS_ERROR }} /></ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AutomationMessagesTable;
