import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, IconButton, CircularProgress, Chip } from '@mui/material';
import { Edit, DragIndicator, BookmarkBorder } from '@mui/icons-material';
import { reportingService } from '../../../../services/reporting.service';
import { ReportLayout } from '../../../../components/reports/ui';

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
        height: 350,
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2.5,
          py: 1.5,
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#f8fafc',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
            {title}
          </Typography>
          <Chip
            label={count}
            size="small"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              fontWeight: 700,
              bgcolor: '#e2e8f0',
              color: '#64748b',
              '& .MuiChip-label': { px: 0.8 },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ p: 0.3, color: '#94a3b8', '&:hover': { color: '#64748b' } }}>
            <Edit sx={{ fontSize: 14 }} />
          </IconButton>
          <Typography
            variant="caption"
            onClick={() => {
              if (isReordering) setDraggedIndex(null);
              setIsReordering(!isReordering);
            }}
            sx={{
              color: isReordering ? '#ef4444' : '#3b82f6',
              fontSize: '0.7rem',
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {isReordering ? 'Done' : 'Re-order'}
          </Typography>
        </Box>
      </Box>

      {/* Card Body */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' },
        }}
      >
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
              mb: 0.5,
              px: 1,
              py: 0.75,
              borderRadius: '6px',
              cursor: isReordering ? 'grab' : 'pointer',
              backgroundColor:
                draggedIndex === index
                  ? '#eff6ff'
                  : isReordering
                  ? '#f8fafc'
                  : 'transparent',
              border:
                draggedIndex === index
                  ? '1px solid #bfdbfe'
                  : isReordering
                  ? '1px dashed #e2e8f0'
                  : '1px solid transparent',
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: isReordering ? '#f8fafc' : '#f0f9ff',
              },
              '&:active': { cursor: isReordering ? 'grabbing' : 'pointer' },
            }}
          >
            {isReordering && (
              <DragIndicator sx={{ color: '#94a3b8', fontSize: 14, mr: 1, flexShrink: 0 }} />
            )}
            <Typography
              sx={{
                color: '#3b82f6',
                fontSize: '0.78rem',
                fontWeight: 500,
                lineHeight: 1.4,
                cursor: !isReordering ? 'pointer' : 'inherit',
                '&:hover': { textDecoration: !isReordering ? 'underline' : 'none' },
              }}
              onClick={() => {
                if (
                  !isReordering &&
                  report.kind === 'Financial' &&
                  report.filters?.some((f) => f.type === 'patientPayTypes')
                ) {
                  const isSummary = report.filters?.some(
                    (f) => f.type === 'isSummary' && f.value === true
                  );
                  if (isSummary) {
                    navigate('/admin/reports/financial/deposit-summary', {
                      state: { templateData: report },
                    });
                  } else {
                    navigate('/admin/reports/financial/deposit-slips', {
                      state: { templateData: report },
                    });
                  }
                }
              }}
            >
              {report.name}
            </Typography>
          </Box>
        ))}

        {localReports.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              py: 4,
              gap: 1,
            }}
          >
            <BookmarkBorder sx={{ fontSize: 28, color: '#cbd5e1' }} />
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>
              No reports saved.
            </Typography>
          </Box>
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
          data.forEach((report) => {
            const lowerName = report.name.toLowerCase();
            if (lowerName.includes('daily')) daily.push(report);
            else if (lowerName.includes('weekly')) weekly.push(report);
            else if (lowerName.includes('monthly')) monthly.push(report);
            else if (lowerName.includes('yearly')) yearly.push(report);
            else if (lowerName.includes('aging')) aging.push(report);
            else custom.push(report);
          });
        }

        setDailyReports(daily);
        setWeeklyReports(weekly);
        setMonthlyReports(monthly);
        setYearlyReports(yearly);
        setAgingReports(aging);
        setCustomReports(custom);
      } catch (error) {
        console.error('Failed to fetch saved reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <ReportLayout title="Saved Reports:">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr',
            },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <SavedReportCard title="Daily" count={dailyReports.length} reports={dailyReports} />
          <SavedReportCard title="Weekly" count={weeklyReports.length} reports={weeklyReports} />
          <SavedReportCard title="Monthly" count={monthlyReports.length} reports={monthlyReports} />
          <SavedReportCard title="Yearly" count={yearlyReports.length} reports={yearlyReports} />
          <SavedReportCard title="Aging" count={agingReports.length} reports={agingReports} />
          <SavedReportCard title="Custom" count={customReports.length} reports={customReports} />
        </Box>
      )}
    </ReportLayout>
  );
};

export default SavedReports;
