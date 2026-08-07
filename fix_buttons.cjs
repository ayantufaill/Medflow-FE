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
  
  // Replace 'Print Page' or 'Print Claims' with just 'Print'
  content = content.replace(/label:\s*'Print Page'/g, "label: 'Print'");
  content = content.replace(/label:\s*'Print Claims'/g, "label: 'Print'");
  
  // Check if they are backwards and swap them.
  // Look for Print block followed by Export block
  const backwardsRegex = /(\{\s*label:\s*'Print'[\s\S]*?disabled:\s*false,?\s*\},\s*)(\{\s*label:\s*'Export CSV'[\s\S]*?disabled:\s*false,?\s*\})/g;
  content = content.replace(backwardsRegex, '$2,\n          $1');

  // Fix double commas
  content = content.replace(/\},\s*,/g, '},');

  fs.writeFileSync(file, content);
});
console.log('done');
