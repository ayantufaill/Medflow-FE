import { useState, useMemo, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { usePatient } from "../../hooks/redux";
import { patientKey, patientName } from "../images/imagesConstants";
import { STORAGE_KEY, defaultLabCases, EXPORT_COLUMNS } from "./labCasesConstants";
import { labCaseService } from "../../services/lab-case.service";
import { printLabCasesReport } from "../../utils/printLabCasesReport";

const emptyFormData = (title) => ({
  patient: title,
  date: "",
  procedures: [],
  lab: "",
  trackingNumber: "",
  estReceiveDate: "",
  notes: "",
  shipping: "",
  labFee: "",
  status: "Draft",
});

const BACKEND_STATUS_TO_FE = {
  New: "Draft",
  Draft: "Draft",
  Sent: "Sent",
  Received: "Received",
  "Quality Checked": "Ready",
  Ready: "Ready",
  Returned: "Returned",
  Complete: "Complete",
  Completed: "Complete",
  "In Progress": "Received",
};

const parseInstructions = (instructions) => {
  const lines = String(instructions || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const pick = (label) => {
    const line = lines.find((l) => l.toLowerCase().startsWith(label.toLowerCase()));
    return line ? line.slice(label.length).trim() : "";
  };
  return {
    type: pick("Type:"),
    provider: pick("Provider:"),
    procedures: pick("Procedures:"),
    shipping: pick("Shipping:"),
    tracking: pick("Tracking:"),
    status: pick("Status:"),
    notes: pick("Notes:"),
    raw: String(instructions || ""),
  };
};

const toDisplayDate = (iso) =>
  iso && /^\d{4}-\d{2}-\d{2}/.test(String(iso)) ? dayjs(iso).format("MM/DD/YYYY") : "";

const mapBackendCase = (c) => {
  const parsed = parseInstructions(c.instructions);
  const labFee = Number(c.labFee) || 0;
  const shipping = Number(parsed.shipping) || 0;
  return {
    id: `bc-${c._id}`,
    sourceId: String(c._id),
    isBackend: true,
    date: toDisplayDate(c.createdDate) || toDisplayDate(c.dueDate) || "—",
    type: parsed.type || "Lab",
    procedure: parsed.procedures || parsed.raw.split("\n")[0] || "",
    lab: c.laboratory?.name || "",
    laboratoryId: c.laboratory?.id ? String(c.laboratory.id) : "",
    trackingNumber: parsed.tracking || "",
    estReceiveDate: toDisplayDate(c.dueDate),
    apptDate: toDisplayDate(c.appointmentDate),
    provider: c.provider?.name || parsed.provider || "",
    providerId: c.provider?.id ? String(c.provider.id) : "",
    status: parsed.status || BACKEND_STATUS_TO_FE[c.status] || "Draft",
    notes: parsed.notes || parsed.raw,
    shipping,
    labFee,
    total: labFee + shipping,
  };
};

export const useLabCasesPage = () => {
  const { currentPatient, selectedPatientId } = usePatient();
  const patientId = patientKey(currentPatient) || selectedPatientId;
  const title = useMemo(() => patientName(currentPatient), [currentPatient]);

  const loadCases = useCallback((id) => {
    const key = id ? `${STORAGE_KEY}-${id}` : STORAGE_KEY;
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    return saved || (id ? [] : defaultLabCases);
  }, []);

  const [labCases, setLabCases] = useState(() => loadCases(patientId));
  const [serverCases, setServerCases] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [printError, setPrintError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [rowMenuAnchor, setRowMenuAnchor] = useState(null);
  const [rowMenuCase, setRowMenuCase] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    const loadLabs = async () => {
      try {
        const response = await labCaseService.getAllLaboratories(1, 100);
        const list = response?.data?.laboratories || response?.laboratories || [];
        if (Array.isArray(list)) {
          setLabs(
            list.map((l) => ({
              id: String(l.LaboratoryNum || l._id || l.id),
              name: l.Description || l.name || "Laboratory",
            }))
          );
        }
      } catch (err) {
        console.warn("Could not load labs in useLabCasesPage:", err);
      }
    };
    loadLabs();
  }, []);

  const [prevPatientId, setPrevPatientId] = useState(patientId);
  if (prevPatientId !== patientId) {
    setPrevPatientId(patientId);
    setLabCases(loadCases(patientId));
    setSelectedIds([]);
    setPage(0);
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState(emptyFormData(""));

  // Cases created from the appointment form (or the backend generally) live in the
  // API, not localStorage — fetch and merge them into the list.
  const fetchServerCases = useCallback(async () => {
    try {
      const rawId = patientKey(currentPatient) || selectedPatientId;
      const numericId = [currentPatient?.PatNum, rawId].find((v) =>
        /^\d+$/.test(String(v || "")),
      );
      const result = await labCaseService.getAllLabCases({
        page: 1,
        limit: 200,
        patientId: numericId || undefined,
      });
      let list = result?.data?.labCases || result?.labCases || [];
      if (!numericId) {
        const name = (title || "").trim();
        if (name && name !== "Selected Patient") {
          list = list.filter((c) => (c.patient?.name || "").trim() === name);
        }
      }
      setServerCases(list.map(mapBackendCase));
    } catch (err) {
      console.warn("Failed to load lab cases from server:", err);
      setServerCases([]);
    }
  }, [currentPatient, selectedPatientId, title]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServerCases();
  }, [fetchServerCases]);

  const allCases = useMemo(
    () => [...serverCases, ...labCases],
    [serverCases, labCases],
  );

  const filteredCases = useMemo(() => {
    return allCases.filter((c) => {
      const matchSearch =
        !search.trim() ||
        [c.date, c.type, c.procedure, c.lab, c.estReceiveDate, c.apptDate, c.provider, c.status, c.notes, String(c.total ?? "")]
          .some((v) => (v || "").toLowerCase().includes(search.toLowerCase()));
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [allCases, search, statusFilter]);

  const paginatedCases = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredCases.slice(start, start + rowsPerPage);
  }, [filteredCases, page, rowsPerPage]);

  const allSelected = paginatedCases.length > 0 && paginatedCases.every((c) => selectedIds.includes(c.id));
  const someSelected = selectedIds.some((id) => paginatedCases.some((c) => c.id === id)) && !allSelected;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = paginatedCases.map((c) => c.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = new Set(paginatedCases.map((c) => c.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleRefresh = () => {
    setLabCases(loadCases(patientId));
    fetchServerCases();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPage(0);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = String(iso).split("-");
    return `${m}/${d}/${y}`;
  };

  const toIso = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const [m, d, y] = value.split("/");
    return y && m && d ? `${y}-${m}-${d}` : "";
  };

  const persistCases = (next) => {
    const key = patientId ? `${STORAGE_KEY}-${patientId}` : STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(next));
  };

  const closeRowMenu = () => {
    setRowMenuAnchor(null);
    setRowMenuCase(null);
  };

  const handleEditRow = () => {
    const c = rowMenuCase;
    closeRowMenu();
    if (!c) return;
    setFormData({
      patient: title,
      date: toIso(c.date),
      procedures: (c.procedure || "")
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      lab: c.lab || "",
      laboratoryId: c.laboratoryId || "",
      type: c.type || "",
      provider: c.provider || "",
      providerId: c.providerId || "",
      trackingNumber: c.trackingNumber || "",
      estReceiveDate: toIso(c.estReceiveDate),
      notes: c.notes || "",
      shipping: c.shipping ? String(c.shipping) : "",
      labFee: c.labFee != null ? String(c.labFee) : "",
      status: c.status || "Draft",
    });
    setEditingId(c.id);
    setEditingRow(c);
    setDialogOpen(true);
  };

  const handleDuplicateRow = () => {
    const c = rowMenuCase;
    closeRowMenu();
    if (!c) return;
    const copy = { ...c, id: `lab-${Date.now()}` };
    delete copy.isBackend;
    delete copy.sourceId;
    const next = [copy, ...labCases];
    setLabCases(next);
    persistCases(next);
  };

  const handleDeleteRow = async () => {
    const c = rowMenuCase;
    closeRowMenu();
    if (!c) return;
    if (c.isBackend && c.sourceId) {
      try {
        await labCaseService.deleteLabCase(c.sourceId);
      } catch (err) {
        console.warn("Failed to delete lab case from server:", err);
      }
      fetchServerCases();
      setSelectedIds((prev) => prev.filter((item) => item !== c.id));
      return;
    }
    const next = labCases.filter((item) => item.id !== c.id);
    setLabCases(next);
    persistCases(next);
    setSelectedIds((prev) => prev.filter((item) => item !== c.id));
  };

  const handleOpenNewDialog = () => {
    setFormData(emptyFormData(title));
    setEditingId(null);
    setEditingRow(null);
    setDialogOpen(true);
  };

  const handleSaveNewCase = async () => {
    const procedures = (formData.procedures || []).map((p) => p.trim()).filter(Boolean);

    if (editingRow?.isBackend && editingRow.sourceId) {
      const typeVal = (formData.type || editingRow.type || "Lab").trim();
      const provVal = (formData.provider || editingRow.provider || "").trim();
      const trackingVal = (formData.trackingNumber || "").trim();
      const statusVal = formData.status || editingRow.status || "Draft";
      const notesVal = (formData.notes || "").trim();

      const instructions = [
        `Type: ${typeVal}`,
        provVal ? `Provider: ${provVal}` : "",
        `Procedures: ${procedures.join(", ")}`,
        formData.shipping !== "" && formData.shipping != null
          ? `Shipping: ${parseFloat(formData.shipping) || 0}`
          : "",
        trackingVal ? `Tracking: ${trackingVal}` : "",
        `Status: ${statusVal}`,
        notesVal ? `Notes: ${notesVal}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const matchedLab = labs.find(
        (l) => l.name?.toLowerCase() === formData.lab?.trim()?.toLowerCase() || l.id === formData.lab
      );
      const laboratoryId = matchedLab?.id || formData.laboratoryId || editingRow.laboratoryId || undefined;

      try {
        await labCaseService.updateLabCase(editingRow.sourceId, {
          laboratoryId,
          instructions,
          labFee: parseFloat(formData.labFee) || 0,
          dueDate: formData.estReceiveDate || undefined,
          createdDate: formData.date || undefined,
          status: statusVal,
        });
        await fetchServerCases();
      } catch (err) {
        console.warn("Failed to update lab case on server:", err);
      }
      setEditingId(null);
      setEditingRow(null);
      setDialogOpen(false);
      return;
    }

    const newCase = {
      id: `lab-${Date.now()}`,
      date: formatDate(formData.date) || new Date().toLocaleDateString(),
      procedure: procedures.join(", "),
      lab: formData.lab.trim(),
      trackingNumber: formData.trackingNumber.trim(),
      estReceiveDate: formatDate(formData.estReceiveDate),
      notes: (formData.notes || "").trim(),
      shipping: parseFloat(formData.shipping) || 0,
      labFee: parseFloat(formData.labFee) || 0,
      total: (parseFloat(formData.shipping) || 0) + (parseFloat(formData.labFee) || 0),
      status: formData.status,
    };
    const next = editingId
      ? labCases.map((c) => (c.id === editingId ? { ...c, ...newCase, id: editingId } : c))
      : [newCase, ...labCases];
    setLabCases(next);
    persistCases(next);
    setEditingId(null);
    setEditingRow(null);
    setDialogOpen(false);
  };

  const handleExportCsv = () => {
    const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = EXPORT_COLUMNS.map(([label]) => csvCell(label)).join(",");
    const rows = filteredCases.map((c) =>
      EXPORT_COLUMNS.map(([, getter]) => csvCell(getter(c))).join(","),
    );
    const csv = [header, ...rows].join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lab-cases-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintList = () => {
    setPrintError("");
    printLabCasesReport({ cases: filteredCases, patientName: title, search, statusFilter })
      .catch((error) => setPrintError(error.message));
  };

  return {
    patientId,
    title,
    labCases: allCases,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    printError,
    setPrintError,
    selectedIds,
    menuAnchor,
    setMenuAnchor,
    rowMenuAnchor,
    setRowMenuAnchor,
    rowMenuCase,
    setRowMenuCase,
    editingId,
    setEditingId,
    dialogOpen,
    setDialogOpen,
    formData,
    setFormData,
    filteredCases,
    paginatedCases,
    allSelected,
    someSelected,
    handleSelectAll,
    handleSelectOne,
    handleRefresh,
    handleResetFilters,
    closeRowMenu,
    handleEditRow,
    handleDuplicateRow,
    handleDeleteRow,
    handleOpenNewDialog,
    handleSaveNewCase,
    handleExportCsv,
    handlePrintList,
  };
};
