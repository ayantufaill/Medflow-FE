import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  KeyboardArrowRight as ChevronRightIcon,
  KeyboardArrowDown as ChevronDownIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import AddCoverageGroupModal from '../../components/admin/coverage/AddCoverageGroupModal';

const INITIAL_DATA = [
  {
    id: 1,
    name: 'Prosthodontics-Removable',
    groups: [
      { id: 101, name: 'Dentures', deliveryPattern: '1/5 year(s)' },
      { id: 102, name: 'Partials', deliveryPattern: '1/5 year(s)' },
    ],
  },
  {
    id: 2,
    name: 'Perio',
    groups: [
      { id: 201, name: '4910', deliveryPattern: '2/1 year(s)' },
      { id: 202, name: 'SRP', deliveryPattern: '1/24 month(s)' },
    ],
  },
  {
    id: 3,
    name: 'Molar Crown Downgrade',
    groups: [
      { id: 301, name: 'Crown', deliveryPattern: '1/5 year(s)', downgrade: '1, 2, 3, 14, 15, 16, 19, 18, 17, 32, 31, 30' },
    ],
  },
  {
    id: 4,
    name: 'Composites',
    groups: [
      { id: 401, name: '1-surface', downgrade: true },
      { id: 402, name: '2-surface', downgrade: true },
      { id: 403, name: '3-surface', downgrade: true },
      { id: 404, name: '4-surface', downgrade: true },
    ],
  },
  {
    id: 5,
    name: 'Preventive',
    groups: [
      { id: 501, name: 'Bitewings', deliveryPattern: '1/1 year(s)' },
      { id: 502, name: 'Exam', deliveryPattern: '2/1 year(s)' },
      { id: 503, name: 'Fluoride', deliveryPattern: '1/1 year(s)', ageLimit: '14' },
      { id: 504, name: 'FMX/pano', deliveryPattern: '1/36 month(s)' },
      { id: 505, name: 'Prophy', deliveryPattern: '2/1 year(s)' },
    ],
  },
  {
    id: 6,
    name: 'Endodontics',
    groups: [
      { id: 601, name: 'Endo-Root Canals', deliveryPattern: '1/3 year(s)' },
    ],
  },
];

const CoverageBookShortcuts = () => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const toggleCategory = (id) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleAddGroup = (e) => {
    e.stopPropagation();
    setSelectedGroup(null);
    setModalOpen(true);
  };

  const handleEditGroup = (e, group) => {
    e.stopPropagation();
    setSelectedGroup(group);
    setModalOpen(true);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: '#003366' } }}>
        <Link underline="hover" color="#7a96b5" component={RouterLink} to="/admin/finance-management" sx={{ fontSize: '0.85rem' }}>
          Finance Management
        </Link>
        <Typography color="#003366" sx={{ fontSize: '0.85rem' }}>
          Coverage Book Shortcuts
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#003366', fontWeight: 600 }}>
          Coverage Book Shortcuts
        </Typography>
        <Button
          startIcon={<AddIcon />}
          sx={{
            color: '#003366',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          }}
        >
          Add Template
        </Button>
      </Box>

      {/* List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {INITIAL_DATA.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <Box key={category.id} sx={{ borderBottom: '1px solid #7a96b5', pb: 1 }}>
              <Box
                onClick={() => toggleCategory(category.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 1.2,
                  px: 2,
                  backgroundColor: isExpanded ? '#003366' : '#f0f7ff',
                  color: isExpanded ? 'white' : '#003366',
                  cursor: 'pointer',
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: isExpanded ? '#002244' : '#e1efff',
                  },
                }}
              >
                {isExpanded ? (
                  <ChevronDownIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
                ) : (
                  <ChevronRightIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
                )}
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>
                  {category.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    onClick={handleAddGroup}
                    startIcon={<AddIcon sx={{ fontSize: '1rem !important' }} />}
                    sx={{
                      color: isExpanded ? 'white' : '#003366',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    Add Group
                  </Button>
                  <IconButton 
                    size="small" 
                    sx={{ color: isExpanded ? 'white' : '#7a96b5' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ pl: 4, mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {category.groups.map((group) => (
                    <Box
                      key={group.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1,
                        px: 2,
                        backgroundColor: '#f9fbfd',
                        borderRadius: 1,
                        border: '1px solid transparent',
                        '&:hover': { borderColor: '#7a96b5' },
                      }}
                    >
                      <ChevronRightIcon sx={{ mr: 2, fontSize: '1.1rem', color: '#7a96b5' }} />
                      <Typography sx={{ color: '#003366', fontWeight: 600, fontSize: '0.85rem', width: '200px' }}>
                        {group.name}
                      </Typography>

                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {group.deliveryPattern && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                              Delivery Pattern:
                            </Typography>
                            <Typography sx={{ color: '#333', fontSize: '0.85rem' }}>
                              {group.deliveryPattern}
                            </Typography>
                          </Box>
                        )}
                        
                        {group.ageLimit && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                              Age Limit:
                            </Typography>
                            <Typography sx={{ color: '#333', fontSize: '0.85rem' }}>
                              {group.ageLimit}
                            </Typography>
                          </Box>
                        )}

                        {group.downgrade && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#333', fontWeight: 600, fontSize: '0.85rem' }}>
                              Downgrade:
                            </Typography>
                            {typeof group.downgrade === 'string' ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography sx={{ fontSize: '0.9rem' }}>🦷</Typography>
                                <Typography sx={{ color: '#333', fontSize: '0.85rem' }}>
                                  {group.downgrade}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography sx={{ fontSize: '0.9rem' }}>🦷</Typography>
                            )}
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          onClick={(e) => handleEditGroup(e, group)}
                          sx={{
                            color: '#003366',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                          }}
                        >
                          Edit
                        </Button>
                        <IconButton size="small" sx={{ color: '#7a96b5' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      <AddCoverageGroupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        groupData={selectedGroup}
      />
    </Box>
  );
};

export default CoverageBookShortcuts;
