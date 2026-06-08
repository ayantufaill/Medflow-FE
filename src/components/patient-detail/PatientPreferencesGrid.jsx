import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Divider, Stack, Select, MenuItem, TextField } from '@mui/material';
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

export default function PatientPreferencesGrid({ patient, isEditMode = false, onPatientDataChange, providers = [] }) {
  const providerLabel = (provider) => {
    if (!provider) return '';
    if (provider.userId?.firstName || provider.userId?.lastName) {
      return `${provider.userId?.firstName || ""} ${provider.userId?.lastName || ""}`.trim();
    }
    return `${provider.firstName || ""} ${provider.lastName || ""}`.trim() || `ID: ${provider._id || provider.id}`;
  };

  const getProviderName = (id) => {
    if (!id) return null;
    const provider = providers.find(p => (p._id || p.id)?.toString() === id.toString());
    return provider ? providerLabel(provider) : `ID: ${id}`;
  };

  const stripPatientId = (name) => {
    return name ? name.replace(/\s*\(PAT\d+\)/, '').trim() : name;
  };

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
              { text: "Contact me on the phone numbers provided", field: "communicationContactByPhone", checked: !!patient?.customFields?.communicationContactByPhone },
              { text: "Leave voicemail at home", field: "communicationLeaveVoicemailAtHome", checked: !!patient?.customFields?.communicationLeaveVoicemailAtHome },
              { text: "I agree that the dental practice may communicate with me electronically at the email address I provided...", field: "communicationAgreeElectronicCommunications", checked: !!patient?.customFields?.communicationAgreeElectronicCommunications },
              { text: "By opting in, I agree to receive SMS messages from the dental office regarding appointment reminders...", field: "communicationAgreeSmsMessages", checked: !!patient?.customFields?.communicationAgreeSmsMessages }
            ].map((item, index) => (
              isEditMode ? (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox 
                      size="small" 
                      checked={item.checked} 
                      onChange={(e) => onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, [item.field]: e.target.checked } })}
                      sx={{ p: 0.5 }} 
                    />
                  }
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
        <PreferenceSection title="Referring">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Referring sources:</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', ml: 1 }}>
                {patient?.referralSource ? `- ${patient.referralSource}` : 'None'}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Referring Patient:</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', ml: 1 }}>
                {patient?.customFields?.referringPatient ? `- ${stripPatientId(patient.customFields.referringPatient)}` : 'None'}
              </Typography>
            </Box>
          </Box>
        </PreferenceSection>
      </Box>

      <Box>
        <PreferenceSection title="Care Team Providers">
          {isEditMode ? (
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', minWidth: 70 }}>Dentist:</Typography>
                <TextField
                  select
                  variant="standard"
                  size="small"
                  value={patient?.preferredDentistId || patient?.customFields?.preferredDentistId || ''}
                  onChange={(e) => onPatientDataChange({ ...patient, preferredDentistId: e.target.value })}
                  sx={{ flexGrow: 1, '.MuiInputBase-root': { fontSize: '0.75rem' } }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.75rem' }}>None</MenuItem>
                  {providers.map(p => (
                    <MenuItem key={p._id || p.id} value={(p._id || p.id)?.toString()} sx={{ fontSize: '0.75rem' }}>
                      {providerLabel(p)}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', minWidth: 70 }}>Hygienist:</Typography>
                <TextField
                  select
                  variant="standard"
                  size="small"
                  value={patient?.preferredHygienistId || patient?.customFields?.preferredHygienistId || ''}
                  onChange={(e) => onPatientDataChange({ ...patient, preferredHygienistId: e.target.value })}
                  sx={{ flexGrow: 1, '.MuiInputBase-root': { fontSize: '0.75rem' } }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.75rem' }}>None</MenuItem>
                  {providers.map(p => (
                    <MenuItem key={p._id || p.id} value={(p._id || p.id)?.toString()} sx={{ fontSize: '0.75rem' }}>
                      {providerLabel(p)}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Stack>
          ) : (
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {(patient?.preferredDentistId || patient?.customFields?.preferredDentistId) || (patient?.preferredHygienistId || patient?.customFields?.preferredHygienistId) ? (
                <Stack spacing={0.5}>
                  {(patient?.preferredDentistId || patient?.customFields?.preferredDentistId) && <Typography sx={{ fontSize: '0.75rem' }}>Dentist: {getProviderName(patient?.preferredDentistId || patient?.customFields?.preferredDentistId)}</Typography>}
                  {(patient?.preferredHygienistId || patient?.customFields?.preferredHygienistId) && <Typography sx={{ fontSize: '0.75rem' }}>Hygienist: {getProviderName(patient?.preferredHygienistId || patient?.customFields?.preferredHygienistId)}</Typography>}
                </Stack>
              ) : 'None'}
            </Typography>
          )}
        </PreferenceSection>
      </Box>

      {/* Row 2 - Aligned Vertically */}
      <Box>
        <PreferenceSection title="Confirmation">
          <Stack spacing={isEditMode ? 0.5 : 1}>
            {[
              { text: "Pause Schedule Gap Fills Reminders", field: "communicationPauseScheduleGapFillsReminders", checked: !!patient?.customFields?.communicationPauseScheduleGapFillsReminders },
              { text: "Pause AR Automation Reminders", field: "communicationPauseArAutomationReminders", checked: !!patient?.customFields?.communicationPauseArAutomationReminders },
              { text: "Receive Email Campaign", field: "communicationAgreeElectronicCommunications", checked: !!patient?.customFields?.communicationAgreeElectronicCommunications }
            ].map((item, index) => (
              isEditMode ? (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox 
                      size="small" 
                      checked={item.checked} 
                      onChange={(e) => onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, [item.field]: e.target.checked } })}
                      sx={{ p: 0.5 }} 
                    />
                  }
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
            {[
              { label: "Assignment & Release:", field: "assignmentRelease" },
              { label: "Photography Release:", field: "photographyRelease" },
              { label: "Social Media Release:", field: "socialMediaRelease" },
              { label: "AI Release:", field: "aiRelease" }
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', minWidth: 140 }}>{item.label}</Typography>
                {isEditMode ? (
                  <TextField
                    select
                    variant="standard"
                    size="small"
                    value={patient?.customFields?.[item.field] || 'Not answered'}
                    onChange={(e) => onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, [item.field]: e.target.value === 'Not answered' ? '' : e.target.value } })}
                    sx={{ flexGrow: 1, '.MuiInputBase-root': { fontSize: '0.75rem' } }}
                  >
                    <MenuItem value="Not answered" sx={{ fontSize: '0.75rem' }}>Not answered</MenuItem>
                    <MenuItem value="yes" sx={{ fontSize: '0.75rem' }}>Yes</MenuItem>
                    <MenuItem value="no" sx={{ fontSize: '0.75rem' }}>No</MenuItem>
                  </TextField>
                ) : (
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.primary' }}>{patient?.customFields?.[item.field] || 'Not answered'}</Typography>
                )}
              </Box>
            ))}
          </Stack>
        </PreferenceSection>
      </Box>

      <Box /> {/* Empty cell for alignment in row 2 */}

      {/* Row 3 */}
      <Box>
        <PreferenceSection title="Credit Card">
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1.5 }}>
            {patient?.customFields?.creditCardInfo || 'None registered'}
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
            {patient?.customFields?.bankAccountInfo || 'None registered'}
          </Typography>
        </PreferenceSection>
      </Box>

      <Box>
        <PreferenceSection title="Release Information">
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 1 }}>
            Can discuss information with:
          </Typography>
          <Stack spacing={0.5}>
            {[
              { label: "Spouse / Common-law partner", field: "releaseSpouse" },
              { label: "Children", field: "releaseChildren" },
              { label: "Parents", field: "releaseParents" }
            ].map((item, index) => (
              isEditMode ? (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox 
                      size="small" 
                      checked={!!patient?.customFields?.[item.field]} 
                      onChange={(e) => onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, [item.field]: e.target.checked } })}
                      sx={{ p: 0.5 }} 
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.75rem' }}>{item.label}</Typography>}
                />
              ) : (
                <Typography key={index} sx={{ fontSize: '0.75rem', color: patient?.customFields?.[item.field] ? 'text.primary' : 'text.disabled', fontWeight: patient?.customFields?.[item.field] ? 500 : 400 }}>
                  {patient?.customFields?.[item.field] ? '✓ ' : ''}{item.label}
                </Typography>
              )
            ))}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', mt: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Other:</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  variant="standard"
                  value={patient?.customFields?.releaseOther || ''}
                  onChange={(e) => onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, releaseOther: e.target.value } })}
                  sx={{ input: { fontSize: '0.75rem', py: 0 } }}
                />
              ) : (
                <Typography sx={{ fontSize: '0.75rem', color: 'text.primary' }}>
                  {patient?.customFields?.releaseOther || 'None'}
                </Typography>
              )}
            </Box>
          </Stack>
        </PreferenceSection>
      </Box>
    </Box>
  );
}
