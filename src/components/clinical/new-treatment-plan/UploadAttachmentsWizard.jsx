import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  DeleteOutline as DeleteIcon,
  ErrorOutline as ErrorIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { appointmentService } from '../../../services/appointment.service';
import { clinicalNoteService } from '../../../services/clinical-note.service';
import { clinicalExamService } from '../../../services/clinical-exam.service';

const steps = ['Select Attachments', 'Review Attachments'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const getAppointmentId = (appointment) => appointment?.id || appointment?._id || '';
const getAppointmentDate = (appointment) => appointment?.appointmentDate || appointment?.startDate || appointment?.date || appointment?.createdAt;

const makeTextFile = (content, fileName) => (
  new File([content], fileName, { type: 'text/plain' })
);

export default function UploadAttachmentsWizard({ open, onClose, onSave, patientId }) {
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Images Tab State
  const [imageSource, setImageSource] = useState('external');

  // Narratives Tab State
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [narrativeText, setNarrativeText] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [clinicalNote, setClinicalNote] = useState(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // Perio Chart Tab State
  const [perioSource, setPerioSource] = useState('external');
  const [examDate, setExamDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [perioExams, setPerioExams] = useState([]);
  const [selectedPerioExam, setSelectedPerioExam] = useState('');

  // Staged Files (mocking selection)
  const [stagedFiles, setStagedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const selectedAppointmentRecord = appointments.find((appointment) => String(getAppointmentId(appointment)) === String(selectedAppointment));

  React.useEffect(() => {
    if (!open) return;
    setActiveStep(0);
    setTabValue(0);
    setImageSource('external');
    setSelectedAppointment('');
    setNarrativeText('');
    setClinicalNote(null);
    setPerioSource('external');
    setExamDate(dayjs().format('YYYY-MM-DD'));
    setSelectedPerioExam('');
    setStagedFiles([]);
    setErrorMessage('');
    setIsSaving(false);
  }, [open]);

  React.useEffect(() => {
    if (tabValue === 1 && patientId) {
      appointmentService.getPatientAppointments(patientId, 100)
        .then(appointments => {
          if (appointments && Array.isArray(appointments)) {
            setAppointments(appointments);
          }
        })
        .catch(err => console.error('Error fetching appointments:', err));
    }
  }, [tabValue, patientId]);

  React.useEffect(() => {
    if (selectedAppointment) {
      setIsLoadingNotes(true);
      setClinicalNote(null);
      clinicalNoteService.getClinicalNoteByAppointment(selectedAppointment)
        .then(note => {
          setClinicalNote(note);
        })
        .catch(err => console.error('Error fetching clinical note:', err))
        .finally(() => setIsLoadingNotes(false));
    } else {
      setClinicalNote(null);
    }
  }, [selectedAppointment]);

  React.useEffect(() => {
    if (tabValue === 2 && patientId) {
      clinicalExamService.getExamHistoryDates('periodontal', patientId)
        .then(dates => {
          if (dates && Array.isArray(dates)) {
            setPerioExams(dates);
          }
        })
        .catch(err => console.error('Error fetching perio exams:', err));
    }
  }, [tabValue, patientId]);

  const buildReviewItems = () => {
    const reviewItems = [...stagedFiles];

    if (clinicalNote) {
      const noteText = clinicalNote.text || clinicalNote.content || clinicalNote.note || '';
      if (noteText.trim()) {
        const noteDate = getAppointmentDate(selectedAppointmentRecord) || new Date();
        reviewItems.push({
          id: `narrative-${clinicalNote._id || clinicalNote.id || selectedAppointment || Date.now()}`,
          name: `Narrative - ${dayjs(noteDate).format('MMM D, YYYY')}.txt`,
          type: 'Narrative',
          file: makeTextFile(noteText, `narrative-${dayjs(noteDate).format('YYYY-MM-DD')}.txt`),
          source: 'clinical-note'
        });
      }
    }

    if (narrativeText.trim()) {
      reviewItems.push({
        id: 'narrative-custom',
        name: 'Custom Narrative.txt',
        type: 'Narrative',
        file: makeTextFile(narrativeText.trim(), 'custom-narrative.txt'),
        source: 'custom-narrative'
      });
    }

    if (perioSource === 'system' && selectedPerioExam) {
      const perioDate = selectedPerioExam?.date || selectedPerioExam;
      const perioText = JSON.stringify(selectedPerioExam, null, 2);
      reviewItems.push({
        id: `perio-${perioDate}`,
        name: `Perio Chart - ${dayjs(perioDate).format('MMM D, YYYY')}.txt`,
        type: 'Perio Chart',
        file: makeTextFile(perioText, `perio-chart-${dayjs(perioDate).format('YYYY-MM-DD')}.txt`),
        source: 'system-perio'
      });
    }

    return reviewItems;
  };

  const handleNext = async () => {
    setErrorMessage('');
    if (activeStep === 0) {
      setActiveStep(1);
    } else {
      const finalFiles = buildReviewItems();
      if (!finalFiles.length) {
        setErrorMessage('Select at least one attachment before submitting.');
        return;
      }

      try {
        setIsSaving(true);
        await onSave(finalFiles);
        onClose();
      } catch (error) {
        setErrorMessage(error?.message || 'Failed to upload attachments. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    } else {
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
    e.target.value = null;
  };

  const handleDropFiles = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handlePasteFiles = (e) => {
    const items = e.clipboardData.items;
    const files = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        files.push(items[i].getAsFile());
      }
    }
    if (files.length > 0) addFiles(files);
  };

  const addFiles = (files) => {
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`${file.name} is larger than 10 MB.`);
        return false;
      }
      if ((tabValue === 0 || tabValue === 2) && !IMAGE_TYPES.includes(file.type)) {
        setErrorMessage(`${file.name} must be a JPG, JPEG, or PNG file.`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      type: tabValue === 0 ? 'Image' : tabValue === 2 ? 'Perio Chart' : 'Other'
    }));
    setStagedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
  };

  const removeReviewItem = (file) => {
    if (file.source === 'custom-narrative') {
      setNarrativeText('');
      return;
    }
    if (file.source === 'clinical-note') {
      setClinicalNote(null);
      setSelectedAppointment('');
      return;
    }
    if (file.source === 'system-perio') {
      setSelectedPerioExam('');
      return;
    }
    removeFile(file.id);
  };

  const renderDropZone = (type) => {
    const currentFiles = stagedFiles.filter(f => f.type === type);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box
            tabIndex={0}
            onPaste={handlePasteFiles}
            onDrop={handleDropFiles}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              flex: 1,
              border: '1px dashed #cbd5e1',
              borderRadius: '4px',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              px: 2,
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: '#fafafa',
              '&:hover': { backgroundColor: '#f1f5f9' }
            }}
          >
            <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#1e293b', mb: 1 }}>
              Drag and drop, <span style={{ textDecoration: 'underline' }}>Scan</span>, or <span style={{ textDecoration: 'underline' }}>Upload</span>
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#64748b' }}>
              You can drag & drop files here or paste clippings, 10 MB maximum file size.
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#64748b' }}>
              File type should be jpg, jpeg, or png.
            </Typography>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple accept={type === 'Other' ? undefined : '.jpg,.jpeg,.png,image/jpeg,image/png'} onChange={handleFileChange} />
          </Box>

          <Box sx={{ width: '300px' }}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#0f172a', mb: 1 }}>
              Instructions
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '13px', fontFamily: 'Inter', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Open the external image you want to use as an attachment.</li>
              <li>Press Windows + Shift + S and drag a selection box on the desired area.</li>
              <li>Paste your clipping (Ctrl + V) into the provided pasting area.</li>
            </ul>
          </Box>
        </Box>

        {currentFiles.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#0f172a', mb: 1 }}>
              Selected {type}s
            </Typography>
            <List dense sx={{ bgcolor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
              {currentFiles.map(file => (
                <ListItem key={file.id} secondaryAction={
                  <IconButton edge="end" size="small" onClick={() => removeFile(file.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }>
                  <ListItemText primary={file.name} primaryTypographyProps={{ fontFamily: 'Inter', fontSize: '13px' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      sx={{ zIndex: 1700 }}
      PaperProps={{
        sx: {
          height: '80vh',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: '12px 16px',
          gap: '8px',
          borderBottom: '1px solid #d8dee8',
          backgroundColor: '#eff4fa',
          m: 0,
          flexShrink: 0,
        }}
      >
        <CloudUploadIcon sx={{ fontSize: '20px', color: '#2563eb' }} />
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#0f172a',
            flex: 1,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Upload Attachments
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#64748b' }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ width: '100%', py: 3, px: 8, display: 'flex', justifyContent: 'center' }}>
          <Stepper activeStep={activeStep} sx={{ width: '60%' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: '1px solid #e2e8f0', px: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(e, v) => setTabValue(v)}
                sx={{
                  minHeight: 48,
                  '& .MuiTabs-indicator': { backgroundColor: '#2563eb', height: '2px' },
                  '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontFamily: 'Inter', minHeight: 48, fontSize: '14px', color: '#64748b' },
                  '& .Mui-selected': { color: '#2563eb !important' }
                }}
              >
                <Tab label="Images" />
                <Tab label="Narratives" />
                <Tab label="Perio Chart" />
                <Tab label="Other" />
              </Tabs>
            </Box>

            <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
              {/* Images Tab */}
              {tabValue === 0 && (
                <Box>
                  <RadioGroup row value={imageSource} onChange={(e) => setImageSource(e.target.value)} sx={{ mb: 2 }}>
                    <FormControlLabel value="system" control={<Radio size="small" />} label={<Typography sx={{ fontFamily: 'Inter', fontSize: '14px' }}>Select Image</Typography>} />
                    <FormControlLabel value="external" control={<Radio size="small" />} label={<Typography sx={{ fontFamily: 'Inter', fontSize: '14px' }}>Select External Image</Typography>} />
                  </RadioGroup>

                  {imageSource === 'external' ? renderDropZone('Image') : (
                    <Box sx={{ p: 4, textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                      <Typography sx={{ color: '#64748b', fontFamily: 'Inter' }}>System images would load here...</Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Narratives Tab */}
              {tabValue === 1 && (
                <Box sx={{ display: 'flex', gap: 4, height: '100%' }}>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '13px', color: '#0f172a', mb: 1 }}>Appointment Notes</Typography>
                    <Select size="small" fullWidth value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)} displayEmpty sx={{ mb: 4 }} MenuProps={{ sx: { zIndex: 1800 } }}>
                      <MenuItem value="">Select appointment...</MenuItem>
                      {Array.from(new Map(appointments.map(app => [app.id || app._id, app])).values()).map(app => {
                        const dateStr = app.appointmentDate || app.startDate || app.date || app.createdAt;
                        const rawTime = app.startTime || app.appointmentTime || app.start_time || app.time;
                        let timeStr = '';
                        if (rawTime) {
                          timeStr = rawTime.includes('T') ? rawTime : `2000-01-01T${rawTime.padStart(5, '0')}`;
                        } else {
                          timeStr = dateStr;
                        }

                        return (
                          <MenuItem key={getAppointmentId(app)} value={getAppointmentId(app)}>
                            {dateStr ? dayjs(dateStr).format('ddd, MMM D, YYYY') : 'Unknown Date'} {timeStr ? dayjs(timeStr).format('h:mm A') : ''}
                          </MenuItem>
                        );
                      })}
                    </Select>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, border: '1px solid #e2e8f0', borderRadius: '4px', bgcolor: '#f8fafc', overflowY: 'auto' }}>
                      {isLoadingNotes ? (
                        <Typography sx={{ fontFamily: 'Inter', color: '#64748b', fontSize: '14px' }}>Loading notes...</Typography>
                      ) : clinicalNote ? (
                        <Typography sx={{ fontFamily: 'Inter', color: '#334155', fontSize: '14px', whiteSpace: 'pre-wrap', width: '100%' }}>
                          {clinicalNote.text || clinicalNote.content || 'Note is empty.'}
                        </Typography>
                      ) : (
                        <>
                          <ErrorIcon sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }} />
                          <Typography sx={{ fontFamily: 'Inter', color: '#475569', fontSize: '14px' }}>No clinical notes available</Typography>
                        </>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '13px', color: '#0f172a', mb: 1 }}>Add a Narrative</Typography>
                    <TextField
                      multiline
                      rows={12}
                      fullWidth
                      placeholder="Add a narrative..."
                      value={narrativeText}
                      onChange={(e) => setNarrativeText(e.target.value)}
                      sx={{ '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '14px' } }}
                    />
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#64748b', textAlign: 'right', mt: 1 }}>
                      {narrativeText.length}/2000 characters
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Perio Chart Tab */}
              {tabValue === 2 && (
                <Box>
                  <RadioGroup row value={perioSource} onChange={(e) => setPerioSource(e.target.value)} sx={{ mb: 2 }}>
                    <FormControlLabel value="system" control={<Radio size="small" />} label={<Typography sx={{ fontFamily: 'Inter', fontSize: '14px' }}>Select Perio</Typography>} />
                    <FormControlLabel value="external" control={<Radio size="small" />} label={<Typography sx={{ fontFamily: 'Inter', fontSize: '14px' }}>Select External Exam</Typography>} />
                  </RadioGroup>

                  {perioSource === 'external' ? (
                    <Box>
                      <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '13px', color: '#ef4444', mb: 1 }}>Date of Exam *</Typography>
                      <TextField type="date" size="small" value={examDate} onChange={(e) => setExamDate(e.target.value)} sx={{ mb: 3 }} />
                      {renderDropZone('Perio Chart')}
                    </Box>
                  ) : (
                    <Box>
                      <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '13px', color: '#0f172a', mb: 1 }}>Select System Perio Chart</Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={selectedPerioExam}
                        onChange={(e) => setSelectedPerioExam(e.target.value)}
                        displayEmpty
                        sx={{ mb: 4 }}
                        MenuProps={{ sx: { zIndex: 1800 } }}
                      >
                        <MenuItem value="">Select exam...</MenuItem>
                        {perioExams.map((exam, index) => (
                          <MenuItem key={index} value={exam.date || exam}>
                            {dayjs(exam.date || exam).format('ddd, MMM D, YYYY')}
                          </MenuItem>
                        ))}
                      </Select>

                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, border: '1px solid #e2e8f0', borderRadius: '4px', bgcolor: '#f8fafc' }}>
                        {selectedPerioExam ? (
                          <Typography sx={{ fontFamily: 'Inter', color: '#10b981', fontSize: '14px', fontWeight: 500 }}>
                            Perio chart from {dayjs(selectedPerioExam).format('MMM D, YYYY')} selected for attachment.
                          </Typography>
                        ) : (
                          <Typography sx={{ fontFamily: 'Inter', color: '#64748b', fontSize: '14px' }}>Please select a perio chart to attach.</Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Other Tab */}
              {tabValue === 3 && (
                <Box>
                  {renderDropZone('Other')}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', mb: 2 }}>Uploaded Attachments</Typography>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
            )}
            {buildReviewItems().length === 0 ? (
              <Typography sx={{ color: '#64748b', fontFamily: 'Inter' }}>No attachments selected yet.</Typography>
            ) : (
              <List>
                {buildReviewItems().map((file) => (
                  <Paper variant="outlined" key={file.id} sx={{ mb: 1, borderRadius: '8px' }}>
                    <ListItem>
                      <ListItemText primary={file.name} secondary={file.type} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => removeReviewItem(file)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0', gap: 1 }}>
        <Button 
          onClick={handleBack} 
          disabled={isSaving} 
          variant="outlined"
          size="small"
          sx={{
            color: '#64748b',
            borderColor: '#cbd5e1',
            borderRadius: '8px',
            '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
            textTransform: 'none',
            px: 2,
            fontWeight: 600,
          }}
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={isSaving} 
          variant="contained" 
          size="small"
          sx={{
            bgcolor: '#2563eb',
            color: '#fff',
            textTransform: 'none',
            boxShadow: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            px: 2,
            '&:hover': { bgcolor: '#1565c0' },
            '&.Mui-disabled': {
              bgcolor: '#cbd5e1',
              color: '#fff',
            },
          }}
        >
          {isSaving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : activeStep === 0 ? 'Review' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
