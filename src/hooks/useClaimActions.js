import { useState } from 'react';
import { claimService } from '../services/claim.service';

export const useClaimActions = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const convertType = async (selectedIds, newType) => {
    try {
      setLoading(true);
      await Promise.all(
        selectedIds.map((id) => claimService.updateClaim(id, { claimFormat: newType }))
      );
      showMessage(`Converted ${selectedIds.length} claim(s) to ${newType}.`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error converting claims: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (selectedIds, newStatus, currentTab) => {
    try {
      setLoading(true);
      await Promise.all(
        selectedIds.map((id) =>
          claimService.quickStatusUpdate(id, newStatus, "Bulk updated via Change Status")
        )
      );
      showMessage(`Updated status for ${selectedIds.length} claim(s).`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error updating status: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const sendClaims = async (selectedIds, type = 'electronic') => {
    try {
      setLoading(true);
      await claimService.batchSubmitClaims(selectedIds, type);
      showMessage(`Successfully sent ${selectedIds.length} claim(s)!`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error sending claims: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const voidAndRecreate = async (selectedIds) => {
    try {
      setLoading(true);
      await Promise.all(
        selectedIds.map((id) =>
          claimService.quickStatusUpdate(id, "draft", "Voided and recreated draft")
        )
      );
      showMessage(`Voided and Recreated ${selectedIds.length} claim(s). They are now in the UNSENT CLAIMS tab.`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error voiding and recreating claims: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const deleteClaim = async (claimId) => {
    if (window.confirm("Are you sure you want to delete this predetermination?")) {
      try {
        setLoading(true);
        await claimService.updateClaim(claimId, { status: "cancelled" });
        showMessage("Claim cancelled successfully.");
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error(err);
        alert("Error cancelling claim: " + (err.message || err));
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleHide = async (claim) => {
    try {
      const newHidden = !claim.isHidden;
      await claimService.updateClaim(claim.id, { isHidden: newHidden });
      showMessage(`Claim ${newHidden ? "hidden" : "unhidden"} successfully.`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      showMessage("Failed to update claim visibility", "error");
    }
  };

  const exportCSV = (filteredClaims) => {
    const headers = "Patient Name,Claim #,Claim Type,Sent on,Printed on,Carrier,Status,ERA Status,Clearing House Status Message,Description\n";
    const rows = filteredClaims
      .map(
        (c) =>
          `"${c.patientName}","${c.claimNumber}","${c.claimType}","${c.sentDate || ""}","${c.printedDate || ""}","${c.carrier}","${c.status}","${c.eraStatus || ""}","${c.clearingHouseMessage || ""}","${c.description}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "claims_report.csv");
    a.click();
    showMessage("Exported report to CSV!");
  };

  const printPage = () => {
    window.print();
  };

  return {
    loading,
    snackbar,
    closeSnackbar,
    showMessage,
    convertType,
    changeStatus,
    sendClaims,
    voidAndRecreate,
    deleteClaim,
    toggleHide,
    exportCSV,
    printPage,
  };
};
