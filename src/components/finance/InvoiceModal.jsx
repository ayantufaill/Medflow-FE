import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
} from "../../store/slices/providerSlice";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import AddNewProcedureDialog from "./AddNewProcedureDialog";
import { calculatePortionsForCategory } from "../../utils/cdtCategoryHelper";
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import { invoiceService } from "../../services/invoice.service";

// Shared empty list so the effects below can depend on a value that never
// changes identity when there are no procedures to render.
const EMPTY_PROCEDURES = [];

// Shape a row into the payload the estimator expects. The estimator builds ONE
// deductible ledger per request and drains it across every item, so callers must
// send the whole invoice — pricing a single line in isolation hands it a fresh
// full pool and re-sells deductible the other lines already consumed.
const toEstimateItem = (p) => ({
  code: p.code,
  charge:
    parseFloat((p.charge || "").toString().replace(/[^0-9.-]+/g, "")) || 0,
  allowedFee: p.allowedFee !== undefined ? Number(p.allowedFee) : undefined,
  originalFee: p.originalFee !== undefined ? Number(p.originalFee) : undefined,
  dbi: Boolean(p.dbi),
});

// Draft rows carry the client-generated id assigned when they were added, so a
// re-opened draft that overlaps the source invoice's own rows is deduped rather
// than doubled up.
const withRestoredProcedures = (baseProcedures, restoredProcedures) => {
  if (!restoredProcedures || restoredProcedures.length === 0)
    return baseProcedures;
  const presentIds = new Set(baseProcedures.map((p) => p.id));
  return [
    ...baseProcedures,
    ...restoredProcedures.filter((p) => !presentIds.has(p.id)),
  ];
};

// `draft` is a previously persisted in-progress invoice for this same patient
// and source, replayed when the modal is re-opened (see utils/invoiceDraftStore).
// `onDraftChange` reports the live state back up so the owner can persist it.
// Both are optional: callers that don't persist drafts simply omit them.
const InvoiceModal = ({
  patient,
  invoiceData,
  draft,
  onDraftChange,
  onSave,
  onCancel,
  onClose,
}) => {
  const dispatch = useDispatch();
  const reduxPatient = useSelector((state) => state.patient?.currentPatient || state.patient?.selectedPatient);
  const activePatient = patient || reduxPatient;
  const activePatientId = activePatient?._id || activePatient?.id || activePatient?.PatNum;
  const hasSecondary = Boolean(
    activePatient?.secondaryInsurance ||
    (activePatient?.insurances && activePatient.insurances.some((i) => i.insuranceType?.toLowerCase() === 'secondary' || i.ordinal === 2))
  );

  const [showAddProcedure, setShowAddProcedure] = useState(false);
  const [procedures, setProcedures] = useState([]);
  const [addClaim, setAddClaim] = useState(() => Boolean(draft?.addClaim));
  const [dupWarning, setDupWarning] = useState("");
  const [description, setDescription] = useState(
    () => draft?.description || "",
  );
  const [showDescription, setShowDescription] = useState(false);
  // handleAmountChange fires on every keystroke, and each call re-prices the whole
  // invoice server-side. Debounce so typing a charge is one request, not one per
  // character. The local calculatePortionsForCategory pass below still runs
  // synchronously, so the table keeps updating as you type.
  const estimateTimer = useRef(null);

  useEffect(() => () => clearTimeout(estimateTimer.current), []);

  // Selection is tracked by EXCLUSION, not inclusion. `procedures` is rebuilt
  // wholesale from `invoiceData` in the effect below and appended to as rows
  // are added, so an inclusion Set would have to be re-synced in every one of
  // those places and would silently leave a newly added row unselected.
  // Defaulting to "not excluded" also preserves the previous behaviour, where
  // every listed procedure went onto the invoice.
  const [unselectedIds, setUnselectedIds] = useState(
    () => new Set(draft?.unselectedIds || []),
  );

  // Rows carried over from a persisted draft. They were already priced when
  // they were first entered, so they are appended after the recalculation pass
  // rather than run through it — re-pricing would re-charge the deductible they
  // already consumed.
  const restoredProcedures = draft?.procedures || EMPTY_PROCEDURES;

  useEffect(() => {
    console.log("InvoiceModal debug - invoiceData:", invoiceData);
    const baseProcedures = invoiceData?.procedures || EMPTY_PROCEDURES;
    if (baseProcedures.length > 0 || restoredProcedures.length > 0) {
      // If this is a new invoice (no _id/id), intelligently calculate the patient vs insurance portions
      // based on the patient's coverage table and the dbi (Do Not Bill Insurance) flag.
      // invoiceData is genuinely absent on the new-invoice path, and a restored
      // draft can get us into this block with nothing behind us.
      const isNewInvoice = !invoiceData?._id && !invoiceData?.id;

      if (isNewInvoice) {
        const recalculated = baseProcedures.map((p) => {
          const numCharge =
            parseFloat((p.charge || "").toString().replace(/[^0-9.-]+/g, "")) ||
            0;
          const baseFee =
            p.allowedFee !== undefined
              ? parseFloat(p.allowedFee)
              : p.originalFee !== undefined
                ? parseFloat(p.originalFee)
                : numCharge;
          const numWriteoff =
            parseFloat(
              (p.writeoff || "").toString().replace(/[^0-9.-]+/g, ""),
            ) ||
            (!p.dbi && baseFee > 0 && numCharge > baseFee
              ? Math.round((numCharge - baseFee) * 100) / 100
              : 0);

          const portions = calculatePortionsForCategory({
            charge: numCharge,
            writeoff: numWriteoff,
            code: p.code,
            dbi: p.dbi || false,
            coverageTable: patient?.coverageTable || null,
            explicitPct:
              p.coveragePct !== undefined && p.coveragePct !== null
                ? Number(p.coveragePct)
                : null,
          });

          const localPt = hasSecondary ? 0 : portions.ptPortion;
          const localSec = hasSecondary ? portions.ptPortion : 0;
          const localPrim = portions.insPortion;
          const localTotalIns = localPrim + localSec;

          return {
            ...p,
            allowedFee: baseFee,
            originalFee: baseFee,
            writeoff: `$${numWriteoff.toFixed(2)}`,
            insPortion: `$${localTotalIns.toFixed(2)}`,
            primaryInsPortion: localPrim,
            secondaryInsPortion: localSec,
            totalInsPortion: localTotalIns,
            ptPortion: `$${localPt.toFixed(2)}`,
            balance: `$${portions.balance.toFixed(2)}`,
            coveragePct: portions.coveragePct,
          };
        });
        console.log(
          "InvoiceModal debug - recalculated procedures:",
          recalculated,
        );
        const seeded = withRestoredProcedures(recalculated, restoredProcedures);
        setProcedures(seeded);

        // Fetch accurate estimates from backend to handle secondary insurance.
        // Only the freshly recalculated rows are priced — the restored rows
        // already went through the estimator before the draft was stored, and
        // the response lines up with the payload by index.
        if (activePatientId && recalculated.length > 0) {
          const payload = recalculated.map(p => ({
            code: p.code,
            charge: parseFloat((p.charge || "").toString().replace(/[^0-9.-]+/g, "")) || 0,
            allowedFee: p.allowedFee,
            originalFee: p.originalFee,
            dbi: Boolean(p.dbi)
          }));
          
          invoiceService.estimateInvoiceItems(activePatientId, payload)
            .then(estimates => {
              if (estimates && estimates.length === recalculated.length) {
                setProcedures(prev => prev.map((p, idx) => {
                  const est = estimates[idx];
                  // Rows appended from a draft sit past the payload length and
                  // have no matching estimate.
                  if (!est || idx >= recalculated.length) return p;
                  const sec = Number(est.secondaryInsPortion || 0);
                  const prim = Number(est.primaryInsPortion ?? (sec > 0 && Number(est.insPortion || 0) > sec ? Number(est.insPortion) - sec : est.insPortion) ?? 0);
                  const totalIns = Number(est.totalInsPortion ?? (sec > 0 ? (prim + sec) : est.insPortion) ?? 0);
                  const pt = Number(est.ptPortion || 0);
                  return {
                    ...p,
                    insPortion: `$${totalIns.toFixed(2)}`,
                    primaryInsPortion: prim,
                    secondaryInsPortion: sec,
                    totalInsPortion: totalIns,
                    ptPortion: `$${pt.toFixed(2)}`,
                    writeoff: `$${Number(est.writeoff || 0).toFixed(2)}`,
                  };
                }));
              }
            })
            .catch(err => console.warn("Failed to fetch initial estimates from backend:", err));
        }
      } else {
        setProcedures(
          withRestoredProcedures(baseProcedures, restoredProcedures),
        );
      }
    } else {
      setProcedures([]);
    }
  }, [invoiceData, patient, reduxPatient, restoredProcedures]);

  // Report every edit back to the owner so it can be persisted. Debounced
  // because the backend estimate lands a beat after each edit and would
  // otherwise write twice per keystroke.
  useEffect(() => {
    if (!onDraftChange) return undefined;
    const timer = setTimeout(() => {
      onDraftChange({
        procedures,
        unselectedIds: [...unselectedIds],
        description,
        addClaim,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [procedures, unselectedIds, description, addClaim, onDraftChange]);

  // Only ticked rows reach the invoice.
  const selectedProcedures = procedures.filter((p) => !unselectedIds.has(p.id));

  // Procedures eligible for a claim: only those where dbi is false
  const claimProcedures = selectedProcedures.filter((p) => !p.dbi);

  const allSelected =
    procedures.length > 0 && selectedProcedures.length === procedures.length;

  const toggleProcedureSelected = (procedureId) =>
    setUnselectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(procedureId)) next.delete(procedureId);
      else next.add(procedureId);
      return next;
    });

  const toggleSelectAll = () =>
    setUnselectedIds(
      allSelected ? new Set(procedures.map((p) => p.id)) : new Set(),
    );

  // Providers from Redux (cached — won't re-fetch if already loaded)
  const providersList = useSelector(selectProviderDropdownList);
  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const handleSaveProcedure = async (savedData, keepOpen = false) => {
    if (!keepOpen) {
      setShowAddProcedure(false);
    }
    if (!savedData) return;

    const fee = parseFloat(savedData.fee || 0);
    const code = savedData.procedureCode || "";

    const portions = calculatePortionsForCategory({
      charge: fee,
      writeoff: 0,
      code,
      dbi: false,
      coverageTable: patient?.coverageTable || null,
    });

    const localPt = hasSecondary ? 0 : portions.ptPortion;
    const localSec = hasSecondary ? portions.ptPortion : 0;
    const localPrim = portions.insPortion;
    const localTotalIns = localPrim + localSec;

    const newProcedure = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split("T")[0],
      code,
      site:
        savedData.selectedTeeth.join(",") +
        (savedData.selectedSurfaces.length > 0
          ? ` (${savedData.selectedSurfaces.join("")})`
          : ""),
      treatment: savedData.procedureDescription || "Custom Procedure",
      provider: "",
      allowedFee: fee,
      originalFee: fee,
      writeoff: "$0.00",
      coveragePct: portions.coveragePct,
      ptPortion: `$${localPt.toFixed(2)}`,
      insPortion: `$${localTotalIns.toFixed(2)}`,
      primaryInsPortion: localPrim,
      secondaryInsPortion: localSec,
      totalInsPortion: localTotalIns,
      charge: `$${fee.toFixed(2)}`,
      balance: `$${portions.balance.toFixed(2)}`,
      dbi: false,
      completed: true,
      // Store selected teeth and surfaces for duplicate detection
      selectedTeeth: savedData.selectedTeeth,
      selectedSurfaces: savedData.selectedSurfaces,
    };

    if (activePatientId) {
      try {
        // Send every existing line plus the new one so the deductible pool is
        // shared. The new line is priced last, so it reads the balance its
        // predecessors left rather than the full limit.
        const estimates = await invoiceService.estimateInvoiceItems(
          activePatientId,
          [
            ...procedures.map(toEstimateItem),
            {
              code: newProcedure.code,
              charge: fee,
              allowedFee: fee,
              originalFee: fee,
            },
          ],
        );
        if (estimates && estimates.length > 0) {
          const est = estimates[estimates.length - 1];
          console.log("Got estimate from backend for new procedure:", est);
          const sec = Number(est.secondaryInsPortion || 0);
          const prim = Number(est.primaryInsPortion ?? (sec > 0 && Number(est.insPortion || 0) > sec ? Number(est.insPortion) - sec : est.insPortion) ?? 0);
          const totalIns = Number(est.totalInsPortion ?? (sec > 0 ? (prim + sec) : est.insPortion) ?? 0);
          const pt = Number(est.ptPortion || 0);
          newProcedure.insPortion = `$${totalIns.toFixed(2)}`;
          newProcedure.primaryInsPortion = prim;
          newProcedure.secondaryInsPortion = sec;
          newProcedure.totalInsPortion = totalIns;
          newProcedure.ptPortion = `$${pt.toFixed(2)}`;
          newProcedure.writeoff = `$${Number(est.writeoff || 0).toFixed(2)}`;
          newProcedure.balance = `$${fee.toFixed(2)}`;
          if (est.allowedFee !== undefined) {
            newProcedure.allowedFee = Number(est.allowedFee);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch estimate for procedure:", err);
      }
    }

    setProcedures((prev) => [...prev, newProcedure]);
  };

  const handleProviderChange = (procedureId, newProvider) => {
    setProcedures((prev) =>
      prev.map((p) =>
        p.id === procedureId ? { ...p, provider: newProvider } : p,
      ),
    );
  };

  const handleDeleteProcedure = (procedureId) => {
    setProcedures((prev) => prev.filter((p) => p.id !== procedureId));
  };

  const handleDateChange = (procedureId, newDate) => {
    // dayjs() with no argument returns NOW, so a row arriving without a date
    // would silently pick up today. Only null when there is genuinely nothing
    // to parse, and never overwrite an existing date with an invalid one.
    const parsed = newDate ? dayjs(newDate) : null;
    if (parsed && !parsed.isValid()) return;

    setProcedures((prev) =>
      prev.map((p) => {
        if (p.id !== procedureId) return p;
        // Persist as YYYY-MM-DD, the same shape a newly added procedure uses,
        // so the backend receives one date format regardless of origin.
        return { ...p, date: parsed ? parsed.format("YYYY-MM-DD") : null };
      }),
    );
  };

  const handleAmountChange = async (procedureId, field, value) => {
    let updatedProcedure = null;

    setProcedures((prev) => {
      return prev.map((p) => {
        if (p.id !== procedureId) return p;

        const updated = { ...p, [field]: value };

        const numCharge =
          parseFloat(
            (updated.charge || "").toString().replace(/[^0-9.-]+/g, ""),
          ) || 0;
        const dbiState = updated.dbi;

        const baseFee =
          p.allowedFee !== undefined &&
          p.allowedFee !== null &&
          Number(p.allowedFee) > 0
            ? Number(p.allowedFee)
            : p.originalFee !== undefined &&
                p.originalFee !== null &&
                Number(p.originalFee) > 0
              ? Number(p.originalFee)
              : numCharge;

        let numWriteoff =
          parseFloat(
            (updated.writeoff || "").toString().replace(/[^0-9.-]+/g, ""),
          ) || 0;

        if (field === "charge") {
          if (!dbiState && baseFee > 0 && numCharge > baseFee) {
            numWriteoff = Math.round((numCharge - baseFee) * 100) / 100;
          } else if (!dbiState && baseFee > 0 && numCharge <= baseFee) {
            numWriteoff = 0;
          }
          updated.writeoff = `$${numWriteoff.toFixed(2)}`;
        } else if (field === "dbi") {
          if (dbiState) {
            numWriteoff = 0;
            updated.writeoff = "$0.00";
          } else if (baseFee > 0 && numCharge > baseFee) {
            numWriteoff = Math.round((numCharge - baseFee) * 100) / 100;
            updated.writeoff = `$${numWriteoff.toFixed(2)}`;
          }
        }

        updatedProcedure = updated;

        if (["charge", "writeoff", "dbi"].includes(field)) {
          const portions = calculatePortionsForCategory({
            charge: numCharge,
            writeoff: numWriteoff,
            code: updated.code,
            dbi: dbiState,
            coverageTable: patient?.coverageTable || null,
            explicitPct: updated.coveragePct,
          });
          updated.insPortion = `$${portions.insPortion.toFixed(2)}`;
          updated.ptPortion = `$${portions.ptPortion.toFixed(2)}`;
          updated.balance = `$${portions.balance.toFixed(2)}`;
          updated.coveragePct = portions.coveragePct;
        } else if (["ptPortion", "insPortion"].includes(field)) {
          updated.balance = `$${numCharge.toFixed(2)}`;
        } else if (field === "charge") {
          updated.balance = `$${numCharge.toFixed(2)}`;
        }

        return updated;
      });
    });

    if (
      ["charge", "dbi"].includes(field) &&
      patient &&
      patient._id &&
      updatedProcedure &&
      !updatedProcedure.dbi
    ) {
      try {
        const numCharge =
          parseFloat(
            (updatedProcedure.charge || "")
              .toString()
              .replace(/[^0-9.-]+/g, ""),
          ) || 0;
        const baseFee =
          updatedProcedure.allowedFee ?? updatedProcedure.originalFee;
        // Price the whole invoice, not just this line, so the shared deductible
        // pool is drained in the same order the estimator would drain it. Merge
        // back only the edited row, but at ITS index in the batch.
        const batch = procedures.map((p) =>
          p.id === procedureId
            ? {
                code: updatedProcedure.code,
                charge: numCharge,
                allowedFee: baseFee,
                originalFee: baseFee,
                dbi: Boolean(updatedProcedure.dbi),
              }
            : toEstimateItem(p),
        );
        const editedIndex = procedures.findIndex((p) => p.id === procedureId);
        clearTimeout(estimateTimer.current);
        estimateTimer.current = setTimeout(async () => {
          try {
          const estimates = await invoiceService.estimateInvoiceItems(
            patient._id,
            batch,
          );
          if (estimates && estimates.length > 0 && editedIndex > -1) {
            const est = estimates[editedIndex];
          setProcedures((prev) =>
            prev.map((p) => {
              if (p.id !== procedureId) return p;
              const sec = Number(est.secondaryInsPortion || 0);
              const prim = Number(est.primaryInsPortion ?? (sec > 0 && Number(est.insPortion || 0) > sec ? Number(est.insPortion) - sec : est.insPortion) ?? 0);
              const totalIns = Number(est.totalInsPortion ?? (sec > 0 ? (prim + sec) : est.insPortion) ?? 0);
              const pt = Number(est.ptPortion || 0);
              return {
                ...p,
                insPortion: `$${totalIns.toFixed(2)}`,
                primaryInsPortion: prim,
                secondaryInsPortion: sec,
                totalInsPortion: totalIns,
                ptPortion: `$${pt.toFixed(2)}`,
                writeoff: `$${Number(est.writeoff || 0).toFixed(2)}`,
                balance: `$${numCharge.toFixed(2)}`,
                allowedFee:
                  est.allowedFee !== undefined
                    ? Number(est.allowedFee)
                    : p.allowedFee,
              };
            }),
          );
        }
      } catch (err) {
          console.warn("Failed to fetch estimate after charge change:", err);
        }
      }, 600);
      } catch (err) {
        console.warn("Failed to build estimate payload:", err);
      }
    }
  };

  const handleReestimate = async () => {
    // 1. Immediate local re-estimation
    setProcedures((prev) =>
      prev.map((p) => {
        const numCharge =
          parseFloat((p.charge || "").toString().replace(/[^0-9.-]+/g, "")) ||
          0;
        const baseFee =
          p.allowedFee !== undefined &&
          p.allowedFee !== null &&
          Number(p.allowedFee) > 0
            ? Number(p.allowedFee)
            : p.originalFee !== undefined &&
                p.originalFee !== null &&
                Number(p.originalFee) > 0
              ? Number(p.originalFee)
              : numCharge;
        const numWriteoff =
          !p.dbi && baseFee > 0 && numCharge > baseFee
            ? Math.round((numCharge - baseFee) * 100) / 100
            : parseFloat(
                (p.writeoff || "").toString().replace(/[^0-9.-]+/g, ""),
              ) || 0;

        const portions = calculatePortionsForCategory({
          charge: numCharge,
          writeoff: numWriteoff,
          code: p.code,
          dbi: p.dbi,
          coverageTable: patient?.coverageTable || null,
        });
        return {
          ...p,
          writeoff: `$${numWriteoff.toFixed(2)}`,
          insPortion: `$${portions.insPortion.toFixed(2)}`,
          ptPortion: `$${portions.ptPortion.toFixed(2)}`,
          balance: `$${portions.balance.toFixed(2)}`,
          coveragePct: portions.coveragePct,
        };
      }),
    );

    // 2. Server-side re-estimation if patient is present
    if (activePatientId && procedures.length > 0) {
      try {
        const payload = procedures.map((p) => {
          const numCharge =
            parseFloat((p.charge || "").toString().replace(/[^0-9.-]+/g, "")) ||
            0;
          const baseFee = p.allowedFee ?? p.originalFee;
          return {
            code: p.code,
            charge: numCharge,
            allowedFee: baseFee,
            originalFee: baseFee,
            dbi: Boolean(p.dbi),
          };
        });
        const estimates = await invoiceService.estimateInvoiceItems(
          activePatientId,
          payload,
        );
        if (estimates && estimates.length === procedures.length) {
          setProcedures((prev) =>
            prev.map((p, idx) => {
              const est = estimates[idx];
              if (!est) return p;
              const numCharge =
                parseFloat(
                  (p.charge || "").toString().replace(/[^0-9.-]+/g, ""),
                ) || 0;
              const sec = Number(est.secondaryInsPortion || 0);
              const prim = Number(est.primaryInsPortion ?? (sec > 0 && Number(est.insPortion || 0) > sec ? Number(est.insPortion) - sec : est.insPortion) ?? 0);
              const totalIns = Number(est.totalInsPortion ?? (sec > 0 ? (prim + sec) : est.insPortion) ?? 0);
              const pt = Number(est.ptPortion || 0);
              return {
                ...p,
                insPortion: `$${totalIns.toFixed(2)}`,
                primaryInsPortion: prim,
                secondaryInsPortion: sec,
                totalInsPortion: totalIns,
                ptPortion: `$${pt.toFixed(2)}`,
                writeoff: `$${Number(est.writeoff || 0).toFixed(2)}`,
                balance: `$${numCharge.toFixed(2)}`,
                allowedFee:
                  est.allowedFee !== undefined
                    ? Number(est.allowedFee)
                    : p.allowedFee,
              };
            }),
          );
        }
      } catch (err) {
        console.warn("Failed to re-estimate procedures:", err);
      }
    }
  };

  const ProviderDropdown = ({ value, onChange }) => {
    return (
      <Select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        variant="outlined"
        size="small"
        MenuProps={{
          style: { zIndex: 150000 },
          sx: { zIndex: 150000 },
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
        }}
        renderValue={(selected) => {
          if (!selected) return "Sel";
          return selected.substring(0, 2).toUpperCase();
        }}
        sx={{
          bgcolor: "white",
          color: COLORS.TEXT_PRIMARY,
          borderRadius: "4px",
          fontSize: "12px",
          width: "70px",
          "& .MuiSelect-select": {
            py: 0.5,
            px: 1,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiSvgIcon-root": {
            color: COLORS.TEXT_SECONDARY,
            fontSize: "16px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.BORDER,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9ca3af",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.ACCENT,
          },
        }}
      >
        <MenuItem value="" disabled sx={{ fontSize: "12px" }}>
          <em>Select Provider</em>
        </MenuItem>
        {providersList.map((p) => {
          const firstName = p.userId?.firstName || p.firstName || "";
          const lastName = p.userId?.lastName || p.lastName || "";
          const name =
            `${firstName} ${lastName}`.trim() ||
            p.name ||
            `Provider ${p._id || p.id}`;
          return (
            <MenuItem
              key={p._id || p.id}
              value={name}
              sx={{ fontSize: "12px" }}
            >
              {name}
            </MenuItem>
          );
        })}
      </Select>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        bgcolor: "white",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      <DialogTitle
        sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <ReceiptIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 600,
            color: COLORS.TEXT_PRIMARY,
            flex: 1,
          }}
        >
          {invoiceData?.invoiceId
            ? `Invoice #${invoiceData.invoiceId}`
            : "New Invoice"}
        </Typography>
        <IconButton
          onClick={onClose || onCancel}
          size="small"
          sx={{ color: COLORS.TEXT_SECONDARY }}
        >
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: procedures.length > 0 ? 0 : 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {procedures.length === 0 ? (
          <Typography sx={{ color: "#666", fontSize: "14px", my: 2 }}>
            There are no completed procedures ready to be billed
          </Typography>
        ) : (
          <Box sx={{ width: "100%", px: 3, pt: 2 }}>
            <Box
              sx={{
                borderBottom: `1px solid ${COLORS.BORDER}`,
                pb: 1,
                mb: 1,
                textAlign: "left",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: COLORS.ACCENT,
                  display: "inline-block",
                  mr: 2,
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {new Date().toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  display: "inline-block",
                  color: COLORS.TEXT_SECONDARY,
                  fontSize: "13px",
                }}
              >
                No descriptions
              </Typography>
            </Box>
            <TableContainer sx={{ boxShadow: "none" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        py: 1,
                        width: "36px",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={allSelected}
                        indeterminate={
                          selectedProcedures.length > 0 && !allSelected
                        }
                        onChange={toggleSelectAll}
                        sx={{
                          p: 0,
                          color: "#cbd5e1",
                          "&.Mui-checked": { color: COLORS.ACCENT },
                          "&.MuiCheckbox-indeterminate": { color: COLORS.ACCENT },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.TEXT_SECONDARY,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      DATE
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.TEXT_SECONDARY,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      CODE
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.TEXT_SECONDARY,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      SITE
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.TEXT_SECONDARY,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      TREATMENT
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.TEXT_SECONDARY,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      PROVIDER
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.TEXT_SECONDARY,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      WRITEOFF
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.TEXT_SECONDARY,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      PT PORTION
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.TEXT_SECONDARY,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      INS PORTION
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.TEXT_SECONDARY,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      CHARGE
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "11px",
                        color: COLORS.ACCENT,
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      BALANCE
                    </TableCell>
                    <TableCell sx={{ py: 1 }}></TableCell>
                    <TableCell sx={{ py: 1 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedures.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        sx={{ py: 1, textAlign: "center", verticalAlign: "top" }}
                      >
                        <Checkbox
                          size="small"
                          checked={!unselectedIds.has(row.id)}
                          onChange={() => toggleProcedureSelected(row.id)}
                          sx={{
                            p: 0,
                            color: "#cbd5e1",
                            "&.Mui-checked": { color: COLORS.ACCENT },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>
                        <DatePicker
                          size="small"
                          format="MM/DD/YYYY"
                          value={row.date ? dayjs(row.date) : null}
                          onChange={(value) => handleDateChange(row.id, value)}
                          slotProps={{
                            // The calendar renders in a portal at the document
                            // body, so it inherits the default theme z-index
                            // (1300) and lands behind these overlays, which sit
                            // at 130000 (finance/ledger) and 140000
                            // (appointments). Must clear the highest of them.
                            popper: {
                              sx: { zIndex: 150000 },
                            },
                            textField: {
                              size: "small",
                              sx: {
                                width: "160px",
                                "& .MuiInputBase-input": {
                                  py: 0.5,
                                  px: 1,
                                  fontSize: "12px",
                                },
                              },
                            },
                          }}
                          sx={{
                            "& .MuiInputBase-root": { fontSize: "12px" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>
                        {row.code}
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>
                        {row.site || "-"}
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>
                        {row.treatment}
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <ProviderDropdown
                          value={row.provider}
                          onChange={(val) => handleProviderChange(row.id, val)}
                        />
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>
                        {row.writeoff}
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>
                        {row.ptPortion}
                      </TableCell>
                      <TableCell sx={{ color: COLORS.TEXT_PRIMARY, py: 1 }}>
                        {row.insPortion}
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <TextField
                          size="small"
                          value={(row.charge || "").toString().replace(/^\$/, "")}
                          onChange={(e) =>
                            handleAmountChange(row.id, "charge", e.target.value)
                          }
                          InputProps={{
                            startAdornment: <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#09121f", mr: 0.5 }}>$</Typography>,
                          }}
                          sx={{
                            width: "80px",
                            "& .MuiInputBase-input": {
                              py: 0.5,
                              px: 1,
                              fontSize: "12px",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ color: COLORS.ACCENT, fontWeight: 600, py: 1 }}
                      >
                        {row.balance}
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={row.dbi || false}
                                onChange={(e) =>
                                  handleAmountChange(
                                    row.id,
                                    "dbi",
                                    e.target.checked,
                                  )
                                }
                                sx={{ p: 0.5, color: COLORS.TEXT_SECONDARY }}
                              />
                            }
                            label={
                              <Typography
                                sx={{
                                  fontSize: "11px",
                                  color: COLORS.TEXT_SECONDARY,
                                }}
                              >
                                DBI
                              </Typography>
                            }
                            sx={{ m: 0 }}
                          />
                          <Box
                            onClick={() =>
                              handleAmountChange(
                                row.id,
                                "completed",
                                row.completed === undefined
                                  ? false
                                  : !row.completed,
                              )
                            }
                            sx={{
                              bgcolor:
                                row.completed === false ? "#d32f2f" : "#8bc34a",
                              color: "white",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            {row.completed === false ? "✗" : "✓"}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1, textAlign: "center" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDeleteProcedure(row.id)}
                          sx={{
                            fontFamily: "Inter",
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: "8px",
                            border: "1px solid #ef4444",
                            color: "#ef4444",
                            px: "10px",
                            py: "2px",
                            minWidth: "0",
                            bgcolor: "white",
                            whiteSpace: "nowrap",
                            "&:hover": {
                              borderColor: "#dc2626",
                              backgroundColor: "#fef2f2",
                            },
                          }}
                        >
                          Incomplete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${COLORS.BORDER}`,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: COLORS.ACCENT,
              color: "white",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#1565c0", boxShadow: "none" },
            }}
            onClick={() => setShowAddProcedure(true)}
          >
            +Add Procedure
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleReestimate}
            sx={{
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "8px",
              border: "1px solid #f97316",
              color: "#f97316",
              px: "16px",
              py: "4px",
              bgcolor: "white",
              "&:hover": { borderColor: "#ea6c00", backgroundColor: "#fff7ed" },
            }}
          >
            Re-estimate
          </Button>
          {!showDescription ? (
            <Button
              variant="text"
              size="small"
              onClick={() => setShowDescription(true)}
              sx={{
                color: COLORS.ACCENT,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              + Add description
            </Button>
          ) : (
            <TextField
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="standard"
              autoFocus
              sx={{ width: 250, input: { fontSize: "13px" } }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={addClaim}
                onChange={(e) => setAddClaim(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography sx={{ fontSize: "13px", color: COLORS.TEXT_PRIMARY }}>
                Add Claim
              </Typography>
            }
            sx={{ m: 0 }}
          />

          <Button
            variant="contained"
            size="small"
            onClick={() => {
              if (onSave)
                onSave({
                  procedures: selectedProcedures,
                  addClaim,
                  claimProcedures,
                  description,
                });
            }}
            disabled={selectedProcedures.length === 0}
            sx={{
              bgcolor: COLORS.ACCENT,
              color: "#fff",
              textTransform: "none",
              boxShadow: "none",
              borderRadius: "8px",
              fontWeight: 600,
              "&:hover": { bgcolor: "#1565c0" },
              "&.Mui-disabled": {
                bgcolor: "#cbd5e1",
                color: "#fff",
              },
            }}
          >
            Add New Invoice
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={onCancel || onClose}
            sx={{
              color: "#64748b",
              borderColor: "#cbd5e1",
              borderRadius: "8px",
              "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f1f5f9" },
              textTransform: "none",
              px: 2,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>

      {showAddProcedure && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
          }}
          onClick={() => setShowAddProcedure(false)}
        >
          <Box
            sx={{
              maxWidth: "600px",
              width: "90%",
              bgcolor: "transparent",
              borderRadius: "4px",
              overflow: "visible",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AddNewProcedureDialog
              onClose={() => setShowAddProcedure(false)}
              onSave={handleSaveProcedure}
              existingProcedures={procedures}
              maxTeeth={1}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InvoiceModal;
