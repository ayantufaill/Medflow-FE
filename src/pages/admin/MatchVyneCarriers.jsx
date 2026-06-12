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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectVyneOfficePayers,
  selectVynePayersList,
  selectVyneMatchedPayers,
  fetchVyneCarriersThunk,
  matchVyneCarrierThunk
} from '../../store/slices/insuranceSlice';
import { useEffect } from 'react';

// Reusable search field with blue icon prefix
const SearchField = ({ value, onChange, placeholder = "Search list", width = '100%' }) => (
  <TextField
    size="small"
    placeholder={placeholder}
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
      width: width,
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

const MatchVyneCarriers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [officeSearch, setOfficeSearch] = useState('');
  const [vyneSearch, setVyneSearch] = useState('');
  const [matchedSearch, setMatchedSearch] = useState('');
  const [isLiveData, setIsLiveData] = useState(false);

  // Fetch mock data from Redux
  const officePayers = useSelector(selectVyneOfficePayers);
  const vynePayers = useSelector(selectVynePayersList);
  const matchedPayers = useSelector(selectVyneMatchedPayers);

  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedVyne, setSelectedVyne] = useState(null);

  useEffect(() => {
    dispatch(fetchVyneCarriersThunk());
  }, [dispatch]);

  const handleMatch = () => {
    if (selectedOffice && selectedVyne) {
      dispatch(matchVyneCarrierThunk({
        officeName: selectedOffice.name,
        vyneName: selectedVyne.name,
        officeId: selectedOffice.id,
        vyneId: selectedVyne.id,
        vyneMasterId: 'MASTER-' + selectedVyne.id
      }));
      setSelectedOffice(null);
      setSelectedVyne(null);
    }
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 1, fontSize: '0.85rem', color: 'text.secondary' }}>
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
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>Match Vyne Carriers</Typography>
      </Breadcrumbs>

      {/* Live Data Checkbox */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={isLiveData}
              onChange={(e) => setIsLiveData(e.target.checked)}
              sx={{ p: 0.5 }}
            />
          }
          label={<Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Live data</Typography>}
        />
      </Box>

      {/* ─── Top Section: Office Payers + Vyne Payers side by side ─── */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        {/* Office Payers */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: '#4b71a1',
            textAlign: 'center',
            mb: 1,
          }}>
            Office Payers
          </Typography>
          <Box sx={{ mb: 1 }}>
            <SearchField value={officeSearch} onChange={(e) => setOfficeSearch(e.target.value)} />
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0, maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#1a3a6b', color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Payer Name</TableCell>
                  <TableCell sx={{ bgcolor: '#1a3a6b', color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Payer ID</TableCell>
                  <TableCell sx={{ bgcolor: '#1a3a6b', color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, width: 40 }} align="center">
                    <VisibilityIcon sx={{ fontSize: '0.9rem' }} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {officePayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 1, color: 'text.secondary', fontSize: '0.7rem', fontStyle: 'italic' }}>
                      No Data Available
                    </TableCell>
                  </TableRow>
                ) : (
                  officePayers.map((p, i) => (
                    <TableRow 
                      key={i} 
                      hover
                      onClick={() => setSelectedOffice(p)}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: selectedOffice?.id === p.id ? '#e3f2fd' : 'transparent',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.7rem', borderRight: '1px solid #eee' }}>{p.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', borderRight: '1px solid #eee' }}>{p.id}</TableCell>
                      <TableCell sx={{ py: 0 }} align="center">
                        <IconButton size="small">
                          <VisibilityIcon sx={{ fontSize: '0.85rem', color: '#4b71a1' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Vyne Payers */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: '#4b71a1',
            textAlign: 'center',
            mb: 1,
          }}>
            Vyne Payers <InfoIcon sx={{ fontSize: '0.9rem', verticalAlign: 'middle', color: 'text.secondary' }} />
          </Typography>
          <Box sx={{ mb: 1 }}>
            <SearchField value={vyneSearch} onChange={(e) => setVyneSearch(e.target.value)} />
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0, height: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#1a3a6b', color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Payer Name</TableCell>
                  <TableCell sx={{ bgcolor: '#1a3a6b', color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5 }}>Payer ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vynePayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 2, color: 'text.secondary', fontSize: '0.7rem', fontStyle: 'italic' }}>
                      No Payer Selected
                    </TableCell>
                  </TableRow>
                ) : (
                  vynePayers.map((p, i) => (
                    <TableRow 
                      key={i} 
                      hover
                      onClick={() => setSelectedVyne(p)}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: selectedVyne?.id === p.id ? '#e3f2fd' : 'transparent',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.7rem', borderRight: '1px solid #eee' }}>{p.name}</TableCell>
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <ActionButton variant="tan">Match Manually</ActionButton>
        <ActionButton onClick={handleMatch} disabled={!selectedOffice || !selectedVyne}>Match Payer</ActionButton>
        <ActionButton>Auto-Match</ActionButton>
      </Box>

      {/* ─── Matched Payers Section ─── */}
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#4b71a1', textAlign: 'center', mb: 2 }}>
          Matched Payers
        </Typography>
        <Box sx={{ mb: 1 }}>
          <SearchField 
            value={matchedSearch} 
            onChange={(e) => setMatchedSearch(e.target.value)} 
            width={220}
          />
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#1a3a6b' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Office Payer Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Office Payer ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Vyne Payer Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Vyne Payer ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem', py: 0.5 }}>Vyne Master ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matchedPayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 1, color: 'text.secondary', fontSize: '0.7rem', fontStyle: 'italic' }}>
                    No Data Available
                  </TableCell>
                </TableRow>
              ) : (
                matchedPayers.map((p, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontSize: '0.7rem', borderRight: '1px solid #eee' }}>{p.officeName}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', borderRight: '1px solid #eee' }}>{p.officeId}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', borderRight: '1px solid #eee' }}>{p.vyneName}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', borderRight: '1px solid #eee' }}>{p.vyneId}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem' }}>{p.vyneMasterId}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default MatchVyneCarriers;
