const fs = require('fs');

function processFile(file, minWidth) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix TableContainer
  content = content.replace(/<TableContainer component=\{Paper\} sx=\{\{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'auto' \}\}>/g, 
    `<TableContainer component={Paper} elevation={0} sx={{ boxShadow: "none", border: "1px solid #e2e8f0", borderRadius: "8px", width: "100%", overflowX: "auto" }}>`);
  
  // Fix TableHead
  content = content.replace(/<TableHead sx=\{\{ backgroundColor: '#fafbfe' \}\}>/g,
    `<TableHead sx={{ backgroundColor: "#f8f9fa", "& .MuiTableCell-root": { py: 1, px: 1, fontSize: "0.7rem", fontWeight: 700, borderBottom: "1px solid #e2e8f0", color: "inherit", whiteSpace: "nowrap" } }}>`);

  // Fix TableBody
  content = content.replace(/<TableBody>/g,
    `<TableBody sx={{ "& .MuiTableCell-root": { py: 1.5, px: 1, fontSize: "0.75rem", verticalAlign: "middle", borderBottom: "1px solid #e2e8f0", color: "#1e293b", whiteSpace: "nowrap" } }}>`);

  // Remove explicit table cell colors from TableHead
  content = content.replace(/sx=\{\{\s*color:\s*'#1a3a6b',\s*fontWeight:\s*700,\s*fontSize:\s*'0.8rem',\s*py:\s*1.5\s*\}\}/g, '');
  content = content.replace(/align="right"\s*sx=\{\{\s*color:\s*'#1a3a6b',\s*fontWeight:\s*700,\s*fontSize:\s*'0.8rem',\s*py:\s*1.5\s*\}\}/g, 'align="right"');

  // Remove explicit TableRow hover styles
  const hoverRegex = /hover\s*sx=\{\{\s*'&\:hover':\s*\{\s*backgroundColor:\s*'rgba\(26,\s*58,\s*107,\s*0\.03\)\s*!important'\s*\},\s*transition:\s*'background-color\s*0\.2s',\s*\}\}/g;
  content = content.replace(hoverRegex, 'hover={false}');

  // In EraReportsTable, there's another hover pattern:
  const hoverRegex2 = /hover\s*sx=\{\{\s*backgroundColor:\s*isVoided\s*\?\s*'rgba\(229,\s*62,\s*62,\s*0\.02\)'\s*:\s*'transparent',\s*'&\:hover':\s*\{\s*backgroundColor:\s*isVoided\s*\?\s*'rgba\(229,\s*62,\s*62,\s*0\.05\)'\s*:\s*'rgba\(26,\s*58,\s*107,\s*0\.03\)\s*!important'\s*\},\s*\}\}/g;
  content = content.replace(hoverRegex2, `hover={false} sx={{ backgroundColor: isVoided ? 'rgba(229, 62, 62, 0.02)' : 'transparent' }}`);
  
  // Set Table size and minWidth
  content = content.replace(/<Table>/g, `<Table size="small" sx={{ minWidth: ${minWidth} }}>`);

  // Change some inner colors
  content = content.replace(/#1a3a6b/g, '#3b82f6');
  content = content.replace(/#4a5568/g, '#1e293b');

  fs.writeFileSync(file, content);
}

processFile('/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/DenticalReportsTable.jsx', 1200);
processFile('/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/EraReportsTable.jsx', 1600);

console.log('done');
