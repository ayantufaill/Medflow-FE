import React from 'react';
import { Box, TextField, Typography } from "@mui/material";
import { COLORS } from "../../constants/colors";
import { fontSize } from "../../constants/styles";
import { SectionHeader, HistoryRow } from "./DentalHistoryFullView";

const SummarySection = ({ 
  title, 
  sectionKey, 
  historyItems = [], 
  sectionSummaries, 
  onUpdateSectionSummary,
  onUpdateItem,
  isFirst 
}) => {
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
      
      <Box className="print-stack" sx={{ px: { xs: 1, sm: 2 } }}>
        {answeredItems.length > 0 ? (
          answeredItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '7fr 3fr' },
                gap: 4,
                alignItems: 'start',
                borderBottom: "1px solid #e0e0e0",
                py: 2,
              }}
            >
              <Box sx={{ '& > div': { borderBottom: 0, py: 0 } }}>
                <HistoryRow
                  item={item}
                  sectionKey={sectionKey}
                  readOnly={true}
                />
              </Box>
              <Box>
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={3}
                  size="small"
                  value={item.additionalInfo || ''}
                  onChange={(e) => onUpdateItem(sectionKey, item.id, 'additionalInfo', e.target.value)}
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
          ))
        ) : (
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, py: 2, borderBottom: "1px solid #e0e0e0" }}>
            No positive findings reported.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const DentalHistorySummaryTab = ({ 
  sectionSummaries, 
  onUpdateSectionSummary,
  onUpdateItem,
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
        onUpdateItem={onUpdateItem}
        isFirst={true}
      />
      <SummarySection
        title="Gum and Bone"
        sectionKey="gumAndBone"
        summaryData={summaries.gumAndBone || { risk: '', additionalInfo: '' }}
        historyItems={gumAndBone}
        sectionSummaries={summaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
        onUpdateItem={onUpdateItem}
      />
      <SummarySection
        title="Tooth Structure"
        sectionKey="toothStructure"
        summaryData={summaries.toothStructure || { risk: '', additionalInfo: '' }}
        historyItems={toothStructure}
        sectionSummaries={summaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
        onUpdateItem={onUpdateItem}
      />
      <SummarySection
        title="Bite and Jaw Joint"
        sectionKey="biteAndJawJoint"
        summaryData={summaries.biteAndJawJoint || { risk: '', additionalInfo: '' }}
        historyItems={biteAndJawJoint}
        sectionSummaries={summaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
        onUpdateItem={onUpdateItem}
      />
      <SummarySection
        title="Smile Characteristics"
        sectionKey="smileCharacteristics"
        summaryData={summaries.smileCharacteristics || { risk: '', additionalInfo: '' }}
        historyItems={smileCharacteristics}
        sectionSummaries={summaries}
        onUpdateSectionSummary={onUpdateSectionSummary}
        onUpdateItem={onUpdateItem}
      />
    </Box>
  );
};

export default DentalHistorySummaryTab;
