import React, { useState } from 'react';
import { Box, Typography, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox, SettingInlineSelect } from './SharedSettings';

const ExamPageItems = () => {
  const [airwayExam, setAirwayExam] = useState('fairest');

  return (
    <PracticeSettingCard 
      title="Exam Page Items" 
      subtitle="Exam sections shown on the patient chart"
      icon={<AssignmentIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <SettingInlineSelect
          label="Use Google Speech To Text"
          options={[
            { value: 'model2', label: 'Model 2' },
            { value: 'model1', label: 'Model 1' },
          ]}
          defaultValue="model2"
        />

        <Box sx={{ mt: 1, mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Select which airway exam to display
          </Typography>
          <RadioGroup
            row
            value={airwayExam}
            onChange={(e) => setAirwayExam(e.target.value)}
          >
            <FormControlLabel
              value="fairest"
              control={<Radio size="small" />}
              label={<Typography variant="body2">FAIrEST 15</Typography>}
            />
            <FormControlLabel
              value="orofacial"
              control={<Radio size="small" />}
              label={<Typography variant="body2">Orofacial Airway Screener</Typography>}
            />
          </RadioGroup>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1 }}>
          <SettingCheckbox label="Create Progress Note From Mango AI Summary" info />
          <SettingCheckbox label="Generate progress notes for new exams without an existing progress note" defaultChecked />
          <SettingCheckbox label="Show Airway Exam" defaultChecked />
          <SettingCheckbox label="Show Clinical Exam for Pediatric Patients" />
          <SettingCheckbox label="Show Dentofacial Exam" defaultChecked />
          <SettingCheckbox label="Show Head & Neck Exam" defaultChecked />
          <SettingCheckbox label="Show Morphological Exam" defaultChecked />
          <SettingCheckbox label="Show Periodontal Exam" defaultChecked />
          <SettingCheckbox label="Show Radiographic Exam" defaultChecked />
          <SettingCheckbox label="Show TMJ Exam" defaultChecked />
          <SettingCheckbox label="Show Tooth Structure Exam" defaultChecked />
        </Box>
      </Box>
    </PracticeSettingCard>
  );
};

export default ExamPageItems;
