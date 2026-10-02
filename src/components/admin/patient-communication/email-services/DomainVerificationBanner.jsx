import { useState } from 'react';
import { Box, Typography, Link, Collapse } from '@mui/material';
import {
  MarkEmailReadOutlined as MarkEmailReadIcon,
  CampaignOutlined as CampaignIcon,
  NotificationsActiveOutlined as NotificationsIcon,
} from '@mui/icons-material';

import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';

const HELP_STEPS = [
  'Sign in to the website where you manage your domain (e.g. GoDaddy, Namecheap, Cloudflare).',
  'Open the DNS settings for the domain shown below.',
  'Add each record from the DNS Records list exactly as shown. Use the copy buttons to avoid typos.',
  'Save your changes. DNS updates can take up to 72 hours, but usually finish within an hour.',
  'Come back here and click "Check status" to confirm the domain is verified.',
];

const DomainVerificationBanner = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <Box
      sx={{
        bgcolor: COLORS.SURFACE_TINT,
        borderRadius: radius.lg,
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Illustration */}
        <Box
          sx={{
            position: 'relative',
            width: 110,
            minWidth: 110,
            height: 96,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 22,
              top: 6,
              width: 64,
              height: 84,
              borderRadius: '12px',
              bgcolor: COLORS.WHITE,
              border: `2px solid ${COLORS.ACCENT}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MarkEmailReadIcon sx={{ fontSize: 36, color: COLORS.ACCENT }} />
          </Box>
          <CampaignIcon
            sx={{ position: 'absolute', left: -6, bottom: 0, fontSize: 30, color: COLORS.ACCENT, opacity: 0.85 }}
          />
          <NotificationsIcon
            sx={{ position: 'absolute', right: 0, top: 18, fontSize: 28, color: COLORS.ACCENT, opacity: 0.6 }}
          />
        </Box>

        {/* Copy */}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 0.75 }}>
            Email Domain Verification
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, mb: 1 }}>
            Before you can send emails from MedFlow using your practice&apos;s own domain, you&apos;ll need to add
            MedFlow&apos;s DNS records to your domain provider.
          </Typography>
          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={() => setShowHelp((prev) => !prev)}
            sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.ACCENT }}
          >
            {showHelp ? 'Hide Help Guide' : 'View Help Guide'}
          </Link>
        </Box>
      </Box>

      <Collapse in={showHelp} unmountOnExit>
        <Box
          component="ol"
          sx={{
            mt: 2.5,
            mb: 0,
            pl: 2.5,
            '& li': { fontSize: fontSize.md, color: COLORS.TEXT_BODY, lineHeight: 1.6, mb: 0.5 },
          }}
        >
          {HELP_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default DomainVerificationBanner;
