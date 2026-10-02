import { useState, useEffect, useMemo, useCallback } from 'react';
import { feeService } from '../../../services/fee.service';
import { getProcedureType, DOWNGRADE_CODE_MAP } from '../utils/insuranceHelpers';

export const useCoverageBook = (open, feeGuideId, coverageData, setCoverageData) => {
  const [loading, setLoading] = useState(false);
  const [procedures, setProcedures] = useState([]);
  const [expandedTypes, setExpandedTypes] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [activeToothSelection, setActiveToothSelection] = useState(null);
  const [bulkTeethSelection, setBulkTeethSelection] = useState([]);

  useEffect(() => {
    setBulkTeethSelection([]);
  }, [activeToothSelection]);

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
        // Teeth selected for the downgraded code (which may have no fee-guide row).
        downgradeTeeth: (() => {
          const dgCode = override?.downgrade || DOWNGRADE_CODE_MAP[String(proc.code || '').toUpperCase()] || '';
          if (!dgCode) return '';
          const dgOverride = (coverageData || []).find((item) => item.code === dgCode);
          if (!dgOverride) return '';
          return dgOverride.teethLimit || (Array.isArray(dgOverride.teeth) ? dgOverride.teeth.join(', ') : '');
        })(),
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

  // Accepts either (code, field, value) or (code, { field: value, ... }) so a
  // single update can set several fields at once.
  const handleFieldChange = useCallback((code, field, value) => {
    if (!setCoverageData) return;
    const patch = (typeof field === 'object' && field !== null) ? field : { [field]: value };
    setCoverageData(prevData => {
      const newData = [...(prevData || [])];

      if (code.startsWith('TYPE|')) {
        const type = code.split('|')[1];
        const matchingProcs = mergedData.filter(p => getProcedureType(p.code) === type);
        matchingProcs.forEach(proc => {
          const index = newData.findIndex(item => item.code === proc.code);
          if (index >= 0) {
            newData[index] = { ...newData[index], ...patch };
          } else {
            newData.push({ ...proc, ...patch });
          }
        });
      } else if (code.startsWith('GROUP|')) {
        const [, type, group] = code.split('|');
        const matchingProcs = mergedData.filter(p => getProcedureType(p.code) === type && (p.category || 'General') === group);
        matchingProcs.forEach(proc => {
          const index = newData.findIndex(item => item.code === proc.code);
          if (index >= 0) {
            newData[index] = { ...newData[index], ...patch };
          } else {
            newData.push({ ...proc, ...patch });
          }
        });
      } else {
        const index = newData.findIndex(item => item.code === code);
        if (index >= 0) {
          newData[index] = { ...newData[index], ...patch };
        } else {
          // Downgrade codes may not exist in the fee guide, so fall back to a
          // bare row keyed by the code rather than dropping the override.
          const item = mergedData.find(i => i.code === code);
          newData.push(item ? { ...item, ...patch } : { code, ...patch });
        }
      }
      return newData;
    });
  }, [mergedData, setCoverageData]);

  // Downgrade codes may not be part of the fee guide, so fall back to the saved
  // override row (and finally a bare `{ code }`) instead of bailing out.
  const findProcForTeeth = useCallback((code) => {
    if (!code) return null;
    return (
      mergedData.find((p) => p.code === code) ||
      (coverageData || []).find((item) => item.code === code) ||
      { code }
    );
  }, [mergedData, coverageData]);

  const handleToothToggle = useCallback((tooth) => {
    if (!activeToothSelection) return;
    
    if (activeToothSelection.startsWith('TYPE|') || activeToothSelection.startsWith('GROUP|')) {
      const toothStr = String(tooth).trim();
      let currentTeeth = [...bulkTeethSelection];
      if (currentTeeth.includes(toothStr)) {
        currentTeeth = currentTeeth.filter(t => t !== toothStr);
      } else {
        currentTeeth.push(toothStr);
      }
      currentTeeth.sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      });
      setBulkTeethSelection(currentTeeth);
      
      const updatedLimit = currentTeeth.join(', ');
      handleFieldChange(activeToothSelection, 'teethLimit', updatedLimit);
      handleFieldChange(activeToothSelection, 'teeth', currentTeeth);
      return;
    }

    const proc = findProcForTeeth(activeToothSelection);
    if (!proc) return;
    
    let currentTeeth = [];
    if (Array.isArray(proc.teeth)) {
      currentTeeth = proc.teeth.map(t => String(t).trim()).filter(Boolean);
    } else if (proc.teethLimit) {
      currentTeeth = String(proc.teethLimit).split(',').map(t => t.trim()).filter(Boolean);
    }

    const toothStr = String(tooth).trim();
    if (currentTeeth.includes(toothStr)) {
      currentTeeth = currentTeeth.filter(t => t !== toothStr);
    } else {
      currentTeeth.push(toothStr);
    }

    currentTeeth.sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

    const updatedLimit = currentTeeth.join(', ');
    handleFieldChange(activeToothSelection, 'teethLimit', updatedLimit);
    handleFieldChange(activeToothSelection, 'teeth', currentTeeth);
  }, [activeToothSelection, mergedData, handleFieldChange, bulkTeethSelection, findProcForTeeth]);

  const isToothSelected = useCallback((tooth) => {
    if (!activeToothSelection) return false;
    
    if (activeToothSelection.startsWith('TYPE|') || activeToothSelection.startsWith('GROUP|')) {
      return bulkTeethSelection.includes(String(tooth).trim());
    }

    const proc = findProcForTeeth(activeToothSelection);
    if (!proc) return false;
    let list = [];
    if (Array.isArray(proc.teeth)) {
      list = proc.teeth.map(t => String(t).trim());
    } else if (proc.teethLimit) {
      list = String(proc.teethLimit).split(',').map(t => t.trim()).filter(Boolean);
    }
    return list.includes(String(tooth).trim());
  }, [activeToothSelection, mergedData, bulkTeethSelection, findProcForTeeth]);

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
