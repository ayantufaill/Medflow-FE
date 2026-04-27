import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Collapse,
  Divider,
  Grid,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility,
  VisibilityOff,
  SwapHoriz as SwapHorizIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { practiceInfoService } from '../../services/practice-info.service';

const NAVY = '#1a3a6b';
const GOLD = '#b8960c';

const MOVE_DATA_FIELDS = [
  'Medical And Dental History',
  'Notes',
  'Insurance',
  'Billing',
  'Treatment Plan',
  'Exam',
];

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: 'Very Weak', color: '#e53e3e' },
    { label: 'Weak', color: '#dd6b20' },
    { label: 'Fair', color: '#d69e2e' },
    { label: 'Strong', color: '#38a169' },
    { label: 'Very Strong', color: '#2b6cb0' },
  ];
  return { score, ...levels[score] };
};

const MoveDataPanel = () => {
  const [fromPatient, setFromPatient] = useState('');
  const [toPatient, setToPatient] = useState('');
  const [checkedFields, setCheckedFields] = useState({});
  const [fromProvider, setFromProvider] = useState('');
  const [toProvider, setToProvider] = useState('');

  const toggleField = (field) =>
    setCheckedFields((prev) => ({ ...prev, [field]: !prev[field] }));

  const providers = [];

  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 3, mb: 3 }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>
            Move Patient Data
          </Typography>

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            From patient:
          </Typography>
          <TextField
            size="small"
            placeholder="From Patient"
            value={fromPatient}
            onChange={(e) => setFromPatient(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            To patient:
          </Typography>
          <TextField
            size="small"
            placeholder="To Patient"
            value={toPatient}
            onChange={(e) => setToPatient(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mb: 2.5 }}>
            {MOVE_DATA_FIELDS.map((field) => (
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    size="small"
                    checked={!!checkedFields[field]}
                    onChange={() => toggleField(field)}
                    sx={{ py: 0.25 }}
                  />
                }
                label={<Typography variant="body2">{field}</Typography>}
                sx={{ m: 0 }}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            size="small"
            sx={{
              textTransform: 'none',
              backgroundColor: GOLD,
              '&:hover': { backgroundColor: '#9a7a0a' },
            }}
          >
            Move Patient Data
          </Button>
        </Grid>

        <Grid item xs={12} md="auto" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'stretch' }}>
          <Divider orientation="vertical" flexItem />
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            Move Provider Future Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            (future appointments &amp; procedures, preferred DDS, etc.)
          </Typography>

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            From provider:
          </Typography>
          <FormControl size="small" fullWidth sx={{ mb: 2 }}>
            <Select
              value={fromProvider}
              onChange={(e) => setFromProvider(e.target.value)}
              displayEmpty
            >
              <MenuItem value=""><em>Select provider</em></MenuItem>
              {providers.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            To provider:
          </Typography>
          <FormControl size="small" fullWidth sx={{ mb: 3 }}>
            <Select
              value={toProvider}
              onChange={(e) => setToProvider(e.target.value)}
              displayEmpty
            >
              <MenuItem value=""><em>Select provider</em></MenuItem>
              {providers.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: 'none',
                backgroundColor: GOLD,
                '&:hover': { backgroundColor: '#9a7a0a' },
              }}
            >
              Move Provider Data
            </Button>
            <MenuBookIcon sx={{ color: 'text.secondary', fontSize: '1.5rem' }} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const KioskAccountsView = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showAddRow, setShowAddRow] = useState(false);
  const [newAccount, setNewAccount] = useState({ email: '', firstName: '', lastName: '' });
  const [showMoveData, setShowMoveData] = useState(false);
  const [practiceInfoId, setPracticeInfoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const practiceInfo = await practiceInfoService.getCurrentPracticeInfo();
        if (practiceInfo) {
          setPracticeInfoId(practiceInfo._id || practiceInfo.id);
          if (practiceInfo.kioskAccounts && Array.isArray(practiceInfo.kioskAccounts)) {
            setAccounts(practiceInfo.kioskAccounts.map((acc, index) => ({ ...acc, id: Date.now() + index })));
          }
        }
      } catch (error) {
        console.error('Failed to fetch practice info:', error);
        showSnackbar('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [showSnackbar]);

  const strength = getPasswordStrength(password);

  const handleSetPassword = async () => {
    if (!password || password !== confirmPassword) return;
    if (!practiceInfoId) {
      showSnackbar('Practice Info not found', 'error');
      return;
    }
    try {
      await practiceInfoService.updateKioskSettings(practiceInfoId, {
        password,
        accounts: accounts.map(({ id, ...rest }) => rest)
      });
      showSnackbar('Password saved successfully', 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to save password', 'error');
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.email) return;
    if (!practiceInfoId) {
      showSnackbar('Practice Info not found', 'error');
      return;
    }

    const updatedAccounts = [...accounts, { ...newAccount, id: Date.now() }];
    
    try {
      await practiceInfoService.updateKioskSettings(practiceInfoId, {
        accounts: updatedAccounts.map(({ id, ...rest }) => rest)
      });
      setAccounts(updatedAccounts);
      setNewAccount({ email: '', firstName: '', lastName: '' });
      setShowAddRow(false);
      showSnackbar('Account added successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to add account', 'error');
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
    <Box>
      {/* Breadcrumb */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Link
          component={RouterLink}
          to="/admin/practice-setup"
          variant="body2"
          underline="hover"
          color="primary"
        >
          Practice Setup
        </Link>
        <Typography variant="body2" color="text.secondary">{'>'}</Typography>
        <Typography variant="body2" color="text.secondary">Kiosk Accounts</Typography>
      </Box>

      {/* Kiosk Link */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2.5, mb: 3 }}
      >
        <Typography fontWeight={600} fontSize="0.9rem" sx={{ mb: 1 }}>
          Kiosk Link
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Link href={kioskLink} target="_blank" rel="noopener noreferrer" variant="body2">
            {kioskLink}
          </Link>
          <Typography variant="caption" color="text.secondary">
            (This link is for internal office use only at the kiosk station.)
          </Typography>
        </Box>
      </Paper>

      {/* Kiosk Password */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2.5, mb: 3 }}
      >
        <Typography fontWeight={600} fontSize="0.9rem" sx={{ mb: 2 }}>
          Kiosk Password
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 400 }}>
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            size="small"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPassword && confirmPassword !== password}
            helperText={!!confirmPassword && confirmPassword !== password ? 'Passwords do not match' : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowConfirm((p) => !p)} edge="end">
                    {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {password && (
            <Box>
              <LinearProgress
                variant="determinate"
                value={(strength.score / 4) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': { backgroundColor: strength.color, borderRadius: 3 },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                <Typography variant="caption" sx={{ color: strength.color, fontWeight: 600 }}>
                  Strength: {strength.label}
                </Typography>
                {confirmPassword && confirmPassword === password && (
                  <Typography variant="caption" sx={{ color: '#38a169', fontWeight: 600 }}>
                    Passwords Match
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleSetPassword}
              disabled={!password || password !== confirmPassword}
              sx={{ textTransform: 'none', backgroundColor: NAVY, '&:hover': { backgroundColor: '#142d52' } }}
            >
              Set Password
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Move Data toggle button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <Button
          variant={showMoveData ? 'contained' : 'outlined'}
          size="small"
          startIcon={<SwapHorizIcon />}
          onClick={() => setShowMoveData((p) => !p)}
          sx={{
            textTransform: 'none',
            ...(showMoveData
              ? { backgroundColor: NAVY, '&:hover': { backgroundColor: '#142d52' } }
              : { borderColor: NAVY, color: NAVY }),
          }}
        >
          Move Data
        </Button>
      </Box>

      {/* Move Data panel */}
      <Collapse in={showMoveData}>
        <MoveDataPanel />
      </Collapse>

      {/* Accounts Table */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography fontWeight={600} fontSize="0.9rem">
            Accounts
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon sx={{ fontSize: '0.9rem !important' }} />}
            onClick={() => setShowAddRow(true)}
            sx={{ textTransform: 'none', color: NAVY, fontWeight: 500 }}
          >
            Add Account
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          The following accounts will receive email notifications for MyChart, Online Schedule and Online Payments.
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 600, fontSize: '0.8rem', color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' } }}>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id} sx={{ '& td': { fontSize: '0.85rem' } }}>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.firstName}</TableCell>
                <TableCell>{account.lastName}</TableCell>
              </TableRow>
            ))}

            {showAddRow && (
              <TableRow>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Email"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount((p) => ({ ...p, email: e.target.value }))}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="First Name"
                    value={newAccount.firstName}
                    onChange={(e) => setNewAccount((p) => ({ ...p, firstName: e.target.value }))}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      placeholder="Last Name"
                      value={newAccount.lastName}
                      onChange={(e) => setNewAccount((p) => ({ ...p, lastName: e.target.value }))}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleAddAccount}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, backgroundColor: NAVY, whiteSpace: 'nowrap' }}
                    >
                      Add
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => { setShowAddRow(false); setNewAccount({ email: '', firstName: '', lastName: '' }); }}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, whiteSpace: 'nowrap' }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {accounts.length === 0 && !showAddRow && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.85rem' }}>
                  No accounts added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default KioskAccountsView;
