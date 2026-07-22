import React, { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, RadioGroup, FormControlLabel as MuiFormControlLabel, Radio, TextField, Typography } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FieldBox, Label } from "./helpers";
import dayjs from "dayjs";
import PatientSearchField from "./PatientSearchField";
import ProcedureTagStrip from "./ProcedureTagStrip";
import ProcedureTable from "./ProcedureTable";
import PastVisitProceduresSelector from "./PastVisitProceduresSelector";

const AppointmentLeftPanel = ({
  // Patient
  patients, loadingPatients, patient, onPatientChange, onPatientSearch, patientError,
  // Date/time
  apptDate, onDateChange,
  timeHours, timeMins, amPm,
  onTimeChange, onAmPmChange,
  // Visit type
  visitType, onVisitTypeChange,
  // Procedure tags
  selectedTagLabels, onTagClick,
  addingProcedure, procedureInput,
  onProcedureInputChange, onAddingProcedureToggle, onSelectProcedure,
  // Procedure table
  procedures, setProcedures, providers,
  showExtendedOptions,
}) => {
  const [showPastVisits, setShowPastVisits] = useState(false);

  const handleAddPastProcedure = (proc) => {
    setProcedures([...procedures, proc]);
  };

  return (
    <Box sx={{ flex: 1, p: "20px", overflowY: "auto", borderRight: "1px solid #e0e5eb", minWidth: 0 }}>

    {/* Patient / Date / Time row */}
    <Box sx={{ display: "flex", gap: "12px", mb: "20px", alignItems: "flex-end" }}>
      <PatientSearchField
        patients={patients}
        loadingPatients={loadingPatients}
        value={patient}
        onChange={onPatientChange}
        onSearch={onPatientSearch}
        error={patientError}
      />

      <FieldBox label="Date" sx={{ width: "165px", flexShrink: 0 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={apptDate}
            onChange={(v) => v && onDateChange(v)}
            views={['year', 'month', 'day']}
            disablePast
            slotProps={{
              popper: { sx: { zIndex: 1400 } },
              textField: {
                size: "small",
                sx: { width: "165px", "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", height: "40px" } },
              },
            }}
          />
        </LocalizationProvider>
      </FieldBox>

      <FieldBox label="Time" sx={{ flexShrink: 0 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={(() => {
              const h = parseInt(timeHours, 10);
              const m = parseInt(timeMins, 10);
              const hour24 = amPm === 'PM' ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
              return dayjs().hour(hour24).minute(m).second(0);
            })()}
            onChange={(v) => {
              if (!v) return;
              onTimeChange(v.format('hh'), v.format('mm'));
              onAmPmChange(v.format('A'));
            }}
            minTime={apptDate && dayjs(apptDate).isSame(dayjs(), 'day') ? dayjs() : undefined}
            slotProps={{
              popper: { sx: { zIndex: 1400 } },
              textField: {
                size: 'small',
                sx: {
                  width: '130px',
                  '& .MuiInputBase-root': {
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    borderRadius: '8px',
                    height: '40px',
                    paddingRight: '4px',
                  },
                  // hide the default left adornment gap
                  '& .MuiInputAdornment-positionStart': { display: 'none' },
                },
              },
              openPickerButton: {
                sx: { color: '#9aa3ae', padding: '4px' },
              },
              openPickerIcon: {
                sx: { fontSize: '16px' },
              },
            }}
          />
        </LocalizationProvider>
      </FieldBox>
    </Box>

    {/* Type of visit */}
    <Box sx={{ mb: "16px" }}>
      <Label>Type of visit</Label>
      <RadioGroup row value={visitType} onChange={(e) => onVisitTypeChange(e.target.value)} sx={{ gap: "8px" }}>
        {["Treatment", "Recare"].map((v) => (
          <FormControlLabel
            key={v}
            value={v.toLowerCase()}
            control={<Radio size="small" sx={{ p: "4px", color: "#d1d5db", "&.Mui-checked": { color: "#2262ef" } }} />}
            label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>{v}</Typography>}
          />
        ))}
      </RadioGroup>
    </Box>

    {/* Quick add procedure */}
    <ProcedureTagStrip
      selectedTagLabels={selectedTagLabels}
      onTagClick={onTagClick}
      addingProcedure={addingProcedure}
      procedureInput={procedureInput}
      onProcedureInputChange={onProcedureInputChange}
      onAddingProcedureToggle={onAddingProcedureToggle}
      onSelectProcedure={onSelectProcedure}
    />

    {showExtendedOptions && (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', mt: '8px' }}>
          <Button
            variant="contained"
            disableElevation
            sx={{
              fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
              textTransform: 'none', borderRadius: '6px',
              backgroundColor: '#2262ef', color: '#fff',
              px: '12px', py: '5px',
              '&:hover': { backgroundColor: '#1a50cc' },
            }}
          >
            Compute next visit
          </Button>
          <Button
            variant="outlined"
            sx={{
              fontFamily: 'Inter', fontSize: '12px', fontWeight: 500,
              textTransform: 'none', borderRadius: '6px',
              border: '1px solid #f97316', color: '#f97316',
              px: '12px', py: '5px',
              '&:hover': { backgroundColor: '#fff7ed' },
            }}
          >
            Re-estimate
          </Button>
        </Box>
        
      </>
    )}

    {/* Procedure table */}
    <ProcedureTable procedures={procedures} setProcedures={setProcedures} providers={providers} showExtendedOptions={showExtendedOptions} />

    {/* Action buttons row + Complete All + Checkout — only when opened from Book button */}
    {showExtendedOptions && (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '10px' }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#2262ef' } }}
              />
            }
            label={
              <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#374151' }}>
                check out appointment
              </Typography>
            }
            sx={{ m: 0 }}
          />
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="contained"
              disableElevation
              sx={{
                fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
                textTransform: 'none', borderRadius: '6px',
                backgroundColor: '#2262ef', color: '#fff',
                px: '12px', py: '5px',
                '&:hover': { backgroundColor: '#1a50cc' },
              }}
            >
              Complete All
            </Button>
            <Button
              variant="contained"
              disableElevation
              sx={{
                fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
                textTransform: 'none', borderRadius: '6px',
                backgroundColor: '#f97316', color: '#fff',
                px: '12px', py: '5px',
                '&:hover': { backgroundColor: '#ea6c00' },
              }}
            >
              Collect Payments
            </Button>
          </Box>
        </Box>
      </>
    )}
    
    <Typography 
      sx={{ fontFamily: "Inter", fontSize: "12px", color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
      onClick={() => setShowPastVisits(!showPastVisits)}
    >
      {showPastVisits ? "- hide past visits" : "+ add procedures from another visit"}
    </Typography>

    {showPastVisits && (
      <PastVisitProceduresSelector patient={patient} onAddProcedure={handleAddPastProcedure} />
    )}
  </Box>
  );
};

export default AppointmentLeftPanel;
