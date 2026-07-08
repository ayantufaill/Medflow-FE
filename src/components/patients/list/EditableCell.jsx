import { Box, TableCell, IconButton } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

// Wraps a table cell that supports double-click-to-edit. `editor` is the
// field-specific input(s) rendered in edit mode; `children` is the plain
// display value. Centralizes the Save/Cancel buttons and stopPropagation
// scaffolding shared by every editable column in PatientRow.
const EditableCell = ({ isEditing, onDoubleClick, editor, saveLoading, onSave, onCancel, children }) => (
  <TableCell className="editable-cell" onDoubleClick={onDoubleClick}>
    {isEditing ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {editor}
        <IconButton size="small" onClick={onSave} disabled={saveLoading}>
          <SaveIcon fontSize="small" color="success" />
        </IconButton>
        <IconButton size="small" onClick={onCancel}>
          <CancelIcon fontSize="small" color="error" />
        </IconButton>
      </Box>
    ) : (
      children
    )}
  </TableCell>
);

export default EditableCell;
