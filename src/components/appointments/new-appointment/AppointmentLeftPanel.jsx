import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  FormControlLabel as MuiFormControlLabel,
  Radio,
  TextField,
  Typography,
  Dialog,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FieldBox, Label } from "./helpers";
import dayjs from "dayjs";
import PatientSearchField from "./PatientSearchField";
import ProcedureTagStrip from "./ProcedureTagStrip";
import ProcedureTable from "./ProcedureTable";
import PastVisitProceduresSelector from "./PastVisitProceduresSelector";
import { invoiceService } from "../../../services/invoice.service";
import { patientService } from "../../../services/patient.service";
import { paymentService } from "../../../services/payment.service";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import InvoiceModal from "../../finance/InvoiceModal";
import { useDispatch } from "react-redux";
import { createInvoice } from "../../../store/slices/billingSlice";
import { claimService } from "../../../services/claim.service";

const AppointmentLeftPanel = ({
  // Patient
  patients,
  loadingPatients,
  patient,
  onPatientChange,
  onPatientSearch,
  patientError,
  // Date/time
  apptDate,
  onDateChange,
  timeHours,
  timeMins,
  amPm,
  onTimeChange,
  onAmPmChange,
  // Visit type
  visitType,
  onVisitTypeChange,
  // Procedure tags
  selectedTagLabels,
  onTagClick,
  onOpenAddProcedureDialog,
  addingProcedure,
  procedureInput,
  onProcedureInputChange,
  onAddingProcedureToggle,
  onSelectProcedure,
  // Procedure table
  procedures,
  setProcedures,
  providers,
  showExtendedOptions,
  onComputeNextVisit,
  onDuplicateProcedure,
  readOnly,
  setIsRescheduling,
  appointmentId,
  status,
  onStatusChange,
}) => {
  const [previousStatus, setPreviousStatus] = useState("scheduled");
  const [showPastVisits, setShowPastVisits] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceModalData, setInvoiceModalData] = useState(null);
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleCollectPayment = async () => {
    if (!appointmentId) {
      showSnackbar(
        "Please save the appointment first before collecting payment.",
        "warning",
      );
      return;
    }
    // Determine patient id for fetching unbilled products
    const pidForFetch = patient?.id || patient?._id || patient?.PatNum;

    // Fetch unbilled products to include in total patient portion
    let unbilled = [];
    try {
      if (pidForFetch) {
        unbilled = await patientService.getUnbilledProducts(pidForFetch);
      }
    } catch (err) {
      console.error("Failed to load unbilled products:", err);
      showSnackbar("Failed to fetch unbilled products", "warning");
      unbilled = [];
    }

    const totalPortionProcedures = procedures.reduce((sum, p) => {
      const val = p.ptPart != null ? p.ptPart : p.charge != null ? p.charge : 0;
      const num = Number(String(val).replace(/[$,]/g, ""));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    const totalUnbilled = Array.isArray(unbilled)
      ? unbilled.reduce((s, u) => s + (Number(u.fee || u.amount || 0) || 0), 0)
      : 0;

    const totalPortion = totalPortionProcedures + totalUnbilled;

    if (totalPortion <= 0) {
      showSnackbar("No procedure charges to collect payment for.", "warning");
      return;
    }

    const formattedProcedures = procedures.map((p) => {
      const chargeStr = String(p.charge || "0").replace(/[$,]/g, "");
      const numCharge = parseFloat(chargeStr) || 0;

      let providerName = "";
      if (p.provider && providers) {
        const prov = providers.find(
          (pr) => String(pr._id || pr.id) === String(p.provider),
        );
        if (prov) {
          const firstName = prov.userId?.firstName || prov.firstName || "";
          const lastName = prov.userId?.lastName || prov.lastName || "";
          providerName =
            `${firstName} ${lastName}`.trim() ||
            prov.name ||
            `Provider ${prov._id || prov.id}`;
        }
      }

      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString().split("T")[0],
        code: p.code,
        site: p.tooth || "",
        treatment: p.desc || "Custom Procedure",
        provider: providerName,
        writeoff: "$0.00",
        coveragePct: 0,
        ptPortion: `$${numCharge.toFixed(2)}`,
        insPortion: "$0.00",
        charge: `$${numCharge.toFixed(2)}`,
        balance: `$${numCharge.toFixed(2)}`,
        dbi: false,
        completed: p.completed || false,
      };
    });

    // Map previously fetched unbilled products and append
    if (Array.isArray(unbilled) && unbilled.length > 0) {
      const mapped = unbilled.map((u) => {
        const fee = Number(u.fee || u.amount || 0) || 0;
        const dateStr = u.procDate
          ? new Date(u.procDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
        return {
          id:
            u.id ||
            u.procNum ||
            `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          date: dateStr,
          code: u.code || "PROD",
          site: "",
          treatment: u.description || "Product Item",
          provider: u.providerName || "",
          writeoff: "$0.00",
          coveragePct: 0,
          ptPortion: `$${fee.toFixed(2)}`,
          insPortion: "$0.00",
          charge: `$${fee.toFixed(2)}`,
          balance: `$${fee.toFixed(2)}`,
          dbi: true,
          completed: false,
        };
      });
      formattedProcedures.push(...mapped);
    }

    // If we have a patient id, ask backend to estimate allowedFee, writeoff, ins/pt portions
    if (patient && (patient._id || patient.id || patient.PatNum)) {
      try {
        const patientIdForEstimate =
          patient._id || patient.id || patient.PatNum;
        const itemsForEstimate = formattedProcedures.map((fp) => ({
          code: fp.code,
          charge:
            parseFloat(String(fp.charge || "").replace(/[^0-9.-]+/g, "")) || 0,
          allowedFee:
            fp.allowedFee !== undefined ? Number(fp.allowedFee) : undefined,
        }));

        const estimates = await invoiceService.estimateInvoiceItems(
          patientIdForEstimate,
          itemsForEstimate,
        );
        console.log(
          "Invoice estimate debug - itemsForEstimate:",
          itemsForEstimate,
        );
        console.log(
          "Invoice estimate debug - estimates from server:",
          estimates,
        );
        if (Array.isArray(estimates) && estimates.length) {
          const merged = formattedProcedures.map((fp, idx) => {
            const est = estimates[idx] || {};
            const writeoffVal =
              est.writeoff !== undefined
                ? Number(est.writeoff)
                : est.estimatedWriteOff !== undefined
                  ? Number(est.estimatedWriteOff)
                  : 0;
            const insVal =
              est.insPortion !== undefined ? Number(est.insPortion) : 0;
            const ptVal =
              est.ptPortion !== undefined ? Number(est.ptPortion) : 0;
            const balanceVal =
              est.balance !== undefined
                ? Number(est.balance)
                : parseFloat(
                    String(fp.charge || "").replace(/[^0-9.-]+/g, ""),
                  ) || 0;
            return {
              ...fp,
              allowedFee:
                est.allowedFee !== undefined ? est.allowedFee : fp.allowedFee,
              writeoff: `$${(writeoffVal || 0).toFixed(2)}`,
              insPortion: `$${(insVal || 0).toFixed(2)}`,
              ptPortion: `$${(ptVal || 0).toFixed(2)}`,
              balance: `$${(balanceVal || 0).toFixed(2)}`,
              coveragePct:
                est.coveragePct !== undefined
                  ? est.coveragePct
                  : fp.coveragePct,
            };
          });
          console.log(
            "Invoice estimate debug - merged formattedProcedures:",
            merged,
          );
          setInvoiceModalData({ procedures: merged });
        } else {
          setInvoiceModalData({ procedures: formattedProcedures });
        }
      } catch (err) {
        console.warn("Failed to estimate invoice items:", err);
        setInvoiceModalData({ procedures: formattedProcedures });
      }
    } else {
      setInvoiceModalData({ procedures: formattedProcedures });
    }
    setShowInvoiceModal(true);
  };

  const handleInvoiceModalSave = async (savePayload) => {
    const data = Array.isArray(savePayload)
      ? savePayload
      : savePayload.procedures;
    const shouldAddClaim = !Array.isArray(savePayload) && savePayload.addClaim;
    const claimRows = !Array.isArray(savePayload)
      ? savePayload.claimProcedures || []
      : [];

    const payload = {
      patientId: parseInt(patient?.id || patient?._id || patient?.PatNum, 10),
      appointmentId: parseInt(appointmentId, 10) || null,
      notes:
        savePayload.description || "Invoice created from appointment checkout",
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
      showSnackbar(
        "Please add at least one procedure before saving.",
        "warning",
      );
      return;
    }

    try {
      const result = await dispatch(createInvoice(payload)).unwrap();
      const createdInvoiceId =
        result?.invoice?._id ||
        result?.invoice?.id ||
        result?._id ||
        result?.id;

      setShowInvoiceModal(false);
      showSnackbar("Invoice saved successfully!", "success");

      if (shouldAddClaim && claimRows.length > 0 && createdInvoiceId) {
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
          console.warn("Invoice created but claim creation failed:", claimErr);
        }
      }

      window.dispatchEvent(new CustomEvent("add-ledger-item"));
    } catch (err) {
      showSnackbar(
        "Failed to create invoice: " + (err.message || err),
        "error",
      );
    }
  };

  const handleAddPastProcedure = (proc) => {
    const exists = procedures.some((p) => p.code === proc.code);
    if (exists) {
      if (onDuplicateProcedure) onDuplicateProcedure("Already added");
      return;
    }
    setProcedures([...procedures, proc]);
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: "20px",
        overflowY: "auto",
        borderRight: "1px solid #e0e5eb",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          pointerEvents: readOnly ? "none" : "auto",
          opacity: readOnly ? 0.85 : 1,
        }}
      >
        {/* Patient / Date / Time row */}
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            mb: "20px",
            alignItems: "flex-end",
          }}
        >
          <PatientSearchField
            patients={patients}
            loadingPatients={loadingPatients}
            value={patient}
            onChange={onPatientChange}
            onSearch={onPatientSearch}
            error={patientError}
          />

          <FieldBox label="Date" sx={{ width: "165px", flexShrink: 0 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={apptDate}
                onChange={(v) => v && onDateChange(v)}
                views={["year", "month", "day"]}
                disablePast
                slotProps={{
                  popper: { sx: { zIndex: 1400 } },
                  textField: {
                    size: "small",
                    sx: {
                      width: "165px",
                      "& .MuiInputBase-root": {
                        fontFamily: "Inter",
                        fontSize: "13px",
                        borderRadius: "8px",
                        height: "40px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </FieldBox>

          <FieldBox label="Time" sx={{ flexShrink: 0 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={(() => {
                  const h = parseInt(timeHours, 10);
                  const m = parseInt(timeMins, 10);
                  const hour24 =
                    amPm === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
                  return dayjs().hour(hour24).minute(m).second(0);
                })()}
                onChange={(v) => {
                  if (!v) return;
                  onTimeChange(v.format("hh"), v.format("mm"));
                  onAmPmChange(v.format("A"));
                }}
                minTime={
                  apptDate && dayjs(apptDate).isSame(dayjs(), "day")
                    ? dayjs()
                    : undefined
                }
                slotProps={{
                  popper: { sx: { zIndex: 1400 } },
                  textField: {
                    size: "small",
                    sx: {
                      width: "130px",
                      "& .MuiInputBase-root": {
                        fontFamily: "Inter",
                        fontSize: "13px",
                        borderRadius: "8px",
                        height: "40px",
                        paddingRight: "4px",
                      },
                      // hide the default left adornment gap
                      "& .MuiInputAdornment-positionStart": { display: "none" },
                    },
                  },
                  openPickerButton: {
                    sx: { color: "#9aa3ae", padding: "4px" },
                  },
                  openPickerIcon: {
                    sx: { fontSize: "16px" },
                  },
                }}
              />
            </LocalizationProvider>
          </FieldBox>
        </Box>

        {/* Type of visit */}
        <Box sx={{ mb: "16px" }}>
          <Label>Type of visit</Label>
          <RadioGroup
            row
            value={visitType}
            onChange={(e) => onVisitTypeChange(e.target.value)}
            sx={{ gap: "8px" }}
          >
            {["Treatment", "Recare"].map((v) => (
              <FormControlLabel
                key={v}
                value={v.toLowerCase()}
                control={
                  <Radio
                    size="small"
                    sx={{
                      p: "4px",
                      color: "#d1d5db",
                      "&.Mui-checked": { color: "#2262ef" },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "13px",
                      color: "#374151",
                    }}
                  >
                    {v}
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        </Box>

        {/* Quick add procedure */}
        <ProcedureTagStrip
          selectedTagLabels={selectedTagLabels}
          onTagClick={onTagClick}
          onOpenAddProcedureDialog={onOpenAddProcedureDialog}
        />

        {showExtendedOptions && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                mt: "8px",
                pointerEvents: "auto",
              }}
            >
              <Button
                onClick={onComputeNextVisit}
                variant="contained"
                disableElevation
                sx={{
                  fontFamily: "Inter",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "6px",
                  backgroundColor: "#2262ef",
                  color: "#fff",
                  px: "12px",
                  py: "5px",
                  "&:hover": { backgroundColor: "#1a50cc" },
                }}
              >
                Compute next visit
              </Button>
              <Button
                variant="outlined"
                onClick={async () => {
                  // Re-estimate patient/insurance portions for current procedures
                  try {
                    if (
                      !patient ||
                      !(patient._id || patient.id || patient.PatNum)
                    ) {
                      showSnackbar(
                        "Please select a patient to estimate coverage.",
                        "warning",
                      );
                      return;
                    }
                    const pid = patient._id || patient.id || patient.PatNum;
                    const items = procedures.map((p) => ({
                      code: p.code,
                      charge:
                        parseFloat(
                          String(p.totalCharge || p.charge || 0).replace(
                            /[^0-9.-]+/g,
                            "",
                          ),
                        ) || 0,
                      allowedFee:
                        p.allowedFee !== undefined
                          ? Number(p.allowedFee)
                          : undefined,
                    }));
                    const estimates = await invoiceService.estimateInvoiceItems(
                      pid,
                      items,
                    );
                    console.log("Re-estimate debug - items:", items);
                    console.log("Re-estimate debug - estimates:", estimates);
                    if (Array.isArray(estimates) && estimates.length) {
                      const merged = procedures.map((p, i) => {
                        const est = estimates[i] || {};
                        const pt =
                          est.ptPortion !== undefined
                            ? Number(est.ptPortion)
                            : (est.ptPortion ?? 0);
                        const ins =
                          est.insPortion !== undefined
                            ? Number(est.insPortion)
                            : (est.insPortion ?? 0);
                        const writeoffVal =
                          est.writeoff !== undefined
                            ? Number(est.writeoff)
                            : est.estimatedWriteOff !== undefined
                              ? Number(est.estimatedWriteOff)
                              : 0;
                        const chargeVal =
                          est.balance !== undefined
                            ? Number(est.balance)
                            : parseFloat(
                                String(p.totalCharge || p.charge || 0).replace(
                                  /[^0-9.-]+/g,
                                  "",
                                ),
                              ) || 0;
                        return {
                          ...p,
                          allowedFee:
                            est.allowedFee !== undefined
                              ? est.allowedFee
                              : p.allowedFee,
                          ptPart: `$${(pt || 0).toFixed(2)}`,
                          totalCharge: `$${(chargeVal || 0).toFixed(2)}`,
                          charge: `$${(chargeVal || 0).toFixed(2)}`,
                          writeoff: `$${(writeoffVal || 0).toFixed(2)}`,
                          insPortion: `$${(ins || 0).toFixed(2)}`,
                          coveragePct:
                            est.coveragePct !== undefined
                              ? est.coveragePct
                              : p.coveragePct,
                        };
                      });
                      console.log(
                        "Re-estimate debug - merged procedures:",
                        merged,
                      );
                      setProcedures(merged);
                    }
                  } catch (err) {
                    console.warn("Failed to re-estimate procedures:", err);
                    showSnackbar("Failed to re-estimate procedures", "error");
                  }
                }}
                sx={{
                  fontFamily: "Inter",
                  fontSize: "12px",
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: "6px",
                  border: "1px solid #f97316",
                  color: "#f97316",
                  px: "12px",
                  py: "5px",
                  "&:hover": { backgroundColor: "#fff7ed" },
                }}
              >
                Re-estimate
              </Button>
            </Box>
          </>
        )}

        {/* Procedure table */}
        <ProcedureTable
          procedures={procedures}
          setProcedures={setProcedures}
          providers={providers}
          showExtendedOptions={showExtendedOptions}
          setIsRescheduling={setIsRescheduling}
        />

        {/* Action buttons row + Complete All + Checkout — only when opened from Book button */}
        {showExtendedOptions && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "right",
                mt: "10px",
                pointerEvents: "auto",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={status === "checked_out_complete"}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      if (isChecked) {
                        setPreviousStatus(status || "scheduled");
                        if (onStatusChange)
                          onStatusChange("checked_out_complete");
                      } else {
                        if (onStatusChange) onStatusChange(previousStatus);
                      }
                      if (setIsRescheduling) setIsRescheduling(true);
                    }}
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": { color: "#2262ef" },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "12px",
                      color: "#374151",
                      mr: 1,
                    }}
                  >
                    check out appointment
                  </Typography>
                }
                sx={{ m: 0 }}
              />
              <Box sx={{ display: "flex", gap: "8px" }}>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => {
                    setProcedures((prev) =>
                      prev.map((p) => ({ ...p, completed: true })),
                    );
                    if (onStatusChange) onStatusChange("completed");
                    if (setIsRescheduling) setIsRescheduling(true);
                  }}
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "6px",
                    backgroundColor: "#2262ef",
                    color: "#fff",
                    px: "12px",
                    py: "5px",
                    "&:hover": { backgroundColor: "#1a50cc" },
                  }}
                >
                  Complete All
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleCollectPayment}
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "6px",
                    backgroundColor: "#f97316",
                    color: "#fff",
                    px: "12px",
                    py: "5px",
                    "&:hover": { backgroundColor: "#ea6c00" },
                  }}
                >
                  Collect Payments
                </Button>
              </Box>
            </Box>
          </>
        )}

        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "12px",
            color: "#2262ef",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => setShowPastVisits(!showPastVisits)}
        >
          {showPastVisits
            ? "- hide past visits"
            : "+ add procedures from another visit"}
        </Typography>

        {/* Past Visit Procedures Modal */}
        <PastVisitProceduresSelector
          open={showPastVisits}
          onClose={() => setShowPastVisits(false)}
          patientId={patient?.id || patient?._id || patient?.PatNum}
          onAdd={handleAddPastProcedure}
        />

        {/* Invoice Modal */}
        <Dialog
          open={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          maxWidth={false}
          fullWidth
          sx={{
            zIndex: 140000,
            "& .MuiDialog-paper": {
              width: "calc(100% - 64px)",
              maxWidth: "1050px",
              maxHeight: "900px",
              m: 4,
              borderRadius: "14px",
              bgcolor: "#f8f9fa",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <InvoiceModal
            patient={patient}
            invoiceData={invoiceModalData}
            onSave={handleInvoiceModalSave}
            onCancel={() => setShowInvoiceModal(false)}
            onClose={() => setShowInvoiceModal(false)}
          />
        </Dialog>
      </Box>
    </Box>
  );
};

export default AppointmentLeftPanel;
