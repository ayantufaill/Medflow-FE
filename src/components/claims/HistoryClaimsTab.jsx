import React from 'react';
import { Box } from '@mui/material';
import { StandardClaimsTable } from './StandardClaimsTable';

export const HistoryClaimsTab = (props) => {
  return (
    <Box>
      <StandardClaimsTable {...props} activeTab={3} />
    </Box>
  );
};
