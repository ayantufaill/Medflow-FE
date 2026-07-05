import React from 'react';
import { Box } from '@mui/material';
import { StandardClaimsTable } from './StandardClaimsTable';

export const ErroredClaimsTab = (props) => {
  return (
    <Box>
      <StandardClaimsTable {...props} activeTab={1} />
    </Box>
  );
};
