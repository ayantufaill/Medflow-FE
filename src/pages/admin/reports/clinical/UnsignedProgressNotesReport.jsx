import React, { useState } from 'react';
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
  Divider,
  Collapse,
  IconButton
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, FileDownload, Print } from '@mui/icons-material';

const UnsignedProgressNotesReport = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [signedExpandedRow, setSignedExpandedRow] = useState(null);

  const rows = [
    { id: 1, patient: 'Francis Fuller', date: '05/07/2026', kind: 'Exam', provider: 'Dr. Smith', note: 'CC: "I have a broken tooth #31". Patient had veneers done March of 2026 in Smile Texas in Houston with Dr. Mackenzie McAfee-Dooley, #\'s 4-13 and 20-29. Patient had his jaw broken in 2017 and now has a chain on right side mandible. He started to notice pain about 2-3 months ago on tooth #31. Last dental cleaning was a year ago, is now looking for a general dentist in DFW as he has recently moved to the area from Houston.' },
    { id: 2, patient: 'John Doe', date: '05/07/2026', kind: 'Recare', provider: 'Hygienist A', note: '' },
    { id: 3, patient: 'Jane Smith', date: '05/05/2026', kind: 'Recare', provider: 'Hygienist B', note: '' },
    { id: 4, patient: 'Robert Brown', date: '05/07/2026', kind: 'Conversation', provider: 'Dr. Smith', note: '' },
    { id: 5, patient: 'Mary Johnson', date: '05/07/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 6, patient: 'William White', date: '05/07/2026', kind: 'Recare', provider: 'Hygienist A', note: '' },
    { id: 7, patient: 'Patricia Black', date: '05/06/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 8, patient: 'Michael Gray', date: '05/05/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 9, patient: 'Linda Green', date: '05/07/2026', kind: 'Recare', provider: 'Hygienist B', note: '' },
    { id: 10, patient: 'Barbara Brown', date: '05/06/2026', kind: 'Treatment', provider: 'Dr. Smith', note: '' },
    { id: 11, patient: 'James Wilson', date: '05/08/2026', kind: 'General', provider: 'Dr. Smith', note: '' },
  ];

  const signedRows = [
    { 
      id: 101, 
      patient: 'Patient X', 
      date: '04/13/2026', 
      kind: 'General', 
      provider: 'Dr. Smith',
      note: `bal on account -Two payments have been received and successfully posted for this claim:
• First Payment
Pending Date: 03/04/2025
Paid Amount: $750 (via Bulk Check)
Issued Date: 03/07/2025
Cashed Date: 03/20/2025
Claim #...

• Second Payment
For Payment Date: 09/01/2025
Paid Amount: $750 (Check)
Issued Date: 09/26/2025
Cashed Date: 10/07/2025
Claim #...

According to the payment schedule, the plan included a 6-month late payment period. The total lifetime orthodontic benefit was $2250, out of which $1500 has been paid, leaving a remaining balance of $750. However, the policy became inactive on 12/01/2025. Upon re-verification on 03/25/2026, the policy remains inactive. Therefore, no further payments are expected. Kindly advise if we should proceed with writing off the remaining balance of $750 and close the claim, or you will collect remaining $750 from patient?

Reference Details:
Rep B...
Rep H...
Rep C...
Thank you. YF`
    },
    { id: 102, patient: 'Patient Y', date: '04/21/2026', kind: 'Recare', provider: 'Hygienist A', note: '' },
    { id: 103, patient: 'Patient Z', date: '04/24/2026', kind: 'Conversation', provider: 'Dr. Smith', note: '' },
    { id: 104, patient: 'Patient W', date: '04/23/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 105, patient: 'Patient V', date: '04/14/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 106, patient: 'Patient U', date: '04/15/2026', kind: 'Recare', provider: 'Hygienist A', note: '' },
    { id: 107, patient: 'Patient T', date: '04/27/2026', kind: 'Conversation', provider: 'Dr. Smith', note: '' },
  ];

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleSignedRowClick = (id) => {
    setSignedExpandedRow(signedExpandedRow === id ? null : id);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', mb: 2, cursor: 'pointer', display: 'inline-block' }}>
        Unsigned Progress Notes Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <TextField 
          label="Start Date" 
          defaultValue="04/08/2026" 
          size="small" 
          variant="standard"
          sx={{ width: 150 }}
        />
        <TextField 
          label="End Date" 
          defaultValue="05/08/2026" 
          size="small" 
          variant="standard"
          sx={{ width: 150 }}
        />
        <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Kind</InputLabel>
          <Select defaultValue="All" label="Kind">
            <MenuItem value="All">All</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Provider</InputLabel>
          <Select defaultValue="All" label="Provider">
            <MenuItem value="All">All</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
        <Box>
          <FormControlLabel 
            value="filter" 
            control={<Radio size="small" />} 
            label={<Typography variant="caption" color="text.secondary">Filter Codes</Typography>} 
          />
          <TextField placeholder="Enter code or procedure" size="small" variant="standard" sx={{ width: 180, ml: 3 }} />
        </Box>
        <Box>
          <FormControlLabel 
            value="exclude" 
            checked
            control={<Radio size="small" />} 
            label={<Typography variant="caption" color="text.secondary">Enter Codes to Exclude</Typography>} 
          />
          <TextField placeholder="Enter code or procedure" size="small" variant="standard" sx={{ width: 180, ml: 3 }} />
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Button variant="contained" size="small" sx={{ backgroundColor: '#8db3d9', textTransform: 'none', px: 3 }}>Apply</Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: '#d1a066' }} />

      {/* Export Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <Button variant="contained" size="small" startIcon={<FileDownload />} sx={{ backgroundColor: '#4a90e2', textTransform: 'none' }}>Export as CSV</Button>
        <Button variant="contained" size="small" startIcon={<Print />} sx={{ backgroundColor: '#d1a066', textTransform: 'none' }}>Print</Button>
      </Box>

      {/* Missing Notes Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="subtitle2" fontWeight={600} color="#1a3a6b" sx={{ mb: 2 }}>
          Completed Procedures with Missing Progress Notes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No Data Found
        </Typography>
      </Box>

      {/* Unsigned Notes Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="subtitle2" fontWeight={600} color="#1a3a6b" sx={{ mb: 2 }}>
          Unsigned Progress Notes
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Created Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Kind</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Provider</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow 
                    onClick={() => handleRowClick(row.id)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b' }}>{row.patient}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.kind}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.provider}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'text.secondary' }}>
                        {expandedRow === row.id ? <KeyboardArrowUp sx={{ fontSize: 18 }} /> : <KeyboardArrowDown sx={{ fontSize: 18 }} />}
                        <Typography variant="caption" sx={{ ml: 0.5 }}>View Note</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0, borderBottom: expandedRow === row.id ? '1px solid rgba(224, 224, 224, 1)' : 'none' }}>
                      <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: '#fff' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.6, flex: 1, whiteSpace: 'pre-line' }}>
                              {row.note || 'No note content available.'}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                              <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                Sign Progress Note
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>NV:</Typography>
                              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Franco RDA</Typography>
                              <Button variant="contained" size="small" sx={{ backgroundColor: '#d1a066', textTransform: 'none', fontSize: '0.7rem' }}>Edit Note</Button>
                            </Box>
                            <Typography variant="caption" color="text.secondary">Babar Magsi</Typography>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Signed Notes Section */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} color="#1a3a6b" sx={{ mb: 2 }}>
          Signed Progress Notes
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Created Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Kind</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Provider</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {signedRows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow 
                    onClick={() => handleSignedRowClick(row.id)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b' }}>{row.patient}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.kind}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.provider}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'text.secondary' }}>
                        {signedExpandedRow === row.id ? <KeyboardArrowUp sx={{ fontSize: 18 }} /> : <KeyboardArrowDown sx={{ fontSize: 18 }} />}
                        <Typography variant="caption" sx={{ ml: 0.5 }}>View Note</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0, borderBottom: signedExpandedRow === row.id ? '1px solid rgba(224, 224, 224, 1)' : 'none' }}>
                      <Collapse in={signedExpandedRow === row.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: '#fff' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                            {row.note || 'This is a signed progress note. Content is locked for editing.'}
                          </Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default UnsignedProgressNotesReport;
