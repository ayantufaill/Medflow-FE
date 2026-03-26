import { Box, Typography, Grid, Divider, Checkbox, FormControlLabel, Select, MenuItem } from "@mui/material";
import Card from "../shared/Card";

const MedicalGeneralInfoCard = ({
  generalInfo,
  onChangeField,
  premedRequires,
  onPremedChange,
}) => {
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
    alignItems: 'space-between', 
    mb: 0.5
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={3} wrap="nowrap">
        {/* Left Section: General Information */}
        <Grid item xs style={{ flex: '1 1 auto' }}>
          <Typography variant="subtitle1" sx={{ mb: 0.5, fontSize: '15px', color: '#555' }}>
            General Information
          </Typography>
          <Divider sx={{ mb: 2, borderColor: '#ccc' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* First Row */}
            <Box sx={rowStyle}>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <Typography sx={labelStyle}>What is your estimate of your general health?</Typography>
                <input 
                  style={lineStyle} 
                  value={generalInfo.healthEstimate || ""} 
                  onChange={(e) => onChangeField("healthEstimate", e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <Typography sx={labelStyle}>Physician Name:</Typography>
                <input 
                  style={lineStyle} 
                  value={generalInfo.physicianName || ""} 
                  onChange={(e) => onChangeField("physicianName", e.target.value)}
                />
              </Box>
            </Box>

            {/* Second Row */}
            <Box sx={rowStyle}>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <Typography sx={labelStyle}>Date of most recent physical examination:</Typography>
                <input 
                  style={lineStyle} 
                  type="text"
                  value={generalInfo.lastExamDate || ""} 
                  onChange={(e) => onChangeField("lastExamDate", e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <Typography sx={labelStyle}>Physician specialty:</Typography>
                <input 
                  style={lineStyle} 
                  value={generalInfo.physicianSpecialty || ""} 
                  onChange={(e) => onChangeField("physicianSpecialty", e.target.value)}
                />
              </Box>
            </Box>

            {/* Third Row */}
            <Box sx={rowStyle}>
              <Box sx={{ flex: 0.5, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <Typography sx={labelStyle}>Purpose:</Typography>
                <input 
                  style={lineStyle} 
                  value={generalInfo.purpose || ""} 
                  onChange={(e) => onChangeField("purpose", e.target.value)}
                />
              </Box>
            </Box>

            {/* Fourth Row: Weight & Height */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ ...labelStyle, fontWeight: 600 }}>Weight:</Typography>
                <input 
                  style={lineStyle} 
                  value={generalInfo.weight || ""} 
                  onChange={(e) => onChangeField("weight", e.target.value)}
                />
                <Select
                  variant="standard"
                  value={generalInfo.weightUnit || "LBS"}
                  onChange={(e) => onChangeField("weightUnit", e.target.value)}
                  sx={{ fontSize: '12px', fontWeight: 600, '&:before, &:after': { display: 'none' }, ml: 0.5 }}
                  IconComponent={() => <span style={{ fontSize: '10px', marginLeft: '2px' }}>▼</span>}
                >
                  <MenuItem value="LBS">LBS</MenuItem>
                  <MenuItem value="KG">KG</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ ...labelStyle, fontWeight: 600 }}>Height:</Typography>
                <input 
                  style={lineStyle} 
                  value={generalInfo.height || ""} 
                  onChange={(e) => onChangeField("height", e.target.value)}
                />
                <Select
                  variant="standard"
                  value={generalInfo.heightUnit || "FT/IN"}
                  onChange={(e) => onChangeField("heightUnit", e.target.value)}
                  sx={{ fontSize: '12px', fontWeight: 600, '&:before, &:after': { display: 'none' }, ml: 0.5 }}
                  IconComponent={() => <span style={{ fontSize: '10px', marginLeft: '2px' }}>▼</span>}
                >
                  <MenuItem value="FT/IN">FT/IN</MenuItem>
                  <MenuItem value="CM">CM</MenuItem>
                </Select>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Section: Premed */}
        <Grid item sx={{ borderLeft: '1px solid #eee', pl: 3, minWidth: '180px', width: 'auto' }}>
          <Typography variant="subtitle1" sx={{ mb: 0.5, fontSize: '15px' }}>
            Premed
          </Typography>
          <Divider sx={{ mb: 2, borderColor: '#ccc' }} />
          
          <FormControlLabel
            control={
              <Checkbox 
                size="small" 
                checked={premedRequires} 
                onChange={(e) => onPremedChange(e.target.checked)}
                sx={{ p: 0.5 }}
              />
            }
            label={<Typography sx={{ fontSize: '13px' }}>Requires premed</Typography>}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default MedicalGeneralInfoCard;
