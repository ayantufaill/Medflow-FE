import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getInitials, computeAge } from './utils';

export default function FamilyMembersSection({ patient, isEditMode = false, onPatientDataChange }) {
  const householdMembers = Array.isArray(patient?.household) ? patient.household : [];
  
  const selfName = patient ? `${patient.firstName} ${patient.lastName}` : '';
  const selfPreferred = patient?.preferredName || '';
  const selfDisplayName = selfName + (selfPreferred && selfPreferred !== selfName ? ` (${selfPreferred})` : '');
  const selfAge = computeAge(patient?.dateOfBirth);

  const handleRemoveMember = (memberToRemove) => {
    if (!onPatientDataChange) return;
    const updatedHousehold = householdMembers.filter(m => {
      const mId = m._id || m.id;
      const rId = memberToRemove._id || memberToRemove.id;
      return mId !== rId;
    });
    onPatientDataChange({ ...patient, household: updatedHousehold });
  };

  const allMembers = [
    {
      id: patient?.id || patient?._id || 'self',
      firstName: patient?.firstName,
      lastName: patient?.lastName,
      displayName: selfDisplayName,
      relationship: patient?.financialResponsibility?.type === 'hoh' ? 'HOH' : 'Self',
      age: selfAge,
      isSelf: true
    },
    ...householdMembers.map(m => {
      const name = m.displayName || m.name || [m.firstName, m.lastName].filter(Boolean).join(' ').trim();
      const age = computeAge(m.dateOfBirth);
      return {
        id: m.id || m._id,
        firstName: m.firstName,
        lastName: m.lastName,
        displayName: name,
        relationship: m.relationship || 'Family Member',
        age: age,
        isSelf: false,
        raw: m
      };
    })
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {allMembers.map((member) => (
        <Box 
          key={member.id} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            p: 1.25, 
            border: '1px solid #f1f5f9', 
            borderRadius: '8px', 
            bgcolor: member.isSelf ? '#f8fafc' : '#ffffff',
            position: 'relative'
          }}
        >
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: '#1976d2', 
              fontSize: '0.85rem', 
              fontWeight: 600 
            }}
          >
            {getInitials(member.firstName, member.lastName)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
              {member.displayName}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
              {member.relationship} {member.age != null ? ` - ${member.age} y` : ''}
            </Typography>
          </Box>
          {isEditMode && !member.isSelf && (
            <IconButton 
              size="small" 
              onClick={() => handleRemoveMember(member.raw)}
              sx={{ color: 'text.secondary', hover: { color: 'error.main' } }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      ))}
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontStyle: 'italic' }}>
        One HOH per family
      </Typography>
    </Box>
  );
}