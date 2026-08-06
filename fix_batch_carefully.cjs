const fs = require('fs');
const file = '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/pages/claims/BatchActionsPage.jsx';

let content = fs.readFileSync(file, 'utf8');

// Replace TableHead backgrounds
content = content.replace(/bgcolor:\s*'#fafbfe'/g, "bgcolor: '#f8f9fa'");
content = content.replace(/backgroundColor:\s*'#fafbfe'/g, "backgroundColor: '#f8f9fa'");

// Replace TableHead text colors
content = content.replace(/color:\s*'#1a3a6b'/g, "color: '#1e293b'");

// Specific string replacements for TableContainers
content = content.replace(
  "<TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'hidden' }}>",
  "<TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto', width: '100%' }}>"
);

content = content.replace(
  "<TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', maxHeight: '300px', overflowY: 'auto' }}>",
  "<TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>"
);

content = content.replace(
  "<TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px' }}>",
  "<TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto', width: '100%' }}>"
);

// Replace border on the other papers
content = content.replace(/border:\s*'1px solid #e0e6ed'/g, "border: '1px solid #e2e8f0'");

// Fix textfields
content = content.replace(
  "sx={{ width: '320px', '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: '6px', fontSize: '0.85rem' } }}",
  "sx={{ width: '320px', '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: '6px', fontSize: '0.85rem', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } } }}"
);

content = content.replace(
  "sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}",
  "sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } } }}"
);

content = content.replace(
  "sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}",
  "sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } } }}"
);

fs.writeFileSync(file, content);
console.log('done');
