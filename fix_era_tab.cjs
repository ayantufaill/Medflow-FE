const fs = require('fs');
const file = '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/EraReportsTab.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix TableContainer
content = content.replace(/<TableContainer[\s\S]*?sx=\{\{[\s\S]*?boxShadow:\s*'none',[\s\S]*?border:\s*'1px solid #e0e6ed',[\s\S]*?borderRadius:\s*'6px',[\s\S]*?overflow:\s*'auto',[\s\S]*?\}\}[\s\S]*?>/g, 
  `<TableContainer component={Paper} elevation={0} sx={{ boxShadow: "none", border: "1px solid #e2e8f0", borderRadius: "8px", width: "100%", overflowX: "auto" }}>`);

// Fix Table
content = content.replace(/<Table>/g, `<Table size="small" sx={{ minWidth: 1600 }}>`);

// Fix TableHead
content = content.replace(/<TableHead sx=\{\{\s*backgroundColor:\s*'#fafbfe'\s*\}\}>/g,
  `<TableHead sx={{ backgroundColor: "#f8f9fa", "& .MuiTableCell-root": { py: 1, px: 1, fontSize: "0.7rem", fontWeight: 700, borderBottom: "1px solid #e2e8f0", color: "inherit", whiteSpace: "nowrap" } }}>`);

// Fix TableBody
content = content.replace(/<TableBody>/g,
  `<TableBody sx={{ "& .MuiTableCell-root": { py: 1.5, px: 1, fontSize: "0.75rem", verticalAlign: "middle", borderBottom: "1px solid #e2e8f0", color: "#1e293b", whiteSpace: "nowrap" } }}>`);

// Remove inline explicit styles in TableHead
content = content.replace(/sx=\{\{\s*color:\s*'#1a3a6b',\s*fontWeight:\s*700,\s*fontSize:\s*'0\.78rem',\s*py:\s*1\.5\s*\}\}/g, '');

// Fix TableRow hover in TableBody
const hoverRegex = /hover\s*sx=\{\{\s*'&:hover':\s*\{\s*backgroundColor:\s*'rgba\(26,\s*58,\s*107,\s*0\.03\)\s*!important'\s*\},[\s\S]*?\}\}/g;
content = content.replace(hoverRegex, `hover={false}`);

// Change inner colors to match the modern theme
// #1a3a6b -> #3b82f6 (for links/headers if any)
// #4a5568 -> #1e293b
// But wait, it's safer to just let the global MuiTableCell-root handle color `#1e293b`
content = content.replace(/color:\s*'#4a5568'/g, `color: '#1e293b'`);
content = content.replace(/color:\s*'#718096'/g, `color: '#64748b'`);
content = content.replace(/color:\s*'#1a3a6b'/g, `color: '#3b82f6'`);

fs.writeFileSync(file, content);
console.log('done');
