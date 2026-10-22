import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

/**
 * Shared styling for the flag banners.
 *
 * In its own module rather than exported from FlagBannerShell so that file
 * only exports a component — mixing component and constant exports breaks
 * Vite's fast refresh for the whole module.
 */

/** Outlined secondary action on a banner (e.g. "Keep our order"). */
export const secondaryActionSx = {
  fontFamily: 'Inter',
  fontSize: fontSize.base,
  fontWeight: fontWeight.medium,
  textTransform: 'none',
  borderRadius: radius.md,
  borderColor: COLORS.BORDER,
  color: COLORS.TEXT_BODY,
};

/** The inset white panel a banner uses for structured detail. */
export const detailBoxSx = {
  backgroundColor: COLORS.SURFACE_CARD,
  border: `1px solid ${COLORS.BORDER}`,
  borderRadius: radius.md,
  p: 1.25,
};
