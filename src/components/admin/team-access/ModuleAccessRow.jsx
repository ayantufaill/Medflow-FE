import { Box, Typography, Chip, Button, ToggleButton, ToggleButtonGroup, Switch, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import { ACCESS_LEVELS, ACCESS_LEVEL_LABELS, isLevelWithin, featureBase } from '../../../constants/teamModuleAccess';

// Same Full / View / None colouring as the screen access matrix.
const LEVEL_TONES = {
  full: { bg: '#E7F4EC', fg: COLORS.STATUS_SUCCESS },
  view: { bg: '#FDF3E1', fg: '#B26A00' },
  none: { bg: COLORS.SURFACE_INPUT, fg: COLORS.TEXT_SECONDARY },
};

const toggleSx = {
  '& .MuiToggleButton-root': {
    textTransform: 'none',
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    px: 1.5,
    py: 0.5,
    color: COLORS.TEXT_SECONDARY,
    borderColor: COLORS.BORDER,
  },
  ...Object.fromEntries(
    Object.entries(LEVEL_TONES).map(([level, tone]) => [
      `& .MuiToggleButton-root[value="${level}"].Mui-selected, & .MuiToggleButton-root[value="${level}"].Mui-selected:hover`,
      { bgcolor: tone.bg, color: tone.fg },
    ])
  ),
};

const RoleDot = () => (
  <Box component="span" sx={{ ml: 0.75, width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', opacity: 0.6, display: 'inline-block' }} />
);

/**
 * One module on the Team Access page: its level (None / View / Full, with the
 * role's own level marked by a dot) and, under "Customize", the narrower
 * feature switches inside it. A feature switch wins over the module level.
 */
const ModuleAccessRow = ({
  module,
  levelOverride,
  featureOverrides,
  expanded,
  disabled,
  onToggleExpand,
  onLevelChange,
  onFeatureChange,
  onReset,
}) => {
  const level = levelOverride || module.roleDefaultLevel;
  const customFeatures = module.features.filter((f) => featureOverrides[f.key] !== undefined).length;
  const isCustom = levelOverride !== undefined || customFeatures > 0;

  return (
    <Box
      sx={{
        borderRadius: radius.md,
        border: `1px solid ${isCustom ? COLORS.ACCENT : COLORS.BORDER_LIGHT}`,
        bgcolor: isCustom ? COLORS.SURFACE_TINT : 'transparent',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', p: 1.75 }}>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY }}>{module.label}</Typography>
            {isCustom && <Chip size="small" label="Custom" sx={{ height: 20, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, bgcolor: COLORS.ACCENT_BG, color: COLORS.ACCENT }} />}
          </Box>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>{module.description}</Typography>
          <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
            Role default: {module.roleDefault}
            {module.maxLevel !== ACCESS_LEVELS.FULL && ` · You can grant up to ${ACCESS_LEVEL_LABELS[module.maxLevel]}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {isCustom && (
            <Button size="small" onClick={onReset} disabled={disabled} sx={{ textTransform: 'none', fontSize: fontSize.base }}>
              Reset
            </Button>
          )}
          <Button
            size="small"
            onClick={onToggleExpand}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{ textTransform: 'none', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}
          >
            Customize{customFeatures > 0 ? ` (${customFeatures})` : ''}
          </Button>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={level}
            onChange={(_, next) => next && onLevelChange(next)}
            disabled={disabled}
            sx={toggleSx}
          >
            {module.levels.map((option) => {
              const isRoleLevel = option === module.roleDefaultLevel;
              return (
                <ToggleButton
                  key={option}
                  value={option}
                  title={isRoleLevel ? 'What their role gives' : undefined}
                  disabled={disabled || (!isRoleLevel && !isLevelWithin(option, module.maxLevel))}
                >
                  {ACCESS_LEVEL_LABELS[option]}
                  {isRoleLevel && <RoleDot />}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Collapse in={expanded} unmountOnExit>
        <Box sx={{ borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, px: 1.75, py: 1 }}>
          {module.features.map((f) => {
            const override = featureOverrides[f.key];
            const checked = override !== undefined ? override : featureBase(f, levelOverride);
            return (
              <Box key={f.key} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_BODY }}>
                    {f.label}
                    {f.roleDefault && <Box component="span" title="Their role gives this" sx={{ color: COLORS.TEXT_MUTED }}><RoleDot /></Box>}
                  </Typography>
                </Box>
                {override !== undefined && (
                  <Typography sx={{ fontSize: fontSize.sm, color: COLORS.ACCENT, fontWeight: fontWeight.semibold }}>Custom</Typography>
                )}
                <Switch
                  size="small"
                  checked={checked}
                  disabled={disabled || (!checked && !f.canGrant)}
                  onChange={(e) => onFeatureChange(f, e.target.checked)}
                />
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ModuleAccessRow;
