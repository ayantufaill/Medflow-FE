import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Pagination,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Print,
  FileDownload,
  Add,
  EditOutlined,
} from "@mui/icons-material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  fetchRecareReport,
  selectRecareData,
  selectClinicalReportLoading,
} from "../../../../store/slices/clinicalReportSlice";
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
} from "../../../../store/slices/providerSlice";
import PatientChat from "../../../../components/shared/PatientChat";
import RecareListFilters from "../../../../components/reports/clinical/RecareListFilters";
import ProductionReportActions from "../../../../components/reports/financial/ProductionReportActions";

const ActionIcons = ({ onChatClick }) => (
  <Box
    className="no-print"
    sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center" }}
  >
    <PrintOutlinedIcon
      sx={{ fontSize: 16, color: "#475569", cursor: "pointer", '&:hover': { color: '#1a3a6b' } }}
    />
    <AttachMoneyOutlinedIcon
      sx={{ fontSize: 16, color: "#475569", cursor: "pointer", '&:hover': { color: '#1a3a6b' } }}
    />
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 700,
        color: "#475569",
        cursor: "pointer",
        lineHeight: 1,
        '&:hover': { color: '#1a3a6b' }
      }}
    >
      Tx
    </Typography>
    <ChatBubbleOutlineIcon
      sx={{ fontSize: 16, color: "#475569", cursor: "pointer", '&:hover': { color: '#1a3a6b' } }}
      onClick={onChatClick}
    />
  </Box>
);

// Fallback mock data — ISO dates for reliable parsing
const MOCK_ROWS = [
  {
    id: 1,
    patient: "Patient A",
    flags: "red",
    age: 37,
    contact: "(555) 123-4567",
    recallDate: "2026-05-24",
    lastExam: "2026-02-24",
    lastProphy: "2026-02-24",
    lastMaintenance: "",
    lastComm: "",
    note: "left message to schedule recare apt",
    contactAgain: "Y",
    followUp: "",
    apptDate: "",
    contactCount: 1,
  },
  {
    id: 2,
    patient: "Patient B",
    flags: "",
    age: 54,
    contact: "(555) 987-6543",
    recallDate: "2026-05-18",
    lastExam: "2025-11-18",
    lastProphy: "2025-11-18",
    lastMaintenance: "",
    lastComm: "",
    note: "",
    contactAgain: "Y",
    followUp: "",
    apptDate: "",
    contactCount: 0,
  },
  {
    id: 3,
    patient: "Patient C",
    flags: "",
    age: 44,
    contact: "(555) 456-7890",
    recallDate: "2026-06-13",
    lastExam: "2025-11-13",
    lastProphy: "2025-11-13",
    lastMaintenance: "",
    lastComm: "",
    note: "",
    contactAgain: "Y",
    followUp: "",
    apptDate: "2026-07-01",
    contactCount: 0,
  },
  {
    id: 4,
    patient: "Patient D",
    flags: "red",
    age: 29,
    contact: "(555) 321-0987",
    recallDate: "2026-07-10",
    lastExam: "2026-01-10",
    lastProphy: "2026-01-10",
    lastMaintenance: "",
    lastComm: "2026-06-15",
    note: "Requested callback",
    contactAgain: "N",
    followUp: "2026-07-05",
    apptDate: "",
    contactCount: 2,
  },
  {
    id: 5,
    patient: "Patient E",
    flags: "",
    age: 61,
    contact: "(555) 654-3210",
    recallDate: "2026-08-22",
    lastExam: "2026-02-22",
    lastProphy: "2026-02-22",
    lastMaintenance: "2025-08-22",
    lastComm: "",
    note: "",
    contactAgain: "Y",
    followUp: "",
    apptDate: "2026-08-30",
    contactCount: 0,
  },
];

const PAGE_SIZE = 10;

const RecareList = ({
  setSubtitle,
  hideFilters = false,
  forcedCategory = null,
  getRowCategory = null,
}) => {
  const dispatch = useDispatch();
  const apiData = useSelector(selectRecareData);
  const loading = useSelector(selectClinicalReportLoading);
  const allProviders = useSelector(selectProviderDropdownList);

  const [chatPatient, setChatPatient] = useState(null);
  const [editedRows, setEditedRows] = useState({}); // Local mock save for row edits
  const [filterType, setFilterType] = useState("range");
  const [dentist, setDentist] = useState("None");
  const [hygienist, setHygienist] = useState("None");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeAppointed, setIncludeAppointed] = useState(false);
  const [flagFilter, setFlagFilter] = useState("both");
  const [showFlagsCol, setShowFlagsCol] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Fetch on mount
  useEffect(() => {
    if (!hideFilters) {
      dispatch(fetchRecareReport({}));
    }
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch, hideFilters]);

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

  // Handlers for dynamic row edits
  const handleRowChange = (rowId, field, value) => {
    setEditedRows((prev) => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        [field]: value,
      },
    }));
  };

  const handleAddNoteClick = (row) => {
    if (!editedRows[row.id]?.noteText && !row.note) {
      setEditedRows((prev) => ({
        ...prev,
        [row.id]: {
          ...(prev[row.id] || {}),
          noteText: "",
          noteDate: new Date().toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          }),
        },
      }));
    }
  };

  const handleNoteChange = (rowId, newText) => {
    handleRowChange(rowId, "noteText", newText);
  };

  const handleNoteSave = (rowId, text) => {
    // In a real app, dispatch an API call to save the note here.
    console.log(`Saved note for row ${rowId}:`, text);
  };

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
    if (forcedCategory && getRowCategory) {
      rows = rows.filter((r) => {
        const cat = getRowCategory(r);
        // Allow broken appointments to match our combined No Appointment mapping
        if (
          forcedCategory.includes("Broken Appointment") &&
          cat.includes("No Appointment")
        ) {
          return (
            cat.split("No Appointment")[0] ===
            forcedCategory.split("Broken Appointment")[0]
          );
        }
        return cat === forcedCategory;
      });
    }

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
      age: item.age || "",
      contact: item.contact || item.phone || item.email || "",
      recallDate: item.recallDate || item.nextRecareAppt || "",
      lastExam: item.lastExam || item.lastAppt || "",
      lastProphy: item.lastProphy || "",
      lastMaintenance: item.lastMaintenance || "",
      lastComm: item.lastComm || "",
      note: item.note || "",
      contactAgain: item.contactAgain || "",
      followUp: item.followUp || "",
      apptDate: item.apptDate || item.nextTreatmentAppt || "",
      contactCount: item.contactCount || 0,
      dentistId: item.dentistId || "",
      hygienistId: item.hygienistId || "",
    }));
  }, [apiData, forcedCategory, getRowCategory, dentist, hygienist]);

  // Apply all filters
  const filteredRows = useMemo(() => {
    let rows = [...baseRows];

    // 1. Patient name search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) => r.patient.toLowerCase().includes(q));
    }

    // 2. Include Appointed (patients with an upcoming apptDate)
    if (!includeAppointed) {
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
  }, [baseRows, searchQuery, includeAppointed, flagFilter, startDate, endDate]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pagedRows = filteredRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleApplyFilters = () => {
    setPage(1);
    // Re-fetch from API with date params
    dispatch(
      fetchRecareReport({
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
    setPage(1);
    dispatch(fetchRecareReport({}));
  };

  const handlePrint = () => {
    const tableEl = document.getElementById("recare-list-table");
    if (!tableEl) return;
    const win = window.open("", "_blank");
    win.document.write("<html><head><title>Recare List Report</title>");
    win.document.write(
      "<style>table{width:100%;border-collapse:collapse;font-family:sans-serif;font-size:11px}th,td{border:1px solid #ddd;padding:6px;text-align:left}th{background:#f8f9fa;font-weight:bold} .no-print { display: none !important; } .print-only { display: inline !important; }</style>",
    );
    win.document.write("</head><body><h2>Recare List Report</h2>");
    win.document.write(tableEl.outerHTML);
    win.document.write("</body></html>");
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

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
      "Contact Again",
      "Appt Date",
      "Count",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredRows.map((r) =>
        [
          `"${r.patient}"`,
          `"${r.flags}"`,
          r.age,
          `"${r.contact}"`,
          r.recallDate,
          r.lastExam,
          r.lastProphy,
          r.lastMaintenance,
          r.lastComm,
          r.contactAgain,
          r.apptDate,
          r.contactCount,
        ].join(","),
      ),
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
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
              mt: 1
            }}
          >
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
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Contact Again
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Follow up
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Appt Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Count
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#5C646F", fontFamily: "'Inter', sans-serif" }}>
                    Reset
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
                          verticalAlign: "middle"
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>{row.patient}</Typography>
                          <ActionIcons onChatClick={() => setChatPatient(row)} />
                        </Box>
                      </TableCell>
                      {showFlagsCol && (
                        <TableCell>
                          {row.flags && row.flags !== "" && (
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                backgroundColor:
                                  row.flags === "red"
                                    ? "error.main"
                                    : row.flags,
                                borderRadius: "2px",
                              }}
                            />
                          )}
                        </TableCell>
                      )}
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {row.age}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", color: "#4a90e2", verticalAlign: "middle" }}>
                        {row.contact}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {row.recallDate}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {row.lastExam}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {row.lastProphy}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {row.lastMaintenance}
                      </TableCell>

                      {/* Editable Last Comm Date */}
                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          verticalAlign: "middle",
                        }}
                      >
                        <span
                          className="print-only"
                          style={{ display: "none" }}
                        >
                          {editedRows[row.id]?.lastComm !== undefined
                            ? editedRows[row.id].lastComm
                            : row.lastComm || ""}
                        </span>
                        <TextField
                          className="no-print"
                          type="date"
                          variant="standard"
                          size="small"
                          value={
                            editedRows[row.id]?.lastComm !== undefined
                              ? editedRows[row.id].lastComm
                              : row.lastComm || ""
                          }
                          onChange={(e) =>
                            handleRowChange(row.id, "lastComm", e.target.value)
                          }
                          InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: "0.75rem", color: "#1a3a6b" },
                          }}
                        />
                      </TableCell>

                      {/* Editable Note */}
                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          maxWidth: 220,
                          verticalAlign: "middle",
                        }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography
                            className="no-print"
                            variant="caption"
                            sx={{
                              color: "#1a3a6b",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                            onClick={() => handleAddNoteClick(row)}
                          >
                            <EditOutlined sx={{ fontSize: 14, mr: 0.5 }} /> Add
                            note
                          </Typography>
                          {(() => {
                            const stateNoteText = editedRows[row.id]?.noteText;
                            const stateNoteDate = editedRows[row.id]?.noteDate;
                            const hasNote =
                              stateNoteText !== undefined || row.note;

                            if (!hasNote) return null;

                            const text =
                              stateNoteText !== undefined
                                ? stateNoteText
                                : row.note;
                            const date =
                              stateNoteDate ||
                              (row.lastComm
                                ? `${row.lastComm} 12:00 PM`
                                : "07/15/2022 12:38 PM");

                            return (
                              <Box sx={{ mt: 0.5 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    display: "block",
                                    mb: 0.5,
                                  }}
                                >
                                  {date}
                                </Typography>
                                <span
                                  className="print-only"
                                  style={{ display: "none" }}
                                >
                                  {text}
                                </span>
                                <TextField
                                  className="no-print"
                                  multiline
                                  maxRows={3}
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  value={text}
                                  onChange={(e) =>
                                    handleNoteChange(row.id, e.target.value)
                                  }
                                  onBlur={(e) =>
                                    handleNoteSave(row.id, e.target.value)
                                  }
                                  InputProps={{
                                    sx: {
                                      fontSize: "0.8rem",
                                      p: 1,
                                      borderRadius: '6px',
                                      backgroundColor: '#ffffff'
                                    },
                                  }}
                                />
                              </Box>
                            );
                          })()}
                        </Box>
                      </TableCell>

                      {/* Editable Contact Again */}
                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          verticalAlign: "middle",
                        }}
                      >
                        <span
                          className="print-only"
                          style={{ display: "none" }}
                        >
                          {editedRows[row.id]?.contactAgain !== undefined
                            ? editedRows[row.id].contactAgain
                            : row.contactAgain === "Y" ||
                                row.contactAgain === "N"
                              ? row.contactAgain
                              : ""}
                        </span>
                        <Select
                          className="no-print"
                          variant="standard"
                          value={
                            editedRows[row.id]?.contactAgain !== undefined
                              ? editedRows[row.id].contactAgain
                              : row.contactAgain === "Y" ||
                                  row.contactAgain === "N"
                                ? row.contactAgain
                                : ""
                          }
                          onChange={(e) =>
                            handleRowChange(
                              row.id,
                              "contactAgain",
                              e.target.value,
                            )
                          }
                          displayEmpty
                          sx={{
                            fontSize: "0.75rem",
                            color: "#1a3a6b",
                            "& .MuiSelect-select": { py: 0.5 },
                          }}
                        >
                          <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
                            <em>&nbsp;</em>
                          </MenuItem>
                          <MenuItem value="Y" sx={{ fontSize: "0.75rem" }}>
                            Y
                          </MenuItem>
                          <MenuItem value="N" sx={{ fontSize: "0.75rem" }}>
                            N
                          </MenuItem>
                        </Select>
                      </TableCell>

                      {/* Editable Follow Up Date */}
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          verticalAlign: "top",
                          pt: 1.5,
                        }}
                      >
                        <span
                          className="print-only"
                          style={{ display: "none" }}
                        >
                          {editedRows[row.id]?.followUp !== undefined
                            ? editedRows[row.id].followUp
                            : row.followUp || ""}
                        </span>
                        <TextField
                          className="no-print"
                          type="date"
                          variant="standard"
                          size="small"
                          value={
                            editedRows[row.id]?.followUp !== undefined
                              ? editedRows[row.id].followUp
                              : row.followUp || ""
                          }
                          onChange={(e) =>
                            handleRowChange(row.id, "followUp", e.target.value)
                          }
                          InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: "0.75rem", color: "#1a3a6b" },
                          }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          verticalAlign: "middle",
                        }}
                      >
                        {row.apptDate}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          verticalAlign: "middle",
                        }}
                      >
                        {row.contactCount}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "middle" }}>
                        <Button
                          className="no-print"
                          size="small"
                          variant="contained"
                          sx={{
                            fontSize: "0.7rem",
                            p: "4px 10px",
                            backgroundColor: "#1a3a6b",
                            textTransform: "none",
                            borderRadius: "6px",
                            "&:hover": { backgroundColor: "#0f172a" },
                          }}
                        >
                          Reset
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              size="small"
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </>
      )}

      {/* Patient Chat Dialog */}
      <PatientChat
        open={!!chatPatient}
        onClose={() => setChatPatient(null)}
        patientName={chatPatient?.patient}
      />
    </Box>
  );
};

export default RecareList;
