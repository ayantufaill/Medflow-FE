import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Checklist } from '@mui/icons-material';
import { useDraggable } from '@dnd-kit/core';
import RightPanelCard from './RightPanelCard';
import AppointmentShortlistModal from './AppointmentShortlistModal';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, avatarSize } from '../../../constants/styles';
import { shortlistService } from '../../../services/shortlist.service';
import dayjs from 'dayjs';

/** Normalize ALL-CAPS names to Title Case */
const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const DraggableShortlistItem = ({ item }) => {
  const name = item.patientName || item.PatientName || item.name || `Patient #${item.PatNum || ''}`;
  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "?";
  const apptDate = item.appointmentDate || item.AppointmentDate;
  const startTime = item.startTime || item.StartTime;
  const durationMins = item.durationMinutes || item.DurationMins;
  
  const slotDay = apptDate ? dayjs(apptDate).format("ddd") : "Any";
  const slotTime = startTime ? dayjs(`2000-01-01T${startTime}`).format("hh:mm A") : "Any Time";
  const slotDuration = durationMins ? `${durationMins}m` : "";
  const slotStr = `${slotDay} · ${slotTime}${slotDuration ? ` · ${slotDuration}` : ''}`;
  const dateStr = apptDate ? dayjs(apptDate).format("MMM DD, YYYY") : "No Date";

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `shortlist-item-${item._id || item.id || item.ShortlistNum || item.PatNum}`,
    data: {
      isShortlistItem: true,
      type: "shortlist",
      id: item._id || item.id || item.ShortlistNum || item.PatNum,
      originalData: item
    }
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        py: '9px',
        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
        '&:last-child': { borderBottom: 'none' },
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        '&:hover': { backgroundColor: COLORS.SURFACE_HOVER },
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: avatarSize.md, height: avatarSize.md,
          borderRadius: '50%',
          backgroundColor: COLORS.AVATAR_BG,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.bold, color: COLORS.AVATAR_TEXT }}>
          {initials}
        </Typography>
      </Box>

      {/* Name + slot */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {toTitleCase(name)}
        </Typography>
        <Typography sx={{ fontSize: fontSize.base, color: '#6b7280' }}>
          {slotStr}
        </Typography>
      </Box>

      {/* Date */}
      <Typography sx={{ fontSize: fontSize.base, color: '#6b7280', flexShrink: 0 }}>
        {dateStr}
      </Typography>
    </Box>
  );
};

const AppointmentShortlist = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await shortlistService.getShortlistItems();
      setItems(data?.data || data || []);
    } catch (err) {
      console.error("Failed to fetch shortlist for sidebar", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const handleShortlistUpdate = () => fetchItems();
    window.addEventListener('shortlist-updated', handleShortlistUpdate);
    return () => window.removeEventListener('shortlist-updated', handleShortlistUpdate);
  }, [modalOpen]); // Refresh when modal closes as items might have changed

  return (
    <>
      <RightPanelCard
        icon={<Checklist sx={{ fontSize: '20px', color: COLORS.ACCENT }} />}
        title="Appointment Shortlist"
        count={items.length}
        headerAction="expand"
        onExpand={() => setModalOpen(true)}
        footerLabel="View all & filter →"
      >
        {items.slice(0, 4).map((item) => (
          <DraggableShortlistItem key={item._id || item.id || item.ShortlistNum || item.PatNum || item.name} item={item} />
        ))}
      </RightPanelCard>

      <AppointmentShortlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default AppointmentShortlist;
