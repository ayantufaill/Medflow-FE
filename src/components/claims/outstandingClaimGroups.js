export const groupOutstandingClaims = (claims, dateRange, groupBy, now = new Date()) => {
  if (dateRange !== 'dos' && groupBy === 'none') return [{ label: null, claims }];
  const groups = new Map();
  for (const claim of claims) {
    const parts = [];
    if (dateRange === 'dos') {
      const serviceDate = claim.dateOfService ? new Date(claim.dateOfService) : null;
      const age = serviceDate && !Number.isNaN(serviceDate.getTime())
        ? Math.floor((now.getTime() - serviceDate.getTime()) / 86400000) : null;
      parts.push(age === null ? 'Unknown service date' : age <= 30 ? '0-30 days'
        : age <= 60 ? '31-60 days' : age <= 90 ? '61-90 days' : '>90 days');
    }
    if (groupBy === 'carrier') parts.push(claim.carrier || 'No Carrier');
    if (groupBy === 'patient') parts.push(claim.patientName || 'Unknown Patient');
    const label = parts.join(' / ');
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(claim);
  }
  const result = Array.from(groups, ([label, rows]) => ({ label, claims: rows }));
  const ageOrder = ['0-30 days', '31-60 days', '61-90 days', '>90 days', 'Unknown service date'];
  result.sort((a, b) => {
    if (dateRange === 'dos') {
      const first = ageOrder.indexOf(a.label.split(' / ')[0]);
      const second = ageOrder.indexOf(b.label.split(' / ')[0]);
      if (first !== second) return first - second;
    }
    return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
  });
  return result;
};
