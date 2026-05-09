import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  RadioButtonChecked as RadioIcon,
  CheckBox as CheckBoxIcon,
  ToggleOn as ToggleIcon,
  ShortText as TextIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const TypePill = ({ icon: Icon, label, disabled }) => (
  <Box sx={{ 
    display: 'inline-flex', alignItems: 'center', gap: 0.5, 
    border: '1px solid #e0e0e0', borderRadius: 5, px: 1.5, py: 0.5, 
    bgcolor: disabled ? '#f9f9f9' : '#fff', opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'default' : 'pointer'
  }}>
    <Icon sx={{ fontSize: '1rem', color: '#555' }} />
    <Typography sx={{ fontSize: '0.75rem', color: '#555', fontWeight: 600 }}>{label}</Typography>
  </Box>
);

const QuestionnaireEditor = ({ mode, title, onBack }) => {
  const isSystem = mode === 'system';
  const [questions, setQuestions] = useState(isSystem ? [
    { text: 'Are you fearful of dental treatment?' },
    { text: 'Have you had an unfavorable dental experience?' },
    { text: 'Have you ever had complications from past dental treatment?' },
    { text: 'Have you ever had trouble getting numb or had any reactions to local anesthetic?' },
    { text: 'Did you ever have braces, orthodontic treatment or had your bite adjusted, and at what age?' }
  ] : []);

  const handleAddQuestion = () => {
    if (!isSystem) {
      setQuestions([...questions, { text: '', isNew: true }]);
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f7fa', pb: 10 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 1.5, bgcolor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <Button variant="contained" onClick={onBack} sx={{ bgcolor: '#e0e0e0', color: '#333', textTransform: 'none', borderRadius: 5, boxShadow: 'none', '&:hover': { bgcolor: '#ccc', boxShadow: 'none' } }}>
          Back
        </Button>
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#222' }}>{title}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" sx={{ bgcolor: '#81c784', textTransform: 'none', borderRadius: 5, px: 3, '&:hover': { bgcolor: '#66bb6a' } }}>
            {isSystem ? 'Publish Again' : 'Publish'}
          </Button>
          <Button variant="contained" sx={{ bgcolor: isSystem ? '#e0e0e0' : '#1a3a6b', color: isSystem ? '#333' : '#fff', textTransform: 'none', borderRadius: 5, px: 3, boxShadow: 'none', '&:hover': { bgcolor: isSystem ? '#ccc' : '#15305a', boxShadow: 'none' } }}>
            {isSystem ? 'Hide From Menu' : 'Show In Menu'}
          </Button>
        </Box>
      </Box>

      {/* Main Layout */}
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        
        {/* Left Column (Editor Area) */}
        <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            
            {/* Title Block */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', mb: 4 }}>
              <Box sx={{ bgcolor: '#1a3a6b', color: '#fff', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
                  {!isSystem && <EditIcon sx={{ fontSize: '1rem', cursor: 'pointer' }} />}
                </Box>
                <Typography sx={{ fontSize: '0.7rem', opacity: 0.8 }}>6/254</Typography>
              </Box>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#555', fontSize: '0.85rem' }}>what is my health</Typography>
                  {!isSystem && <EditIcon sx={{ fontSize: '1rem', color: '#1976d2', cursor: 'pointer' }} />}
                </Box>
                <Typography sx={{ fontSize: '0.7rem', color: '#999' }}>15/500</Typography>
              </Box>
            </Box>

            {/* Questions List */}
            {questions.map((q, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, px: 0.5 }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>Question {idx + 1}</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {!isSystem && <FormControlLabel control={<Checkbox size="small" sx={{ p: 0 }}/>} label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Allow Skip</Typography>} sx={{ m: 0, gap: 0.5 }} />}
                    <FormControlLabel control={<Checkbox size="small" sx={{ p: 0 }}/>} label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Disabled</Typography>} sx={{ m: 0, gap: 0.5 }} />
                  </Box>
                </Box>
                
                {isSystem ? (
                  <Box sx={{ bgcolor: '#f9f9f9', border: '1px solid #eee', borderRadius: 1, p: 2 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#999' }}>{q.text}</Typography>
                  </Box>
                ) : (
                  <Box sx={{ bgcolor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 1, p: 3, pt: 4, pb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#777', mb: 2 }}>Choose question type</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, maxWidth: 350 }}>
                      <TypePill icon={RadioIcon} label="Multiple Choice" />
                      <TypePill icon={CheckBoxIcon} label="Checkboxes" />
                      <TypePill icon={ToggleIcon} label="Yes/No" />
                      <TypePill icon={TextIcon} label="Short Answer" />
                    </Box>
                    <Divider sx={{ width: '100%', mt: 4, mb: 1 }} />
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                      <IconButton size="small"><DeleteIcon sx={{ fontSize: '1.2rem', color: '#999' }} /></IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}

            {/* Add Question Button */}
            {!isSystem && (
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={handleAddQuestion}
                sx={{ 
                  borderStyle: 'dashed', borderColor: '#ccc', color: '#555', 
                  bgcolor: '#f9f9f9', py: 1.5, textTransform: 'none', 
                  '&:hover': { bgcolor: '#f0f0f0', borderStyle: 'dashed' } 
                }}
              >
                <AddIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#999' }} /> Add Question
              </Button>
            )}

          </Box>
        </Box>

        {/* Right Sidebar (Properties) */}
        <Box sx={{ width: 350, bgcolor: '#fff', borderLeft: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#777', fontWeight: 600 }}>Question Elements</Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#777', fontWeight: 600, mb: 2 }}>Question Types</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <TypePill icon={RadioIcon} label="Multiple Choice" disabled />
              <TypePill icon={CheckBoxIcon} label="Checkboxes" disabled />
              <TypePill icon={ToggleIcon} label="Yes/No" disabled />
              <TypePill icon={TextIcon} label="Short Answer" disabled />
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default QuestionnaireEditor;
