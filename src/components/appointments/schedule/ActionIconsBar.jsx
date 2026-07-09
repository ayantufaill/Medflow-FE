import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
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

const ActionIconsBar = ({ onPrintClick }) => {
  const [isBulkTextModalOpen, setIsBulkTextModalOpen] = useState(false);
  const [isLabCasesModalOpen, setIsLabCasesModalOpen] = useState(false);
  const [isProgressNotesModalOpen, setIsProgressNotesModalOpen] = useState(false);
  const [filterLabsAnchorEl, setFilterLabsAnchorEl] = useState(null);

  const ICONS = [
    { icon: <NoteAddOutlined />, title: 'Send Bulk Text', active: true, onClick: () => setIsBulkTextModalOpen(true) },
    { icon: <PersonAddOutlined />, title: 'Patients' },
    { icon: <ScienceOutlined />, title: 'Lab Cases', onClick: () => setIsLabCasesModalOpen(true) },
    { icon: <DescriptionOutlined />, title: 'Progress notes', onClick: () => setIsProgressNotesModalOpen(true) },
    { icon: <FilterAltOutlined />, title: 'Filter Labs', onClick: (e) => setFilterLabsAnchorEl(e.currentTarget) },
    { icon: <VisibilityOffOutlined />, title: 'Hide' },
    { icon: <SpeakerNotesOffOutlined />, title: 'No Notes' },
    { icon: <PrintOutlined />, title: 'Print', onClick: onPrintClick },
    { icon: <PersonOutline />, title: 'Privacy Mode' },
    { icon: <AttachMoney />, title: 'Billing' },
    { divider: true },
    { icon: <MoreVert />, title: 'More' },
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
    </>
  );
};

export default ActionIconsBar;
