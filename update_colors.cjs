const fs = require('fs');

const file = '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/StandardClaimsTable.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard colors
content = content.replace(/#2d3748/g, '#1e293b');
content = content.replace(/#718096/g, '#64748b');
content = content.replace(/#4a5568/g, '#475569');

// Find the Claim # cell styling
// It has: color: isError && activeTab === 0 ? "#e53e3e" : "#475569" (since it just got replaced)
// We want to make it #3b82f6 to match Aging Report's link style
content = content.replace(/color:\s*isError\s*&&\s*activeTab\s*===\s*0\s*\?\s*"#e53e3e"\s*:\s*"#475569",\s*fontSize:\s*"0\.72rem",\s*"&:hover":\s*{\s*textDecoration:\s*"underline"\s*}/g, 'color: isError && activeTab === 0 ? "#e53e3e" : "#3b82f6",\n                          fontSize: "0.75rem",\n                          "&:hover": { textDecoration: "underline" }');

fs.writeFileSync(file, content);
console.log('done');
