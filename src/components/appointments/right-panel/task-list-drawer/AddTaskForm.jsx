import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import {
  KeyboardDoubleArrowLeft, Close,
  AlternateEmailOutlined, HubOutlined, CalendarTodayOutlined, AccessTimeOutlined,
} from "@mui/icons-material";
import { useCreateTask, useTaskLists } from "../../../../hooks/queries/useTasks";
import { useUsers } from "../../../../hooks/queries/useUsers";
import { useAuth } from "../../../../contexts/AuthContext";
import dayjs from "dayjs";

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

const FieldInput = ({ placeholder, value, onChange, type = "text", maxLength, focused = false }) => (
  <Box
    component="input"
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    maxLength={maxLength}
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

const FieldTextarea = ({ placeholder, value, onChange }) => (
  <Box
    component="textarea"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
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

const FieldSelect = ({ value, onChange, options = [], focused = false }) => (
  <Box
    component="select"
    value={value}
    onChange={onChange}
    sx={{
      display: "block", width: "100%", boxSizing: "border-box",
      border: `1px solid ${focused ? "#2262ef" : "#e0e5eb"}`,
      borderRadius: "8px",
      px: "12px", height: "40px",
      fontFamily: "Inter", fontSize: "13px", color: "#374151",
      outline: "none", backgroundColor: "#fff",
      "&:focus": { borderColor: "#2262ef" },
    }}
  >
    <option value="">None</option>
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </Box>
);

const FormSection = ({ children }) => (
  <Box sx={{ mb: "18px" }}>{children}</Box>
);

/* ───────────────────────────────────────────────────────────────────────────── */
const AddTaskForm = ({ onBack, onClose }) => {
  const [descript, setDescript] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [taskListNum, setTaskListNum] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  // Time mock fields
  const [hh, setHh] = useState("");
  const [mm, setMm] = useState("");
  const [ampm, setAmpm] = useState("AM");

  const createTaskMutation = useCreateTask();
  const { data: users } = useUsers();
  const { data: taskLists } = useTaskLists();
  const { user } = useAuth();
  
  const handleSubmit = () => {
    if (!descript) return;
    
    createTaskMutation.mutate({
      Descript: `${descript}${message ? '\n' + message : ''}`,
      UserNum: assignedTo || null,
      TaskListNum: taskListNum || null,
      PriorityDefNum: priority || null,
      DateTask: dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : null,
      IsRepeating: 0,
      ReminderFrequency: 0,
      comment: '',
      KeyNum: null
    }, {
      onSuccess: () => {
        onBack();
      }
    });
  };

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
          <FieldInput placeholder="Enter Title (required)" value={descript} onChange={e => setDescript(e.target.value)} />
        </FormSection>

        {/* Message */}
        <FormSection>
          <FieldLabel>Message</FieldLabel>
          <FieldTextarea placeholder="Enter Message (optional)" value={message} onChange={e => setMessage(e.target.value)} />
        </FormSection>

        {/* Priority */}
        <FormSection>
          <FieldLabel>Priority</FieldLabel>
          <FieldInput placeholder="Enter priority" type="number" value={priority} onChange={e => setPriority(e.target.value)} />
        </FormSection>

        {/* Assign to user */}
        <FormSection>
          <IconFieldLabel
            icon={<AlternateEmailOutlined sx={{ fontSize: "14px" }} />}
            label="Assign to user:"
            extra={
              <Typography onClick={() => setAssignedTo(String(user?.id || user?.UserNum || ""))} sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#2262ef", cursor: "pointer" }}>
                self
              </Typography>
            }
          />
          <FieldSelect 
            value={assignedTo} 
            onChange={e => setAssignedTo(e.target.value)}
            options={(users || []).map(u => ({ value: u.UserNum, label: u.UserName }))}
          />
        </FormSection>

        {/* Assign to group */}
        <FormSection>
          <IconFieldLabel
            icon={<HubOutlined sx={{ fontSize: "14px", transform: "rotate(90deg)" }} />}
            label="Assign to group:"
          />
          <FieldSelect 
            value={taskListNum} 
            onChange={e => setTaskListNum(e.target.value)}
            options={(taskLists || []).map(g => ({ value: g.TaskListNum, label: g.Descript }))}
          />
        </FormSection>

        {/* Due date */}
        <FormSection>
          <IconFieldLabel
            icon={<CalendarTodayOutlined sx={{ fontSize: "14px" }} />}
            label="Due date:"
          />
          <FieldInput type="date" placeholder="MM/dd/yyyy" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </FormSection>

        {/* Time */}
        <FormSection>
          <IconFieldLabel
            icon={<AccessTimeOutlined sx={{ fontSize: "14px" }} />}
            label="Time:"
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* HH */}
            <FieldInput placeholder="HH" maxLength={2} value={hh} onChange={e => setHh(e.target.value)} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "16px", color: "#9aa3ae" }}>:</Typography>
            {/* MM */}
            <FieldInput placeholder="MM" maxLength={2} value={mm} onChange={e => setMm(e.target.value)} />
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
          <Box onClick={handleSubmit} sx={{
            backgroundColor: descript ? "#2262ef" : "#a3bbf9", borderRadius: "8px",
            px: "24px", height: "38px",
            display: "flex", alignItems: "center",
            cursor: descript ? "pointer" : "not-allowed", "&:hover": { backgroundColor: descript ? "#1a50cc" : "#a3bbf9" },
            opacity: createTaskMutation.isPending ? 0.7 : 1
          }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
              {createTaskMutation.isPending ? "Adding..." : "Add"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddTaskForm;
