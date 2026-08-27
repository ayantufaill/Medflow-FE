const fs = require('fs');

const files = [
  'src/components/claims/OutstandingClaimsTab.jsx',
  'src/components/claims/PredeterminationTab.jsx',
  'src/components/claims/UnsentClaimsTab.jsx',
  'src/components/claims/ErroredClaimsTab.jsx',
  'src/components/claims/RejectedClaimsTab.jsx',
  'src/components/claims/HistoryClaimsTab.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Update imports
  content = content.replace(
    /import \{ CARRIERS, CLAIM_TYPES, CLAIM_STATUSES(?:, SORT_REPORT_OPTIONS)? \} from '\.\.\/\.\.\/pages\/claims\/claimsConstants';/g,
    "import { CARRIERS, CLAIM_TYPES, CLAIM_STATUSES, SORT_REPORT_OPTIONS, FILTER_DATE_OPTIONS } from '../../pages/claims/claimsConstants';"
  );

  // 2. Insert new filter object
  const searchStr = `      options: CLAIM_STATUSES,
      onChange: (val) => handleFilterChange('status', val),
    },`;
  const replaceStr = `      options: CLAIM_STATUSES,
      onChange: (val) => handleFilterChange('status', val),
    },
    {
      key: 'filterDate',
      label: 'Filter by Date:',
      width: '140px',
      value: filters.filterDate || 'all',
      options: FILTER_DATE_OPTIONS,
      onChange: (val) => handleFilterChange('filterDate', val),
    },`;
    
  if (content.includes(searchStr) && !content.includes("key: 'filterDate'")) {
    content = content.replace(searchStr, replaceStr);
  }
  
  fs.writeFileSync(file, content);
});
console.log('Update complete.');
