import { useMemo, useState } from "react";
import { Box, Typography, TextField, InputAdornment, Radio, FormControlLabel } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Search as SearchIcon, SentimentSatisfiedAltOutlined as EmptyStateIcon } from "@mui/icons-material";
import SectionCard from "../shared/SectionCard";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius, standardFieldSx } from "../../constants/styles";

const SEVERITY_COLORS = {
  low: COLORS.STATUS_SUCCESS,
  moderate: COLORS.STATUS_WARNING,
  high: COLORS.STATUS_ERROR,
};

const CONDITION_ANSWER_STYLES = {
  yes: { label: "YES", color: COLORS.STATUS_ERROR, bg: "rgba(239, 68, 68, 0.10)" },
  no: { label: "NO", color: COLORS.STATUS_SUCCESS, bg: "rgba(22, 163, 74, 0.10)" },
};

const LegendDot = ({ color }) => (
  <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
);

const AnswerPill = ({ answer }) => {
  const style = CONDITION_ANSWER_STYLES[(answer || "").toLowerCase()];
  if (!style) {
    return <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>—</Typography>;
  }
  return (
    <Box sx={{ display: "inline-flex", justifyContent: "center", minWidth: 48, backgroundColor: style.bg, borderRadius: radius.pill, px: 1.25, py: 0.4 }}>
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, letterSpacing: "0.3px", color: style.color }}>
        {style.label}
      </Typography>
    </Box>
  );
};

const RowNumber = ({ number }) => (
  <Box sx={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${COLORS.BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY }}>{number}</Typography>
  </Box>
);

const SegmentedTabs = ({ value, onChange, fullLabel }) => (
  <Box sx={{ display: "inline-flex", backgroundColor: COLORS.SURFACE_INPUT, borderRadius: radius.pill, p: 0.5 }}>
    {["Summary", fullLabel].map((label, index) => {
      const active = value === index;
      return (
        <Box
          key={label}
          onClick={() => onChange(index)}
          sx={{ px: 2, py: 0.75, borderRadius: radius.pill, cursor: "pointer", backgroundColor: active ? COLORS.SURFACE_CARD : "transparent", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.12)" : "none" }}
        >
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: active ? COLORS.TEXT_PRIMARY : COLORS.TEXT_MUTED }}>
            {label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

const FieldBox = ({ label, value, onChange, placeholder, multiline }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
      {label}
    </Typography>
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      multiline={multiline}
      minRows={multiline ? 2 : undefined}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      sx={standardFieldSx}
    />
  </Box>
);

const AccordionRow = ({ item, index, section, onUpdateItem, expanded, onToggle }) => {
  const severityColor = SEVERITY_COLORS[(item.severity || "").toLowerCase()];

  return (
    <Box sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
      <Box
        onClick={onToggle}
        sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5, cursor: "pointer" }}
      >
        <RowNumber number={item.number || index + 1} />
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          {item.question}
        </Typography>
        {severityColor && <LegendDot color={severityColor} />}
        <AnswerPill answer={item.answer} />
        <ExpandMoreIcon sx={{ fontSize: 20, color: COLORS.TEXT_MUTED, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </Box>

      {expanded && (
        <Box sx={{ px: 2, pb: 2, backgroundColor: COLORS.SURFACE_TINT }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 1.5 }}>
            {item.scale !== undefined && item.scale !== null && item.scale !== "" && (
              <FieldBox
                label="On a scale of 1 to 10"
                value={`${item.scale} / 10`}
                onChange={(e) => onUpdateItem(section, item.id, "scale", e.target.value.replace(" / 10", ""))}
              />
            )}
            <FieldBox
              label="Additional Information"
              placeholder="No additional information."
              value={item.additionalInfo}
              onChange={(e) => onUpdateItem(section, item.id, "additionalInfo", e.target.value)}
              multiline
            />
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <FieldBox
              label="Comment"
              placeholder="Add patient comment..."
              value={item.comment}
              onChange={(e) => onUpdateItem(section, item.id, "comment", e.target.value)}
            />
            <FieldBox
              label="Doctor's Note"
              placeholder="Add doctor's note..."
              value={item.note}
              onChange={(e) => onUpdateItem(section, item.id, "note", e.target.value)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

/**
 * SectionCard-wrapped, searchable/flaggable accordion list — shared by
 * Personal History, Gum and Bone, and Bite and Jaw Joint so all three read
 * as one consistent card style instead of three plain tables.
 */
const DentalHistoryAccordionCard = ({ icon, title, emptyLabel, fullLabel, items, section, onUpdateItem, sx }) => {
  const [tab, setTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (flaggedOnly && (item.answer || "").toLowerCase() !== "yes") return false;
      if (searchQuery && !(item.question || "").toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [items, flaggedOnly, searchQuery]);

  const legend = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Object.entries(SEVERITY_COLORS).map(([label, color]) => (
        <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LegendDot color={color} />
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color, fontWeight: fontWeight.medium, textTransform: "capitalize" }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  if (!items.length) {
    return (
      <SectionCard icon={icon} title={title} action={legend} sx={sx}>
        <Box
          sx={{
            border: `1.5px dashed ${COLORS.BORDER}`,
            borderRadius: radius.md,
            py: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EmptyStateIcon sx={{ fontSize: 28, color: COLORS.TEXT_MUTED }} />
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
            No {emptyLabel} questions found.
          </Typography>
        </Box>
      </SectionCard>
    );
  }

  return (
    <SectionCard icon={icon} title={title} action={legend} sx={sx}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
        <SegmentedTabs value={tab} onChange={setTab} fullLabel={fullLabel} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: COLORS.TEXT_MUTED }} /></InputAdornment> }}
            sx={{ minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: radius.md, fontSize: fontSize.base } }}
          />
          <FormControlLabel
            control={
              <Radio
                size="small"
                checked={flaggedOnly}
                onClick={() => setFlaggedOnly((prev) => !prev)}
                sx={{ p: 0.5, color: COLORS.ACCENT, "&.Mui-checked": { color: COLORS.ACCENT } }}
              />
            }
            label={<Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>Flagged only</Typography>}
            sx={{ mr: 0 }}
          />
        </Box>
      </Box>

      <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, overflow: "hidden" }}>
        {filteredItems.length ? (
          filteredItems.map((item, index) => (
            <AccordionRow
              key={item.id || index}
              item={item}
              index={index}
              section={section}
              onUpdateItem={onUpdateItem}
              expanded={expandedId === (item.id ?? index)}
              onToggle={() => setExpandedId((prev) => (prev === (item.id ?? index) ? null : (item.id ?? index)))}
            />
          ))
        ) : (
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, textAlign: "center", py: 3 }}>
            No questions match your search.
          </Typography>
        )}
      </Box>
    </SectionCard>
  );
};

export default DentalHistoryAccordionCard;
