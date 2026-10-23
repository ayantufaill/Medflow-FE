// Dates are clinic wall-clock calendar dates, so compare their YYYY-MM-DD
// components directly rather than converting them through the browser zone.
export function selectPatientSummaryAppointment(appointments, selectedDate) {
  if (!selectedDate) return null;
  const dated = appointments.map(appointment => {
    const date = String(appointment.appointmentDate || appointment.date || appointment.AptDateTime || '').slice(0, 10);
    const time = appointment.startTime || String(appointment.appointmentDate || appointment.AptDateTime || '').slice(11, 16) || '00:00';
    return { appointment, date, key: `${date}T${time}` };
  }).filter(({ date }) => /^\d{4}-\d{2}-\d{2}$/.test(date));
  dated.sort((a, b) => a.key.localeCompare(b.key));
  return dated.find(item => item.date === selectedDate)?.appointment
    || dated.find(item => item.date > selectedDate)?.appointment
    || dated.at(-1)?.appointment
    || null;
}
