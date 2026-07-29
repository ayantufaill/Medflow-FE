import React from 'react';
import { Box, Button } from '@mui/material';

const MatchActionButtons = ({ onMatch, matchDisabled, activeButton, setActiveButton }) => {
  const topButtons = [
    "Match Manually",
    "Match Payer",
    "Create Patient Policies",
    "Update Matched Payer Names",
    "Update Matched Payers Metadata",
    "Populate Matches using metadata",
    "Match Plans"
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
        {topButtons.map((btn) => (
          <Button
            key={btn}
            variant={activeButton === btn ? "contained" : "outlined"}
            onClick={() => {
              setActiveButton(btn);
              if (btn === "Match Payer" && !matchDisabled) {
                onMatch();
              }
            }}
            sx={{
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              px: 2,
              height: 36,
              borderRadius: 2,
              boxShadow: 'none',
              ...(activeButton === btn ? {
                backgroundColor: '#2563eb',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                  boxShadow: 'none',
                }
              } : {
                color: '#1e293b',
                borderColor: '#e2e8f0',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  borderColor: '#cbd5e1'
                }
              }),
            }}
          >
            {btn}
          </Button>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant={activeButton === "Set Insurance Payer Code" ? "contained" : "outlined"}
          onClick={() => setActiveButton("Set Insurance Payer Code")}
          sx={{
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            px: 2,
            height: 36,
            borderRadius: 2,
            boxShadow: 'none',
            ...(activeButton === "Set Insurance Payer Code" ? {
              backgroundColor: '#2563eb',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#1d4ed8',
                boxShadow: 'none',
              }
            } : {
              color: '#1e293b',
              borderColor: '#e2e8f0',
              '&:hover': {
                backgroundColor: '#f8fafc',
                borderColor: '#cbd5e1'
              }
            }),
          }}
        >
          Set Insurance Payer Code
        </Button>
      </Box>
    </Box>
  );
};

export default MatchActionButtons;
