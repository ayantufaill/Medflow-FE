import { Box, InputAdornment, MenuItem, Select, Typography } from "@mui/material";
import { PersonOutlined, CalendarMonth } from "@mui/icons-material";
import { ApptBlock, selectSx } from "./helpers";

const DoctorPanel = ({ pt }) => (
  <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5", display: "flex", flexDirection: "column", gap: "10px" }}>
    <Select size="small" displayEmpty value="" sx={selectSx}
      startAdornment={
        <InputAdornment position="start" sx={{ mr: 0 }}>
          <PersonOutlined sx={{ fontSize: "14px", color: "#9aa3ae" }} />
        </InputAdornment>
      }
    >
      <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
        Select a preferred dentist
      </MenuItem>
    </Select>

    <ApptBlock
      label="NEXT TX APPT"
      date={pt.nextTxAppt.date}
      time={pt.nextTxAppt.time}
      provider={pt.nextTxAppt.provider}
      icon={<CalendarMonth sx={{ fontSize: "12px" }} />}
    />

    <Typography sx={{
      fontFamily: "Inter", fontSize: "11px", color: "#2262ef",
      cursor: "pointer", mt: "auto",
      "&:hover": { textDecoration: "underline" },
    }}>
      View Appt History →
    </Typography>
  </Box>
);

export default DoctorPanel;
