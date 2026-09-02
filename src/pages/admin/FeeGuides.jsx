import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';

// Sub-components
import FeeGuidesActionBar from '../../components/admin/feeguides/FeeGuidesActionBar';
import FeeGuidesTable from '../../components/admin/feeguides/FeeGuidesTable';
import PlansDialog from '../../components/admin/feeguides/PlansDialog';
import ClearManualFeeGuideDialog from '../../components/admin/feeguides/ClearManualFeeGuideDialog';
import ClearLockedFeeDialog from '../../components/admin/feeguides/ClearLockedFeeDialog';
import CopyFeeGuideDialog from '../../components/admin/feeguides/CopyFeeGuideDialog';
import EmptyFeeGuideDialog from '../../components/admin/feeguides/EmptyFeeGuideDialog';
import ReestimateDialog from '../../components/admin/feeguides/ReestimateDialog';
import EditFeeGuideDialog from '../../components/admin/feeguides/EditFeeGuideDialog';
import AuditHistoryDialog from '../../components/admin/feeguides/AuditHistoryDialog';
import SyncOfficesDialog from '../../components/admin/clinical-management/products/SyncOfficesDialog';

// Redux
import {
  fetchFeeGuides,
  deleteFeeGuide,
  selectFeeGuides,
  selectDefaultFeeGuideId,
  selectFeeGuidesLoading
} from '../../store/slices/feeGuideSlice';

const FeeGuides = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Dialog States
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [lockedFeesDialogOpen, setLockedFeesDialogOpen] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [emptyDialogOpen, setEmptyDialogOpen] = useState(false);
  const [reestimateDialogOpen, setReestimateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);

  // Selected Data States
  const [selectedFeeGuide, setSelectedFeeGuide] = useState('');
  const [selectedFeeGuideObj, setSelectedFeeGuideObj] = useState(null);

  // Selectors
  const feeGuidesRaw = useSelector(selectFeeGuides);
  const loading = useSelector(selectFeeGuidesLoading);
  const overrideDefaultId = useSelector(selectDefaultFeeGuideId);

  useEffect(() => {
    dispatch(fetchFeeGuides());
  }, [dispatch]);

  const feeGuidesData = (feeGuidesRaw || [])
    .filter(fs => fs && !fs.isHidden && fs.IsHidden !== 1 && fs.IsHidden !== true)
    .map((fs, index) => {
      const fsId = fs?._id?.toString() || fs?.id?.toString() || fs?.FeeSchedNum?.toString() || `fallback-${index}`;
      return {
        id: fsId,
        name: fs?.description || fs?.Description || 'Unnamed',
        default: overrideDefaultId ? (overrideDefaultId === fsId ? 'Yes' : 'No') : (index === 0 ? 'Yes' : 'No'),
        defaultProvider: '',
        plans: 0 // Mocked for now
      };
    });

  const handleOpenPlans = (name) => {
    setSelectedFeeGuide((name || '').toUpperCase());
    setPlansDialogOpen(true);
  };

  const handleExportCSV = (e) => {
    if (e) e.stopPropagation();
    const csvContent = [
      ['Name', 'Default', 'Default Provider'],
      ...feeGuidesData.map(row => [row.name, row.default, row.defaultProvider])
    ].map(e => `"${e.join('","')}"`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'fee_guides.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSync = () => {
    dispatch(fetchFeeGuides());
  };

  const handleDelete = (id) => {
    dispatch(deleteFeeGuide(id));
  };

  const handleEdit = (rowObj) => {
    setSelectedFeeGuideObj(rowObj);
    setEditDialogOpen(true);
  };

  if (loading && feeGuidesRaw.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
            Fee Guides
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setSyncDialogOpen(true)}
          startIcon={<SyncIcon sx={{ fontSize: '18px' }} />}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            height: 38,
            px: "20px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
          }}
        >
          Sync
        </Button>
      </Box>

      {/* Action Bar Component */}
      <FeeGuidesActionBar
        onReestimate={() => setReestimateDialogOpen(true)}
        onClearLockedFees={() => setLockedFeesDialogOpen(true)}
        onResetTreatmentPlans={() => setResetDialogOpen(true)}
        onCopyFeeGuide={() => setCopyDialogOpen(true)}
        onEmptyFeeGuide={() => setEmptyDialogOpen(true)}
      />

      {/* Main Table Component */}
      <FeeGuidesTable
        feeGuidesData={feeGuidesData}
        onRowClick={(id) => navigate(`/admin/finance-management/fee-guide/${id}`)}
        onExportCSV={handleExportCSV}
        onSync={handleSync}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onOpenPlans={handleOpenPlans}
        onAuditHistory={() => setAuditDialogOpen(true)}
      />

      {/* Dialogs */}
      <PlansDialog
        open={plansDialogOpen}
        onClose={() => setPlansDialogOpen(false)}
        selectedFeeGuide={selectedFeeGuide}
      />
      <ClearManualFeeGuideDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
      />
      <ClearLockedFeeDialog
        open={lockedFeesDialogOpen}
        onClose={() => setLockedFeesDialogOpen(false)}
      />
      <CopyFeeGuideDialog
        open={copyDialogOpen}
        onClose={() => setCopyDialogOpen(false)}
        feeGuidesData={feeGuidesData}
      />
      <EmptyFeeGuideDialog
        open={emptyDialogOpen}
        onClose={() => setEmptyDialogOpen(false)}
      />
      <ReestimateDialog
        open={reestimateDialogOpen}
        onClose={() => setReestimateDialogOpen(false)}
      />
      <EditFeeGuideDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        feeGuideObj={selectedFeeGuideObj}
      />
      <AuditHistoryDialog
        open={auditDialogOpen}
        onClose={() => setAuditDialogOpen(false)}
      />
      <SyncOfficesDialog
        open={syncDialogOpen}
        onClose={() => setSyncDialogOpen(false)}
      />
    </Box>
  );
};

export default FeeGuides;
