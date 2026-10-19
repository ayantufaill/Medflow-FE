import { Box, Alert, Typography } from "@mui/material";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";
import { useImagesPage } from "../../components/images/useImagesPage";
import ImagesFiltersBar from "../../components/images/ImagesFiltersBar";
import ImagesTable from "../../components/images/ImagesTable";
import ImagesDialogsContainer from "../../components/images/ImagesDialogsContainer";

const ImagesPage = () => {
  const {
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
  } = useImagesPage();

  return (
    <Box sx={{ backgroundColor: COLORS.SURFACE_PAGE, p: "16px", minHeight: "100%" }}>
      {/* Route Path Breadcrumb */}
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: fontSize.base,
          color: COLORS.TEXT_MUTED,
          mb: "12px",
        }}
      >
        Patients / {title} /{" "}
        <Box component="span" sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.bold }}>
          Imaging
        </Box>
      </Typography>

      {!patientId && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: radius.md }}>
          No patient selected. Showing demo preview mounts.
        </Alert>
      )}

      <Box
        sx={{
          backgroundColor: COLORS.SURFACE_CARD,
          borderRadius: radius.lg,
          border: `1px solid ${COLORS.BORDER}`,
          p: "16px",
        }}
      >
        <ImagesFiltersBar
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(0); }}
          onClearSearch={() => setSearch("")}
          onOpenNewMountMenu={(e) => setMenuAnchor(e.currentTarget)}
          onOpenImportDialog={handleOpenImportDialog}
          onOpenSettings={() => setDialog("settings")}
          selectedCount={selectedIds.length}
          onOpenBatchDelete={() => setBatchDeleteDialog(true)}
          layoutFilter={layoutFilter}
          onLayoutFilterChange={(v) => { setLayoutFilter(v); setPage(0); }}
          sortByName={sortByName}
          onSortByNameChange={setSortByName}
          onRefresh={handleRefresh}
          onResetFilters={handleResetFilters}
        />

        <ImagesTable
          paginatedMounts={paginatedMounts}
          filteredMounts={filteredMounts}
          selectedIds={selectedIds}
          allSelected={allSelected}
          someSelected={someSelected}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onOpenEditor={(mount) => {
            setEditorMount(mount);
            setEditorOpen(true);
          }}
          onOpenRowMenu={(e, mount) => {
            setActiveMount(mount);
            setRowAnchor(e.currentTarget);
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          search={search}
          layoutFilter={layoutFilter}
        />
      </Box>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFilesSelected}
      />

      <ImagesDialogsContainer
        menuAnchor={menuAnchor}
        onCloseMenu={() => setMenuAnchor(null)}
        onOpenSettings={() => setDialog("settings")}
        onOpenImportDialog={handleOpenImportDialog}
        rowAnchor={rowAnchor}
        onCloseRowAnchor={() => setRowAnchor(null)}
        activeMount={activeMount}
        onOpenEditDialog={(mount) => {
          setMountName(mount?.name || "");
          setLayout(mount?.layout || "Grid");
          setDialog("edit");
        }}
        onOpenTransferDialog={() => {
          setDestinationPatientId("");
          setDialog("transfer");
        }}
        onOpenDeleteDialog={(mount) => {
          setDeleteDialog({
            open: true,
            mountId: mount?.id,
            mountName: mount?.name || "Mount",
          });
        }}
        dialog={dialog}
        onCloseDialog={() => !importLoading && setDialog(null)}
        title={title}
        mountName={mountName}
        onMountNameChange={setMountName}
        layout={layout}
        onLayoutChange={setLayout}
        onContinueImport={handleContinueImport}
        previewFiles={previewFiles}
        previewUrls={previewUrls}
        importLoading={importLoading}
        onCancelPreview={handleCancelPreview}
        onSavePreview={handleSavePreview}
        onSaveEditMount={handleSaveEditMount}
        destinationPatientId={destinationPatientId}
        onDestinationPatientIdChange={setDestinationPatientId}
        onTransferMount={handleTransfer}
        deleteDialog={deleteDialog}
        onCloseDeleteDialog={() => setDeleteDialog({ open: false, mountId: null, mountName: "" })}
        onConfirmDeleteMount={handleDeleteMountConfirm}
        batchDeleteDialog={batchDeleteDialog}
        onCloseBatchDeleteDialog={() => setBatchDeleteDialog(false)}
        onConfirmBatchDelete={handleBatchDeleteConfirm}
        deleteLoading={deleteLoading}
        selectedCount={selectedIds.length}
        editorOpen={editorOpen}
        onCloseEditor={() => setEditorOpen(false)}
        editorMount={editorMount}
        currentPatient={currentPatient}
        mounts={mounts}
        onSelectEditorMount={(m) => setEditorMount(m)}
        onSaveEditorMount={(updatedMount) => {
          const next = mounts.map((m) => (m.id === updatedMount.id ? updatedMount : m));
          saveMounts(next);
        }}
      />
    </Box>
  );
};

export default ImagesPage;
