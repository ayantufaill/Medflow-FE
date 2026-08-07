import { Box } from "@mui/material";
import HeaderLogo from "./header/HeaderLogo";
import PatientDropdown from "./header/PatientDropdown";
import OpenPatientSlider from "./header/OpenPatientSlider";
import NavTabs from "./header/NavTabs";
import ActionIcons from "./header/ActionIcons";
import UserProfile from "./header/UserProfile";
import VerticalDivider from "./header/VerticalDivider";

const Header = ({ onOpenPatientSlider, sliderOpen }) => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1302,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      width: "100%",
      height: "65px",
      padding: "0px",
      backgroundColor: "#FCFCFC",
      borderBottom: "1px solid #e0e5eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      "@media print": { display: "none" },
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: "64px",
        px: "16px",
        gap: "12px",
      }}
    >
      {/* LEFT */}
      <Box
        sx={{
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minWidth: 0,
        }}
      >
        <HeaderLogo />
        <VerticalDivider />
        <PatientDropdown />
        <VerticalDivider />
        <OpenPatientSlider onClick={onOpenPatientSlider} isOpen={sliderOpen} />
      </Box>

      {/* CENTER */}
      <Box
        sx={{
          flex: "1 1 auto",
          minWidth: 0,
          display: "flex",
          justifyContent: "center",
          overflowX: "auto",
        }}
      >
        <NavTabs />
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <ActionIcons />
        <VerticalDivider />
        <UserProfile />
      </Box>
    </Box>
  </Box>
);

export default Header;
