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
  rooms = [],
  // eslint-disable-next-line no-unused-vars
  appointmentTypes: _appointmentTypes = [],
  onSubmit,
  onCancel,
  loading = false,
  initialPatient = null,
  initialDateTime = null,
  initialRoomId = "",
  open = true,
  appointments = [],
}) => {
  /* ── Left panel state ── */
  const [patient,           setPatient]           = useState(initialPatient || null);
  const [apptDate,          setApptDate]          = useState(initialDateTime || dayjs());
  const [timeHours,         setTimeHours]         = useState(initialDateTime ? initialDateTime.format("hh") : dayjs().format("hh"));
  const [timeMins,          setTimeMins]          = useState(initialDateTime ? initialDateTime.format("mm") : dayjs().format("mm"));
  const [amPm,              setAmPm]              = useState(initialDateTime ? initialDateTime.format("A") : dayjs().format("A"));
  const [visitType,         setVisitType]         = useState("recare");
  const [procedures,        setProcedures]        = useState(INITIAL_PROCEDURES);

  // Procedure tags: track which quick-add tags are selected.
  const [selectedTagLabels, setSelectedTagLabels] = useState(new Set());
  const [tagProcedureIds,   setTagProcedureIds]   = useState({});
  const [addingProcedure,   setAddingProcedure]   = useState(false);
  const [procedureInput,    setProcedureInput]    = useState("");
  const nextId = useRef(10);

  /* ── Right panel state ── */
  const [status,             setStatus]             = useState("unconfirmed");
  const [roomId,             setRoomId]             = useState(initialRoomId != null ? String(initialRoomId) : "");
  const [durationMins,       setDurationMins]       = useState(60);
  const [providerRows,       setProviderRows]       = useState([{ id: 1, providerId: "", time: 60 }]);
  const [preferredDentist,   setPreferredDentist]   = useState("");
  const [preferredHygienist, setPreferredHygienist] = useState("");
  const [notes,              setNotes]              = useState("");
  const [selectedColorTags,  setSelectedColorTags]  = useState(new Set(["#eab308"]));

  const availableRooms = useMemo(() => {
    const h = parseInt(timeHours) % 12;
    const hour = amPm === "PM" ? h + 12 : h;
    const selectedStart = dayjs(apptDate).hour(hour).minute(parseInt(timeMins));
    const selectedEnd = selectedStart.add(durationMins || 60, "minute");

    const occupied = new Set();
    appointments.forEach(appt => {
      if (!appt.appointmentDate || !appt.roomId || !appt.startTime) return;
      const apptDateStr = String(appt.appointmentDate).slice(0, 10);
      if (apptDateStr !== selectedStart.format("YYYY-MM-DD")) return;

      const [startH, startM] = appt.startTime.split(':').map(Number);
      const apptStart = dayjs(apptDate).hour(startH).minute(startM);
      const apptEnd = apptStart.add(appt.durationMinutes || 30, 'minute');

      if (selectedStart.isBefore(apptEnd) && selectedEnd.isAfter(apptStart)) {
        occupied.add(String(appt.roomId));
      }
    });
    // Keep the already-selected room in the list even if it now reads as occupied,
    // otherwise the Select can't match `roomId` to a MenuItem and silently shows
    // "Select operatory" instead of the operatory the user actually picked.
    return rooms.filter(r => {
      const id = String(r._id || r.id);
      return id === String(roomId) || !occupied.has(id);
    });
  }, [rooms, appointments, apptDate, timeHours, timeMins, amPm, durationMins, roomId]);

  useEffect(() => {
    if (open) {
      setPatient(initialPatient || null);
      setApptDate(initialDateTime || dayjs());
      setTimeHours(initialDateTime ? initialDateTime.format("hh") : dayjs().format("hh"));
      setTimeMins(initialDateTime ? initialDateTime.format("mm") : dayjs().format("mm"));
      setAmPm(initialDateTime ? initialDateTime.format("A") : dayjs().format("A"));
      setRoomId(initialRoomId != null ? String(initialRoomId) : "");
      // Radio values in AppointmentLeftPanel are lowercased ("treatment"/"recare"),
      // so seeding with capitalized "Treatment" left both radios unchecked on open.
      setVisitType("treatment");
      // Re-seed the default procedure list every time the modal opens. This used to be
      // setProcedures([]), which wiped out the INITIAL_PROCEDURES seed the moment the
      // dialog became visible (the effect fires on every `open` transition to true),
      // so the "New procedures" table always rendered empty instead of showing the
      // default visit procedures — this was the "missing procedures list" bug.
      setProcedures(INITIAL_PROCEDURES);
      setSelectedTagLabels(new Set());
      setTagProcedureIds({});
      setAddingProcedure(false);
      setProcedureInput("");
      setStatus("scheduled");
      setDurationMins(60);
      setProviderRows([{ id: Date.now(), providerId: "", time: 60 }]);
      setPreferredDentist("");
      setPreferredHygienist("");
      setNotes("");
      setSelectedColorTags(new Set(["#eab308"]));
    }
  }, [open, initialPatient, initialDateTime, initialRoomId]);

  const dateTime = useMemo(() => {
    const h = parseInt(timeHours || "9", 10);
    const m = parseInt(timeMins  || "0", 10);
    const hour24 = amPm === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
    return (apptDate || dayjs()).hour(hour24).minute(m).second(0);
  }, [apptDate, timeHours, timeMins, amPm]);

  const handlePatientChange = (newPatient) => {
    // If the user is switching from one selected patient to a different one,
    // clear the procedure table and tags to prevent mixing procedures from the old patient.
    if (patient && newPatient && (patient.id || patient._id) !== (newPatient.id || newPatient._id)) {
      setProcedures([]);
      setSelectedTagLabels(new Set());
      setTagProcedureIds({});
    }
    setPatient(newPatient);
  };

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
          treatArea: template.treatArea,
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
      treatArea: option.treatArea,
    }]);
    setProcedureInput(""); setAddingProcedure(false);
  };

  useEffect(() => {
    // If a procedure associated with a tag is removed, untoggle the tag
    const currentProcedureIds = new Set(procedures.map(p => p.id));
    let tagsChanged = false;
    const newTagProcedureIds = { ...tagProcedureIds };
    const newSelectedTags = new Set(selectedTagLabels);

    for (const [tagKey, procId] of Object.entries(tagProcedureIds)) {
      if (!currentProcedureIds.has(procId)) {
        // Procedure was deleted
        delete newTagProcedureIds[tagKey];
        newSelectedTags.delete(tagKey);
        tagsChanged = true;
      }
    }

    if (tagsChanged) {
      setTagProcedureIds(newTagProcedureIds);
      setSelectedTagLabels(newSelectedTags);
    }
  }, [procedures, tagProcedureIds, selectedTagLabels]);

  /* ── Submit ── */
  const handleSubmit = () => {
    if (!onSubmit) return;
    const end = dateTime.add(durationMins || 30, "minute");
    const selectedProcedureTags = [...selectedTagLabels]
      .map((key) => {
        const separatorIndex = key.lastIndexOf("-");
        const label = separatorIndex >= 0 ? key.slice(0, separatorIndex) : key;
        const idx = separatorIndex >= 0 ? key.slice(separatorIndex + 1) : "";
        const tagInfo = DEFAULT_PROCEDURE_TAGS[Number(idx)];
        return {
          label,
          color: tagInfo?.color,
          font: tagInfo?.font,
        };
      })
      .filter((tag) => tag.label);

    // Calculate endTime from dateTime + durationMins
    const start = dateTime || dayjs();
    if (start.isBefore(dayjs().startOf('day'))) {
      alert("Appointment date cannot be in the past.");
      return;
    }

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
      // Backend appointment schema expects `roomId` (see project notes), so that stays
      // the top-level field. `operatoryId` is mirrored into customFields as the same
      // value so the schedule grid (which maps appointments back to an operatory
      // column via roomId/columnId) and any operatory-scoped consumers of the
      // created appointment have an explicit, correctly-named field to read instead
      // of having to know that "operatory" and "room" are the same concept here.
      roomId:     roomId || undefined,
      customFields: {
        visitType,
        procedures: procedures.filter((p) => p.checked).map(({ code, treatment, charge }) => ({ code, treatment, charge })),
        preferredDentist,
        preferredHygienist,
        colorTags: [...selectedColorTags],
        procedureTags: selectedProcedureTags,
        // operatoryId reflects the operatory chart column the appointment was created
        // from (set via the initialRoomId prop when the user clicks a slot on the
        // /appointments operatory grid), kept in sync with roomId if changed via the
        // Room dropdown in the right panel.
        operatoryId: roomId || undefined,
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
      sx={{ zIndex: 1305 }}
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
            onPatientChange={handlePatientChange}
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
            roomId={roomId}
            onRoomChange={setRoomId}
            rooms={availableRooms}
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
