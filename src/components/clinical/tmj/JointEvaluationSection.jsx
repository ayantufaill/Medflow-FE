import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Grid, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';

const GradeToggle = ({ value, onChange }) => (
  <ToggleButtonGroup
    value={value}
    exclusive
    onChange={(e, val) => { if (val !== null) onChange(val); }}
    sx={{
      backgroundColor: '#f1f5f9',
      borderRadius: '6px',
      padding: '2px',
      height: '24px',
      '& .MuiToggleButton-root': {
        border: 'none',
        borderRadius: '4px !important',
        padding: '0 10px',
        textTransform: 'none',
        fontSize: '12px',
        fontWeight: 600,
        color: '#64748b',
        lineHeight: 1,
        minWidth: '32px',
        '&.Mui-selected': {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
        },
        '&:hover': {
          backgroundColor: 'transparent',
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
          }
        }
      }
    }}
  >
    {['1', '2', '3'].map((v) => (
      <ToggleButton key={v} value={v}>
        {v}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

const GradeCard = ({ title, gradeValue, onGradeChange, disabled, children }) => (
  <Box sx={{
    flex: 1,
    bgcolor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    p: 2,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto'
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>
        {title}
      </Typography>
      <GradeToggle value={gradeValue} onChange={onGradeChange} />
    </Box>
    {children}
  </Box>
);

const CustomCheckbox = ({ checked, onChange, label, disabled }) => (
  <FormControlLabel
    control={
      <Checkbox
        size="small"
        sx={{ p: '4px', '& .MuiSvgIcon-root': { fontSize: 18 } }}
        checked={checked || false}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
    }
    label={
      <Typography sx={{ fontSize: '13px', color: disabled ? '#94a3b8' : '#334155' }}>
        {label}
      </Typography>
    }
    sx={{ m: 0, mr: 2 }}
  />
);

const JointEvaluationSection = ({ formData, handleFieldChange, handleCheckboxChange, toggleJointCircle, summaryContent }) => {
  const isNegative = formData.jointSoundsNeg;

  return (
    <Box sx={{ display: 'flex', mt: 1 }}>
      {/* Left Panel - Forms */}
      <Box sx={{ flex: 1, pr: 4 }}>
        {summaryContent}

        <Box sx={{
          bgcolor: '#F0F4F9',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          p: 3
        }}>
          {/* Header Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Joint Sounds Detail
            </Typography>
            <CustomCheckbox
              checked={formData.jointSoundsNeg}
              onChange={(val) => handleCheckboxChange('jointSoundsNeg', val)}
              label="Negative (no sounds found)"
            />
          </Box>

          {/* Crepitus Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ mb: 1.5 }}>
              <CustomCheckbox
                checked={formData.crepitus}
                onChange={(val) => handleCheckboxChange('crepitus', val)}
                label="Crepitus"
                disabled={isNegative}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, pl: 3.5 }}>
              <GradeCard
                title="LEFT • GRADE"
                gradeValue={formData.crepitusLeftGrade}
                onGradeChange={(val) => handleFieldChange('crepitusLeftGrade', val)}
                disabled={isNegative || !formData.crepitus}
              >
                <CustomCheckbox
                  checked={formData.reproducibleLeft} // Note: Original code reused reproducibleLeft for crepitus? Wait, let's look at original. Original had reproducibleLeft/Right shared? Actually it seems clicking and crepitus had one reproducible in original code, wait, original had: "Clicking Child Checkboxes Row 2 - Reproducible". I'll use reproducibleLeft and reproducibleRight for now.
                  onChange={(val) => handleCheckboxChange('reproducibleLeft', val)}
                  label="Reproducible"
                />
              </GradeCard>

              <GradeCard
                title="RIGHT • GRADE"
                gradeValue={formData.crepitusRightGrade}
                onGradeChange={(val) => handleFieldChange('crepitusRightGrade', val)}
                disabled={isNegative || !formData.crepitus}
              >
                <CustomCheckbox
                  checked={formData.reproducibleRight}
                  onChange={(val) => handleCheckboxChange('reproducibleRight', val)}
                  label="Reproducible"
                />
              </GradeCard>
            </Box>
          </Box>

          {/* Clicking Section */}
          <Box>
            <Box sx={{ mb: 1.5 }}>
              <CustomCheckbox
                checked={formData.clicking}
                onChange={(val) => handleCheckboxChange('clicking', val)}
                label="Clicking"
                disabled={isNegative}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, pl: 3.5 }}>
              <GradeCard
                title="LEFT • GRADE"
                gradeValue={formData.clickingLeftGrade}
                onGradeChange={(val) => handleFieldChange('clickingLeftGrade', val)}
                disabled={isNegative || !formData.clicking}
              >
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <CustomCheckbox checked={formData.clickingLeftOpening} onChange={(val) => handleCheckboxChange('clickingLeftOpening', val)} label="Opening" />
                  <CustomCheckbox checked={formData.clickingLeftClosing} onChange={(val) => handleCheckboxChange('clickingLeftClosing', val)} label="Closing" />
                </Box>
                <CustomCheckbox checked={formData.reproducibleLeft} onChange={(val) => handleCheckboxChange('reproducibleLeft', val)} label="Reproducible" />
              </GradeCard>

              <GradeCard
                title="RIGHT • GRADE"
                gradeValue={formData.clickingRightGrade}
                onGradeChange={(val) => handleFieldChange('clickingRightGrade', val)}
                disabled={isNegative || !formData.clicking}
              >
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <CustomCheckbox checked={formData.clickingRightOpening} onChange={(val) => handleCheckboxChange('clickingRightOpening', val)} label="Opening" />
                  <CustomCheckbox checked={formData.clickingRightClosing} onChange={(val) => handleCheckboxChange('clickingRightClosing', val)} label="Closing" />
                </Box>
                <CustomCheckbox checked={formData.reproducibleRight} onChange={(val) => handleCheckboxChange('reproducibleRight', val)} label="Reproducible" />
              </GradeCard>
            </Box>
          </Box>

        </Box>
      </Box>

      {/* Vertical Divider */}
      <Divider orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0', borderRightWidth: '1.5px' }} />

      {/* Right Panel - Images */}
      <Box sx={{ width: '380px', pl: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', mb: 3 }}>
          Select the Joint
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', alignItems: 'center' }}>
          {/* Left Joint Image */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}>
            <Box sx={{
              position: 'relative',
              width: '100%',
              borderRadius: '12px',
              border: (formData.selectedJoints || []).includes('left_joint') ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: (formData.selectedJoints || []).includes('left_joint') ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
              onClick={() => toggleJointCircle('left_joint')}
            >
              <img src="/left_joint.png" alt="Left Joint" style={{ width: '100%', display: 'block' }} />
              {/* Overlay yellow circle if selected */}
              {(formData.selectedJoints || []).includes('left_joint') && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: '54%',
                    top: '34%',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid #eab308',
                    backgroundColor: 'rgba(250, 204, 21, 0.2)',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                />
              )}
            </Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', mt: 1, textTransform: 'uppercase' }}>
              Left Joint
            </Typography>
          </Box>

          {/* Right Joint Image */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}>
            <Box sx={{
              position: 'relative',
              width: '100%',
              borderRadius: '12px',
              border: (formData.selectedJoints || []).includes('right_joint') ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: (formData.selectedJoints || []).includes('right_joint') ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
              onClick={() => toggleJointCircle('right_joint')}
            >
              <img src="/right_joint.png" alt="Right Joint" style={{ width: '100%', display: 'block' }} />
              {/* Overlay yellow circle if selected */}
              {(formData.selectedJoints || []).includes('right_joint') && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: '46%',
                    top: '34%',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid #eab308',
                    backgroundColor: 'rgba(250, 204, 21, 0.2)',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                />
              )}
            </Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', mt: 1, textTransform: 'uppercase' }}>
              Right Joint
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: '#64748b', mt: 4, textAlign: 'center' }}>
          Interactive cross-section for condyle & disc pathology.
        </Typography>
      </Box>
    </Box>
  );
};

export default JointEvaluationSection;
