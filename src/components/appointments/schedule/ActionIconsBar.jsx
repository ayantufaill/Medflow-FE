import { useState } from 'react';
import { Box, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import {
  NoteAddOutlined,
  PersonAddOutlined,
  ScienceOutlined,
  DescriptionOutlined,
  FilterAltOutlined,
  VisibilityOffOutlined,
  SpeakerNotesOffOutlined,
  PrintOutlined,
  PersonOutline,
  PersonOffOutlined,
  AttachMoney,
  MoreVert,
} from '@mui/icons-material';
import VerticalDivider from '../../common/VerticalDivider';
import { COLORS } from '../../../constants/colors';
import { radius } from '../../../constants/styles';
import SendBulkTextModal from './bulk-text/SendBulkTextModal';
import LabCasesDialog from './lab-cases-modal/LabCasesDialog';
import ProgressNotesDialog from './progress-notes-modal/ProgressNotesDialog';
import FilterLabsPopover from './FilterLabsPopover';

const ActionIconsBar = ({ onPrintClick, privacyMode, onTogglePrivacyMode }) => {
  const [isBulkTextModalOpen, setIsBulkTextModalOpen] = useState(false);
  const [isLabCasesModalOpen, setIsLabCasesModalOpen] = useState(false);
  const [isProgressNotesModalOpen, setIsProgressNotesModalOpen] = useState(false);
  const [filterLabsAnchorEl, setFilterLabsAnchorEl] = useState(null);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);

  const ICONS = [
    { icon: <NoteAddOutlined />, title: 'Send Bulk Text', active: true, onClick: () => setIsBulkTextModalOpen(true) },
    { icon: <PersonAddOutlined />, title: 'Patients', disabled: true },
    { icon: <ScienceOutlined />, title: 'Lab Cases', onClick: () => setIsLabCasesModalOpen(true) },
    { icon: <DescriptionOutlined />, title: 'Progress notes', onClick: () => setIsProgressNotesModalOpen(true) },
    { icon: <FilterAltOutlined />, title: 'Filter Labs', onClick: (e) => setFilterLabsAnchorEl(e.currentTarget) },
    { icon: <VisibilityOffOutlined />, title: 'Hide', disabled: true },
    { icon: <SpeakerNotesOffOutlined />, title: 'No Notes', disabled: true },
    { icon: <PrintOutlined />, title: 'Print', onClick: onPrintClick },
    { icon: privacyMode ? <PersonOffOutlined /> : <PersonOutline />, title: 'Privacy Mode', active: privacyMode, onClick: onTogglePrivacyMode },
    { icon: <AttachMoney />, title: 'Billing', disabled: true },
    { divider: true },
    { icon: <MoreVert />, title: 'More', onClick: (e) => setMoreMenuAnchorEl(e.currentTarget) },
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
        anchorEl={moreMenuAnchorEl}
        open={Boolean(moreMenuAnchorEl)}
        onClose={() => setMoreMenuAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '8px',
            minWidth: '160px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled onClick={() => setMoreMenuAnchorEl(null)} sx={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
          Show all columns
        </MenuItem>
        <MenuItem disabled onClick={() => setMoreMenuAnchorEl(null)} sx={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT_PRIMARY }}>
          Close/Open a day
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionIconsBar;
