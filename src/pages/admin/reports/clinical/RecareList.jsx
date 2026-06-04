import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  IconButton,
  Pagination
} from '@mui/material';
import { Search, Print, FileDownload, ClearAll, FilterAlt, Add } from '@mui/icons-material';

const RecareList = () => {
  const [filterType, setFilterType] = useState('range');
  const [dentist, setDentist] = useState('None');
  const [hygienist, setHygienist] = useState('None');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [flagFilter, setFlagFilter] = useState('both');
  const [showFlags, setShowFlags] = useState(true);

  // Mock data for the table
  const rows = [
    {
      id: 1,
      patient: 'Patient A',
      flags: 'red',
      age: 37,
      contact: '(555) 123-4567',
      recallDate: '05/24/2026',
      lastExam: '02/24/2026',
      lastProphy: '02/24/2026',
      lastMaintenance: '',
      lastComm: '',
      note: 'left message to schedule recare apt',
      contactAgain: 'Y',
      followUp: '',
      apptDate: '',
      contactCount: 1
    },
    {
      id: 2,
      patient: 'Patient B',
      flags: '',
      age: 54,
      contact: '(555) 987-6543',
      recallDate: '05/18/2026',
      lastExam: '11/18/2025',
      lastProphy: '11/18/2025',
      lastMaintenance: '',
      lastComm: '',
      note: '',
      contactAgain: 'Y',
      followUp: '',
      apptDate: '',
      contactCount: 0
    },
    {
      id: 3,
      patient: 'Patient C',
      flags: '',
      age: 44,
      contact: '(555) 456-7890',
      recallDate: '05/13/2026',
      lastExam: '11/13/2025',
      lastProphy: '11/13/2025',
      lastMaintenance: '',
      lastComm: '',
      note: '',
      contactAgain: 'Y',
      followUp: '',
      apptDate: '',
      contactCount: 0
    }
  ];

  const filteredRows = useMemo(() => {
    let result = rows;
    if (searchPatient) {
      result = result.filter(r => r.patient.toLowerCase().includes(searchPatient.toLowerCase()));
    }
    if (startDate || endDate) {
      const s = startDate ? new Date(startDate) : new Date('1900-01-01');
      const e = endDate ? new Date(endDate) : new Date('2100-01-01');
      result = result.filter(r => {
        const d = new Date(r.recallDate);
        return d >= s && d <= e;
      });
    }
    if (flagFilter === 'with') {
      result = result.filter(r => !!r.flags);
    } else if (flagFilter === 'without') {
      result = result.filter(r => !r.flags);
    }
    return result;
  }, [searchPatient, startDate, endDate, flagFilter]);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Patient,Flags,Age,Contact,Recall Date,Last Exam,Last Prophy,Last Main,Last Comm,Contact Again,Follow up,Appt Date,Count\n";
    filteredRows.forEach(row => {
      csvContent += `"${row.patient}","${row.flags}","${row.age}","${row.contact}","${row.recallDate}","${row.lastExam}","${row.lastProphy}","${row.lastMaintenance}","${row.lastComm}","${row.contactAgain}","${row.followUp}","${row.apptDate}","${row.contactCount}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "recare_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#fdfcfb' }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Filters:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
          <RadioGroup 
            row 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography variant="body2">Range</Typography>} />
            <FormControlLabel value="monthly" control={<Radio size="small" />} label={<Typography variant="body2">Monthly</Typography>} />
          </RadioGroup>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" color="primary" sx={{ mr: 0.5 }}>From:</Typography>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '4px', border: '1px solid #ccc', fontSize: '0.8rem' }} />
            <Typography variant="body2" color="primary" sx={{ ml: 1, mr: 0.5 }}>To:</Typography>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '4px', border: '1px solid #ccc', fontSize: '0.8rem' }} />
          </Box>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Dentist</InputLabel>
            <Select value={dentist} label="Dentist" onChange={(e) => setDentist(e.target.value)}>
              <MenuItem value="None">None</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Hygienist</InputLabel>
            <Select value={hygienist} label="Hygienist" onChange={(e) => setHygienist(e.target.value)}>
              <MenuItem value="None">None</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel 
            control={<Checkbox size="small" />} 
            label={<Typography variant="body2">Include Appointed</Typography>} 
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={flagFilter} onChange={(e) => setFlagFilter(e.target.value)}>
              <MenuItem value="both">Pts With Or Without Flags</MenuItem>
              <MenuItem value="with">Pts With Flags</MenuItem>
              <MenuItem value="without">Pts Without Flags</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel 
            control={<Checkbox checked={showFlags} onChange={(e) => setShowFlags(e.target.checked)} size="small" />} 
            label={<Typography variant="body2">Show Flags in Report</Typography>} 
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Filter by Patient:</Typography>
            <TextField 
              size="small" 
              placeholder="Search Patient" 
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              sx={{ width: 250 }}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="text" size="small" onClick={() => { setSearchPatient(''); setStartDate(''); setEndDate(''); }} sx={{ textTransform: 'none', color: 'error.main' }}>Clear all filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', backgroundColor: '#d1a066' }}>Create Template</Button>
            <Button variant="contained" size="small" onClick={handlePrint} sx={{ textTransform: 'none', backgroundColor: '#4a90e2' }} startIcon={<Print />}>Print</Button>
            <Button variant="contained" size="small" onClick={handleExportCSV} sx={{ textTransform: 'none', backgroundColor: '#d1a066' }} startIcon={<FileDownload />}>Export as CSV</Button>
          </Box>
        </Box>
      </Paper>

      <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 2 }}>({rows.length} Patient/s)</Typography>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Flags</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Recall Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Exam</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Prophy</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Main.</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Comm.</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Note</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Contact Again</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Follow up</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Appt Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Count</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Reset</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 600 }}>{row.patient}</TableCell>
                <TableCell>
                  {showFlags && row.flags === 'red' && <Box sx={{ width: 12, height: 12, backgroundColor: 'error.main', borderRadius: '2px' }} />}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.age}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#4a90e2' }}>{row.contact}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.recallDate}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastExam}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastProphy}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastMaintenance}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastComm}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', maxWidth: 150 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" sx={{ color: '#4a90e2', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Add sx={{ fontSize: 14, mr: 0.5 }} /> Add note
                    </Typography>
                    {row.note && (
                      <Box sx={{ mt: 1, p: 1, backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem' }}>{row.note}</Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.contactAgain}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.followUp}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.apptDate}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.contactCount}</TableCell>
                <TableCell>
                  <Button size="small" variant="contained" sx={{ fontSize: '0.65rem', p: '2px 8px', backgroundColor: '#d1a066' }}>Reset</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={1} size="small" variant="outlined" shape="rounded" />
      </Box>
    </Box>
  );
};

export default RecareList;
