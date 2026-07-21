import { Box, Typography, Switch, FormControlLabel, Checkbox, Collapse, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ScheduleConfigCard from './ScheduleConfigCard';
import TooltipPatientInfoIcon from '../../../../assets/scheduleconfigurationicon/tooltippatientinfo.svg';

const TooltipPatientInfoRouteSlip = ({ 
  enableRouteSlip, 
  setEnableRouteSlip, 
  routeSlipSettings, 
  setRouteSlipSettings,
  expandedSections,
  toggleSection
}) => {
  return (
    <ScheduleConfigCard 
      title="Tooltip, Patient Info & Route Slip" 
      subtitle="What appears on hover and on printed route slips"
      icon={TooltipPatientInfoIcon}
    >
      <Grid container spacing={2} sx={{ flexWrap: 'nowrap', overflowX: 'auto', pb: 1 }}>
        {/* Appointment Tooltip Settings */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ p: { xs: 2, md: 3 }, border: '1px solid #e5e7eb', borderRadius: '8px', bgcolor: '#FAFBFC', height: '100%', minWidth: '320px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#11223F', mb: 2, whiteSpace: 'nowrap' }}>Appointment Tooltip Settings</Typography>
            <FormControlLabel control={<Switch defaultChecked />} label={<Typography sx={{ fontSize: '12px', color: '#4b5563', whiteSpace: 'nowrap' }}>Enable Tooltip</Typography>} sx={{ mb: 2 }} />
            
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', mb: 1, mt: 1, whiteSpace: 'nowrap' }}>Appointment Information</Typography>
            {[
              "Appointment Provider", "Appointment Type", "Appointment Tags", "Appointment Procedures",
              "Appointment Date", "Appointment Start Time", "Appointment End Time", "Appointment Charge",
              "Appointment Status", "Appointment Scheduled By", "Appointment Notes"
            ].map((item) => (
              <FormControlLabel key={item} control={<Switch defaultChecked size="small" />} label={<Typography sx={{ fontSize: '12px', color: '#4b5563', whiteSpace: 'nowrap' }}>{item}</Typography>} sx={{ display: 'flex', ml: 0, mb: 0 }} />
            ))}
          </Box>
        </Grid>

        {/* Patient Information Settings */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ p: { xs: 2, md: 3 }, border: '1px solid #e5e7eb', borderRadius: '8px', bgcolor: '#FAFBFC', height: '100%', minWidth: '320px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#11223F', mb: 2, whiteSpace: 'nowrap' }}>Patient Information</Typography>
            {[
              "Patient ID", "Patient Title", "Patient First Name", "Patient Last Name",
              "Patient Date of Birth", "Patient Home Phone", "Patient Mobile Number",
              "Patient Email", "Patient Risk", "Patient Premed", "Insurance Info",
              "Patient Credit", "Reffering Sources", "Patient Default DDS", "Patient Default Hygienist"
            ].map((item) => (
              <FormControlLabel
                key={item}
                control={<Switch defaultChecked size="small" />}
                label={<Typography sx={{ fontSize: '12px', color: '#4b5563', whiteSpace: 'nowrap' }}>{item}</Typography>}
                sx={{ display: 'flex', ml: 0, mb: 0 }}
              />
            ))}
          </Box>
        </Grid>

        {/* Patient Route Slip Settings */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ p: { xs: 2, md: 3 }, border: '1px solid #e5e7eb', borderRadius: '8px', bgcolor: '#FAFBFC', height: '100%', minWidth: '320px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#11223F', mb: 2, whiteSpace: 'nowrap' }}>Patient Route Slip Settings</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={enableRouteSlip} 
                    onChange={(e) => setEnableRouteSlip(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography sx={{ fontSize: '12px', color: '#4b5563', whiteSpace: 'nowrap' }}>Enable Route Slip</Typography>}
                sx={{ mb: 1, ml: 0 }}
              />
              
              <Collapse in={enableRouteSlip}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  
                  {/* Reusable Section Wrapper */}
                  {[
                    {
                      id: 'patientDetails', label: 'Patient Details',
                      fields: [
                        { key: 'patientName', label: 'Name' },
                        { key: 'patientAddress', label: 'Address' },
                        { key: 'patientDob', label: 'Date of Birth' },
                        { key: 'patientEmail', label: 'Email' },
                        { key: 'patientPhone', label: 'Phone Number' },
                        { key: 'patientPrefDentist', label: 'Preferred Dentist' },
                        { key: 'patientPrefHygienist', label: 'Preferred Hygienist' },
                        { key: 'patientReferringSources', label: 'Referring Sources' },
                      ]
                    },
                    {
                      id: 'accountDetails', label: 'Account Details',
                      fields: [
                        { key: 'totalOutstanding', label: 'Total Outstanding' },
                        { key: 'individualOutstanding', label: 'Individual Outstanding' },
                        { key: 'insuranceOutstanding', label: 'Insurance Outstanding' },
                      ]
                    },
                    {
                      id: 'insuranceDetails', label: 'Insurance Details',
                      fields: [
                        { key: 'carrierName', label: 'Carrier Name' },
                        { key: 'subscriberId', label: 'Subscriber ID' },
                        { key: 'groupNumber', label: 'Group Number' },
                      ]
                    },
                    {
                      id: 'appointmentDetails', label: 'Appointment Details',
                      fields: [
                        { key: 'apptTime', label: 'Appointment Time' },
                        { key: 'apptReason', label: 'Appointment Reason' },
                        { key: 'apptProvider', label: 'Provider Name' },
                      ]
                    },
                    {
                      id: 'nextAppointmentDetails', label: 'Next Appointment Details',
                      fields: [
                        { key: 'nextApptDate', label: 'Next Appointment Date' },
                        { key: 'nextApptTime', label: 'Next Appointment Time' },
                        { key: 'nextApptReason', label: 'Next Appointment Reason' },
                      ]
                    },
                    {
                      id: 'otherDetails', label: 'Other Details',
                      fields: [
                        { key: 'printableNotes', label: 'Printable Notes' },
                        { key: 'customHeader', label: 'Custom Header' },
                      ]
                    }
                  ].map(section => (
                    <Box key={section.id} sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                      <Box 
                        onClick={() => toggleSection(section.id)}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { color: '#3b82f6' }, py: 1 }}
                      >
                        {expandedSections[section.id] ? <KeyboardArrowDownIcon sx={{ fontSize: '16px', color: '#3b82f6' }} /> : <ChevronRightIcon sx={{ fontSize: '16px', color: '#6b7280' }} />}
                        <Typography sx={{ fontSize: '12px', fontWeight: expandedSections[section.id] ? 600 : 500, color: expandedSections[section.id] ? '#3b82f6' : '#4b5563' }}>
                          {section.label}
                        </Typography>
                      </Box>
                      <Collapse in={expandedSections[section.id]}>
                        <Box sx={{ pl: 4, pt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {section.fields.map(item => (
                            <FormControlLabel
                              key={item.key}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={routeSlipSettings[item.key]}
                                  onChange={(e) => setRouteSlipSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                />
                              }
                              label={<Typography sx={{ fontSize: '12px', color: '#3b82f6', whiteSpace: 'nowrap' }}>{item.label}</Typography>}
                              sx={{ my: 0 }}
                            />
                          ))}
                        </Box>
                      </Collapse>
                    </Box>
                  ))}
                  
                </Box>
              </Collapse>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ScheduleConfigCard>
  );
};

export default TooltipPatientInfoRouteSlip;
