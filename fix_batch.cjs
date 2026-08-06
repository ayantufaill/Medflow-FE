const fs = require('fs');

const filesToFix = [
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/pages/claims/BatchActionsPage.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/batch-actions/BatchPaymentsTab.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/batch-actions/BatchInvoicesTab.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/batch-actions/BatchClaimsTab.jsx'
];

filesToFix.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix TableHead background
  content = content.replace(/bgcolor:\s*'#fafbfe'/g, "bgcolor: '#f8f9fa'");
  content = content.replace(/backgroundColor:\s*'#fafbfe'/g, "backgroundColor: '#f8f9fa'");
  
  // In BatchPaymentsTab etc. the headerCellSx doesn't have a background. Let's add it or change its color.
  // The theme uses #1e293b for standard text and bold for headers. Let's update #1a3a6b to #1e293b or inherit depending on what's there.
  content = content.replace(/color:\s*'#1a3a6b'/g, "color: '#1e293b'");
  
  // Fix TableContainer styling in BatchActionsPage modals
  // <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'hidden' }}>
  content = content.replace(/<TableContainer[\s\S]*?sx=\{\{[\s\S]*?boxShadow:\s*'none',[\s\S]*?border:\s*'1px solid #e0e6ed',[\s\S]*?borderRadius:\s*'6px',[\s\S]*?\}\}[\s\S]*?>/g, 
    `<TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto', width: '100%' }}>`);

  // Same for any other #e0e6ed borders
  content = content.replace(/border:\s*'1px solid #e0e6ed'/g, "border: '1px solid #e2e8f0'");
  
  // Search textfields in BatchActionsPage
  // <TextField size="small" placeholder="..." sx={{ width: '320px', '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: '6px', fontSize: '0.85rem' } }}
  const textfieldRegex = /sx=\{\{\s*width:\s*'320px',\s*'\&\s*\.MuiOutlinedInput-root':\s*\{\s*backgroundColor:\s*'#ffffff',\s*borderRadius:\s*'6px',\s*fontSize:\s*'0\.85rem'\s*\}\s*\}\}/g;
  const newTextfieldStyle = `sx={{ width: '320px', '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: '6px', fontSize: '0.85rem', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } } }}`;
  content = content.replace(textfieldRegex, newTextfieldStyle);
  
  // In BatchPaymentsTab etc., update headerCellSx to use #f8f9fa background
  if (content.includes('headerCellSx')) {
    content = content.replace(/const headerCellSx = \{([\s\S]*?)\};/, 
      `const headerCellSx = { backgroundColor: '#f8f9fa', $1};`);
  }

  // Set TableContainers in BatchTabs to have border
  // <TableContainer component={Paper} elevation={0} sx={{ border: 'none', backgroundColor: 'transparent' }}>
  content = content.replace(/<TableContainer component=\{Paper\} elevation=\{0\} sx=\{\{\s*border:\s*'none',\s*backgroundColor:\s*'transparent'\s*\}\}>/g,
    `<TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: 'none', overflowX: 'auto', width: '100%' }}>`);

  // Fix refresh button styling if any (using #1a3a6b)
  content = content.replace(/color:\s*'#1a3a6b'/g, "color: '#1e293b'"); // just in case

  fs.writeFileSync(file, content);
});
console.log('done');
