import { useState, useRef, useEffect, useMemo } from "react";
import { Box, Dialog } from "@mui/material";
import dayjs from "dayjs";

import { INITIAL_PROCEDURES, TAG_DEFAULT_PROCEDURES, DEFAULT_PROCEDURE_TAGS } from "./new-appointment/constants";
import AppointmentModalHeader from "./new-appointment/AppointmentModalHeader";
import AppointmentFooter      from "./new-appointment/AppointmentFooter";
import AppointmentLeftPanel   from "./new-appointment/AppointmentLeftPanel";
import AppointmentRightPanel  from "./new-appointment/AppointmentRightPanel";

const AddNewPatientAppointmentForm = ({
  patients = [],
  loadingPatients = false,
  onPatientSearch,
  providers = [],
  // eslint-disable-next-line no-unused-vars
  rooms: _rooms = [],
  // eslint-disable-next-line no-unused-vars
  appointmentTypes: _appointmentTypes = [],
  onSubmit,
  onCancel,
  loading = false,
  initialPatient = null,
  initialDateTime = null,
  open = true,
  // eslint-disable-next-line no-unused-vars
  appointments: _appointments = [],
}) => {
  /* ── Left panel state ── */
  const [patient,           setPatient]           = useState(initialPatient || null);
  const [apptDate,          setApptDate]          = useState(initialDateTime || dayjs());
  const [timeHours,         setTimeHours]         = useState(initialDateTime ? initialDateTime.format("hh") : "09");
  const [timeMins,          setTimeMins]          = useState(initialDateTime ? initialDateTime.format("mm") : "00");
  const [amPm,              setAmPm]              = useState(initialDateTime ? initialDateTime.format("A") : "AM");
  const [visitType,         setVisitType]         = useState("recare");
  const [procedures,        setProcedures]        = useState(INITIAL_PROCEDURES);
  const [selectedTagLabels, setSelectedTagLabels] = useState(new Set());
  const [tagProcedureIds,   setTagProcedureIds]   = useState({});
  const [addingProcedure,   setAddingProcedure]   = useState(false);
  const [procedureInput,    setProcedureInput]    = useState("");
  const nextId = useRef(10);

  /* ── Right panel state ── */
  const [status,             setStatus]             = useState("confirmed");
  const [durationMins,       setDurationMins]       = useState(60);
  const [providerRows,       setProviderRows]       = useState([{ id: 1, providerId: "", time: 60 }]);
  const [preferredDentist,   setPreferredDentist]   = useState("");
  const [preferredHygienist, setPreferredHygienist] = useState("");
  const [notes,              setNotes]              = useState("");
  const [selectedColorTags,  setSelectedColorTags]  = useState(new Set(["#eab308"]));

  useEffect(() => { if (initialPatient) setPatient(initialPatient); }, [initialPatient]);

  const dateTime = useMemo(() => {
    const h = parseInt(timeHours || "9", 10);
    const m = parseInt(timeMins  || "0", 10);
    const hour24 = amPm === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
    return (apptDate || dayjs()).hour(hour24).minute(m).second(0);
  }, [apptDate, timeHours, timeMins, amPm]);

  /* ── Tag handlers ── */
  const handleTagClick = (label, idx) => {
    const key = `${label}-${idx}`;
    const isSelected = selectedTagLabels.has(key);
    if (isSelected) {
      setSelectedTagLabels((prev) => { const n = new Set(prev); n.delete(key); return n; });
      const procId = tagProcedureIds[key];
      if (procId != null) {
        setProcedures((prev) => prev.filter((p) => p.id !== procId));
        setTagProcedureIds((prev) => { const { [key]: _, ...rest } = prev; return rest; });
      }
    } else {
      setSelectedTagLabels((prev) => new Set([...prev, key]));
      const template = TAG_DEFAULT_PROCEDURES[label];
      const tagInfo  = DEFAULT_PROCEDURE_TAGS[idx];
      if (template && tagInfo) {
        const newId = nextId.current++;
        setProcedures((prev) => [...prev, {
          id: newId, code: template.code, treatment: template.treatment,
          site: "", provider: "", charge: template.charge, checked: true,
          tag: { label: tagInfo.label, color: tagInfo.color, font: tagInfo.font },
        }]);
        setTagProcedureIds((prev) => ({ ...prev, [key]: newId }));
      }
    }
  };

  const handleSelectProcedure = (option) => {
    if (!option) return;
    setProcedures((prev) => [...prev, {
      id: nextId.current++, code: option.code, treatment: option.treatment,
      site: "", provider: "", charge: option.charge, checked: true, tag: option.tag,
    }]);
    setProcedureInput(""); setAddingProcedure(false);
  };

  /* ── Submit ── */
  const handleSubmit = () => {
    if (!onSubmit) return;
    const end = dateTime.add(durationMins || 30, "minute");
    onSubmit({
      patientId:       patient?._id || patient?.id,
      patientName:     patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() : "",
      appointmentDate: dateTime.format("YYYY-MM-DD"),
      startTime:       dateTime.format("HH:mm"),
      endTime:         end.format("HH:mm"),
      durationMinutes: durationMins,
      status,
      notes,
      providerId: providerRows[0]?.providerId || undefined,
      roomId:     undefined,
      customFields: {
        visitType,
        procedures: procedures.filter((p) => p.checked).map(({ code, treatment, charge }) => ({ code, treatment, charge })),
        preferredDentist,
        preferredHygienist,
        colorTags: [...selectedColorTags],
      },
    });
  };

  const patientDisplayName = patient
    ? (patient.name || patient.fullName || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Patient")
    : "";
  const patientId = patient?.patientId || patient?.chartNumber || patient?.id || patient?._id || "";

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => { if (reason !== "backdropClick" && onCancel) onCancel(); }}
      maxWidth="lg"
      fullWidth
      disableScrollLock
      PaperProps={{
        sx: { borderRadius: "12px", border: "1px solid #e0e5eb", maxHeight: "92vh", overflow: "hidden" },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: "#fff" }}>
        <AppointmentModalHeader onCancel={onCancel} />

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
          <AppointmentLeftPanel
            patients={patients}
            loadingPatients={loadingPatients}
            patient={patient}
            onPatientChange={setPatient}
            onPatientSearch={onPatientSearch}
            apptDate={apptDate}
            onDateChange={setApptDate}
            timeHours={timeHours}
            timeMins={timeMins}
            amPm={amPm}
            onTimeChange={(h, m) => { setTimeHours(h); setTimeMins(m); }}
            onAmPmChange={setAmPm}
            visitType={visitType}
            onVisitTypeChange={setVisitType}
            selectedTagLabels={selectedTagLabels}
            onTagClick={handleTagClick}
            addingProcedure={addingProcedure}
            procedureInput={procedureInput}
            onProcedureInputChange={setProcedureInput}
            onAddingProcedureToggle={setAddingProcedure}
            onSelectProcedure={handleSelectProcedure}
            procedures={procedures}
            setProcedures={setProcedures}
            providers={providers}
          />

          <AppointmentRightPanel
            status={status}
            onStatusChange={setStatus}
            durationMins={durationMins}
            onDurationChange={setDurationMins}
            providerRows={providerRows}
            setProviderRows={setProviderRows}
            preferredDentist={preferredDentist}
            onPreferredDentistChange={setPreferredDentist}
            preferredHygienist={preferredHygienist}
            onPreferredHygienistChange={setPreferredHygienist}
            notes={notes}
            onNotesChange={setNotes}
            selectedColorTags={selectedColorTags}
            onColorTagsChange={setSelectedColorTags}
            providers={providers}
          />
        </Box>

        <AppointmentFooter
          patient={patient}
          patientDisplayName={patientDisplayName}
          patientId={patientId}
          onCancel={onCancel}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Box>
    </Dialog>
  );
};

export default AddNewPatientAppointmentForm;
