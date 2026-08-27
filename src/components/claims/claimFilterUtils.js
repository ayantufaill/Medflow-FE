import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(quarterOfYear);

/**
 * Filter an array of claims based on a date option and custom date range.
 *
 * @param {Array} claims - The array of claim objects to filter
 * @param {String} dateOption - The value from the `filterDate` dropdown (e.g. 'all', 'range', 'thisWeek')
 * @param {Object} customDateRange - { start: dayjs | null, end: dayjs | null }
 * @param {String} dateField - The property name on the claim to check (defaults to 'createdDate')
 * @returns {Array} - The filtered array of claims
 */
export const applyDateFilter = (claims, dateOption, customDateRange, dateField = 'createdDate') => {
  if (!dateOption || dateOption === 'all') {
    return claims;
  }

  const today = dayjs().startOf('day');
  let startDate = null;
  let endDate = null;

  switch (dateOption) {
    case 'range':
      // Only filter if they have provided at least one date in the range
      if (customDateRange?.start) {
        startDate = dayjs(customDateRange.start).startOf('day');
      }
      if (customDateRange?.end) {
        endDate = dayjs(customDateRange.end).endOf('day');
      }
      break;

    case 'thisWeek':
      startDate = today.startOf('week');
      endDate = today.endOf('week');
      break;

    case 'thisMonth':
      startDate = today.startOf('month');
      endDate = today.endOf('month');
      break;

    case 'last7Days':
      startDate = today.subtract(7, 'day');
      endDate = today.endOf('day');
      break;

    case 'lastWeek':
      startDate = today.subtract(1, 'week').startOf('week');
      endDate = today.subtract(1, 'week').endOf('week');
      break;

    case 'last4Weeks':
      startDate = today.subtract(4, 'week');
      endDate = today.endOf('day');
      break;

    case 'lastMonth':
      startDate = today.subtract(1, 'month').startOf('month');
      endDate = today.subtract(1, 'month').endOf('month');
      break;

    case 'last3Months':
      startDate = today.subtract(3, 'month').startOf('month');
      endDate = today.subtract(1, 'month').endOf('month');
      break;

    case 'last12Months':
      startDate = today.subtract(12, 'month').startOf('month');
      endDate = today.subtract(1, 'month').endOf('month');
      break;

    case 'monthToDate':
      startDate = today.startOf('month');
      endDate = today.endOf('day');
      break;

    case 'quarterToDate':
      startDate = today.startOf('quarter');
      endDate = today.endOf('day');
      break;

    case 'yearToDate':
      startDate = today.startOf('year');
      endDate = today.endOf('day');
      break;

    case 'lastYear':
      startDate = today.subtract(1, 'year').startOf('year');
      endDate = today.subtract(1, 'year').endOf('year');
      break;

    default:
      return claims;
  }

  // Apply the date bounds
  return claims.filter((claim) => {
    if (!claim[dateField]) return false;
    
    const claimDate = dayjs(claim[dateField]);
    
    // Invalid dates in the claim get filtered out
    if (!claimDate.isValid()) return false;

    if (startDate && claimDate.isBefore(startDate)) {
      return false;
    }
    if (endDate && claimDate.isAfter(endDate)) {
      return false;
    }

    return true;
  });
};
