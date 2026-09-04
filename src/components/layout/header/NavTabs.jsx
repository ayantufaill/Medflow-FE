import { useRef, useState } from "react";
import { Box, MenuItem, Popper, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { PATIENT_SECTION_TABS, getPatientSectionPath } from "../../patients/PatientSectionTabs";
import { usePatient } from "../../../hooks/redux";

const TABS = [
  // { label: "Dashboard", path: "/dashboard" },
  { label: "Schedule", path: "/appointments/operatory-schedule" },
  { label: "Patients", path: "/patients" },
  { label: "Clinical", path: "/clinical/treatment-plan" },
  // { label: "Insurance", path: "/insurance" },
  { label: "Billing", path: "/finance" },
  { label: "Reports", path: "/patient-reports" },
];

const NavTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPatient, selectedPatientId } = usePatient();
  const [patientsMenuAnchor, setPatientsMenuAnchor] = useState(null);
  const patientsMenuCloseTimer = useRef(null);
  const patientId = currentPatient?._id || currentPatient?.id || currentPatient?.PatNum || selectedPatientId;

  const isActive = (path) => {
    if (path === "/clinical/treatment-plan") {
      return (
        location.pathname === path || location.pathname.startsWith("/clinical")
      );
    }
    if (path === "/patient-reports") {
      return (
        location.pathname === path ||
        location.pathname.startsWith(path + "/") ||
        (location.pathname.startsWith("/patients/") && location.pathname.includes("/report"))
      );
    }
    if (path === "/patients") {
      return (
        (location.pathname === path || location.pathname.startsWith(path + "/")) &&
        !location.pathname.includes("/report")
      );
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const openPatientsMenu = (event) => {
    window.clearTimeout(patientsMenuCloseTimer.current);
    setPatientsMenuAnchor(event.currentTarget);
  };

  const closePatientsMenu = () => {
    patientsMenuCloseTimer.current = window.setTimeout(() => setPatientsMenuAnchor(null), 150);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setPatientsMenuAnchor(null);
  };

  const handlePatientSectionClick = (tabId) => {
    navigate(getPatientSectionPath(tabId, patientId));
    setPatientsMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexShrink: 0,
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {TABS.map(({ label, path }) => {
        const active = isActive(path);
        return (
          <Box
            key={label}
            onClick={() => handleNavClick(path)}
            onMouseEnter={label === "Patients" ? openPatientsMenu : undefined}
            onMouseLeave={label === "Patients" ? closePatientsMenu : undefined}
            sx={{
              display: "flex",
              alignItems: "center",
              px: "12px",
              py: "6px",
              flexShrink: 0,
              cursor: "pointer",
              borderRadius: "14px",
              backgroundColor: active
                ? "rgba(34, 98, 239, 0.08)"
                : "transparent",
              transition: "background-color 0.15s ease",
              "&:hover": {
                backgroundColor: active
                  ? "rgba(34, 98, 239, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0px",
                fontWeight: active ? 600 : 400,
                color: active ? "#2262ef" : "#5c646f",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
      <Popper
        anchorEl={patientsMenuAnchor}
        open={Boolean(patientsMenuAnchor)}
        placement="bottom-start"
        modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
        sx={{ zIndex: 1600 }}
      >
        <Box
          onMouseEnter={() => window.clearTimeout(patientsMenuCloseTimer.current)}
          onMouseLeave={closePatientsMenu}
          sx={{
            minWidth: 220,
            backgroundColor: "#fff",
            border: "1px solid #e0e5eb",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
            overflow: "hidden",
          }}
        >
          {PATIENT_SECTION_TABS.map((tab) => (
            <MenuItem
              key={tab.id}
              onClick={() => handlePatientSectionClick(tab.id)}
              sx={{
                px: 2,
                py: 1.1,
                fontFamily: "Inter",
                fontSize: "14px",
                color: "#334155",
              }}
            >
              {tab.label}
            </MenuItem>
          ))}
        </Box>
      </Popper>
    </Box>
  );
};

export default NavTabs;
