import React, { useState } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, Button, TextField, Collapse } from "@mui/material";
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight } from "../../constants/styles";

export const parseQuestionOptions = (questionText) => {
  const match = questionText.match(/\(Options:\s*(.+)\)$/i);
  if (match) {
    return {
      text: questionText.replace(/\(Options:\s*(.+)\)$/i, '').trim(),
      options: match[1].split(',').map(s => s.trim())
    };
  }
  return { text: questionText, options: null };
};

export const HistoryRow = ({ item, sectionKey, onUpdateItem, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { text, options } = parseQuestionOptions(item.question);

  const answer = item.answer || 'not answered';
  
  const selectedOptions = options && answer && answer !== 'not answered' && answer !== 'No' && answer !== 'Yes'
    ? answer.split(',').map(s => s.trim())
    : [];

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleOptionToggle = (opt) => {
    let newSelected = [...selectedOptions];
    if (newSelected.includes(opt)) {
      newSelected = newSelected.filter(o => o !== opt);
    } else {
      newSelected.push(opt);
    }
    const newAnswer = newSelected.length > 0 ? newSelected.join(', ') : 'not answered';
    onUpdateItem(sectionKey, item.id, 'answer', newAnswer);
  };

  const handleRadioChange = (e) => {
    onUpdateItem(sectionKey, item.id, 'answer', e.target.value);
  };

  return (
    <Box sx={{ borderBottom: "1px solid #e0e0e0", py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
            <Box component="span" sx={{ mr: 2 }}>{item.number}.</Box>
            {text}
          </Typography>
          {item.id === 'fearful-treatment' && !isEditing && (
            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, ml: 4, mt: 0.5 }}>
              on a scale of 1 (least) to 10 (most): {item.scale || ''}
            </Typography>
          )}
          
          {!isEditing && options && (
            <Box sx={{ ml: 4, mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {options.map(opt => (
                <Typography key={opt} sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: selectedOptions.includes(opt) ? COLORS.TEXT_PRIMARY : COLORS.TEXT_MUTED }}>
                  {opt}
                </Typography>
              ))}
            </Box>
          )}

          <Collapse in={isEditing}>
            <Box sx={{ ml: 4, mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #eeeeee' }}>
              {item.id === 'fearful-treatment' && (
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>
                    on a scale of 1 (least) to 10 (most):
                  </Typography>
                  <TextField 
                    size="small"
                    type="number"
                    value={item.scale || ''}
                    onChange={(e) => onUpdateItem(sectionKey, item.id, 'scale', e.target.value)}
                    sx={{ width: 80, bgcolor: '#fff' }}
                  />
                </Box>
              )}
              {options ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {options.map(opt => (
                    <FormControlLabel
                      key={opt}
                      control={
                        <Checkbox 
                          size="small" 
                          checked={selectedOptions.includes(opt)}
                          onChange={() => handleOptionToggle(opt)}
                        />
                      }
                      label={<Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>{opt}</Typography>}
                    />
                  ))}
                </Box>
              ) : (
                <RadioGroup row value={answer !== 'not answered' ? answer : ''} onChange={handleRadioChange}>
                  <FormControlLabel value="Yes" control={<Radio size="small" />} label={<Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>Yes</Typography>} />
                  <FormControlLabel value="No" control={<Radio size="small" />} label={<Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>No</Typography>} />
                </RadioGroup>
              )}
              <Box sx={{ mt: 2 }}>
                <Button size="small" variant="contained" onClick={handleSave} sx={{ bgcolor: COLORS.ACCENT, textTransform: 'none', boxShadow: 'none' }}>
                  Save
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 120 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <InfoIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED }} />
             <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>
               {answer}
             </Typography>
          </Box>
          {!isEditing && !readOnly && (
            <Typography 
              onClick={handleToggleEdit}
              sx={{ 
                fontFamily: "Inter", 
                fontSize: fontSize.sm, 
                color: COLORS.STATUS_SUCCESS, 
                cursor: 'pointer',
                mt: 0.5,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Edit
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const SectionHeader = ({ title, sectionKey, sectionSummaries, onUpdateSectionSummary, isFirst }) => {
  const summaryData = sectionSummaries[sectionKey] || { risk: '' };
  
  const riskOptions = [
    { value: "low", label: "🟢 Low", color: "#4caf50" },
    { value: "moderate", label: "🟡 Moderate", color: "#ff9800" },
    { value: "high", label: "🔴 High", color: "#f44336" },
  ];

  const handleRiskChange = (e) => {
    onUpdateSectionSummary(sectionKey, { ...summaryData, risk: e.target.value });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 6 }, mb: 1, mt: isFirst ? 0 : 4, bgcolor: 'transparent', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
        {title}
      </Typography>
      <RadioGroup
        row
        value={summaryData.risk || ''}
        onChange={handleRiskChange}
        sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2 }}
      >
        {riskOptions.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio size="small" sx={{ color: "#9e9e9e", '&.Mui-checked': { color: opt.color } }} />}
            label={<Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY }}>{opt.label}</Typography>}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

const DentalHistoryFullView = ({ 
  groupedHistory,
  gumAndBoneGrouped = [],
  biteAndJawJointGrouped = [],
  toothStructureGrouped = [],
  smileCharacteristicsGrouped = [],
  onUpdateItem,
  sectionSummaries = {},
  onUpdateSectionSummary
}) => {
  
  const renderSection = (title, sectionKey, groupedData, isFirst = false) => {
    if (!groupedData || !groupedData.length) return null;
    return (
      <Box sx={{ mb: 4 }}>
        <SectionHeader 
          title={title} 
          sectionKey={sectionKey} 
          sectionSummaries={sectionSummaries}
          onUpdateSectionSummary={onUpdateSectionSummary}
          isFirst={isFirst}
        />
        {groupedData.map(([groupName, rows]) => (
          <Box key={groupName}>
            {rows.map(item => (
              <HistoryRow 
                key={item.id} 
                item={item} 
                sectionKey={sectionKey} 
                onUpdateItem={onUpdateItem} 
              />
            ))}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, pt: 1 }}>
      {renderSection("Personal History", "personalHistory", groupedHistory, true)}
      {renderSection("Gum and Bone", "gumAndBone", gumAndBoneGrouped)}
      {renderSection("Tooth Structure", "toothStructure", toothStructureGrouped)}
      {renderSection("Bite and Jaw Joint", "biteAndJawJoint", biteAndJawJointGrouped)}
      {renderSection("Smile Characteristics", "smileCharacteristics", smileCharacteristicsGrouped)}
    </Box>
  );
};

export default DentalHistoryFullView;
