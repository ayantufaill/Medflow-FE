import ConfirmationDialog from "../shared/ConfirmationDialog";
import ImagingMountEditorDialog from "../clinical/ImagingMountEditorDialog";
import { NewMountMenu, MountRowActionMenu } from "./MountActionMenu";
import NewMountLayoutDialog from "./NewMountLayoutDialog";
import MountPreviewDialog from "./MountPreviewDialog";
import {
  EditMountDialog,
  TransferMountDialog,
  ImagingSettingsDialog,
} from "./MountModalDialogs";

const ImagesDialogsContainer = ({
  menuAnchor,
  onCloseMenu,
  onOpenSettings,
  onOpenImportDialog,
  rowAnchor,
  onCloseRowAnchor,
  activeMount,
  onOpenEditDialog,
  onOpenTransferDialog,
  onOpenDeleteDialog,
  dialog,
  onCloseDialog,
  title,
  mountName,
  onMountNameChange,
  layout,
  onLayoutChange,
  onContinueImport,
  previewFiles,
  previewUrls,
  importLoading,
  onCancelPreview,
  onSavePreview,
  onSaveEditMount,
  destinationPatientId,
  onDestinationPatientIdChange,
  onTransferMount,
  deleteDialog,
  onCloseDeleteDialog,
  onConfirmDeleteMount,
  batchDeleteDialog,
  onCloseBatchDeleteDialog,
  onConfirmBatchDelete,
  deleteLoading,
  selectedCount,
  editorOpen,
  onCloseEditor,
  editorMount,
  currentPatient,
  mounts,
  onSelectEditorMount,
  onSaveEditorMount,
}) => (
  <>
    <NewMountMenu
      anchorEl={menuAnchor}
      onClose={onCloseMenu}
      onOpenSettings={onOpenSettings}
      onOpenImport={onOpenImportDialog}
    />

    <MountRowActionMenu
      anchorEl={rowAnchor}
      onClose={onCloseRowAnchor}
      activeMount={activeMount}
      onOpenEdit={onOpenEditDialog}
      onOpenTransfer={onOpenTransferDialog}
      onOpenDelete={onOpenDeleteDialog}
    />

    <NewMountLayoutDialog
      open={dialog === "import"}
      onClose={onCloseDialog}
      title={title}
      mountName={mountName}
      onMountNameChange={onMountNameChange}
      layout={layout}
      onLayoutChange={onLayoutChange}
      onContinue={onContinueImport}
      onCancel={onCloseDialog}
      importLoading={importLoading}
    />

    <MountPreviewDialog
      open={dialog === "preview"}
      onClose={onCloseDialog}
      title={title}
      mountName={mountName}
      layout={layout}
      previewFiles={previewFiles}
      previewUrls={previewUrls}
      importLoading={importLoading}
      onCancel={onCancelPreview}
      onSave={onSavePreview}
    />

    <EditMountDialog
      open={dialog === "edit"}
      onClose={onCloseDialog}
      activeMount={activeMount}
      mountName={mountName}
      onMountNameChange={onMountNameChange}
      onSave={onSaveEditMount}
    />

    <TransferMountDialog
      open={dialog === "transfer"}
      onClose={onCloseDialog}
      activeMount={activeMount}
      destinationPatientId={destinationPatientId}
      onDestinationPatientIdChange={onDestinationPatientIdChange}
      onTransfer={onTransferMount}
    />

    <ImagingSettingsDialog
      open={dialog === "settings"}
      onClose={onCloseDialog}
    />

    <ConfirmationDialog
      open={deleteDialog.open}
      onClose={onCloseDeleteDialog}
      onConfirm={onConfirmDeleteMount}
      title="Delete Imaging Mount"
      message={`Are you sure you want to delete "${deleteDialog.mountName}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
      loading={deleteLoading}
    />

    <ConfirmationDialog
      open={batchDeleteDialog}
      onClose={onCloseBatchDeleteDialog}
      onConfirm={onConfirmBatchDelete}
      title="Delete Selected Mounts"
      message={`Are you sure you want to delete ${selectedCount} selected mount(s)? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
      loading={deleteLoading}
    />

    <ImagingMountEditorDialog
      open={editorOpen}
      onClose={onCloseEditor}
      mount={editorMount}
      patient={currentPatient}
      allMounts={mounts}
      onSelectMount={onSelectEditorMount}
      onSave={onSaveEditorMount}
    />
  </>
);

export default ImagesDialogsContainer;
