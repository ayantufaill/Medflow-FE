import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Menu,
  CircularProgress,
  TextField,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Close as CloseIcon,
  OutlinedFlag as FlagIcon,
  AddCircleOutline as AddIcon,
  PrintOutlined as PrintIcon,
  DownloadOutlined as DownloadIcon,
  MailOutline as MailIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ShieldOutlined as ShieldIcon,
  InsertDriveFileOutlined as FileIcon,
  Send as SendIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { selectCurrentPatient, selectPatientInsurancesCache } from '../../../store/slices/patientSlice';
import { authorizationService } from '../../../services/authorization.service';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { ICON_TAGS } from '../../appointments/new-appointment/constants';
import deleteSvg from '../../../assets/practicesetupicon/deleteicon.svg';

const PreAuthModal = ({ open, onClose, preAuthId, patientId, selectedProcedures = [], onSave }) => {
  const currentPatient = useSelector(selectCurrentPatient);
  const insurancesCache = useSelector(selectPatientInsurancesCache);
  const currentUser = useSelector((state) => state.auth?.user);

  const [tabValue, setTabValue] = useState(0);
  const [order, setOrder] = useState('Primary');
  
  const [authData, setAuthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedAuthorizationId, setSavedAuthorizationId] = useState(null);
  
  const [tagAnchorEl, setTagAnchorEl] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [attachments, setAttachments] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [historyLogs, setHistoryLogs] = useState([{
    id: 1,
    action: 'Created Pre-Auth Draft',
    user: currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name : 'System',
    date: dayjs().format('MM/DD/YYYY h:mm A')
  }]);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachments([...attachments, { name: file.name, size: file.size, date: dayjs().format('MM/DD/YYYY') }]);
      setHistoryLogs([{
        id: Date.now(),
        action: `Added attachment: ${file.name}`,
        user: currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name : 'System',
        date: dayjs().format('MM/DD/YYYY h:mm A')
      }, ...historyLogs]);
      showSnackbar(`Document ${file.name} queued for upload`, 'success');
      e.target.value = null;
    }
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    const author = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name : 'Unknown User';
    setComments([...comments, { id: Date.now(), text: newComment, author, date: dayjs().format('MM/DD/YYYY h:mm A') }]);
    setHistoryLogs([{
      id: Date.now() + 1,
      action: 'Added a comment',
      user: author,
      date: dayjs().format('MM/DD/YYYY h:mm A')
    }, ...historyLogs]);
    setNewComment('');
  };
  
  const { showSnackbar } = useSnackbar();

  const normalizeProcedure = (procedure) => ({
    ...procedure,
    code: procedure.code || procedure.procedureCode || procedure.ProcCode || '-',
    description: procedure.description || procedure.procedureDescription || procedure.treatment || procedure.name || procedure.Descript || '-',
    fee: procedure.fee ?? procedure.amount ?? procedure.charge ?? '0.00',
  });

  useEffect(() => {
    setAttachments([]);
    setSelectedTags([]);
    setComments([]);
    setNewComment('');
    setTabValue(0);
    setOrder('Primary');
    setHistoryLogs([{
      id: 1,
      action: 'Created Pre-Auth Draft',
      user: currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name : 'System',
      date: dayjs().format('MM/DD/YYYY h:mm A')
    }]);
  }, [open, patientId, currentUser]);

  useEffect(() => {
    setSavedAuthorizationId(preAuthId || null);
  }, [open, patientId, preAuthId]);

  useEffect(() => {
    const fetchAuthData = async () => {
      if (!open) return;
      setIsLoading(true);
      setAuthData(null);
      
      try {
        // Get dynamic fallbacks
        const patientInsurances = insurancesCache?.[patientId]?.data || [];
        const primaryIns = patientInsurances.find(ins => ins.insuranceType === 'primary') || patientInsurances[0];
        
        let patientInsuranceName = 'No Primary Insurance';
        if (primaryIns) {
          patientInsuranceName = primaryIns.insuranceCompanyId?.name || primaryIns.insuranceCompany?.name || primaryIns.insuranceCompany || primaryIns.planName || 'Unknown Insurance';
        } else if (currentPatient?.primaryInsurance?.insuranceCompany?.name) {
          patientInsuranceName = currentPatient.primaryInsurance.insuranceCompany.name;
        }

        const patientProviderName = currentPatient?.priProv?.name || currentPatient?.priProv || currentPatient?.provider?.name || currentPatient?.provider || currentPatient?.primaryProvider?.name;
        const fallbackProvider = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name : selectedProcedures?.[0]?.provider || 'No Provider Assigned';
        const primaryProvider = patientProviderName || fallbackProvider;

        if (preAuthId) {
          // Fetch existing Pre-Auth
          const data = await authorizationService.getAuthorizationById(preAuthId);
          setAuthData({
            ...data,
            procedures: (data.procedures || selectedProcedures).map(normalizeProcedure),
            billingProvider: data.billingProvider || primaryProvider,
            treatmentProvider: data.treatmentProvider || primaryProvider,
            insuranceCompany: data.insuranceCompany || data.insuranceCompanyId?.name || patientInsuranceName,
            attachments: data.attachments || 'None Required',
            serviceDate: data.serviceDate || data.requestedDate,
            latestActivity: data.latestActivity || (
              data.updatedAt || data.createdAt || data.requestedDate
                ? `Updated on ${dayjs(data.updatedAt || data.createdAt || data.requestedDate).format('MM/DD/YYYY')}`
                : 'No recent activity.'
            ),
          });
          if (data.order) setOrder(data.order);
        } else {
          setAuthData({
            id: 'NEW',
            status: 'Draft',
            serviceDate: new Date(),
            procedures: selectedProcedures.map(normalizeProcedure),
            billingProvider: primaryProvider,
            treatmentProvider: primaryProvider,
            insuranceCompany: patientInsuranceName,
            attachments: 'None Required',
            latestActivity: `Created on ${dayjs().format('MM/DD/YYYY')}`,
            order: 'Primary'
          });
        }
      } catch (error) {
        showSnackbar('Failed to load authorization data', 'error');
        console.error('Error fetching auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuthData();
  }, [
    open,
    preAuthId,
    patientId,
    selectedProcedures,
    currentPatient,
    currentUser,
    insurancesCache,
    showSnackbar,
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
    setAuthData(prev => ({ ...prev, order: event.target.value }));
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((currentTags) => currentTags.some((selectedTag) => selectedTag.id === tag.id)
      ? currentTags.filter((selectedTag) => selectedTag.id !== tag.id)
      : [...currentTags, tag]);
  };

  const handleSubmit = async () => {
    try {
      if (preAuthId) {
        await authorizationService.updateAuthorization(preAuthId, { order });
        showSnackbar('Authorization updated successfully', 'success');
        if (onSave) onSave(preAuthId);
      } else {
        // Create new authorization logic here
        const newAuth = await authorizationService.requestAuthorization({ 
          patientId,
          order,
          serviceDate: authData.serviceDate,
          status: 'requested',
          // map selected procedures
          procedures: (authData.procedures || []).map(p => p.id || p._id || p.procedureId || p.code)
        });
        showSnackbar('Authorization requested successfully', 'success');
        if (onSave) onSave(newAuth._id || newAuth.id);
      }
      onClose();
    } catch (error) {
      showSnackbar(error?.response?.data?.error?.message || 'Failed to submit authorization', 'error');
    }
  };

  const ensureAuthorizationId = async () => {
    const existingId = preAuthId || savedAuthorizationId;
    if (existingId) return existingId;

    const newAuth = await authorizationService.requestAuthorization({
      patientId,
      order,
      serviceDate: authData.serviceDate,
      status: 'requested',
      procedures: (authData.procedures || []).map((procedure) => (
        procedure.id || procedure._id || procedure.procedureId || procedure.code
      )),
    });
    const newId = newAuth._id || newAuth.id;
    setSavedAuthorizationId(newId);
    setAuthData((previous) => ({ ...previous, id: newId }));
    onSave?.(newId);
    return newId;
  };

  const getAuthorizationForm = async () => {
    const authorizationId = await ensureAuthorizationId();
    const blob = await authorizationService.printAuthorizationForm(authorizationId);
    return { authorizationId, blob };
  };

  const handlePrint = async () => {
    try {
      const { blob } = await getAuthorizationForm();
      const url = window.URL.createObjectURL(blob);

      const printFrame = document.createElement('iframe');
      printFrame.title = 'Print authorization form';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '1px';
      printFrame.style.height = '1px';
      printFrame.style.border = '0';
      printFrame.style.opacity = '0';
      printFrame.onload = () => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        window.setTimeout(() => {
          printFrame.remove();
          window.URL.revokeObjectURL(url);
        }, 1000);
      };
      printFrame.src = url;
      document.body.appendChild(printFrame);
    } catch {
      showSnackbar('Failed to generate print form', 'error');
    }
  };

  const handleDownload = async () => {
    try {
      const { authorizationId, blob } = await getAuthorizationForm();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PreAuth-${authorizationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSnackbar('Form downloaded successfully', 'success');
    } catch {
      showSnackbar('Failed to download form', 'error');
    }
  };

  const handleSubmitManually = () => {
    showSnackbar('Form submitted manually', 'success');
  };

  const handleDeletePreAuth = () => {
    showSnackbar('Pre-Auth deleted', 'success');
    onClose();
  };

  if (!authData && !isLoading) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      sx={{ zIndex: 1400 }}
      PaperProps={{ 
        sx: { 
          borderRadius: '12px',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)' 
        } 
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        px: 3, 
        py: 2,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: '#F1F5FD',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: '#e2ebfc', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldIcon sx={{ color: '#2563EB', fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', color: '#111', lineHeight: '24px', letterSpacing: '-0.4px' }}>
                Pre-Auth #{authData?.id || 'New'}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.5px', color: '#6B7280', lineHeight: '17.25px' }}>
              Service Date - {authData?.serviceDate || authData?.requestedDate ? dayjs(authData.serviceDate || authData.requestedDate).format('MMMM DD, YYYY') : '-'}
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#6B7280' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: '32px', px: '24px', pb: '24px', backgroundColor: '#ffffff' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Top Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 4, mt: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>Status</Typography>
                  <FlagIcon fontSize="small" sx={{ color: '#64748b', fontSize: '16px' }} />
                </Box>
                <Box sx={{ mt: 'auto' }}>
                  <Typography sx={{ 
                    fontFamily: 'Inter',
                    backgroundColor: '#f1f5f9', 
                    color: '#0f172a',
                    display: 'inline-block', 
                    px: '8px', 
                    py: '4px', 
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '12px',
                    textTransform: 'capitalize'
                  }}>
                    {authData?.status || 'Draft'}
                  </Typography>
                </Box>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: 'none' }}>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', mb: 1, color: '#0f172a' }}>Tags</Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                    {selectedTags.map((tag) => (
                      <Tooltip key={tag.id} title={tag.label} arrow placement="top" disableInteractive>
                        <Box sx={{ width: 26, height: 26, borderRadius: '6px', backgroundColor: '#e0e7ff', border: '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Box component="img" src={tag.src} alt={tag.label} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </Box>
                      </Tooltip>
                    ))}
                    <IconButton size="small" onClick={(event) => setTagAnchorEl(event.currentTarget)} sx={{ p: 0, color: '#64748b' }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      anchorEl={tagAnchorEl}
                      open={Boolean(tagAnchorEl)}
                      onClose={() => setTagAnchorEl(null)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      sx={{ zIndex: 1700 }}
                      MenuListProps={{ dense: true }}
                      PaperProps={{ sx: { mt: 1, maxHeight: 320, minWidth: 210, zIndex: 1600, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', border: '1px solid #e2e8f0', borderRadius: '8px' } }}
                    >
                      {ICON_TAGS.map((tag) => {
                        const isSelected = selectedTags.some((selectedTag) => selectedTag.id === tag.id);
                        return (
                          <MenuItem key={tag.id} selected={isSelected} onClick={() => handleTagToggle(tag)} sx={{ gap: 1, fontFamily: 'Inter', fontSize: 13 }}>
                            <Box component="img" src={tag.src} alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />
                            {tag.label}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                </Box>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: 'none' }}>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', mb: 1, color: '#0f172a' }}>Documents</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1 }}>
                  {attachments.map((file, index) => (
                    <Box key={`${file.name}-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                      <FileIcon sx={{ color: '#2563eb', fontSize: 18, flexShrink: 0 }} />
                      <Typography noWrap title={file.name} sx={{ fontFamily: 'Inter', color: '#475569', fontSize: '12px', minWidth: 0, flex: 1 }}>
                        {file.name}
                      </Typography>
                      <IconButton size="small" onClick={() => setAttachments(attachments.filter((_, fileIndex) => fileIndex !== index))} sx={{ p: 0, flexShrink: 0 }}>
                        <Box component="img" src={deleteSvg} alt="delete document" sx={{ width: 16, height: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mt: 'auto' }}>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                  <Typography onClick={() => fileInputRef.current?.click()} sx={{ fontFamily: 'Inter', color: '#2563eb', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                    Add
                  </Typography>
                </Box>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: 'none' }}>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#2563eb', mb: 0.5 }}>
                  Latest activity
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', color: '#64748b', fontSize: '13px', lineHeight: 1.4 }}>
                  {authData?.latestActivity || 'No recent activity.'}
                </Typography>
              </Paper>
            </Box>

            {/* Quick Actions */}
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '15px', color: '#111827', mb: 2 }}>
              Quick actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 5 }}>
              <Button onClick={handlePrint} variant="outlined" startIcon={<PrintIcon />} size="small" sx={{ fontFamily: 'Inter', color: '#374151', borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', textTransform: 'none', fontWeight: 500, borderRadius: '6px', px: 2, '&:hover': { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' } }}>
                Print form
              </Button>
              <Button onClick={handleDownload} variant="outlined" startIcon={<DownloadIcon />} size="small" sx={{ fontFamily: 'Inter', color: '#374151', borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', textTransform: 'none', fontWeight: 500, borderRadius: '6px', px: 2, '&:hover': { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' } }}>
                Download form
              </Button>
              <Button onClick={handleSubmitManually} variant="outlined" startIcon={<MailIcon />} size="small" sx={{ fontFamily: 'Inter', color: '#2563EB', borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', textTransform: 'none', fontWeight: 500, borderRadius: '6px', px: 2, '&:hover': { backgroundColor: '#DBEAFE', borderColor: '#BFDBFE' } }}>
                Submit manually
              </Button>
              <Button onClick={handleDeletePreAuth} variant="outlined" startIcon={<Box component="img" src={deleteSvg} alt="" sx={{ width: 18, height: 18 }} />} size="small" sx={{ fontFamily: 'Inter', color: '#DC2626', borderColor: '#FECACA', backgroundColor: '#FEF2F2', textTransform: 'none', fontWeight: 500, borderRadius: '6px', px: 2, '&:hover': { backgroundColor: '#FEE2E2', borderColor: '#FECACA' } }}>
                Delete pre-auth
              </Button>
            </Box>

            {/* Details Grid */}
            <Grid container spacing={4} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ fontFamily: 'Inter', width: 150, fontWeight: 600, fontSize: '14px', color: '#111827' }}>Appointment</Typography>
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#4B5563' }}>-</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: 'Inter', width: 150, fontWeight: 600, fontSize: '14px', color: '#111827' }}>Billing Provider</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#4B5563' }}>
                      <Typography sx={{ fontFamily: 'Inter', fontSize: '14px' }}>
                        {authData?.billingProvider?.name || authData?.billingProvider || 'No Provider Assigned'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: 'Inter', width: 150, fontWeight: 600, fontSize: '14px', color: '#111827' }}>Treatment Provider</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#4B5563' }}>
                      <Typography sx={{ fontFamily: 'Inter', fontSize: '14px' }}>
                        {authData?.treatmentProvider?.name || authData?.treatmentProvider || 'No Provider Assigned'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ fontFamily: 'Inter', width: 150, fontWeight: 600, fontSize: '14px', color: '#111827' }}>Claim</Typography>
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#4B5563' }}></Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ fontFamily: 'Inter', width: 150, fontWeight: 600, fontSize: '14px', color: '#111827' }}>Attachments</Typography>
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#4B5563' }}>{authData?.attachments || 'None Required'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: 'Inter', width: 150, fontWeight: 600, fontSize: '14px', color: '#111827' }}>Insurance</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#4B5563' }}>
                      <Typography sx={{ fontFamily: 'Inter', fontSize: '14px' }}>
                        {authData?.insuranceCompany?.name || authData?.insuranceCompany || 'No Primary Insurance'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: 'Inter', width: 150, fontWeight: 600, fontSize: '14px', color: '#111827' }}>Order</Typography>
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                      <Select
                        value={order}
                        onChange={handleOrderChange}
                        disableUnderline
                        MenuProps={{ sx: { zIndex: 1500 } }}
                        sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#4B5563', '& .MuiSelect-icon': { color: '#4B5563' } }}
                      >
                        <MenuItem value="Primary" sx={{ fontFamily: 'Inter', fontSize: '14px' }}>Primary</MenuItem>
                        <MenuItem value="Secondary" sx={{ fontFamily: 'Inter', fontSize: '14px' }}>Secondary</MenuItem>
                        <MenuItem value="Other" sx={{ fontFamily: 'Inter', fontSize: '14px' }}>Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Tabs */}
            <Box sx={{ borderBottom: '1px solid #e2e8f0' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="pre-auth tabs"
                sx={{
                  minHeight: '40px',
                  '& .MuiTabs-indicator': { 
                    backgroundColor: '#3b82f6',
                    height: '3px',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px'
                  },
                  '& .MuiTab-root': { 
                    fontFamily: 'Inter',
                    color: '#64748b', 
                    textTransform: 'none', 
                    fontWeight: 600,
                    minHeight: '40px',
                    p: '8px 16px',
                  },
                  '& .Mui-selected': { color: '#3b82f6 !important' }
                }}
              >
                <Tab label="Procedures" />
                <Tab label="Attachments" />
                <Tab label="Comments" />
                <Tab label="History" />
              </Tabs>
            </Box>
            <Box sx={{ py: 3 }}>
              {tabValue === 0 && (
                <Box>
                  {authData?.procedures?.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 'none', borderRadius: '8px', borderColor: '#e2e8f0' }}>
                      <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                          <TableRow>
                            <TableCell sx={{ fontFamily: 'Inter', fontWeight: 600, color: '#475569', py: 1.5 }}>Code</TableCell>
                            <TableCell sx={{ fontFamily: 'Inter', fontWeight: 600, color: '#475569', py: 1.5 }}>Description</TableCell>
                            <TableCell sx={{ fontFamily: 'Inter', fontWeight: 600, color: '#475569', py: 1.5 }}>Tooth/Surf</TableCell>
                            <TableCell sx={{ fontFamily: 'Inter', fontWeight: 600, color: '#475569', py: 1.5 }}>Fee</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {authData.procedures.map((proc, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell sx={{ fontFamily: 'Inter', color: '#0f172a' }}>{proc.code || proc.procedureCode || '-'}</TableCell>
                              <TableCell sx={{ fontFamily: 'Inter', color: '#0f172a' }}>{proc.description || proc.procedureDescription || '-'}</TableCell>
                              <TableCell sx={{ fontFamily: 'Inter', color: '#0f172a' }}>{proc.tooth || proc.surf || '-'}</TableCell>
                              <TableCell sx={{ fontFamily: 'Inter', color: '#0f172a' }}>{String(proc.fee || '0.00').startsWith('$') ? proc.fee : `$${proc.fee || '0.00'}`}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#64748b', textAlign: 'center', py: 4 }}>No procedures added.</Typography>
                  )}
                </Box>
              )}
              {tabValue === 1 && (
                <Box>
                  {attachments.length > 0 ? (
                    <List sx={{ pt: 0 }}>
                      {attachments.map((file, index) => (
                        <ListItem key={index} secondaryAction={
                          <IconButton edge="end" onClick={() => setAttachments(attachments.filter((_, i) => i !== index))} size="small">
                            <Box component="img" src={deleteSvg} alt="delete document" sx={{ width: 16, height: 16 }} />
                          </IconButton>
                        } sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', mb: 1 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}>
                              <FileIcon fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={<Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{file.name}</Typography>}
                            secondary={<Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#64748b' }}>{file.date} • {(file.size / 1024).toFixed(2)} KB</Typography>}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#64748b', textAlign: 'center', py: 4 }}>No attachments.</Typography>
                  )}
                </Box>
              )}
              {tabValue === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ flexGrow: 1, maxHeight: '200px', overflowY: 'auto', mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <Box key={comment.id} sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{comment.author}</Typography>
                            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#64748b' }}>{comment.date}</Typography>
                          </Box>
                          <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#334155' }}>{comment.text}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#64748b', textAlign: 'center', py: 2 }}>No comments.</Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField 
                      fullWidth 
                      size="small" 
                      placeholder="Add a comment..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                      sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'Inter', fontSize: '14px', borderRadius: '6px' } }}
                    />
                    <Button variant="contained" onClick={handlePostComment} sx={{ minWidth: '40px', p: '8px', bgcolor: '#3b82f6', borderRadius: '6px', '&:hover': { bgcolor: '#2563eb' } }}>
                      <SendIcon fontSize="small" sx={{ color: '#fff' }} />
                    </Button>
                  </Box>
                </Box>
              )}
              {tabValue === 3 && (
                <Box>
                  <List sx={{ pt: 0 }}>
                    {historyLogs.map((log, index) => (
                      <React.Fragment key={log.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 1, py: 1.5 }}>
                          <ListItemText 
                            primary={<Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{log.action}</Typography>}
                            secondary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#475569' }}>by {log.user}</Typography>
                                <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#64748b' }}>{log.date}</Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < historyLogs.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        backgroundColor: '#FFFFFF', 
        borderTop: '1px solid #E5E7EB', 
        gap: 1.5,
        justifyContent: 'flex-end'
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          disabled={isLoading}
          sx={{ 
            borderColor: '#D1D5DB', 
            color: '#374151',
            backgroundColor: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            px: 2,
            '&:hover': { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          disableElevation
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{ 
            backgroundColor: '#2563EB', 
            color: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1D4ED8', boxShadow: 'none' }
          }}
        >
          Submit
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default PreAuthModal;
