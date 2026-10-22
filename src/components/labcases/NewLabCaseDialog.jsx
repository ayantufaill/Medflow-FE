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
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
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
import { fontSize, fontWeight, radius, roundedAutocompletePaperSx, standardFieldSx } from "../../constants/styles";

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

const scheduleLabelSx = {
  fontFamily: "Inter",
  fontWeight: fontWeight.semibold,
  fontSize: fontSize.base,
  color: COLORS.TEXT_SECONDARY,
  mb: 0.75,
};

const scheduleFieldSx = {
  ...standardFieldSx,
  "& .MuiOutlinedInput-root": {
    ...standardFieldSx["& .MuiOutlinedInput-root"],
    backgroundColor: COLORS.SURFACE_CARD,
  },
  "& .MuiOutlinedInput-input": {
    ...standardFieldSx["& .MuiOutlinedInput-input"],
    fontSize: fontSize.md,
  },
};

const scheduleGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 2,
};

const NewLabCaseDialog = ({
  scheduleStyle = false,
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

  const activeFieldSx = scheduleStyle ? scheduleFieldSx : fieldSx;
  const activeLabelSx = scheduleStyle ? scheduleLabelSx : fieldLabelSx;
  const activeSubLabelSx = scheduleStyle ? scheduleLabelSx : subLabelSx;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="lab-case-dialog-title"
      fullWidth
      maxWidth={scheduleStyle ? "md" : "sm"}
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: scheduleStyle
          ? { borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, overflow: "hidden", boxShadow: "0px 8px 24px rgba(0,0,0,0.1)" }
          : { borderRadius: "10px", overflow: "hidden", boxShadow: "0px 10px 40px rgba(0,0,0,0.12)" },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: scheduleStyle ? "flex-start" : "space-between",
          gap: scheduleStyle ? 1.5 : 0,
          borderBottom: `1px solid ${scheduleStyle ? COLORS.BORDER : "#e2e8f0"}`,
          backgroundColor: scheduleStyle ? COLORS.SURFACE_TINT : COLORS.SURFACE_CARD,
          py: scheduleStyle ? 1.25 : 1.8,
          px: scheduleStyle ? { xs: 2, sm: 2.5 } : 3,
        }}
      >
        {scheduleStyle ? (
          <>
            <Box sx={{ width: 36, height: 36, borderRadius: radius.md, backgroundColor: "#eff6ff", color: COLORS.ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ScienceOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography id="lab-case-dialog-title" component="h2" sx={{ fontFamily: "Inter", fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
                {heading}
              </Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>
                Lab case details{title ? ` for ${title}` : ""}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography id="lab-case-dialog-title" component="h2" sx={{ fontFamily: "Inter", fontSize: "15px", color: "#64748b" }}>
            Patients / {title} / Lab Cases /{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>{heading}</Box>
          </Typography>
        )}
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close lab case dialog"
          sx={scheduleStyle ? { color: COLORS.TEXT_SECONDARY } : { color: "#94a3b8", "&:hover": { color: "#334155" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogContent
          sx={{
            p: scheduleStyle ? { xs: 2, sm: 3 } : 3,
            ...(scheduleStyle ? { ".MuiDialogTitle-root + &": { pt: { xs: 2, sm: 3 } } } : {}),
            maxHeight: "75vh",
            overflowY: "auto",
            backgroundColor: scheduleStyle ? COLORS.SURFACE_CARD : undefined,
          }}
        >
        {/* ─── Patient & Date ─────────────────────────────── */}
        <Box sx={scheduleStyle ? { ...scheduleGridSx, mt: 0 } : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 14px", mt: 1 }}>
          <Box>
            <Typography sx={activeLabelSx}>Patient</Typography>
            <TextField
              size="small"
              name="patient"
              value={formData.patient || title}
              onChange={handleChange}
              fullWidth
              sx={activeFieldSx}
            />
          </Box>

          <Box>
            <Typography sx={activeLabelSx}>Date</Typography>
            <DatePicker
              value={formData.date ? dayjs(formData.date) : null}
              onChange={handleDateChange("date")}
              format="MM/DD/YYYY"
              slotProps={{
                popper: { sx: { zIndex: 10000 } },
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: activeFieldSx,
                },
              }}
            />
          </Box>
        </Box>

        {/* ─── Select Procedure ───────────────────────────── */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography sx={{ ...activeLabelSx, ...(scheduleStyle ? { fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY } : {}), mb: 0 }}>Select Procedure</Typography>
            <IconButton
              size="small"
              onClick={handleAddProcedure}
              aria-label="Add procedure"
              sx={{
                color: scheduleStyle ? COLORS.ACCENT : "#2563eb",
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
                        sx={activeFieldSx}
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
            <Typography sx={{ ...activeLabelSx, ...(scheduleStyle ? { fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY } : {}), mb: 1.5 }}>Details</Typography>
            <Box sx={scheduleStyle ? scheduleGridSx : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 14px" }}>
              {effectiveProviderOptions && (
                <Box>
                  <Typography sx={activeSubLabelSx}>Provider</Typography>
                  <TextField
                    size="small"
                    select
                    name="provider"
                    value={formData.provider || ""}
                    onChange={handleChange}
                    fullWidth
                    displayEmpty
                    sx={activeFieldSx}
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
                  <Typography sx={activeSubLabelSx}>Type</Typography>
                  <TextField
                    size="small"
                    select
                    name="type"
                    value={formData.type || ""}
                    onChange={handleChange}
                    fullWidth
                    displayEmpty
                    sx={activeFieldSx}
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
              <Typography sx={activeSubLabelSx}>
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
                sx={activeFieldSx}
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
              <Typography sx={activeSubLabelSx}>
                Tracking Number
              </Typography>
              <TextField
                size="small"
                name="trackingNumber"
                placeholder="e.g. 1Z999AA10123456784"
                value={formData.trackingNumber || ""}
                onChange={handleChange}
                fullWidth
                sx={activeFieldSx}
              />
            </Box>

            <Box>
              <Typography sx={activeSubLabelSx}>
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
                    sx: activeFieldSx,
                  },
                }}
              />
            </Box>

            <Box>
              <Typography sx={activeSubLabelSx}>
                Status
              </Typography>
              <TextField
                size="small"
                select
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                sx={activeFieldSx}
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
              <Typography sx={activeSubLabelSx}>
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
                sx={activeFieldSx}
              />
            </Box>
          </Box>
          </Box>

          {/* ─── Cost ─────────────────────────────────────── */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ ...activeLabelSx, ...(scheduleStyle ? { fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY } : {}), mb: 1.5 }}>Cost</Typography>
            <Box sx={scheduleStyle ? scheduleGridSx : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 14px" }}>
              <Box>
                <Typography sx={activeSubLabelSx}>
                  Shipping
                </Typography>
                <TextField
                  size="small"
                  name="shipping"
                  placeholder="0.00"
                  value={formData.shipping || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={activeFieldSx}
                  slotProps={{
                    input: { startAdornment: <Typography sx={{ mr: 0.75, color: "#94a3b8", fontSize: "13px" }}>$</Typography> },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={activeSubLabelSx}>
                  Lab Fee
                </Typography>
                <TextField
                  size="small"
                  name="labFee"
                  placeholder="0.00"
                  value={formData.labFee || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={activeFieldSx}
                  slotProps={{
                    input: { startAdornment: <Typography sx={{ mr: 0.75, color: "#94a3b8", fontSize: "13px" }}>$</Typography> },
                  }}
                />
              </Box>

              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography sx={activeSubLabelSx}>
                  Total Amount
                </Typography>
                <TextField
                  size="small"
                  value={`$${((parseFloat(formData.shipping) || 0) + (parseFloat(formData.labFee) || 0)).toFixed(2)}`}
                  fullWidth
                  readOnly
                  sx={{
                    ...activeFieldSx,
                    "& .MuiOutlinedInput-root": {
                      ...activeFieldSx["& .MuiOutlinedInput-root"],
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
          py: scheduleStyle ? 1.5 : 2,
          px: scheduleStyle ? { xs: 2, sm: 3 } : 3,
          display: "flex",
          justifyContent: scheduleStyle ? "flex-end" : "center",
          gap: scheduleStyle ? 1 : 1.5,
          borderTop: `1px solid ${scheduleStyle ? COLORS.BORDER : "#f1f5f9"}`,
          backgroundColor: scheduleStyle ? COLORS.SURFACE_CARD : undefined,
        }}
      >
        <Button
          variant={scheduleStyle ? "outlined" : "text"}
          onClick={onClose}
          sx={scheduleStyle ? {
            textTransform: "none",
            px: 2,
            py: 0.875,
            borderRadius: radius.md,
            borderColor: "#d0d5dd",
            color: COLORS.TEXT_BODY,
            fontFamily: "Inter",
            fontSize: fontSize.md,
            fontWeight: fontWeight.medium,
            "&:hover": { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED },
          } : {
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
          sx={scheduleStyle ? {
            textTransform: "none",
            px: 2.5,
            py: 0.875,
            borderRadius: radius.md,
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            fontFamily: "Inter",
            fontSize: fontSize.md,
            fontWeight: fontWeight.semibold,
            boxShadow: "none",
            "&:hover": { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: "none" },
          } : {
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
