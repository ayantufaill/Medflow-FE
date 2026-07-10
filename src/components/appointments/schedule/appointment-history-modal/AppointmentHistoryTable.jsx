import React from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  CircularProgress, 
  Checkbox, 
  Typography 
} from '@mui/material';
import dayjs from 'dayjs';

const AppointmentHistoryTable = ({
  loading,
  appointments,
  selected,
  handleSelectAll,
  handleSelectOne
}) => {
  return (
    <Box sx={{ flex: 1, overflow: "auto", p: 0 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
          <CircularProgress size={40} thickness={4} sx={{ color: "#5c7cbc" }} />
        </Box>
      ) : (
        <TableContainer component={Box}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ "& .MuiTableCell-root": { bgcolor: "#fff", fontWeight: 700, fontSize: "0.8rem", color: "#334155", py: 1.5 } }}>
                <TableCell padding="checkbox">
                  <Checkbox 
                    size="small" 
                    onChange={handleSelectAll}
                    checked={appointments.length > 0 && selected.length === appointments.length}
                    indeterminate={selected.length > 0 && selected.length < appointments.length}
                  />
                </TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Procedures</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Audit</TableCell>
                <TableCell>Reminders</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((appt, idx) => {
                  const providerName = appt.providerId?.providerCode || appt.providerId?.firstName?.charAt(0) + appt.providerId?.lastName?.charAt(0) || "SAB";
                  const rowId = appt._id || idx;
                  return (
                    <TableRow 
                      key={rowId} 
                      hover
                      sx={{ 
                        "& .MuiTableCell-root": { fontSize: "0.8rem", color: "#475569", py: 1.5, borderBottom: "1px solid #f1f5f9" },
                        "&:last-child .MuiTableCell-root": { borderBottom: "none" }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox 
                          size="small" 
                          checked={selected.includes(rowId)}
                          onChange={() => handleSelectOne(rowId)}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{dayjs(appt.appointmentDate).format("MM/DD/YYYY")}</TableCell>
                      <TableCell>{appt.startTime ? dayjs(`2000-01-01 ${appt.startTime}`).format("hh:mm A") : dayjs(appt.appointmentDate).format("hh:mm A")}</TableCell>
                      <TableCell>{appt.appointmentType?.name || "Recare"}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {appt.procedures || appt.note || "---"}
                      </TableCell>
                      <TableCell>{appt.duration || 60} mins</TableCell>
                      <TableCell>
                        <Box 
                          sx={{ 
                            display: "inline-block", 
                            px: 1, 
                            py: 0.25, 
                            bgcolor: "#dcfce7", 
                            color: "#166534", 
                            borderRadius: "4px", 
                            fontSize: "0.7rem", 
                            fontWeight: 700 
                          }}
                        >
                          {providerName}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: appt.status?.toLowerCase() === 'cancelled' ? '#ef4444' : '#475569' }}>
                        {appt.status || "Unconfirmed"}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.75rem", color: "#3b82f6", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>show</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.75rem", color: "#3b82f6", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>show</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 8, color: "#94a3b8", fontStyle: "italic" }}>
                    No appointment history found for this patient.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AppointmentHistoryTable;
