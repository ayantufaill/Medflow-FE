import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Tabs, 
  Tab
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const KpiDashboard = () => {
  const [subTab, setSubTab] = useState(0);

  const colors = {
    navy: '#1a3a6b',
    gold: '#bc9363',
    blue: '#1d4ed8',
    cyan: '#0891b2',
    greyBorder: '#cbd5e1',
    lightBg: '#f8fafc',
    textDark: '#1e293b',
    textMuted: '#64748b'
  };

  const months = [
    { label: 'May', year: '(2026)' },
    { label: 'April', year: '(2026)' },
    { label: 'March', year: '(2026)' },
    { label: 'February', year: '(2026)' },
    { label: 'January', year: '(2026)' },
    { label: 'December', year: '(2025)' },
    { label: 'November', year: '(2025)' },
    { label: 'October', year: '(2025)' },
    { label: 'September', year: '(2025)' },
    { label: 'August', year: '(2025)' },
    { label: 'July', year: '(2025)' },
    { label: 'June', year: '(2025)' }
  ];

  // Exactly matching metrics from the user's screenshots
  const groups = [
    {
      title: 'Production Metrics',
      rows: [
        { label: 'Gross Production', values: ['53,211.8', '126,204.15', '95,371.6', '120,460.6', '83,951.61', '59,632.35', '68,911.9', '80,970.39', '116,531.6', '93,017.25', '54,089.5', '76,617.7'] },
        { label: 'Doctor Gross Production', values: ['48,205.8', '111,595', '81,032.6', '92,614', '63,166.6', '46,069.45', '58,323.9', '68,562.39', '102,863.6', '89,097.25', '51,921.5', '65,517.7'] },
        { label: 'Hygiene Gross Production', values: ['5,006', '14,609.15', '14,339', '21,946.6', '14,885.01', '13,562.9', '10,588', '12,408', '13,668', '3,920', '2,168', '11,100'] }
      ]
    },
    {
      title: 'Net Production Metrics',
      rows: [
        { label: 'Net Production', values: ['41,383.8', '105,473.95', '80,630.94', '103,143.2', '69,207.01', '47,534.5', '59,776.9', '69,956.74', '95,045', '80,056.85', '42,425.5', '72,451.4'] },
        { label: 'Doctor Net Production', values: ['37,920.8', '94,778.85', '70,639.94', '82,843.2', '53,025.6', '37,547.4', '51,547.9', '60,405.54', '83,323.4', '76,735.65', '40,719.5', '63,066'] },
        { label: 'Hygiene Production', values: ['3,463', '10,695.1', '9,991', '15,100', '10,981.41', '9,987.1', '8,229', '9,551.2', '11,721.6', '3,321.2', '1,706', '9,385.4'] }
      ]
    },
    {
      title: 'Collection Metrics',
      rows: [
        { label: 'Gross Collection', values: ['42,823.71', '90,376.59', '106,284.47', '86,101.2', '69,548.35', '53,770.66', '53,271.42', '84,967.39', '89,710.87', '67,797.35', '42,598.62', '67,286.48'] },
        { label: 'Doctor Gross Collection', values: ['38,181.27', '78,271.21', '92,755.46', '71,262.89', '53,830.3', '44,140.26', '44,829.12', '76,384.47', '79,838.87', '66,557.1', '39,097.8', '58,236.85'] },
        { label: 'Hygiene Gross Collection', values: ['4,642.44', '12,105.38', '13,909.01', '10,856.33', '14,218.05', '9,630.4', '8,442.3', '8,582.92', '9,872', '1,240.25', '3,500.82', '9,049.63'] }
      ]
    },
    {
      title: 'Total Collection Metrics',
      rows: [
        { label: 'Total Collection', values: ['42,362.93', '89,273.33', '105,331.08', '85,691.25', '67,125.650', '51,783.060', '51,979.88', '82,307.87', '88,039.850', '66,483.85', '41,114.18', '66,711.380'] },
        { label: 'Doctor Collection', values: ['37,942.730', '77,292.75', '92,122.36', '70,960.69', '52,264.700', '42,152.66', '43,860.98', '73,882.87', '78,532.65', '65,243.600', '38,015.51', '57,835.35'] },
        { label: 'Hygiene Collection', values: ['4,420.2', '11,980.58', '13,208.720', '10,748.58', '13,360.950', '9,630.4', '8,118.9', '8,425', '9,507.2', '1,240.25', '3,098.67', '8,876.030'] }
      ]
    },
    {
      title: 'Patient & Exam Metrics',
      rows: [
        { label: 'Total Seen Patients', values: ['84', '112', '79', '94', '81', '87', '76', '89', '96', '100', '86', '70'] },
        { label: 'Total Exams Count', values: ['32', '46', '35', '45', '41', '44', '34', '36', '36', '50', '42', '32'] },
        { label: 'All Exam Diagnosed Procedures', values: ['75,714', '154,941.2', '108,385', '201,524', '188,651.000', '183,353.000', '147,005.950', '72,043.000', '200,658.95', '87,224', '62,317.300', '133,859.000'] },
        { label: 'Total Comprehensive Exams Count', values: ['8', '13', '9', '14', '12', '15', '12', '13', '12', '12', '10', '15'] },
        { label: 'Comprehensive Exam Diagnosed Procedures', values: ['47,503.000', '78,417.000', '33,891', '152,024', '95,444', '138,980', '107,365', '51,115', '137,918.350', '41,227', '46,943.000', '102,467.000'] },
        { label: 'Total Limited Exams Count', values: ['4', '3', '2', '1', '7', '5', '3', '3', '6', '12', '3', '2'] },
        { label: 'Limited Exam Diagnosed Procedures', values: ['5,786', '1,681.8', '8,093', '204', '43,638', '14,560', '6,031', '5,177', '19,040.600', '34,197', '2,246', '5,230'] },
        { label: 'Total Recare Exams Count', values: ['20', '30', '24', '30', '22', '24', '19', '20', '18', '26', '29', '15'] },
        { label: 'Recare Exam Diagnosed Procedures', values: ['22,425', '74,842.400', '74,494', '49,296', '49,569', '29,813', '33,609.95', '15,751', '11,800', '13,167.3', '26,162', '26,162'] },
        { label: 'Perio Percentage (%)', values: ['35', '32', '26', '27', '27', '28', '35', '42', '44', '42', '37', '42'] },
        { label: 'Exams Revenue Ratio (%)', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
      ]
    },
    {
      title: 'Case Diagnostic Metrics',
      rows: [
        { label: 'Diagnosed', values: ['15,988.6', '45,155.6', '16,786', '55,038.6', '51,062.8', '58,284.6', '55,060.2', '79,833.15', '40,154.8', '20,712.15', '39,122', '83,449.4'] },
        { label: 'Presented', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
        { label: 'Accepted', values: ['57,091.4', '141,668.1', '152,055.55', '62,719.7', '81,172.95', '62,506.75', '85,588.1', '25,934.2', '139,850.95', '94,638.4', '37,498.8', '116,192.9'] },
        { label: 'Rejected', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '5,200'] },
        { label: 'Future', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
        { label: 'FollowUp', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
        { label: 'Scheduled', values: ['34,478.1', '28,916.46', '25,815.9', '47,306.2', '36,918', '38,182.7', '16,615', '46,819.9', '44,591.55', '28,275.1', '28,400', '7,899.8'] },
        { label: 'Completed', values: ['30,939.8', '88,598', '59,665.9', '92,511.6', '58,561.41', '35,989.5', '49,893.9', '58,805.74', '84,151.2', '71,693.95', '30,460.2', '54,631.7'] }
      ]
    }
  ];

  const providerList = [
    {
      name: 'Christina Sabour',
      groups: [
        {
          title: 'Provider Production Metrics',
          rows: [
            { label: 'Provider Gross Production', values: ['48,205.8', '82,020', '55,932.6', '92,594', '63,166.6', '46,069.45', '58,323.9', '68,562.39', '102,863.6', '89,097.25', '51,921.5', '65,517.7'] },
            { label: 'Provider Net Production', values: ['37,920.8', '67,303.85', '46,239.94', '82,843.2', '53,025.6', '37,547.4', '51,547.9', '60,405.54', '83,323.4', '76,735.65', '40,719.5', '63,066'] },
            { label: 'Provider Total Collection', values: ['35,423.53', '56,373.63', '69,260.61', '70,960.69', '52,264.700', '42,152.66', '43,860.98', '73,882.87', '78,532.65', '65,243.600', '38,015.51', '57,835.35'] }
          ]
        },
        {
          title: 'Provider Appointment Metrics',
          rows: [
            { label: 'Provider Total Appointments', values: ['89', '121', '72', '93', '98', '87', '86', '108', '134', '119', '105', '77'] },
            { label: 'Provider Seen Patients', values: ['72', '94', '61', '68', '77', '77', '71', '88', '94', '96', '86', '59'] }
          ]
        },
        {
          title: 'Provider Work Efficiency Metrics',
          rows: [
            { label: 'Provider Working Hours', values: ['441', '532', '143', '144', '130', '123', '123', '146', '161', '111', '134', '156'] },
            { label: 'Provider Production Per Visit', values: ['424.95', '564.38', '585.32', '996', '645', '530', '678', '635', '768', '749', '494', '851'] },
            { label: 'Provider Scheduled Production', values: ['37,956.8', '45,717.7', '30,519.94', '79,037.2', '51,467.2', '35,600.6', '44,791.9', '57,842.74', '82,303.8', '69,754.75', '39,840.3', '62,613.8'] },
            { label: 'Provider Hourly Production', values: ['85.71', '126.12', '340', '0', '0', '0', '0', '175', '573', '0', '184', '0'] }
          ]
        },
        {
          title: 'Provider Treatment Metrics',
          rows: [
            { label: 'Provider Same Day Treatment', values: ['3,182', '26,531', '18,599', '15,556', '11,071', '4,838', '9,321', '2,680', '2,670', '12,811', '3,562', '10,787'] }
          ]
        }
      ]
    },
    {
      name: 'Sabour Ortho',
      groups: [
        {
          title: 'Provider Production Metrics',
          rows: [
            { label: 'Provider Gross Production', values: ['0', '29,500', '25,100', '5,900', '5,900', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Net Production', values: ['0', '27,400', '24,400', '5,200', '5,200', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Total Collection', values: ['2,519.2', '20,844.12', '22,861.75', '3,981.98', '1,500', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Provider Appointment Metrics',
          rows: [
            { label: 'Provider Total Appointments', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Seen Patients', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Provider Work Efficiency Metrics',
          rows: [
            { label: 'Provider Working Hours', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Production Per Visit', values: ['0', '0', '308.86', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Scheduled Production', values: ['0', '0', '24,400', '10,400', '5,200', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Hourly Production', values: ['0', '0', '138.64', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Provider Treatment Metrics',
          rows: [
            { label: 'Provider Same Day Treatment', values: ['0', '26,700', '24,400', '5,199', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Reappointment Metrics',
          rows: [
            { label: 'Treatment Reappointment Per Dentist (%)', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        }
      ]
    },
    {
      name: 'TDS Doc',
      groups: [
        {
          title: 'Provider Production Metrics',
          rows: [
            { label: 'Provider Gross Production', values: ['0', '75', '0', '20', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Net Production', values: ['0', '75', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Total Collection', values: ['0', '75', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Provider Appointment Metrics',
          rows: [
            { label: 'Provider Total Appointments', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Seen Patients', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Provider Work Efficiency Metrics',
          rows: [
            { label: 'Provider Working Hours', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Production Per Visit', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Scheduled Production', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Hourly Production', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Provider Treatment Metrics',
          rows: [
            { label: 'Provider Same Day Treatment', values: ['0', '75', '0', '20', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Reappointment Metrics',
          rows: [
            { label: 'Treatment Reappointment Per Dentist (%)', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        }
      ]
    },
    {
      name: 'Zoe Niblock',
      groups: [
        {
          title: 'Provider Production Metrics',
          rows: [
            { label: 'Provider Gross Production', values: ['5,006', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Net Production', values: ['3,463', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Total Collection', values: ['2,032.4', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Provider Appointment Metrics',
          rows: [
            { label: 'Provider Total Appointments', values: ['2', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Seen Patients', values: ['2', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Provider Work Efficiency Metrics',
          rows: [
            { label: 'Provider Working Hours', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Production Per Visit', values: ['1,731.5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Scheduled Production', values: ['3,350', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] },
            { label: 'Provider Hourly Production', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Provider Treatment Metrics',
          rows: [
            { label: 'Provider Same Day Treatment', values: ['3,007', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        },
        {
          title: 'Reappointment Metrics',
          rows: [
            { label: 'Hygiene Reappointment Per Hygienist (%)', values: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] }
          ]
        }
      ]
    }
  ];

  const renderTable = (activeGroupsList, providerName = null) => {
    return (
      <Box sx={{ mb: 6 }}>
        {providerName && (
          <Box sx={{ mb: 2, pl: 0.5 }}>
            <Typography 
              sx={{ 
                color: '#1d4ed8', 
                fontWeight: 600, 
                fontSize: '0.88rem', 
                cursor: 'pointer', 
                textDecoration: 'underline',
                display: 'inline-block',
                '&:hover': {
                  color: '#1a3a6b'
                }
              }}
            >
              {providerName}
            </Typography>
          </Box>
        )}

        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: 'none', 
            border: '1px solid #e2e8f0', 
            borderRadius: '4px', 
            width: '100%',
            overflowX: 'auto'
          }}
        >
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#ffffff' }}>
                <TableCell sx={{ borderBottom: '1.5px solid #cbd5e1', width: 220 }} />
                {months.map((m, idx) => (
                  <TableCell 
                    key={idx} 
                    align="right" 
                    sx={{ 
                      borderBottom: '1.5px solid #cbd5e1', 
                      py: 1.5,
                      px: 1,
                      minWidth: 85
                    }}
                  >
                    <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: colors.textDark }}>
                      {m.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.66rem', color: colors.textMuted }}>
                      {m.year}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {activeGroupsList.map((group, groupIdx) => (
                <React.Fragment key={groupIdx}>
                  {group.rows.map((row, rowIdx) => (
                    <TableRow 
                      key={rowIdx} 
                      sx={{ 
                        '&:hover': { backgroundColor: '#f8fafc' }
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          borderBottom: '1px solid #e2e8f0',
                          py: 1,
                          pl: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.8
                        }}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: '0.88rem', color: '#94a3b8', cursor: 'pointer' }} />
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                          {row.label}
                        </Typography>
                      </TableCell>
                      {row.values.map((val, valIdx) => (
                        <TableCell 
                          key={valIdx} 
                          align="right" 
                          sx={{ 
                            borderBottom: '1px solid #e2e8f0',
                            py: 1,
                            px: 1,
                            fontSize: '0.78rem',
                            color: '#475569',
                            fontWeight: 500
                          }}
                        >
                          {val}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {/* Spacer row between metric groups */}
                  {groupIdx < activeGroupsList.length - 1 && (
                    <TableRow sx={{ height: 16, backgroundColor: '#ffffff' }}>
                      <TableCell colSpan={13} sx={{ borderBottom: '1px solid #e2e8f0', py: 0.5 }} />
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Sub tabs configuration */}
      <Box sx={{ borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Tabs
          value={subTab}
          onChange={(e, v) => setSubTab(v)}
          sx={{
            minHeight: 'auto',
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab
            label="Main Dashboard"
            sx={{
              textTransform: 'none',
              fontWeight: subTab === 0 ? 600 : 500,
              fontSize: '0.85rem',
              color: subTab === 0 ? '#1a3a6b' : '#8898aa',
              backgroundColor: subTab === 0 ? '#ffffff' : 'transparent',
              borderTop: subTab === 0 ? '3px solid #1a3a6b' : '3px solid transparent',
              borderLeft: subTab === 0 ? '1px solid #e2e8f0' : 'none',
              borderRight: subTab === 0 ? '1px solid #e2e8f0' : 'none',
              borderBottom: subTab === 0 ? '1px solid #ffffff' : 'none',
              borderRadius: '4px 4px 0 0',
              minHeight: 40,
              px: 3.5,
              mr: 1,
              position: 'relative',
              top: '1px',
              zIndex: subTab === 0 ? 2 : 1,
            }}
          />
          <Tab
            label="Provider Dashboard"
            sx={{
              textTransform: 'none',
              fontWeight: subTab === 1 ? 600 : 500,
              fontSize: '0.85rem',
              color: subTab === 1 ? '#1a3a6b' : '#8898aa',
              backgroundColor: subTab === 1 ? '#ffffff' : 'transparent',
              borderTop: subTab === 1 ? '3px solid #1a3a6b' : '3px solid transparent',
              borderLeft: subTab === 1 ? '1px solid #e2e8f0' : 'none',
              borderRight: subTab === 1 ? '1px solid #e2e8f0' : 'none',
              borderBottom: subTab === 1 ? '1px solid #ffffff' : 'none',
              borderRadius: '4px 4px 0 0',
              minHeight: 40,
              px: 3.5,
              position: 'relative',
              top: '1px',
              zIndex: subTab === 1 ? 2 : 1,
            }}
          />
        </Tabs>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mb: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#e55353',
            color: '#fff',
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            px: 3,
            py: 0.7,
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#d14343',
              boxShadow: 'none'
            }
          }}
        >
          Print
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#4a77bc',
            color: '#fff',
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            px: 3,
            py: 0.7,
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#3b629b',
              boxShadow: 'none'
            }
          }}
        >
          Export As CSV
        </Button>
      </Box>

      {/* Dashboard Tables */}
      {subTab === 0 ? (
        renderTable(groups)
      ) : (
        providerList.map((provider) => (
          <React.Fragment key={provider.name}>
            {renderTable(provider.groups, provider.name)}
          </React.Fragment>
        ))
      )}

      {/* Footer info text */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', px: 2 }}>
        <Typography sx={{ fontSize: '0.74rem', color: colors.textMuted, fontWeight: 500 }}>
          Babar Magsi
        </Typography>
      </Box>
    </Box>
  );
};

export default KpiDashboard;
