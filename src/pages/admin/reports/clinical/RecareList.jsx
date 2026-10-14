import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TablePagination,
  CircularProgress,
  Alert,
  Tooltip,
  Snackbar,
} from "@mui/material";
import {
  Search,
  Print,
  FileDownload,
  Add,
  EditOutlined,
  SwapVert,
  KeyboardArrowDown,
} from "@mui/icons-material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  fetchRecareReport,
  selectRecareData,
  selectClinicalReportLoading,
  selectClinicalReportError,
} from "../../../../store/slices/clinicalReportSlice";
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
} from "../../../../store/slices/providerSlice";
import { setSelectedPatientId } from "../../../../store/slices/patientSlice";
import { selectPracticeInfo } from "../../../../store/slices/practiceInfoSlice";
import { resolveFlagColor } from "../../../../components/patient-flags/constants";
import { reportingService } from "../../../../services/reporting.service";
import medflowLogo from "../../../../assets/medflow-logo.png";
import PatientChat from "../../../../components/shared/PatientChat";
import RecareListFilters from "../../../../components/reports/clinical/RecareListFilters";
import ProductionReportActions from "../../../../components/reports/financial/ProductionReportActions";

const ActionIcons = ({ row, onPrint, onChatClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFinanceClick = (e) => {
    e.stopPropagation();
    if (row?.id) {
      dispatch(setSelectedPatientId(row.id));
      navigate(`/finance?patientId=${row.id}`, { state: { patientId: row.id } });
    } else {
      navigate("/finance");
    }
  };

  const handleClinicalClick = (e) => {
    e.stopPropagation();
    if (row?.id) {
      dispatch(setSelectedPatientId(row.id));
      navigate(`/clinical/treatment-plan?patientId=${row.id}`);
    } else {
      navigate("/clinical/treatment-plan");
    }
  };

  return (
    <Box
      className="no-print"
      sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center" }}
    >
      <Tooltip title="Print Patient Details" arrow placement="top">
        <PrintOutlinedIcon
          sx={{ fontSize: 16, color: "#475569", cursor: "pointer", '&:hover': { color: '#1a3a6b' } }}
          onClick={(e) => {
            e.stopPropagation();
            if (onPrint) onPrint(row);
          }}
        />
      </Tooltip>
      <Tooltip title="Finance" arrow placement="top">
        <AttachMoneyOutlinedIcon
          sx={{ fontSize: 16, color: "#475569", cursor: "pointer", '&:hover': { color: '#1a3a6b' } }}
          onClick={handleFinanceClick}
        />
      </Tooltip>
      <Tooltip title="Treatment Plan" arrow placement="top">
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#475569",
            cursor: "pointer",
            lineHeight: 1,
            '&:hover': { color: '#1a3a6b' }
          }}
          onClick={handleClinicalClick}
        >
          Tx
        </Typography>
      </Tooltip>
      <Tooltip title="Chat" arrow placement="top">
        <ChatBubbleOutlineIcon
          sx={{ fontSize: 16, color: "#475569", cursor: "pointer", '&:hover': { color: '#1a3a6b' } }}
          onClick={(e) => {
            e.stopPropagation();
            if (onChatClick) onChatClick();
          }}
        />
      </Tooltip>
    </Box>
  );
};

const displayDate = (value) => {
  if (!value) return '\u2014';
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[2]}/${match[3]}/${match[1]}` : value;
};

const parseFlags = (flags) => {
  if (!flags) return [];
  if (Array.isArray(flags)) return flags.filter(Boolean);
  if (typeof flags === "string") {
    return flags.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [flags];
};

const getFlagItemColor = (flag, globalFlags = []) => {
  if (!flag) return "#cbd5e1";
  if (typeof flag === "object") {
    if (flag.color) return flag.color;
    return resolveFlagColor(flag, globalFlags);
  }
  const str = String(flag).trim();
  if (/^#([0-9a-f]{3}){1,2}$/i.test(str)) {
    return str;
  }
  if (/^(rgb|hsl)a?\(.+?\)$/i.test(str)) {
    return str;
  }
  if (str.toLowerCase() === "recare disabled") {
    return "#f59e0b";
  }
  return resolveFlagColor(str, globalFlags);
};

const getFlagItemLabel = (flag) => {
  if (!flag) return "Flag";
  if (typeof flag === "object") {
    return flag.name || flag.label || "Flag";
  }
  return String(flag).trim();
};

const formatNoteDateTime = (dateVal) => {
  if (!dateVal) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const m = pad(now.getMonth() + 1);
    const d = pad(now.getDate());
    const y = now.getFullYear();
    let h = now.getHours();
    const min = pad(now.getMinutes());
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${m}/${d}/${y} ${pad(h)}:${min} ${ampm}`;
  }

  if (/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s+(AM|PM)$/i.test(String(dateVal))) {
    return String(dateVal);
  }

  const d = new Date(dateVal);
  if (isNaN(d.getTime())) {
    const parts = String(dateVal).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (parts) {
      return `${parts[2]}/${parts[3]}/${parts[1]} 12:38 PM`;
    }
    return String(dateVal);
  }

  const pad = (n) => String(n).padStart(2, "0");
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const y = d.getFullYear();
  let h = d.getHours();
  const min = pad(d.getMinutes());
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${m}/${day}/${y} ${pad(h)}:${min} ${ampm}`;
};

const parseNoteContent = (rawNote, fallbackDate) => {
  if (!rawNote) {
    return {
      timestamp: formatNoteDateTime(fallbackDate),
      text: "",
    };
  }

  const str = String(rawNote).trim();

  // Pattern: "07/15/2022 12:38 PM Pt has Covid" or "07/15/2022 12:38 PM\nPt has Covid"
  const dtMatch = str.match(
    /^(\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)[\s\n\r]*[-:]?[\s\n\r]*(.*)$/s
  );
  if (dtMatch && dtMatch[1] && dtMatch[2] !== undefined) {
    let ts = dtMatch[1].trim();
    if (!ts.includes(":") && !ts.toLowerCase().includes("m")) {
      ts = `${ts} 12:38 PM`;
    }
    return {
      timestamp: ts,
      text: dtMatch[2].trim(),
    };
  }

  // Pattern: ISO date string "2022-07-15..."
  const isoMatch = str.match(
    /^(\d{4}-\d{2}-\d{2}(?:T|\s+)\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)[\s\n\r]*[-:]?[\s\n\r]*(.*)$/s
  );
  if (isoMatch && isoMatch[1]) {
    return {
      timestamp: formatNoteDateTime(isoMatch[1]),
      text: (isoMatch[2] || "").trim(),
    };
  }

  return {
    timestamp: formatNoteDateTime(fallbackDate),
    text: str,
  };
};

const RecareList = ({
  setSubtitle,
  hideFilters = false,
  forcedCategory = null,
  forcedMonth = null,
  getRowCategory = null,
  onPrintReady = null,
}) => {
  const branchId = useSelector(state => state.branch?.currentBranchId);
  const dispatch = useDispatch();
  const apiData = useSelector(selectRecareData);
  const loading = useSelector(selectClinicalReportLoading);
  const error = useSelector(selectClinicalReportError);
  const allProviders = useSelector(selectProviderDropdownList);
  const practiceInfo = useSelector(selectPracticeInfo);
  const globalFlags = useMemo(() => practiceInfo?.patientFlags || [], [practiceInfo?.patientFlags]);

  const [chatPatient, setChatPatient] = useState(null);
  const [filterType, setFilterType] = useState("range");
  const [dentist, setDentist] = useState("None");
  const [hygienist, setHygienist] = useState("None");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeAppointed, setIncludeAppointed] = useState(false);
  const [flagFilter, setFlagFilter] = useState("both");
  const [showFlagsCol, setShowFlagsCol] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Editable row values & sorting state for Note, Contact Again, Follow up Date
  const [rowNotes, setRowNotes] = useState({});
  const [activeNoteEditors, setActiveNoteEditors] = useState({});
  const [rowNoteTimestamps, setRowNoteTimestamps] = useState({});
  const [rowContactAgain, setRowContactAgain] = useState({});
  const [rowFollowUpDate, setRowFollowUpDate] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [savingRows, setSavingRows] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const getRowNoteContent = useCallback((row) => {
    const rawNote = rowNotes[row.id] !== undefined ? rowNotes[row.id] : row.note;
    return parseNoteContent(rawNote, row.lastComm || row.recallDate);
  }, [rowNotes]);

  const getRowContactAgain = useCallback((row) => {
    if (rowContactAgain[row.id] !== undefined) {
      return rowContactAgain[row.id];
    }
    if (!row.contactAgain) return "";
    const str = String(row.contactAgain).trim();
    if (str.toUpperCase() === "Y" || str.toUpperCase() === "YES") return "Y";
    if (str.toUpperCase() === "N" || str.toUpperCase() === "NO") return "N";
    return str;
  }, [rowContactAgain]);

  const getRowFollowUp = useCallback((row) => {
    if (rowFollowUpDate[row.id] !== undefined) {
      return rowFollowUpDate[row.id];
    }
    if (!row.followUp) return "";
    const str = String(row.followUp).trim();
    if (str === '\u2014' || str === '—' || str === '-') return "";
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[2]}/${match[3]}/${match[1]}`;
    }
    return str;
  }, [rowFollowUpDate]);

  const handleToggleNoteEditor = (row) => {
    const isCurrentlyOpen = activeNoteEditors[row.id] !== undefined ? activeNoteEditors[row.id] : Boolean(row.note);
    setActiveNoteEditors((prev) => ({
      ...prev,
      [row.id]: !isCurrentlyOpen,
    }));
    if (!rowNoteTimestamps[row.id]) {
      const parsed = parseNoteContent(row.note, row.lastComm || row.recallDate);
      setRowNoteTimestamps((prev) => ({
        ...prev,
        [row.id]: parsed.timestamp,
      }));
    }
  };

  const handleNoteChange = (rowId, newText) => {
    setRowNotes((prev) => ({ ...prev, [rowId]: newText }));
  };

  const handleContactAgainChange = (rowId, newVal) => {
    setRowContactAgain((prev) => ({ ...prev, [rowId]: newVal }));
  };

  const handleFollowUpDateChange = (rowId, newVal) => {
    setRowFollowUpDate((prev) => ({ ...prev, [rowId]: newVal }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        return { key: null, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleResetRow = async (row) => {
    const rowId = row.id;
    setSavingRows((prev) => ({ ...prev, [rowId]: true }));
    try {
      const noteContent = getRowNoteContent(row);
      const noteTextVal = noteContent.text;
      const contactAgainVal = getRowContactAgain(row);
      const followUpVal = getRowFollowUp(row);

      await reportingService.resetRecareReminder(rowId, {
        note: noteTextVal,
        contactAgain: contactAgainVal,
        followUp: followUpVal,
      });

      setSnackbar({
        open: true,
        message: `Saved details and reset reminders for ${row.patient || "patient"}.`,
        severity: "success",
      });
    } catch (err) {
      console.error("Failed to reset recare:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error?.message || err.response?.data?.message || err.message || "Failed to save recare details",
        severity: "error",
      });
    } finally {
      setSavingRows((prev) => ({ ...prev, [rowId]: false }));
    }
  };

  // Fetch on mount
  useEffect(() => {
    if (!hideFilters) {
      dispatch(fetchRecareReport({ branchId }));
    }
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch, hideFilters, branchId]);

  // Helper: resolve provider display name (name may be nested under userId)
  const getProviderName = (p) => {
    const first = p.userId?.firstName || p.firstName || p.FName || "";
    const last = p.userId?.lastName || p.lastName || p.LName || "";
    return `${first} ${last}`.trim() || p.providerCode || p._id || "Unknown";
  };

  // Split providers by specialty — safely handle non-string values
  const getSpecialty = (p) => {
    const raw = p.specialty || p.specialtyId?.name || p.providerType || "";
    if (typeof raw === "string") return raw.toLowerCase();
    if (Array.isArray(raw)) return raw.join(" ").toLowerCase();
    if (typeof raw === "object" && raw !== null)
      return JSON.stringify(raw).toLowerCase();
    return String(raw).toLowerCase();
  };
  const dentists = allProviders.filter((p) => {
    const sp = getSpecialty(p);
    return (
      sp.includes("dentist") ||
      sp.includes("dds") ||
      sp.includes("dmd") ||
      sp.includes("doctor")
    );
  });
  const hygienists = allProviders.filter((p) => {
    const sp = getSpecialty(p);
    return sp.includes("hygien");
  });
  // If we couldn't classify by specialty, fall back to showing all in both
  const dentistOptions = dentists.length > 0 ? dentists : allProviders;
  const hygienistOptions = hygienists.length > 0 ? hygienists : allProviders;

  // Update parent subtitle
  useEffect(() => {
    if (!setSubtitle) return;

    const formatDate = (isoStr) => {
      if (!isoStr) return "";
      const [year, month, day] = isoStr.split("-");
      return `${month}/${day}/${year}`;
    };

    if (startDate && endDate) {
      setSubtitle(
        `Patients due for their recare between ${formatDate(startDate)} and ${formatDate(endDate)}`,
      );
    } else if (startDate) {
      setSubtitle(
        `Patients due for their recare from ${formatDate(startDate)}`,
      );
    } else if (endDate) {
      setSubtitle(`Patients due for their recare until ${formatDate(endDate)}`);
    } else {
      setSubtitle(`Patients due for their recare`);
    }
  }, [startDate, endDate, setSubtitle]);

  // Normalize API data into display rows
  const baseRows = useMemo(() => {
    let rows = apiData || [];

    // Apply forced category from dialog
    if (forcedCategory && getRowCategory) rows = rows.filter(r => getRowCategory(r) === forcedCategory);
    if (forcedMonth) rows = rows.filter(r => (r.recallDate?.slice(0, 7) || 'No due date') === forcedMonth);

    // Dentist filter
    if (dentist !== "None") {
      rows = rows.filter((r) => r.dentistId === dentist);
    }

    // Hygienist filter
    if (hygienist !== "None") {
      rows = rows.filter((r) => r.hygienistId === hygienist);
    }

    return rows.map((item, i) => ({
      id: item.id || item.PatNum || i + 1,
      patient:
        item.patient ||
        `${item["First Name"] || ""} ${item["Last Name"] || ""}`.trim() ||
        "Unknown",
      flags: item.flags || "",
      age: item.age ?? "",
      contact: item.contact || item.phone || item.email || "",
      recallDate: item.recallDate || "",
      lastExam: item.lastExam || "",
      lastProphy: item.lastProphy || "",
      lastMaintenance: item.lastMaintenance || "",
      lastComm: item.lastComm || "",
      note: item.note || "",
      contactAgain: item.contactAgain || "",
      followUp: item.followUp || "",
      apptDate: item.apptDate || "",
      contactCount: item.contactCount ?? "",
      dentistId: item.dentistId || "",
      hygienistId: item.hygienistId || "",
    }));
  }, [apiData, forcedCategory, forcedMonth, getRowCategory, dentist, hygienist]);

  // Apply all filters
  const filteredRows = useMemo(() => {
    let rows = [...baseRows];

    // 1. Patient name search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) => r.patient.toLowerCase().includes(q));
    }

    // 2. Include Appointed (patients with an upcoming apptDate)
    if (!hideFilters && !includeAppointed) {
      rows = rows.filter((r) => !r.apptDate);
    }

    // 3. Flags filter
    if (flagFilter === "with") {
      rows = rows.filter((r) => r.flags && r.flags !== "");
    } else if (flagFilter === "without") {
      rows = rows.filter((r) => !r.flags || r.flags === "");
    }

    // 4. Date range filter on recallDate
    if (startDate || endDate) {
      const startT = startDate ? new Date(startDate).getTime() : 0;
      const endT = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;
      rows = rows.filter((r) => {
        if (!r.recallDate) return true;
        const t = new Date(r.recallDate).getTime();
        if (isNaN(t)) return true;
        return t >= startT && t < endT;
      });
    }

    return rows;
  }, [baseRows, searchQuery, includeAppointed, flagFilter, startDate, endDate, hideFilters]);

  // Sort rows based on sortConfig
  const sortedRows = useMemo(() => {
    let rows = [...filteredRows];
    if (sortConfig.key) {
      rows.sort((a, b) => {
        let valA = "";
        let valB = "";
        if (sortConfig.key === "contactAgain") {
          valA = getRowContactAgain(a);
          valB = getRowContactAgain(b);
        } else if (sortConfig.key === "followUp") {
          valA = getRowFollowUp(a);
          valB = getRowFollowUp(b);
        } else {
          valA = a[sortConfig.key] || "";
          valB = b[sortConfig.key] || "";
        }
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [filteredRows, sortConfig, getRowContactAgain, getRowFollowUp]);

  // Paginate (0-indexed for TablePagination)
  const pagedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleApplyFilters = () => {
    setPage(0);
    // Re-fetch from API with date params
    dispatch(
      fetchRecareReport({
        branchId,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setDentist("None");
    setHygienist("None");
    setIncludeAppointed(false);
    setFlagFilter("both");
    setShowFlagsCol(true);
    setPage(0);
    dispatch(fetchRecareReport({ branchId }));
  };

  const handlePrintPatient = (patientRow) => {
    if (!patientRow) return;

    const flagItems = parseFlags(patientRow.flags);
    const flagsHtml = flagItems.length === 0
      ? "—"
      : flagItems
          .map((f) => {
            const color = getFlagItemColor(f, globalFlags);
            const label = getFlagItemLabel(f);
            return `<span title="${label}" style="display:inline-block;width:14px;height:14px;background-color:${color};border-radius:3px;border:1px solid rgba(0,0,0,0.15);margin-right:4px;vertical-align:middle;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></span>`;
          })
          .join("");

    const noteContent = getRowNoteContent(patientRow);
    const noteDisplay = noteContent.text ? `${noteContent.timestamp ? `[${noteContent.timestamp}] ` : ""}${noteContent.text}` : "—";
    const contactAgainDisplay = getRowContactAgain(patientRow) || "—";
    const followUpDisplay = getRowFollowUp(patientRow) || "—";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Recare Details - ${patientRow.patient || "Patient"}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              font-size: 13px;
              color: #1e293b;
              padding: 24px;
              margin: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            h2 {
              color: #1e293b;
              margin: 10px 0 4px 0;
              font-size: 20px;
              font-weight: 700;
            }
            .subtitle {
              color: #64748b;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa !important;
              font-weight: 600;
              color: #475569;
              width: 200px;
            }
            td {
              color: #1e293b;
            }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            @media print {
              body { padding: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" onerror="this.style.display='none'" />
            <h2>${patientRow.patient || "Patient"}</h2>
            <div class="subtitle">Recare Details Report</div>
          </div>
          <table>
            <tbody>
              <tr><th>Patient Name</th><td>${patientRow.patient || "—"}</td></tr>
              <tr><th>Flags</th><td>${flagsHtml}</td></tr>
              <tr><th>Age</th><td>${patientRow.age !== "" && patientRow.age !== null && patientRow.age !== undefined ? patientRow.age : "—"}</td></tr>
              <tr><th>Contact</th><td>${patientRow.contact || "—"}</td></tr>
              <tr><th>Recall Date</th><td>${displayDate(patientRow.recallDate)}</td></tr>
              <tr><th>Last Exam</th><td>${displayDate(patientRow.lastExam)}</td></tr>
              <tr><th>Last Prophy</th><td>${displayDate(patientRow.lastProphy)}</td></tr>
              <tr><th>Last Maintenance</th><td>${displayDate(patientRow.lastMaintenance)}</td></tr>
              <tr><th>Last Communication</th><td>${displayDate(patientRow.lastComm)}</td></tr>
              <tr><th>Note</th><td>${noteDisplay}</td></tr>
              <tr><th>Contact Again</th><td>${contactAgainDisplay}</td></tr>
              <tr><th>Follow Up</th><td>${followUpDisplay}</td></tr>
              <tr><th>Appointment Date</th><td>${displayDate(patientRow.apptDate)}</td></tr>
              <tr><th>Contact Count</th><td>${patientRow.contactCount !== "" && patientRow.contactCount !== null && patientRow.contactCount !== undefined ? patientRow.contactCount : "—"}</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.srcdoc = htmlContent;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow.onafterprint = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 15000);
    };
  };

  const handlePrint = useCallback(() => {
    const rowsHtml = sortedRows.length === 0
      ? `<tr><td colspan="${showFlagsCol ? 15 : 14}" style="text-align: center; padding: 16px; color: #64748b;">No patients match the current filters.</td></tr>`
      : sortedRows
      .map((row) => {
        const flagItems = parseFlags(row.flags);
        const flagsHtml = flagItems.length === 0
          ? "—"
          : flagItems
              .map((f) => {
                const color = getFlagItemColor(f, globalFlags);
                const label = getFlagItemLabel(f);
                return `<span title="${label}" style="display:inline-block;width:12px;height:12px;background-color:${color};border-radius:2px;border:1px solid rgba(0,0,0,0.15);margin-right:3px;vertical-align:middle;"></span>`;
              })
              .join("");

        const noteContent = getRowNoteContent(row);
        const noteDisplay = noteContent.text ? `${noteContent.timestamp ? `[${noteContent.timestamp}] ` : ""}${noteContent.text}` : "—";
        const contactAgainDisplay = getRowContactAgain(row) || "—";
        const followUpDisplay = getRowFollowUp(row) || "—";

        return `
          <tr>
            <td><strong>${row.patient || "—"}</strong></td>
            ${showFlagsCol ? `<td>${flagsHtml}</td>` : ""}
            <td>${row.age !== "" && row.age !== null && row.age !== undefined ? row.age : "—"}</td>
            <td>${row.contact || "—"}</td>
            <td>${displayDate(row.recallDate)}</td>
            <td>${displayDate(row.lastExam)}</td>
            <td>${displayDate(row.lastProphy)}</td>
            <td>${displayDate(row.lastMaintenance)}</td>
            <td>${displayDate(row.lastComm)}</td>
            <td>${noteDisplay}</td>
            <td>${contactAgainDisplay}</td>
            <td>${followUpDisplay}</td>
            <td>${displayDate(row.apptDate)}</td>
            <td>${row.contactCount !== "" && row.contactCount !== null && row.contactCount !== undefined ? row.contactCount : "—"}</td>
            <td>—</td>
          </tr>
        `;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recare List Report</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              font-size: 11px; 
              background-color: #fff; 
              color: #1e293b; 
              padding: 20px; 
              margin: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header { text-align: center; margin-bottom: 20px; }
            h2 { text-align: center; margin-top: 6px; margin-bottom: 4px; color: #1e293b; font-size: 20px; }
            .subtitle { text-align: center; color: #64748b; font-size: 12px; margin-top: 0; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
            th { background-color: #f8f9fa !important; font-weight: 600; color: #475569; font-size: 11px; }
            .no-print, button, svg { display: none !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" onerror="this.style.display='none'" />
            <h2>${forcedCategory ? forcedCategory : "Recare List Report"}</h2>
            <div class="subtitle">
              (number of patients = ${sortedRows.length})${forcedMonth ? ` &bull; Month: ${forcedMonth}` : ''}${startDate || endDate ? ` &bull; Due: ${startDate || 'Any'} - ${endDate || 'Any'}` : ''}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                ${showFlagsCol ? "<th>Flags</th>" : ""}
                <th>Age</th>
                <th>Contact</th>
                <th>Recall Date</th>
                <th>Last Exam</th>
                <th>Last Prophy</th>
                <th>Last Main.</th>
                <th>Last Comm.</th>
                <th>Note</th>
                <th>Contact Again</th>
                <th>Follow up</th>
                <th>Appt Date</th>
                <th>Count</th>
                <th>Reset</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.srcdoc = htmlContent;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow.onafterprint = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 15000);
    };
  }, [sortedRows, showFlagsCol, globalFlags, getRowNoteContent, getRowContactAgain, getRowFollowUp, forcedCategory, forcedMonth, startDate, endDate]);

  useEffect(() => {
    if (onPrintReady) {
      onPrintReady(handlePrint);
    }
  }, [onPrintReady, handlePrint]);

  const handleExportCSV = () => {
    const headers = [
      "Patient",
      "Flags",
      "Age",
      "Contact",
      "Recall Date",
      "Last Exam",
      "Last Prophy",
      "Last Main.",
      "Last Comm.",
      "Note",
      "Contact Again",
      "Follow up Date",
      "Appt Date",
      "Count",
    ];
    const csvRows = [
      headers.join(","),
      ...sortedRows.map((r) => {
        const noteContent = getRowNoteContent(r);
        const noteText = noteContent.text ? `${noteContent.timestamp ? `[${noteContent.timestamp}] ` : ""}${noteContent.text}` : "";
        const contactAgainVal = getRowContactAgain(r);
        const followUpVal = getRowFollowUp(r);
        return [
          `"${r.patient}"`,
          `"${r.flags}"`,
          r.age,
          `"${r.contact}"`,
          r.recallDate,
          r.lastExam,
          r.lastProphy,
          r.lastMaintenance,
          r.lastComm,
          `"${noteText.replace(/"/g, '""')}"`,
          `"${contactAgainVal}"`,
          `"${followUpVal}"`,
          r.apptDate,
          r.contactCount,
        ].join(",");
      }),
    ].join("\n");
    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `recare_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.click();
  };

  return (
    <Box
      sx={{
        p: hideFilters ? 0 : 3,
        backgroundColor: "transparent",
      }}
    >
      {!hideFilters && (
        <>
          <RecareListFilters
            filterType={filterType}
            startDate={startDate}
            endDate={endDate}
            dentist={dentist}
            hygienist={hygienist}
            dentistOptions={dentistOptions}
            hygienistOptions={hygienistOptions}
            includeAppointed={includeAppointed}
            flagFilter={flagFilter}
            showFlagsCol={showFlagsCol}
            searchQuery={searchQuery}
            setFilterType={setFilterType}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setDentist={setDentist}
            setHygienist={setHygienist}
            setIncludeAppointed={setIncludeAppointed}
            setFlagFilter={setFlagFilter}
            setShowFlagsCol={setShowFlagsCol}
            setSearchQuery={setSearchQuery}
            handleApplyFilters={handleApplyFilters}
            handleClearFilters={handleClearFilters}
            getProviderName={getProviderName}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              ({filteredRows.length} Patient/s)
            </Typography>
            <Box sx={{ transform: 'translateY(-8px)' }}>
              <ProductionReportActions
                onExportCsv={handleExportCSV}
                onPrint={handlePrint}
                hasData={filteredRows.length > 0}
              />
            </Box>
          </Box>
        </>
      )}

      {/* Loading */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper
            sx={{
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
              mt: 1,
              overflow: 'hidden',
            }}
          >
            <TableContainer>
            <Table id="recare-list-table" size="small">
              <TableHead sx={{ backgroundColor: "rgba(240, 244, 249, 0.6)" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Patient
                  </TableCell>
                  {showFlagsCol && (
                    <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                      Flags
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Age
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Recall Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Last Exam
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Last Prophy
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Last Main.
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Last Comm.
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Note
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('contactAgain')}
                    sx={{
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "#5C646F",
                      fontFamily: "'Inter', sans-serif",
                      cursor: "pointer",
                      userSelect: "none",
                      verticalAlign: "bottom",
                      pb: 1,
                      '&:hover': { color: '#1a3a6b' },
                    }}
                  >
                    <Box sx={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
                      <Box component="span">Contact</Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                        <Box component="span">Again</Box>
                        <SwapVert sx={{ fontSize: 16, color: sortConfig.key === 'contactAgain' ? '#1a3a6b' : '#64748b' }} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('followUp')}
                    sx={{
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "#5C646F",
                      fontFamily: "'Inter', sans-serif",
                      cursor: "pointer",
                      userSelect: "none",
                      verticalAlign: "bottom",
                      pb: 1,
                      whiteSpace: "nowrap",
                      '&:hover': { color: '#1a3a6b' },
                    }}
                  >
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.25 }}>
                      <Box component="span">Follow up Date</Box>
                      <SwapVert sx={{ fontSize: 16, color: sortConfig.key === 'followUp' ? '#1a3a6b' : '#64748b' }} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Appt Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Count
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>
                    Reminders
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={showFlagsCol ? 15 : 14}
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "text.secondary",
                        fontSize: "0.8rem",
                      }}
                    >
                      No patients match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRows.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          color: "#1a3a6b",
                          fontWeight: 600,
                          verticalAlign: "top",
                          pt: 1.5,
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>{row.patient}</Typography>
                          <ActionIcons
                            row={row}
                            onPrint={handlePrintPatient}
                            onChatClick={() => setChatPatient(row)}
                          />
                        </Box>
                      </TableCell>
                      {showFlagsCol && (
                        <TableCell sx={{ verticalAlign: "top", pt: 1.5 }}>
                          {(() => {
                            const flagItems = parseFlags(row.flags);
                            if (flagItems.length === 0) {
                              return (
                                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                  {'\u2014'}
                                </Typography>
                              );
                            }
                            return (
                              <Box sx={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap", pt: 0.5 }}>
                                {flagItems.map((flag, idx) => {
                                  const flagColor = getFlagItemColor(flag, globalFlags);
                                  const flagLabel = getFlagItemLabel(flag);
                                  return (
                                    <Tooltip key={idx} title={flagLabel} arrow placement="top">
                                      <Box
                                        component="span"
                                        sx={{
                                          display: "inline-block",
                                          width: 14,
                                          height: 14,
                                          borderRadius: "3px",
                                          backgroundColor: flagColor,
                                          border: "1px solid rgba(0, 0, 0, 0.12)",
                                          flexShrink: 0,
                                          cursor: "pointer",
                                          WebkitPrintColorAdjust: "exact",
                                          printColorAdjust: "exact",
                                        }}
                                      />
                                    </Tooltip>
                                  );
                                })}
                              </Box>
                            );
                          })()}
                        </TableCell>
                      )}
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "top", pt: 1.5 }}>
                        {row.age}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", color: "#4a90e2", verticalAlign: "top", pt: 1.5 }}>
                        {row.contact}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "top", pt: 1.5 }}>
                        {displayDate(row.recallDate)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "top", pt: 1.5 }}>
                        {displayDate(row.lastExam)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "top", pt: 1.5 }}>
                        {displayDate(row.lastProphy)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "top", pt: 1.5 }}>
                        {displayDate(row.lastMaintenance)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "top", pt: 1.5 }}>
                        {displayDate(row.lastComm)}
                      </TableCell>

                      {/* Note Column */}
                      <TableCell sx={{ fontSize: '0.85rem', verticalAlign: 'top', pt: 1.5, minWidth: 200, maxWidth: 280 }}>
                        {(() => {
                          const isEditorOpen = activeNoteEditors[row.id] !== undefined ? activeNoteEditors[row.id] : Boolean(row.note);
                          const noteContent = getRowNoteContent(row);
                          const currentTimestamp = rowNoteTimestamps[row.id] || noteContent.timestamp;
                          const currentNoteText = noteContent.text;

                          return (
                            <Box>
                              <Box
                                onClick={() => handleToggleNoteEditor(row)}
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  cursor: 'pointer',
                                  color: '#334155',
                                  userSelect: 'none',
                                  '&:hover': { color: '#0f172a' },
                                }}
                              >
                                <EditOutlined sx={{ fontSize: 16, color: 'inherit' }} />
                                <Typography sx={{ fontSize: '13px', fontWeight: 500, color: 'inherit', fontFamily: "'Inter', sans-serif" }}>
                                  Add note
                                </Typography>
                              </Box>

                              {isEditorOpen && (
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography
                                    sx={{
                                      fontSize: '12px',
                                      color: '#1e293b',
                                      fontWeight: 500,
                                      mb: 0.5,
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  >
                                    {currentTimestamp}
                                  </Typography>
                                  <Box
                                    component="textarea"
                                    value={currentNoteText}
                                    onChange={(e) => handleNoteChange(row.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{
                                      width: '100%',
                                      minHeight: 65,
                                      p: '6px 8px',
                                      fontSize: '13px',
                                      fontFamily: "'Inter', sans-serif",
                                      color: '#1e293b',
                                      backgroundColor: '#ffffff',
                                      border: '1px solid #71717a',
                                      borderRadius: '2px',
                                      outline: 'none',
                                      resize: 'both',
                                      display: 'block',
                                      boxSizing: 'border-box',
                                      '&:focus': {
                                        borderColor: '#1a3a6b',
                                        boxShadow: '0 0 0 1px #1a3a6b',
                                      },
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>
                          );
                        })()}
                      </TableCell>

                      {/* Contact Again Column */}
                      <TableCell sx={{ fontSize: '0.85rem', verticalAlign: 'top', pt: 1.5, minWidth: 75, width: 85 }}>
                        {(() => {
                          const contactAgainVal = getRowContactAgain(row);
                          return (
                            <Select
                              variant="standard"
                              value={contactAgainVal}
                              onChange={(e) => handleContactAgainChange(row.id, e.target.value)}
                              displayEmpty
                              IconComponent={KeyboardArrowDown}
                              sx={{
                                width: 65,
                                fontSize: '0.85rem',
                                color: '#1e293b',
                                fontFamily: "'Inter', sans-serif",
                                '&:before': {
                                  borderBottom: '1px solid #cbd5e1 !important',
                                },
                                '&:hover:not(.Mui-disabled):before': {
                                  borderBottom: '1px solid #94a3b8 !important',
                                },
                                '&:after': {
                                  borderBottom: '2px solid #1a3a6b !important',
                                },
                                '& .MuiSelect-select': {
                                  py: 0.25,
                                  pr: '22px !important',
                                  pl: 0.5,
                                  textAlign: 'left',
                                  fontSize: '0.85rem',
                                  minHeight: 'auto',
                                },
                                '& .MuiSelect-icon': {
                                  fontSize: 20,
                                  color: '#64748b',
                                  right: 0,
                                  top: 'calc(50% - 10px)',
                                },
                              }}
                            >
                              <MenuItem value="" sx={{ minHeight: '32px' }}>
                                <span style={{ color: '#94a3b8' }}>&nbsp;</span>
                              </MenuItem>
                              <MenuItem value="Y" sx={{ minHeight: '32px', fontSize: '0.85rem' }}>
                                Y
                              </MenuItem>
                              <MenuItem value="N" sx={{ minHeight: '32px', fontSize: '0.85rem' }}>
                                N
                              </MenuItem>
                              {contactAgainVal && !["", "Y", "N"].includes(contactAgainVal) && (
                                <MenuItem value={contactAgainVal} sx={{ minHeight: '32px', fontSize: '0.85rem' }}>
                                  {contactAgainVal}
                                </MenuItem>
                              )}
                            </Select>
                          );
                        })()}
                      </TableCell>

                      {/* Follow up Date Column */}
                      <TableCell sx={{ fontSize: '0.85rem', verticalAlign: 'top', pt: 1.5, minWidth: 120, width: 140 }}>
                        {(() => {
                          const followUpVal = getRowFollowUp(row);
                          return (
                            <TextField
                              variant="standard"
                              placeholder="Enter Date"
                              value={followUpVal}
                              onChange={(e) => handleFollowUpDateChange(row.id, e.target.value)}
                              sx={{
                                width: 120,
                                '& .MuiInputBase-input': {
                                  fontSize: '0.85rem',
                                  color: '#1e293b',
                                  py: 0.25,
                                  fontFamily: "'Inter', sans-serif",
                                  '&::placeholder': {
                                    color: '#94a3b8',
                                    opacity: 1,
                                  },
                                },
                                '& .MuiInput-underline:before': {
                                  borderBottom: '1px solid #cbd5e1 !important',
                                },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                  borderBottom: '1px solid #94a3b8 !important',
                                },
                                '& .MuiInput-underline:after': {
                                  borderBottom: '2px solid #1a3a6b !important',
                                },
                              }}
                            />
                          );
                        })()}
                      </TableCell>

                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          verticalAlign: "top",
                          pt: 1.5,
                        }}
                      >
                        {displayDate(row.apptDate)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          verticalAlign: "top",
                          pt: 1.5,
                        }}
                      >
                        <Tooltip title="Number of recorded patient communications">
                          <span>{row.contactCount === '' ? '\u2014' : row.contactCount}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", pt: 1.5, textAlign: "center", minWidth: 75 }}>
                        <Button
                          size="small"
                          disabled={Boolean(savingRows[row.id])}
                          onClick={() => handleResetRow(row)}
                          sx={{
                            backgroundColor: '#2362EF',
                            color: '#ffffff',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '12px',
                            fontFamily: "'Inter', sans-serif",
                            borderRadius: '6px',
                            px: 1.5,
                            py: 0.25,
                            minWidth: '58px',
                            height: '26px',
                            boxShadow: 'none',
                            transition: 'all 0.15s ease-in-out',
                            '&:hover': {
                              backgroundColor: '#1D53CC',
                              boxShadow: 'none',
                            },
                            '&:disabled': {
                              backgroundColor: '#bfdbfe',
                              color: '#ffffff',
                            },
                          }}
                        >
                          {savingRows[row.id] ? (
                            <CircularProgress size={14} sx={{ color: '#ffffff' }} />
                          ) : (
                            "Reset"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={sortedRows.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Rows per page:"
            sx={{
              borderTop: '1px solid #e2e8f0',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontFamily: 'Inter',
                fontSize: '0.75rem',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              },
              '& .MuiTablePagination-select': { fontFamily: 'Inter', fontSize: '0.75rem' },
            }}
          />
        </Paper>
        </>
      )}

      {/* Patient Chat Dialog */}
      <PatientChat
        open={!!chatPatient}
        onClose={() => setChatPatient(null)}
        patientName={chatPatient?.patient}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecareList;
