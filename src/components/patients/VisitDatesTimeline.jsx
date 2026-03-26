import React from 'react';
import { Box } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const VisitDatesTimeline = ({ visitDates = [], onRemoveDate }) => {
  if (!visitDates || visitDates.length === 0) return null;

  const ITEM_WIDTH = 120;
  const DOT_Y = 25; // Adjusted slightly for better vertical balance
  const SMALL_R = 6;
  const LARGE_R = 16;

  return (
    <Box sx={{ py: 2, overflowX: 'auto', WebkitPrintColorAdjust: 'exact' }}>
      <svg 
        width={visitDates.length * ITEM_WIDTH + 40} // Added padding for the icon
        height="80" 
        viewBox={`0 0 ${visitDates.length * ITEM_WIDTH + 40} 80`}
        style={{ display: 'block' }}
      >
        {/* 1. Continuous Connector Line */}
        <line 
          x1={ITEM_WIDTH / 2} 
          y1={DOT_Y} 
          x2={(visitDates.length - 1) * ITEM_WIDTH + (ITEM_WIDTH / 2)} 
          y2={DOT_Y} 
          stroke="#a2b9d6" 
          strokeWidth="2" 
        />

        {visitDates.map((date, index) => {
          const isLast = index === visitDates.length - 1;
          const xPos = index * ITEM_WIDTH + (ITEM_WIDTH / 2);

          return (
            <g key={`group-${index}`}>
              {/* 2. SVG Circle (Print-Safe) */}
              <circle 
                cx={xPos} 
                cy={DOT_Y} 
                r={isLast ? LARGE_R : SMALL_R} 
                fill={isLast ? "#5b6d96" : "#a2b9d6"} 
              />

              {/* 3. Date Label */}
              <text 
                x={xPos} 
                y={DOT_Y + 40} 
                textAnchor="middle" 
                fontFamily="inherit"
                fontSize="12px"
                fontWeight={isLast ? "700" : "400"}
                fill={isLast ? "#333" : "#7a869a"}
              >
                {date}
              </text>

              {/* 4. Delete Icon (Only for last item) */}
              {isLast && (
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