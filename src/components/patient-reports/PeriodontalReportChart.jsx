import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const sites = values => (values || [null, null, null]).map(v => v ?? '—').join(' / ');

export default function PeriodontalReportChart({ section }) {
  const measurements = section?.measurements || [];
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>Saved periodontal chart</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Measurements in millimetres, in chart site order. — means not recorded.
        Bleeding lists marked sites (1–3); P/C/S means plaque/calculus/suppuration.
      </Typography>
      {measurements.length === 0 ? (
        <Typography color="text.secondary">No periodontal measurements recorded.</Typography>
      ) : (
        <TableContainer sx={{ maxHeight: 650, '@media print': { maxHeight: 'none', overflow: 'visible' } }}>
          <Table size="small" aria-label="Saved periodontal measurements">
            <TableHead>
              <TableRow>
                {['Tooth / side', 'Probe', 'Recession', 'Attachment', 'Bleeding sites', 'Mobility', 'Furcation', 'P/C/S'].map(label => (
                  <TableCell key={label}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {measurements.map(row => (
                <TableRow key={`${row.tooth}-${row.side}`}>
                  <TableCell component="th" scope="row">#{row.tooth} {row.side}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{sites(row.probe)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{sites(row.recession)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{sites(row.attachment)}</TableCell>
                  <TableCell>{row.bleeding?.length ? row.bleeding.map(i => i + 1).join(', ') : '—'}</TableCell>
                  <TableCell>{row.mobility ?? '—'}</TableCell>
                  <TableCell>{row.furcation ?? '—'}</TableCell>
                  <TableCell>{row.pcs?.join(', ') || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
