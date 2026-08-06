const fs = require('fs');

const files = [
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/EraReportsTable.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/DenticalReportsTable.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace <TableCell sx={...}> with <TableCell> in TableHead section only
  // We can just replace all TableCell sx that match the pattern
  content = content.replace(/<TableCell\s*sx=\{\{\s*color:\s*'#3b82f6',\s*fontWeight:\s*700,\s*fontSize:\s*'0\.78rem',\s*py:\s*1\.5\s*\}\}\s*>/g, '<TableCell>');
  content = content.replace(/<TableCell\s*sx=\{\{\s*color:\s*'#1a3a6b',\s*fontWeight:\s*700,\s*fontSize:\s*'0\.78rem',\s*py:\s*1\.5\s*\}\}\s*>/g, '<TableCell>');
  content = content.replace(/<TableCell\s*align="right"\s*sx=\{\{\s*color:\s*'#3b82f6',\s*fontWeight:\s*700,\s*fontSize:\s*'0\.78rem',\s*py:\s*1\.5\s*\}\}\s*>/g, '<TableCell align="right">');

  fs.writeFileSync(file, content);
});
console.log('done');
