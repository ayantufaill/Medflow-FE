import { Box, Typography, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const EligibilityTab = ({
  eligibilityQuery,
  setEligibilityQuery,
  handleAddEligibilityCode,
  eligibilityCodes,
  handleDeleteEligibilityCode
}) => {
  return (
    <Box sx={{ mt: 3, backgroundColor: '#fff', borderRadius: 3, p: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      {/* Search/Add Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, pl: 1 }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
          Add Procedure Code
        </Typography>
        <TextField
          placeholder="Enter code (e.g. D0180)"
          size="small"
          value={eligibilityQuery}
          onChange={(e) => setEligibilityQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddEligibilityCode();
          }}
          sx={{
            width: 300,
            "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
            "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
          }}
        />
        <Button
          variant="contained"
          disableElevation
          onClick={handleAddEligibilityCode}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            height: "38px",
            '&:hover': { backgroundColor: "#1a50cc" },
          }}
        >
          Add Code
        </Button>
      </Box>

      {/* List Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ py: 2, fontWeight: 700, color: '#1e293b', fontSize: '0.85rem', width: '25%', borderBottom: '1px solid #e2e8f0' }}>Procedure Code</TableCell>
              <TableCell sx={{ py: 2, fontWeight: 700, color: '#1e293b', fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>Description</TableCell>
              <TableCell align="right" sx={{ py: 2, fontWeight: 700, color: '#1e293b', fontSize: '0.85rem', width: 80, borderBottom: '1px solid #e2e8f0' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eligibilityCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.95rem' }}>No procedure codes configured for real-time eligibility verification</Typography>
                </TableCell>
              </TableRow>
            ) : (
              eligibilityCodes.map((item) => (
                <TableRow key={item.ProcCode} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell sx={{ py: 2, borderBottom: '1px solid #f1f5f9' }}>
                    <Box
                      sx={{
                        border: '1px solid #cbd5e1',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: '#fff',
                        width: 'fit-content',
                        textAlign: 'center'
                      }}
                    >
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                        {item.ProcCode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2, fontSize: '0.9rem', color: '#475569', borderBottom: '1px solid #f1f5f9' }}>
                    {item.Descript}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1, borderBottom: '1px solid #f1f5f9' }}>
                    <IconButton size="small" onClick={() => handleDeleteEligibilityCode(item.ProcCode)} sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2' } }}>
                      <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EligibilityTab;
