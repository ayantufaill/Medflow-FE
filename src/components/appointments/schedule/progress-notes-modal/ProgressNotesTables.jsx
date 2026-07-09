import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import dayjs from 'dayjs';

const tableHeadSx = { 
  bgcolor: "#f8fafc", 
  "& th": { 
    fontSize: "0.75rem", 
    fontWeight: 600, 
    color: "#475569", 
    py: 1.5, 
    borderBottom: "1px solid #e2e8f0" 
  } 
};
const cellSx = { py: 1.25, fontSize: "0.8rem", color: "#334155", borderBottom: "1px solid #f1f5f9" };

const ProgressNotesTables = ({
  missingNotes,
  unsignedNotes,
  signedNotes,
  expandedNoteIds,
  toggleNoteExpansion,
  editingNoteId,
  editingContent,
  setEditingContent,
  handleEditStart,
  handleEditCancel,
  handleEditSave,
  handleSignNote,
  getProviderName
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      
      {/* 1. COMPLETED PROCEDURES WITH MISSING NOTES */}
      <Box>
        <Typography sx={{ fontWeight: 600, color: '#3b82f6', fontSize: '0.9rem', mb: 1 }}>
          Completed Procedures with Missing Progress Notes
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
          <Table size="small">
            <TableHead sx={tableHeadSx}>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>DOS</TableCell>
                <TableCell>Tooth #</TableCell>
                <TableCell>Surface</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Provider</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {missingNotes.length > 0 ? missingNotes.map((a, i) => (
                <TableRow key={a._id || i}>
                  <TableCell sx={{ ...cellSx, color: "#3b82f6", fontWeight: 500 }}>{a.patientName || `${a.patientId?.firstName || ''} ${a.patientId?.lastName || ''}`}</TableCell>
                  <TableCell sx={cellSx}>{dayjs(a.appointmentDate).format("MM/DD/YYYY")}</TableCell>
                  <TableCell sx={cellSx}>{a.toothNumber || "—"}</TableCell>
                  <TableCell sx={cellSx}>{a.surface || "—"}</TableCell>
                  <TableCell sx={cellSx}>{a.appointmentTypeId?.code || "—"}</TableCell>
                  <TableCell sx={cellSx}>{a.providerName || getProviderName(a.providerId)}</TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3, color: "#94a3b8", fontStyle: 'italic', fontSize: '0.85rem' }}>No missing progress notes</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 2. UNSIGNED NOTES */}
      <Box>
        <Typography sx={{ fontWeight: 600, color: '#3b82f6', fontSize: '0.9rem', mb: 1 }}>
          Unsigned Progress Notes
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
          <Table size="small">
            <TableHead sx={tableHeadSx}>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Kind</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unsignedNotes.length > 0 ? unsignedNotes.map((n, i) => {
                const isExpanded = expandedNoteIds.has(n._id || n.id);
                return (
                  <React.Fragment key={n._id || n.id || i}>
                    <TableRow onClick={() => toggleNoteExpansion(n._id || n.id)} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell sx={{ ...cellSx, color: "#3b82f6", fontWeight: 500, cursor: "pointer" }}>{n.patientId?.firstName} {n.patientId?.lastName}</TableCell>
                      <TableCell sx={cellSx}>{dayjs(n.createdAt).format("MM/DD/YYYY")}</TableCell>
                      <TableCell sx={cellSx}>{n.noteType || "Treatment"}</TableCell>
                      <TableCell sx={cellSx}>{getProviderName(n.providerId)}</TableCell>
                      <TableCell align="right" sx={cellSx}>
                        <Box sx={{ display: "flex", alignItems: "center", color: "#64748b", cursor: "pointer", justifyContent: "flex-end" }}>
                          <Typography sx={{ fontSize: "0.75rem", mr: 0.5 }}>View Note</Typography>
                          {isExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                        </Box>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        <TableCell colSpan={5} sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {editingNoteId === (n._id || n.id) ? (
                                <>
                                  <Button variant="contained" size="small" onClick={handleEditSave} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" }, textTransform: "none", fontSize: "0.75rem", height: 28, px: 2, boxShadow: 'none' }}>Save</Button>
                                  <Button variant="outlined" size="small" onClick={handleEditCancel} sx={{ color: "#64748b", borderColor: "#cbd5e1", textTransform: "none", fontSize: "0.75rem", height: 28, px: 2 }}>Cancel</Button>
                                </>
                              ) : (
                                <Button variant="outlined" size="small" onClick={() => handleEditStart(n)} sx={{ color: '#3b82f6', borderColor: '#3b82f6', textTransform: "none", fontSize: "0.75rem", height: 28, px: 2 }}>Edit Note</Button>
                              )}
                            </Box>
                            <Typography 
                              onClick={() => handleSignNote(n._id || n.id)}
                              sx={{ color: "#3b82f6", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                            >
                              Sign Progress Note
                            </Typography>
                          </Box>
                          
                          {editingNoteId === (n._id || n.id) ? (
                            <TextField 
                              fullWidth 
                              multiline 
                              rows={4} 
                              value={editingContent} 
                              onChange={(e) => setEditingContent(e.target.value)} 
                              sx={{ 
                                "& .MuiInputBase-root": { fontSize: "0.85rem", color: "#334155", lineHeight: 1.6, bgcolor: "#fff", p: 1.5 } 
                              }} 
                            />
                          ) : (
                            <Typography sx={{ fontSize: "0.85rem", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                              {n.content || "No content available for this note."}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              }) : (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: "#94a3b8", fontStyle: 'italic', fontSize: '0.85rem' }}>No unsigned notes</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 3. SIGNED NOTES */}
      <Box>
        <Typography sx={{ fontWeight: 600, color: '#3b82f6', fontSize: '0.9rem', mb: 1 }}>
          Signed Progress Notes
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
          <Table size="small">
            <TableHead sx={tableHeadSx}>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Kind</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {signedNotes.length > 0 ? signedNotes.map((n, i) => {
                const isExpanded = expandedNoteIds.has(n._id || n.id);
                return (
                  <React.Fragment key={n._id || n.id || i}>
                    <TableRow onClick={() => toggleNoteExpansion(n._id || n.id)} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell sx={{ ...cellSx, color: "#3b82f6", fontWeight: 500, cursor: "pointer" }}>{n.patientId?.firstName} {n.patientId?.lastName}</TableCell>
                      <TableCell sx={cellSx}>{dayjs(n.createdAt).format("MM/DD/YYYY")}</TableCell>
                      <TableCell sx={cellSx}>{n.noteType || "Recare"}</TableCell>
                      <TableCell sx={cellSx}>{getProviderName(n.providerId)}</TableCell>
                      <TableCell align="right" sx={cellSx}>
                        <Box sx={{ display: "flex", alignItems: "center", color: "#64748b", cursor: "pointer", justifyContent: "flex-end" }}>
                          <Typography sx={{ fontSize: "0.75rem", mr: 0.5 }}>View Note</Typography>
                          {isExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                        </Box>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        <TableCell colSpan={5} sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
                          <Box sx={{ mb: 1.5, display: "flex", gap: 1 }}>
                            {editingNoteId === (n._id || n.id) ? (
                              <>
                                <Button variant="contained" size="small" onClick={handleEditSave} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" }, textTransform: "none", fontSize: "0.75rem", height: 28, px: 2, boxShadow: 'none' }}>Save</Button>
                                <Button variant="outlined" size="small" onClick={handleEditCancel} sx={{ color: "#64748b", borderColor: "#cbd5e1", textTransform: "none", fontSize: "0.75rem", height: 28, px: 2 }}>Cancel</Button>
                              </>
                            ) : (
                              <Button variant="outlined" size="small" onClick={() => handleEditStart(n)} sx={{ color: '#3b82f6', borderColor: '#3b82f6', textTransform: "none", fontSize: "0.75rem", height: 28, px: 2 }}>Edit Note</Button>
                            )}
                          </Box>

                          {editingNoteId === (n._id || n.id) ? (
                            <TextField 
                              fullWidth 
                              multiline 
                              rows={4} 
                              value={editingContent} 
                              onChange={(e) => setEditingContent(e.target.value)} 
                              sx={{ 
                                "& .MuiInputBase-root": { fontSize: "0.85rem", color: "#334155", lineHeight: 1.6, bgcolor: "#fff", p: 1.5 } 
                              }} 
                            />
                          ) : (
                            <Typography sx={{ fontSize: "0.85rem", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                              {n.content || "No content available for this note."}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              }) : (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: "#94a3b8", fontStyle: 'italic', fontSize: '0.85rem' }}>No signed notes</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

    </Box>
  );
};

export default ProgressNotesTables;
