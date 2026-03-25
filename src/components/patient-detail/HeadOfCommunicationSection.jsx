import { Box, Typography, Avatar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getInitials } from './utils';
import { sectionTitleSx } from '../../constants/styles';

export default function HeadOfCommunicationSection({ patient }) {
  const head = patient?.headOfCommunication;
  const displayName =
    head?.name ||
    [head?.firstName, head?.lastName].filter(Boolean).join(' ') ||
    `${patient?.firstName || 'Anna'} ${patient?.lastName || ''}`.trim();
  const options = Array.isArray(patient?.household) && patient.household.length
    ? patient.household
    : [{ name: displayName }];
  return (
    <Box>
      <Typography variant="subtitle1" sx={sectionTitleSx}>
        Head of Communication
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'primary.main',
            fontSize: '0.75rem',
          }}
        >
          {getInitials(head?.firstName || patient?.firstName, head?.lastName || patient?.lastName)}
        </Avatar>
        <FormControl size="small" sx={{ minWidth: 0, flex: 1 }}>
          <InputLabel>Head of Communication</InputLabel>
          <Select label="Head of Communication" value={displayName} sx={{ borderRadius: 1.5 }}>
            {options.map((option) => {
              const optionName =
                option?.name ||
                option?.displayName ||
                [option?.firstName, option?.lastName].filter(Boolean).join(' ').trim();
              return (
                <MenuItem key={optionName} value={optionName}>
                  {optionName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        For patients under 16, send all communication to the Head of Communication. Patients above
        16 will receive their own communication.
      </Typography>
    </Box>
  );
}
