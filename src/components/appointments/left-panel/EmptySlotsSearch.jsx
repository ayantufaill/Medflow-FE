import { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Checkbox, FormControlLabel, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAvailableSlots } from '../../../store/slices/appointmentSlice';
import { useDropdownData } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import dayjs from 'dayjs';

const EmptySlotsSearch = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(60);
  const [providerId, setProviderId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [dateFrom, setDateFrom] = useState(dayjs());
  const [dateTo, setDateTo] = useState(dayjs().add(1, 'month'));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [amSelected, setAmSelected] = useState(true);
  const [pmSelected, setPmSelected] = useState(true);
  const [searchRange, setSearchRange] = useState("1 day");
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchRange === '1 day') setDateTo(dayjs(dateFrom));
    if (searchRange === '1 week') setDateTo(dayjs(dateFrom).add(1, 'week'));
    if (searchRange === '1 month') setDateTo(dayjs(dateFrom).add(1, 'month'));
    if (searchRange === '3 months') setDateTo(dayjs(dateFrom).add(3, 'month'));
  }, [searchRange, dateFrom]);

  const { providers, rooms } = useDropdownData({
    providers: true,
    rooms: true,
  });

  const handleSearch = async () => {
    if (!providerId) return;
    setLoading(true);
    try {
      const searchStart = dayjs(dateFrom).startOf('day');
      const searchEnd = dayjs(dateTo).startOf('day');
      const days = searchEnd.diff(searchStart, 'day') + 1;
      
      // Limit to 90 days to prevent excessive requests
      const maxDays = Math.min(days, 90);
      
      const allMappedSlots = [];
      const fetchPromises = [];

      // Fetch all days concurrently
      for (let i = 0; i < maxDays; i++) {
        const currentDate = searchStart.add(i, 'day');
        const searchDate = currentDate.format('YYYY-MM-DD');
        
        const promise = dispatch(fetchAvailableSlots({
          providerId,
          date: searchDate,
          duration
        })).unwrap().then(result => {
          const rawSlots = result?.availableSlots || [];
          const mappedSlots = rawSlots.map(timeStr => {
            const start = dayjs(`${searchDate}T${timeStr}`);
            const end = start.add(duration, 'minute');
            return {
              date: searchDate,
              startTime: start.format('h:mm A'),
              endTime: end.format('h:mm A'),
              roomName: ''
            };
          });
          
          // Apply AM/PM filters
          return mappedSlots.filter(slot => {
            const isAM = slot.startTime.includes('AM');
            const isPM = slot.startTime.includes('PM');
            if (amSelected && pmSelected) return true;
            if (amSelected) return isAM;
            if (pmSelected) return isPM;
            return false; // neither selected
          });
        }).catch(err => {
          console.error(`Failed to fetch slots for ${searchDate}`, err);
          return [];
        });
        
        fetchPromises.push(promise);
      }
      
      const results = await Promise.all(fetchPromises);
      // Flatten the array of arrays
      results.forEach(daySlots => allMappedSlots.push(...daySlots));
      
      // Sort by date then by time
      allMappedSlots.sort((a, b) => {
        const aTime = dayjs(`${a.date} ${a.startTime}`, 'YYYY-MM-DD h:mm A');
        const bTime = dayjs(`${b.date} ${b.startTime}`, 'YYYY-MM-DD h:mm A');
        return aTime.valueOf() - bTime.valueOf();
      });
      
      setSlots(allMappedSlots);
      setShowResults(true);
    } catch (err) {
      console.error('Failed to fetch slots', err);
    } finally {
      setLoading(false);
    }
  };

  if (showResults) {
    const amPmText = [amSelected && 'AM', pmSelected && 'PM'].filter(Boolean).join(' ');
    const resultsHeader = `Results for: ${duration} mins, ${amPmText}${amPmText ? ', ' : ''}${searchRange}`;

    return (
      <Box sx={{ p: '16px', backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '16px', pb: '16px', borderBottom: `1px solid ${COLORS.BORDER}` }}>
          <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
            {resultsHeader}
          </Typography>
          <IconButton size="small" onClick={() => setShowResults(false)}>
            <EditIcon sx={{ fontSize: '16px', color: COLORS.ACCENT }} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
          {slots.map((slot, idx) => {
            // Attempt to parse a date, defaulting to dateFrom if the API doesn't provide one
            const slotDate = slot.date ? dayjs(slot.date).format('ddd MM/DD/YY') : dateFrom.format('ddd MM/DD/YY');
            const roomName = slot.roomName || (roomId ? rooms.find(r => (r._id || r.id) === roomId)?.name : 'Op1');
            
            return (
              <Box
                key={idx}
                sx={{
                  p: '12px',
                  borderRadius: radius.md,
                  border: `1px solid ${COLORS.BORDER}`,
                  backgroundColor: "#fafbfe",
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: COLORS.ACCENT,
                    backgroundColor: COLORS.ACCENT_BG
                  }
                }}
                onClick={() => {
                  navigate(`/appointments/operatory-schedule?date=${slot.date || dateFrom.format('YYYY-MM-DD')}`);
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '4px' }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
                    {slotDate}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
                    {roomName}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.semibold, color: COLORS.ACCENT }}>
                  {slot.startTime} to {slot.endTime}
                </Typography>
              </Box>
            );
          })}
          
          {slots.length === 0 && (
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY, textAlign: 'center', py: '24px' }}>
              No empty slots found for the selected criteria.
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: '16px', backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: '20px' }}>
        Search for Empty Slots By:
      </Typography>

      <Box sx={{ mb: '16px' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
          provider
        </Typography>
        <Select
          MenuProps={{ sx: { zIndex: 1400 } }}
          size="small"
          fullWidth
          displayEmpty
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
          sx={{
            height: 36,
            fontSize: '13px',
            fontFamily: 'Inter',
            fontWeight: 500,
            color: providerId ? '#09121f' : '#94a3b8',
            backgroundColor: '#fafbfe',
            borderRadius: '4px',
            '& .MuiSelect-select': {
              py: 1,
              pl: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e2e8f0'
            }
          }}
        >
          <MenuItem value="" disabled sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Search and select provider</MenuItem>
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

<Box sx={{ mb: '16px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap', fontSize: '11px', py: 0 }}>
              duration
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TextField
                type="number"
                size="small"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 0)}
                sx={{
                  width: "64px",
                  "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "12px", py: "4px", textAlign: "center" },
                  "& .MuiOutlinedInput-root": { borderRadius: "4px" },
                }}
                inputProps={{ min: 5, step: 5 }}
              />
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: COLORS.TEXT_SECONDARY }}>mins</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: "4px", justifyContent: "flex-end", width: "100%" }}>
            {[30, 45, 60, 90, 120].map((v) => (
              <Box
                key={v}
                onClick={() => setDuration(v)}
                sx={{
                  px: "8px", py: "2px", borderRadius: "4px",
                  cursor: "pointer", fontFamily: "Inter", fontSize: "11px", fontWeight: 600,
                  backgroundColor: duration === v ? COLORS.ACCENT : "#f1f5f9",
                  color: duration === v ? COLORS.WHITE : "#6b7280",
                  transition: "all 0.15s",
                  "&:hover": { backgroundColor: duration === v ? COLORS.ACCENT_HOVER : "#e2e8f0" },
                }}
              >
                {v}m
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: '16px' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
          operatory
        </Typography>
        <Select
          MenuProps={{ sx: { zIndex: 1400 } }}
          size="small"
          fullWidth
          displayEmpty
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          sx={{
            height: 36,
            fontSize: '13px',
            fontFamily: 'Inter',
            fontWeight: 500,
            color: roomId ? '#09121f' : '#94a3b8',
            backgroundColor: '#fafbfe',
            borderRadius: '4px',
            '& .MuiSelect-select': {
              py: 1,
              pl: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e2e8f0'
            }
          }}
        >
          <MenuItem value="" disabled sx={{ fontFamily: "Inter", fontSize: "13px", color: "#9aa3ae" }}>Search Operatory</MenuItem>
          {rooms?.map((r) => (
            <MenuItem key={r._id || r.id} value={r._id || r.id} sx={{ fontFamily: "Inter", fontSize: "13px" }}>
              {r.name || r.roomName || r.label || `Op ${r._id || r.id}`}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ mb: '16px' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
          search availability for
        </Typography>
        <Select
          MenuProps={{ sx: { zIndex: 1400 } }}
          size="small"
          fullWidth
          value={searchRange}
          onChange={(e) => setSearchRange(e.target.value)}
          sx={{
            height: 36,
            fontSize: '13px',
            fontFamily: 'Inter',
            fontWeight: 500,
            color: '#09121f',
            backgroundColor: '#fafbfe',
            borderRadius: '4px',
            '& .MuiSelect-select': {
              py: 1,
              pl: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e2e8f0'
            }
          }}
        >
<MenuItem value="1 day" sx={{ fontFamily: "Inter", fontSize: "13px" }}>1 day</MenuItem>
           <MenuItem value="1 week" sx={{ fontFamily: "Inter", fontSize: "13px" }}>1 week</MenuItem>
           <MenuItem value="1 month" sx={{ fontFamily: "Inter", fontSize: "13px" }}>1 month</MenuItem>
           <MenuItem value="3 months" sx={{ fontFamily: "Inter", fontSize: "13px" }}>3 months</MenuItem>
           <MenuItem value="custom range" sx={{ fontFamily: "Inter", fontSize: "13px" }}>custom range</MenuItem>
        </Select>
      </Box>

      {searchRange === 'custom range' && (
        <Box sx={{ mb: '16px' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            date range
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY, width: '40px' }}>From:</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={dateFrom}
                  onChange={(v) => {
                    setDateFrom(v);
                    if (dateTo.isBefore(v, 'day')) {
                      setDateTo(v);
                    }
                  }}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      placeholder: 'dd/mm/yyyy',
                      sx: {
                        width: "165px",
                        backgroundColor: "#fafbfe",
                        "& .MuiInputBase-root": { height: 36, borderRadius: "4px", paddingRight: "4px" },
                        "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "13px", py: "0", height: 36, boxSizing: "border-box" }
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY, width: '40px' }}>To:</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={dateTo}
                  onChange={(v) => setDateTo(v)}
                  minDate={dateFrom || dayjs()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      placeholder: 'dd/mm/yyyy',
                      sx: {
                        width: "165px",
                        backgroundColor: "#fafbfe",
                        "& .MuiInputBase-root": { height: 36, borderRadius: "4px", paddingRight: "4px" },
                        "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "13px", py: "0", height: 36, boxSizing: "border-box" }
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
          </Box>
        </Box>
      )}

      <Box sx={{ mb: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
          time
        </Typography>
        <FormControlLabel
          control={<Checkbox checked={amSelected} onChange={(e) => setAmSelected(e.target.checked)} size="small" sx={{ p: '4px', color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
          label={<Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>AM</Typography>}
        />
        <FormControlLabel
          control={<Checkbox checked={pmSelected} onChange={(e) => setPmSelected(e.target.checked)} size="small" sx={{ p: '4px', color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
          label={<Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>PM</Typography>}
        />
      </Box>

      <Box sx={{ mb: '20px' }}>
        <FormControlLabel
          control={<Checkbox size="small" sx={{ p: '4px', color: '#2362EF', '&.Mui-checked': { color: '#2362EF' } }} />}
          label={<Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>Allow Double Booking</Typography>}
        />
      </Box>

      <Box>
        <Button
          variant="contained"
          fullWidth
          disableElevation
          onClick={handleSearch}
          disabled={loading || !providerId}
          sx={{
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            fontWeight: fontWeight.semibold,
            fontSize: fontSize.md,
            textTransform: 'none',
            borderRadius: radius.md,
            height: '44px',
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
            '&.Mui-disabled': { backgroundColor: '#e2e8f0', color: '#94a3b8' }
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>
    </Box>
  );
};

export default EmptySlotsSearch;
