import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import { COLORS } from '../../../../constants/colors';
import { radius, fontWeight } from '../../../../constants/styles';
import { patientService } from '../../../../services/patient.service';
import PatientSelectionColumn from './PatientSelectionColumn';
import TemplatesAndMessageColumn from './TemplatesAndMessageColumn';

import { useSelector } from 'react-redux';
import { selectAppointmentList } from '../../../../store/slices/appointmentSlice';
import { useDropdownData } from '../../../../hooks/redux';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import api from "../../../../config/api";

const TEMPLATES = [
  {
    id: 1,
    title: 'NEW PATIENT EMAIL WELCOME',
    subject: 'Welcome to Our Practice!',
    text: "Hello [Patient: Preferred Name], We're excited to meet you. To ensure a smooth and efficient visit, please register your MyChart Account and..."
  },
  {
    id: 2,
    title: 'EXISTING PATIENT EMAIL REMINDER',
    subject: 'Appointment Reminder',
    text: "Hello [Patient: Preferred Name], We're looking forward to seeing you at your appointment again. If you're needing to cancel/change your appointment..."
  }
];

const SendBulkTextModal = ({ open, onClose }) => {
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [patients, setPatients] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const appointments = useSelector(selectAppointmentList) || [];
  const { providers = [] } = useDropdownData({ providers: true });
  const { showSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (open) {
      const fetchAllData = async () => {
        try {
          setLoading(true);
          const response = await patientService.getAllPatients(1, 100);
          const fetchedPatients = response.patients || [];

          const getProviderName = (p) => {
            if (!p) return "";
            if (p.name) return p.name;
            const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
            if (fullName) return fullName;
            const userFullName = `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim();
            if (userFullName) return userFullName;
            return p.providerCode || `Provider #${p._id || p.id}` || "";
          };

          // Map provider ID to provider Name for easy filtering
          const providerMap = new Map();
          providers.forEach(p => {
            providerMap.set(String(p._id || p.id), getProviderName(p));
          });

          // Build map of today's appointments by patient ID
          const apptMap = new Map();
          const validAppointments = Array.isArray(appointments) ? appointments : [];
          validAppointments.forEach(apt => {
            const ptObj = typeof apt.patientId === 'object' ? apt.patientId : (apt.patient || {});
            let pId = ptObj?._id || ptObj?.id;
            if (!pId && typeof apt.patientId === 'string') pId = apt.patientId;
            if (pId) apptMap.set(String(pId), apt);
          });

          // Map all fetched patients, attaching appointment data if they have one today
          const mergedPatients = fetchedPatients.map(p => {
            const pId = String(p._id || p.id);
            const apt = apptMap.get(pId);
            
            let providerName = 'Unknown Provider';
            if (apt) {
              const pObj = typeof apt.providerId === 'object' ? apt.providerId : (apt.provider || {});
              const rawProviderId = pObj?._id || pObj?.id || apt.providerId;
              providerName = providerMap.get(String(rawProviderId)) || 'Unknown Provider';
            }

            return {
              ...p,
              _id: pId,
              id: pId,
              name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
              appointmentStatus: apt ? apt.status : null,
              providerName: apt ? providerName : null,
              hasAppointmentToday: !!apt,
            };
          });

          // Sort: patients with appointments today at the top
          mergedPatients.sort((a, b) => {
            if (a.hasAppointmentToday && !b.hasAppointmentToday) return -1;
            if (!a.hasAppointmentToday && b.hasAppointmentToday) return 1;
            return a.name.localeCompare(b.name);
          });

          setPatients(mergedPatients);
        } catch (error) {
          console.error("Failed to fetch patients:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    } else {
      setSelectedPatients([]);
      setMessage('');
      setSubject('');
    }
  }, [open, appointments, providers]);

  const [filters, setFilters] = useState({ search: '', statuses: [], providers: [] });

  // Apply filters
  const displayPatients = patients.filter(p => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.name?.toLowerCase().includes(q)) return false;
    }
    if (filters.statuses.length > 0) {
      // Map frontend status label to backend status. For simplicity, just exact match or case-insensitive match.
      const pStatus = (p.appointmentStatus || '').toUpperCase();
      // Statuses in filter: SCHEDULED, CONFIRMED, CHECKED IN, COMPLETED, NO SHOW, CANCELLED
      // Some backend statuses might be 'SCHEDULED', 'CONFIRMED'. Assume exact match.
      if (!filters.statuses.includes(pStatus)) return false;
    }
    if (filters.providers.length > 0) {
      // providerName comes from our mapping
      if (!filters.providers.includes(p.providerName)) return false;
    }
    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPatients(displayPatients.map((p) => p._id || p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleTogglePatient = (id) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleTemplateClick = (tmpl) => {
    setMessage(tmpl.text);
    if (tmpl.subject) setSubject(tmpl.subject);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          width: '880px',
          height: '726px',
          maxWidth: 'none',
          borderRadius: '14px',
          border: `1px solid ${COLORS.BORDER}`,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          m: 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        boxSizing: 'border-box', 
        px: '25px', 
        py: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        borderBottom: `1px solid ${COLORS.BORDER}`,
        backgroundColor: COLORS.SURFACE_TINT,
        m: 0
      }}>
        <ForwardToInboxIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Send Bulk Email
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: '25px', pt: '16px !important', pb: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
        <PatientSelectionColumn
          displayPatients={displayPatients}
          selectedPatients={selectedPatients}
          handleSelectAll={handleSelectAll}
          handleTogglePatient={handleTogglePatient}
          filters={filters}
          onApplyFilters={setFilters}
        />
        <TemplatesAndMessageColumn
          subject={subject}
          setSubject={setSubject}
          message={message}
          setMessage={setMessage}
          templates={TEMPLATES}
          handleTemplateClick={handleTemplateClick}
        />
      </DialogContent>

      <DialogActions sx={{ p: '16px 20px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, gap: '8px' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            try {
              setIsSending(true);
              await api.post('/communication/bulk-email', {
                patientIds: selectedPatients,
                subject,
                message
              });
              showSnackbar('Emails queued for sending successfully', 'success');
              onClose();
            } catch (error) {
              console.error('Failed to send bulk email:', error);
              const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to send bulk emails.';
              showSnackbar(errorMsg, 'error');
            } finally {
              setIsSending(false);
            }
          }}
          disabled={!subject || !message || selectedPatients.length === 0 || isSending}
          sx={{
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }
          }}
        >
          {isSending ? 'Sending...' : 'Send Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendBulkTextModal;
