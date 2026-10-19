export const formatCarrierAddress = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  const street = [address.addressLine1 || address.Address || address.street || address.address,
    address.addressLine2 || address.Address2 || address.street2].filter(Boolean).join(', ');
  const cityState = [address.city || address.City, address.state || address.State].filter(Boolean).join(', ');
  const zip = address.zipCode || address.Zip || address.zip || '';
  return [street, [cityState, zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
};

export const buildCarrierSearchRows = (companies, query = '') => {
  const searchTerm = query.trim().toLowerCase();
  return companies.flatMap((carrier) => {
    const resolvedAddress = formatCarrierAddress(carrier);
    const carrierMatches = [carrier.name, carrier.payerId, carrier.phone, resolvedAddress]
      .some((value) => String(value || '').toLowerCase().includes(searchTerm));
    const plans = (carrier.plans || []).filter((plan) =>
      carrierMatches || [plan.groupName, plan.groupNumber, plan.employerName]
        .some((value) => String(value || '').toLowerCase().includes(searchTerm))
    );
    if (plans.length === 0 && !carrierMatches) return [];
    if (plans.length === 0) return [{ ...carrier, resolvedAddress, _rowKey: `${carrier._id}-carrier` }];
    return plans.map((plan) => ({
      ...carrier,
      ...plan,
      resolvedAddress,
      _rowKey: `${carrier._id}-plan-${plan.id}`,
    }));
  });
};
