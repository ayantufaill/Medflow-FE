import React, { useState } from 'react';
import { Box, Typography, Divider, Checkbox, FormControlLabel } from '@mui/material';
import { 
  KeyboardArrowDown as KeyboardArrowDownIcon, 
  ChevronRight as ChevronRightIcon,
  Sync as SyncIcon,
  ContentCopy as CopyIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const INITIAL_CHECKLISTS = {
  'Anesthetic': [
    { name: 'Anesthetic: IA block', shortName: 'IA block', isTreatment: true, isHygiene: true, iconId: 'syringe-h' },
    { name: 'Anesthetic: Local Infiltration', shortName: 'Local infiltration', isTreatment: true, isHygiene: true, iconId: 'syringe-v' },
    { name: 'Nitrous Oxide Conscious Sedation', shortName: 'Nitrous', isTreatment: true, isHygiene: true, iconId: 'mask' },
    { name: 'Minimal Sedation Level 1 + Nitrous Oxide Conscious Sedation', shortName: 'Nitrous', isTreatment: true, isHygiene: true, iconId: 'mask' },
  ],
  'Endodontics': [
    { name: 'Direct Pulp Capping', shortName: 'Direct pulp cap', isTreatment: true, isHygiene: false, iconId: 'tooth-pulp' },
    { name: 'Internal Bleaching', shortName: 'Internal Bleaching', isTreatment: true, isHygiene: false, iconId: 'tooth-fill' },
    { name: 'Managing Access Openings for Endodontically Treated Teeth', shortName: 'Endo Access', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
  ],
  'Restorative': [
    { name: 'Direct Restoration Bonding Protocol', shortName: 'Bonding', isTreatment: true, isHygiene: true, iconId: 'bonding' },
    { name: 'Direct Provisional Restorations (PMMA) with Custom Shell', shortName: 'Provisional PMMA', isTreatment: true, isHygiene: false, iconId: 'bridge' },
    { name: 'Foundation Restoration - Direct Post & Composite Core', shortName: 'Direct P&C', isTreatment: true, isHygiene: false, iconId: 'post' },
    { name: 'Foundation Restoration - Indirect Post & Core-prep', shortName: 'Indirect P&C prep', isTreatment: true, isHygiene: false, iconId: 'post' },
    { name: 'Foundation Restorations - Indirect Post & Core-cementation', shortName: 'Indirect P&C cementation', isTreatment: true, isHygiene: false, iconId: 'post' },
    { name: 'Intracrevicular Tooth Preparation', shortName: 'Intracrevicular Tooth Prep', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Tissue Management Technique', shortName: 'Tissue management', isTreatment: true, isHygiene: true, iconId: 'instrument' },
    { name: 'Tooth Preparation Cleansing - Particle Abrasion', shortName: 'Particle Abrasion', isTreatment: true, isHygiene: false, iconId: 'spray' },
    { name: 'Simplified Crown & Bridge Final Impression Synopsis', shortName: 'Crown Impression', isTreatment: true, isHygiene: false, iconId: 'tray' },
    { name: 'Class 2 composite', shortName: 'Class2', isTreatment: true, isHygiene: false, iconId: 'tooth-fill' },
    { name: 'Occlusal/Incisal/Cervical Composite', shortName: 'O Comp', isTreatment: true, isHygiene: false, iconId: 'tooth-fill' },
    { name: 'Crown/onlay Prep', shortName: 'Crown', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'KOR Whitening In-office MAX', shortName: 'KOR', isTreatment: true, isHygiene: true, iconId: 'bonding' },
  ],
  'Restorative Cohesive': [
    { name: 'Cohesively Retained (Full Coverage) Tooth Preparation', shortName: 'Crown Prep', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Cohesively Retained Cementation', shortName: 'Crown Cementation', isTreatment: true, isHygiene: false, iconId: 'post' },
    { name: 'Cohesively Retained Cementation Zirconia', shortName: 'Crown Cementation Zirconia', isTreatment: true, isHygiene: false, iconId: 'post' },
  ],
  'Restorative Adhesive': [
    { name: 'Anterior Adhesively Retained (Veneer) Cementation', shortName: 'Veneer Cementation', isTreatment: true, isHygiene: false, iconId: 'post' },
    { name: 'Posterior Adhesively Retained Cementation (Onlay)', shortName: 'Onlay Cementation', isTreatment: true, isHygiene: false, iconId: 'post' },
    { name: 'Anterior Adhesively Retained (Veneer) Tooth Preparation', shortName: 'Veneer Prep', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
  ],
  'Preventative': [
    { name: 'Fluoride Application', shortName: 'Fluoride', isTreatment: true, isHygiene: true, iconId: 'bonding' },
    { name: 'Enamel White Spot Lesions / Resin Infiltration', shortName: 'White Spot Lesion', isTreatment: true, isHygiene: true, iconId: 'bonding' },
    { name: 'Sealant Placement-Ultraseal', shortName: 'Sealant', isTreatment: true, isHygiene: true, iconId: 'bonding' },
    { name: 'Interim Caries Arresting Medicament Application', shortName: 'Curadont', isTreatment: true, isHygiene: true, iconId: 'bonding' },
  ],
  'Hygiene': [
    { name: 'Full Mouth Debridement-', shortName: 'FMD', isTreatment: true, isHygiene: true, iconId: 'spray' },
    { name: 'Laser Lesion Treatment', shortName: 'Laser Lesion Treatment', isTreatment: true, isHygiene: true, iconId: 'spray' },
    { name: 'Scaling and Root Planing (SRP) (1-3 teeth) (4+ teeth) UR, LR, UL, LL QUADS, with LBR.', shortName: 'SRP', isTreatment: true, isHygiene: true, iconId: 'spray' },
    { name: 'UR, LR, UL, LL QUADS.', shortName: 'LBR', isTreatment: true, isHygiene: true, iconId: 'spray' },
    { name: 'Patient presents for Periodontal Maintenance Prophy via Guided Biofilm Therapy, Periodic Exam, 4BWX + PAs, IOC, iTero, FLV.', shortName: 'PerioMaint', isTreatment: true, isHygiene: true, iconId: 'spray' },
    { name: 'Patient presents for NP COMPREHENSIVE EXAM, Adult Prophy via Guided Biofilm Therapy, FMX, IOC, iTero, FLV.', shortName: 'NP COMP', isTreatment: true, isHygiene: true, iconId: 'spray' },
    { name: 'Patient presents for Adult Prophy via Guided Biofilm Therapy Periodic Exam, 4BWX + PAs, IOC, iTero, FLV.', shortName: 'AdPX', isTreatment: true, isHygiene: true, iconId: 'spray' },
    { name: 'Patient presents for 4346 Scaling in Presence of Gingivitis prophy via Guided Biofilm Therapy with LBR.', shortName: '4346 SclGing', isTreatment: true, isHygiene: true, iconId: 'spray' },
    { name: 'Patient presents for Periodontal Re-Evaluation Decontamination 4-8', shortName: 'PerioRe-Eval', isTreatment: true, isHygiene: true, iconId: 'spray' },
  ],
  'Diagnostic': [
    { name: 'Diagnostic Impression', shortName: 'Diagnostic Impression', isTreatment: true, isHygiene: false, iconId: 'tray' },
  ],
  'Occlusion': [
    { name: 'Delivering the Deprogrammer', shortName: 'Dep del', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Kois Deprogrammer Deliberate Equilibration', shortName: 'Equilibration', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Kois Deprogrammer Deliberate Equilibration - Chewing', shortName: 'Equilibration-Chewing', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Kois Maxillary Occlusal Splint Insertion', shortName: 'Splint', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Occlusal Adjustment and Polishing (Lithium Disilicate)', shortName: 'Occlusal Adjustment Emax', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Occlusal Adjustment and Polishing (Zirconia)', shortName: 'Occlusal Adjustment Zir', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Botox', shortName: 'Botox', isTreatment: true, isHygiene: false, iconId: 'instrument' },
  ],
  'Prosthodontics': [
    { name: 'Implant Fixture-Level Impressioning', shortName: 'Implant Impression', isTreatment: true, isHygiene: false, iconId: 'tray' },
    { name: 'Pontic Site Development - Ridge Modification- Pre-impression', shortName: 'Pontic site pre-imp', isTreatment: true, isHygiene: false, iconId: 'tray' },
    { name: 'Pontic Site Development - Ridge Modification - Post-impression', shortName: 'Pontic site post-imp', isTreatment: true, isHygiene: false, iconId: 'tray' },
    { name: 'Precementation - Emax', shortName: 'Emax', isTreatment: true, isHygiene: false, iconId: 'post' },
    { name: 'Reline - Maxillary CD', shortName: 'Reline', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
  ],
  'Periodontics': [
    { name: 'Esthetic Crown Lengthening', shortName: 'Esthetic Crown Lengthening', isTreatment: true, isHygiene: false, iconId: 'instrument' },
    { name: 'Trans-Sulcular Crown Lengthening', shortName: 'Crown Length Trans-sulcular', isTreatment: true, isHygiene: false, iconId: 'instrument' },
    { name: 'External Bevel Gingivectomy', shortName: 'External Bevel Gingivectomy', isTreatment: true, isHygiene: false, iconId: 'instrument' },
    { name: 'Restylane', shortName: 'Restylane', isTreatment: true, isHygiene: false, iconId: 'instrument' },
    { name: 'Sounding to Osseous Crest / Trans-Sulcular Probing (TSP)', shortName: 'TSP', isTreatment: true, isHygiene: false, iconId: 'instrument' },
  ],
  'Oral Surgery': [
    { name: 'Extraction Site Management: Non Augmented Sites', shortName: 'Non Augmented Sites', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Extraction Site Management: Augmented Sites', shortName: 'Augmented Sites', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Extraction Site Management: Augmented Sites - Ovate Pontic (Tissue Supported)', shortName: 'Augmented Sites - Ovate Pontic', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Extraction Site Management: Augmented Sites - Tissue Replacement (Tissue not Supported)', shortName: 'Augmented Sites-Tissue Replacement', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Graft Augmentation', shortName: 'Graft Augmentation', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Surgical EXT', shortName: 'EXT', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
  ],
  'Orthodontic': [
    { name: 'Extrusion: Vertical Root Movement', shortName: 'Extrusion', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Interproximal reduction for clear aligner therapy', shortName: 'IPR', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Periodic Ortho Visit', shortName: 'Ortho', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Debond', shortName: 'Debond', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Occlusal pathology discussion', shortName: 'Inv talk', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Invisalign Bond Attachments', shortName: 'Bond', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
    { name: 'Removal fixed orthodontic wire', shortName: 'Wire removal', isTreatment: true, isHygiene: false, iconId: 'tooth-prep' },
  ],
};

const ChecklistIcon = ({ iconId }) => {
  const color = '#1a3a6b';
  
  const icons = {
    'syringe-h': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 7l4 4-4 4" />
        <path d="M10 11h12" />
        <rect x="2" y="8" width="8" height="6" rx="1" />
        <path d="M2 11h-1" />
      </svg>
    ),
    'syringe-v': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 10v12" />
        <path d="M7 18l4 4 4-4" />
        <rect x="8" y="2" width="6" height="8" rx="1" />
      </svg>
    ),
    'mask': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10c0-2 2-4 8-4s8 2 8 4-2 6-8 6-8-4-8-6z" />
        <path d="M4 10s-2 0-2 2v2" />
        <path d="M20 10s2 0 2 2v2" />
      </svg>
    ),
    'tooth-pulp': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M12 8c-1 0-2 1-2 2v4c0 1 1 2 2 2s2-1 2-2v-4c0-1-1-2-2-2z" fill="#f56565" stroke="none" />
      </svg>
    ),
    'tooth-fill': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <rect x="9" y="8" width="6" height="4" fill={color} opacity="0.3" stroke="none" />
      </svg>
    ),
    'tooth-prep': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 8c0-2 1-3 2-3h6c1 0 2 1 2 3v11H7V8z" />
        <path d="M7 14h10" />
      </svg>
    ),
    'bonding': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="8" height="12" rx="1" />
        <path d="M10 8V4h4v4" />
        <path d="M8 12h8" />
      </svg>
    ),
    'bridge': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10h16v6H4z" />
        <path d="M8 10V6" />
        <path d="M16 10V6" />
      </svg>
    ),
    'post': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M12 4v16" strokeWidth="2.5" />
      </svg>
    ),
    'instrument': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20L20 4" />
        <path d="M18 4l2 2" />
        <circle cx="6" cy="18" r="2" fill="#f56565" stroke="none" />
      </svg>
    ),
    'spray': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h8" />
        <path d="M14 10l2-2" />
        <path d="M14 14l2 2" />
        <path d="M4 10v4" />
      </svg>
    ),
    'tray': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6c0 10 4 14 8 14s8-4 8-14" />
        <path d="M12 20v-4" />
      </svg>
    ),
  };

  return (
    <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icons[iconId] || icons['tooth-pulp']}
    </Box>
  );
};

const ChecklistsManagement = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState(['Anesthetic', 'Endodontics', 'Restorative']);

  const toggleCategory = (name) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const renderChecklistItem = (item, idx) => (
    <Box key={idx} sx={{ pl: 4, pr: 1, py: 1, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <ChevronRightIcon sx={{ color: '#ccc', fontSize: '1.1rem' }} />
        <ChecklistIcon iconId={item.iconId} />
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500, flex: 1, ml: 1 }}>
          {item.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 160 }}>
          <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>Short Name:</Typography>
          <Typography sx={{ color: '#333', fontSize: '0.8rem', fontWeight: 500 }}>{item.shortName}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 380 }}>
          <FormControlLabel
            control={
              <Checkbox 
                size="small" 
                checked={item.isTreatment} 
                sx={{ p: 0.5, color: '#999', '&.Mui-checked': { color: '#1a3a6b' } }} 
              />
            }
            label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Treatment Checklist</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox 
                size="small" 
                checked={item.isHygiene} 
                sx={{ p: 0.5, color: '#999', '&.Mui-checked': { color: '#1a3a6b' } }} 
              />
            }
            label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Hygiene Checklist</Typography>}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CopyIcon sx={{ color: '#666', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} />
          <SettingsIcon sx={{ color: '#666', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} />
          <DeleteIcon sx={{ color: '#666', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#d32f2f' } }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          onClick={() => navigate('/admin/clinical-management')}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.85rem',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>
          Checklists
        </Typography>
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, mb: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5, 
            color: '#1a3a6b', 
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <SyncIcon sx={{ fontSize: '1.1rem' }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Sync</Typography>
        </Box>
        <Typography 
          sx={{ 
            color: '#1a3a6b', 
            fontSize: '0.85rem', 
            fontWeight: 500, 
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          + Add Checklist Category
        </Typography>
      </Box>

      {/* Categories List */}
      <Box sx={{ borderTop: '1px solid #eef1f5' }}>
        {Object.keys(INITIAL_CHECKLISTS).map((category, idx) => (
          <Box key={idx}>
            <Box 
              onClick={() => toggleCategory(category)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                py: 1.5, 
                px: 1,
                cursor: 'pointer',
                backgroundColor: expandedCategories.includes(category) ? '#fff' : 'transparent',
                '&:hover': { backgroundColor: '#f9fafb' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                {expandedCategories.includes(category) ? (
                   <KeyboardArrowDownIcon sx={{ color: '#1a3a6b', fontSize: '1.4rem' }} />
                ) : (
                   <ChevronRightIcon sx={{ color: '#1a3a6b', fontSize: '1.4rem' }} />
                )}
                <Typography sx={{ color: '#1a3a6b', fontSize: '0.9rem', fontWeight: 600 }}>
                  {category}
                </Typography>
              </Box>
            </Box>
            
            {expandedCategories.includes(category) && (
              <Box>
                {INITIAL_CHECKLISTS[category].map((item, itemIdx) => renderChecklistItem(item, itemIdx))}
                <Box sx={{ pl: 5, py: 2 }}>
                  <Typography 
                    sx={{ 
                      color: '#1a3a6b', 
                      fontSize: '0.85rem', 
                      fontWeight: 500, 
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    + Add Checklist
                  </Typography>
                </Box>
              </Box>
            )}
            <Divider sx={{ borderColor: '#eef1f5' }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChecklistsManagement;
