import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, IconButton, Divider, List, ListItem, Collapse
} from '@mui/material';
import { 
  Email as EmailIcon, Sms as SmsIcon, InfoOutlined as InfoIcon, Sync as SyncIcon, 
  SwapVert as SortIcon, ChevronRight, FormatBold, FormatItalic, FormatUnderlined, 
  Settings, Add as AddIcon, AdsClick as AdsClickIcon, Edit as EditIcon, Delete as DeleteIcon, 
  Cake as CakeIcon, CalendarMonth, CreditCard 
} from '@mui/icons-material';

import { VariableAccordion } from './VariableAccordion';
import { VariableButton } from './VariableButton';

export const VariablesSidebar = ({ templateInfo }) => {
  return (
    <Box sx={{ width: 250, flexShrink: 0, borderLeft: '1px solid #E5E9F2', backgroundColor: '#FBFCFE', height: '100%', overflowY: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #E5E9F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>Variables</Typography>
        <IconButton size="small"><Settings sx={{ fontSize: 18, color: '#64748b' }} /></IconButton>
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
};
