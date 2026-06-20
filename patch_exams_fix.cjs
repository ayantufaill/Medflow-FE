const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/clinical';
const files = [
  'AirwayPage.jsx',
  'ExamDentofacial.jsx',
  'HeadAndNeck.jsx',
  'Morphological.jsx',
  'PeriodontalExamPage.jsx',
  'Radiographic.jsx',
  'TMJ.jsx',
  'TeehthStructureExam.jsx'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix 1: Remove the default empty array
  content = content.replace(
    /const \{ data: historicalDates = \[\] \} = useExamHistoryDates/g,
    "const { data: historicalDates } = useExamHistoryDates"
  );

  // Fix 2: Replace the inside of the useEffect
  const oldEffectStr = `useEffect(() => {
    const formattedHistory = historicalDates.map(dateStr => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    });

    if (currentAppointment?.appointmentDate || currentAppointment?.date) {
      const currentD = new Date(currentAppointment.appointmentDate || currentAppointment.date);
      if (!isNaN(currentD)) {
        const formattedCurrent = currentD.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        if (!formattedHistory.includes(formattedCurrent)) {
          formattedHistory.push(formattedCurrent);
        }
      }
    }

    setVisitDates(formattedHistory);
  }, [historicalDates, currentAppointment]);`;

  // We have to use regex to handle any potential whitespace differences
  const regexPattern = /useEffect\(\(\) => \{\s*const formattedHistory = historicalDates\.map\(dateStr => \{\s*const d = new Date\(dateStr\);\s*return d\.toLocaleDateString\('en-US', \{ month: 'short', day: '2-digit', year: 'numeric' \}\);\s*\}\);\s*if \(currentAppointment\?\.appointmentDate \|\| currentAppointment\?\.date\) \{\s*const currentD = new Date\(currentAppointment\.appointmentDate \|\| currentAppointment\.date\);\s*if \(\!isNaN\(currentD\)\) \{\s*const formattedCurrent = currentD\.toLocaleDateString\('en-US', \{ month: 'short', day: '2-digit', year: 'numeric' \}\);\s*if \(\!formattedHistory\.includes\(formattedCurrent\)\) \{\s*formattedHistory\.push\(formattedCurrent\);\s*\}\s*\}\s*\}\s*setVisitDates\(formattedHistory\);\s*\}, \[historicalDates, currentAppointment\]\);/g;

  const newEffectStr = `useEffect(() => {
    const historyArray = historicalDates || [];
    const formattedHistory = historyArray.map(dateStr => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    });

    if (currentAppointment?.appointmentDate || currentAppointment?.date) {
      const currentD = new Date(currentAppointment.appointmentDate || currentAppointment.date);
      if (!isNaN(currentD)) {
        const formattedCurrent = currentD.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        if (!formattedHistory.includes(formattedCurrent)) {
          formattedHistory.push(formattedCurrent);
        }
      }
    }

    setVisitDates(prev => JSON.stringify(prev) === JSON.stringify(formattedHistory) ? prev : formattedHistory);
  }, [historicalDates, currentAppointment]);`;

  content = content.replace(regexPattern, newEffectStr);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${file}`);
});
