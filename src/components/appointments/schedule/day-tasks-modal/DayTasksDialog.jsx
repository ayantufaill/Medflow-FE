import React, { useState } from 'react';
import { Dialog, DialogContent, Box, DialogTitle, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import dayjs from 'dayjs';
import { COLORS } from '../../../../constants/colors';
import DayTasksHeader from '../../../../pages/appointments/DayTasks/DayTasksHeader';
import TaskCategoryCard from '../../../../pages/appointments/DayTasks/TaskCategoryCard';
import PatientTaskCard from '../../../../pages/appointments/DayTasks/PatientTaskCard';
import CategorySummaryRow from '../../../../pages/appointments/DayTasks/CategorySummaryRow';
import { MOCK_DAY_TASKS } from '../../../../pages/appointments/DayTasks/mockDayTasks';

const DayTasksDialog = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().toISOString());
  const [selectedTask, setSelectedTask] = useState('All Tasks');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('task'); // 'task' or 'patient'

  const handlePrev = () => setSelectedDate(dayjs(selectedDate).subtract(1, 'day').toISOString());
  const handleNext = () => setSelectedDate(dayjs(selectedDate).add(1, 'day').toISOString());
  const handleToday = () => setSelectedDate(dayjs().toISOString());
  const handleDateSelect = (newDate) => setSelectedDate(newDate.toISOString());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const taskOptions = MOCK_DAY_TASKS.map(c => c.title);

  // Apply filters
  const filteredTasks = MOCK_DAY_TASKS.map(category => {
    if (selectedTask !== 'All Tasks' && category.title !== selectedTask) return null;

    const filteredItems = category.items.filter(item => {
      if (selectedPatient && item.name !== selectedPatient) return false;
      return true;
    });

    if (filteredItems.length === 0) return null;

    return { ...category, items: filteredItems, count: filteredItems.length };
  }).filter(Boolean);

  // Derive Patient View Data
  const patientMap = new Map();
  filteredTasks.forEach(category => {
    category.items.forEach(item => {
      if (!patientMap.has(item.name)) {
        patientMap.set(item.name, {
          name: item.name,
          patientId: item.patientId,
          tasks: []
        });
      }
      patientMap.get(item.name).tasks.push({
        categoryTitle: category.title,
        icons: item.icons,
        extraInfo: item.balance ? `Plan ID: ${item.patientId.replace('#', '')}` : undefined
      });
    });
  });
  
  const patientTasks = Array.from(patientMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          border: '1px solid #e0e5eb',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          minHeight: '80vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex", alignItems: "center", gap: "12px",
          px: "10px", py: "10px",
          borderBottom: "1px solid #e0e5eb", flexShrink: 0,
          backgroundColor: "#f3f8fd",
          m: 0,
        }}
      >
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <PersonAddOutlinedIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Huddle / Day Tasks
          </Typography>
        </Box>

        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280", ml: 1 }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: '#fff' }}>
        {/* Header Section (Sticky) */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff', pt: 3, px: 3 }}>
          <DayTasksHeader 
            selectedDate={selectedDate}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            onDateSelect={handleDateSelect}
            selectedTask={selectedTask}
            onTaskChange={setSelectedTask}
            selectedPatient={selectedPatient}
            onPatientChange={setSelectedPatient}
            taskOptions={taskOptions}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </Box>

        {/* Scrollable Content Section */}
        <Box sx={{ px: 3, pb: 3 }}>
          {viewMode === 'patient' && (
            <Box sx={{ mb: 3 }}>
              <CategorySummaryRow categories={filteredTasks} />
            </Box>
          )}

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
            gap: 3,
            alignItems: 'start'
          }}>
            {viewMode === 'task' ? (
              filteredTasks.length > 0 ? (
                filteredTasks.map(category => (
                  <TaskCategoryCard key={category.id} category={category} />
                ))
              ) : (
                <Box sx={{ p: 4, gridColumn: '1 / -1', textAlign: 'center', color: COLORS.TEXT_SECONDARY }}>
                  No tasks match your filters.
                </Box>
              )
            ) : (
              patientTasks.length > 0 ? (
                patientTasks.map(patient => (
                  <PatientTaskCard key={patient.name} patient={patient} />
                ))
              ) : (
                <Box sx={{ p: 4, gridColumn: '1 / -1', textAlign: 'center', color: COLORS.TEXT_SECONDARY }}>
                  No patients match your filters.
                </Box>
              )
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <Box sx={{ p: "12px 24px", borderTop: '1px solid #e0e5eb', backgroundColor: '#fff', display: 'flex', justifyContent: 'flex-end', mt: 'auto', flexShrink: 0 }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={onClose}
          sx={{ 
            borderColor: "#d0d5dd",
            color: "#374151",
            fontFamily: "Inter",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
            textTransform: "none",
            borderRadius: "8px",
            px: "16px", py: "7px",
            height: 36,
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default DayTasksDialog;
