import { useState, useEffect, useMemo } from "react";
import { Dialog, CircularProgress, Box } from "@mui/material";
import dayjs from "dayjs";
import { shortlistService } from "../../../services/shortlist.service";
import { useDropdownData } from "../../../hooks/redux";
import ShortlistModalHeader from "./shortlist-modal/ShortlistModalHeader";
import ShortlistTabs from "./shortlist-modal/ShortlistTabs";
import ShortlistFilters from "./shortlist-modal/ShortlistFilters";
import ShortlistTable from "./shortlist-modal/ShortlistTable";
import ShortlistFooter from "./shortlist-modal/ShortlistFooter";

const AppointmentShortlistModal = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const { providers: providersList } = useDropdownData({ providers: true });

  const initialFilters = {
    searchName: "",
    providerId: "",
    maxDuration: "",
    minDuration: "",
    prefDay: "",
    prefTimeHour: "",
    prefTimeAmpm: "AM",
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    if (open) {
      setLoading(true);
      shortlistService.getShortlistItems()
        .then(res => setPatients(res?.data || []))
        .catch(err => console.error("Failed to load shortlist:", err))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => setFilters(initialFilters);

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      // 1. Search Name
      if (filters.searchName) {
        const name = p.PatientName || p.patientName || p.name || `Patient #${p.PatNum || ''}`;
        if (!name.toLowerCase().includes(filters.searchName.toLowerCase())) return false;
      }
      
      // 2. Provider
      if (filters.providerId) {
        const rawProv = p.ProvNum || p.providerId || p.providers;
        if (String(rawProv) !== String(filters.providerId)) return false;
      }

      // 3. Duration
      const dur = p.DurationMins || p.durationMinutes || p.duration || 0;
      if (filters.minDuration && dur < parseInt(filters.minDuration, 10)) return false;
      if (filters.maxDuration && dur > parseInt(filters.maxDuration, 10)) return false;

      // 4. Pref Day
      if (filters.prefDay) {
        const apptDate = p.AppointmentDate || p.appointmentDate;
        const rawPrefDay = p.PreferredDay || p.prefDay || "Any";
        const day = apptDate ? dayjs(apptDate).format("dddd") : rawPrefDay;
        if (filters.prefDay !== "Any" && day !== filters.prefDay && day.substring(0, 3) !== filters.prefDay.substring(0, 3)) return false;
      }

      // 5. Pref Time
      if (filters.prefTimeHour) {
        const startTime = p.StartTime || p.startTime || p.PreferredTime || p.prefTime;
        if (startTime && startTime !== "Any") {
          let hour = parseInt(filters.prefTimeHour, 10);
          if (filters.prefTimeAmpm === "PM" && hour !== 12) hour += 12;
          if (filters.prefTimeAmpm === "AM" && hour === 12) hour = 0;
          
          let prmHour = -1;
          if (startTime.includes(":")) {
            prmHour = parseInt(startTime.split(":")[0], 10);
          }
          if (prmHour !== -1 && prmHour !== hour) return false;
        }
      }

      return true;
    });
  }, [patients, filters]);

  const toggleAll = () =>
    setSelected((prev) => prev.length === patients.length ? [] : patients.map((p) => p.ShortlistNum || p.id));

  const toggleRow = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item from the shortlist?")) return;
    try {
      setLoading(true);
      await shortlistService.deleteShortlistItem(id);
      setPatients(prev => prev.filter(p => (p.ShortlistNum || p.id || p._id) !== id));
      window.dispatchEvent(new Event('shortlist-updated'));
    } catch (err) {
      console.error("Failed to delete shortlist item:", err);
      alert("Failed to delete. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <ShortlistFilters 
        filters={filters} 
        onChange={handleFilterChange} 
        providersList={providersList}
        onClear={clearFilters}
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ShortlistTable
          patients={filteredPatients}
          selected={selected}
          onToggleAll={toggleAll}
          onToggleRow={toggleRow}
          onDelete={handleDelete}
        />
      )}
      <ShortlistFooter total={filteredPatients.length} selectedCount={selected.length} />
    </Dialog>
  );
};

export default AppointmentShortlistModal;
