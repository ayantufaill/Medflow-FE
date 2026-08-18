import { Box, Typography } from "@mui/material";
import { DeleteOutlineOutlined as DeleteIcon, InboxOutlined as InboxIcon } from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const DeletedProfilesTab = ({ deletedProfiles = [] }) => {
  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Box
        sx={{
          border: `1px solid ${COLORS.BORDER}`,
          borderRadius: radius.lg,
          overflow: 'hidden',
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            backgroundColor: COLORS.SURFACE_TINT,
            borderBottom: `1px solid ${COLORS.BORDER}`,
            px: 2.5,
            py: 1.2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
              <DeleteIcon sx={{ fontSize: 18, color: COLORS.ACCENT }} />
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
              Deleted Profiles
            </Typography>
          </Box>
        </Box>

        {deletedProfiles.length === 0 ? (
          /* Empty State */
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
              <InboxIcon sx={{ fontSize: 26, color: COLORS.ACCENT }} />
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
              No Deleted Profiles
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontWeight: fontWeight.regular,
                fontSize: fontSize.base,
                color: COLORS.TEXT_MUTED,
              }}
            >
              You don't have deleted profiles to view
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {deletedProfiles.map((profile, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1.5,
                  bgcolor: COLORS.SURFACE_CARD,
                  border: `1px solid ${COLORS.BORDER}`,
                  borderRadius: radius.md,
                }}
              >
                <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.bold, fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY }}>
                  {profile.name} - {profile.dob}
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>Date: {profile.date}</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_BODY }}>Email: {profile.email}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DeletedProfilesTab;
