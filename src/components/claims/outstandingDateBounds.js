import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear);

export const getOutstandingDateBounds = (option, custom = {}, now = dayjs()) => {
  const today = now.startOf('day');
  const tomorrow = today.add(1, 'day');
  let start = null;
  let end = null;
  switch (option) {
    case 'range':
      start = custom.start?.isValid?.() ? custom.start.startOf('day') : null;
      end = custom.end?.isValid?.() ? custom.end.startOf('day').add(1, 'day') : null;
      break;
    case 'thisWeek': start = today.startOf('week'); end = start.add(1, 'week'); break;
    case 'thisMonth': start = today.startOf('month'); end = start.add(1, 'month'); break;
    case 'last7Days': start = today.subtract(6, 'day'); end = tomorrow; break;
    case 'lastWeek': end = today.startOf('week'); start = end.subtract(1, 'week'); break;
    case 'last4Weeks': start = today.subtract(27, 'day'); end = tomorrow; break;
    case 'lastMonth': end = today.startOf('month'); start = end.subtract(1, 'month'); break;
    case 'last3Months': end = today.startOf('month'); start = end.subtract(3, 'month'); break;
    case 'last12Months': end = today.startOf('month'); start = end.subtract(12, 'month'); break;
    case 'monthToDate': start = today.startOf('month'); end = tomorrow; break;
    case 'quarterToDate': start = today.startOf('quarter'); end = tomorrow; break;
    case 'yearToDate': start = today.startOf('year'); end = tomorrow; break;
    case 'lastYear': end = today.startOf('year'); start = end.subtract(1, 'year'); break;
    default: break;
  }
  return { start: start?.toISOString() || '', end: end?.toISOString() || '' };
};
