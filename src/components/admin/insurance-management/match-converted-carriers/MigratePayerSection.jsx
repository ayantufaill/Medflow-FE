import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const MigratePayerSection = ({ testRealmUrl, setTestRealmUrl }) => {
  return (
    <Box sx={{ borderTop: '1px solid #e2e8f0', pt: 4, pb: 2, textAlign: 'center' }}>
      <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b', mb: 3 }}>
        Migrate Payer Matches from Test Realm
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <TextField
          size="small"
          value={testRealmUrl}
          onChange={(e) => setTestRealmUrl(e.target.value)}
          sx={{
            width: 380,
            '& .MuiOutlinedInput-root': {
              height: 36,
              bgcolor: '#fff',
              fontSize: '0.85rem',
              borderRadius: 2,
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            px: 3,
            height: 36,
            borderRadius: 2,
            boxShadow: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#1d4ed8',
              boxShadow: 'none',
            }
          }}
        >
          Fetch Payer Matches
        </Button>
      </Box>
    </Box>
  );
};

export default MigratePayerSection;
