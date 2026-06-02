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
      { 
        id: 101, 
        name: 'Dentures', 
        deliveryPattern: '1/5 year(s)',
        codes: [
          { code: 'D5110', desc: 'complete denture - maxillary' },
          { code: 'D5120', desc: 'complete denture - mandibular' },
          { code: 'D5130', desc: 'immediate denture - maxillary' },
          { code: 'D5140', desc: 'immediate denture - mandibular' },
        ]
      },
      { 
        id: 102, 
        name: 'Partials', 
        deliveryPattern: '1/5 year(s)',
        codes: [
          { code: 'D5211', desc: 'maxillary partial denture - resin base (including any conventional clasps, rests and teeth)' },
          { code: 'D5212', desc: 'mandibular partial denture - resin base (including any conventional clasps, rests and teeth)' },
          { code: 'D5213', desc: 'maxillary partial denture - cast metal framework with resin denture bases (including any conventional clasps, rests and teeth)' },
          { code: 'D5214', desc: 'mandibular partial denture - cast metal framework with resin denture bases (including any conventional clasps, rests and teeth)' },
        ]
      },
    ],
  },
  {
    id: 2,
    name: 'Perio',
    groups: [
      { 
        id: 201, 
        name: '4910', 
        deliveryPattern: '2/1 year(s)',
        codes: [
          { code: 'D4910', desc: 'periodontal maintenance' }
        ]
      },
      { 
        id: 202, 
        name: 'SRP', 
        deliveryPattern: '1/24 month(s)',
        codes: [
          { code: 'D4341', desc: 'periodontal scaling and root planing - four or more teeth per quadrant' },
          { code: 'D4342', desc: 'periodontal scaling and root planing - one to three teeth per quadrant' },
        ]
      },
    ],
  },
  {
    id: 3,
    name: 'Molar Crown Downgrade',
    groups: [
      { 
        id: 301, 
        name: 'Crown', 
        deliveryPattern: '1/5 year(s)', 
        downgrade: '1, 2, 3, 14, 15, 16, 19, 18, 17, 32, 31, 30',
        codes: [
          { code: 'D2740', desc: 'crown - porcelain/ceramic substrate' }
        ]
      },
    ],
  },
  {
    id: 4,
    name: 'Composites',
    groups: [
      { 
        id: 401, 
        name: '1-surface', 
        downgrade: true,
        codes: [
          { code: 'D2391', desc: 'resin-based composite - one surface, posterior' }
        ]
      },
      { 
        id: 402, 
        name: '2-surface', 
        downgrade: true,
        codes: [
          { code: 'D2392', desc: 'resin-based composite - two surfaces, posterior' }
        ]
      },
      { 
        id: 403, 
        name: '3-surface', 
        downgrade: true,
        codes: [
          { code: 'D2393', desc: 'resin-based composite - three surfaces, posterior' }
        ]
      },
      { 
        id: 404, 
        name: '4-surface', 
        downgrade: true,
        codes: [
          { code: 'D2394', desc: 'resin-based composite - four or more surfaces, posterior' }
        ]
      },
    ],
  },
  {
    id: 5,
    name: 'Preventive',
    groups: [
      { 
        id: 501, 
        name: 'Bitewings', 
        deliveryPattern: '1/1 year(s)',
        codes: [
          { code: 'D0270', desc: 'bitewing - single radiographic image' },
          { code: 'D0272', desc: 'bitewings - two radiographic images' },
          { code: 'D0274', desc: 'bitewings - four radiographic images' }
        ]
      },
      { 
        id: 502, 
        name: 'Exam', 
        deliveryPattern: '2/1 year(s)',
        codes: [
          { code: 'D0120', desc: 'periodic oral evaluation - established patient' },
          { code: 'D0150', desc: 'comprehensive oral evaluation - new or established patient' }
        ]
      },
      { 
        id: 503, 
        name: 'Fluoride', 
        deliveryPattern: '1/1 year(s)', 
        ageLimit: '14',
        codes: [
          { code: 'D1206', desc: 'topical application of fluoride varnish' },
          { code: 'D1208', desc: 'topical application of fluoride - excluding varnish' }
        ]
      },
      { 
        id: 504, 
        name: 'FMX/pano', 
        deliveryPattern: '1/36 month(s)',
        codes: [
          { code: 'D0330', desc: 'panoramic radiographic image' },
          { code: 'D0210', desc: 'intraoral - complete series of radiographic images' }
        ]
      },
      { 
        id: 505, 
        name: 'Prophy', 
        deliveryPattern: '2/1 year(s)',
        codes: [
          { code: 'D1110', desc: 'prophylaxis - adult' },
          { code: 'D1120', desc: 'prophylaxis - child' }
        ]
      },
    ],
  },
  {
    id: 6,
    name: 'Endodontics',
    groups: [
      { 
        id: 601, 
        name: 'Endo-Root Canals', 
        deliveryPattern: '1/3 year(s)',
        codes: [
          { code: 'D3310', desc: 'endodontic therapy, anterior tooth (excluding final restoration)' },
          { code: 'D3320', desc: 'endodontic therapy, premolar tooth (excluding final restoration)' },
          { code: 'D3330', desc: 'endodontic therapy, molar tooth (excluding final restoration)' }
        ]
      },
    ],
  },
];

const CoverageBookShortcuts = () => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const toggleCategory = (id) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
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
                  {category.groups.map((group) => {
                    const isGroupExpanded = expandedGroups.includes(group.id);

                    return (
                      <Box key={group.id} sx={{ mb: 0.5 }}>
                        <Box
                          onClick={() => toggleGroup(group.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            py: 1,
                            px: 2,
                            backgroundColor: '#f9fbfd',
                            borderRadius: 1,
                            border: '1px solid transparent',
                            cursor: 'pointer',
                            '&:hover': { borderColor: '#7a96b5' },
                          }}
                        >
                          {isGroupExpanded ? (
                            <ChevronDownIcon sx={{ mr: 2, fontSize: '1.1rem', color: '#7a96b5' }} />
                          ) : (
                            <ChevronRightIcon sx={{ mr: 2, fontSize: '1.1rem', color: '#7a96b5' }} />
                          )}
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography sx={{ fontSize: '0.9rem' }}>🦷</Typography>
                                  {typeof group.downgrade === 'string' && (
                                    <Typography sx={{ color: '#333', fontSize: '0.85rem' }}>
                                      {group.downgrade}
                                    </Typography>
                                  )}
                                </Box>
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

                        {/* Collapsible Nested Codes List */}
                        <Collapse in={isGroupExpanded}>
                          <Box sx={{ pl: 6, mt: 0.5, borderLeft: '1px dashed #cbd5e1', ml: 3, display: 'flex', flexDirection: 'column' }}>
                            {group.codes && group.codes.map((codeItem, cIdx) => (
                              <Box
                                key={cIdx}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  py: 1,
                                  borderBottom: '1px solid #f1f5f9',
                                  gap: 2
                                }}
                              >
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a3a6b', minWidth: 60 }}>
                                  {codeItem.code}
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                                  {codeItem.desc}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
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
