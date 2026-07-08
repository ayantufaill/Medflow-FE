import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { radius, fontWeight } from '../../../constants/styles';
import { appointmentService } from '../../../services/appointment.service';
import { DUMMY_PROCEDURE_OPTIONS } from './constants';
import dayjs from 'dayjs';

const PastVisitProceduresSelector = ({ patient, onAddProcedure }) => {
  const [visits, setVisits] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState('');

    useEffect(() => {
      setSelectedVisitId(''); // Clear the procedure table when patient changes
      const fetchVisits = async () => {
        const pId = patient?._id || patient?.id;
        if (!pId) {
          setVisits([]);
          return;
        }
      setLoadingVisits(true);
      try {
        const data = await appointmentService.getAllAppointments(1, 100, '', pId);
        const allAppointments = data.appointments || [];
        console.log("All appointments:", allAppointments.length);
        
        // Filter for past visits (appointments before tomorrow)
        const pastAppointments = allAppointments.filter(v => {
          const dateStr = v.appointmentDate || v.date || v.createdAt;
          return dateStr && dayjs(dateStr).isBefore(dayjs().endOf('day'));
        }).sort((a, b) => {
          const dateA = dayjs(a.appointmentDate || a.date || a.createdAt).valueOf();
          const dateB = dayjs(b.appointmentDate || b.date || b.createdAt).valueOf();
          return dateB - dateA; // Descending order: highest value (most recent) first
        });
        
        console.log("Past appointments after filter:", pastAppointments.length);
        setVisits(pastAppointments);
      } catch (err) {
        console.error("Failed to fetch visits", err);
      } finally {
        setLoadingVisits(false);
      }
    };
    fetchVisits();
  }, [patient]);



  const selectedVisit = visits.find(v => v._id === selectedVisitId || v.id === selectedVisitId);
  const procedures = selectedVisit?.customFields?.procedures || [];

  const handleAddProcedure = (proc) => {
    // Find if we have a default tag for this procedure code
    const matchedOption = DUMMY_PROCEDURE_OPTIONS.find(opt => opt.code === proc.code);
    
    onAddProcedure({
        id: Date.now().toString(),
        code: proc.code || '',
        treatment: proc.treatment || proc.label || proc.description || '',
        charge: matchedOption?.charge || proc.charge || proc.fee || "$0.00",
        tooth: proc.tooth || '',
        site: proc.tooth || '',
        surf: proc.surf || proc.surface || '',
        status: 'Treatment Plan',
        provider: 'all',
        checked: true,
        tag: matchedOption?.tag || proc.tag // Use the matched tag, or fallback to the proc's own tag if it has one
      });
  };

  if (!patient) {
    return (
      <Box sx={{ mt: '12px', p: '12px', border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, backgroundColor: COLORS.SURFACE_CARD }}>
        <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
          Please select a patient first to view past visits.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: '12px', p: '12px', border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, backgroundColor: COLORS.SURFACE_CARD }}>
      <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: '12px' }}>
        Add from Past Visit
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', mb: '16px' }}>
        <Box>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, mb: '4px', textTransform: 'uppercase' }}>Select Past Visit</Typography>
          <Select
            size="small"
            fullWidth
            value={selectedVisitId}
            onChange={(e) => setSelectedVisitId(e.target.value)}
            displayEmpty
            disabled={loadingVisits || visits.length === 0}
            MenuProps={{ sx: { zIndex: 1400 } }}
            sx={{
              height: '32px',
              fontFamily: 'Inter',
              fontSize: '13px',
              borderRadius: '8px',
              backgroundColor: COLORS.WHITE,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
              color: selectedVisitId ? COLORS.TEXT_PRIMARY : '#9aa3ae'
            }}
          >
            <MenuItem value="" disabled sx={{ fontFamily: 'Inter', fontSize: '13px' }}>
              {loadingVisits ? "Loading visits..." : (visits.length === 0 ? "No past visits found" : "Select a visit...")}
            </MenuItem>
            {visits.map(v => (
              <MenuItem key={v._id || v.id} value={v._id || v.id} sx={{ fontFamily: 'Inter', fontSize: '13px' }}>
                {dayjs(v.appointmentDate || v.date || v.createdAt).format('MM-DD-YYYY')} - {v.appointmentTypeId?.name || v.appointmentType?.name || v.appointmentType || 'Visit'}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {selectedVisit && (
        <Box>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, mb: '8px', textTransform: 'uppercase' }}>
            Visit Procedures Preview
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.BORDER_LIGHT}`, borderRadius: radius.md, mb: '12px' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: COLORS.SURFACE_CARD }}>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, py: '6px', width: '25%' }}>CODE</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, py: '6px' }}>TREATMENT</TableCell>
                  <TableCell sx={{ py: '6px', width: '60px' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {procedures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: '12px', fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
                      No procedures found for this visit.
                    </TableCell>
                  </TableRow>
                ) : (
                  procedures.map((p, index) => (
                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                      <TableCell sx={{ fontSize: '12px', py: '4px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>
                        {p.code}
                      </TableCell>
                      <TableCell sx={{ fontSize: '12px', py: '4px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>
                        {p.treatment || p.label || p.description} {p.tooth ? `(T${p.tooth})` : ''}
                      </TableCell>
                        <TableCell align="right" sx={{ py: '4px' }}>
                          <Button
                            variant="contained"
                            onClick={() => handleAddProcedure(p)}
                            sx={{
                              backgroundColor: COLORS.PRIMARY,
                              color: '#fff',
                              borderRadius: '8px',
                              height: '32px',
                              fontSize: '12px',
                              fontFamily: 'Inter',
                              textTransform: 'none',
                              px: 2,
                              whiteSpace: 'nowrap',
                              '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER }
                            }}
                          >
                            Add procedure to the procedure list
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default PastVisitProceduresSelector;
