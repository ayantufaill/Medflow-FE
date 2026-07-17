import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import { InfoOutlined as InfoIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const truncateLabel = (value, max = 30) => {
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
};

// Blob-based download — works for cross-origin URLs (S3/CloudFront)
// where the `download` attribute on <a> is silently ignored by browsers.
const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    // Fallback: open in new tab if blob fetch fails
    window.open(url, "_blank");
  }
};

const DownloadCell = ({ row }) => {
  const [downloading, setDownloading] = useState(false);
  const fileUrl = row.fileUrl || row.documentUrl;

  const handleDownload = async () => {
    if (!fileUrl || downloading) return;
    setDownloading(true);
    await downloadFile(fileUrl, row.name);
    setDownloading(false);
  };

  return (
    <Typography
      variant="body2"
      sx={{
        fontSize: "0.8rem",
        color: downloading ? "#9e9e9e" : "#1976d2",
        cursor: downloading ? "default" : "pointer",
      }}
      onClick={handleDownload}
    >
      {downloading ? "Downloading..." : "Download"}
    </Typography>
  );
};

export const DocumentTable = ({ 
  title, 
  tooltipTitle, 
  documents, 
  sortMode,
  onEdit, 
  onOpen, 
  onDownload, 
  onShare, 
  onDelete 
}) => {
  const sortRows = (rows) => {
    const copy = [...rows];
    if (sortMode === "name") {
      copy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortMode === "date") {
      copy.sort((a, b) => {
        const da = new Date(a.uploadedDate || 0).getTime();
        const db = new Date(b.uploadedDate || 0).getTime();
        return db - da;
      });
    } else if (sortMode === "category") {
      copy.sort((a, b) => (a.type || "").localeCompare(b.type || ""));
    }
    return copy;
  };

  const sortedDocs = sortRows(documents);

  return (
    <Box sx={{ mb: title ? 3 : 1 }}>
      {title && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 0.75,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "#616161",
              fontSize: "0.8rem",
            }}
          >
            {title}
          </Typography>
          <Tooltip title={tooltipTitle}>
            <InfoIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          </Tooltip>
        </Box>
      )}

      <Table
        size="small"
        sx={{
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 1,
        }}
      >
        <TableBody>
          {sortedDocs.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ cursor: "pointer" }}
                    onClick={() => onEdit(row)}
                  >
                    {truncateLabel(row.name)}
                  </Typography>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(row)}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell sx={{ width: 220 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.8rem", color: "#757575" }}
                >
                  Uploaded by {row.uploadedBy} — {row.uploadedDate}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.8rem", color: "#616161" }}
                >
                  {row.type}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.8rem",
                    color: "#1976d2",
                    cursor: "pointer",
                  }}
                  onClick={() => onOpen(row)}
                >
                  Open
                </Typography>
              </TableCell>
              <TableCell>
                <DownloadCell row={row} />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.8rem",
                    color: "#1976d2",
                    cursor: "pointer",
                  }}
                  onClick={() => onShare(row)}
                >
                  Share with patient
                </Typography>
              </TableCell>
             
              <TableCell align="right" sx={{ width: 60 }}>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    sx={{ color: "#e53935" }}
                    onClick={() => onDelete(row)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
