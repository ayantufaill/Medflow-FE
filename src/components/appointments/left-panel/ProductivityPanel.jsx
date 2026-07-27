import { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDropdownData } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import dayjs from 'dayjs';
import ProductivityCard from './ProductivityCard';
import api from '../../../config/api';
import DateNavigation from '../schedule/DateNavigation';

const ProductivityPanel = () => {
  const [providerId, setProviderId] = useState("all");
  const [date, setDate] = useState(dayjs());
  const [panelData, setPanelData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPanelData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/productivity/panel-summary', {
        params: {
          date: date.format('YYYY-MM-DD'),
          ...(providerId !== 'all' && { providerId })
        }
      });
      setPanelData(response.data?.data || null);
    } catch (error) {
      console.error('Failed to fetch productivity panel data:', error);
      // Fallback empty data structure if the API fails or doesn't exist yet
      const emptyRows = [
        { id: 'P', label: 'P', value: 0, goal: 0, color: '#7cb342' },
        { id: 'C', label: 'C', value: 0, goal: 0, color: '#7cb342' },
        { id: 'GP', label: 'GP', value: 0, color: '#545454' },
        { id: 'GC', label: 'GC', value: 0, color: '#a8a8a8' },
      ];

      setPanelData({
        total: { title: 'Total', scheduled: 0, rows: emptyRows, perHour: 0, perHourGoal: 0, perVisit: 0, perVisitGoal: 0 },
        dentist: { title: 'Dentist', scheduled: 0, rows: emptyRows, perHour: 0, perHourGoal: 0, perVisit: 0, perVisitGoal: 0 },
        hygienist: { title: 'Hygienist', scheduled: 0, rows: emptyRows, perHour: 0, perHourGoal: 0, perVisit: 0, perVisitGoal: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanelData();
  }, [date, providerId]);

  const handlePrevDay = () => setDate(d => d.subtract(1, 'day'));
  const handleNextDay = () => setDate(d => d.add(1, 'day'));

  const { providers } = useDropdownData({ providers: true });

  return (
    <Box sx={{ p: '16px', backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}` }}>
      
      {/* Filters Area */}
      <Box sx={{ mb: '16px' }}>
        <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, mb: '6px', textTransform: 'uppercase' }}>
          Provider:
        </Typography>
        <Select
          MenuProps={{ sx: { zIndex: 1400 } }}
          size="small"
          fullWidth
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
          sx={{
            height: "40px",
            fontFamily: "Inter",
            fontSize: "13px",
            borderRadius: "8px",
            backgroundColor: COLORS.WHITE,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
            color: providerId ? COLORS.TEXT_PRIMARY : "#9aa3ae"
          }}
        >
          <MenuItem value="all" sx={{ fontFamily: "Inter", fontSize: "13px" }}>All</MenuItem>
          {providers?.map((p) => {
            const name = p.userId 
              ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim() 
              : `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.providerCode;
            return (
              <MenuItem key={p._id || p.id} value={p._id || p.id} sx={{ fontFamily: "Inter", fontSize: "13px" }}>
                {name || `Provider ${p._id || p.id}`}
              </MenuItem>
            );
          })}
        </Select>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', mb: '24px', pb: '16px', borderBottom: `1px solid ${COLORS.BORDER}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DateNavigation 
            date={date} 
            onPrev={handlePrevDay} 
            onNext={handleNextDay} 
            onDateSelect={setDate} 
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: '16px' }}>
          <Button 
            variant="contained" 
            fullWidth
            disableElevation
            sx={{ 
              height: '40px', 
              backgroundColor: COLORS.ACCENT, 
              color: COLORS.WHITE,
              textTransform: 'none', 
              fontSize: '13px', 
              fontWeight: fontWeight.semibold,
              borderRadius: radius.sm,
              '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }
            }}
            onClick={fetchPanelData}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Refresh"}
          </Button>
        </Box>
      </Box>

      {/* Cards */}
      {loading && !panelData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: '40px' }}>
          <CircularProgress size={30} />
        </Box>
      ) : panelData ? (
        <>
          {panelData.total && <ProductivityCard data={panelData.total} />}
          {panelData.dentist && <ProductivityCard data={panelData.dentist} />}
          {panelData.hygienist && <ProductivityCard data={panelData.hygienist} />}
        </>
      ) : (
        <Typography sx={{ textAlign: 'center', color: COLORS.TEXT_SECONDARY, py: 2 }}>
          No data available
        </Typography>
      )}

    </Box>
  );
};

export default ProductivityPanel;
