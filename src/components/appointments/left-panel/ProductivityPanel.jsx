import { useState } from 'react';
import { Box, Typography, Select, MenuItem, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDropdownData } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import dayjs from 'dayjs';
import ProductivityCard from './ProductivityCard';

const dummyData = {
  total: {
    title: 'Total',
    scheduled: 1294,
    rows: [
      { id: 'P', label: 'P', value: 7115, goal: 6200, color: '#7cb342' },
      { id: 'C', label: 'C', value: 6458.5, goal: 6076, color: '#7cb342' },
      { id: 'GP', label: 'GP', value: 8136, color: '#545454' },
      { id: 'GC', label: 'GC', value: 6458.5, color: '#a8a8a8' },
    ],
    perHour: 222.34,
    perHourGoal: 193.7,
    perVisit: 1778.75,
    perVisitGoal: 1550,
  },
  dentist: {
    title: 'Dentist',
    scheduled: 932,
    rows: [
      { id: 'P', label: 'P', value: 6609, goal: 5600, color: '#7cb342' },
      { id: 'C', label: 'C', value: 6096.5, goal: 5488, color: '#7cb342' },
      { id: 'GP', label: 'GP', value: 7517, color: '#545454' },
      { id: 'GC', label: 'GC', value: 6096.5, color: '#a8a8a8' },
    ],
    perHour: 275.38,
    perHourGoal: 233.3,
    perVisit: 1652.25,
    perVisitGoal: 1400,
  },
  hygienist: {
    title: 'Hygienist',
    scheduled: 362,
    rows: [
      { id: 'P', label: 'P', value: 506, goal: 600, color: '#ef5350' },
      { id: 'C', label: 'C', value: 362, goal: 588, color: '#ef5350' },
      { id: 'GP', label: 'GP', value: 619, color: '#545454' },
      { id: 'GC', label: 'GC', value: 362, color: '#a8a8a8' },
    ],
    perHour: 63.25,
    perHourGoal: 75,
    perVisit: 126.5,
    perVisitGoal: 150,
  }
};

const ProductivityPanel = () => {
  const [providerId, setProviderId] = useState("all");
  const [date, setDate] = useState(dayjs('2026-07-07'));
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
            height: "32px",
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', width: '40px' }}>
            Date:
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="DD/MM/YYYY"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              slotProps={{
                textField: {
                  size: 'small',
                  placeholder: 'dd/mm/yyyy',
                  sx: {
                    width: "165px",
                    backgroundColor: COLORS.WHITE,
                    "& .MuiInputBase-root": { height: "32px", borderRadius: "8px", paddingRight: "4px" },
                    "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "13px", py: "0", height: "32px", boxSizing: "border-box" }
                  }
                },
                openPickerButton: {
                  sx: { padding: '4px', color: '#9aa3ae' }
                },
                openPickerIcon: {
                  sx: { fontSize: '18px' }
                }
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: '16px' }}>
          <Button 
            variant="contained" 
            fullWidth
            disableElevation
            sx={{ 
              height: '44px', 
              backgroundColor: COLORS.ACCENT, 
              color: COLORS.WHITE,
              textTransform: 'none', 
              fontSize: fontSize.md, 
              fontWeight: fontWeight.semibold,
              borderRadius: radius.md,
              '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Cards */}
      <ProductivityCard data={dummyData.total} />
      <ProductivityCard data={dummyData.dentist} />
      <ProductivityCard data={dummyData.hygienist} />

    </Box>
  );
};

export default ProductivityPanel;
