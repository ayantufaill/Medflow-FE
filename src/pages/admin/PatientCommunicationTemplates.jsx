import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  IconButton, 
  Divider,
  TextField,
  Button,
  Collapse,
  useTheme
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Sms as SmsIcon, 
  InfoOutlined as InfoIcon,
  Sync as SyncIcon,
  SwapVert as SortIcon,
  ChevronRight,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Settings,
  Add as AddIcon,
  AdsClick as AdsClickIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cake as CakeIcon,
  CalendarMonth,
  CreditCard
} from '@mui/icons-material';

const TEMPLATE_SUB_TABS = [
  { label: 'Automated Templates', id: 'automated' },
  { label: 'Referral Templates', id: 'referral' },
  { label: 'Email/Text Templates', id: 'email-text' },
  { label: 'Custom Letter', id: 'custom-letter' },
  { label: 'Lab Templates', id: 'lab' },
];

const AutomatedTemplatesList = ({ selectedTemplate, onSelect }) => {
  // ... templates array stays the same ...
  const templates = [
    { name: 'AR Automation 15 Days', type: 'email' },
    // ... other templates ...
    { name: 'AR Automation 15 Days', type: 'text' },
    { name: 'AR Automation 30 Days', type: 'email' },
    { name: 'AR Automation 30 Days', type: 'text' },
    { name: 'AR Automation 45 Days', type: 'email' },
    { name: 'AR Automation 45 Days', type: 'text' },
    { name: 'Accept New Online Appt', type: 'email', hasSync: true },
    { name: 'Appointment Reminder', type: 'text', hasInfo: true, hasSync: true },
    { name: 'Appointment Reminder', type: 'email', hasInfo: true, hasSync: true },
    { name: 'Appointment Reminder Without Confirm', type: 'text', hasInfo: true, hasSync: true },
    { name: 'Appointment Reminder Without Confirm', type: 'email', hasInfo: true, hasSync: true },
    { name: 'Birthday', type: 'email', hasSync: true },
    { name: 'Cancel Appointment', type: 'text', hasSync: true },
    { name: 'Cancel Appointment', type: 'email', hasSync: true },
    { name: 'Decline New Online Appt', type: 'email', hasSync: true },
    { name: 'Membership Renewal', type: 'email', hasSync: true },
    { name: 'Missed Call Auto Reply', type: 'text' },
    { name: 'My Chart Register Invitation Sms', type: 'text', hasSync: true },
    { name: 'One Time Payment', type: 'email', hasSync: true },
    { name: 'One Time Payment', type: 'text', hasSync: true },
    { name: 'Patient Update Request Without MyChart', type: 'email', hasSync: true },
    { name: 'Patient Update Request Without MyChart', type: 'text', hasSync: true },
    { name: 'Patient Update Request With MyChart', type: 'email', hasSync: true },
    { name: 'Patient Update Request With MyChart', type: 'text', hasSync: true },
    { name: 'Patient Welcome', type: 'email', hasSync: true },
    { name: 'Patient Welcome', type: 'text', hasSync: true },
    { name: 'Recall Reminder After', type: 'email', hasSync: true },
    { name: 'Recall Reminder After', type: 'text', hasSync: true },
    { name: 'Recall Reminder Before', type: 'email', hasSync: true },
    { name: 'Recall Reminder Before', type: 'text', hasSync: true },
    { name: 'Request Online Appointment', type: 'email', hasSync: true },
    { name: 'Reschedule Appointment', type: 'email', hasSync: true },
    { name: 'Reschedule Appointment', type: 'text', hasSync: true },
    { name: 'Review Reminder', type: 'email', hasSync: true },
    { name: 'Review Reminder', type: 'text', hasSync: true },
    { name: 'Save The Date', type: 'text', hasSync: true },
    { name: 'Save The Date', type: 'email', hasSync: true },
    { name: 'Shared Custom Form', type: 'email', hasSync: true },
    { name: 'Shared Custom Form', type: 'text', hasSync: true },
    { name: 'Shared Payment Plan', type: 'email', hasSync: true },
    { name: 'Shared Payment Plan', type: 'text', hasSync: true },
    { name: 'Shared Post Ops', type: 'email' },
    { name: 'Shared Post Ops', type: 'text' },
    { name: 'Shared Pre Ops', type: 'email' },
    { name: 'Shared Pre Ops', type: 'text' },
    { name: 'Shared Receipt', type: 'email', hasSync: true },
    { name: 'Shared Receipt', type: 'text', hasSync: true },
    { name: 'Shared Risk Assessment', type: 'email', hasSync: true },
    { name: 'Shared Risk Assessment', type: 'text', hasSync: true },
    { name: 'Shared Statement', type: 'email', hasSync: true },
    { name: 'Shared Statement', type: 'text', hasSync: true },
    { name: 'Shared Treatment Plan', type: 'email', hasSync: true },
    { name: 'Shared Treatment Plan', type: 'text', hasSync: true },
    { name: 'Shared Uploaded Doc', type: 'email', hasSync: true },
    { name: 'Shared Uploaded Doc', type: 'text', hasSync: true },
    { name: 'Schedule Gap Fills', type: 'email' },
    { name: 'Schedule Gap Fills', type: 'text' },
    { name: 'Unsigned Consent Form Reminder', type: 'email' },
  ];

  return (
    <Box sx={{ borderRight: '1px solid #eee', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
          Automated Templates <SortIcon sx={{ fontSize: 18, color: '#4b71a1' }} />
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 0, overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
        {templates.map((template, index) => (
          <React.Fragment key={index}>
            <ListItem 
              button 
              onClick={() => onSelect(index, template)}
              sx={{ 
                px: 2, 
                py: 1, 
                '&:hover': { backgroundColor: '#f0f4fa' },
                borderLeft: selectedTemplate === index ? '4px solid #4b71a1' : '4px solid transparent',
                backgroundColor: selectedTemplate === index ? '#f0f4fa' : 'transparent'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', flexGrow: 1 }}>
                  {template.name}
                </Typography>
                
                {template.hasInfo && <InfoIcon sx={{ fontSize: 16, color: '#999' }} />}
                {template.type === 'email' ? (
                  <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                ) : (
                  <SmsIcon sx={{ fontSize: 16, color: '#666' }} />
                )}

                {template.hasSync && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
                    <SyncIcon sx={{ fontSize: 14, color: '#4b71a1' }} />
                    <Typography sx={{ fontSize: '0.7rem', color: '#4b71a1', fontWeight: 600 }}>Sync</Typography>
                  </Box>
                )}
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

const VariableAccordion = ({ title, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <Box sx={{ borderBottom: '1px solid #eee' }}>
      <Box 
        onClick={() => setExpanded(!expanded)}
        sx={{ 
          p: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer',
          backgroundColor: '#f8fafc',
          '&:hover': { backgroundColor: '#f1f5f9' }
        }}
      >
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{title}</Typography>
        <ChevronRight sx={{ fontSize: 18, color: '#94a3b8', transform: expanded ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

const VariableButton = ({ label, hasPlus = true }) => (
  <Button 
    variant="outlined" 
    size="small" 
    sx={{ 
      textTransform: 'none', 
      fontSize: '0.7rem', 
      color: '#64748b', 
      borderColor: '#e2e8f0',
      borderRadius: '16px',
      px: 1.5,
      py: 0.2,
      minWidth: 'auto',
      '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }
    }}
  >
    {label} {hasPlus && '+'}
  </Button>
);

const TemplateEditor = ({ selectedTemplate, templateInfo }) => {
  const isSms = templateInfo?.type === 'text';

  const isOnlineAppt = templateInfo?.name === 'Accept New Online Appt';
  const isDeclineAppt = templateInfo?.name === 'Decline New Online Appt';
  const isApptReminder = templateInfo?.name?.includes('Appointment Reminder');
  const isWithoutConfirm = templateInfo?.name?.includes('Without Confirm');
  const isBirthday = templateInfo?.name === 'Birthday';
  const isCancelAppt = templateInfo?.name === 'Cancel Appointment';
  const isMembershipRenewal = templateInfo?.name === 'Membership Renewal';
  const isMissedCall = templateInfo?.name === 'Missed Call Auto Reply';
  const isMyChartInvitation = templateInfo?.name === 'My Chart Register Invitation Sms';
  const isOneTimePayment = templateInfo?.name === 'One-Time Payment';
  const isPatientUpdateWithMyChart = templateInfo?.name?.includes('Patient Update Request With MyChart');
  const isPatientUpdateWithoutMyChart = templateInfo?.name?.includes('Patient Update Request Without MyChart');
  const isPatientWelcome = templateInfo?.name === 'Patient Welcome';
  const isRecallReminder = templateInfo?.name?.includes('Recall Reminder After');
  const isRecallBefore = templateInfo?.name?.includes('Recall Reminder Before');

  const emailBlocks = isRecallBefore ? [
    { id: 1, content: 'Hello {Patient: Preferred Name}!' },
    { id: 2, content: 'We noticed that it is time for your routine hygiene visit and you don\'t have an appointment reserved.' },
    { id: 3, content: 'Please contact us to set an appointment with Dr. Sabour. We now offer booking online! Click the link below to request an appointment time.' },
  ] : isRecallReminder ? [
    { id: 'img_banner', type: 'image', alt: 'Practice Banner', redirect: 'Redirect URL' },
    { id: 1, content: 'We miss you!', style: { textAlign: 'center', color: '#f87171', fontWeight: 700, fontSize: '1.2rem' } },
    { id: 2, content: 'We noticed that you are overdue for a hygiene visit. Please contact us to set an appointment with Dr. Sabour! We offer booking online!\n\nPlease click the link below to request a time.' },
    { id: 'btn_action', type: 'action_buttons', label: 'Buttons will render here' },
  ] : isPatientWelcome ? [
    { id: 'img_journey', type: 'image', alt: 'YOUR PATIENT JOURNEY', redirect: 'https://anychart.myconya.com/patient/home/welcome' },
    { id: 'img_care', type: 'image', alt: 'COMPREHENSIVE CARE', redirect: 'Redirect URL' },
  ] : isPatientUpdateWithMyChart ? [
    { id: 1, content: 'Dear {Patient: First Name} {Patient: Last Name},' },
    { id: 2, content: 'As your trusted healthcare providers, we strive to provide you with the best care possible. To ensure a seamless and efficient experience during your upcoming appointment, we kindly request your assistance in completing the mandatory forms 24 hours prior to your reserved appointment.' },
    { id: 3, content: 'We are serious about protecting your private information and ensuring that we have accurate data about your medical and dental history. Rest assured that all information you provide is strictly confidential and protected by privacy laws.\n\nWe are pleased that we are able to provide you exclusive and secure access to your own records on "MyChart". This must be updated 24 hours prior to your reserved appointment.' },
    { id: 4, content: 'Your health and well-being are our top priority, and your cooperation in completing these forms beforehand helps us optimize your appointment time and provide you with the highest quality of care. Filling out these forms allows us to gain a comprehensive understanding of your medical background, pre-existing conditions, and any medications or allergies that may impact your treatment. By providing us with this information, we can tailor our approach to meet your specific needs, guaranteeing a safe and personalized experience.' },
  ] : isPatientUpdateWithoutMyChart ? [
    { id: 1, content: 'Dear {Patient: First Name} {Patient: Last Name},' },
    { id: 2, content: 'We are serious about protecting your private information and ensuring that we have accurate data about your medical and dental history. We are pleased that we are able to provide you exclusive and secure access to your own records on "MyChart". This must be updated 24 hours prior to your reserved appointment.' },
    { id: 3, content: 'Keeping us current on your information is essential for providing the best care and we appreciate you helping us maintain our high standards.' },
  ] : isOneTimePayment ? [
    { id: 'img_payment', type: 'image', alt: 'Payment Request', redirect: 'Redirect URL' },
    { id: 1, content: '{Practice: Name} has requested a payment of {One-Time Payment: Amount}' },
  ] : isMembershipRenewal ? [
    { id: 1, content: 'Hello {Patient: First Name}, Your {Membership Renewal: Plan Name} membership plan with {Practice: Name} has been renewed.' },
    { id: 2, content: 'Renewal amount: {Membership Renewal: Amount}' },
    { id: 3, content: '{Membership Renewal: Payment Info}' },
  ] : isDeclineAppt ? [
    { id: 'img_decline', type: 'image', alt: 'Decline Appointment', redirect: 'Redirect URL' },
    { id: 1, content: 'Your appointment has been declined' },
    { id: 2, content: 'for {Decline New Online Appt: Appointment Date} at {Decline New Online Appt: Appointment Time}' },
  ] : isCancelAppt ? [
    { id: 1, content: 'Your appointment on {Cancel Appt: Appointment Date} at {Cancel Appt: Appointment Time} with {Cancel Appt: Provider First Name} {Cancel Appt: Provider Last Name} has been canceled.' },
  ] : isBirthday ? [
    { id: 'img1', type: 'image', alt: 'Birthday Image', redirect: 'Redirect URL' },
    { id: 1, content: '{Practice Name} team is sending you smiles for your special day!\n\nWe sincerely appreciate your trust and confidence in our dental practice, and we are honored to be a part of your journey towards a healthy and radiant smile. As you celebrate your special day, may it be filled with laughter, love, and the company of your loved ones.' },
    { id: 2, content: 'Once again, Happy Birthday! May the year ahead be filled with countless reasons to smile and may your dental health continue to shine brightly. We look forward to seeing you at your next appointment.' },
  ] : isWithoutConfirm ? [
    { id: 1, content: 'Hello {Patient: Preferred Name}!' },
    { id: 2, content: 'We are looking forward to seeing you. Since you have not confirmed your appointment yet with us, this is a courtesy reminder you requested for your appointment(s) on' },
    { id: 3, content: '{Appointment Reminder: Appt Date-Time small}' },
  ] : isApptReminder ? [
    { id: 1, content: 'Hello {Patient: Preferred Name}!' },
    { id: 2, content: 'This is a reminder you requested for your appointment(s) on' },
    { id: 3, content: '{Appointment Reminder: Appt Date-Time small}' },
  ] : isOnlineAppt ? [
    { id: 1, content: 'Hello {Patient: Preferred Name}! You have successfully booked an appointment' },
    { id: 2, content: 'for {Accept New Online Appt: Appointment Date} at {Accept New Online Appt: Appointment Time}' },
    { id: 3, content: 'with {Accept New Online Appt: Provider First Name} {Accept New Online Appt: Provider Last Name}' },
  ] : templateInfo?.name?.includes('45 Days') ? [
    { id: 1, content: 'Hello {Patient: First Name}, We are writing to remind you that your account with {Practice Name} still has an outstanding balance, which remains unpaid despite our previous attempts to contact you. To help resolve this, we encourage you to contact us at {Practice: Phone number} as soon as possible to discuss your account and set up a payment plan that works for you.' },
    { id: 2, content: 'Please note that it’s important to take action promptly to avoid any further steps that may be required to collect this overdue balance.' },
    { id: 3, content: 'Best regards, {Practice Name}' },
  ] : templateInfo?.name?.includes('30 Days') ? [
    { id: 1, content: 'Hello {Patient: First Name}, We’re reaching out again regarding your outstanding balance with {Practice Name}. A statement detailing this balance was previously sent to you, but it appears the payment has not yet been received {Outstanding Balance} {Quick Payment}.' },
    { id: 2, content: 'If there’s any issues with your statement or if you need clarification, please don’t hesitate to contact us. We kindly request that you review your account and take action as soon as possible.' },
    { id: 3, content: 'Best regards, {Practice Name}' },
  ] : [
    { id: 1, content: 'Hello {Patient: First Name}, This is a reminder that your account with {Practice Name} has a past due balance. To help you stay up to date, we have attached a detailed statement to this email for your review {Outstanding Balance} {Quick Payment}' },
    { id: 2, content: 'We kindly ask that you review your statement and make a payment at your earliest convenience. If you have any questions or need assistance, feel free to reach out to us. We’re happy to help.' },
    { id: 3, content: 'Best regards, {Practice Name}' },
  ];

  const smsBlocks = isRecallBefore ? [
    { id: 1, content: 'Hello {Patient: Preferred Name}! It is time for your routine hygiene visit with {Practice: Name}. Please contact us at {Practice: Phone number} to schedule your appointment.' }
  ] : isRecallReminder ? [
    { id: 1, content: 'We missed you! Please contact {Practice: Name} to schedule your routine dental appt. {Practice: Phone number}' }
  ] : isPatientWelcome ? [
    { id: 1, content: 'Welcome to {Practice: Name}' },
    { id: 2, content: 'Thank you for choosing our office for your dental care. We are committed to providing you with excellent service.' },
    { id: 3, content: 'Please click on the link below to fill in your medical and dental history. To help you make maximum use of your time with us, this is needed prior to your appointment.' },
  ] : isPatientUpdateWithMyChart ? [
    { id: 1, content: 'Dear {Patient: First Name} {Patient: Last Name}' },
    { id: 2, content: 'We are serious about protecting your private information and ensuring that we have accurate data about your medical and dental history.' },
    { id: 3, content: 'Please click on the link below to update your record:' },
  ] : isPatientUpdateWithoutMyChart ? [
    { id: 1, content: 'Dear {Patient: First Name} {Patient: Last Name}' },
    { id: 2, content: 'We are serious about protecting your private information and ensuring that we have accurate data about your medical and dental history. This must be updated 24 hours prior to your reserved appointment.' },
    { id: 3, content: 'Please click on the link below to update your record:' },
  ] : isMyChartInvitation ? [
    { id: 1, content: '{Practice: Name} has requested a payment of {One-Time Payment: Amount}. Click on the link below to pay. Please note that this link expires in 5 days.\n{One-Time Payment: Link}' }
  ] : null;

  const smsContent = isMissedCall
    ? "Sorry we couldn't answer your call, please try again in fast"
    : isMembershipRenewal
    ? 'Your {Membership Renewal: Plan Name} membership with {Practice: Name} has been renewed. Renewal amount: {Membership Renewal: Amount}.'
    : isDeclineAppt
    ? 'Your appointment for {Decline New Online Appt: Appointment Date} at {Decline New Online Appt: Appointment Time} has been declined.'
    : isCancelAppt
    ? 'Your appointment on {Cancel Appt: Appointment Date} at {Cancel Appt: Appointment Time} with {Cancel Appt: Provider First Name} {Cancel Appt: Provider Last Name} has been canceled.'
    : isBirthday
    ? 'Happy Birthday from {Practice Name} team! We wish you a day filled with laughter and love {Patient: Preferred Name}. Enjoy your special day!'
    : isWithoutConfirm
    ? 'Hello, {Patient: Preferred Name}! We are looking forward to seeing you soon at The Dental Studio on {Patient: Next Appointment}. If you need to make a change to your appointment, please call the practice {Practice: Phone number}; we require 48 business hours notice to modify reservations to avoid incurring a fee. Please text OK to acknowledge receipt of this reminder.'
    : isApptReminder 
    ? 'Hello, {Patient: First Name}! We are excited to see you on {Patient: Next Appointment}. Our office is located at 2345 Olympia Dr. Suite 200 Flower Mound, TX 75028. The entrance to our building faces the pool of fun.\n\nTo make changes to your confirmed reservation, please call {Practice: Phone number}. We require a minimum 48 hour notice for changes to avoid incurring a fee. Thank you for your cooperation. We look forward to seeing you!'
    : isOnlineAppt 
    ? 'Hello {Patient: Preferred Name}! You have successfully booked an appointment for {Accept New Online Appt: Appointment Date} at {Accept New Online Appt: Appointment Time} with {Accept New Online Appt: Provider First Name} {Accept New Online Appt: Provider Last Name}.'
    : templateInfo?.name?.includes('45 Days')
    ? 'FINAL NOTICE: Your account with {Practice Name} has an outstanding balance that remains unpaid. Please contact us at {Practice: Phone number} immediately to discuss payment options and avoid further collection steps.'
    : templateInfo?.name?.includes('30 Days') 
    ? 'We’re following up on your outstanding balance with {Practice Name}. A statement detailing this balance was previously sent to you, but it appears the payment has not yet been received {Outstanding Balance} {Quick Payment}. Please review your account and contact us if you need assistance. Thank you!'
    : 'This is a reminder of your past due balance with {Practice Name}. Please review your statement and make a payment at your earliest convenience {Outstanding Balance} {Quick Payment}.';

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #eee', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
          {templateInfo?.name || 'Template Editor'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button size="small" variant="outlined" sx={{ textTransform: 'none', color: '#64748b', borderColor: '#cbd5e1' }}>Reset</Button>
          <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#4b71a1', '&:hover': { backgroundColor: '#3b5a80' } }}>Preview</Button>
          <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}>Save</Button>
        </Box>
      </Box>

      <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
        {!isSms ? (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Subject</Typography>
              <TextField 
                key={templateInfo?.name + '-subject'}
                fullWidth 
                size="small" 
                defaultValue={
                  isRecallBefore ? 'Recall Reminder Before' :
                  isRecallReminder ? 'Recall Reminder After' :
                  isPatientWelcome ? "We're excited to meet you! Here's what comes next" :
                  isPatientUpdateWithMyChart || isPatientUpdateWithoutMyChart ? templateInfo?.name :
                  isOneTimePayment ? 'One-Time Payment' :
                  isMembershipRenewal ? 'Your Membership Plan Has Been Renewed' :
                  isDeclineAppt ? 'Decline New Online Appt' :
                  isCancelAppt ? 'Cancel Appointment' :
                  isBirthday ? 'Happy Birthday from {Practice Name} team' :
                  isWithoutConfirm ? 'Please confirm your appt with us' :
                  isApptReminder ? 'Appointment Reminder' :
                  isOnlineAppt ? 'Hello from {Practice Name}' :
                  templateInfo?.name?.includes('45 Days') ? 'Final Notice: Outstanding Balance - Please Contact Us' :
                  templateInfo?.name?.includes('30 Days') ? 'Follow-Up: Outstanding Balance on Your Account' : 
                  'Important: Past Due Balance on Your Account'
                }
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 1</Typography>
                  <TextField 
                    fullWidth 
                    size="small" 
                    defaultValue={
                      isRecallBefore ? "Help protect your smile with preventative care!" :
                      isPatientWelcome ? "Welcome to The Dental Studio! We're truly honored you chose us for" :
                      isBirthday ? 'Happy Birthday {Patient: Preferred Name}!' : ''
                    }
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 2</Typography>
                  <TextField 
                    fullWidth 
                    size="small" 
                    defaultValue={isPatientWelcome ? "This email will walk you through what to expect and how to prepare so" : ""}
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
                  />
                </Box>
              </Box>
            </Box>

            {emailBlocks.map((block) => (
              <Box key={block.id} sx={{ mb: 4 }}>
                {block.type === 'image' ? (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ 
                      border: '1px solid #e2e8f0', 
                      backgroundColor: '#f8fafc',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      <Typography sx={{ fontSize: '0.75rem' }}>Alt Text: {block.alt}</Typography>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                      <Typography sx={{ fontSize: '0.75rem' }}>Redirect URL: {block.redirect}</Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        <IconButton size="small"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                        <IconButton size="small"><DeleteIcon sx={{ fontSize: 16, color: '#f87171' }} /></IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      border: '1px solid #e2e8f0', 
                      borderTop: 'none',
                      p: 4, 
                      display: 'flex', 
                      justifyContent: 'center',
                      backgroundColor: '#f1f5f9'
                    }}>
                      {block.id === 'img_banner' ? <CalendarMonth sx={{ fontSize: 120, color: '#4b71a1' }} /> : 
                       block.id === 'img_journey' ? <CalendarMonth sx={{ fontSize: 120, color: '#4b71a1' }} /> : 
                       block.id === 'img_care' ? <CakeIcon sx={{ fontSize: 120, color: '#4b71a1' }} /> :
                       isBirthday ? <CakeIcon sx={{ fontSize: 120, color: '#22c55e' }} /> : 
                       isOneTimePayment ? <CreditCard sx={{ fontSize: 120, color: '#64748b' }} /> :
                       <CalendarMonth sx={{ fontSize: 120, color: '#f87171' }} />}
                    </Box>
                  </Box>
                ) : block.type === 'action_buttons' ? (
                  <Box sx={{ 
                    mb: 2, 
                    p: 4, 
                    border: '1px solid #e2e8f0', 
                    borderStyle: 'dashed',
                    backgroundColor: '#f8fafc',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.85rem'
                  }}>
                    {block.label}
                  </Box>
                ) : (
                  <>
                    <Box sx={{ border: '1px solid #e2e8f0', borderBottom: 'none', p: 0.5, backgroundColor: '#f8fafc', display: 'flex', gap: 1 }}>
                      <IconButton size="small"><FormatBold sx={{ fontSize: 18 }} /></IconButton>
                      <IconButton size="small"><FormatItalic sx={{ fontSize: 18 }} /></IconButton>
                      <IconButton size="small"><FormatUnderlined sx={{ fontSize: 18 }} /></IconButton>
                    </Box>
                    <Box sx={{ 
                      border: '1px solid #e2e8f0', 
                      p: 2, 
                      minHeight: 100, 
                      fontSize: '0.85rem', 
                      lineHeight: 1.6,
                      ...block.style
                    }}>
                      {block.content}
                    </Box>
                  </>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#f87171', cursor: 'pointer' }}>Remove</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" startIcon={<AddIcon sx={{ fontSize: 14 }} />} sx={{ textTransform: 'none', fontSize: '0.7rem' }}>Add Image</Button>
                    <Button variant="outlined" size="small" startIcon={<AddIcon sx={{ fontSize: 14 }} />} sx={{ textTransform: 'none', fontSize: '0.7rem' }}>Add Paragraph</Button>
                    <Button variant="outlined" size="small" startIcon={<AdsClickIcon sx={{ fontSize: 14 }} />} sx={{ textTransform: 'none', fontSize: '0.7rem' }}>Add Action Buttons</Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </>
        ) : (
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Body</Typography>
            {smsBlocks ? (
              smsBlocks.map((block) => (
                <Box key={block.id} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={block.content.length > 100 ? 4 : 2}
                    defaultValue={block.content}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { fontSize: '0.85rem', lineHeight: 1.6 }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#f87171', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Remove</Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={isApptReminder ? 8 : 6}
                  defaultValue={smsContent}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { fontSize: '0.85rem', lineHeight: 1.6 }
                  }}
                />
                {isApptReminder && !isCancelAppt && !isDeclineAppt && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#f87171', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Remove</Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <TextField
                        fullWidth
                        size="small"
                        defaultValue="Please text OK to acknowledge. Thank you."
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" sx={{ color: '#f87171', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Remove</Typography>
                      </Box>
                    </Box>
                  </>
                )}
                {(!isApptReminder || isCancelAppt || isDeclineAppt) && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                    <Typography variant="caption" sx={{ color: '#f87171', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Remove</Typography>
                  </Box>
                )}
              </>
            )}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                sx={{ textTransform: 'none', fontSize: '0.7rem', color: '#64748b', borderColor: '#e2e8f0', borderStyle: 'dashed', px: 8 }}
              >
                Add Paragraph
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const VariablesSidebar = ({ templateInfo }) => (
  <Box sx={{ width: 250, borderLeft: '1px solid #eee', backgroundColor: '#fff', height: '100%', overflowY: 'auto' }}>
    <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a3a6b' }}>Variables</Typography>
      <IconButton size="small"><Settings sx={{ fontSize: 18 }} /></IconButton>
    </Box>

    {templateInfo?.name === 'One-Time Payment' && (
      <VariableAccordion title="One-Time Payment" defaultExpanded>
        <VariableButton label="Amount" />
        <VariableButton label="Link" />
      </VariableAccordion>
    )}

    {templateInfo?.name === 'Membership Renewal' && (
      <VariableAccordion title="Membership Renewal" defaultExpanded>
        <VariableButton label="Plan Name" />
        <VariableButton label="Amount" />
        <VariableButton label="Payment Info" />
      </VariableAccordion>
    )}

    {templateInfo?.name === 'Decline New Online Appt' && (
      <VariableAccordion title="Decline New Online Appt" defaultExpanded>
        <VariableButton label="Appointment Date" />
        <VariableButton label="Appointment Time" />
        <VariableButton label="Provider First Name" />
        <VariableButton label="Provider Last Name" />
      </VariableAccordion>
    )}

    {templateInfo?.name === 'Cancel Appointment' && (
      <VariableAccordion title="Cancel Appt" defaultExpanded>
        <VariableButton label="Appointment Date" />
        <VariableButton label="Appointment Time" />
        <VariableButton label="Provider First Name" />
        <VariableButton label="Provider Last Name" />
      </VariableAccordion>
    )}

    {templateInfo?.name === 'Appointment Reminder' && (
      <VariableAccordion title="Appointment Reminder" defaultExpanded>
        <VariableButton label="Confirm Link" />
        <VariableButton label="Appt Date-Time long" />
        <VariableButton label="Appt Date-Time small" />
        <VariableButton label="Appt Operatory" />
      </VariableAccordion>
    )}

    {templateInfo?.name === 'Accept New Online Appt' && (
      <VariableAccordion title="Accept New Online Appt" defaultExpanded>
        <VariableButton label="Appointment Date" />
        <VariableButton label="Appointment Time" />
        <VariableButton label="Provider First Name" />
        <VariableButton label="Provider Last Name" />
      </VariableAccordion>
    )}

    {templateInfo?.name?.includes('AR Automation') && (
      <VariableAccordion title="AR Automation" defaultExpanded>
        <VariableButton label="Quick Payment" />
        <VariableButton label="Invoice/Patient Name" />
      </VariableAccordion>
    )}

    <VariableAccordion title="Patient">
      <VariableButton label="General Information" />
      <VariableButton label="Insurance" />
      <VariableButton label="Financial Account" />
      <VariableButton label="Appointments" />
      <VariableButton label="Parent Information" />
    </VariableAccordion>

    <VariableAccordion title="Provider">
      <VariableButton label="Preferred Dentist" />
      <VariableButton label="Preferred Hygienist" />
      <VariableButton label="Appt Provider" />
    </VariableAccordion>

    <VariableAccordion title="Practice" defaultExpanded>
      <VariableButton label="Name" />
      <VariableButton label="Phone number" />
      <VariableButton label="Address" />
      <VariableButton label="Website" />
      <VariableButton label="Email address" />
      <VariableButton label="Services available" />
    </VariableAccordion>
  </Box>
);

const ReferralTemplates = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const templates = [
    { name: 'Doctor Referral Letter' },
    { name: 'Updates regarding recent wellness visit' },
  ];

  const activeTemplate = isCreating ? { name: '' } : templates[selectedTemplate];
  const isWellnessUpdate = !isCreating && activeTemplate?.name?.includes('wellness visit');

  const referralBody = `Name: {Patient: First Name} {Patient: Last Name}
DOB: {Patient: DOB}
Phone: {Patient: Mobile Phone Number}
{Patient: Email Address}
{Patient: Primary Plan} {Patient: Primary Subscriber Id}

Please contact the patient to Schedule.`;

  const wellnessBlocks = [
    {
      id: 1,
      content: `Patient: {Patient: First Name} {Patient: Last Name}
DOB: {Patient: DOB}
Phone: {Patient: Mobile Phone Number}
Email: {Patient: Email Address}`
    },
    {
      id: 2,
      content: `Dear Dr. {Provider Referred To: First Name} {Provider Referred To: Last Name}
We are pleased to provide an update about a mutual patient who was seen in our office today. Please review the accompanying documents included in this referral.
1. Radiographs
2. Intraoral photographs (if taken)

Calculus:
Plaque:
Stain:`
    }
  ];

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTemplate(-1);
  };

  const handleSelectTemplate = (index) => {
    setIsCreating(false);
    setSelectedTemplate(index);
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
      {/* Left List */}
      <Box sx={{ width: 350, flexShrink: 0, borderRight: '1px solid #eee' }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                component="input" 
                type="checkbox" 
                checked={showDeleted} 
                onChange={(e) => setShowDeleted(e.target.checked)}
                sx={{ width: 14, height: 14, cursor: 'pointer' }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>Show deleted</Typography>
            </Box>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleCreateNew}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#1e3a8a', 
                borderRadius: '16px',
                px: 2,
                fontSize: '0.7rem',
                '&:hover': { backgroundColor: '#1e40af' }
              }}
            >
              + Create New Form
            </Button>
          </Box>

          <Box sx={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
            <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a3a6b', display: 'flex', alignItems: 'center', gap: 1 }}>
                Template Title <SortIcon sx={{ fontSize: 16 }} />
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {templates.map((template, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    button
                    onClick={() => handleSelectTemplate(index)}
                    sx={{ 
                      py: 1, 
                      px: 2, 
                      '&:hover': { backgroundColor: '#f1f5f9' },
                      backgroundColor: selectedTemplate === index ? '#f1f5f9' : 'transparent',
                      borderLeft: selectedTemplate === index ? '4px solid #4b71a1' : '4px solid transparent',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.8rem', color: '#334155', flexGrow: 1 }}>{template.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" sx={{ color: '#4b71a1' }}><SyncIcon sx={{ fontSize: 16 }} /></IconButton>
                      <IconButton size="small" sx={{ color: '#94a3b8' }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                    </Box>
                  </ListItem>
                  {index < templates.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </Box>

      {/* Center Editor */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #eee', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {isCreating ? (
            <TextField 
              placeholder="Enter template title"
              variant="standard"
              sx={{ 
                width: '60%', 
                '& .MuiInput-input': { fontSize: '0.9rem', fontWeight: 600, color: '#334155' } 
              }}
              InputProps={{ disableUnderline: false }}
              autoFocus
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                {activeTemplate?.name}
              </Typography>
              <IconButton size="small"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
            </Box>
          )}
          <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}>Save</Button>
        </Box>

        <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Subject</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder={isCreating ? "" : undefined}
              defaultValue={isCreating ? "" : (isWellnessUpdate ? "We saw our mutual patient today:" : "Patient consult requested")}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 1</Typography>
                <TextField fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 2</Typography>
                <TextField fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Body</Typography>
            {isCreating ? (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                  sx={{ textTransform: 'none', fontSize: '0.7rem', color: '#64748b', borderColor: '#e2e8f0', borderStyle: 'dashed', px: 8 }}
                >
                  Add Paragraph
                </Button>
              </Box>
            ) : (
              (isWellnessUpdate ? wellnessBlocks : [{ id: 1, content: referralBody }]).map((block, idx) => (
                <Box key={block.id} sx={{ mb: idx === 0 && isWellnessUpdate ? 4 : 0 }}>
                  <Box sx={{ border: '1px solid #e2e8f0', borderBottom: 'none', p: 0.5, backgroundColor: '#f8fafc', display: 'flex', gap: 1 }}>
                    <IconButton size="small"><FormatBold sx={{ fontSize: 18 }} /></IconButton>
                    <IconButton size="small"><FormatItalic sx={{ fontSize: 18 }} /></IconButton>
                    <IconButton size="small"><FormatUnderlined sx={{ fontSize: 18 }} /></IconButton>
                  </Box>
                  <Box sx={{ border: '1px solid #e2e8f0', p: 2, minHeight: isWellnessUpdate ? 120 : 200, fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {block.content}
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#f87171', cursor: 'pointer' }}>Remove</Typography>
                  </Box>
                </Box>
              ))
            )}

            {!isCreating && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                  sx={{ textTransform: 'none', fontSize: '0.7rem', color: '#64748b', borderColor: '#e2e8f0', borderStyle: 'dashed', px: 8 }}
                >
                  Add Paragraph
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              sx={{ textTransform: 'none', fontSize: '0.7rem', color: '#64748b', borderColor: '#e2e8f0', borderStyle: 'dashed', px: 8 }}
            >
              Add Paragraph
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box sx={{ width: 250, borderLeft: '1px solid #eee', backgroundColor: '#fff', height: '100%', overflowY: 'auto' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a3a6b' }}>Variables</Typography>
          <IconButton size="small"><Settings sx={{ fontSize: 18 }} /></IconButton>
        </Box>

        <VariableAccordion title="Patient" defaultExpanded>
          <VariableButton label="General Information" />
          <VariableButton label="Insurance" />
          <VariableButton label="Financial Account" />
          <VariableButton label="Appointments" />
          <VariableButton label="Parent Information" />
        </VariableAccordion>

        <VariableAccordion title="Provider" defaultExpanded>
          <VariableButton label="Preferred Dentist" />
          <VariableButton label="Preferred Hygienist" />
          <VariableButton label="Provider Referred To" />
        </VariableAccordion>

        <VariableAccordion title="Practice">
          <VariableButton label="Name" />
          <VariableButton label="Phone number" />
          <VariableButton label="Address" />
          <VariableButton label="Website" />
          <VariableButton label="Email address" />
          <VariableButton label="Services available" />
        </VariableAccordion>
      </Box>
    </Box>
  );
};

const GeneralEmailTextTemplates = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('sms'); // 'email' or 'sms'

  const templates = [
    { name: 'New Patient Text Welcome', type: 'sms' },
    { name: 'Imaging patient reminder', type: 'email' },
    { name: 'Existing patient reminder', type: 'both' },
    { name: 'Post dental patient scheduled reminder', type: 'sms' },
    { name: 'Paperwork Reminder', type: 'email' },
    { name: 'Save the Date', type: 'email' },
    { name: 'Visit ID Reminder', type: 'sms' },
    { name: '48 hour Notice Text', type: 'sms' },
    { name: 'Thank you for confirming Text', type: 'sms' },
    { name: 'Referral Request', type: 'email' },
    { name: 'DOH Confirmation', type: 'email' },
    { name: 'Invitation: Treatment follow-up', type: 'email' },
    { name: 'Patient reminder confirmation', type: 'sms' },
    { name: 'Unscheduled Treatment', type: 'sms' },
  ];

  const activeTemplate = isCreating ? { name: '' } : templates[selectedTemplate];

  const welcomeSmsContent = `Hello {Patient: Preferred Name}!
We are excited to meet you!
To ensure a smooth and efficient visit, please register your MyChart account and complete the medical and dental histories. To help you maximize your reserved time with us, this is needed 48 hours prior to your appointment.
Please text C to confirm.`;

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTemplate(-1);
  };

  const handleSelectTemplate = (index) => {
    setIsCreating(false);
    setSelectedTemplate(index);
  };

  if (isCreating && selectedMethod === null) {
    return (
      <Box sx={{ p: 4, height: '100%', backgroundColor: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, pb: 2, borderBottom: '1px solid #eee' }}>
          <TextField 
            placeholder="Enter template title"
            variant="standard"
            sx={{ 
              width: '40%', 
              '& .MuiInput-input': { fontSize: '0.9rem', fontWeight: 600, color: '#334155' } 
            }}
            InputProps={{ disableUnderline: false }}
            autoFocus
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => setIsCreating(false)}
              sx={{ textTransform: 'none', color: '#64748b', borderColor: '#e2e8f0' }}
            >
              Cancel
            </Button>
            <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}>Save</Button>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a3a6b', mb: 4 }}>Select communication method</Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Box 
              onClick={() => setSelectedMethod('email')}
              sx={{ 
                width: 200, 
                p: 4, 
                border: '2px solid', 
                borderColor: selectedMethod === 'email' ? '#4b71a1' : '#f1f5f9',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedMethod === 'email' ? '#f8fafc' : '#fff',
                '&:hover': { borderColor: '#4b71a1', backgroundColor: '#f8fafc' }
              }}
            >
              <EmailIcon sx={{ fontSize: 60, color: selectedMethod === 'email' ? '#4b71a1' : '#94a3b8', mb: 2 }} />
              <Typography sx={{ fontWeight: 600, color: '#334155' }}>Email</Typography>
            </Box>

            <Box 
              onClick={() => setSelectedMethod('sms')}
              sx={{ 
                width: 200, 
                p: 4, 
                border: '2px solid', 
                borderColor: selectedMethod === 'sms' ? '#4b71a1' : '#f1f5f9',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedMethod === 'sms' ? '#f8fafc' : '#fff',
                '&:hover': { borderColor: '#4b71a1', backgroundColor: '#f8fafc' }
              }}
            >
              <SmsIcon sx={{ fontSize: 60, color: selectedMethod === 'sms' ? '#4b71a1' : '#94a3b8', mb: 2 }} />
              <Typography sx={{ fontWeight: 600, color: '#334155' }}>SMS</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
      {/* Left List */}
      <Box sx={{ width: 350, flexShrink: 0, borderRight: '1px solid #eee' }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                component="input" 
                type="checkbox" 
                checked={showDeleted} 
                onChange={(e) => setShowDeleted(e.target.checked)}
                sx={{ width: 14, height: 14, cursor: 'pointer' }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>Show deleted</Typography>
            </Box>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleCreateNew}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#1e3a8a', 
                borderRadius: '16px',
                px: 2,
                fontSize: '0.7rem',
                '&:hover': { backgroundColor: '#1e40af' }
              }}
            >
              + Create New Form
            </Button>
          </Box>

          <Box sx={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
            <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a3a6b', display: 'flex', alignItems: 'center', gap: 1 }}>
                Template Title <SortIcon sx={{ fontSize: 16 }} />
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {templates.map((template, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    button
                    onClick={() => handleSelectTemplate(index)}
                    sx={{ 
                      py: 1, 
                      px: 2, 
                      '&:hover': { backgroundColor: '#f1f5f9' },
                      backgroundColor: selectedTemplate === index ? '#f1f5f9' : 'transparent',
                      borderLeft: selectedTemplate === index ? '4px solid #4b71a1' : '4px solid transparent',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>{template.name}</Typography>
                      {template.type === 'email' || template.type === 'both' ? <EmailIcon sx={{ fontSize: 14, color: '#64748b' }} /> : null}
                      {template.type === 'sms' || template.type === 'both' ? <SmsIcon sx={{ fontSize: 14, color: '#64748b' }} /> : null}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" sx={{ color: '#4b71a1' }}><SyncIcon sx={{ fontSize: 16 }} /></IconButton>
                      <IconButton size="small" sx={{ color: '#94a3b8' }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                    </Box>
                  </ListItem>
                  {index < templates.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </Box>

      {/* Center Editor */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #eee', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {isCreating ? (
            <TextField 
              placeholder="Enter template title"
              variant="standard"
              sx={{ 
                width: '60%', 
                '& .MuiInput-input': { fontSize: '0.9rem', fontWeight: 600, color: '#334155' } 
              }}
              InputProps={{ disableUnderline: false }}
              autoFocus
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                {activeTemplate?.name}
              </Typography>
              <IconButton size="small"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
            </Box>
          )}
          <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}>Save</Button>
        </Box>

        <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
          {/* Method Selector */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setSelectedMethod('sms')}>
              <Box sx={{ 
                width: 16, height: 16, borderRadius: '50%', border: '1px solid #4b71a1', 
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {selectedMethod === 'sms' && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4b71a1' }} />}
              </Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Text Message</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setSelectedMethod('email')}>
              <Box sx={{ 
                width: 16, height: 16, borderRadius: '50%', border: '1px solid #d1d5db', 
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {selectedMethod === 'email' && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4b71a1' }} />}
              </Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Email</Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Body</Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              defaultValue={welcomeSmsContent}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  fontSize: '0.85rem', 
                  lineHeight: 1.6,
                  backgroundColor: '#fff'
                } 
              }}
            />
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>437 characters left</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>Please note that the characters count is inaccurate if template variables are used.</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>The system will automatically add the practice name and contact info to the end of your text message.</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box sx={{ width: 250, borderLeft: '1px solid #eee', backgroundColor: '#fff', height: '100%', overflowY: 'auto' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a3a6b' }}>Variables</Typography>
          <IconButton size="small"><Settings sx={{ fontSize: 18 }} /></IconButton>
        </Box>

        <VariableAccordion title="Patient" defaultExpanded>
          <VariableButton label="General Information" />
          <VariableButton label="Insurance" />
          <VariableButton label="Financial Account" />
          <VariableButton label="Appointments" />
          <VariableButton label="Parent Information" />
        </VariableAccordion>

        <VariableAccordion title="Provider" defaultExpanded>
          <VariableButton label="Preferred Dentist" />
          <VariableButton label="Preferred Hygienist" />
        </VariableAccordion>

        <VariableAccordion title="Practice">
          <VariableButton label="Name" />
          <VariableButton label="Phone number" />
          <VariableButton label="Address" />
          <VariableButton label="Website" />
          <VariableButton label="Email address" />
          <VariableButton label="Services available" />
          <VariableButton label="Payment methods" />
          <VariableButton label="Working hours" />
        </VariableAccordion>
        
        <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <VariableButton label="Outstanding Balance" />
        </Box>
      </Box>
    </Box>
  );
};

const CustomLetterTemplates = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  
  const templates = [
    { name: 'COVID-19' },
    { name: 'KOR Whitening Informed Consent' },
    { name: 'TDS Financial Agreement' },
    { name: 'Kor Whitening-Post-sensitivity' },
    { name: 'Composite (tooth colored restoration) Informed Consent' },
    { name: 'N2O (Nitrous Oxide) Sedation Informed Consent' },
    { name: 'Elective to Self Pay' },
    { name: 'Acknowledgement of Non-Services Agreement' },
    { name: 'Gingival Rejuvenating Alternative Informed Consent' },
    { name: 'TDS School Absence Form (returning to Work/school same day)' },
    { name: 'Patient Referral' },
    { name: 'TDS School Absence Form (not returning)' },
    { name: 'Crown and Bridge Informed Consent' },
    { name: 'Placement Permanent Crown Informed Consent' },
    { name: 'Tooth Extraction Informed Consent' },
    { name: 'Cosmetic Dentistry Informed Consent' },
  ];

  const activeTemplate = isCreating ? { name: '' } : templates[selectedTemplate];

  const covidBlocks = [
    {
      id: 1,
      content: `I understand the novel coronavirus causes the disease known as COVID-19. I understand the novel coronavirus virus has a long incubation period during which carriers of the virus may not show symptoms and still be contagious. I understand that dental procedures create water spray which is one way that the novel coronavirus is transmitted. The ultra-fine nature of the spray can linger in the air for minutes to sometimes hours, which can transmit the novel coronavirus.`
    },
    {
      id: 2,
      content: `I have been made aware that under the current pandemic all non-urgent dental care is not allowed. Dental visits should be limited to the treatment of ongoing pain or bleeding, all acute severe pain or infection or conditions that significantly inhibit normal operation of teeth and mouth, and issues that may cause anything listed above within the next 3 to 6 months.`
    },
    {
      id: 3,
      content: `I confirm that I am not presenting any of the following symptoms of COVID-19:
• Fever > 100.4 F/ 38 C - Persistence
• Dry Cough
• Sore Throat
• Shortness of Breath or Difficulty Breathing
• Flu-like symptoms
• Unexplained Loss of Smell or Taste
• Diarrhea`
    },
    {
      id: 4,
      content: `I confirm that I am not currently positive for the novel coronavirus. I confirm that I am not waiting for the results of a laboratory test for the novel coronavirus.`
    }
  ];

  const isCovidTemplate = !isCreating && activeTemplate?.name === 'COVID-19';

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTemplate(-1);
  };

  const handleSelectTemplate = (index) => {
    setIsCreating(false);
    setSelectedTemplate(index);
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
      {/* Left List */}
      <Box sx={{ width: 350, flexShrink: 0, borderRight: '1px solid #eee', overflowY: 'auto' }}>
        <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            component="input" 
            type="checkbox" 
            checked={showDeleted} 
            onChange={(e) => setShowDeleted(e.target.checked)}
            sx={{ width: 14, height: 14, cursor: 'pointer' }}
          />
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>Show deleted</Typography>
        </Box>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleCreateNew}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#1e3a8a', 
                borderRadius: '16px',
                px: 2,
                fontSize: '0.7rem',
                '&:hover': { backgroundColor: '#1e40af' }
              }}
            >
              + Create New Form
            </Button>
          </Box>

          <Box sx={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
            <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a3a6b', display: 'flex', alignItems: 'center', gap: 1 }}>
                Template Title <SortIcon sx={{ fontSize: 16 }} />
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {templates.map((template, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    button
                    onClick={() => handleSelectTemplate(index)}
                    sx={{ 
                      py: 1, 
                      px: 2, 
                      '&:hover': { backgroundColor: '#f1f5f9' },
                      backgroundColor: selectedTemplate === index ? '#f1f5f9' : 'transparent',
                      borderLeft: selectedTemplate === index ? '4px solid #4b71a1' : '4px solid transparent',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.8rem', color: '#334155', flexGrow: 1 }}>{template.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: '#4b71a1' }}><SyncIcon sx={{ fontSize: 16 }} /></IconButton>
                      <IconButton size="small" sx={{ color: '#94a3b8' }}><AdsClickIcon sx={{ fontSize: 16 }} /></IconButton>
                      <IconButton size="small" sx={{ color: '#94a3b8' }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                    </Box>
                  </ListItem>
                  {index < templates.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </Box>

      {/* Center Editor */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #eee', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {isCreating ? (
            <TextField 
              placeholder="Enter template title *"
              variant="standard"
              sx={{ 
                width: '60%', 
                '& .MuiInput-input': { fontSize: '0.9rem', fontWeight: 600, color: '#334155' } 
              }}
              InputProps={{ disableUnderline: false }}
              autoFocus
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                {activeTemplate?.name}
              </Typography>
              <IconButton size="small"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button size="small" variant="outlined" sx={{ textTransform: 'none', color: '#4b71a1', borderColor: '#4b71a1' }}>Preview</Button>
            <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}>Save</Button>
          </Box>
        </Box>

        <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 1</Typography>
            <TextField 
              fullWidth 
              size="small" 
              defaultValue={isCovidTemplate ? "COVID-19 Pandemic Emergency Dental Treatment Consent Form" : ""}
              sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }} 
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 2</Typography>
            <TextField fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }} />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Body</Typography>
            
            {isCovidTemplate ? (
              covidBlocks.map((block) => (
                <Box key={block.id} sx={{ mb: 3, display: 'flex', gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ border: '1px solid #e2e8f0', borderBottom: 'none', p: 0.5, backgroundColor: '#f8fafc', display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <IconButton size="small"><FormatBold sx={{ fontSize: 18 }} /></IconButton>
                      <IconButton size="small"><FormatItalic sx={{ fontSize: 18 }} /></IconButton>
                      <IconButton size="small"><FormatUnderlined sx={{ fontSize: 18 }} /></IconButton>
                      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                      <Typography sx={{ fontSize: '0.75rem', alignSelf: 'center', px: 1, border: '1px solid #ddd', borderRadius: '4px' }}>Paragraph</Typography>
                      <Typography sx={{ fontSize: '0.75rem', alignSelf: 'center', px: 1, border: '1px solid #ddd', borderRadius: '4px', ml: 0.5 }}>10pt</Typography>
                      <Typography sx={{ fontSize: '0.75rem', alignSelf: 'center', px: 1, border: '1px solid #ddd', borderRadius: '4px', ml: 0.5 }}>Lato</Typography>
                    </Box>
                    <Box sx={{ border: '1px solid #e2e8f0', p: 2, minHeight: 100, fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {block.content}
                    </Box>
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#f87171', cursor: 'pointer' }}>Remove</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ width: 120, pt: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box component="input" type="checkbox" sx={{ width: 14, height: 14 }} />
                      <Typography sx={{ fontSize: '0.75rem' }}>Initials</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box component="input" type="checkbox" sx={{ width: 14, height: 14 }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>Initials Required</Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ 
                border: '1px dashed #e2e8f0', 
                borderRadius: '8px', 
                p: 4, 
                display: 'flex', 
                justifyContent: 'center',
                backgroundColor: '#f8fafc'
              }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                  sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#64748b', borderColor: '#e2e8f0', backgroundColor: '#fff' }}
                >
                  Add Paragraph
                </Button>
              </Box>
            )}

            {isCovidTemplate && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                  sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#64748b', borderColor: '#e2e8f0', borderStyle: 'dashed', px: 8 }}
                >
                  Add Paragraph
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 8 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 2 }}>Signature</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {['Guardian', 'Patient', 'Doctor', 'Witness', 'Office', 'Other'].map(sig => (
                  <Box key={sig} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="input" type="checkbox" sx={{ width: 14, height: 14 }} />
                    <Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>{sig}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 2 }}>Include In</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['Update Request', 'New Patient Request'].map(inc => (
                  <Box key={inc} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="input" type="checkbox" sx={{ width: 14, height: 14 }} />
                    <Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>{inc}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box sx={{ width: 250, borderLeft: '1px solid #eee', backgroundColor: '#fff', height: '100%', overflowY: 'auto' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a3a6b' }}>Variables</Typography>
          <IconButton size="small"><Settings sx={{ fontSize: 18 }} /></IconButton>
        </Box>

        <VariableAccordion title="Patient" defaultExpanded>
          <VariableButton label="General Information" />
          <VariableButton label="Insurance" />
          <VariableButton label="Financial Account" />
          <VariableButton label="Appointments" />
          <VariableButton label="Parent Information" />
        </VariableAccordion>

        <VariableAccordion title="Provider" defaultExpanded>
          <VariableButton label="Preferred Dentist" />
          <VariableButton label="Preferred Hygienist" />
        </VariableAccordion>

        <VariableAccordion title="Practice">
          <VariableButton label="Name" />
          <VariableButton label="Phone number" />
          <VariableButton label="Address" />
          <VariableButton label="Website" />
          <VariableButton label="Email address" />
          <VariableButton label="Services available" />
          <VariableButton label="Payment methods" />
          <VariableButton label="Working hours" />
        </VariableAccordion>
      </Box>
    </Box>
  );
};

const LabTemplates = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(-1);
  const templates = [];

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTemplate(-1);
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
      {/* Left List */}
      <Box sx={{ width: 350, flexShrink: 0, borderRight: '1px solid #eee', overflowY: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                component="input" 
                type="checkbox" 
                checked={showDeleted} 
                onChange={(e) => setShowDeleted(e.target.checked)}
                sx={{ width: 14, height: 14, cursor: 'pointer' }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>Show deleted</Typography>
            </Box>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleCreateNew}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#1e3a8a', 
                borderRadius: '16px',
                px: 2,
                fontSize: '0.7rem',
                '&:hover': { backgroundColor: '#1e40af' }
              }}
            >
              + Create New Form
            </Button>
          </Box>

          <Box sx={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
            <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a3a6b', display: 'flex', alignItems: 'center', gap: 1 }}>
                Template Title <SortIcon sx={{ fontSize: 16 }} />
              </Typography>
            </Box>
            {templates.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>No templates found</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {templates.map((template, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      button
                      onClick={() => {
                        setSelectedTemplate(index);
                        setIsCreating(false);
                      }}
                      sx={{ 
                        py: 1, 
                        px: 2, 
                        '&:hover': { backgroundColor: '#f1f5f9' },
                        backgroundColor: selectedTemplate === index ? '#f1f5f9' : 'transparent',
                        borderLeft: selectedTemplate === index ? '4px solid #4b71a1' : '4px solid transparent',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>{template.name}</Typography>
                    </ListItem>
                    {index < templates.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Box>

      {/* Center Editor */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        {isCreating || selectedTemplate !== -1 ? (
          <>
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid #eee', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              {isCreating ? (
                <TextField 
                  placeholder="Enter template title *"
                  variant="standard"
                  sx={{ 
                    width: '60%', 
                    '& .MuiInput-input': { fontSize: '0.9rem', fontWeight: 600, color: '#334155' } 
                  }}
                  InputProps={{ disableUnderline: false }}
                  autoFocus
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                    {templates[selectedTemplate]?.name}
                  </Typography>
                  <IconButton size="small"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                </Box>
              )}
              <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}>Save</Button>
            </Box>

            <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 1</Typography>
                <TextField fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 2</Typography>
                <TextField fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }} />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Body</Typography>
                <Box sx={{ 
                  border: '1px dashed #e2e8f0', 
                  borderRadius: '8px', 
                  p: 4, 
                  display: 'flex', 
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc'
                }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                    sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#64748b', borderColor: '#e2e8f0', backgroundColor: '#fff' }}
                  >
                    Add Paragraph
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
            <Typography color="text.secondary">Select a template or create a new one to begin</Typography>
          </Box>
        )}
      </Box>

      {/* Right Sidebar */}
      {(isCreating || selectedTemplate !== -1) && (
        <Box sx={{ width: 250, borderLeft: '1px solid #eee', backgroundColor: '#fff', height: '100%', overflowY: 'auto' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a3a6b' }}>Variables</Typography>
            <IconButton size="small"><Settings sx={{ fontSize: 18 }} /></IconButton>
          </Box>

          <VariableAccordion title="Patient" defaultExpanded>
            <VariableButton label="General Information" />
            <VariableButton label="Insurance" />
            <VariableButton label="Financial Account" />
            <VariableButton label="Appointments" />
            <VariableButton label="Parent Information" />
          </VariableAccordion>

          <VariableAccordion title="Provider" defaultExpanded>
            <VariableButton label="Preferred Dentist" />
            <VariableButton label="Preferred Hygienist" />
          </VariableAccordion>

          <VariableAccordion title="Practice">
            <VariableButton label="Name" />
            <VariableButton label="Phone number" />
            <VariableButton label="Address" />
            <VariableButton label="Website" />
            <VariableButton label="Email address" />
            <VariableButton label="Services available" />
            <VariableButton label="Payment methods" />
            <VariableButton label="Working hours" />
          </VariableAccordion>
        </Box>
      )}
    </Box>
  );
};

const PatientCommunicationTemplates = () => {
  const theme = useTheme();
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [templateInfo, setTemplateInfo] = useState({ name: 'AR Automation 15 Days', type: 'email' });

  return (
    <Box sx={{ px: 0, py: 0 }}>
      {/* Content Area */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0, backgroundColor: '#fff' }}>
        <Tabs 
          value={activeSubTab} 
          onChange={(e, newValue) => setActiveSubTab(newValue)}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              minWidth: 100,
              minHeight: 40,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              height: 2,
            }
          }}
        >
          {TEMPLATE_SUB_TABS.map((tab) => (
            <Tab key={tab.id} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ backgroundColor: '#fff', minHeight: 'calc(100vh - 200px)' }}>
        {activeSubTab === 0 ? (
          <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
            {/* Left List */}
            <Box sx={{ width: 350, flexShrink: 0 }}>
              <AutomatedTemplatesList 
                selectedTemplate={selectedTemplate} 
                onSelect={(idx, info) => {
                  setSelectedTemplate(idx);
                  setTemplateInfo(info);
                }} 
              />
            </Box>
            
            {/* Center Editor */}
            <TemplateEditor selectedTemplate={selectedTemplate} templateInfo={templateInfo} />

            {/* Right Sidebar */}
            <VariablesSidebar templateInfo={templateInfo} />
          </Box>
        ) : activeSubTab === 1 ? (
          <ReferralTemplates />
        ) : activeSubTab === 2 ? (
          <GeneralEmailTextTemplates />
        ) : activeSubTab === 3 ? (
          <CustomLetterTemplates />
        ) : activeSubTab === 4 ? (
          <LabTemplates />
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {TEMPLATE_SUB_TABS[activeSubTab].label} section is under development.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PatientCommunicationTemplates;
