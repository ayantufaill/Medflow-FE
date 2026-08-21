import { useEffect, useState, useMemo } from "react";
import { Dialog, Box } from "@mui/material";
import apiClient from "../../config/api";
import { radius } from "../../constants/styles";
import { normalizeAuditData } from "./audit-history/utils";
import AuditHistoryHeader from "./audit-history/AuditHistoryHeader";
import AuditHistoryFilter from "./audit-history/AuditHistoryFilter";
import AuditHistoryTable from "./audit-history/AuditHistoryTable";
import AuditHistoryFooter from "./audit-history/AuditHistoryFooter";

const AuditPatientHistoryDialog = ({
  open,
  onClose,
  auditData: propAuditData,
  patientId,
}) => {
  const [auditData, setAuditData] = useState([]);
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setAuditData([]);
      setSelectedAction("ALL");
      setLoading(false);
      setError(null);
      return;
    }

    if (!patientId && propAuditData) {
      setAuditData(normalizeAuditData(propAuditData));
      setError(null);
      setLoading(false);
      return;
    }

    if (!patientId) {
      setAuditData([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadAuditHistory = async () => {
      setLoading(true);
      setError(null);
      setAuditData([]);

      try {
        const response = await apiClient.get(
          `/patients/${patientId}/audit-history`,
          { signal: controller.signal }
        );
        const payload = response?.data?.data || response?.data || {};
        setAuditData(normalizeAuditData(payload));
      } catch (err) {
        if (err?.name === "CanceledError") return;
        setError(
          err?.response?.data?.message ||
            "Failed to load patient audit history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAuditHistory();

    return () => controller.abort();
  }, [open, patientId, propAuditData]);

  // Extract unique actions for filtering
  const availableActions = useMemo(() => {
    const actions = new Set(
      auditData.map((item) => item.rawAction || item.action)
    );
    return Array.from(actions);
  }, [auditData]);

  const filteredAuditData = useMemo(() => {
    if (selectedAction === "ALL") return auditData;
    return auditData.filter(
      (item) => (item.rawAction || item.action) === selectedAction
    );
  }, [auditData, selectedAction]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 26000 }}
      PaperProps={{
        sx: { borderRadius: radius.lg, p: 0, maxHeight: "calc(80vh - 96px)" },
      }}
    >
      <AuditHistoryHeader onClose={onClose} />

      <Box
        sx={{
          p: 2.5,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AuditHistoryFilter 
          selectedAction={selectedAction} 
          setSelectedAction={setSelectedAction} 
          availableActions={availableActions} 
        />
        <AuditHistoryTable 
          loading={loading} 
          error={error} 
          filteredAuditData={filteredAuditData} 
        />
      </Box>

      <AuditHistoryFooter onClose={onClose} />
    </Dialog>
  );
};

export default AuditPatientHistoryDialog;
