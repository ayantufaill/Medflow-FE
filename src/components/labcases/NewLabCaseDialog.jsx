import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  fetchProcedureCodes,
  selectProcedureCodes,
  selectProcedureCodesLoading,
} from "../../store/slices/feeGuideSlice";
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
} from "../../store/slices/providerSlice";
import apiClient from "../../config/api";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, roundedAutocompletePaperSx } from "../../constants/styles";

const STATUS_OPTIONS = ["Draft", "Sent", "Received", "Returned", "Ready", "Complete"];

const DEFAULT_LABS = [
  { _id: "1", name: "Dental Arts Lab" },
  { _id: "2", name: "Glidewell Laboratories" },
  { _id: "3", name: "MicroDental Laboratories" },
];

const fieldLabelSx = {
  fontFamily: "Inter",
  fontWeight: 700,
  fontSize: "14px",
  color: "#0f172a",
  mb: 1,
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    fontFamily: "Inter",
    fontSize: "13px",
    "& fieldset": { borderColor: "#cbd5e1" },
    "&:hover fieldset": { borderColor: "#94a3b8" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
  },
  "& .MuiInputBase-input::placeholder": { color: "#94a3b8" },
};

const subLabelSx = {
  fontFamily: "Inter",
  fontWeight: 600,
  fontSize: "12px",
  color: "#334155",
  mb: 1,
};

const NewLabCaseDialog = ({
  open,
  onClose,
  title,
  heading = "New Lab Case",
  submitLabel = "Save",
  formData,
  onFormChange,
  onSubmit,
  providerOptions = null,
  typeOptions = null,
}) => {
  const dispatch = useDispatch();
  const procedureCodes = useSelector(selectProcedureCodes) || [];
  const procedureCodesLoading = useSelector(selectProcedureCodesLoading);
  const dropdownProviders = useSelector(selectProviderDropdownList) || [];
  const [labs, setLabs] = useState(DEFAULT_LABS);

  useEffect(() => {
    if (open && procedureCodes.length === 0 && !procedureCodesLoading) {
      dispatch(fetchProcedureCodes({ limit: 2000 }));
    }
  }, [open, dispatch, procedureCodes.length, procedureCodesLoading]);

  useEffect(() => {
    if (open && dropdownProviders.length === 0) {
      dispatch(fetchAllProvidersForDropdown());
    }
  }, [open, dispatch, dropdownProviders.length]);

  const effectiveProviderOptions =
    providerOptions ||
    (dropdownProviders.length > 0
      ? dropdownProviders.map((p) => {
          const name = `${p.FName || ""} ${p.LName || ""}`.trim() || p.name || `Provider #${p.ProvNum || p.id}`;
          return { value: name, label: name };
        })
      : null);

  const effectiveTypeOptions =
    typeOptions || ["Crown", "Bridge", "Denture", "Retainer", "Nightguard", "Implant", "Treatment", "Other"];

  useEffect(() => {
    if (!open) return;
    const fetchLabs = async () => {
      try {
        const response = await apiClient.get("/lab-cases/laboratories");
        const list = response?.data?.data?.laboratories || response?.data?.laboratories || [];
        if (Array.isArray(list) && list.length > 0) {
          setLabs(
            list.map((lab) => ({
              _id: lab._id || lab.id,
              name: lab.name || lab.description || "Laboratory",
            }))
          );
        }
      } catch (err) {
        console.warn("Could not fetch laboratories, using default labs:", err);
      }
    };
    fetchLabs();
  }, [open]);

  const handleChange = (e) => onFormChange({ ...formData, [e.target.name]: e.target.value });

  const handleDateChange = (name) => (value) =>
    onFormChange({
      ...formData,
      [name]: value ? value.format("YYYY-MM-DD") : "",
    });

  const procedures = formData.procedures || [];

  const handleAddProcedure = () => {
    onFormChange({ ...formData, procedures: [...procedures, ""] });
  };

  const handleProcedureChange = (index, value) => {
    const next = procedures.map((p, i) => (i === index ? value : p));
    onFormChange({ ...formData, procedures: next });
  };

  const handleRemoveProcedure = (index) => {
    const next = procedures.filter((_, i) => i !== index);
    onFormChange({ ...formData, procedures: next });
  };

  const procCodeValue = (value) =>
    procedureCodes.find(
      (opt) => String(opt.ProcCode || opt.code) === String(value || "")
    ) || null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0px 10px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0",
          py: 1.8,
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "15px",
            color: "#64748b",
          }}
        >
          Patients / {title} / Lab Cases /{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>
            {heading}
          </Box>
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: "#94a3b8", "&:hover": { color: "#334155" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogContent
          sx={{
            p: 3,
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
        {/* ─── Patient & Date ─────────────────────────────── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 14px", mt: 1 }}>
          <Box>
            <Typography sx={fieldLabelSx}>Patient</Typography>
            <TextField
              size="small"
              name="patient"
              value={formData.patient || title}
              onChange={handleChange}
              fullWidth
              sx={fieldSx}
            />
          </Box>

          <Box>
            <Typography sx={fieldLabelSx}>Date</Typography>
            <DatePicker
              value={formData.date ? dayjs(formData.date) : null}
              onChange={handleDateChange("date")}
              format="MM/DD/YYYY"
              slotProps={{
                popper: { sx: { zIndex: 10000 } },
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: fieldSx,
                },
              }}
            />
          </Box>
        </Box>

        {/* ─── Select Procedure ───────────────────────────── */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography sx={{ ...fieldLabelSx, mb: 0 }}>Select Procedure</Typography>
            <IconButton
              size="small"
              onClick={handleAddProcedure}
              aria-label="Add procedure"
              sx={{
                color: "#2563eb",
                "&:hover": { backgroundColor: "rgba(37, 99, 235, 0.08)" },
              }}
            >
              <AddCircleIcon fontSize="small" />
            </IconButton>
          </Box>

          {procedures.length === 0 ? (
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "12px",
                color: "#94a3b8",
                fontStyle: "italic",
              }}
            >
              No procedures added. Click the + icon to add one.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {procedures.map((procedure, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Autocomplete
                    options={procedureCodes}
                    loading={procedureCodesLoading}
                    openOnFocus
                    popupIcon={<KeyboardArrowDownIcon sx={{ color: COLORS.TEXT_SECONDARY }} />}
                    value={procCodeValue(procedure)}
                    onChange={(_, value) =>
                      handleProcedureChange(index, value ? String(value.ProcCode || value.code) : "")
                    }
                    isOptionEqualToValue={(option, value) =>
                      String(option.ProcCode || option.code) === String(value?.ProcCode || value?.code)
                    }
                    getOptionLabel={(option) =>
                      `${option.ProcCode || option.code || ""} - ${option.Descript || option.name || option.AbbrDesc || ""}`
                    }
                    filterOptions={(options, state) => {
                      const input = state.inputValue.toLowerCase().trim();
                      if (!input) return options;
                      return options.filter((opt) => {
                        const code = (opt.ProcCode || opt.code || "").toLowerCase();
                        const desc = (opt.Descript || opt.name || opt.AbbrDesc || "").toLowerCase();
                        return code.includes(input) || desc.includes(input);
                      });
                    }}
                    renderOption={(props, option) => {
                      const { key, ...restProps } = props;
                      return (
                        <Box component="li" key={key} {...restProps} sx={{ display: "flex", alignItems: "center", gap: 1, py: "6px !important" }}>
                          <Typography sx={{ minWidth: 72, fontSize: fontSize.md, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
                            {option.ProcCode || option.code}
                          </Typography>
                          <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                            {option.Descript || option.description || option.name || option.AbbrDesc || ""}
                          </Typography>
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder={`Procedure ${index + 1} — search code or description`}
                        sx={fieldSx}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {procedureCodesLoading ? (
                                <CircularProgress color="inherit" size={14} sx={{ mr: 0.75 }} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    slotProps={{ popper: { sx: { zIndex: 10000 } }, paper: { sx: roundedAutocompletePaperSx } }}
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveProcedure(index)}
                    aria-label={`Remove procedure ${index + 1}`}
                    sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444" } }}
                  >
                    <RemoveCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* ─── Details ────────────────────────────────────── */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ ...fieldLabelSx, mb: 1.5 }}>Details</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 14px" }}>
              {effectiveProviderOptions && (
                <Box>
                  <Typography sx={subLabelSx}>Provider</Typography>
                  <TextField
                    size="small"
                    select
                    name="provider"
                    value={formData.provider || ""}
                    onChange={handleChange}
                    fullWidth
                    displayEmpty
                    sx={fieldSx}
                    SelectProps={{
                      MenuProps: { sx: { zIndex: 10000 } },
                    }}
                  >
                    <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#94a3b8" }}>
                      Select provider
                    </MenuItem>
                    {effectiveProviderOptions.map((opt) => (
                      <MenuItem
                        key={opt.value}
                        value={opt.value}
                        sx={{ fontFamily: "Inter", fontSize: "13px" }}
                      >
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}

              {effectiveTypeOptions && (
                <Box>
                  <Typography sx={subLabelSx}>Type</Typography>
                  <TextField
                    size="small"
                    select
                    name="type"
                    value={formData.type || ""}
                    onChange={handleChange}
                    fullWidth
                    displayEmpty
                    sx={fieldSx}
                    SelectProps={{
                      MenuProps: { sx: { zIndex: 10000 } },
                    }}
                  >
                    <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#94a3b8" }}>
                      Select type
                    </MenuItem>
                    {effectiveTypeOptions.map((opt) => (
                      <MenuItem
                        key={opt}
                        value={opt}
                        sx={{ fontFamily: "Inter", fontSize: "13px" }}
                      >
                        {String(opt).charAt(0).toUpperCase() + String(opt).slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}

            <Box>
              <Typography sx={{ fontFamily: "Inter", fontWeight: 600, fontSize: "12px", color: "#334155", mb: 1 }}>
                Select Lab
              </Typography>
              <TextField
                size="small"
                select
                name="lab"
                value={formData.lab || ""}
                onChange={handleChange}
                fullWidth
                displayEmpty
                sx={fieldSx}
                SelectProps={{
                  MenuProps: {
                    sx: { zIndex: 10000 },
                    PaperProps: { sx: { mt: "4px", borderRadius: "8px", border: "1px solid #e0e5eb", boxShadow: "0px 4px 20px rgba(0,0,0,0.12)" } },
                  },
                }}
              >
                <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#94a3b8" }}>
                  Select a lab
                </MenuItem>
                {labs.map((lab) => (
                  <MenuItem key={lab._id} value={lab.name} sx={{ fontFamily: "Inter", fontSize: "13px" }}>
                    {lab.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography sx={{ fontFamily: "Inter", fontWeight: 600, fontSize: "12px", color: "#334155", mb: 1 }}>
                Tracking Number
              </Typography>
              <TextField
                size="small"
                name="trackingNumber"
                placeholder="e.g. 1Z999AA10123456784"
                value={formData.trackingNumber || ""}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
              />
            </Box>

            <Box>
              <Typography sx={{ fontFamily: "Inter", fontWeight: 600, fontSize: "12px", color: "#334155", mb: 1 }}>
                Est Receive Date
              </Typography>
              <DatePicker
                value={formData.estReceiveDate ? dayjs(formData.estReceiveDate) : null}
                onChange={handleDateChange("estReceiveDate")}
                format="MM/DD/YYYY"
                slotProps={{
                  popper: { sx: { zIndex: 10000 } },
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: fieldSx,
                  },
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ fontFamily: "Inter", fontWeight: 600, fontSize: "12px", color: "#334155", mb: 1 }}>
                Status
              </Typography>
              <TextField
                size="small"
                select
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                SelectProps={{
                  MenuProps: { sx: { zIndex: 10000 } },
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt} sx={{ fontFamily: "Inter", fontSize: "13px" }}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography sx={{ fontFamily: "Inter", fontWeight: 600, fontSize: "12px", color: "#334155", mb: 1 }}>
                Notes
              </Typography>
              <TextField
                size="small"
                name="notes"
                placeholder="Add notes about this lab case..."
                value={formData.notes || ""}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={4}
                sx={fieldSx}
              />
            </Box>
          </Box>
          </Box>

          {/* ─── Cost ─────────────────────────────────────── */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ ...fieldLabelSx, mb: 1.5 }}>Cost</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 14px" }}>
              <Box>
                <Typography sx={{ fontFamily: "Inter", fontWeight: 600, fontSize: "12px", color: "#334155", mb: 1 }}>
                  Shipping
                </Typography>
                <TextField
                  size="small"
                  name="shipping"
                  placeholder="0.00"
                  value={formData.shipping || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldSx}
                  slotProps={{
                    input: { startAdornment: <Typography sx={{ mr: 0.75, color: "#94a3b8", fontSize: "13px" }}>$</Typography> },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontFamily: "Inter", fontWeight: 600, fontSize: "12px", color: "#334155", mb: 1 }}>
                  Lab Fee
                </Typography>
                <TextField
                  size="small"
                  name="labFee"
                  placeholder="0.00"
                  value={formData.labFee || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldSx}
                  slotProps={{
                    input: { startAdornment: <Typography sx={{ mr: 0.75, color: "#94a3b8", fontSize: "13px" }}>$</Typography> },
                  }}
                />
              </Box>

              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography sx={{ fontFamily: "Inter", fontWeight: 600, fontSize: "12px", color: "#334155", mb: 1 }}>
                  Total Amount
                </Typography>
                <TextField
                  size="small"
                  value={`$${((parseFloat(formData.shipping) || 0) + (parseFloat(formData.labFee) || 0)).toFixed(2)}`}
                  fullWidth
                  readOnly
                  sx={{
                    ...fieldSx,
                    "& .MuiOutlinedInput-root": {
                      ...fieldSx["& .MuiOutlinedInput-root"],
                      backgroundColor: "#f8fafc",
                      "& fieldset": { borderColor: "#e2e8f0" },
                    },
                    "& .MuiInputBase-input": { fontWeight: 700, color: "#0f172a" },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </LocalizationProvider>

      <DialogActions
        sx={{
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "center",
          gap: 1.5,
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            px: 3.5,
            py: 0.7,
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            color: "#374151",
            fontFamily: "Inter",
            fontSize: "13px",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#f8fafc", borderColor: "#94a3b8" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={onSubmit}
          sx={{
            textTransform: "none",
            px: 3.5,
            py: 0.7,
            borderRadius: "6px",
            backgroundColor: "#e2eafc",
            color: "#2563eb",
            fontFamily: "Inter",
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#2563eb",
              color: "#ffffff",
              boxShadow: "none",
            },
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewLabCaseDialog;
