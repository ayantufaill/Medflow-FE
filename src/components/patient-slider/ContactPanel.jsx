import { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  EmailOutlined,
  PhoneOutlined,
  ChatBubbleOutline,
  PeopleOutline,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { ContactLine } from "./helpers";
import SparkleIcon from "../../assets/operatory icons/sparkle.png";

const ContactPanel = ({ pt }) => {
  // Toggle open state for inline section expander
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    if (pt.familyMembersCount > 0) {
      setIsExpanded((prev) => !prev);
    }
  };

  // Extract household array from raw shape
  const householdMembers = pt._raw?.household || [];

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        px: "16px",
        py: "12px",
        borderRight: "1px solid #f0f2f5",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <ContactLine
        icon={<EmailOutlined sx={{ fontSize: "13px" }} />}
        text={pt.email}
        color="#2262ef"
      />
      <ContactLine
        icon={<PhoneOutlined sx={{ fontSize: "13px" }} />}
        text={pt.phone}
        color="#2262ef"
      />
      <ContactLine
        icon={<ChatBubbleOutline sx={{ fontSize: "13px" }} />}
        text="Patient communication"
      />

      {/* Clickable Header for Toggling Expand */}
      <Box
        onClick={handleToggleExpand}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          mb: isExpanded ? "6px" : "12px",
          cursor: pt.familyMembersCount > 0 ? "pointer" : "default",
          userSelect: "none",
          width: "max-content",
          "&:hover": pt.familyMembersCount > 0 ? { opacity: 0.8 } : {},
        }}
      >
        <PeopleOutline
          sx={{ fontSize: "13px", color: "#9aa3ae", flexShrink: 0 }}
        />
        <Typography
          sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}
        >
          {pt.familyMembersCount > 0
            ? `${pt.familyMembersCount} family member${
                pt.familyMembersCount !== 1 ? "s" : ""
              }`
            : "No linked family members"}
        </Typography>
        {pt.familyMembersCount > 0 && (
          <KeyboardArrowDown
            sx={{
              fontSize: "14px",
              color: "#9aa3ae",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        )}
      </Box>

      {/* Inline Expanded Content Block */}
      {isExpanded && pt.familyMembersCount > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            pl: "20px", // Aligns cleanly under text labels
            mb: "12px",
            maxHeight: "120px",
            overflowY: "auto",
          }}
        >
          {householdMembers.map((member) => (
            <Box
              key={member.id || member._id}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  color: "#4b5563",
                }}
              >
                {`${member.firstName || ""} ${member.lastName || ""}`.trim()}
              </Typography>
              {member.relationship && (
                <Typography
                  sx={{
                    fontSize: "9px",
                    fontFamily: "Inter",
                    color: "#9aa3ae",
                    mt: "-2px",
                  }}
                >
                  {member.relationship}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Request Review Button Container pushes to base naturally layout permitting */}
      <Box sx={{ mt: isExpanded ? "0" : "auto" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#2262ef",
            borderRadius: "8px",
            px: "12px",
            py: "6px",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#1a50cc" },
          }}
        >
          <Box
            component="img"
            src={SparkleIcon}
            sx={{ width: "12px", height: "12px" }}
          />
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "11px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Request review
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactPanel;
