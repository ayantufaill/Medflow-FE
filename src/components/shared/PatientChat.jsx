import React, { useState } from "react";
import { Box, Dialog } from "@mui/material";
import RequestUpdatesDialog from "../patient-detail/RequestUpdatesDialog";

import PatientChatHeader from "./patient-chat/PatientChatHeader";
import PatientChatMessageList from "./patient-chat/PatientChatMessageList";
import PatientChatFooter from "./patient-chat/PatientChatFooter";

const PatientChat = ({ patientName, open, onClose }) => {
  const [messages] = useState([
    {
      title: "Save The Date - Text Message",
      patient: patientName || "Karla Pamela",
      details: "Appt on 03/04/2026 @ 9:00 AM",
      time: "3:15 PM - 03/03/2026",
      status: "Sent",
      type: "teal",
    },
    {
      title: "Request Patient Updates - Email",
      patient: patientName || "Karla Pamela",
      details: "",
      time: "8:07 AM - 03/04/2026",
      status: "Delivered",
      type: "orange",
    },
    {
      title: "Appointment Reminder Without Confirm - Text Message",
      patient: patientName || "Karla Pamela",
      details: "Appt on 03/04/2026 @ 9:00 AM",
      time: "8:08 AM - 03/04/2026",
      status: "Sent",
      type: "teal",
    },
  ]);

  const [requestUpdatesOpen, setRequestUpdatesOpen] = useState(false);
  const [requestUpdatesAnchorEl, setRequestUpdatesAnchorEl] = useState(null);

  const [actionButtons] = useState([
    { label: "Send Text", color: "#002b71", onClick: () => {} },
    { label: "Send Email", color: "#002b71", onClick: () => {} },
    { label: "Add Call Note", color: "#3b9df2", onClick: () => {} },
    {
      label: "Request Patient Updates",
      color: "#f58220",
      hasArrow: true,
      onClick: (event) => {
        setRequestUpdatesAnchorEl(event.currentTarget);
        setRequestUpdatesOpen(true);
      },
    },
    { label: "Request Quick Payment", color: "#39b54a", onClick: () => {} },
    {
      label: "Send Welcome Email",
      color: "#d1d5db",
      font: "black",
      hasArrow: true,
      onClick: () => {},
    },
    { label: "Invite To MyChart", color: "#7d8eb5", onClick: () => {} },
    {
      label: "Request Review",
      color: "#e6e05d",
      font: "black",
      hasArrow: true,
      onClick: () => {},
    },
    { label: "Print", color: "#ff49db", onClick: () => {} },
  ]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 22000 }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          border: "1px solid #e0e5eb",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
        }}
      >
        <PatientChatHeader patientName={patientName} onClose={onClose} />
        <PatientChatMessageList messages={messages} />
        <PatientChatFooter actionButtons={actionButtons} />
      </Box>

      <RequestUpdatesDialog
        open={requestUpdatesOpen}
        anchorEl={requestUpdatesAnchorEl}
        onClose={() => {
          setRequestUpdatesOpen(false);
          setRequestUpdatesAnchorEl(null);
        }}
        onSend={async () => {}}
      />
    </Dialog>
  );
};

export default PatientChat;
