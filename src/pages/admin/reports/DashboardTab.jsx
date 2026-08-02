import React, { useState } from 'react';
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

const DashboardTab = () => {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [dateRange, setDateRange] = useState('Daily');
  const [provider, setProvider] = useState('All');
  const [currentDate, setCurrentDate] = useState('May 22, 2026');

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
    setCurrentDate('May 21, 2026');
  };

  const handleNextDate = () => {
    setCurrentDate('May 23, 2026');
  };

  const renderProgressBarRow = (label, currentVal, goalVal, percentFill, isRed = false) => {
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

        {goalVal && (
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
        )}
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={handlePrevDate} sx={{ color: '#475569', p: 0.5, '&:hover': { bgcolor: '#f1f5f9' } }}>
            <KeyboardArrowLeftIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
            {currentDate}
          </Typography>
          <IconButton size="small" onClick={handleNextDate} sx={{ color: '#475569', p: 0.5, '&:hover': { bgcolor: '#f1f5f9' } }}>
            <KeyboardArrowRightIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: 500 }}>
            Date:
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
            05/22/2026
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
                title: 'Total', titleColor: '#0F172B', value: '$0',
                pVal: '0', pGoal: '1,400', pPercent: 0,
                cVal: '328.67', cGoal: '1,372', cPercent: 24,
                gpVal: '0', gpGoal: '', gpPercent: 0,
                gcVal: '328.67', gcGoal: '', gcPercent: 24,
                perHour: '$0 (goal $200)', perVisit: '$0 (goal $0)'
              },
              {
                title: 'Dentist', titleColor: '#00786F', value: '$0',
                pVal: '0', pGoal: '1,400', pPercent: 0,
                cVal: '266.67', cGoal: '1,372', cPercent: 19,
                gpVal: '0', gpGoal: '', gpPercent: 0,
                gcVal: '266.67', gcGoal: '', gcPercent: 19,
                perHour: '$0 (goal $200)', perVisit: '$0 (goal $0)'
              },
              {
                title: 'Hygienist', titleColor: '#7008E7', value: '$0',
                pVal: '0', pGoal: '', pPercent: 0,
                cVal: '62', cGoal: '', cPercent: 10,
                gpVal: '0', gpGoal: '', gpPercent: 0,
                gcVal: '62', gcGoal: '', gcPercent: 10,
                perHour: '$0 (goal $0)', perVisit: '$0 (goal $0)'
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
                      <Typography sx={{ color: '#ef4444', fontSize: '0.9rem', lineHeight: 1, fontWeight: 700 }}>
                        ▼
                      </Typography>
                      <Typography sx={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
                        {card.value}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {renderProgressBarRow('P', card.pVal, card.pGoal, card.pPercent)}
                      {renderProgressBarRow('C', card.cVal, card.cGoal, card.cPercent, true)}
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
                percent: '68%',
                activeIdx: 13,
                footer: 'Production Goal 1,400 · Actual $952 (68%)'
              },
              {
                title: 'Treatment Production',
                titleColor: '#00786F',
                percent: '68%',
                activeIdx: 13,
                footer: 'Tx Production Goal 1,400 · Actual $952 (68%)'
              },
              {
                title: 'Hygiene Production',
                titleColor: '#7008E7',
                percent: '0%',
                activeIdx: 0,
                footer: 'Hyg Production Goal 0 · Actual $0 (0%)'
              }
            ].map((chart, idx) => (
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
                      const isActive = i === chart.activeIdx;
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
            ))}
          </Grid>

          {/* ================= ROW 3: Patient Summary Status Blocks (3 cards) ================= */}
          <Grid container spacing={2.5} sx={{ mb: 2.5, flexWrap: 'nowrap' }}>
            {[
              {
                title: 'Tx Pt',
                color: '#00786F',
                count: '11',
                label: 'treatment visits',
                rows: [
                  { name: 'Completed', val: 7 },
                  { name: 'In chair', val: 2 },
                  { name: 'Rescheduled', val: 2 }
                ]
              },
              {
                title: 'Hyg Pt',
                color: '#7008E7',
                count: '9',
                label: 'hygiene visits',
                rows: [
                  { name: 'Recare', val: 6 },
                  { name: 'Perio', val: 2 },
                  { name: 'New', val: 1 }
                ]
              },
              {
                title: 'New Pt',
                color: '#0F172B',
                count: '6',
                label: 'patients today',
                rows: [
                  { name: 'Scheduled', val: 4 },
                  { name: 'Walk-in', val: 1 },
                  { name: 'No-show', val: 1 }
                ]
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
                  justifyContent: 'space-between',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: '#7008E7', lineHeight: '22.5px', letterSpacing: '0px', verticalAlign: 'middle', wordBreak: 'break-word' }}>
                    Hygiene Interval Potential
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2.5 }}>
                  <svg width="155px" height="155px" viewBox="-3 -3 42 42">
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#a855f7" strokeWidth="5.2" strokeDasharray="7 93" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#d8b4fe" strokeWidth="5.2" strokeDasharray="38 62" strokeDashoffset="-7" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#3b82f6" strokeWidth="5.2" strokeDasharray="40 60" strokeDashoffset="-45" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#1e293b" strokeWidth="5.2" strokeDasharray="15 85" strokeDashoffset="-85" />
                  </svg>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: 'On-Time No Pre-appt (23)', color: '#a855f7' },
                      { label: 'On-Time Pre-appt (187)', color: '#d8b4fe' },
                      { label: 'No Recare (162)', color: '#3b82f6' }
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
                      { label: 'Flagged No-Recare (1)', color: '#93c5fd' },
                      { label: 'Late >12 months Appt (1)', color: '#64748b' },
                      { label: 'Late >12 months Broken (43)', color: '#1e293b' }
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
                  justifyContent: 'space-between',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: '#09121F', lineHeight: '22.5px', letterSpacing: '0px', verticalAlign: 'middle', wordBreak: 'break-word' }}>
                    New Pt Case Acceptance (62.50%)
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                    (8 Patient/s · $2,450 accepted)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2.5 }}>
                  <svg width="155px" height="155px" viewBox="-3 -3 42 42">
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#1e40af" strokeWidth="5.2" strokeDasharray="30 70" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#3b82f6" strokeWidth="5.2" strokeDasharray="35 65" strokeDashoffset="-30" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#bfdbfe" strokeWidth="5.2" strokeDasharray="28 72" strokeDashoffset="-65" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#ef4444" strokeWidth="5.2" strokeDasharray="7 93" strokeDashoffset="-93" />
                  </svg>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, minWidth: 0 }}>
                    {[
                      { label: 'Scheduled', color: '#1e40af' },
                      { label: 'Accepted ($2,450)', color: '#3b82f6' }
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
                      { label: 'Presented', color: '#60a5fa' },
                      { label: 'Pending Review', color: '#bfdbfe' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 0.8, minWidth: 0 }}>
                    {[
                      { label: 'Declined', color: '#ef4444' }
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
                  justifyContent: 'space-between',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 600, color: '#00786F', lineHeight: '22.5px', letterSpacing: '0px', verticalAlign: 'middle', wordBreak: 'break-word' }}>
                    Existing Pt Case Acceptance (100.00%)
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                    (1 Patient/s)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2.5 }}>
                  <svg width="155px" height="155px" viewBox="-3 -3 42 42">
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#0d9488" strokeWidth="5.2" strokeDasharray="15 85" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#10b981" strokeWidth="5.2" strokeDasharray="30 70" strokeDashoffset="-15" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#a7f3d0" strokeWidth="5.2" strokeDasharray="8 92" strokeDashoffset="-45" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#334155" strokeWidth="5.2" strokeDasharray="12 88" strokeDashoffset="-53" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#94a3b8" strokeWidth="5.2" strokeDasharray="20 80" strokeDashoffset="-65" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#ef4444" strokeWidth="5.2" strokeDasharray="6 94" strokeDashoffset="-85" />
                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f59e0b" strokeWidth="5.2" strokeDasharray="9 91" strokeDashoffset="-91" />
                  </svg>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1.1, minWidth: 0 }}>
                    {[
                      { label: 'Scheduled', color: '#0d9488' },
                      { label: 'Accepted In Progress', color: '#2dd4bf' },
                      { label: 'Completed ($100)', color: '#10b981' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.74rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1.2, minWidth: 0 }}>
                    {[
                      { label: 'Accepted Not Scheduled', color: '#a7f3d0' },
                      { label: 'Presented', color: '#334155' },
                      { label: 'Diagnosed', color: '#94a3b8' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.74rem', color: '#475569', fontWeight: 500, lineHeight: 1.25, wordBreak: 'break-word' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, flex: 0.9, minWidth: 0 }}>
                    {[
                      { label: 'Rejected', color: '#ef4444' },
                      { label: 'Follow Up', color: '#f59e0b' },
                      { label: 'Reviewed', color: '#bbf7d0' }
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