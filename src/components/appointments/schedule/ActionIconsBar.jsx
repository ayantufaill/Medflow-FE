import { useState } from 'react';
import { Box, IconButton, Tooltip, Menu, MenuItem, Typography } from '@mui/material';
import {
  NoteAddOutlined,
  PersonAddOutlined,
  ScienceOutlined,
  DescriptionOutlined,
  FilterAltOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
  SpeakerNotesOffOutlined,
  SpeakerNotesOutlined,
  PrintOutlined,
  PersonOutline,
  PersonOffOutlined,
  AttachMoney,
  MoreVert,
  HistoryOutlined,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import VerticalDivider from '../../common/VerticalDivider';
import { COLORS } from '../../../constants/colors';
import { radius } from '../../../constants/styles';
import SendBulkTextModal from './bulk-text/SendBulkTextModal';
import LabCasesDialog from './lab-cases-modal/LabCasesDialog';
import ProgressNotesDialog from './progress-notes-modal/ProgressNotesDialog';
import FilterLabsPopover from './FilterLabsPopover';
import { useNavigate } from 'react-router-dom';

const ActionIconsBar = ({ onPrintClick, onMoreClick, privacyMode, onTogglePrivacyMode, hideBlocks, onToggleHideBlocks, showGhosted, onToggleShowGhosted, lastViewedDates = [], onDateSelect }) => {
  const navigate = useNavigate();

  const [isBulkTextModalOpen, setIsBulkTextModalOpen] = useState(false);
  const [isLabCasesModalOpen, setIsLabCasesModalOpen] = useState(false);
  const [isProgressNotesModalOpen, setIsProgressNotesModalOpen] = useState(false);
  const [filterLabsAnchorEl, setFilterLabsAnchorEl] = useState(null);
  const [historyMenuAnchorEl, setHistoryMenuAnchorEl] = useState(null);

  // Skip the first date as it is the currently viewed date
  const historyDates = lastViewedDates.slice(1);

  const handleHistoryClick = (dateStr) => {
    setHistoryMenuAnchorEl(null);
    if (onDateSelect) onDateSelect(dateStr);
  };

  const ICONS = [
    { icon: <NoteAddOutlined />, title: 'Bulk Text', onClick: () => setIsBulkTextModalOpen(true) },
    { icon: <PersonAddOutlined />, title: 'Huddle', onClick: () => navigate('/day-tasks') },
    { icon: <ScienceOutlined />, title: 'Lab Cases', onClick: () => setIsLabCasesModalOpen(true) },
    { icon: <DescriptionOutlined />, title: 'Progress notes', onClick: () => setIsProgressNotesModalOpen(true) },
    { icon: <FilterAltOutlined />, title: 'Filter Labs', onClick: (e) => setFilterLabsAnchorEl(e.currentTarget) },
    { icon: showGhosted ? <VisibilityOutlined /> : <VisibilityOffOutlined />, title: showGhosted ? 'Hide Appointments' : 'Show Appointments', active: showGhosted, onClick: onToggleShowGhosted },
    { icon: hideBlocks ? <SpeakerNotesOffOutlined /> : <SpeakerNotesOutlined />, title: hideBlocks ? 'Show Blocks' : 'Hide Blocks', active: hideBlocks, onClick: onToggleHideBlocks },
    { icon: <PrintOutlined />, title: 'Print', onClick: onPrintClick },
    { icon: privacyMode ? <PersonOffOutlined /> : <PersonOutline />, title: 'Hide Names', active: privacyMode, onClick: onTogglePrivacyMode },
    { icon: <AttachMoney />, title: 'Billing', onClick: () => navigate('/batch-actions') },
    { icon: <HistoryOutlined />, title: 'Last viewed days', onClick: (e) => setHistoryMenuAnchorEl(e.currentTarget), disabled: historyDates.length === 0 },
    { divider: true },
    { icon: <MoreVert />, title: 'More', onClick: onMoreClick },
  ];

  return (
    <>
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
            <Tooltip title={item.title} key={item.title} arrow placement="top">
              <IconButton
                onClick={item.onClick}
                disabled={item.disabled}
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
            </Tooltip>
          )
        )}
      </Box>

      <SendBulkTextModal
        open={isBulkTextModalOpen}
        onClose={() => setIsBulkTextModalOpen(false)}
      />
      <LabCasesDialog
        open={isLabCasesModalOpen}
        onClose={() => setIsLabCasesModalOpen(false)}
      />
      <ProgressNotesDialog
        open={isProgressNotesModalOpen}
        onClose={() => setIsProgressNotesModalOpen(false)}
      />
      <FilterLabsPopover
        anchorEl={filterLabsAnchorEl}
        onClose={() => setFilterLabsAnchorEl(null)}
      />

      <Menu
        anchorEl={historyMenuAnchorEl}
        open={Boolean(historyMenuAnchorEl)}
        onClose={() => setHistoryMenuAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 150,
            borderRadius: radius.md,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: `1px solid ${COLORS.BORDER}`,
            '& .MuiMenuItem-root': {
              fontSize: '13px',
              fontFamily: 'Inter',
              color: COLORS.TEXT_PRIMARY,
              py: 1,
              px: 2,
            },
            '& .MuiMenuItem-root:hover': {
              backgroundColor: COLORS.SURFACE_HOVER,
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${COLORS.BORDER}`, mb: 0.5 }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 600, color: COLORS.TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recently Viewed
          </Typography>
        </Box>
        {historyDates.map((dateStr) => (
          <MenuItem key={dateStr} onClick={() => handleHistoryClick(dateStr)}>
            {dayjs(dateStr).format('MMM D, YYYY')}
          </MenuItem>
        ))}
        {historyDates.length === 0 && (
          <MenuItem disabled>No recent days</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ActionIconsBar;
