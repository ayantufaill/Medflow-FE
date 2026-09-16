export const getClaimTypeLabel = (claimType) => {
  if (!claimType) return 'Primary Dental';
  
  if (typeof claimType !== 'string') {
    return String(claimType);
  }

  const normalized = claimType.toLowerCase();
  
  if (normalized === 'institutional') return 'Institutional';
  if (normalized === 'professional') return 'Professional';
  if (normalized === 'dental' || normalized === 'primary') return 'Primary Dental';
  if (normalized === 'secondary') return 'Secondary Dental';

  // For existing formats like "E-claim Primary" or "Manual Secondary"
  return claimType
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
