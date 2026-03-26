import { useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField } from "@mui/material";

const DentalHistorySummary = ({ personalHistory, onUpdateItem }) => {
  const lineStyle = {
    border: 'none',
    borderBottom: '1px solid #9e9e9e',
    outline: 'none',
    width: '200px',
    fontSize: '13px',
    padding: '0 4px',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    marginLeft: '8px'
  };

  const labelStyle = {
    fontSize: '12px',
    color: '#333',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
    fontWeight: 600
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        border: "1px solid #e0e0e0",
        bgcolor: "#ffffff",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ background: "#fafafa" }}>
            <TableCell sx={{ width: "55%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#616161" }}
                >
                  Personal History
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="caption">🟢 Low</Typography>
                  <Typography variant="caption">🟡 Moderate</Typography>
                  <Typography variant="caption">🔴 High</Typography>
                </Box>
              </Box>
            </TableCell>
            <TableCell sx={{ width: "10%" }} align="center" />
            <TableCell sx={{ width: "35%" }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#616161" }}
              >
                Additional information
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personalHistory.map((item) => (
            <TableRow
              key={item.id}
              sx={{ borderBottom: "2px solid #e0e0e0" }}
            >
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#424242" }}
                >
                  {item.number || item.id}. {item.question}
                </Typography>

                {item.scale && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#9e9e9e",
                      mt: 0.5,
                    }}
                  >
                    on a scale of 1 to 10: {item.scale}
                  </Typography>
                )}

                {/* Comment Field */}
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 0.5 }}>
                  <Typography sx={labelStyle}>Comment:</Typography>
                  <input 
                    style={lineStyle} 
                    value={item.comment || ""} 
                    onChange={(e) =>
                      onUpdateItem(item.id, "comment", e.target.value)
                    }
                  />
                </Box>
                
                {/* Doctor's Notes Field */}
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                  <Typography sx={labelStyle}>Doctor's Note:</Typography>
                  <input 
                    style={lineStyle} 
                    value={item.note || ""} 
                    onChange={(e) =>
                      onUpdateItem(item.id, "note", e.target.value)
                    }
                  />
                </Box>
              </TableCell>

              <TableCell align="center">
                <TextField
                  variant="standard"
                  size="small"
                  value={item.answer || ""}
                  onChange={(e) =>
                    onUpdateItem(item.id, "answer", e.target.value)
                  }
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    minWidth: 120,
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      fontSize: 14,
                      py: 0,
                    },
                  }}
                />
              </TableCell>

              <TableCell
                sx={{
                  background: "#f5f5f5",
                  maxHeight: 120,
                  overflow: "auto",
                  verticalAlign: "top",
                }}
              >
                <TextField
                  variant="standard"
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={3}
                  size="small"
                  value={item.additionalInfo || ""}
                  onChange={(e) =>
                    onUpdateItem(
                      item.id,
                      "additionalInfo",
                      e.target.value,
                    )
                  }
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: 14,
                      py: 0.5,
                    },
                    bgcolor: "transparent",
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          {!personalHistory.length ? (
            <TableRow>
              <TableCell colSpan={3}>
                No dental history questions found.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DentalHistorySummary;
