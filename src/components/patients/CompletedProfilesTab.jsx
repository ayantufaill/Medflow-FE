import { Box, Typography } from "@mui/material";
import { InboxOutlined as InboxIcon, SystemUpdateAlt as UpdateIcon, PersonAddOutlined as PersonAddIcon } from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 5,
      px: 3,
    }}
  >
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        backgroundColor: COLORS.ACCENT_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 1.5,
      }}
    >
      <Icon sx={{ fontSize: 26, color: COLORS.ACCENT }} />
    </Box>
    <Typography
      sx={{
        fontFamily: 'Inter',
        fontWeight: fontWeight.semibold,
        fontSize: fontSize.md,
        color: COLORS.TEXT_PRIMARY,
        mb: 0.5,
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontFamily: 'Inter',
        fontWeight: fontWeight.regular,
        fontSize: fontSize.base,
        color: COLORS.TEXT_MUTED,
      }}
    >
      {subtitle}
    </Typography>
  </Box>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      mb: 1,
    }}
  >
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: COLORS.ACCENT_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 18, color: COLORS.ACCENT }} />
    </Box>
    <Typography
      sx={{
        fontFamily: 'Inter',
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: COLORS.ACCENT,
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
      }}
    >
      {title}
    </Typography>
  </Box>
);

const CompletedProfilesTab = () => {
  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
      {/* Update Requests Section */}
      <Box
        sx={{
          border: `1px solid ${COLORS.BORDER}`,
          borderRadius: radius.lg,
          overflow: 'hidden',
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            backgroundColor: COLORS.SURFACE_TINT,
            borderBottom: `1px solid ${COLORS.BORDER}`,
            px: 2.5,
            py: 1.2,
          }}
        >
          <SectionHeader icon={UpdateIcon} title="Update Requests" />
        </Box>
        <EmptyState
          icon={InboxIcon}
          title="No Update Requests"
          subtitle="You don't have new patients to update"
        />
      </Box>

      {/* New Patients Section */}
      <Box
        sx={{
          border: `1px solid ${COLORS.BORDER}`,
          borderRadius: radius.lg,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            backgroundColor: COLORS.SURFACE_TINT,
            borderBottom: `1px solid ${COLORS.BORDER}`,
            px: 2.5,
            py: 1.2,
          }}
        >
          <SectionHeader icon={PersonAddIcon} title="New Patients" />
        </Box>
        <EmptyState
          icon={PersonAddIcon}
          title="No New Patients"
          subtitle="You don't have new patients to import"
        />
      </Box>
    </Box>
  );
};

export default CompletedProfilesTab;
