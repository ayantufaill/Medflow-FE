import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  InputAdornment,
  Paper,
  IconButton,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectConvertedOldPayers,
  selectConvertedOryxPayers,
  selectConvertedMatchedPayers,
  fetchConvertedCarriersThunk,
  matchConvertedCarrierThunk,
  clearConvertedMatchesThunk
} from '../../store/slices/insuranceSlice';
import { useEffect } from 'react';

// Reusable search field with blue icon prefix
const SearchField = ({ value, onChange }) => (
  <TextField
    size="small"
    placeholder="Search list"
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start" sx={{ m: 0 }}>
          <Box sx={{
            bgcolor: '#1a3a6b',
            height: 28,
            width: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: -1.75,
            borderRadius: '3px 0 0 3px',
          }}>
            <SearchIcon sx={{ fontSize: '0.85rem', color: '#fff' }} />
          </Box>
        </InputAdornment>
      ),
    }}
    sx={{
      width: '100%',
      '& .MuiOutlinedInput-root': {
        height: 28,
        bgcolor: '#fff',
        pl: 1.5,
        fontSize: '0.75rem',
        '& fieldset': { borderColor: '#ccc' },
      },
    }}
  />
);

// Styled action button
const ActionButton = ({ children, variant = 'blue', onClick, disabled, sx: extraSx = {} }) => (
  <Button
    variant="contained"
    onClick={onClick}
    disabled={disabled}
    sx={{
      textTransform: 'none',
      fontSize: '0.65rem',
      fontWeight: 600,
      px: 1.5,
      py: 0.3,
      minHeight: 24,
      lineHeight: 1.4,
      bgcolor: variant === 'tan' ? '#d4c9a8' : '#4b71a1',
      color: variant === 'tan' ? '#333' : '#fff',
      '&:hover': {
        bgcolor: variant === 'tan' ? '#c4b998' : '#3d5c85',
      },
      boxShadow: 'none',
      borderRadius: '3px',
      ...extraSx,
    }}
  >
    {children}
  </Button>
);

const MatchConvertedCarriers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [oldSearch, setOldSearch] = useState('');
  const [oryxSearch, setOryxSearch] = useState('');
  const [testRealmUrl, setTestRealmUrl] = useState('https://test.local-ofe.com/fhirservlet/onyx/v1/');

  // Fetch mock data from Redux
  const oldPayers = useSelector(selectConvertedOldPayers);
  const oryxPayers = useSelector(selectConvertedOryxPayers);
  const matchedPayers = useSelector(selectConvertedMatchedPayers);
  
  const [selectedOld, setSelectedOld] = useState(null);
  const [selectedOryx, setSelectedOryx] = useState(null);

  useEffect(() => {
    dispatch(fetchConvertedCarriersThunk());
  }, [dispatch]);

  const handleMatch = () => {
    if (selectedOld && selectedOryx) {
      dispatch(matchConvertedCarrierThunk({
        oldName: selectedOld.name,
        oryxName: selectedOryx.name,
        oldId: selectedOld.id,
        oryxId: selectedOryx.id
      }));
      setSelectedOld(null);
      setSelectedOryx(null);
    }
  };

  const handleClear = () => {
    dispatch(clearConvertedMatchesThunk());
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3, fontSize: '0.85rem', color: 'text.secondary' }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin/insurance-management');
          }}
          sx={{ cursor: 'pointer' }}
        >
          Insurance Management
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>Match Converted Carriers</Typography>
      </Breadcrumbs>

      {/* ─── Top Section: Old Payers + Oryx Payers side by side ─── */}
      <Box sx={{ display: 'flex', gap: 4, mb: 6 }}>
        {/* Old Payers */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: '#1a3a6b',
            textAlign: 'center',
            mb: 1,
          }}>
            Old Payers
          </Typography>
          <Box sx={{ mb: 1 }}>
            <SearchField value={oldSearch} onChange={(e) => setOldSearch(e.target.value)} />
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#1a3a6b' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Payer Name</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Payer ID</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5 }}>Patients IDs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {oldPayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 1, color: 'text.secondary', fontSize: '0.7rem', fontStyle: 'italic' }}>
                      No Data Available
                    </TableCell>
                  </TableRow>
                ) : (
                  oldPayers.map((p, i) => (
                    <TableRow 
                      key={i} 
                      onClick={() => setSelectedOld(p)}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: selectedOld?.id === p.id ? '#e3f2fd' : 'transparent',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.7rem' }}>{p.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{p.id}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{p.patientIds}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Oryx Payers */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: '#1a3a6b',
            textAlign: 'center',
            mb: 1,
          }}>
            Oryx Payers
          </Typography>
          <Box sx={{ mb: 1 }}>
            <SearchField value={oryxSearch} onChange={(e) => setOryxSearch(e.target.value)} />
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#1a3a6b' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Payer Name</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5 }}>Payer ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {oryxPayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 1, color: 'text.secondary', fontSize: '0.7rem', fontStyle: 'italic' }}>
                      No Payer Selected
                    </TableCell>
                  </TableRow>
                ) : (
                  oryxPayers.map((p, i) => (
                    <TableRow 
                      key={i}
                      onClick={() => setSelectedOryx(p)}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: selectedOryx?.id === p.id ? '#e3f2fd' : 'transparent',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.7rem' }}>{p.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem' }}>{p.id}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* ─── Middle Section: Action Buttons ─── */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', justifyContent: 'center' }}>
          <ActionButton variant="tan">Match Manually</ActionButton>
          <ActionButton onClick={handleMatch} disabled={!selectedOld || !selectedOryx}>Match Payer</ActionButton>
          <ActionButton>Create Patient Policies</ActionButton>
          <ActionButton>Update Matched Payer Names</ActionButton>
          <ActionButton>Update Matched Payers Metadata</ActionButton>
          <ActionButton>Populate Matches using metadata</ActionButton>
          <ActionButton>Match Plans</ActionButton>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ActionButton>Set Insurance Payer Code</ActionButton>
      </Box>

      {/* ─── Matched Payers Section ─── */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1, position: 'relative' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a3a6b' }}>Matched Payers</Typography>
          <Box
            component="button"
            onClick={handleClear}
            sx={{
              position: 'absolute',
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#d32f2f',
              fontSize: '0.7rem',
              fontWeight: 500,
            }}
          >
            Delete all
            <DeleteIcon sx={{ fontSize: '0.85rem', color: '#d32f2f' }} />
          </Box>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#1a3a6b' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Old Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Oryx Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Old ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5 }}>Oryx ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matchedPayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 1, color: 'text.secondary', fontSize: '0.7rem', fontStyle: 'italic' }}>
                    No Data Available
                  </TableCell>
                </TableRow>
              ) : (
                matchedPayers.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{p.oldName}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{p.oryxName}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{p.oldId}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{p.oryxId}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ─── Migrate Payer Matches Section ─── */}
      <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3, textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a3a6b', mb: 2 }}>
          Migrate Payer Matches from Test Realm
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            value={testRealmUrl}
            onChange={(e) => setTestRealmUrl(e.target.value)}
            sx={{
              width: 340,
              '& .MuiOutlinedInput-root': {
                height: 28,
                bgcolor: '#fff',
                fontSize: '0.75rem',
                '& fieldset': { borderColor: '#ccc' },
              },
            }}
          />
          <ActionButton variant="tan">Fetch Payer Matches</ActionButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MatchConvertedCarriers;
