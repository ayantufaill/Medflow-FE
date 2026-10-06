import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Link, Divider, Snackbar, Alert, Button, CircularProgress } from '@mui/material';

import DomainVerificationBanner from '../../components/admin/patient-communication/email-services/DomainVerificationBanner';
import VerificationStatus from '../../components/admin/patient-communication/email-services/VerificationStatus';
import DnsRecordCard from '../../components/admin/patient-communication/email-services/DnsRecordCard';
import ChangeDomainDialog from '../../components/admin/patient-communication/email-services/ChangeDomainDialog';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import { DOMAIN_STATUS } from '../../components/admin/patient-communication/email-services/constants';
import { emailDomainApi } from '../../components/admin/patient-communication/emailMessagingApi';

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error?.message || err.response?.data?.message || err?.message || fallback;

const downloadDnsRecords = (domain, records) => {
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [['Type', 'Name', 'Value'], ...records.map((r) => [r.type, `${r.name}.${domain}`, r.value])];
  const csv = rows.map((row) => row.map(escape).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${domain}-dns-records.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const primaryButtonSx = (color, hover) => ({
  fontFamily: 'Inter', fontSize: '13px', fontWeight: 600,
  textTransform: 'none', borderRadius: '8px',
  backgroundColor: color, color: '#fff',
  px: '20px', py: '7px',
  boxShadow: 'none',
  '&:hover': { backgroundColor: hover, boxShadow: 'none' },
});

const EmailServices = () => {
  const [emailDomain, setEmailDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [checking, setChecking] = useState(false);
  const [domainDialogOpen, setDomainDialogOpen] = useState(false);
  const [confirmRegenerateOpen, setConfirmRegenerateOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchEmailDomain = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      setEmailDomain(await emailDomainApi.getEmailDomain());
    } catch (err) {
      setLoadError(getErrorMessage(err, 'Failed to load email domain settings.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmailDomain();
  }, [fetchEmailDomain]);

  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });

  const handleCopy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(`${label} copied to clipboard.`);
    } catch {
      showToast('Could not copy to clipboard.', 'error');
    }
  };

  const handleCheckStatus = async () => {
    try {
      setChecking(true);
      const result = await emailDomainApi.verifyEmailDomain();
      setEmailDomain(result);
      if (result.status === DOMAIN_STATUS.VERIFIED) {
        showToast('Your domain is verified.');
      } else {
        const missing = result.records.filter((r) => !r.found).length;
        showToast(`${missing} of ${result.records.length} records not found yet.`, 'warning');
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to check domain status.'), 'error');
    } finally {
      setChecking(false);
    }
  };

  // Throws so the dialog can show the server's validation message inline.
  const handleSubmitDomain = async (domain) => {
    try {
      const result = await emailDomainApi.setEmailDomain(domain);
      setEmailDomain(result);
      setDomainDialogOpen(false);
      showToast(`New DNS records generated for ${result.domain}.`);
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Failed to save domain.'));
    }
  };

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const isConfigured = emailDomain && emailDomain.status !== DOMAIN_STATUS.NOT_CONFIGURED;

  const renderBody = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (loadError) {
      return (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={fetchEmailDomain}>Retry</Button>}
        >
          {loadError}
        </Alert>
      );
    }

    if (!isConfigured) {
      return (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 0.5 }}>
            Set Up Your Domain
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, mb: 2.5 }}>
            You haven&apos;t added an email domain yet. Add the domain your practice sends email from and we&apos;ll
            generate the DNS records you need.
          </Typography>
          <Button variant="contained" onClick={() => setDomainDialogOpen(true)} sx={primaryButtonSx('#2262ef', '#1a50cc')}>
            Set Up Domain
          </Button>
        </Box>
      );
    }

    return (
      <>
        <VerificationStatus
          domain={emailDomain.domain}
          status={emailDomain.status}
          lastCheckedAt={emailDomain.lastCheckedAt}
          onCheckStatus={handleCheckStatus}
          checking={checking}
        />

        <Divider sx={{ borderStyle: 'dashed', borderColor: '#E5E9F2' }} />

        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 0.5 }}>
            DNS Records
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, mb: 2.5 }}>
            Add the records below to your domain provider. You may need to work with your IT provider or contact
            your domain provider for help. If your IT provider needs these records, you can{' '}
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={() => downloadDnsRecords(emailDomain.domain, emailDomain.records)}
              sx={{ fontSize: 'inherit', verticalAlign: 'baseline', fontWeight: 600 }}
            >
              download a copy of your DNS records
            </Link>
            .
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {emailDomain.records.map((record) => (
              <DnsRecordCard key={`${record.type}-${record.name}`} record={record} onCopy={handleCopy} />
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed', borderColor: '#E5E9F2' }} />

        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 0.5 }}>
            Change Domain
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, mb: 2.5 }}>
            The above records were generated for{' '}
            <Box component="span" sx={{ fontWeight: 700, color: '#1E293B' }}>{emailDomain.domain}</Box>. If you need
            to generate new records for a different domain, you can do so by clicking below.
          </Typography>
          <Button variant="contained" onClick={() => setConfirmRegenerateOpen(true)} sx={primaryButtonSx('#ef4444', '#dc2626')}>
            Change Domain
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <DomainVerificationBanner />
        {renderBody()}
      </Box>

      <ConfirmationDialog
        open={confirmRegenerateOpen}
        onClose={() => setConfirmRegenerateOpen(false)}
        onConfirm={() => {
          setConfirmRegenerateOpen(false);
          setDomainDialogOpen(true);
        }}
        title="Generate New Records"
        message="Once you generate new records your existing records will no longer be valid. You will not be able to send emails again until the new records are validated."
        confirmText="Continue"
        confirmColor="primary"
      />

      <ChangeDomainDialog
        open={domainDialogOpen}
        currentDomain={isConfigured ? emailDomain.domain : null}
        onClose={() => setDomainDialogOpen(false)}
        onSubmit={handleSubmitDomain}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailServices;
