import { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow,
  Checkbox, IconButton, Collapse,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

const categoriesTemplate = [
  { name: 'Owner', items: ['Onyx Connection', 'E-Mail Service', 'Onyx Support'] },
  { name: 'Doctor', items: ['E-Mail Service', 'Onyx Support'] },
  { name: 'Assistant', items: ['Protocol Warning', 'Good News'] },
  { name: 'Front', items: ['Text Forms', 'Route Slips'] },
  { name: 'Manager', items: ['MailBoxWatch', 'Reminders Dashboard', 'Text Forms', 'Route Slips', 'System Service', 'Message Station'] },
  { name: 'Integration Role', items: ['Face'] },
];

const defaultEmailNotifications = {};
categoriesTemplate.forEach(cat => {
  defaultEmailNotifications[cat.name] = {};
  cat.items.forEach(item => {
    defaultEmailNotifications[cat.name][item] = false;
  });
});

const CustomCheckbox = ({ checked, onChange }) => (
  <Checkbox
    size="small"
    checked={checked}
    onChange={onChange}
    sx={{ p: 0.5, '&.Mui-checked': { color: '#2563EB' } }}
    icon={<Box sx={{ width: 14, height: 14, border: '2px solid #CBD5E1', borderRadius: '4px' }} />}
    checkedIcon={<Box sx={{ width: 14, height: 14, bgcolor: '#2563EB', borderRadius: '4px', position: 'relative', '&::after': { content: '""', position: 'absolute', width: 4, height: 8, border: 'solid white', borderWidth: '0 2px 2px 0', transform: 'rotate(45deg)', top: 1, left: 4 } }} />}
  />
);

const EmailNotifications = ({ settings, setSettings }) => {
  const [expandedCategories, setExpandedCategories] = useState(
    categoriesTemplate.reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
  );

  if (!settings) return null;

  const currentSettings = settings.emailNotifications || defaultEmailNotifications;

  const updateSettings = (category, item, value) => {
    setSettings(prev => {
      const current = prev.emailNotifications || defaultEmailNotifications;
      return {
        ...prev,
        emailNotifications: {
          ...current,
          [category]: {
            ...(current[category] || {}),
            [item]: value
          }
        }
      };
    });
  };

  const toggleCategory = (name) => {
    setExpandedCategories(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '8px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#F2F6FC', px: 3, py: 2, borderBottom: '1px solid #E5E9F2' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B', mb: 0.5 }}>Email Notifications</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
          You can configure email notifications that each role would receive within the patient's table action by checking or unchecking the user to send or not to send an email notification.
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Category Tables */}
        {categoriesTemplate.map((cat) => (
          <Box key={cat.name} sx={{ mb: 3, border: '1px solid #E5E9F2', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Category Header */}
            <Box
              onClick={() => toggleCategory(cat.name)}
              sx={{
                bgcolor: '#F8FAFC', px: 2, py: 1.2,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', borderBottom: expandedCategories[cat.name] ? '1px solid #E5E9F2' : 'none',
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1E293B' }}>{cat.name}</Typography>
              <IconButton size="small" sx={{ color: '#CBD5E1', p: 0.2 }}>
                {expandedCategories[cat.name] ? <KeyboardArrowUp sx={{ fontSize: '1.2rem' }} /> : <KeyboardArrowDown sx={{ fontSize: '1.2rem' }} />}
              </IconButton>
            </Box>

            {/* Category Items */}
            <Collapse in={expandedCategories[cat.name]}>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {cat.items.map((item, i) => {
                      const isLast = i === cat.items.length - 1;
                      const isChecked = currentSettings[cat.name]?.[item] || false;
                      return (
                        <TableRow key={i} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontSize: '0.8rem', py: 1.5, borderBottom: isLast ? 'none' : '1px solid #F1F5F9', color: '#3B82F6', fontWeight: 500 }}>
                            {item}
                          </TableCell>
                          <TableCell sx={{ width: 60, py: 1.5, borderBottom: isLast ? 'none' : '1px solid #F1F5F9' }} align="right">
                            <CustomCheckbox
                              checked={isChecked}
                              onChange={(e) => updateSettings(cat.name, item, e.target.checked)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default EmailNotifications;
