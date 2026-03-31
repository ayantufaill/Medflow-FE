import { Box, Typography, Grid, Divider, Radio, RadioGroup, FormControlLabel, TextField } from "@mui/material";
import Card from "../shared/Card";

const DentalGeneralInfo = ({ info, onChange }) => {
  const lineStyle = {
    border: 'none',
    borderBottom: '1px solid #9e9e9e',
    outline: 'none',
    width: '100%',
    fontSize: '14px',
    padding: '0 4px',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    marginLeft: '8px'
  };

  const labelStyle = {
    fontSize: '13px',
    color: '#333',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
    fontFamily: 'inherit'
  };

  const rowStyle = { 
    display: 'flex', 
    alignItems: 'flex-end', 
    mb: 1
  };

  return (
    <Box sx={{ width: '100%', p: 2, bgcolor: '#fff' }}>
      <Typography variant="subtitle1" sx={{ mb: 0.5, fontSize: '15px', color: '#555' }}>
        General Information
      </Typography>
      <Divider sx={{ mb: 2, borderColor: '#ccc' }} />

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>How would you rate the condition of your mouth?</Typography>
            <input style={lineStyle} value={info.mouthCondition || ""} onChange={(e) => onChange("mouthCondition", e.target.value)} />
          </Box>
          
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Previous Dentist:</Typography>
            <input style={lineStyle} value={info.previousDentist || ""} onChange={(e) => onChange("previousDentist", e.target.value)} />
          </Box>

          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Date of most recent dental exam:</Typography>
            <input style={lineStyle} value={info.recentExamDate || ""} onChange={(e) => onChange("recentExamDate", e.target.value)} />
          </Box>

          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Date of most recent treatment (other than a cleaning):</Typography>
            <input style={lineStyle} value={info.recentTreatmentDate || ""} onChange={(e) => onChange("recentTreatmentDate", e.target.value)} />
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>How long had you been a patient?</Typography>
            <input style={lineStyle} value={info.patientSince || ""} onChange={(e) => onChange("patientSince", e.target.value)} />
          </Box>

          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Date of most recent x-rays:</Typography>
            <input style={lineStyle} value={info.recentXrayDate || ""} onChange={(e) => onChange("recentXrayDate", e.target.value)} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography sx={labelStyle}>I routinely see my dentist every:</Typography>
            <RadioGroup 
              row 
              value={info.dentistVisitFrequency || ""} 
              onChange={(e) => onChange("dentistVisitFrequency", e.target.value)}
              sx={{ ml: 2 }}
            >
              {['3mo', '4mo', '6mo', '12mo', 'not'].map((value, index) => {
                const labels = ['3 Mo.', '4 Mo.', '6 Mo.', '12 Mo.', 'Not routinely'];
                return (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio size="small" sx={{ p: 0.5 }} />}
                    label={<Typography sx={{ fontSize: '12px' }}>{labels[index]}</Typography>}
                    sx={{ mr: 1.5 }}
                  />
                );
              })}
            </RadioGroup>
          </Box>
        </Grid>

        {/* Bottom Section: Full Width */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Typography sx={{ ...labelStyle, textTransform: 'uppercase' }}>
              WHAT IS YOUR IMMEDIATE CONCERN?
            </Typography>
            <input style={lineStyle} value={info.immediateConcern || ""} onChange={(e) => onChange("immediateConcern", e.target.value)} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DentalGeneralInfo;
