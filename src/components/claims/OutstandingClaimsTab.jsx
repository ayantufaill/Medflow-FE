import React from 'react';
import { Box } from '@mui/material';
import { StandardClaimsTable } from './StandardClaimsTable';

export const OutstandingClaimsTab = (props) => {
  return (
    <Box>
      <StandardClaimsTable {...props} activeTab={4} />
    </Box>
  );
};
