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
    flags: [],
  };
  const [filters, setFilters] = useState(initialFilters);

  // Fetch data when modal opens
  useEffect(() => {
    if (open) {
      setFilters(initialFilters);
      setSelected([]);
      setLoading(true);
      shortlistService.getShortlistItems()
        .then(res => setPatients(res?.data || []))
        .catch(err => console.error("Failed to load shortlist:", err))
        .finally(() => setLoading(false));
    }
    // We intentionally omit initialFilters from deps since it's recreated every render,
    // and we only want to fetch when 'open' changes.
  }, [open]);

  // Handle edit event to close modal
  useEffect(() => {
    const handleEditShortlistItem = () => {
      if (open) onClose();
    };
    
    window.addEventListener('edit-shortlist-item', handleEditShortlistItem);
    return () => window.removeEventListener('edit-shortlist-item', handleEditShortlistItem);
  }, [open, onClose]);

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

      // 6. Flags
      if (filters.flags && filters.flags.length > 0) {
        let pFlags = [];
        const customFields = p.CustomFields || p.customFields || {};
        const patientData = p.Patient || p.patient || {};
        
        if (customFields.flags && Array.isArray(customFields.flags)) {
          pFlags = [...pFlags, ...customFields.flags];
        }
        if (p.flags && Array.isArray(p.flags)) {
          pFlags = [...pFlags, ...p.flags];
        }
        if (patientData.flags && Array.isArray(patientData.flags)) {
          pFlags = [...pFlags, ...patientData.flags];
        }
        
        // Extract label strings if they are objects and lowercase them
        pFlags = pFlags.map(f => typeof f === 'string' ? f.toLowerCase() : (f?.label || f?.name || '').toLowerCase()).filter(Boolean);

        console.log(`Checking Patient ${p.PatientName || p.PatNum}. pFlags:`, pFlags, `filters.flags:`, filters.flags);

        const hasFlag = filters.flags.some(f => pFlags.includes(f.toLowerCase()));
        if (!hasFlag) return false;
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{ 
        zIndex: 1600,
        "@media print": {
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "auto",
          overflow: "visible",
        }
      }}
      BackdropProps={{ sx: { "@media print": { display: "none" } } }}
      PaperProps={{
        sx: {
          width: "min(1180px, calc(100vw - 48px))",
          maxHeight: "calc(100vh - 64px)",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          m: 0,
          "@media print": {
            width: "100%", maxWidth: "100%",
            maxHeight: "none",
            height: "auto",
            overflow: "visible",
            boxShadow: "none",
            borderRadius: 0,
          }
        },
      }}
    >
      <Box sx={{ "@media print": { display: "none" } }}>
        <ShortlistModalHeader onClose={onClose} />
        <ShortlistTabs activeTab={tab} onChange={setTab} />
      </Box>
      
      <Box sx={{ "@media print": { display: "none" } }}>
        <ShortlistFilters 
          filters={filters} 
          onChange={handleFilterChange} 
          providersList={providersList}
          onClear={clearFilters}
          onPrint={handlePrint}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box 
          className="print-section"
          sx={{ 
          flex: 1, 
          overflow: "hidden", 
          display: "flex", 
          flexDirection: "column",
          "@media print": {
            overflow: "visible",
            display: "block",
            height: "auto",
          }
        }}>
          <ShortlistTable
            patients={filteredPatients}
            selected={selected}
            onToggleAll={toggleAll}
            onToggleRow={toggleRow}
            onDelete={handleDelete}
          />
        </Box>
      )}

      <Box sx={{ "@media print": { display: "none" } }}>
        <ShortlistFooter total={filteredPatients.length} selectedCount={selected.length} />
      </Box>
      
      <style>
        {`
          @media print {
            body {
              background: white !important;
              overflow: visible !important;
            }
            #root {
              display: none !important;
            }
            .MuiDialog-root, .MuiDialog-container {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              display: block !important;
              overflow: visible !important;
              background: white !important;
            }
            .MuiPaper-root {
              box-shadow: none !important;
              max-height: none !important;
              overflow: visible !important;
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .MuiBackdrop-root {
              display: none !important;
            }
          }
        `}
      </style>
    </Dialog>
  );
};

export default AppointmentShortlistModal;
