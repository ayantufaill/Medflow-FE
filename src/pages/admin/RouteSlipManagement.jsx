import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateSystemSetting } from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { 
  Box, Typography, Button, IconButton, Grid, Paper, Chip, Divider, Stack,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { 
  Edit as EditIcon,
  FormatBold, FormatItalic, FormatUnderlined, 
  FormatListBulleted, FormatListNumbered, 
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight, 
  Link as LinkIcon, Close as CloseIcon 
} from '@mui/icons-material';
import EditSvg from '../../assets/practicesetupicon/editicon.svg';
import medflowLogo from '../../assets/medflow-logo.png';
import dayjs from 'dayjs';
import DynamicRouteSlipRenderer from '../../components/common/DynamicRouteSlipRenderer';

const sectionHeaderStyle = {
  backgroundColor: '#f3f8fd',
  border: '1px solid #d9e2ef',
  padding: '6px 12px',
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#1e3a5f',
  textTransform: 'uppercase'
};

const sectionBodyStyle = {
  border: '1px solid #d9e2ef',
  borderTop: 'none',
  backgroundColor: '#fff',
  padding: '12px'
};

const InfoRow = ({ label, value, align = 'left' }) => (
  <Box sx={{ display: 'flex', gap: 1, mb: 0.75, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>
    <Box sx={{ minWidth: 132, fontWeight: 700, color: '#1f2937', whiteSpace: 'nowrap' }}>{label}:</Box>
    <Box sx={{ flex: 1, color: '#475569', textAlign: align, wordBreak: 'break-word' }}>{value || '-'}</Box>
  </Box>
);

const VarChip = ({ label }) => (
  <Chip 
    label={label} 
    size="small" 
    sx={{ 
      backgroundColor: '#eff6ff', 
      color: '#2563eb', 
      borderRadius: '4px', 
      fontSize: '11px',
      fontWeight: 600,
      height: '20px',
      mr: 0.5,
      mb: 0.5,
      '& .MuiChip-label': { px: 1 }
    }} 
  />
);

const BlockVar = ({ label }) => (
  <div style={{ 
    padding: '8px', backgroundColor: '#eff6ff', color: '#2563eb', 
    borderRadius: '4px', fontSize: '11px', fontWeight: 600, 
    textAlign: 'center', border: '1px dashed #2563eb', width: '100%' 
  }}>
    {label}
  </div>
);

const ViewMode = () => {
  const mockPatient = {
    firstName: 'Megan "Meggy"',
    lastName: 'Beck',
    dateOfBirth: '1990-01-01',
    email: 'megan-beck@example.com',
    phonePrimary: '(111) 222-3333',
    address: '123 Main Street, San Jose, CA 95051',
    preferredDentist: 'Dr. Jane Doe',
    preferredHygienist: 'Dr. John Smith',
    referralSource: 'Dr. Richard Roe'
  };

  const mockAppointment = {
    appointmentDate: dayjs('2026-10-01 11:00').toISOString(),
    time: '11:00 AM',
    provider: 'Dr. Jane Doe',
    room: { name: 'Room 1' },
    status: 'Scheduled'
  };

  const mockProcedures = [
    { code: 'D0120', description: 'periodic oral evaluation - established patient', provider: 'Dr. Jane Doe', fee: 60, insEst: 40, ptEst: 20, status: 'Treatment Plan', created: '10/01/2026', site: '-' },
    { code: 'D5120', description: 'complete denture - mandibular', provider: 'Dr. Jane Doe', fee: 60, insEst: 50, ptEst: 10, status: 'Treatment Plan', created: '10/01/2026', site: '28, 29' }
  ];

  const mockInsurances = [
    { insuranceCompany: { name: 'Delta Dental' }, subscriberId: '123456789', groupNumber: '98765' }
  ];

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4, position: 'relative' }}>
      <Paper elevation={1} sx={{ width: '900px', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden', p: 3.5 }}>
        <DynamicRouteSlipRenderer 
          patient={mockPatient} 
          appointment={mockAppointment} 
          procedures={mockProcedures} 
          insurances={mockInsurances} 
          planTitle="Treatment Plan"
        />
      </Paper>
    </Box>
  );
};

const EditMode = ({ onCancel, onSave, editorRef }) => {
  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const preventFocusLoss = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Editor Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography 
            onClick={() => handleFormat('formatBlock', 'H1')} 
            onMouseDown={preventFocusLoss}
            sx={{ fontWeight: 600, fontSize: '14px', px: 1, mr: 1, cursor: 'pointer', '&:hover': { color: '#2563eb' } }}
          >
            H1
          </Typography>
          <Typography 
            onClick={() => handleFormat('formatBlock', 'H2')} 
            onMouseDown={preventFocusLoss}
            sx={{ fontWeight: 600, fontSize: '14px', px: 1, mr: 1, cursor: 'pointer', '&:hover': { color: '#2563eb' } }}
          >
            H2
          </Typography>
          <IconButton size="small" onClick={() => handleFormat('bold')} onMouseDown={preventFocusLoss}><FormatBold fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => handleFormat('italic')} onMouseDown={preventFocusLoss}><FormatItalic fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => handleFormat('underline')} onMouseDown={preventFocusLoss}><FormatUnderlined fontSize="small" /></IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton size="small" onClick={() => handleFormat('insertUnorderedList')} onMouseDown={preventFocusLoss}><FormatListBulleted fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => handleFormat('insertOrderedList')} onMouseDown={preventFocusLoss}><FormatListNumbered fontSize="small" /></IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton size="small" onClick={() => handleFormat('justifyLeft')} onMouseDown={preventFocusLoss}><FormatAlignLeft fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => handleFormat('justifyCenter')} onMouseDown={preventFocusLoss}><FormatAlignCenter fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => handleFormat('justifyRight')} onMouseDown={preventFocusLoss}><FormatAlignRight fontSize="small" /></IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton size="small" onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) handleFormat('createLink', url);
          }} onMouseDown={preventFocusLoss}><LinkIcon fontSize="small" /></IconButton>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', gap: 1.5, pr: 1 }}>
          <Button variant="outlined" onClick={onCancel} sx={{ textTransform: 'none', borderRadius: '8px', px: 3, height: '34px' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onSave} disableElevation sx={{ textTransform: 'none', borderRadius: '8px', px: 3, height: '34px', bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}>
            Save
          </Button>
        </Box>
      </Box>

      {/* Editor Canvas */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper ref={editorRef} elevation={1} sx={{ width: '900px', p: 3.5, borderRadius: 2, bgcolor: '#fff', border: '1px dashed #cbd5e1', minHeight: '800px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '24px' }}>
            <img src={medflowLogo} alt="Medflow Logo" style={{ height: '45px', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div><VarChip label="Appointment Date" /></div>
            <div contentEditable suppressContentEditableWarning style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: 0, outline: 'none', borderBottom: '1px dashed #94a3b8' }}>
              PATIENT ROUTE SLIP
            </div>
            <div><VarChip label="Patient Full Name" /></div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div contentEditable suppressContentEditableWarning style={{ ...sectionHeaderStyle, outline: 'none' }}>PATIENT</div>
            <div style={sectionBodyStyle}>
              <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '50%', paddingRight: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Name:</div><VarChip label="Patient Name" /></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Address:</div><VarChip label="Patient Address" /></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Date of Birth:</div><VarChip label="Patient DOB" /></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Email:</div><VarChip label="Patient Email" /></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Phone Number:</div><VarChip label="Patient Phone" /></div>
                </div>
                <div style={{ width: '50%' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Preferred Dentist:</div><VarChip label="Preferred Dentist" /></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Preferred Hygienist:</div><VarChip label="Preferred Hygienist" /></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Referring Sources:</div><VarChip label="Referral Source" /></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div contentEditable suppressContentEditableWarning style={{ ...sectionHeaderStyle, outline: 'none' }}>ACCOUNT</div>
              <div style={{ ...sectionBodyStyle, minHeight: '98px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Treatment Total:</div><div style={{ flex: 1, textAlign: 'right' }}><VarChip label="Total Fee" /></div></div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Insurance Est:</div><div style={{ flex: 1, textAlign: 'right' }}><VarChip label="Total Ins Est" /></div></div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '132px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Patient Est:</div><div style={{ flex: 1, textAlign: 'right' }}><VarChip label="Total Pt Est" /></div></div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div contentEditable suppressContentEditableWarning style={{ ...sectionHeaderStyle, outline: 'none' }}>INSURANCE</div>
              <div style={{ ...sectionBodyStyle, minHeight: '98px' }}>
                <BlockVar label="Active Insurances List" />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ ...sectionHeaderStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div contentEditable suppressContentEditableWarning style={{ outline: 'none', fontWeight: 700, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif' }}>APPOINTMENT OF</div> <VarChip label="Appointment Date" />
            </div>
            <div style={sectionBodyStyle}>
              <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '33.33%', paddingRight: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '80px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Time:</div><VarChip label="Appt Time" /></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '80px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Plan:</div><VarChip label="Plan Title" /></div>
                </div>
                <div style={{ width: '33.33%', paddingRight: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '80px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Provider:</div><VarChip label="Appt Provider" /></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '80px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Room:</div><VarChip label="Appt Room" /></div>
                </div>
                <div style={{ width: '33.33%' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '80px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Procedures:</div><VarChip label="Procedure Count" /></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}><div contentEditable suppressContentEditableWarning style={{ minWidth: '80px', fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', outline: 'none' }}>Status:</div><VarChip label="Appt Status" /></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div contentEditable suppressContentEditableWarning style={{ ...sectionHeaderStyle, outline: 'none' }}>TREATMENT PLAN PROCEDURES</div>
            <div style={{ border: '1px solid #d9e2ef', borderTop: 'none', padding: '16px' }}>
              <BlockVar label="Treatment Procedures Table" />
            </div>
          </div>

          <div>
            <div contentEditable suppressContentEditableWarning style={{ ...sectionHeaderStyle, outline: 'none' }}>NEXT APPOINTMENT</div>
            <div style={{ ...sectionBodyStyle, textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
              <BlockVar label="Next Appointment Info" />
            </div>
          </div>
        </Paper>
      </Box>
    </Box>
  );
};

const RouteSlipManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleSave = async () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      try {
        await dispatch(updateSystemSetting({
          key: 'route_slip_template_config',
          value: htmlContent
        })).unwrap();
        showSnackbar('Route slip template saved successfully', 'success');
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to save route slip template:', err);
        showSnackbar('Failed to save route slip template', 'error');
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 4, pt: 4, mb: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B', mb: 0.5 }}>Route Slip</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Manage your patient route slip template.</Typography>
        </Box>
        {!isEditing && (
          <Button 
            variant="outlined" 
            startIcon={<img src={EditSvg} alt="Edit" style={{ width: 16, height: 16 }} />} 
            onClick={handleEdit} 
            sx={{ 
              textTransform: 'none', borderRadius: '8px', 
              px: 2.5, height: '36px', bgcolor: '#fff',
              fontFamily: 'Inter, sans-serif', fontWeight: 500
            }}
          >
            Edit Template
          </Button>
        )}
      </Box>

      {isEditing ? (
        <EditMode onCancel={handleCancel} onSave={handleSave} editorRef={editorRef} />
      ) : (
        <ViewMode />
      )}
    </Box>
  );
};

export default RouteSlipManagement;
