import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Link,
  CircularProgress,
  Collapse,
} from '@mui/material';
import {
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentPracticeInfo,
  updateKioskSettings,
  selectPracticeInfo,
  selectPracticeInfoLoading,
} from '../../store/slices/practiceInfoSlice';
import KioskAccessSection from '../../components/admin/KioskAccessSection';
import KioskAccountsSection from '../../components/admin/KioskAccountsSection';
import KioskMoveDataPanel from '../../components/admin/KioskMoveDataPanel';

const NAVY = '#1a3a6b';

const KioskAccountsView = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [newAccount, setNewAccount] = useState({ email: '', firstName: '', lastName: '', telephoneNumber: '' });
  const [showMoveData, setShowMoveData] = useState(false);
  const { showSnackbar } = useSnackbar();
  const practiceInfo = useSelector(selectPracticeInfo);
  const loading = useSelector(selectPracticeInfoLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  const practiceInfoId = practiceInfo?._id || practiceInfo?.id;
  const accounts = practiceInfo?.kioskAccounts || [];

  const handleSetPassword = async () => {
    if (!password || password !== confirmPassword) return;
    if (!practiceInfoId) {
      showSnackbar('Practice Info not found', 'error');
      return;
    }

    try {
      await dispatch(updateKioskSettings({
        practiceInfoId,
        kioskSettingsData: {
          password,
          accounts,
        },
      })).unwrap();
      showSnackbar('Password saved successfully', 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      showSnackbar(error || 'Failed to save password', 'error');
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.email) return;
    if (!practiceInfoId) {
      showSnackbar('Practice Info not found', 'error');
      return;
    }

    const updatedAccounts = [...accounts, { ...newAccount }];

    try {
      await dispatch(updateKioskSettings({
        practiceInfoId,
        kioskSettingsData: {
          accounts: updatedAccounts,
        },
      })).unwrap();
      setNewAccount({ email: '', firstName: '', lastName: '', telephoneNumber: '' });
      setShowAddRow(false);
      showSnackbar('Account added successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar(error || 'Failed to add account', 'error');
    }
  };

  const kioskLink = `${window.location.origin}/kiosk`;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      border: '1px solid #DFE5EC',
      borderRadius: 2,
      bgcolor: '#FBFCFE',
      p: 3,
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          Kiosk Accounts
        </Typography>
        <KioskAccessSection
          kioskLink={kioskLink}
          password={password}
          confirmPassword={confirmPassword}
          showPassword={showPassword}
          showConfirm={showConfirm}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onConfirmChange={(e) => setConfirmPassword(e.target.value)}
          onToggleShowPassword={() => setShowPassword((p) => !p)}
          onToggleShowConfirm={() => setShowConfirm((p) => !p)}
          onSavePassword={handleSetPassword}
          canSavePassword={!!password && password === confirmPassword}
          showMoveData={showMoveData}
          onToggleMoveData={() => setShowMoveData((p) => !p)}
        />
      </Box>

      <KioskAccountsSection
        accounts={accounts}
        showAddRow={showAddRow}
        newAccount={newAccount}
        onChangeNewAccount={(field, value) => setNewAccount((prev) => ({ ...prev, [field]: value }))}
        onOpenAddRow={() => setShowAddRow(true)}
        onCancelAddRow={() => {
          setShowAddRow(false);
          setNewAccount({ email: '', firstName: '', lastName: '', telephoneNumber: '' });
        }}
        onAddAccount={handleAddAccount}
      />

      <Collapse in={showMoveData}>
        <KioskMoveDataPanel />
      </Collapse>
    </Box>
  );
};

export default KioskAccountsView;
