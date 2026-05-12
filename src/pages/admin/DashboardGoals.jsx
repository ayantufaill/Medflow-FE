import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Divider,
  IconButton,
  Collapse,
  Breadcrumbs,
  Link,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  KeyboardArrowDown as ChevronDownIcon,
  KeyboardArrowRight as ChevronRightIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';

const GoalInput = ({ label, value, unit, subtext, width = 60, subtextWidth = 'auto' }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 500 }}>
        {label}
      </Typography>
      <TextField
        variant="standard"
        defaultValue={value}
        sx={{ width, '& input': { textAlign: 'center', fontSize: '0.85rem', py: 0.2 } }}
      />
      <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 500 }}>
        {unit}
      </Typography>
    </Box>
    {subtext && (
      <Typography sx={{ color: '#888', fontSize: '0.7rem', ml: 0, mt: 0.2, width: subtextWidth }}>
        {subtext}
      </Typography>
    )}
  </Box>
);

const ProviderRow = ({ name, value, unit }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
    <Typography sx={{ color: '#003366', fontSize: '0.85rem', minWidth: 100 }}>
      {name}
    </Typography>
    <TextField
      variant="standard"
      defaultValue={value}
      placeholder="Value"
      sx={{ width: 60, '& input': { textAlign: 'center', fontSize: '0.85rem', py: 0.2 } }}
    />
    <Typography sx={{ color: '#003366', fontSize: '0.85rem' }}>
      {unit}
    </Typography>
  </Box>
);

const ProcedureGroupTable = ({ groups }) => (
  <Box sx={{ mt: 2, mb: 3 }}>
    <Box sx={{ display: 'flex', px: 2, py: 1, borderBottom: '1.5px solid #7a96b5' }}>
      <Typography sx={{ width: '60px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Color</Typography>
      <Typography sx={{ width: '180px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Group Name</Typography>
      <Typography sx={{ width: '120px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Percentage</Typography>
      <Typography sx={{ flex: 1, fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Codes</Typography>
      <Typography sx={{ width: '80px', fontSize: '0.8rem', fontWeight: 700, color: '#333', textAlign: 'center' }}>Actions</Typography>
    </Box>
    {groups.map((group, idx) => (
      <Box 
        key={idx} 
        sx={{ 
          display: 'flex', 
          px: 2, 
          py: 1.2, 
          borderBottom: '1px solid #f1f5f9', 
          alignItems: 'center',
          backgroundColor: group.name === 'Adjunctive' ? '#f0f7ff' : 'transparent',
          '&:hover': { backgroundColor: '#f8fafc' }
        }}
      >
        <Box sx={{ width: '60px' }}>
          <Box sx={{ width: 20, height: 20, bgcolor: group.color, borderRadius: '2px' }} />
        </Box>
        <Typography sx={{ width: '180px', fontSize: '0.85rem', color: '#333' }}>{group.name}</Typography>
        <Box sx={{ width: '120px', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField 
            variant="standard" 
            defaultValue={group.percentage} 
            sx={{ width: 30, '& input': { textAlign: 'center', fontSize: '0.85rem' } }} 
          />
          <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>%</Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {group.codes.map((code, cidx) => (
            <Typography key={cidx} sx={{ fontSize: '0.85rem', color: '#333' }}>{code}</Typography>
          ))}
          {group.hasMore && <Typography sx={{ fontSize: '0.85rem', color: '#4a89dc', cursor: 'pointer' }}>Show more codes...</Typography>}
        </Box>
        <Box sx={{ width: '80px', display: 'flex', justifyContent: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ color: '#4a89dc' }}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" sx={{ color: '#f56565' }}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </Box>
    ))}
    <Button 
      startIcon={<span>+</span>} 
      sx={{ color: '#4a89dc', textTransform: 'none', fontSize: '0.85rem', fontWeight: 600, mt: 1, px: 2 }}
    >
      Add new group
    </Button>
  </Box>
);

const DashboardGoals = () => {
  const [expandedSection, setExpandedSection] = useState('');

  const hygieneGroups = [
    { color: '#9067c6', name: 'Preventative', percentage: 8, codes: ['D1206', 'D1208', 'D1310', 'D1320', 'D1330', 'D1351', 'D1352', 'D1353', 'D1354'] },
    { color: '#d0679b', name: 'Prophy', percentage: 30, codes: ['D1110', 'D1120'] },
    { color: '#8d3d66', name: 'Maintenance', percentage: 15, codes: ['D4910'] },
    { color: '#b2b9e1', name: 'Perio Treatment', percentage: 32, codes: ['D4341', 'D4342', 'D4346', 'D4355', 'CD4999.1'] },
    { color: '#90d5e2', name: 'Diagnostic-HYG', percentage: 15, codes: ['D0210', 'D0220', 'D0230', 'D0240', 'D0250', 'D0251', 'D0270', 'D0272', 'D0273', 'D0274', 'D0277', 'D0290', 'D0310', 'D0320', 'D0321'], hasMore: true },
    { color: '#f0b0c0', name: 'Adjunctive', percentage: 0, codes: ['D4381', 'D4921'] },
  ];

  const treatmentGroups = [
    { color: '#90d5e2', name: 'Diagnostic', percentage: 20, codes: ['D0120', 'D0140', 'D0145', 'D0150', 'D0160', 'D0170', 'D0171', 'D0180', 'D0190', 'D0191', 'D0414', 'D0415', 'D0416', 'D0417', 'D0418'], hasMore: true },
    { color: '#00acc1', name: 'Direct Restoration', percentage: 25, codes: ['D2140', 'D2150', 'D2160', 'D2161', 'D2330', 'D2331', 'D2332', 'D2335', 'D2390', 'D2391', 'D2392', 'D2393', 'D2394', 'D2410', 'D2420'], hasMore: true },
    { color: '#ffb74d', name: 'Orthodontics', percentage: 5, codes: ['D8010', 'D8020', 'D8030', 'D8040', 'D8050', 'D8060', 'D8070', 'D8080', 'D8090', 'D8210', 'D8220', 'D8660', 'D8670', 'D8680', 'D8681'], hasMore: true },
    { color: '#00bfa5', name: 'Indirect Restoration', percentage: 35, codes: ['D2961', 'D2962', 'D2510', 'D2520', 'D2530', 'D2542', 'D2543', 'D2544', 'D2610', 'D2620', 'D2630', 'D2642', 'D2643', 'D2644', 'D2650'], hasMore: true },
    { color: '#80cbc4', name: 'Implant', percentage: 10, codes: ['D6010', 'D6011', 'D6012', 'D6013', 'D6040', 'D6050', 'D6051', 'D6055', 'D6056', 'D6057', 'D6058', 'D6059', 'D6060', 'D6061', 'D6062'], hasMore: true },
    { color: '#ff8a65', name: 'Oral Surgery', percentage: 5, codes: ['D7111', 'D7140', 'D7210', 'D7220', 'D7230', 'D7240', 'D7241', 'D7250', 'D7251', 'D7260', 'D7261', 'D7270', 'D7272', 'D7280', 'D7282'], hasMore: true },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: '#003366' } }}>
        <Link underline="hover" color="#7a96b5" component={RouterLink} to="/admin/finance-management" sx={{ fontSize: '0.85rem' }}>
          Finance Management
        </Link>
        <Typography color="#003366" sx={{ fontSize: '0.85rem' }}>
          Goals
        </Typography>
      </Breadcrumbs>

      {/* Production Goals */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Production Goals:
      </Typography>

      <Box sx={{ pl: 4 }}>
        <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 600, mb: 1.5 }}>
          Provider production per hour
        </Typography>

        <Box sx={{ display: 'flex', gap: 15, mb: 3 }}>
          <Box>
            <Typography sx={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, mb: 1 }}>Dentist</Typography>
            <ProviderRow name="Christina Sabour" value="200" unit="$/hr" />
            <ProviderRow name="Sabour Ortho" value="1" unit="$/hr" />
            <ProviderRow name="TDS Doc" value="0" unit="$/hr" />
          </Box>
          <Box>
            <Typography sx={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, mb: 1 }}>Hygienist</Typography>
            <ProviderRow name="Temp Hygiene" value="50" unit="$/hr" />
          </Box>
        </Box>

        <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 600, mb: 1 }}>
          Production per procedure group
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', py: 0.5 }} onClick={() => setExpandedSection(expandedSection === 'hygiene' ? '' : 'hygiene')}>
            {expandedSection === 'hygiene' ? <ChevronDownIcon sx={{ fontSize: '1.2rem', color: '#4a89dc' }} /> : <ChevronRightIcon sx={{ fontSize: '1.2rem', color: '#4a89dc' }} />}
            <Typography sx={{ fontSize: '0.85rem', color: '#4a89dc', fontWeight: 500 }}>Hygiene production per procedure group</Typography>
          </Box>
          <Collapse in={expandedSection === 'hygiene'}>
            <ProcedureGroupTable groups={hygieneGroups} />
          </Collapse>

          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', py: 0.5 }} onClick={() => setExpandedSection(expandedSection === 'treatment' ? '' : 'treatment')}>
            {expandedSection === 'treatment' ? <ChevronDownIcon sx={{ fontSize: '1.2rem', color: '#4a89dc' }} /> : <ChevronRightIcon sx={{ fontSize: '1.2rem', color: '#4a89dc' }} />}
            <Typography sx={{ fontSize: '0.85rem', color: '#4a89dc', fontWeight: 500 }}>Treatment production per procedure group</Typography>
          </Box>
          <Collapse in={expandedSection === 'treatment'}>
            <ProcedureGroupTable groups={treatmentGroups} />
          </Collapse>
        </Box>
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* Collection Goals */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Collection Goals:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <GoalInput label="Collection Percent" value="98" unit="%" subtext="(% out of total prod.)" subtextWidth="120px" />
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* New Patients */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        New Patients:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <GoalInput label="Number of new patients per office" value="25" unit="#" />
        
        <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 600, mb: 1.5, mt: 2 }}>
          Number of new patients per provider
        </Typography>

        <Box sx={{ display: 'flex', gap: 15 }}>
          <Box>
            <Typography sx={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, mb: 1 }}>Dentist</Typography>
            <ProviderRow name="Christina Sabour" value="" unit="New Pts #" />
            <ProviderRow name="Sabour Ortho" value="" unit="New Pts #" />
            <ProviderRow name="TDS Doc" value="" unit="New Pts #" />
          </Box>
          <Box>
            <Typography sx={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, mb: 1 }}>Hygienist</Typography>
            <ProviderRow name="Temp Hygiene" value="" unit="New Pts #" />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* Number of Visits */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Number of Visits:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <GoalInput label="Total Visits Per Month" value="60" unit="#" />
        <GoalInput label="Hygiene Visits Per Month" value="40" unit="%" subtext="(% out of total visits)" />
        <GoalInput label="Treatment Visits Per Month" value="60" unit="%" subtext="(100% - Percentage of Hygiene Visits Per Month)" />
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* Re-appointments */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Re-appointments:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <GoalInput label="Re-Appointment Percent" value="100" unit="%" subtext="(% out of total visits)" />
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* Acceptance Rate */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Acceptance Rate:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <GoalInput label="New Pt Case Accept Percent" value="65" unit="%" />
        <GoalInput label="Existing Pt Case Accept Percent" value="65" unit="%" />
      </Box>
    </Box>
  );
};

export default DashboardGoals;
