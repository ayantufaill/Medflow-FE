import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { usePatient } from "../../hooks/redux";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { documentService } from "../../services/document.service";
import {
  STORAGE_KEY,
  defaultMounts,
  patientKey,
  patientName,
} from "./imagesConstants";

export const useImagesPage = () => {
  const { currentPatient, selectedPatientId } = usePatient();
  const { showSnackbar } = useSnackbar();
  const patientId = patientKey(currentPatient) || selectedPatientId;
  const title = useMemo(() => patientName(currentPatient), [currentPatient]);

  const loadMounts = useCallback(
    (id) => {
      const key = id ? `${STORAGE_KEY}-${id}` : STORAGE_KEY;
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      return saved || (id ? [] : defaultMounts);
    },
    []
  );

  const [mounts, setMounts] = useState(() => loadMounts(patientId));

  useEffect(() => {
    setMounts(loadMounts(patientId));
    setSelectedIds([]);
    setPage(0);
  }, [patientId, loadMounts]);

  const [search, setSearch] = useState("");
  const [layoutFilter, setLayoutFilter] = useState("");
  const [sortByName, setSortByName] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [rowAnchor, setRowAnchor] = useState(null);
  const [activeMount, setActiveMount] = useState(null);

  const [dialog, setDialog] = useState(null);
  const [mountName, setMountName] = useState("");
  const [layout, setLayout] = useState("Grid");
  const [previewFiles, setPreviewFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [destinationPatientId, setDestinationPatientId] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, mountId: null, mountName: "" });
  const [batchDeleteDialog, setBatchDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMount, setEditorMount] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const saveMounts = useCallback(
    (next) => {
      setMounts(next);
      const key = patientId ? `${STORAGE_KEY}-${patientId}` : STORAGE_KEY;
      localStorage.setItem(key, JSON.stringify(next));
    },
    [patientId]
  );

  const filteredMounts = useMemo(() => {
    let list = mounts.filter((m) => {
      const matchSearch =
        !search.trim() ||
        (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.layout || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.content || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.createdAt || "").toLowerCase().includes(search.toLowerCase());
      const matchLayout = !layoutFilter || m.layout === layoutFilter;
      return matchSearch && matchLayout;
    });

    if (sortByName) {
      list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return list;
  }, [mounts, search, layoutFilter, sortByName]);

  const paginatedMounts = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredMounts.slice(start, start + rowsPerPage);
  }, [filteredMounts, page, rowsPerPage]);

  const allSelected = paginatedMounts.length > 0 && paginatedMounts.every((m) => selectedIds.includes(m.id));
  const someSelected = selectedIds.some((id) => paginatedMounts.some((m) => m.id === id)) && !allSelected;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = paginatedMounts.map((m) => m.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = new Set(paginatedMounts.map((m) => m.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleOpenImportDialog = () => {
    setMountName("");
    setLayout("Grid");
    setPreviewFiles([]);
    setPreviewUrls([]);
    setDialog("import");
  };

  const handleContinueImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewFiles(files);
    setPreviewUrls(urls);
    setDialog("preview");
  };

  const handleCancelPreview = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setPreviewFiles([]);
    setDialog("import");
  };

  const handleSavePreview = async () => {
    try {
      setImportLoading(true);
      let uploadedUrls = [];
      if (patientId && previewFiles.length > 0) {
        uploadedUrls = await Promise.all(
          previewFiles.map(async (file, idx) => {
            try {
              const data = new FormData();
              data.append("file", file);
              data.append("patientId", String(patientId));
              data.append("documentType", "imaging");
              data.append("documentName", mountName.trim() || file.name);
              const res = await documentService.uploadDocument(data);
              return (
                res?.data?.document?.storagePath ||
                res?.document?.storagePath ||
                res?.fileUrl ||
                res?.url ||
                previewUrls[idx]
              );
            } catch (uploadErr) {
              console.warn("Upload fallback to local preview for file:", file.name, uploadErr);
              return previewUrls[idx];
            }
          })
        );
      } else {
        uploadedUrls = [...previewUrls];
      }

      const count = previewFiles.length;
      const finalName = mountName.trim() || layout;
      const newMount = {
        id: `import-${Date.now()}`,
        name: finalName,
        createdAt: new Date().toLocaleDateString(),
        content: `${count} X-Ray${count > 1 ? "s" : ""}`,
        layout,
        images: uploadedUrls,
      };

      saveMounts([newMount, ...mounts]);
      setPreviewUrls([]);
      setPreviewFiles([]);
      setMountName("");
      setDialog(null);
      showSnackbar(`Successfully saved "${finalName}" mount with ${count} image(s)`, "success");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save mount";
      showSnackbar(msg, "error");
    } finally {
      setImportLoading(false);
    }
  };

  const handleSaveEditMount = () => {
    if (activeMount) {
      const updated = mounts.map((m) =>
        m.id === activeMount.id ? { ...m, name: mountName.trim() || m.name, layout } : m
      );
      saveMounts(updated);
      setDialog(null);
      showSnackbar("Mount updated successfully", "success");
    }
  };

  const handleTransfer = () => {
    if (!destinationPatientId.trim() || !activeMount) return;
    const destKey = `${STORAGE_KEY}-${destinationPatientId.trim()}`;
    const destMounts = JSON.parse(localStorage.getItem(destKey) || "[]");
    localStorage.setItem(destKey, JSON.stringify([activeMount, ...destMounts]));
    const remaining = mounts.filter((m) => m.id !== activeMount.id);
    saveMounts(remaining);
    setDialog(null);
    setDestinationPatientId("");
    showSnackbar(`Mount transferred to patient ${destinationPatientId}`, "success");
  };

  const handleDeleteMountConfirm = () => {
    if (deleteDialog.mountId) {
      setDeleteLoading(true);
      const next = mounts.filter((m) => m.id !== deleteDialog.mountId);
      saveMounts(next);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteDialog.mountId));
      setDeleteDialog({ open: false, mountId: null, mountName: "" });
      setDeleteLoading(false);
      showSnackbar("Mount deleted successfully", "success");
    }
  };

  const handleBatchDeleteConfirm = () => {
    setDeleteLoading(true);
    const set = new Set(selectedIds);
    const next = mounts.filter((m) => !set.has(m.id));
    saveMounts(next);
    setSelectedIds([]);
    setBatchDeleteDialog(false);
    setDeleteLoading(false);
    showSnackbar("Selected mounts deleted", "success");
  };

  const handleRefresh = () => {
    setMounts(loadMounts(patientId));
    showSnackbar("Mounts refreshed", "info");
  };

  const handleResetFilters = () => {
    setSearch("");
    setLayoutFilter("");
    setSortByName(false);
    setPage(0);
  };

  return {
    patientId,
    title,
    currentPatient,
    mounts,
    saveMounts,
    search,
    setSearch,
    layoutFilter,
    setLayoutFilter,
    sortByName,
    setSortByName,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    selectedIds,
    setSelectedIds,
    filteredMounts,
    paginatedMounts,
    allSelected,
    someSelected,
    handleSelectAll,
    handleSelectOne,
    menuAnchor,
    setMenuAnchor,
    rowAnchor,
    setRowAnchor,
    activeMount,
    setActiveMount,
    dialog,
    setDialog,
    mountName,
    setMountName,
    layout,
    setLayout,
    previewFiles,
    previewUrls,
    destinationPatientId,
    setDestinationPatientId,
    importLoading,
    deleteDialog,
    setDeleteDialog,
    batchDeleteDialog,
    setBatchDeleteDialog,
    deleteLoading,
    editorOpen,
    setEditorOpen,
    editorMount,
    setEditorMount,
    fileInputRef,
    handleOpenImportDialog,
    handleContinueImport,
    handleFilesSelected,
    handleCancelPreview,
    handleSavePreview,
    handleSaveEditMount,
    handleTransfer,
    handleDeleteMountConfirm,
    handleBatchDeleteConfirm,
    handleRefresh,
    handleResetFilters,
  };
};
