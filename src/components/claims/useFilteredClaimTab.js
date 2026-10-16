import { useCallback, useEffect, useRef, useState } from 'react';
import { claimService } from '../../services/claim.service';
import { mapClaimFields } from './claimUtils';
import { getOutstandingDateBounds } from './outstandingDateBounds';

export const useFilteredClaimTab = (tab, filters, customDateRange, showHidden, includeInactive = false) => {
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [loadError, setLoadError] = useState('');
  const requestId = useRef(0);

  const loadData = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoadingClaims(true);
    setLoadError('');
    setFilteredClaims([]);
    try {
      const bounds = getOutstandingDateBounds(filters.filterDate, customDateRange);
      const options = {
        tab, limit: 100, showHidden, reportFilter: true,
        reportSort: filters.sort || 'none',
        reportClaimType: filters.claimType,
        reportCarrier: filters.carrier,
        reportAttachment: filters.attachment,
        reportStatus: filters.status,
        reportDate: filters.filterDate,
        reportStart: bounds.start,
        reportEnd: bounds.end,
        reportSearch: filters.search,
        reportPatient: filters.searchPatient,
        reportClaim: filters.searchClaim,
        reportIncludeInactive: includeInactive,
      };
      const result = [];
      let page = 1;
      let pages = 1;
      do {
        const data = await claimService.getAllClaims({ ...options, page });
        if (currentRequest !== requestId.current) return;
        result.push(...(data.claims || []).map((claim) => mapClaimFields(claim, tab)));
        pages = data.pagination?.pages || 1;
        page += 1;
      } while (page <= pages);
      setFilteredClaims(result);
    } catch (err) {
      console.error(err);
      if (currentRequest === requestId.current) {
        setFilteredClaims([]);
        setLoadError('Could not load claims. Use Refresh to try again.');
      }
    } finally {
      if (currentRequest === requestId.current) setLoadingClaims(false);
    }
  }, [tab, filters, customDateRange, showHidden, includeInactive]);

  useEffect(() => {
    const timer = setTimeout(loadData, filters.search || filters.searchPatient || filters.searchClaim ? 250 : 0);
    const handleRefresh = () => loadData();
    window.addEventListener('refresh-claims', handleRefresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('refresh-claims', handleRefresh);
      requestId.current += 1;
    };
  }, [loadData, filters.search, filters.searchPatient, filters.searchClaim]);

  return { filteredClaims, loadingClaims, loadError, loadData };
};
