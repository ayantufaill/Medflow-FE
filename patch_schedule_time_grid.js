const fs = require('fs');
const file = 'src/components/appointments/schedule/ScheduleTimeGrid.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { Box, Typography, CircularProgress, Button } from "@mui/material";\nimport dayjs from "dayjs";',
  'import { Box, Typography, CircularProgress, Button } from "@mui/material";\nimport { useDroppable } from "@dnd-kit/core";\nimport dayjs from "dayjs";'
);

const droppableCellCode = `
const DroppableCell = ({ hour, room, idx, activeCell, setActiveCell, onSlotClick }) => {
  const roomId = room._id || room.id || room.roomCode || \`op\${idx + 1}\`;
  
  const { setNodeRef: setNodeRefTop, isOver: isOverTop } = useDroppable({
    id: \`slot-\${roomId}-\${hour}-0\`,
  });
  
  const { setNodeRef: setNodeRefBottom, isOver: isOverBottom } = useDroppable({
    id: \`slot-\${roomId}-\${hour}-30\`,
  });

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const isBottomHalf = y > 40 / 2; // HOUR_HEIGHT = 40
        const mins = isBottomHalf ? 30 : 0;
        setActiveCell({
          hour,
          mins,
          roomId
        });
      }}
      sx={{
        width: 120, // COLUMN_MIN_WIDTH
        flexShrink: 0,
        borderLeft: \`1px solid #e1e4e8\`,
        position: "relative",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          backgroundColor: "rgba(34, 98, 239, 0.04)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          borderTop: "1px dashed #e8ecf0",
          pointerEvents: "none",
        },
      }}
    >
      <Box ref={setNodeRefTop} sx={{ flex: 1, backgroundColor: isOverTop ? "rgba(34, 98, 239, 0.1)" : "transparent" }} />
      <Box ref={setNodeRefBottom} sx={{ flex: 1, backgroundColor: isOverBottom ? "rgba(34, 98, 239, 0.1)" : "transparent" }} />
      
      {activeCell && activeCell.hour === hour && activeCell.roomId === roomId && (
        <Box
          sx={{
            position: 'absolute',
            top: activeCell.mins === 30 ? '50%' : 0,
            height: '50%',
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.95)',
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
            disableElevation
            onClick={() => {
              if (onSlotClick) onSlotClick(activeCell.hour, activeCell.mins, activeCell.roomId);
              setActiveCell(null);
            }}
            sx={{ fontSize: '10px', py: 0.5, minWidth: '80%', borderRadius: '6px' }}
          >
            Schedule
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setActiveCell(null)}
            sx={{ fontSize: '10px', py: 0.5, minWidth: '80%', borderRadius: '6px' }}
          >
            Block slot
          </Button>
        </Box>
      )}
    </Box>
  );
};
`;

content = content.replace(
  'const ScheduleTimeGrid = ({ onSlotClick, onBlockClick }) => {',
  droppableCellCode + '\nconst ScheduleTimeGrid = ({ onSlotClick, onBlockClick }) => {'
);

const oldRoomMap = `          {/* One cell per operatory column */}
          {rooms.map((room, idx) => (
            <Box
              key={room._id || room.id || idx}`;

const newRoomMapCode = `          {/* One cell per operatory column */}
          {rooms.map((room, idx) => (
            <DroppableCell 
              key={room._id || room.id || idx}
              hour={hour}
              room={room}
              idx={idx}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
              onSlotClick={onSlotClick}
            />
          ))}
        </Box>
      ))}
      
      {/* ── Grid items (appointments & blocks) ────────────────────────────── */}`;

// A more robust regex replacement for the whole map function block
content = content.replace(/\{\/\* One cell per operatory column \*\/\}[\s\S]*?\{\/\* ── Grid items \(appointments & blocks\) ────────────────────────────── \*\/\}/m, newRoomMapCode);

fs.writeFileSync(file, content);
