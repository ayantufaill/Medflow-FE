import { TextField } from '@mui/material';

// Inline editor for the Name column — split into two fields because the
// backend stores firstName/lastName separately (see PatientsListPage's
// handleNameSave, which PATCHes both at once instead of the generic
// single-field handleInlineSave).
const PatientNameEditor = ({ nameDraft, onNameDraftChange, fieldSx, inputPropsSx }) => (
  <>
    <TextField
      size="small" placeholder="First Name" autoFocus
      value={nameDraft.firstName || ''}
      // code updates a specific property (firstName) inside an object stored in the application state
      onChange={(e) => onNameDraftChange({ ...nameDraft, firstName: e.target.value })}
      onClick={(e) => e.stopPropagation()}
      sx={{ flex: 1, ...fieldSx }}
      inputProps={inputPropsSx}
    />
    <TextField
      size="small" placeholder="Last Name"
      value={nameDraft.lastName || ''}
      onChange={(e) => onNameDraftChange({ ...nameDraft, lastName: e.target.value })}
      onClick={(e) => e.stopPropagation()}
      sx={{ flex: 1, ...fieldSx }}
      inputProps={inputPropsSx}
    />
  </>
);

export default PatientNameEditor;
