import React from 'react';
import { Box, Typography, Button, IconButton, Collapse } from '@mui/material';
import {
  KeyboardArrowRight as ChevronRightIcon,
  KeyboardArrowDown as ChevronDownIcon,
} from '@mui/icons-material';
import addSvg from '../../../../assets/timeclock/add.svg';
import deleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';
import CoverageGroupItem from './CoverageGroupItem';

const CoverageCategoryItem = ({ 
  category, 
  isExpanded, 
  toggleCategory, 
  expandedGroups, 
  toggleGroup, 
  handleAddGroup, 
  handleEditGroup, 
  handleDeleteTemplate, 
  handleDeleteGroup 
}) => {
  return (
    <Box sx={{ mb: 2, backgroundColor: '#ffffff', borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <Box
        onClick={() => toggleCategory(category.id)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 2,
          px: 3,
          backgroundColor: isExpanded ? '#f8fafc' : '#ffffff',
          cursor: 'pointer',
          borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        }}
      >
        {isExpanded ? (
          <ChevronDownIcon sx={{ mr: 2, fontSize: '1.2rem', color: '#475569' }} />
        ) : (
          <ChevronRightIcon sx={{ mr: 2, fontSize: '1.2rem', color: '#475569' }} />
        )}
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', flex: 1, color: '#1e293b' }}>
          {category.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={(e) => { e.stopPropagation(); handleAddGroup(e, category.id); }}
            startIcon={<img src={addSvg} alt="Add" style={{ width: 14, height: 14, filter: 'brightness(0) saturate(100%) invert(29%) sepia(87%) saturate(2227%) hue-rotate(215deg) brightness(96%) contrast(92%)' }} />}
            sx={{
              color: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Add Group
          </Button>
          <IconButton 
            onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(e, category.id); }}
            size="small" 
            sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', backgroundColor: '#fef2f2' } }}
          >
            <img src={deleteSvg} alt="Delete" style={{ width: 16, height: 16 }} />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1, backgroundColor: '#ffffff' }}>
          {(!category.groups || category.groups.length === 0) && (
            <Typography sx={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem', py: 2, textAlign: 'center' }}>
              No groups added yet.
            </Typography>
          )}
          {category.groups && category.groups.map((group) => (
            <CoverageGroupItem
              key={group.id}
              group={group}
              categoryId={category.id}
              isExpanded={expandedGroups.includes(group.id)}
              toggleGroup={toggleGroup}
              handleEditGroup={handleEditGroup}
              handleDeleteGroup={handleDeleteGroup}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CoverageCategoryItem;
