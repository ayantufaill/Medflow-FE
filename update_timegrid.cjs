const fs = require('fs');
const file = '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/appointments/schedule/ScheduleTimeGrid.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add useState
content = content.replace('import { useEffect, useMemo } from "react";', 'import { useState, useEffect, useMemo } from "react";');
content = content.replace('import { Box, Typography, CircularProgress } from "@mui/material";', 'import { Box, Typography, CircularProgress, Button } from "@mui/material";');

// Update props
content = content.replace('const ScheduleTimeGrid = ({ onSlotClick }) => {', 'const ScheduleTimeGrid = ({ onScheduleClick, onBlockClick }) => {');

// Add state
content = content.replace('const { calendarView, selectedDate } = useScheduleState();', 'const [activeCell, setActiveCell] = useState(null);\n  const { calendarView, selectedDate } = useScheduleState();');

// Close menu on click outside - using a useEffect
const effectCode = `
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Very basic outside click handler
      if (activeCell) setActiveCell(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeCell]);
`;
content = content.replace('const { rooms, providers } = useDropdownData(', effectCode + '\n  const { rooms, providers } = useDropdownData(');

// Update click handler
const clickHandler = `
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const isBottomHalf = y > HOUR_HEIGHT / 2;
                const mins = isBottomHalf ? 30 : 0;
                setActiveCell({
                  hour,
                  mins,
                  roomId: room._id || room.id || room.roomCode || \`op\${idx + 1}\`
                });
              }}`;

content = content.replace(/onClick=\{\(e\) => \{[\s\S]*?\}\}/, clickHandler);

// Inject active cell renderer
const activeCellOverlay = `
                {/* Active cell options popup */}
                {activeCell && activeCell.hour === hour && activeCell.roomId === (room._id || room.id || room.roomCode || \`op\${idx + 1}\`) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: activeCell.mins === 30 ? '50%' : 0,
                      height: '50%',
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: \`2px solid \${COLORS.PRIMARY}\`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        if (onScheduleClick) onScheduleClick(activeCell.hour, activeCell.mins, activeCell.roomId);
                        setActiveCell(null);
                      }}
                      sx={{ fontSize: '10px', textTransform: 'none', py: 0.5, minWidth: '80%', backgroundColor: COLORS.PRIMARY, '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER } }}
                    >
                      Schedule Appointment
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        if (onBlockClick) onBlockClick(activeCell.hour, activeCell.mins, activeCell.roomId);
                        setActiveCell(null);
                      }}
                      sx={{ fontSize: '10px', textTransform: 'none', py: 0.5, minWidth: '80%', color: COLORS.TEXT_PRIMARY, borderColor: COLORS.BORDER }}
                    >
                      Block Slot
                    </Button>
                  </Box>
                )}
`;

content = content.replace('                "&::after": {', activeCellOverlay + '                "&::after": {');

fs.writeFileSync(file, content);
console.log('Done');
