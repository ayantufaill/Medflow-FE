import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, Collapse } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DiagnosticNavbar from '../../components/clinical/DiagnosticNavbar';

const DentofacialPage = () => {
  const [risks, setRisks] = useState({});
  const [otherText, setOtherText] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [teethColor, setTeethColor] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    teethPosition: true,
    alignment: true,
    gingivalMaxillary: true,
    gingivalMandibular: true,
  });

  // Section definitions for dynamic rendering
  const sectionGroups = [
    {
      key: 'teethPosition',
      title: 'Teeth Position (step 1-4)',
      subsections: [
        {
          title: '1. Maxillary Incisal Edge Position:',
          fields: [
            { label: 'Vertical Position', id: 'max-inc-vert' },
            { label: 'Horizontal Position', id: 'max-inc-horiz' }
          ]
        },
        {
          title: '2. Maxillary Posterior Occlusal Plane',
          fields: [
            { label: 'Position', id: 'max-post-pos' }
          ]
        },
        {
          title: '3. Mandibular Incisal Edge Position:',
          fields: [
            { label: 'Vertical Position', id: 'man-inc-vert' },
            { label: 'Horizontal Position', id: 'man-inc-horiz' }
          ]
        },
        {
          title: '4. Mandibular Posterior Occlusal Plane',
          fields: [
            { label: 'Position', id: 'man-post-pos' }
          ]
        }
      ]
    },
    {
      key: 'alignment',
      title: '5. Intra Arch Tooth Position (Alignment)',
      fields: [
        { label: 'Midline', id: 'align-midline' },
        { label: 'Axial Inclination', id: 'align-axial' },
        { label: 'Crowding/Overlap', id: 'align-crowd' },
        { label: 'Diastema', id: 'align-diastema' },
        { label: 'Rotation', id: 'align-rotation' }
      ]
    },
    {
      key: 'gingivalMaxillary',
      title: '6.a. Gingival Tissue Assessment Maxillary',
      fields: [
        { label: 'Lip Dynamic (Mobility)', id: 'gin-max-lip' },
        { label: 'Position', id: 'gin-max-pos' },
        { label: 'Horizontal Symmetry', id: 'gin-max-sym' },
        { label: 'Scallop/Form', id: 'gin-max-form' }
      ]
    },
    {
      key: 'gingivalMandibular',
      title: '6.b. Gingival Tissue Assessment Mandibular',
      fields: [
        { label: 'Lip Dynamic (Mobility)', id: 'gin-man-lip' },
        { label: 'Position', id: 'gin-man-pos' },
        { label: 'Horizontal Symmetry', id: 'gin-man-sym' },
        { label: 'Scallop/Form', id: 'gin-man-form' }
      ]
    }
  ];

  const handleToggleRisk = (id, color) => {
    // Only one risk level per item - toggle between colors or clear if same color clicked
    setRisks(prev => ({ 
      ...prev, 
      [id]: prev[id] === color ? null : color 
    }));
  };

  const handleInputChange = (id, value) => {
    setInputValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const RiskCircle = ({ color, active, onClick }) => {
    const colors = { green: '#a3e635', yellow: '#fbbf24', red: '#f87171' };
    return (
      <Box
        onClick={onClick}
        sx={{
          width: 13, height: 13, borderRadius: '50%', border: `1.5px solid ${colors[color]}`,
          cursor: 'pointer', backgroundColor: active ? colors[color] : 'transparent',
          transition: 'background-color 0.1s ease'
        }}
      />
    );
  };

  const InputRow = ({ label, id, indent = 0 }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '1px', ml: indent }}>
      <Typography sx={{ fontSize: '13px', color: '#333', minWidth: '200px' }}>{label}</Typography>
      <TextField
        value={inputValues[id] || ''}
        onChange={(e) => handleInputChange(id, e.target.value)}
        variant="standard"
        sx={{
          width: '150px',
          '& .MuiInputBase-input': {
            fontSize: '12px',
            color: '#333',
            p: '2px 0',
          },
          '& .MuiUnderlinedInput-root': {
            '&::before': {
              borderBottom: '1px solid #9ca3af',
            },
            '&:hover:not(.Mui-disabled, .Mui-error)::before': {
              borderBottom: '1px solid #6b7280',
            },
            '&.Mui-focused::after': {
              borderBottom: '2px solid #5b84c1',
            },
          },
        }}
      />
      <Box sx={{ display: 'flex', gap: 0.75, width: '60px', justifyContent: 'flex-end' }}>
        {['green', 'yellow', 'red'].map((color) => (
          <RiskCircle 
            key={color} 
            color={color} 
            active={risks[id] === color} 
            onClick={() => handleToggleRisk(id, color)} 
          />
        ))}
      </Box>
    </Box>
  );

  const SectionHeader = ({ title, section }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5, 
        mt: 2, 
        mb: 0.5,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f3f4f6'
        }
      }}
      onClick={() => toggleSection(section)}
    >
      <IconButton size="small" sx={{ p: '2px' }}>
        {expandedSections[section] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>
      <Typography sx={{ fontSize: '13px', color: '#333' }}>{title}</Typography>
    </Box>
  );

  const FieldRenderer = ({ field }) => (
    <InputRow label={field.label} id={field.id} indent={2} />
  );

  const SubsectionRenderer = ({ subsection }) => (
    <>
      <Typography sx={{ fontSize: '13px', color: '#333', mt: 0.5 }}>{subsection.title}</Typography>
      {subsection.fields.map((field, index) => (
        <FieldRenderer key={field.id || index} field={field} />
      ))}
    </>
  );

  const SectionRenderer = ({ section }) => {
    if (section.subsections) {
      // For sections with subsections (like Teeth Position)
      return (
        <Collapse in={expandedSections[section.key]}>
          <Box>
            {section.subsections.map((subsection, index) => (
              <SubsectionRenderer key={index} subsection={subsection} />
            ))}
          </Box>
        </Collapse>
      );
    } else {
      // For sections with direct fields
      return (
        <Collapse in={expandedSections[section.key]}>
          <Box>
            {section.fields.map((field, index) => (
              <FieldRenderer key={field.id || index} field={field} />
            ))}
          </Box>
        </Collapse>
      );
    }
  };

  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Diagnostic Opinion
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Detailed diagnostic opinions and clinical assessments
        </Typography>
      </Box>
      <DiagnosticNavbar />

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%', position: 'relative' }}>
        {/* Timeline Visualization */}
        <Box sx={{ position: 'absolute', left: '32px', top: '32px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>May 18, 2022</Typography>
            <Box sx={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#5b84c1' }} />
          </Box>
        </Box>

        {/* Legend Header */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, mt: 6 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 'bold', mr: 1 }}>Risk Assessment</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px', color: '#666' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#a3e635' }} /> Low
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px', color: '#666' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#fbbf24' }} /> Moderate
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px', color: '#666' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f87171' }} /> High
            </Box>
          </Box>
        </Box>

        {/* Form Content */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '900px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: '13px', color: '#333' }}>Teeth color</Typography>
            <TextField
              value={teethColor}
              onChange={(e) => setTeethColor(e.target.value)}
              variant="standard"
              sx={{
                width: '300px',
                '& .MuiInputBase-input': {
                  fontSize: '12px',
                  color: '#333',
                  p: '2px 0',
                },
                '& .MuiUnderlinedInput-root': {
                  '&::before': {
                    borderBottom: '1px solid #9ca3af',
                  },
                  '&:hover:not(.Mui-disabled, .Mui-error)::before': {
                    borderBottom: '1px solid #6b7280',
                  },
                  '&.Mui-focused::after': {
                    borderBottom: '2px solid #5b84c1',
                  },
                },
              }}
            />
          </Box>

          {/* Dynamic Section Rendering */}
          {sectionGroups.map((section, index) => (
            <Box key={section.key}>
              <SectionHeader title={section.title} section={section.key} />
              <SectionRenderer section={section} />
            </Box>
          ))}

          {/* Other section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Typography sx={{ fontSize: '13px', color: '#333' }}>Other:</Typography>
          </Box>
          <TextField
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Enter additional notes"
            sx={{
              width: 220,
              mt: 0.5,
              '& .MuiInputBase-input': {
                fontSize: '13px',
                color: '#333',
                p: '8px 0',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
                borderBottom: '1px solid #9ca3af',
                borderRadius: 0,
              },
            }}
          />
        </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DentofacialPage;