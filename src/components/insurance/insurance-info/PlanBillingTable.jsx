import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Select,
  MenuItem,
  Menu,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { InfoOutlined as InfoIcon } from "@mui/icons-material";
import PhoneNumberInput from "../../shared/PhoneNumberInput";

const PlanBillingTable = ({ formData, handleInputChange, benefits, errors = {} }) => {
  const [templateAnchorEl, setTemplateAnchorEl] = useState(null);

  return (
    <Box sx={{ border: "1px solid #DFE5EC", borderRadius: 2, overflow: "hidden" }}>
      <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  p: "8px 16px",
                  height: "44px",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  bgcolor: "#f8f9fc",
                  width: "40%",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Insurance Plan <span style={{ color: "#d32f2f" }}>*</span>
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  height: "44px",
                  fontSize: "0.75rem",
                  width: "60%",
                  p: "0px 16px",
                  color: "#333",
                }}
              >
                <TextField
                  fullWidth
                  InputProps={{
                    sx: {
                      fontSize: "0.8rem",
                      color: "#333",
                      "& fieldset": { border: "none" },
                    },
                  }}
                  value={formData.insurancePlan || ""}
                  onChange={(e) =>
                    handleInputChange("insurancePlan", e.target.value)
                  }
                  required
                  error={!!errors.insurancePlan}
                  helperText={errors.insurancePlan}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  p: "8px 16px",
                  height: "44px",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  bgcolor: "#f8f9fc",
                  width: "40%",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Group Name <span style={{ color: "#d32f2f" }}>*</span>
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  height: "44px",
                  fontSize: "0.75rem",
                  width: "60%",
                  p: "0px 16px",
                  color: "#333",
                }}
              >
                <TextField
                  fullWidth
                  InputProps={{
                    sx: {
                      fontSize: "0.8rem",
                      color: "#333",
                      "& fieldset": { border: "none" },
                    },
                  }}
                  value={formData.groupName || ""}
                  onChange={(e) =>
                    handleInputChange("groupName", e.target.value)
                  }
                  required
                  error={!!errors.groupName}
                  helperText={errors.groupName}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  p: "8px 16px",
                  height: "44px",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  bgcolor: "#f8f9fc",
                  width: "40%",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  Group Number <span style={{ color: "#d32f2f" }}>*</span>
                  <Box component="span" onClick={(e) => e.stopPropagation()} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Tooltip
                      PopperProps={{ sx: { zIndex: 999999 } }}
                      title={
                        <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
                          If you don't have a group number, enter NA instead.
                        </Typography>
                      }
                      placement="top"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: '#ffffff',
                            color: '#1e3a8a',
                            border: '1px solid #1e3a8a',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                            borderRadius: '6px',
                            maxWidth: 260,
                            p: 1,
                            '& .MuiTooltip-arrow': {
                              color: '#ffffff',
                              '&::before': {
                                border: '1px solid #1e3a8a',
                                backgroundColor: '#ffffff',
                              },
                            },
                          },
                        },
                      }}
                    >
                      <InfoIcon sx={{ fontSize: 14, color: "#bdbdbd", cursor: "pointer", "&:hover": { color: "#2563eb" } }} />
                    </Tooltip>
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  height: "44px",
                  fontSize: "0.75rem",
                  width: "60%",
                  p: "0px 16px",
                  color: "#333",
                }}
              >
                <TextField
                  fullWidth
                  InputProps={{
                    sx: {
                      fontSize: "0.8rem",
                      color: "#333",
                      "& fieldset": { border: "none" },
                    },
                  }}
                  value={formData.groupNumber || ""}
                  onChange={(e) => {
                    const alphanumericValue = e.target.value.replace(
                      /[^a-zA-Z0-9\s-]/g,
                      "",
                    );
                    handleInputChange("groupNumber", alphanumericValue);
                  }}
                  placeholder="e.g. GRP-300871"
                  required
                  error={!!errors.groupNumber}
                  helperText={errors.groupNumber}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  p: "8px 16px",
                  height: "44px",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  bgcolor: "#f8f9fc",
                  width: "40%",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Phone Number
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  height: "44px",
                  fontSize: "0.75rem",
                  width: "60%",
                  p: "0px 16px",
                  color: "#333",
                }}
              >
                <PhoneNumberInput
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  sx={{
                    '& .react-tel-input .form-control': {
                      border: "none",
                      bgcolor: "transparent",
                      fontSize: "0.8rem",
                      color: "#333",
                    },
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  p: "8px 16px",
                  height: "44px",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  bgcolor: "#f8f9fc",
                  width: "40%",
                  color: "#666",
                }}
              ></TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  height: "44px",
                  fontSize: "0.75rem",
                  width: "60%",
                  p: "0px 16px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={formData.healthPlan}
                        onChange={(e) =>
                          handleInputChange("healthPlan", e.target.checked)
                        }
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                        Health Plan
                      </Typography>
                    }
                    sx={{ mr: 0 }}
                  />
                  <Tooltip
                    PopperProps={{ sx: { zIndex: 999999 } }}
                    title={
                      <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
                        Medical Insurance that covers Dental procedures
                      </Typography>
                    }
                    placement="top"
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: '#ffffff',
                          color: '#1e3a8a',
                          border: '1px solid #1e3a8a',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                          borderRadius: '6px',
                          maxWidth: 260,
                          p: 1,
                          '& .MuiTooltip-arrow': {
                            color: '#ffffff',
                            '&::before': {
                              border: '1px solid #1e3a8a',
                              backgroundColor: '#ffffff',
                            },
                          },
                        },
                      },
                    }}
                  >
                    <InfoIcon sx={{ fontSize: 14, color: "#bdbdbd", cursor: "pointer", "&:hover": { color: "#2563eb" }, ml: 0.2 }} />
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  p: "8px 16px",
                  height: "44px",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  bgcolor: "#f8f9fc",
                  width: "40%",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  Assignment of Benefits{" "}
                  <span style={{ color: "#d32f2f" }}>*</span>
                  <Box component="span" onClick={(e) => e.stopPropagation()} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Tooltip
                      PopperProps={{ sx: { zIndex: 999999 } }}
                      title={
                        <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
                          Assignment of Benefits is an authorization of payment. It indicates that the benefits paid from the insurance company will go directly to the office if pay to dentist is selected. It will also populate the signature of subscriber field on the claim form. If this is marked as non assignment the signature field on the claim form will be blank and payment will go directly to the patient.
                        </Typography>
                      }
                      placement="top"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: '#ffffff',
                            color: '#1e3a8a',
                            border: '1px solid #1e3a8a',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                            borderRadius: '6px',
                            maxWidth: 290,
                            p: 1,
                            '& .MuiTooltip-arrow': {
                              color: '#ffffff',
                              '&::before': {
                                border: '1px solid #1e3a8a',
                                backgroundColor: '#ffffff',
                              },
                            },
                          },
                        },
                      }}
                    >
                      <InfoIcon sx={{ fontSize: 14, color: "#bdbdbd", cursor: "pointer", "&:hover": { color: "#2563eb" } }} />
                    </Tooltip>
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #DFE5EC",
                  height: "44px",
                  fontSize: "0.75rem",
                  width: "60%",
                  p: "0px 16px",
                  color: "#333",
                }}
              >
                <Select
                  variant="standard"
                  fullWidth
                  value={formData.assignmentOfBenefits || 1}
                  onChange={(e) =>
                    handleInputChange("assignmentOfBenefits", e.target.value)
                  }
                  sx={{ fontSize: "0.8rem" }}
                >
                  {benefits.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: "none",
                  p: "8px 16px",
                  height: "44px",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  bgcolor: "#f8f9fc",
                  width: "40%",
                  color: "#666",
                }}
              ></TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  height: "44px",
                  fontSize: "0.75rem",
                  width: "60%",
                  p: "0px 16px",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={formData.saveAsTemplate}
                      onChange={(e) =>
                        handleInputChange("saveAsTemplate", e.target.checked)
                      }
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      Save as Template
                    </Typography>
                  }
                />
              </TableCell>
            </TableRow>
          </TableBody>
      </Table>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={(e) => setTemplateAnchorEl(e.currentTarget)}
          sx={{
            bgcolor: "#2362EF",
            borderRadius: "6px",
            textTransform: "none",
            fontWeight: 600,
            py: 1,
            fontSize: "0.8rem",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1b52cf" },
          }}
        >
          Copy Plan Billing Info From Template
        </Button>
      </Box>
      <Menu
        anchorEl={templateAnchorEl}
        open={Boolean(templateAnchorEl)}
        onClose={() => setTemplateAnchorEl(null)}
        PaperProps={{
          sx: {
            minWidth: templateAnchorEl ? `${templateAnchorEl.clientWidth}px` : "360px",
            maxWidth: "450px",
            maxHeight: 380,
            borderRadius: "8px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {formData.coverageTemplates?.length > 0 ? (
          formData.coverageTemplates.map((template, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                setTemplateAnchorEl(null);
                if (formData.handleApplyTemplate) {
                  formData.handleApplyTemplate(template);
                }
              }}
              sx={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                alignItems: "flex-start",
                py: 1.25,
                px: 2,
                borderBottom: idx < formData.coverageTemplates.length - 1 ? "1px solid #f1f5f9" : "none",
                "&:hover": {
                  bgcolor: "#f8fafc",
                },
              }}
            >
              <ListItemText
                primary={template.name || "Unnamed Template"}
                secondary={template.description || "No description available"}
                primaryTypographyProps={{
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  lineHeight: 1.35,
                }}
                secondaryTypographyProps={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  lineHeight: 1.35,
                  mt: 0.25,
                }}
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <ListItemText primary="No templates available" />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default PlanBillingTable;
