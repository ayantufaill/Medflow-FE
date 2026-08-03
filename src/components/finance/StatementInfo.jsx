import { Box, Typography, Grid, InputBase } from '@mui/material';
import { fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

const StatementInfo = ({ statementInfo }) => {
  const primaryBlue = COLORS.TEXT_PRIMARY;
  const lightBlue = COLORS.BORDER;

  return (
    <Grid container spacing={6} sx={{ mb: 4 }} alignItems="flex-start">
      {/* Left Side: Clinic Branding */}
      <Grid item xs={6}>
        <Typography variant="h5" sx={{ fontWeight: fontWeight.regular, letterSpacing: '2px', color: '#333', fontSize: fontSize.lg }}>
          THE CLINIC NAME
        </Typography>
        <Typography sx={{ fontSize: fontSize.xs, color: '#666' }}>
          123 Medical Dr. City, State, Zip
        </Typography>
      </Grid>

      {/* Right Side: Info Box */}
      <Grid item xs={6}>
        <Box 
          sx={{ 
            border: `1px solid ${COLORS.BORDER}`, 
            borderRadius: '4px', 
            overflow: 'hidden' 
          }}
        >
          {/* Patient Name Row */}
          <Box sx={{ display: 'flex', borderBottom: `1px solid ${COLORS.BORDER}` }}>
            <Typography sx={{ width: '150px', p: 1, pl: 1.5, fontSize: '14px', color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.medium }}>
              Patient Name
            </Typography>
            <InputBase
              defaultValue={statementInfo.patientName}
              sx={{ 
                flex: 1, 
                p: 1, 
                fontSize: '14px', 
                color: COLORS.TEXT_PRIMARY,
                borderLeft: `1px solid ${COLORS.BORDER}`,
                paddingLeft: '1.5rem',
                fontWeight: fontWeight.semiBold
              }}
            />
          </Box>

          {/* Statement Date Row */}
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ width: '150px', p: 1, pl: 1.5, fontSize: '14px', color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.medium }}>
              Statement Date
            </Typography>
            <InputBase
              defaultValue={statementInfo.statementDate}
              sx={{ 
                flex: 1, 
                p: 1, 
                fontSize: '14px', 
                color: COLORS.TEXT_PRIMARY,
                borderLeft: `1px solid ${COLORS.BORDER}`,
                paddingLeft: '1.5rem',
                fontWeight: fontWeight.semiBold
              }}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StatementInfo;
