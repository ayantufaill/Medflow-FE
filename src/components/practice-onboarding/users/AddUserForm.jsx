import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  IconButton,
  FormHelperText,
  CircularProgress
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createUser } from "../../../store/slices/userSlice";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useRoles } from "../../../hooks/queries/useRoles";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const FormField = ({ label, required, error, helperText, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 500,
        color: "#6B7280",
        fontSize: "0.75rem",
        mb: 0.5,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {label}
      {required && (
        <Box component="span" sx={{ color: "#EF4444", ml: 0.2 }}>
          *
        </Box>
      )}
    </Typography>
    {children}
    {error && helperText && (
      <FormHelperText error sx={{ fontSize: "0.65rem", mt: 0.25, ml: 0 }}>
        {helperText}
      </FormHelperText>
    )}
  </Box>
);

const CardSection = ({ title, children, sx = {} }) => (
  <Box
    sx={{
      bgcolor: "#FFFFFF",
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      mb: 2,
      ...sx
    }}
  >
    <Box sx={{ 
      bgcolor: "#F3F8FD", 
      height: "36px", 
      display: "flex", 
      justifyContent: "space-between",
      alignItems: "center", 
      px: 2, 
      borderBottom: "1px solid #E5E7EB",
      borderRadius: "12px 12px 0 0",
    }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: "#111827",
          fontSize: "0.85rem",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        {title}
      </Typography>
      <InfoOutlinedIcon sx={{ fontSize: "1.1rem", color: "#3B82F6" }} />
    </Box>
    <Box sx={{ p: 2.5 }}>
      {children}
    </Box>
  </Box>
);

const AddUserForm = ({ onSave, onCancel, providers = [] }) => {
  const { showSnackbar } = useSnackbar();
  const { data: allRoles = [] } = useRoles();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      roles: [],
      email: "",
      providerId: "",
    },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        roles: data.roles,
        providerId: data.providerId || undefined,
      };
      const created = await dispatch(createUser(payload)).unwrap();
      showSnackbar("User added successfully", "success");
      reset();
      onSave(created?.user || created);
    } catch (err) {
      showSnackbar(err || "Failed to add user", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      height: "36px",
      borderRadius: "8px",
      bgcolor: "#FFFFFF",
      "& fieldset": { borderColor: "#E5E7EB" },
      "&:hover fieldset": { borderColor: "#D1D5DB" },
      "&.Mui-focused fieldset": { borderColor: "#3B82F6", borderWidth: "1px" },
    },
    "& .MuiInputBase-input": {
      fontSize: "0.875rem",
      color: "#111827",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      paddingTop: "0 !important",
      paddingBottom: "0 !important",
      height: "100% !important",
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        bgcolor: "#FBFCFD",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <Box
        sx={{
          bgcolor: "#F1F5FD",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "73px",
          px: "17px",
          borderBottom: "1px solid #E5E7EB",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3B82F6",
            }}
          >
            <PersonAddAlt1Icon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem" }}>
              Add Users
            </Typography>
            <Typography sx={{ color: "#6B7280", fontSize: "0.75rem", mt: -0.25 }}>
              Add new Users
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onCancel} size="small" sx={{ color: "#9CA3AF" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Form Body */}
      <Box sx={{ py: "13.5px", px: "17px" }}>
        <CardSection 
          title="Personal Information"
          sx={{ height: "302px", display: "flex", flexDirection: "column", mb: 0 }}
        >
          {/* Grid Layout: 4 columns */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {/* Row 1 */}
            <FormField label="First Name" required error={!!errors.firstName} helperText={errors.firstName?.message}>
              <TextField fullWidth placeholder="Enter First Name" {...register("firstName", { required: "Required" })} sx={inputStyles} />
            </FormField>

            <FormField label="Last Name" required error={!!errors.lastName} helperText={errors.lastName?.message}>
              <TextField fullWidth placeholder="Enter Last Name" {...register("lastName", { required: "Required" })} sx={inputStyles} />
            </FormField>

            <FormField label="User Name">
              <TextField fullWidth placeholder="Enter User Name" {...register("username")} sx={inputStyles} />
            </FormField>

            <FormField label="Roles">
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <TextField 
                    select
                    {...field}
                    fullWidth 
                    sx={inputStyles}
                    SelectProps={{
                      multiple: true,
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (selected.length === 0) return <span style={{ color: "#9CA3AF" }}>Enter Role</span>;
                        return selected.join(', ');
                      }
                    }}
                  >
                    <MenuItem value="" disabled sx={{ display: 'none' }}>
                      Enter Role
                    </MenuItem>
                    {allRoles.map((role) => (
                      <MenuItem key={role._id || role.id} value={role.name} sx={{ fontSize: "0.875rem" }}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormField>

            {/* Row 2 */}
            <FormField label="Email" required error={!!errors.email} helperText={errors.email?.message}>
              <TextField fullWidth type="email" placeholder="Enter Your Email" {...register("email", { required: "Required" })} sx={inputStyles} />
            </FormField>

            <FormField label="Provider">
              <Controller
                name="providerId"
                control={control}
                render={({ field }) => (
                  <TextField 
                    select
                    {...field}
                    fullWidth 
                    sx={inputStyles}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (!selected) return <span style={{ color: "#9CA3AF" }}>Enter Provider Name</span>;
                        const p = providers.find(p => (p._id || p.id) === selected);
                        if (!p) return selected;
                        return p.userId?.firstName 
                          ? `${p.userId.firstName} ${p.userId.lastName || ""}`.trim()
                          : `${p.firstName} ${p.lastName || ""}`.trim();
                      }
                    }}
                  >
                    <MenuItem value="" disabled sx={{ display: 'none' }}>
                      Enter Provider Name
                    </MenuItem>
                    {providers.map((p) => {
                      const name = p.userId?.firstName
                        ? `${p.userId.firstName} ${p.userId.lastName || ""}`.trim()
                        : p.firstName
                          ? `${p.firstName} ${p.lastName || ""}`.trim()
                          : "Unknown";
                      return (
                        <MenuItem
                          key={p._id || p.id}
                          value={p._id || p.id}
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                )}
              />
            </FormField>
          </Box>
          
          {/* Form Actions (Moved inside CardSection to match Figma) */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: "auto", pt: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={saving}
              sx={{
                textTransform: "none",
                color: "#374151",
                borderColor: "#D1D5DB",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                py: 0.75,
                fontSize: "0.875rem",
                "&:hover": { bgcolor: "#F9FAFB", borderColor: "#9CA3AF" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{
                textTransform: "none",
                bgcolor: "#2362EF",
                fontWeight: 600,
                borderRadius: "8px",
                px: 4,
                py: 0.75,
                fontSize: "0.875rem",
                boxShadow: "none",
                "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
              }}
            >
              {saving ? "Saving..." : "Apply"}
            </Button>
          </Box>
        </CardSection>
      </Box>
    </Box>
  );
};

export default AddUserForm;
