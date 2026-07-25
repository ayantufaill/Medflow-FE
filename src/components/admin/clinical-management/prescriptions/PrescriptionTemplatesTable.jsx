import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { ImportExport as SortIcon } from '@mui/icons-material';
import PrescriptionTemplateRow from './PrescriptionTemplateRow';

const PrescriptionTemplatesTable = ({
  prescriptions,
  editingIndex,
  editDraft,
  setEditDraft,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete,
  handleRefreshRow,
  handleOpenSyncDialog
}) => {
  return (
    <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 3, backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8fafc' }}>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569', py: 2, borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Name <SortIcon sx={{ fontSize: '0.9rem', verticalAlign: 'middle', ml: 0.5, color: '#94a3b8' }} />
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569', py: 2, borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Medication
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569', py: 2, borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Dose
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569', py: 2, borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Duration
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569', py: 2, borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Long Term
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569', py: 2, borderBottom: '1px solid #e2e8f0', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Refills
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569', py: 2, borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Provider
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569', py: 2, borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prescriptions.map((row, index) => (
            <PrescriptionTemplateRow
              key={row.id || index}
              row={row}
              index={index}
              isEditing={editingIndex === index}
              editDraft={editDraft}
              setEditDraft={setEditDraft}
              handleStartEdit={handleStartEdit}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              handleDelete={handleDelete}
              handleRefreshRow={handleRefreshRow}
              handleOpenSyncDialog={handleOpenSyncDialog}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PrescriptionTemplatesTable;
