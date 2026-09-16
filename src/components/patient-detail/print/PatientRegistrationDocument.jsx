import React, { forwardRef } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  Chat as ChatIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  RadioButtonUnchecked as RadioUncheckedIcon,
  RadioButtonChecked as RadioCheckedIcon
} from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import logo from '../../../assets/medflow-logo.png';

const PrintSection = ({ title, children, rightTitle }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${COLORS.BORDER}`, mb: 1.5, pb: 0.5 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem', color: COLORS.TEXT_PRIMARY }}>
        {title}
      </Typography>
      {rightTitle && (
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '0.9rem', color: COLORS.TEXT_SECONDARY }}>
          {rightTitle}
        </Typography>
      )}
    </Box>
    {children}
  </Box>
);

const FieldRow = ({ label, value, colon = true, boldLabel = false }) => (
  <Box sx={{ display: 'flex', mb: 0.75, alignItems: 'flex-start' }}>
    <Typography sx={{ width: '50%', fontSize: '0.85rem', color: COLORS.TEXT_SECONDARY, fontWeight: boldLabel ? 600 : 400, pr: 1 }}>
      {label}{colon ? ':' : ''}
    </Typography>
    <Typography sx={{ width: '50%', fontSize: '0.85rem', color: COLORS.TEXT_PRIMARY, fontWeight: 500, wordBreak: 'break-word' }}>
      {value || '-'}
    </Typography>
  </Box>
);

const CheckboxRow = ({ label, checked }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.75 }}>
    {checked ? 
      <CheckCircleIcon sx={{ fontSize: 16, color: COLORS.STATUS_SUCCESS, mr: 1, mt: 0.2 }} /> : 
      <CancelIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED, mr: 1, mt: 0.2 }} />
    }
    <Typography sx={{ fontSize: '0.85rem', color: COLORS.TEXT_PRIMARY, fontWeight: 500 }}>
      {label}
    </Typography>
  </Box>
);

const providerName = (provider) => {
  if (!provider) return null;
  if (provider.userId?.firstName || provider.userId?.lastName) {
    return `${provider.userId?.firstName || ''} ${provider.userId?.lastName || ''}`.trim();
  }
  return `${provider.firstName || ''} ${provider.lastName || ''}`.trim() || null;
};

const findProvider = (providers, idOrObj) => {
  if (!idOrObj) return null;
  // If it's already a populated object with a name or userId, return it directly
  if (typeof idOrObj === 'object' && (idOrObj.firstName || idOrObj.lastName || idOrObj.userId)) {
    return idOrObj;
  }
  const id = typeof idOrObj === 'object' ? (idOrObj._id || idOrObj.id) : idOrObj;
  return providers?.find((p) => (p._id || p.id)?.toString() === id?.toString()) || null;
};

const PatientRegistrationDocument = forwardRef(({ patient, careTeamProviders = [], feeGuides = [] }, ref) => {
  if (!patient) return null;

  const dentistId = patient?.preferredDentistId || patient?.customFields?.preferredDentistId;
  const hygienistId = patient?.preferredHygienistId || patient?.customFields?.preferredHygienistId;
  const dentistName = providerName(findProvider(careTeamProviders, dentistId));
  const hygienistName = providerName(findProvider(careTeamProviders, hygienistId));

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    const ageDifMs = Date.now() - dob.getTime();
    if (isNaN(ageDifMs)) return '';
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const currentDateTime = new Date().toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Determine Primary Insurance
  const primaryIns = patient.insurances?.find(i => i.insuranceType?.toLowerCase() === 'primary') || patient.insurances?.[0];
  const secondaryIns = patient.insurances?.find(i => i.insuranceType?.toLowerCase() === 'secondary') || patient.insurances?.[1];

  const getFeeGuideName = (id, providerGuides = []) => {
    let effectiveId = id;
    if (!effectiveId && providerGuides && providerGuides.length > 0) {
      effectiveId = providerGuides[0].feeGuide;
    }
    if (!effectiveId) return '';
    
    // If it's a populated object (e.g. { _id: '...', description: '...' })
    if (typeof effectiveId === 'object' && effectiveId !== null) {
      if (effectiveId.description || effectiveId.name) return effectiveId.description || effectiveId.name;
      effectiveId = effectiveId._id || effectiveId.id || effectiveId;
    }
    
    if (!feeGuides || feeGuides.length === 0) return typeof effectiveId === 'string' ? effectiveId : '';
    const guide = feeGuides.find(g => (g._id || g.id)?.toString() === effectiveId.toString());
    return guide ? (guide.description || guide.name) : (typeof effectiveId === 'string' ? effectiveId : '');
  };

  return (
    <Box ref={ref} sx={{
      width: '100%',
      backgroundColor: 'white',
      color: COLORS.TEXT_PRIMARY,
      p: 4,
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      '@media print': {
        p: 2,
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }
    }}>
      {/* LOGO (Top Center) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
         <img src={logo} alt="Medflow Logo" style={{ height: '36px' }} />
      </Box>

      {/* HEADER SECTION */}
      <Box sx={{ backgroundColor: COLORS.SURFACE_TINT, p: 2.5, mb: 4, borderRadius: 2, border: `1px solid ${COLORS.BORDER}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, borderBottom: `1px solid ${COLORS.BORDER}`, pb: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', color: COLORS.TEXT_SECONDARY }}>
            Selected family member: <strong style={{ color: COLORS.TEXT_PRIMARY }}>{patient.firstName} {patient.lastName}</strong>
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', fontStyle: 'italic', color: COLORS.TEXT_MUTED, textAlign: 'right' }}>
            Generated on<br />{currentDateTime}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
          {/* COLUMN 1 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ color: COLORS.ACCENT, fontSize: 16, mr: 1 }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{patient.firstName} {patient.lastName} - Age {calculateAge(patient.dateOfBirth)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 1.5 }}>
              {['P', 'B', 'F', 'D'].map(l => (
                <Box key={l} sx={{ bgcolor: COLORS.BORDER, width: 18, height: 18, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 0.5, fontSize: '0.65rem', fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>{l}</Box>
              ))}
            </Box>
            <Typography sx={{ fontSize: '0.7rem', mb: 0.5, color: COLORS.TEXT_SECONDARY }}>{patient.customFields?.premedRequired || patient.medicalHistory?.premed?.requiresPremed ? 'Premed required' : 'Premed not required'}</Typography>
            <Typography sx={{ fontSize: '0.7rem', mb: 0.5, color: COLORS.TEXT_SECONDARY }}>{patient.medicalAlerts?.length || 0} medical alerts</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: COLORS.TEXT_SECONDARY }}>Requested on {formatDate(patient.createdAt || new Date())}</Typography>
          </Box>
          
          {/* COLUMN 2 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <EmailIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: 14, mr: 1 }} />
               <Typography sx={{ fontSize: '0.7rem', color: COLORS.TEXT_SECONDARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.email || 'None'}</Typography>
             </Box>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <PhoneIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: 14, mr: 1 }} />
               <Typography sx={{ fontSize: '0.7rem', color: COLORS.TEXT_SECONDARY }}>{patient.phonePrimary || 'None'}</Typography>
             </Box>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <ChatIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: 14, mr: 1 }} />
               <Typography sx={{ fontSize: '0.7rem', color: COLORS.TEXT_SECONDARY }}>Patient communication</Typography>
             </Box>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
               <GroupIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: 14, mr: 1 }} />
               <Typography sx={{ fontSize: '0.7rem', color: COLORS.TEXT_SECONDARY }}>{patient.household?.length || 0} family members</Typography>
             </Box>
             <Box sx={{ display: 'flex', alignItems: 'center' }}>
               <BusinessIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: 14, mr: 1 }} />
               <Typography sx={{ fontSize: '0.7rem', color: COLORS.TEXT_SECONDARY }}>Referring Sources</Typography>
             </Box>
          </Box>

          {/* COLUMN 3 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
             {primaryIns ? (
               <>
                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                   <SecurityIcon sx={{ color: COLORS.ACCENT, fontSize: 14, mr: 1 }} />
                   <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{primaryIns.insuranceCompanyId?.name || 'Unknown Payer'} (Primary)</Typography>
                 </Box>
               </>
             ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                   <SecurityIcon sx={{ color: COLORS.TEXT_MUTED, fontSize: 14, mr: 1 }} />
                   <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_SECONDARY }}>No primary insurance</Typography>
                 </Box>
             )}
             <Typography sx={{ fontSize: '0.7rem', mt: 2, color: COLORS.TEXT_SECONDARY }}>
               Patient flags: <span style={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                 {Array.isArray(patient.patientFlags) && patient.patientFlags.length 
                   ? patient.patientFlags.map(f => f?.label || f?.name || String(f)).join(', ') 
                   : 'None'}
               </span>
             </Typography>
          </Box>

           {/* COLUMN 4 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                 <MoneyIcon sx={{ color: COLORS.STATUS_SUCCESS, fontSize: 16, mr: 0.5 }} />
                 <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Outstanding Family:</Typography>
               </Box>
               <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{patient.familyBalance || '-'}</Typography>
             </Box>
             <Box sx={{ display: 'flex', mb: 1.5, pl: 2, justifyContent: 'space-between' }}>
               <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Outstanding Patient:</Typography>
               <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{patient.patientBalance || '-'}</Typography>
             </Box>
             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>Last patient pay:</Typography>
             <Typography sx={{ fontSize: '0.7rem', mb: 1, color: COLORS.TEXT_PRIMARY }}>{patient.lastPatientPay || '-'}</Typography>
             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_SECONDARY }}>Last ins pay:</Typography>
             <Typography sx={{ fontSize: '0.7rem', color: COLORS.TEXT_PRIMARY }}>{patient.lastInsPay || '-'}</Typography>
          </Box>

          {/* COLUMN 5 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
               <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase' }}>Next TX Appt</Typography>
             </Box>
             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_PRIMARY, mb: 2 }}>
               {patient.nextTxAppt?.date ? `${patient.nextTxAppt.date} ${patient.nextTxAppt.time || ''}`.trim() : 'Unknown'}
             </Typography>
             
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
               <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase' }}>Next HYG Appt</Typography>
             </Box>
             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_PRIMARY, mb: 2 }}>
               {patient.nextHygAppt?.date ? `${patient.nextHygAppt.date} ${patient.nextHygAppt.time || ''}`.trim() : 'Unknown'}
             </Typography>

             <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
               <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase' }}>Pref Dentist</Typography>
             </Box>
             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_PRIMARY, mb: 2 }}>
               {dentistName || 'Not assigned'}
             </Typography>
             
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
               <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase' }}>Pref Hygienist</Typography>
             </Box>
             <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
               {hygienistName || 'Not assigned'}
             </Typography>
          </Box>
        </Box>
      </Box>

      {/* TWO COLUMN LAYOUT FOR TOP HALF */}
      <Box sx={{ display: 'flex', gap: 6, mb: 4, width: '100%' }}>
        
        {/* COLUMN 1 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Patient Details">
            <FieldRow label="Title" value={patient.title || ''} />
            <FieldRow label="First Name" value={patient.firstName} />
            <FieldRow label="Middle Name" value={patient.middleName} />
            <FieldRow label="Last Name" value={patient.lastName} />
            <FieldRow label="Preferred Name" value={patient.preferredName} />
            <FieldRow label="Date of Birth" value={formatDate(patient.dateOfBirth)} />
            <Box sx={{ mt: 2 }} />
            <FieldRow label="Age" value={calculateAge(patient.dateOfBirth)} />
            <FieldRow label="Sex at Birth" value={patient.sexAtBirth || 'Female'} boldLabel={true} />
            <FieldRow label="Gender Identity" value={patient.genderIdentity || 'Female/Woman'} boldLabel={true} />
            <Box sx={{ mt: 3 }} />
            <FieldRow label="Miscellaneous #1" value={patient.customFields?.misc1 || ''} />
            <FieldRow label="Miscellaneous #2" value={patient.customFields?.misc2 || ''} />
          </PrintSection>
        </Box>

        {/* COLUMN 2 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Contact Information">
            <FieldRow label="Mobile Number" value={patient.phonePrimary} />
            <Box sx={{ mt: 2 }} />
            <FieldRow label="Home Phone Number" value={patient.phoneSecondary} />
            <Typography sx={{ fontSize: '0.85rem', color: 'black', mt: 1 }}>Patient's Address:</Typography>
            <Box sx={{ pl: 2, mt: 0.5 }}>
              <FieldRow label="Country" value={patient.address?.country || 'United States'} />
              <FieldRow label="Address Line 1" value={patient.address?.street1} />
              <FieldRow label="Address Line 2" value={patient.address?.street2} />
              <FieldRow label="City" value={patient.address?.city} />
              <FieldRow label="State" value={patient.address?.state} />
              <FieldRow label="Zip/Postal Code" value={patient.address?.postalCode} />
            </Box>
            <FieldRow label="Email Address" value={patient.email} />
            <FieldRow label="Marital Status" value={patient.maritalStatus || 'Married'} boldLabel={true} />
          </PrintSection>
        </Box>
      </Box>

      {/* FAMILY FILE AND HEAD OF COMMUNICATION ROW */}
      <Box sx={{ display: 'flex', gap: 6, mb: 4, width: '100%' }}>
        {/* COLUMN 1 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Family File">
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 1, color: COLORS.TEXT_PRIMARY }}>
              Head of Household <span style={{ fontWeight: 400, color: COLORS.TEXT_MUTED }}>(One HOH per family)</span>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, bgcolor: COLORS.SURFACE_TINT, p: 1.5, borderRadius: 1, border: `1px solid ${COLORS.BORDER}` }}>
               <PersonIcon sx={{ color: COLORS.ACCENT, mr: 1, fontSize: 20 }} />
               <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{patient.headOfHousehold?.name || `${patient.firstName} ${patient.lastName}`}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${COLORS.BORDER}`, pb: 1, mb: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, width: '50%', color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase' }}>Family Members</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, width: '50%', textAlign: 'right', color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase' }}>Financial Responsibility</Typography>
            </Box>
            
            {patient.household?.length > 0 ? (
               patient.household.map((member, idx) => (
                 <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                       <PersonIcon sx={{ color: COLORS.TEXT_MUTED, mr: 1, fontSize: 18 }} />
                       <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{member.name || member.firstName}</Typography>
                    </Box>
                    <Box sx={{ width: '50%', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                         <RadioUncheckedIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED }} />
                         <Typography sx={{ fontSize: '0.8rem', color: COLORS.TEXT_SECONDARY }}>Self</Typography>
                       </Box>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                         <RadioCheckedIcon sx={{ fontSize: 16, color: COLORS.ACCENT }} />
                         <Typography sx={{ fontSize: '0.8rem', color: COLORS.TEXT_PRIMARY, fontWeight: 500 }}>HOH</Typography>
                       </Box>
                    </Box>
                 </Box>
               ))
            ) : (
               <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                     <PersonIcon sx={{ color: COLORS.TEXT_MUTED, mr: 1, fontSize: 18 }} />
                     <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{patient.firstName} {patient.lastName}</Typography>
                  </Box>
                  <Box sx={{ width: '50%', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                       <RadioUncheckedIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED }} />
                       <Typography sx={{ fontSize: '0.8rem', color: COLORS.TEXT_SECONDARY }}>Self</Typography>
                     </Box>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                       <RadioCheckedIcon sx={{ fontSize: 16, color: COLORS.ACCENT }} />
                       <Typography sx={{ fontSize: '0.8rem', color: COLORS.TEXT_PRIMARY, fontWeight: 500 }}>HOH</Typography>
                     </Box>
                  </Box>
               </Box>
            )}
          </PrintSection>
        </Box>

        {/* COLUMN 2 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Head of Communication">
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, bgcolor: COLORS.SURFACE_TINT, p: 1.5, borderRadius: 1, border: `1px solid ${COLORS.BORDER}` }}>
                <PersonIcon sx={{ color: COLORS.ACCENT, mr: 1, fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{patient.headOfHousehold?.name || `${patient.firstName} ${patient.lastName}`}</Typography>
             </Box>
             <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: COLORS.TEXT_MUTED, mt: 1 }}>
               For patients under 16, send all communication to the Head of Communication. Patients above 16 will receive their own communication.
             </Typography>
          </PrintSection>
        </Box>
      </Box>

      {/* MIDDLE SECTION - ROW 1 */}
      <Box sx={{ display: 'flex', gap: 6, mb: 4, width: '100%' }}>
        {/* COLUMN 1 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Additional Information">
            <FieldRow label="Occupation" value={patient.occupation} />
            <FieldRow label="Patient's / Guardian's Employer" value={patient.employer || patient.guardianEmployer} />
            <Typography sx={{ fontSize: '0.85rem', color: 'black', mt: 1 }}>Work Address:</Typography>
            <Box sx={{ pl: 2, mt: 0.5 }}>
              <FieldRow label="Country" value={patient.workAddress?.country || 'United States'} />
              <FieldRow label="Address Line 1" value={patient.workAddress?.line1} />
              <FieldRow label="Address Line 2" value={patient.workAddress?.line2} />
              <FieldRow label="City" value={patient.workAddress?.city} />
              <FieldRow label="State" value={patient.workAddress?.state} />
              <FieldRow label="Zip/Postal Code" value={patient.workAddress?.postalCode} />
            </Box>
          </PrintSection>
        </Box>

        {/* COLUMN 2 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Spouse Information">
             <FieldRow label="Spouse's Name" value={patient.spouseInfo?.name} />
             <FieldRow label="Spouse's Employer" value={patient.spouseInfo?.employer} boldLabel={true} />
             <FieldRow label="Work Phone Number" value={patient.spouseInfo?.phone} />
             <FieldRow label="Email Address" value={patient.spouseInfo?.email} />
          </PrintSection>
        </Box>
      </Box>

      {/* MIDDLE SECTION - ROW 2 */}
      <Box sx={{ display: 'flex', gap: 6, mb: 4, width: '100%' }}>
        {/* COLUMN 1 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Care Team Providers">
             <FieldRow label="Dentist" value={dentistName || 'Not assigned'} />
             <FieldRow label="Hygienist" value={hygienistName || 'Not assigned'} />
          </PrintSection>
        </Box>

        {/* COLUMN 2 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Emergency Contact">
             <FieldRow label="Name" value={patient.emergencyContact?.name} />
             <FieldRow label="Relationship" value={patient.emergencyContact?.relationship || 'Husband'} boldLabel={true} />
             <FieldRow label="Home Phone Number" value={patient.emergencyContact?.phone} />
             <FieldRow label="Work Phone Number" value={patient.emergencyContact?.workPhone || ''} />
             <FieldRow label="Mobile Number" value={patient.emergencyContact?.mobilePhone || ''} />
          </PrintSection>
        </Box>
      </Box>

      {/* MIDDLE SECTION - ROW 3 */}
      <Box sx={{ display: 'flex', gap: 6, mb: 4, width: '100%' }}>
        {/* COLUMN 1 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Referring">
             <Box sx={{ display: 'flex', mb: 1 }}>
                <Box sx={{ width: '50%' }}>
                  <Typography sx={{ fontSize: '0.85rem', mb: 0.5, color: COLORS.TEXT_SECONDARY }}>Referring sources:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{patient.referralSource ? patient.referralSource : 'None'}</Typography>
                </Box>
                <Box sx={{ width: '50%' }}>
                  <Typography sx={{ fontSize: '0.85rem', mb: 0.5, color: COLORS.TEXT_SECONDARY }}>Referring Patient:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{patient.customFields?.referringPatient || 'None'}</Typography>
                </Box>
             </Box>
             <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '50%' }}>
                  <Typography sx={{ fontSize: '0.85rem', mb: 0.5, color: COLORS.TEXT_SECONDARY }}>Last Visit Date:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{formatDate(patient.lastVisitDate) || 'None'}</Typography>
                </Box>
                <Box sx={{ width: '50%' }}>
                  <Typography sx={{ fontSize: '0.85rem', mb: 0.5, color: COLORS.TEXT_SECONDARY }}>Portal Access:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{patient.portalAccessEnabled ? 'Yes' : 'No'}</Typography>
                </Box>
             </Box>
          </PrintSection>
        </Box>

        {/* COLUMN 2 */}
        <Box sx={{ flex: 1 }}>
          <PrintSection title="Communication">
             <Typography sx={{ fontSize: '0.85rem', mb: 1 }}>
                You can contact patient via following means:
             </Typography>
             <CheckboxRow label="Contact me on the phone numbers provided" checked={patient.communicationPreference?.includes('phone') || false} />
             <CheckboxRow label="Leave voicemail at home" checked={patient.communicationPreference?.includes('voicemail') || false} />
             <CheckboxRow label="I agree that the dental practice may communicate with me electronically at the email address I provided." checked={patient.communicationPreference?.includes('email') || false} />
             <CheckboxRow label="By opting in, I agree to receive SMS messages from the dental office regarding appointment reminders." checked={patient.communicationPreference?.includes('sms') || false} />
          </PrintSection>
        </Box>
      </Box>
      
      {/* BOTTOM SECTION - ROW 1 */}
      <Box sx={{ display: 'flex', gap: 6, mb: 4, width: '100%' }}>
         {/* COLUMN 1 */}
         <Box sx={{ flex: 1 }}>
            <PrintSection title="Confirmation Settings">
               <Typography sx={{ fontSize: '0.85rem', mb: 1, color: COLORS.TEXT_SECONDARY }}>
                  Patient prefers to receive a reminder before appointment:
               </Typography>
               <Typography sx={{ fontSize: '0.85rem', fontWeight: patient.customFields?.reminderPreference === 'none' ? 700 : 400, mb: 0.5, color: COLORS.TEXT_PRIMARY }}>
                  No, it is unnecessary
               </Typography>
               <Typography sx={{ fontSize: '0.85rem', fontWeight: patient.customFields?.reminderPreference === 'helpful' ? 700 : 400, color: COLORS.TEXT_PRIMARY }}>
                  Yes, it is a helpful reminder
               </Typography>
               <Box sx={{ mt: 1.5 }} />
               <CheckboxRow label="Stop reminding after confirmation" checked={patient.customFields?.stopReminderAfterConfirmation || false} />
               <Box sx={{ mt: 1.5 }} />
               <CheckboxRow label="Pause Schedule Gap-Fill Reminders" checked={patient.customFields?.communicationPauseScheduleGapFillsReminders || false} />
               <Box sx={{ mt: 1.5 }} />
               <CheckboxRow label="Pause AR Automation Reminders" checked={patient.customFields?.communicationPauseArAutomationReminders || false} />
               <Box sx={{ mt: 1.5 }} />
               <CheckboxRow label="Receive Email Campaign" checked={patient.customFields?.communicationAgreeElectronicCommunications || false} />
            </PrintSection>
         </Box>

         {/* COLUMN 2 */}
         <Box sx={{ flex: 1 }}>
            <PrintSection title="Credit Card">
               {patient.customFields?.creditCards?.length > 0 ? (
                 <>
                   <FieldRow label="Last Four Digits" value={patient.customFields.creditCards[0].last4 || ''} />
                   <FieldRow label="Expiration Date" value={
                     patient.customFields.creditCards[0].expMonth && patient.customFields.creditCards[0].expYear
                       ? `${String(patient.customFields.creditCards[0].expMonth).padStart(2, '0')}/${String(patient.customFields.creditCards[0].expYear).slice(-2)}`
                       : ''
                   } />
                   <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic', mt: 1 }}>Registered with Payrix</Typography>
                 </>
               ) : (
                 <Typography sx={{ fontSize: '0.85rem' }}>None registered</Typography>
               )}
            </PrintSection>
         </Box>
      </Box>

      {/* BOTTOM SECTION - ROW 2 */}
      <Box sx={{ display: 'flex', gap: 6, mb: 4, width: '100%' }}>
         {/* COLUMN 1 */}
         <Box sx={{ flex: 1 }}>
            <PrintSection title="Assignment & Release">
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>Assignment & Release:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     <Typography sx={{ fontSize: '0.85rem', mr: 2 }}>{patient.assignmentAndRelease?.assignmentRelease || patient.customFields?.assignmentRelease || 'Not answered'}</Typography>
                  </Box>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>Photography Release:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     <Typography sx={{ fontSize: '0.85rem', mr: 2 }}>{patient.assignmentAndRelease?.photographyRelease || patient.customFields?.photographyRelease || 'Not answered'}</Typography>
                  </Box>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>Social Media Release:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     <Typography sx={{ fontSize: '0.85rem', mr: 2 }}>{patient.assignmentAndRelease?.socialMediaRelease || patient.customFields?.socialMediaRelease || 'Not answered'}</Typography>
                  </Box>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>AI Release:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', mr: 2 }}>{patient.assignmentAndRelease?.aiRelease || patient.customFields?.aiRelease || 'Not answered'}</Typography>
               </Box>
            </PrintSection>
         </Box>

         {/* COLUMN 2 */}
         <Box sx={{ flex: 1 }}>
            <PrintSection title="Bank Account">
               {patient.customFields?.bankAccounts?.length > 0 ? (
                 <>
                   <FieldRow label="Account Number (Last 4)" value={patient.customFields.bankAccounts[0].last4 || ''} />
                   <FieldRow label="Routing Number" value={patient.customFields.bankAccounts[0].routingNumber || ''} />
                 </>
               ) : (
                 <Typography sx={{ fontSize: '0.85rem' }}>None registered</Typography>
               )}
            </PrintSection>
         </Box>
      </Box>

      {/* BOTTOM SECTION - ROW 3 */}
      <Box sx={{ display: 'flex', gap: 6, mb: 4, width: '100%' }}>
         {/* COLUMN 1 */}
         <Box sx={{ flex: 1 }}>
            <PrintSection title="Policy Information (Primary)">
               <FieldRow label="Subscriber Name" value={primaryIns?.subscriberName || (primaryIns?.relationshipToPatient?.toLowerCase() === 'self' ? `${patient.firstName} ${patient.lastName}`.trim() : '')} />
               <FieldRow label="Policy Number" value={primaryIns?.policyNumber} />
               <FieldRow label="Group Name / Employer" value={primaryIns?.groupName} />
               <FieldRow label="Group Number" value={primaryIns?.groupNumber} />
               <FieldRow label="Payer Name" value={primaryIns?.insuranceCompanyId?.name} boldLabel={true} />
               <FieldRow label="Plan Fee Guide" value={getFeeGuideName(primaryIns?.planFeeGuide, primaryIns?.providersPlanFeeGuides)} />
            </PrintSection>
         </Box>
         
         {/* COLUMN 2 */}
         <Box sx={{ flex: 1 }}>
            <PrintSection title="Release Information">
               <FieldRow label="Release to Spouse/Partner" value={patient.customFields?.releaseSpouse ? 'Yes' : 'No'} />
               <FieldRow label="Release to Children" value={patient.customFields?.releaseChildren ? 'Yes' : 'No'} />
               <FieldRow label="Release to Parents" value={patient.customFields?.releaseParents ? 'Yes' : 'No'} />
               <FieldRow label="Release to Other" value={Array.isArray(patient.customFields?.releaseOther) ? patient.customFields?.releaseOther.join(', ') : (patient.customFields?.releaseOther || 'None')} />
               
               <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', mt: 4, mb: 1, textAlign: 'center' }}>
                  Confidential Signature
               </Typography>
               <Box sx={{ 
                  height: 80, 
                  width: '90%', 
                  margin: '0 auto', 
                  border: '1px solid #ddd', 
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.1)', 
                  bgcolor: 'white' 
               }} />
            </PrintSection>
         </Box>
      </Box>
    </Box>
  );
});

export default PatientRegistrationDocument;
