import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import FeeGuideDetailHeader from '../../components/admin/feeguides/FeeGuideDetailHeader';
import CategoryRow from '../../components/admin/feeguides/CategoryRow';
import RoundFeeGuideDialog from '../../components/admin/feeguides/RoundFeeGuideDialog';
import SetProviderFeeGuideDialog from '../../components/admin/feeguides/SetProviderFeeGuideDialog';
import UploadFeeGuideDialog from '../../components/admin/feeguides/UploadFeeGuideDialog';

const FeeGuideDetail = () => {
  const { id } = useParams();
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [roundDialogOpen, setRoundDialogOpen] = useState(false);
  const [setProviderOpen, setSetProviderOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const feeGuideName = "Careington PPO Platinum (directly in network)";

  const createMockProcedures = (baseCode, baseName, count = 3) => {
    return Array.from({ length: count }, (_, i) => ({
      code: `${baseCode}${i + 1}`,
      name: `${baseName} - Level ${i + 1}`,
      description: `A detailed clinical description for ${baseName} procedure code ${baseCode}${i + 1}. This includes comprehensive evaluation and necessary diagnostic steps as per standard clinical protocol.`,
      fee: `$${40 + (i * 25)}`
    }));
  };

  const categoryData = [
    {
      name: "Diagnostic",
      groups: [
        { name: "Oral evaluation", procedures: createMockProcedures("D012", "Oral Evaluation", 4) },
        { name: "Diagnostic imaging", procedures: createMockProcedures("D021", "Diagnostic Imaging", 3) },
        { name: "Additional imaging", procedures: createMockProcedures("D024", "Additional Imaging", 2) },
        { name: "CBCT", procedures: createMockProcedures("D036", "CBCT Scan", 2) },
        { name: "Diagnostic Tests", procedures: createMockProcedures("D041", "Diagnostic Test", 3) },
        { name: "Oral pathology", procedures: createMockProcedures("D047", "Oral Pathology", 2) },
        { name: "Tests", procedures: createMockProcedures("D048", "Specialized Test", 2) },
        { name: "Caries assessment", procedures: createMockProcedures("D060", "Caries Assessment", 1) },
        { name: "$$", procedures: createMockProcedures("D099", "Misc Diagnostic", 2) },
        { name: "Diagnostic Mock-Up", procedures: createMockProcedures("D050", "Mock-Up", 1) },
        { name: "redo prev tx", procedures: createMockProcedures("D051", "Redo Treatment", 1) },
        { name: "Diagnostic", procedures: createMockProcedures("D052", "General Diagnostic", 2) }
      ]
    },
    {
      name: "Preventative",
      groups: [
        { name: "Prophy", procedures: createMockProcedures("D111", "Prophylaxis", 2) },
        { name: "Fluoride", procedures: createMockProcedures("D120", "Fluoride Treatment", 2) },
        { name: "Preventative services", procedures: createMockProcedures("D131", "Preventative", 3) },
        { name: "Space maintenance", procedures: createMockProcedures("D151", "Space Maintainer", 2) },
        { name: "vaccine administration", procedures: createMockProcedures("D170", "Vaccine", 1) }
      ]
    },
    {
      name: "Restorative",
      groups: [
        { name: "Direct", procedures: createMockProcedures("D214", "Direct Restoration", 4) },
        { name: "Indirect Adhesive", procedures: createMockProcedures("D233", "Adhesive Restoration", 3) },
        { name: "Indirect", procedures: createMockProcedures("D241", "Indirect Restoration", 2) },
        { name: "Indirect Cohesive", procedures: createMockProcedures("D242", "Cohesive Restoration", 2) },
        { name: "Recement/Repair", procedures: createMockProcedures("D291", "Repair/Recement", 3) },
        { name: "Pediatric", procedures: createMockProcedures("D293", "Pediatric Crown", 2) },
        { name: "Additional restorative", procedures: createMockProcedures("D294", "Misc Restorative", 2) },
        { name: "BU/P&C", procedures: createMockProcedures("D295", "Core Buildup", 2) },
        { name: "Restorative", procedures: createMockProcedures("D296", "General Restorative", 2) },
        { name: "Per arch", procedures: createMockProcedures("D297", "Arch Restoration", 1) },
        { name: "Clip - stationary", procedures: createMockProcedures("D298", "Clip Attachment", 1) }
      ]
    },
    {
      name: "Endodontics",
      groups: [
        { name: "Pulp capping", procedures: createMockProcedures("D311", "Pulp Cap", 2) },
        { name: "Pulpotomy", procedures: createMockProcedures("D322", "Pulpotomy", 2) },
        { name: "Root Canal", procedures: createMockProcedures("D331", "Root Canal Therapy", 3) },
        { name: "Apexification/recalcification", procedures: createMockProcedures("D335", "Apexification", 2) },
        { name: "Pulpal Regeneration", procedures: createMockProcedures("D346", "Pulpal Regen", 1) },
        { name: "Apicoectomy/Periradicular", procedures: createMockProcedures("D341", "Apicoectomy", 2) },
        { name: "Additional endo", procedures: createMockProcedures("D399", "Misc Endo", 2) },
        { name: "Apicoectomy/Periradicular Services", procedures: createMockProcedures("D342", "Periradicular", 1) }
      ]
    },
    {
      name: "Periodontics",
      groups: [
        { name: "Crown Exposure", procedures: createMockProcedures("D421", "Crown Exposure", 2) },
        { name: "Pocket Reduction", procedures: createMockProcedures("D424", "Pocket Reduction", 2) },
        { name: "Gingival Flap Procedure", procedures: createMockProcedures("D424", "Gingival Flap", 2) },
        { name: "Periodontal Regeneration", procedures: createMockProcedures("D426", "Perio Regen", 2) },
        { name: "Membrane Placement", procedures: createMockProcedures("D426", "Membrane", 1) },
        { name: "Surgical", procedures: createMockProcedures("D427", "Surgical Perio", 3) },
        { name: "Gingival Grafting", procedures: createMockProcedures("D427", "Gingival Graft", 2) },
        { name: "Hygiene", procedures: createMockProcedures("D434", "Perio Hygiene", 2) },
        { name: "Adjunctive", procedures: createMockProcedures("D438", "Adjunctive Perio", 2) },
        { name: "Additional perio", procedures: createMockProcedures("D499", "Misc Perio", 2) },
        { name: "Splinting", procedures: createMockProcedures("D432", "Perio Splinting", 1) }
      ]
    },
    {
      name: "Prosthodontics, Removable",
      groups: [
        { name: "Complete Denture", procedures: createMockProcedures("D511", "Complete Denture", 2) },
        { name: "RPD", procedures: createMockProcedures("D521", "Partial Denture", 2) },
        { name: "Denture adjustment", procedures: createMockProcedures("D541", "Adjustment", 2) },
        { name: "Denture repair", procedures: createMockProcedures("D561", "Repair", 3) },
        { name: "Denture rebase", procedures: createMockProcedures("D571", "Rebase", 2) },
        { name: "Denture reline", procedures: createMockProcedures("D573", "Reline", 2) },
        { name: "Additional removable denture", procedures: createMockProcedures("D589", "Misc Removable", 2) },
        { name: "Precision Attachment", procedures: createMockProcedures("D586", "Precision Attachment", 1) },
        { name: "CD", procedures: createMockProcedures("D511", "CD Procedure", 1) },
        { name: "Duplication of Complete Denture", procedures: createMockProcedures("D587", "Denture Duplication", 1) },
        { name: "Maxillary Guidance Prosthesis", procedures: createMockProcedures("D595", "Guidance Prosthesis", 1) }
      ]
    },
    {
      name: "Maxillofacial Prosthetics",
      groups: [
        { name: "Maxillofacial prosthetics", procedures: createMockProcedures("D591", "Maxillo Prosthetic", 2) },
        { name: "maxillary guidance prosthesis", procedures: createMockProcedures("D595", "Max Guidance", 1) }
      ]
    },
    {
      name: "Implant Services",
      groups: [
        { name: "Surgical Placement", procedures: createMockProcedures("D601", "Surgical Implant", 2) },
        { name: "Re-entry/Uncovery", procedures: createMockProcedures("D601", "Re-entry", 1) },
        { name: "Abutment", procedures: createMockProcedures("D605", "Implant Abutment", 2) },
        { name: "Implant removable prosthetics", procedures: createMockProcedures("D605", "Removable Implant", 2) },
        { name: "Implant-Restorative", procedures: createMockProcedures("D605", "Implant Restorative", 3) },
        { name: "Implant fixed prosthetics", procedures: createMockProcedures("D606", "Fixed Implant", 2) },
        { name: "Implant maintenance", procedures: createMockProcedures("D608", "Implant Maintenance", 2) },
        { name: "Surgical services", procedures: createMockProcedures("D610", "Implant Surgical", 2) },
        { name: "Peri-Implantitis Treatment", procedures: createMockProcedures("D610", "Peri-Implantitis", 1) },
        { name: "Bone Graft", procedures: createMockProcedures("D610", "Implant Bone Graft", 2) },
        { name: "Implant supported Prosthetics", procedures: createMockProcedures("D611", "Supported Prosthetic", 2) },
        { name: "Implant", procedures: createMockProcedures("D619", "General Implant", 2) },
        { name: "Interim implant", procedures: createMockProcedures("D619", "Interim Implant", 1) },
        { name: "Implant scaling peri-implantitis", procedures: createMockProcedures("D610", "Implant Scaling", 1) }
      ]
    },
    {
      name: "Prosthodontics, Fixed",
      groups: [
        { name: "Fixed Bridge", procedures: createMockProcedures("D621", "Fixed Bridge", 3) },
        { name: "Inlay/Onlay FPD", procedures: createMockProcedures("D660", "FPD Inlay/Onlay", 2) },
        { name: "Additional FPD", procedures: createMockProcedures("D699", "Misc FPD", 2) },
        { name: "FPD repair", procedures: createMockProcedures("D698", "FPD Repair", 2) }
      ]
    },
    {
      name: "Oral Surgery",
      groups: [
        { name: "Extraction", procedures: createMockProcedures("D711", "Extraction", 4) },
        { name: "Other", procedures: createMockProcedures("D799", "Misc Oral Surgery", 2) },
        { name: "corticotomy", procedures: createMockProcedures("D729", "Corticotomy", 1) },
        { name: "Alveoloplasty", procedures: createMockProcedures("D731", "Alveoloplasty", 2) },
        { name: "Vestibuloplasty", procedures: createMockProcedures("D734", "Vestibuloplasty", 1) },
        { name: "Excision of soft tissue lesion", procedures: createMockProcedures("D741", "Lesion Excision", 2) },
        { name: "Bony tumor excision", procedures: createMockProcedures("D744", "Tumor Excision", 1) },
        { name: "Excision of bone tissue", procedures: createMockProcedures("D747", "Bone Excision", 1) },
        { name: "Incision and drain", procedures: createMockProcedures("D751", "I&D", 2) },
        { name: "TMJ surgeries", procedures: createMockProcedures("D784", "TMJ Surgery", 2) },
        { name: "Site Preparation", procedures: createMockProcedures("D795", "Site Prep", 1) },
        { name: "Frenulectomy", procedures: createMockProcedures("D796", "Frenulectomy", 2) },
        { name: "Marsupialization", procedures: createMockProcedures("D797", "Marsupialization", 1) },
        { name: "GTR", procedures: createMockProcedures("D795", "GTR Procedure", 1) }
      ]
    },
    {
      name: "Orthodontics",
      groups: [
        { name: "Limited ortho", procedures: createMockProcedures("D801", "Limited Ortho", 2) },
        { name: "Interceptive Ortho", procedures: createMockProcedures("D805", "Interceptive Ortho", 2) },
        { name: "Comprehensive Ortho", procedures: createMockProcedures("D807", "Comprehensive Ortho", 3) },
        { name: "Appliances", procedures: createMockProcedures("D821", "Ortho Appliance", 2) },
        { name: "Other ortho", procedures: createMockProcedures("D899", "Misc Ortho", 2) },
        { name: "Ortho repair", procedures: createMockProcedures("D869", "Ortho Repair", 2) },
        { name: "Delivery", procedures: createMockProcedures("D867", "Ortho Delivery", 1) },
        { name: "Ortho", procedures: createMockProcedures("D866", "General Ortho", 2) }
      ]
    },
    {
      name: "Adjunctive General Services",
      groups: [
        { name: "Other", procedures: createMockProcedures("D999", "Misc Adjunctive", 3) },
        { name: "Anesthesia", procedures: createMockProcedures("D921", "Anesthesia", 4) },
        { name: "Sedation", procedures: createMockProcedures("D923", "Sedation", 2) },
        { name: "conscious sedation", procedures: createMockProcedures("D924", "Conscious Sedation", 2) },
        { name: "Professional Consultation", procedures: createMockProcedures("D931", "Consultation", 1) },
        { name: "Drugs", procedures: createMockProcedures("D961", "Drug Admin", 2) },
        { name: "Hygiene", procedures: createMockProcedures("D991", "Hygiene Services", 2) },
        { name: "Occlusion", procedures: createMockProcedures("D994", "Occlusion", 2) },
        { name: "Whitening", procedures: createMockProcedures("D997", "Whitening", 1) },
        { name: "Non Clinical", procedures: createMockProcedures("D990", "Non Clinical", 2) },
        { name: "Patient Screening", procedures: createMockProcedures("D999", "Screening", 1) },
        { name: "Sleep appliance", procedures: createMockProcedures("D994", "Sleep Appliance", 1) },
        { name: "Aesthetic Appliance", procedures: createMockProcedures("D994", "Aesthetic Appliance", 1) },
        { name: "SLEEP APNEA SERVICES", procedures: createMockProcedures("D994", "Sleep Apnea", 1) },
        { name: "Neuromodulator", procedures: createMockProcedures("D999", "Neuromodulator", 1) },
        { name: "Dermal Filler", procedures: createMockProcedures("D999", "Dermal Filler", 1) },
        { name: "Photobiomodulation Therapy", procedures: createMockProcedures("D999", "Photobiomodulation", 1) }
      ]
    },
    {
      name: "Medicament carrier",
      groups: [{ name: "Periodontal", procedures: createMockProcedures("D598", "Medicament Carrier", 2) }]
    },
    {
      name: "Product",
      groups: [
        { name: "Finance charge", procedures: createMockProcedures("P100", "Finance Charge", 1) },
        { name: "Mechanical toothbrush", procedures: createMockProcedures("P101", "Mechanical toothbrush", 1) },
        { name: "Toothpaste (1.1% NaF)", procedures: createMockProcedures("P102", "Toothpaste NaF", 1) },
        { name: "Toothpaste", procedures: createMockProcedures("P103", "Toothpaste", 1) },
        { name: "Environmental Therapy (Oral rinse)", procedures: createMockProcedures("P104", "Oral rinse", 1) },
        { name: "Xerostomia management system", procedures: createMockProcedures("P105", "Xerostomia system", 1) },
        { name: "Erosion management system", procedures: createMockProcedures("P106", "Erosion system", 1) },
        { name: "Whitening", procedures: createMockProcedures("P107", "Whitening product", 1) },
        { name: "Product", procedures: createMockProcedures("P108", "Misc Product", 2) },
        { name: "RockStar Polisher", procedures: createMockProcedures("P109", "RockStar Polisher", 1) },
        { name: "TDS Membership", procedures: createMockProcedures("P110", "TDS Membership", 1) },
        { name: "Caries management system", procedures: createMockProcedures("P111", "Caries system", 1) },
        { name: "Fl- Varnish", procedures: createMockProcedures("P112", "Fl- Varnish", 1) }
      ]
    },
    {
      name: "Myofunctional Therapy",
      groups: [
        { name: "Initial Exam- MFT", procedures: createMockProcedures("M100", "Initial Exam MFT", 1) },
        { name: "Therapy Exercises", procedures: createMockProcedures("M101", "Therapy Exercises", 2) }
      ]
    },
    {
      name: "Adjunctive",
      groups: [{ name: "Missed appt", procedures: createMockProcedures("A100", "Missed appt", 1) }]
    },
    {
      name: "Prosthodontics, Resection",
      groups: [{ name: "Resection Prosthesis", procedures: createMockProcedures("D599", "Resection Prosthesis", 1) }]
    }
  ];

  const toggleCategory = (name) => {
    setExpandedCategories(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const toggleGroup = (name) => {
    setExpandedGroups(prev => 
      prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
    );
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = categoryData.map(cat => {
    const filteredGroups = cat.groups.map(group => {
      const filteredProcedures = group.procedures.filter(proc => 
        proc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredProcedures.length > 0) {
        return { ...group, procedures: filteredProcedures };
      }
      return null;
    }).filter(g => g !== null);

    if (filteredGroups.length > 0 || cat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return { ...cat, groups: filteredGroups };
    }
    return null;
  }).filter(c => c !== null);

  const displayData = searchQuery ? filteredData : categoryData;

  // Auto-expand on search
  React.useEffect(() => {
    if (searchQuery) {
      const allCatNames = filteredData.map(c => c.name);
      const allGroupKeys = filteredData.flatMap(c => c.groups.map(g => `${c.name}-${g.name}`));
      setExpandedCategories(allCatNames);
      setExpandedGroups(allGroupKeys);
    }
  }, [searchQuery]);

  return (
    <Box sx={{ p: 0 }}>
      <FeeGuideDetailHeader 
        feeGuideName={feeGuideName} 
        onSetProvider={() => setSetProviderOpen(true)}
        onRoundUp={() => setRoundDialogOpen(true)}
        onUpload={() => setUploadDialogOpen(true)}
      />

      {/* Search Bar Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#4b71a1', fontWeight: 600, textDecoration: 'underline' }}>Search for Code</Typography>
        <TextField
          size="small"
          placeholder="Enter code or procedure"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            width: 200,
            '& .MuiInputBase-root': { 
              fontSize: '0.85rem',
              borderBottom: '1px solid #e0e0e0',
              borderRadius: 0,
            },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
          }}
        />
      </Box>

      {/* Main Table */}
      <TableContainer sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a3a6b' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '15%', whiteSpace: 'nowrap' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '15%', whiteSpace: 'nowrap' }}>Group</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '10%', whiteSpace: 'nowrap' }}>Code</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '20%', whiteSpace: 'nowrap' }}>Procedure Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '20%', whiteSpace: 'nowrap' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '10%', whiteSpace: 'nowrap' }}>Fee</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', width: '10%', whiteSpace: 'nowrap' }}>
                Change fee by % <HelpOutlineIcon sx={{ fontSize: '0.85rem', verticalAlign: 'middle', ml: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 0.5, fontSize: '0.75rem' }}>
                  <span>(-/+)</span>
                  <span>%</span>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.map((cat, index) => (
              <CategoryRow 
                key={index}
                cat={cat}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      <RoundFeeGuideDialog 
        open={roundDialogOpen} 
        onClose={() => setRoundDialogOpen(false)}
        onSave={(val) => {
          console.log('Rounding to nearest:', val);
          setRoundDialogOpen(false);
        }}
      />
      <SetProviderFeeGuideDialog 
        open={setProviderOpen}
        onClose={() => setSetProviderOpen(false)}
        onSave={(name) => {
          console.log('Setting provider:', name);
          setSetProviderOpen(false);
        }}
      />
      <UploadFeeGuideDialog 
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={(file) => {
          console.log('Uploading file:', file);
          setUploadDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default FeeGuideDetail;
