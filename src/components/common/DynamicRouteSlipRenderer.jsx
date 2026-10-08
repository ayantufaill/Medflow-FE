import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSystemSettings, selectSettingsMap } from '../../store/slices/clinicalManagementSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../store/slices/providerSlice';
import { fetchAllRoomsForDropdown, selectRoomDropdownList } from '../../store/slices/roomSlice';
import dayjs from 'dayjs';

const parseMoney = (value) => {
  if (typeof value === 'number') return value;
  const parsed = Number(String(value || '').replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};
const money = (value) => `$${parseMoney(value).toFixed(2)}`;

const formatAddress = (patient) => {
  const address = patient?.address || patient?.addressInfo || {};
  if (typeof address === 'string') return address || '-';
  return [
    address.street || address.addressLine1 || address.line1,
    address.addressLine2 || address.line2,
    address.city,
    address.state,
    address.zip || address.postalCode
  ].filter(Boolean).join(', ') || '-';
};

const getProviderLabel = (provider, providersList = []) => {
  if (!provider || provider === '-') return '-';
  if (typeof provider === 'object') {
    const first = provider.userId?.firstName || provider.firstName || provider.FName || '';
    const last = provider.userId?.lastName || provider.lastName || provider.LName || '';
    return provider.name || `${first} ${last}`.trim() || provider.providerCode || '-';
  }
  const found = providersList.find(p => String(p._id || p.id) === String(provider) || String(p.providerCode) === String(provider));
  if (found) {
    const first = found.userId?.firstName || found.firstName || found.FName || '';
    const last = found.userId?.lastName || found.lastName || found.LName || '';
    return found.name || `${first} ${last}`.trim() || found.providerCode || '-';
  }
  return '-';
};

const getRoomLabel = (room, roomsList = []) => {
  if (!room || room === '-') return '-';
  if (typeof room === 'object') {
    return room.name || room.roomName || room.operatoryName || room.label || '-';
  }
  const found = roomsList.find(r => String(r._id || r.id) === String(room));
  if (found) {
    return found.name || found.roomName || found.operatoryName || found.label || '-';
  }
  return '-';
};

export const DynamicRouteSlipRenderer = ({ patient, appointment, nextAppointment, procedures = [], planTitle = 'Treatment Plan', insurances = [] }) => {
  const dispatch = useDispatch();
  const settingsMap = useSelector(selectSettingsMap);
  const templateHtml = settingsMap?.['route_slip_template_config'];
  const providersList = useSelector(selectProviderDropdownList) || [];
  const roomsList = useSelector(selectRoomDropdownList) || [];

  useEffect(() => {
    if (!templateHtml) {
      dispatch(fetchSystemSettings());
    }
    if (providersList.length === 0) {
      dispatch(fetchAllProvidersForDropdown());
    }
    if (roomsList.length === 0) {
      dispatch(fetchAllRoomsForDropdown());
    }
  }, [dispatch, templateHtml, providersList.length, roomsList.length]);

  if (!templateHtml) {
    return <Box sx={{ p: 3, textAlign: 'center', color: '#64748b' }}>Loading Route Slip Template...</Box>;
  }

  // Calculate Totals
  const totals = procedures.reduce((acc, procedure) => {
    acc.fee += parseMoney(procedure.negRate || procedure.fee || procedure.charge);
    acc.ins += parseMoney(procedure.insEst || procedure.insPortion || procedure.insuranceAmount);
    acc.pt += parseMoney(procedure.ptEst || procedure.ptPortion || procedure.patientAmount);
    return acc;
  }, { fee: 0, ins: 0, pt: 0 });

  // Generate Procedures Table HTML
  let tableHtml = `
    <table style="width: 100%; border-collapse: collapse; font-family: Inter, sans-serif;">
      <thead>
        <tr style="background-color: #f8fafc;">
          ${['Status', 'Date', 'Site', 'Code', 'Description', 'Provider', 'Fee', 'Ins Est', 'Pt Est'].map(h => `<th style="text-align: left; padding: 6px; font-size: 0.68rem; font-weight: 800; color: #52637a; border-bottom: 1px solid #d9e2ef;">${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
  `;
  if (procedures.length > 0) {
    procedures.forEach(p => {
      tableHtml += `
        <tr>
          <td style="padding: 6px; font-size: 0.72rem; border-bottom: 1px solid #edf2f7;">${p.status || '-'}</td>
          <td style="padding: 6px; font-size: 0.72rem; border-bottom: 1px solid #edf2f7;">${p.scheduled || p.created || '-'}</td>
          <td style="padding: 6px; font-size: 0.72rem; border-bottom: 1px solid #edf2f7;">${p.site || '-'}</td>
          <td style="padding: 6px; font-size: 0.72rem; border-bottom: 1px solid #edf2f7; font-weight: 700;">${p.code || '-'}</td>
          <td style="padding: 6px; font-size: 0.72rem; border-bottom: 1px solid #edf2f7;">${p.description || '-'}</td>
          <td style="padding: 6px; font-size: 0.72rem; border-bottom: 1px solid #edf2f7;">${getProviderLabel(p.provider, providersList)}</td>
          <td style="padding: 6px; font-size: 0.72rem; border-bottom: 1px solid #edf2f7;">${money(p.negRate)}</td>
          <td style="padding: 6px; font-size: 0.72rem; border-bottom: 1px solid #edf2f7;">${money(p.insEst)}</td>
          <td style="padding: 6px; font-size: 0.72rem; border-bottom: 1px solid #edf2f7;">${money(p.ptEst)}</td>
        </tr>
      `;
    });
  } else {
    tableHtml += `<tr><td colspan="9" style="padding: 24px; text-align: center; font-size: 0.8rem; color: #64748b;">No procedures in this treatment plan.</td></tr>`;
  }
  tableHtml += `</tbody></table>`;

  // Generate Insurances HTML
  let insHtml = '';
  if (insurances.length > 0) {
    insurances.slice(0, 3).forEach((ins, idx) => {
      insHtml += `
        <div style="margin-bottom: ${idx === insurances.length - 1 ? '0' : '6px'}">
          <div style="font-size: 0.78rem; font-weight: 700; color: #1f2937;">${ins.insuranceCompany?.name || ins.companyName || ins.name || 'Insurance'}</div>
          <div style="font-size: 0.72rem; color: #64748b;">ID: ${ins.subscriberId || ins.memberId || '-'} | Group: ${ins.groupNumber || ins.group || '-'}</div>
        </div>
      `;
    });
  } else {
    insHtml = '<div style="color: #94a3b8; font-style: italic; font-size: 0.8rem;">No active insurance</div>';
  }

  // Interpolate Data
  const patientFirst = patient?.firstName || patient?.FName || '';
  const patientLast = patient?.lastName || patient?.LName || '';
  const patientName = `${patientFirst} ${patientLast}`.trim() || patient?.name || '-';
  const appointmentDate = appointment?.appointmentDate || appointment?.date ? dayjs(appointment?.appointmentDate || appointment?.date) : dayjs();

  let finalHtml = templateHtml;
  finalHtml = finalHtml.replace(/>Appointment Date</g, `>${appointmentDate.format('dddd MMM DD, YYYY')}<`);
  finalHtml = finalHtml.replace(/>Patient Full Name</g, `>${patientName}<`);
  finalHtml = finalHtml.replace(/>Patient Name</g, `>${patientName}<`);
  finalHtml = finalHtml.replace(/>Patient Address</g, `>${formatAddress(patient)}<`);
  finalHtml = finalHtml.replace(/>Patient DOB</g, `>${patient?.dateOfBirth ? dayjs(patient.dateOfBirth).format('MM/DD/YYYY') : '-'}<`);
  finalHtml = finalHtml.replace(/>Patient Email</g, `>${patient?.email || patient?.emailAddress || '-'}<`);
  finalHtml = finalHtml.replace(/>Patient Phone</g, `>${patient?.phonePrimary || patient?.mobileNumber || patient?.phone || '-'}<`);

  const pd = patient?.preferredProvider || patient?.preferredDentist || patient?.preferredDentistId;
  const ph = patient?.preferredHygienist || patient?.preferredHygienistId;
  const referringSource = patient?.referringSource?.name || patient?.referringSource || patient?.referralSource?.name || patient?.referralSource || patient?.howDidYouHearAboutUs || '-';

  finalHtml = finalHtml.replace(/>Preferred Dentist</g, `>${getProviderLabel(pd, providersList)}<`);
  finalHtml = finalHtml.replace(/>Preferred Hygienist</g, `>${getProviderLabel(ph, providersList)}<`);
  finalHtml = finalHtml.replace(/>Referral Source</g, `>${referringSource}<`);

  finalHtml = finalHtml.replace(/>Total Fee</g, `>${money(totals.fee)}<`);
  finalHtml = finalHtml.replace(/>Total Ins Est</g, `>${money(totals.ins)}<`);
  finalHtml = finalHtml.replace(/>Total Pt Est</g, `>${money(totals.pt)}<`);

  finalHtml = finalHtml.replace(/>Appt Time</g, `>${appointment?.time || appointment?.startTime || appointmentDate.format('h:mm A')}<`);
  finalHtml = finalHtml.replace(/>Plan Title</g, `>${planTitle}<`);

  const apptProviderId = appointment?.provider || appointment?.providerId || appointment?.dentist || appointment?.dentistId;
  const apptRoomId = appointment?.room || appointment?.roomId || appointment?.operatory || appointment?.operatoryId || appointment?.chair || appointment?.chairId;
  finalHtml = finalHtml.replace(/>Appt Provider</g, `>${getProviderLabel(apptProviderId, providersList)}<`);
  finalHtml = finalHtml.replace(/>Appt Room</g, `>${getRoomLabel(apptRoomId, roomsList)}<`);

  finalHtml = finalHtml.replace(/>Procedure Count</g, `>${procedures.length}<`);
  finalHtml = finalHtml.replace(/>Appt Status</g, `>${appointment?.status || '-'}<`);

  finalHtml = finalHtml.replace(/>Active Insurances List</g, `>${insHtml}<`);
  finalHtml = finalHtml.replace(/>Treatment Procedures Table</g, `>${tableHtml}<`);

  let nextApptHtml = 'No future appointments scheduled.';
  if (nextAppointment) {
    const nextDate = nextAppointment.appointmentDate || nextAppointment.date;
    const nextTime = nextAppointment.startTime || nextAppointment.time || '';
    const providerLabel = getProviderLabel(nextAppointment.provider || nextAppointment.providerId, providersList);
    nextApptHtml = `${dayjs(nextDate).format('dddd MMM DD, YYYY')}${nextTime ? ` at ${nextTime}` : ''}${providerLabel !== '-' ? ` with ${providerLabel}` : ''}`;
  }
  finalHtml = finalHtml.replace(/>Next Appointment Info</g, `>${nextApptHtml}<`);

  // Inject CSS to strip blue chip styles
  const styleInjection = `
    <style>
      .dynamic-route-slip .MuiChip-root {
        background-color: transparent !important;
        color: #475569 !important;
        font-size: 0.78rem !important;
        font-weight: 400 !important;
        height: auto !important;
        margin: 0 !important;
        border: none !important;
      }
      .dynamic-route-slip .MuiChip-label {
        padding: 0 !important;
        white-space: normal !important;
      }
      .dynamic-route-slip {
        font-family: Inter, sans-serif;
      }
    </style>
  `;

  return (
    <Box
      className="dynamic-route-slip"
      sx={{
        width: '100%',
        bgcolor: '#fff',
        p: 0,
        '& *': { boxSizing: 'border-box' }
      }}
      dangerouslySetInnerHTML={{ __html: styleInjection + finalHtml }}
    />
  );
};

export default DynamicRouteSlipRenderer;
