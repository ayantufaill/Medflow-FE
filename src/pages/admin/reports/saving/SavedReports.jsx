import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, IconButton, Link as MuiLink, CircularProgress } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { reportingService } from '../../../../services/reporting.service';

import { DragIndicator } from '@mui/icons-material';

const SavedReportCard = ({ title, count, reports = [] }) => {
  const navigate = useNavigate();
  const [localReports, setLocalReports] = useState([]);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    setLocalReports(reports);
  }, [reports]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Firefox requires some data to be set
      e.dataTransfer.setData('text/plain', index);
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newReports = [...localReports];
    const draggedItem = newReports[draggedIndex];
    newReports.splice(draggedIndex, 1);
    newReports.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setLocalReports(newReports);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: 350, 
        backgroundColor: '#f8f9fa', 
        boxShadow: 'none', 
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem', fontWeight: 500 }}>
            {count} report/s
          </Typography>
          <IconButton size="small" sx={{ p: 0, color: '#999' }}>
            <Edit sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography 
            variant="caption" 
            onClick={() => {
              if (isReordering) setDraggedIndex(null);
              setIsReordering(!isReordering);
            }}
            sx={{ 
              color: isReordering ? '#ef4444' : '#3b82f6', 
              fontSize: '0.75rem', 
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' } 
            }}
          >
            {isReordering ? 'Done' : 'Re-order'}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ 
        flexGrow: 1,
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' }
      }}>
        {localReports.map((report, index) => (
          <Box 
            key={`${report._id || report.name}-${index}`}
            draggable={isReordering}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 1.5,
              cursor: isReordering ? 'grab' : 'pointer',
              backgroundColor: draggedIndex === index ? '#f8fafc' : (isReordering ? '#ffffff' : 'transparent'),
              boxShadow: draggedIndex === index ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
              p: isReordering ? 1 : 0,
              borderRadius: isReordering ? 1 : 0,
              border: draggedIndex === index ? '1px solid #3b82f6' : (isReordering ? '1px dashed #cbd5e1' : 'none'),
              '&:active': { cursor: isReordering ? 'grabbing' : 'pointer' },
            }}
          >
            {isReordering && (
              <DragIndicator sx={{ color: '#94a3b8', fontSize: 16, mr: 1 }} />
            )}
            <Typography 
              sx={{ 
                color: '#3b82f6', 
                fontSize: '0.8rem',
                lineHeight: 1.4,
                cursor: !isReordering ? 'pointer' : 'inherit',
                '&:hover': { textDecoration: !isReordering ? 'underline' : 'none' }
              }}
              onClick={() => {
                if (!isReordering && report.kind === 'Financial' && report.filters?.some(f => f.type === 'patientPayTypes')) {
                  const isSummary = report.filters?.some(f => f.type === 'isSummary' && f.value === true);
                  if (isSummary) {
                    navigate('/admin/reports/financial/deposit-summary', { state: { templateData: report } });
                  } else {
                    navigate('/admin/reports/financial/deposit-slips', { state: { templateData: report } });
                  }
                }
              }}
            >
              {report.name}
            </Typography>
          </Box>
        ))}
        {localReports.length === 0 && (
          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
            No reports saved.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const SavedReports = () => {
  const [loading, setLoading] = useState(true);
  const [dailyReports, setDailyReports] = useState([]);
  const [weeklyReports, setWeeklyReports] = useState([]);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [yearlyReports, setYearlyReports] = useState([]);
  const [agingReports, setAgingReports] = useState([]);
  const [customReports, setCustomReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportingService.getSavedReports();
        
        const daily = [];
        const weekly = [];
        const monthly = [];
        const yearly = [];
        const aging = [];
        const custom = [];

        if (data && data.length > 0) {
          data.forEach(report => {
            const name = report.name;
            const lowerName = name.toLowerCase();
            
            if (lowerName.includes('daily')) {
              daily.push(report);
            } else if (lowerName.includes('weekly')) {
              weekly.push(report);
            } else if (lowerName.includes('monthly')) {
              monthly.push(report);
            } else if (lowerName.includes('yearly')) {
              yearly.push(report);
            } else if (lowerName.includes('aging')) {
              aging.push(report);
            } else {
              custom.push(report);
            }
          });
        }

        setDailyReports(daily);
        setWeeklyReports(weekly);
        setMonthlyReports(monthly);
        setYearlyReports(yearly);
        setAgingReports(aging);
        setCustomReports(custom);
      } catch (error) {
        console.error("Failed to fetch saved reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <Box sx={{ p: 4, backgroundColor: '#fff', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a3a6b', mb: 6, fontSize: '1.25rem' }}>
        Saved Reports
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr'
          },
          gap: 4,
          alignItems: 'start'
        }}>
          <SavedReportCard title="Daily" count={dailyReports.length} reports={dailyReports} />
          <SavedReportCard title="Weekly" count={weeklyReports.length} reports={weeklyReports} />
          <SavedReportCard title="Monthly" count={monthlyReports.length} reports={monthlyReports} />
          <SavedReportCard title="Yearly" count={yearlyReports.length} reports={yearlyReports} />
          <SavedReportCard title="Aging" count={agingReports.length} reports={agingReports} />
          <SavedReportCard title="Custom" count={customReports.length} reports={customReports} />
        </Box>
      )}
    </Box>
  );
};

export default SavedReports;
