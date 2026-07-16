import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup, Grid } from '@mui/material';

const JointEvaluationSection = ({ formData, handleFieldChange, handleCheckboxChange, toggleJointCircle, summaryContent }) => {
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={6.5}>
        {summaryContent}
        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 1, color: '#333' }}>
          Joint Sounds Details
        </Typography>
        
        <Box sx={{ ml: 0.5 }}>
          {/* Negative Row */}
          <FormControlLabel 
            control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.jointSoundsNeg} onChange={(e) => handleCheckboxChange('jointSoundsNeg', e.target.checked)} />} 
            label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Negative</Typography>} 
          />

          {/* Crepitus Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
            <FormControlLabel 
              control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.crepitus} onChange={(e) => handleCheckboxChange('crepitus', e.target.checked)} />} 
              label={<Typography sx={{ fontSize: '0.8rem', color: '#333', minWidth: '70px' }}>Crepitus</Typography>} 
            />
            
            {/* Left Side Crepitus */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Left: Grade</Typography>
              <RadioGroup 
                row 
                value={formData.crepitusLeftGrade}
                onChange={(e) => handleFieldChange('crepitusLeftGrade', e.target.value)}
                sx={{ gap: 0.5 }}
              >
                {[1, 2, 3].map((v) => (
                  <FormControlLabel key={v} value={String(v)} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
                ))}
              </RadioGroup>
            </Box>

            {/* Right Side Crepitus */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Right: Grade</Typography>
              <RadioGroup 
                row 
                value={formData.crepitusRightGrade}
                onChange={(e) => handleFieldChange('crepitusRightGrade', e.target.value)}
                sx={{ gap: 0.5 }}
              >
                {[1, 2, 3].map((v) => (
                  <FormControlLabel key={v} value={String(v)} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
                ))}
              </RadioGroup>
            </Box>
          </Box>

          {/* Clicking Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <FormControlLabel 
              control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.clicking} onChange={(e) => handleCheckboxChange('clicking', e.target.checked)} />} 
              label={<Typography sx={{ fontSize: '0.8rem', color: '#333', minWidth: '70px' }}>Clicking</Typography>} 
            />
            
            {/* Left Side Clicking */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Left: Grade</Typography>
              <RadioGroup 
                row 
                value={formData.clickingLeftGrade}
                onChange={(e) => handleFieldChange('clickingLeftGrade', e.target.value)}
                sx={{ gap: 0.5 }}
              >
                {[1, 2, 3].map((v) => (
                  <FormControlLabel key={v} value={String(v)} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
                ))}
              </RadioGroup>
            </Box>

            {/* Right Side Clicking */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Right: Grade</Typography>
              <RadioGroup 
                row 
                value={formData.clickingRightGrade}
                onChange={(e) => handleFieldChange('clickingRightGrade', e.target.value)}
                sx={{ gap: 0.5 }}
              >
                {[1, 2, 3].map((v) => (
                  <FormControlLabel key={v} value={String(v)} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
                ))}
              </RadioGroup>
            </Box>
          </Box>

          {/* Clicking Child Checkboxes Row 1 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Box sx={{ minWidth: '70px' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.clickingLeftOpening} onChange={(e) => handleCheckboxChange('clickingLeftOpening', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.clickingLeftOpening ? '#333' : '#ccc' }}>Opening</Typography>} />
              <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px', ml: 1 }} checked={formData.clickingLeftClosing} onChange={(e) => handleCheckboxChange('clickingLeftClosing', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.clickingLeftClosing ? '#333' : '#ccc' }}>Closing</Typography>} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
              <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.clickingRightOpening} onChange={(e) => handleCheckboxChange('clickingRightOpening', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.clickingRightOpening ? '#333' : '#ccc' }}>Opening</Typography>} />
              <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px', ml: 1 }} checked={formData.clickingRightClosing} onChange={(e) => handleCheckboxChange('clickingRightClosing', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.clickingRightClosing ? '#333' : '#333' }}>Closing</Typography>} />
            </Box>
          </Box>

          {/* Clicking Child Checkboxes Row 2 - Reproducible */}
          <Box sx={{ display: 'flex', ml: 9, mt: 0.5 }}>
            <Box sx={{ display: 'flex', minWidth: '220px' }}>
              <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.reproducibleLeft} onChange={(e) => handleCheckboxChange('reproducibleLeft', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.reproducibleLeft ? '#333' : '#ccc' }}>Reproducible</Typography>} />
            </Box>
            <Box sx={{ display: 'flex', ml: 2 }}>
              <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} checked={formData.reproducibleRight} onChange={(e) => handleCheckboxChange('reproducibleRight', e.target.checked)} />} label={<Typography sx={{ fontSize: '0.75rem', color: formData.reproducibleRight ? '#333' : '#ccc' }}>Reproducible</Typography>} />
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Joint Images */}
      <Grid item xs={5.5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'inline-block', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Right Joint (Right Profile, facing right, labeled Right) */}
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <img src="/right_joint.png" alt="Right Joint" style={{ width: '240px', height: 'auto', border: '1px solid #eee', borderRadius: '4px' }} />
              <Box
                onClick={() => toggleJointCircle('right_joint')}
                sx={{
                  position: 'absolute',
                  left: '46%',
                  top: '34%',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: (formData.selectedJoints || []).includes('right_joint') ? '#ffff00' : 'transparent',
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              />
            </Box>

            {/* Left Joint (Left Profile, facing left, labeled Left) */}
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <img src="/left_joint.png" alt="Left Joint" style={{ width: '240px', height: 'auto', border: '1px solid #eee', borderRadius: '4px' }} />
              <Box
                onClick={() => toggleJointCircle('left_joint')}
                sx={{
                  position: 'absolute',
                  left: '54%',
                  top: '34%',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: (formData.selectedJoints || []).includes('left_joint') ? '#ffff00' : 'transparent',
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 0.5 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Right</Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Left</Typography>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: '#888', mt: 0.5 }}>
            select the joint
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default JointEvaluationSection;
