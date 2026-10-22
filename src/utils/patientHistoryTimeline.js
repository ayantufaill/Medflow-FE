import { formatFieldKey } from '../components/patient-detail/audit-history/utils';
import { formatHistoryTimestamp } from './dateUtils';

export function selectHistoryEvents(events, patientId, section) {
  return events.filter((event) => event.section === section &&
    String(event.patientId) === String(patientId))
    .sort((a, b) => {
      const aTime = Date.parse(a.changedAt);
      const bTime = Date.parse(b.changedAt);
      // Retain incomplete legacy records, without inventing a date for them.
      return (Number.isFinite(aTime) ? aTime : -Infinity) -
        (Number.isFinite(bTime) ? bTime : -Infinity) || String(a._id).localeCompare(String(b._id));
    });
}

export function historyEventAction(event) {
  const before = event.oldValue?.review;
  const after = event.newValue?.review;
  return after?.reviewedWithPatient === true &&
    (before?.reviewedWithPatient !== true ||
      (after.reviewedAt && after.reviewedAt !== before?.reviewedAt))
    ? 'Reviewed' : 'Saved';
}

export function historyEventActor(event) {
  const actor = event.actor;
  return [actor?.firstName, actor?.lastName].filter(Boolean).join(' ').trim() ||
    actor?.email || (actor?._id ? `User ${actor._id}` :
      event.source === 'system' ? 'System' : 'User not recorded');
}

// Flatten snapshots into readable fields. Match questionnaire rows by ID so
// reordering a list does not look like a clinical change. Never print data URLs.
function flattenSnapshot(value, timeZone, path = '', fields = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const title = item?.question || item?.label || item?.name || item?.drug || '';
      const key = item?.id ?? index + 1;
      flattenSnapshot(item, timeZone, `${path} / ${title ? `${title} (${key})` : key}`, fields);
    });
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      if (key === 'id') return;
      const fieldPath = path ? `${path} / ${formatFieldKey(key)}` : formatFieldKey(key);
      if (key === 'signatureDataUrl') {
        fields[fieldPath] = { raw: item, display: item ? 'Signature recorded' : 'No signature' };
      } else if (key === 'reviewedAt') {
        fields[fieldPath] = { raw: item, display: item ? formatHistoryTimestamp(item, timeZone) : '—' };
      } else {
        flattenSnapshot(item, timeZone, fieldPath, fields);
      }
    });
  } else {
    fields[path] = {
      raw: value ?? '',
      display: value == null || value === '' ? '—' :
        typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value),
    };
  }
  return fields;
}

export function historyEventDifferences(event, timeZone) {
  const before = flattenSnapshot(event.oldValue || {}, timeZone);
  const after = flattenSnapshot(event.newValue || {}, timeZone);
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((key) => before[key]?.raw !== after[key]?.raw)
    .map((key) => ({ key, before: before[key]?.display || '—', after: after[key]?.display || '—' }));
}
