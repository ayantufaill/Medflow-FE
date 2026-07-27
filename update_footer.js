const fs = require('fs');

const path = '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/reports/financial/ProductionReportTable.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import InfoOutlinedIcon')) {
  content = content.replace(
    "import PrintIcon from '@mui/icons-material/Print';",
    "import PrintIcon from '@mui/icons-material/Print';\nimport InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';\nimport { Tooltip, Grid } from '@mui/material';"
  );
}

const footerBlock = `
      {/* Footer Summary */}
      <Box sx={{ mt: 3, ml: 4, mb: 4 }} id="production-report-footer">
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: '#1e293b' }}>
                <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600, width: '140px' }}>Gross Production:</Box> 
                <Box component="span" sx={{ fontWeight: 700 }}>$\{(totalCharge).toFixed(2)}</Box>
                <Tooltip title="Total charge amount">
                  <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />
                </Tooltip>
              </Typography>
              
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: '#1e293b' }}>
                <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600, width: '140px' }}>Net est. Production:</Box> 
                <Box component="span" sx={{ fontWeight: 700 }}>
                  Total Charge + Adj(+/-) - Est Write Off = $\{netProduction.toFixed(2)}
                </Box>
                <Tooltip title="Total Charge + Adjustments - Estimated Write Off">
                  <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />
                </Tooltip>
              </Typography>

              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: '#1e293b' }}>
                <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600, width: '140px' }}>Number of Seen Patients:</Box> 
                <Box component="span" sx={{ fontWeight: 700 }}>\{seenPatients}</Box>
              </Typography>

              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: '#1e293b' }}>
                <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600, width: '140px' }}>Average Production Per Patient:</Box> 
                <Box component="span" sx={{ fontWeight: 700 }}>$\{(seenPatients > 0 ? netProduction / seenPatients : 0).toFixed(2)}</Box>
              </Typography>
            </Box>
          </Grid>

          {/* Center Column */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: '#1e293b' }}>
              <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600, mr: 2 }}>Collection Percentage:</Box> 
              <Box component="span" sx={{ fontWeight: 700 }}>
                (Total Collection + Collection Adjustment) / Net est. Production * 100 = \{netProduction !== 0 ? (((totalPtPay + totalInsPay + totalCollAdj) / netProduction) * 100).toFixed(2) : '0.00'}%
              </Box>
            </Typography>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {[
                { label: 'Total Collection Incl. Pay From Credit:', val: totalPtPay + totalInsPay + totalPayFromCred },
                { label: 'Total Collection Excl. Pay From Credit:', val: totalPtPay + totalInsPay },
                { label: 'Collection From Credit:', val: totalPayFromCred },
                { label: 'Total Prepayments:', val: 0 },
                { label: 'Total Prepayments Excluding Refunds:', val: 0 },
                { label: 'Actual Write-Off:', val: totalActualWO },
                { label: 'Total Collection Adjustments:', val: totalCollAdj },
                { label: 'Total Production Adjustments:', val: totalAdj },
                { label: 'Adjusted Collection Incl. Pay From Credit:', val: totalPtPay + totalInsPay + totalPayFromCred + totalCollAdj },
                { label: 'Adjusted Collection Excl. Pay From Credit:', val: totalPtPay + totalInsPay + totalCollAdj },
                { label: 'Total Patient Refund:', val: totalPtRef },
                { label: 'Total Insurance Refund:', val: totalInsRef },
                { label: 'Total Overpayment to Credit:', val: totalOverpay },
                { label: 'Total Deposit Slip:', val: totalPtPay + totalInsPay },
                { label: 'Total Patient Income:', val: totalPtPay },
                { label: 'Total Insurance Income:', val: totalInsPay },
                { label: 'Total Adjustments:', val: totalAdj },
              ].map((item, idx) => (
                <Typography key={idx} variant="caption" sx={{ display: 'flex', alignItems: 'center', color: '#1e293b' }}>
                  <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600, width: '250px' }}>{item.label}</Box> 
                  <Box component="span" sx={{ fontWeight: 700 }}>$\{item.val.toFixed(2)}</Box>
                  <Tooltip title={item.label.replace(':', '')}>
                    <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: '#94a3b8' }} />
                  </Tooltip>
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
`;

const oldFooterEmpty = `        {/* Footer Summary */}
        <Box sx={{ mt: 3, ml: 4 }} id="production-report-footer">
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: '#475569' }}>
            <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600 }}>Net est. Production:</Box> 
            <Box component="span" sx={{ ml: 2, fontWeight: 700, color: '#1e293b' }}>
              Total Charge + Adj(+/-) - Est Write Off = \${netProduction.toFixed(2)}
            </Box>
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#475569' }}>
            Number of Seen Patients: <Box component="span" sx={{ ml: 2, fontWeight: 700, color: '#1e293b' }}>{seenPatients}</Box>
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#475569' }}>
            Average Production Per Patient: <Box component="span" sx={{ ml: 2, fontWeight: 700, color: '#1e293b' }}>\${(seenPatients > 0 ? netProduction / seenPatients : 0).toFixed(2)}</Box>
          </Typography>
        </Box>`;

const oldFooterFull = `      {/* Footer Summary */}
      <Box sx={{ mt: 3, ml: 4 }} id="production-report-footer">
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: '#475569' }}>
          <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600 }}>Net est. Production:</Box> 
          <Box component="span" sx={{ ml: 2, fontWeight: 700, color: '#1e293b' }}>
            Total Charge + Adj(+/-) - Est Write Off = \${netProduction.toFixed(2)}
          </Box>
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#475569' }}>
          Number of Seen Patients: <Box component="span" sx={{ ml: 2, fontWeight: 700, color: '#1e293b' }}>{seenPatients}</Box>
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#475569' }}>
          Average Production Per Patient: <Box component="span" sx={{ ml: 2, fontWeight: 700, color: '#1e293b' }}>\${(seenPatients > 0 ? netProduction / seenPatients : 0).toFixed(2)}</Box>
        </Typography>
      </Box>`;

content = content.replace(oldFooterEmpty, footerBlock);
content = content.replace(oldFooterFull, footerBlock);

fs.writeFileSync(path, content, 'utf8');
console.log("Footer updated!");
