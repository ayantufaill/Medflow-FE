import React, { useState } from 'react';
import { Box, Typography, Divider, Checkbox, FormControlLabel, Snackbar, Popover, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SyncIcon from '@mui/icons-material/Sync';
import CopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const INITIAL_CHECKLISTS = {
  'Anesthetic': [
    { 
      name: 'Anesthetic: IA block', 
      shortName: 'IA block', 
      isTreatment: true, 
      isHygiene: true, 
      iconId: 'syringe-h',
      items: [
        { id: 1, text: 'Applied topical anesthetic', choices: ['TAC gel', 'Oraqix', 'Gingicaine anesthetic gel'], products: ['Benzocaine', 'Oraqix', 'Gingicaine anesthetic gel'] },
        { id: 2, text: 'IA block', choices: [], products: ['Articaine, 4% with Epinephrine 1:200,000', 'Lidocaine HCl, 2% with Epinephrine 1:100,000', 'Septocaine, 4% with Epinephrine 1:100,000'] },
        { id: 3, text: 'Carpules', choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '1/4', '1/3', '1/2', '3/4'], products: [] },
        { id: 4, text: 'Needle', choices: ['short', 'long'], products: [] },
        { id: 5, text: 'Needle gauge', choices: ['25', '27', '30'], products: [] },
        { id: 6, text: 'Used a self-aspirating injection syringe', choices: [], products: [] },
        { id: 7, text: 'Proper anesthesia achieved', choices: [], products: [] },
      ]
    },
    { 
      name: 'Anesthetic: Local Infiltration', 
      shortName: 'Local infiltration', 
      isTreatment: true, 
      isHygiene: true, 
      iconId: 'syringe-v',
      items: [
        { id: 1, text: 'Applied topical anesthetic', choices: ['TAC gel'], products: ['Benzocaine'] },
        { id: 2, text: 'Local infiltration', choices: [], products: ['Articaine, 4% with Epinephrine 1:200,000'] },
      ]
    },
    { 
      name: 'Nitrous Oxide Conscious Sedation', 
      shortName: 'Nitrous', 
      isTreatment: true, 
      isHygiene: true, 
      iconId: 'mask',
      items: [
        { id: 1, text: 'Consent forms signed by patient', choices: [], products: [] },
        { 
          id: 2, 
          text: 'The use of Nitrous Oxide / Oxygen conscious sedation was medically necessary due to:', 
          choices: [
            'a fearful, anxious or obstreperous patient',
            'mentally, physically compromised patient',
            'patient\'s gag reflex interferes with dental care',
            'unable to obtain profound local anesthetic effect',
            'uncooperative child undergoing a lengthy dental procedure'
          ], 
          products: [] 
        },
        { id: 3, text: 'Equipment inspected and found to be in satisfactory operating condition: yes', choices: [], products: [] },
        { id: 4, text: 'Pate prior to appointment:', choices: ['yes', 'no'], products: [] },
        { id: 5, text: 'Height/Weight:', choices: [], products: [] },
        { id: 6, text: 'ASA Class:', choices: ['1', '2', '3', '4'], products: [] },
        { id: 7, text: 'Mallampati Score:', choices: ['1', '2', '3', '4'], products: [] },
        { id: 8, text: 'BP Start:', choices: [], products: [] },
        { id: 9, text: 'Start Time:', choices: [], products: [] },
        { id: 10, text: 'Nitrous Percentage', choices: ['20%', '25%', '30%', '35%', '40%', '45%', '50%'], products: [] },
      ]
    },
    { 
      name: 'Minimal Sedation Level 1 + Nitrous Oxide Conscious Sedation', 
      shortName: 'Nitrous', 
      isTreatment: true, 
      isHygiene: true, 
      iconId: 'mask',
      items: []
    },
  ],
  'Endodontics': [
    { 
      name: 'Direct Pulp Capping', 
      shortName: 'Direct pulp cap', 
      isTreatment: true, 
      isHygiene: false, 
      iconId: 'tooth-pulp',
      items: [
        { id: 1, text: 'Tooth presenting', choices: ['asymptomatic', 'with reversible pulpitis'], products: [] },
        { id: 2, text: 'Cavity preparation with copious irrigation and exposed pulp.', choices: [], products: [] },
        { id: 3, text: 'Irrigated with 5 - 6% sodium hypochlorite to achieve hemostasis.', choices: [], products: [] },
        { id: 4, text: 'Mixed MTA to a paste-like consistency with', choices: ['sterile saline', 'anesthetic'], products: [] },
        { id: 5, text: 'Applied MTA directly to exposure', choices: [], products: [] },
        { id: 6, text: 'Condensed with cotton pellet, thickness of MTA approximately 2 mm, and air dried lightly.', choices: [], products: [] },
        { id: 7, text: 'Applied self-adhesive resin liner to seal MTA and cover all the dentin.', choices: [], products: [] },
        { id: 8, text: 'Removed any resin liner from the enamel using particle abrasion with 27 micron aluminum oxide at 40 PSI', choices: [], products: [] },
        { id: 9, text: 'Completed definitive restoration', choices: [], products: [] },
        { id: 10, text: 'Selective etch (enamel only), agitated with 30-40% phosphoric acid for 15 seconds, rinsed for 5 seconds, blot dried for 2 seconds.', choices: [], products: [] },
        { id: 11, text: 'Applied 2-3 layers of adhesive bonding agent', choices: [], products: [] },
        { id: 12, text: 'Agitated adhesive bonding agent with dry microbrush, thinned out layers, checked for glossy surface, light cured for 10 seconds.', choices: [], products: [] },
        { id: 13, text: 'Placed composite resin.', choices: [], products: [] },
        { id: 14, text: 'Shade', choices: ['translucent', 'B0.5', 'Bleach', 'B1', 'A1', 'A2', 'A3'], products: [] },
        { id: 15, text: 'Light cured, finished and polished', choices: [], products: [] },
      ]
    },
    { 
      name: 'Internal Bleaching', 
      shortName: 'Internal Bleaching', 
      isTreatment: true, 
      isHygiene: false, 
      iconId: 'tooth-fill', 
      items: [
        { id: 1, text: 'Removed gutta-percha 1-2 mm below the CEJ.', choices: [], products: [] },
        { id: 2, text: 'Ensured there is no remaining tissue in the pulp horns.', choices: [], products: [] },
        { id: 3, text: 'Used particle abrasion with 27 micron aluminum oxide at 40 PSI to clean the pulp chamber.', choices: [], products: [] },
        { id: 4, text: 'Applied self-adhesive resin liner, around 2 mm over the gutta percha.', choices: [], products: [] },
        { id: 5, text: 'Mixed sodium perborate and sterile saline to a wet sand consistency.', choices: [], products: [] },
        { id: 6, text: 'Placed in pulp chamber and covered with a layer of Cavit as a temporary cover material.', choices: [], products: [] },
        { id: 7, text: 'Instructed patient will reapply once a week until desired shade is achieved.', choices: [], products: [] },
      ] 
    },
    { 
      name: 'Managing Access Openings for Endodontically Treated Teeth', 
      shortName: 'Endo Access', 
      isTreatment: true, 
      isHygiene: false, 
      iconId: 'tooth-prep', 
      items: [
        { id: 1, text: 'Selected appropriate burs depending on the crown material.', choices: ['KS1 and 330 for PFM', 'Zir-CUT for all-ceramic and zirconia'], products: [] },
        { id: 2, text: 'Created a tapered access opening or shelf to develop a vertical stop for the composite restoration. To reduce porcelain fracture, used water and limited pressure with the bur.', choices: [], products: [] },
        { id: 3, text: 'Micro-abraded the porcelain and dentin with 27 micron aluminum oxide at 40 PSI, rinsed.', choices: [], products: [] },
        { id: 4, text: 'Flowed RelyX Unicem 2 to create cervical seal, then remove from walls.', choices: [], products: [] },
        { id: 5, text: 'Etched the surface of the porcelain with phosphoric acid, using a microbrush, to clean the surface.', choices: [], products: [] },
        { id: 6, text: 'Applied silane to the porcelain and air dried with low pressure air (A-dec Warm Air Tooth Dryer).', choices: [], products: [] },
        { id: 7, text: 'Applied bonding agent and followed the Universal Bonding Protocol.', choices: [], products: [] },
        { id: 8, text: 'Used opaque composite and cured in multiple layers.', choices: [], products: [] },
      ] 
    },
  ],
  'Restorative': [
    { 
      name: 'Direct Restoration Bonding Protocol', 
      shortName: 'Bonding', 
      isTreatment: true, 
      isHygiene: true, 
      iconId: 'bonding', 
      items: [
        { id: 1, text: 'Cleaned tooth surface mechanically.', choices: ['with particle abrasion'], products: [] },
        { id: 2, text: 'Applied self-adhesive resin liner (RelyX Unicem 2) (no more than 1 mm thickness) on exposed dentin. Waited 5-10 seconds, then light cured for 10 seconds. Removed excess resin liner from axial walls and enamel. Beveled enamel margins.', choices: [], products: [] },
        { id: 3, text: 'Selective etch (enamel only): agitated with 30-40% phosphoric acid for 15 seconds, rinsed for 5 seconds, blot dried for 2 seconds.', choices: [], products: [] },
        { id: 4, text: 'Applied 2-3 layers of adhesive bonding agent.', choices: [], products: [] },
        { id: 5, text: 'Agitated adhesive bonding agent with dry microbrush, thinned out layers, checked for glossy surface, light cured for 10 seconds.', choices: [], products: [] },
        { id: 6, text: 'Placed composite resin.', choices: [], products: [] },
        { id: 7, text: 'Shade', choices: ['translucent', 'B0.5', 'Bleach', 'B1', 'A1', 'A2', 'A3'], products: [] },
        { id: 8, text: 'Light cured, finished and polished', choices: [], products: [] },
      ] 
    },
    { 
      name: 'Direct Provisional Restorations (PMMA) with Custom Shell', 
      shortName: 'Provisional PMMA', 
      isTreatment: true, 
      isHygiene: false, 
      iconId: 'bridge', 
      items: [
        { id: 1, text: 'Tried-in custom shell matrix and oriented the incisal edge position relative to the face.', choices: [], products: [] },
        { id: 2, text: 'Lubricated teeth with KY Jelly.', choices: [], products: [] },
        { id: 3, text: 'Wetted shell with monomer, then load with acrylic.', choices: [], products: [] },
        { id: 4, text: 'Dipped in water bath to hasten the dough phase.', choices: [], products: [] },
        { id: 5, text: 'Inject tooth preparations like injecting impression material, seat the loaded shell and waited for dull appearance.', choices: [], products: [] },
        { id: 6, text: 'Applied water spray using a syringe to reduce the heat.', choices: [], products: [] },
        { id: 7, text: 'Moved the shell on/off to eliminate PMMA shrinkage.', choices: [], products: [] },
      ] 
    },
    { name: 'Foundation Restoration - Direct Post & Composite Core', shortName: 'Direct P&C', isTreatment: true, isHygiene: false, iconId: 'post', items: [] },
    { name: 'Foundation Restoration - Indirect Post & Core-prep', shortName: 'Indirect P&C prep', isTreatment: true, isHygiene: false, iconId: 'post', items: [] },
    { name: 'Foundation Restorations - Indirect Post & Core-cementation', shortName: 'Indirect P&C cementation', isTreatment: true, isHygiene: false, iconId: 'post', items: [] },
    { name: 'Intracrevicular Tooth Preparation', shortName: 'Intracrevicular Tooth Prep', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Tissue Management Technique', shortName: 'Tissue management', isTreatment: true, isHygiene: true, iconId: 'instrument', items: [] },
    { name: 'Tooth Preparation Cleansing - Particle Abrasion', shortName: 'Particle Abrasion', isTreatment: true, isHygiene: false, iconId: 'spray', items: [] },
    { name: 'Simplified Crown & Bridge Final Impression Synopsis', shortName: 'Crown Impression', isTreatment: true, isHygiene: false, iconId: 'tray', items: [] },
    { name: 'Class 2 composite', shortName: 'Class2', isTreatment: true, isHygiene: false, iconId: 'tooth-fill', items: [] },
    { name: 'Occlusal/Incisal/Cervical Composite', shortName: 'O Comp', isTreatment: true, isHygiene: false, iconId: 'tooth-fill', items: [] },
    { name: 'Crown/onlay Prep', shortName: 'Crown', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'KOR Whitening In-office MAX', shortName: 'KOR', isTreatment: true, isHygiene: true, iconId: 'bonding', items: [] },
  ],
  'Restorative Cohesive': [
    { name: 'Cohesively Retained (Full Coverage) Tooth Preparation', shortName: 'Crown Prep', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Cohesively Retained Cementation', shortName: 'Crown Cementation', isTreatment: true, isHygiene: false, iconId: 'post', items: [] },
    { name: 'Cohesively Retained Cementation Zirconia', shortName: 'Crown Cementation Zirconia', isTreatment: true, isHygiene: false, iconId: 'post', items: [] },
  ],
  'Restorative Adhesive': [
    { name: 'Anterior Adhesively Retained (Veneer) Cementation', shortName: 'Veneer Cementation', isTreatment: true, isHygiene: false, iconId: 'post', items: [] },
    { name: 'Posterior Adhesively Retained Cementation (Onlay)', shortName: 'Onlay Cementation', isTreatment: true, isHygiene: false, iconId: 'post', items: [] },
    { name: 'Anterior Adhesively Retained (Veneer) Tooth Preparation', shortName: 'Veneer Prep', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
  ],
  'Preventative': [
    { name: 'Fluoride Application', shortName: 'Fluoride', isTreatment: true, isHygiene: true, iconId: 'bonding', items: [] },
    { name: 'Enamel White Spot Lesions / Resin Infiltration', shortName: 'White Spot Lesion', isTreatment: true, isHygiene: true, iconId: 'bonding', items: [] },
    { name: 'Sealant Placement-Ultraseal', shortName: 'Sealant', isTreatment: true, isHygiene: true, iconId: 'bonding', items: [] },
    { name: 'Interim Caries Arresting Medicament Application', shortName: 'Curadont', isTreatment: true, isHygiene: true, iconId: 'bonding', items: [] },
  ],
  'Hygiene': [
    { name: 'Full Mouth Debridement-', shortName: 'FMD', isTreatment: true, isHygiene: true, iconId: 'spray', items: [] },
    { name: 'Laser Lesion Treatment', shortName: 'Laser Lesion Treatment', isTreatment: true, isHygiene: true, iconId: 'spray', items: [] },
    { name: 'Scaling and Root Planing (SRP) (1-3 teeth) (4+ teeth) UR, LR, UL, LL QUADS, with LBR.', shortName: 'SRP', isTreatment: true, isHygiene: true, iconId: 'spray', items: [] },
    { name: 'UR, LR, UL, LL QUADS.', shortName: 'LBR', isTreatment: true, isHygiene: true, iconId: 'spray', items: [] },
    { name: 'Patient presents for Periodontal Maintenance Prophy via Guided Biofilm Therapy, Periodic Exam, 4BWX + PAs, IOC, iTero, FLV.', shortName: 'PerioMaint', isTreatment: true, isHygiene: true, iconId: 'spray', items: [] },
    { name: 'Patient presents for NP COMPREHENSIVE EXAM, Adult Prophy via Guided Biofilm Therapy, FMX, IOC, iTero, FLV.', shortName: 'NP COMP', isTreatment: true, isHygiene: true, iconId: 'spray', items: [] },
    { name: 'Patient presents for Adult Prophy via Guided Biofilm Therapy Periodic Exam, 4BWX + PAs, IOC, iTero, FLV.', shortName: 'AdPX', isTreatment: true, isHygiene: true, iconId: 'spray', items: [] },
    { name: 'Patient presents for 4346 Scaling in Presence of Gingivitis prophy via Guided Biofilm Therapy with LBR.', shortName: '4346 SclGing', isTreatment: true, isHygiene: true, iconId: 'spray', items: [] },
    { name: 'Patient presents for Periodontal Re-Evaluation Decontamination 4-8', shortName: 'PerioRe-Eval', isTreatment: true, isHygiene: true, iconId: 'spray', items: [] },
  ],
  'Diagnostic': [
    { name: 'Diagnostic Impression', shortName: 'Diagnostic Impression', isTreatment: true, isHygiene: false, iconId: 'tray', items: [] },
  ],
  'Occlusion': [
    { name: 'Delivering the Deprogrammer', shortName: 'Dep del', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Kois Deprogrammer Deliberate Equilibration', shortName: 'Equilibration', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Kois Deprogrammer Deliberate Equilibration - Chewing', shortName: 'Equilibration-Chewing', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Kois Maxillary Occlusal Splint Insertion', shortName: 'Splint', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Occlusal Adjustment and Polishing (Lithium Disilicate)', shortName: 'Occlusal Adjustment Emax', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Occlusal Adjustment and Polishing (Zirconia)', shortName: 'Occlusal Adjustment Zir', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Botox', shortName: 'Botox', isTreatment: true, isHygiene: false, iconId: 'instrument', items: [] },
  ],
  'Prosthodontics': [
    { name: 'Implant Fixture-Level Impressioning', shortName: 'Implant Impression', isTreatment: true, isHygiene: false, iconId: 'tray', items: [] },
    { name: 'Pontic Site Development - Ridge Modification- Pre-impression', shortName: 'Pontic site pre-imp', isTreatment: true, isHygiene: false, iconId: 'tray', items: [] },
    { name: 'Pontic Site Development - Ridge Modification - Post-impression', shortName: 'Pontic site post-imp', isTreatment: true, isHygiene: false, iconId: 'tray', items: [] },
    { name: 'Precementation - Emax', shortName: 'Emax', isTreatment: true, isHygiene: false, iconId: 'post', items: [] },
    { name: 'Reline - Maxillary CD', shortName: 'Reline', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
  ],
  'Periodontics': [
    { name: 'Esthetic Crown Lengthening', shortName: 'Esthetic Crown Lengthening', isTreatment: true, isHygiene: false, iconId: 'instrument', items: [] },
    { name: 'Trans-Sulcular Crown Lengthening', shortName: 'Crown Length Trans-sulcular', isTreatment: true, isHygiene: false, iconId: 'instrument', items: [] },
    { name: 'External Bevel Gingivectomy', shortName: 'External Bevel Gingivectomy', isTreatment: true, isHygiene: false, iconId: 'instrument', items: [] },
    { name: 'Restylane', shortName: 'Restylane', isTreatment: true, isHygiene: false, iconId: 'instrument', items: [] },
    { name: 'Sounding to Osseous Crest / Trans-Sulcular Probing (TSP)', shortName: 'TSP', isTreatment: true, isHygiene: false, iconId: 'instrument', items: [] },
  ],
  'Oral Surgery': [
    { name: 'Extraction Site Management: Non Augmented Sites', shortName: 'Non Augmented Sites', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Extraction Site Management: Augmented Sites', shortName: 'Augmented Sites', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Extraction Site Management: Augmented Sites - Ovate Pontic (Tissue Supported)', shortName: 'Augmented Sites - Ovate Pontic', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Extraction Site Management: Augmented Sites - Tissue Replacement (Tissue not Supported)', shortName: 'Augmented Sites-Tissue Replacement', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Graft Augmentation', shortName: 'Graft Augmentation', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Surgical EXT', shortName: 'EXT', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
  ],
  'Orthodontic': [
    { name: 'Extrusion: Vertical Root Movement', shortName: 'Extrusion', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Interproximal reduction for clear aligner therapy', shortName: 'IPR', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Periodic Ortho Visit', shortName: 'Ortho', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Debond', shortName: 'Debond', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Occlusal pathology discussion', shortName: 'Inv talk', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Invisalign Bond Attachments', shortName: 'Bond', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
    { name: 'Removal fixed orthodontic wire', shortName: 'Wire removal', isTreatment: true, isHygiene: false, iconId: 'tooth-prep', items: [] },
  ],
};


const ChoiceIcon = () => (
  <Box sx={{ width: 12, height: 12, backgroundColor: '#f56565', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, mt: 0.5 }}>
    <Box sx={{ width: 6, height: 1.5, backgroundColor: 'white' }} />
  </Box>
);

const ChecklistIcon = ({ iconId, color = '#1a3a6b' }) => {
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
        <path d="M12 6h4v8h-4z" fill="#cbd5e0" stroke="none" />
      </svg>
    ),
    'tooth-prep': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M12 4v4M10 6h4" />
      </svg>
    ),
    'bonding': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    'bridge': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        <rect x="2" y="12" width="4" height="6" />
        <rect x="18" y="12" width="4" height="6" />
        <rect x="10" y="12" width="4" height="6" />
      </svg>
    ),
    'post': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M8 6h8M8 18h8" />
      </svg>
    ),
    'instrument': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4L4 20M16 4l4 4M4 16l4 4" />
      </svg>
    ),
    'spray': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 8c0-3 2-5 5-5s5 2 5 5-2 5-5 5M10 8v12M7 16h6" />
      </svg>
    ),
    'tray': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" />
        <path d="M6 10h12" />
      </svg>
    ),
    'tooth-yellow': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#FDE047" stroke="none" />
      </svg>
    ),
    'tooth-pink': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#F472B6" stroke="none" />
      </svg>
    ),
    'tooth-blue': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#60A5FA" stroke="none" />
      </svg>
    ),
    'tooth-green': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#4ADE80" stroke="none" />
      </svg>
    ),
    'tooth-purple': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 4c-1 0-2 1-2 3v10c0 2 1 3 2 3h10c1 0 2-1 2-3V7c0-2-1-3-2-3H7z" />
        <path d="M7 4c-1 0-2 1-2 3v4h14V7c0-2-1-3-2-3H7z" fill="#C084FC" stroke="none" />
      </svg>
    ),
    'instrument-blue': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
        <path d="M20 4L4 20M16 4l4 4M4 16l4 4" />
      </svg>
    ),
    'instrument-pink': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2">
        <path d="M20 4L4 20M16 4l4 4M4 16l4 4" />
      </svg>
    )
  };

  return (
    <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icons[iconId] || icons['tooth-prep']}
    </Box>
  );
};

const ChecklistsManagement = () => {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState(INITIAL_CHECKLISTS);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedChecklists, setExpandedChecklists] = useState([]);
  const [activeInput, setActiveInput] = useState(null); // { type, category, checklistIdx, itemIdx, value }
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [iconPickerAnchor, setIconPickerAnchor] = useState(null);
  const [activeIconPicker, setActiveIconPicker] = useState(null); // { category, checklistIdx }
  const [isSyncDialogOpen, setSyncDialogOpen] = useState(false);

  const handleOpenSyncDialog = (e) => {
    e.stopPropagation();
    setSyncDialogOpen(true);
  };

  const handleCloseSyncDialog = () => {
    setSyncDialogOpen(false);
  };

  const handleIconClick = (event, category, checklistIdx) => {
    setIconPickerAnchor(event.currentTarget);
    setActiveIconPicker({ category, checklistIdx });
  };

  const handleIconSelect = (iconId) => {
    if (activeIconPicker) {
      const { category, checklistIdx } = activeIconPicker;
      const updatedChecklists = { ...checklists };
      updatedChecklists[category][checklistIdx].iconId = iconId;
      setChecklists(updatedChecklists);
    }
    setIconPickerAnchor(null);
    setActiveIconPicker(null);
  };

  const toggleCategory = (name) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const toggleChecklist = (name) => {
    setExpandedChecklists(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter' && activeInput.value.trim()) {
      const { type, category, checklistIdx, itemIdx, value } = activeInput;
      const updatedChecklists = { ...checklists };
      
      if (type === 'choice') {
        updatedChecklists[category][checklistIdx].items[itemIdx].choices.push(value);
      } else if (type === 'product') {
        if (!updatedChecklists[category][checklistIdx].items[itemIdx].products) {
          updatedChecklists[category][checklistIdx].items[itemIdx].products = [];
        }
        updatedChecklists[category][checklistIdx].items[itemIdx].products.push(value);
      } else if (type === 'item') {
        updatedChecklists[category][checklistIdx].items.push({
          id: updatedChecklists[category][checklistIdx].items.length + 1,
          text: value,
          choices: [],
          products: []
        });
      } else if (type === 'checklist') {
        updatedChecklists[category].push({
          name: value,
          shortName: value,
          isTreatment: true,
          isHygiene: false,
          iconId: 'tooth-prep',
          items: []
        });
      }

      setChecklists(updatedChecklists);
      setActiveInput(null);
    } else if (e.key === 'Escape') {
      setActiveInput(null);
    }
  };

  const handleCopyItemToClipboard = (item) => {
    let textToCopy = `${item.text}`;
    if (item.choices && item.choices.length > 0) {
      textToCopy += `\nChoices: ${item.choices.join(', ')}`;
    }
    if (item.products && item.products.length > 0) {
      textToCopy += `\nProducts: ${item.products.join(', ')}`;
    }
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => setSnackbarOpen(true))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleCopyChecklistToClipboard = (item) => {
    let textToCopy = `Checklist: ${item.name}\nShort Name: ${item.shortName}`;
    if (item.items && item.items.length > 0) {
      textToCopy += '\n\nItems:';
      item.items.forEach(i => {
        textToCopy += `\n- ${i.text}`;
        if (i.choices.length > 0) textToCopy += ` (Choices: ${i.choices.join(', ')})`;
      });
    }

    navigator.clipboard.writeText(textToCopy)
      .then(() => setSnackbarOpen(true))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleDeleteItem = (category, checklistIdx, itemIdx) => {
    const updatedChecklists = { ...checklists };
    updatedChecklists[category][checklistIdx].items.splice(itemIdx, 1);
    setChecklists(updatedChecklists);
  };

  const renderItemTable = (items, category, checklistIdx) => (
    <Box sx={{ ml: 8, mr: 2, mb: 2, border: '1px solid #eef1f5', borderRadius: '4px', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', backgroundColor: '#f9fafb', py: 1, px: 2, borderBottom: '1px solid #eef1f5' }}>
        <Typography sx={{ width: 30, fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>#</Typography>
        <Typography sx={{ flex: 2, fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>Item</Typography>
        <Typography sx={{ flex: 1.5, fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>Item Choices</Typography>
        <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>Product</Typography>
        <Box sx={{ width: 100 }} />
      </Box>
      {items.map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', py: 1.5, px: 2, borderBottom: idx === items.length - 1 ? 'none' : '1px solid #f0f0f0', '&:hover': { backgroundColor: '#fcfdfe' } }}>
          <Typography sx={{ width: 30, fontSize: '0.8rem', color: '#666' }}>{item.id}-</Typography>
          <Typography sx={{ flex: 2, fontSize: '0.8rem', color: '#1a3a6b', pr: 2 }}>{item.text}</Typography>
          <Box sx={{ flex: 1.5 }}>
            {item.choices.map((choice, cIdx) => (
              <Box key={cIdx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <ChoiceIcon />
                <Typography sx={{ fontSize: '0.75rem', color: '#333' }}>{choice}</Typography>
              </Box>
            ))}
            {activeInput?.type === 'choice' && activeInput.itemIdx === idx && activeInput.checklistIdx === checklistIdx && activeInput.category === category ? (
              <Box sx={{ mt: 1 }}>
                <input
                  autoFocus
                  placeholder="Type and press Enter"
                  value={activeInput.value}
                  onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
                  onKeyDown={handleInputSubmit}
                  onBlur={() => setActiveInput(null)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    border: '1px solid #1a3a6b',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </Box>
            ) : (
              <Typography 
                onClick={() => setActiveInput({ type: 'choice', category, checklistIdx, itemIdx: idx, value: '' })}
                sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 500, cursor: 'pointer', mt: 0.5, '&:hover': { textDecoration: 'underline' } }}
              >
                +Add choice
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            {item.products && item.products.map((product, pIdx) => (
               <Typography key={pIdx} sx={{ fontSize: '0.75rem', color: '#333', mb: 0.5 }}>- {product}</Typography>
            ))}
            {activeInput?.type === 'product' && activeInput.itemIdx === idx && activeInput.checklistIdx === checklistIdx && activeInput.category === category ? (
              <Box sx={{ mt: 1 }}>
                <input
                  autoFocus
                  placeholder="Type and press Enter"
                  value={activeInput.value}
                  onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
                  onKeyDown={handleInputSubmit}
                  onBlur={() => setActiveInput(null)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    border: '1px solid #1a3a6b',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </Box>
            ) : (
              <Typography 
                onClick={() => setActiveInput({ type: 'product', category, checklistIdx, itemIdx: idx, value: '' })}
                sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 500, cursor: 'pointer', mt: 0.5, '&:hover': { textDecoration: 'underline' } }}
              >
                +Add Product
              </Typography>
            )}
          </Box>
          <Box sx={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
            <DeleteIcon 
              onClick={() => handleDeleteItem(category, checklistIdx, idx)}
              sx={{ color: '#f56565', fontSize: '1rem', cursor: 'pointer', opacity: 0.6, '&:hover': { opacity: 1 } }} 
            />
            <CopyIcon 
              onClick={() => handleCopyItemToClipboard(item)}
              sx={{ color: '#666', fontSize: '1rem', cursor: 'pointer', opacity: 0.6, '&:hover': { opacity: 1 } }} 
            />
          </Box>
        </Box>
      ))}
      <Box sx={{ py: 1.5, px: 2 }}>
        {activeInput?.type === 'item' && activeInput.checklistIdx === checklistIdx && activeInput.category === category ? (
          <Box sx={{ mb: 1 }}>
            <input
              autoFocus
              placeholder="Enter item text and press Enter"
              value={activeInput.value}
              onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
              onKeyDown={handleInputSubmit}
              onBlur={() => setActiveInput(null)}
              style={{
                width: '100%',
                padding: '6px 12px',
                fontSize: '0.8rem',
                border: '1px solid #1a3a6b',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
          </Box>
        ) : (
          <Typography 
            onClick={() => setActiveInput({ type: 'item', category, checklistIdx, value: '' })}
            sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            +Add Checklist Item
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderChecklistItem = (item, idx, category) => {
    const isExpanded = expandedChecklists.includes(item.name);
    return (
      <Box key={idx} sx={{ borderBottom: '1px solid #f0f0f0' }}>
        <Box 
          onClick={() => toggleChecklist(item.name)}
          sx={{ 
            pl: 4, 
            pr: 1, 
            py: 1, 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            backgroundColor: isExpanded ? '#f0f4f8' : 'transparent',
            '&:hover': { backgroundColor: isExpanded ? '#e6edf5' : '#f9fafb' },
            borderLeft: isExpanded ? '4px solid #1a3a6b' : '4px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
             {isExpanded ? (
                <KeyboardArrowDownIcon sx={{ color: '#1a3a6b', fontSize: '1.2rem' }} />
             ) : (
                <ChevronRightIcon sx={{ color: '#1a3a6b', fontSize: '1.2rem' }} />
             )}
             <Box 
               onClick={(e) => {
                 e.stopPropagation();
                 handleIconClick(e, category, idx);
               }}
               sx={{ 
                 cursor: 'pointer', 
                 p: 0.5, 
                 borderRadius: '4px',
                 '&:hover': { backgroundColor: '#eef1f5' } 
               }}
             >
               <ChecklistIcon iconId={item.iconId} />
             </Box>
            <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500, flex: 1, ml: 1 }}>
              {item.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 160 }}>
              <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>Short Name:</Typography>
              <Typography sx={{ color: '#333', fontSize: '0.8rem', fontWeight: 500 }}>{item.shortName}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 380 }}>
              <FormControlLabel
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} onClick={(e) => e.stopPropagation()}>
              <CopyIcon 
                onClick={() => handleCopyChecklistToClipboard(item)}
                sx={{ color: '#666', fontSize: '1.1rem', cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} 
              />
              <SettingsIcon sx={{ color: '#666', fontSize: '1.1rem', cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }} />
              <DeleteIcon 
                onClick={() => {
                  const updatedChecklists = { ...checklists };
                  updatedChecklists[category].splice(idx, 1);
                  setChecklists(updatedChecklists);
                }}
                sx={{ color: '#666', fontSize: '1.1rem', cursor: 'pointer', '&:hover': { color: '#d32f2f' } }} 
              />
            </Box>
          </Box>
        </Box>
        {isExpanded && item.items && item.items.length > 0 && renderItemTable(item.items, category, idx)}
      </Box>
    );
  };

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
          onClick={handleOpenSyncDialog}
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
        {Object.keys(checklists).map((category, idx) => (
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
                {checklists[category].map((item, itemIdx) => renderChecklistItem(item, itemIdx, category))}
                <Box sx={{ pl: 5, py: 2 }}>
                  {activeInput?.type === 'checklist' && activeInput.category === category ? (
                    <Box sx={{ mb: 1, maxWidth: 300 }}>
                      <input
                        autoFocus
                        placeholder="Enter checklist name and press Enter"
                        value={activeInput.value}
                        onChange={(e) => setActiveInput({ ...activeInput, value: e.target.value })}
                        onKeyDown={handleInputSubmit}
                        onBlur={() => setActiveInput(null)}
                        style={{
                          width: '100%',
                          padding: '6px 12px',
                          fontSize: '0.85rem',
                          border: '1px solid #1a3a6b',
                          borderRadius: '4px',
                          outline: 'none'
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography 
                      onClick={() => setActiveInput({ type: 'checklist', category, value: '' })}
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
                  )}
                </Box>
              </Box>
            )}
            <Divider sx={{ borderColor: '#eef1f5' }} />
          </Box>
        ))}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: { backgroundColor: '#1a3a6b' }
        }}
      />

      <Popover
        open={Boolean(iconPickerAnchor)}
        anchorEl={iconPickerAnchor}
        onClose={() => setIconPickerAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: { 
            p: 2, 
            width: 400, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            borderRadius: '12px',
            border: '1px solid #eef1f5'
          }
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1.5 }}>
          {[
            'syringe-h', 'syringe-v', 'mask', 'tooth-pulp', 'tooth-fill', 'tooth-prep', 
            'bonding', 'instrument', 'post', 'bridge', 'tray', 'spray',
            'tooth-yellow', 'tooth-pink', 'tooth-blue', 'tooth-green', 'tooth-purple',
            'instrument-blue', 'instrument-pink'
          ].map((iconId) => (
            <Box 
              key={iconId}
              onClick={() => handleIconSelect(iconId)}
              sx={{ 
                p: 1, 
                cursor: 'pointer', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.2s',
                '&:hover': { 
                  backgroundColor: '#f0f4f8',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <ChecklistIcon iconId={iconId} />
            </Box>
          ))}
        </Box>
      </Popover>

      {/* Sync Dialog */}
      <Dialog
        open={isSyncDialogOpen}
        onClose={handleCloseSyncDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1, overflow: 'hidden' }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#0c345d',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            py: 2,
            px: 3,
            lineHeight: 1.3,
          }}
        >
          Select the offices you would like to sync with the source office
        </DialogTitle>
        <DialogContent sx={{ mt: 3, px: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Source Office:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value="thedentalstudio"
              disabled
              sx={{
                '& .MuiInputBase-input': { backgroundColor: '#f0f0f0', fontSize: '0.85rem' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Target Offices
            </Typography>
            {/* Placeholder for Target Offices list - matching Products page */}
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, backgroundColor: '#fafafa', textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Select target offices from the list below...
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseSyncDialog}
            sx={{
              textTransform: 'none',
              backgroundColor: '#e0e0e0',
              color: '#333',
              fontSize: '0.85rem',
              px: 3,
              '&:hover': { backgroundColor: '#d0d0d0' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCloseSyncDialog}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#6b8fb9',
              color: '#fff',
              fontSize: '0.85rem',
              px: 4,
              '&:hover': { backgroundColor: '#5a7ca8' }
            }}
          >
            Sync
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChecklistsManagement;
