import { Box, Card, Typography, Checkbox, FormControlLabel, Stack, Divider } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { fontSize, fontWeight } from "../../../constants/styles";
import SurveyButton from "../common/SurveyButton";
import NumberBox from "../common/NumberBox";
import SurveyRow from "../common/SurveyRow";

const GeneralToothSurvey = ({ expanded, onToggle, missingTeeth = [], onMissingTeethClick, noFindings = false, onToggleNoFindings }) => {
  return (
    <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb', bgcolor: 'white', boxShadow: 'none', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#2563eb', color: 'white', px: 2, py: 1, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer'
      }} onClick={onToggle}>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>General Tooth Survey</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontSize: '0.75rem', color: '#e0e7ff', fontWeight: 500 }}>no findings</Typography>
          <Box
            onClick={(e) => { e.stopPropagation(); onToggleNoFindings?.(); }}
            sx={{
              width: 14, height: 14, borderRadius: '50%',
              border: '1.5px solid #e0e7ff',
              bgcolor: noFindings ? '#e0e7ff' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            {noFindings && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#fff' }} />}
          </Box>
        </Stack>
      </Box>
      
      {expanded && (
        <Box sx={{ p: 1.5, ...(noFindings && { opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }) }}>
          {/* Missing Teeth Section */}
          <SurveyRow label="Missing Teeth" hasChat onLabelClick={onMissingTeethClick}>
            <Stack direction="row" spacing={1}>
              <SurveyButton label="EX" color="#f3e5ab" border="#d4af37" onClick={onMissingTeethClick} />
              <SurveyButton label="P" color="#e8f5e9" border="#81c784" />
              <SurveyButton label="B" color="#fce4ec" border="#f06292" />
              <SurveyButton label="F" color="#fffde7" border="#fff176" />
              <SurveyButton label="C" color="#e0f7fa" border="#4dd0e1" />
              <SurveyButton label="T" color="#e0f2f1" border="#80cbc4" />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              {[...missingTeeth].sort((a, b) => a - b).map(num => <NumberBox key={num} label={num} />)}
            </Stack>
          </SurveyRow>

          <Divider />

          {/* Eruption Section */}
          <SurveyRow label="Eruption" disabled>
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
          <SurveyRow label="Implants" hasChat disabled />
          <Divider />
          <SurveyRow label="Impaction" hasChat disabled />
          <Divider />
          <SurveyRow label="Root Tips" disabled />
          <Divider />

          {/* Bridge Section */}
          <SurveyRow label="Bridge" disabled>
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
