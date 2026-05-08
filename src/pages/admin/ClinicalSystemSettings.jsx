import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  Button,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Grid,
} from '@mui/material';

const ClinicalSystemSettings = () => {
  const navigate = useNavigate();

  // State for all settings
  const [directions, setDirections] = useState({
    maxFacial: 'Left to right',
    maxPalatal: 'Right to left',
    manFacial: 'Left to right',
    manLingual: 'Right to left',
  });

  const [perio, setPerio] = useState({
    gingiva: 'One',
    recession: 'One',
    attachedGingiva: true,
    probingDepthLimit: '4',
  });

  const [progressNotes, setProgressNotes] = useState({
    showWarning: true,
    lockDays: '7',
  });

  const [treatmentPlan, setTreatmentPlan] = useState({
    defaultState: 'Diagnosed',
    hideFeeAndProvider: false,
  });

  const [pediatric, setPediatric] = useState({
    activateExam: true,
  });

  const [aiPrompt, setAiPrompt] = useState(
    `# ROLE\nYou are an AI clinical assistant specializing in summarizing dental patient encounters.\nYour primary function is to transform conversational transcripts into concise, structured clinical notes.\n\n# INPUT\nA JSON transcript of a conversation between a dentist and a patient.`
  );
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const handleDirectionChange = (key, value) => {
    setDirections((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          onClick={() => navigate('/admin/clinical-management')}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>
          System Settings
        </Typography>
      </Box>

      {/* Header Info */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
          System Settings
          <Typography component="span" sx={{ fontSize: '0.75rem', color: '#4a90e2', fontWeight: 400 }}>
            ("Right to left" means from the right of the page to the left of the page.)
          </Typography>
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#666', mt: 0.5 }}>
          Please note that changing the system settings will not affect the user custom settings (if ones were set).
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
          To update the periocharting order on a specific user, please click on the username at the bottom right of your screen.
        </Typography>
      </Box>

      {/* Direction Settings Section */}
      <Box sx={{ mb: 6, pl: 2 }}>
        <Grid container spacing={2} sx={{ maxWidth: 400 }}>
          {Object.entries(directions).map(([key, value]) => (
            <Grid size={12} key={key}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #e0e0e0', p: 1, borderRadius: 1 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', width: 100, fontWeight: 500 }}>
                  Name: {key}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#4a90e2' }}>Direction:</Typography>
                  <Select
                    value={value}
                    onChange={(e) => handleDirectionChange(key, e.target.value)}
                    size="small"
                    variant="standard"
                    sx={{ fontSize: '0.8rem', color: '#333', minWidth: 120, '&:before': { border: 'none' } }}
                  >
                    <MenuItem value="Left to right">Left to right</MenuItem>
                    <MenuItem value="Right to left">Right to left</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', maxWidth: 400 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#d9a36d',
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.8rem',
              px: 4,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#c28e5a', boxShadow: 'none' }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Perio Charting Section */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>
          Perio Charting
          <Typography component="span" sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 400, ml: 1 }}>
            Display one or three probing measurements for recession and Attached Gingiva on Facial and Lingual of each tooth
          </Typography>
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a90e2', minWidth: 60 }}>Gingiva</Typography>
              <RadioGroup row value={perio.gingiva} onChange={(e) => setPerio({ ...perio, gingiva: e.target.value })}>
                <FormControlLabel value="One" control={<Radio size="small" sx={{ color: '#999' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>One</Typography>} />
                <FormControlLabel value="Three" control={<Radio size="small" sx={{ color: '#999' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Three</Typography>} />
              </RadioGroup>
            </Box>
            <FormControlLabel
              control={<Checkbox size="small" checked={perio.attachedGingiva} onChange={(e) => setPerio({ ...perio, attachedGingiva: e.target.checked })} />}
              label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Perio Chart Attached Gingiva <Typography component="span" sx={{ color: '#666' }}>(add and display attached gingiva measurement on the perio chart)</Typography></Typography>}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a90e2', minWidth: 60 }}>Recession</Typography>
              <RadioGroup row value={perio.recession} onChange={(e) => setPerio({ ...perio, recession: e.target.value })}>
                <FormControlLabel value="One" control={<Radio size="small" sx={{ color: '#999' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>One</Typography>} />
                <FormControlLabel value="Three" control={<Radio size="small" sx={{ color: '#999' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Three</Typography>} />
              </RadioGroup>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b' }}>Probing Depth Limit</Typography>
            <Select
              value={perio.probingDepthLimit}
              onChange={(e) => setPerio({ ...perio, probingDepthLimit: e.target.value })}
              size="small"
              variant="standard"
              sx={{ fontSize: '0.8rem', '&:before': { border: 'none' } }}
            >
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="6">6</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Progress Notes Section */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>
          Progress Notes
        </Typography>
        <Box sx={{ pl: 2 }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={progressNotes.showWarning} onChange={(e) => setProgressNotes({ ...progressNotes, showWarning: e.target.checked })} />}
            label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Always show warning when creating a new progress note</Typography>}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Progress notes will be locked after</Typography>
            <TextField
              size="small"
              variant="standard"
              value={progressNotes.lockDays}
              onChange={(e) => setProgressNotes({ ...progressNotes, lockDays: e.target.value })}
              sx={{ width: 30, '& .MuiInputBase-input': { fontSize: '0.8rem', textAlign: 'center', py: 0 } }}
            />
            <Typography sx={{ fontSize: '0.8rem', color: '#333' }}>days from creation</Typography>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #999', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 0.5 }}>
              <Typography sx={{ fontSize: '0.6rem', color: '#999' }}>i</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Treatment Plan Section */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>
          Treatment Plan Procedures
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#4a90e2' }}>Default Procedure State on Treatment Plan</Typography>
            <RadioGroup row value={treatmentPlan.defaultState} onChange={(e) => setTreatmentPlan({ ...treatmentPlan, defaultState: e.target.value })}>
              <FormControlLabel value="Diagnosed" control={<Radio size="small" sx={{ color: '#999' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Diagnosed</Typography>} />
              <FormControlLabel value="Accepted" control={<Radio size="small" sx={{ color: '#999' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Accepted</Typography>} />
              <FormControlLabel value="Presented" control={<Radio size="small" sx={{ color: '#999' }} />} label={<Typography sx={{ fontSize: '0.8rem' }}>Presented</Typography>} />
            </RadioGroup>
          </Box>
          <FormControlLabel
            control={<Checkbox size="small" checked={treatmentPlan.hideFeeAndProvider} onChange={(e) => setTreatmentPlan({ ...treatmentPlan, hideFeeAndProvider: e.target.checked })} />}
            label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Hide Fee and Provider on Existing out Procedures</Typography>}
          />
        </Box>
      </Box>

      {/* Pediatric Exam Section */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>
          Pediatric Exam
        </Typography>
        <Box sx={{ pl: 2 }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={pediatric.activateExam} onChange={(e) => setPediatric({ ...pediatric, activateExam: e.target.checked })} />}
            label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Activate Pediatric Exam</Typography>}
          />
        </Box>
      </Box>

      {/* AI Settings Section */}
      <Box sx={{ mb: 6 }}>
        <Typography sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>
          AI Settings
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, color: '#333' }}>Exam Summary AI Prompt:</Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            InputProps={{
              readOnly: !isEditingPrompt,
            }}
            sx={{
              backgroundColor: isEditingPrompt ? '#fff' : '#f8f9fa',
              '& .MuiInputBase-input': { fontSize: '0.8rem', color: '#333', fontFamily: 'monospace' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: isEditingPrompt ? '#1a3a6b' : '#e0e0e0' }
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => setIsEditingPrompt(!isEditingPrompt)}
              sx={{
                backgroundColor: isEditingPrompt ? '#d9a36d' : '#1a3a6b',
                color: '#fff',
                textTransform: 'none',
                fontSize: '0.8rem',
                borderRadius: '4px',
                boxShadow: 'none',
                '&:hover': { backgroundColor: isEditingPrompt ? '#c28e5a' : '#142d54', boxShadow: 'none' }
              }}
            >
              {isEditingPrompt ? 'Save Prompt' : 'Edit Prompt'}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setAiPrompt(`# ROLE\nYou are an AI clinical assistant specializing in summarizing dental patient encounters.\nYour primary function is to transform conversational transcripts into concise, structured clinical notes.\n\n# INPUT\nA JSON transcript of a conversation between a dentist and a patient.`);
                setIsEditingPrompt(false);
              }}
              sx={{
                backgroundColor: '#1a3a6b',
                color: '#fff',
                textTransform: 'none',
                fontSize: '0.8rem',
                borderRadius: '4px',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#142d54', boxShadow: 'none' }
              }}
            >
              Reset Prompt
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClinicalSystemSettings;
