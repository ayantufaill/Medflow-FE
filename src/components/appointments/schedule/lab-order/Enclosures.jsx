import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import { CloudUploadOutlined } from '@mui/icons-material';

const Enclosures = ({
  addEnclosures,
  setAddEnclosures,
  fileInputRef,
  handleFileUpload,
  attachedFiles
}) => {
  return (
    <Box sx={{ mb: 1 }}>
       <FormControlLabel 
         control={
           <Checkbox 
             size="small" 
             checked={addEnclosures}
             onChange={(e) => setAddEnclosures(e.target.checked)}
             sx={{ color: '#d0d5dd', '&.Mui-checked': { color: '#2262ef' } }} 
           />
         } 
         label="Add Enclosures" 
         sx={{ '& .MuiTypography-root': { fontSize: '13px', fontWeight: 500, color: '#374151', fontFamily: 'Inter' } }} 
       />
       {addEnclosures && (
         <Box sx={{ mt: 1, ml: 1 }}>
           <input 
             type="file" 
             ref={fileInputRef} 
             style={{ display: 'none' }} 
             multiple 
             onChange={handleFileUpload} 
           />
           <Button 
             startIcon={<CloudUploadOutlined sx={{ fontSize: '16px' }} />} 
             onClick={() => fileInputRef.current?.click()}
             sx={{ textTransform: 'none', color: '#2262ef', fontWeight: 500, fontSize: '13px', p: 0, fontFamily: 'Inter', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
           >
             Attach Files
           </Button>
           {attachedFiles.length > 0 && (
             <Box sx={{ mt: 1 }}>
               {attachedFiles.map((fname, fIdx) => (
                 <Typography key={fIdx} sx={{ fontSize: '12px', color: '#2262ef', fontFamily: 'Inter' }}>
                   📎 {fname}
                 </Typography>
               ))}
             </Box>
           )}
         </Box>
       )}
    </Box>
  );
};

export default Enclosures;
