import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Stack,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

// Helper for the colored financial column headers
const HeaderLabel = ({ label, color }) => (
  <Typography
    variant="caption"
    sx={{ color: color, fontWeight: "bold", fontSize: "11px" }}
  >
    {label}
  </Typography>
);

const DebitAdjustmentDialog = ({ onClose }) => {
  const columns = [
    { label: "Ins Writeoff", width: 80, color: COLORS.TEXT_SECONDARY },
    { label: "Patient:", width: 80, color: COLORS.TEXT_SECONDARY },
    { label: "Insurance:", width: 80, color: COLORS.TEXT_SECONDARY },
    { label: "Charges: $100.00", width: 100, color: COLORS.TEXT_SECONDARY },
    { label: "Payment: $0.00", width: 80, color: '#22c55e', align: "right" },
    { label: "Adjust: $0.00", width: 80, color: COLORS.ACCENT, align: "right" },
  ];

  const headerInfo = {
    invoiceNum: "#24636",
    adjustmentDate: "04/15/2026",
    adjustmentType: "Debit Adjustment #24642",
    invoiceDate: "04/14/2026",
  };

  const lineItems = [
    {
      code: "L5001 Broken appt",
      patient: "test test",
      values: [
        { val: "$0.00", width: 80 },
        { val: "$100.00", width: 80 },
        { val: "$0.00", width: 80 },
        { val: "$100.00", width: 100, bold: true },
        { val: "$0.00", width: 80, bold: true, color: '#22c55e' },
      ],
      percent: "0%",
    },
  ];

  return (
    <Box sx={{ width: "100%", bgcolor: COLORS.WHITE, borderRadius: radius.md, overflow: "hidden" }}>
      {/* Header Bar */}
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '24px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <EditNoteOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: "bold", color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Adjust invoice {headerInfo.invoiceNum}
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: '24px', py: '20px', pt: '24px !important', overflow: 'visible' }}>
        {/* Top Input Row: Date, Type, Reason */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: "bold", fontSize: '13px' }}>
            {headerInfo.adjustmentDate}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: "bold", fontSize: '13px' }}>
              {headerInfo.adjustmentType}
            </Typography>
            <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px' }}>type</Typography>
            <Select
              variant="outlined"
              size="small"
              defaultValue=""
              sx={{ 
                width: 150, 
                height: '36px',
                borderRadius: radius.sm,
                fontSize: "13px",
                '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
                bgcolor: COLORS.SURFACE_TINT
              }}
              MenuProps={{ 
                sx: { zIndex: 150000 },
                PaperProps: {
                  sx: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: `1px solid ${COLORS.BORDER_LIGHT}`,
                    borderRadius: radius.sm,
                    mt: 0.5,
                    '& .MuiMenuItem-root': { fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, py: 1 }
                  }
                }
              }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
            </Select>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', whiteSpace: "nowrap" }}>
              Reason:
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ 
                '& .MuiInputBase-root': { height: '36px', borderRadius: radius.sm, fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
              }}
            />
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', whiteSpace: "nowrap" }}>
              for invoice: {headerInfo.invoiceNum}:
            </Typography>
          </Box>
        </Stack>

        {/* Calculation Logic Row */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
          <Select
            variant="outlined"
            size="small"
            defaultValue="Percentage"
            sx={{ 
              fontSize: "13px", 
              height: '36px',
              borderRadius: radius.sm,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
              bgcolor: COLORS.SURFACE_TINT
            }}
            MenuProps={{ 
              sx: { zIndex: 150000 },
              PaperProps: {
                sx: {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  borderRadius: radius.sm,
                  mt: 0.5,
                  '& .MuiMenuItem-root': { fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, py: 1 }
                }
              }
            }}
          >
            <MenuItem value="Percentage">Percentage</MenuItem>
          </Select>
          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>%</Typography>
          <TextField
            variant="outlined"
            size="small"
            defaultValue="0"
            sx={{
              width: 50,
              '& .MuiInputBase-root': { height: '36px', borderRadius: radius.sm, fontSize: '13px', bgcolor: COLORS.SURFACE_TINT },
              '& input': { textAlign: "center", py: 0 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER }
            }}
          />
          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY, fontWeight: "bold" }}>
            = $0
          </Typography>
        </Stack>

        {/* Financial Category Headers */}
        <Stack direction="row" sx={{ mb: 1, width: "100%", alignItems: 'flex-end' }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "12px", color: COLORS.TEXT_PRIMARY, width: 220 }}>
            Invoice {headerInfo.invoiceNum} : {headerInfo.invoiceDate} for
          </Typography>

          <Stack direction="row" spacing={0} sx={{ flexGrow: 1 }}>
            {columns.map((col, idx) => (
              <Box key={idx} sx={{ width: col.width, textAlign: col.align || "left" }}>
                <HeaderLabel label={col.label} color={col.color} />
              </Box>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 1.5, mt: 0.5, borderColor: COLORS.BORDER_LIGHT }} />

        {/* Detailed Line Items */}
        {lineItems.map((item, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center", py: 1.5, borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
            <Box sx={{ width: 220, display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '12px', fontWeight: fontWeight.medium }}>
                {item.code}
              </Typography>
              <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: "11px" }}>
                {item.patient}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0} sx={{ flexGrow: 1, alignItems: 'center' }}>
              {item.values.map((v, vIdx) => (
                <Typography
                  key={vIdx}
                  sx={{
                    color: v.color || COLORS.TEXT_PRIMARY,
                    width: v.width,
                    textAlign: "right",
                    pr: 1,
                    fontSize: '12px',
                    fontWeight: v.bold ? fontWeight.semiBold : fontWeight.regular,
                  }}
                >
                  {v.val}
                </Typography>
              ))}
              <Box sx={{ width: 80, display: "flex", justifyContent: "flex-end", pr: 1 }}>
                <Box sx={{ border: `1px dashed ${COLORS.BORDER}`, px: 1, py: 0.5, borderRadius: '4px', bgcolor: COLORS.SURFACE_TINT }}>
                  <Typography sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY }}>
                    {item.percent}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        ))}
      </DialogContent>

      {/* Footer with Description and Actions */}
      <DialogActions sx={{ p: '16px 24px', borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: COLORS.ACCENT, cursor: "pointer", fontWeight: fontWeight.medium, fontSize: '13px', '&:hover': { textDecoration: 'underline' } }}>
          + Add description
        </Typography>
        
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              textTransform: "none",
              fontSize: "13px",
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              "&:hover": { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: COLORS.ACCENT,
              color: COLORS.WHITE,
              textTransform: "none",
              fontSize: "13px",
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              boxShadow: 'none',
              "&:hover": { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
            }}
          >
            Adjust
          </Button>
        </Stack>
      </DialogActions>
    </Box>
  );
};

export default DebitAdjustmentDialog;
