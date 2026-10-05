import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Divider,
  MenuItem,
  Menu,
  Button,
  Tooltip,
  GlobalStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import { COLORS } from '../../constants/colors';
import dayjs from 'dayjs';
import {
  ShieldOutlined as ShieldIcon,
  TabletMacOutlined as KioskIcon,
  SmsOutlined as SmsIcon,
  PrintOutlined as PrintIcon,
  ArchiveOutlined as ArchiveIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  ContentCopy as ContentCopyIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { OutlinedSelect } from '../../components/patients/form-components/formInputs';
import plusSvg from '../../assets/timeclock/add.svg';
import deleteSvg from '../../assets/practicesetupicon/deleteicon.svg';
import addClaimSvg from '../../assets/finance icons/addclaim.svg';
import shareSvg from '../../assets/finance icons/share.svg';
import printSvg from '../../assets/clinicalicons/print icon.svg';
import archiveSvg from '../../assets/clinicalicons/saveexamicon.svg';
import medflowLogo from '../../assets/medflow-logo.png';

import PreAuthModal from '../../components/clinical/new-treatment-plan/PreAuthModal';
import PreAuthCreationSummaryModal from '../../components/clinical/new-treatment-plan/PreAuthCreationSummaryModal';
import NewTreatmentPlanHeader from '../../components/clinical/new-treatment-plan/NewTreatmentPlanHeader';
import NewTreatmentPlanOdontogram from '../../components/clinical/new-treatment-plan/NewTreatmentPlanOdontogram';
import NewTreatmentPlanProcedures from '../../components/clinical/new-treatment-plan/NewTreatmentPlanProcedures';
import NewTreatmentPlanTable from '../../components/clinical/new-treatment-plan/NewTreatmentPlanTable';
import EditProcedureDrawer from '../../components/clinical/new-treatment-plan/EditProcedureDrawer';
import EditFeesDrawer from '../../components/clinical/new-treatment-plan/EditFeesDrawer';
import TreatmentPlanEstimatePrintDialog from '../../components/clinical/new-treatment-plan/TreatmentPlanEstimatePrintDialog';
import TreatmentPlanRouteSlipDialog from '../../components/clinical/new-treatment-plan/TreatmentPlanRouteSlipDialog';
import AppointmentHistoryTimelineDialog from '../../components/clinical/new-treatment-plan/AppointmentHistoryTimelineDialog';
import AddNewPatientAppointmentForm from '../../components/appointments/AddNewPatientAppointmentForm';
import ChartTable from '../../components/clinical/new-treatment-plan/ChartTable';
import UnplannedProceduresSidebar from '../../components/clinical/new-treatment-plan/UnplannedProceduresSidebar';
import ArchiveDrawer from '../../components/clinical/new-treatment-plan/ArchiveDrawer';
import NotesDrawer from '../../components/clinical/new-treatment-plan/NotesDrawer';
import PeriodontalExamPage from './PeriodontalExamPage';
import { useSelector, useDispatch } from 'react-redux';
import { useDropdownData } from '../../hooks/redux/useDropdownData';
// AFTER
import { selectCurrentPatient, selectPatientInsurancesCache, fetchPatientInsurances, fetchPatientById, invalidatePatientBalance } from '../../store/slices/patientSlice';
import { selectProviderDropdownList } from '../../store/slices/providerSlice';
import { setSelectedAppointmentId, fetchAppointmentById, selectCurrentAppointment } from '../../store/slices/appointmentSlice';
import { treatmentPlanService } from '../../services/treatment-plan.service';
import { appointmentService } from '../../services/appointment.service';
import { invoiceService } from '../../services/invoice.service';
import { invalidateLedger, invalidatePaymentInvoices, fetchLedgerItems } from '../../store/slices/billingSlice';
import { authorizationService } from '../../services/authorization.service';
import { calculatePortionsForCategory } from '../../utils/cdtCategoryHelper';
import { mapProcedureToPayloadItem, statusLabelToCode } from '../../utils/treatmentPlanPayload';
import { getProcedureIcd, findAppointmentProcedureIndex } from '../../utils/icd10';

const formatMoney = (val, fallback = '-') => {
  if (typeof val === 'number') return `$${val.toFixed(2)}`;
  if (typeof val === 'string' && val.trim() && val !== '-') {
    const num = Number(val.replace(/[^0-9.-]+/g, ''));
    return !isNaN(num) ? `$${num.toFixed(2)}` : val;
  }
  return fallback;
};

const parseMoneyValue = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string' && value.trim() && value !== '-') {
    const parsed = Number(value.replace(/[^0-9.-]+/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const calculateTreatmentPlanTotals = (items = []) => {
  return items.reduce(
    (totals, item) => {
      totals.negotiated += parseMoneyValue(item.negRate ?? item.charge ?? item.fee);
      totals.insurance += parseMoneyValue(item.insEst ?? item.insPortion ?? item.insuranceAmount);
      totals.patient += parseMoneyValue(item.ptEst ?? item.ptPortion ?? item.patientAmount);
      return totals;
    },
    { negotiated: 0, insurance: 0, patient: 0 }
  );
};

const buildTreatmentPlanTotalsPayload = (items = []) => {
  const totals = calculateTreatmentPlanTotals(items);
  return {
    totalAmount: totals.negotiated,
    insurancePortion: totals.insurance,
    patientPortion: totals.patient,
  };
};

const TREATMENT_PLAN_STATUS_ACTIVE = 'A';
const TREATMENT_PLAN_STATUS_HOLD = '!';

const mergePlanItemsIntoDrafts = (drafts, planId, items, extraFields = {}) => {
  if (!planId) return drafts;
  return drafts.map((plan) => (
    getPlanId(plan) === String(planId)
      ? { ...plan, ...extraFields, items }
      : plan
  ));
};

const STATUS_CODE_TO_LABEL = {
  P: 'Planned',
  S: 'Scheduled',
  U: 'Unplanned',
  R: 'Referred',
  C: 'Completed',
  EC: 'Existing Current',
  EO: 'Existing Other',
};

const normalizeStatusLabel = (status) => STATUS_CODE_TO_LABEL[status] || status || 'Planned';

const mapPlanItems = (items, createdAt) => {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item, idx) => {
    const feeVal = item.charge ?? item.fee ?? item.negRate;
    const insVal = item.insPortion ?? item.insuranceAmount ?? item.insEst;
    const ptVal = item.ptPortion ?? item.patientAmount ?? item.ptEst;

    return {
      id: item.id || idx + 1,
      providerId: item.providerId || null,
      clinicId: item.clinicId || null,
      priority: item.priority || '- -',
      status: normalizeStatusLabel(item.status),
      created: item.created || (createdAt ? dayjs(createdAt).format('MM/DD/YYYY') : dayjs().format('MM/DD/YYYY')),
      scheduled: item.scheduled || '-',
      site: item.site || (item.tooth ? `#${item.tooth}` : '-'),
      tooth: item.tooth || '',
      code: item.procedureCode || item.code || '-',
      description: item.description || '-',
      icd: item.icd || '-',
      provider: (() => {
        const val = item.provider;
        return typeof val === 'object' && val !== null ? (val.providerCode || val._id || val.name || '-') : (val || '-');
      })(),
      negRate: formatMoney(feeVal, '-'),
      insEst: formatMoney(insVal, '-'),
      ptEst: formatMoney(ptVal, '-'),
      ucrFee: item.ucrFee ?? null,
      negotiatedRate: item.negotiatedRate ?? feeVal,
      insuranceEstimate: insVal,
      patientEstimate: ptVal,
      deductible: item.deductible ?? 0,
      noBillInsurance: Boolean(item.noBillInsurance),
      preAuthStatus: item.preAuthStatus || '',
      preAuthNumber: item.preAuthNumber || '',
      downgradedCode: item.downgradedCode || '',
      estimateSource: item.estimateSource || 'Auto',
      preAuth: item.preAuth || '-',
      preAuthId: item.preAuthId || null,
      labCase: item.labCase || '-'
    };
  });
};

const normalizeAppointmentProcedures = (appointment) => {
  const customFields = appointment?.customFields || {};
  const workspace = appointment?.workspace || {};
  const candidates = [
    customFields.procedures,
    workspace.procedures,
    appointment?.procedures,
    appointment?.procedureCodes,
  ];
  const rawProcedures = candidates.find((value) => Array.isArray(value) && value.length > 0) || [];

  return rawProcedures
    .map((procedure, idx) => {
      if (typeof procedure === 'string') {
        const code = procedure.trim();
        return code ? { id: idx, code, description: code } : null;
      }

      if (!procedure || typeof procedure !== 'object') return null;

      const code =
        procedure.code ||
        procedure.procedureCode ||
        procedure.ProcCode ||
        procedure.procCode ||
        procedure.cdtCode ||
        procedure.id;
      if (!code) return null;

      return {
        ...procedure,
        id: procedure.id ?? procedure._id ?? idx,
        code,
        description:
          procedure.treatment ||
          procedure.description ||
          procedure.name ||
          procedure.Descript ||
          procedure.label ||
          code,
      };
    })
    .filter(Boolean);
};

const mapAppointmentsToTreatmentRows = (appointments = []) => {
  const rows = [];
  appointments.forEach((appt) => {
    const procs = normalizeAppointmentProcedures(appt);
    procs.forEach((p, idx) => {
      if (p && p.code) {
        const isCompleted = p.completed || appt.status === 'completed' || appt.status === 'checked_out_complete';
        const appointmentDate = appt.appointmentDate || appt.date;
        rows.push({
          id: `appt-${appt.id || appt._id}-${p.id || idx}`,
          appointmentId: appt.id || appt._id,
          appointmentDate,
          startTime: appt.startTime || appt.time,
          priority: '- -',
          status: isCompleted ? 'Completed' : 'Scheduled',
          created: dayjs(appt.createdAt || appointmentDate).format('MM/DD/YYYY'),
          scheduled: appointmentDate ? dayjs(appointmentDate).format('MM/DD/YYYY') : '-',
          site: p.site || p.tooth || '-',
          tooth: p.tooth || p.site || '',
          code: p.code,
          description: p.description || '-',
          icd: getProcedureIcd(p) || '-',
          provider: (() => {
            const getProvStr = (val) => (typeof val === 'object' && val !== null ? (val.providerCode || val._id || val.name) : val);
            return getProvStr(p.provider) || getProvStr(appt.providerId) || getProvStr(appt.provider) || '-';
          })(),
          ...(() => {
            const rawCharge = Number(String(p.charge || p.fee || 0).replace(/[^0-9.-]+/g, ''));
            const hasActualValues = p.insPortion != null && (p.estimateSource === 'Manual' || (p.insPortion !== '$0.00' && p.insPortion !== '0'));
            const insPortion = hasActualValues
              ? Number(String(p.insPortion).replace(/[^0-9.-]+/g, ''))
              : calculatePortionsForCategory({ charge: rawCharge, code: p.code }).insPortion;
            const ptPortion = hasActualValues
              ? Number(String(p.ptPart || p.ptPortion || 0).replace(/[^0-9.-]+/g, ''))
              : calculatePortionsForCategory({ charge: rawCharge, code: p.code }).ptPortion;
            return {
              negRate: formatMoney(rawCharge, '-'),
              insEst: formatMoney(insPortion, '-'),
              ptEst: formatMoney(ptPortion, '-'),
              ucrFee: p.ucrFee ?? null,
              negotiatedRate: rawCharge,
              insuranceEstimate: insPortion,
              patientEstimate: ptPortion,
              deductible: p.deductible ?? 0,
              noBillInsurance: Boolean(p.noBillInsurance),
              preAuthStatus: p.preAuthStatus || '',
              preAuthNumber: p.preAuthNumber || '',
              downgradedCode: p.downgradedCode || '',
              estimateSource: p.estimateSource || 'Auto',
            };
          })(),
          preAuth: '-',
          labCase: '-'
        });
      }
    });
  });
  return rows;
};

const getPlanId = (plan) => String(plan?._id || plan?.id || '');

const getPlanTitle = (plan) => {
  const title = plan?.title || plan?.name || plan?.Heading;
  return title && String(title).trim() ? String(title).trim() : 'Active Treatment Plan';
};

const INITIAL_MOCK_TREATMENT_PLANS = [
  { id: 1, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#1 OD', code: 'D2392', description: 'resin-based composite - two surfaces, p...', icd: '-', provider: 'CB', negRate: '$206.00', insEst: '$164.80', ptEst: '$41.20', preAuth: '-', labCase: '+' },
  { id: 2, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#J MO', code: 'D2392', description: 'resin-based composite - two surfaces, p...', icd: '-', provider: 'CB', negRate: '$206.00', insEst: '$164.80', ptEst: '$41.20', preAuth: '-', labCase: '+' },
  { id: 3, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#14', code: 'D1351', description: 'sealant - per tooth', icd: '-', provider: 'CB', negRate: '$51.00', insEst: '-', ptEst: '$51.00', preAuth: '-', labCase: '+' },
  { id: 4, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#19', code: 'D1351', description: 'sealant - per tooth', icd: '-', provider: 'CB', negRate: '$51.00', insEst: '-', ptEst: '$51.00', preAuth: '-', labCase: '+' },
];

const NewTreatmentPlanPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const appointmentId = searchParams.get('appointmentId');
    const patientId = searchParams.get('patientId');
    
    if (appointmentId) {
      dispatch(setSelectedAppointmentId(appointmentId));
      dispatch(fetchAppointmentById(appointmentId));
    }
    
    if (patientId) {
      dispatch(fetchPatientById(patientId));
    }
  }, [searchParams, dispatch]);

  const [showOdontogram, setShowOdontogram] = useState(true);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState([]);
  const [treatmentPlanDrafts, setTreatmentPlanDrafts] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [appointmentProcedures, setAppointmentProcedures] = useState([]);
  const allProcedures = [...treatmentPlans, ...appointmentProcedures].sort((a, b) => {
    const dateA = dayjs(a.scheduled !== '-' ? a.scheduled : a.created, ['MM/DD/YYYY']);
    const dateB = dayjs(b.scheduled !== '-' ? b.scheduled : b.created, ['MM/DD/YYYY']);
    return dateB.valueOf() - dateA.valueOf();
  });
  const [isPreAuthModalOpen, setIsPreAuthModalOpen] = useState(false);
  const [createdPreAuthId, setCreatedPreAuthId] = useState(null);
  const [createdPreAuthPatientId, setCreatedPreAuthPatientId] = useState(null);

  // Multi-provider summary dialog state
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryProviderGroups, setSummaryProviderGroups] = useState([]);
  // Procedures + preAuthId for the group currently viewed in PreAuthModal
  const [activeGroupProcedures, setActiveGroupProcedures] = useState([]);
  const [activeGroupPreAuthId, setActiveGroupPreAuthId] = useState(null);
  const [activeGroupPlanId, setActiveGroupPlanId] = useState(null);
  const [isSubmittingGroups, setIsSubmittingGroups] = useState(false);

  const currentPatient = useSelector(selectCurrentPatient);
  const currentAppointment = useSelector(selectCurrentAppointment);
  const currentPatientId = currentPatient?._id || currentPatient?.id;
  const insurancesCache = useSelector(selectPatientInsurancesCache);
  const providersList = useSelector(selectProviderDropdownList) || [];
  const { providers: appointmentProviders, rooms: appointmentRooms, appointmentTypes } = useDropdownData({
    providers: true,
    rooms: true,
    appointmentTypes: true,
  });


  const [activePlanId, setActivePlanId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isArchiveDrawerOpen, setIsArchiveDrawerOpen] = useState(false);
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState(null);
  const [editingFeesProcedure, setEditingFeesProcedure] = useState(null);
  const [isEstimatePrintOpen, setIsEstimatePrintOpen] = useState(false);
  const [isRouteSlipOpen, setIsRouteSlipOpen] = useState(false);
  const [isAppointmentHistoryOpen, setIsAppointmentHistoryOpen] = useState(false);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isCreateDraftOpen, setIsCreateDraftOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftNameError, setDraftNameError] = useState('');
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1); // 0: Charts, 1: Treatment Plan, 2: Perio Charts
  const [showPerioChart, setShowPerioChart] = useState(false);

  const [shareMenuAnchorEl, setShareMenuAnchorEl] = useState(null);
  const handleShareMenuClose = () => setShareMenuAnchorEl(null);

  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState(null);
  const handleAddMenuClick = (event) => setAddMenuAnchorEl(event.currentTarget);
  const handleAddMenuClose = () => setAddMenuAnchorEl(null);

  const activeDraft = treatmentPlanDrafts.find((plan) => getPlanId(plan) === String(activePlanId));
  const activeDraftTitle = activeDraft ? getPlanTitle(activeDraft) : 'Active Treatment Plan';
  const treatmentPlanTotals = useMemo(() => calculateTreatmentPlanTotals(allProcedures), [allProcedures]);
  const activeAppointmentId = currentAppointment?._id || currentAppointment?.id || searchParams.get('appointmentId');
  const activeAppointmentForHistory = currentAppointment || (activeAppointmentId ? { _id: activeAppointmentId } : null);
  const activeScheduledProcedure = allProcedures.find((procedure) => procedure.appointmentId || procedure._appointmentId);
  const activeScheduleDate =
    currentAppointment?.appointmentDate ||
    currentAppointment?.date ||
    activeScheduledProcedure?.appointmentDate ||
    activeScheduledProcedure?.scheduled;
  const activeScheduleTime =
    currentAppointment?.startTime ||
    currentAppointment?.time ||
    activeScheduledProcedure?.startTime ||
    activeScheduledProcedure?.time;

  const getLinkedAppointmentId = () => (
    activeAppointmentId || activeScheduledProcedure?.appointmentId || activeScheduledProcedure?._appointmentId
  );

  const buildScheduleUrl = (appointment = null) => {
    const appointmentId = getLinkedAppointmentId();
    if (!appointmentId) return null;

    const scheduleDate =
      appointment?.appointmentDate ||
      appointment?.date ||
      activeScheduleDate;
    const scheduleTime =
      appointment?.startTime ||
      appointment?.time ||
      activeScheduleTime;
    const params = new URLSearchParams();
    const parsedDate = dayjs(scheduleDate, ['YYYY-MM-DD', 'MM/DD/YYYY', 'M/D/YYYY'], true);
    if (parsedDate.isValid()) {
      params.set('date', parsedDate.format('YYYY-MM-DD'));
    }
    if (scheduleTime) {
      params.set('time', scheduleTime);
    }
    params.set('highlightAppointmentId', appointmentId);
    return `/appointments/operatory-schedule?${params.toString()}`;
  };

  const handleViewOnSchedule = async () => {
    const appointmentId = getLinkedAppointmentId();
    if (!appointmentId) {
      setToast({ open: true, message: 'No appointment found.', type: 'error' });
      return;
    }

    try {
      const appointment = await appointmentService.getAppointmentById(appointmentId);
      const url = buildScheduleUrl(appointment);
      if (!url) {
        setToast({ open: true, message: 'No appointment found.', type: 'error' });
        return;
      }
      navigate(url);
    } catch (error) {
      console.error('Failed to load appointment for schedule view:', error);
      setToast({ open: true, message: 'No appointment found.', type: 'error' });
    }
  };

  const handleEditAppointmentFromPlan = async () => {
    const appointmentId = getLinkedAppointmentId();
    if (!appointmentId) {
      setToast({ open: true, message: 'No appointment found.', type: 'error' });
      return;
    }

    try {
      const fullAppointment = await appointmentService.getAppointmentById(appointmentId);
      const procedures = await appointmentService.getAppointmentProcedures(appointmentId).catch(() => []);
      setEditingAppointment({
        ...fullAppointment,
        rawAppointment: fullAppointment,
        procedures,
      });
      setIsEditAppointmentOpen(true);
    } catch (error) {
      console.error('Failed to load appointment for edit:', error);
      setToast({ open: true, message: 'Appointment was not found.', type: 'error' });
    }
  };

  const handleEditAppointmentSubmit = async (formData) => {
    const appointmentId = editingAppointment?._id || editingAppointment?.id;
    if (!appointmentId) return;

    const start = formData.appointmentDate && formData.startTime
      ? dayjs(`${formData.appointmentDate}T${formData.startTime}`)
      : dayjs(editingAppointment.appointmentDate || editingAppointment.date || new Date());
    const duration = formData.durationMinutes || 30;
    const end = start.clone().add(duration, 'minute');

    const payload = {
      patientId: formData.patientId,
      providerId: formData.providerId,
      appointmentDate: start.format('YYYY-MM-DD'),
      startTime: start.format('HH:mm'),
      endTime: end.format('HH:mm'),
      durationMinutes: duration,
      chiefComplaint: formData.chiefComplaint || '',
      notes: formData.notes || '',
      status: formData.status || 'scheduled',
      ...(formData.appointmentTypeId && { appointmentTypeId: formData.appointmentTypeId }),
      ...(formData.roomId && { roomId: formData.roomId }),
      ...(formData.customFields && { customFields: formData.customFields }),
      patientName: formData.patientName,
    };

    try {
      const updatedAppointment = await appointmentService.updateAppointment(appointmentId, payload);
      await dispatch(fetchAppointmentById(appointmentId));
      const updatedRows = mapAppointmentsToTreatmentRows([updatedAppointment]);
      setAppointmentProcedures((prev) => [
        ...prev.filter((row) => String(row.appointmentId || row._appointmentId) !== String(appointmentId)),
        ...updatedRows,
      ]);
      setIsEditAppointmentOpen(false);
      setEditingAppointment(null);
      setToast({ open: true, message: 'Appointment updated successfully.', type: 'success' });
    } catch (error) {
      console.error('Failed to update appointment:', error);
      const message = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || 'Failed to update appointment.';
      setToast({ open: true, message, type: 'error' });
    }
  };

  const handleOpenAppointmentHistory = () => {
    if (!activeAppointmentId) {
      setToast({ open: true, message: 'No appointment is selected for history.', type: 'error' });
      return;
    }
    setIsAppointmentHistoryOpen(true);
  };

  const openCreateDraftDialog = () => {
    handleAddMenuClose();
    setDraftName(`Plan ${dayjs().format('M.D.YYYY HH:mm:ss')}`);
    setDraftNameError('');
    setIsCreateDraftOpen(true);
  };

  const closeCreateDraftDialog = () => {
    if (isCreatingDraft) return;
    setIsCreateDraftOpen(false);
    setDraftNameError('');
  };

  useEffect(() => {
    const fetchTreatmentPlans = async () => {
      if (!currentPatient) {
        setTreatmentPlanDrafts([]);
        setTreatmentPlans([]);
        setAppointmentProcedures([]);
        setActivePlanId(null);
        return;
      }
      try {
        setIsLoading(true);
        const patientId = currentPatient._id || currentPatient.id;
        const [tpRes, apptRes] = await Promise.all([
          // Ask for a large page: the API defaults to 10, and a newly created
          // plan can otherwise fall outside the first page and never be read.
          treatmentPlanService.getAll({ patientId, limit: 100 }),
          appointmentService.getPatientAppointments(patientId, 100).catch(() => ({ data: [] }))
        ]);
        // getAll already unwraps response.data.data -> { treatmentPlans, pagination }
        const plans = tpRes?.data?.treatmentPlans || tpRes?.treatmentPlans || [];
        setTreatmentPlanDrafts(plans);

        if (plans.length > 0) {
          const activePlan = plans.reduce((latest, plan) => {
            const planNum = Number(plan._id);
            const latestNum = Number(latest._id);
            if (!Number.isFinite(planNum)) return latest;
            if (!Number.isFinite(latestNum)) return plan;
            return planNum > latestNum ? plan : latest;
          }, plans[0]);

          const activeId = getPlanId(activePlan);
          setActivePlanId(activeId);
          setTreatmentPlans(
            mapPlanItems(activePlan.items, activePlan.createdAt).map((item) => ({
              ...item,
              _planId: activeId,
            }))
          );
        } else {
          setActivePlanId(null);
          setTreatmentPlans([]);
        }

        const appointments = Array.isArray(apptRes) ? apptRes : (Array.isArray(apptRes?.data) ? apptRes.data : (apptRes?.data?.appointments || []));
        const apptProcs = mapAppointmentsToTreatmentRows(appointments);
        setAppointmentProcedures(apptProcs);

        // Enrich with real insurance estimates from backend (same as appointment form)
        if (apptProcs.length > 0 && patientId) {
          try {
            const itemsForEstimate = apptProcs.map(proc => ({
              code: proc.code,
              charge: Number(String(proc.negRate || '0').replace(/[^0-9.-]+/g, '')) || 0,
            }));
            const estimates = await invoiceService.estimateInvoiceItems(patientId, itemsForEstimate);
            if (Array.isArray(estimates) && estimates.length) {
              const enriched = apptProcs.map((proc, idx) => {
                const est = estimates[idx] || {};
                const writeoffVal = est.writeoff !== undefined ? Number(est.writeoff) : (est.estimatedWriteOff !== undefined ? Number(est.estimatedWriteOff) : 0);
                const insVal = est.insPortion !== undefined ? Number(est.insPortion) : 0;
                const ptVal = est.ptPortion !== undefined ? Number(est.ptPortion) : 0;
                return {
                  ...proc,
                  insEst: `$${(insVal || 0).toFixed(2)}`,
                  ptEst: `$${(ptVal || 0).toFixed(2)}`,
                  writeoff: `$${(writeoffVal || 0).toFixed(2)}`,
                };
              });
              setAppointmentProcedures(enriched);
            }
          } catch (err) {
            console.warn('Failed to enrich appointment procedure estimates:', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch treatment plans or appointments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreatmentPlans();
  }, [currentPatient]);

  const handleToothClick = (num) => {
    if (selectedTeeth.includes(num)) {
      setSelectedTeeth(selectedTeeth.filter(n => n !== num));
    } else {
      setSelectedTeeth([...selectedTeeth, num]);
    }
  };

  const handleSidebarSurfaceClick = (lbl) => {
    if (selectedSurfaces.includes(lbl)) {
      setSelectedSurfaces(selectedSurfaces.filter(s => s !== lbl));
    } else {
      setSelectedSurfaces([...selectedSurfaces, lbl]);
    }
  };
  /**
   * Resolves a procedure's provider (id, code or object) to a display name.
   */
  const getProviderName = (value) => {
    if (!value) return '';
    if (typeof value === 'object') {
      return value.name || value.preferredName || value.providerCode || value._id || '';
    }
    const match = providersList.find(
      (p) => String(p._id) === String(value) || String(p.providerCode) === String(value)
    );
    if (match) {
      const name = [match.firstName, match.lastName].filter(Boolean).join(' ').trim();
      return name || match.preferredName || match.providerCode || match._id;
    }
    return value;
  };

  /**
   * Groups an array of procedure objects by their provider value.
   * Returns an array of group objects shaped for PreAuthCreationSummaryModal.
   */
  const groupProceduresByProvider = (procedures) => {
    const map = {};
    procedures.forEach((proc) => {
      const providerKey = getProviderName(
        proc.provider || proc.providerId || proc.prov
      ) || 'Unknown';
      if (!map[providerKey]) {
        map[providerKey] = {
          provider: providerKey,
          codes: [],
          procedures: [],
          preAuthId: null,
          status: 'Draft',
          date: new Date(),
        };
      }
      const code = proc.code || proc.procedureCode || proc.ProcCode;
      if (code && code !== '-') map[providerKey].codes.push(code);
      map[providerKey].procedures.push(proc);
    });
    return Object.values(map);
  };

  const handleOpenPreAuth = async (procedureRow = null) => {
    if (!currentPatientId) return;

    if (!procedureRow && selectedRows.length === 0) {
      setToast({ open: true, message: 'Select a procedure first', type: 'error' });
      return;
    }

    let insurances = insurancesCache?.[currentPatientId]?.data;

    if (!insurances) {
      try {
        const result = await dispatch(fetchPatientInsurances({ patientId: currentPatientId })).unwrap();
        insurances = result.insurances;
      } catch (err) {
        setToast({ open: true, message: 'Failed to verify insurance coverage.', type: 'error' });
        return;
      }
    }

    if (!insurances || insurances.length === 0) {
      setToast({ open: true, message: 'This patient has no insurance on file. Add an insurance plan before creating a Pre-Auth.', type: 'error' });
      return;
    }

    if (createdPreAuthPatientId !== currentPatientId) {
      setCreatedPreAuthId(null);
      setCreatedPreAuthPatientId(null);
    }

    // Build the list of selected procedures
    const proceduresForAuth = procedureRow
      ? [procedureRow]
      : allProcedures.filter((p) => selectedRows.includes(p.id || p._id));

    const groups = groupProceduresByProvider(proceduresForAuth);

    if (!procedureRow && groups.length > 1) {
      // Multiple providers — show the summary dialog first
      setSummaryProviderGroups(groups);
      setIsSummaryModalOpen(true);
    } else {
      // Single provider — go straight to PreAuthModal
      setActiveGroupProcedures(proceduresForAuth);
      setActiveGroupPlanId(proceduresForAuth[0]?._planId || activePlanId);
      setActiveGroupPreAuthId(
        createdPreAuthPatientId === currentPatientId ? createdPreAuthId : null
      );
      setIsPreAuthModalOpen(true);
    }
  };

  /** Called when user clicks "View Pre-Auth" on a summary row */
  const handleViewPreAuthGroup = (group) => {
    setActiveGroupProcedures(group.procedures);
    setActiveGroupPlanId(group.procedures?.[0]?._planId || activePlanId);
    setActiveGroupPreAuthId(group.preAuthId || null);
    setIsPreAuthModalOpen(true);
  };

  const applyPreAuthToProcedures = async (assignments) => {
    const assignmentByProcedureId = new Map(
      assignments
        .filter((assignment) => assignment?.procedure?.id && assignment.preAuthId)
        .map((assignment) => [
          String(assignment.procedure.id),
          {
            preAuth: assignment.status || 'Requested',
            preAuthId: String(assignment.preAuthId),
          },
        ])
    );

    if (assignmentByProcedureId.size === 0) return;

    const updateRow = (item) => {
      const assignment = assignmentByProcedureId.get(String(item.id));
      return assignment ? { ...item, ...assignment } : item;
    };

    const nextTreatmentPlans = treatmentPlans.map(updateRow);
    const nextAppointmentProcedures = appointmentProcedures.map(updateRow);

    setTreatmentPlans(nextTreatmentPlans);
    setAppointmentProcedures(nextAppointmentProcedures);

    const affectedPlanIds = new Set(
      assignments
        .map((assignment) => assignment.procedure?._planId)
        .filter(Boolean)
        .map(String)
    );

    if (affectedPlanIds.size === 0) return;

    await Promise.all(Array.from(affectedPlanIds).map(async (planId) => {
      const planItems = nextTreatmentPlans.filter((item) => String(item._planId || activePlanId) === String(planId));
      if (planItems.length === 0) return;

      const payloadItems = planItems.map(mapProcedureToPayloadItem);
      const totalsPayload = buildTreatmentPlanTotalsPayload(payloadItems);
      await treatmentPlanService.update(planId, {
        items: payloadItems,
        ...totalsPayload,
      });
      setTreatmentPlanDrafts((prev) => mergePlanItemsIntoDrafts(prev, planId, payloadItems, totalsPayload));
    }));
  };

  /**
   * Submits one pre-auth per provider group, since providers are billed separately.
   * Each group only carries its own procedures.
   */
  const handleSubmitProviderGroups = async () => {
    if (summaryProviderGroups.length === 0) return;

    setIsSubmittingGroups(true);
    try {
      const patientInsurances = insurancesCache?.[currentPatientId]?.data || [];
      const primaryIns = patientInsurances.find((ins) => ins.insuranceType === 'primary') || patientInsurances[0];
      const insuranceCompanyId = primaryIns
        ? (primaryIns.insuranceCompanyId?._id || primaryIns.insuranceCompany?._id || primaryIns.insuranceCompanyId || primaryIns.insuranceCompany || null)
        : (currentPatient?.primaryInsurance?.insuranceCompany?._id || currentPatient?.primaryInsurance?.insuranceCompany?.id || null);

      const serviceDate = new Date();
      const preAuthAssignments = [];

      for (const group of summaryProviderGroups) {
        const payload = {
          patientId: currentPatientId,
          order: 'Primary',
          status: 'requested',
          insuranceCompanyId,
          billingProvider: group.provider,
          treatmentProvider: group.provider,
        };

        // Resolve the plan ID that owns this group's procedures.
        // Each procedure carries _planId (set during flatMap on load); fall back
        // to activePlanId only if unavailable.
        const groupPlanId = group.procedures?.[0]?._planId || activePlanId;

        let created;
        if (groupPlanId) {
          created = await treatmentPlanService.generatePreAuth(groupPlanId, {
            ...payload,
            serviceDate,
            items: group.procedures,
          });
        } else {
          created = await authorizationService.requestAuthorization({
            ...payload,
            requestedDate: serviceDate,
            procedures: group.procedures,
          });
        }

        group.preAuthId = created?._id || created?.id || created?.ClaimNum || null;
        if (group.preAuthId) {
          group.procedures.forEach((procedure) => {
            preAuthAssignments.push({ procedure, preAuthId: group.preAuthId, status: 'Requested' });
          });
        }
      }

      await applyPreAuthToProcedures(preAuthAssignments);

      const createdCount = summaryProviderGroups.filter((g) => g.preAuthId).length;
      setSummaryProviderGroups((prev) =>
        prev.map((g) => ({ ...g, status: g.preAuthId ? 'requested' : g.status }))
      );
      setIsSummaryModalOpen(false);
      setToast({
        open: true,
        message: `${createdCount} Pre-Auth${createdCount === 1 ? '' : 's'} submitted successfully (one per provider).`,
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to submit pre-auths per provider:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to submit pre-auths.');
      setToast({ open: true, message: errMsg, type: 'error' });
    } finally {
      setIsSubmittingGroups(false);
    }
  };

  const refreshPatientBilling = () => {
    const patientId = currentPatient?._id || currentPatient?.id;
    if (!patientId) return;
    dispatch(invalidateLedger(patientId));
    dispatch(invalidatePaymentInvoices(patientId));
    dispatch(invalidatePatientBalance(patientId));
    dispatch(fetchLedgerItems(patientId));
  };

  const billingSaveMessage = (result, fallback) => {
    const plan = result?.treatmentPlan || result;
    const created = result?.createdInvoice || plan?.createdInvoice;
    const existing = plan?.existingInvoices || [];
    if (created || existing.length) refreshPatientBilling();
    if (created) return `${fallback} Invoice ${created.invoiceNumber} created.`;
    if (existing.length) return `${fallback} Linked invoice ${existing.map((invoice) => invoice.invoiceNumber).join(', ')} available in Billing.`;
    return fallback;
  };

  const handleAddProcedure = async (procedure) => {
    if (isSaving) return;
    if (!currentPatient) {
      setToast({ open: true, message: 'Please select a patient first.', type: 'error' });
      return;
    }

    if (!procedure.provider) {
      setToast({ open: true, message: 'Please select a provider first.', type: 'error' });
      return;
    }

    const newId = `new-${crypto.randomUUID()}`;
    const surfaceStr = selectedSurfaces.length > 0 ? ' ' + selectedSurfaces.join(' ') : '';
    const formattedSite = selectedTeeth.length > 0 ? selectedTeeth.map(t => `#${t}${surfaceStr}`).join(', ') : (selectedSurfaces.join(' ') || '-');
    const procedureCode = procedure.code || procedure.procedureCode || `D${Math.floor(1000 + Math.random() * 9000)}`;
    const procedureDescription = procedure.description || procedure.name || procedureCode;

    const rawFee = Number(procedure.fee || procedure.charge || procedure.ProcFee || 0);
    const { insPortion: estIns, ptPortion: estPt } = calculatePortionsForCategory({ charge: rawFee, code: procedureCode });

    const newProcedure = {
      id: newId,
      _planId: activePlanId,
      priority: '- -',
      status: procedure.status || 'Planned',
      created: dayjs().format('MM/DD/YYYY'),
      scheduled: '-',
      site: formattedSite,
      tooth: selectedTeeth.length > 0 ? selectedTeeth.join(', ') : '',
      code: procedureCode,
      description: procedureDescription,
      icd: '-',
      provider: procedure.provider || null,
      negRate: rawFee > 0 ? `$${rawFee.toFixed(2)}` : '$0.00',
      insEst: rawFee > 0 ? `$${estIns.toFixed(2)}` : '$0.00',
      ptEst: rawFee > 0 ? `$${estPt.toFixed(2)}` : '$0.00',
      preAuth: '-',
      labCase: '-'
    };

    const newTreatmentPlans = [newProcedure, ...treatmentPlans];

    // Optimistic UI Update
    setTreatmentPlans(newTreatmentPlans);
    setSelectedTeeth([]); // Clear selection after adding
    setSelectedSurfaces([]); // Clear surface selection too

    // Auto-save logic
    try {
      setIsSaving(true);

      const payload = {
        patientId: currentPatient._id || currentPatient.id,
        title: `Treatment Plan - ${dayjs().format('MM/DD/YYYY')}`,
        status: TREATMENT_PLAN_STATUS_ACTIVE,
        items: newTreatmentPlans.map(mapProcedureToPayloadItem)
      };
      Object.assign(payload, buildTreatmentPlanTotalsPayload(payload.items));

      if (activePlanId) {
        // Update existing plan
        const res = await treatmentPlanService.update(activePlanId, {
          items: payload.items,
          ...buildTreatmentPlanTotalsPayload(payload.items),
        });
        const updatedPlan = res?.data?.treatmentPlan || res?.treatmentPlan || res?.data;
        setTreatmentPlanDrafts((prev) => mergePlanItemsIntoDrafts(prev, activePlanId, updatedPlan?.items || payload.items, updatedPlan || buildTreatmentPlanTotalsPayload(payload.items)));
        if (updatedPlan?.items && Array.isArray(updatedPlan.items)) {
          const updatedItems = mapPlanItems(updatedPlan.items, updatedPlan.createdAt).map((item) => ({
            ...item,
            _planId: activePlanId,
          }));
          setTreatmentPlans(updatedItems);
        }
        setToast({ open: true, message: billingSaveMessage(res, 'Treatment plan auto-saved!'), type: 'success' });
      } else {
        // Create initial plan
        const res = await treatmentPlanService.create(payload);
        const createdPlan = res?.data?.treatmentPlan || res?.treatmentPlan || res?.data;
        const createdId = createdPlan?._id || res?._id;
        if (createdId) {
          setActivePlanId(createdId);
        }
        if (createdPlan?.items && Array.isArray(createdPlan.items)) {
          const newItems = mapPlanItems(createdPlan.items, createdPlan.createdAt).map((item) => ({
            ...item,
            _planId: createdId,
          }));
          setTreatmentPlans(newItems);
        }
        setTreatmentPlanDrafts((prev) => [createdPlan, ...prev.filter((plan) => getPlanId(plan) !== String(createdId))]);
        setToast({ open: true, message: billingSaveMessage(res, 'Treatment plan created and saved!'), type: 'success' });
      }
    } catch (error) {
      console.error('Failed to auto-save treatment plan:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to auto-save plan.');
      setToast({ open: true, message: errMsg, type: 'error' });
      // Revert optimistic update
      setTreatmentPlans(treatmentPlans);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItems = async (itemIdsToDelete) => {
    if (!currentPatient) return;

    const tpItemsToDelete = itemIdsToDelete.filter(id => !String(id).startsWith('appt-'));
    const apptItemsToDelete = itemIdsToDelete.filter(id => String(id).startsWith('appt-'));

    if (tpItemsToDelete.length > 0) {
      const newTreatmentPlans = treatmentPlans.filter((item) => !tpItemsToDelete.includes(item.id));
      setTreatmentPlans(newTreatmentPlans);

      try {
        setIsSaving(true);

        // Group remaining items by their source plan and update each plan separately
       const planItemsMap = {};
        newTreatmentPlans
          .filter((item) => !String(item.id).startsWith('appt-'))
          .forEach((item) => {
            const planId = item._planId || activePlanId;
            if (!planId) return;
            if (!planItemsMap[planId]) planItemsMap[planId] = [];
            planItemsMap[planId].push(item);
          });

        const deletedItems = treatmentPlans.filter((item) => tpItemsToDelete.includes(item.id));
        deletedItems.forEach((item) => {
          const planId = item._planId || activePlanId;
          if (planId && !planItemsMap[planId]) planItemsMap[planId] = [];
        });

        await Promise.all(
          Object.entries(planItemsMap).map(([planId, items]) => {
            const payloadItems = items.map((item) => ({
              id: item.id,
              procedureCode: item.code,
              description: item.description,
              tooth: item.tooth || '',
              site: item.site,
              fee: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, '')) : 0,
              charge: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, '')) : 0,
              priority: item.priority,
              status: statusLabelToCode(item.status),
              icd: item.icd,
              provider: item.provider || null,
              preAuth: item.preAuth,
              preAuthId: item.preAuthId || null,
              labCase: item.labCase,
              insEst: item.insEst,
              ptEst: item.ptEst,
            }));
            return treatmentPlanService.update(planId, {
              items: payloadItems,
              ...buildTreatmentPlanTotalsPayload(payloadItems),
            });
          })
        );
        setTreatmentPlanDrafts((prev) => Object.entries(planItemsMap).reduce((drafts, [planId, items]) => {
          const payloadItems = items.map(mapProcedureToPayloadItem);
          return mergePlanItemsIntoDrafts(drafts, planId, payloadItems, buildTreatmentPlanTotalsPayload(payloadItems));
        }, prev));
        setToast({ open: true, message: 'Procedures removed and plan auto-saved!', type: 'success' });
      } catch (error) {
        console.error('Failed to auto-save treatment plan after deletion:', error);
        const errData = error.response?.data?.error;
        const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to auto-save plan.');
        setToast({ open: true, message: errMsg, type: 'error' });
        setTreatmentPlans(treatmentPlans);
      } finally {
        setIsSaving(false);
      }
    }

    if (apptItemsToDelete.length > 0) {
      const newApptProcedures = appointmentProcedures.filter(item => !apptItemsToDelete.includes(item.id));
      setAppointmentProcedures(newApptProcedures);

      try {
        setIsSaving(true);
        const apptGroups = {};
        apptItemsToDelete.forEach(id => {
          const parts = String(id).split('-');
          const apptId = parts[1];
          const procIdOrIdx = parts[2];
          if (!apptGroups[apptId]) apptGroups[apptId] = [];
          apptGroups[apptId].push(procIdOrIdx);
        });

        for (const apptId of Object.keys(apptGroups)) {
          const appt = await appointmentService.getAppointmentById(apptId);
          if (appt) {
            const procs = appt.customFields?.procedures || appt.procedures || [];
            const toRemove = apptGroups[apptId];
            const newProcs = procs.filter((p, idx) => {
              const pId = p.id || String(idx);
              return !toRemove.includes(String(pId));
            });
            
            if (newProcs.length === 0) {
              // Delete the appointment entirely if no procedures are left
              await appointmentService.deleteAppointment(apptId);
            } else {
              const updates = { procedures: newProcs };
              if (appt.customFields) {
                updates.customFields = { ...appt.customFields, procedures: newProcs };
              }
              await appointmentService.updateAppointment(apptId, updates);
            }
          }
        }
        setToast({ open: true, message: 'Appointment procedures removed!', type: 'success' });
      } catch (error) {
        console.error('Failed to update appointments:', error);
        setToast({ open: true, message: 'Failed to update appointments.', type: 'error' });
        setAppointmentProcedures(appointmentProcedures);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleMoveToTop = async (itemIdsToMove) => {
    if (!currentPatient || !activePlanId || itemIdsToMove.length === 0) return;

    const itemsToMove = treatmentPlans.filter(item => itemIdsToMove.includes(item.id));
    const remainingItems = treatmentPlans.filter(item => !itemIdsToMove.includes(item.id));
    const newTreatmentPlans = [...itemsToMove, ...remainingItems];

    // Optimistic UI update
    setTreatmentPlans(newTreatmentPlans);

    // Auto-save logic
    try {
      setIsSaving(true);

      const payloadItems = newTreatmentPlans.map(item => ({
        procedureCode: item.code,
        description: item.description,
        tooth: item.tooth || '',
        site: item.site,
        fee: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
        charge: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
        priority: item.priority,
        status: statusLabelToCode(item.status),
        icd: item.icd,
        provider: item.provider || null,
        preAuth: item.preAuth,
        preAuthId: item.preAuthId || null,
        labCase: item.labCase,
        insEst: item.insEst,
        ptEst: item.ptEst,
      }));

      await treatmentPlanService.update(activePlanId, {
        items: payloadItems,
        ...buildTreatmentPlanTotalsPayload(payloadItems),
      });
      setTreatmentPlanDrafts((prev) => mergePlanItemsIntoDrafts(prev, activePlanId, payloadItems, buildTreatmentPlanTotalsPayload(payloadItems)));
      setToast({ open: true, message: 'Procedures moved to top and plan auto-saved!', type: 'success' });
    } catch (error) {
      console.error('Failed to auto-save treatment plan after reordering:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to auto-save plan.');
      setToast({ open: true, message: errMsg, type: 'error' });
      // Revert optimistic update
      setTreatmentPlans(treatmentPlans);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkUpdateItemStatus = async (selectedIds, newStatus) => {
    if (isSaving) return;
    if (!currentPatient || !selectedIds?.length) return;
    const ids = new Set(selectedIds.map(String));
    const selectedItems = allProcedures.filter((item) => ids.has(String(item.id || item._id)));
    const selectedAppointmentItems = selectedItems.filter((item) => String(item.id).startsWith('appt-'));
    const selectedPlanItems = selectedItems.filter((item) => !String(item.id).startsWith('appt-'));
    const newTreatmentPlans = treatmentPlans.map((item) =>
      ids.has(String(item.id)) ? { ...item, status: newStatus } : item
    );
    setTreatmentPlans(newTreatmentPlans);
    setAppointmentProcedures((previous) => previous.map((item) =>
      ids.has(String(item.id)) ? { ...item, status: newStatus } : item
    ));
    try {
      setIsSaving(true);
      const invoiceNumbers = [];
      const linkedInvoiceNumbers = [];

      if (selectedPlanItems.length) {
        if (!activePlanId) throw new Error('No active treatment plan is selected.');
        const payloadItems = newTreatmentPlans.map(mapProcedureToPayloadItem);
        const totals = buildTreatmentPlanTotalsPayload(payloadItems);
        const result = await treatmentPlanService.update(activePlanId, { items: payloadItems, ...totals });
        const savedItems = result?.treatmentPlan?.items
          ? mapPlanItems(result.treatmentPlan.items, result.treatmentPlan.createdAt)
          : newTreatmentPlans;
        setTreatmentPlans(savedItems);
        setTreatmentPlanDrafts((prev) => mergePlanItemsIntoDrafts(prev, activePlanId, result?.treatmentPlan?.items || payloadItems, totals));
        const invoiceNumber = result?.createdInvoice?.invoiceNumber || result?.treatmentPlan?.createdInvoice?.invoiceNumber;
        if (invoiceNumber) invoiceNumbers.push(invoiceNumber);
        (result?.treatmentPlan?.existingInvoices || []).forEach((invoice) => linkedInvoiceNumbers.push(invoice.invoiceNumber));
      }

      // Appointment-backed rows are saved together per appointment, so one
      // backend request creates one invoice for the selected procedures.
      const appointmentGroups = new Map();
      selectedAppointmentItems.forEach((item) => {
        const appointmentId = String(item.appointmentId || item._appointmentId || '').trim();
        if (!appointmentId) return;
        if (!appointmentGroups.has(appointmentId)) appointmentGroups.set(appointmentId, []);
        appointmentGroups.get(appointmentId).push(item);
      });
      for (const [appointmentId, group] of appointmentGroups) {
        const appointment = await appointmentService.getAppointmentById(appointmentId);
        const procedures = [...(appointment?.customFields?.procedures || appointment?.procedures || [])];
        group.forEach((row) => {
          const procId = String(row.id).split('-').slice(2).join('-');
          const index = procedures.findIndex((procedure, idx) => String(procedure?.id ?? idx) === procId);
          if (index >= 0) {
            procedures[index] = { ...procedures[index], completed: newStatus === 'Completed', status: newStatus };
          }
        });
        const updatedAppointment = await appointmentService.updateAppointment(appointmentId, {
          customFields: { ...appointment.customFields, procedures },
          procedures,
        });
        if (updatedAppointment?.createdInvoice?.invoiceNumber) {
          invoiceNumbers.push(updatedAppointment.createdInvoice.invoiceNumber);
        }
        setAppointmentProcedures((previous) => [
          ...previous.filter((row) => String(row.appointmentId || row._appointmentId) !== appointmentId),
          ...mapAppointmentsToTreatmentRows([updatedAppointment]),
        ]);
      }

      setSelectedRows([]);
      if (invoiceNumbers.length || linkedInvoiceNumbers.length) refreshPatientBilling();
      const billingMessage = invoiceNumbers.length
        ? `Invoice ${invoiceNumbers.join(', ')} created.`
        : linkedInvoiceNumbers.length
          ? `Linked invoice ${[...new Set(linkedInvoiceNumbers)].join(', ')} available in Billing.`
          : '';
      setToast({ open: true, message: billingMessage
        ? `Status updated. ${billingMessage}`
        : newStatus === 'Completed'
          ? 'Status saved, but no invoice was returned. Reload the plan and check Billing.'
          : 'Status updated successfully!', type: newStatus === 'Completed' && !billingMessage ? 'warning' : 'success' });
    } catch (error) {
      console.error('Failed to update item status:', error);
      const errData = error.response?.data?.error;
      setToast({ open: true, message: typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to update status.'), type: 'error' });
      setTreatmentPlans(treatmentPlans);
      setAppointmentProcedures(appointmentProcedures);
      // A mixed selection can save one group before another fails. Reconcile
      // persisted records instead of leaving successful saves visually undone.
      const appointmentIds = [...new Set(selectedAppointmentItems.map((item) => item.appointmentId || item._appointmentId).filter(Boolean))];
      const refreshed = await Promise.allSettled([
        ...(selectedPlanItems.length && activePlanId
          ? [treatmentPlanService.getById(activePlanId).then((result) => ({ plan: result.treatmentPlan }))]
          : []),
        ...appointmentIds.map((id) => appointmentService.getAppointmentById(id).then((appointment) => ({ appointment, id }))),
      ]);
      refreshed.forEach((result) => {
        if (result.status !== 'fulfilled') return;
        const { plan, appointment, id } = result.value;
        if (plan) {
          setTreatmentPlans(mapPlanItems(plan.items, plan.createdAt));
          setTreatmentPlanDrafts((prev) => mergePlanItemsIntoDrafts(prev, activePlanId, plan.items, plan));
        }
        if (appointment) setAppointmentProcedures((prev) => [
          ...prev.filter((row) => String(row.appointmentId || row._appointmentId) !== String(id)),
          ...mapAppointmentsToTreatmentRows([appointment]),
        ]);
      });
      refreshPatientBilling();
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateItemStatus = async (itemId, newStatus) => {
    if (isSaving) return;
    if (!currentPatient) return;

    if (String(itemId).startsWith('appt-')) {
      const parts = String(itemId).split('-');
      const apptId = parts[1];
      const procIdx = parts[2];

      const newApptProcs = appointmentProcedures.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      );
      setAppointmentProcedures(newApptProcs);

      try {
        setIsSaving(true);
        const appt = await appointmentService.getAppointmentById(apptId);
        if (appt) {
          const procs = appt.customFields?.procedures || appt.procedures || [];
          let targetIdx = -1;
          if (procs.some(p => String(p.id) === procIdx)) {
            targetIdx = procs.findIndex(p => String(p.id) === procIdx);
          } else {
            targetIdx = parseInt(procIdx, 10);
          }

          if (targetIdx >= 0 && targetIdx < procs.length) {
            procs[targetIdx].completed = (newStatus === 'Completed');
            const updatedAppointment = await appointmentService.updateAppointment(apptId, {
              customFields: { ...appt.customFields, procedures: procs },
              procedures: procs 
            });
            if (updatedAppointment?.createdInvoice) refreshPatientBilling();
            setToast({
              open: true,
              message: updatedAppointment?.createdInvoice?.invoiceNumber
                ? `Procedure completed and invoice ${updatedAppointment.createdInvoice.invoiceNumber} created successfully.`
                : 'Status updated successfully!',
              type: 'success',
            });
          }
        }
      } catch (error) {
        console.error('Failed to update appointment procedure:', error);
        setToast({ open: true, message: 'Failed to update status.', type: 'error' });
        setAppointmentProcedures(appointmentProcedures);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    await handleBulkUpdateItemStatus([itemId], newStatus);
  };

  const handleSelectTreatmentPlan = (event) => {
    const nextPlanId = event.target.value;
    const nextPlan = treatmentPlanDrafts.find((plan) => getPlanId(plan) === String(nextPlanId));
    setActivePlanId(nextPlanId || null);
    const nextId = getPlanId(nextPlan);
    setTreatmentPlans(
      nextPlan
        ? mapPlanItems(nextPlan.items, nextPlan.createdAt).map((i) => ({ ...i, _planId: nextId }))
        : []
    );    setSelectedRows([]);
  };

  const handleSaveAsHold = async () => {
    if (!currentPatient) {
      setToast({ open: true, message: 'Please select a patient first.', type: 'error' });
      return;
    }

    if (!activePlanId && treatmentPlans.length === 0) {
      setToast({ open: true, message: 'Add procedures before saving a hold draft.', type: 'error' });
      return;
    }

    const payloadItems = treatmentPlans.map(mapProcedureToPayloadItem);
    const totalsPayload = buildTreatmentPlanTotalsPayload(payloadItems);

    try {
      setIsSaving(true);

      if (activePlanId) {
        const updatedPlan = await treatmentPlanService.update(activePlanId, {
          status: TREATMENT_PLAN_STATUS_HOLD,
          items: payloadItems,
          ...totalsPayload,
        });
        const nextPlan = updatedPlan?.data?.treatmentPlan || updatedPlan?.treatmentPlan || updatedPlan?.data || updatedPlan;
        setTreatmentPlanDrafts((prev) => mergePlanItemsIntoDrafts(
          prev,
          activePlanId,
          payloadItems,
          {
            ...totalsPayload,
            ...(nextPlan && typeof nextPlan === 'object' ? nextPlan : {}),
            status: TREATMENT_PLAN_STATUS_HOLD,
          }
        ));
      } else {
        const createdPlan = await treatmentPlanService.create({
          patientId: currentPatient._id || currentPatient.id,
          title: `Hold - ${dayjs().format('MM/DD/YYYY h:mm A')}`,
          status: TREATMENT_PLAN_STATUS_HOLD,
          items: payloadItems,
          ...totalsPayload,
        });
        const nextPlan = createdPlan?.data?.treatmentPlan || createdPlan?.treatmentPlan || createdPlan?.data || createdPlan;
        const nextPlanId = getPlanId(nextPlan);
        if (!nextPlanId) {
          throw new Error('Hold draft was saved but the response did not include an id.');
        }
        setTreatmentPlanDrafts((prev) => [nextPlan, ...prev.filter((plan) => getPlanId(plan) !== String(nextPlanId))]);
        setActivePlanId(nextPlanId);
        setTreatmentPlans(mapPlanItems(nextPlan.items, nextPlan.createdAt).map((item) => ({ ...item, _planId: nextPlanId })));
      }

      setSelectedRows([]);
      setToast({ open: true, message: 'Treatment plan saved as hold.', type: 'success' });
    } catch (error) {
      console.error('Failed to save treatment plan as hold:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to save as hold.');
      setToast({ open: true, message: errMsg, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!activePlanId) {
      setTreatmentPlans([]);
      setSelectedRows([]);
      setToast({ open: true, message: 'No draft selected to delete.', type: 'info' });
      return;
    }

    const previousDrafts = treatmentPlanDrafts;
    const previousTreatmentPlans = treatmentPlans;

    setTreatmentPlanDrafts((prev) => prev.filter((plan) => getPlanId(plan) !== String(activePlanId)));
    setActivePlanId(null);
    setTreatmentPlans([]);
    setSelectedRows([]);

    try {
      setIsSaving(true);
      await treatmentPlanService.delete(activePlanId);
      setToast({ open: true, message: 'Draft deleted.', type: 'success' });
    } catch (error) {
      console.error('Failed to delete treatment plan draft:', error);
      setTreatmentPlanDrafts(previousDrafts);
      setActivePlanId(activePlanId);
      setTreatmentPlans(previousTreatmentPlans);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to delete draft.');
      setToast({ open: true, message: errMsg, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateDraft = async () => {
    const name = draftName.trim();
    if (!name) {
      setDraftNameError('Treatment plan name is required.');
      return;
    }

    if (!currentPatient) {
      setToast({ open: true, message: 'Please select a patient first.', type: 'error' });
      return;
    }

    try {
      setIsCreatingDraft(true);
      if (activePlanId) {
        const currentItems = treatmentPlans.map(mapProcedureToPayloadItem);
        await treatmentPlanService.update(activePlanId, {
          items: currentItems,
          ...buildTreatmentPlanTotalsPayload(currentItems),
        });
        setTreatmentPlanDrafts((prev) => mergePlanItemsIntoDrafts(prev, activePlanId, currentItems, buildTreatmentPlanTotalsPayload(currentItems)));
      }

      const res = await treatmentPlanService.create({
        patientId: currentPatient._id || currentPatient.id,
        title: name,
        status: TREATMENT_PLAN_STATUS_ACTIVE,
        ...buildTreatmentPlanTotalsPayload([]),
        items: []
      });
      const createdPlan = res?.data?.treatmentPlan || res?.treatmentPlan || res?.data || res;
      const createdId = getPlanId(createdPlan);

      if (!createdId) {
        throw new Error('Draft was created but the response did not include an id.');
      }

      setTreatmentPlanDrafts((prev) => [createdPlan, ...prev.filter((plan) => getPlanId(plan) !== String(createdId))]);
      setActivePlanId(createdId);
      setTreatmentPlans(mapPlanItems(createdPlan.items, createdPlan.createdAt).map((i) => ({ ...i, _planId: createdId }))); 
      setSelectedRows([]);
      setIsCreateDraftOpen(false);
      setToast({ open: true, message: 'Draft created successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to create treatment plan draft:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to create draft.');
      setToast({ open: true, message: errMsg, type: 'error' });
    } finally {
      setIsCreatingDraft(false);
    }
  };

  const handleSaveEditedFees = async (fees) => {
    const selected = editingFeesProcedure;
    if (!selected) return;
    try {
      setIsSaving(true);
      if (String(selected.id).startsWith('appt-')) {
        const appointmentId = selected.appointmentId;
        const appointment = await appointmentService.getAppointmentById(appointmentId);
        const procedures = normalizeAppointmentProcedures(appointment);
        const targetId = String(selected.id).slice(`appt-${appointmentId}-`.length);
        const index = procedures.findIndex((procedure, position) => String(procedure.id ?? position) === targetId);
        if (index < 0) throw new Error('Appointment procedure was not found.');
        const updated = [...procedures];
        updated[index] = {
          ...updated[index],
          ...fees,
          charge: fees.negotiatedRate,
          fee: fees.negotiatedRate,
          insPortion: fees.insuranceEstimate,
          ptPortion: fees.patientEstimate,
          ptPart: fees.patientEstimate,
          estimateSource: 'Manual',
        };
        const saved = await appointmentService.updateAppointment(appointmentId, {
          customFields: { ...(appointment.customFields || {}), procedures: updated },
          procedures: updated,
        });
        const refreshed = await appointmentService.getAppointmentById(appointmentId).catch(() => saved);
        const rows = mapAppointmentsToTreatmentRows([refreshed]);
        setAppointmentProcedures((previous) => previous.map((row) => rows.find((next) => next.id === row.id) || row));
      } else {
        const planId = selected._planId || activePlanId;
        if (!planId) throw new Error('Treatment plan was not found.');
        const result = await treatmentPlanService.updateItemFees(planId, selected.id, fees);
        const rows = mapPlanItems(result.items).map((row) => ({ ...row, _planId: planId }));
        setTreatmentPlans(rows);
        setTreatmentPlanDrafts((previous) => mergePlanItemsIntoDrafts(previous, planId, result.items, {
          totalAmount: result.totalAmount,
          insurancePortion: result.insurancePortion,
          patientPortion: result.patientPortion,
        }));
      }
      setEditingFeesProcedure(null);
      setToast({ open: true, message: 'Procedure fees updated successfully!', type: 'success' });
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update procedure fees.';
      setToast({ open: true, message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevertFees = async () => {
    const selected = editingFeesProcedure;
    if (!selected || String(selected.id).startsWith('appt-')) return;
    try {
      setIsSaving(true);
      const planId = selected._planId || activePlanId;
      const result = await treatmentPlanService.reestimateItemFees(planId, selected.id);
      const rows = mapPlanItems(result.items).map((row) => ({ ...row, _planId: planId }));
      setTreatmentPlans(rows);
      setTreatmentPlanDrafts((previous) => mergePlanItemsIntoDrafts(previous, planId, result.items, {
        totalAmount: result.totalAmount,
        insurancePortion: result.insurancePortion,
        patientPortion: result.patientPortion,
      }));
      setEditingFeesProcedure(null);
      setToast({ open: true, message: 'Automatic estimates restored.', type: 'success' });
    } catch (error) {
      setToast({ open: true, message: error.response?.data?.message || error.message || 'Could not recalculate estimates.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEditedProcedure = async (updatedProcedure) => {
    if (!currentPatient || !updatedProcedure?.id) return;

    if (String(updatedProcedure.id).startsWith('appt-')) {
      const parts = String(updatedProcedure.id).split('-');
      const apptId = parts[1];
      const procIdOrIdx = parts[2];
      const previousAppointmentProcedures = appointmentProcedures;
      const newAppointmentProcedures = appointmentProcedures.map((item) =>
        item.id === updatedProcedure.id ? updatedProcedure : item
      );
      setAppointmentProcedures(newAppointmentProcedures);
      setEditingProcedure(null);

      try {
        setIsSaving(true);
        const appt = await appointmentService.getAppointmentById(apptId);
        const procs = appt?.customFields?.procedures || appt?.procedures || [];
        const targetIdx = findAppointmentProcedureIndex(procs, procIdOrIdx);

        if (targetIdx >= 0 && targetIdx < procs.length) {
          const updatedProcs = [...procs];
          updatedProcs[targetIdx] = {
            ...updatedProcs[targetIdx],
            code: updatedProcedure.code,
            procedureCode: updatedProcedure.code,
            treatment: updatedProcedure.description,
            description: updatedProcedure.description,
            provider: updatedProcedure.provider,
            status: updatedProcedure.status,
            completed: updatedProcedure.status === 'Completed',
            icd: updatedProcedure.icd,
            prognosis: updatedProcedure.prognosis,
            creditToPractice: updatedProcedure.creditToPractice,
            siteSelection: updatedProcedure.siteSelection
          };
          const saved = await appointmentService.updateAppointment(apptId, {
            customFields: { ...appt.customFields, procedures: updatedProcs },
            procedures: updatedProcs
          });
          const refreshed = await appointmentService.getAppointmentById(apptId).catch(() => saved);
          const refreshedRows = mapAppointmentsToTreatmentRows([refreshed]);
          setAppointmentProcedures(previous => previous.map(row => refreshedRows.find(next => next.id === row.id) || row));
          setToast({ open: true, message: 'Procedure updated successfully!', type: 'success' });
        } else {
          throw new Error('The selected appointment procedure could not be found.');
        }
      } catch (error) {
        console.error('Failed to update appointment procedure:', error);
        setAppointmentProcedures(previousAppointmentProcedures);
        setToast({ open: true, message: 'Failed to update procedure.', type: 'error' });
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (!activePlanId) return;

    const previousTreatmentPlans = treatmentPlans;
    const newTreatmentPlans = treatmentPlans.map((item) =>
      item.id === updatedProcedure.id ? updatedProcedure : item
    );
    setTreatmentPlans(newTreatmentPlans);
    setEditingProcedure(null);

    try {
      setIsSaving(true);
      const payloadItems = newTreatmentPlans.map(mapProcedureToPayloadItem);
      const result = await treatmentPlanService.update(activePlanId, {
        items: payloadItems,
        ...buildTreatmentPlanTotalsPayload(payloadItems),
      });
      const savedPlan = result.treatmentPlan;
      setTreatmentPlans(mapPlanItems(savedPlan.items, savedPlan.createdAt));
      setTreatmentPlanDrafts((prev) => mergePlanItemsIntoDrafts(prev, activePlanId, savedPlan.items, savedPlan));
      setToast({ open: true, message: billingSaveMessage(result, 'Procedure updated successfully!'), type: 'success' });
    } catch (error) {
      console.error('Failed to update treatment plan procedure:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to update procedure.');
      setTreatmentPlans(previousTreatmentPlans);
      setToast({ open: true, message: errMsg, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareSelection = (destination) => {
    handleShareMenuClose();
    setToast({
      open: true,
      message: `${destination} delivery is not available yet.`,
      type: 'info',
    });
  };

  return (
    <Box sx={{ p: 1, bgcolor: '#f4f6f8', minHeight: '100vh', width: '100%', '@media print': { minHeight: 'auto', p: 0 } }}>
      <GlobalStyles styles={{
        '@media print': {
          '.print-hide': { display: 'none !important' },
          '.print-only': { display: 'block !important' },
          'body, html': { backgroundColor: '#fff !important', margin: 0, padding: 0 },
          '.MuiBox-root, .MuiPaper-root': { backgroundColor: 'transparent !important', boxShadow: 'none !important', border: 'none !important' },
          '@page': { margin: '10mm' },
          '.MuiTableContainer-root': { overflow: 'visible !important' },
          'table': { width: '100% !important', zoom: '0.65' },
          '.MuiTableCell-root': {
            padding: '2px 4px !important',
            fontSize: '9px !important',
            lineHeight: '1.1 !important',
            whiteSpace: 'normal !important',
            minWidth: '0 !important',
            wordBreak: 'break-word'
          },
          '.MuiTableCell-head': {
            fontSize: '9px !important',
            fontWeight: 'bold !important'
          },
          '.MuiSelect-select': {
            fontSize: '9px !important'
          },
          '.MuiCheckbox-root': { padding: '0 !important', transform: 'scale(0.7)' }
        }
      }} />

      {/* Medflow Logo for Print */}
      <Box className="print-only" sx={{ display: 'none', width: '100%', textAlign: 'center', mb: 2, mt: 1 }}>
        <Box component="img" src={medflowLogo} alt="Medflow Logo" sx={{ height: 60 }} />
      </Box>

      {/* Page Header Toolbar */}
      <Box className="print-hide">
        <NewTreatmentPlanHeader
          showOdontogram={showOdontogram}
          setShowOdontogram={setShowOdontogram}
          onNotesClick={() => setIsNotesDrawerOpen(true)}
        />
      </Box>

      {/* Top Section (Odontogram + Navigation) */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'stretch', width: '100%' }}>

        {/* Left Pane - Odontogram */}
        {showOdontogram && (
          <Box className={activeTab === 2 ? 'print-hide' : ''} sx={{ flex: 7.5, minWidth: 0 }}>
            <NewTreatmentPlanOdontogram
              selectedTeeth={selectedTeeth}
              onToothClick={handleToothClick}
              selectedSurfaces={selectedSurfaces}
              onSidebarSurfaceClick={handleSidebarSurfaceClick}
            />
          </Box>
        )}

        {/* Right Pane - Navigation & Procedures */}
        <Box className="print-hide" sx={{ flex: showOdontogram ? 4.5 : 12, minWidth: 0 }}>
          <NewTreatmentPlanProcedures
            onProcedureClick={handleAddProcedure}
          />
        </Box>

      </Box>

      {/* Bottom Section (Tabs & Data Table) */}
      <Box sx={{ width: '100%', mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Box className="print-hide" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} aria-label="treatment plan tabs">
            <Tab label="Chart" sx={{ textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem' }} />
            <Tab label="Treatment Plan" sx={{ textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem' }} />
            <Tab label="Perio Charts" sx={{ textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem' }} />
          </Tabs>
        </Box>
        {activeTab === 0 && (
          <Box sx={{ p: 0 }}>
            <ChartTable
              treatmentPlans={allProcedures}
              onUpdateItemStatus={handleUpdateItemStatus}
              onEditItem={setEditingProcedure}
              onDeleteItems={handleDeleteItems}
            />
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ p: 2, overflowX: 'auto' }}>
            <Paper elevation={0} sx={{ borderRadius: '8px', border: '1px solid #e2e8f0', p: 3, minWidth: 900 }}>
              {/* Top Toolbar matching screenshot */}
              <Box className="print-hide" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ width: 260 }}>
                  <OutlinedSelect
                    value={activePlanId || ''}
                    onChange={handleSelectTreatmentPlan}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 400, color: '#0f172a', fontSize: '0.875rem', minWidth: 0 }}>
                          <RadioButtonCheckedIcon sx={{ color: '#10b981', fontSize: '1rem', flexShrink: 0 }} />
                          <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selected ? activeDraftTitle : 'Active Treatment Plan'}
                          </Box>
                        </Box>
                      )
                    }}
                    sx={{
                      bgcolor: '#fff',
                      '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1.5, py: 0, px: 1.5, minHeight: '32px !important' },
                      '& .MuiOutlinedInput-root': { minHeight: '32px' },
                      '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' }
                    }}
                  >
                    {treatmentPlanDrafts.length === 0 && (
                      <MenuItem value="" sx={{ py: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 400, color: '#0f172a', fontSize: '0.875rem' }}>
                          <RadioButtonCheckedIcon sx={{ color: '#10b981', fontSize: '1rem' }} />
                          Active Treatment Plan
                        </Box>
                      </MenuItem>
                    )}
                    {treatmentPlanDrafts.map((plan) => (
                      <MenuItem key={getPlanId(plan)} value={getPlanId(plan)} sx={{ py: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 400, color: '#0f172a', fontSize: '0.875rem' }}>
                        <RadioButtonCheckedIcon sx={{ color: '#10b981', fontSize: '1rem' }} />
                          <Box component="span" sx={{ maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {getPlanTitle(plan)}
                          </Box>
                      </Box>
                    </MenuItem>
                    ))}
                  </OutlinedSelect>
                </Box>

                <IconButton size="small" onClick={handleAddMenuClick} sx={{ border: '1px solid #0f172a', borderRadius: '50%', width: 24, height: 24, p: 0, ml: 2 }}>
                  <Box component="img" src={plusSvg} alt="add" sx={{ width: 14, height: 14 }} />
                </IconButton>

                <Menu
                  anchorEl={addMenuAnchorEl}
                  open={Boolean(addMenuAnchorEl)}
                  onClose={handleAddMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      minWidth: '200px'
                    }
                  }}
                >
                  <MenuItem onClick={openCreateDraftDialog} sx={{ gap: 1.5, py: 1.25, fontSize: '0.875rem', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                    <AddCircleOutlineIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
                    New draft
                  </MenuItem>
                  <MenuItem onClick={handleAddMenuClose} sx={{ gap: 1.5, py: 1.25, fontSize: '0.875rem', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                    <ContentCopyIcon sx={{ fontSize: '1.15rem', color: '#334155' }} />
                    Duplicate draft
                  </MenuItem>
                </Menu>

                <Divider orientation="vertical" flexItem sx={{ mx: 3, my: 0.5, borderColor: '#cbd5e1' }} />

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <IconButton size="small" onClick={() => {
                    if (selectedRows.length > 0) {
                      handleDeleteItems(selectedRows);
                      setSelectedRows([]);
                    }
                  }}>
                    <Box component="img" src={deleteSvg} alt="delete" sx={{ width: 22, height: 22 }} />
                  </IconButton>
                  <Tooltip title="Pre-Auth">
                    <IconButton size="small" onClick={() => handleOpenPreAuth()}>
                      <Box component="img" src={addClaimSvg} alt="add claim" sx={{ width: 22, height: 22 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton
                      id="clinical-share-button"
                      size="small"
                      aria-label="Share treatment plan"
                      aria-haspopup="menu"
                      aria-controls={shareMenuAnchorEl ? 'clinical-share-menu' : undefined}
                      aria-expanded={shareMenuAnchorEl ? 'true' : undefined}
                      onClick={(event) => setShareMenuAnchorEl(event.currentTarget)}
                    >
                      <Box component="img" src={shareSvg} alt="share" sx={{ width: 22, height: 22 }} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="clinical-share-menu"
                    anchorEl={shareMenuAnchorEl}
                    open={Boolean(shareMenuAnchorEl)}
                    onClose={handleShareMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    MenuListProps={{ 'aria-labelledby': 'clinical-share-button' }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
                        '& .MuiMenuItem-root': {
                          gap: 1.5,
                          py: 1.25,
                          fontSize: '0.875rem',
                          color: '#0f172a',
                          fontFamily: 'Inter, sans-serif',
                        },
                      },
                    }}
                  >
                    <MenuItem onClick={() => handleShareSelection('Kiosk')}>
                      <KioskIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
                      Send to Kiosk
                    </MenuItem>
                    <MenuItem onClick={() => handleShareSelection('SMS')}>
                      <SmsIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
                      Send to SMS
                    </MenuItem>
                  </Menu>
                  <Tooltip title="Print">
                    <IconButton size="small" onClick={handlePrint}>
                      <Box component="img" src={printSvg} alt="print" sx={{ width: 22, height: 22 }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <IconButton size="small" onClick={() => setIsArchiveDrawerOpen(true)}>
                  <ArchiveIcon sx={{ fontSize: '1.35rem', color: '#94a3b8' }} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ width: '100%', flexGrow: 1, minWidth: 0 }}>
                  <NewTreatmentPlanTable
                      appointment={currentAppointment}
                      appointmentTypes={appointmentTypes}
                      onUpdateAppointment={async (updates) => {
                        if (!currentAppointment?._id && !currentAppointment?.id) return;
                        try {
                          await appointmentService.updateAppointment(currentAppointment._id || currentAppointment.id, updates);
                          dispatch(fetchAppointmentById(currentAppointment._id || currentAppointment.id));
                        } catch (err) {
                          console.error('Failed to update appointment', err);
                        }
                      }}
                      treatmentPlans={allProcedures}
                    totals={treatmentPlanTotals}
                    formatMoney={formatMoney}
                    onDeleteItems={handleDeleteItems}
                    onEditItem={setEditingProcedure}
                    onEditFees={setEditingFeesProcedure}
                    onMoveToTop={handleMoveToTop}
                    onPrintEstimate={() => setIsEstimatePrintOpen(true)}
                    onPrintRouteSlip={() => setIsRouteSlipOpen(true)}
                    onViewHistory={handleOpenAppointmentHistory}
                    onViewSchedule={handleViewOnSchedule}
                    onEditAppointment={handleEditAppointmentFromPlan}
                    onSendPreAuth={handleOpenPreAuth}
                    onUpdateItemStatus={handleUpdateItemStatus}
                    onBulkUpdateItemStatus={handleBulkUpdateItemStatus}
                    isSaving={isSaving}
                    onSaveAsHold={handleSaveAsHold}
                    onDeleteDraft={handleDeleteDraft}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                  />
                </Box>

                <Divider className="print-hide" orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0' }} />

                <Box className="print-hide" sx={{ width: '35%', minWidth: 0 }}>
                  <UnplannedProceduresSidebar procedures={allProcedures} />
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ p: 0, height: '800px', backgroundColor: '#f9fafb', borderRadius: 1, overflow: 'hidden', '@media print': { height: 'auto', overflow: 'visible' } }}>
            {showPerioChart ? (
              <PeriodontalExamPage
                embedded={true}
                selectedTeethFromParent={selectedTeeth}
                onToothClickFromParent={handleToothClick}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Button
                  variant="contained"
                  onClick={() => setShowPerioChart(true)}
                  sx={{
                    textTransform: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    backgroundColor: COLORS.ACCENT,
                    '&:hover': {
                      backgroundColor: COLORS.ACCENT_HOVER,
                      boxShadow: 'none'
                    }
                  }}
                >
                  Create Perio chart
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <ArchiveDrawer open={isArchiveDrawerOpen} onClose={() => setIsArchiveDrawerOpen(false)} />
      <TreatmentPlanEstimatePrintDialog
        open={isEstimatePrintOpen}
        onClose={() => setIsEstimatePrintOpen(false)}
        patient={currentPatient}
        appointment={{
          ...(currentAppointment || {}),
          appointmentDate: activeScheduleDate,
          startTime: activeScheduleTime,
          endTime: currentAppointment?.endTime || activeScheduledProcedure?.endTime,
          provider: currentAppointment?.provider || currentAppointment?.providerId || activeScheduledProcedure?.provider,
        }}
        procedures={allProcedures}
        appointmentTypes={appointmentTypes}
        planTitle={activeDraftTitle}
      />
      <TreatmentPlanRouteSlipDialog
        open={isRouteSlipOpen}
        onClose={() => setIsRouteSlipOpen(false)}
        patient={currentPatient}
        appointment={currentAppointment}
        procedures={allProcedures}
        planTitle={activeDraftTitle}
      />
      <AppointmentHistoryTimelineDialog
        open={isAppointmentHistoryOpen}
        onClose={() => setIsAppointmentHistoryOpen(false)}
        appointment={activeAppointmentForHistory}
      />
      <AddNewPatientAppointmentForm
        open={isEditAppointmentOpen}
        onCancel={() => {
          setIsEditAppointmentOpen(false);
          setEditingAppointment(null);
        }}
        onSubmit={handleEditAppointmentSubmit}
        loading={false}
        initialAppointment={editingAppointment}
        initialPatient={currentPatient || null}
        providers={appointmentProviders || providersList || []}
        rooms={appointmentRooms || []}
        appointmentTypes={appointmentTypes || []}
        appointments={[]}
        scheduleBlocks={[]}
        patients={currentPatient ? [currentPatient] : []}
        loadingPatients={false}
        onPatientSearch={() => {}}
        showExtendedOptions={false}
      />
      <Dialog
        open={isCreateDraftOpen}
        onClose={closeCreateDraftDialog}
        fullWidth
        maxWidth="xs"
        sx={{ zIndex: 10000 }}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 24px 64px rgba(15, 23, 42, 0.24)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Create draft
          </Typography>
          <IconButton onClick={closeCreateDraftDialog} disabled={isCreatingDraft} sx={{ width: 30, height: 30, color: '#2563eb' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2.25, bgcolor: '#fff' }}>
          <Typography sx={{ mb: 1, fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
            Treatment Plan Name <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size="small"
            value={draftName}
            disabled={isCreatingDraft}
            error={Boolean(draftNameError)}
            helperText={draftNameError}
            onChange={(event) => {
              setDraftName(event.target.value);
              if (draftNameError) setDraftNameError('');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleCreateDraft();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 34,
                borderRadius: '4px',
                fontFamily: 'Inter, sans-serif',
                bgcolor: '#fff',
                '& fieldset': { borderColor: '#d8dee8' },
                '&:hover fieldset': { borderColor: '#94a3b8' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '1.2px' },
              },
              '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, fontSize: '0.8125rem' },
              '& .MuiFormHelperText-root': { mx: 0, fontSize: '0.75rem' }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', gap: 1 }}>
          <Button
            onClick={closeCreateDraftDialog}
            disabled={isCreatingDraft}
            variant="outlined"
            sx={{ minWidth: 64, height: 34, borderRadius: '4px', textTransform: 'none', borderColor: '#d8dee8', color: '#2563eb', fontWeight: 600, boxShadow: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateDraft}
            disabled={isCreatingDraft}
            variant="contained"
            sx={{ minWidth: 64, height: 34, borderRadius: '4px', textTransform: 'none', bgcolor: '#2563eb', fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' } }}
          >
            {isCreatingDraft ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <EditProcedureDrawer
        open={Boolean(editingProcedure)}
        procedure={editingProcedure}
        onClose={() => setEditingProcedure(null)}
        onSave={handleSaveEditedProcedure}
      />
      <EditFeesDrawer
        key={editingFeesProcedure?.id || 'closed'}
        open={Boolean(editingFeesProcedure)}
        procedure={editingFeesProcedure}
        onClose={() => setEditingFeesProcedure(null)}
        onSave={handleSaveEditedFees}
        onRevert={String(editingFeesProcedure?.id || '').startsWith('appt-') ? undefined : handleRevertFees}
        saving={isSaving}
      />
      <NotesDrawer
        open={isNotesDrawerOpen}
        onClose={() => setIsNotesDrawerOpen(false)}
        patientName={currentPatient ? `${currentPatient.firstName || ''} ${currentPatient.lastName || ''}`.trim() : ''}
        patientId={currentPatient ? (currentPatient._id || currentPatient.id) : undefined}
        appointmentId={searchParams.get('appointmentId')}
        currentPatient={currentPatient}
        selectedProcedures={allProcedures}
      />

      {/* Summary dialog — shown when multiple providers are detected */}
      <PreAuthCreationSummaryModal
        open={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onDone={() => setIsSummaryModalOpen(false)}
        onSubmit={handleSubmitProviderGroups}
        isSubmitting={isSubmittingGroups}
        providerGroups={summaryProviderGroups}
        onViewPreAuth={handleViewPreAuthGroup}
      />

      {/* Full Pre-Auth editor — opened directly (single provider) or from a summary row */}
      <PreAuthModal
        open={isPreAuthModalOpen}
        onClose={() => setIsPreAuthModalOpen(false)}
        preAuthId={activeGroupPreAuthId}
        onSave={async (newId) => {
          setCreatedPreAuthId(newId);
          setCreatedPreAuthPatientId(currentPatientId);
          await applyPreAuthToProcedures(
            activeGroupProcedures.map((procedure) => ({ procedure, preAuthId: newId, status: 'Requested' }))
          );
          // Reflect the saved preAuthId back into the matching summary group
          setSummaryProviderGroups((prev) =>
            prev.map((g) =>
              g.procedures === activeGroupProcedures
                ? { ...g, preAuthId: newId, status: 'requested' }
                : g
            )
          );
        }}
        onDelete={() => {
          setCreatedPreAuthId(null);
          setActiveGroupPreAuthId(null);
        }}
        patientId={currentPatientId}
        treatmentPlanId={activeGroupPlanId || activePlanId}
        selectedProcedures={activeGroupProcedures}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.type} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewTreatmentPlanPage;
