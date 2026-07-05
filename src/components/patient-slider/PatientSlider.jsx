import { createPortal } from "react-dom";
import { Box } from "@mui/material";
import SliderHeader from "./SliderHeader";
import DemographicsPanel from "./DemographicsPanel";
import ContactPanel from "./ContactPanel";
import CoveragePanel from "./CoveragePanel";
import BalancePanel from "./BalancePanel";
import DoctorPanel from "./DoctorPanel";
import HygienistPanel from "./HygienistPanel";
import SliderFooter from "./SliderFooter";

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
  nextTxAppt:  { date: "01/17/2023", time: "10:00 AM", provider: "SMI" },
  nextHygAppt: { date: "01/17/2023", time: "10:00 AM", provider: "SMI" },
  hygQueDate: "01/15/2023",
  badges: ["P", "H", "T", "F", "D"],
  tags: [
    { label: "Hyg", bg: "#dcfce7", color: "#15803d", border: "#86efac" },
    { label: "Tx",  bg: "#eff6ff", color: "#2262ef", border: "#bfdbfe" },
  ],
};

const PatientSlider = ({ open, onClose, patient }) => {
  const pt = patient || DEFAULT_PATIENT;

  return createPortal(
    <>
      {/* Backdrop */}
      <Box onClick={onClose} sx={{
        position: "fixed", top: "65px", left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
        zIndex: 1300,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.25s ease",
      }} />

      {/* Slider panel */}
      <Box sx={{
        position: "fixed", top: "65px", left: 0, right: 0,
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
      }}>
        <SliderHeader pt={pt} onClose={onClose} />

        <Box sx={{ display: "flex", backgroundColor: "#fff" }}>
          <DemographicsPanel pt={pt} />
          <ContactPanel      pt={pt} />
          <CoveragePanel />
          <BalancePanel      pt={pt} />
          <DoctorPanel       pt={pt} />
          <HygienistPanel    pt={pt} />
        </Box>

        <SliderFooter pt={pt} />
      </Box>
    </>,
    document.body,
  );
};

export default PatientSlider;
