import React from 'react';
import { Box } from '@mui/material';
import { StandardClaimsTable } from './StandardClaimsTable';

export const RejectedClaimsTab = (props) => {
  return (
    <Box>
      <StandardClaimsTable {...props} activeTab={2} />
    </Box>
  );
};
