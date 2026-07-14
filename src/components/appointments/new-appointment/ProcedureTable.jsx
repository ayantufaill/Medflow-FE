import { memo, useCallback } from "react";
import {
  Box, IconButton, MenuItem, Select, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Label, SquareCheckbox } from "./helpers";
import { providerLabel } from "./helpers";
import DeleteIconImg from "../../../assets/operatory icons/delete.png";

const ProcedureRow = memo(({ row, isLast, providers, setProcedures, showExtendedOptions }) => {
  const cellSx = { borderBottom: isLast ? "none" : "1px solid #f0f2f5", py: "4px" };

  const handleToggleCheck = useCallback(
    () => setProcedures((prev) => prev.map((p) => p.id === row.id ? { ...p, checked: !p.checked } : p)),
    [row.id, setProcedures],
  );
  const handleSiteChange = useCallback(
    (e) => setProcedures((prev) => prev.map((p) => p.id === row.id ? { ...p, site: e.target.value } : p)),
    [row.id, setProcedures],
  );
  const handleProviderChange = useCallback(
    (e) => setProcedures((prev) => prev.map((p) => p.id === row.id ? { ...p, provider: e.target.value } : p)),
    [row.id, setProcedures],
  );
  const handleDelete = useCallback(
    () => setProcedures((prev) => prev.filter((p) => p.id !== row.id)),
    [row.id, setProcedures],
  );

  const parseCharge = (v) => {
    if (v == null) return 0;
    const n = Number(String(v).replace(/[$,]/g, ''));
    return isNaN(n) ? 0 : n;
  };
  const ptPart = row.ptPart != null ? parseCharge(row.ptPart) : (row.charge != null ? parseCharge(row.charge) : 0);
  const totalCharge = row.totalCharge != null ? parseCharge(row.totalCharge) : (row.charge != null ? parseCharge(row.charge) : 0);
  const fmt = (v) => `$${Number(v).toFixed(2)}`;

  return (
    <TableRow sx={{ "&:hover": { backgroundColor: "#fafbfc" } }}>
      <TableCell padding="checkbox" sx={{ ...cellSx, pl: "12px" }}>
        <SquareCheckbox checked={row.checked} onChange={handleToggleCheck} />
      </TableCell>
      <TableCell sx={{ ...cellSx, fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#2262ef", whiteSpace: "nowrap" }}>
        {row.code}
      </TableCell>
      {/* Site column — always shown */}
      <TableCell sx={cellSx}>
        <TextField
          size="small"
          value={row.site || ""}
          onChange={handleSiteChange}
          placeholder="—"
          disabled={row.treatArea === "MOUTH"}
          sx={{
            width: "100%",
            "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "12px", py: "5px", px: "8px" },
            "& .MuiInputBase-input::placeholder": { color: "#374151", opacity: 1 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
              backgroundColor: row.treatArea === "MOUTH" ? "#f1f5f9" : "transparent",
            },
            "& .Mui-disabled": { WebkitTextFillColor: "#9aa3ae" },
          }}
        />
      </TableCell>
      <TableCell sx={cellSx}>
        <Select
          size="small"
          value={row.treatment}
          MenuProps={{ sx: { zIndex: 1400 } }}
          sx={{ fontFamily: "Inter", fontSize: "12px", height: "32px", width: "100%", borderRadius: "6px", "& .MuiSelect-select": { py: "5px" } }}
        >
          <MenuItem value={row.treatment} sx={{ fontFamily: "Inter", fontSize: "12px" }}>{row.treatment}</MenuItem>
        </Select>
      </TableCell>
      <TableCell sx={cellSx}>
        <Select
          size="small"
          displayEmpty
          value={row.provider}
          onChange={handleProviderChange}
          MenuProps={{ sx: { zIndex: 1400 } }}
          sx={{ fontFamily: "Inter", fontSize: "12px", height: "32px", width: "100%", borderRadius: "6px", "& .MuiSelect-select": { py: "5px" } }}
        >
          <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>— Select —</MenuItem>
          {providers.map((p) => (
            <MenuItem key={p._id || p.id} value={String(p._id || p.id)} sx={{ fontFamily: "Inter", fontSize: "12px" }}>
              {providerLabel(p)}
            </MenuItem>
          ))}
        </Select>
      </TableCell>

      {/* Extended columns: Pt Part + Total Charge + status icons */}
      {showExtendedOptions && (
        <>
          <TableCell sx={{ ...cellSx, fontFamily: "Inter", fontSize: "12px", color: "#374151", textAlign: "right", whiteSpace: "nowrap" }}>
            {fmt(ptPart)}
          </TableCell>
          <TableCell sx={{ ...cellSx, fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: "#09121f", textAlign: "right", whiteSpace: "nowrap" }}>
            {fmt(totalCharge)}
          </TableCell>
          <TableCell sx={{ ...cellSx, width: "32px", textAlign: "center", px: "4px" }}>
            <CheckCircleIcon sx={{ fontSize: "18px", color: "#22c55e" }} />
          </TableCell>
          <TableCell sx={{ ...cellSx, width: "32px", textAlign: "center", px: "4px" }}>
            <IconButton size="small" sx={{ p: "2px", color: "#9aa3ae" }}>
              <SettingsOutlinedIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </TableCell>
        </>
      )}

      {/* Delete action */}
      <TableCell sx={{ ...cellSx, width: "44px", pr: "8px", textAlign: "center" }}>
        <IconButton size="small" onClick={handleDelete} sx={{ p: "4px" }}>
          <Box component="img" src={DeleteIconImg} sx={{ width: "16px", height: "16px", objectFit: "contain" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

const ProcedureTable = ({ procedures, setProcedures, providers, showExtendedOptions }) => {
  const baseHeaders = [
    { label: "PROCEDURE", width: showExtendedOptions ? "72px" : "88px" },
    { label: "SITE",      width: "18%"  },
    { label: "TREATMENT", width: showExtendedOptions ? "22%" : "38%"  },
    { label: "PROVIDER",  width: showExtendedOptions ? "22%" : "38%"  },
  ];
  const extendedHeaders = showExtendedOptions ? [
    { label: "PT PART",      width: "80px" },
    { label: "TOTAL CHARGE", width: "90px" },
    { label: "",             width: "32px" },
    { label: "",             width: "32px" },
  ] : [];
  const allHeaders = [...baseHeaders, ...extendedHeaders];

  return (
    <Box sx={{ mb: "16px" }}>
      <Label sx={{ mb: "8px" }}>New procedures</Label>
      <Box sx={{ border: "1px solid #e0e5eb", borderRadius: "8px", overflow: "hidden" }}>
        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead sx={{ backgroundColor: "#f8fafc" }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ borderBottom: "1px solid #e0e5eb", width: "44px", pl: "12px" }} />
              {allHeaders.map(({ label, width }, i) => (
                <TableCell key={i} sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: "#5c646f", borderBottom: "1px solid #e0e5eb", letterSpacing: "0.5px", py: "6px", width, textAlign: label === "PT PART" || label === "TOTAL CHARGE" ? "right" : "left" }}>
                  {label}
                </TableCell>
              ))}
              <TableCell sx={{ borderBottom: "1px solid #e0e5eb", width: "44px" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {procedures.map((row, idx) => (
              <ProcedureRow
                key={row.id}
                row={row}
                isLast={idx === procedures.length - 1}
                providers={providers}
                setProcedures={setProcedures}
                showExtendedOptions={showExtendedOptions}
              />
            ))}
            {procedures.length === 0 && (
              <TableRow>
                <TableCell colSpan={showExtendedOptions ? 10 : 6} sx={{ textAlign: "center", py: "20px", border: "none" }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
                    No procedures added. Select a quick tag above.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {/* Totals row */}
            {showExtendedOptions && procedures.length > 0 && (() => {
              const parseCharge = (v) => {
                if (v == null) return 0;
                const n = Number(String(v).replace(/[$,]/g, ''));
                return isNaN(n) ? 0 : n;
              };
              const totalPt = procedures.reduce((s, p) => s + (p.ptPart != null ? parseCharge(p.ptPart) : parseCharge(p.charge)), 0);
              const totalChg = procedures.reduce((s, p) => s + (p.totalCharge != null ? parseCharge(p.totalCharge) : parseCharge(p.charge)), 0);
              const fmt = (v) => `$${Number(v).toFixed(2)}`;
              return (
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell colSpan={4} sx={{ borderTop: "1px solid #e0e5eb", border: "none" }} />
                  <TableCell sx={{ borderTop: "1px solid #e0e5eb", border: "none", fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: "#09121f", textAlign: "right" }}>
                    {fmt(totalPt)}
                  </TableCell>
                  <TableCell sx={{ borderTop: "1px solid #e0e5eb", border: "none", fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: "#09121f", textAlign: "right" }}>
                    {fmt(totalChg)}
                  </TableCell>
                  <TableCell colSpan={3} sx={{ borderTop: "1px solid #e0e5eb", border: "none" }} />
                </TableRow>
              );
            })()}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default ProcedureTable;
