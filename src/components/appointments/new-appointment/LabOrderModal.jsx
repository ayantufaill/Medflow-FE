import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, Box, Typography, IconButton, TextField, Select, MenuItem, Button, Checkbox, FormControlLabel, FormControl
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { 
  Close, DeleteOutline, FormatBold, FormatItalic, FormatAlignLeft, 
  FormatAlignCenter, FormatAlignRight, EmojiEmotionsOutlined, CloudUploadOutlined,
  Add, FormatColorText, Colorize, Undo, Redo, ScienceOutlined
} from '@mui/icons-material';

const LabOrderModal = ({ open, onClose, procedures = [] }) => {
  const [lab, setLab] = useState('none');
  const [template, setTemplate] = useState('none');
  const [dueDate, setDueDate] = useState(null);
  
  // Canvas drawing state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      setIsDrawing(true);
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
    }
  };
  
  // Set default canvas styles
  useEffect(() => {
    if (open && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, [open]);
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ zIndex: 1400 }} PaperProps={{ sx: { borderRadius: '12px', border: "1px solid #e0e5eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" } }}>
      
      {/* Header matching AppointmentModalHeader */}
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "20px", py: "14px",
        borderBottom: "1px solid #e0e5eb", flexShrink: 0,
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <ScienceOutlined sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f"
          }}>
            Lab Order
          </Typography>
          <Typography sx={{
            color: "#5c646f", fontFamily: "Inter", fontSize: "11px", mt: 0.5
          }}>
            Create and attach a new lab slip for this appointment.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
          <Close sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>
      
      <Box sx={{ p: 4, pt: 3 }}>
        {/* Active Procedure Table */}
        <Box sx={{ mb: 4, width: '60%' }}>
          <Box sx={{ display: 'flex', borderBottom: '1px solid #e5e7eb', pb: 1, mb: 1 }}>
            <Typography sx={{ width: '60%', fontWeight: 600, color: '#6b7280', fontSize: '11px', fontFamily: 'Inter', textTransform: 'uppercase' }}>Active Procedure</Typography>
            <Typography sx={{ width: '40%', fontWeight: 600, color: '#6b7280', fontSize: '11px', fontFamily: 'Inter', textTransform: 'uppercase' }}>Procedure Cost</Typography>
          </Box>
          {procedures.length === 0 ? (
            <Typography sx={{ fontSize: '13px', color: '#6b7280', py: 1, fontFamily: 'Inter' }}>No active procedures.</Typography>
          ) : (
            procedures.map((proc, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #f3f4f6', pb: 1 }}>
                <Typography sx={{ width: '60%', color: '#09121f', fontSize: '13px', fontWeight: 500, fontFamily: 'Inter' }}>
                  {proc.treatment || 'Unknown Procedure'} {proc.code !== 'TBD' ? proc.code : ''}
                </Typography>
                <Box sx={{ width: '40%', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField 
                    size="small" 
                    defaultValue={proc.charge || '$0.00'} 
                    sx={{ width: '80px', '& .MuiOutlinedInput-root': { height: '28px', fontSize: '13px', fontFamily: 'Inter', borderRadius: '6px' } }} 
                  />
                  <IconButton size="small" sx={{ color: '#ef4444', p: 0 }}>
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
        
        {/* Dropdowns */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#374151', fontFamily: 'Inter' }}>Choose Lab <span style={{ color: '#ef4444' }}>*</span></Typography>
          <FormControl size="small" sx={{ width: '250px', mb: 3 }}>
            <Select value={lab} onChange={(e) => setLab(e.target.value)} sx={{ fontSize: '13px', height: '36px', fontFamily: 'Inter', borderRadius: '8px' }}>
              <MenuItem value="none" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>None</MenuItem>
              <MenuItem value="lab1" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Dental Arts Lab</MenuItem>
              <MenuItem value="lab2" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Glidewell Laboratories</MenuItem>
            </Select>
          </FormControl>
          
          <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#374151', fontFamily: 'Inter' }}>Choose Template</Typography>
          <FormControl size="small" sx={{ width: '250px' }}>
            <Select value={template} onChange={(e) => setTemplate(e.target.value)} sx={{ fontSize: '13px', height: '36px', fontFamily: 'Inter', borderRadius: '8px' }}>
              <MenuItem value="none" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>None</MenuItem>
              <MenuItem value="crown" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Crown Template</MenuItem>
              <MenuItem value="denture" sx={{ fontSize: '13px', fontFamily: 'Inter' }}>Denture Template</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Editor Mock */}
        <Box sx={{ border: '1px solid #d0d5dd', borderRadius: '8px', mb: 4, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderBottom: '1px solid #d0d5dd', bgcolor: '#f9fafb', flexWrap: 'wrap' }}>
             <Undo sx={{ fontSize: '18px', color: '#6b7280', cursor: 'pointer' }} />
             <Redo sx={{ fontSize: '18px', color: '#6b7280', cursor: 'pointer' }} />
             <Box sx={{ width: '1px', height: '16px', bgcolor: '#d0d5dd', mx: 0.5 }} />
             <FormatBold sx={{ fontSize: '18px', color: '#374151', cursor: 'pointer' }} />
             <FormatItalic sx={{ fontSize: '18px', color: '#374151', cursor: 'pointer' }} />
             <FormatAlignLeft sx={{ fontSize: '18px', color: '#374151', cursor: 'pointer' }} />
             <FormatAlignCenter sx={{ fontSize: '18px', color: '#374151', cursor: 'pointer' }} />
             <FormatAlignRight sx={{ fontSize: '18px', color: '#374151', cursor: 'pointer' }} />
             <Box sx={{ width: '1px', height: '16px', bgcolor: '#d0d5dd', mx: 0.5 }} />
             
             <Typography sx={{ fontSize: '13px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', fontFamily: 'Inter' }}>Paragraph ▾</Typography>
             <Typography sx={{ fontSize: '13px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', fontFamily: 'Inter' }}>10pt ▾</Typography>
             <Typography sx={{ fontSize: '13px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', fontFamily: 'Inter' }}>Lato ▾</Typography>
             <Box sx={{ width: '1px', height: '16px', bgcolor: '#d0d5dd', mx: 0.5 }} />
             
             <FormatColorText sx={{ fontSize: '18px', color: '#374151', cursor: 'pointer' }} />
             <Colorize sx={{ fontSize: '18px', color: '#374151', cursor: 'pointer' }} />
             <EmojiEmotionsOutlined sx={{ fontSize: '18px', color: '#374151', cursor: 'pointer' }} />
          </Box>
          <TextField 
            multiline 
            minRows={5} 
            fullWidth 
            variant="standard" 
            InputProps={{ disableUnderline: true, sx: { p: 2, fontSize: '13px', fontFamily: 'Inter' } }}
          />
        </Box>
        
        {/* Due Date */}
        <Box sx={{ mb: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              label={<span style={{ fontFamily: 'Inter' }}>Due Date <span style={{ color: '#ef4444' }}>*</span></span>}
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{ 
                textField: { 
                  size: 'small', 
                  sx: { width: '250px', '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter' } },
                  InputLabelProps: { shrink: true, sx: { fontFamily: 'Inter' } }
                } 
              }}
            />
          </LocalizationProvider>
          <Typography sx={{ color: '#22c55e', fontSize: '12px', mt: 1, fontFamily: 'Inter' }}>
            Based on the Lab's turn around time the case should arrive on time
          </Typography>
        </Box>
        
        {/* Instructions/Notes & History */}
        <Box sx={{ display: 'flex', gap: 6, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
             <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#374151', fontFamily: 'Inter' }}>Instructions/Notes</Typography>
             <TextField size="small" placeholder="Add Note..." fullWidth 
                sx={{ '& .MuiOutlinedInput-root': { height: '36px', fontSize: '13px', fontFamily: 'Inter', borderRadius: '8px' } }}
                InputProps={{
                  endAdornment: <IconButton size="small"><Add sx={{ fontSize: '18px', color: '#6b7280' }} /></IconButton>
                }}
             />
             
             <Typography sx={{ fontSize: '12px', fontWeight: 600, mt: 4, mb: 1, color: '#374151', fontFamily: 'Inter' }}>Provider Signature</Typography>
             <Typography sx={{ fontSize: '12px', color: '#6b7280', mb: 1, fontFamily: 'Inter' }}>Draw your signature</Typography>
             <Box sx={{ border: '1px solid #d0d5dd', borderRadius: '8px', width: '100%', height: '160px', mb: 1, overflow: 'hidden' }}>
                <canvas 
                  ref={canvasRef} 
                  width={400} 
                  height={160} 
                  style={{ cursor: 'crosshair', width: '100%', height: '100%', touchAction: 'none' }} 
                  onMouseDown={startDrawing}
                  onMouseUp={finishDrawing}
                  onMouseMove={draw}
                  onMouseLeave={finishDrawing}
                />
             </Box>
             <Button variant="outlined" size="small" sx={{ color: '#374151', borderColor: '#d0d5dd', textTransform: 'none', borderRadius: '6px', fontSize: '12px', fontFamily: 'Inter', '&:hover': { bgcolor: '#f9fafb', borderColor: '#9ca3af' } }} onClick={handleClearSignature}>Clear signature</Button>
          </Box>
          <Box sx={{ flex: 1 }}>
             <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1, color: '#374151', fontFamily: 'Inter' }}>History</Typography>
             {/* Empty history area space */}
          </Box>
        </Box>
        
        {/* Enclosures */}
        <Box sx={{ mb: 1 }}>
           <FormControlLabel 
             control={<Checkbox size="small" sx={{ color: '#d0d5dd', '&.Mui-checked': { color: '#2262ef' } }} />} 
             label="Add Enclosures" 
             sx={{ '& .MuiTypography-root': { fontSize: '13px', fontWeight: 500, color: '#374151', fontFamily: 'Inter' } }} 
           />
           <Box sx={{ mt: 1, ml: 1 }}>
             <Button startIcon={<CloudUploadOutlined sx={{ fontSize: '16px' }} />} sx={{ textTransform: 'none', color: '#2262ef', fontWeight: 500, fontSize: '13px', p: 0, fontFamily: 'Inter', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
               Attach Files
             </Button>
           </Box>
        </Box>
      </Box>
      
      {/* Footer matching AppointmentFooter */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        px: "20px", py: "12px", borderTop: "1px solid #e0e5eb", gap: "8px"
      }}>
        <Button 
          variant="outlined" 
          onClick={onClose} 
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          disableElevation
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            "&:hover": { backgroundColor: "#1a50cc" },
          }}
        >
          Create slip
        </Button>
      </Box>
    </Dialog>
  );
};
export default LabOrderModal;
