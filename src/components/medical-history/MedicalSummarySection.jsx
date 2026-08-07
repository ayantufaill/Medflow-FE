import { useMemo, useState } from "react";

const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const parseQuestionOptions = (questionText) => {
  if (!questionText) return { cleanQuestion: '', options: null };
  const match = questionText.match(/\(Options:\s*(.*?)\)/);
  if (match) {
    const options = match[1].split(',').map(s => s.trim());
    const cleanQuestion = questionText.replace(/\s*\(Options:\s*.*?\)/, '');
    return { cleanQuestion, options };
  }
  return { cleanQuestion: questionText, options: null };
};
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, InputAdornment, IconButton, Radio, FormControlLabel, MenuItem } from "@mui/material";
import {
  AssignmentOutlined as PersonalHistoryIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import SectionCard from "../shared/SectionCard";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius, standardFieldSx, roundedSelectMenuProps } from "../../constants/styles";

const SEVERITY_STYLES = {
  low: { label: "Low", color: COLORS.STATUS_SUCCESS, bg: "rgba(22, 163, 74, 0.10)" },
  moderate: { label: "Moderate", color: "#eab308", bg: "rgba(234, 179, 8, 0.10)" },
  high: { label: "High", color: COLORS.STATUS_ERROR, bg: "rgba(239, 68, 68, 0.10)" },
};

// Inverted from a typical "yes = good" pill — for a symptom/condition
// questionnaire, YES (patient has the condition) is the concerning answer.
const CONDITION_ANSWER_STYLES = {
  yes: { label: "YES", color: COLORS.STATUS_ERROR, bg: "rgba(239, 68, 68, 0.10)" },
  no: { label: "NO", color: COLORS.STATUS_SUCCESS, bg: "rgba(22, 163, 74, 0.10)" },
};

const LegendDot = ({ color }) => (
  <Box className="legend-dot" sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
);

const SeverityBadge = ({ severity }) => {
  const style = SEVERITY_STYLES[(severity || "").toLowerCase()];
  if (!style) return null;
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, borderRadius: radius.pill, px: 1, py: 0.25 }}>
      <LegendDot color={style.color} />
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: style.color }}>
        {style.label}
      </Typography>
    </Box>
  );
};

const AnswerPill = ({ answer }) => {
  const answerLower = (answer || "").toLowerCase();
  const isNo = answerLower === 'no';
  const isNotAnswered = answerLower === 'not answered' || answerLower === '';
  const isYes = !isNo && !isNotAnswered;

  if (isNotAnswered) {
    return <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, textAlign: "center", color: COLORS.TEXT_MUTED }}>not answered</Typography>;
  }

  const style = isYes ? CONDITION_ANSWER_STYLES.yes : CONDITION_ANSWER_STYLES.no;
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

import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { RadioGroup, Button, Checkbox, FormGroup } from "@mui/material";

const DiabetesReferenceTable = () => (
  <Box sx={{ mt: 1, backgroundColor: "transparent", p: 0, borderRadius: radius.md }}>
    <Typography sx={{ fontStyle: "italic", fontWeight: 600, mb: 1, fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>
      Diabetes
    </Typography>
    <Table size="small" sx={{ mb: 1.5, backgroundColor: "#fff", border: `1px solid ${COLORS.BORDER}`, "& td, & th": { border: `1px solid ${COLORS.BORDER}`, p: '4px 8px' } }}>
      <TableHead>
        <TableRow>
          <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Hemoglobin A1c</TableCell>
          <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Average Blood Sugar</TableCell>
          <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Level of Control</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell align="center" sx={{ fontSize: "0.75rem" }}>{"< 7%"}</TableCell>
          <TableCell align="center" sx={{ fontSize: "0.75rem" }}>{"< 140 mg/dL ~ 7.8 mmol/L"}</TableCell>
          <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Good</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center" sx={{ fontSize: "0.75rem" }}>{"7 - 9%"}</TableCell>
          <TableCell align="center" sx={{ fontSize: "0.75rem" }}>{"140-220 mg/dL ~ 7.8-11.1 mmol/L"}</TableCell>
          <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Fair</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center" sx={{ fontSize: "0.75rem" }}>{"> 9%"}</TableCell>
          <TableCell align="center" sx={{ fontSize: "0.75rem" }}>{"> 330 mg/dL ~ 12.2 mmol/L"}</TableCell>
          <TableCell align="center" sx={{ fontSize: "0.75rem" }}>Poor (Red Flag)</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography sx={{ display: 'list-item', fontFamily: "Inter", fontSize: "0.75rem", color: COLORS.TEXT_BODY, fontStyle: 'italic' }}>
        Diabetic patients have an increased risk for developing periodontal disease.
      </Typography>
      <Typography sx={{ display: 'list-item', fontFamily: "Inter", fontSize: "0.75rem", color: COLORS.TEXT_BODY, fontStyle: 'italic' }}>
        Epinephrine has a pharmacologic effect opposite to insulin. Local anesthetic with 1:100,000 can be used for well-controlled diabetics.
      </Typography>
      <Typography sx={{ display: 'list-item', fontFamily: "Inter", fontSize: "0.75rem", color: COLORS.TEXT_BODY, fontStyle: 'italic' }}>
        Periodontitis is associated with elevated serum HbA1c levels both in diabetic patients
      </Typography>
    </Box>
  </Box>
);

const MedicalAccordionRow = ({ section, index, onSectionChange }) => {
  const [expanded, setExpanded] = useState(false);
  const onToggle = () => setExpanded(!expanded);
  
  const answerLower = (section.answer || "").toLowerCase();
  const isPositive = answerLower !== 'no' && answerLower !== 'not answered' && answerLower !== '';

  const severityColor = SEVERITY_STYLES[(section.severity || "").toLowerCase()]?.color;
  const { cleanQuestion, options } = parseQuestionOptions(section.question);

  const selectedOptions = options && isPositive && answerLower !== 'yes'
    ? section.answer.split(',').map(s => s.trim())
    : [];

  const handleOptionChange = (option, checked) => {
    if (checked) {
      const newOptions = [...selectedOptions, option];
      onSectionChange(section.id || section.number || index, "answer", newOptions.join(', '));
    } else {
      const newOptions = selectedOptions.filter(o => o !== option);
      if (newOptions.length === 0) {
        // If all options are unchecked, the answer becomes 'No' (or could be 'Yes' depending on preference, 
        // but typically unchecking all means no issues). Let's default to 'not answered' or 'No'.
        // We'll set it to 'No' so it resolves the question.
        onSectionChange(section.id || section.number || index, "answer", "No");
      } else {
        onSectionChange(section.id || section.number || index, "answer", newOptions.join(', '));
      }
    }
  };

  return (
    <Box sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
      <Box
        onClick={onToggle}
        sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5, cursor: "pointer", "&:hover": { backgroundColor: "rgba(0,0,0,0.01)" } }}
      >
        <RowNumber number={section.number || index + 1} />
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          {capitalizeFirstLetter(cleanQuestion)}
        </Typography>
        {severityColor && isPositive && <LegendDot color={severityColor} />}
        <AnswerPill answer={section.answer} />
        <ExpandMoreIcon sx={{ fontSize: 20, color: COLORS.TEXT_MUTED, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </Box>

      {expanded && (
        <Box sx={{ px: 2, pb: 2, backgroundColor: COLORS.SURFACE_TINT }}>
          {options ? (
            <Box sx={{ mb: 3, pt: 1, ml: 4 }}>
              <FormGroup>
                {options.map(opt => {
                  if (opt === '---') {
                    return <Box key="divider" sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, my: 1, ml: 4, width: '100%', maxWidth: 200 }} />;
                  }
                  return (
                    <FormControlLabel
                      key={opt}
                      control={
                        <Checkbox 
                          size="small" 
                          checked={selectedOptions.includes(opt)}
                          onChange={(e) => handleOptionChange(opt, e.target.checked)}
                          sx={{ p: 0.5 }}
                        />
                      }
                      label={<Typography sx={{ fontSize: fontSize.sm, fontFamily: "Inter", color: COLORS.TEXT_PRIMARY }}>{opt}</Typography>}
                    />
                  );
                })}
              </FormGroup>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, pt: 1 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase" }}>Answer:</Typography>
              <RadioGroup
                row
                value={isPositive ? 'yes' : (answerLower === 'no' ? 'no' : '')}
                onChange={(e) => onSectionChange(section.id || section.number || index, "answer", e.target.value === 'yes' ? 'Yes' : 'No')}
              >
                <FormControlLabel value="yes" control={<Radio size="small" />} label={<Typography sx={{ fontSize: fontSize.sm, fontFamily: "Inter" }}>Yes</Typography>} />
                <FormControlLabel value="no" control={<Radio size="small" />} label={<Typography sx={{ fontSize: fontSize.sm, fontFamily: "Inter" }}>No</Typography>} />
              </RadioGroup>
            </Box>
          )}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {isPositive && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                    Severity
                  </Typography>
                  <TextField
                    select
                    variant="outlined"
                    size="small"
                    value={section.severity ? capitalizeFirstLetter(section.severity.toLowerCase()) : "Low"}
                    onChange={(e) => onSectionChange(section.id || section.number || index, "severity", e.target.value.toLowerCase())}
                    SelectProps={{ MenuProps: roundedSelectMenuProps }}
                    sx={{ ...standardFieldSx, width: 150 }}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </TextField>
                </Box>
              )}
              {section.scale !== undefined && section.scale !== null && (
                <FieldBox
                  label="On a scale of 1 to 10"
                  value={section.scale || ""}
                  InputProps={{ endAdornment: <InputAdornment position="end">/ 10</InputAdornment> }}
                  onChange={(e) => {
                    let val = e.target.value.trim();
                    if (val === "") {
                      onSectionChange(section.id || section.number || index, "scale", "");
                    } else if (/^\d+$/.test(val)) {
                      let num = parseInt(val, 10);
                      if (num >= 0 && num <= 10) {
                        onSectionChange(section.id || section.number || index, "scale", num.toString());
                      }
                    }
                  }}
                />
              )}
              <FieldBox
                label="Comment"
                placeholder="Add patient comment..."
                value={section.comment}
                onChange={(e) => onSectionChange(section.id || section.number || index, "comment", e.target.value)}
              />
              <FieldBox
                label="Doctor's Note"
                placeholder="Add doctor's note..."
                value={section.doctorNote}
                onChange={(e) => onSectionChange(section.id || section.number || index, "doctorNote", e.target.value)}
              />
            </Box>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, height: '100%' }}>
              <FieldBox
                label="Additional Information"
                placeholder="No additional information."
                value={section.additionalInfo}
                onChange={(e) => onSectionChange(section.id || section.number || index, "additionalInfo", e.target.value)}
                multiline
                maxRows={6}
                sx={{ flex: section.id === 'diabetes' ? 0 : 1 }}
                textFieldSx={section.id === 'diabetes' ? undefined : { height: 'calc(100% - 20px)', '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' } }}
              />
              {section.id === 'diabetes' && <DiabetesReferenceTable />}
            </Box>
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
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.bold, color: active ? COLORS.TEXT_PRIMARY : COLORS.TEXT_MUTED }}>
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
      const answerLower = (section.answer || "").toLowerCase();
      const isPositive = answerLower !== 'no' && answerLower !== 'not answered' && answerLower !== '';
      
      const hasNote = !!(section.comment || section.doctorNote || section.additionalInfo || section.scale);

      if (historyTab === 0) {
        if (!isPositive && !hasNote) return false;
      } else {
        if (flaggedOnly && !isPositive) return false;
      }
      
      const { cleanQuestion } = parseQuestionOptions(section.question);
      if (searchQuery && !(cleanQuestion || "").toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [summarySections, flaggedOnly, searchQuery, historyTab]);

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
                <TableCell sx={{ width: "55%", borderColor: COLORS.BORDER, py: 1.5 }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                    Condition
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "10%", borderColor: COLORS.BORDER, py: 1.5 }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                    Answer
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: "35%", borderColor: COLORS.BORDER, py: 1.5 }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                    Additional Information
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSections.map((section, index) => (
                <TableRow key={section.number || index} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={{ borderColor: COLORS.BORDER_LIGHT, verticalAlign: "top", py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                      <RowNumber number={section.number || index + 1} />
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                            {capitalizeFirstLetter(parseQuestionOptions(section.question).cleanQuestion) || "No question available"}
                          </Typography>
                          {(() => {
                            const answerLower = (section.answer || "").toLowerCase();
                            const isPositive = answerLower !== 'no' && answerLower !== 'not answered' && answerLower !== '';
                            return isPositive && <SeverityBadge severity={section.severity} />;
                          })()}
                        </Box>
                        {section.scale && (
                          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
                            on a scale of 1 to 10: {section.scale}
                          </Typography>
                        )}
                        {section.doctorNote && (
                          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25, whiteSpace: "pre-wrap" }}>
                            <Box component="span" sx={{ fontWeight: "bold" }}>Doctor's Note:</Box> {section.doctorNote}
                          </Typography>
                        )}
                        {section.comment && (
                            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25, whiteSpace: "pre-wrap" }}>
                            <Box component="span" sx={{ fontWeight: "bold" }}>Comment:</Box> {section.comment}
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
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ backgroundColor: "#EFA8310F", border: `1px solid #EFA83140`, borderRadius: radius.md, px: 1.5, py: 1, maxHeight: 150, overflowY: "auto" }}>
                          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_BODY, whiteSpace: "pre-wrap" }}>
                            {section.additionalInfo}
                          </Typography>
                        </Box>
                        {section.id === 'diabetes' && <DiabetesReferenceTable />}
                      </Box>
                    ) : (
                      section.id === 'diabetes' ? (
                        <DiabetesReferenceTable />
                      ) : (
                        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>—</Typography>
                      )
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
            <Box sx={{ borderTop: `1px solid ${COLORS.BORDER_LIGHT}` }}>
              {filteredSections.map((section, index) => (
                <MedicalAccordionRow
                  key={`${section.number}-${section.question}`}
                  section={section}
                  index={index}
                  onSectionChange={onSectionChange}
                />
              ))}
            </Box>
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
