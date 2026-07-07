import { Box, Typography } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontWeight, radius } from '../../../constants/styles';

const formatCurrency = (val) => '$' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const ProductivityCard = ({ data }) => {
  // Use a max value based on the highest value or goal in the rows to scale the bars properly
  const maxVal = Math.max(...data.rows.map(r => Math.max(r.value, r.goal || 0))) * 1.1; // Add 10% headroom

  return (
    <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, p: '16px', mb: '16px', backgroundColor: COLORS.SURFACE_CARD }}>
      <Typography sx={{ fontSize: '14px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: '4px' }}>
        {data.title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px', mb: '16px' }}>
        <Typography sx={{ fontSize: '12px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY }}>S</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
          {formatCurrency(data.scheduled)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: '20px' }}>
        {data.rows.map(row => {
          const valuePercent = Math.min((row.value / maxVal) * 100, 100);
          const goalPercent = row.goal ? Math.min((row.goal / maxVal) * 100, 100) : null;

          return (
            <Box key={row.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ width: '24px', fontSize: '12px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
                {row.label}
              </Typography>
              <Typography sx={{ width: '60px', textAlign: 'right', fontSize: '12px', color: row.color, fontWeight: fontWeight.semibold }}>
                {formatCurrency(row.value)}
              </Typography>
              
              {/* Progress Bar Container */}
              <Box sx={{ width: '70px', height: '10px', backgroundColor: '#cbd5e1', borderRadius: '2px', position: 'relative', mx: '12px' }}>
                {/* Fill */}
                <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${valuePercent}%`, backgroundColor: row.color, borderRadius: '2px' }} />
                
                {/* Goal Marker */}
                {goalPercent !== null && (
                  <Box sx={{ position: 'absolute', left: `${goalPercent}%`, top: '-5px', height: '15px', width: '2px', backgroundColor: '#1f2937' }}>
                    {/* Triangle head */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: '-4px', 
                      width: 0, 
                      height: 0, 
                      borderLeft: '5px solid transparent', 
                      borderRight: '5px solid transparent', 
                      borderTop: '5px solid #1f2937' 
                    }} />
                  </Box>
                )}
              </Box>

              <Typography sx={{ width: '50px', fontSize: '12px', color: COLORS.TEXT_SECONDARY, textAlign: 'right' }}>
                {row.goal ? formatCurrency(row.goal) : ''}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY, mb: '4px' }}>
        Production per hour <Typography component="span" sx={{ fontSize: '12px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>{formatCurrency(data.perHour)}</Typography> (goal {formatCurrency(data.perHourGoal)})
      </Typography>
      <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
        Production per visit <Typography component="span" sx={{ fontSize: '12px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>{formatCurrency(data.perVisit)}</Typography> (goal {formatCurrency(data.perVisitGoal)})
      </Typography>
    </Box>
  );
};

export default ProductivityCard;
