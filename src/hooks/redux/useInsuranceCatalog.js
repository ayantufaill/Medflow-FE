import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllInsuranceCompaniesThunk,
  fetchInsurancePlansThunk,
  fetchCoverageTemplatesThunk,
  selectAllCompanies,
  selectCompaniesLoading,
  selectAllPlans,
  selectPlansLoading,
  selectCoverageTemplates,
  selectTemplatesLoading,
} from '../../store/slices/insuranceSlice';

export const useInsuranceCatalog = () => {
  const dispatch = useDispatch();
  
  const companies = useSelector(selectAllCompanies);
  const companiesLoading = useSelector(selectCompaniesLoading);
  
  const plans = useSelector(selectAllPlans);
  const plansLoading = useSelector(selectPlansLoading);
  
  const templates = useSelector(selectCoverageTemplates);
  const templatesLoading = useSelector(selectTemplatesLoading);

  const fetchCompanies = useCallback(() => {
    return dispatch(fetchAllInsuranceCompaniesThunk());
  }, [dispatch]);

  const fetchPlans = useCallback(() => {
    return dispatch(fetchInsurancePlansThunk());
  }, [dispatch]);

  const fetchTemplates = useCallback(() => {
    return dispatch(fetchCoverageTemplatesThunk());
  }, [dispatch]);

  const fetchAllCatalog = useCallback(async () => {
    await Promise.all([
      dispatch(fetchAllInsuranceCompaniesThunk()),
      dispatch(fetchInsurancePlansThunk()),
      dispatch(fetchCoverageTemplatesThunk())
    ]);
  }, [dispatch]);

  return {
    companies,
    companiesLoading,
    plans,
    plansLoading,
    templates,
    templatesLoading,
    fetchCompanies,
    fetchPlans,
    fetchTemplates,
    fetchAllCatalog
  };
};
