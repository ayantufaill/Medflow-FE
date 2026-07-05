import { useState } from "react";
import { Dialog } from "@mui/material";
import { PATIENTS } from "./shortlist-modal/mockData";
import ShortlistModalHeader from "./shortlist-modal/ShortlistModalHeader";
import ShortlistTabs from "./shortlist-modal/ShortlistTabs";
import ShortlistFilters from "./shortlist-modal/ShortlistFilters";
import ShortlistTable from "./shortlist-modal/ShortlistTable";
import ShortlistFooter from "./shortlist-modal/ShortlistFooter";

const AppointmentShortlistModal = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState([]);

  const toggleAll = () =>
    setSelected((prev) => prev.length === PATIENTS.length ? [] : PATIENTS.map((p) => p.id));

  const toggleRow = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{ zIndex: 1600 }}
      PaperProps={{
        sx: {
          width: "min(1180px, calc(100vw - 48px))",
          maxHeight: "calc(100vh - 64px)",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          m: 0,
        },
      }}
    >
      <ShortlistModalHeader onClose={onClose} />
      <ShortlistTabs activeTab={tab} onChange={setTab} />
      <ShortlistFilters />
      <ShortlistTable
        patients={PATIENTS}
        selected={selected}
        onToggleAll={toggleAll}
        onToggleRow={toggleRow}
      />
      <ShortlistFooter total={PATIENTS.length} selectedCount={selected.length} />
    </Dialog>
  );
};

export default AppointmentShortlistModal;
