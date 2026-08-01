import React from 'react';
import { TableRow, TableCell, Box, Typography, Button, IconButton, Chip, Collapse, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 1, py: 0.2 }}>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, width: 'auto', minWidth: 'fit-content' }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold }}>
      {value}
    </Typography>
  </Box>
);

const InsuranceTableRow = ({
  row,
  patientId,
  isExpanded,
  onViewCoverage,
  onCheckEligibility,
  onDeactivate,
  onActivate,
  onRowMenuOpen
}) => {
  return (
    <React.Fragment>
      <TableRow 
        sx={{ 
          '& .MuiTableCell-body': { 
            py: 1.5, 
            borderBottom: isExpanded ? 'none' : `1px solid ${COLORS.BORDER_VERY_LIGHT}` 
          },
          '&:hover': {
            backgroundColor: COLORS.SURFACE_HOVER
          }
        }}
      >
        {!patientId && (
          <TableCell sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold }}>
            {row.patientName}
          </TableCell>
        )}
        <TableCell sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>
          {row.payer}
        </TableCell>

        <TableCell sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={row.plan}
              sx={{
                bgcolor: row.status === 'active' ? COLORS.PRICE_BG : '#fff3e0',
                color: row.status === 'active' ? COLORS.STATUS_SUCCESS : COLORS.STATUS_WARNING,
                fontWeight: fontWeight.bold,
                fontSize: fontSize.xs,
                borderRadius: radius.pill,
                height: 22,
              }}
            />
            {row.dentist && (
              <Box sx={{ textAlign: 'left' }}>
                <Typography component="span" sx={{ fontSize: fontSize.base, color: COLORS.STATUS_SUCCESS, fontWeight: fontWeight.medium }}>
                  Check Eligibility with{' '}
                </Typography>
                <Typography
                  component="span"
                  sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, textDecoration: 'underline', cursor: 'pointer', fontWeight: fontWeight.semibold }}
                  onClick={() => onCheckEligibility(row)}
                >
                  {row.dentist} <KeyboardArrowDownIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />
                </Typography>
                <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
                  Eligibility Checked on {row.eligibilityChecked}
                </Typography>
              </Box>
            )}
          </Box>
        </TableCell>

        <TableCell sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>
          {row.subscriber}
        </TableCell>

        <TableCell align="right">
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onViewCoverage(row)}
              sx={{ 
                borderRadius: radius.pill, 
                textTransform: 'none', 
                fontWeight: fontWeight.bold, 
                fontSize: fontSize.sm, 
                py: 0.25, 
                px: 1.5, 
                borderColor: COLORS.ACCENT, 
                color: COLORS.ACCENT 
              }}
            >
              View Coverage
            </Button>
            {row.status === 'active' ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onDeactivate(row)}
                  sx={{ 
                    borderRadius: radius.pill, 
                    textTransform: 'none', 
                    fontWeight: fontWeight.bold, 
                    fontSize: fontSize.sm, 
                    py: 0.25, 
                    px: 1.5, 
                    borderColor: COLORS.BORDER, 
                    color: COLORS.TEXT_SECONDARY, 
                    bgcolor: COLORS.SURFACE_TINT 
                  }}
                >
                  Deactivate
                </Button>
                <IconButton
                  size="small"
                  onClick={(e) => onRowMenuOpen(e, row)}
                  sx={{ border: `1px solid ${COLORS.BORDER}`, p: 0.25, ml: 0.5 }}
                >
                  <KeyboardArrowDownIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onActivate(row)}
                sx={{ 
                  borderRadius: radius.pill, 
                  textTransform: 'none', 
                  fontWeight: fontWeight.bold, 
                  fontSize: fontSize.sm, 
                  py: 0.25, 
                  px: 1.5, 
                  borderColor: COLORS.BORDER, 
                  color: COLORS.STATUS_SUCCESS,
                  bgcolor: COLORS.SURFACE_TINT 
                }}
              >
                Activate
              </Button>
            )}
          </Box>
        </TableCell>
      </TableRow>
      
      {/* Expanded Detail View */}
      <TableRow>
        <TableCell colSpan={patientId ? 4 : 5} sx={{ p: 0, borderBottom: isExpanded ? `1px solid ${COLORS.BORDER_VERY_LIGHT}` : 'none' }}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ px: 3, pb: 3, pt: 1, backgroundColor: COLORS.SURFACE_HOVER }}>
              <Grid container spacing={4}>
                {/* Column 1: Carrier Info */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <InfoRow label="Carrier name:" value={row.insuranceCompany?.name || row.payer} />
                    <InfoRow label="Payer ID:" value={row.payerId || '39026'} />
                    <InfoRow label="Payer Phone Number:" value={row.payerPhone || '(877) 434-2336'} />
                    <InfoRow label="Payer Address:" value={row.payerAddress || 'P.O. Box 21191, Eagan, Minnesota, 55121'} />
                  </Box>
                </Grid>

                {/* Column 2: Plan Info */}
                <Grid item xs={12} md={4} sx={{ borderLeft: { md: `1px solid ${COLORS.BORDER_LIGHT}` }, pl: { md: 4 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <InfoRow label="Employer/Insurance Plan Name:" value={row.employerName || row.plan} />
                    <InfoRow label="Group Name:" value={row.groupName || 'Delta Care'} />
                    <InfoRow label="Group Number:" value={row.groupNumber || '7443-0001'} />
                    <InfoRow label="Plan Fee Guide:" value={row.planFeeGuide || 'Careington PPO Platinum (directly in network)'} />
                    <InfoRow label="Employer Address:" value={row.employerAddress || '---'} />
                    <InfoRow label="Employer Phone Number:" value={row.employerPhone || '---'} />
                  </Box>
                </Grid>

                {/* Column 3: Subscriber Info */}
                <Grid item xs={12} md={4} sx={{ borderLeft: { md: `1px solid ${COLORS.BORDER_LIGHT}` }, pl: { md: 4 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <InfoRow label="Subscriber Name:" value={row.subscriberName || row.subscriber} />
                    <InfoRow label="Subscriber ID:" value={row.subscriberId || '865421010'} />
                    <InfoRow label="Subscriber Birthday:" value={row.subscriberDob || '10/29/1975'} />
                    <InfoRow label="Renewal Date:" value={row.renewalDate || 'January'} />
                    <InfoRow label="Relationship to subscriber:" value={row.relationship || 'Self'} />
                    <InfoRow label="Policy Started:" value={row.policyStartDate || '01/01/2023'} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default InsuranceTableRow;
