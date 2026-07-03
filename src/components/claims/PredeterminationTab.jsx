import React from 'react';
import { Box } from '@mui/material';
import { StandardClaimsTable } from './StandardClaimsTable';

export const PredeterminationTab = (props) => {
  return (
    <Box>
      <StandardClaimsTable {...props} activeTab={5} />
    </Box>
  );
};
