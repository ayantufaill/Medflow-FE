import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Checkbox,
  Typography,
  Divider,
  Dialog,
  DialogContent,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  CalendarMonth,
  Print,
  Edit,
  NotInterested,
  Settings,
  AutoFixHigh,
  CheckCircle,
  Refresh,
  Tune,
  MoreHoriz,
} from "@mui/icons-material";

// Redux
import {
  createInvoice,
  fetchLedgerItems,
  fetchInvoiceDetails,
  backdateTransaction,
  voidTransaction,
  applyCourtesyCredit,
  undoCourtesyCredit,
  selectLedgerItemsForPatient,
  selectLedgerLoading,
  selectAdjustmentTypeMap,
  setAdjustmentTypeForItem,
  transferOutstandingToPatient,
  transferOutstandingToInsurance,
} from "../../store/slices/billingSlice";
import {
  fetchMedicalHistoryThunk,
  fetchDentalHistoryThunk,
  fetchPatientBalance,
  invalidatePatientBalance,
} from "../../store/slices/patientSlice";
import { paymentService } from "../../services/payment.service";

import LedgerItemCard from "./LedgerItemCard";
import { invoiceService } from "../../services/invoice.service";
import LedgerDialogManager from "./LedgerDialogManager";
import {
  clearInvoiceDraft,
  draftSourceKey,
  findResumableInvoiceDraft,
  listInvoiceDrafts,
  readInvoiceDraft,
  saveInvoiceDraft,
} from "../../utils/invoiceDraftStore";
import { claimService } from "../../services/claim.service";
import ManageEOBModal from "../claims/batch-actions/modals/ManageEOBModal";
import EditClaimDialog from "../claims/EditClaimDialog";
import ModifyClaimStatusDialog from "./ModifyClaimStatusDialog";
import VoidConfirmationDialog from "./VoidConfirmationDialog";
import { useSnackbar } from "../../contexts/SnackbarContext";

const LedgerList = ({ patient, expanded, filters }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const patientId = patient?._id || patient?.id;
  const { showSnackbar } = useSnackbar();

  // ── Redux state ──────────────────────────────────────────────────────────
  const ledgerItems = useSelector(selectLedgerItemsForPatient(patientId));
  const ledgerLoading = useSelector(selectLedgerLoading);
  const adjustmentTypeMap = useSelector(selectAdjustmentTypeMap);

  // ── Local UI state (dialogs / menus — no data) ───────────────────────────
  const [expandedItems, setExpandedItems] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarTarget, setCalendarTarget] = useState(null);
  const [adjItem, setAdjItem] = useState(null);
  const [printItem, setPrintItem] = useState(null);
  const [printAnchorEl, setPrintAnchorEl] = useState(null);
  const [adjAnchorEl, setAdjAnchorEl] = useState(null);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [showDebitDialog, setShowDebitDialog] = useState(false);
  const [showMembershipDialog, setShowMembershipDialog] = useState(false);
  const [showWriteOffDialog, setShowWriteOffDialog] = useState(false);
  const [showVoidDialog, setShowVoidDialog] = useState(false);
  const [showVoidProceduresDialog, setShowVoidProceduresDialog] = useState(false);
  const [voidTarget, setVoidTarget] = useState(null);
  const [showCourtesyCredit, setShowCourtesyCredit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [showUndoDialog, setShowUndoDialog] = useState(false);
  const [undoTarget, setUndoTarget] = useState(null);
  const [showSimpleStatement, setShowSimpleStatement] = useState(false);
  const [showDetailedStatement, setShowDetailedStatement] = useState(false);
  const [showEditDeposit, setShowEditDeposit] = useState(false);
  const [editDepositTarget, setEditDepositTarget] = useState(null);
  const [showTransferConfirmation, setShowTransferConfirmation] =
    useState(false);
  const [transferTarget, setTransferTarget] = useState(null);
  // Which way the magic stick is transferring: outstanding insurance -> patient,
  // or the patient's remaining balance -> insurance.
  const [transferDirection, setTransferDirection] = useState("patient");
  const [isTransferRefreshing, setIsTransferRefreshing] = useState(false);
  const [showEditInvoice, setShowEditInvoice] = useState(false);
  const [editInvoiceTarget, setEditInvoiceTarget] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceModalData, setInvoiceModalData] = useState(null);
  // Draft of the modal's current contents, replayed into it on open. Held in
  // state (not read straight from storage at render) so the object identity is
  // stable while the modal is mounted and doesn't retrigger its seed effect.
  const [invoiceModalDraft, setInvoiceModalDraft] = useState(null);
  const [magicStickAnchorEl, setMagicStickAnchorEl] = useState(null);
  const [showAttachDialog, setShowAttachDialog] = useState(false);
  const [attachTarget, setAttachTarget] = useState(null);
  const [showEOBModal, setShowEOBModal] = useState(false);
  const [eobTarget, setEOBTarget] = useState(null);

  const handleEOBClick = (data) => {
    setEOBTarget(data);
    setShowEOBModal(true);
  };
  const [showEditClaimDialog, setShowEditClaimDialog] = useState(false);
  const [editClaimTarget, setEditClaimTarget] = useState(null);
  const [showModifyClaimStatus, setShowModifyClaimStatus] = useState(false);
  const [modifyClaimTarget, setModifyClaimTarget] = useState(null);
  const [showVoidClaimDialog, setShowVoidClaimDialog] = useState(false);
  const [voidClaimTarget, setVoidClaimTarget] = useState(null);

  const handleEditClaimClick = (claimData) => {
    setEditClaimTarget(claimData);
    setShowEditClaimDialog(true);
  };

  const handleOpenModifyClaimStatus = (claimData) => {
    setModifyClaimTarget(claimData);
    setShowModifyClaimStatus(true);
  };

  const handleModifyClaimStatusSave = async ({
    label,
    status,
    remittanceDate,
    insurancePaymentAmount,
  }) => {
    const claimId = modifyClaimTarget?.id || modifyClaimTarget?._id;
    if (!claimId) {
      showSnackbar('No claim selected to update', 'error');
      return;
    }
    try {
      const updates = {
        status,
        notes: `Status changed to ${label} from patient ledger`,
      };
      if (remittanceDate) {
        updates.remittanceDate = remittanceDate;
      }
      if (insurancePaymentAmount !== null && insurancePaymentAmount !== undefined) {
        updates.insurancePaymentAmount = insurancePaymentAmount;
        // Keep the claim's paid amount in step with the insurance remittance.
        updates.paidAmount = insurancePaymentAmount;
      }
      await claimService.updateClaim(claimId, updates);
      showSnackbar(`Claim status changed to ${label}`, 'success');
      setShowModifyClaimStatus(false);
      setModifyClaimTarget(null);
      refreshLedger();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          'Failed to change claim status',
        'error',
      );
    }
  };

  const handleSendClaimClick = async (claimData) => {
    if (!claimData?.id) return;
    try {
      await claimService.quickStatusUpdate(
        claimData.id,
        "submitted",
        "Submitted from Ledger",
      );
      dispatch(fetchLedgerItems(patientId));
    } catch (err) {
      console.error("Failed to submit claim", err);
    }
  };

  const handleVoidAndRecreateClick = async (claimData) => {
    if (!claimData?.id) return;
    try {
      await claimService.quickStatusUpdate(
        claimData.id,
        "readyForSubmission",
        "Voided and recreated",
      );
      dispatch(fetchLedgerItems(patientId));
    } catch (err) {
      console.error("Failed to void and recreate claim", err);
    }
  };

  const [showAdaDialog, setShowAdaDialog] = useState(false);
  const [adaTarget, setAdaTarget] = useState(null);

  const handlePrintClaimClick = (claim) => {
    setAdaTarget(claim);
    setShowAdaDialog(true);
  };

  // Per-claim visual open/closed state. This is presentation only — it never
  // writes claim status; the initial value falls back to the real claim status.
  const [closedClaimOverrides, setClosedClaimOverrides] = useState({});

  const handleToggleClaimClosed = (claim) => {
    const claimKey = claim?.id;
    if (claimKey === undefined || claimKey === null) return;
    setClosedClaimOverrides((prev) => {
      const current = prev[claimKey];
      if (current === undefined) {
        const statusIsClosed = ["paid", "cancelled"].includes(
          (claim.status || "").toLowerCase(),
        );
        return { ...prev, [claimKey]: !statusIsClosed };
      }
      return { ...prev, [claimKey]: !current };
    });
  };

  // Local deposit edits (not server-persisted in the original code either)
  const [depositOverrides, setDepositOverrides] = useState({});

  // Refs to access current state inside useCallback without triggering listener resets
  const ledgerItemsRef = React.useRef(ledgerItems);
  ledgerItemsRef.current = ledgerItems;
  const expandedItemsRef = React.useRef(expandedItems);
  expandedItemsRef.current = expandedItems;

  // ── Fetch on mount / patientId change ────────────────────────────────────
  const refreshLedger = useCallback(() => {
    if (patientId) {
      dispatch(fetchLedgerItems(patientId));
      dispatch(fetchMedicalHistoryThunk(patientId));
      dispatch(fetchDentalHistoryThunk(patientId));

      // Re-fetch details for any currently expanded invoices so embedded payments appear
      const currentExpanded = expandedItemsRef.current || {};
      const currentLedger = ledgerItemsRef.current || [];

      Object.keys(currentExpanded).forEach((idxStr) => {
        const idx = parseInt(idxStr, 10);
        if (currentExpanded[idx]) {
          const item = currentLedger[idx];
          if (item && item.method === "Invoice") {
            dispatch(fetchInvoiceDetails({ patientId, invoiceId: item.id }));
          }
        }
      });
    }
  }, [dispatch, patientId]);

  useEffect(() => {
    refreshLedger();
    window.addEventListener("refresh-ledger", refreshLedger);
    window.addEventListener("add-ledger-item", refreshLedger);
    return () => {
      window.removeEventListener("refresh-ledger", refreshLedger);
      window.removeEventListener("add-ledger-item", refreshLedger);
    };
  }, [refreshLedger]);

  const prevExpandedRef = React.useRef(expanded);
  useEffect(() => {
    // Only reset if the `expanded` prop itself changed (e.g. parent toggled expand-all)
    if (expanded !== undefined && expanded !== prevExpandedRef.current) {
      prevExpandedRef.current = expanded;
      const all = {};
      ledgerItems.forEach((item, idx) => {
        all[idx] = expanded;
        // If expanding all, automatically fetch details for any invoices missing them
        if (expanded && item.method === "Invoice" && !item.details) {
          dispatch(fetchInvoiceDetails({ patientId, invoiceId: item.id }));
        }
      });
      setExpandedItems(all);
    }
  }, [expanded, ledgerItems, dispatch, patientId]);

  useEffect(() => {
    if (location.state?.invoiceId && ledgerItems.length > 0) {
      const targetInvoiceId = location.state.invoiceId;
      const idx = ledgerItems.findIndex(
        (item) =>
          String(item.id) === String(targetInvoiceId) ||
          String(item.invoiceNumber) === String(targetInvoiceId),
      );

      if (idx !== -1) {
        setExpandedItems((prev) => {
          if (!prev[idx]) {
            const targetItem = ledgerItems[idx];
            if (targetItem?.method === "Invoice") {
              dispatch(
                fetchInvoiceDetails({ patientId, invoiceId: targetItem.id }),
              );
            }
            return { ...prev, [idx]: true };
          }
          return prev;
        });

        setTimeout(() => {
          const element = document.getElementById(`ledger-item-${idx}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            // Add a temporary highlight effect
            element.style.transition = "box-shadow 0.3s ease-in-out";
            element.style.boxShadow = "0 0 10px 2px #4caf50";
            setTimeout(() => {
              element.style.boxShadow = "none";
            }, 2000);
          }
        }, 300);
      }
    }
  }, [location.state?.invoiceId, ledgerItems, patientId, dispatch]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleItemClick = (idx) => {
    setExpandedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
    const targetItem = ledgerItems[idx];
    // condition() in the thunk guards against duplicate/in-flight fetches
    if (targetItem?.method === "Invoice") {
      dispatch(fetchInvoiceDetails({ patientId, invoiceId: targetItem.id }));
    }
  };

  const handleCalendarClick = (item, event) => {
    setAnchorEl(event.currentTarget);
    setCalendarTarget(item);
  };

  const handleBackdateDone = async (date) => {
    console.log(
      "handleBackdateDone called with:",
      date,
      "calendarTarget:",
      calendarTarget,
    );
    if (!calendarTarget) {
      console.warn("calendarTarget is null");
    }
    if (!date) {
      console.warn("date is empty or null");
    }

    if (calendarTarget && date) {
      console.log("Dispatching backdateTransaction...", {
        patientId,
        itemId: calendarTarget.id,
        date,
        isAdjustment: calendarTarget.isAdjustment,
      });
      try {
        await dispatch(
          backdateTransaction({
            patientId,
            itemId: calendarTarget.id,
            date,
            isAdjustment: calendarTarget.isAdjustment,
          }),
        ).unwrap();
        console.log("backdateTransaction succeeded");
      } catch (err) {
        console.error("backdateTransaction failed", err);
        alert("Failed to backdate: " + err);
      }
    }
    setCalendarTarget(null);
    setAnchorEl(null);
  };

  const handleVoidClick = (item) => {
    setVoidTarget(item);
    // A void on an invoice row is a per-procedure decision: ask which ones
    // rather than dropping the whole invoice in one shot.
    if (item?.isGrouped && !item?.isAdjustment) {
      setShowVoidProceduresDialog(true);
    } else {
      setShowVoidDialog(true);
    }
  };
  const handleVoidCancel = () => {
    setShowVoidDialog(false);
    setVoidTarget(null);
  };
  const handleVoidProceduresCancel = () => {
    setShowVoidProceduresDialog(false);
    setVoidTarget(null);
  };
  // Void only the chosen procedures; each one is removed from the invoice and
  // the invoice is recalculated, so the untouched rows survive intact.
  const handleVoidProceduresConfirm = async (selectedIds) => {
    if (!voidTarget || !selectedIds || selectedIds.length === 0) return;

    const failed = [];
    let firstError = null;
    for (const itemId of selectedIds) {
      try {
        await dispatch(
          voidTransaction({
            patientId,
            invoiceId: voidTarget.invoiceId,
            itemId,
            isAdjustment: false,
            isGrouped: false,
            isPayment: false,
          }),
        ).unwrap();
      } catch (err) {
        // The thunk rejects with the server's message, which for a finalized
        // invoice explains that the whole invoice has to be voided instead.
        if (firstError === null) firstError = err;
        failed.push(itemId);
      }
    }

    if (failed.length > 0) {
      showSnackbar(
        firstError?.message ||
          `Could not void ${failed.length} ${failed.length === 1 ? "procedure" : "procedures"}.`,
        "error",
      );
    } else {
      showSnackbar(
        `${selectedIds.length} ${selectedIds.length === 1 ? "procedure" : "procedures"} voided`,
        "success",
      );
    }

    setShowVoidProceduresDialog(false);
    setVoidTarget(null);
  };
  const handleVoidConfirm = async () => {
    if (voidTarget) {
      try {
        console.log("Dispatching voidTransaction with:", voidTarget);
        await dispatch(
          voidTransaction({
            patientId,
            invoiceId: voidTarget.invoiceId, // might be undefined for adjustments
            itemId: voidTarget.id,
            isAdjustment: voidTarget.isAdjustment,
            isGrouped: voidTarget.isGrouped,
            isPayment: voidTarget.isPayment,
            isDeposit:
              voidTarget.isPatientDeposit ||
              voidTarget.depositType === "patient" ||
              voidTarget.depositType === "insurance",
          }),
        ).unwrap();
        console.log("voidTransaction succeeded");
      } catch (err) {
        console.error("voidTransaction failed:", err);
      }
    }
    setShowVoidDialog(false);
    setVoidTarget(null);
  };

  const handleEditClick = (item) => {
    setEditTarget(item);
    setShowCourtesyCredit(true);
  };

  const handleCourtesyCreditSave = async (data) => {
    await dispatch(
      applyCourtesyCredit({
        patientId,
        procedureId: data.id,
        invoiceId: data.invoiceId,
        adjustmentType: data.adjustmentType,
        creditAmount: data.creditAmount,
      }),
    );
    // Optimistically update the local adjustmentTypeMap via dispatch (slice handles it too)
    dispatch(
      setAdjustmentTypeForItem({
        key: `${data.invoiceId}-${data.id}`,
        adjustmentType: data.adjustmentType,
      }),
    );
    setShowCourtesyCredit(false);
    setEditTarget(null);
  };

  const handleCourtesyCreditCancel = () => {
    setShowCourtesyCredit(false);
    setEditTarget(null);
  };

  const handleRefreshClick = (data) => {
    setUndoTarget(data);
    setShowUndoDialog(true);
  };
  const handleUndoCancel = () => {
    setShowUndoDialog(false);
    setUndoTarget(null);
  };
  const handleUndoConfirm = async () => {
    if (undoTarget) {
      try {
        if (undoTarget.isAdjustment) {
          console.log(
            "Dispatching voidTransaction for adjustment with:",
            undoTarget,
          );
          await dispatch(
            voidTransaction({
              patientId,
              invoiceId: undoTarget.invoiceId,
              itemId: undoTarget.id,
              isAdjustment: true,
            }),
          ).unwrap();
          console.log("voidTransaction succeeded");
        } else if (undoTarget.isPayment) {
          console.log("Dispatching voidPayment with:", undoTarget);
          await paymentService.voidPayment(undoTarget.id, "Undone by user");
          console.log("voidPayment succeeded");
        } else {
          console.log("Dispatching undoCourtesyCredit with:", undoTarget);
          await dispatch(
            undoCourtesyCredit({
              patientId,
              procedureId: undoTarget.id,
              invoiceId: undoTarget.invoiceId,
            }),
          ).unwrap();
          console.log("undoCourtesyCredit succeeded");
        }
      } catch (err) {
        console.error("undo action failed:", err);
      }
    }
    setShowUndoDialog(false);
    setUndoTarget(null);
    refreshLedger();
  };

  const handleTransferConfirm = async () => {
    const target = transferTarget;
    if (!target) {
      setShowTransferConfirmation(false);
      return;
    }

    setIsTransferRefreshing(true);
    setShowTransferConfirmation(false);
    setTransferTarget(null);

    const toInsurance = transferDirection === "insurance";
    const transferThunk = toInsurance
      ? transferOutstandingToInsurance
      : transferOutstandingToPatient;
    const noAmountLabel = toInsurance
      ? "outstanding patient balance"
      : "outstanding insurance estimate";

    // How much is actually available to move in the chosen direction.
    const getTransferableAmount = (row) => {
      const raw = toInsurance
        ? (row.ptPortion ?? row.patientAmount ?? row.patient ?? row.ptAmt ?? 0)
        : (row.insuranceAmount ??
          row.insPortion ??
          row.insurancePortion ??
          row.insAmt ??
          row.insurance ??
          0);
      return Number(String(raw).replace(/[^0-9.-]+/g, "")) || 0;
    };

    try {
      if (target.isGrouped && target.procedures) {
        let successCount = 0;
        let skippedCount = 0;
        for (let i = 0; i < target.procedures.length; i++) {
          const proc = target.procedures[i];
          const procId = proc.ProcNum || proc._id || proc.id;
          const amount = getTransferableAmount(proc);
          if (amount <= 0) {
            skippedCount++;
            console.warn(
              `Skipping transfer for procedure with no ${noAmountLabel}:`,
              procId,
              amount,
            );
            continue;
          }
          if (procId) {
            const isLast = i === target.procedures.length - 1;
            try {
              await dispatch(
                transferThunk({
                  patientId,
                  invoiceId: target.invoiceId,
                  procedureId: procId,
                  skipFetch: !isLast,
                }),
              ).unwrap();
              successCount++;
            } catch (err) {
              console.error("Failed to transfer for procedure:", procId, err);
              showSnackbar(
                err || `Failed to transfer ${noAmountLabel}`,
                "error",
              );
            }
          }
        }
        try {
          refreshLedger();
        } catch (e) {
          console.warn("refreshLedger failed after grouped transfer", e);
        }
        if (successCount === 0 && target.procedures.length > 0) {
          console.warn(`No procedures had ${noAmountLabel} to transfer`);
          if (skippedCount === target.procedures.length) {
            showSnackbar(
              `No ${noAmountLabel} to transfer for selected procedures`,
              "warning",
            );
          }
        }
      } else {
        const amount = getTransferableAmount(target);
        if (amount <= 0) {
          console.warn(
            `No ${noAmountLabel} to transfer for item:`,
            target,
          );
          showSnackbar(
            `No ${noAmountLabel} to transfer for this item`,
            "warning",
          );
        } else {
          try {
            await dispatch(
              transferThunk({
                patientId,
                invoiceId: target.invoiceId,
                procedureId: target.id,
              }),
            ).unwrap();
            try {
              refreshLedger();
            } catch (e) {
              console.warn("refreshLedger failed after transfer", e);
            }
          } catch (err) {
            console.error("Transfer outstanding failed:", err);
            showSnackbar(err || `Failed to transfer ${noAmountLabel}`, "error");
          }
        }
      }
    } finally {
      setIsTransferRefreshing(false);
    }
  };

  const handleCollapsedEditClick = (item) => {
    setEditDepositTarget(item);
    setShowEditDeposit(true);
  };
  const handleEditDepositSave = (data) => {
    if (editDepositTarget) {
      setDepositOverrides((prev) => ({
        ...prev,
        [editDepositTarget.id]: data,
      }));
    }
    setShowEditDeposit(false);
    setEditDepositTarget(null);
  };
  const handleEditDepositCancel = () => {
    setShowEditDeposit(false);
    setEditDepositTarget(null);
  };

  const handlePrintSelect = (option) => {
    if (option === "Simple Statements") setShowSimpleStatement(true);
    else if (option === "Detailed Statement") setShowDetailedStatement(true);
  };

  const handleAdjustmentSelect = (option) => {
    if (option === "Credit (subtraction)") setShowAdjustDialog(true);
    else if (option === "Debit (addition)") setShowDebitDialog(true);
    else if (option === "Membership Adjustment") setShowMembershipDialog(true);
    else if (option === "Insurance Write-Off") setShowWriteOffDialog(true);
  };

  const handleAttachClick = (data) => {
    setAttachTarget({ ...data, patientId: patientId || 1 });
    setShowAttachDialog(true);
  };

  // Re-open whatever the user left mid-edit. Keyed on the patient rather than a
  // mount flag so it fires for the initial load, for a patient that arrives a
  // beat after the page renders, and again whenever the user comes back to this
  // patient — which covers navigating to the schedule and back, switching
  // patients, and a full reload.
  useEffect(() => {
    console.log("[draft] resume check for patientId:", patientId);
    if (!patientId) return;
    const draft = findResumableInvoiceDraft(patientId);
    console.log("[draft] all drafts:", listInvoiceDrafts(patientId));
    console.log("[draft] resumable:", draft);
    if (!draft) return;
    setInvoiceModalData(draft.sourceData || null);
    setInvoiceModalDraft(draft);
    setShowInvoiceModal(true);
  }, [patientId]);

  const handleAddProcedureClick = (item) => {
    const source = draftSourceKey(item);
    // Replay whatever is already pending on this invoice so the rows the user
    // added last time are already in the table.
    setInvoiceModalDraft(readInvoiceDraft(patientId, source));
    setInvoiceModalData(item);
    setShowInvoiceModal(true);
  };

  // The modal reports every edit. Persist it so the work survives leaving the
  // page; an empty table means the user removed everything, so drop the draft
  // rather than leaving a re-openable husk behind. Memoized because the modal
  // debounces on this callback's identity — a fresh function each render would
  // restart that timer and starve the write.
  const handleInvoiceDraftChange = useCallback(
    (payload) => {
      console.log("[draft] change ->", {
        patientId,
        source: draftSourceKey(invoiceModalData),
        rows: payload.procedures?.length,
      });
      if (!patientId) return;
      const source = draftSourceKey(invoiceModalData);
      if (!payload.procedures || payload.procedures.length === 0) {
        clearInvoiceDraft(patientId, source);
        return;
      }
      saveInvoiceDraft(patientId, source, {
        ...payload,
        sourceData: invoiceModalData,
      });
    },
    [patientId, invoiceModalData],
  );

  const handleInvoiceModalCancel = () => {
    // Closing without saving leaves the draft alone — the rows were never sent
    // to the server, so they come back next time this patient is opened. Save
    // the invoice or empty the table to get rid of them for good.
    setShowInvoiceModal(false);
    setInvoiceModalData(null);
    setInvoiceModalDraft(null);
  };

  const handleInvoiceModalSave = async (savePayload) => {
    const draftSource = draftSourceKey(invoiceModalData);
    // Support both old array format and new object format from InvoiceModal
    const data = Array.isArray(savePayload)
      ? savePayload
      : savePayload.procedures;
    const shouldAddClaim = !Array.isArray(savePayload) && savePayload.addClaim;
    const claimRows = !Array.isArray(savePayload)
      ? (savePayload.claimProcedures || []).filter(
          (row) => !row.dbi && String(row.dbi).toLowerCase() !== "true",
        )
      : [];

    const payload = {
      patientId: parseInt(patientId, 10) || 1,
      notes: savePayload.description,
      items: data.map((row) => {
        let parsedDate = new Date().toISOString();
        if (row.date) {
          const d = new Date(row.date);
          if (!isNaN(d.getTime())) parsedDate = d.toISOString();
        }
        return {
          code: row.code,
          description: row.treatment,
          date: parsedDate,
          site: row.site,
          provider: row.provider,
          writeoff:
            parseFloat(String(row.writeoff || "").replace(/[^0-9.-]+/g, "")) ||
            0,
          ptPortion:
            parseFloat(String(row.ptPortion || "").replace(/[^0-9.-]+/g, "")) ||
            0,
          insPortion:
            parseFloat(
              String(row.insPortion || "").replace(/[^0-9.-]+/g, ""),
            ) || 0,
          primaryInsPortion:
            Number(row.primaryInsPortion ?? (Number(row.secondaryInsPortion || 0) > 0 && parseFloat(String(row.insPortion || "").replace(/[^0-9.-]+/g, "")) > Number(row.secondaryInsPortion || 0) ? parseFloat(String(row.insPortion || "").replace(/[^0-9.-]+/g, "")) - Number(row.secondaryInsPortion || 0) : parseFloat(String(row.insPortion || "").replace(/[^0-9.-]+/g, "")))),
          secondaryInsPortion:
            Number(row.secondaryInsPortion || 0),
          totalInsPortion:
            parseFloat(
              String(row.insPortion || "").replace(/[^0-9.-]+/g, ""),
            ) || 0,
          charge:
            parseFloat(String(row.charge || "").replace(/[^0-9.-]+/g, "")) || 0,
          balance:
            parseFloat(String(row.balance || "").replace(/[^0-9.-]+/g, "")) ||
            0,
          dbi: Boolean(row.dbi),
          completed: Boolean(row.completed),
        };
      }),
    };
    if (payload.items.length === 0) {
      alert("Please add at least one procedure before saving.");
      return;
    }
    try {
      let createdInvoiceId;

      if (invoiceModalData?.invoiceId) {
        const targetInvoiceId = invoiceModalData.invoiceId;
        await Promise.all(
          payload.items.map((item) =>
            invoiceService.addInvoiceItem(targetInvoiceId, {
              serviceId: item.code,
              unitPrice: item.charge,
              description: item.description,
              cptCode: item.code,
              quantity: 1,
              // passing additional fields in case the backend uses them
              date: item.date,
              provider: item.provider,
              site: item.site,
              dbi: item.dbi,
              completed: item.completed,
            }),
          ),
        );
        createdInvoiceId = targetInvoiceId;
      } else {
        const result = await dispatch(createInvoice(payload)).unwrap();
        createdInvoiceId =
          result?.invoice?._id ||
          result?.invoice?.id ||
          result?._id ||
          result?.id;
      }

      setShowInvoiceModal(false);
      setInvoiceModalData(null);
      setInvoiceModalDraft(null);
      // The invoice is on the server now, so the pending work is spent.
      clearInvoiceDraft(patientId, draftSource);

      // If "Add Claim" was checked, create a claim for all dbi=false procedures
      if (shouldAddClaim && claimRows.length > 0) {
        if (createdInvoiceId) {
          try {
            await claimService.createClaimFromInvoice(createdInvoiceId, {
              procedures: claimRows.map((row) => ({
                code: row.code,
                description: row.treatment,
                charge:
                  parseFloat(
                    String(row.charge || "").replace(/[^0-9.-]+/g, ""),
                  ) || 0,
                insPortion:
                  parseFloat(
                    String(row.insPortion || "").replace(/[^0-9.-]+/g, ""),
                  ) || 0,
                dbi: false,
              })),
            });
          } catch (claimErr) {
            console.warn(
              "Invoice created but claim creation failed:",
              claimErr,
            );
            showSnackbar(
              claimErr.response?.data?.error?.message ||
                claimErr.response?.data?.message ||
                'Invoice saved, but the claim could not be created.',
              'error',
            );
          }
        }
      }

      refreshLedger();
    } catch (err) {
      alert("Failed to create invoice: " + (err.message || err));
    }
  };

  const handleRejectClaimClick = async (claimData) => {
    try {
      const claimId = claimData?.id || claimData?._id;
      const invoiceId = claimData?.invoiceId;
      if (!claimId) {
        showSnackbar('No claim selected to reject', 'error');
        return;
      }
      const result = await invoiceService.transferRejectedClaim(invoiceId, claimId);
      showSnackbar(result?.message || 'Claim rejected and balance transferred to patient', 'success');
      
      const patientId = patient?._id || patient?.id;
      if (patientId) {
        dispatch(invalidatePatientBalance(patientId));
        dispatch(fetchPatientBalance(patientId));
      }
      refreshLedger();
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to reject claim', 'error');
    }
  };

  const handleLockClaimClick = async (claimData) => {
    const claimId = claimData?.id || claimData?._id;
    if (!claimId) return;
    const nextLocked = !claimData.isLocked;
    try {
      await claimService.setClaimLock(claimId, nextLocked);
      showSnackbar(
        nextLocked
          ? 'Claim locked. No further claim can be built for this invoice until it is paid.'
          : 'Claim unlocked',
        'success',
      );
      refreshLedger();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          'Failed to update claim lock',
        'error',
      );
    }
  };

  const handleVoidClaimMenuClick = (claimData) => {
    setVoidClaimTarget(claimData);
    setShowVoidClaimDialog(true);
  };

  const handleVoidClaimCancel = () => {
    setShowVoidClaimDialog(false);
    setVoidClaimTarget(null);
  };

  const handleVoidClaimConfirm = async () => {
    const claimId = voidClaimTarget?.id || voidClaimTarget?._id;
    setShowVoidClaimDialog(false);
    setVoidClaimTarget(null);
    if (!claimId) return;
    try {
      await claimService.voidClaim(claimId, 'Claim voided from patient ledger');
      showSnackbar('Claim voided', 'success');
      refreshLedger();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          'Failed to void claim',
        'error',
      );
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 1, bgcolor: "#FFFFFF", position: "relative" }}>
      {(ledgerLoading || isTransferRefreshing) && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              color: "#2362EF",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                border: "3px solid rgba(35, 98, 239, 0.2)",
                borderTop: "3px solid #2362EF",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "20px",
                color: "#1e293b",
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Refreshing ledger...
            </Typography>
          </Box>
        </Box>
      )}
      {ledgerItems.map((item, idx) => {
        // Apply voided filter
        if (item.isVoided && !filters?.includeVoided) {
          return null;
        }

        // Apply transfer filter
        if (item.isTransfer && filters?.hideBillingTransfers) {
          return null;
        }

        const isExpanded = expandedItems[idx] || false;
        let displayItem = depositOverrides[item.id]
          ? {
              ...item,
              method: depositOverrides[item.id].paymentType || item.method,
            }
          : item;

        // Also filter out child details if they shouldn't be included based on filters
        if (displayItem.details) {
          displayItem = {
            ...displayItem,
            details: displayItem.details
              .filter((d) => {
                if (d.isVoided && !filters?.includeVoided) return false;
                if (d.isTransfer && filters?.hideBillingTransfers) return false;
                return true;
              })
              .map((d) => {
                if (d.isGrouped && d.procedures) {
                  let unallocatedCourtesy = 0;
                  const invoiceLevelAdjs = displayItem.details.filter(
                    (adj) =>
                      adj.isAdjustment &&
                      adj.isCourtesy &&
                      !adj.isVoided &&
                      !adj.procedureId
                  );
                  invoiceLevelAdjs.forEach((adj) => {
                    unallocatedCourtesy += adj.rawAmount || 0;
                  });

                  let proceduresWithBalance = d.procedures
                    .map((p) => {
                      const procedureId = p.ProcNum || p._id || p.id;
                      const courtesyAdjs = displayItem.details.filter(
                        (adj) =>
                          adj.isAdjustment &&
                          adj.isCourtesy &&
                          !adj.isVoided &&
                          String(adj.procedureId) === String(procedureId)
                      );
                      let totalCourtesy = courtesyAdjs.reduce(
                        (sum, adj) => sum + (adj.rawAmount || 0),
                        0
                      );

                      const ptPortion = Number(p.patientPortion || 0);
                      if (unallocatedCourtesy > 0 && ptPortion > 0) {
                        const amountToApply = Math.min(unallocatedCourtesy, ptPortion);
                        totalCourtesy += amountToApply;
                        unallocatedCourtesy -= amountToApply;
                      }

                      return {
                        ...p,
                        ptPortion: Math.max(0, Number(p.ptPortion || 0) - totalCourtesy)
                      };
                    })
                  // Hide procedures whose remaining patient portion is $0.00.
                  // Voided ones are an exception when "include voided
                  // transactions" is on — they are shown for audit regardless
                  // of their (now irrelevant) patient portion.
                  .filter((p) =>
                    Number(Number(p.ptPortion || 0).toFixed(2)) > 0 ||
                    (filters?.includeVoided && p.isVoided),
                  );

                  // If all procedures have $0 patient portion, fall back to showing all
                  // rather than dropping the row. Otherwise, keep procedures
                  // with $0 balance so they remain visible alongside those with balances.
                  if (proceduresWithBalance.length === 0) {
                    if (!d.procedures || d.procedures.length === 0)
                      return null;
                    return { ...d };
                  }

                  const zeroBalanceProcedures = d.procedures.filter(
                    (p) => Number(Number(p.ptPortion || 0).toFixed(2)) === 0
                  );
                  if (zeroBalanceProcedures.length > 0) {
                    proceduresWithBalance = [
                      ...proceduresWithBalance,
                      ...zeroBalanceProcedures,
                    ];
                  }

                  return {
                    ...d,
                    procedures: proceduresWithBalance,
                  };
                }
                return d;
              })
              .filter(Boolean),
          };
        }

        return (
          <LedgerItemCard
            key={idx}
            idx={idx}
            displayItem={displayItem}
            isExpanded={isExpanded}
            adjustmentTypeMap={adjustmentTypeMap}
            handleItemClick={handleItemClick}
            handleCalendarClick={handleCalendarClick}
            handleVoidClick={handleVoidClick}
            handleEditClick={handleEditClick}
            handleRefreshClick={handleRefreshClick}
            setMagicStickAnchorEl={setMagicStickAnchorEl}
            setTransferTarget={setTransferTarget}
            setEditInvoiceTarget={setEditInvoiceTarget}
            setShowEditInvoice={setShowEditInvoice}
            setAdjAnchorEl={setAdjAnchorEl}
            setAdjItem={setAdjItem}
            setPrintAnchorEl={setPrintAnchorEl}
            setPrintItem={setPrintItem}
            onEOBClick={handleEOBClick}
            onPrintClaimClick={handlePrintClaimClick}
            onToggleClaimClosed={handleToggleClaimClosed}
            closedClaimOverrides={closedClaimOverrides}
            onEditClaimClick={handleEditClaimClick}
            onSendClaimClick={handleSendClaimClick}
            onVoidAndRecreateClick={handleVoidAndRecreateClick}
            onRejectClaimClick={handleRejectClaimClick}
            onLockClaimClick={handleLockClaimClick}
            onVoidClaimClick={handleVoidClaimMenuClick}
            onChangeClaimStatusClick={handleOpenModifyClaimStatus}
            handleAddProcedureClick={handleAddProcedureClick}
            handleAttachClick={handleAttachClick}
          />
        );
      })}

      <LedgerDialogManager
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        handleBackdateDone={handleBackdateDone}
        printAnchorEl={printAnchorEl}
        setPrintAnchorEl={setPrintAnchorEl}
        handlePrintSelect={handlePrintSelect}
        printItem={printItem}
        adjAnchorEl={adjAnchorEl}
        setAdjAnchorEl={setAdjAnchorEl}
        handleAdjustmentSelect={handleAdjustmentSelect}
        adjItem={adjItem}
        showAdjustDialog={showAdjustDialog}
        setShowAdjustDialog={setShowAdjustDialog}
        showDebitDialog={showDebitDialog}
        setShowDebitDialog={setShowDebitDialog}
        showMembershipDialog={showMembershipDialog}
        setShowMembershipDialog={setShowMembershipDialog}
        showWriteOffDialog={showWriteOffDialog}
        setShowWriteOffDialog={setShowWriteOffDialog}
        showVoidDialog={showVoidDialog}
        handleVoidCancel={handleVoidCancel}
        handleVoidConfirm={handleVoidConfirm}
        showVoidProceduresDialog={showVoidProceduresDialog}
        handleVoidProceduresCancel={handleVoidProceduresCancel}
        handleVoidProceduresConfirm={handleVoidProceduresConfirm}
        voidTarget={voidTarget}
        showCourtesyCredit={showCourtesyCredit}
        handleCourtesyCreditCancel={handleCourtesyCreditCancel}
        handleCourtesyCreditSave={handleCourtesyCreditSave}
        editTarget={editTarget}
        showUndoDialog={showUndoDialog}
        handleUndoCancel={handleUndoCancel}
        handleUndoConfirm={handleUndoConfirm}
        showSimpleStatement={showSimpleStatement}
        setShowSimpleStatement={setShowSimpleStatement}
        showDetailedStatement={showDetailedStatement}
        setShowDetailedStatement={setShowDetailedStatement}
        showEditDeposit={showEditDeposit}
        handleEditDepositCancel={handleEditDepositCancel}
        handleEditDepositSave={handleEditDepositSave}
        editDepositTarget={editDepositTarget}
        showInvoiceModal={showInvoiceModal}
        handleInvoiceModalCancel={handleInvoiceModalCancel}
        handleInvoiceModalSave={handleInvoiceModalSave}
        handleInvoiceDraftChange={handleInvoiceDraftChange}
        invoiceModalData={invoiceModalData}
        invoiceModalDraft={invoiceModalDraft}
        magicStickAnchorEl={magicStickAnchorEl}
        setMagicStickAnchorEl={setMagicStickAnchorEl}
        transferDirection={transferDirection}
        setTransferDirection={setTransferDirection}
        showTransferConfirmation={showTransferConfirmation}
        setShowTransferConfirmation={setShowTransferConfirmation}
        handleTransferConfirm={handleTransferConfirm}
        showEditInvoice={showEditInvoice}
        setShowEditInvoice={setShowEditInvoice}
        editInvoiceTarget={editInvoiceTarget}
        showAttachDialog={showAttachDialog}
        setShowAttachDialog={setShowAttachDialog}
        attachTarget={attachTarget}
        showAdaDialog={showAdaDialog}
        setShowAdaDialog={setShowAdaDialog}
        adaTarget={adaTarget}
      />
      {showEOBModal && (
        <ManageEOBModal
          open={showEOBModal}
          onClose={(hasChanges) => {
            setShowEOBModal(false);
            setEOBTarget(null);
            if (hasChanges && patientId) {
              dispatch(fetchLedgerItems(patientId));
            }
          }}
          selectedBatchPayment={eobTarget}
        />
      )}
      {showEditClaimDialog && (
        <EditClaimDialog
          open={showEditClaimDialog}
          claim={editClaimTarget}
          onClose={() => {
            setShowEditClaimDialog(false);
            setEditClaimTarget(null);
          }}
          onSave={async (data) => {
            try {
              if (editClaimTarget?._id || editClaimTarget?.id) {
                const claimId = editClaimTarget._id || editClaimTarget.id;
                console.log("Saving claim edits:", claimId, data);
                await claimService.updateClaim(claimId, data);
                refreshLedger();
              }
            } catch (err) {
              console.error("Failed to update claim:", err);
            }
          }}
        />
      )}
      <ModifyClaimStatusDialog
        open={showModifyClaimStatus}
        claim={modifyClaimTarget}
        onClose={() => {
          setShowModifyClaimStatus(false);
          setModifyClaimTarget(null);
        }}
        onSave={handleModifyClaimStatusSave}
      />
      <VoidConfirmationDialog
        open={showVoidClaimDialog}
        onClose={handleVoidClaimCancel}
        onConfirm={handleVoidClaimConfirm}
        title="Void Claim"
        message="Are you sure you want to void this claim? The claim will be hidden from the ledger until 'Include voided transactions' is checked."
      />
    </Box>
  );
};

export default LedgerList;
