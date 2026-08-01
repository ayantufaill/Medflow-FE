import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchBranches,
  setCurrentBranch,
  syncCurrentBranchToServer,
  selectBranches,
  selectCurrentBranchId,
  selectBranchLoading,
} from '../../store/slices/branchSlice';

/**
 * useBranch - global "which branch am I working in" context.
 * Mirrors usePatient()'s shape: a Redux-backed, localStorage-persisted current
 * selection that any component can read/write without prop drilling.
 *
 * Usage:
 * const { branches, currentBranch, setBranch } = useBranch();
 */
export const useBranch = () => {
  const dispatch = useDispatch();
  const branches = useSelector(selectBranches) || [];
  const currentBranchId = useSelector(selectCurrentBranchId);
  const loading = useSelector(selectBranchLoading);

  const currentBranch = branches.find((b) => b.id === currentBranchId) || null;

  const loadBranches = useCallback(() => {
    return dispatch(fetchBranches());
  }, [dispatch]);

  const setBranch = useCallback((branchId) => {
    dispatch(setCurrentBranch(branchId));
    dispatch(syncCurrentBranchToServer(branchId));
  }, [dispatch]);

  return {
    branches,
    currentBranchId,
    currentBranch,
    loading,
    fetchBranches: loadBranches,
    setBranch,
  };
};
