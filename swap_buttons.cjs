const fs = require('fs');

const files = [
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/OutstandingClaimsTab.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/UnsentClaimsTab.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/ErroredClaimsTab.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/RejectedClaimsTab.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/HistoryClaimsTab.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/PredeterminationTab.jsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find print block and export block
  const regex = /(\{\s*label:\s*'Print[a-zA-Z\s]*'[\s\S]*?disabled:\s*false,?\s*\},\s*)(\{\s*label:\s*'Export CSV'[\s\S]*?disabled:\s*false,?\s*\})/g;
  
  content = content.replace(regex, '$2,\n          $1');
  
  // Fix double commas
  content = content.replace(/\},\s*,/g, '},');

  fs.writeFileSync(file, content);
});
console.log('done');
