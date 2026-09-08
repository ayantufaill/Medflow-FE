import dayjs from "dayjs";

/**
 * Checkout status values in Medflow.
 */
export const CHECKOUT_STATUSES = [
  "checked_out_complete",
  "checked_out_incomplete",
  "completed",
];

/**
 * Checks if a given status string is a checked out status.
 */
export const isCheckedOutStatus = (status) => {
  if (!status) return false;
  return CHECKOUT_STATUSES.includes(status.toLowerCase().trim());
};

/**
 * Constructs a Dayjs object from date and time components.
 */
export const buildAppointmentDateTime = (apptDate, timeHours, timeMins, amPm) => {
  if (!apptDate) return null;
  const baseDate = dayjs(apptDate);
  if (!baseDate.isValid()) return null;

  if (timeHours === undefined || timeHours === null || timeMins === undefined || timeMins === null) {
    return baseDate;
  }

  let h = parseInt(timeHours, 10);
  const m = parseInt(timeMins, 10);
  if (isNaN(h)) h = 9;
  const safeM = isNaN(m) ? 0 : m;

  let hour24 = h % 12;
  if (amPm === "PM") {
    hour24 += 12;
  }

  return baseDate.hour(hour24).minute(safeM).second(0).millisecond(0);
};

/**
 * Returns true if the appointment start time is in the future (current time is before start time).
 */
export const isFutureAppointment = (apptDate, timeHours, timeMins, amPm) => {
  const dt = buildAppointmentDateTime(apptDate, timeHours, timeMins, amPm);
  if (!dt || !dt.isValid()) return false;
  return dayjs().isBefore(dt);
};

/**
 * Returns true if a given start datetime is in the future.
 */
export const isFutureDateTime = (startDateTime) => {
  if (!startDateTime) return false;
  const dt = dayjs(startDateTime);
  if (!dt.isValid()) return false;
  return dayjs().isBefore(dt);
};
