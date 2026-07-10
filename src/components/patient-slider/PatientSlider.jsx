import { createPortal } from "react-dom";
import { Box } from "@mui/material";
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

const DEFAULT_PATIENT = {
  name: "Ali Tariq",
  id: "765",
  dob: "04/20/1990",
  age: 32,
  email: "jaylen@oryxdentalsoftware.com",
  phone: "+1 (855) 849-5255",
  familyMembersCount: 1,
  familyBalance: "$0.00",
  patientBalance: "$0.00",
  lastPatientPay: "No payment",
  lastInsPay: "No payment",
  location: "Riverside Dental · Operatory 2",
  nextTxAppt: { date: "01/17/2023", time: "10:00 AM", provider: "SMI" },
  nextHygAppt: { date: "01/17/2023", time: "10:00 AM", provider: "SMI" },
  hygQueDate: "01/15/2023",
  badges: ["P", "H", "T", "F", "D"],
  tags: [
    { label: "Hyg", bg: "#dcfce7", color: "#15803d", border: "#86efac" },
    { label: "Tx", bg: "#eff6ff", color: "#2262ef", border: "#bfdbfe" },
  ],
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
  const email = patient.email || patient.patientEmail || "";
  const phone =
    patient.phone ||
    patient.patientPhone ||
    patient.phonePrimary ||
    patient.mobilePhone ||
    "";
  const familyMembersCount =
    patient.household?.length ?? patient.familyMembers?.length ?? patient.family?.length ?? 1;

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

  return {
    name,
    id,
    rawId: patient._id || patient.id || null,
    insuranceId: patient.primaryInsurance?._id || patient.primaryInsurance?.id || patient.insurances?.[0]?._id || patient.insurances?.[0]?.id || null,
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
    nextTxAppt: patient.nextTxAppt || { date: "", time: "", provider: "" },
    nextHygAppt: patient.nextHygAppt || { date: "", time: "", provider: "" },
    hygQueDate: patient.hygQueDate || "",
    badges: patient.badges || ["P", "H", "T", "F", "D"],
    tags: patient.tags || [
      { label: "Hyg", bg: "#dcfce7", color: "#15803d", border: "#86efac" },
      { label: "Tx", bg: "#eff6ff", color: "#2262ef", border: "#bfdbfe" },
    ],
  };
};

const PatientSlider = ({ open, onClose, patient }) => {
  const { currentPatient } = usePatient();
  const pt = toSliderShape(patient || currentPatient) || DEFAULT_PATIENT;

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
        <SliderHeader pt={pt} onClose={onClose} />

        <Box sx={{ display: "flex", backgroundColor: "#fff" }}>
          <DemographicsPanel pt={pt} />
          <ContactPanel pt={pt} />
          <CoveragePanel pt={pt} />
          <BalancePanel pt={pt} />
          <DoctorPanel pt={pt} />
          <HygienistPanel pt={pt} />
        </Box>

        <SliderFooter pt={pt} />
      </Box>
    </>,
    document.body,
  );
};

export default PatientSlider;
