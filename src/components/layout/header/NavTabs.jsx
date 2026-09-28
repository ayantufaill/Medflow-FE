import { useRef, useState } from "react";
import { Box, Popper, Typography, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PATIENT_SECTION_TABS,
  getPatientSectionPath,
} from "../../patients/PatientSectionTabs";
import { usePatient } from "../../../hooks/redux";

const TABS = [
  { label: "Schedule", path: "/appointments/operatory-schedule" },
  { label: "Patients", path: "/patients" },
  { label: "Clinical", path: "/clinical/treatment-plan" },
  { label: "Finance", path: "/finance" },
  { label: "Patient Reports", path: "/patient-reports" },
];

const REPORT_SUBMENU_ITEMS = [
  { label: "Risk Assessment", path: "risk" },
  { label: "Home Care", path: "homecare" },
  { label: "Concern", path: "concerns" },
  { label: "ShowCase", path: "showcase" },
];

const FINANCE_SUBMENU_ITEMS = [
  { label: "Billing", path: "/finance" },
  { label: "E-trans", path: "/era" },
];

const NavTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPatient, selectedPatientId } = usePatient();
  const theme = useTheme();
  const [patientsMenuAnchor, setPatientsMenuAnchor] = useState(null);
  const patientsMenuCloseTimer = useRef(null);
  const [reportsMenuAnchor, setReportsMenuAnchor] = useState(null);
  const reportsMenuCloseTimer = useRef(null);
  const [financeMenuAnchor, setFinanceMenuAnchor] = useState(null);
  const financeMenuCloseTimer = useRef(null);
  const patientId =
    currentPatient?._id ||
    currentPatient?.id ||
    currentPatient?.PatNum ||
    selectedPatientId;

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
        (location.pathname.startsWith("/patients/") &&
          location.pathname.includes("/report"))
      );
    }
    if (path === "/patients") {
      return (
        (location.pathname === path ||
          location.pathname.startsWith(path + "/")) &&
        !location.pathname.includes("/report")
      );
    }
    if (path === "/finance") {
      return location.pathname === "/finance";
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
    patientsMenuCloseTimer.current = window.setTimeout(
      () => setPatientsMenuAnchor(null),
      150,
    );
  };

  const handleNavClick = (path) => {
    navigate(path);
    setPatientsMenuAnchor(null);
  };

  const handlePatientSectionClick = (tabId) => {
    navigate(getPatientSectionPath(tabId, patientId));
    setPatientsMenuAnchor(null);
  };

  const openReportsMenu = (event) => {
    window.clearTimeout(reportsMenuCloseTimer.current);
    setReportsMenuAnchor(event.currentTarget);
  };

  const closeReportsMenu = () => {
    reportsMenuCloseTimer.current = window.setTimeout(
      () => setReportsMenuAnchor(null),
      150,
    );
  };

  const handleReportClick = (reportPath) => {
    if (!patientId) return;
    navigate(`/patients/${patientId}/report/${reportPath}`);
    setReportsMenuAnchor(null);
  };

  const openFinanceMenu = (event) => {
    window.clearTimeout(financeMenuCloseTimer.current);
    setFinanceMenuAnchor(event.currentTarget);
  };

  const closeFinanceMenu = () => {
    financeMenuCloseTimer.current = window.setTimeout(
      () => setFinanceMenuAnchor(null),
      150,
    );
  };

  const handleFinanceClick = (path) => {
    navigate(path);
    setFinanceMenuAnchor(null);
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
            onMouseEnter={label === "Patients" ? openPatientsMenu : label === "Patient Reports" ? openReportsMenu : label === "Finance" ? openFinanceMenu : undefined}
            onMouseLeave={label === "Patients" ? closePatientsMenu : label === "Patient Reports" ? closeReportsMenu : label === "Finance" ? closeFinanceMenu : undefined}
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
          onMouseEnter={() =>
            window.clearTimeout(patientsMenuCloseTimer.current)
          }
          onMouseLeave={closePatientsMenu}
          sx={{
            minWidth: 260,
            maxWidth: 320,
            maxHeight: 400,
            overflowY: "auto",
            backgroundColor: "#ffffff",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            py: 1,
          }}
        >
          {PATIENT_SECTION_TABS.map((tab) => {
            const isActive =
              location.pathname === getPatientSectionPath(tab.id, patientId);
            return (
              <Typography
                key={tab.id}
                onClick={() => handlePatientSectionClick(tab.id)}
                sx={{
                  px: 2,
                  py: 1.2,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: isActive
                    ? theme.palette.primary.main
                    : "text.secondary",
                  display: "block",
                  cursor: "pointer",
                  transition: "background-color 0.15s, color 0.15s",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                  },
                }}
              >
                {tab.label}
              </Typography>
            );
          })}
        </Box>
      </Popper>
      <Popper
        anchorEl={reportsMenuAnchor}
        open={Boolean(reportsMenuAnchor)}
        placement="bottom-start"
        modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
        sx={{ zIndex: 1600 }}
      >
        <Box
          onMouseEnter={() =>
            window.clearTimeout(reportsMenuCloseTimer.current)
          }
          onMouseLeave={closeReportsMenu}
          sx={{
            minWidth: 200,
            backgroundColor: "#ffffff",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            py: 1,
          }}
        >
          {REPORT_SUBMENU_ITEMS.map((item) => {
            const itemActive = patientId
              ? location.pathname === `/patients/${patientId}/report/${item.path}`
              : false;
            return (
              <Typography
                key={item.path}
                onClick={() => handleReportClick(item.path)}
                sx={{
                  px: 2,
                  py: 1.2,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: itemActive
                    ? theme.palette.primary.main
                    : "text.secondary",
                  display: "block",
                  cursor: "pointer",
                  transition: "background-color 0.15s, color 0.15s",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                  },
                }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Box>
      </Popper>
      <Popper
        anchorEl={financeMenuAnchor}
        open={Boolean(financeMenuAnchor)}
        placement="bottom-start"
        modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
        sx={{ zIndex: 1600 }}
      >
        <Box
          onMouseEnter={() =>
            window.clearTimeout(financeMenuCloseTimer.current)
          }
          onMouseLeave={closeFinanceMenu}
          sx={{
            minWidth: 160,
            backgroundColor: "#ffffff",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            py: 1,
          }}
        >
          {FINANCE_SUBMENU_ITEMS.map((item) => {
            const isDisabled = item.path === "/era";
            const itemActive = location.pathname === item.path;
            return (
              <Typography
                key={item.path}
                onClick={isDisabled ? undefined : () => handleFinanceClick(item.path)}
                sx={{
                  px: 2,
                  py: 1.2,
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: isDisabled ? "#9ca3af" : itemActive
                    ? theme.palette.primary.main
                    : "text.secondary",
                  display: "block",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  transition: "background-color 0.15s, color 0.15s",
                  textDecoration: "none",
                  opacity: isDisabled ? 0.5 : 1,
                  "&:hover": {
                    color: isDisabled ? "#9ca3af" : theme.palette.primary.main,
                    backgroundColor: isDisabled ? "transparent" : "rgba(25, 118, 210, 0.08)",
                  },
                }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Box>
      </Popper>
    </Box>
  );
};

export default NavTabs;
