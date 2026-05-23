import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const DashboardTab = () => {
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

  const handlePrevDate = () => {
    setCurrentDate('May 21, 2026');
  };

  const handleNextDate = () => {
    setCurrentDate('May 23, 2026');
  };

  const renderProgressBarRow = (label, currentVal, goalVal, percentFill, isRed = false) => {
    return (
      <Box sx={{ mb: 0.3 }}>
        <Box
          sx={{
            height: 18,
            backgroundColor: '#cccccc',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            px: 1,
            borderBottom: '1px solid #ffffff'
          }}
        >
          {percentFill > 0 && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${percentFill}%`,
                backgroundColor: isRed ? '#e07c7c' : '#b3b3b3',
                zIndex: 1
              }}
            />
          )}

          <Typography
            sx={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#ffffff',
              zIndex: 2,
              position: 'relative'
            }}
          >
            {label} ${currentVal}
          </Typography>

          {goalVal && (
            <Typography
              sx={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#ffffff',
                position: 'absolute',
                right: '5%',
                zIndex: 2
              }}
            >
              | ${goalVal}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ pb: 6, px: 3, width: '100%', boxSizing: 'border-box', backgroundColor: '#ffffff' }}>
      {/* Top Filter Panel */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          py: 1.5,
          mb: 4,
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textDark, fontWeight: 500 }}>
            Date Range:
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textDark, fontWeight: 600, cursor: 'pointer' }}>
            Daily ▾
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={handlePrevDate} sx={{ color: '#475569', p: 0 }}>
            <KeyboardArrowLeftIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 600 }}>
            {currentDate}
          </Typography>
          <IconButton size="small" onClick={handleNextDate} sx={{ color: '#475569', p: 0 }}>
            <KeyboardArrowRightIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textDark, fontWeight: 500 }}>
            Date:
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textDark, fontWeight: 600 }}>
            05/22/2026
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textMuted }}>
            Filter by provider:
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: colors.textDark, fontWeight: 600, cursor: 'pointer' }}>
            All ▾
          </Typography>
        </Box>
      </Box>

      {/* Grid Layout Container - 4 Rows x 3 Columns */}
      <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>

        {/* ================= ROW 1: Target Metrics (3 cards) ================= */}
        {[
          {
            title: 'Total', value: '$0', borderColor: colors.navy,
            pVal: '0', pGoal: '1,400', pPercent: 0,
            cVal: '328.67', cGoal: '1,372', cPercent: 24,
            gpVal: '0', gpGoal: '', gpPercent: 0,
            gcVal: '328.67', gcGoal: '', gcPercent: 24,
            perHour: '$0 (goal $200)', perVisit: '$0 (goal $0)'
          },
          {
            title: 'Dentist', value: '$0', borderColor: colors.cyan,
            pVal: '0', pGoal: '1,400', pPercent: 0,
            cVal: '266.67', cGoal: '1,372', cPercent: 19,
            gpVal: '0', gpGoal: '', gpPercent: 0,
            gcVal: '266.67', gcGoal: '', gcPercent: 19,
            perHour: '$0 (goal $200)', perVisit: '$0 (goal $0)'
          },
          {
            title: 'Hygienist', value: '$0', borderColor: colors.purple,
            pVal: '0', pGoal: '', pPercent: 0,
            cVal: '62', cGoal: '', cPercent: 10,
            gpVal: '0', gpGoal: '', gpPercent: 0,
            gcVal: '62', gcGoal: '', gcPercent: 10,
            perHour: '$0 (goal $0)', perVisit: '$0 (goal $0)'
          }
        ].map((card, idx) => (
          <Grid item xs={12} lg={4} key={`metrics-${idx}`}>
            <Paper
              sx={{
                p: 2.2, border: `1.5px solid ${card.borderColor}`, borderRadius: '2px',
                boxShadow: 'none', height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography sx={{ color: card.borderColor, fontWeight: 700, fontSize: '1rem', mb: 0.2 }}>
                  {card.title}
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', mb: 1, fontWeight: 600 }}>
                  ▼ {card.value}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {renderProgressBarRow('P', card.pVal, card.pGoal, card.pPercent)}
                  {renderProgressBarRow('C', card.cVal, card.cGoal, card.cPercent, true)}
                  {renderProgressBarRow('GP', card.gpVal, card.gpGoal, card.gpPercent)}
                  {renderProgressBarRow('GC', card.gcVal, card.gcGoal, card.gcPercent)}
                </Box>
              </Box>
              <Box sx={{ pt: 1 }}>
                <Typography sx={{ fontSize: '0.74rem', color: '#4b5563', fontWeight: 500 }}>
                  Production per hour {card.perHour}
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#4b5563', fontWeight: 500 }}>
                  Production per visit {card.perVisit}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}

        {/* ================= ROW 2: Production Vertical Line Charts (3 cards) ================= */}
        {[
          {
            title: 'Total Production',
            color: colors.navy,
            goal: 'Production Goal 1,400 (100%)'
          },
          {
            title: 'Treatment Production',
            color: colors.cyan,
            goal: 'Tx Production Goal 1,400 (100%)'
          },
          {
            title: 'Hygiene Production',
            color: colors.purple,
            goal: 'Hyg Production Goal 0 (100%)',
            provider: 'Babar Magsi'
          }
        ].map((chart, idx) => (
          <Grid item xs={12} lg={4} key={`prod-${idx}`}>
            <Paper sx={{ p: 2.2, border: `1.5px solid ${chart.color}`, borderRadius: '2px', boxShadow: 'none', height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography sx={{ color: chart.color, fontWeight: 700, fontSize: '0.95rem' }}>{chart.title}</Typography>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', height: '65%' }}>
                <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                  {[...Array(13)].map((_, i) => (
                    <Box key={i} sx={{ width: '1px', height: '100%', borderRight: '1px solid #e2e8f0' }} />
                  ))}
                </Box>
                <Box sx={{ position: 'absolute', right: '15%', top: 0, bottom: 0, width: '1.5px', backgroundColor: chart.color, zIndex: 1 }} />
                <Typography sx={{ position: 'absolute', left: '6%', top: '50%', fontSize: '0.75rem', fontWeight: 700, color: chart.color }}>0%</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pr: '10%' }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{chart.goal}</Typography>
                {chart.provider && (
                  <Typography sx={{ fontSize: '0.65rem', color: colors.navy, fontWeight: 600 }}>{chart.provider}</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}

        {/* ================= ROW 3: Patient Summary Status Blocks (3 cards) ================= */}
        {[
          { title: 'New Pt', color: colors.navy },
          { title: 'Tx Pt', color: colors.cyan },
          { title: 'Hyg Pt', color: colors.purple }
        ].map((card, idx) => (
          <Grid item xs={12} lg={4} key={`ptcards-${idx}`}>
            <Paper
              sx={{
                p: 3, border: `1.5px solid ${card.color}`, borderRadius: '2px',
                boxShadow: 'none', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, color: card.color, mb: 1 }}>
                {card.title}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: 500 }}>
                No Data Found
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* ================= ROW 4: Acceptance & Recare Charts (3 cards) ================= */}
        {/* New Pt Case Acceptance */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, border: `1.5px solid ${colors.navy}`, borderRadius: '2px', boxShadow: 'none', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: colors.navy, mb: 1, textAlign: 'center' }}>
              New Pt Case Acceptance
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: 500 }}>
              No Data Found
            </Typography>
          </Paper>
        </Grid>

        {/* Existing Pt Case Acceptance */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2.5, border: `1.5px solid ${colors.cyan}`, borderRadius: '2px', boxShadow: 'none', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: colors.cyan }}>
                Existing Pt Case Acceptance (100.00%)
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: colors.textMuted }}>
                (1 Patient/s)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
              <svg width="140px" height="140px" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="#76c75c" />
                <circle cx="18" cy="18" r="0.8" fill="#ffffff" />
              </svg>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, borderTop: '1px solid #edf2f7', pt: 1 }}>
              {[
                { label: 'Scheduled', color: '#0d9488' },
                { label: 'Accepted In Progress', color: '#2dd4bf' },
                { label: 'Completed ($100)', color: '#76c75c' },
                { label: 'Accepted Not Scheduled', color: '#a7f3d0' },
                { label: 'Presented', color: '#64748b' },
                { label: 'Diagnosed', color: '#94a3b8' },
                { label: 'Rejected', color: '#ef4444' },
                { label: 'Follow Up', color: '#f59e0b' },
                { label: 'Reviewed', color: '#86efac' }
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: item.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.65rem', color: colors.textMuted, fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Hygiene Interval Potential */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2.5, border: `1.5px solid ${colors.purple}`, borderRadius: '2px', boxShadow: 'none', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: colors.purple }}>
              Hygiene Interval Potential
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
              <svg width="140px" height="140px" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="transparent" stroke="#8b5cf6" strokeWidth="3.5" strokeDasharray="35 100" />
                <circle cx="16" cy="16" r="14" fill="transparent" stroke="#c084fc" strokeWidth="3.5" strokeDasharray="25 100" strokeDashoffset="-35" />
                <circle cx="16" cy="16" r="14" fill="transparent" stroke="#2563eb" strokeWidth="3.5" strokeDasharray="15 100" strokeDashoffset="-60" />
                <circle cx="16" cy="16" r="14" fill="transparent" stroke="#fed7aa" strokeWidth="3.5" strokeDasharray="13 100" strokeDashoffset="-75" />
                <circle cx="16" cy="16" r="14" fill="transparent" stroke="#f97316" strokeWidth="3.5" strokeDasharray="12 100" strokeDashoffset="-88" />
                <circle cx="16" cy="16" r="1" fill="#ffffff" />
              </svg>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, borderTop: '1px solid #edf2f7', pt: 1 }}>
              {[
                { label: 'On-Time No Pre-appt (23)', color: '#8b5cf6' },
                { label: 'On-Time Pre-appt (187)', color: '#c084fc' },
                { label: 'No Recare (162)', color: '#2563eb' },
                { label: 'Flagged No-Recare (1)', color: '#60a5fa' },
                { label: 'Late >12 months Appt (1)', color: '#94a3b8' },
                { label: 'Late >12 months Broken (43)', color: '#475569' },
                { label: 'Late >12 months No Appt', color: '#0f172a' }
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: item.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.65rem', color: colors.textMuted, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default DashboardTab;