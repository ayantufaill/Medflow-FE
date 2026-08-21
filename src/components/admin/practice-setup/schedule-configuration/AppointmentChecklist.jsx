import { useState } from 'react';
import { Box, Typography, Collapse, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoIcon from '@mui/icons-material/Info';
import ScheduleConfigCard from './ScheduleConfigCard';
import ApptChecklistIcon from '../../../../assets/scheduleconfigurationicon/appointmentchecklist.svg';
import DeleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';

const AppointmentChecklist = ({ 
  preApptChecklist, 
  checkInChecklist, 
  checkOutChecklist,
  handleAddItem,
  handleDeleteItem
}) => {
  const [checklistsOpen, setChecklistsOpen] = useState(true);

  const actionButtons = (
    <Typography sx={{ color: '#3b82f6', fontSize: '12px', fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
      Update Existing Checklists
    </Typography>
  );

  return (
    <ScheduleConfigCard 
      title="Appointment Checklists" 
      subtitle="Tasks tied to each stage of the visit"
      icon={ApptChecklistIcon} 
      action={actionButtons}
    >
      <Box 
        onClick={() => setChecklistsOpen(!checklistsOpen)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mb: checklistsOpen ? 3 : 0 }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#11223F', textTransform: 'uppercase' }}>
          APPOINTMENT CHECKLISTS
        </Typography>
        {checklistsOpen ? <KeyboardArrowUpIcon sx={{ color: '#6b7280', fontSize: '18px' }} /> : <KeyboardArrowDownIcon sx={{ color: '#6b7280', fontSize: '18px' }} />}
      </Box>
      
      <Collapse in={checklistsOpen}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, lg: 5 }, width: '100%', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {/* Pre-appointment */}
          <Box sx={{ width: '320px', flexShrink: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#11223F', mb: 2 }}>Pre-appointment Checklist</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {preApptChecklist.map((item, index) => (
                <Box key={`pre-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #f3f4f6', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ fontSize: '12px', color: '#4b5563' }}>{item}</Typography>
                  <Box 
                    onClick={() => handleDeleteItem('preAppt', index)}
                    sx={{ 
                      width: 24, height: 24, borderRadius: '4px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', '&:hover': { bgcolor: '#f3f4f6' },
                      flexShrink: 0, ml: 2
                    }}
                  >
                    <img src={DeleteSvg} alt="delete" width="16" height="16" />
                  </Box>
                </Box>
              ))}
              <Typography 
                onClick={() => handleAddItem('preAppt')} 
                sx={{ mt: 2, fontSize: '12px', color: '#3b82f6', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                + Add
              </Typography>
            </Box>
          </Box>

          {/* Check-in */}
          <Box sx={{ width: '320px', flexShrink: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#11223F', mb: 2 }}>Check-in Checklist</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {checkInChecklist.map((item, index) => (
                <Box key={`in-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #f3f4f6', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ fontSize: '12px', color: '#4b5563' }}>{item}</Typography>
                  <Box 
                    onClick={() => handleDeleteItem('checkIn', index)}
                    sx={{ 
                      width: 24, height: 24, borderRadius: '4px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', '&:hover': { bgcolor: '#f3f4f6' },
                      flexShrink: 0, ml: 2
                    }}
                  >
                    <img src={DeleteSvg} alt="delete" width="16" height="16" />
                  </Box>
                </Box>
              ))}
              <Typography 
                onClick={() => handleAddItem('checkIn')} 
                sx={{ mt: 2, fontSize: '12px', color: '#3b82f6', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                + Add
              </Typography>
            </Box>
          </Box>

          {/* Check-out */}
          <Box sx={{ width: '320px', flexShrink: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#11223F', mb: 2 }}>Check-out Checklist</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {checkOutChecklist.map((item, index) => (
                <Box key={`out-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #f3f4f6', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ fontSize: '12px', color: '#4b5563' }}>{item}</Typography>
                  <Box 
                    onClick={() => handleDeleteItem('checkOut', index)}
                    sx={{ 
                      width: 24, height: 24, borderRadius: '4px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', '&:hover': { bgcolor: '#f3f4f6' },
                      flexShrink: 0, ml: 2
                    }}
                  >
                    <img src={DeleteSvg} alt="delete" width="16" height="16" />
                  </Box>
                </Box>
              ))}
              <Typography 
                onClick={() => handleAddItem('checkOut')} 
                sx={{ mt: 2, fontSize: '12px', color: '#3b82f6', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                + Add
              </Typography>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </ScheduleConfigCard>
  );
};

export default AppointmentChecklist;
