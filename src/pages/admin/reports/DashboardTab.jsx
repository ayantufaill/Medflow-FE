import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Select,
  MenuItem
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import RightPanel from '../../../components/appointments/right-panel/RightPanel';
import RightPanelCollapsed from '../../../components/appointments/right-panel/RightPanelCollapsed';
import { reportingService } from '../../../services/reporting.service';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const defaultMetrics = {
  total: { pVal: 0, pGoal: 0, pPercent: 0, cVal: 0, cGoal: 0, cPercent: 0, gpVal: 0, gpGoal: 0, gpPercent: 0, gcVal: 0, gcGoal: 0, gcPercent: 0, perHourStr: '$0 (goal $0)', perVisitStr: '$0 (goal $0)' },
  dentist: { pVal: 0, pGoal: 0, pPercent: 0, cVal: 0, cGoal: 0, cPercent: 0, gpVal: 0, gpGoal: 0, gpPercent: 0, gcVal: 0, gcGoal: 0, gcPercent: 0, perHourStr: '$0 (goal $0)', perVisitStr: '$0 (goal $0)' },
  hygienist: { pVal: 0, pGoal: 0, pPercent: 0, cVal: 0, cGoal: 0, cPercent: 0, gpVal: 0, gpGoal: 0, gpPercent: 0, gcVal: 0, gcGoal: 0, gcPercent: 0, perHourStr: '$0 (goal $0)', perVisitStr: '$0 (goal $0)' },
  trends: {
    labels: [],
    totalProduction: Array(20).fill(0),
    treatmentProduction: Array(20).fill(0),
    hygieneProduction: Array(20).fill(0),
    totalProductionSummary: { percent: '0%', footer: 'Production Goal $0 · Actual $0 (0%)' },
    treatmentProductionSummary: { percent: '0%', footer: 'Tx Production Goal $0 · Actual $0 (0%)' },
    hygieneProductionSummary: { percent: '0%', footer: 'Hyg Production Goal $0 · Actual $0 (0%)' }
  },
  patients: {
    txPt: { count: '0', label: 'treatment visits', rows: [{ name: 'Completed', val: 0 }, { name: 'In chair', val: 0 }, { name: 'Rescheduled', val: 0 }] },
    hygPt: { count: '0', label: 'hygiene visits', rows: [{ name: 'Recare', val: 0 }, { name: 'Perio', val: 0 }, { name: 'New', val: 0 }] },
    newPt: { count: '0', label: 'patients today', rows: [{ name: 'Scheduled', val: 0 }, { name: 'Walk-in', val: 0 }, { name: 'No-show', val: 0 }] }
  },
  hygienePotential: {
    onTimeNoPreAppt: 0, onTimePreAppt: 0, noRecare: 0, flaggedNoRecare: 0, late12mAppt: 0, late12mBroken: 0, late12mNoAppt: 0
  },
  caseAcceptance: {
    newPt: { acceptanceRate: '0.00%', summaryText: '(0 Patient/s · $0 accepted)', statuses: { scheduled: 0, acceptedInProgress: 0, completed: 0, acceptedNotScheduled: 0, presented: 0, diagnosed: 0, rejected: 0, followUp: 0, reviewed: 0 } },
    existingPt: { acceptanceRate: '0.00%', summaryText: '(0 Patient/s · $0 accepted)', statuses: { scheduled: 0, acceptedInProgress: 0, completed: 0, acceptedNotScheduled: 0, presented: 0, diagnosed: 0, rejected: 0, followUp: 0, reviewed: 0 } }
  }
};

const DonutChart = ({ slices }) => {
  const total = slices.reduce((acc, s) => acc + (Number(s.value) || 0), 0);
  if (total === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2.5 }}>
        <svg width="155px" height="155px" viewBox="-3 -3 42 42">
          <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f1f5f9" strokeWidth="5.2" />
        </svg>
      </Box>
    );
  }

  let offset = 0;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2.5 }}>
      <svg width="155px" height="155px" viewBox="-3 -3 42 42">
        <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f1f5f9" strokeWidth="5.2" />
        {slices.map((slice, idx) => {
          const val = Number(slice.value) || 0;
          if (val === 0) return null;
          const pct = (val / total) * 100;
          const dashArray = `${pct} ${100 - pct}`;
          const dashOffset = -offset;
          offset += pct;
          return (
            <circle
              key={idx}
              cx="18"
              cy="18"
              r="15.9155"
              fill="transparent"
              stroke={slice.color}
              strokeWidth="5.2"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>
    </Box>
  );
};

const DashboardTab = () => {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [dateRange, setDateRange] = useState('Daily');
  const [provider, setProvider] = useState('All');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const centerDateRef = useRef(null);
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const validDate = currentDate && currentDate.isValid() ? currentDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
        const data = await reportingService.getDashboardMetrics({
          date: validDate,
          range: dateRange,
          providerId: provider
        });
        if (data) {
          setMetrics(prev => ({
            ...prev,
            ...data,
            trends: { ...prev.trends, ...data.trends },
            patients: { ...prev.patients, ...data.patients },
            hygienePotential: { ...prev.hygienePotential, ...data.hygienePotential },
            caseAcceptance: { ...prev.caseAcceptance, ...data.caseAcceptance }
          }));
        }
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [dateRange, provider, currentDate]);

  const colors = {
    navy: '#1a3a6b',
    gold: '#bc9363',
    blue: '#1d4ed8',
    cyan: '#0891b2',
    purple: '#7c3aed',
    greyBorder: '#cbd5e1',
    lightBg: '#f8fafc',
    textDark: '#1e293b',
    textMuted: '#64748b'
  };

  const compactSelectSx = {
    height: '34px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#1e293b',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '& .MuiSelect-select': { py: 0.5, px: 1.5, pr: '28px !important', display: 'flex', alignItems: 'center' },
  };

  const handlePrevDate = () => {
    const unit = dateRange === 'Daily' ? 'day' : dateRange === 'Weekly' ? 'week' : dateRange === 'Monthly' ? 'month' : 'year';
    setCurrentDate(prev => (prev && prev.isValid() ? prev : dayjs()).subtract(1, unit));
  };

  const handleNextDate = () => {
    const unit = dateRange === 'Daily' ? 'day' : dateRange === 'Weekly' ? 'week' : dateRange === 'Monthly' ? 'month' : 'year';
    setCurrentDate(prev => (prev && prev.isValid() ? prev : dayjs()).add(1, unit));
  };

  const renderProgressBarRow = (label, currentVal, goalVal, percentFill, forceRed = false) => {
    const isRed = forceRed && (Number(currentVal) > 0 || Number(goalVal) > 0);
    return (
      <Box
        sx={{
          height: 36,
          backgroundColor: isRed ? 'rgba(255, 228, 230, 0.8)' : 'rgba(240, 244, 249, 0.6)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          mb: 1.2
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: '19.5px',
            letterSpacing: '0px',
            verticalAlign: 'middle',
            color: isRed ? '#8B0836' : '#09121F'
          }}
        >
          {label} ${currentVal}
        </Typography>

        {goalVal ? (
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '19.5px',
              letterSpacing: '0px',
              verticalAlign: 'middle',
              color: '#5C646F'
            }}
          >
            | ${goalVal}
          </Typography>
        ) : null}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px', p: '8px', backgroundColor: '#f8f9fa', height: 'calc(100vh - 65px)', overflow: 'hidden', boxSizing: 'border-box', '@media print': { height: 'auto', overflow: 'visible', display: 'block' } }}>
      {/* Top Full-Width Filter Panel */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3.5,
          px: 2.5,
          py: 1.2,
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          flexShrink: 0,
          boxSizing: 'border-box'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: 500 }}>
            Date Range:
          </Typography>
          <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} sx={{ ...compactSelectSx, minWidth: 95 }}>
            <MenuItem value="Daily" sx={{ fontSize: '0.85rem' }}>Daily</MenuItem>
            <MenuItem value="Weekly" sx={{ fontSize: '0.85rem' }}>Weekly</MenuItem>
            <MenuItem value="Monthly" sx={{ fontSize: '0.85rem' }}>Monthly</MenuItem>
            <MenuItem value="Yearly" sx={{ fontSize: '0.85rem' }}>Yearly</MenuItem>
          </Select>
        </Box>

        <Box ref={centerDateRef} sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
          <IconButton size="small" onClick={handlePrevDate} sx={{ color: '#475569', p: 0.5, '&:hover': { bgcolor: '#f1f5f9' } }}>
            <KeyboardArrowLeftIcon fontSize="small" />
          </IconButton>
          <Typography 
            onClick={() => setDatePickerOpen(true)} 
            sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, cursor: 'pointer', userSelect: 'none', '&:hover': { textDecoration: 'underline', color: '#1a3a6b' } }}
          >
            {currentDate && currentDate.isValid() ? currentDate.format('MMM DD, YYYY') : dayjs().format('MMM DD, YYYY')}
          </Typography>
          <DatePicker
            value={currentDate && currentDate.isValid() ? currentDate : dayjs()}
            open={datePickerOpen}
            onClose={() => setDatePickerOpen(false)}
            onOpen={() => setDatePickerOpen(true)}
            onChange={(newValue) => {
              if (newValue && newValue.isValid()) {
                setCurrentDate(newValue);
              }
            }}
            slotProps={{
              popper: {
                anchorEl: centerDateRef.current,
                placement: 'bottom-start'
              },
              textField: {
                sx: {
                  display: 'none'
                }
              }
            }}
          />
          <IconButton size="small" onClick={handleNextDate} sx={{ color: '#475569', p: 0.5, '&:hover': { bgcolor: '#f1f5f9' } }}>
            <KeyboardArrowRightIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: 500 }}>
            Date:
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
            {dayjs().format('MM/DD/YYYY')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: 500 }}>
            Filter by provider:
          </Typography>
          <Select value={provider} onChange={(e) => setProvider(e.target.value)} sx={{ ...compactSelectSx, minWidth: 85 }}>
            <MenuItem value="All" sx={{ fontSize: '0.85rem' }}>All</MenuItem>

            <MenuItem value="Dentist" sx={{ fontSize: '0.85rem' }}>Dentist</MenuItem>
            <MenuItem value="Hygienist" sx={{ fontSize: '0.85rem' }}>Hygienist</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Bottom Content Area: Main Dashboard + Right Action Sidebar */}
      <Box sx={{ display: 'flex', flex: 1, gap: '8px', width: '100%', minHeight: 0, overflow: 'hidden' }}>
        {/* Main Dashboard Container */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 0.5, pb: 6, width: '100%', minWidth: 0, boxSizing: 'border-box', '@media print': { overflow: 'visible', height: 'auto', display: 'block' } }}>
          {/* Grid Layout Container - 4 Rows x 3 Columns */}
          <Grid container spacing={2.5} sx={{ mb: 2.5, flexWrap: 'nowrap' }}>

            {/* ================= ROW 1: Target Metrics (3 cards) ================= */}
            {[
              {
                title: 'Total', titleColor: '#0F172B', value: `$${metrics.total?.pVal ?? 0}`,
                pVal: metrics.total?.pVal ?? 0, pGoal: metrics.total?.pGoal || '', pPercent: metrics.total?.pPercent ?? 0,
                cVal: metrics.total?.cVal ?? 0, cGoal: metrics.total?.cGoal || '', cPercent: metrics.total?.cPercent ?? 0,
                gpVal: metrics.total?.gpVal ?? 0, gpGoal: metrics.total?.gpGoal || '', gpPercent: metrics.total?.gpPercent ?? 0,
                gcVal: metrics.total?.gcVal ?? 0, gcGoal: metrics.total?.gcGoal || '', gcPercent: metrics.total?.gcPercent ?? 0,
                perHour: metrics.total?.perHourStr || '$0 / $0', perVisit: metrics.total?.perVisitStr || '$0 / $0'
              },
              {
                title: 'Dentist', titleColor: '#00786F', value: `$${metrics.dentist?.pVal ?? 0}`,
                pVal: metrics.dentist?.pVal ?? 0, pGoal: metrics.dentist?.pGoal || '', pPercent: metrics.dentist?.pPercent ?? 0,
                cVal: metrics.dentist?.cVal ?? 0, cGoal: metrics.dentist?.cGoal || '', cPercent: metrics.dentist?.cPercent ?? 0,
                gpVal: metrics.dentist?.gpVal ?? 0, gpGoal: metrics.dentist?.gpGoal || '', gpPercent: metrics.dentist?.gpPercent ?? 0,
                gcVal: metrics.dentist?.gcVal ?? 0, gcGoal: metrics.dentist?.gcGoal || '', gcPercent: metrics.dentist?.gcPercent ?? 0,
                perHour: metrics.dentist?.perHourStr || '$0 / $0', perVisit: metrics.dentist?.perVisitStr || '$0 / $0'
              },
              {
                title: 'Hygienist', titleColor: '#7008E7', value: `$${metrics.hygienist?.pVal ?? 0}`,
                pVal: metrics.hygienist?.pVal ?? 0, pGoal: metrics.hygienist?.pGoal || '', pPercent: metrics.hygienist?.pPercent ?? 0,
                cVal: metrics.hygienist?.cVal ?? 0, cGoal: metrics.hygienist?.cGoal || '', cPercent: metrics.hygienist?.cPercent ?? 0,
                gpVal: metrics.hygienist?.gpVal ?? 0, gpGoal: metrics.hygienist?.gpGoal || '', gpPercent: metrics.hygienist?.gpPercent ?? 0,
                gcVal: metrics.hygienist?.gcVal ?? 0, gcGoal: metrics.hygienist?.gcGoal || '', gcPercent: metrics.hygienist?.gcPercent ?? 0,
                perHour: metrics.hygienist?.perHourStr || '$0 / $0', perVisit: metrics.hygienist?.perVisitStr || '$0 / $0'
              }
            ].map((card, idx) => (
              <Grid item xs={4} key={`metrics-${idx}`} sx={{ minWidth: 0, flexBasis: '33.3333%', maxWidth: '33.3333%' }}>
                <Paper
                  sx={{
                    p: 3,
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <Box>
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: 600, color: card.titleColor || '#0F172B', lineHeight: '32px', letterSpacing: '-0.6px', verticalAlign: 'middle', mb: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 2.5 }}>
                      {Number(card.pVal) > 0 && Number(card.pVal) >= Number(card.pGoal || 0) && Number(card.pGoal || 0) > 0 ? (
                        <Typography sx={{ color: '#10b981', fontSize: '0.9rem', lineHeight: 1, fontWeight: 700 }}>
                          ▲
                        </Typography>
                      ) : Number(card.pGoal) > 0 && Number(card.pVal) < Number(card.pGoal) ? (
                        <Typography sx={{ color: '#ef4444', fontSize: '0.9rem', lineHeight: 1, fontWeight: 700 }}>
                          ▼
                        </Typography>
                      ) : (
                        <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1, fontWeight: 700 }}>
                          •
                        </Typography>
                      )}
                      <Typography sx={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
                        {card.value}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {renderProgressBarRow('P', card.pVal, card.pGoal, card.pPercent)}
                      {renderProgressBarRow('C', card.cVal, card.cGoal, card.cPercent, Number(card.cGoal) > 0 && Number(card.cVal) < Number(card.cGoal))}
                      {renderProgressBarRow('GP', card.gpVal, card.gpGoal, card.gpPercent)}
                      {renderProgressBarRow('GC', card.gcVal, card.gcGoal, card.gcPercent)}
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 400, color: '#5C646F', lineHeight: '18px', letterSpacing: '0px', verticalAlign: 'middle' }}>
                      Production per hour {card.perHour}
                    </Typography>
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 400, color: '#5C646F', lineHeight: '18px', letterSpacing: '0px', verticalAlign: 'middle' }}>
                      Production per visit {card.perVisit}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ================= ROW 2: Production Vertical Line Charts (3 cards) ================= */}
          <Grid container spacing={2.5} sx={{ mb: 2.5, flexWrap: 'nowrap' }}>
            {[
              {
                title: 'Total Production',
                titleColor: '#0F172B',
                percent: metrics.trends?.totalProductionSummary?.percent || '0%',
                footer: metrics.trends?.totalProductionSummary?.footer || 'Production Goal $0 · Actual $0 (0%)'
              },
              {
                title: 'Treatment Production',
                titleColor: '#00786F',
                percent: metrics.trends?.treatmentProductionSummary?.percent || '0%',
                footer: metrics.trends?.treatmentProductionSummary?.footer || 'Tx Production Goal $0 · Actual $0 (0%)'
              },
              {
                title: 'Hygiene Production',
                titleColor: '#7008E7',
                percent: metrics.trends?.hygieneProductionSummary?.percent || '0%',
                footer: metrics.trends?.hygieneProductionSummary?.footer || 'Hyg Production Goal $0 · Actual $0 (0%)'
              }
            ].map((chart, idx) => {
              const numPct = parseInt((chart.percent || '0%').replace('%', ''), 10) || 0;
              const activeIdx = Math.min(19, Math.max(0, Math.round((numPct / 100) * 19)));
              return (
              <Grid item xs={4} key={`prod-${idx}`} sx={{ minWidth: 0, flexBasis: '33.3333%', maxWidth: '33.3333%' }}>
                <Paper
                  sx={{
                    p: 3,
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    height: 290,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                  }}
                >
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 600, color: chart.titleColor || '#0F172B', lineHeight: '28px', letterSpacing: '-0.5px', verticalAlign: 'middle' }}>
                    {chart.title}
                  </Typography>

                  {/* Vertical Pill Bars Chart */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', my: 2, px: 0.5, height: 145, position: 'relative' }}>
                    {[...Array(20)].map((_, i) => {
                      const isActive = i === activeIdx;
                      return (
                        <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 110,
                              borderRadius: 3,
                              backgroundColor: isActive ? '#0f172a' : '#f1f5f9',
                              transition: 'all 0.2s'
                            }}
                          />
                          {isActive && (
                            <Box sx={{ position: 'absolute', top: 116, whiteSpace: 'nowrap', zIndex: 5 }}>
                              <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                                {chart.percent}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Centered Footer */}
                  <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 400, color: '#5C646F', lineHeight: '18px', letterSpacing: '0px', verticalAlign: 'middle' }}>
                      {chart.footer}
                    </Typography>
                    {chart.provider && (
                      <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 400, color: '#5C646F', lineHeight: '18px', letterSpacing: '0px', verticalAlign: 'middle', mt: 0.2 }}>
                        {chart.provider}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
            })}
          </Grid>

          {/* ================= ROW 3: Patient Summary Status Blocks (3 cards) ================= */}
          <Grid container spacing={2.5} sx={{ mb: 2.5, flexWrap: 'nowrap' }}>
            {[
              {
                title: 'Tx Pt',
                color: '#00786F',
                count: metrics.patients?.txPt?.count || '0',
                label: metrics.patients?.txPt?.label || 'treatment visits',
                rows: metrics.patients?.txPt?.rows || []
              },
              {
                title: 'Hyg Pt',
                color: '#7008E7',
                count: metrics.patients?.hygPt?.count || '0',
                label: metrics.patients?.hygPt?.label || 'hygiene visits',
                rows: metrics.patients?.hygPt?.rows || []
              },
              {
                title: 'New Pt',
                color: '#0F172B',
                count: metrics.patients?.newPt?.count || '0',
                label: metrics.patients?.newPt?.label || 'patients today',
                rows: metrics.patients?.newPt?.rows || []
              }
            ].map((card, idx) => (
              <Grid item xs={4} key={`ptcards-${idx}`} sx={{ minWidth: 0, flexBasis: '33.3333%', maxWidth: '33.3333%' }}>
                <Paper
                  sx={{
                    p: 3,
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <Box>
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 600, color: card.color, lineHeight: '28px', letterSpacing: '0px', verticalAlign: 'middle', mb: 1.5 }}>
                      {card.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2.5 }}>
                      <Typography sx={{ fontSize: '2.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.02em' }}>
                        {card.count}
                      </Typography>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: '#64748b' }}>
                        {card.label}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      {card.rows.map((row, rIdx) => (
                        <Box
                          key={rIdx}
                          sx={{
                            height: 26,
                            backgroundColor: 'rgba(240, 244, 249, 0.6)',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 2
                          }}
                        >
                          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#5C646F', fontWeight: 500, lineHeight: '19.5px', verticalAlign: 'middle' }}>
                            {row.name}
                          </Typography>
                          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#09121F', fontWeight: 600, lineHeight: '19.5px', verticalAlign: 'middle' }}>
                            {row.val}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ================= ROW 4: Acceptance & Recare Charts (3 cards) ================= */}
          <Grid container spacing={2.5} sx={{ flexWrap: 'nowrap' }}>
            {/* Hygiene Interval Potential */}
            <Grid item xs={4} sx={{ minWidth: 0, flexBasis: '33.3333%', maxWidth: '33.3333%' }}>
              <Paper
                sx={{
                  p: 3,
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, minHeight: 45 }}>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: '#7008E7', lineHeight: '22.5px', letterSpacing: '0px', verticalAlign: 'middle', wordBreak: 'break-word' }}>
                    Hygiene Interval Potential
                  </Typography>
                </Box>

                <DonutChart
                  slices={[
                    { value: metrics.hygienePotential?.onTimeNoPreAppt ?? 0, color: '#a855f7' },
                    { value: metrics.hygienePotential?.onTimePreAppt ?? 0, color: '#d8b4fe' },
                    { value: metrics.hygienePotential?.noRecare ?? 0, color: '#3b82f6' },
                    { value: metrics.hygienePotential?.flaggedNoRecare ?? 0, color: '#93c5fd' },
                    { value: metrics.hygienePotential?.late12mAppt ?? 0, color: '#64748b' },
                    { value: metrics.hygienePotential?.late12mBroken ?? 0, color: '#1e293b' }
                  ]}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: `On-Time No Pre-appt (${metrics.hygienePotential?.onTimeNoPreAppt ?? 0})`, color: '#a855f7' },
                      { label: `On-Time Pre-appt (${metrics.hygienePotential?.onTimePreAppt ?? 0})`, color: '#d8b4fe' },
                      { label: `No Recare (${metrics.hygienePotential?.noRecare ?? 0})`, color: '#3b82f6' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: `Flagged No-Recare (${metrics.hygienePotential?.flaggedNoRecare ?? 0})`, color: '#93c5fd' },
                      { label: `Late >12 months Appt (${metrics.hygienePotential?.late12mAppt ?? 0})`, color: '#64748b' },
                      { label: `Late >12 months Broken (${metrics.hygienePotential?.late12mBroken ?? 0})`, color: '#1e293b' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* New Pt Case Acceptance */}
            <Grid item xs={4} sx={{ minWidth: 0, flexBasis: '33.3333%', maxWidth: '33.3333%' }}>
              <Paper
                sx={{
                  p: 3,
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 0.5, minHeight: 45 }}>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: '#09121F', lineHeight: '22.5px', letterSpacing: '0px', verticalAlign: 'middle', wordBreak: 'break-word' }}>
                    New Pt Case Acceptance ({metrics.caseAcceptance?.newPt?.acceptanceRate || '0.00%'})
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                    {metrics.caseAcceptance?.newPt?.summaryText || '(0 Patient/s)'}
                  </Typography>
                </Box>

                <DonutChart
                  slices={[
                    { value: metrics.caseAcceptance?.newPt?.statuses?.scheduled ?? 0, color: '#1e40af' },
                    { value: metrics.caseAcceptance?.newPt?.statuses?.acceptedInProgress ?? 0, color: '#3b82f6' },
                    { value: metrics.caseAcceptance?.newPt?.statuses?.presented ?? 0, color: '#60a5fa' },
                    { value: metrics.caseAcceptance?.newPt?.statuses?.reviewed ?? 0, color: '#bfdbfe' },
                    { value: metrics.caseAcceptance?.newPt?.statuses?.rejected ?? 0, color: '#ef4444' }
                  ]}
                />

                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: `Scheduled (${metrics.caseAcceptance?.newPt?.statuses?.scheduled ?? 0})`, color: '#1e40af' },
                      { label: `Accepted In Progress (${metrics.caseAcceptance?.newPt?.statuses?.acceptedInProgress ?? 0})`, color: '#3b82f6' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: `Presented (${metrics.caseAcceptance?.newPt?.statuses?.presented ?? 0})`, color: '#60a5fa' },
                      { label: `Pending Review (${metrics.caseAcceptance?.newPt?.statuses?.reviewed ?? 0})`, color: '#bfdbfe' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: `Declined (${metrics.caseAcceptance?.newPt?.statuses?.rejected ?? 0})`, color: '#ef4444' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Existing Pt Case Acceptance */}
            <Grid item xs={4} sx={{ minWidth: 0, flexBasis: '33.3333%', maxWidth: '33.3333%' }}>
              <Paper
                sx={{
                  p: 3,
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 0.5, minHeight: 45 }}>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: '#00786F', lineHeight: '22.5px', letterSpacing: '0px', verticalAlign: 'middle', wordBreak: 'break-word' }}>
                    Existing Pt Case Acceptance ({metrics.caseAcceptance?.existingPt?.acceptanceRate || '0.00%'})
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                    {metrics.caseAcceptance?.existingPt?.summaryText || '(0 Patient/s)'}
                  </Typography>
                </Box>

                <DonutChart
                  slices={[
                    { value: metrics.caseAcceptance?.existingPt?.statuses?.scheduled ?? 0, color: '#0d9488' },
                    { value: metrics.caseAcceptance?.existingPt?.statuses?.acceptedInProgress ?? 0, color: '#2dd4bf' },
                    { value: metrics.caseAcceptance?.existingPt?.statuses?.completed ?? 0, color: '#10b981' },
                    { value: metrics.caseAcceptance?.existingPt?.statuses?.acceptedNotScheduled ?? 0, color: '#a7f3d0' },
                    { value: metrics.caseAcceptance?.existingPt?.statuses?.presented ?? 0, color: '#334155' },
                    { value: metrics.caseAcceptance?.existingPt?.statuses?.diagnosed ?? 0, color: '#94a3b8' },
                    { value: metrics.caseAcceptance?.existingPt?.statuses?.rejected ?? 0, color: '#ef4444' },
                    { value: metrics.caseAcceptance?.existingPt?.statuses?.followUp ?? 0, color: '#f59e0b' },
                    { value: metrics.caseAcceptance?.existingPt?.statuses?.reviewed ?? 0, color: '#bbf7d0' }
                  ]}
                />

                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: `Scheduled (${metrics.caseAcceptance?.existingPt?.statuses?.scheduled ?? 0})`, color: '#0d9488' },
                      { label: `Accepted In Progress (${metrics.caseAcceptance?.existingPt?.statuses?.acceptedInProgress ?? 0})`, color: '#2dd4bf' },
                      { label: `Completed (${metrics.caseAcceptance?.existingPt?.statuses?.completed ?? 0})`, color: '#10b981' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.74rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: `Accepted Not Scheduled (${metrics.caseAcceptance?.existingPt?.statuses?.acceptedNotScheduled ?? 0})`, color: '#a7f3d0' },
                      { label: `Presented (${metrics.caseAcceptance?.existingPt?.statuses?.presented ?? 0})`, color: '#334155' },
                      { label: `Diagnosed (${metrics.caseAcceptance?.existingPt?.statuses?.diagnosed ?? 0})`, color: '#94a3b8' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.74rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: `Rejected (${metrics.caseAcceptance?.existingPt?.statuses?.rejected ?? 0})`, color: '#ef4444' },
                      { label: `Follow Up (${metrics.caseAcceptance?.existingPt?.statuses?.followUp ?? 0})`, color: '#f59e0b' },
                      { label: `Reviewed (${metrics.caseAcceptance?.existingPt?.statuses?.reviewed ?? 0})`, color: '#bbf7d0' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.74rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>

          </Grid>
        </Box>

        {/* Right Panel (aligned alongside just the main dashboard box below the top filter toolbar) */}
        {rightPanelOpen ? (
          <Box sx={{ flex: '0 0 320px', width: '320px', minWidth: '320px', maxWidth: '320px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', '@media print': { display: 'none' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <IconButton onClick={() => setRightPanelOpen(false)} sx={{ color: 'text.secondary', p: 0, '&:hover': { color: 'primary.main' } }}>
                <KeyboardDoubleArrowRightIcon fontSize="small" />
              </IconButton>
            </Box>
            <RightPanel />
          </Box>
        ) : (
          <Box sx={{ height: '100%', flexShrink: 0, '@media print': { display: 'none' } }}>
            <RightPanelCollapsed onExpand={() => setRightPanelOpen(true)} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardTab;