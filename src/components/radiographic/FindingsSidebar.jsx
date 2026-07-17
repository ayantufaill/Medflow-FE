import React from "react";
import { Box } from "@mui/material";
import ExamFilterBar from "../clinical/ExamFilterBar";
import GeneralToothSurvey from "./sections/GeneralToothSurvey";
import CoronalToothStructure from "./sections/CoronalToothStructure";
import RadicularToothStructure from "./sections/RadicularToothStructure";
import SupportingStructure from "./sections/SupportingStructure";

const FindingsSidebar = ({
  selectedTeeth,
  onToggleUnerupted,
  expandedSections,
  toggleSection,
  missingTeeth,
  onMissingTeethClick,
  toothFindings,
  setToothFindings,
  setSelectedTeeth,
  activeToothNum,
  setActiveToothNum,
  noFindings = {},
  toggleNoFindings
}) => {
  return (
    <Box sx={{ width: '32%', flexShrink: 0, pr: 1 }}>
      <Box sx={{ 
        width: '100%', 
        height: 'calc(100vh - 180px)', 
        overflowY: "auto", 
        pb: 4,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' }
      }}>
        
        <ExamFilterBar 
          selectedTeeth={selectedTeeth}
          onToggleUnerupted={onToggleUnerupted}
        />

        {/* Section Components */}
        <GeneralToothSurvey 
          expanded={expandedSections.generalToothSurvey}
          onToggle={() => toggleSection('generalToothSurvey')}
          missingTeeth={missingTeeth}
          onMissingTeethClick={onMissingTeethClick}
          noFindings={noFindings.generalToothSurvey}
          onToggleNoFindings={() => toggleNoFindings('generalToothSurvey')}
        />
        
        <CoronalToothStructure 
          expanded={expandedSections.coronalToothStructure}
          onToggle={() => toggleSection('coronalToothStructure')}
          toothFindings={toothFindings}
          setToothFindings={setToothFindings}
          selectedTeeth={selectedTeeth}
          setSelectedTeeth={setSelectedTeeth}
          activeToothNum={activeToothNum}
          setActiveToothNum={setActiveToothNum}
          noFindings={noFindings.coronalToothStructure}
          onToggleNoFindings={() => toggleNoFindings('coronalToothStructure')}
        />
        
        <RadicularToothStructure 
          expanded={expandedSections.radicularToothStructure}
          onToggle={() => toggleSection('radicularToothStructure')}
          toothFindings={toothFindings}
          setToothFindings={setToothFindings}
          selectedTeeth={selectedTeeth}
          activeToothNum={activeToothNum}
          setActiveToothNum={setActiveToothNum}
          noFindings={noFindings.radicularToothStructure}
          onToggleNoFindings={() => toggleNoFindings('radicularToothStructure')}
        />
        
        <SupportingStructure 
          expanded={expandedSections.supportingStructure}
          onToggle={() => toggleSection('supportingStructure')}
          noFindings={noFindings.supportingStructure}
          onToggleNoFindings={() => toggleNoFindings('supportingStructure')}
        />
      </Box>
    </Box>
  );
};

export default FindingsSidebar;
