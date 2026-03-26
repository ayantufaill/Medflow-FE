import React, { useState, useRef } from 'react';
import {
  Box, Typography, IconButton, TextField, Select, MenuItem,
  Button, Divider, Checkbox, FormControlLabel, Paper, InputAdornment, Modal, ToggleButton, ToggleButtonGroup, ClickAwayListener, Popover
} from '@mui/material';
import {
  Close, DeleteOutline, CalendarToday, Add, 
  CloudUploadOutlined, Undo, Redo, FormatBold, 
  FormatItalic, FormatListBulleted, FormatAlignLeft, 
  FormatAlignCenter, FormatAlignRight, SentimentSatisfiedAlt, LightbulbOutlined,
  FormatColorText, FormatColorFill
} from '@mui/icons-material';
import dayjs from 'dayjs';
import SignaturePad from './SignaturePad';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  outline: 'none'
};

const LabOrder = ({ open, onClose, onSubmit, initialInstructions = '' }) => {
  // State management
  const [selectedLab, setSelectedLab] = useState('none');
  const [selectedTemplate, setSelectedTemplate] = useState('none');
  const [dueDate, setDueDate] = useState(dayjs());
  const [instructions, setInstructions] = useState(initialInstructions);
  const [addEnclosures, setAddEnclosures] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  // Rich text editor state
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [bulletList, setBulletList] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const [paragraphStyle, setParagraphStyle] = useState('p');
  const [fontSize, setFontSize] = useState('3');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('transparent');
  const [textColorAnchor, setTextColorAnchor] = useState(null);
  const [highlightColorAnchor, setHighlightColorAnchor] = useState(null);
  const editorRef = useRef(null);
  const isComposing = useRef(false);
  const initialized = useRef(false);

  const handleSignatureChange = (dataUrl) => {
    setSignatureData(dataUrl);
  };

  const handleRemoveProcedure = () => {
    // In a real implementation, this would remove the procedure from the list
    // For now, we'll just show an alert or you can add logic to manage procedures
    console.log('Removing procedure Maintenance D4910');
  };

  const handleDateChange = (e) => {
    const newDate = dayjs(e.target.value);
    if (newDate.isValid()) {
      setDueDate(newDate);
    }
  };

  const handleAttachFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
    // Reset input value to allow selecting same file again
    e.target.value = '';
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleCreateSlip = () => {
    if (onSubmit) {
      onSubmit({
        lab: selectedLab,
        template: selectedTemplate,
        dueDate: dueDate ? dueDate.format('MM/DD/YYYY') : '',
        instructions,
        addEnclosures,
        signature: signatureData,
        attachedFiles: attachedFiles.map(f => f.file)
      });
    }
    onClose();
  };

  const handleClearSignature = () => {
    setSignatureData(null);
  };

  const handleAddNoteLine = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setInstructions(prev => prev + '\n');
  };

  // Rich text editor handlers
  const handleFormat = (format, value) => {
    if (editorRef.current) {
      document.execCommand(format, false, value);
      editorRef.current.focus();
      // Manually update state after formatting
      setInstructions(editorRef.current.innerHTML);
    }
  };

  const handleParagraphChange = (event) => {
    const tag = event.target.value;
    setParagraphStyle(tag);
    handleFormat('formatBlock', tag);
  };

  const handleFontSizeChange = (event) => {
    const size = event.target.value;
    setFontSize(size);
    handleFormat('fontSize', size);
  };

  const handleFontFamilyChange = (event) => {
    const font = event.target.value;
    setFontFamily(font);
    handleFormat('fontName', font);
  };

  const handleTextColorChange = (color) => {
    setTextColor(color);
    handleFormat('foreColor', color);
    setTextColorAnchor(null);
  };

  const handleHighlightColorChange = (color) => {
    setHighlightColor(color);
    handleFormat('hiliteColor', color);
    setHighlightColorAnchor(null);
  };

  // Common color palettes
  const standardColors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#b4a7d6', '#9fc5e8', '#b4a7d6', '#d5a6bd',
    '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#8e7cc3', '#6fa8dc', '#8e7cc3', '#c27ba0',
    '#a61c00', '#c00', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#674ea7', '#3d85c6', '#674ea7', '#a64d79',
    '#85200c', '#990a00', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#351c75', '#0b5394', '#351c75', '#741b47',
    '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#20124d', '#073763', '#20124d', '#4c1130',
  ];

  const handleAlignmentChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      handleFormat(`justify${newAlignment.charAt(0).toUpperCase() + newAlignment.slice(1)}`);
    }
  };

  const insertEmoji = (emoji) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, emoji);
      setInstructions(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = (e) => {
    if (!isComposing.current) {
      setInstructions(e.currentTarget.innerHTML);
    }
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e) => {
    isComposing.current = false;
    setInstructions(e.currentTarget.innerHTML);
  };

  // Initialize editor content only once when dialog opens
  React.useEffect(() => {
    if (open && editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = instructions || '';
      initialized.current = true;
    }
  }, [open]);

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      disableEscapeKeyDown={false} // Allow ESC to close
      disableScrollLock={true} // Prevent body scroll lock issues
    >
      <Box sx={modalStyle}>
      <Box sx={{ width: '100%', bgcolor: 'white', overflow: 'visible' }}>
        
        {/* 1. Header */}
        <Box sx={{ bgcolor: '#2b4c8c', p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', ml: 1 }}>Lab Order</Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}><Close /></IconButton>
        </Box>

        {/* 2. Form Content (Scrollable) */}
        <Box sx={{ p: 3, maxHeight: '85vh', overflowY: 'auto' }}>
          
          {/* Active Procedure Row */}
          <Box sx={{ display: 'flex', gap: 10, mb: 1 }}>
            <Typography sx={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Active Procedure</Typography>
            <Typography sx={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Procedure Cost</Typography>
          </Box>
          <Divider sx={{ mb: 1.5 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 10, mb: 3 }}>
            <Typography sx={{ fontSize: '14px', color: '#4a6da7', fontWeight: 500, width: 140 }}>Maintenance D4910</Typography>
            <Box sx={{ border: '1px solid #cbd5e1', borderRadius: 1, px: 1, py: 0.5, fontSize: '14px', minWidth: 60 }}>$0.00</Box>
            <IconButton 
              size="small" 
              sx={{ 
                color: '#ff7675',
                '&:hover': { 
                  bgcolor: 'rgba(255, 118, 117, 0.08)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onClick={handleRemoveProcedure}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Box>

          {/* Lab & Template Selects */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>Choose Lab <span style={{ color: 'red' }}>*</span></Typography>
            <Select 
              size="small" 
              fullWidth 
              value={selectedLab} 
              onChange={(e) => setSelectedLab(e.target.value)}
              sx={{ maxWidth: 300, fontSize: '13px' }}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="lab1">ABC Dental Lab</MenuItem>
              <MenuItem value="lab2">XYZ Dental Lab</MenuItem>
            </Select>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>Choose Template</Typography>
            <Select 
              size="small" 
              fullWidth 
              value={selectedTemplate} 
              onChange={(e) => setSelectedTemplate(e.target.value)}
              sx={{ maxWidth: 300, fontSize: '13px' }}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="template1">Crown Template</MenuItem>
              <MenuItem value="template2">Bridge Template</MenuItem>
            </Select>
          </Box>

          {/* 3. Functional Rich Text Editor */}
          <Box sx={{ border: '1px solid #4a6da7', borderRadius: 2, mb: 2, overflow: 'hidden' }}>
            {/* Toolbar */}
            <Box sx={{ bgcolor: '#f1f5f9', p: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5, borderBottom: '1px solid #4a6da7', alignItems: 'center' }}>
              <IconButton size="small" onClick={() => handleFormat('undo')} title="Undo">
                <Undo fontSize="inherit" />
              </IconButton>
              <IconButton size="small" onClick={() => handleFormat('redo')} title="Redo">
                <Redo fontSize="inherit" />
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <ToggleButton
                size="small"
                value="bold"
                selected={bold}
                onChange={() => {
                  setBold(!bold);
                  handleFormat('bold');
                }}
                sx={{ minWidth: 28, height: 28 }}
              >
                <FormatBold fontSize="inherit" />
              </ToggleButton>
              <ToggleButton
                size="small"
                value="italic"
                selected={italic}
                onChange={() => {
                  setItalic(!italic);
                  handleFormat('italic');
                }}
                sx={{ minWidth: 28, height: 28 }}
              >
                <FormatItalic fontSize="inherit" />
              </ToggleButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <ToggleButton
                size="small"
                value="list"
                selected={bulletList}
                onChange={() => {
                  setBulletList(!bulletList);
                  handleFormat('insertUnorderedList');
                }}
                sx={{ minWidth: 28, height: 28 }}
              >
                <FormatListBulleted fontSize="inherit" />
              </ToggleButton>
              <ToggleButtonGroup
                size="small"
                value={alignment}
                exclusive
                onChange={handleAlignmentChange}
                sx={{ '& .MuiToggleButton-root': { minWidth: 28, height: 28, px: 0.5 } }}
              >
                <ToggleButton value="left">
                  <FormatAlignLeft fontSize="inherit" />
                </ToggleButton>
                <ToggleButton value="center">
                  <FormatAlignCenter fontSize="inherit" />
                </ToggleButton>
                <ToggleButton value="right">
                  <FormatAlignRight fontSize="inherit" />
                </ToggleButton>
              </ToggleButtonGroup>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              
              {/* Paragraph Style */}
              <Select
                size="small"
                value={paragraphStyle}
                onChange={handleParagraphChange}
                sx={{ minWidth: 100, height: 28, fontSize: '12px' }}
                variant="outlined"
              >
                <MenuItem value="p">Paragraph</MenuItem>
                <MenuItem value="h1">Heading 1</MenuItem>
                <MenuItem value="h2">Heading 2</MenuItem>
                <MenuItem value="h3">Heading 3</MenuItem>
                <MenuItem value="h4">Heading 4</MenuItem>
                <MenuItem value="h5">Heading 5</MenuItem>
                <MenuItem value="h6">Heading 6</MenuItem>
              </Select>
              
              {/* Font Size */}
              <Select
                size="small"
                value={fontSize}
                onChange={handleFontSizeChange}
                sx={{ minWidth: 70, height: 28, fontSize: '12px' }}
                variant="outlined"
              >
                <MenuItem value="1">8pt</MenuItem>
                <MenuItem value="2">10pt</MenuItem>
                <MenuItem value="3">12pt</MenuItem>
                <MenuItem value="4">14pt</MenuItem>
                <MenuItem value="5">18pt</MenuItem>
                <MenuItem value="6">24pt</MenuItem>
                <MenuItem value="7">36pt</MenuItem>
              </Select>
              
              {/* Font Family */}
              <Select
                size="small"
                value={fontFamily}
                onChange={handleFontFamilyChange}
                sx={{ minWidth: 120, height: 28, fontSize: '12px' }}
                variant="outlined"
              >
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                <MenuItem value="Courier New">Courier New</MenuItem>
                <MenuItem value="Georgia">Georgia</MenuItem>
                <MenuItem value="Verdana">Verdana</MenuItem>
                <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
                <MenuItem value="Impact">Impact</MenuItem>
              </Select>
              
              {/* Text Color */}
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  size="small"
                  onClick={(e) => setTextColorAnchor(e.currentTarget)}
                  sx={{ 
                    minWidth: 28, 
                    height: 28,
                    color: textColor,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                  title="Text Color"
                >
                  <FormatColorText fontSize="inherit" />
                </IconButton>
                <Popover
                  open={Boolean(textColorAnchor)}
                  anchorEl={textColorAnchor}
                  onClose={() => setTextColorAnchor(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  sx={{ '& .MuiPaper-root': { p: 1, borderRadius: 1 } }}
                >
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 0.5 }}>
                    {standardColors.map((color) => (
                      <Box
                        key={color}
                        onClick={() => handleTextColorChange(color)}
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: color,
                          border: color === '#ffffff' ? '1px solid #ccc' : 'none',
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.2)', zIndex: 1 }
                        }}
                      />
                    ))}
                  </Box>
                </Popover>
              </Box>
              
              {/* Highlight/Background Color */}
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  size="small"
                  onClick={(e) => setHighlightColorAnchor(e.currentTarget)}
                  sx={{ 
                    minWidth: 28, 
                    height: 28,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                  title="Highlight Color"
                >
                  <FormatColorFill sx={{ fontSize: 24, color: highlightColor === 'transparent' ? '#000000' : highlightColor }} />
                </IconButton>
                <Popover
                  open={Boolean(highlightColorAnchor)}
                  anchorEl={highlightColorAnchor}
                  onClose={() => setHighlightColorAnchor(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  sx={{ '& .MuiPaper-root': { p: 1, borderRadius: 1 } }}
                >
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 0.5 }}>
                    {standardColors.map((color) => (
                      <Box
                        key={color}
                        onClick={() => handleHighlightColorChange(color)}
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: color,
                          border: color === '#ffffff' ? '1px solid #ccc' : 'none',
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.2)', zIndex: 1 }
                        }}
                      />
                    ))}
                  </Box>
                </Popover>
              </Box>
              <IconButton 
                size="small" 
                onClick={() => insertEmoji('😊')}
                title="Insert emoji"
              >
                <SentimentSatisfiedAlt fontSize="inherit" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => insertEmoji('💡')}
                title="Insert idea"
              >
                <LightbulbOutlined fontSize="inherit" />
              </IconButton>
            </Box>
            
            {/* Editable Content Area */}
            <Box
              ref={editorRef}
              component="div"
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorInput}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              sx={{ 
                height: 200, 
                maxHeight: 200,
                p: 2,
                outline: 'none',
                overflowY: 'auto',
                overflowX: 'hidden',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                '&:empty:before': {
                  content: '"Start typing your instructions here..."',
                  color: '#94a3b8',
                  fontStyle: 'italic'
                },
                '&::-webkit-scrollbar': {
                  width: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '4px'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#94a3b8'
                  }
                }
              }}
            />
          </Box>

          {/* Due Date & Arrival Msg */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '12px', color: '#94a3b8', mb: 0.5 }}>Due Date <span style={{ color: 'red' }}>*</span></Typography>
            <TextField
              type="date"
              value={dueDate.format('YYYY-MM-DD')}
              onChange={handleDateChange}
              size="small"
              fullWidth
              sx={{ 
                width: 220, 
                bgcolor: '#f8fafc',
                '& .MuiOutlinedInput-root': { 
                  height: 40,
                  '& fieldset': {
                    borderColor: '#e2e8f0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#94a3b8'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4a6da7'
                  }
                }
              }}
              inputProps={{
                min: dayjs().format('YYYY-MM-DD'),
                style: { 
                  cursor: 'pointer',
                  padding: '8px 12px',
                  textAlign: 'left'
                }
              }}
            />
            <Typography sx={{ fontSize: '12px', color: '#22c55e', mt: 1, fontWeight: 500 }}>
              Based on the Lab's turn around time the case should arrive on time
            </Typography>
          </Box>

          {/* History Section */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>History</Typography>
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 1, p: 1, minHeight: 60, bgcolor: '#f8fafc' }}>
              <Typography sx={{ fontSize: '12px', color: '#64748b' }}>No previous lab orders</Typography>
            </Box>
          </Box>

          {/* Provider Signature */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>Provider Signature</Typography>
            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 1 }}>Draw your signature</Typography>
            <SignaturePad
              value={signatureData}
              onChange={handleSignatureChange}
              onClear={handleClearSignature}
              width={400}
              height={150}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Footer Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel 
              control={
                <Checkbox 
                  size="small" 
                  checked={addEnclosures}
                  onChange={(e) => setAddEnclosures(e.target.checked)}
                />
              } 
              label={<Typography sx={{ fontSize: '13px' }}>Add Enclosures</Typography>} 
            />
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            
            {/* Attach Files Button */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                color: '#2b4c8c', 
                cursor: 'pointer', 
                mb: 2,
                '&:hover': { opacity: 0.8 }
              }}
              onClick={handleAttachFiles}
            >
              <CloudUploadOutlined sx={{ fontSize: 20 }} />
              <Typography sx={{ fontSize: '13px' }}>Attach Files</Typography>
            </Box>

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#475569' }}>
                  Attached Files ({attachedFiles.length})
                </Typography>
                {attachedFiles.map((file, index) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      mb: 0.5,
                      borderRadius: 1,
                      bgcolor: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                      <CloudUploadOutlined sx={{ fontSize: 18, color: '#64748b' }} />
                      <Box sx={{ overflow: 'hidden' }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#334155' }}>{file.name}</Typography>
                        <Typography sx={{ fontSize: '10px', color: '#94a3b8' }}>{formatFileSize(file.size)}</Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                      sx={{ color: '#ff7675' }}
                    >
                      <Close sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#002b71', borderRadius: 10, px: 4, textTransform: 'none', fontWeight: 600 }}
                onClick={handleCreateSlip}
              >
                Create Slip
              </Button>
              <Button 
                variant="outlined" 
                sx={{ borderRadius: 10, px: 4, textTransform: 'none', borderColor: '#002b71', color: '#002b71' }}
                onClick={onClose}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      </Box>
    </Modal>
  );
};

export default LabOrder;
