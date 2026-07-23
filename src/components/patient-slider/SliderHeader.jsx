import { Box, Chip, IconButton, Typography } from "@mui/material";
import {
  Close,
  Refresh,
} from "@mui/icons-material";
import InitialsAvatar from "../shared/InitialsAvatar";
import { ActionBtn, VDiv } from "./helpers";
import ToothSvg from "../../assets/patientslidericons/tabler_dental.svg";
import DocumentIcon from "../../assets/patientslidericons/document.svg";
import BillingIcon from "../../assets/patientslidericons/billing.svg";
import LinkIcon from "../../assets/patientslidericons/link.svg";
import FamilyIcon from "../../assets/patientslidericons/family-icon.svg";

// 1. Add onRefresh to the component props
const SliderHeader = ({ pt, onClose, onRefresh, isRefreshing }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      px: "16px",
      py: "10px",
      borderBottom: "2px solid #2262ef",
      backgroundColor: "#f3f8fd",
    }}
  >
    <InitialsAvatar name={pt.name} size={42} fontSize={13} />

    <Box sx={{ mr: "4px" }}>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 700,
            color: "#09121f",
          }}
        >
          {pt.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "11px",
            color: "#2262ef",
            fontWeight: 600,
          }}
        >
          pt #{pt.id}
        </Typography>
      </Box>
      <Typography
        sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}
      >
        Selected family member
      </Typography>
    </Box>

    <VDiv />

    <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
      <ActionBtn
        icon={
          <Box
            component="img"
            src={DocumentIcon}
            sx={{ width: "16px", height: "16px", objectFit: "contain" }}
          />
        }
        title="Notes"
      />
      <ActionBtn
        icon={
          <Box
            component="img"
            src={BillingIcon}
            sx={{ width: "16px", height: "16px", objectFit: "contain" }}
          />
        }
        title="Billing"
        active
      />
      <ActionBtn
        icon={
          <Box
            component="img"
            src={LinkIcon}
            sx={{ width: "16px", height: "16px", objectFit: "contain" }}
          />
        }
        title="Tags"
      />
      <ActionBtn
        icon={
          <Box
            component="img"
            src={FamilyIcon}
            sx={{ width: "16px", height: "16px", objectFit: "contain" }}
          />
        }
        title="Family"
      />
      <ActionBtn
        icon={
          <Box
            component="img"
            src={ToothSvg}
            sx={{ width: "16px", height: "16px" }}
          />
        }
        title="Clinical"
      />
    </Box>

    <VDiv />

    {/* 2. Call onRefresh when clicked */}
    <Box
      onClick={onRefresh}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        borderRadius: "6px",
        px: "8px",
        py: "5px",
        cursor: isRefreshing ? "default" : "pointer",
        opacity: isRefreshing ? 0.7 : 1,
        "&:hover": { backgroundColor: isRefreshing ? "transparent" : "rgba(0,0,0,0.05)" },
      }}
    >
      <Refresh 
        sx={{ 
          fontSize: "14px", 
          color: "#6b7280",
        }} 
      />
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "11px",
          fontWeight: 500,
          color: "#6b7280",
        }}
      >
        Refresh
      </Typography>
    </Box>

    <Box sx={{ flex: 1 }} />

    <Box sx={{ display: "flex", gap: "5px" }}>
      {pt.tags.map((t) => (
        <Chip
          key={t.label}
          label={t.label}
          size="small"
          sx={{
            backgroundColor: t.bg,
            color: t.color,
            border: `1px solid ${t.border}`,
            fontFamily: "Inter",
            fontSize: "10px",
            fontWeight: 700,
            height: "22px",
            borderRadius: "6px",
            "& .MuiChip-label": { px: "7px" },
          }}
        />
      ))}
    </Box>

    <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
      <Close sx={{ fontSize: "16px" }} />
    </IconButton>
  </Box>
);

export default SliderHeader;
