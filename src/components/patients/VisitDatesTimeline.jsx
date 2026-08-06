import { Box } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const VisitDatesTimeline = ({ visitDates = [], onRemoveDate, onDateClick, activeAppointmentId }) => {
  if (!visitDates || visitDates.length === 0) return null;

  const ITEM_WIDTH = 120;
  const DOT_Y = 25; // Adjusted slightly for better vertical balance
  const SMALL_R = 6;
  const LARGE_R = 16;

  return (
    <Box 
      sx={{ 
        py: 0, 
        overflowX: 'auto',
        WebkitPrintColorAdjust: 'exact',
        maxWidth: '100%',
        '&::-webkit-scrollbar': {
          height: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '3px',
          '&:hover': {
            background: '#a8a8a8',
          },
        },
      }}
    >
      <svg 
        width={visitDates.length * ITEM_WIDTH + 40} // Added padding for the icon
        height="70" 
        viewBox={`0 0 ${visitDates.length * ITEM_WIDTH + 40} 80`}
        style={{ display: 'block', minWidth: '100%' }}
      >
        {/* 1. Continuous Connector Line */}
        <line 
          x1={ITEM_WIDTH / 2} 
          y1={DOT_Y} 
          x2={(visitDates.length - 1) * ITEM_WIDTH + (ITEM_WIDTH / 2)} 
          y2={DOT_Y} 
          stroke="#2362EF" 
          strokeWidth="2" 
        />

        {visitDates.map((dateItem, index) => {
          const isLast = index === visitDates.length - 1;
          const xPos = index * ITEM_WIDTH + (ITEM_WIDTH / 2);
          const label = typeof dateItem === 'object' ? dateItem.label : dateItem;
          
          const isActive = activeAppointmentId 
            ? (typeof dateItem === 'object' && String(dateItem.appointmentId) === String(activeAppointmentId))
            : isLast;

          const handleDateClick = () => {
            if (onDateClick && typeof dateItem === 'object') {
              onDateClick(dateItem.appointmentId || null);
            }
          };

          return (
            <g key={`group-${index}`}>
              {/* 2. SVG Circle (Print-Safe) */}
              <circle 
                cx={xPos} 
                cy={DOT_Y} 
                r={isActive ? LARGE_R : SMALL_R} 
                fill={isActive ? "#2362EF" : "rgba(35, 98, 239, 0.35)"} 
                onClick={handleDateClick}
                style={{ cursor: 'pointer' }}
              />

              {/* 3. Date Label */}
              <text 
                x={xPos} 
                y={DOT_Y + 40} 
                textAnchor="middle" 
                fontFamily="inherit"
                fontSize="12px"
                fontWeight={isActive ? "700" : "400"}
                fill={isActive ? "#333" : "#7a869a"}
                onClick={handleDateClick}
                style={{ cursor: 'pointer' }}
              >
                {label}
              </text>

              {/* 4. Delete Icon (Only for last item, and only when removal is supported) */}
              {isLast && onRemoveDate && (
                <foreignObject 
                  x={xPos + 40} // Offset to the right of the text
                  y={DOT_Y + 26} // Aligns vertically with the text baseline
                  width="20" 
                  height="20"
                  className="noprint" // CSS class to hide during print
                >
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <DeleteOutlineIcon
                      onClick={() => onRemoveDate && onRemoveDate(index)}
                      sx={{
                        fontSize: 18,
                        color: '#c57a7a',
                        cursor: 'pointer',
                        '@media print': { display: 'none' }, // Double-safety for print
                        '&:hover': { color: '#a35d5d' }
                      }}
                    />
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </Box>
  );
};

export default VisitDatesTimeline;