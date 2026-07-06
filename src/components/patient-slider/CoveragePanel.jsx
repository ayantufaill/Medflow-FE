import { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { ShieldOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { usePatientInsurances } from "../../hooks/redux/usePatient";
import { SL } from "./helpers";

const CoveragePanel = ({ pt }) => {
  const hasCoverage = pt.coverage && pt.coverage !== "No active coverage";
  const navigate = useNavigate();
  const { fetchInsurances, getInsurances } = usePatientInsurances();
  const [firstInsuranceId, setFirstInsuranceId] = useState(null);

  // Fetch insurances for this patient so we can build the edit URL
  useEffect(() => {
    const patientId = pt.rawId;
    if (!patientId || !hasCoverage) return;

    // Try cache first
    const cached = getInsurances(patientId);
    if (cached && cached.length > 0) {
      setFirstInsuranceId(cached[0]._id || cached[0].id);
      return;
    }

    fetchInsurances(patientId, false).then((action) => {
      const insurances = action?.payload?.insurances || action?.payload || [];
      if (Array.isArray(insurances) && insurances.length > 0) {
        setFirstInsuranceId(insurances[0]._id || insurances[0].id);
      }
    });
  }, [pt.rawId, hasCoverage]);

  const handleAddCoverage = () => {
    const patientId = pt.rawId;
    const url = patientId ? `/patients/${patientId}/insurance/new` : "/insurance/new";
    console.log('[CoveragePanel] navigating add →', url, { patientId, rawId: pt.rawId });
    navigate(url);
  };

  const handleViewCoverage = () => {
    const patientId = pt.rawId;
    const insuranceId = firstInsuranceId;
    console.log('[CoveragePanel] handleViewCoverage →', { patientId, insuranceId, pt });
    if (patientId && insuranceId) {
      navigate(`/patients/${patientId}/insurance/${insuranceId}/edit`);
    } else if (patientId) {
      navigate(`/patients/${patientId}/insurance`);
    } else {
      navigate("/insurance");
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        px: "16px",
        py: "12px",
        borderRight: "1px solid #f0f2f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "6px",
          mb: "4px",
        }}
      >
        <ShieldOutlined
          sx={{ fontSize: "13px", color: "#9aa3ae", mt: "1px", flexShrink: 0 }}
        />
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "11px",
            fontWeight: 600,
            color: "#09121f",
          }}
        >
          {hasCoverage
            ? `Active coverage: ${pt.coverage}`
            : "Patient has no active coverage"}
        </Typography>
      </Box>
      <Typography
        onClick={hasCoverage ? handleViewCoverage : handleAddCoverage}
        sx={{
          fontFamily: "Inter",
          fontSize: "11px",
          color: "#2262ef",
          cursor: "pointer",
          pl: "19px",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {hasCoverage ? "View coverage" : "+ Add insurance"}
      </Typography>

      <Divider sx={{ my: "10px", borderColor: "#f0f2f5" }} />

      <SL>Patient Flags</SL>
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "11px",
          color: "#2262ef",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        + Add flags
      </Typography>
    </Box>
  );
};

export default CoveragePanel;

