import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Select, MenuItem, Dialog, DialogContent, Button, DialogActions, IconButton
} from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';
import docSvg from '../../../assets/practicesetupicon/documents.svg';

const headerStyle = {
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "#333",
  borderRight: "1px solid #e0e0e0",
  textAlign: "center",
  py: 1,
};

const subHeaderStyle = {
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "#555",
  borderBottom: "1px solid #e0e0e0",
  borderRight: "1px solid #e0e0e0",
  textAlign: "center",
  py: 0.5,
  bgcolor: "#fff"
};

const bodyCellStyle = {
  fontSize: "0.75rem",
  borderRight: "1px solid #e0e0e0",
  verticalAlign: "top",
  py: 1,
  px: 1,
};

const differenceCellStyle = {
  fontSize: "0.7rem",
  borderRight: "1px solid #f0f0f0",
  borderBottom: "1px solid #f0f0f0",
  py: 0.8,
  px: 1,
  wordBreak: "break-all"
};

const AuditInsurancePlanHistory = ({ open, onClose, planName }) => {
  const auditData = [
    {
      date: "02/14/2026 02:14:23 PM",
      user: "Cloud Temp",
      name: planName || "ABC Corp Dental",
      action: "Create",
      differences: []
    },
    {
      date: "02/14/2026 03:00:12 PM",
      user: "Admin User",
      name: planName || "ABC Corp Dental",
      action: "Update",
      differences: [
        { key: "/employerAddress", old: "", new: "4414" }
      ]
    },
    {
      date: "02/15/2026 09:10:45 AM",
      user: "Nurse Jane",
      name: planName || "ABC Corp Dental",
      action: "Update",
      differences: [
        { key: "/note", old: "", new: "Our provider is out with this insurance plan" }
      ]
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "10px", py: "10px",
        borderBottom: "1px solid #e0e5eb", flexShrink: 0,
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <img src={docSvg} alt="Document" style={{ width: 20, height: 20, filter: 'brightness(0) saturate(100%) invert(35%) sepia(87%) saturate(5833%) hue-rotate(219deg) brightness(97%) contrast(98%)' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ 
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Audit Insurance Plan History
          </Typography>
          <Typography sx={{ 
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            View the historical audit trail for this insurance plan.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ width: "100%", bgcolor: "#fff", mt: 2 }}>

          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, gap: 1 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#1976d2", fontWeight: 600 }}>Filter list by:</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#1976d2", ml: 2 }}>Action:</Typography>
            <Select size="small" defaultValue="All" sx={{ height: 25, fontSize: "0.75rem", minWidth: 80 }}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Update">Update</MenuItem>
              <MenuItem value="Create">Create</MenuItem>
            </Select>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headerStyle, width: "120px" }}>Date</TableCell>
                  <TableCell sx={{ ...headerStyle, width: "80px" }}>User</TableCell>
                  <TableCell sx={{ ...headerStyle, width: "120px" }}>Name</TableCell>
                  <TableCell sx={{ ...headerStyle, width: "80px" }}>Action</TableCell>
                  <TableCell colSpan={3} sx={{ ...headerStyle, borderRight: 0, p: 0 }}>
                    <Box sx={{ py: 0.5 }}>Difference</Box>
                    <Box sx={{ display: 'flex' }}>
                      <Box sx={{ ...subHeaderStyle, flex: 1 }}>Key</Box>
                      <Box sx={{ ...subHeaderStyle, flex: 1 }}>Old</Box>
                      <Box sx={{ ...subHeaderStyle, flex: 1, borderRight: 0 }}>New</Box>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={bodyCellStyle}>{row.date}</TableCell>
                    <TableCell sx={bodyCellStyle}>{row.user}</TableCell>
                    <TableCell sx={bodyCellStyle}>{row.name}</TableCell>
                    <TableCell sx={bodyCellStyle}>{row.action}</TableCell>
                    <TableCell colSpan={3} sx={{ p: 0, borderRight: 0, verticalAlign: 'top' }}>
                      {row.differences.length > 0 ? row.differences.map((diff, dIdx) => (
                        <Box key={dIdx} sx={{ display: 'flex', width: '100%' }}>
                          <Box sx={{ ...differenceCellStyle, flex: 1 }}>{diff.key}</Box>
                          <Box sx={{ ...differenceCellStyle, flex: 1 }}>{diff.old}</Box>
                          <Box sx={{ ...differenceCellStyle, flex: 1, borderRight: 0 }}>{diff.new}</Box>
                        </Box>
                      )) : (
                        <Box sx={{ display: 'flex', width: '100%' }}>
                          <Box sx={{ ...differenceCellStyle, flex: 1 }}>&nbsp;</Box>
                          <Box sx={{ ...differenceCellStyle, flex: 1 }}>&nbsp;</Box>
                          <Box sx={{ ...differenceCellStyle, flex: 1, borderRight: 0 }}>&nbsp;</Box>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: "20px", py: "12px", borderTop: '1px solid #e0e5eb', gap: 1.5, justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuditInsurancePlanHistory;
