import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import {
  KeyboardDoubleArrowLeft, Close,
  AlternateEmailOutlined, HubOutlined, CalendarTodayOutlined, AccessTimeOutlined,
} from "@mui/icons-material";

/* ── atoms ─────────────────────────────────────────────────── */
const FieldLabel = ({ children, required }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "4px", mb: "6px" }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#09121f" }}>
      {children}
    </Typography>
    {required && <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#ef4444" }}>*</Typography>}
  </Box>
);

const IconFieldLabel = ({ icon, label, extra }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "8px" }}>
    <Box sx={{
      width: 24, height: 24, borderRadius: "50%",
      backgroundColor: "rgba(34,98,239,0.12)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Box sx={{ color: "#2262ef", display: "flex" }}>{icon}</Box>
    </Box>
    <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#09121f" }}>
      {label}
    </Typography>
    {extra && <><Box sx={{ flex: 1 }} />{extra}</>}
  </Box>
);

const FieldInput = ({ placeholder, defaultValue, focused = false }) => (
  <Box
    component="input"
    placeholder={placeholder}
    defaultValue={defaultValue}
    sx={{
      display: "block", width: "100%", boxSizing: "border-box",
      border: `1px solid ${focused ? "#2262ef" : "#e0e5eb"}`,
      borderRadius: "8px",
      px: "12px", height: "40px",
      fontFamily: "Inter", fontSize: "13px", color: "#374151",
      outline: "none", backgroundColor: "#fff",
      "&::placeholder": { color: "#c4cbd4" },
      "&:focus": { borderColor: "#2262ef" },
    }}
  />
);

const FieldTextarea = ({ placeholder }) => (
  <Box
    component="textarea"
    placeholder={placeholder}
    rows={4}
    sx={{
      display: "block", width: "100%", boxSizing: "border-box",
      border: "1px solid #e0e5eb", borderRadius: "8px",
      px: "12px", py: "10px",
      fontFamily: "Inter", fontSize: "13px", color: "#374151",
      resize: "none", outline: "none", backgroundColor: "#fff",
      "&::placeholder": { color: "#c4cbd4" },
      "&:focus": { borderColor: "#2262ef" },
    }}
  />
);

const FormSection = ({ children }) => (
  <Box sx={{ mb: "18px" }}>{children}</Box>
);

/* ═══════════════════════════════════════════════════════════ */
const AddTaskForm = ({ onBack, onClose }) => {
  const [ampm, setAmpm] = useState("AM");

  return (
    <>
      {/* Header */}
      <Box sx={{
        display: "flex", alignItems: "center", gap: "8px",
        px: "20px", py: "14px",
        borderBottom: "1px solid #f0f2f5",
        flexShrink: 0,
      }}>
        <IconButton onClick={onBack} size="small" sx={{ color: "#2262ef", "&:hover": { backgroundColor: "rgba(34,98,239,0.08)" } }}>
          <KeyboardDoubleArrowLeft sx={{ fontSize: "18px" }} />
        </IconButton>
        <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f", flex: 1 }}>
          Add a Task
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#9aa3ae", "&:hover": { backgroundColor: "#f5f7fa" } }}>
          <Close sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>

      {/* Scrollable form body */}
      <Box sx={{ flex: 1, overflowY: "auto", px: "20px", py: "20px" }}>

        {/* Title */}
        <FormSection>
          <FieldLabel required>Title</FieldLabel>
          <FieldInput placeholder="Enter Title (required)" />
        </FormSection>

        {/* Message */}
        <FormSection>
          <FieldLabel>Message</FieldLabel>
          <FieldTextarea placeholder="Enter Message (optional)" />
        </FormSection>

        {/* Priority */}
        <FormSection>
          <FieldLabel>Priority</FieldLabel>
          <FieldInput placeholder="Enter priority" />
        </FormSection>

        {/* Assign to user */}
        <FormSection>
          <IconFieldLabel
            icon={<AlternateEmailOutlined sx={{ fontSize: "14px" }} />}
            label="Assign to user:"
            extra={
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#2262ef", cursor: "pointer" }}>
                self
              </Typography>
            }
          />
          <FieldInput defaultValue="None" />
        </FormSection>

        {/* Assign to group */}
        <FormSection>
          <IconFieldLabel
            icon={<HubOutlined sx={{ fontSize: "14px", transform: "rotate(90deg)" }} />}
            label="Assign to group:"
          />
          <FieldInput defaultValue="None" focused />
        </FormSection>

        {/* Due date */}
        <FormSection>
          <IconFieldLabel
            icon={<CalendarTodayOutlined sx={{ fontSize: "14px" }} />}
            label="Due date:"
          />
          <FieldInput placeholder="MM/dd/yyyy" />
        </FormSection>

        {/* Time */}
        <FormSection>
          <IconFieldLabel
            icon={<AccessTimeOutlined sx={{ fontSize: "14px" }} />}
            label="Time:"
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* HH */}
            <Box
              component="input"
              placeholder="HH"
              maxLength={2}
              sx={{
                width: "50px", height: "36px",
                border: "1px solid #e0e5eb", borderRadius: "6px",
                textAlign: "center",
                fontFamily: "Inter", fontSize: "13px", color: "#374151",
                outline: "none", backgroundColor: "#fff",
                "&::placeholder": { color: "#c4cbd4" },
                "&:focus": { borderColor: "#2262ef" },
              }}
            />
            <Typography sx={{ fontFamily: "Inter", fontSize: "16px", color: "#9aa3ae" }}>:</Typography>
            {/* MM */}
            <Box
              component="input"
              placeholder="MM"
              maxLength={2}
              sx={{
                width: "50px", height: "36px",
                border: "1px solid #e0e5eb", borderRadius: "6px",
                textAlign: "center",
                fontFamily: "Inter", fontSize: "13px", color: "#374151",
                outline: "none", backgroundColor: "#fff",
                "&::placeholder": { color: "#c4cbd4" },
                "&:focus": { borderColor: "#2262ef" },
              }}
            />
            {/* AM / PM toggle */}
            <Box sx={{ display: "flex", border: "1px solid #e0e5eb", borderRadius: "6px", overflow: "hidden", height: "36px" }}>
              {["AM", "PM"].map((v) => (
                <Box
                  key={v}
                  onClick={() => setAmpm(v)}
                  sx={{
                    px: "14px",
                    display: "flex", alignItems: "center",
                    backgroundColor: ampm === v ? "#2262ef" : "#fff",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: ampm === v ? "#2262ef" : "#f5f7fa" },
                  }}
                >
                  <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: ampm === v ? "#fff" : "#374151" }}>
                    {v}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </FormSection>

        {/* Add button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "8px" }}>
          <Box sx={{
            backgroundColor: "#2262ef", borderRadius: "8px",
            px: "24px", height: "38px",
            display: "flex", alignItems: "center",
            cursor: "pointer", "&:hover": { backgroundColor: "#1a50cc" },
          }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
              Add
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddTaskForm;
