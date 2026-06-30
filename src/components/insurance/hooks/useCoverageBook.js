import { useState, useEffect, useMemo, useCallback } from 'react';
import { feeService } from '../../../services/fee.service';
import { getProcedureType } from '../utils/insuranceHelpers';

export const useCoverageBook = (open, feeGuideId, coverageData, setCoverageData) => {
  const [loading, setLoading] = useState(false);
  const [procedures, setProcedures] = useState([]);
  const [expandedTypes, setExpandedTypes] = useState({'Diagnostic': true});
  const [expandedGroups, setExpandedGroups] = useState({'Diagnostic_Oral evaluation': true});
  const [activeToothSelection, setActiveToothSelection] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      if (!open || !feeGuideId) {
        if (!feeGuideId) setProcedures([]);
        return;
      }
      setLoading(true);
      try {
        const response = await feeService.getFeeScheduleFees(feeGuideId, { limit: 5000 });
        if (response && response.data) {
          setProcedures(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch fees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [feeGuideId, open]);

  const mergedData = useMemo(() => {
    const overridesMap = new Map();
    (coverageData || []).forEach(item => {
      if (item.code) overridesMap.set(item.code, item);
    });

    return procedures.map(proc => {
      const override = overridesMap.get(proc.code);
      return {
        ...proc,
        maxAllowed: override?.maxAllowed ?? proc.fee ?? '',
        frequency1: override?.frequency1 ?? '',
        frequency2: override?.frequency2 ?? '',
        period: override?.period ?? 'M',
        lifetimeLimit: override?.lifetimeLimit ?? '',
        age: override?.age ?? '',
        teethLimit: override?.teethLimit ?? '',
        hasDowngrade: override?.hasDowngrade ?? false,
        downgrade: override?.downgrade ?? '',
        nc: override?.nc ?? false,
        flatPlanPortion: override?.flatPlanPortion ?? ''
      };
    });
  }, [procedures, coverageData]);

  const treeData = useMemo(() => {
    const tree = {};
    mergedData.forEach(item => {
      const type = getProcedureType(item.code);
      const group = item.category || 'General';

      if (!tree[type]) tree[type] = {};
      if (!tree[type][group]) tree[type][group] = [];
      tree[type][group].push(item);
    });
    return tree;
  }, [mergedData]);

  const toggleType = useCallback((type) => setExpandedTypes(prev => ({ ...prev, [type]: !prev[type] })), []);
  const toggleGroup = useCallback((groupKey) => setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] })), []);

  const handleFieldChange = useCallback((code, field, value) => {
    if (!setCoverageData) return;
    const newData = [...(coverageData || [])];
    const index = newData.findIndex(item => item.code === code);
    if (index >= 0) {
      newData[index] = { ...newData[index], [field]: value };
    } else {
      const item = mergedData.find(i => i.code === code);
      if (item) newData.push({ ...item, [field]: value });
    }
    setCoverageData(newData);
  }, [coverageData, mergedData, setCoverageData]);

  const handleToothToggle = useCallback((tooth) => {
    if (!activeToothSelection) return;
    const proc = mergedData.find(p => p.code === activeToothSelection);
    if (!proc) return;
    
    let currentTeeth = proc.teethLimit ? proc.teethLimit.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (currentTeeth.includes(tooth)) {
      currentTeeth = currentTeeth.filter(t => t !== tooth);
    } else {
      currentTeeth.push(tooth);
    }
    handleFieldChange(activeToothSelection, 'teethLimit', currentTeeth.join(', '));
  }, [activeToothSelection, mergedData, handleFieldChange]);

  const isToothSelected = useCallback((tooth) => {
    if (!activeToothSelection) return false;
    return mergedData.find(p => p.code === activeToothSelection)?.teethLimit?.includes(tooth);
  }, [activeToothSelection, mergedData]);

  return {
    loading,
    treeData,
    expandedTypes,
    expandedGroups,
    activeToothSelection,
    setActiveToothSelection,
    toggleType,
    toggleGroup,
    handleFieldChange,
    handleToothToggle,
    isToothSelected
  };
};
