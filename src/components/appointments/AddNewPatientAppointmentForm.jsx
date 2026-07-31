import { useState, useRef, useEffect, useMemo } from "react";
import { Box, Dialog, Alert, Snackbar } from "@mui/material";
import dayjs from "dayjs";
import { shortlistService } from "../../services/shortlist.service";

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
  appointments = [],
  scheduleBlocks = [],
  // eslint-disable-next-line no-unused-vars
  appointmentTypes: _appointmentTypes = [],
  onSubmit,
  onCancel,
  loading = false,
  initialPatient = null,
  initialDateTime = null,
  initialRoomId = "",
  initialShortlistData = null,
  initialAppointment = null,
  open = true,
  showExtendedOptions = false,
}) => {
  console.log("DEBUG AddNewPatientAppointmentForm render. open:", open, "showExtendedOptions:", showExtendedOptions, "isEditMode:", !!initialAppointment || !!initialShortlistData);

  /* ── Left panel state ── */
  const [patient,           setPatient]           = useState(initialShortlistData ? initialShortlistData.patient : initialPatient || null);
  
  // Parse shortlist date/time if available
  let parsedDate = initialDateTime || dayjs();
  if (initialShortlistData?.AppointmentDate) {
    let d = dayjs(initialShortlistData.AppointmentDate);
    if (initialShortlistData.StartTime) {
      const [h, m] = initialShortlistData.StartTime.split(':');
      d = d.hour(parseInt(h) || 0).minute(parseInt(m) || 0);
    }
    parsedDate = d;
  }

  const [apptDate,          setApptDate]          = useState(parsedDate);
  const [timeHours,         setTimeHours]         = useState(parsedDate.format("hh"));
  const [timeMins,          setTimeMins]          = useState(parsedDate.format("mm"));
  const [amPm,              setAmPm]              = useState(parsedDate.format("A"));
  const [visitType,         setVisitType]         = useState("recare");
  const [procedures,        setProcedures]        = useState(INITIAL_PROCEDURES);

  // Procedure tags: track which quick-add tags are selected.
  const [selectedTagLabels, setSelectedTagLabels] = useState(new Set());
  const [tagProcedureIds,   setTagProcedureIds]   = useState({});
  const [addingProcedure,   setAddingProcedure]   = useState(false);
  const [procedureInput,    setProcedureInput]    = useState("");
  const nextId = useRef(10);

  /* ── Right panel state ── */
  const [status,             setStatus]             = useState(initialShortlistData?.Status || "unconfirmed");
  const [roomId,             setRoomId]             = useState(initialShortlistData?.RoomId ? String(initialShortlistData.RoomId) : initialRoomId != null ? String(initialRoomId) : "");
  const [durationMins,       setDurationMins]       = useState(initialShortlistData?.DurationMins || 60);
  
  const initialProviderRows = initialShortlistData?.ProvNum ? 
    [{ id: 1, providerId: String(initialShortlistData.ProvNum), time: initialShortlistData?.DurationMins || 60 }] : 
    [{ id: 1, providerId: "", time: 60 }];
  const [providerRows,       setProviderRows]       = useState(initialProviderRows);
  
  const [preferredDentist,   setPreferredDentist]   = useState("");
  const [preferredHygienist, setPreferredHygienist] = useState("");
  const [notes,              setNotes]              = useState(initialShortlistData?.Notes || '');
  const [selectedColorTags,  setSelectedColorTags]  = useState(new Set());
  const [referredBy,         setReferredBy]         = useState('');
  const [noReminders,        setNoReminders]        = useState(false);
  const [tags,               setTags]               = useState([]);

  // Tracks whether the user has tried to submit at least once — required-field
  // borders only turn red after a failed attempt, not while the form is still empty on open.
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const occupiedRoomIds = useMemo(() => {
    const h = parseInt(timeHours) % 12;
    const hour = amPm === "PM" ? h + 12 : h;
    const selectedStart = dayjs(apptDate).hour(hour).minute(parseInt(timeMins));
    const selectedEnd = selectedStart.add(durationMins || 60, "minute");

    const occupied = new Set();
    appointments.forEach(appt => {
      if (!appt.appointmentDate || !appt.roomId || !appt.startTime) return;
      
      if (initialAppointment) {
        const apptId = String(appt.id || appt._id).replace('appt-', '');
        const editId = String(initialAppointment.id || initialAppointment._id).replace('appt-', '');
        if (apptId === editId) return;
      }

      const apptDateStr = String(appt.appointmentDate).slice(0, 10);
      if (apptDateStr !== selectedStart.format("YYYY-MM-DD")) return;

      const [startH, startM] = appt.startTime.split(':').map(Number);
      const apptStart = dayjs(apptDate).hour(startH).minute(startM);
      const apptEnd = apptStart.add(appt.durationMinutes || 30, 'minute');

      if (selectedStart.isBefore(apptEnd) && selectedEnd.isAfter(apptStart)) {
        occupied.add(String(appt.roomId));
      }
    });

    scheduleBlocks.forEach(block => {
      if (!block.date || !block.roomId || !block.startTime || !block.endTime) return;
      if (block.date !== selectedStart.format("YYYY-MM-DD")) return;

      const [startH, startM] = block.startTime.split(':').map(Number);
      const [endH, endM] = block.endTime.split(':').map(Number);
      const blockStart = dayjs(apptDate).hour(startH).minute(startM);
      const blockEnd = dayjs(apptDate).hour(endH).minute(endM);

      if (selectedStart.isBefore(blockEnd) && selectedEnd.isAfter(blockStart)) {
        occupied.add(String(block.roomId));
      }
    });

    return occupied;
  }, [appointments, scheduleBlocks, apptDate, timeHours, timeMins, amPm, durationMins, initialAppointment]);

  useEffect(() => {
    if (open) {
      if (initialAppointment) {

        const applyApptToForm = (sourceAppt, sourceProcedures = []) => {
            const customFields = sourceAppt.customFields || sourceAppt.CustomFields || {};
            
            const rawPat = sourceAppt.patientId || sourceAppt.patient || sourceAppt.patientNumber || initialAppointment.patientId || "";
            const patId = typeof rawPat === 'object' ? String(rawPat._id || rawPat.id || rawPat.PatNum || "") : String(rawPat);
            
            const fullPatient = patients.find(p => String(p.id || p._id || p.PatNum) === patId);
            
            const hasName = sourceAppt.patientName || initialAppointment.patientName;
            const mockPatient = (patId || hasName) ? { 
              id: patId || "unknown", 
              rawId: patId || "unknown",
              firstName: hasName ? hasName.split(' ')[0] : 'Unknown',
              lastName: hasName ? hasName.split(' ').slice(1).join(' ') : 'Patient',
              fullName: hasName || 'Unknown Patient'
            } : null;
            
            setPatient(fullPatient || mockPatient);
            
            let parsedDate = dayjs();
            const rawDate = sourceAppt.appointmentDate || initialAppointment.date || initialAppointment.appointmentDate;
            if (rawDate) {
              const dateStr = typeof rawDate === 'string' && rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
              parsedDate = dayjs(dateStr);
            }
            
            const timeStr = sourceAppt.startTime || initialAppointment.time || initialAppointment.startTime;
            let hStr = parsedDate.format("hh"), mStr = parsedDate.format("mm"), aStr = parsedDate.format("A");
            
            if (timeStr) {
              const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
              if (match) {
                hStr = match[1].padStart(2, '0');
                mStr = match[2].padStart(2, '0');
                if (match[3]) {
                  aStr = match[3].toUpperCase();
                } else {
                  let h24 = parseInt(hStr, 10);
                  if (h24 >= 12) {
                    aStr = "PM";
                    if (h24 > 12) hStr = String(h24 - 12).padStart(2, '0');
                  } else {
                    aStr = "AM";
                    if (h24 === 0) hStr = "12";
                  }
                }
              }
            }
            
            setApptDate(parsedDate); setTimeHours(hStr); setTimeMins(mStr); setAmPm(aStr);
            setRoomId(sourceAppt.roomId || initialAppointment.roomId ? String(sourceAppt.roomId || initialAppointment.roomId) : "");
            setStatus(sourceAppt.status || initialAppointment.status ? String(sourceAppt.status || initialAppointment.status).toLowerCase() : "scheduled");
            setDurationMins(sourceAppt.durationMinutes || initialAppointment.durationMinutes || 60);
            
            let vType = sourceAppt.appointmentType || sourceAppt.visitType || initialAppointment.appointmentType || initialAppointment.visitType || "recare";
            vType = String(vType).toLowerCase();
            if (vType !== "recare") {
              vType = "treatment"; // Default anything that isn't explicitly recare to treatment
            }
            setVisitType(vType);
            
            let provId = "";
            if (sourceAppt.providerId && typeof sourceAppt.providerId === 'object') provId = sourceAppt.providerId._id || sourceAppt.providerId.id || sourceAppt.providerId.providerId;
            else if (sourceAppt.providerId) provId = sourceAppt.providerId;
            else if (initialAppointment.providerId) provId = initialAppointment.providerId;
            else if (initialAppointment.ProvNum) provId = initialAppointment.ProvNum;
            else if (initialAppointment.provider && typeof initialAppointment.provider === 'object') provId = initialAppointment.provider._id || initialAppointment.provider.id;
            else if (typeof initialAppointment.provider === 'string' && providers.some(p => String(p._id || p.id) === initialAppointment.provider)) provId = initialAppointment.provider;
            
            setProviderRows(provId ? 
              [{ id: Date.now(), providerId: String(provId), time: sourceAppt.durationMinutes || initialAppointment.durationMinutes || 60 }] : 
              [{ id: Date.now(), providerId: "", time: 60 }]);
              
            setNotes(sourceAppt.notes || initialAppointment.notes || initialAppointment.description || "");
            
            let sourceProcs = sourceProcedures.length > 0 ? sourceProcedures : (customFields.procedures && Array.isArray(customFields.procedures) && customFields.procedures.length > 0
              ? customFields.procedures
              : (sourceAppt.workspace?.procedures || sourceAppt.procedures || sourceAppt.procedureCodes || sourceAppt.Procedures || initialAppointment.procedures || []));
            
            let initialProcs = [];
            if (Array.isArray(sourceProcs)) {
              initialProcs = sourceProcs;
            } else if (typeof sourceProcs === 'string') {
              initialProcs = sourceProcs.split(',').map(p => ({ code: "TBD", treatment: p.trim(), charge: "$0.00" }));
            }
            
            initialProcs = initialProcs.map((p, i) => {
              if (typeof p === 'string') {
                return { code: "TBD", treatment: p, charge: "$0.00", checked: true, id: Date.now() + i };
              }
              return { 
                code: p.procedureCode || p.code || p.ProcCode || "TBD", 
                treatment: p.description || p.treatment || p.name || p.title || p.Descript || "Unknown", 
                charge: p.fee || p.charge || p.amount || "$0.00", 
                checked: true, 
                id: p._id || p.id || (Date.now() + i) 
              };
            });
            
            setProcedures(initialProcs.length > 0 ? initialProcs : INITIAL_PROCEDURES);

            const tagsSource = customFields.procedureTags || sourceAppt.tags || initialAppointment.tags;
            if (Array.isArray(tagsSource)) {
              const tagsSet = new Set();
              tagsSource.forEach(tagObj => {
                if (tagObj && tagObj.label) {
                  import('./new-appointment/constants').then(({ DEFAULT_PROCEDURE_TAGS }) => {
                    const idx = DEFAULT_PROCEDURE_TAGS.findIndex(t => t.label === tagObj.label);
                    if (idx >= 0) {
                      tagsSet.add(`${tagObj.label}-${idx}`);
                      setSelectedTagLabels(new Set(tagsSet));
                    }
                  }).catch(() => {});
                } else if (typeof tagObj === 'string') {
                  import('./new-appointment/constants').then(({ DEFAULT_PROCEDURE_TAGS }) => {
                    const idx = DEFAULT_PROCEDURE_TAGS.findIndex(t => t.label === tagObj);
                    if (idx >= 0) {
                      tagsSet.add(`${tagObj}-${idx}`);
                      setSelectedTagLabels(new Set(tagsSet));
                    }
                  }).catch(() => {});
                }
              });
            }
            
            const colorTagsSource = customFields.colorTags || sourceAppt.colorTags || initialAppointment.colorTags;
            if (Array.isArray(colorTagsSource)) {
              setSelectedColorTags(new Set(colorTagsSource.map(c => typeof c === 'string' ? c.toLowerCase() : c)));
            }

            const extractProvId = (val) => {
              if (!val) return "";
              if (typeof val === 'object') return String(val._id || val.id || val.providerId || "");
              return String(val);
            };

            if (fullPatient) {
              const fallbackDentist = fullPatient.preferredDentistId || fullPatient.preferredDentist || fullPatient.preferredProviderId;
              setPreferredDentist(extractProvId(customFields.preferredDentist) || extractProvId(fallbackDentist));
              const fallbackHygienist = fullPatient.preferredHygienistId || fullPatient.preferredHygienist;
              setPreferredHygienist(extractProvId(customFields.preferredHygienist) || extractProvId(fallbackHygienist));
            } else if (patId) {
              setPreferredDentist(extractProvId(customFields.preferredDentist));
              setPreferredHygienist(extractProvId(customFields.preferredHygienist));
              import('../../services/patient.service').then(({ patientService }) => {
                patientService.getPatientById(patId).then(res => {
                  const p = res.data;
                  if (p) {
                    if (!customFields.preferredDentist) {
                      const d = p.preferredDentistId || p.preferredDentist || p.preferredProviderId;
                      if (d) setPreferredDentist(extractProvId(d));
                    }
                    if (!customFields.preferredHygienist) {
                      const h = p.preferredHygienistId || p.preferredHygienist;
                      if (h) setPreferredHygienist(extractProvId(h));
                    }
                  }
                }).catch(() => {});
              }).catch(() => {});
            }
        };

        const shallowAppt = initialAppointment.rawAppointment || initialAppointment;
        applyApptToForm(shallowAppt, []); // Synchronous load instantly

        const loadFullDetails = async () => {
          try {
            if (initialAppointment.id && !String(initialAppointment.id).startsWith("temp-")) {
              const { appointmentService } = await import('../../services/appointment.service');
              const realId = String(initialAppointment.id).replace('appt-', '');
              try {
                const fullAppt = await appointmentService.getAppointmentById(realId);
                const fullProcedures = await appointmentService.getAppointmentProcedures(realId);
                applyApptToForm(fullAppt, fullProcedures); // Update with deep data
              } catch (e) {
                console.warn("Failed to fetch full appointment details, falling back to shallow data", e);
              }
            }
          } catch (err) {
            console.error("Error populating AddNewPatientAppointmentForm", err);
          }
        };
        
        loadFullDetails();

      } else if (initialShortlistData) {
        // Try to find the full patient object from the loaded patients list
        const patId = String(initialShortlistData.PatNum || initialShortlistData.patientId);
        const fullPatient = patients.find(p => String(p.id || p._id || p.PatNum) === patId);
        
        const mockPatient = { 
          id: patId, 
          rawId: patId,
          firstName: initialShortlistData.PatientName ? initialShortlistData.PatientName.split(' ')[0] : 'Unknown',
          lastName: initialShortlistData.PatientName ? initialShortlistData.PatientName.split(' ').slice(1).join(' ') : 'Patient'
        };
        
        setPatient(fullPatient || mockPatient);
        
        let parsedDate = dayjs();
        if (initialShortlistData.AppointmentDate) {
          let d = dayjs(initialShortlistData.AppointmentDate);
          if (initialShortlistData.StartTime) {
            const [h, m] = initialShortlistData.StartTime.split(':');
            d = d.hour(parseInt(h) || 0).minute(parseInt(m) || 0);
          }
          parsedDate = d;
        }
        
        setApptDate(parsedDate);
        setTimeHours(parsedDate.format("hh"));
        setTimeMins(parsedDate.format("mm"));
        setAmPm(parsedDate.format("A"));
        
        setRoomId(initialShortlistData.RoomId ? String(initialShortlistData.RoomId) : "");
        setStatus(initialShortlistData.Status || "scheduled");
        setDurationMins(initialShortlistData.DurationMins || 60);
        
        setProviderRows(initialShortlistData.ProvNum ? 
          [{ id: Date.now(), providerId: String(initialShortlistData.ProvNum), time: initialShortlistData.DurationMins || 60 }] : 
          [{ id: Date.now(), providerId: "", time: 60 }]);
          
        setNotes(initialShortlistData.Notes || "");
        
        // Extract procedures from shortlist custom fields
        let customFieldsRaw = initialShortlistData.CustomFields || initialShortlistData.customFields;
        let customFields = {};
        if (typeof customFieldsRaw === 'string') {
          try { customFields = JSON.parse(customFieldsRaw); } catch (e) { customFields = {}; }
        } else if (customFieldsRaw) {
          customFields = customFieldsRaw;
        }

        let initialProcs = [];
        if (customFields.procedures && Array.isArray(customFields.procedures)) {
          initialProcs = customFields.procedures;
        } else if (customFields.procedureTags && Array.isArray(customFields.procedureTags)) {
          // If they only have tags, we can map them to dummy procedures if needed, 
          // or just leave them. The user wants procedures.
          initialProcs = customFields.procedureTags.map(tag => ({
            code: "TBD",
            treatment: tag.label || tag,
            charge: "$0.00",
            tag: typeof tag === 'object' ? tag : { label: tag, color: "#374151" }
          }));
        } else if (initialShortlistData.procedures && Array.isArray(initialShortlistData.procedures)) {
          initialProcs = initialShortlistData.procedures;
        } else if (typeof initialShortlistData.Procedures === 'string') {
          try { initialProcs = JSON.parse(initialShortlistData.Procedures); } catch (e) { initialProcs = []; }
        } else if (Array.isArray(initialShortlistData.Procedures)) {
          initialProcs = initialShortlistData.Procedures;
        }
        // Ensure they are objects and have checked: true so they aren't filtered out on submit
        initialProcs = initialProcs.map((p, i) => {
          const base = typeof p === 'string' ? { code: "TBD", treatment: p, charge: "$0.00" } : p;
          return { ...base, checked: true, id: base.id || (Date.now() + i) };
        });
        
        setProcedures(initialProcs.length > 0 ? initialProcs : INITIAL_PROCEDURES);

        // Reconstruct selected tags if they exist
        if (customFields.procedureTags && Array.isArray(customFields.procedureTags)) {
          const tags = new Set();
          customFields.procedureTags.forEach(tagObj => {
            if (tagObj && tagObj.label) {
              import('./new-appointment/constants').then(({ DEFAULT_PROCEDURE_TAGS }) => {
                const idx = DEFAULT_PROCEDURE_TAGS.findIndex(t => t.label === tagObj.label && (t.color === tagObj.color || !tagObj.color));
                if (idx >= 0) {
                  tags.add(`${tagObj.label}-${idx}`);
                  setSelectedTagLabels(new Set(tags));
                }
              }).catch(() => {});
            }
          });
        }
        
        // Fetch full patient if not in the cached list to get preferred providers
        if (fullPatient) {
          const fallbackDentist = fullPatient.preferredDentistId || fullPatient.preferredDentist || fullPatient.preferredProviderId;
          setPreferredDentist(customFields.preferredDentist || (fallbackDentist ? String(fallbackDentist) : ""));
          const fallbackHygienist = fullPatient.preferredHygienistId || fullPatient.preferredHygienist;
          setPreferredHygienist(customFields.preferredHygienist || (fallbackHygienist ? String(fallbackHygienist) : ""));
        } else {
          // If we don't have the full patient, temporarily set what we have in custom fields,
          // then fetch the real patient to get the fallbacks!
          setPreferredDentist(customFields.preferredDentist || "");
          setPreferredHygienist(customFields.preferredHygienist || "");
          
          import('../../services/patient.service').then(({ patientService }) => {
            patientService.getPatientById(patId).then(res => {
              const p = res.data;
              if (p) {
                if (!customFields.preferredDentist) {
                  const d = p.preferredDentistId || p.preferredDentist || p.preferredProviderId;
                  if (d) setPreferredDentist(String(d));
                }
                if (!customFields.preferredHygienist) {
                  const h = p.preferredHygienistId || p.preferredHygienist;
                  if (h) setPreferredHygienist(String(h));
                }
              }
            }).catch(() => {});
          }).catch(() => {});
        }
        
        // Color tags: if not in custom fields, use patient flags (which are colors) if available
        if (customFields.colorTags && Array.isArray(customFields.colorTags)) {
          setSelectedColorTags(new Set(customFields.colorTags.map(c => typeof c === 'string' ? c.toLowerCase() : c)));
        } else if (initialShortlistData.flags && Array.isArray(initialShortlistData.flags)) {
          import('../patient-flags/constants').then(({ getFlagColor }) => {
            const mappedColors = initialShortlistData.flags.map(f => getFlagColor(f).toLowerCase());
            setSelectedColorTags(new Set(mappedColors));
          }).catch(() => {
            setSelectedColorTags(new Set());
          });
        } else {
          setSelectedColorTags(new Set());
        }
      } else {
        setPatient(initialPatient || null);
        setApptDate(initialDateTime || dayjs());
        setTimeHours(initialDateTime ? initialDateTime.format("hh") : dayjs().format("hh"));
        setTimeMins(initialDateTime ? initialDateTime.format("mm") : dayjs().format("mm"));
        setAmPm(initialDateTime ? initialDateTime.format("A") : dayjs().format("A"));
        setRoomId(initialRoomId != null ? String(initialRoomId) : "");
        setStatus("scheduled");
        setDurationMins(60);
        setProviderRows([{ id: Date.now(), providerId: "", time: 60 }]);
        setNotes("");
        setProcedures(INITIAL_PROCEDURES);
        setPreferredDentist("");
        setPreferredHygienist("");
        setSelectedColorTags(new Set());
      }

      setVisitType("treatment");
      setSelectedTagLabels(new Set());
      setTagProcedureIds({});
      setAddingProcedure(false);
      setProcedureInput("");

      setSubmitAttempted(false);
    }
  }, [open, initialPatient, initialDateTime, initialRoomId, initialShortlistData, initialAppointment]);

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

    if (newPatient) {
      // Auto-populate preferred providers from patient profile if available
      const dentist = newPatient.preferredDentistId || newPatient.preferredDentist || newPatient.preferredProviderId;
      if (dentist) setPreferredDentist(String(dentist));
      
      const hygienist = newPatient.preferredHygienistId || newPatient.preferredHygienist;
      if (hygienist) setPreferredHygienist(String(hygienist));
    } else {
      setPreferredDentist("");
      setPreferredHygienist("");
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
      const template = TAG_DEFAULT_PROCEDURES[label];
      const tagInfo  = DEFAULT_PROCEDURE_TAGS[idx];
      if (template && tagInfo) {
        const existing = procedures.find((p) => p.code === template.code);
        if (existing) {
          setToastMessage("Already added");
          setSelectedTagLabels((prev) => new Set([...prev, key]));
          setTagProcedureIds((prev) => ({ ...prev, [key]: existing.id }));
          return;
        }

        setSelectedTagLabels((prev) => new Set([...prev, key]));
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
    const exists = procedures.some((p) => p.code === option.code);
    if (exists) {
      setToastMessage("Already added");
      setProcedureInput("");
      setAddingProcedure(false);
      return;
    }
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
  const getAppointmentPayload = () => {
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

    const start = dateTime || dayjs();
    if (start.isBefore(dayjs().startOf('day'))) {
      setErrorMessage("Appointment date cannot be in the past.");
      return null;
    }

    return {
      patientId:       patient?._id || patient?.id,
      patientName:     patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() : "",
      appointmentDate: dateTime.format("YYYY-MM-DD"),
      startTime:       dateTime.format("HH:mm"),
      endTime:         end.format("HH:mm"),
      durationMinutes: durationMins,
      durationMins:    durationMins, // Added for backend compatibility
      status,
      notes,
      providerId: providerRows[0]?.providerId || undefined,
      roomId:     roomId || undefined,
      customFields: {
        visitType,
        procedures: procedures.filter((p) => p.checked).map(({ code, treatment, charge }) => ({ code, treatment, charge })),
        preferredDentist,
        preferredHygienist,
        colorTags: [...selectedColorTags],
        procedureTags: selectedProcedureTags,
        operatoryId: roomId || undefined,
      },
    };
  };

  const handleSubmit = () => {
    if (!onSubmit) return;
    setSubmitAttempted(true);

    const checkedProcedures = procedures.filter(p => p.checked);
    if (checkedProcedures.length === 0) {
      setErrorMessage("Please select at least one procedure to create an appointment.");
      return;
    }

    if (durationMins <= 0) {
      setErrorMessage("Please enter a valid appointment duration (greater than 0 minutes).");
      return;
    }

    const startH = dateTime.hour();
    if (startH < 7 || startH >= 21) {
      setErrorMessage("Appointments can only be scheduled between 7:00 AM and 9:00 PM.");
      return;
    }

    // Only providerRows[0] feeds the payload's providerId (see getAppointmentPayload),
    // so that's the row that actually needs to be filled in to submit.
    if (!patient || !providerRows[0]?.providerId) return;
    const payload = getAppointmentPayload();
    if (payload) onSubmit(payload);
  };

  const isShortlistEditMode = Boolean(initialShortlistData);
  const isEditMode = Boolean(initialAppointment || initialShortlistData);

  const handleConvertToShortlist = async () => {
    if (!patient) {
      setErrorMessage("Please select a patient first.");
      return;
    }
    const payload = getAppointmentPayload();
    try {
      if (isShortlistEditMode) {
        await shortlistService.updateShortlistItem(initialShortlistData.ShortlistNum, payload);
        alert("Successfully updated shortlist item!");
      } else {
        await shortlistService.createShortlistItem(payload);
        alert("Successfully converted to shortlist!");
      }
      // Dispatch event to instantly update the Shortlist panel
      window.dispatchEvent(new Event('shortlist-updated'));
      if (onCancel) onCancel(); // Close modal
    } catch (err) {
      console.error("Shortlist operation failed:", err);
      setErrorMessage(`Failed to ${isShortlistEditMode ? 'update' : 'convert to'} shortlist. See console for details.`);
    }
  };

  const fName = patient?.firstName || patient?.FName || "";
  const lName = patient?.lastName || patient?.LName || "";
  const patientDisplayName = patient
    ? (`${fName} ${lName}`.trim() || patient.name || patient.fullName || "Patient")
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
        <AppointmentModalHeader 
          onCancel={onCancel} 
          onConvertToShortlist={handleConvertToShortlist} 
          isEditMode={isEditMode} 
          patientDisplayName={patientDisplayName}
          apptDate={apptDate}
          timeHours={timeHours}
          timeMins={timeMins}
          amPm={amPm}
          visitType={visitType}
        />

        {errorMessage && (
          <Alert severity="error" sx={{ mx: 2, mt: 2, mb: 1 }} onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        )}

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0, mt: errorMessage ? 0 : 2 }}>
          <AppointmentLeftPanel
            patients={patients}
            loadingPatients={loadingPatients}
            patient={patient}
            onPatientChange={handlePatientChange}
            onPatientSearch={onPatientSearch}
            patientError={submitAttempted && !patient}
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
            showExtendedOptions={showExtendedOptions}
            onDuplicateProcedure={setToastMessage}
          />

          <AppointmentRightPanel
            status={status}
            onStatusChange={setStatus}
            roomId={roomId}
            onRoomChange={setRoomId}
            rooms={rooms}
            isRoomOccupied={roomId && occupiedRoomIds.has(String(roomId))}
            durationMins={durationMins}
            onDurationChange={setDurationMins}
            providerRows={providerRows}
            setProviderRows={setProviderRows}
            providerError={submitAttempted && !providerRows[0]?.providerId}
            preferredDentist={preferredDentist}
            onPreferredDentistChange={setPreferredDentist}
            preferredHygienist={preferredHygienist}
            onPreferredHygienistChange={setPreferredHygienist}
            notes={notes}
            onNotesChange={setNotes}
            selectedColorTags={selectedColorTags}
            onColorTagsChange={setSelectedColorTags}
            providers={providers}
            referredBy={referredBy}
            onReferredByChange={setReferredBy}
            noReminders={noReminders}
            onNoRemindersChange={setNoReminders}
            tags={tags}
            onTagsChange={setTags}
            showExtendedOptions={showExtendedOptions}
          />
        </Box>

        <AppointmentFooter
          patient={patient}
          patientDisplayName={patientDisplayName}
          patientId={patientId}
          onCancel={onCancel}
          onSubmit={handleSubmit}
          loading={loading}
          showExtendedOptions={showExtendedOptions}
          isEditMode={isEditMode}
        />
      </Box>
      <Snackbar open={!!toastMessage} autoHideDuration={3000} onClose={() => setToastMessage("")} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToastMessage("")} severity="info" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddNewPatientAppointmentForm;
