import React, { useState } from 'react';
import { Box, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fontSize, fontWeight } from '../../constants/styles';
import {
  EndoToothIcon, RestorationToothIcon, DentureIcon, ImplantIcon, ScalpelIcon, HemostatIcon, BracesIcon
} from '../../components/clinical/ToothIcons';
import {
  OrthoProcedure, OrthoSubHeader, HighlightedOrthoSubHeader, OrthoCodeItem, OrthoSectionHeader
} from '../../components/clinical/OrthoComponents';
import { RESTORATIVE_CODES_INFO } from '../../constants/clinicalConstants';

// --- Styled Components for Clinical Badges ---
export const ActionBadge = ({ label, color, textColor = "black" }) => (
  <Box sx={{ 
    bgcolor: color, color: textColor, px: 0.6, py: 0.2, 
    fontSize: fontSize.xs, fontWeight: fontWeight.medium, borderRadius: '3px',
    border: '1px solid rgba(0,0,0,0.1)', minWidth: '32px', textAlign: 'center'
  }}>
    {label}
  </Box>
);

export const SidebarSection = ({ title, children, expanded: defaultExpanded = false, icons = [], titleSx = {} }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Accordion 
      expanded={isExpanded} 
      onChange={(e, expanded) => setIsExpanded(expanded)}
      disableGutters 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid #b4bedb',
        '&:before': { display: 'none' } 
      }}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: '#333' }} />} 
        sx={{ minHeight: 40, px: 1.5, '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
      >
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#4a69bd', ...titleSx }}>
          {title}
        </Typography>
        {isExpanded && (
          <Stack direction="row" spacing={0.5} sx={{ mr: 1, alignItems: 'center' }}>
            {icons}
          </Stack>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

// --- Reusable Sidebar Item ---
export const SidebarItem = ({ label }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.3, cursor: 'pointer' }}>
    <Typography sx={{ fontSize: fontSize.sm }}>{label}</Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#999' }} />
  </Stack>
);

// --- Sub-menu Item Component ---
export const SidebarSubItem = ({ label }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.4, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}>
    <Typography sx={{ fontSize: fontSize.sm, color: '#333' }}>{label}</Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#999' }} />
  </Stack>
);

export const DiagnosticItem = ({ label }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.4, cursor: 'pointer' }}>
    <Typography sx={{ fontSize: fontSize.sm }}>{label}</Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#666' }} />
  </Stack>
);

export default function TreatmentProcedureSidebar({
  activeRestorativeCode,
  onRestorativeCodeSelect
}) {
  return (
    <Box sx={{ width: '100%', bgcolor: "#fff", p: 0, height: 'calc(100vh - 250px)', overflowY: "auto", border: "1px solid #ccc" }}>
      
      {/* Top Filter Bar */}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', p: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
        <Typography sx={{ fontSize: fontSize.xs, color: '#666', fontWeight: fontWeight.medium }}>Power Codes | Resolve</Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Stack>

      <SidebarSection 
        title="No Charge" 
        icons={[
          <Box key="1" sx={{ position: 'relative', width: 22, height: 22, borderRadius: '50%', border: '2px solid #f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}>$</Typography>
            <Box sx={{ position: 'absolute', width: '100%', height: '2px', bgcolor: '#f44336', transform: 'rotate(-45deg)' }} />
          </Box>,
          <Box key="2" sx={{ position: 'relative', width: 22, height: 22, borderRadius: '50%', border: '2px solid #ffb300', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}>$</Typography>
            <Box sx={{ position: 'absolute', width: '100%', height: '2px', bgcolor: '#ffb300', transform: 'rotate(-45deg)' }} />
          </Box>,
          <Box key="3" sx={{ position: 'relative', width: 22, height: 22 }}>
            <Box component="img" src="/white_teeth.png" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            <Box sx={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', border: '1px solid red', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>$</Typography>
              <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'red', transform: 'rotate(-45deg)' }} />
            </Box>
          </Box>,
          <Box key="4" sx={{ position: 'relative', px: 0.5, py: 0.2, bgcolor: '#ffcdd2', border: '1px solid #ef9a9a', borderRadius: '4px' }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: '#000' }}>P-OP</Typography>
            <Box sx={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: '50%', border: '1px solid red', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>$</Typography>
              <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'red', transform: 'rotate(-45deg)' }} />
            </Box>
          </Box>,
          <BracesIcon key="5" />
        ]}
      >
        <Typography sx={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
          No charge items will appear here.
        </Typography>
      </SidebarSection>
   
      {/* 1. Power Codes */}
      <SidebarSection title="Power Codes">
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
          <ActionBadge label="New" color="#40e0d0" />
          <ActionBadge label="Kid" color="#ccff00" />
          <ActionBadge label="SRP" color="#9370db" />
          <ActionBadge label="Gin" color="#f08080" />
          <ActionBadge label="DEP" color="#90ee90" />
          <ActionBadge label="CBC" color="#f5f5f5" />
        </Stack>
      </SidebarSection>

      {/* 2. Diagnostic (Expanded with Yellow Highlights) */}
      <SidebarSection title="Diagnostic" expanded>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
          <ActionBadge label="Scr" color="#f08080" />
          <ActionBadge label="FULL" color="#e6e6fa" />
          <ActionBadge label="LTD" color="#ffc0cb" />
          <ActionBadge label="RCR" color="#afeeee" />
          <ActionBadge label="Pano" color="#696969" textColor="white" />
          <ActionBadge label="FMX" color="#333" textColor="white" />
          <ActionBadge label="Xray" color="#333" textColor="white" />
          <ActionBadge label="AdX" color="#696969" textColor="white" />
          <ActionBadge label="SCN" color="#40e0d0" />
          <ActionBadge label="Con" color="#afeeee" />
          <ActionBadge label="Vir" color="#00ced1" />
        </Stack>

        <Box sx={{ mt: 1 }}>
          <DiagnosticItem label="Oral evaluation" />
          <DiagnosticItem label="Diagnostic imaging" />
          <DiagnosticItem label="Additional imaging" />
          <DiagnosticItem label="CBCT" />
          <DiagnosticItem label="Diagnostic Tests" />
          <DiagnosticItem label="Oral pathology" />
          <DiagnosticItem label="Tests" />
          <DiagnosticItem label="Caries assessment" />
          <DiagnosticItem label="$$" />
          <DiagnosticItem label="Diagnostic Mock-Up" />
          <DiagnosticItem label="redo prev tx" />
          <DiagnosticItem label="Diagnostic" />
        </Box>
      </SidebarSection>

      {/* 3. Preventative */}
      <SidebarSection 
        title="Preventative" 
        expanded 
        icons={[
          <Box key="1" sx={{ bgcolor: '#008080', color: 'white', px: 0.5, py: 0.2, fontSize: fontSize.xs, fontWeight: fontWeight.bold, borderRadius: '3px' }}>PRV</Box>
        ]}
      >
        <SidebarItem label="Prophy" />
        <SidebarItem label="Fluoride" />
        <SidebarItem label="Preventative services" />
        <SidebarItem label="Space maintenance" />
        <SidebarItem label="vaccine administration" />
      </SidebarSection>

      {/* 4. Restorative */}
      <SidebarSection 
        title="Restorative" 
        expanded
        icons={[
          <Box key="d23" sx={{ bgcolor: '#0020dd', color: '#fff', px: 0.8, py: 0.2, fontSize: '0.65rem', fontWeight: 'bold', borderRadius: '2px', mr: 0.5 }}>D23</Box>
        ]}
      >
        {/* Top row of design icons */}
        <Box sx={{ py: 1, borderBottom: '1px solid #f0f0f0', mb: 1 }}>
          <Stack direction="row" spacing={0.6} sx={{ mb: 0.6, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ bgcolor: '#0020dd', color: 'white', px: 0.6, py: 0.2, fontSize: '10px', fontWeight: 'bold', borderRadius: '2px', display: 'flex', alignItems: 'center', height: 22 }}>D23</Box>
            <RestorationToothIcon fill="#fff" />
            <RestorationToothIcon fill="#777" />
            <RestorationToothIcon fill="#ffd700" />
            <RestorationToothIcon fill="#eee" />
            <RestorationToothIcon fill="#fff" />
            <RestorationToothIcon fill="#ffd700" />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #777', borderRadius: '2px', px: 0.3, py: 0.1, fontSize: '8px', fontWeight: 'bold', height: 22, bgcolor: '#fff' }}>CAD</Box>
          </Stack>
          <Stack direction="row" spacing={0.6} sx={{ pl: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            <RestorationToothIcon type="incisor" fill="#fff" />
            <RestorationToothIcon fill="#fff" />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #777', borderRadius: '2px', px: 0.3, py: 0.1, fontSize: '8px', fontWeight: 'bold', height: 22, bgcolor: '#fff' }}>CAD</Box>
            <RestorationToothIcon fill="#ddd" />
            <RestorationToothIcon status="occlusal" fill="#add8e6" />
            <Box sx={{ width: 28, height: 28, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M6 4C4 4 3 6 3 9C3 13 5 20 8 20C10 20 11 18 12 18C13 18 14 20 16 20C19 20 21 13 21 9C21 6 20 4 18 4H6Z" fill="#fff" stroke="#555" strokeWidth="1"/>
                <line x1="12" y1="2" x2="12" y2="10" stroke="#777" strokeWidth="2" />
                <line x1="10" y1="10" x2="14" y2="10" stroke="#777" strokeWidth="1" />
              </svg>
            </Box>
          </Stack>
        </Box>

        {/* Direct Accordion */}
        <Accordion defaultExpanded disableGutters elevation={0} sx={{ border: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
            sx={{ 
              minHeight: 28, 
              py: 0, 
              px: 0,
              '& .MuiAccordionSummary-content': { my: 0, alignItems: 'center' } 
            }}
          >
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#333' }}>
              Direct
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pt: 0.5 }}>
            <Stack spacing={0.3}>
              {Object.entries(RESTORATIVE_CODES_INFO).map(([code, info]) => {
                const isSel = activeRestorativeCode === code;
                return (
                  <Box
                    key={code}
                    onClick={() => onRestorativeCodeSelect(code)}
                    sx={{
                      py: 0.4,
                      px: 1,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: isSel ? '#0020dd' : 'transparent',
                      color: isSel ? '#fff' : '#333',
                      transition: 'all 0.15s',
                      '&:hover': {
                        bgcolor: isSel ? '#0020dd' : '#f0f4f9',
                        color: isSel ? '#fff' : '#0020dd'
                      }
                    }}
                  >
                    <strong>{code}:</strong> &nbsp; {info.name}
                  </Box>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <SidebarItem label="Indirect Adhesive" />
        <SidebarItem label="Indirect" />
        <SidebarItem label="Indirect Cohesive" />
        <SidebarItem label="Recement/Repair" />
        <SidebarItem label="Pediatric" />
        <SidebarItem label="Additional restorative" />
        <SidebarItem label="BU/P&C" />
        <SidebarItem label="Restorative" />
        <SidebarItem label="Per arch" />
        <SidebarItem label="Clip - stationary" />
      </SidebarSection>

      {/* 5. Endodontics */}
      <SidebarSection 
        title="Endodontics" 
        expanded 
        icons={[
          <EndoToothIcon key="1" filled />,
          <EndoToothIcon key="2" />
        ]}
      >
        <SidebarSubItem label="Pulp capping" />
        <SidebarSubItem label="Pulpotomy" />
        <SidebarSubItem label="Root Canal" />
        <SidebarSubItem label="Apexification/recalcification" />
        <SidebarSubItem label="Pulpal Regeneration" />
        <SidebarSubItem label="Apicoectomy/Periradicular" />
        <SidebarSubItem label="Additional endo" />
        <SidebarSubItem label="Apicoectomy/Periradicular Services" />
      </SidebarSection>

      {/* 6. Periodontics */}
      <SidebarSection 
        title="Periodontics" 
        expanded 
        icons={[
          <Box key="1" sx={{ bgcolor: '#f08080', color: 'white', px: 0.6, py: 0.2, fontSize: fontSize.xs, fontWeight: fontWeight.bold, borderRadius: '3px' }}>LBR</Box>
        ]}
      >
        <SidebarSubItem label="Crown Exposure" />
        <SidebarSubItem label="Pocket Reduction" />
        <SidebarSubItem label="Gingival Flap Procedure" />
        <SidebarSubItem label="Periodontal Regeneration" />
        <SidebarSubItem label="Membrane Placement" />
        <SidebarSubItem label="Surgical" />
        <SidebarSubItem label="Gingival Grafting" />
        <SidebarSubItem label="Hygiene" />
        <SidebarSubItem label="Adjunctive" />
        <SidebarSubItem label="Additional perio" />
        <SidebarSubItem label="Splinting" />
      </SidebarSection>

      {/* 7. Prosthodontics, Removable */}
      <SidebarSection 
        title="Prosthodontics, Removable" 
        expanded 
        icons={[
          <DentureIcon key="1" color="#9c27b0" />,
          <DentureIcon key="2" color="#ef9a9a" />
        ]}
      >
        <SidebarSubItem label="Complete Denture" />
        <SidebarSubItem label="RPD" />
        <SidebarSubItem label="Denture adjustment" />
        <SidebarSubItem label="Denture repair" />
        <SidebarSubItem label="Denture rebase" />
        <SidebarSubItem label="Denture reline" />
        <SidebarSubItem label="Additional removable denture" />
        <SidebarSubItem label="Precision Attachment" />
        <SidebarSubItem label="CD" />
        <SidebarSubItem label="Duplication of Complete Denture" />
        <SidebarSubItem label="Maxillary Guidance Prosthesis" />
      </SidebarSection>

      {/* 8. Implant Services */}
      <SidebarSection 
        title="Implant Services" 
        expanded 
        icons={[<ImplantIcon key="1" />]}
      >
        <SidebarSubItem label="Surgical Placement" />
        <SidebarSubItem label="Re-entry/Uncovery" />
        <SidebarSubItem label="Abutment" />
        <SidebarSubItem label="Implant removable prosthetics" />
        <SidebarSubItem label="Implant-Restorative" />
        <SidebarSubItem label="Implant fixed prosthetics" />
        <SidebarSubItem label="Implant maintenance" />
        <SidebarSubItem label="Surgical services" />
        <SidebarSubItem label="Peri-implantitis Treatment" />
        <SidebarSubItem label="Bone Graft" />
      </SidebarSection>

      {/* 9. Prosthodontics, Fixed */}
      <SidebarSection 
        title="Prosthodontics, Fixed" 
        expanded 
        icons={[
          <RestorationToothIcon key="1" fill="#fff" />,
          <RestorationToothIcon key="2" fill="#ffd700" />,
          <RestorationToothIcon key="3" fill="#eee" />
        ]}
      >
        <SidebarSubItem label="Fixed Bridge" />
        <SidebarSubItem label="Inlay/Onlay FPD" />
        <SidebarSubItem label="Additional FPD" />
        <SidebarSubItem label="FPD repair" />
      </SidebarSection>

      {/* 10. Oral Surgery */}
      <SidebarSection 
        title="Oral Surgery" 
        expanded 
        icons={[
          <ScalpelIcon key="1" />,
          <HemostatIcon key="2" />
        ]}
      >
        <SidebarSubItem label="Extraction" />
        <SidebarSubItem label="Other" />
        <SidebarSubItem label="corticotomy" />
        <SidebarSubItem label="Alveoloplasty" />
        <SidebarSubItem label="Vestibuloplasty" />
        <SidebarSubItem label="Excision of soft tissue lesion" />
        <SidebarSubItem label="Bony tumor excision" />
        <SidebarSubItem label="Excision of bone tissue" />
        <SidebarSubItem label="Incision and drain" />
        <SidebarSubItem label="TMJ surgeries" />
        <SidebarSubItem label="Site Preparation" />
        <SidebarSubItem label="Frenulectomy" />
        <SidebarSubItem label="Marsupialization" />
        <SidebarSubItem label="GTR" />
      </SidebarSection>

      {/* 11. Orthodontics */}
      <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
          sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
        >
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
            Orthodontics
          </Typography>
          <Stack direction="row" spacing={0.8} sx={{ mr: 1 }}>
            <Box sx={{ 
              bgcolor: '#c8e6c9', color: '#2e7d32', px: 0.6, py: 0.2, 
              fontSize: fontSize.xs, fontWeight: fontWeight.bold, borderRadius: '3px', border: '1px solid #a5d6a7' 
            }}>
              DEP
            </Box>
            <BracesIcon />
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
          {/* Limited Ortho Section */}
          <OrthoSubHeader label="Limited ortho" expanded />
          <Stack spacing={0.5} sx={{ mb: 1 }}>
            <OrthoProcedure code="D8010" description="limited orthodontic treatment of the primary dentition" />
            <OrthoProcedure code="D8020" description="limited orthodontic treatment of the transitional dentition" />
            <OrthoProcedure code="D8030" description="limited orthodontic treatment of the adolescent dentition" />
            <OrthoProcedure code="D8040" description="limited orthodontic treatment of the adult dentition" />
          </Stack>

          {/* Interceptive Ortho Section */}
          <OrthoSubHeader label="Interceptive Ortho" expanded />
          <Stack spacing={0.5} sx={{ mb: 1 }}>
            <OrthoProcedure code="D8050" description="interceptive orthodontic treatment of the primary dentition" />
            <OrthoProcedure code="D8060" description="interceptive orthodontic treatment of the transitional dentition" />
          </Stack>

          {/* Comprehensive Ortho Section (Expanded with Yellow Highlight) */}
          <HighlightedOrthoSubHeader label="Comprehensive Ortho" isExpanded={true} />
          <Stack spacing={0.4} sx={{ mb: 1.5 }}>
            <OrthoProcedure code="D8070" description="comprehensive orthodontic treatment of the transitional dentition" />
            <OrthoProcedure code="D8080" description="comprehensive orthodontic treatment of the adolescent dentition" />
            <OrthoProcedure code="D8090" description="comprehensive orthodontic treatment of the adult dentition" />
            <OrthoProcedure code="D8091" description="Comprehensive orthodontic treatment with orthognathic surgery" />
          </Stack>

          {/* Appliances Section (Expanded with Yellow Highlight) */}
          <HighlightedOrthoSubHeader label="Appliances" isExpanded={true} />
          <Stack spacing={0.4} sx={{ mb: 1.5 }}>
            <OrthoProcedure code="D8210" description="removable appliance therapy" />
            <OrthoProcedure code="D8220" description="fixed appliance therapy" />
            <OrthoProcedure code="D8680" description="orthodontic retention (removal of appliances, construction and placement of retainer(s))" />
            <OrthoProcedure code="Cd8999.1" description="Delivery of ortho appliance, typically retainer" />
          </Stack>

          {/* Other ortho (Collapsed) */}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.6 }}>
            <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.medium, color: '#333' }}>Other ortho</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#999' }} />
          </Stack>

          {/* Ortho repair (Expanded) */}
          <OrthoSectionHeader label="Ortho repair" isExpanded={true} />
          <Box sx={{ mb: 1.5 }}>
            <OrthoCodeItem code="D8695" label="removal of fixed orthodontic appliances for reasons other than completion of treatment" />
            <OrthoCodeItem code="D8696" label="repair of orthodontic appliance - maxillary" />
            <OrthoCodeItem code="D8697" label="repair of orthodontic appliance - mandibular" />
            <OrthoCodeItem code="D8698" label="re-cement or re-bond fixed retainer - maxillary" />
            <OrthoCodeItem code="D8699" label="re-cement or re-bond fixed retainer - mandibular" />
            <OrthoCodeItem code="D8701" label="repair of fixed retainer, includes reattachment - maxillary" />
            <OrthoCodeItem code="D8702" label="repair of fixed retainer, includes reattachment - mandibular" />
            <OrthoCodeItem code="D8703" label="replacement of lost or broken retainer - maxillary" />
            <OrthoCodeItem code="D8704" label="replacement of lost or broken retainer - mandibular" />
          </Box>

          {/* Delivery (Expanded) */}
          <OrthoSectionHeader label="Delivery" isExpanded={true} />
          <Box sx={{ mb: 1.5 }}>
            <OrthoCodeItem code="Cd9944.1" label="Occlusal Guard Delivery" />
          </Box>

          {/* Ortho (Expanded) */}
          <OrthoSectionHeader label="Ortho" isExpanded={true} />
          <Box>
            <OrthoCodeItem code="D8671" label="Periodic Orthodontic treatment visit associated with orthognathic surgery" />
          </Box>
        </AccordionDetails>
      </Accordion>
      
    </Box>
  );
}
