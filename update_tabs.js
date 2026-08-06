const fs = require('fs');
const glob = require('glob');

const files = glob.sync('/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/*ClaimsTab.jsx');
files.push('/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/PredeterminationTab.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix Export CSV
  content = content.replace(/label:\s*'Export CSV',\s*variant:\s*'(outlined|export)',\s*onClick:/g, "label: 'Export CSV',\n            variant: 'export',\n            icon: 'export',\n            onClick:");

  // Fix Print
  content = content.replace(/label:\s*'Print',\s*variant:\s*'print',\s*onClick:/g, "label: 'Print',\n            variant: 'print',\n            icon: 'print',\n            onClick:");
  content = content.replace(/label:\s*'Print',\s*variant:\s*'print',\s*icon:\s*'print',\s*onClick:/g, "label: 'Print',\n            variant: 'print',\n            icon: 'print',\n            onClick:");

  fs.writeFileSync(file, content);
});
console.log('done');
