import { useEffect, useState } from "react";
import { Box, Divider, Typography, Tooltip } from "@mui/material";
import { ShieldOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePatientInsurances } from "../../hooks/redux/usePatient";
import { fetchPatientById } from "../../store/slices/patientSlice";
import { selectCurrentPatient } from "../../store/slices/patientSlice";
import { patientService } from "../../services/patient.service";
import { SL } from "./helpers";
import PatientFlagsDialog from "../patient-flags/PatientFlagsDialog";
import { getFlagColor } from "../patient-flags/constants";

const CoveragePanel = ({ pt }) => {
  const hasCoverage = pt.coverage && pt.coverage !== "No active coverage";
  const navigate = useNavigate();
  const [firstInsuranceId, setFirstInsuranceId] = useState(null);
  const [flagsDialogOpen, setFlagsDialogOpen] = useState(false);
  const [localFlags, setLocalFlags] = useState([]);
  const dispatch = useDispatch();
  const { getInsurances, fetchInsurances } = usePatientInsurances();
  // Read patientFlags directly from the live Redux store so they update
  // automatically once fetchPatientById resolves (avoids stale prop issue)
  const currentPatient = useSelector(selectCurrentPatient);
  const reduxFlags = currentPatient?.patientFlags || currentPatient?._raw?.patientFlags || [];

  // Keep localFlags in sync with the Redux store value; this also reflects
  // optimistic updates after saving flags
  useEffect(() => {
    setLocalFlags(reduxFlags);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(reduxFlags)]);

  // Ensure the full patient workspace is fetched when the patient changes
  useEffect(() => {
    if (pt.rawId) {
      dispatch(fetchPatientById(pt.rawId));
    }
  }, [dispatch, pt.rawId]);

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

  const handleViewCoverage = async () => {
    const patientId = pt.rawId;
    let insuranceId = firstInsuranceId || pt.insuranceId;

    if (patientId && !insuranceId) {
      const cached = getInsurances(patientId);
      if (cached && cached.length > 0) {
        const ins = cached[0];
        insuranceId = ins._id || ins.id || ins.insuranceId || ins.coverageId || ins.planId;
      }
      
      if (!insuranceId) {
        try {
          // Note: If data is cached, this thunk may be cancelled by the slice condition and return no payload.
          const action = await fetchInsurances(patientId, false);
          const insurances = action?.payload?.insurances || action?.payload || [];
          if (Array.isArray(insurances) && insurances.length > 0) {
            const ins = insurances[0];
            insuranceId = ins._id || ins.id || ins.insuranceId || ins.coverageId || ins.planId;
            if (insuranceId) setFirstInsuranceId(insuranceId);
          }
        } catch (err) {
          console.error("Failed to fetch insurances on click", err);
        }
      }
    }

    console.log('[CoveragePanel] handleViewCoverage →', { patientId, insuranceId, pt });
    
    if (patientId && insuranceId) {
      navigate(`/patients/${patientId}/insurance/${insuranceId}/edit`);
    } else if (patientId) {
      // If we somehow still don't have the insurance ID (e.g. legacy patient record with just insuranceName),
      // fallback to creating a new insurance record on the AddCoveragePage
      navigate(`/patients/${patientId}/insurance/new`);
    } else {
      navigate("/insurance");
    }
  };

  const handleSaveFlags = async (newFlags) => {
    if (!pt.rawId) return;
    try {
      // Optimistically update UI
      setLocalFlags(newFlags);
      // Save directly via the service
      await patientService.updatePatientWorkspace(pt.rawId, { patientFlags: newFlags });
      // Tell Redux to fetch the latest patient details so other UI components sync up
      dispatch(fetchPatientById(pt.rawId));
    } catch (err) {
      console.error("Failed to save flags:", err);
      // Revert if failed
      // Revert to the last known value from Redux
      setLocalFlags(reduxFlags);
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
      
      {localFlags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, mt: 0.5 }}>
          {localFlags.map((flag, idx) => (
            <Tooltip key={idx} title={flag === 'appointment_reminder' ? 'Appt Reminder' : flag} arrow placement="top">
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '2px', 
                  bgcolor: getFlagColor(flag), 
                  flexShrink: 0,
                  cursor: 'pointer'
                }} 
              />
            </Tooltip>
          ))}
        </Box>
      )}

      <Typography
        onClick={() => setFlagsDialogOpen(true)}
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

      <PatientFlagsDialog
        open={flagsDialogOpen}
        onClose={() => setFlagsDialogOpen(false)}
        initialFlags={localFlags}
        onSave={handleSaveFlags}
      />
    </Box>
  );
};

export default CoveragePanel;

