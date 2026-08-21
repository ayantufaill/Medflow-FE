import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
  TextField,
  CircularProgress,
  DialogActions
} from '@mui/material';
import {
  RadioButtonChecked as RadioIcon,
  CheckBox as CheckBoxIcon,
  ToggleOn as ToggleIcon,
  ShortText as TextIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import DeleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';
import EditSvg from '../../../../assets/practicesetupicon/editicon.svg';

import { communicationService } from '../../../../services/communication.service';

const TypePill = ({ icon: Icon, label, active, onClick }) => (
  <Box 
    onClick={onClick}
    sx={{ 
      display: 'inline-flex', alignItems: 'center', gap: 0.5, 
      border: '1px solid', borderColor: active ? '#3B82F6' : '#E5E9F2',
      borderRadius: 1.5, px: 1.5, py: 0.5, 
      bgcolor: active ? '#F0F5FF' : '#fff',
      cursor: 'pointer',
      color: active ? '#3B82F6' : '#64748b',
      transition: 'all 0.15s ease',
      '&:hover': { borderColor: '#3B82F6', color: '#3B82F6', bgcolor: '#F0F5FF' }
    }}>
    <Icon sx={{ fontSize: '1.1rem', color: 'inherit' }} />
    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'inherit' }}>{label}</Typography>
  </Box>
);

const QuestionnaireEditor = ({ open, mode, title, description, id, onClose }) => {
  const isSystem = mode === 'system';
  const [localTitle, setLocalTitle] = useState(title || 'Untitled Questionnaire');
  const [localDesc, setLocalDesc] = useState(description || 'Description goes here...');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState(null);
  
  const [questions, setQuestions] = useState([]);

  React.useEffect(() => {
    if (open) {
      if (id) {
        fetchQuestionnaire();
      } else {
        const initTitle = title || 'Untitled Questionnaire';
        const initDesc = description || 'Description goes here...';
        setLocalTitle(initTitle);
        setLocalDesc(initDesc);
        setQuestions([]);
        setInitialData({ title: initTitle, desc: initDesc, questions: [] });
      }
    }
  }, [open, id]);

  const fetchQuestionnaire = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getQuestionnaireById(id);
      const parsedDesc = data.description || 'Description goes here...';
      const parsedTitle = title;
      const parsedQuestions = data.questions?.map(q => ({
        text: q.name,
        type: q.type,
        options: q.choices || []
      })) || [];

      setLocalDesc(parsedDesc);
      setLocalTitle(parsedTitle);
      setQuestions(parsedQuestions);
      
      setInitialData({
        title: parsedTitle,
        desc: parsedDesc,
        questions: parsedQuestions
      });
    } catch (error) {
      console.error('Failed to fetch questionnaire details:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentData = {
    title: localTitle,
    desc: localDesc,
    questions: questions
  };

  const isDirty = initialData && JSON.stringify(initialData) !== JSON.stringify(currentData);

  const handlePublish = async () => {
    if (!isDirty) return;
    try {
      setSaving(true);
      const payload = {
        description: localTitle, 
        questions: questions.map(q => ({
          name: q.text,
          type: q.type || 'text',
          choices: q.options || []
        }))
      };

      if (id) {
        await communicationService.updateQuestionnaire(id, payload);
      } else {
        await communicationService.createQuestionnaire(payload);
      }
      setInitialData(currentData);
      onClose();
    } catch (error) {
      console.error('Failed to save questionnaire:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: null, allowSkip: false, disabled: false }]);
  };

  const updateQuestion = (idx, updates) => {
    const newQuestions = [...questions];
    newQuestions[idx] = { ...newQuestions[idx], ...updates };
    setQuestions(newQuestions);
  };

  const handleAddQuestionOfType = (type) => {
    setQuestions([...questions, { 
      text: '', 
      type, 
      allowSkip: false, 
      disabled: false, 
      options: (type === 'multiple' || type === 'checkbox') ? ['Option 1'] : [] 
    }]);
  };

  const deleteQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const renderQuestionOptions = (q, idx) => {
    if (q.type === 'multiple' || q.type === 'checkbox') {
      return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {q.options?.map((opt, optIdx) => (
            <Box key={optIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {q.type === 'multiple' ? <RadioIcon sx={{ color: '#cbd5e1', fontSize: '1.2rem' }} /> : <CheckBoxIcon sx={{ color: '#cbd5e1', fontSize: '1.2rem' }} />}
              <TextField 
                size="small"
                value={opt}
                onChange={(e) => {
                  const newOpts = [...q.options];
                  newOpts[optIdx] = e.target.value;
                  updateQuestion(idx, { options: newOpts });
                }}
                sx={{ flex: 1, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem' } }}
              />
              <IconButton size="small" onClick={() => {
                const newOpts = q.options.filter((_, i) => i !== optIdx);
                updateQuestion(idx, { options: newOpts });
              }}>
                <CloseIcon sx={{ fontSize: '1rem', color: '#94a3b8' }} />
              </IconButton>
            </Box>
          ))}
          <Button 
            size="small" 
            startIcon={<AddIcon />} 
            onClick={() => {
              const newOpts = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`];
              updateQuestion(idx, { options: newOpts });
            }}
            sx={{ textTransform: 'none', alignSelf: 'flex-start', color: '#3B82F6', mt: 0.5, fontWeight: 600 }}
          >
            Add Option
          </Button>
        </Box>
      );
    }
    if (q.type === 'yesno') {
      return (
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, border: '1px solid #E5E9F2', borderRadius: 1.5, bgcolor: '#F8FAFC' }}>
             <RadioIcon sx={{ color: '#cbd5e1', fontSize: '1.2rem' }}/> <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>Yes</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, border: '1px solid #E5E9F2', borderRadius: 1.5, bgcolor: '#F8FAFC' }}>
             <RadioIcon sx={{ color: '#cbd5e1', fontSize: '1.2rem' }}/> <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>No</Typography>
          </Box>
        </Box>
      );
    }
    if (q.type === 'short') {
      return (
        <Box sx={{ mt: 2 }}>
          <TextField 
            fullWidth 
            disabled 
            placeholder="Short answer text..." 
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F8FAFC', borderRadius: 1.5 } }} 
            size="small" 
          />
        </Box>
      );
    }
    return null;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        py: 2, 
        px: 3,
        bgcolor: '#F3F8FD',
        borderBottom: '1px solid #E5E9F2',
        m: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Icon badge */}
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px', backgroundColor: '#e2ebfc',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <AssignmentIcon sx={{ fontSize: '20px', color: '#2563EB' }} />
          </Box>
          <Box>
            <Typography sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 600, 
              fontSize: '16px', 
              lineHeight: '24px', 
              letterSpacing: '-0.4px', 
              color: '#111' 
            }}>
              {title ? `Edit Questionnaire` : 'Questionnaire Editor'}
            </Typography>
            {title && (
              <Typography sx={{ 
                fontFamily: 'Inter, sans-serif', 
                fontWeight: 400, 
                fontSize: '11.5px', 
                lineHeight: '17.25px', 
                color: '#6B7280' 
              }}>
                {title}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', ml: 1, '&:hover': { color: '#1E293B', bgcolor: '#F8FAFC' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flex: 1, overflow: 'hidden', bgcolor: '#ffffff' }}>
        
        {loading ? (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={50} sx={{ color: '#3B82F6' }} />
          </Box>
        ) : (
          <>
            {/* Left Column (Editor Area) */}
            <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', bgcolor: '#ffffff' }}>
              <Box sx={{ width: '100%', maxWidth: 700 }}>
            
            {/* Title Block */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E9F2', borderRadius: 2, mb: 4, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <Box sx={{ bgcolor: '#F0F5FF', color: '#1E293B', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E9F2' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  {isEditingTitle ? (
                    <TextField
                      value={localTitle}
                      onChange={(e) => setLocalTitle(e.target.value)}
                      onBlur={() => setIsEditingTitle(false)}
                      autoFocus
                      size="small"
                      sx={{ bgcolor: '#fff', borderRadius: 1, flex: 1, '& .MuiOutlinedInput-root': { height: 32 } }}
                    />
                  ) : (
                    <>
                      <Typography sx={{ fontWeight: 600 }}>{localTitle}</Typography>
                      <img src={EditSvg} alt="Edit" width="16" height="16" onClick={() => setIsEditingTitle(true)} style={{ cursor: 'pointer', marginLeft: '8px', opacity: 0.7 }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.7} />
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
                  {isEditingDesc ? (
                    <TextField
                      value={localDesc}
                      onChange={(e) => setLocalDesc(e.target.value)}
                      onBlur={() => setIsEditingDesc(false)}
                      autoFocus
                      size="small"
                      multiline
                      fullWidth
                      sx={{ bgcolor: '#F8FAFC' }}
                    />
                  ) : (
                    <>
                      <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>{localDesc}</Typography>
                      <img src={EditSvg} alt="Edit" width="14" height="14" onClick={() => setIsEditingDesc(true)} style={{ cursor: 'pointer', marginTop: '4px', opacity: 0.6 }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.6} />
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Questions List */}
            {questions.map((q, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Question {idx + 1}</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControlLabel 
                      control={<Checkbox size="small" checked={q.allowSkip || false} onChange={(e) => updateQuestion(idx, { allowSkip: e.target.checked })} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3B82F6' } }}/>} 
                      label={<Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Allow Skip</Typography>} sx={{ m: 0, gap: 0.5 }} 
                    />
                    <FormControlLabel 
                      control={<Checkbox size="small" checked={q.disabled || false} onChange={(e) => updateQuestion(idx, { disabled: e.target.checked })} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3B82F6' } }}/>} 
                      label={<Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Disabled</Typography>} sx={{ m: 0, gap: 0.5 }} 
                    />
                  </Box>
                </Box>
                
                <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E9F2', borderRadius: 2, p: 3, pt: 3, pb: 2, display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  
                  {!q.type ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                      <Typography sx={{ fontSize: '0.9rem', color: '#94a3b8', mb: 2 }}>Choose question type</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, maxWidth: 400 }}>
                        <TypePill icon={RadioIcon} label="Multiple Choice" onClick={() => updateQuestion(idx, { type: 'multiple', options: ['Option 1'] })} />
                        <TypePill icon={CheckBoxIcon} label="Checkboxes" onClick={() => updateQuestion(idx, { type: 'checkbox', options: ['Option 1'] })} />
                        <TypePill icon={ToggleIcon} label="Yes/No" onClick={() => updateQuestion(idx, { type: 'yesno' })} />
                        <TypePill icon={TextIcon} label="Short Answer" onClick={() => updateQuestion(idx, { type: 'short' })} />
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ width: '100%', mb: 2 }}>
                      <TextField 
                        fullWidth
                        size="small"
                        placeholder="Type your question here..."
                        value={q.text || ''}
                        onChange={(e) => updateQuestion(idx, { text: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.9rem', borderRadius: 1.5, '& fieldset': { borderColor: '#E5E9F2' } } }}
                      />
                      
                      {renderQuestionOptions(q, idx)}

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
                        {q.type === 'multiple' && <TypePill icon={RadioIcon} label="Multiple Choice" active />}
                        {q.type === 'checkbox' && <TypePill icon={CheckBoxIcon} label="Checkboxes" active />}
                        {q.type === 'yesno' && <TypePill icon={ToggleIcon} label="Yes/No" active />}
                        {q.type === 'short' && <TypePill icon={TextIcon} label="Short Answer" active />}
                        <Button size="small" onClick={() => updateQuestion(idx, { type: null })} sx={{ textTransform: 'none', color: '#64748b', ml: 1, '&:hover': { color: '#3B82F6', bgcolor: '#F0F5FF' } }}>Change Type</Button>
                      </Box>
                    </Box>
                  )}

                  <Divider sx={{ width: '100%', mt: 2, mb: 1, borderColor: '#F1F5F9' }} />
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton size="small" onClick={() => deleteQuestion(idx)}><img src={DeleteSvg} alt="Delete" width="18" height="18" /></IconButton>
                  </Box>
                </Box>
              </Box>
            ))}

            {/* Add Question Button */}
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={handleAddQuestion}
              sx={{ 
                borderStyle: 'dashed', borderColor: '#cbd5e1', color: '#64748b', 
                bgcolor: 'transparent', py: 2, textTransform: 'none', fontWeight: 600, borderRadius: 2,
                '&:hover': { bgcolor: '#F0F5FF', borderColor: '#3B82F6', color: '#3B82F6', borderStyle: 'dashed' } 
              }}
            >
              <AddIcon sx={{ fontSize: '1.2rem', mr: 1 }} /> Add New Question
            </Button>

          </Box>
        </Box>

        {/* Right Sidebar (Properties) */}
        <Box sx={{ width: 280, bgcolor: '#ffffff', borderLeft: '1px solid #E5E9F2', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #E5E9F2', bgcolor: '#ffffff' }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 700 }}>Question Elements</Typography>
          </Box>
          <Box sx={{ p: 2, borderBottom: '1px solid #E5E9F2' }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, mb: 2 }}>Question Types</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <TypePill icon={RadioIcon} label="Multiple Choice" onClick={() => handleAddQuestionOfType('multiple')} />
              <TypePill icon={CheckBoxIcon} label="Checkboxes" onClick={() => handleAddQuestionOfType('checkbox')} />
              <TypePill icon={ToggleIcon} label="Yes/No" onClick={() => handleAddQuestionOfType('yesno')} />
              <TypePill icon={TextIcon} label="Short Answer" onClick={() => handleAddQuestionOfType('short')} />
            </Box>
          </Box>
        </Box>
        </>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #E5E7EB',
          bgcolor: '#ffffff',
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '0.875rem',
            borderColor: '#D1D5DB',
            color: '#374151',
            borderRadius: '8px',
            px: 2.5,
            '&:hover': {
              borderColor: '#9CA3AF',
              backgroundColor: '#F9FAFB',
            },
          }}
        >
          Cancel
        </Button>
        <Button variant="outlined" sx={{ 
            textTransform: 'none',
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '0.875rem',
            borderColor: '#D1D5DB',
            color: '#374151',
            borderRadius: '8px',
            px: 2.5,
            '&:hover': {
              borderColor: '#9CA3AF',
              backgroundColor: '#F9FAFB',
            },
          }}>
          {isSystem ? 'Hide From Menu' : 'Show In Menu'}
        </Button>
        <Button 
          variant="contained" 
          onClick={handlePublish}
          disabled={loading || saving || !isDirty}
          sx={{
            textTransform: 'none',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '0.875rem',
            backgroundColor: '#2563EB',
            borderRadius: '8px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1d4ed8',
              boxShadow: 'none',
            },
          }}
        >
          {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : (isSystem ? 'Publish Again' : 'Publish')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionnaireEditor;
