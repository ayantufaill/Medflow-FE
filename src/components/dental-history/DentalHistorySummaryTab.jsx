import React from 'react';
import { Box, TextField, Typography } from "@mui/material";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight } from "../../constants/styles";
import { SectionHeader, HistoryRow } from "./DentalHistoryFullView";

const SummarySection = ({ 
  title, 
  sectionKey, 
  summaryData, 
  historyItems = [], 
  sectionSummaries, 
  onUpdateSectionSummary,
  isFirst 
}) => {
  const handleInfoChange = (e) => {
    onUpdateSectionSummary(sectionKey, { ...summaryData, additionalInfo: e.target.value });
  };

  // Only show positive findings or items with a scale/note
  const answeredItems = historyItems.filter(
    (item) => (item.answer && item.answer !== 'No' && item.answer !== 'not answered') || 
              (item.scale && item.scale.toString().trim() !== '') || 
              (item.note && item.note.trim() !== '')
  );

  return (
    <Box sx={{ mb: 4 }}>
      <SectionHeader 
        title={title} 
        sectionKey={sectionKey} 
        sectionSummaries={sectionSummaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
        isFirst={isFirst}
      />
      
      <Box className="print-stack" sx={{ px: { xs: 1, sm: 2 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 3fr' }, gap: 4, alignItems: 'start' }}>
        <Box>
          {answeredItems.length > 0 ? (
            answeredItems.map((item) => (
              <HistoryRow 
                key={item.id} 
                item={item} 
                sectionKey={sectionKey} 
                readOnly={true} 
              />
            ))
          ) : (
            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, py: 2, borderBottom: "1px solid #e0e0e0" }}>
              No positive findings reported.
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: { xs: 2, md: 0 } }}>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            size="small"
            value={summaryData?.additionalInfo || ''}
            onChange={handleInfoChange}
            placeholder="Additional information"
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "Inter",
                fontSize: fontSize.sm,
                color: COLORS.TEXT_PRIMARY,
                bgcolor: '#f8f9fa',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const DentalHistorySummaryTab = ({ 
  sectionSummaries, 
  onUpdateSectionSummary,
  personalHistory = [],
  gumAndBone = [],
  biteAndJawJoint = [],
  toothStructure = [],
  smileCharacteristics = []
}) => {
  const summaries = sectionSummaries || {};

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, pt: 1 }}>
      <SummarySection
        title="Personal History"
        sectionKey="personalHistory"
        summaryData={summaries.personalHistory || { risk: '', additionalInfo: '' }}
        historyItems={personalHistory}
        sectionSummaries={summaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
        isFirst={true}
      />
      <SummarySection
        title="Gum and Bone"
        sectionKey="gumAndBone"
        summaryData={summaries.gumAndBone || { risk: '', additionalInfo: '' }}
        historyItems={gumAndBone}
        sectionSummaries={summaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
      />
      <SummarySection
        title="Tooth Structure"
        sectionKey="toothStructure"
        summaryData={summaries.toothStructure || { risk: '', additionalInfo: '' }}
        historyItems={toothStructure}
        sectionSummaries={summaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
      />
      <SummarySection
        title="Bite and Jaw Joint"
        sectionKey="biteAndJawJoint"
        summaryData={summaries.biteAndJawJoint || { risk: '', additionalInfo: '' }}
        historyItems={biteAndJawJoint}
        sectionSummaries={summaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
      />
      <SummarySection
        title="Smile Characteristics"
        sectionKey="smileCharacteristics"
        summaryData={summaries.smileCharacteristics || { risk: '', additionalInfo: '' }}
        historyItems={smileCharacteristics}
        sectionSummaries={summaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
      />
    </Box>
  );
};

export default DentalHistorySummaryTab;
