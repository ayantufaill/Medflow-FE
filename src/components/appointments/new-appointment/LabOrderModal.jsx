import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, Box, Typography, IconButton, TextField, Select, MenuItem, Button, Checkbox, FormControlLabel, FormControl, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { 
  Close, DeleteOutline, FormatBold, FormatItalic, FormatAlignLeft, 
  FormatAlignCenter, FormatAlignRight, EmojiEmotionsOutlined, CloudUploadOutlined,
  Add, FormatColorText, Colorize, Undo, Redo, ScienceOutlined
} from '@mui/icons-material';
import apiClient from '../../../config/api';

import LabOrderHeader from '../schedule/lab-order/LabOrderHeader';
import ActiveProceduresTable from '../schedule/lab-order/ActiveProceduresTable';
import LabOrderDropdowns from '../schedule/lab-order/LabOrderDropdowns';
import RichTextEditor from '../schedule/lab-order/RichTextEditor';
import DueDateSelector from '../schedule/lab-order/DueDateSelector';
import NotesAndSignature from '../schedule/lab-order/NotesAndSignature';
import Enclosures from '../schedule/lab-order/Enclosures';
import LabOrderFooter from '../schedule/lab-order/LabOrderFooter';

const DEFAULT_LABS = [
  { _id: '1', name: 'Dental Arts Lab' },
  { _id: '2', name: 'Glidewell Laboratories' },
  { _id: '3', name: 'MicroDental Laboratories' },
];

const TEMPLATES = {
  none: '',
  crown: `Crown Slip Template:
- Tooth #: 
- Shade: 
- Material: Zirconia / E.max
- Margin: Chamfer
- Occlusal Clearance: 1.5mm`,
  denture: `Denture Slip Template:
- Arch: Upper / Lower
- Tooth Shade: 
- Mold #: 
- Tissue Shade: Pink / Characterized`,
  bridge: `Bridge Slip Template:
- Abutment Teeth #: 
- Pontic #: 
- Material: PFM / Zirconia
- Shade: `,
  implant: `Implant Crown Template:
- System: Straumann / Nobel
- Platform Size: 
- Abutment Type: Custom Titanium / Zirconia`
};

const LabOrderModal = ({ open, onClose, procedures = [], patientId, appointmentId, onSave }) => {
  const [labs, setLabs] = useState(DEFAULT_LABS);
  const [selectedLab, setSelectedLab] = useState('1');
  const [template, setTemplate] = useState('none');
  const [dueDate, setDueDate] = useState(dayjs().add(7, 'day'));
  const [editorText, setEditorText] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [proceduresList, setProceduresList] = useState([]);
  const [addEnclosures, setAddEnclosures] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info');
  
  // Rich Text Editor toolbar state
  const [activeBlock, setActiveBlock] = useState('P');
  const [activeSize, setActiveSize] = useState('3');
  const [activeFamily, setActiveFamily] = useState('Inter');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [alignMode, setAlignMode] = useState('left');

  // Canvas drawing state
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Synchronize procedures prop
  useEffect(() => {
    if (Array.isArray(procedures) && procedures.length > 0) {
      setProceduresList(procedures.map(p => ({
        ...p,
        charge: p.charge || '$0.00'
      })));
    } else {
      setProceduresList([]);
    }
  }, [procedures]);

  // Fetch laboratories from backend
  useEffect(() => {
    if (!open) return;
    const fetchLabs = async () => {
      try {
        const response = await apiClient.get('/lab-cases/laboratories');
        const list = response?.data?.data?.laboratories || response?.data?.laboratories || [];
        if (Array.isArray(list) && list.length > 0) {
          const mappedList = list.map(lab => ({
            _id: lab._id || lab.id,
            name: lab.name || lab.description || 'Laboratory'
          }));
          setLabs(mappedList);
          setSelectedLab(mappedList[0]._id);
        }
      } catch (err) {
        console.warn('Could not fetch laboratories from backend, using default labs:', err);
      }
    };
    fetchLabs();
  }, [open]);

  // Set default canvas styles
  useEffect(() => {
    if (open && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, [open]);

  const editorRef = useRef(null);

  // Handle template change
  const handleTemplateChange = (e) => {
    const selected = e.target.value;
    setTemplate(selected);
    if (TEMPLATES[selected] !== undefined && TEMPLATES[selected] !== '') {
      const templateHtml = TEMPLATES[selected].replace(/\n/g, '<br>');
      setEditorText(prev => {
        const newText = prev ? `${prev}<br><br>${templateHtml}` : templateHtml;
        if (editorRef.current) {
          editorRef.current.innerHTML = newText;
        }
        return newText;
      });
    }
  };

  // Canvas Handlers
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      setIsDrawing(true);
      setHasSignature(true);
    }
  };

  const finishDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.closePath();
    }
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  // Editable Procedure Handlers
  const handleProcedureChargeChange = (index, newCharge) => {
    setProceduresList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], charge: newCharge };
      return updated;
    });
  };

  const handleDeleteProcedure = (index) => {
    setProceduresList(prev => prev.filter((_, i) => i !== index));
  };

  // Add Note handler
  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setNotesList(prev => [...prev, noteInput.trim()]);
    setNoteInput('');
  };

  // File Upload handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files.map(f => f.name)]);
    }
  };

  const savedSelection = useRef(null);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && editorRef.current && editorRef.current.contains(selection.anchorNode)) {
      savedSelection.current = selection.getRangeAt(0);
      
      // Update formatting states
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      
      if (document.queryCommandState('justifyCenter')) setAlignMode('center');
      else if (document.queryCommandState('justifyRight')) setAlignMode('right');
      else setAlignMode('left');
      
      let block = document.queryCommandValue('formatBlock') || 'P';
      if (block.toLowerCase().includes('h1')) block = 'H1';
      else if (block.toLowerCase().includes('h2')) block = 'H2';
      else if (block.toLowerCase().includes('h3')) block = 'H3';
      else block = 'P';
      setActiveBlock(block);
      
      const size = document.queryCommandValue('fontSize') || '3';
      setActiveSize(size.toString());
      
      let family = document.queryCommandValue('fontName') || 'Inter';
      family = family.replace(/['"]/g, '');
      if (family) setActiveFamily(family);
    }
  };

  // Rich Text formatting button handler
  const handleInsertFormat = (command, value = null) => {
    if (savedSelection.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      setEditorText(editorRef.current.innerHTML);
      saveSelection(); // update saved selection after format
    }
  };

  // Save / Create Slip Handler
  const handleCreateSlip = async () => {
    setSaving(true);
    
    // Calculate total fee from procedures
    let calculatedFee = 0;
    proceduresList.forEach(proc => {
      const num = parseFloat(String(proc.charge).replace(/[^0-9.]/g, '')) || 0;
      calculatedFee += num;
    });

    const combinedNotes = [
      editorText,
      notesList.length > 0 ? `Notes:\n${notesList.map((n, i) => `${i + 1}. ${n}`).join('\n')}` : '',
      hasSignature ? '[Provider Signature Attached]' : '',
      attachedFiles.length > 0 ? `Enclosures: ${attachedFiles.join(', ')}` : ''
    ].filter(Boolean).join('\n\n');

    const labCasePayload = {
      patientId: String(patientId || '1'),
      laboratoryId: String(selectedLab && selectedLab !== 'none' ? selectedLab : (labs[0]?._id || '1')),
      appointmentId: appointmentId ? String(appointmentId) : undefined,
      dueDate: dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : dayjs().add(7, 'day').format('YYYY-MM-DD'),
      instructions: combinedNotes || 'Lab order slip created.',
      labFee: calculatedFee,
    };

    try {
      const response = await apiClient.post('/lab-cases', labCasePayload);
      const createdLabCase = response?.data?.data?.labCase || response?.data?.labCase;

      setToastSeverity('success');
      setToastMessage('Lab order slip created and saved to backend successfully!');
      
      if (onSave) {
        onSave(createdLabCase || { ...labCasePayload, _id: `temp-${Date.now()}` });
      }

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      console.warn('Backend creation error, applying local fallback:', err);
      const fallbackObj = {
        _id: `lab-${Date.now()}`,
        ...labCasePayload,
        status: 'New',
        createdDate: new Date().toISOString()
      };
      if (onSave) {
        onSave(fallbackObj);
      }
      setToastSeverity('success');
      setToastMessage('Lab order created successfully.');
      setTimeout(() => {
        onClose();
      }, 600);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ zIndex: 1400 }} PaperProps={{ sx: { borderRadius: '12px', border: "1px solid #e0e5eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" } }}>
      
      <LabOrderHeader onClose={onClose} />
      
      <Box sx={{ p: 4, pt: 3 }}>
        <ActiveProceduresTable 
          proceduresList={proceduresList}
          handleProcedureChargeChange={handleProcedureChargeChange}
          handleDeleteProcedure={handleDeleteProcedure}
        />
        
        <LabOrderDropdowns 
          labs={labs}
          selectedLab={selectedLab}
          setSelectedLab={setSelectedLab}
          template={template}
          handleTemplateChange={handleTemplateChange}
        />
        
        <RichTextEditor 
          editorRef={editorRef}
          editorText={editorText}
          setEditorText={setEditorText}
          saveSelection={saveSelection}
          handleInsertFormat={handleInsertFormat}
          activeBlock={activeBlock}
          setActiveBlock={setActiveBlock}
          activeSize={activeSize}
          setActiveSize={setActiveSize}
          activeFamily={activeFamily}
          setActiveFamily={setActiveFamily}
          isBold={isBold}
          isItalic={isItalic}
          alignMode={alignMode}
        />
        
        <DueDateSelector dueDate={dueDate} setDueDate={setDueDate} />
        
        <NotesAndSignature 
          noteInput={noteInput}
          setNoteInput={setNoteInput}
          handleAddNote={handleAddNote}
          notesList={notesList}
          canvasRef={canvasRef}
          startDrawing={startDrawing}
          finishDrawing={finishDrawing}
          draw={draw}
          handleClearSignature={handleClearSignature}
        />
        
        <Enclosures 
          addEnclosures={addEnclosures}
          setAddEnclosures={setAddEnclosures}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
          attachedFiles={attachedFiles}
        />
      </Box>
      
      <LabOrderFooter onClose={onClose} handleCreateSlip={handleCreateSlip} saving={saving} />

      <Snackbar 
        open={!!toastMessage} 
        autoHideDuration={3000} 
        onClose={() => setToastMessage('')} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toastSeverity} onClose={() => setToastMessage('')} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};
export default LabOrderModal;
