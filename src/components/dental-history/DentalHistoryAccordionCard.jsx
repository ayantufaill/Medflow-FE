import { useMemo, useState } from "react";
import { Box, Typography, TextField, InputAdornment, Radio, FormControlLabel, RadioGroup, Button } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Search as SearchIcon, SentimentSatisfiedAltOutlined as EmptyStateIcon } from "@mui/icons-material";
import SectionCard from "../shared/SectionCard";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius, standardFieldSx } from "../../constants/styles";

const SEVERITY_COLORS = {
  low: COLORS.STATUS_SUCCESS,
  moderate: '#eab308', // yellow
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

const FieldBox = ({ label, value, onChange, placeholder, multiline, minRows, maxRows, sx, textFieldSx, InputProps }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1, ...sx }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
      {label}
    </Typography>
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      multiline={multiline}
      minRows={minRows !== undefined ? minRows : (multiline ? 2 : undefined)}
      maxRows={maxRows}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      InputProps={InputProps}
      sx={{ ...standardFieldSx, ...textFieldSx }}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, pt: 1 }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase" }}>Answer:</Typography>
            <RadioGroup
              row
              value={item.answer?.toLowerCase() === 'yes' ? 'yes' : 'no'}
              onChange={(e) => onUpdateItem(section, item.id, "answer", e.target.value === 'yes' ? 'Yes' : 'No')}
            >
              <FormControlLabel value="yes" control={<Radio size="small" />} label={<Typography sx={{ fontSize: fontSize.sm, fontFamily: "Inter" }}>Yes</Typography>} />
              <FormControlLabel value="no" control={<Radio size="small" />} label={<Typography sx={{ fontSize: fontSize.sm, fontFamily: "Inter" }}>No</Typography>} />
            </RadioGroup>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {item.scale !== undefined && item.scale !== null && (
                <FieldBox
                  label="On a scale of 1 to 10"
                  value={item.scale || ""}
                  InputProps={{ endAdornment: <InputAdornment position="end">/ 10</InputAdornment> }}
                  onChange={(e) => {
                    let val = e.target.value.trim();
                    if (val === "") {
                      onUpdateItem(section, item.id, "scale", "");
                    } else if (/^\d+$/.test(val)) {
                      let num = parseInt(val, 10);
                      if (num >= 0 && num <= 10) {
                        onUpdateItem(section, item.id, "scale", num.toString());
                      }
                    }
                  }}
                />
              )}
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
            
            <FieldBox
              label="Additional Information"
              placeholder="No additional information."
              value={item.additionalInfo}
              onChange={(e) => onUpdateItem(section, item.id, "additionalInfo", e.target.value)}
              multiline
              maxRows={6}
              sx={{ height: '100%' }}
              textFieldSx={{ height: 'calc(100% - 20px)', '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' } }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" disableElevation size="small" onClick={onToggle} sx={{ textTransform: 'none', px: 3, bgcolor: '#1d4ed8', '&:hover': { bgcolor: '#1e40af' }, fontWeight: 600, borderRadius: '6px' }}>
              Done
            </Button>
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

      {tab === 0 && (
        <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.SURFACE_TINT, borderBottom: `1px solid ${COLORS.BORDER}` }}>
                <th style={{ padding: "12px 16px", width: "55%", color: COLORS.TEXT_SECONDARY, fontSize: fontSize.xs, fontWeight: fontWeight.semibold, textTransform: "uppercase" }}>Condition</th>
                <th style={{ padding: "12px 16px", width: "10%", color: COLORS.TEXT_SECONDARY, fontSize: fontSize.xs, fontWeight: fontWeight.semibold, textTransform: "uppercase", textAlign: "center" }}>Answer</th>
                <th style={{ padding: "12px 16px", width: "35%", color: COLORS.TEXT_SECONDARY, fontSize: fontSize.xs, fontWeight: fontWeight.semibold, textTransform: "uppercase" }}>Additional Information</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length ? (
                filteredItems.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
                    <td style={{ padding: "16px", verticalAlign: "top" }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                        <RowNumber number={item.number || index + 1} />
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                              {item.question}
                            </Typography>
                            {SEVERITY_COLORS[(item.severity || "").toLowerCase()] && <LegendDot color={SEVERITY_COLORS[(item.severity || "").toLowerCase()]} />}
                          </Box>
                          {item.scale !== undefined && item.scale !== null && item.scale !== "" && (
                            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
                              on a scale of 1 to 10: {item.scale}
                            </Typography>
                          )}
                          {item.note && (
                            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25, whiteSpace: "pre-wrap" }}>
                              <Box component="span" sx={{ fontWeight: "bold" }}>Doctor's Note:</Box> {item.note}
                            </Typography>
                          )}
                          {item.comment && (
                            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25, whiteSpace: "pre-wrap" }}>
                              <Box component="span" sx={{ fontWeight: "bold" }}>Comment:</Box> {item.comment}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </td>
                    <td style={{ padding: "16px", verticalAlign: "top", textAlign: "center" }}>
                      <AnswerPill answer={item.answer} />
                    </td>
                    <td style={{ padding: "16px", verticalAlign: "top" }}>
                      {item.additionalInfo ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ backgroundColor: "#EFA8310F", border: `1px solid #EFA83140`, borderRadius: radius.md, px: 1.5, py: 1, maxHeight: 150, overflowY: "auto" }}>
                            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_BODY, whiteSpace: "pre-wrap" }}>
                              {item.additionalInfo}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>—</Typography>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ padding: "16px", textAlign: "center" }}>
                    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
                      No questions match your search.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      )}

      {tab === 1 && (
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
      )}
    </SectionCard>
  );
};

export default DentalHistoryAccordionCard;
