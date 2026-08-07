const fs = require('fs');

const files = [
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/DenticalReportsTab.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/EraReportsTab.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Fix TextField styling
  const textfieldRegex = /sx=\{\{\s*'\&\s*\.MuiOutlinedInput-root':\s*\{\s*backgroundColor:\s*'#ffffff',\s*fontSize:\s*'0\.85rem'\s*\}\s*\}\}/g;
  const newTextfieldStyle = `sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                fontSize: '0.85rem',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
            }}`;
  
  content = content.replace(textfieldRegex, newTextfieldStyle);

  // Fix Refresh Button Styling
  // There are old Refresh button stylings that look like text links.
  const refreshRegex = /sx=\{\{\s*textTransform:\s*'none',\s*fontSize:\s*'0\.8rem',\s*fontWeight:\s*600,[\s\S]*?padding:\s*'4px 8px',[\s\S]*?minWidth:\s*'auto',[\s\S]*?gap:\s*0\.5,[\s\S]*?'&:hover':\s*\{\s*background:\s*'none',\s*textDecoration:\s*'underline'\s*\},[\s\S]*?\}\}/g;

  const newRefreshStyle = `sx={{
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#64748b',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            gap: 1,
            '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
          }}`;

  content = content.replace(refreshRegex, newRefreshStyle);

  // Dentical might have color: '#1a3a6b' in refresh button
  // Era might have color: '#3b82f6' in refresh button
  // the regex above is greedy and flexible enough but let's make sure it matches.
  
  fs.writeFileSync(file, content);
});
console.log('done');
