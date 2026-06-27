import { memo, useCallback } from "react";
import {
  Box, IconButton, MenuItem, Select, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { Label, SquareCheckbox } from "./helpers";
import { providerLabel } from "./helpers";

const ProcedureRow = memo(({ row, isLast, providers, setProcedures }) => {
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

  return (
    <TableRow sx={{ "&:hover": { backgroundColor: "#fafbfc" } }}>
      <TableCell padding="checkbox" sx={{ ...cellSx, pl: "12px" }}>
        <SquareCheckbox checked={row.checked} onChange={handleToggleCheck} />
      </TableCell>
      <TableCell sx={{ ...cellSx, fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#2262ef", whiteSpace: "nowrap" }}>
        {row.code}
      </TableCell>
      <TableCell sx={cellSx}>
        <TextField
          size="small"
          value={row.site || ""}
          onChange={handleSiteChange}
          placeholder="—"
          sx={{
            width: "100%",
            "& .MuiInputBase-input": { fontFamily: "Inter", fontSize: "12px", py: "5px", px: "8px" },
            "& .MuiInputBase-input::placeholder": { color: "#374151", opacity: 1 },
            "& .MuiOutlinedInput-root": { borderRadius: "6px" },
          }}
        />
      </TableCell>
      <TableCell sx={cellSx}>
        <Select
          size="small"
          value={row.treatment}
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
      <TableCell sx={{ ...cellSx, width: "44px", pr: "8px", textAlign: "center" }}>
        <IconButton size="small" onClick={handleDelete} sx={{ color: "#ef4444", p: "4px" }}>
          <DeleteOutline sx={{ fontSize: "18px" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

const ProcedureTable = ({ procedures, setProcedures, providers }) => (
  <Box sx={{ mb: "16px" }}>
    <Label sx={{ mb: "8px" }}>New procedures</Label>
    <Box sx={{ border: "1px solid #e0e5eb", borderRadius: "8px", overflow: "hidden" }}>
      <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead sx={{ backgroundColor: "#f8fafc" }}>
          <TableRow>
            <TableCell padding="checkbox" sx={{ borderBottom: "1px solid #e0e5eb", width: "44px", pl: "12px" }} />
            {[
              { label: "PROCEDURE", width: "88px" },
              { label: "SITE",      width: "22%"  },
              { label: "TREATMENT", width: "38%"  },
              { label: "PROVIDER",  width: "38%"  },
            ].map(({ label, width }) => (
              <TableCell key={label} sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: "#5c646f", borderBottom: "1px solid #e0e5eb", letterSpacing: "0.5px", py: "6px", width }}>
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
            />
          ))}
          {procedures.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center", py: "20px", border: "none" }}>
                <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
                  No procedures added. Select a quick tag above.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  </Box>
);

export default ProcedureTable;
