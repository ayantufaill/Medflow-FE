const fs = require('fs');

const files = [
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/DenticalReportsTab.jsx',
  '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/components/claims/EraReportsTab.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace Paper styles
  const paperRegex = /<Paper[\s\S]*?sx=\{\{[\s\S]*?p:\s*2,[\s\S]*?mb:\s*2,[\s\S]*?display:\s*'flex',[\s\S]*?alignItems:\s*'center',[\s\S]*?(?:gap:\s*2,)?[\s\S]*?backgroundColor:\s*'#ffffff',[\s\S]*?borderRadius:\s*'8px',[\s\S]*?boxShadow:\s*'none',[\s\S]*?border:\s*'1px solid #e0e6ed',[\s\S]*?(?:flexWrap:\s*'wrap',)?[\s\S]*?\}\}[\s\S]*?>/g;
  
  const newPaper = `<Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: 'none',
          border: '1px solid #e2e8f0',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          minWidth: 0,
        }}
      >`;

  content = content.replace(paperRegex, newPaper);

  // In EraReportsTab, update the Active/Voided buttons to match modern button styles
  // Just in case they are looking at the blue #1a3a6b buttons. Let's make them #3b82f6 instead if active.
  content = content.replace(/#1a3a6b/g, '#3b82f6');

  // Change maxWidth of search text field so they fit nicely
  content = content.replace(/maxWidth:\s*400/g, 'maxWidth: 300');
  content = content.replace(/minWidth:\s*250/g, 'minWidth: 200');

  fs.writeFileSync(file, content);
});
console.log('done');
