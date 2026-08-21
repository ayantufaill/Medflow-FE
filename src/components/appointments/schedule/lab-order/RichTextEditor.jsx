import React from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { 
  FormatBold, FormatItalic, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, 
  FormatColorText, Colorize, EmojiEmotionsOutlined, Undo, Redo 
} from '@mui/icons-material';

const RichTextEditor = ({
  editorRef,
  editorText,
  setEditorText,
  saveSelection,
  handleInsertFormat,
  activeBlock,
  setActiveBlock,
  activeSize,
  setActiveSize,
  activeFamily,
  setActiveFamily,
  isBold,
  isItalic,
  alignMode
}) => {
  return (
    <Box sx={{ border: '1px solid #d0d5dd', borderRadius: '8px', mb: 4, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderBottom: '1px solid #d0d5dd', bgcolor: '#f9fafb', flexWrap: 'wrap' }}>
         <Undo sx={{ fontSize: '18px', color: '#6b7280', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); handleInsertFormat('undo'); }} />
         <Redo sx={{ fontSize: '18px', color: '#6b7280', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); handleInsertFormat('redo'); }} />
         <Box sx={{ width: '1px', height: '16px', bgcolor: '#d0d5dd', mx: 0.5 }} />
         <FormatBold sx={{ fontSize: '18px', color: isBold ? '#2262ef' : '#374151', bgcolor: isBold ? '#e0e7ff' : 'transparent', borderRadius: '4px', cursor: 'pointer' }} onMouseDown={(e) => { e.preventDefault(); handleInsertFormat('bold'); }} />
         <FormatItalic sx={{ fontSize: '18px', color: isItalic ? '#2262ef' : '#374151', bgcolor: isItalic ? '#e0e7ff' : 'transparent', borderRadius: '4px', cursor: 'pointer' }} onMouseDown={(e) => { e.preventDefault(); handleInsertFormat('italic'); }} />
         <FormatAlignLeft sx={{ fontSize: '18px', color: alignMode === 'left' ? '#2262ef' : '#374151', bgcolor: alignMode === 'left' ? '#e0e7ff' : 'transparent', borderRadius: '4px', cursor: 'pointer' }} onMouseDown={(e) => { e.preventDefault(); handleInsertFormat('justifyLeft'); }} />
         <FormatAlignCenter sx={{ fontSize: '18px', color: alignMode === 'center' ? '#2262ef' : '#374151', bgcolor: alignMode === 'center' ? '#e0e7ff' : 'transparent', borderRadius: '4px', cursor: 'pointer' }} onMouseDown={(e) => { e.preventDefault(); handleInsertFormat('justifyCenter'); }} />
         <FormatAlignRight sx={{ fontSize: '18px', color: alignMode === 'right' ? '#2262ef' : '#374151', bgcolor: alignMode === 'right' ? '#e0e7ff' : 'transparent', borderRadius: '4px', cursor: 'pointer' }} onMouseDown={(e) => { e.preventDefault(); handleInsertFormat('justifyRight'); }} />
         <Box sx={{ width: '1px', height: '16px', bgcolor: '#d0d5dd', mx: 0.5 }} />
         
         <Select
           value={activeBlock}
           onChange={(e) => { 
             if(e.target.value) {
               handleInsertFormat('formatBlock', e.target.value);
               setActiveBlock(e.target.value);
             }
           }}
           variant="standard"
           disableUnderline
           MenuProps={{ sx: { zIndex: 14000 } }}
           sx={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter', '& .MuiSelect-select': { py: 0, '&:focus': { bgcolor: 'transparent' } }, '& .MuiSvgIcon-root': { fontSize: '16px', color: '#374151' } }}
           renderValue={(selected) => {
             const blockMap = { 'P': 'Paragraph', 'H1': 'Heading 1', 'H2': 'Heading 2', 'H3': 'Heading 3' };
             return blockMap[selected] || 'Paragraph';
           }}
         >
           <MenuItem value="P" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Paragraph</MenuItem>
           <MenuItem value="H1" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Heading 1</MenuItem>
           <MenuItem value="H2" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Heading 2</MenuItem>
           <MenuItem value="H3" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Heading 3</MenuItem>
         </Select>

         <Select
           value={activeSize}
           onChange={(e) => { 
             if(e.target.value) {
               handleInsertFormat('fontSize', e.target.value);
               setActiveSize(e.target.value);
             }
           }}
           variant="standard"
           disableUnderline
           MenuProps={{ sx: { zIndex: 14000 } }}
           sx={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter', '& .MuiSelect-select': { py: 0, '&:focus': { bgcolor: 'transparent' } }, '& .MuiSvgIcon-root': { fontSize: '16px', color: '#374151' } }}
           renderValue={(selected) => {
             const sizeMap = { '1': '10', '2': '12', '3': '14', '4': '18', '5': '24', '6': '32', '7': '48' };
             return sizeMap[selected] || '14';
           }}
         >
           <MenuItem value="1" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>10</MenuItem>
           <MenuItem value="2" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>12</MenuItem>
           <MenuItem value="3" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>14</MenuItem>
           <MenuItem value="4" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>18</MenuItem>
           <MenuItem value="5" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>24</MenuItem>
           <MenuItem value="6" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>32</MenuItem>
           <MenuItem value="7" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>48</MenuItem>
         </Select>

         <Select
           value={activeFamily}
           onChange={(e) => { 
             if(e.target.value) {
               handleInsertFormat('fontName', e.target.value);
               setActiveFamily(e.target.value);
             }
           }}
           variant="standard"
           disableUnderline
           MenuProps={{ sx: { zIndex: 14000 } }}
           sx={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter', '& .MuiSelect-select': { py: 0, '&:focus': { bgcolor: 'transparent' } }, '& .MuiSvgIcon-root': { fontSize: '16px', color: '#374151' } }}
         >
           <MenuItem value="Inter" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Inter</MenuItem>
           <MenuItem value="Arial" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Arial</MenuItem>
           <MenuItem value="Times New Roman" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Times</MenuItem>
           <MenuItem value="Courier New" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Courier</MenuItem>
         </Select>
         <Box sx={{ width: '1px', height: '16px', bgcolor: '#d0d5dd', mx: 0.5 }} />
         
         <Box component="label" sx={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}>
           <FormatColorText sx={{ fontSize: '18px', color: '#374151' }} />
           <input 
             type="color" 
             style={{ position: 'absolute', opacity: 0, width: 0, height: 0, padding: 0, border: 0 }}
             onChange={(e) => handleInsertFormat('foreColor', e.target.value)}
           />
         </Box>
         <Box component="label" sx={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}>
           <Colorize sx={{ fontSize: '18px', color: '#374151' }} />
           <input 
             type="color" 
             style={{ position: 'absolute', opacity: 0, width: 0, height: 0, padding: 0, border: 0 }}
             onChange={(e) => handleInsertFormat('backColor', e.target.value)}
           />
         </Box>
         <EmojiEmotionsOutlined sx={{ fontSize: '18px', color: '#374151', cursor: 'pointer' }} onMouseDown={(e) => { e.preventDefault(); handleInsertFormat('insertText', '😊'); }} />
      </Box>
      <Box
        ref={editorRef}
        contentEditable
        onInput={(e) => setEditorText(e.currentTarget.innerHTML)}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onMouseLeave={saveSelection}
        sx={{
          p: 2,
          minHeight: '120px',
          fontSize: '13px',
          fontFamily: 'Inter',
          outline: 'none',
          bgcolor: '#ffffff',
          '&:empty:before': {
            content: '"Type lab order slip details or select a template..."',
            color: '#9ca3af',
            pointerEvents: 'none',
            display: 'block'
          }
        }}
      />
    </Box>
  );
};

export default RichTextEditor;
