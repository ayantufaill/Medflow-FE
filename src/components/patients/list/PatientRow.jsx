import { memo } from 'react';
import { Box, Checkbox, IconButton, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import InitialsAvatar from '../../shared/InitialsAvatar';
import EditableCell from './EditableCell';
import StatusPill from './StatusPill';
import PatientNameEditor from './PatientNameEditor';
import PatientPhoneEditor from './PatientPhoneEditor';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';
import { getPatientInitials, formatDate, computeAge } from './patientListUtils';

// Shared sx for every inline <TextField> editor in this row, so the edit-mode
// inputs stay visually consistent with each other regardless of which
// column is being edited.
const editorFieldSx = { fontSize: '0.78rem' };
const editorInputPropsSx = { sx: { py: 0.5, fontSize: '0.78rem' } };

// Today's date in YYYY-MM-DD, used to cap the date-of-birth picker so a
// patient can't be edited to have a birth date in the future.
const todayIsoDate = () => new Date().toISOString().split('T')[0];

// One row of the patients table. Most columns are read-only, but Name,
// Date of Birth, Email, Phone, and Gender support double-click-to-edit via
// EditableCell (double-click swaps the display value for an inline input +
// Save/Cancel). `editingField`/`editValue` live in the parent page so a
// double-click on one row's cell can only ever put that one cell into edit
// mode at a time.
// Wrapped in React.memo because a patients table page can render dozens of
// rows at once — the parent only gives the live editValue/editingField to
// the one row actually being edited (everything else gets stable `null`/''),
// so memo lets typing in one cell skip re-rendering every other row.
const PatientRow = memo(function PatientRow({
  patient,
  isSelected,
  editingField,
  editValue,
  setEditValue,
  saveLoading,
  onSelectOne,
  onRowClick,
  onDoubleClick,
  onInlineSave,
  onNameSave,
  onInlineCancel,
  onActionMenuOpen,
}) {
  const patientId = patient._id || patient.id;

  // True when this row's given column is the one currently being edited —
  // editingField is shared across the whole table, so both the patient AND
  // the field name have to match.
  const isEditingField = (field) => editingField?.patientId === patientId && editingField?.field === field;

  return (
    <TableRow
      hover
      selected={isSelected}
      sx={{
        cursor: 'pointer',
        bgcolor: patient.isActive === false ? COLORS.SURFACE_INPUT : 'inherit',
        '& .MuiTableCell-body': {
          py: '6px',
          fontFamily: 'Inter',
          fontSize: fontSize.md,
          color: patient.isActive === false ? COLORS.TEXT_MUTED : COLORS.TEXT_BODY,
          borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
        },
        '& .editable-cell:hover': { bgcolor: 'action.hover' },
      }}
      onClick={(e) => {
        // A click that lands inside an editable cell (e.g. entering edit mode,
        // or clicking the input itself) should not also open the patient's
        // detail page — only navigate on clicks elsewhere in the row.
        if (e.target.closest('.editable-cell')) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        onRowClick(patientId, patient);
      }}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox size="small" checked={isSelected} onChange={() => onSelectOne(patientId)} />
      </TableCell>

      <TableCell>{patient.patientCode || '-'}</TableCell>

      <EditableCell
        isEditing={isEditingField('name')}
        onDoubleClick={(e) => onDoubleClick(e, patient, 'name', { firstName: patient.firstName, lastName: patient.lastName })}
        saveLoading={saveLoading}
        onSave={onNameSave}
        onCancel={onInlineCancel}
        editor={
          <PatientNameEditor
            nameDraft={editValue}
            onNameDraftChange={setEditValue}
            fieldSx={editorFieldSx}
            inputPropsSx={editorInputPropsSx}
          />
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <InitialsAvatar
            initials={getPatientInitials(patient.firstName, patient.lastName)}
            size={26}
            fontSize={11}
            bg={COLORS.ACCENT}
          />
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
            {patient.firstName} {patient.lastName}
          </Typography>
        </Box>
      </EditableCell>

      <TableCell>{computeAge(patient.dateOfBirth)}</TableCell>

      <EditableCell
        isEditing={isEditingField('dateOfBirth')}
        onDoubleClick={(e) => onDoubleClick(e, patient, 'dateOfBirth', patient.dateOfBirth)}
        saveLoading={saveLoading}
        onSave={onInlineSave}
        onCancel={onInlineCancel}
        editor={
          <TextField
            size="small" type="date" autoFocus fullWidth
            value={(() => {
              if (!editValue) return '';
              const d = new Date(editValue);
              return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
            })()}
            onChange={(e) => setEditValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            inputProps={{ max: todayIsoDate(), ...editorInputPropsSx }}
            sx={editorFieldSx}
          />
        }
      >
        {formatDate(patient.dateOfBirth)}
      </EditableCell>

      <EditableCell
        isEditing={isEditingField('email')}
        onDoubleClick={(e) => onDoubleClick(e, patient, 'email', patient.email)}
        saveLoading={saveLoading}
        onSave={onInlineSave}
        onCancel={onInlineCancel}
        editor={
          <TextField
            size="small" type="email" autoFocus fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            sx={editorFieldSx}
            inputProps={editorInputPropsSx}
          />
        }
      >
        {patient.email || '-'}
      </EditableCell>

      <EditableCell
        isEditing={isEditingField('phonePrimary')}
        onDoubleClick={(e) => onDoubleClick(e, patient, 'phonePrimary', patient.phonePrimary)}
        saveLoading={saveLoading}
        onSave={onInlineSave}
        onCancel={onInlineCancel}
        editor={
          <PatientPhoneEditor
            phoneDraft={editValue}
            onPhoneDraftChange={setEditValue}
            fieldSx={editorFieldSx}
            inputPropsSx={editorInputPropsSx}
          />
        }
      >
        {patient.phonePrimary || '-'}
      </EditableCell>

      <EditableCell
        isEditing={isEditingField('gender')}
        onDoubleClick={(e) => onDoubleClick(e, patient, 'gender', patient.gender)}
        saveLoading={saveLoading}
        onSave={onInlineSave}
        onCancel={onInlineCancel}
        editor={
          <TextField
            size="small" select autoFocus fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            SelectProps={{ native: true }}
            sx={editorFieldSx}
            inputProps={editorInputPropsSx}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </TextField>
        }
      >
        {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : patient.gender || '-'}
      </EditableCell>

      <TableCell>
        <StatusPill active={patient.isActive !== false} />
      </TableCell>

      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        <IconButton
          size="small"
          sx={{ p: 0.25 }}
          onClick={(e) => onActionMenuOpen(e, patientId, `${patient.firstName} ${patient.lastName}`, patient.isActive)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

export default PatientRow;
