import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, Grid, TextField, Button, Stack, 
  IconButton, Accordion, AccordionSummary, AccordionDetails,
  Checkbox, Select, MenuItem, Divider, ToggleButton, ToggleButtonGroup, Popover
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
  Mic as MicIcon,
  SentimentSatisfiedAlt as EmojiEmotionsIcon,
  CloudUpload as CloudUploadIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatColorText as ColorLensIcon,
  AccessTime as AccessTimeIcon,
  FormatColorFill as FormatColorFillIcon,
  LightbulbOutlined as LightbulbIcon
} from '@mui/icons-material';

const CreateNewReferral = ({ onClose }) => {
  // Checkbox states
  const [histories, setHistories] = useState({
    all: false, medical: false, dental: false, medication: false
  });
  const [diagnosticOpinions, setDiagnosticOpinions] = useState({
    all: false, periodontal: false, biomechanical: false, functional: false, dentofacial: false
  });

  // Editor states
  const [instructions, setInstructions] = useState('');
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
  const [attachedFiles, setAttachedFiles] = useState([]);
  
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const isComposing = useRef(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * { visibility: hidden !important; }
        .printable-referral, .printable-referral * { visibility: visible !important; }
        .printable-referral { 
          position: absolute !important; 
          left: 0 !important; 
          top: 0 !important; 
          width: 100% !important; 
          padding: 0 !important;
          margin: 0 !important;
        }
        .no-print { display: none !important; }
        .MuiDialog-container { display: block !important; }
        .MuiPaper-root { box-shadow: none !important; border: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  const sidebarHeaderBg = '#aeb9c4';
  const blueHeaderBg = '#5479b1';
  const tanButtonBg = '#d4b78a';

  // Standard colors for picker
  const standardColors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  ];

  // Logic Handlers
  const handleHistoryChange = (field) => {
    if (field === 'all') {
      const newState = !histories.all;
      setHistories({ all: newState, medical: newState, dental: newState, medication: newState });
    } else {
      const next = { ...histories, [field]: !histories[field] };
      setHistories({ ...next, all: next.medical && next.dental && next.medication });
    }
  };

  const handleDOChange = (field) => {
    if (field === 'all') {
      const newState = !diagnosticOpinions.all;
      setDiagnosticOpinions({ all: newState, periodontal: newState, biomechanical: newState, functional: newState, dentofacial: newState });
    } else {
      const next = { ...diagnosticOpinions, [field]: !diagnosticOpinions[field] };
      setDiagnosticOpinions({ ...next, all: next.periodontal && next.biomechanical && next.functional && next.dentofacial });
    }
  };

  // Editor Handlers
  const handleFormat = (format, value) => {
    if (editorRef.current) {
      document.execCommand(format, false, value);
      editorRef.current.focus();
      setInstructions(editorRef.current.innerHTML);
    }
  };

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

  const handlePrint = () => {
    window.print();
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const SidebarSection = ({ title, children, expanded = false }) => (
    <Accordion defaultExpanded={expanded} sx={{ mb: 1, boxShadow: 'none', '&:before': { display: 'none' }, border: '1px solid #ddd' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: sidebarHeaderBg, minHeight: '36px !important', '& .MuiAccordionSummary-content': { my: '4px !important' } }}>
        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>{children}</AccordionDetails>
    </Accordion>
  );

  const BlueCheckboxRow = ({ label, checked, onChange }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: blueHeaderBg, color: '#fff', mb: 0.5, borderRadius: '2px' }}>
      <Checkbox size="small" checked={checked} onChange={onChange} sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' }, p: 0.5 }} />
      <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>{label}</Typography>
    </Box>
  );

  const WhiteCheckboxRow = ({ label, checked, onChange }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', mb: 0.5, borderRadius: '2px', ml: 1 }}>
      <Checkbox size="small" checked={checked} onChange={onChange} sx={{ p: 0.5 }} />
      <Typography sx={{ fontSize: '11px' }}>{label}</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100%', bgcolor: '#fff', borderRadius: 1, overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box className="no-print" sx={{ width: '300px', borderRight: '2px solid #ddd', p: 1.5, overflowY: 'auto', bgcolor: '#fdfdfd' }}>
        <SidebarSection title="Add referral from treatment procedures">
           <Typography sx={{ fontSize: '11px', color: '#999', fontStyle: 'italic', textAlign: 'center', py: 2 }}>No referral procedures</Typography>
        </SidebarSection>

        <SidebarSection title="Add new referral form" expanded>
           <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
             <Select size="small" displayEmpty value="" sx={{ flex: 1, fontSize: '11px', bgcolor: tanButtonBg, color: '#fff', borderRadius: 1, '& .MuiSelect-icon': { color: '#fff' } }}>
               <MenuItem value="">Refer to</MenuItem>
             </Select>
             <Button variant="contained" sx={{ flex: 1, fontSize: '10px', textTransform: 'none', bgcolor: sidebarHeaderBg, color: '#fff', p: 0.5, borderRadius: 1 }}>Choose a form template</Button>
           </Box>
        </SidebarSection>

        <SidebarSection title="Clinical information" expanded>
           <Stack spacing={0.5} sx={{ mb: 2 }}>
             <Button variant="contained" fullWidth sx={{ bgcolor: blueHeaderBg, color: '#fff', textTransform: 'none', fontSize: '11px', borderRadius: 1, py: 0.5 }}>Select All Exam Findings</Button>
             <Button variant="contained" fullWidth sx={{ bgcolor: tanButtonBg, color: '#fff', textTransform: 'none', fontSize: '11px', borderRadius: 1, py: 0.5 }}>Add Tooth Card</Button>
             <Button variant="contained" fullWidth sx={{ bgcolor: tanButtonBg, color: '#fff', textTransform: 'none', fontSize: '11px', borderRadius: 1, py: 0.5 }}>Select Progress Notes</Button>
           </Stack>

           <BlueCheckboxRow label="Select All Histories Summary" checked={histories.all} onChange={() => handleHistoryChange('all')} />
           <WhiteCheckboxRow label="Medical History Summary" checked={histories.medical} onChange={() => handleHistoryChange('medical')} />
           <WhiteCheckboxRow label="Dental History Summary" checked={histories.dental} onChange={() => handleHistoryChange('dental')} />
           <WhiteCheckboxRow label="Medication List" checked={histories.medication} onChange={() => handleHistoryChange('medication')} />

           <Box sx={{ mt: 2 }}>
             <BlueCheckboxRow label="Select All Diagnostic Opinions" checked={diagnosticOpinions.all} onChange={() => handleDOChange('all')} />
             <WhiteCheckboxRow label="Periodontal DO" checked={diagnosticOpinions.periodontal} onChange={() => handleDOChange('periodontal')} />
             <WhiteCheckboxRow label="Biomechanical DO" checked={diagnosticOpinions.biomechanical} onChange={() => handleDOChange('biomechanical')} />
             <WhiteCheckboxRow label="Functional DO" checked={diagnosticOpinions.functional} onChange={() => handleDOChange('functional')} />
             <WhiteCheckboxRow label="Dentofacial DO" checked={diagnosticOpinions.dentofacial} onChange={() => handleDOChange('dentofacial')} />
           </Box>

           <Button variant="contained" fullWidth sx={{ mt: 2, bgcolor: tanButtonBg, color: '#fff', textTransform: 'none', fontSize: '12px', fontWeight: 600, py: 1, borderRadius: 1 }}>Generate</Button>
        </SidebarSection>
      </Box>

      {/* Main Content */}
      <Box className="printable-referral" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#5479b1', fontSize: '14px', fontWeight: 600, mb: 1 }}>Create New Referral</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, mb: 0.5 }}>Subject</Typography>
          <TextField fullWidth size="small" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
        </Box>

        {/* Editor Container */}
        <Box sx={{ flexGrow: 1, border: '1.5px solid #5479b1', borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Toolbar - Synchronized with LabOrder.jsx */}
          <Box className="no-print" sx={{ bgcolor: '#f1f5f9', p: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5, borderBottom: '1px solid #5479b1', alignItems: 'center' }}>
             <IconButton size="small" onClick={() => handleFormat('undo')}><UndoIcon fontSize="inherit" /></IconButton>
             <IconButton size="small" onClick={() => handleFormat('redo')}><RedoIcon fontSize="inherit" /></IconButton>
             <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
             
             <ToggleButton size="small" value="bold" selected={bold} onChange={() => { setBold(!bold); handleFormat('bold'); }} sx={{ minWidth: 28, height: 28 }}>
                <FormatBoldIcon fontSize="inherit" />
             </ToggleButton>
             <ToggleButton size="small" value="italic" selected={italic} onChange={() => { setItalic(!italic); handleFormat('italic'); }} sx={{ minWidth: 28, height: 28 }}>
                <FormatItalicIcon fontSize="inherit" />
             </ToggleButton>
             
             <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
             
             <ToggleButton size="small" value="list" selected={bulletList} onChange={() => { setBulletList(!bulletList); handleFormat('insertUnorderedList'); }} sx={{ minWidth: 28, height: 28 }}>
                <FormatListBulletedIcon fontSize="inherit" />
             </ToggleButton>
             
             <ToggleButtonGroup size="small" value={alignment} exclusive onChange={handleAlignmentChange} sx={{ '& .MuiToggleButton-root': { minWidth: 28, height: 28, px: 0.5 } }}>
                <ToggleButton value="left"><FormatAlignLeftIcon fontSize="inherit" /></ToggleButton>
                <ToggleButton value="center"><FormatAlignCenterIcon fontSize="inherit" /></ToggleButton>
                <ToggleButton value="right"><FormatAlignRightIcon fontSize="inherit" /></ToggleButton>
             </ToggleButtonGroup>
             
             <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
             
             <Select size="small" value={paragraphStyle} onChange={(e) => { setParagraphStyle(e.target.value); handleFormat('formatBlock', e.target.value); }} sx={{ height: 28, fontSize: '11px', bgcolor: '#fff' }} variant="outlined">
               <MenuItem value="p">Paragraph</MenuItem>
               <MenuItem value="h1">Heading 1</MenuItem>
               <MenuItem value="h2">Heading 2</MenuItem>
             </Select>

             <Select size="small" value={fontSize} onChange={(e) => { setFontSize(e.target.value); handleFormat('fontSize', e.target.value); }} sx={{ height: 28, fontSize: '11px', bgcolor: '#fff' }} variant="outlined">
               <MenuItem value="1">8pt</MenuItem>
               <MenuItem value="1.5">9pt</MenuItem>
               <MenuItem value="2">10pt</MenuItem>
               <MenuItem value="2.5">11pt</MenuItem>
               <MenuItem value="3">12pt</MenuItem>
               <MenuItem value="4">14pt</MenuItem>
               <MenuItem value="5">18pt</MenuItem>
               <MenuItem value="6">24pt</MenuItem>
               <MenuItem value="7">36pt</MenuItem>
             </Select>

             <Select size="small" value={fontFamily} onChange={(e) => { setFontFamily(e.target.value); handleFormat('fontName', e.target.value); }} sx={{ height: 28, fontSize: '11px', bgcolor: '#fff' }} variant="outlined">
               <MenuItem value="Arial">Arial</MenuItem><MenuItem value="Times New Roman">Times New Roman</MenuItem><MenuItem value="Lato">Lato</MenuItem>
             </Select>

             <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
             
             <IconButton size="small" onClick={(e) => setTextColorAnchor(e.currentTarget)} sx={{ color: textColor }}><ColorLensIcon fontSize="inherit" /></IconButton>
             <IconButton size="small" onClick={(e) => setHighlightColorAnchor(e.currentTarget)}><FormatColorFillIcon fontSize="inherit" sx={{ color: highlightColor === 'transparent' ? '#000' : highlightColor }} /></IconButton>
             <IconButton size="small" onClick={() => insertEmoji('😊')}><EmojiEmotionsIcon fontSize="inherit" /></IconButton>
             <IconButton size="small" onClick={() => insertEmoji('💡')}><LightbulbIcon fontSize="inherit" /></IconButton>
             <IconButton size="small"><MicIcon fontSize="inherit" /></IconButton>
             <IconButton size="small"><AccessTimeIcon fontSize="inherit" /></IconButton>

             {/* Color Popovers */}
             <Popover open={Boolean(textColorAnchor)} anchorEl={textColorAnchor} onClose={() => setTextColorAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0.5 }}>
                   {standardColors.map(c => <Box key={c} onClick={() => { setTextColor(c); handleFormat('foreColor', c); setTextColorAnchor(null); }} sx={{ width: 20, height: 20, bgcolor: c, cursor: 'pointer', border: '1px solid #eee' }} />)}
                </Box>
             </Popover>
          </Box>

          {/* Editor Content Area */}
          <Box
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setInstructions(e.currentTarget.innerHTML)}
            sx={{ 
              flexGrow: 1, p: 2, outline: 'none', overflowY: 'auto', minHeight: '300px',
              '&:empty:before': { content: '"Start typing your referral here..."', color: '#94a3b8', fontStyle: 'italic' }
            }}
          />
        </Box>

        {/* Footer Actions */}
        <Box className="no-print" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
           <Button variant="contained" sx={{ bgcolor: tanButtonBg, color: '#fff', textTransform: 'none', px: 3, borderRadius: 1 }}>Save</Button>
           <Button 
            variant="contained" 
            onClick={handlePrint}
            sx={{ bgcolor: tanButtonBg, color: '#fff', textTransform: 'none', px: 3, borderRadius: 1 }}
           >
            Print
           </Button>
           <Button variant="contained" sx={{ bgcolor: '#aeb9c4', color: '#fff', textTransform: 'none', px: 3, borderRadius: 1 }}>Clear</Button>
        </Box>

        {/* Attached Files List */}
        {attachedFiles.length > 0 && (
          <Box className="no-print" sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {attachedFiles.map((file, idx) => (
              <Box key={idx} sx={{ bgcolor: '#f0f0f0', px: 1, py: 0.5, borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '11px' }}>{file.name}</Typography>
                <IconButton size="small" onClick={() => removeFile(idx)} sx={{ p: 0 }}><ExpandMoreIcon sx={{ fontSize: '14px', transform: 'rotate(45deg)' }} /></IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Box className="no-print" sx={{ mt: 'auto', pt: 2 }}>
           <input
             type="file"
             multiple
             ref={fileInputRef}
             style={{ display: 'none' }}
             onChange={handleFileChange}
           />
           <Button 
            startIcon={<CloudUploadIcon />} 
            onClick={handleAttachClick}
            sx={{ textTransform: 'none', color: '#5479b1', fontSize: '12px' }}
           >
            Attach Files
           </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateNewReferral;
