import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import SliderHeader from "./SliderHeader";
import DemographicsPanel from "./DemographicsPanel";
import ContactPanel from "./ContactPanel";
import CoveragePanel from "./CoveragePanel";
import BalancePanel from "./BalancePanel";
import DoctorPanel from "./DoctorPanel";
import HygienistPanel from "./HygienistPanel";
import SliderFooter from "./SliderFooter";
import { usePatient } from "../../hooks/redux";
import { appointmentService } from "../../services/appointment.service";

const EMPTY_APPT = { date: "", time: "", provider: "" };

const getAppointmentDateTime = (appointment) => {
  const rawDate =
    appointment.appointmentDate ||
    appointment.date ||
    appointment.AptDateTime ||
    appointment.start ||
    appointment.startDate;
  if (!rawDate) return null;

  const dateOnly = String(rawDate).split("T")[0];
  const rawTime =
    appointment.startTime ||
    appointment.time ||
    appointment.AptTime ||
    appointment.startTimeLocal;
  const dateTime = rawTime ? dayjs(`${dateOnly}T${rawTime}`) : dayjs(rawDate);

  return dateTime.isValid() ? dateTime : null;
};

const getProviderLabel = (provider) => {
  if (!provider) return "";
  if (typeof provider === "string") return provider;

  const first =
    provider.userId?.firstName ||
    provider.firstName ||
    provider.FName ||
    provider.name ||
    "";
  const last =
    provider.userId?.lastName || provider.lastName || provider.LName || "";

  return (
    `${first} ${last}`.trim() ||
    provider.providerCode ||
    provider._id ||
    provider.id ||
    ""
  );
};

const getAppointmentText = (appointment) => {
  const procedures = Array.isArray(appointment.procedures)
    ? appointment.procedures
        .map((procedure) =>
          typeof procedure === "string"
            ? procedure
            : procedure.treatment || procedure.name || procedure.code || "",
        )
        .join(" ")
    : appointment.procedures || "";

  return [
    appointment.appointmentType,
    appointment.appointmentTypeId?.name,
    appointment.appointmentTypeId?.code,
    appointment.chiefComplaint,
    appointment.note,
    procedures,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

const isHygieneAppointment = (appointment) => {
  const text = getAppointmentText(appointment);
  return (
    text.includes("hyg") ||
    text.includes("recare") ||
    text.includes("recall") ||
    text.includes("prophy") ||
    text.includes("cleaning")
  );
};

const toAppointmentBlock = (appointment) => {
  const dateTime = getAppointmentDateTime(appointment);
  if (!dateTime) return EMPTY_APPT;

  return {
    date: dateTime.format("MM/DD/YYYY"),
    time: dateTime.format("hh:mm A"),
    provider: getProviderLabel(appointment.providerId || appointment.provider),
  };
};

const getUpcomingAppointments = (appointments = []) =>
  appointments
    .map((appointment) => ({
      appointment,
      dateTime: getAppointmentDateTime(appointment),
    }))
    .filter(({ dateTime }) => dateTime && dateTime.isAfter(dayjs()))
    .sort((a, b) => a.dateTime.valueOf() - b.dateTime.valueOf())
    .map(({ appointment }) => appointment);

const deriveNextAppointments = (appointments = []) => {
  const upcoming = getUpcomingAppointments(appointments);
  const nextHyg = upcoming.find(isHygieneAppointment);
  const nextTx =
    upcoming.find((appointment) => !isHygieneAppointment(appointment)) ||
    upcoming[0];

  return {
    nextTxAppt: nextTx ? toAppointmentBlock(nextTx) : EMPTY_APPT,
    nextHygAppt: nextHyg ? toAppointmentBlock(nextHyg) : EMPTY_APPT,
  };
};

const toSliderShape = (patient) => {
  if (!patient) return null;

  const name =
    patient.name ||
    `${patient.firstName || ""} ${patient.lastName || ""}`.trim() ||
    "Unknown Patient";
  const id =
    patient.id ||
    patient.patientNumber ||
    patient.patientCode ||
    patient._id?.slice(-6)?.toUpperCase() ||
    "----";
  const dob =
    patient.dob ||
    (patient.dateOfBirth
      ? dayjs(patient.dateOfBirth).format("MM/DD/YYYY")
      : "--");
  const age =
    patient.age ??
    (patient.dateOfBirth
      ? dayjs().diff(dayjs(patient.dateOfBirth), "year")
      : "--");
  const email = patient.email || patient.patientEmail || "-";
  const phone =
    patient.phone ||
    patient.patientPhone ||
    patient.phonePrimary ||
    patient.mobilePhone ||
    "-";

  const familyMembersCount =
    patient.familyMembers?.length ??
    patient.family?.length ??
    patient.household?.length ??
    0;

  const familyBalanceRaw =
    patient.balanceBreakdown?.familyTotalOutstanding ??
    patient.balanceBreakdown?.totalOutstanding ??
    patient.balanceBreakdown?.insuranceBalance ??
    patient.familyBalance ??
    0;
  const patientBalanceRaw =
    patient.balanceBreakdown?.individualOutstanding ??
    patient.balanceBreakdown?.patientBalance ??
    patient.patientBalance ??
    0;

  const familyBalance =
    typeof familyBalanceRaw === "number"
      ? `$${familyBalanceRaw.toLocaleString()}`
      : familyBalanceRaw || "$0.00";
  const patientBalance =
    typeof patientBalanceRaw === "number"
      ? `$${patientBalanceRaw.toLocaleString()}`
      : patientBalanceRaw || "$0.00";

  const paidBy =
    patient.paymentMethod?.paidBy ||
    patient.primaryInsurance?.name ||
    patient.insuranceName;
  const hasCoverage = Boolean(paidBy && paidBy !== "Self Pay");
  const coverage = hasCoverage ? paidBy : "No active coverage";
  const appointments =
    patient.appointments ||
    patient.patientAppointments ||
    patient.appointmentHistory ||
    [];
  const derivedAppointments = deriveNextAppointments(appointments);

  return {
    name,
    id,
    rawId: patient._id || patient.id || null,
    insuranceId:
      patient.primaryInsurance?._id ||
      patient.primaryInsurance?.id ||
      patient.insurances?.[0]?._id ||
      patient.insurances?.[0]?.id ||
      null,
    dob,
    age,
    email,
    phone,
    familyMembersCount,
    familyBalance,
    patientBalance,
    coverage,
    lastPatientPay: patient.lastPatientPay || "No payment",
    lastInsPay: patient.lastInsPay || "No payment",
    location: patient.location || "Riverside Dental · Operatory 2",
    preferredDentistId: patient.preferredDentistId || "",
    preferredHygienistId: patient.preferredHygienistId || "",
    nextTxAppt: patient.nextTxAppt || derivedAppointments.nextTxAppt,
    nextHygAppt: patient.nextHygAppt || derivedAppointments.nextHygAppt,
    hygQueDate: patient.hygQueDate || "",
    badges: patient.badges || ["P", "H", "T", "F", "D"],
    tags: patient.tags || [
      { label: "Hyg", bg: "#dcfce7", color: "#15803d", border: "#86efac" },
      { label: "Tx", bg: "#eff6ff", color: "#2262ef", border: "#bfdbfe" },
    ],
    _raw: patient,
  };
};

const PatientSlider = ({ open, onClose, patient }) => {
  const { currentPatient } = usePatient();
  const sourcePatient = patient || currentPatient;
  const basePt = useMemo(() => toSliderShape(sourcePatient), [sourcePatient]);
  const [fetchedAppointments, setFetchedAppointments] = useState({
    patientId: null,
    appointments: [],
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAppointmentsData = (patientId) => {
    setIsRefreshing(true);
    appointmentService
      .getPatientAppointments(patientId, 50)
      .then((appointments) => {
        setFetchedAppointments({
          patientId,
          appointments: Array.isArray(appointments) ? appointments : [],
        });
      })
      .catch((err) => {
        console.error("Failed to fetch player appointments:", err);
        setFetchedAppointments({ patientId, appointments: [] });
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    const patientId = sourcePatient?._id || sourcePatient?.id;
    const hasAppointments =
      sourcePatient?.appointments ||
      sourcePatient?.patientAppointments ||
      sourcePatient?.appointmentHistory;

    if (!open || !patientId || hasAppointments) {
      return;
    }

    fetchAppointmentsData(patientId);
  }, [open, sourcePatient]);

  // Action function sent down to SliderHeader for execution
  const handleRefresh = () => {
    const patientId = sourcePatient?._id || sourcePatient?.id;
    if (patientId) {
      fetchAppointmentsData(patientId);
    }
  };

  const pt = useMemo(() => {
    if (!basePt) return null;
    if (
      !fetchedAppointments.appointments.length ||
      String(fetchedAppointments.patientId) !== String(basePt.rawId)
    ) {
      return basePt;
    }

    const derivedAppointments = deriveNextAppointments(
      fetchedAppointments.appointments,
    );

    return {
      ...basePt,
      nextTxAppt: derivedAppointments.nextTxAppt,
      nextHygAppt: derivedAppointments.nextHygAppt,
    };
  }, [basePt, fetchedAppointments]);

  if (!pt) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          top: "65px",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(2px)",
          zIndex: 1300,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Slider panel */}
      <Box
        sx={{
          position: "fixed",
          top: "65px",
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderBottom: "2px solid #2262ef",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          zIndex: 1301,
          transform: open ? "translateY(0)" : "translateY(-110%)",
          visibility: open ? "visible" : "hidden",
          transition: open
            ? "transform 0.28s cubic-bezier(0.4,0,0.2,1)"
            : "transform 0.28s cubic-bezier(0.4,0,0.2,1), visibility 0s linear 0.28s",
          overflowX: "auto",
        }}
      >
        <SliderHeader pt={pt} onClose={onClose} onRefresh={handleRefresh} isRefreshing={isRefreshing} />

        <Box sx={{ position: "relative", display: "flex", backgroundColor: "#fff", minHeight: "150px" }}>
          {isRefreshing && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={32} thickness={4} sx={{ color: "#2262ef" }} />
            </Box>
          )}
          <DemographicsPanel pt={pt} />
          <ContactPanel pt={pt} />
          <CoveragePanel pt={pt} />
          <BalancePanel pt={pt} />
          <DoctorPanel
            key={`${pt.rawId || pt.id}-dentist-${pt.preferredDentistId || ""}`}
            pt={pt}
          />
          <HygienistPanel
            key={`${pt.rawId || pt.id}-hygienist-${pt.preferredHygienistId || ""}`}
            pt={pt}
          />
        </Box>

        <SliderFooter pt={pt} />
      </Box>
    </>,
    document.body,
  );
};

export default PatientSlider;
