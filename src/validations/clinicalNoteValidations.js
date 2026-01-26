export const clinicalNoteValidations = {
  patientId: {
    required: 'Patient is required',
  },
  appointmentId: {
    required: 'Appointment is required',
  },
  providerId: {
    required: 'Provider is required',
  },
  templateId: {
    required: 'Template is required',
  },
  noteType: {
    required: 'Note type is required',
  },
  chiefComplaint: {
    maxLength: {
      value: 255,
      message: 'Chief complaint must not exceed 255 characters',
    },
  },
  subjective: {
    validate: {
      notOnlyWhitespace: (value) => {
        if (value && value.trim().length === 0) {
          return 'Subjective cannot be only whitespace';
        }
        return true;
      },
    },
  },
  objective: {
    validate: {
      notOnlyWhitespace: (value) => {
        if (value && value.trim().length === 0) {
          return 'Objective cannot be only whitespace';
        }
        return true;
      },
    },
  },
  assessment: {
    validate: {
      notOnlyWhitespace: (value) => {
        if (value && value.trim().length === 0) {
          return 'Assessment cannot be only whitespace';
        }
        return true;
      },
    },
  },
  plan: {
    validate: {
      notOnlyWhitespace: (value) => {
        if (value && value.trim().length === 0) {
          return 'Plan cannot be only whitespace';
        }
        return true;
      },
    },
  },
  diagnosisCodes: {
    validate: {
      validArray: (value) => {
        if (value && !Array.isArray(value)) {
          return 'Diagnosis codes must be an array';
        }
        return true;
      },
    },
  },
  followUpDate: {
    validate: {
      validDate: (value) => {
        if (value && isNaN(new Date(value).getTime())) {
          return 'Please enter a valid date';
        }
        return true;
      },
      futureDate: (value) => {
        if (value && new Date(value) <= new Date()) {
          return 'Follow-up date must be in the future';
        }
        return true;
      },
    },
  },
};

export const validateSOAPForSigning = (noteData) => {
  const errors = [];
  
  if (!noteData.subjective && !noteData.objective && !noteData.assessment && !noteData.plan) {
    errors.push('At least one SOAP section must be completed before signing');
  }
  
  return errors;
};

export const NOTE_TYPES = [
  { value: 'soap', label: 'SOAP Note' },
  { value: 'progress', label: 'Progress Note' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'treatment_plan', label: 'Treatment Plan' },
  { value: 'other', label: 'Other' },
];
