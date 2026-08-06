const fs = require('fs');
const file = '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/pages/claims/BatchActionsPage.jsx';

let content = fs.readFileSync(file, 'utf8');

// Fix TableHead cells colors in modals from #1a3a6b to #1e293b
content = content.replace(/color:\s*'#1a3a6b',\s*fontWeight:\s*700/g, "color: '#1e293b', fontWeight: 700");

// Fix search textfields in modals
content = content.replace(/sx=\{\{\s*'& \.MuiOutlinedInput-root':\s*\{\s*borderRadius:\s*'4px'\s*\}\s*\}\}/g, 
  `sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } } }}`);

content = content.replace(/sx=\{\{\s*width:\s*'100%',\s*'& \.MuiOutlinedInput-root':\s*\{\s*borderRadius:\s*'4px'\s*\}\s*\}\}/g, 
  `sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } } }}`);

fs.writeFileSync(file, content);
console.log('done');
