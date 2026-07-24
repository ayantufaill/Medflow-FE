import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { DescriptionOutlined as DescriptionOutlinedIcon } from '@mui/icons-material';
import { AutomatedTemplatesList } from './AutomatedTemplatesList';
import { TemplateEditor } from './TemplateEditor';
import { VariablesSidebar } from './VariablesSidebar';
import { communicationService } from '../../../../services/communication.service';

const MOCK_TEMPLATES = [
  { name: 'AR Automation 15 Days', type: 'email', subject: 'Your Account Status', bodyText: 'This is a friendly reminder that your account balance is 15 days past due. Please review your balance and let us know if you need any assistance.' },
  { name: 'AR Automation 15 Days', type: 'text', bodyText: 'Reminder: Your balance is 15 days past due. Please contact our office to resolve this. Thank you!' },
  { name: 'AR Automation 30 Days', type: 'email', subject: 'Account 30 Days Past Due', bodyText: 'Your account is now 30 days past due. Please remit payment as soon as possible to keep your account in good standing.' },
  { name: 'AR Automation 30 Days', type: 'text', bodyText: 'Important: Your account is 30 days past due. Please call us to arrange payment or ask any questions.' },
  { name: 'AR Automation 45 Days', type: 'email', subject: 'Urgent: Account 45 Days Past Due', bodyText: 'This is an urgent notice regarding your account balance which is now 45 days past due. We strongly request you contact us immediately.' },
  { name: 'AR Automation 45 Days', type: 'text', bodyText: 'Urgent: Your account is 45 days past due. Please contact us immediately to avoid further action.' },
  { name: 'Accept New Online Appt', type: 'email', hasSync: true, subject: 'Your Appointment Request was Accepted', bodyText: 'Great news! Your online appointment request has been accepted. We look forward to seeing you.' },
  { name: 'Appointment Reminder', type: 'text', hasInfo: true, hasSync: true, bodyText: 'Reminder: You have an upcoming appointment. Reply C to confirm.' },
  { name: 'Appointment Reminder', type: 'email', hasInfo: true, hasSync: true, subject: 'Upcoming Appointment Reminder', bodyText: 'You have an upcoming appointment with our practice. Please click the link to confirm your visit.' },
  { name: 'Appointment Reminder Without Confirm', type: 'text', hasInfo: true, hasSync: true, bodyText: 'Reminder: You have an upcoming appointment. See you soon!' },
  { name: 'Appointment Reminder Without Confirm', type: 'email', hasInfo: true, hasSync: true, subject: 'Upcoming Appointment Reminder', bodyText: 'This is a reminder for your upcoming appointment. We look forward to seeing you.' },
  { name: 'Birthday', type: 'email', hasSync: true, subject: 'Happy Birthday!', bodyText: 'Wishing you a very happy birthday from all of us at the practice!' },
  { name: 'Cancel Appointment', type: 'text', hasSync: true, bodyText: 'Your appointment has been successfully cancelled.' },
  { name: 'Cancel Appointment', type: 'email', hasSync: true, subject: 'Appointment Cancellation', bodyText: 'We have received your request and cancelled your upcoming appointment.' },
  { name: 'Decline New Online Appt', type: 'email', hasSync: true, subject: 'Appointment Request Update', bodyText: 'Unfortunately, we are unable to accommodate the specific time you requested. Please contact the office to reschedule.' },
  { name: 'Membership Renewal', type: 'email', hasSync: true, subject: 'Membership Renewal Notice', bodyText: 'Your practice membership is due for renewal soon. Please review the details inside.' },
  { name: 'Missed Call Auto Reply', type: 'text', bodyText: 'Sorry we missed your call! We are currently busy but will get back to you shortly. Text us if you have an urgent question.' },
  { name: 'My Chart Register Invitation Sms', type: 'text', hasSync: true, bodyText: 'Welcome! Please register for your patient portal account using this secure link.' },
  { name: 'One Time Payment', type: 'email', hasSync: true, subject: 'Payment Receipt', bodyText: 'Thank you for your payment. Your receipt is attached.' },
  { name: 'One Time Payment', type: 'text', hasSync: true, bodyText: 'Thank you for your payment. We have successfully processed your transaction.' },
  { name: 'Patient Update Request Without MyChart', type: 'email', hasSync: true, subject: 'Please Update Your Information', bodyText: 'Please take a moment to update your forms and information before your next visit.' },
  { name: 'Patient Update Request Without MyChart', type: 'text', hasSync: true, bodyText: 'Please update your forms and information prior to your appointment.' },
  { name: 'Patient Update Request With MyChart', type: 'email', hasSync: true, subject: 'Information Update Required', bodyText: 'Log into MyChart to review and update your patient information.' },
  { name: 'Patient Update Request With MyChart', type: 'text', hasSync: true, bodyText: 'Please log into MyChart to update your patient profile.' },
  { name: 'Patient Welcome', type: 'email', hasSync: true, subject: 'Welcome to Our Practice', bodyText: 'Welcome! We are thrilled to have you as a new patient.' },
  { name: 'Patient Welcome', type: 'text', hasSync: true, bodyText: 'Welcome to the practice! We look forward to meeting you.' },
  { name: 'Recall Reminder After', type: 'email', hasSync: true, subject: 'Time to schedule your next visit', bodyText: 'It is time for your next recall visit. Please contact us to schedule.' },
  { name: 'Recall Reminder After', type: 'text', hasSync: true, bodyText: 'It is time to schedule your next visit. Please call our office.' },
  { name: 'Recall Reminder Before', type: 'email', hasSync: true, subject: 'Upcoming recall due', bodyText: 'Your regular checkup is due soon. Get ahead by scheduling now.' },
  { name: 'Recall Reminder Before', type: 'text', hasSync: true, bodyText: 'Your regular checkup is due soon. Text us to schedule an appointment.' },
  { name: 'Request Online Appointment', type: 'email', hasSync: true, subject: 'Request an Appointment Online', bodyText: 'Need to see us? Request an appointment anytime via our website.' },
  { name: 'Reschedule Appointment', type: 'email', hasSync: true, subject: 'Appointment Rescheduled', bodyText: 'Your appointment has been successfully rescheduled. The new details are enclosed.' },
  { name: 'Reschedule Appointment', type: 'text', hasSync: true, bodyText: 'Your appointment was rescheduled successfully. See you at the new time!' },
  { name: 'Review Reminder', type: 'email', hasSync: true, subject: 'How did we do?', bodyText: 'We hope you had a great visit! Please take a moment to leave us a review.' },
  { name: 'Review Reminder', type: 'text', hasSync: true, bodyText: 'Thanks for visiting! We would love your feedback. Please leave us a review.' },
  { name: 'Save The Date', type: 'text', hasSync: true, bodyText: 'Save the date! You have an upcoming appointment scheduled.' },
  { name: 'Save The Date', type: 'email', hasSync: true, subject: 'Save the Date', bodyText: 'Please save the date for your upcoming appointment.' },
  { name: 'Shared Custom Form', type: 'email', hasSync: true, subject: 'Important form required', bodyText: 'Please review and sign the attached custom form prior to your visit.' },
  { name: 'Shared Custom Form', type: 'text', hasSync: true, bodyText: 'Please review and complete the required form sent to you.' },
  { name: 'Shared Payment Plan', type: 'email', hasSync: true, subject: 'Your Payment Plan', bodyText: 'Your customized payment plan is ready for review.' },
  { name: 'Shared Payment Plan', type: 'text', hasSync: true, bodyText: 'Your customized payment plan is ready. Let us know if you have questions.' },
  { name: 'Shared Post Ops', type: 'email', subject: 'Post-Op Instructions', bodyText: 'Please review these important post-operative instructions carefully.' },
  { name: 'Shared Post Ops', type: 'text', bodyText: 'Please follow the post-operative instructions closely for a smooth recovery.' },
  { name: 'Shared Pre Ops', type: 'email', subject: 'Pre-Op Instructions', bodyText: 'Please review these pre-operative instructions before your procedure.' },
  { name: 'Shared Pre Ops', type: 'text', bodyText: 'Please follow the pre-operative instructions carefully before arriving.' },
  { name: 'Shared Receipt', type: 'email', hasSync: true, subject: 'Your Receipt', bodyText: 'Thank you! Your receipt for recent services is attached.' },
  { name: 'Shared Receipt', type: 'text', hasSync: true, bodyText: 'Your receipt has been generated. Thank you!' },
  { name: 'Shared Risk Assessment', type: 'email', hasSync: true, subject: 'Risk Assessment Results', bodyText: 'Your risk assessment profile is ready for your review.' },
  { name: 'Shared Risk Assessment', type: 'text', hasSync: true, bodyText: 'Your risk assessment profile is available. Please review it.' },
  { name: 'Shared Statement', type: 'email', hasSync: true, subject: 'Account Statement', bodyText: 'Your recent account statement is attached.' },
  { name: 'Shared Statement', type: 'text', hasSync: true, bodyText: 'Your recent account statement is available for review.' },
  { name: 'Shared Treatment Plan', type: 'email', hasSync: true, subject: 'Your Proposed Treatment Plan', bodyText: 'Please review your proposed treatment plan and let us know if you have any questions.' },
  { name: 'Shared Treatment Plan', type: 'text', hasSync: true, bodyText: 'Your proposed treatment plan is ready to be reviewed.' },
  { name: 'Shared Uploaded Doc', type: 'email', hasSync: true, subject: 'New Document Uploaded', bodyText: 'A new document has been uploaded to your file.' },
  { name: 'Shared Uploaded Doc', type: 'text', hasSync: true, bodyText: 'A new document is available in your patient file.' },
  { name: 'Schedule Gap Fills', type: 'email', subject: 'Available Appointment Openings', bodyText: 'We have a sudden opening in our schedule! Contact us if you want to come in sooner.' },
  { name: 'Schedule Gap Fills', type: 'text', bodyText: 'We have an unexpected opening! Text us back to claim this earlier appointment time.' },
  { name: 'Unsigned Consent Form Reminder', type: 'email', subject: 'Action Required: Unsigned Consent Form', bodyText: 'This is a reminder that we are missing a signature on your consent form. Please complete it ASAP.' },
];

export const AutomatedTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [templateInfo, setTemplateInfo] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setTemplates(MOCK_TEMPLATES);
      if (MOCK_TEMPLATES.length > 0 && !templateInfo) {
        setTemplateInfo({ ...MOCK_TEMPLATES[0] });
      }
    } catch (err) {
      console.error('Failed to fetch templates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      if (templateInfo._id) {
        await communicationService.updateTemplate(templateInfo._id, updatedData);
      } else {
        await communicationService.createTemplate({ ...updatedData, templateType: 1 });
      }
      fetchTemplates();
    } catch (err) {
      console.error('Failed to save template', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await communicationService.deleteTemplate(id);
      setSelectedTemplate(0);
      setTemplateInfo(null);
      fetchTemplates();
    } catch (err) {
      console.error('Failed to delete template', err);
    }
  };

  const handleCreateNew = () => {
    setTemplateInfo({ description: 'New Template', subject: '', bodyText: '', type: 'email', isNew: true });
    setSelectedTemplate(-1);
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{
        border: '1px solid #E5E9F2',
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        {/* Main Header */}
        <Box sx={{
          bgcolor: '#F2F6FC',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid #E5E9F2'
        }}>
          <DescriptionOutlinedIcon sx={{ fontSize: '1.2rem', color: '#4472C4' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293b' }}>
            Automated Templates
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Left List */}
          <Box sx={{ width: 350, flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
            <AutomatedTemplatesList
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelect={(idx, info) => {
                setSelectedTemplate(idx);
                setTemplateInfo({ ...info, type: !info.subject ? 'text' : 'email', name: info.description || info.name });
              }}
              onCreateNew={handleCreateNew}
            />
          </Box>

          {/* Center Editor */}
          <TemplateEditor
            selectedTemplate={selectedTemplate}
            templateInfo={templateInfo}
            onSave={handleSave}
            onDelete={handleDelete}
          />

          {/* Right Sidebar */}
          <VariablesSidebar templateInfo={templateInfo} />
        </Box>
      </Box>
    </Box>
  );
};
