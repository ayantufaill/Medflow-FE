import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup, Grid, TextField, Divider } from '@mui/material';

const MuscleEvaluationSection = ({ formData, handleFieldChange, handleCheckboxChange, toggleMuscleCircle, summaryContent }) => {
  return (
    <Grid container spacing={0} sx={{ mt: 1 }}>
      {/* LEFT FORM COLUMN */}
      <Grid item xs={9} sx={{ pr: 3 }}>
        {summaryContent}

        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 2, pt: 2.5, backgroundColor: '#f8fafc', mb: 3 }}>
          {/* Row 1: Temporalis / Masseter Only */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>TEMPORALIS / MASSETER ONLY</Typography>
            <RadioGroup row value={formData.temporalisMasseter} onChange={(e) => handleFieldChange('temporalisMasseter', e.target.value)} sx={{ gap: 2 }}>
              <FormControlLabel value="asymp" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '13px', color: '#0f172a' }}>Asymptomatic</Typography>} />
              <FormControlLabel value="symp" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '13px', color: '#0f172a' }}>Symptomatic</Typography>} />
            </RadioGroup>
          </Box>

          {/* Row 2: Frequency & Duration */}
          <Box sx={{ display: 'flex', mb: 2, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 1 }}>FREQUENCY</Typography>
              <TextField variant="standard" placeholder="e.g. 3x / week" value={formData.frequency} onChange={(e) => handleFieldChange('frequency', e.target.value)} sx={{ width: '100%', '& .MuiInput-root:before': { borderBottom: '1px solid #e2e8f0' } }} InputProps={{ disableUnderline: false, sx: { fontSize: '13px', color: '#94a3b8', py: 0.5 } }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 1 }}>DURATION</Typography>
              <TextField variant="standard" placeholder="e.g. 2 hrs" value={formData.durationInput || formData.duration} onChange={(e) => handleFieldChange('duration', e.target.value)} sx={{ width: '100%', '& .MuiInput-root:before': { borderBottom: '1px solid #e2e8f0' } }} InputProps={{ disableUnderline: false, sx: { fontSize: '13px', color: '#94a3b8', py: 0.5 } }} />
            </Box>
          </Box>

          {/* Row 3: Timing & Trigger */}
          <Box sx={{ display: 'flex', mb: 1, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 1 }}>TIMING</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RadioGroup row value={formData.timing} onChange={(e) => handleFieldChange('timing', e.target.value)} sx={{ gap: 1 }}>
                  <FormControlLabel value="am" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px', color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '13px', color: '#0f172a' }}>AM</Typography>} />
                  <FormControlLabel value="pm" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px', color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '13px', color: '#0f172a' }}>PM</Typography>} />
                </RadioGroup>
                <TextField variant="standard" placeholder="Other" value={formData.timingCustom} onChange={(e) => handleFieldChange('timingCustom', e.target.value)} sx={{ width: '100px', ml: 2, '& .MuiInput-root:before': { borderBottom: '1px solid #e2e8f0' } }} InputProps={{ disableUnderline: false, sx: { fontSize: '13px', color: '#94a3b8', py: 0.5 } }} />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 1 }}>TRIGGER</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, p: '4px', color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} checked={formData.triggerChewing} onChange={(e) => handleCheckboxChange('triggerChewing', e.target.checked)} />} label={<Typography sx={{ fontSize: '13px', color: '#0f172a' }}>Chewing</Typography>} sx={{ mr: 3 }} />
                <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, p: '4px', color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} checked={formData.triggerConstant} onChange={(e) => handleCheckboxChange('triggerConstant', e.target.checked)} />} label={<Typography sx={{ fontSize: '13px', color: '#0f172a' }}>Constant</Typography>} />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: '#e2e8f0' }} />

          {/* Row 4: Intensity */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', width: 170 }}>INTENSITY / PAIN LEVEL</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {['1', '2', '3', '4', '5'].map((v) => (
                <Box key={v} onClick={() => handleFieldChange('intensity', v)} sx={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: formData.intensity === v ? '#3b82f6' : '#fff', color: formData.intensity === v ? '#fff' : '#64748b', fontSize: '12px', fontWeight: 600 }}>
                  {v}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Row 5: Palpation */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, p: '4px', color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} checked={formData.painOnPalpation} onChange={(e) => handleCheckboxChange('painOnPalpation', e.target.checked)} />} label={<Typography sx={{ fontSize: '13px', color: '#334155', whiteSpace: 'nowrap' }}>Pain on muscle palpation</Typography>} sx={{ m: 0 }} />
            <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, p: '4px', color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} checked={formData.reproducible} onChange={(e) => handleCheckboxChange('reproducible', e.target.checked)} />} label={<Typography sx={{ fontSize: '13px', color: '#334155', whiteSpace: 'nowrap' }}>Reproducible</Typography>} sx={{ m: 0 }} />
            <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, p: '4px', color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} checked={formData.rigidity} onChange={(e) => handleCheckboxChange('rigidity', e.target.checked)} />} label={<Typography sx={{ fontSize: '13px', color: '#334155', whiteSpace: 'nowrap' }}>Rigidity of jaw on manipulation</Typography>} sx={{ m: 0 }} />
          </Box>
        </Box>

        {/* Possible Concerns Cards */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Reflex Splinting */}
          <Box sx={{ flex: 1, backgroundColor: '#fff1f2', border: '1px solid #ffe4e6', borderRadius: '8px', p: 2 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#e11d48', fontStyle: 'italic', mb: 1.5, letterSpacing: '0.5px' }}>POSSIBLE CONCERN - REFLEX SPLINTING</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#e11d48', mr: 1.5 }} />
              <Typography sx={{ fontSize: '12px', color: '#475569' }}>Pain on muscle palpation</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#e11d48', mr: 1.5 }} />
              <Typography sx={{ fontSize: '12px', color: '#475569' }}>Rigidity of jaw on manipulation</Typography>
            </Box>
          </Box>

          {/* Myofascial Pain */}
          <Box sx={{ flex: 1, backgroundColor: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', p: 2 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#b45309', fontStyle: 'italic', mb: 1.5, letterSpacing: '0.5px' }}>POSSIBLE CONCERN - MYOFASCIAL PAIN</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#b45309', mr: 1.5 }} />
              <Typography sx={{ fontSize: '12px', color: '#475569' }}>Pain on muscle palpation</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#b45309', mr: 1.5, mt: 0.7 }} />
              <Typography sx={{ fontSize: '12px', color: '#475569' }}>Pain referred reproducibly on palpation of trigger points</Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* RIGHT DIAGRAM COLUMN */}
      <Grid item xs={3} sx={{ borderLeft: '1px solid #e2e8f0', pl: 3 }}>
        <Box sx={{ pt: 0, height: '100%', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 2 }}>SELECT THE MUSCLE</Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: '160px',
                height: '160px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img src="/right_muscle.png" alt="Right Muscle" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                {/* Spots */}
                <Box onClick={() => toggleMuscleCircle('right_temporalis')} sx={{ position: 'absolute', left: '46.5%', top: '49.3%', width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #eab308', cursor: 'pointer', transform: 'translate(-50%, -50%)', zIndex: 10, backgroundColor: (formData.selectedMuscles || []).includes('right_temporalis') ? 'rgba(234, 179, 8, 0.4)' : 'transparent' }} />
                <Box onClick={() => toggleMuscleCircle('right_masseter')} sx={{ position: 'absolute', left: '43.4%', top: '72.4%', width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #eab308', cursor: 'pointer', transform: 'translate(-50%, -50%)', zIndex: 10, backgroundColor: (formData.selectedMuscles || []).includes('right_masseter') ? 'rgba(234, 179, 8, 0.4)' : 'transparent' }} />
              </Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#64748b', mt: 1 }}>RIGHT</Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: '160px',
                height: '160px',
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img src="/left_muscle.png" alt="Left Muscle" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                {/* Spots */}
                <Box onClick={() => toggleMuscleCircle('left_temporalis')} sx={{ position: 'absolute', left: '45.8%', top: '47.2%', width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #eab308', cursor: 'pointer', transform: 'translate(-50%, -50%)', zIndex: 10, backgroundColor: (formData.selectedMuscles || []).includes('left_temporalis') ? 'rgba(234, 179, 8, 0.4)' : 'transparent' }} />
                <Box onClick={() => toggleMuscleCircle('left_masseter')} sx={{ position: 'absolute', left: '48.6%', top: '71.0%', width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #eab308', cursor: 'pointer', transform: 'translate(-50%, -50%)', zIndex: 10, backgroundColor: (formData.selectedMuscles || []).includes('left_masseter') ? 'rgba(234, 179, 8, 0.4)' : 'transparent' }} />
              </Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#64748b', mt: 1 }}>LEFT</Typography>
            </Box>
          </Box>

          <Typography sx={{ fontSize: '11px', color: '#64748b', textAlign: 'center', mb: 3 }}>
            Click a plate to attribute findings to the left side.
          </Typography>

          <Box sx={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', p: 1.5, px: 2, display: 'inline-flex', alignItems: 'center', width: 'max-content', margin: '0 auto' }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', mr: 1, flexShrink: 0 }}>i</Box>
            <Typography sx={{ fontSize: '11px', color: '#475569', lineHeight: 1.4, whiteSpace: 'nowrap' }}>Yellow markers indicate palpation trigger points.</Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MuscleEvaluationSection;
