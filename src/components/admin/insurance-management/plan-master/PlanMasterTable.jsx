import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { HistoryOutlined as HistoryIcon, EditOutlined as EditIcon } from '@mui/icons-material';
import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';
import {
  BENEFIT_CATEGORIES,
  COB_PAYMENT_METHODS,
  COB_INFO_SOURCES,
} from '../../../../constants/cobConstants';

const labelOf = (list, value) => list.find((item) => item.value === value)?.label || value || '—';

const headCellSx = {
  fontFamily: 'Inter',
  fontSize: fontSize.xs,
  fontWeight: fontWeight.bold,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
  color: COLORS.TEXT_MUTED,
  borderBottom: `1px solid ${COLORS.BORDER}`,
};

const bodyCellSx = {
  fontFamily: 'Inter',
  fontSize: fontSize.base,
  color: COLORS.TEXT_BODY,
  borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
};

const buttonSx = {
  fontFamily: 'Inter',
  fontSize: fontSize.base,
  textTransform: 'none',
  borderRadius: radius.md,
};

/**
 * Plan master list.
 *
 * "Coordinates with other insurance = No" is the column that gets a loud
 * chip: it is the rare, high-consequence setting, and an admin scanning the
 * list needs to spot a wrongly-set one without opening every row. The info
 * source is shown next to it for the same reason — a "No" sourced from
 * DEFAULT is a data-quality bug, not a fact.
 */
const PlanMasterTable = ({ plans = [], loading, error, canEdit, onEdit, onHistory }) => {
  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 5 }} data-testid="plan-master-loading">
        <CircularProgress size={26} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" data-testid="plan-master-error" sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}>
        We couldn&apos;t load the plan list. Please try again.
      </Alert>
    );
  }

  if (!plans.length) {
    return (
      <Typography
        data-testid="plan-master-empty"
        sx={{ fontFamily: 'Inter', fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, py: 5, textAlign: 'center' }}
      >
        No plans match that search.
      </Typography>
    );
  }

  return (
    <Box
      sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.lg, overflowX: 'auto' }}
      data-testid="plan-master-table"
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={headCellSx}>Payer</TableCell>
            <TableCell sx={headCellSx}>Plan</TableCell>
            <TableCell sx={headCellSx}>Benefit category</TableCell>
            <TableCell sx={headCellSx}>Coordinates with other insurance</TableCell>
            <TableCell sx={headCellSx}>Secondary payment method</TableCell>
            <TableCell sx={headCellSx}>Source</TableCell>
            <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>&nbsp;</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.planId} hover data-testid={`plan-master-row-${plan.planId}`}>
              <TableCell sx={bodyCellSx}>{plan.carrierName || '—'}</TableCell>
              <TableCell sx={{ ...bodyCellSx, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
                {plan.planName || '—'}
                {plan.groupNumber ? (
                  <Typography component="span" sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, ml: 0.75 }}>
                    #{plan.groupNumber}
                  </Typography>
                ) : null}
              </TableCell>
              <TableCell sx={bodyCellSx}>{labelOf(BENEFIT_CATEGORIES, plan.benefitCategory)}</TableCell>

              <TableCell sx={bodyCellSx}>
                {plan.coordinatesBenefits === false ? (
                  <Chip
                    size="small"
                    label="No"
                    data-testid={`plan-master-no-coordination-${plan.planId}`}
                    sx={{
                      height: 22,
                      fontFamily: 'Inter',
                      fontSize: fontSize.xs,
                      fontWeight: fontWeight.semibold,
                      borderRadius: radius.pill,
                      color: COLORS.STATUS_ERROR,
                      backgroundColor: 'rgba(239, 68, 68, 0.10)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  />
                ) : (
                  'Yes'
                )}
              </TableCell>

              <TableCell sx={bodyCellSx}>{labelOf(COB_PAYMENT_METHODS, plan.cobPaymentMethod)}</TableCell>
              <TableCell sx={bodyCellSx}>
                {labelOf(COB_INFO_SOURCES, plan.cobInfoSource)}
                {/* No profile row at all means every value on this line is a
                    default nobody has looked at — worth saying, because the
                    list would otherwise imply each plan was reviewed. */}
                {plan.cobProfileRecorded === false && (
                  <Typography
                    data-testid={`plan-master-unrecorded-${plan.planId}`}
                    sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}
                  >
                    Not recorded
                  </Typography>
                )}
              </TableCell>

              <TableCell sx={{ ...bodyCellSx, textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Button
                  size="small"
                  startIcon={<HistoryIcon sx={{ fontSize: 16 }} />}
                  onClick={() => onHistory(plan)}
                  data-testid={`plan-master-history-${plan.planId}`}
                  sx={{ ...buttonSx, color: COLORS.TEXT_SECONDARY }}
                >
                  History
                </Button>

                {/* Edit is hidden, not disabled, without the permission:
                    `insurance.plan_master.edit` is a privileged grant and a
                    permanently greyed button only generates support tickets. */}
                {canEdit && (
                  <Button
                    size="small"
                    startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                    onClick={() => onEdit(plan)}
                    data-testid={`plan-master-edit-${plan.planId}`}
                    sx={{ ...buttonSx, color: COLORS.ACCENT }}
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PlanMasterTable;
