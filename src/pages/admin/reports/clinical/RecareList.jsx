import React, { useState, useEffect, useMemo } from "react";
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
  selectClinicalReportError,
} from "../../../../store/slices/clinicalReportSlice";
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
} from "../../../../store/slices/providerSlice";
import { setSelectedPatientId } from "../../../../store/slices/patientSlice";
import { selectPracticeInfo } from "../../../../store/slices/practiceInfoSlice";
import { resolveFlagColor } from "../../../../components/patient-flags/constants";
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

const RecareList = ({
  setSubtitle,
  hideFilters = false,
  forcedCategory = null,
  forcedMonth = null,
  getRowCategory = null,
}) => {
  const branchId = useSelector(state => state.branch?.currentBranchId);
  const dispatch = useDispatch();
  const apiData = useSelector(selectRecareData);
  const loading = useSelector(selectClinicalReportLoading);
  const error = useSelector(selectClinicalReportError);
  const allProviders = useSelector(selectProviderDropdownList);
  const practiceInfo = useSelector(selectPracticeInfo);
  const globalFlags = practiceInfo?.patientFlags || [];

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

  // Paginate (0-indexed for TablePagination)
  const pagedRows = filteredRows.slice(
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
              <tr><th>Note</th><td>${patientRow.note || "—"}</td></tr>
              <tr><th>Contact Again</th><td>${displayDate(patientRow.contactAgain)}</td></tr>
              <tr><th>Follow Up</th><td>${displayDate(patientRow.followUp)}</td></tr>
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

  const handlePrint = () => {
    if (filteredRows.length === 0) return;

    const rowsHtml = filteredRows
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
            <td>${row.note || "—"}</td>
            <td>${displayDate(row.contactAgain)}</td>
            <td>${displayDate(row.followUp)}</td>
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
            <h2>Recare List Report</h2>
            <div class="subtitle">
              (number of patients = ${filteredRows.length})${startDate || endDate ? ` &bull; Due: ${startDate || 'Any'} - ${endDate || 'Any'}` : ''}
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
                          <ActionIcons
                            row={row}
                            onPrint={handlePrintPatient}
                            onChatClick={() => setChatPatient(row)}
                          />
                        </Box>
                      </TableCell>
                      {showFlagsCol && (
                        <TableCell sx={{ verticalAlign: "middle" }}>
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
                              <Box sx={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
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
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {row.age}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", color: "#4a90e2", verticalAlign: "middle" }}>
                        {row.contact}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {displayDate(row.recallDate)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {displayDate(row.lastExam)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {displayDate(row.lastProphy)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", verticalAlign: "middle" }}>
                        {displayDate(row.lastMaintenance)}
                      </TableCell>

                      {['lastComm', 'note', 'contactAgain', 'followUp'].map(field => (
                        <TableCell key={field} sx={{ fontSize: '0.85rem', verticalAlign: 'middle' }}>
                          <Tooltip title={field === 'contactAgain' ? 'Saved contact-again date. A dash means none is recorded.' : ''}>
                            <span>{field === 'note' ? row[field] || '\u2014' : displayDate(row[field])}</span>
                          </Tooltip>
                        </TableCell>
                      ))}

                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          verticalAlign: "middle",
                        }}
                      >
                        {displayDate(row.apptDate)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          verticalAlign: "middle",
                        }}
                      >
                        <Tooltip title="Number of recorded patient communications">
                          <span>{row.contactCount === '' ? '\u2014' : row.contactCount}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell><Tooltip title="Contact history is read-only in this report"><span>{'\u2014'}</span></Tooltip></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredRows.length}
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
    </Box>
  );
};

export default RecareList;
