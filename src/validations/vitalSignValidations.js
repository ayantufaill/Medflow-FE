export const vitalSignValidations = {
  patientId: {
    required: 'Patient is required',
  },
  appointmentId: {
    optional: true,
  },
  bloodPressureSystolic: {
    min: {
      value: 40,
      message: 'Systolic BP must be at least 40 mmHg (Hard Stop)',
    },
    max: {
      value: 300,
      message: 'Systolic BP cannot exceed 300 mmHg (Hard Stop)',
    },
  },
  bloodPressureDiastolic: {
    min: {
      value: 20,
      message: 'Diastolic BP must be at least 20 mmHg (Hard Stop)',
    },
    max: {
      value: 200,
      message: 'Diastolic BP cannot exceed 200 mmHg (Hard Stop)',
    },
  },
  temperature: {
    min: {
      value: 90,
      message: 'Temperature must be at least 90°F',
    },
    max: {
      value: 110,
      message: 'Temperature must be less than 110°F',
    },
  },
  weight: {
    min: {
      value: 1,
      message: 'Weight must be at least 1 lb',
    },
    max: {
      value: 1500,
      message: 'Weight must be less than 1500 lbs',
    },
  },
  height: {
    min: {
      value: 10,
      message: 'Height must be at least 10 inches',
    },
    max: {
      value: 120,
      message: 'Height must be less than 120 inches',
    },
  },
  heartRate: {
    min: {
      value: 20,
      message: 'Heart rate must be at least 20 bpm',
    },
    max: {
      value: 300,
      message: 'Heart rate must be less than 300 bpm',
    },
  },
  respiratoryRate: {
    min: {
      value: 5,
      message: 'Respiratory rate must be at least 5 breaths/min',
    },
    max: {
      value: 60,
      message: 'Respiratory rate must be less than 60 breaths/min',
    },
  },
  oxygenSaturation: {
    min: {
      value: 0,
      message: 'SpO2 must be at least 0%',
    },
    max: {
      value: 100,
      message: 'SpO2 cannot exceed 100%',
    },
    criticalThreshold: 90,
  },
  recordedDate: {
    required: 'Recorded date is required',
  },
  recordedTime: {
    required: 'Recorded time is required',
    pattern: {
      value: /^([01]\d|2[0-3]):([0-5]\d)$/,
      message: 'Time must be in HH:MM format',
    },
  },
  notes: {
    maxLength: {
      value: 1000,
      message: 'Notes must be less than 1000 characters',
    },
  },
};

export const validateAtLeastOneVital = (data) => {
  const vitalFields = [
    'bloodPressureSystolic',
    'bloodPressureDiastolic',
    'temperature',
    'weight',
    'height',
    'heartRate',
    'respiratoryRate',
    'oxygenSaturation',
  ];

  const hasAtLeastOne = vitalFields.some(
    (field) => data[field] !== undefined && data[field] !== '' && data[field] !== null
  );

  if (!hasAtLeastOne) {
    return 'At least one vital sign measurement is required';
  }
  return null;
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height || height === 0) return null;
  const heightInMeters = height * 0.0254;
  const weightInKg = weight * 0.453592;
  return Math.round((weightInKg / (heightInMeters * heightInMeters)) * 10) / 10;
};

export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
  if (bmi < 25) return { label: 'Normal', color: 'success' };
  if (bmi < 30) return { label: 'Overweight', color: 'warning' };
  return { label: 'Obese', color: 'error' };
};

export const getBloodPressureCategory = (systolic, diastolic) => {
  if (!systolic || !diastolic) return null;
  if (systolic >= 180 || diastolic >= 120) return { label: 'Hypertensive Crisis', color: 'error' };
  if (systolic >= 140 || diastolic >= 90) return { label: 'High BP Stage 2', color: 'error' };
  if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) return { label: 'High BP Stage 1', color: 'warning' };
  if (systolic >= 120 && systolic < 130 && diastolic < 80) return { label: 'Elevated', color: 'warning' };
  if (systolic < 120 && diastolic < 80) return { label: 'Normal', color: 'success' };
  return null;
};

export const validateSystolicGreaterThanDiastolic = (systolic, diastolic) => {
  if (!systolic || !diastolic) return true;
  return parseInt(systolic) > parseInt(diastolic);
};

export const isSpO2Critical = (spo2) => {
  if (!spo2) return false;
  return parseFloat(spo2) < 90;
};
