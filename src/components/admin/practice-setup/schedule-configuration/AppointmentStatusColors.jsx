import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Select, MenuItem } from '@mui/material';
import ScheduleConfigCard from './ScheduleConfigCard';
import ApptStatusColorIcon from '../../../../assets/scheduleconfigurationicon/appointmentstatuscolor.svg';
import EditSvg from '../../../../assets/practicesetupicon/editicon.svg';

const INITIAL_STATUS_COLORS = [
  { name: "Unconfirmed", color1: "#f3f4f6", color2: "", anim: "None" },
  { name: "Preconfirmed", color1: "#3b82f6", color2: "", anim: "None" },
  { name: "Confirmed", color1: "#22c55e", color2: "", anim: "None" },
  { name: "Arrived", color1: "#eab308", color2: "#fef08a", anim: "Moving Stripes" },
  { name: "Ready To Be Seated", color1: "#eab308", color2: "#fef08a", anim: "On/Off" },
  { name: "Seated", color1: "#22c55e", color2: "#bbf7d0", anim: "Moving Stripes" },
  { name: "Ready For Doctor", color1: "#3b82f6", color2: "#bfdbfe", anim: "Moving Stripes" },
  { name: "In Treatment", color1: "#f472b6", color2: "", anim: "None" },
  { name: "Ready For Checkout", color1: "#374151", color2: "#9ca3af", anim: "Moving Stripes" },
  { name: "Checked out incomplete", color1: "#4b5563", color2: "", anim: "None" },
  { name: "Checked out complete", color1: "#9ca3af", color2: "", anim: "None" },
  { name: "Call", color1: "#ef4444", color2: "", anim: "None" },
  { name: "Left message", color1: "#f59e0b", color2: "", anim: "None" },
  { name: "Running Late", color1: "#92400e", color2: "", anim: "None" },
  { name: "Sent Email Or Text", color1: "#8b5cf6", color2: "", anim: "None" },
  { name: "Late", color1: "#ef4444", color2: "#fecaca", anim: "Moving Stripes" },
];

const AppointmentStatusColors = ({ statusColors, setStatusColors }) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editFormData, setEditFormData] = useState(null);

  const handleEditClick = (index, row) => {
    setEditingIndex(index);
    setEditFormData({ ...row });
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditFormData(null);
  };

  const handleSaveEdit = (index) => {
    const updatedColors = [...statusColors];
    updatedColors[index] = editFormData;
    setStatusColors(updatedColors);
    setEditingIndex(-1);
    setEditFormData(null);
  };

  const handleResetAll = () => {
    setStatusColors(INITIAL_STATUS_COLORS);
    setEditingIndex(-1);
  };

  const resetAction = (
    <Button 
      onClick={handleResetAll}
      variant="outlined" 
      size="small" 
      sx={{ 
        textTransform: 'none', 
        borderRadius: '4px', 
        color: '#11223F', 
        borderColor: '#e0e0e0', 
        bgcolor: '#fff', 
        fontSize: '11px', 
        fontWeight: 600,
        '&:hover': { bgcolor: '#f8f9fa' }
      }}
    >
      Reset All
    </Button>
  );

  return (
    <ScheduleConfigCard 
      title="Appointment Status Colors" 
      subtitle="Color and animation per appointment status"
      icon={ApptStatusColorIcon} 
      action={resetAction}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700 }}>STATUS NAME</TableCell>
              <TableCell align="center" sx={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700 }}>COLOR 1</TableCell>
              <TableCell align="center" sx={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700 }}>COLOR 2</TableCell>
              <TableCell sx={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700 }}>ANIMATION</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statusColors?.map((row, index) => {
              const isEditing = editingIndex === index;
              return (
                <TableRow key={index} sx={{ '& td': { py: 1.5, borderBottom: '1px solid #f3f4f6' } }}>
                  <TableCell sx={{ fontSize: '12px' }}>{row.name}</TableCell>
                  
                  {/* COLOR 1 */}
                  <TableCell align="center">
                    {isEditing ? (
                      <input 
                        type="color" 
                        value={editFormData.color1} 
                        onChange={(e) => setEditFormData({...editFormData, color1: e.target.value})}
                        style={{ width: '20px', height: '20px', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '4px' }}
                      />
                    ) : (
                      <Box sx={{ width: 16, height: 16, bgcolor: row.color1, borderRadius: '4px', mx: 'auto', border: '1px solid #e5e7eb' }} />
                    )}
                  </TableCell>

                  {/* COLOR 2 */}
                  <TableCell align="center">
                    {isEditing ? (
                      <input 
                        type="color" 
                        value={editFormData.color2 || '#ffffff'} 
                        onChange={(e) => setEditFormData({...editFormData, color2: e.target.value})}
                        style={{ width: '20px', height: '20px', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '4px' }}
                      />
                    ) : (
                      row.color2 ? <Box sx={{ width: 16, height: 16, bgcolor: row.color2, borderRadius: '4px', mx: 'auto', border: '1px solid #e5e7eb' }} /> : null
                    )}
                  </TableCell>

                  {/* ANIMATION */}
                  <TableCell sx={{ fontSize: '12px', color: '#9ca3af' }}>
                    {isEditing ? (
                      <Select 
                        size="small" 
                        value={editFormData.anim} 
                        onChange={(e) => setEditFormData({...editFormData, anim: e.target.value})}
                        sx={{ fontSize: '12px', height: '24px' }}
                      >
                        <MenuItem value="None" sx={{ fontSize: '12px' }}>None</MenuItem>
                        <MenuItem value="Moving Stripes" sx={{ fontSize: '12px' }}>Moving Stripes</MenuItem>
                        <MenuItem value="On/Off" sx={{ fontSize: '12px' }}>On/Off</MenuItem>
                      </Select>
                    ) : (
                      row.anim
                    )}
                  </TableCell>

                  {/* ACTION */}
                  <TableCell align="center">
                    {isEditing ? (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Typography onClick={() => handleSaveEdit(index)} sx={{ color: '#3b82f6', fontSize: '12px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Save</Typography>
                        <Typography onClick={handleCancelEdit} sx={{ color: '#ef4444', fontSize: '12px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Cancel</Typography>
                      </Box>
                    ) : (
                      <Box 
                        onClick={() => handleEditClick(index, row)}
                        sx={{ 
                          width: 24, height: 24, borderRadius: '4px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', cursor: 'pointer', '&:hover': { bgcolor: '#f3f4f6' }
                        }}
                      >
                        <img src={EditSvg} alt="edit" width="16" height="16" />
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </ScheduleConfigCard>
  );
};

export default AppointmentStatusColors;
