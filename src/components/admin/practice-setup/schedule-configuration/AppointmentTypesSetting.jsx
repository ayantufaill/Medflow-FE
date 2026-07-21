import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClearIcon from '@mui/icons-material/Clear';
import ScheduleConfigCard from './ScheduleConfigCard';
import ApptTypesSettingIcon from '../../../../assets/scheduleconfigurationicon/appointmenttypesetting.svg';

const INITIAL_TYPES = [
  { type: "Crown/bridge prep", providers: 3, time: "90 mins" },
  { type: "Periodic Ortho check", providers: 2, time: "30 mins" },
  { type: "Hygiene + Exam", providers: 2, time: "60 mins" },
  { type: "SRP", providers: 1, time: "120 mins" },
  { type: "Crown Delivery", providers: 2, time: "60 mins" },
  { type: "Invisalign bond", providers: 1, time: "60 mins" },
  { type: "Doctor new patient exam", providers: 2, time: "60 mins" },
  { type: "Hygiene new patient exam", providers: 2, time: "60 mins" },
  { type: "Composite 1-3 teeth", providers: 2, time: "60 mins" },
  { type: "Provisional swap", providers: 2, time: "65 mins" },
  { type: "Hygiene-no exam", providers: 1, time: "60 mins" },
  { type: "Limited Exam", providers: 2, time: "45 mins" },
  { type: "Implant scan 1-2 implants", providers: 3, time: "60 mins" },
  { type: "Implant delivery 1-2 implants", providers: 2, time: "60 mins" },
  { type: "New Patient Comp Exam", providers: 2, time: "60 mins" },
  { type: "Full arch prep", providers: 2, time: "180 mins" },
  { type: "Post op photos", providers: 2, time: "30 mins" },
];

const AppointmentTypesSetting = ({ apptTypes, setApptTypes }) => {
  if (!apptTypes) return null;
  const [defaultColorsOpen, setDefaultColorsOpen] = useState(true);
  
  const [defaultColors, setDefaultColors] = useState({
    dentist: '#22c55e',
    hygienist: '#3b82f6',
    assistant: '#eab308'
  });

  const [editingIndex, setEditingIndex] = useState(-1);
  const [editFormData, setEditFormData] = useState(null);

  const handleAddType = () => {
    const newType = { type: "New Appointment Type", providers: 1, time: "60 mins" };
    setApptTypes([newType, ...apptTypes]);
    setEditingIndex(0);
    setEditFormData(newType);
  };

  const handleDeleteType = (index) => {
    setApptTypes(apptTypes.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(-1);
  };

  const handleEditClick = (index, row) => {
    setEditingIndex(index);
    setEditFormData({ ...row });
  };

  const handleSaveEdit = (index) => {
    const updated = [...apptTypes];
    updated[index] = editFormData;
    setApptTypes(updated);
    setEditingIndex(-1);
  };

  const addAction = (
    <Button 
      onClick={handleAddType}
      variant="contained" 
      color="primary" 
      size="small" 
      sx={{ 
        textTransform: 'none', 
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        boxShadow: 'none'
      }}
    >
      + Add Appointment Type
    </Button>
  );

  return (
    <ScheduleConfigCard 
      title="Appointment Types Settings" 
      subtitle="Procedures available for scheduling"
      icon={ApptTypesSettingIcon} 
      action={addAction}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, pb: 2 }}>TYPE</TableCell>
              <TableCell align="center" sx={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, pb: 2 }}># OF PROVIDERS</TableCell>
              <TableCell align="center" sx={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, pb: 2 }}>TOTAL TIME</TableCell>
              <TableCell align="center" sx={{ pb: 2 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apptTypes.map((appt, i) => {
              const isEditing = editingIndex === i;
              return (
                <TableRow key={i} sx={{ '& td': { py: 1.5, borderBottom: '1px solid #f3f4f6' } }}>
                  {/* TYPE */}
                  <TableCell sx={{ fontSize: '12px' }}>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editFormData.type} 
                        onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                        style={{ padding: '4px', fontSize: '12px', width: '100%' }}
                      />
                    ) : (
                      <Typography 
                        onClick={() => handleEditClick(i, appt)}
                        sx={{ color: '#3b82f6', fontSize: '12px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      >
                        {appt.type}
                      </Typography>
                    )}
                  </TableCell>
                  
                  {/* PROVIDERS */}
                  <TableCell align="center" sx={{ fontSize: '12px', color: '#4b5563' }}>
                    {isEditing ? (
                      <input 
                        type="number" 
                        value={editFormData.providers} 
                        onChange={(e) => setEditFormData({...editFormData, providers: e.target.value})}
                        style={{ padding: '4px', fontSize: '12px', width: '50px', textAlign: 'center' }}
                      />
                    ) : (
                      appt.providers
                    )}
                  </TableCell>
                  
                  {/* TOTAL TIME */}
                  <TableCell align="center" sx={{ fontSize: '12px', color: '#4b5563' }}>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editFormData.time} 
                        onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                        style={{ padding: '4px', fontSize: '12px', width: '70px', textAlign: 'center' }}
                      />
                    ) : (
                      appt.time
                    )}
                  </TableCell>
                  
                  {/* ACTION */}
                  <TableCell align="center">
                    {isEditing ? (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Typography onClick={() => handleSaveEdit(i)} sx={{ color: '#22c55e', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Save</Typography>
                        <Typography onClick={() => handleDeleteType(i)} sx={{ color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Cancel</Typography>
                      </Box>
                    ) : (
                      <Box 
                        onClick={() => handleDeleteType(i)}
                        sx={{ 
                          width: 18, height: 18, bgcolor: '#ef4444', borderRadius: '4px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', cursor: 'pointer', '&:hover': { bgcolor: '#dc2626' }
                        }}
                      >
                        <ClearIcon sx={{ color: '#fff', fontSize: '14px' }} />
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Appointment Types Default Colors Accordion */}
      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f3f4f6' }}>
        <Box 
          onClick={() => setDefaultColorsOpen(!defaultColorsOpen)}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mb: defaultColorsOpen ? 1.5 : 0 }}
        >
          {defaultColorsOpen ? <KeyboardArrowUpIcon sx={{ color: '#6b7280', fontSize: '18px' }} /> : <KeyboardArrowDownIcon sx={{ color: '#6b7280', fontSize: '18px' }} />}
          <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#11223F', textTransform: 'uppercase' }}>
            APPOINTMENT TYPES DEFAULT COLORS
          </Typography>
        </Box>
        
        <Collapse in={defaultColorsOpen}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 0.5 }}>
            {[
              { key: 'dentist', label: 'Dentist' },
              { key: 'hygienist', label: 'Hygienist' },
              { key: 'assistant', label: 'Assistant' },
            ].map((role) => (
              <Box key={role.key} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <input 
                  type="color" 
                  value={defaultColors[role.key]} 
                  onChange={(e) => setDefaultColors(prev => ({...prev, [role.key]: e.target.value}))}
                  style={{ width: '14px', height: '14px', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '3px' }}
                />
                <Typography sx={{ fontSize: '12px', color: '#4b5563' }}>{role.label}</Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    </ScheduleConfigCard>
  );
};

export default AppointmentTypesSetting;
