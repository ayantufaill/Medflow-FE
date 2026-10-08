import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { appointmentService } from "../../services/appointment.service";
import { paymentService } from "../../services/payment.service";
import { invoiceService } from "../../services/invoice.service";
import {
  createInvoice,
  invalidatePaymentInvoices,
  fetchLedgerItems,
} from "../../store/slices/billingSlice";
import { useBranch } from "../../hooks/redux/useBranch";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Tooltip,
} from "@mui/material";
import { NoteAdd as NoteAddIcon, Add as AddIcon } from "@mui/icons-material";

import {
  IconBill,
  IconUserWallet,
  IconInsuranceWithDropdown,
  IconInsuranceWallet,
  IconRefreshCoin,
  IconPiggyBank,
  IconPrinter,
  IconCloudUpload,
  IconCashPlus,
  IconCashMinus,
  IconCalendar,
} from "./FinanceActionIcons";
import FinanceDialogManager from "./FinanceDialogManager";
import LateFeeAcceptanceDialog from "./LateFeeAcceptanceDialog";
import apiClient from "../../config/api";
import { claimService } from "../../services/claim.service";
import { useSelector } from 'react-redux';
import { selectPracticeInfo } from '../../store/slices/practiceInfoSlice';
import { resolveFlagColor } from '../patient-flags/constants';
import {
  clearInvoiceDraft,
  readInvoiceDraft,
  saveInvoiceDraft,
} from "../../utils/invoiceDraftStore";
import addAccountNoteIcon from "../../assets/finance icons/add account note.svg";
import addFlagsIcon from "../../assets/finance icons/add flag.svg";

// Custom Icons have been extracted to FinanceActionIcons.jsx

const PatientFinanceInfo = forwardRef(
  (
    {
      view,
      flags = [],
      patient = null,
      onViewChange,
      onCalendarClick,
      onCashMinusClick,
      onRefreshCoinClick,
      onAddFlagsClick,
      onOpenDepositMenu,
    },
    ref,
  ) => {
    const dispatch = useDispatch();
    const { currentBranchId } = useBranch();
    const practiceInfo = useSelector(selectPracticeInfo);
    const globalFlags = practiceInfo?.patientFlags || [];
    const [showShare, setShowShare] = useState(false);
    const [shareAnchorEl, setShareAnchorEl] = useState(null);
    const [showQuickPayment, setShowQuickPayment] = useState(false);
    const [showInsurancePayment, setShowInsurancePayment] = useState(false);
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [showAccountNotes, setShowAccountNotes] = useState(false);
    const [showLateFeeTerms, setShowLateFeeTerms] = useState(false);
    const [showNewInvoice, setShowNewInvoice] = useState(false);
    // Persisted so leaving the finance page mid-invoice doesn't lose the rows
    // the user added. Re-opened by LedgerList when they come back — see
    // utils/invoiceDraftStore.
    const [invoiceDraft, setInvoiceDraft] = useState(null);
    const [cashPlusAnchorEl, setCashPlusAnchorEl] = useState(null);

    // Every route into the new-invoice modal goes through here so a pending
    // draft is picked up. LedgerList already auto-opens it when the finance page
    // loads; this covers opening it from the toolbar while a draft is still
    // sitting there, and the ledger views where LedgerList isn't mounted.
    const openNewInvoice = () => {
      const patientId = patient?._id || patient?.id;
      setInvoiceDraft(patientId ? readInvoiceDraft(patientId, "new") : null);
      setShowNewInvoice(true);
    };

    useImperativeHandle(ref, () => ({
      triggerIcon: (iconId, e) => {
        switch (iconId) {
          case "invoice":
            openNewInvoice();
            break;
          case "userWallet":
            handleUserWalletClick();
            break;
          case "claim":
            handleClaimSelect("manual");
            break;
          case "insuranceWallet":
            handleInsuranceWalletClick();
            break;
          case "print":
            handlePrintClick(e);
            break;
          case "share":
            handleShareSelect("request-payment");
            break;
          case "cashPlus":
            handleCashPlusClick(e);
            break;
          case "printSelect":
            handlePrintSelect(e);
            break;
          case "shareSelect":
            handleShareSelect(e);
            break;
          default:
            break;
        }
      },
    }));

    const handleInvoiceDraftChange = (payload) => {
      const patientId = patient?._id || patient?.id;
      if (!patientId) return;
      // An empty table means the user removed everything they added, so there is
      // nothing left to come back to.
      if (!payload.procedures || payload.procedures.length === 0) {
        clearInvoiceDraft(patientId, "new");
        return;
      }
      saveInvoiceDraft(patientId, "new", { ...payload, sourceData: null });
    };

    const handleNewInvoiceCancel = () => {
      // Same contract as the ledger's invoice modal: closing without saving
      // leaves the draft resumable.
      setShowNewInvoice(false);
      setInvoiceDraft(null);
    };

    const handleInvoiceModalSave = async (savePayload) => {
      // Support both old array format and new object format from InvoiceModal
      const data = Array.isArray(savePayload)
        ? savePayload
        : savePayload.procedures;
      const shouldAddClaim =
        !Array.isArray(savePayload) && savePayload.addClaim;
      const claimRows = !Array.isArray(savePayload)
        ? savePayload.claimProcedures || []
        : [];

      const patientId = patient?._id || patient?.id;
      try {
        const payload = {
          patientId: parseInt(patientId, 10) || 1,
          branchId: currentBranchId,
          notes: savePayload.description,
          items: data.map((row) => {
            let parsedDate = new Date().toISOString();
            if (row.date) {
              const d = new Date(row.date);
              if (!isNaN(d.getTime())) {
                parsedDate = d.toISOString();
              }
            }
            return {
              code: row.code,
              description: row.treatment,
              date: parsedDate,
              site: row.site,
              provider: row.provider,
              writeoff:
                parseFloat(
                  (String(row.writeoff) || "").replace(/[^0-9.-]+/g, ""),
                ) || 0,
              ptPortion:
                parseFloat(
                  (String(row.ptPortion) || "").replace(/[^0-9.-]+/g, ""),
                ) || 0,
              insPortion:
                parseFloat(
                  (String(row.insPortion) || "").replace(/[^0-9.-]+/g, ""),
                ) || 0,
              primaryInsPortion:
                Number(row.primaryInsPortion ?? (Number(row.secondaryInsPortion || 0) > 0 && parseFloat((String(row.insPortion) || "").replace(/[^0-9.-]+/g, "")) > Number(row.secondaryInsPortion || 0) ? parseFloat((String(row.insPortion) || "").replace(/[^0-9.-]+/g, "")) - Number(row.secondaryInsPortion || 0) : parseFloat((String(row.insPortion) || "").replace(/[^0-9.-]+/g, "")))),
              secondaryInsPortion:
                Number(row.secondaryInsPortion || 0),
              totalInsPortion:
                parseFloat(
                  (String(row.insPortion) || "").replace(/[^0-9.-]+/g, ""),
                ) || 0,
              charge:
                parseFloat(
                  (String(row.charge) || "").replace(/[^0-9.-]+/g, ""),
                ) || 0,
              balance:
                parseFloat(
                  (String(row.balance) || "").replace(/[^0-9.-]+/g, ""),
                ) || 0,
              dbi: Boolean(row.dbi),
              completed: Boolean(row.completed),
            };
          }),
        };

        if (payload.items.length === 0) {
          alert("Please add at least one procedure before saving.");
          return;
        }

        const result = await dispatch(createInvoice(payload)).unwrap();
        setShowNewInvoice(false);
        setInvoiceDraft(null);
        // The invoice is on the server now, so the pending work is spent.
        clearInvoiceDraft(patientId, "new");

        // If "Add Claim" was checked, create a claim for all dbi=false procedures
        if (shouldAddClaim && claimRows.length > 0) {
          const createdInvoiceId =
            result?.invoice?._id ||
            result?.invoice?.id ||
            result?._id ||
            result?.id;
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
                })),
              });
            } catch (claimErr) {
              console.warn(
                "Invoice created but claim creation failed:",
                claimErr,
              );
            }
          }
        }

        // Dispatch custom event so LedgerList can refresh
        window.dispatchEvent(new CustomEvent("refresh-ledger"));
      } catch (err) {
        console.error("Failed to create invoice:", err);
        alert("Failed to create invoice: " + (err.message || err));
      }
    };
    const [printAnchorEl, setPrintAnchorEl] = useState(null);
    const [showPrintReceipt, setShowPrintReceipt] = useState(false);
    const [showItemizedReceipt, setShowItemizedReceipt] = useState(false);
    const [showSimpleStatement, setShowSimpleStatement] = useState(false);
    const [showDetailedStatement, setShowDetailedStatement] = useState(false);
    const [showLateFee, setShowLateFee] = useState(false);
    const [showManualClaim, setShowManualClaim] = useState(false);
    const [selectedAdjustment, setSelectedAdjustment] = useState(null);
    const [isFamilyReceipt, setIsFamilyReceipt] = useState(false);

    const handleClaimSelect = (option) => {
      if (option === "manual") {
        setShowManualClaim(true);
      }
    };

    const handleShareSelect = (optionId) => {
      if (optionId === "request-payment") {
        setShowQuickPayment(true);
      } else {
        console.log("Share option selected:", optionId);
      }
    };

    const handleInsuranceWalletClick = () => {
      setShowInsurancePayment(true);
    };

    const handleUserWalletClick = () => {
      setShowAddPayment(true);
    };

    const handlePaymentApply = async (paymentData) => {
      console.log("Payment applied:", paymentData);
      try {
        const patientId = patient?._id || patient?.id;
        if (!patientId) return;

        const totalAmount = parseFloat(paymentData.amount) || 0;
        if (totalAmount <= 0) return;

        // Group by invoice
        for (const invoice of paymentData.selectedInvoices || []) {
          const invoiceItems = (paymentData.selectedItems || []).filter(
            (item) => item.invoiceId === invoice.id,
          );
          const invoicePaymentAmount = invoiceItems.reduce(
            (sum, item) => sum + parseFloat(item.amount),
            0,
          );

          if (invoicePaymentAmount > 0) {
            let methodStr = (paymentData.paymentMethod || "cash").toLowerCase();
            let backendMethod = "cash";
            if (methodStr.includes("card")) backendMethod = "card";
            else if (methodStr.includes("check")) backendMethod = "check";
            else if (methodStr.includes("insurance"))
              backendMethod = "insurance";
            else if (methodStr.includes("ach")) backendMethod = "ach";
            else if (methodStr.includes("plan")) backendMethod = "payment_plan";

            const payload = {
              patientId: parseInt(patientId) || patientId,
              invoiceId: invoice.id,
              amount: invoicePaymentAmount,
              procedures: invoiceItems.map((item) => ({
                id: item.itemId,
                pay: parseFloat(item.amount),
              })),
              paymentMethod: backendMethod,
              method: paymentData.paymentMethod, // Sends the specific type (e.g. "Visa Card") to be preserved in the backend JSON
              paymentDate: new Date().toISOString(),
              status: "completed",
              notes: paymentData.description || "Patient payment",
              isAccountCredit: paymentData.paymentMethod === "Account Credit",
            };
            await paymentService.recordPayment(payload);
          }
        }

        dispatch(invalidatePaymentInvoices(patientId));
        dispatch(fetchLedgerItems(patientId));
        window.dispatchEvent(new CustomEvent("appointment-financials-updated", {
          detail: { patientId },
        }));
        window.dispatchEvent(new CustomEvent("add-ledger-item"));
        setShowAddPayment(false);
        if (typeof fetchPatientData === "function") fetchPatientData();
      } catch (err) {
        console.error("Failed to apply payment", err);
      }
    };

    const handleInsurancePaymentSave = (paymentData) => {
      console.log("Insurance payment saved:", paymentData);
      window.dispatchEvent(new CustomEvent("appointment-financials-updated", {
        detail: { patientId: patient?._id || patient?.id },
      }));
      window.dispatchEvent(new CustomEvent("add-ledger-item"));
      setShowInsurancePayment(false);
    };

    const handleCashPlusClick = (event) => {
      setCashPlusAnchorEl(event.currentTarget);
    };

    const handleCashPlusClose = () => {
      setCashPlusAnchorEl(null);
    };

    const createInvoiceForAdjustment = async (amountVal, notesText) => {
      const patientId = patient?._id || patient?.id;
      if (!patientId) return null;

      const amount = parseFloat(amountVal) || 0;
      if (amount <= 0) return null;

      try {
        const payload = {
          patientId: parseInt(patientId, 10) || patientId,
          branchId: currentBranchId,
          notes: notesText || "Automated Adjustment Invoice",
          items: [
            {
              code: `ACC-${Date.now().toString().slice(-6)}`,
              description: notesText,
              date: new Date().toISOString(),
              site: "Office",
              provider: "Staff",
              writeoff: 0,
              ptPortion: amount,
              insPortion: 0,
              charge: amount,
              balance: amount,
              dbi: false,
              completed: true,
              patientOnly: true,
              isPatientPenalty: true,
              isAccountPenalty: true,
            },
          ],
        };

        const result = await dispatch(createInvoice(payload)).unwrap();
        return result;
      } catch (err) {
        console.error("Error creating invoice for account adjustment:", err);
        return null;
      }
    };

    const handleCashPlusSelect = async (item) => {
      console.log("Cash Plus option selected:", item);
      if (item.id === "broken-appt" || item.id === "late-cancellation") {
        const amountVal = 100.0;
        const notesText = item.label || "Adjustment Fee";

        const invoiceResult = await createInvoiceForAdjustment(
          amountVal,
          notesText,
        );
        const createdInvoiceId =
          invoiceResult?.invoice?._id ||
          invoiceResult?.invoice?.id ||
          invoiceResult?._id ||
          invoiceResult?.id ||
          "new";

        const event = new CustomEvent("add-ledger-item", {
          detail: {
            title: `${notesText} (Invoice #${createdInvoiceId})`,
            amount: `$${amountVal.toFixed(2)}`,
            ptBal: `$${amountVal.toFixed(2)}`,
            invBal: `$${amountVal.toFixed(2)}`,
            useCheckmark: false,
          },
        });
        window.dispatchEvent(event);
      } else {
        setSelectedAdjustment(item);
        setShowLateFee(true);
      }
    };

    const handleAddAccountNoteClick = () => {
      setShowAccountNotes(true);
    };

    const handlePrintClick = (event) => {
      setPrintAnchorEl(event.currentTarget);
    };

    const handlePrintClose = () => {
      setPrintAnchorEl(null);
    };

    const handlePrintSelect = (option) => {
      console.log("Print option selected:", option);
      if (
        option === "patient payment receipt" ||
        option === "family patient receipt"
      ) {
        setIsFamilyReceipt(option === "family patient receipt");
        setShowPrintReceipt(true);
      } else if (option === "Itemized receipt") {
        setShowItemizedReceipt(true);
      } else if (option === "Simple Statement") {
        setShowSimpleStatement(true);
      } else if (option === "Detailed Statement") {
        setShowDetailedStatement(true);
      }
    };

    const pixelIcons = [
      { Icon: IconBill, onClick: openNewInvoice },
      { Icon: IconUserWallet, onClick: handleUserWalletClick },
      { Icon: IconInsuranceWithDropdown, onClaimSelect: handleClaimSelect },
      { Icon: IconInsuranceWallet, onClick: handleInsuranceWalletClick },
      { Icon: IconRefreshCoin, onClick: onRefreshCoinClick },
      { Icon: IconPiggyBank, onClick: onOpenDepositMenu },
      { Icon: IconPrinter, onClick: handlePrintClick },
      { Icon: IconCloudUpload, onShareSelect: handleShareSelect },
      { Icon: IconCashPlus, onClick: handleCashPlusClick },
      { Icon: IconCashMinus, onClick: onCashMinusClick },
      { Icon: IconCalendar, onClick: onCalendarClick },
    ];

    return (
      <>
        <Box
          sx={{
            flex: 1,
            height: "254px",
            border: "1px solid #DFE5EC",
            borderRadius: "22px",
            p: 3,
            bgcolor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: "#1A1A1A", mb: 1, letterSpacing: "1px" }}
          >
            VIEW
          </Typography>

          <RadioGroup
            row
            value={view || "invoices"}
            onChange={onViewChange}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="invoices"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#42C070",
                    "&.Mui-checked": { color: "#42C070" },
                  }}
                />
              }
              label={
                <Typography sx={{ color: "#4A4A4A", fontSize: "14px" }}>
                  Invoices
                </Typography>
              }
            />
            <FormControlLabel
              value="individual"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#42C070",
                    "&.Mui-checked": { color: "#42C070" },
                  }}
                />
              }
              label={
                <Typography sx={{ color: "#4A4A4A", fontSize: "14px" }}>
                  Individual Ledger
                </Typography>
              }
              sx={{ ml: 2 }}
            />
            <FormControlLabel
              value="family"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#42C070",
                    "&.Mui-checked": { color: "#42C070" },
                  }}
                />
              }
              label={
                <Typography sx={{ color: "#4A4A4A", fontSize: "14px" }}>
                  Family Ledger
                </Typography>
              }
              sx={{ ml: 2 }}
            />
          </RadioGroup>

          <Box
            sx={{ mb: 3, borderBottom: "1px solid #DFE5EC", display: "flex" }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "146px",
                height: "37px",
                border: "1px solid #DFE5EC",
                borderBottom: "4px solid #2362EF",
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
                bgcolor: "#FFFFFF",
                cursor: "pointer",
                position: "relative",
                top: "1px",
              }}
            >
              <Typography
                fontWeight="bold"
                sx={{ fontSize: "14px", color: "#1A1A1A" }}
              >
                {patient
                  ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
                  : "Amanda Wilson"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
            <Typography
              sx={{
                color: "#1A1A1A",
                fontSize: "14px",
                fontWeight: 500,
                width: "80px",
              }}
            >
              Billing flags:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              {flags && flags.length > 0 && (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {flags.map((flag, idx) => (
                    <Tooltip
                      key={idx}
                      title={
                        flag === "appointment_reminder" ? "Appt Reminder" : flag
                      }
                      arrow
                      placement="top"
                    >
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "2px",
                          bgcolor: resolveFlagColor(flag, globalFlags),
                          flexShrink: 0,
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              )}
              <Button
                variant="text"
                startIcon={
                  <Box
                    component="img"
                    src={addFlagsIcon}
                    alt="add flags"
                    sx={{ width: 14, height: 14 }}
                  />
                }
                onClick={onAddFlagsClick}
                sx={{
                  textTransform: "none",
                  color: "#2362EF",
                  fontSize: "14px",
                  p: 0,
                  minWidth: 0,
                  "&:hover": {
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                add flags
              </Button>
              <Button
                variant="text"
                onClick={() => setShowLateFeeTerms(true)}
                sx={{
                  textTransform: "none",
                  color: "#2362EF",
                  fontSize: "14px",
                  p: 0,
                  minWidth: 0,
                  "&:hover": {
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                late fee policy
              </Button>
              <Button
                variant="text"
                startIcon={
                  <Box
                    component="img"
                    src={addAccountNoteIcon}
                    alt="add account note"
                    sx={{ width: 14, height: 14 }}
                  />
                }
                onClick={handleAddAccountNoteClick}
                sx={{
                  textTransform: "none",
                  color: "#2362EF",
                  fontSize: "14px",
                  p: 0,
                  minWidth: 0,
                  "&:hover": {
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                add account note
              </Button>
            </Box>
          </Box>
        </Box>

        <FinanceDialogManager
          patient={patient}
          showQuickPayment={showQuickPayment}
          setShowQuickPayment={setShowQuickPayment}
          showInsurancePayment={showInsurancePayment}
          setShowInsurancePayment={setShowInsurancePayment}
          handleInsurancePaymentSave={handleInsurancePaymentSave}
          showAddPayment={showAddPayment}
          setShowAddPayment={setShowAddPayment}
          handlePaymentApply={handlePaymentApply}
          cashPlusAnchorEl={cashPlusAnchorEl}
          handleCashPlusClose={handleCashPlusClose}
          handleCashPlusSelect={handleCashPlusSelect}
          showManualClaim={showManualClaim}
          setShowManualClaim={setShowManualClaim}
          showLateFee={showLateFee}
          setShowLateFee={setShowLateFee}
          selectedAdjustment={selectedAdjustment}
          handleAddLateFee={async ({ invoiceIds, basis, mode, rate }) => {
            const patientId = patient?._id || patient?.id;
            const tier = selectedAdjustment?.tier ?? null;
            if (!patientId || !invoiceIds?.length) return;
            try {
              // No amount is computed here: the fee is sent straight through when
              // a policy defines it, otherwise the tier decides it server-side.
              // Ages, buckets, balances and the duplicate rule are all recomputed
              // on the backend too, so this is a request, not a calculation.
              const result = await invoiceService.applyLateFee({
                patientId: parseInt(patientId, 10) || patientId,
                tier,
                invoiceIds,
                basis,
                mode,
                rate,
                branchId: currentBranchId,
              });

              setShowLateFee(false);
              dispatch(invalidatePaymentInvoices(patientId));
              dispatch(fetchLedgerItems(patientId));
              window.dispatchEvent(
                new CustomEvent("appointment-financials-updated", {
                  detail: { patientId },
                }),
              );
              window.dispatchEvent(new CustomEvent("add-ledger-item"));

              if (result?.rejected?.length) {
                const chargedSummary =
                  result.totalFee != null ? `$${Number(result.totalFee).toFixed(2)}` : "";
                alert(
                  `Adjustment applied to ${result.charged.length} invoice(s)` +
                    `${chargedSummary ? ` for a total of ${chargedSummary}` : ""}.\n\n` +
                    "Skipped:\n" +
                    result.rejected.map((r) => `• Invoice #${r.invoiceId}: ${r.reason}`).join("\n"),
                );
              }
            } catch (err) {
              console.error("Failed to apply adjustment:", err);
              alert(
                err?.response?.data?.error?.message ||
                  "Failed to apply the adjustment.",
              );
            }
          }}
          showAccountNotes={showAccountNotes}
          setShowAccountNotes={setShowAccountNotes}
          showNewInvoice={showNewInvoice}
          handleInvoiceModalSave={handleInvoiceModalSave}
          invoiceDraft={invoiceDraft}
          handleInvoiceDraftChange={handleInvoiceDraftChange}
          handleNewInvoiceCancel={handleNewInvoiceCancel}
          printAnchorEl={printAnchorEl}
          handlePrintClose={handlePrintClose}
          handlePrintSelect={handlePrintSelect}
          showPrintReceipt={showPrintReceipt}
          setShowPrintReceipt={setShowPrintReceipt}
          isFamilyReceipt={isFamilyReceipt}
          showItemizedReceipt={showItemizedReceipt}
          setShowItemizedReceipt={setShowItemizedReceipt}
          showSimpleStatement={showSimpleStatement}
          setShowSimpleStatement={setShowSimpleStatement}
          showDetailedStatement={showDetailedStatement}
          setShowDetailedStatement={setShowDetailedStatement}
        />

        <LateFeeAcceptanceDialog
          open={showLateFeeTerms}
          onClose={() => setShowLateFeeTerms(false)}
          patientId={patient?._id || patient?.id}
          clinicId={currentBranchId}
        />
      </>
    );
  },
);

export default PatientFinanceInfo;
