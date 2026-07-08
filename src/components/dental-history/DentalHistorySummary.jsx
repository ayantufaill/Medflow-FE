import { Box } from "@mui/material";
import { AssignmentOutlined as PersonalHistoryIcon, MonitorHeartOutlined as VitalsIcon } from "@mui/icons-material";
import DentalHistoryAccordionCard from "./DentalHistoryAccordionCard";

const DentalHistorySummary = ({
  personalHistory,
  gumAndBone = [],
  biteAndJawJoint = [],
  onUpdateItem
}) => {
  return (
    <>
      <DentalHistoryAccordionCard
        icon={PersonalHistoryIcon}
        title="Personal History"
        emptyLabel="personal history"
        fullLabel="Full Dental History"
        items={personalHistory}
        section="personalHistory"
        onUpdateItem={onUpdateItem}
      />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <DentalHistoryAccordionCard
          icon={VitalsIcon}
          title="Gum and Bone"
          emptyLabel="gum and bone"
          fullLabel="Full Gum and Bone"
          items={gumAndBone}
          section="gumAndBone"
          onUpdateItem={onUpdateItem}
          sx={{ mb: 0 }}
        />
        <DentalHistoryAccordionCard
          icon={VitalsIcon}
          title="Bite & Jaw Joint"
          emptyLabel="bite and jaw joint"
          fullLabel="Full Bite & Jaw Joint"
          items={biteAndJawJoint}
          section="biteAndJawJoint"
          onUpdateItem={onUpdateItem}
          sx={{ mb: 0 }}
        />
      </Box>
    </>
  );
};

export default DentalHistorySummary;
