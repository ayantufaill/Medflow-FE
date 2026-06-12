/**
 * Utility to export an array of objects to a CSV file.
 * 
 * @param {Array<Object>} data - The raw data array
 * @param {Array<{header: string, key: string | function}>} columns - The column definitions
 * @param {string} filename - The output filename (without .csv)
 */
export const exportToCSV = (data, columns, filename = 'export') => {
  if (!data || !data.length) return;

  // Generate headers
  const headers = columns.map(col => `"${col.header.replace(/"/g, '""')}"`).join(',');

  // Generate rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = '';
      if (typeof col.key === 'function') {
        value = col.key(item);
      } else {
        value = item[col.key] || '';
      }
      
      // Escape quotes and wrap in quotes to handle commas/newlines
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });

  const csvContent = [headers, ...rows].join('\n');
  
  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
