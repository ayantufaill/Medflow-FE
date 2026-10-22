import { Box, Alert, Typography } from "@mui/material";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";
import { useLabCasesPage } from "../../components/labcases/useLabCasesPage";
import LabCasesFiltersBar from "../../components/labcases/LabCasesFiltersBar";
import LabCasesTable from "../../components/labcases/LabCasesTable";
import LabCasesDialogsContainer from "../../components/labcases/LabCasesDialogsContainer";

const LabCasesPage = () => {
  const {
    patientId,
    title,
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
    setRowMenuCase,
    editingId,
    dialogOpen,
    setDialogOpen,
    setEditingId,
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
  } = useLabCasesPage();

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
          Lab Cases
        </Box>
      </Typography>

      {!patientId && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: radius.md }}>
          No patient selected. Showing demo lab cases.
        </Alert>
      )}

      {printError && (
        <Alert severity="error" onClose={() => setPrintError("")} sx={{ mb: 2, borderRadius: radius.md }}>
          {printError}
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
        <LabCasesFiltersBar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(0);
          }}
          onClearSearch={() => setSearch("")}
          onOpenNewDialog={handleOpenNewDialog}
          onOpenHeaderMenu={(e) => setMenuAnchor(e.currentTarget)}
          statusFilter={statusFilter}
          onStatusFilterChange={(v) => {
            setStatusFilter(v);
            setPage(0);
          }}
          onRefresh={handleRefresh}
          onResetFilters={handleResetFilters}
        />

        <LabCasesTable
          paginatedCases={paginatedCases}
          filteredCount={filteredCases.length}
          selectedIds={selectedIds}
          allSelected={allSelected}
          someSelected={someSelected}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onOpenRowMenu={(e, labCase) => {
            setRowMenuCase(labCase);
            setRowMenuAnchor(e.currentTarget);
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          search={search}
          statusFilter={statusFilter}
        />
      </Box>

      <LabCasesDialogsContainer
        menuAnchor={menuAnchor}
        onCloseMenu={() => setMenuAnchor(null)}
        onPrintList={handlePrintList}
        onExportCsv={handleExportCsv}
        rowMenuAnchor={rowMenuAnchor}
        onCloseRowMenu={closeRowMenu}
        onEditRow={handleEditRow}
        onDuplicateRow={handleDuplicateRow}
        onDeleteRow={handleDeleteRow}
        dialogOpen={dialogOpen}
        onCloseDialog={() => {
          setDialogOpen(false);
          setEditingId(null);
        }}
        title={title}
        editingId={editingId}
        formData={formData}
        onFormChange={setFormData}
        onSubmitCase={handleSaveNewCase}
      />
    </Box>
  );
};

export default LabCasesPage;
