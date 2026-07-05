import { Box } from '@mui/material';

const VerticalDivider = ({ height = '32px', color = '#d0d7e2' }) => (
  <Box sx={{ width: '1px', height, backgroundColor: color, flexShrink: 0 }} />
);

export default VerticalDivider;
