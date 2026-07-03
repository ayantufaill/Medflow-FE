import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Divider, Select, MenuItem, Popover, Stack } from '@mui/material';
import {
  Undo, Redo, FormatBold, FormatItalic, FormatListBulleted, 
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight, 
  FormatColorText, FormatColorFill, SentimentSatisfiedAlt, 
  LightbulbOutlined, Mic, AccessTime
} from '@mui/icons-material';

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

const RichTextEditor = ({ value = '', onChange, minHeight = 200 }) => {
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

  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = value || '';
      initialized.current = true;
    }
  }, [value]);

  const handleFormat = (format, val) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(format, false, val);
      if (onChange) onChange(editorRef.current.innerHTML);
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
      if (onChange) onChange(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = (e) => {
    if (!isComposing.current) {
      if (onChange) onChange(e.currentTarget.innerHTML);
    }
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e) => {
    isComposing.current = false;
    if (onChange) onChange(e.currentTarget.innerHTML);
  };

  return (
    <Box sx={{ border: '1px solid #4a6da7', borderRadius: 2, overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box sx={{ bgcolor: '#f1f5f9', p: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5, borderBottom: '1px solid #4a6da7', alignItems: 'center' }}>
        <IconButton size="small" onClick={() => handleFormat('undo')} title="Undo">
          <Undo fontSize="inherit" />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('redo')} title="Redo">
          <Redo fontSize="inherit" />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <IconButton 
          size="small" 
          onClick={() => { setBold(!bold); handleFormat('bold'); }}
          sx={{ bgcolor: bold ? '#e0e0e0' : 'transparent', borderRadius: 1, minWidth: 28, height: 28 }}
        >
          <FormatBold fontSize="inherit" color={bold ? 'primary' : 'inherit'} />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={() => { setItalic(!italic); handleFormat('italic'); }}
          sx={{ bgcolor: italic ? '#e0e0e0' : 'transparent', borderRadius: 1, minWidth: 28, height: 28 }}
        >
          <FormatItalic fontSize="inherit" color={italic ? 'primary' : 'inherit'} />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <IconButton 
          size="small" 
          onClick={() => { setBulletList(!bulletList); handleFormat('insertUnorderedList'); }}
          sx={{ bgcolor: bulletList ? '#e0e0e0' : 'transparent', borderRadius: 1, minWidth: 28, height: 28 }}
        >
          <FormatListBulleted fontSize="inherit" color={bulletList ? 'primary' : 'inherit'} />
        </IconButton>
        <Stack direction="row" spacing={0.5}>
          <IconButton 
            size="small" 
            onClick={() => handleAlignmentChange(null, 'left')}
            sx={{ bgcolor: alignment === 'left' ? '#e0e0e0' : 'transparent', borderRadius: 1, minWidth: 28, height: 28 }}
          >
            <FormatAlignLeft fontSize="inherit" color={alignment === 'left' ? 'primary' : 'inherit'} />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleAlignmentChange(null, 'center')}
            sx={{ bgcolor: alignment === 'center' ? '#e0e0e0' : 'transparent', borderRadius: 1, minWidth: 28, height: 28 }}
          >
            <FormatAlignCenter fontSize="inherit" color={alignment === 'center' ? 'primary' : 'inherit'} />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleAlignmentChange(null, 'right')}
            sx={{ bgcolor: alignment === 'right' ? '#e0e0e0' : 'transparent', borderRadius: 1, minWidth: 28, height: 28 }}
          >
            <FormatAlignRight fontSize="inherit" color={alignment === 'right' ? 'primary' : 'inherit'} />
          </IconButton>
        </Stack>
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
          <MenuItem value="pre">Preformatted</MenuItem>
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
          <MenuItem value="1.5">9pt</MenuItem>
          <MenuItem value="2">10pt</MenuItem>
          <MenuItem value="2.5">11pt</MenuItem>
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
            sx={{ minWidth: 28, height: 28, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
            title="Text Color"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FormatColorText fontSize="inherit" sx={{ color: textColor }} />
              <Box sx={{ width: '80%', height: '2px', bgcolor: textColor, mt: -0.5 }} />
            </Box>
          </IconButton>
          <Popover
            open={Boolean(textColorAnchor)}
            anchorEl={textColorAnchor}
            onClose={() => setTextColorAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            sx={{ '& .MuiPaper-root': { p: 1, borderRadius: 1 } }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 0.5 }}>
              {standardColors.map((color) => (
                <Box
                  key={color}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleTextColorChange(color)}
                  sx={{ width: 20, height: 20, bgcolor: color, border: color === '#ffffff' ? '1px solid #ccc' : 'none', cursor: 'pointer', '&:hover': { transform: 'scale(1.2)', zIndex: 1 } }}
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
            sx={{ minWidth: 28, height: 28, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
            title="Highlight Color"
          >
            <FormatColorFill sx={{ fontSize: 24, color: highlightColor === 'transparent' ? '#000000' : highlightColor }} />
          </IconButton>
          <Popover
            open={Boolean(highlightColorAnchor)}
            anchorEl={highlightColorAnchor}
            onClose={() => setHighlightColorAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            sx={{ '& .MuiPaper-root': { p: 1, borderRadius: 1 } }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 0.5 }}>
              {standardColors.map((color) => (
                <Box
                  key={color}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleHighlightColorChange(color)}
                  sx={{ width: 20, height: 20, bgcolor: color, border: color === '#ffffff' ? '1px solid #ccc' : 'none', cursor: 'pointer', '&:hover': { transform: 'scale(1.2)', zIndex: 1 } }}
                />
              ))}
            </Box>
          </Popover>
        </Box>
        <IconButton size="small" onClick={() => insertEmoji('😊')} title="Insert emoji"><SentimentSatisfiedAlt fontSize="inherit" /></IconButton>
        <IconButton size="small" onClick={() => insertEmoji('💡')} title="Insert idea"><LightbulbOutlined fontSize="inherit" /></IconButton>
        <IconButton size="small" title="Voice to text"><Mic fontSize="inherit" /></IconButton>
        <IconButton size="small" title="Insert timestamp"><AccessTime fontSize="inherit" /></IconButton>
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
          minHeight: minHeight,
          maxHeight: minHeight + 100,
          p: 2,
          outline: 'none',
          overflowY: 'auto',
          overflowX: 'hidden',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          '&:empty:before': {
            content: '"Start typing your note here..."',
            color: '#94a3b8',
            fontStyle: 'italic'
          }
        }}
      />
    </Box>
  );
};

export default RichTextEditor;
