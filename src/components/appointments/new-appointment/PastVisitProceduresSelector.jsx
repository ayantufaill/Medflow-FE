import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { radius, fontWeight } from "../../../constants/styles";
import { appointmentService } from "../../../services/appointment.service";
import { DUMMY_PROCEDURE_OPTIONS } from "./constants";
import dayjs from "dayjs";

const PastVisitProceduresSelector = ({
  patient,
  patientId,
  open = true,
  onAddProcedure,
  onAdd,
  onClose,
}) => {
  const [visits, setVisits] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState("");

  const resolvedPatientId = patient?._id || patient?.id || patientId;

  useEffect(() => {
    setSelectedVisitId("");

    const fetchVisits = async () => {
      if (!open || !resolvedPatientId) {
        setVisits([]);
        setLoadingVisits(false);
        return;
      }

      setLoadingVisits(true);
      try {
        const data = await appointmentService.getAllAppointments(
          1,
          100,
          "",
          resolvedPatientId,
        );
        const allAppointments = data.appointments || [];

        const pastAppointments = allAppointments
          .filter((v) => {
            const dateStr = v.appointmentDate || v.date || v.createdAt;
            return dateStr && dayjs(dateStr).isBefore(dayjs().endOf("day"));
          })
          .sort((a, b) => {
            const dateA = dayjs(
              a.appointmentDate || a.date || a.createdAt,
            ).valueOf();
            const dateB = dayjs(
              b.appointmentDate || b.date || b.createdAt,
            ).valueOf();
            return dateB - dateA;
          });

        setVisits(pastAppointments);
      } catch (err) {
        console.error("Failed to fetch visits", err);
      } finally {
        setLoadingVisits(false);
      }
    };

    fetchVisits();
  }, [open, resolvedPatientId]);

  const selectedVisit = visits.find(
    (v) => v._id === selectedVisitId || v.id === selectedVisitId,
  );
  const procedures = selectedVisit?.customFields?.procedures || [];

  const handleAddProcedure = (proc) => {
    const matchedOption = DUMMY_PROCEDURE_OPTIONS.find(
      (opt) => opt.code === proc.code,
    );
    const payload = {
      id: Date.now().toString(),
      code: proc.code || "",
      treatment: proc.treatment || proc.label || proc.description || "",
      charge: matchedOption?.charge || proc.charge || proc.fee || "$0.00",
      tooth: proc.tooth || "",
      site: proc.tooth || "",
      surf: proc.surf || proc.surface || "",
      status: "Treatment Plan",
      provider: "all",
      checked: true,
      tag: matchedOption?.tag || proc.tag,
    };

    if (onAddProcedure) {
      onAddProcedure(payload);
    }
    if (onAdd) {
      onAdd(payload);
    }
    if (onClose) {
      onClose();
    }
  };

  if (!open) {
    return null;
  }

  if (!resolvedPatientId) {
    return (
      <Box
        sx={{
          mt: "12px",
          p: "12px",
          border: `1px solid ${COLORS.BORDER}`,
          borderRadius: radius.md,
          backgroundColor: COLORS.SURFACE_CARD,
        }}
      >
        <Typography sx={{ fontSize: "12px", color: COLORS.TEXT_SECONDARY }}>
          Please select a patient first to view past visits.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: "12px",
        p: "12px",
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.md,
        backgroundColor: COLORS.SURFACE_CARD,
      }}
    >
      <Typography
        sx={{
          fontSize: "13px",
          fontWeight: fontWeight.bold,
          color: COLORS.TEXT_PRIMARY,
          mb: "12px",
        }}
      >
        Add from Past Visit
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {loadingVisits ? (
          <Typography
            sx={{
              fontSize: "12px",
              color: COLORS.TEXT_SECONDARY,
              py: 2,
              textAlign: "center",
            }}
          >
            Loading past visits...
          </Typography>
        ) : visits.length === 0 ? (
          <Typography
            sx={{
              fontSize: "12px",
              color: COLORS.TEXT_SECONDARY,
              py: 2,
              textAlign: "center",
            }}
          >
            No past visits found for this patient.
          </Typography>
        ) : (
          visits.map((v) => {
            const procedures = v?.customFields?.procedures || [];
            return (
              <Box key={v._id || v.id}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: fontWeight.semibold,
                    color: COLORS.TEXT_PRIMARY,
                    mb: "8px",
                    borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
                    pb: "4px",
                  }}
                >
                  {dayjs(v.appointmentDate || v.date || v.createdAt).format(
                    "MMM DD, YYYY",
                  )}{" "}
                  -{" "}
                  {v.appointmentTypeId?.name ||
                    v.appointmentType?.name ||
                    v.appointmentType ||
                    "Visit"}
                </Typography>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: `1px solid ${COLORS.BORDER_LIGHT}`,
                    borderRadius: radius.md,
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: COLORS.SURFACE_CARD }}>
                        <TableCell
                          sx={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: COLORS.TEXT_PRIMARY,
                            py: "6px",
                            width: "25%",
                          }}
                        >
                          CODE
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: COLORS.TEXT_PRIMARY,
                            py: "6px",
                          }}
                        >
                          TREATMENT
                        </TableCell>
                        <TableCell
                          sx={{ py: "6px", width: "60px" }}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {procedures.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            align="center"
                            sx={{
                              py: "12px",
                              fontSize: "12px",
                              color: COLORS.TEXT_SECONDARY,
                            }}
                          >
                            No procedures found for this visit.
                          </TableCell>
                        </TableRow>
                      ) : (
                        procedures.map((p, index) => (
                          <TableRow
                            key={index}
                            sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                          >
                            <TableCell
                              sx={{
                                fontSize: "12px",
                                py: "4px",
                                color: COLORS.TEXT_PRIMARY,
                                fontWeight: fontWeight.medium,
                              }}
                            >
                              {p.code}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "12px",
                                py: "4px",
                                color: COLORS.TEXT_PRIMARY,
                                fontWeight: fontWeight.medium,
                              }}
                            >
                              {p.treatment || p.label || p.description}{" "}
                              {p.tooth ? `(T${p.tooth})` : ""}
                            </TableCell>
                            <TableCell align="right" sx={{ py: "4px" }}>
                              <Button
                                variant="contained"
                                onClick={() => handleAddProcedure(p)}
                                sx={{
                                  backgroundColor: COLORS.PRIMARY,
                                  color: "#fff",
                                  borderRadius: "8px",
                                  height: "28px",
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  textTransform: "none",
                                  px: 1.5,
                                  whiteSpace: "nowrap",
                                  "&:hover": {
                                    backgroundColor: COLORS.PRIMARY_HOVER,
                                  },
                                }}
                              >
                                Add procedure
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default PastVisitProceduresSelector;
