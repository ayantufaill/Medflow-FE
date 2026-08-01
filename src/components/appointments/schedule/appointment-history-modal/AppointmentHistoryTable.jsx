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
import { useDropdownData } from '../../../../hooks/redux/useDropdownData';

const capitalizeFirst = (str) => {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getProviderId = (provider) => {
  if (!provider) return "";
  if (typeof provider === "string" || typeof provider === "number") {
    return String(provider);
  }

  return String(
    provider._id ||
      provider.id ||
      provider.providerId ||
      provider.ProvNum ||
      provider.userId?._id ||
      provider.userId?.id ||
      "",
  );
};

export const getAppointmentIdCandidates = (appointment) =>
  [
    appointment.id,
    appointment._id,
    appointment.appointmentId,
    appointment.AptNum,
  ].filter(Boolean);

export const getAppointmentRowKey = (appointment, index) =>
  getAppointmentIdCandidates(appointment)[0] || index;

const getProviderName = (provider, providers = []) => {
  if (!provider) return "---";
  if (typeof provider === "string" || typeof provider === "number") {
    const matchedProvider = providers.find(
      (item) => getProviderId(item) === String(provider),
    );
    return matchedProvider ? getProviderName(matchedProvider, providers) : "---";
  }

  const first =
    provider.userId?.firstName ||
    provider.firstName ||
    provider.FName ||
    provider.name ||
    "";
  const last =
    provider.userId?.lastName || provider.lastName || provider.LName || "";
  const fullName = `${first} ${last}`.trim();

  return fullName || provider.providerName || provider.providerCode || "---";
};
const findProviderById = (id, providers = []) => {
  if (!id) return null;
  const actualId = typeof id === "object" ? getProviderId(id) : String(id);
  return providers.find((p) => getProviderId(p) === actualId);
};

const getAppointmentProvider = (appointment, providers = []) => {
  const provider =
    appointment.provider ||
    appointment.providerId ||
    appointment.providerName ||
    appointment.customFields?.providerRows?.[0]?.providerId ||
    appointment.customFields?.providers?.[0]?.providerId ||
    appointment.customFields?.providers?.[0] ||
    appointment.ProvNum;

  const matchedProvider = findProviderById(provider, providers);
  if (matchedProvider) return getProviderName(matchedProvider, providers);
  
  if (typeof provider === "object" && provider !== null && provider.name) return provider.name;
  if (appointment.providerName) return appointment.providerName;
  if (typeof provider === "string" && /[a-z]/i.test(provider)) return provider;
  return "---";
};

const getProviderInitials = (name) => {
  if (!name || name === "---") return "---";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "---";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getCalculatedDuration = (appt) => {
  const explicitDuration = appt.durationMinutes || appt.DurationMins || appt.duration;
  if (explicitDuration) return explicitDuration;

  if (appt.startTime && appt.endTime) {
    // If times are full date strings or HH:mm strings
    const start = dayjs(appt.startTime.includes('T') ? appt.startTime : `2000-01-01 ${appt.startTime}`);
    const end = dayjs(appt.endTime.includes('T') ? appt.endTime : `2000-01-01 ${appt.endTime}`);
    if (start.isValid() && end.isValid()) {
      const diff = end.diff(start, 'minute');
      if (diff > 0) return diff;
    }
  }

  return 60; // Absolute fallback
};

const getVisitType = (appointment) =>
  appointment.visitType ||
  appointment.customFields?.visitType ||
  appointment.workspace?.visitType ||
  appointment.appointmentTypeId?.name ||
  (typeof appointment.appointmentType === 'object' ? appointment.appointmentType?.name : null) ||
  appointment.appointmentTypeName ||
  (typeof appointment.appointmentType === 'string' && appointment.appointmentType !== 'consultation' ? appointment.appointmentType : null) ||
  appointment.type ||
  "---";

const formatProcedure = (procedure) => {
  if (!procedure) return "";
  if (typeof procedure === "string") return procedure;

  return (
    procedure.treatment ||
    procedure.name ||
    procedure.treatmentName ||
    procedure.description ||
    procedure.Descript ||
    procedure.code ||
    procedure.procedureCode ||
    procedure.ProcCode ||
    procedure.procCode ||
    ""
  );
};

const getProceduresText = (appointment, fetchedProcedures = []) => {
  let rawProcedures = 
    (Array.isArray(fetchedProcedures) && fetchedProcedures.length > 0 ? fetchedProcedures : null) ||
    appointment.chiefComplaint || 
    appointment.workspace?.procedures ||
    appointment.customFields?.procedures ||
    appointment.procedures || 
    appointment.appointmentProcedures ||
    appointment.procedureCodes ||
    appointment.customFields?.procedureTags ||
    appointment.tags ||
    appointment.description || 
    appointment.note ||
    '';

  if (Array.isArray(rawProcedures)) {
    rawProcedures = rawProcedures.map(formatProcedure).filter(Boolean).join(", ");
  } else if (typeof rawProcedures === "string" && rawProcedures.includes(",")) {
    rawProcedures = rawProcedures.split(",").map(p => p.trim()).join(", ");
  } else if (typeof rawProcedures !== "string") {
    rawProcedures = "";
  }

  return rawProcedures || "---";
};

const AppointmentHistoryTable = ({
  loading,
  appointments,
  procedureMap = {},
  selected,
  handleSelectAll,
  handleSelectOne
}) => {
  const { providers = [] } = useDropdownData({ providers: true });

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
                <TableCell sx={{ minWidth: 110 }}>Provider</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Audit</TableCell>
                <TableCell>Reminders</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((appt, idx) => {
                  const rowId = getAppointmentRowKey(appt, idx);
                  const providerName = getAppointmentProvider(appt, providers);
                  const proceduresText = getProceduresText(
                    appt,
                    procedureMap[rowId],
                  );
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
                      <TableCell>{capitalizeFirst(getVisitType(appt))}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {capitalizeFirst(proceduresText)}
                      </TableCell>
                      <TableCell>{getCalculatedDuration(appt)} mins</TableCell>
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
                            fontWeight: 700,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: "100%",
                          }}
                        >
                          {getProviderInitials(providerName)}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: appt.status?.toLowerCase() === 'cancelled' ? '#ef4444' : '#475569' }}>
                        {capitalizeFirst(appt.status || "Unconfirmed")}
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
