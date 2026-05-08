import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Divider, Stack } from '@mui/material';
import { sectionTitleSx } from '../../constants/styles';

const PreferenceSection = ({ title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="subtitle1" sx={{ ...sectionTitleSx, borderBottom: '1px solid #e0e0e0', pb: 0.5, mb: 1.5 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const CustomCheckboxLabel = ({ text }) => (
  <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', lineHeight: 1.4 }}>
    {text}
  </Typography>
);

export default function PatientPreferencesGrid({ patient, isEditMode = false }) {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, 
      gap: 4, 
      mt: 4 
    }}>
      {/* Row 1 */}
      <Box>
        <PreferenceSection title="Communication">
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1, fontStyle: 'italic' }}>
            You can contact patient via following means:
          </Typography>
          <Stack spacing={isEditMode ? 0.5 : 1.5}>
            {[
              "Contact me on the phone numbers provided",
              "Leave voicemail at home",
              "I agree that the dental practice may communicate with me electronically at the email address I provided. I am aware that there is some level of risk that third parties might be able to read unencrypted emails. I am responsible for providing the dental practice any updates to my email address.",
              "By opting in, I agree to receive SMS messages from the dental office regarding appointment reminders, confirmations, updates, and important office information. Message frequency may vary. Reply STOP to unsubscribe. Msg & data rates may apply."
            ].map((text, index) => (
              isEditMode ? (
                <FormControlLabel
                  key={index}
                  control={<Checkbox size="small" defaultChecked sx={{ p: 0.5 }} />}
                  label={<CustomCheckboxLabel text={text} />}
                />
              ) : (
                <CustomCheckboxLabel key={index} text={`✓ ${text}`} />
              )
            ))}
          </Stack>
        </PreferenceSection>
      </Box>

      <Box>
        <PreferenceSection title="Referring">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Referring sources:</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', ml: 1 }}>- ROOT Perio</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Referring Patient:</Typography>
            </Box>
          </Box>
        </PreferenceSection>
      </Box>

      <Box>
        <PreferenceSection title="Care Team Providers">
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            None
          </Typography>
        </PreferenceSection>
      </Box>

      {/* Row 2 - Aligned Vertically */}
      <Box>
        <PreferenceSection title="Confirmation">
          <Stack spacing={isEditMode ? 0.5 : 1}>
            {[
              { text: "Pause Schedule Gap Fills Reminders", checked: false },
              { text: "Pause AR Automation Reminders", checked: false },
              { text: "Receive Email Campaign", checked: true }
            ].map((item, index) => (
              isEditMode ? (
                <FormControlLabel
                  key={index}
                  control={<Checkbox size="small" defaultChecked={item.checked} sx={{ p: 0.5 }} />}
                  label={<CustomCheckboxLabel text={item.text} />}
                />
              ) : (
                <CustomCheckboxLabel key={index} text={`${item.checked ? '✓' : 'X'} ${item.text}`} />
              )
            ))}
          </Stack>
        </PreferenceSection>
      </Box>

      <Box>
        <PreferenceSection title="Assignment & Release:">
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', minWidth: 140 }}>Assignment & Release:</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary' }}>Not answered</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', minWidth: 140 }}>Photography Release:</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary' }}>Not answered</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', minWidth: 140 }}>Social Media Release:</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary' }}>Not answered</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', minWidth: 140 }}>AI Release:</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary' }}>Not answered</Typography>
            </Box>
          </Stack>
        </PreferenceSection>
      </Box>

      <Box /> {/* Empty cell for alignment in row 2 */}

      {/* Row 3 */}
      <Box>
        <PreferenceSection title="Credit Card">
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1.5 }}>
            None registered
          </Typography>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ 
              textTransform: 'none', 
              fontSize: '0.75rem', 
              bgcolor: '#7788bb', 
              '&:hover': { bgcolor: '#5c6bc0' } 
            }}
          >
            Add card
          </Button>
        </PreferenceSection>
      </Box>

      <Box>
        <PreferenceSection title="Bank Account">
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            None registered
          </Typography>
        </PreferenceSection>
      </Box>

      <Box>
        <PreferenceSection title="Release Information">
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 1 }}>
            Can discuss information with:
          </Typography>
          <Stack spacing={0.5}>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>Spouse / Common-law partner</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>Children</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>Parents</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Other:</Typography>
            </Box>
          </Stack>
        </PreferenceSection>
      </Box>
    </Box>
  );
}
