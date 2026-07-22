import { Box } from '@mui/material';
import { useState } from 'react';
import { COLORS } from '../../../constants/colors';
import { radius } from '../../../constants/styles';
import dayjs from 'dayjs';
import DayTasksHeader from './DayTasksHeader';
import TaskCategoryCard from './TaskCategoryCard';
import PatientTaskCard from './PatientTaskCard';
import CategorySummaryRow from './CategorySummaryRow';
import { MOCK_DAY_TASKS } from './mockDayTasks';

const DayTasksPage = () => {
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
        extraInfo: item.balance ? `Plan ID: ${item.patientId.replace('#', '')}` : undefined // Just using some mock extra info based on screenshot
      });
    });
  });
  
  const patientTasks = Array.from(patientMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Header Section */}
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

      {/* Scrollable Content Section */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        
        {viewMode === 'patient' && (
          <CategorySummaryRow categories={filteredTasks} />
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
    </Box>
  );
};
export default DayTasksPage;
