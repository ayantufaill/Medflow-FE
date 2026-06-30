import { Box, Typography } from "@mui/material";
import {
  EmailOutlined, PhoneOutlined, ChatBubbleOutline, PeopleOutline,
  KeyboardArrowDown, AutoAwesome,
} from "@mui/icons-material";
import { ContactLine } from "./helpers";

const ContactPanel = ({ pt }) => (
  <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5", overflow: "hidden" }}>
    <ContactLine icon={<EmailOutlined sx={{ fontSize: "13px" }} />}             text={pt.email} color="#2262ef" />
    <ContactLine icon={<PhoneOutlined sx={{ fontSize: "13px" }} />}             text={pt.phone} color="#2262ef" />
    <ContactLine icon={<ChatBubbleOutline sx={{ fontSize: "13px" }} />} text="Patient communication" />

    <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "12px" }}>
      <PeopleOutline sx={{ fontSize: "13px", color: "#9aa3ae", flexShrink: 0 }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>
        {pt.familyMembersCount} family member{pt.familyMembersCount !== 1 ? "s" : ""}
      </Typography>
      <KeyboardArrowDown sx={{ fontSize: "14px", color: "#9aa3ae" }} />
    </Box>

    <Box sx={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      backgroundColor: "#2262ef", borderRadius: "8px",
      px: "12px", py: "6px", cursor: "pointer",
      "&:hover": { backgroundColor: "#1a50cc" },
    }}>
      <AutoAwesome sx={{ fontSize: "12px", color: "#fff" }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#fff" }}>
        Request review
      </Typography>
    </Box>
  </Box>
);

export default ContactPanel;
