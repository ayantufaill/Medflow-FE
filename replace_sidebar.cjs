const fs = require('fs');
const lines = fs.readFileSync('src/pages/clinical/TreatmentPlanPage.jsx', 'utf8').split('\n');
const startIdx = 1540; // line 1541
const endIdx = 1948; // line 1949
const newSidebar = `            <Box sx={{ width: '30%', flex: '0 0 30%' }}>
              <TreatmentProcedureSidebar 
                activeRestorativeCode={activeRestorativeCode}
                onRestorativeCodeSelect={handleRestorativeCodeSelect}
              />
            </Box>`;
const newLines = [...lines.slice(0, startIdx), newSidebar, ...lines.slice(endIdx)];
fs.writeFileSync('src/pages/clinical/TreatmentPlanPage.jsx', newLines.join('\n'));
console.log('done');
