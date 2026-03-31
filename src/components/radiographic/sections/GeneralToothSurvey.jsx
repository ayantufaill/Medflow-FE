import React from "react";
import { Box, Card, Typography, Checkbox, FormControlLabel, Stack, Divider } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { fontSize, fontWeight } from "../../../constants/styles";
import SurveyButton from "../common/SurveyButton";
import NumberBox from "../common/NumberBox";
import SurveyRow from "../common/SurveyRow";

const GeneralToothSurvey = ({ expanded, onToggle }) => {
  // Static display data
  const staticData = {
    missingTeeth: [1, 2, 3, 12, 16, 17, 30],
  };

  return (
    <Card sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4', bgcolor: 'white' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.4, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>General Tooth Survey</Typography>
        <FormControlLabel
          control={<Checkbox size="small" sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
          label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
          labelPlacement="start"
          sx={{ ml: 0 }}
        />
      </Box>
      
      {expanded && (
        <Box sx={{ p: 1.5 }}>
          {/* Missing Teeth Section */}
          <SurveyRow label="Missing Teeth" hasChat>
            <Stack direction="row" spacing={1}>
              <SurveyButton label="EX" color="#f3e5ab" border="#d4af37" />
              <SurveyButton label="P" color="#e8f5e9" border="#81c784" />
              <SurveyButton label="B" color="#fce4ec" border="#f06292" />
              <SurveyButton label="F" color="#fffde7" border="#fff176" />
              <SurveyButton label="C" color="#e0f7fa" border="#4dd0e1" />
              <SurveyButton label="T" color="#e0f2f1" border="#80cbc4" />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              {staticData.missingTeeth.map(num => <NumberBox key={num} label={num} />)}
            </Stack>
          </SurveyRow>

          <Divider />

          {/* Eruption Section */}
          <SurveyRow label="Eruption">
            <Stack direction="row" spacing={1}>
              <SurveyButton label="U" />
              <SurveyButton label="PRI" width={40} />
              <SurveyButton label="PER" width={40} />
              <SurveyButton label="PE" color="#fffde7" />
              <SurveyButton label="EE" color="#d1c4e9" />
            </Stack>
            <SurveyButton label="OR" color="#efebe9" />
          </SurveyRow>

          <Divider />

          {/* Empty Rows */}
          <SurveyRow label="Implants" hasChat />
          <Divider />
          <SurveyRow label="Impaction" hasChat />
          <Divider />
          <SurveyRow label="Root Tips" />
          <Divider />

          {/* Bridge Section */}
          <SurveyRow label="Bridge">
            <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
              <NumberBox label="11 13" />
              <NumberBox label="11 13" />
              <NumberBox label="12" />
            </Stack>
          </SurveyRow>

          {/* Footer Expand Icon */}
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', mt: 1, cursor: 'pointer' }}
            onClick={onToggle}
          >
            <KeyboardDoubleArrowUpIcon 
              sx={{ 
                fontSize: 20, 
                color: '#666',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </Box>
        </Box>
      )}
      
      {!expanded && (
        <Box 
          sx={{ display: 'flex', justifyContent: 'center', p: 1, cursor: 'pointer', bgcolor: '#fafafa' }}
          onClick={onToggle}
        >
          <KeyboardDoubleArrowUpIcon 
            sx={{ 
              fontSize: 20, 
              color: '#666',
              transform: 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </Box>
      )}
    </Card>
  );
};

export default GeneralToothSurvey;
