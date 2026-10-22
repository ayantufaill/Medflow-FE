import React, { useRef, useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import calenderSvg from '../../../assets/treatmentplan/calender.svg';
import notesSvg from '../../../assets/treatmentplan/mdi_notes-outline.svg';
import rxSvg from '../../../assets/clinicalicons/RX icon.svg';

const NewTreatmentPlanHeader = ({ showOdontogram, setShowOdontogram, onNotesClick, onRxClick, pastDates = [], currentDate }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [pastDates, currentDate]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 1, borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' }}>
      
      {/* Wrapper for arrows and scroll container */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, mr: 2 }}>
        
        {/* Left Arrow */}
        {canScrollLeft && (
          <IconButton size="small" onClick={() => handleScroll('left')} sx={{ mr: 0.5, bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}

        {/* Dates Container (Scrollable, hidden scrollbar) */}
        <Box 
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            flex: 1, 
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { 
              display: 'none'
            }
          }}
        >
          {/* Render all past dates */}
          {pastDates.map((date, index) => (
            <React.Fragment key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#e6f0ff', px: 1.5, height: '30px', borderRadius: '15px', flexShrink: 0 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#0052cc' }} />
                <Typography sx={{ color: '#0052cc', fontWeight: 700, fontSize: '0.8rem' }}>
                  {dayjs(date).format('MM/DD/YYYY')}
                </Typography>
              </Box>
              
              {/* Connector Line */}
              <Box sx={{ width: '30px', height: '2px', bgcolor: '#14b8a6', flexShrink: 0 }} />
            </React.Fragment>
          ))}
          
          {/* Right Date Pill (Current Appointment) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#0f172a', border: '1px solid #cbd5e1', px: 1.5, height: '30px', borderRadius: '15px', flexShrink: 0 }}>
            <Box component="img" src={calenderSvg} alt="calendar" sx={{ width: 14, height: 14 }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
              {currentDate ? dayjs(currentDate).format('MM/DD/YYYY') : dayjs().format('MM/DD/YYYY')}
            </Typography>
          </Box>
        </Box>

        {/* Right Arrow */}
        {canScrollRight && (
          <IconButton size="small" onClick={() => handleScroll('right')} sx={{ ml: 0.5, bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Buttons Container */}
      <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={onRxClick}
          startIcon={<Box component="img" src={rxSvg} alt="rx" sx={{ width: 16, height: 16 }} />}
          sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#1e293b' }}
        >
          Rx
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={onNotesClick}
          startIcon={<Box component="img" src={notesSvg} alt="notes" sx={{ width: 16, height: 16 }} />} 
          sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#1e293b' }}
        >
          Notes
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => setShowOdontogram(!showOdontogram)}
          sx={{ textTransform: 'none', bgcolor: '#2563eb', boxShadow: 'none' }}
        >
          {showOdontogram ? 'Hide odontogram' : 'Show odontogram'}
        </Button>
      </Box>
    </Paper>
  );
};

export default NewTreatmentPlanHeader;
