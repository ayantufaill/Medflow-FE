import React from 'react';
import { Box } from '@mui/material';
import { StandardClaimsTable } from './StandardClaimsTable';

export const UnsentClaimsTab = (props) => {
  return (
    <Box>
      <StandardClaimsTable {...props} activeTab={0} />
    </Box>
  );
};
