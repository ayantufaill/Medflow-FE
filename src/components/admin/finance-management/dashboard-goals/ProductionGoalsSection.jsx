import React, { useState } from 'react';
import { Box, Typography, Collapse, IconButton, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import {
  KeyboardArrowDown as ChevronDownIcon,
  KeyboardArrowRight as ChevronRightIcon,
} from '@mui/icons-material';

import editSvg from '../../../../assets/practicesetupicon/editicon.svg';
import deleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';

import { ProviderGoalTableRow, headerStyle } from './SharedGoalInputs';
import ProcedureGroupDialog from './ProcedureGroupDialog';

const ProcedureGroupTable = ({ groups, onAdd, onEdit, onDelete }) => (
  <Box sx={{ mt: 2, mb: 3 }}>
    <Box sx={{ display: 'flex', px: 2, py: 1, borderBottom: '1px solid #e2e8f0', backgroundColor: '#F8FAFC' }}>
      <Typography sx={{ width: '60px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Color</Typography>
      <Typography sx={{ width: '180px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Group Name</Typography>
      <Typography sx={{ width: '120px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Percentage</Typography>
      <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Codes</Typography>
      <Typography sx={{ width: '80px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', textAlign: 'center' }}>Actions</Typography>
    </Box>
    {groups.map((group, idx) => (
      <Box 
        key={idx} 
        sx={{ 
          display: 'flex', 
          px: 2, 
          py: 1.5, 
          borderBottom: '1px solid #f1f5f9', 
          alignItems: 'center',
          backgroundColor: group.name === 'Adjunctive' ? '#f0f7ff' : 'transparent',
          '&:hover': { backgroundColor: '#f8fafc' }
        }}
      >
        <Box sx={{ width: '60px' }}>
          <Box sx={{ width: 20, height: 20, bgcolor: group.color, borderRadius: '4px' }} />
        </Box>
        <Typography sx={{ width: '180px', fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>{group.name}</Typography>
        <Box sx={{ width: '120px', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField 
            variant="standard" 
            value={group.percentage}
            disabled 
            sx={{ width: 30, '& input': { textAlign: 'center', fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 } }} 
          />
          <Typography sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>%</Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {group.codes.map((code, cidx) => (
            <Typography key={cidx} sx={{ fontSize: '0.85rem', color: '#475569' }}>{code}</Typography>
          ))}
          {group.hasMore && <Typography sx={{ fontSize: '0.85rem', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>Show more codes...</Typography>}
        </Box>
        <Box sx={{ width: '80px', display: 'flex', justifyContent: 'center', gap: 1 }}>
          <IconButton size="small" onClick={() => onEdit(idx)} sx={{ color: '#2563eb' }}><img src={editSvg} alt="Edit" style={{ width: 16, height: 16 }} /></IconButton>
          <IconButton size="small" onClick={() => onDelete(idx)} sx={{ color: '#ef4444' }}><img src={deleteSvg} alt="Delete" style={{ width: 16, height: 16 }} /></IconButton>
        </Box>
      </Box>
    ))}
    <Box sx={{ p: 1 }}>
      <Button 
        onClick={onAdd}
        variant="text" 
        sx={{ color: '#2563eb', textTransform: 'none', fontSize: '0.85rem', fontWeight: 600, px: 2 }}
      >
        + Add new group
      </Button>
    </Box>
  </Box>
);

const ProductionGoalsSection = ({ 
  data, 
  handleUpdate, 
  handleOpenDialog, 
  handleDeleteGroup 
}) => {
  const [expandedSection, setExpandedSection] = useState('');

  return (
    <Box>
      <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 700, mb: 3, fontSize: '1.1rem' }}>
        Production Goals
      </Typography>

      <Box sx={{ pl: 4 }}>
        <Typography sx={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 600, mb: 2 }}>
          Provider production per hour
        </Typography>

        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          <Box sx={{ flex: 1, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...headerStyle, width: '40%' }}>Dentist</TableCell>
                    <TableCell sx={{ ...headerStyle, width: '30%' }}>Target Value</TableCell>
                    <TableCell sx={{ ...headerStyle, width: '30%' }}>Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.providerProduction?.dentist?.map((p, i) => (
                    <ProviderGoalTableRow 
                      key={p.id} 
                      name={p.name} 
                      value={p.value} 
                      unit="$/hr" 
                      onChange={(val) => handleUpdate(`providerProduction.dentist.${i}.value`, val)} 
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          
          <Box sx={{ flex: 1, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...headerStyle, width: '40%' }}>Hygienist</TableCell>
                    <TableCell sx={{ ...headerStyle, width: '30%' }}>Target Value</TableCell>
                    <TableCell sx={{ ...headerStyle, width: '30%' }}>Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.providerProduction?.hygienist?.map((p, i) => (
                    <ProviderGoalTableRow 
                      key={p.id} 
                      name={p.name} 
                      value={p.value} 
                      unit="$/hr" 
                      onChange={(val) => handleUpdate(`providerProduction.hygienist.${i}.value`, val)} 
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        <Typography sx={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 600, mb: 2 }}>
          Production per procedure group
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
          <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', py: 1, px: 1, borderRadius: 1, '&:hover': { backgroundColor: '#f8fafc' } }} 
            onClick={() => setExpandedSection(expandedSection === 'hygiene' ? '' : 'hygiene')}
          >
            {expandedSection === 'hygiene' ? <ChevronDownIcon sx={{ fontSize: '1.2rem', color: '#2563eb' }} /> : <ChevronRightIcon sx={{ fontSize: '1.2rem', color: '#2563eb' }} />}
            <Typography sx={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 600, ml: 1 }}>Hygiene production per procedure group</Typography>
          </Box>
          <Collapse in={expandedSection === 'hygiene'}>
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', ml: 1, mr: 2 }}>
              <ProcedureGroupTable 
                groups={data.hygieneGroups} 
                onAdd={() => handleOpenDialog('hygieneGroups')}
                onEdit={(idx) => handleOpenDialog('hygieneGroups', idx)}
                onDelete={(idx) => handleDeleteGroup('hygieneGroups', idx)}
              />
            </Box>
          </Collapse>

          <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', py: 1, px: 1, borderRadius: 1, '&:hover': { backgroundColor: '#f8fafc' } }} 
            onClick={() => setExpandedSection(expandedSection === 'treatment' ? '' : 'treatment')}
          >
            {expandedSection === 'treatment' ? <ChevronDownIcon sx={{ fontSize: '1.2rem', color: '#2563eb' }} /> : <ChevronRightIcon sx={{ fontSize: '1.2rem', color: '#2563eb' }} />}
            <Typography sx={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 600, ml: 1 }}>Treatment production per procedure group</Typography>
          </Box>
          <Collapse in={expandedSection === 'treatment'}>
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', ml: 1, mr: 2 }}>
              <ProcedureGroupTable 
                groups={data.treatmentGroups} 
                onAdd={() => handleOpenDialog('treatmentGroups')}
                onEdit={(idx) => handleOpenDialog('treatmentGroups', idx)}
                onDelete={(idx) => handleDeleteGroup('treatmentGroups', idx)}
              />
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductionGoalsSection;
