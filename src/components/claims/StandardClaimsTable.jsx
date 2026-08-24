import React from "react";
import { Link } from "react-router-dom";
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
  Tooltip,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  Collapse,
  Button,
  FormControl,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  Info as InfoIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowRight as ArrowRightIcon,
  ArrowDropDown as ArrowDropDownIcon,
  DeleteOutline as DeleteOutlineIcon,
  AttachFile as AttachFileIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Autorenew as AutorenewIcon,
  Sync as SyncIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { claimService } from "../../services/claim.service";
import notesIcon from "../../assets/claimicons/notesicon.svg";
import deleteIcon from "../../assets/claimicons/deleteicon.svg";

export const StandardClaimsTable = ({
  activeTab,
  filteredClaims,
  selectedClaims,
  handleSelectAll,
  handleSelectAllMenuOpen,
  isSelectAllMenuOpen,
  handleSelectAllMenuClose,
  handleSelectSubset,
  selectAllAnchorEl,
  handleSelectClaim,
  handleLoadMoreClaims,
  toggleProcedures,
  expandedProcedures,
  handleRowStatusChange = () => {},
  handleRevalidate = () => {},
  expandAllMessages,
  handleNoteOpen = () => {},
  handleOpenEdit = () => {},
  handleOpenAttach = () => {},
  handleOpenPreview = () => {},
  handleOpenInvalidInfo = () => {},
  handleDeletePredetermination = () => {},
  handleToggleHide = () => {},
  dateRange = 'none',
}) => {
  const [editingDescId, setEditingDescId] = React.useState(null);
  const [editingDescValue, setEditingDescValue] = React.useState("");
  const [isSavingDesc, setIsSavingDesc] = React.useState(false);

  const handleDescDoubleClick = (id, currentDesc) => {
    setEditingDescId(id);
    setEditingDescValue(currentDesc || "");
  };

  const handleDescSave = async (id) => {
    setIsSavingDesc(true);
    try {
      await claimService.updateClaim(id, { notes: editingDescValue });
      window.dispatchEvent(new CustomEvent('refresh-claims'));
      setEditingDescId(null);
    } catch (err) {
      console.error("Failed to update description", err);
      alert("Failed to update description. Please try again.");
    } finally {
      setIsSavingDesc(false);
    }
  };

  const handleDescCancel = () => {
    setEditingDescId(null);
    setEditingDescValue("");
  };

  let renderList = [];
  if (dateRange === 'dos') {
    const buckets = { "0-30 days": [], "31-60 days": [], "61-90 days": [], ">90 days": [], "Unknown": [] };
    const getAgeBucket = (dateStr) => {
      if (!dateStr) return "Unknown";
      const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 3600 * 24));
      if (days <= 30) return "0-30 days";
      if (days <= 60) return "31-60 days";
      if (days <= 90) return "61-90 days";
      return ">90 days";
    };
    filteredClaims.forEach(c => {
      buckets[getAgeBucket(c.createdDate)].push(c);
    });
    ["0-30 days", "31-60 days", "61-90 days", ">90 days", "Unknown"].forEach(b => {
      if (buckets[b].length > 0) {
        renderList.push({ type: 'header', label: b });
        buckets[b].forEach(c => renderList.push({ type: 'claim', claim: c }));
      }
    });
  } else {
    filteredClaims.forEach(c => renderList.push({ type: 'claim', claim: c }));
  }

  return (
    // STANDARD CLAIMS Data Table
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        boxShadow: "none",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table size="small" sx={{ minWidth: "100%" }}>
        <TableHead
          sx={{
            backgroundColor: "#f8f9fa",
            "& .MuiTableCell-root": {
              py: 1,
              px: 1,
              fontSize: "0.75rem",
              fontWeight: 700,
              borderBottom: "1px solid #e2e8f0",
              color: 'inherit',
              whiteSpace: "nowrap",
            },
          }}
        >
          <TableRow>
            <TableCell
              sx={{
                width: "40px",
                py: 0.8,
                px: 0.5,
                textAlign: "center",
                verticalAlign: "top",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.2,
                }}
              >
                <Checkbox
                  size="small"
                  checked={
                    filteredClaims.length > 0 &&
                    filteredClaims.every((c) => selectedClaims[c.id])
                  }
                  indeterminate={
                    filteredClaims.some((c) => selectedClaims[c.id]) &&
                    !filteredClaims.every((c) => selectedClaims[c.id])
                  }
                  onChange={handleSelectAll}
                  sx={{
                    p: 0,
                    color: "#cbd5e1",
                    "&.Mui-checked": { color: "#1a3a6b" },
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleSelectAllMenuOpen}
                  sx={{ p: 0.2, color: "#475569", mt: 0.2 }}
                >
                  <ArrowDropDownIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
              <Menu
                anchorEl={selectAllAnchorEl}
                open={isSelectAllMenuOpen}
                onClose={handleSelectAllMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid #e2e8f0",
                  },
                }}
              >
                <MenuItem
                  onClick={() => handleSelectSubset("all")}
                  sx={{ fontSize: "0.75rem", py: 0.8, px: 2 }}
                >
                  Select All
                </MenuItem>
                <MenuItem
                  onClick={() => handleSelectSubset("ready")}
                  sx={{ fontSize: "0.75rem", py: 0.8, px: 2 }}
                >
                  Select All Ready
                </MenuItem>
                <MenuItem
                  onClick={() => handleSelectSubset("errored")}
                  sx={{ fontSize: "0.75rem", py: 0.8, px: 2 }}
                >
                  Select All with Alerts/Errors
                </MenuItem>
                <MenuItem
                  onClick={() => handleSelectSubset("none")}
                  sx={{ fontSize: "0.75rem", py: 0.8, px: 2 }}
                >
                  Clear Selection
                </MenuItem>
              </Menu>
            </TableCell>
            <TableCell>
              Patient Name
            </TableCell>
            <TableCell>
              {activeTab === 4 ? "Claim # (created date)" : "Claim #"}
            </TableCell>
            <TableCell>
              Claim Type
            </TableCell>
            <TableCell>
              {activeTab === 0 ? "Created Date" : "Sent on"}
            </TableCell>
            {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
              <TableCell>
                Printed on
              </TableCell>
            )}
            {activeTab === 4 && (
              <TableCell>
                Subscriber
              </TableCell>
            )}
            <TableCell>
              Carrier
            </TableCell>
            {activeTab === 4 && (
              <TableCell>
                Plan Name (#)
              </TableCell>
            )}
            <TableCell>
              Procedures
            </TableCell>
            {activeTab === 5 && (
              <TableCell>
                Treating Provider
              </TableCell>
            )}
            {activeTab !== 0 && (
              <TableCell>
                Status
              </TableCell>
            )}
            {activeTab === 0 && (
              <TableCell sx={{ pl: 3 }}>
                Alerts
              </TableCell>
            )}
            {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
              <TableCell>
                ERA Status
              </TableCell>
            )}
            {(activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4 ||
              activeTab === 5) && (
              <TableCell>
                Clearing House Status Message
              </TableCell>
            )}
            {activeTab === 4 && (
              <TableCell>
                Submitted Value
              </TableCell>
            )}
            <TableCell>
              Notes
            </TableCell>
            <TableCell>
              Description
            </TableCell>
            <TableCell align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            "& .MuiTableCell-root": {
              py: 1.5,
              px: 1,
              fontSize: "0.75rem",
              verticalAlign: "middle",
              borderBottom: "1px solid #e2e8f0",
              color: "#1e293b",
              whiteSpace: "nowrap",
            },
          }}
        >
          {filteredClaims.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  activeTab === 4
                    ? 17
                    : activeTab === 5
                      ? 13
                      : activeTab === 2 || activeTab === 3
                        ? 14
                        : activeTab === 1
                          ? 12
                          : activeTab === 0
                            ? 12
                            : 11
                }
                align="center"
                sx={{ py: 6 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "Inter, sans-serif",  fontSize: "0.75rem", color: "#64748b", fontStyle: "italic" }}
                  >
                    No claims found matching the selection criteria.
                  </Typography>
                  {activeTab === 2 && (
                    <Button
                      onClick={handleLoadMoreClaims}
                      startIcon={<SyncIcon sx={{ fontSize: "0.9rem" }} />}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#1a3a6b",
                        borderBottom: "1px dashed #1a3a6b",
                        borderRadius: 0,
                        padding: "2px 4px",
                        minWidth: "auto",
                        "&:hover": { background: "none", opacity: 0.8 },
                      }}
                    >
                      Load More Claims
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            renderList.map((item, index) => {
              if (item.type === 'header') {
                return (
                  <TableRow key={`header-${item.label}`}>
                    <TableCell colSpan={20} sx={{ backgroundColor: "#f1f5f9", fontWeight: 700, py: 1.5, pl: 2, color: "#1e293b", borderBottom: '1px solid #e2e8f0' }}>
                      {item.label}
                    </TableCell>
                  </TableRow>
                );
              }
              const claim = item.claim;
              const isSelected = !!selectedClaims[claim.id];
              const isExpanded = !!expandedProcedures[claim.id];
              const isError =
                claim.status === "denied" ||
                claim.status === "rejected" ||
                claim.status === "validationError";

              // Determine attachment color badge background/icon styling
              let attachIconColor = "#3182ce"; // Default Blue (not attached anything)

              const isSent =
                claim.status !== "unsent" &&
                claim.status !== "readyForSubmission";
              const hasAttachment =
                claim.attachmentColor === "green" ||
                claim.attachmentColor === "red" ||
                claim.redAttachment ||
                claim.hasAttachment;

              if (claim.attachmentColor === "red" || claim.redAttachment) {
                attachIconColor = "#e53e3e"; // Red: error with attachment
              } else if (hasAttachment && !isSent) {
                attachIconColor = "#d69e2e"; // Yellow: attached something but did not send
              } else if (hasAttachment && isSent) {
                attachIconColor = "#2f855a"; // Green: attached and sent
              }

              return (
                <React.Fragment key={claim.id}>
                  <TableRow
                    hover={false}
                    sx={{
                      ...(isSelected && { backgroundColor: "rgba(59, 130, 246, 0.08)" })
                    }}
                  >
                    {/* Checkbox column */}
                    <TableCell
                      sx={{ py: 1, verticalAlign: "top", textAlign: "center" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.2,
                        }}
                      >
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => handleSelectClaim(claim.id)}
                          sx={{
                            p: 0,
                            color: "#cbd5e1",
                            "&.Mui-checked": { color: "#1a3a6b" },
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => toggleProcedures(claim.id)}
                          sx={{ p: 0.2, color: "#475569", mt: 0.2 }}
                        >
                          {isExpanded ? (
                            <ArrowDropDownIcon
                              sx={{ fontSize: 16, transform: "rotate(180deg)" }}
                            />
                          ) : (
                            <ArrowDropDownIcon sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      </Box>
                    </TableCell>

                    {/* Patient Name (+ Code & DOB) */}
                    <TableCell>
                      <Typography
                        sx={{ fontFamily: "Inter, sans-serif", 
                          fontWeight: 600,
                          color:
                            isError && activeTab === 0 ? "#e53e3e" : "#3b82f6",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        {claim.patientName}
                      </Typography>
                      <Typography
                        sx={{ fontFamily: "Inter, sans-serif", 
                          color: "#64748b",
                          fontWeight: 400,
                          fontSize: "0.75rem",
                        }}
                      >
                        {claim.patientCode}
                      </Typography>
                      {(activeTab === 4 || activeTab === 5) &&
                        claim.patientDob && (
                          <Typography
                            sx={{ fontFamily: "Inter, sans-serif", 
                              color: "#64748b",
                              mt: 0.2,
                              fontSize: "0.75rem",
                            }}
                          >
                            {claim.patientDob}
                          </Typography>
                        )}
                    </TableCell>

                    {/* Claim # (+ Created Date) */}
                    <TableCell>
                      <Typography
                        sx={{ fontFamily: "Inter, sans-serif", 
                          fontWeight: 600,
                          color: isError && activeTab === 0 ? "#e53e3e" : "#1e293b",
                          fontSize: "0.75rem",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        <Link to={`/claims/${claim.id}`} style={{ color: "inherit", textDecoration: "inherit" }}>
                          {claim.claimNumber}
                        </Link>
                      </Typography>
                      {activeTab === 4 && claim.createdDate && (
                        <Typography
                          sx={{ fontFamily: "Inter, sans-serif", 
                            color: "#64748b",
                            fontStyle: "normal",
                            fontSize: "0.75rem",
                          }}
                        >
                          ({claim.createdDate})
                        </Typography>
                      )}
                    </TableCell>

                    {/* Claim Type */}
                    <TableCell>
                      <Typography
                        sx={{ fontFamily: "Inter, sans-serif", 
                          color:
                            isError && activeTab === 0 ? "#e53e3e" : "#64748b",
                          display: "flex",
                          flexDirection: "column",
                          fontSize: "0.75rem",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>
                          {claim.claimType.split(" ")[0]}
                        </span>
                        <span>
                          {claim.claimType.split(" ").slice(1).join(" ")}
                        </span>
                      </Typography>
                    </TableCell>

                    {/* Created Date / Sent Date */}
                    <TableCell>
                      <Typography
                        sx={{ fontFamily: "Inter, sans-serif",  fontSize: "0.75rem",
                          color:
                            isError && activeTab === 0 ? "#e53e3e" : "#475569",
                        }}
                      >
                        {activeTab === 0 ? claim.createdDate : claim.sentDate}
                      </Typography>
                    </TableCell>

                    {/* Printed on Date */}
                    {(activeTab === 2 ||
                      activeTab === 3 ||
                      activeTab === 4) && (
                      <TableCell>
                        <Typography sx={{ fontFamily: "Inter, sans-serif",  fontSize: "0.75rem", color: "#475569" }}>
                          {claim.printedDate || "—"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Subscriber */}
                    {activeTab === 4 && (
                      <TableCell>
                        <Typography sx={{ fontFamily: "Inter, sans-serif",  fontSize: "0.75rem", color: "#475569", fontWeight: 500 }}>
                          {claim.subscriber || "—"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Carrier */}
                    <TableCell>
                      <Typography
                        sx={{ fontFamily: "Inter, sans-serif", 
                          color:
                            isError && activeTab === 0 ? "#e53e3e" : "#475569",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      >
                        {claim.carrier}
                      </Typography>
                    </TableCell>

                    {/* Plan Name (#) */}
                    {activeTab === 4 && (
                      <TableCell>
                        <Typography
                          sx={{ fontFamily: "Inter, sans-serif", 
                            color: "#475569",
                            fontStyle: "normal",
                            fontSize: "0.75rem",
                          }}
                        >
                          {claim.planName || "—"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Procedures */}
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => toggleProcedures(claim.id)}
                        endIcon={
                          isExpanded ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )
                        }
                        sx={{
                          textTransform: "none",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#1a3a6b",
                          padding: "1px 6px",
                          minWidth: "auto",
                          "& .MuiButton-endIcon": {
                            ml: 0.5,
                            "& > *:first-of-type": { fontSize: "1rem" },
                          },
                          "&:hover": {
                            backgroundColor: "rgba(26, 58, 107, 0.08)",
                          },
                        }}
                      >
                        {isExpanded ? "Hide" : "Show"}
                      </Button>
                    </TableCell>

                    {/* Treating Provider */}
                    {activeTab === 5 && (
                      <TableCell>
                        <Typography sx={{ fontFamily: "Inter, sans-serif",  fontSize: "0.75rem", color: "#475569", fontWeight: 500 }}>
                          {claim.treatingProvider ? `${claim.treatingProvider.firstName || ''} ${claim.treatingProvider.lastName || ''}`.trim() || '—' : "—"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Status Dropdown */}
                    {activeTab !== 0 && (
                      <TableCell>
                        {activeTab === 1 ||
                        activeTab === 2 ||
                        activeTab === 3 ||
                        activeTab === 4 ||
                        activeTab === 5 ? (
                          // Interactive Dropdown
                          <FormControl
                            size="small"
                            variant="standard"
                            sx={{ m: 0, minWidth: 75 }}
                          >
                            <Select
                              value={claim.status}
                              onChange={(e) =>
                                handleRowStatusChange(claim.id, e.target.value)
                              }
                              sx={{
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                color:
                                  claim.status === "denied" ||
                                  claim.status === "rejected"
                                    ? "#d93838"
                                    : "#1e293b",
                                "& .MuiSelect-select": { py: 0.5, pr: 2 },
                              }}
                            >
                              <MenuItem value="draft" sx={{ fontSize: "0.75rem" }}>
                                Draft
                              </MenuItem>
                              <MenuItem value="readyForSubmission" sx={{ fontSize: "0.75rem" }}>
                                Ready for Submission
                              </MenuItem>
                              <MenuItem value="error" sx={{ fontSize: "0.75rem", color: "#d93838" }}>
                                Error
                              </MenuItem>
                              <MenuItem value="validationError" sx={{ fontSize: "0.75rem", color: "#d93838" }}>
                                Validation Error
                              </MenuItem>
                              <MenuItem
                                value="submitted"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                Submitted
                              </MenuItem>
                              <MenuItem
                                value="pending"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                Pending
                              </MenuItem>
                              <MenuItem
                                value="accepted"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                Accepted
                              </MenuItem>
                              <MenuItem value="paid" sx={{ fontSize: "0.75rem" }}>
                                Paid
                              </MenuItem>
                              <MenuItem
                                value="partial"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                Partial
                              </MenuItem>
                              <MenuItem
                                value="denied"
                                sx={{ fontSize: "0.75rem", color: "#d93838" }}
                              >
                                Denied
                              </MenuItem>
                              <MenuItem
                                value="rejected"
                                sx={{ fontSize: "0.75rem", color: "#d93838" }}
                              >
                                Rejected
                              </MenuItem>
                              <MenuItem
                                value="cancelled"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                Cancelled
                              </MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          <Typography
                            sx={{ fontFamily: "Inter, sans-serif", 
                              fontWeight: 500,
                              color: "#1e293b",
                              fontSize: "0.75rem",
                            }}
                          >
                            {claim.status}
                          </Typography>
                        )}
                      </TableCell>
                    )}

                    {/* Alerts Column right next to Status */}
                    {activeTab === 0 && (
                      <TableCell sx={{ pl: 3 }}>
                        {isError ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Button
                              size="small"
                              onClick={() => handleOpenInvalidInfo && handleOpenInvalidInfo(claim)}
                              sx={{
                                backgroundColor: "#e53e3e",
                                color: "#ffffff",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                textTransform: "none",
                                minWidth: "auto",
                                height: "22px",
                                py: 0,
                                px: 1,
                                borderRadius: "4px",
                                lineHeight: 1.2,
                                "&:hover": { backgroundColor: "#c53030" },
                              }}
                            >
                              Show Invalid info
                            </Button>
                            <Typography
                              onClick={() => handleRevalidate(claim.id)}
                              sx={{
                                color: "#3182ce",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              Revalidate
                            </Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ fontFamily: "Inter, sans-serif",  fontSize: "0.75rem", color: "#64748b" }}>—</Typography>
                        )}
                      </TableCell>
                    )}

                    {/* ERA Status */}
                    {(activeTab === 2 ||
                      activeTab === 3 ||
                      activeTab === 4) && (
                      <TableCell>
                        <Typography
                          sx={{ fontFamily: "Inter, sans-serif", 
                            color: claim.eraStatus ? "#d93838" : "#64748b",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        >
                          {claim.eraStatus || "—"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Clearing House Status Message */}
                    {(activeTab === 1 ||
                      activeTab === 2 ||
                      activeTab === 3 ||
                      activeTab === 4 ||
                      activeTab === 5) && (
                      <TableCell
                        sx={{ maxWidth: "120px", verticalAlign: "top" }}
                      >
                        <Typography
                          noWrap={!isExpanded && !expandAllMessages}
                          sx={{ fontFamily: "Inter, sans-serif",  fontSize: "0.75rem",
                            color: "#1e293b",
                            fontWeight: 500,
                            whiteSpace:
                              isExpanded || expandAllMessages
                                ? "normal"
                                : "nowrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {claim.clearingHouseMessage || "—"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Submitted Value */}
                    {activeTab === 4 && (
                      <TableCell sx={{ verticalAlign: "top" }}>
                        <Typography sx={{ fontFamily: "Inter, sans-serif",  fontSize: "0.75rem", color: "#1a3a6b", fontWeight: 700 }}>
                          $
                          {(claim.submittedValue || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Notes icon */}
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleNoteOpen(e, claim.notes)}
                        sx={{
                          color: "#a0aec0",
                          "&:hover": { color: "#1a3a6b" },
                          p: 0.2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Box component="img" src={notesIcon} alt="notes" sx={{ width: 14, height: 14 }} />
                      </IconButton>
                    </TableCell>

                    {/* Description */}
                    <TableCell
                      sx={{
                        maxWidth: isExpanded || editingDescId === claim.id ? "400px" : "110px",
                        verticalAlign: "top",
                      }}
                      onDoubleClick={() => {
                        if (activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4) return;
                        if (editingDescId !== claim.id) {
                          handleDescDoubleClick(claim.id, claim.description);
                        }
                      }}
                    >
                      {editingDescId === claim.id ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TextField
                            size="small"
                            value={editingDescValue}
                            onChange={(e) => setEditingDescValue(e.target.value)}
                            fullWidth
                            autoFocus
                            multiline
                            maxRows={4}
                            disabled={isSavingDesc}
                            sx={{
                              '& .MuiInputBase-root': {
                                fontFamily: "Inter, sans-serif",
                                fontSize: "0.75rem",
                                p: 1,
                              }
                            }}
                          />
                          {isSavingDesc ? (
                            <CircularProgress size={20} sx={{ ml: 1 }} />
                          ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <IconButton size="small" onClick={() => handleDescSave(claim.id)} sx={{ p: 0.2 }}>
                                <SaveIcon fontSize="small" color="success" />
                              </IconButton>
                              <IconButton size="small" onClick={handleDescCancel} sx={{ p: 0.2 }}>
                                <CancelIcon fontSize="small" color="error" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      ) : isExpanded ? (
                        (() => {
                          let shortDesc = claim.description || "";
                          let longDesc = "";
                          if (claim.description.includes(" CC ")) {
                            const idx = claim.description.indexOf(" CC ");
                            shortDesc = claim.description.substring(0, idx);
                            longDesc = claim.description.substring(idx + 1);
                          } else if (claim.description.includes(" (KS6 ")) {
                            const idx = claim.description.indexOf(" (KS6 ");
                            shortDesc = claim.description.substring(0, idx);
                            longDesc = claim.description.substring(idx + 1);
                          }

                          return (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                alignItems: "stretch",
                              }}
                            >
                              <Typography
                                sx={{ fontFamily: "Inter, sans-serif", 
                                  color: "#475569",
                                  fontStyle: "italic",
                                  fontSize: "0.75rem",
                                  
                                }}
                              >
                                {shortDesc}
                              </Typography>
                              {longDesc && (
                                <Typography
                                  sx={{ fontFamily: "Inter, sans-serif", 
                                    color: "#1e293b",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    lineHeight: 1.3,
                                    backgroundColor: "#f8fafc",
                                    p: 1,
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "4px",
                                    fontSize: "0.75rem",
                                    
                                  }}
                                >
                                  {longDesc}
                                </Typography>
                              )}
                            </Box>
                          );
                        })()
                      ) : (
                        <Tooltip
                          title={claim.description || ""}
                          arrow
                          disableInteractive
                        >
                          <Typography
                            noWrap
                            sx={{ fontFamily: "Inter, sans-serif",  fontSize: "0.75rem",
                              color: "#475569",
                              fontStyle: "italic",
                              cursor: "pointer",
                            }}
                          >
                            {(() => {
                              if (claim.description.includes(" CC ")) {
                                return claim.description.split(" CC ")[0];
                              } else if (claim.description.includes(" (KS6 ")) {
                                return claim.description.split(" (KS6 ")[0];
                              }
                              return claim.description || "—";
                            })()}
                          </Typography>
                        </Tooltip>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 0.2,
                        }}
                      >
                        {activeTab === 5 ? (
                          <>
                            <Tooltip title="Edit Predetermination">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(claim)}
                                sx={{ color: "#7d9cc4", p: 0.2 }}
                              >
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Manage Attachments">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenAttach(claim)}
                                sx={{
                                  color: attachIconColor,
                                  transition: "color 0.2s",
                                  p: 0.2,
                                }}
                              >
                                <AttachFileIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Predetermination">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleDeletePredetermination(claim.id)
                                }
                                sx={{ p: 0.2 }}
                              >
                                <Box component="img" src={deleteIcon} alt="delete" sx={{ width: 14, height: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            {!(activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4) && (
                              <Tooltip title="Edit Claim">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenEdit(claim)}
                                  sx={{ color: "#7d9cc4", p: 0.2 }}
                                >
                                  <EditIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Manage Attachments">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenAttach(claim)}
                                sx={{
                                  color: attachIconColor,
                                  transition: "color 0.2s",
                                  p: 0.2,
                                }}
                              >
                                <AttachFileIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            {activeTab !== 4 && (
                              <Tooltip title="Preview Claim">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenPreview(claim)}
                                  sx={{ color: "#7d9cc4", p: 0.2 }}
                                >
                                  <VisibilityIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Procedure list detail */}
                  <TableRow>
                    <TableCell
                      colSpan={
                        activeTab === 4
                          ? 17
                          : activeTab === 5
                            ? 13
                            : activeTab === 2 || activeTab === 3
                              ? 14
                              : activeTab === 1
                                ? 12
                                : 11
                      }
                      sx={{ p: 0, border: "none" }}
                    >
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box
                          sx={{
                            p: 2.5,
                            backgroundColor: "#fcfdfd",
                            borderLeft: "3px solid #1a3a6b",
                            borderBottom: "1px solid #e0e6ed",
                          }}
                        >
                          <Table size="small" sx={{ mb: 1, border: '1px solid #e2e8f0', '& .MuiTableCell-root': { borderBottom: '1px solid #e2e8f0' } }}>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#eef4ff' }}>
                                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1, color: '#1e293b' }}>
                                  DOS
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1, color: '#1e293b' }}>
                                  Tooth #
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1, color: '#1e293b' }}>
                                  Surface
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1, color: '#1e293b' }}>
                                  Code
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1, color: '#1e293b' }}>
                                  Description
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1, color: '#1e293b' }}>
                                  Provider
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1, color: '#1e293b' }}>
                                  Total Submitted Amount
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {claim.procedures.map((proc, index) => (
                                <TableRow key={index} sx={{ backgroundColor: '#fff' }}>
                                  <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                                    {proc.dateOfService ? new Date(proc.dateOfService).toLocaleDateString() : (claim.createdDate ? new Date(claim.createdDate).toLocaleDateString() : '-')}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                                    {proc.tooth || '-'}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                                    {proc.surface || '-'}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                                    {proc.code || '-'}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                                    {proc.name || proc.description || '-'}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                                    {proc.providerName || (claim.treatingProvider ? `${claim.treatingProvider.firstName || ''} ${claim.treatingProvider.lastName || ''}`.trim() : null) || '-'}
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontSize: "0.75rem", py: 1 }}>
                                    ${proc.fee ? Number(proc.fee).toFixed(2) : '0.00'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
