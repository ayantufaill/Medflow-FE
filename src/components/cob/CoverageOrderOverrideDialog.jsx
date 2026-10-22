import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DragIndicator as DragIndicatorIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BaseDialog from '../shared/BaseDialog';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { positionLabel, MIN_OVERRIDE_REASON_LENGTH } from '../../constants/cobConstants';

/**
 * Hand-set the coverage order.
 *
 * ACCESSIBILITY IS NOT OPTIONAL HERE. Drag-and-drop alone would make the
 * override unusable for keyboard and screen-reader users, so every row carries
 * three equivalent ways to move:
 *   • pointer drag on the handle
 *   • dnd-kit's KeyboardSensor on the focused handle (space, then arrows)
 *   • explicit Up/Down buttons with spoken labels
 * The buttons are the ones the tests drive, because they are the path that has
 * to work when the pointer sensor is unavailable.
 */

const SortableRow = ({ item, index, total, onMoveUp, onMoveDown }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.coverageId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : 0,
    position: isDragging ? 'relative' : undefined,
  };

  const name = item.label;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      component="li"
      data-testid={`cob-override-row-${index + 1}`}
      sx={{
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.25,
        py: 1,
        mb: 0.75,
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.md,
        backgroundColor: isDragging ? COLORS.SURFACE_HOVER : COLORS.SURFACE_CARD,
      }}
    >
      {/* The handle is a real button so it is reachable by Tab; dnd-kit's
          keyboard sensor then handles space-to-lift and arrows-to-move. */}
      <IconButton
        {...attributes}
        {...listeners}
        size="small"
        aria-label={`Reorder ${name}. Press space, then use the arrow keys.`}
        sx={{ cursor: 'grab', color: COLORS.TEXT_MUTED, p: 0.5 }}
      >
        <DragIndicatorIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: fontSize.md,
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          {positionLabel(index + 1)}: {name}
        </Typography>
        {item.explanation && (
          <Typography
            sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}
          >
            Suggested because: {item.explanation}
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={0.25}>
        <IconButton
          size="small"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          aria-label={`Move ${name} up to position ${index}`}
          data-testid={`cob-override-up-${index + 1}`}
          sx={{ color: COLORS.TEXT_SECONDARY }}
        >
          <ArrowUpwardIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
          aria-label={`Move ${name} down to position ${index + 2}`}
          data-testid={`cob-override-down-${index + 1}`}
          sx={{ color: COLORS.TEXT_SECONDARY }}
        >
          <ArrowDownwardIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

const CoverageOrderOverrideDialog = ({
  open,
  onClose,
  coverages = [],
  onSubmit,
  saving = false,
}) => {
  const [items, setItems] = useState(coverages);
  const [reason, setReason] = useState('');
  // Two-step: reorder, then a confirmation that spells out old vs new. The
  // confirmation is a separate step rather than inline text because the
  // override is the one action here that overrules the rule engine.
  const [confirming, setConfirming] = useState(false);

  // Reset whenever the dialog opens so a cancelled attempt never leaks into
  // the next one.
  useEffect(() => {
    if (open) {
      setItems(coverages);
      setReason('');
      setConfirming(false);
    }
  }, [open, coverages]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const move = (from, to) => {
    if (to < 0 || to >= items.length) return;
    setItems((current) => arrayMove(current, from, to));
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.coverageId === active.id);
    const to = items.findIndex((i) => i.coverageId === over.id);
    move(from, to);
  };

  const changed = useMemo(
    () => items.some((item, index) => item.coverageId !== coverages[index]?.coverageId),
    [items, coverages]
  );

  // The backend's overrideOrderValidator requires at least 10 characters, so
  // the same floor is enforced here — a user should find out before they
  // submit, not through a 400.
  const reasonTooShort = reason.trim().length < MIN_OVERRIDE_REASON_LENGTH;
  const canSubmit = !reasonTooShort && changed && !saving;

  const handleConfirm = () => {
    onSubmit?.({
      // `orderedCoverageIds` is the backend's field name on
      // POST /cob/patients/:id/coverage-order/override.
      orderedCoverageIds: items.map((i) => i.coverageId),
      reason: reason.trim(),
    });
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={confirming ? 'Confirm the new order' : 'Set the insurance order by hand'}
      maxWidth="sm"
      loading={saving}
      showCloseButton
      actions={
        confirming ? (
          <>
            <Button
              onClick={() => setConfirming(false)}
              sx={{ fontFamily: 'Inter', fontSize: fontSize.base, textTransform: 'none' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleConfirm}
              disabled={saving}
              data-testid="cob-override-confirm"
              sx={{
                fontFamily: 'Inter',
                fontSize: fontSize.base,
                fontWeight: fontWeight.semibold,
                textTransform: 'none',
                borderRadius: radius.md,
                backgroundColor: COLORS.ACCENT,
                '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
              }}
            >
              Save this order
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onClose}
              sx={{ fontFamily: 'Inter', fontSize: fontSize.base, textTransform: 'none' }}
            >
              Cancel
            </Button>
            {/* Tooltip rather than a hidden button: the user needs to know
                which of the two preconditions they still have to meet. */}
            <Tooltip
              title={
                !changed
                  ? 'Move at least one plan before saving.'
                  : reasonTooShort
                    ? `A reason of at least ${MIN_OVERRIDE_REASON_LENGTH} characters is required.`
                    : ''
              }
            >
              <span>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => setConfirming(true)}
                  disabled={!canSubmit}
                  data-testid="cob-override-review"
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: fontSize.base,
                    fontWeight: fontWeight.semibold,
                    textTransform: 'none',
                    borderRadius: radius.md,
                    backgroundColor: COLORS.ACCENT,
                    '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
                  }}
                >
                  Review the change
                </Button>
              </span>
            </Tooltip>
          </>
        )
      }
    >
      {confirming ? (
        <Box data-testid="cob-override-confirmation">
          <Typography
            sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY, mb: 1.5 }}
          >
            This replaces the suggested order. Claims for new dates of service will use the order
            below.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} divider={<Divider flexItem orientation="vertical" />}>
            <OrderPreview heading="Current order" rows={coverages} testId="cob-override-old" />
            <OrderPreview heading="New order" rows={items} testId="cob-override-new" />
          </Stack>

          <Box
            sx={{
              mt: 2,
              p: 1.25,
              backgroundColor: COLORS.SURFACE_HOVER,
              border: `1px solid ${COLORS.BORDER}`,
              borderRadius: radius.md,
            }}
          >
            <Typography
              sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, textTransform: 'uppercase', color: COLORS.TEXT_MUTED }}
            >
              Reason
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY }}>
              {reason.trim()}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography
            sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 1.5 }}
          >
            Drag a plan, or use the up and down buttons, to put the payers in the order the
            insurers have told you to bill them.
          </Typography>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={items.map((i) => i.coverageId)}
              strategy={verticalListSortingStrategy}
            >
              {/* `aria-label` on the list so a screen reader announces what is
                  being reordered before reading the rows. */}
              <Box component="ol" aria-label="Insurance order" sx={{ m: 0, p: 0 }}>
                {items.map((item, index) => (
                  <SortableRow
                    key={item.coverageId}
                    item={item}
                    index={index}
                    total={items.length}
                    onMoveUp={(i) => move(i, i - 1)}
                    onMoveDown={(i) => move(i, i + 1)}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>

          <TextField
            fullWidth
            required
            multiline
            minRows={2}
            label="Why are you changing the order?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            inputProps={{ 'aria-label': 'Why are you changing the order?' }}
            helperText={
              reasonTooShort && reason.length > 0
                ? `At least ${MIN_OVERRIDE_REASON_LENGTH} characters.`
                : 'Required — for example: “Aetna confirmed by phone on 3 Oct that they are secondary.”'
            }
            data-testid="cob-override-reason"
            sx={{ mt: 2 }}
          />
        </Box>
      )}
    </BaseDialog>
  );
};

const OrderPreview = ({ heading, rows, testId }) => (
  <Box sx={{ flex: 1 }} data-testid={testId}>
    <Typography
      sx={{
        fontFamily: 'Inter',
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        color: COLORS.TEXT_MUTED,
        mb: 0.5,
      }}
    >
      {heading}
    </Typography>
    <Box component="ol" sx={{ m: 0, p: 0 }}>
      {rows.map((row, index) => (
        <Typography
          component="li"
          key={row.coverageId}
          sx={{ listStyle: 'none', fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY }}
        >
          {positionLabel(index + 1)}: {row.label}
        </Typography>
      ))}
    </Box>
  </Box>
);

export default CoverageOrderOverrideDialog;
