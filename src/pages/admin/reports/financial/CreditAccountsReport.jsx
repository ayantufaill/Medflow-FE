import React, { useState } from 'react';
import {
  TableCell,
  TableRow,
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';

const MOCK_DATA = [
  { name: 'Patient One', dob: 'May/17/1963', email: 'patient1@example.com', phone: '+1 (555) 000-1234', amount: '$350.00', credit: '$350.00', insCredit: '$0.00' },
  { name: 'Patient Two', dob: 'Jul/19/1941', email: 'patient2@example.com', phone: '+1 (555) 000-5678', amount: '$29.90', credit: '$29.90', insCredit: '$0.00' },
  { name: 'Patient Three', dob: 'Dec/06/1966', email: 'patient3@example.com', phone: '+1 (555) 000-9012', amount: '$44.00', credit: '$44.00', insCredit: '$0.00' },
  { name: 'Patient Four', dob: 'Jul/17/1984', email: 'patient4@example.com', phone: '+1 (555) 000-3456', amount: '$395.20', credit: '$395.20', insCredit: '$0.00' },
  { name: 'Patient Five', dob: 'Dec/13/1964', email: 'patient5@example.com', phone: '+1 (555) 000-7890', amount: '$1,275.00', credit: '$1,275.00', insCredit: '$0.00' },
];

const CreditAccountsReport = () => {
  const [filter, setFilter] = useState('All patients');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [groupByCredit, setGroupByCredit] = useState(false);

  const columns = [
    { label: 'Patient Name' },
    { label: 'Birth Date' },
    { label: 'Email' },
    { label: 'Phone Number' },
    { label: 'Amount' },
    { label: 'Patient Credit' },
    { label: 'Insurance Credit' },
  ];

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fcfcfc' : '#fff' }}>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.name}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.dob}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.email}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.phone}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.amount}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.credit}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.insCredit}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <ReportSelect 
        label="All patients" 
        prefix="Filter by Outstanding:" 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
        options={[{ value: 'All patients', label: 'All patients' }, { value: 'Outstanding only', label: 'Outstanding only' }]}
      />
      <ReportCheckbox 
        label="Include Inactive Patients" 
        checked={includeInactive} 
        onChange={(e) => setIncludeInactive(e.target.checked)} 
      />
      <ReportCheckbox 
        label="Group By Credit" 
        checked={groupByCredit} 
        onChange={(e) => setGroupByCredit(e.target.checked)} 
      />
    </>
  );

  return (
    <ReportLayout title="Credit Accounts Report">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={() => console.log('Apply Filters')}
        onCreateTemplate={() => console.log('Create Template')}
        onExportCsv={() => console.log('Exporting...')}
        onPrint={() => window.print()}
      />
      <ReportDataTable 
        columns={columns} 
        data={MOCK_DATA} 
        renderRow={renderRow} 
      />
    </ReportLayout>
  );
};

export default CreditAccountsReport;
