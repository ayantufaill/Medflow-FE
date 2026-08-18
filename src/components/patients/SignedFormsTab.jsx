import { Box, Typography } from "@mui/material";
import { DescriptionOutlined as FormsIcon, InboxOutlined as InboxIcon } from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const SignedFormsTab = () => {
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
              <FormsIcon sx={{ fontSize: 18, color: COLORS.ACCENT }} />
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
              Signed Forms
            </Typography>
          </Box>
        </Box>

        {/* Empty State */}
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
            No Signed Forms
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontWeight: fontWeight.regular,
              fontSize: fontSize.base,
              color: COLORS.TEXT_MUTED,
            }}
          >
            You don't have signed forms to view
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignedFormsTab;
