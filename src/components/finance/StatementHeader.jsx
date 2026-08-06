import { Box, Typography, TextField, Grid, InputBase } from '@mui/material';
import { fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

const StatementHeader = ({ patientInfo, statementInfo, outstandingInfo, showOutstanding = true }) => {
  const primaryBlue = '#40548e';
  const lightBlue = '#abb8d3';

  const LabelInput = ({ label, width = '100%' }) => (
    <TextField
      variant="standard"
      label={label}
      fullWidth
      size="small"
      sx={{ 
        width, 
        mb: 1.5,
        '& .MuiInputBase-root': {
          fontSize: fontSize.sm
        },
        '& .MuiInputLabel-root': {
          fontSize: fontSize.xs,
          fontStyle: 'italic'
        }
      }}
    />
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <Box sx={{ mt: 2 }}>
          {/* Blurred Address Placeholder */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.4, color: '#333', fontSize: fontSize.sm }}>
              <strong>Your Clinic Name</strong><br />
              123 Medical Dr.<br />
              City, State, Zip<br />
              (555) 555-5555
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 8, fontSize: fontSize.lg }}>
            <TextField
              variant="standard"
              defaultValue={patientInfo.name}
              fullWidth
              sx={{ 
                fontSize: fontSize.lg,
                '& .MuiInputBase-root': {
                  fontSize: fontSize.lg
                }
              }}
            />
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box sx={{ mt: 1 }}>
          <LabelInput label="card number" />
          <Box sx={{ display: 'flex', gap: 4 }}>
            <LabelInput label="expiry date" />
            <LabelInput label="security code" />
          </Box>
          <LabelInput label="full name (as appears on card)" />
          <LabelInput label="signature" />

          {/* Estimates Table */}
          <Box sx={{ mt: 2, border: `1px solid ${COLORS.BORDER}`, borderRadius: '6px', overflow: 'hidden', width: '100%', maxWidth: 400 }}>
            {/* Header Row */}
            <Box sx={{ bgcolor: COLORS.SURFACE_TINT, display: 'flex', borderBottom: `1px solid ${COLORS.BORDER}` }}>
              {showOutstanding && (
                <Box sx={{ flex: 1, p: 1.5 }}>
                  <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>Outstanding:</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY }}>{outstandingInfo.outstanding}</Typography>
                </Box>
              )}
              <Box sx={{ flex: 1, p: 1.5 }}>
                <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>Insurance Estimate:</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY }}>{outstandingInfo.insuranceEstimate}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1.5 }}>
                <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>Your Portion:</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: fontWeight.semiBold, color: COLORS.TEXT_PRIMARY }}>{outstandingInfo.yourPortion}</Typography>
              </Box>
            </Box>

            {/* Enclosed Amount Row */}
            <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px', color: COLORS.ACCENT, mr: 1, fontWeight: fontWeight.medium }}>
                Enclosed amount:
              </Typography>
              <InputBase
                defaultValue={outstandingInfo.enclosedAmount}
                sx={{ 
                  fontSize: '14px', 
                  color: COLORS.ACCENT,
                  flexGrow: 1,
                  fontWeight: fontWeight.semiBold
                }}
              />
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StatementHeader;
