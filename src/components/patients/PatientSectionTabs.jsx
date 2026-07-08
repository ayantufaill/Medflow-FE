import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

export const PATIENT_SECTION_TABS = [
  { id: "details", label: "Patient Details" },
  { id: "vitals", label: "Vitals" },
  { id: "medical", label: "Medical History" },
  { id: "dental", label: "Dental History" },
  { id: "insurance", label: "Insurance" },
  { id: "additional", label: "Additional Docs" },
  { id: "signed", label: "Signed Docs" },
];

const PatientSectionTabs = ({ activeTab, patientId = "" }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    if (!patientId) {
      navigate("/patients");
      return;
    }
    
    switch (tabId) {
      case "details":
        navigate(`/patients/details/${patientId}`);
        break;
      case "vitals":
        navigate(`/vital-signs/patient/${patientId}`);
        break;
      case "medical":
        navigate(`/patients/${patientId}/medical-history`);
        break;
      case "dental":
        navigate(`/patients/${patientId}/dental-history`);
        break;
      case "insurance":
        navigate(`/patients/details/${patientId}?tab=insurance`);
        break;
      case "additional":
        navigate(`/patients/${patientId}/additional-documents`);
        break;
      case "signed":
        navigate(`/patients/${patientId}/signed-documents`);
        break;
      default:
        navigate("/patients");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 3,
        mb: 2,
        px: 2,
        py: 0.5,
        borderBottom: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
      }}
    >
      {PATIENT_SECTION_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Button
            key={tab.id}
            variant="text"
            size="small"
            onClick={() => handleTabClick(tab.id)}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.8rem",
              py: 1.25,
              px: 0.5,
              borderRadius: 0,
              borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
              color: isActive ? "#2563eb" : "#64748b",
              minWidth: "auto",
              "&:hover": {
                bgcolor: "transparent",
                color: "#2563eb",
                borderBottom: "2px solid #2563eb",
              },
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </Box>
  );
};

export default PatientSectionTabs;
