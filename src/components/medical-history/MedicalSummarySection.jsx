import { useMemo, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, InputAdornment, IconButton, Radio, Checkbox, FormControlLabel, RadioGroup } from "@mui/material";
import {
  AssignmentOutlined as PersonalHistoryIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  InfoOutlined as InfoIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import SectionCard from "../shared/SectionCard";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const SEVERITY_STYLES = {
  low: { label: "Low", color: COLORS.STATUS_SUCCESS, bg: "rgba(22, 163, 74, 0.10)" },
  moderate: { label: "Moderate", color: COLORS.STATUS_WARNING, bg: "rgba(234, 88, 12, 0.10)" },
  high: { label: "High", color: COLORS.STATUS_ERROR, bg: "rgba(239, 68, 68, 0.10)" },
};

// Inverted from a typical "yes = good" pill — for a symptom/condition
// questionnaire, YES (patient has the condition) is the concerning answer.
const CONDITION_ANSWER_STYLES = {
  yes: { label: "YES", color: COLORS.STATUS_ERROR, bg: "rgba(239, 68, 68, 0.10)" },
  no: { label: "NO", color: COLORS.STATUS_SUCCESS, bg: "rgba(22, 163, 74, 0.10)" },
};

const LegendDot = ({ color }) => (
  <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
);

const SeverityBadge = ({ severity }) => {
  const style = SEVERITY_STYLES[(severity || "").toLowerCase()];
  if (!style || style === SEVERITY_STYLES.low) return null;
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, backgroundColor: style.bg, borderRadius: radius.pill, px: 1, py: 0.25 }}>
      <LegendDot color={style.color} />
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: style.color }}>
        {style.label}
      </Typography>
    </Box>
  );
};

const AnswerPill = ({ answer }) => {
  const style = CONDITION_ANSWER_STYLES[(answer || "").toLowerCase()];
  if (!style) {
    return <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, textAlign: "center" }}>—</Typography>;
  }
  return (
    <Box
      sx={{
        display: "inline-flex",
        justifyContent: "center",
        minWidth: 48,
        backgroundColor: style.bg,
        borderRadius: radius.pill,
        px: 1.25,
        py: 0.4,
      }}
    >
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, letterSpacing: "0.3px", color: style.color }}>
        {style.label}
      </Typography>
    </Box>
  );
};

const RowNumber = ({ number }) => (
  <Box
    sx={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      border: `1px solid ${COLORS.BORDER}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY }}>
      {number}
    </Typography>
  </Box>
);

const SegmentedTabs = ({ value, onChange }) => (
  <Box sx={{ display: "inline-flex", backgroundColor: COLORS.SURFACE_INPUT, borderRadius: radius.pill, p: 0.5 }}>
    {["Summary", "Full Medical History"].map((label, index) => {
      const active = value === index;
      return (
        <Box
          key={label}
          onClick={() => onChange(index)}
          sx={{
            px: 2,
            py: 0.75,
            borderRadius: radius.pill,
            cursor: "pointer",
            backgroundColor: active ? COLORS.SURFACE_CARD : "transparent",
            boxShadow: active ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
          }}
        >
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: active ? COLORS.TEXT_PRIMARY : COLORS.TEXT_MUTED }}>
            {label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

const MedicalSummarySection = ({
  historyTab,
  onChangeTab,
  summarySections,
  onSectionChange,
}) => {
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const toggleEdit = (id) => {
    setEditingSectionId(editingSectionId === id ? null : id);
  };

  const filteredSections = useMemo(() => {
    return summarySections.filter((section) => {
      if (flaggedOnly && (section.answer || "").toLowerCase() !== "yes") return false;
      if (searchQuery && !(section.question || "").toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [summarySections, flaggedOnly, searchQuery]);

  return (
    <SectionCard
      icon={PersonalHistoryIcon}
      title="Personal History"
      action={
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {Object.values(SEVERITY_STYLES).map((style) => (
            <Box key={style.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LegendDot color={style.color} />
              <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: style.color, fontWeight: fontWeight.medium }}>
                {style.label}
              </Typography>
            </Box>
          ))}
        </Box>
      }
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
        <SegmentedTabs value={historyTab} onChange={onChangeTab} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: COLORS.TEXT_MUTED }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 220,
              "& .MuiOutlinedInput-root": { borderRadius: radius.md, fontSize: fontSize.base },
            }}
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

      {historyTab === 0 && (
        <Paper variant="outlined" sx={{ borderRadius: radius.md, border: `1px solid ${COLORS.BORDER}`, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: COLORS.SURFACE_TINT }}>
                <TableCell sx={{ width: "55%", borderColor: COLORS.BORDER }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                    Condition
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "10%", borderColor: COLORS.BORDER }} align="center">
                  <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                    Answer
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "35%", borderColor: COLORS.BORDER }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                    Additional Information
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSections.map((section, index) => (
                <TableRow key={section.number || index} sx={{ "&:last-child td": { borderBottom: "none" } }}>
                  <TableCell sx={{ borderColor: COLORS.BORDER_LIGHT, verticalAlign: "top", py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                      <RowNumber number={section.number || index + 1} />
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                            {section.question || "No question available"}
                          </Typography>
                          <SeverityBadge severity={section.severity} />
                        </Box>
                        {section.scale && (
                          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
                            on a scale of 1 to 10: {section.scale}
                          </Typography>
                        )}
                        {section.doctorNote && (
                          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
                            Doctor&apos;s Note: {section.doctorNote}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderColor: COLORS.BORDER_LIGHT, verticalAlign: "top", py: 2 }} align="center">
                    <AnswerPill answer={section.answer} />
                  </TableCell>
                  <TableCell sx={{ borderColor: COLORS.BORDER_LIGHT, verticalAlign: "top", py: 2 }}>
                    {section.additionalInfo ? (
                      <Box sx={{ backgroundColor: "rgba(234, 88, 12, 0.06)", border: `1px solid rgba(234, 88, 12, 0.25)`, borderRadius: radius.md, px: 1.5, py: 1 }}>
                        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>
                          {section.additionalInfo}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!filteredSections.length && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, textAlign: "center", py: 2 }}>
                      No conditions match your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {historyTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {filteredSections.length ? (
            filteredSections.map((section, index) => {
              const isAllergyQuestion = section.number === 2;

              if (isAllergyQuestion) {
                return (
                  <Paper
                    key={`${section.number}-${section.question}`}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: "grey.300",
                      bgcolor: '#f8fbff', // Light blue background for emphasis
                      position: 'relative',
                      mb: 1.5
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#333' }}>
                          {section.number}.
                        </Typography>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#4A90E2', mb: 1.5 }}>
                            {section.question}
                          </Typography>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: -1 }}>
                            {['aspirin', 'ibuprofen', 'acetaminophen', 'codeine', 'penicillin'].map((item) => (
                              <FormControlLabel
                                key={item}
                                control={<Checkbox size="small" sx={{ py: 0.25 }} />}
                                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>{item}</Typography>}
                                sx={{ mb: -0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InfoIcon sx={{ fontSize: '1rem', color: '#999' }} />
                          <RadioGroup row defaultValue="no">
                            <FormControlLabel
                              value="yes"
                              control={<Radio size="small" sx={{ p: 0.5 }} />}
                              label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Yes</Typography>}
                              labelPlacement="start"
                              sx={{ ml: 0, mr: 1 }}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio size="small" sx={{ p: 0.5 }} />}
                              label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>No</Typography>}
                              labelPlacement="start"
                              sx={{ ml: 0 }}
                            />
                          </RadioGroup>
                        </Box>
                        <Typography sx={{ color: '#4A90E2', fontSize: '0.85rem', cursor: 'pointer', mt: 0.5 }}>
                          Done
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              }

              const isEditing = editingSectionId === (section.id || section.number || index);

              return (
                <Paper
                  key={`${section.number}-${section.question}`}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderColor: isEditing ? "primary.main" : "grey.300",
                    transition: '0.2s',
                    position: 'relative',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => toggleEdit(section.id || section.number || index)}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: isEditing ? 'primary.main' : 'grey.400'
                    }}
                  >
                    {isEditing ? <CheckIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                  </IconButton>

                  <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 1.5, pr: 4 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a3353' }}>
                      {section.number ? `${section.number}. ` : ""}
                      {section.question}
                    </Typography>
                    <SeverityBadge severity={section.severity} />
                  </Box>

                  {isEditing ? (
                    <>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {/* Answer Field */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '150px' }}>
                          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Answer:</Typography>
                          <TextField
                            variant="standard"
                            size="small"
                            autoFocus
                            value={section.answer || ""}
                            onChange={(e) =>
                              onSectionChange(
                                section.id || section.number || index,
                                "answer",
                                e.target.value,
                              )
                            }
                            InputProps={{
                              disableUnderline: true,
                              sx: { fontSize: '13px', fontWeight: 600, color: '#334155' }
                            }}
                            sx={{
                              borderBottom: '1px solid #e2e8f0',
                              '&:hover': { borderBottomColor: '#94a3b8' },
                              minWidth: 80
                            }}
                          />
                        </Box>

                        {/* Comment Field */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: '250px' }}>
                          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Comment:</Typography>
                          <TextField
                            variant="standard"
                            fullWidth
                            size="small"
                            value={section.comment || ""}
                            onChange={(e) =>
                              onSectionChange(
                                section.id || section.number || index,
                                "comment",
                                e.target.value,
                              )
                            }
                            placeholder="Add comment..."
                            InputProps={{ disableUnderline: true, sx: { fontSize: '13px' } }}
                          />
                        </Box>
                      </Box>

                      {/* Doctor's Note Field */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Doctor&apos;s Note:</Typography>
                        <TextField
                          variant="standard"
                          fullWidth
                          size="small"
                          value={section.doctorNote || ""}
                          onChange={(e) =>
                            onSectionChange(
                              section.id || section.number || index,
                              "doctorNote",
                              e.target.value,
                            )
                          }
                          placeholder="Enter clinical notes..."
                          InputProps={{ disableUnderline: true, sx: { fontSize: '13px', color: '#64748b' } }}
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          <span style={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginRight: '4px' }}>Answer:</span>
                          {section.answer || "—"}
                        </Typography>
                        {section.comment && (
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            <span style={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginRight: '4px' }}>Comment:</span>
                            {section.comment}
                          </Typography>
                        )}
                      </Box>
                      {section.doctorNote && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#94a3b8', fontStyle: 'italic' }}>
                          <span style={{ fontWeight: 700, textTransform: 'uppercase', marginRight: '4px' }}>Doctor&apos;s Note:</span>
                          {section.doctorNote}
                        </Typography>
                      )}
                    </>
                  )}
                </Paper>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
              No conditions match your search.
            </Typography>
          )}
        </Box>
      )}
    </SectionCard>
  );
};

export default MedicalSummarySection;
