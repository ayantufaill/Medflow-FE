import React from "react";
import { Box, Card, Typography, Checkbox, FormControlLabel, Stack, Divider } from "@mui/material";
import KeyboardDoubleArrowUp from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import { fontSize, fontWeight } from "../../../constants/styles";
import RestorationToothIcon from "../common/RestorationToothIcon";
import ToothNumber from "../common/ToothNumber";

const DentalSection = ({ title, children, badge }) => (
  <Card sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4', bgcolor: 'white' }}>
    <Box sx={{ 
      bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.4, 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
    }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>{title}</Typography>
        {badge && (
          <Box sx={{ bgcolor: '#e57373', px: 0.5, borderRadius: '2px', fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>{badge}</Box>
        )}
      </Stack>
      <FormControlLabel
        control={<Checkbox size="small" sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
        label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
        labelPlacement="start"
        sx={{ ml: 0 }}
      />
    </Box>
    <Box sx={{ p: 1.5 }}>{children}</Box>
  </Card>
);

const Row = ({ label, children, hasChat = false, isGray = false }) => (
  <Box sx={{ py: 1 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography sx={{ 
          fontSize: fontSize.sm, 
          color: isGray ? '#ccc' : '#444',
          fontWeight: isGray ? fontWeight.regular : fontWeight.medium 
        }}>
          {label}
        </Typography>
        {hasChat && <ChatBubbleOutline sx={{ fontSize: 13, color: '#bbb' }} />}
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 0.5, maxWidth: '70%' }}>
        {children}
      </Box>
    </Stack>
  </Box>
);

const HeaderLabel = ({ children }) => (
  <Typography variant="caption" sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>
    {children}
  </Typography>
);

const ExistingRestorations = ({ expanded, onToggle }) => {
  return (
    <DentalSection title="Existing Restorations" badge="DH">
      {expanded && (
        <>
          {/* Direct Section */}
          <Row label="Direct">
            <Stack direction="row" spacing={0.2}>
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#666" />
              <RestorationToothIcon fill="#eee" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#add8e6" />
            </Stack>
          </Row>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mb={1}>
            <ToothNumber label="4 OM" disabled />
            <ToothNumber label="5 DO" disabled />
            <ToothNumber label="10 MFLD" />
            <ToothNumber label="31 O" active />
            <ToothNumber label="31" />
            <ToothNumber label="32 O" active />
            <ToothNumber label="32" />
          </Stack>

          <Divider />

          {/* Indirect Section */}
          <Row label="Indirect">
            <Stack direction="row" spacing={0.2}>
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#444" />
              <RestorationToothIcon fill="#eee" />
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon type="incisor" fill="#eee" />
              <RestorationToothIcon fill="#b39ddb" />
            </Stack>
          </Row>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mb={1}>
            <ToothNumber label="14" />
            <ToothNumber label="19" active />
            <ToothNumber label="20" />
            <ToothNumber label="20" active />
          </Stack>

          <Divider />

          {/* Isthmus Section */}
          <Row label="Isthmus" isGray>
            <Stack direction="row" spacing={0.2}>
              <RestorationToothIcon fill="#e8f5e9" />
              <RestorationToothIcon fill="#fffde7" />
              <RestorationToothIcon fill="#ffebee" />
            </Stack>
          </Row>

          <Divider />

          {/* Restoration Concerns Section */}
          <Row label="Restoration Concerns">
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.2 }}>
              <RestorationToothIcon status="occlusal" />
              <RestorationToothIcon status="gold" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#eee" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon type="incisor" fill="#fff" />
              <RestorationToothIcon fill="#fff" />
              {/* Row 2 of icons */}
              <Box /> <Box /> <Box />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon status="forbidden" fill="#999" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#ffd700" />
            </Box>
          </Row>

          <Divider />

          {/* Bridge Section */}
          <Row label="Bridge" hasChat>
            <Stack direction="row" spacing={0.5}>
              {[
                { c1: '#fff', c2: '#fff' },
                { c1: '#fff', c2: '#999' },
                { c1: '#ffd700', c2: '#ffd700' },
                { c1: '#999', c2: '#999' },
                { c1: '#add8e6', c2: '#add8e6' },
                { c1: '#b39ddb', c2: '#b39ddb' }
              ].map((b, i) => (
                <Box key={i} sx={{ 
                  width: 24, height: 24, borderRadius: '4px', border: '1px solid #999',
                  background: `linear-gradient(135deg, ${b.c1} 50%, ${b.c2} 50%)`
                }} />
              ))}
            </Stack>
          </Row>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mb={1}>
            <ToothNumber label="11 13" />
            <ToothNumber label="11 13" />
            <ToothNumber label="12" />
          </Stack>

          <Divider />

          {/* Denture Section */}
          <Row label="Denture" hasChat />
          
          {/* Footer Expand Icon */}
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', mt: 1, cursor: 'pointer' }}
            onClick={onToggle}
          >
            <KeyboardDoubleArrowUp 
              sx={{ 
                fontSize: 20, 
                color: '#666',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </Box>
        </>
      )}
      
      {!expanded && (
        <Box 
          sx={{ display: 'flex', justifyContent: 'center', p: 1, cursor: 'pointer', bgcolor: '#fafafa' }}
          onClick={onToggle}
        >
          <KeyboardDoubleArrowUp 
            sx={{ 
              fontSize: 20, 
              color: '#666',
              transform: 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </Box>
      )}
    </DentalSection>
  );
};

export default ExistingRestorations;
