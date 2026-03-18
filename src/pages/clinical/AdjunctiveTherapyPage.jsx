import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Collapse, Checkbox, Select, MenuItem, TextField
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import ProductTable from '../../components/clinical/ProductTable';

const AdjunctiveTherapyPage = () => {
  // State to track which sections are expanded
  const [expanded, setExpanded] = useState({
    labFee: false,
    subLabFee: false,
    hygieneTools: true,
    toothbrush: false,
    mechanicalToothbrush: false,
  });

  // State for toothbrush rows
  const [toothbrushRows, setToothbrushRows] = useState([{
    choice: '',
    options: [
      { value: 'soft', label: 'Soft' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for mechanical toothbrush rows
  const [mechanicalToothbrushRows, setMechanicalToothbrushRows] = useState([{
    choice: '',
    options: [
      { value: 'oral-b', label: 'Oral B iO Bundle' },
      { value: 'waterpik', label: 'Waterpik' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for toothpaste rows
  const [toothpasteRows, setToothpasteRows] = useState([{
    choice: '',
    options: [
      { value: 'fluoride', label: 'Fluoride Toothpaste' },
      { value: 'sensitivity', label: 'Sensitivity Toothpaste' },
      { value: 'whitening', label: 'Whitening Toothpaste' },
      { value: 'natural', label: 'Natural Toothpaste' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for floss rows
  const [flossRows, setFlossRows] = useState([{
    choice: '',
    options: [
      { value: 'waxed', label: 'Waxed Floss' },
      { value: 'unwaxed', label: 'Unwaxed Floss' },
      { value: 'waterpik', label: 'Waterpik' },
      { value: 'floss-picks', label: 'Floss Picks' },
      { value: 'hydro-floss', label: 'Hydro Floss' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for interdental device rows
  const [interdentalRows, setInterdentalRows] = useState([{
    choice: '',
    options: [
      { value: 'interdental-brushes', label: 'Interdental Brushes' },
      { value: 'soft-picks', label: 'Soft Picks' },
      { value: 'rubber-tips', label: 'Rubber Tips' },
      { value: 'wooden-sticks', label: 'Wooden Sticks' },
      { value: 'proxabrush', label: 'Proxabrush' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for patient self care rows
  const [patientSelfCareRows, setPatientSelfCareRows] = useState([{
    choice: '',
    options: [
      { value: 'disclosing-tablets', label: 'Disclosing Tablets' },
      { value: 'mouth-mirror', label: 'Mouth Mirror' },
      { value: 'plaque-detector', label: 'Plaque Detector' },
      { value: 'oral-care-app', label: 'Oral Care App' },
      { value: 'brushing-timer', label: 'Brushing Timer' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for environmental therapy (oral rinse) rows
  const [environmentalTherapyRows, setEnvironmentalTherapyRows] = useState([{
    choice: '',
    options: [
      { value: 'chlorhexidine', label: 'Chlorhexidine Gluconate' },
      { value: 'essential-oils', label: 'Essential Oils Rinse' },
      { value: 'cetylpyridinium', label: 'Cetylpyridinium Chloride' },
      { value: 'fluoride-rinse', label: 'Fluoride Mouth Rinse' },
      { value: 'salt-water', label: 'Salt Water Rinse' },
      { value: 'baking-soda', label: 'Baking Soda Rinse' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for fluoride rows
  const [fluorideRows, setFluorideRows] = useState([{
    choice: '',
    options: [
      { value: 'fluoride-varnish', label: 'Fluoride Varnish' },
      { value: 'fluoride-gel', label: 'Fluoride Gel' },
      { value: 'fluoride-foam', label: 'Fluoride Foam' },
      { value: 'prescription-fluoride', label: 'Prescription Fluoride Toothpaste' },
      { value: 'otc-fluoride', label: 'OTC Fluoride Treatment' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for oral malodor management rows
  const [oralMalodorRows, setOralMalodorRows] = useState([{
    choice: '',
    options: [
      { value: 'zinc-chloride', label: 'Zinc Chloride Rinse' },
      { value: 'chlorine-dioxide', label: 'Chlorine Dioxide Rinse' },
      { value: 'cetylpyridinium-chloride', label: 'Cetylpyridinium Chloride (CPC)' },
      { value: 'oxygenating-rinse', label: 'Oxygenating Mouth Rinse' },
      { value: 'tongue-scraper', label: 'Tongue Scraper' },
      { value: 'baking-soda-rinse', label: 'Baking Soda Mouth Rinse' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for caries management system rows
  const [cariesManagementRows, setCariesManagementRows] = useState([{
    choice: '',
    options: [
      { value: 'xylitol-gum', label: 'Xylitol Chewing Gum' },
      { value: 'casein-phosphopeptide', label: 'CPP-ACP (MI Paste)' },
      { value: 'calcium-sodium', label: 'Calcium Sodium Phosphosilicate' },
      { value: 'arginine-toothpaste', label: 'Arginine-Based Toothpaste' },
      { value: 'sealants', label: 'Dental Sealants' },
      { value: 'silver-diamine', label: 'Silver Diamine Fluoride' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for erosion management system rows
  const [erosionManagementRows, setErosionManagementRows] = useState([{
    choice: '',
    options: [
      { value: 'stannous-fluoride', label: 'Stannous Fluoride Toothpaste' },
      { value: 'nano-hydroxyapatite', label: 'Nano-Hydroxyapatite' },
      { value: 'bioglass-toothpaste', label: 'Bioactive Glass Toothpaste' },
      { value: 'potassium-nitrate', label: 'Potassium Nitrate Desensitizer' },
      { value: 'glutaraldehyde', label: 'Glutaraldehyde Desensitizer' },
      { value: 'fluoride-varnish-high', label: 'High-Concentration Fluoride Varnish' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for xerostomia management system rows
  const [xerostomiaRows, setXerostomiaRows] = useState([{
    choice: '',
    options: [
      { value: 'saliva-substitute', label: 'Saliva Substitute Spray' },
      { value: 'xylitol-lozenges', label: 'Xylitol Lozenges' },
      { value: 'oral-balance-gel', label: 'Oral Balance Moisturizing Gel' },
      { value: 'biotene-products', label: 'Biotene Dry Mouth Products' },
      { value: 'pilocarpine', label: 'Pilocarpine (Prescription)' },
      { value: 'cevimeline', label: 'Cevimeline (Prescription)' },
      { value: 'alcohol-free-rinse', label: 'Alcohol-Free Mouth Rinse' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for TDS membership rows
  const [tdsMembershipRows, setTdsMembershipRows] = useState([{
    choice: '',
    options: [
      { value: 'basic-membership', label: 'Basic TDS Membership' },
      { value: 'premium-membership', label: 'Premium TDS Membership' },
      { value: 'family-membership', label: 'Family TDS Membership' },
      { value: 'senior-membership', label: 'Senior TDS Membership' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for functional therapy rows
  const [functionalTherapyRows, setFunctionalTherapyRows] = useState([{
    choice: '',
    options: [
      { value: 'occlusal-guard', label: 'Occlusal Guard/Night Guard' },
      { value: 'tmj-appliance', label: 'TMJ Therapeutic Appliance' },
      { value: 'bruxism-splint', label: 'Bruxism Splint' },
      { value: 'mandibular-device', label: 'Mandibular Advancement Device' },
      { value: 'biofeedback', label: 'Biofeedback Therapy' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  // State for whitening rows
  const [whiteningRows, setWhiteningRows] = useState([{
    choice: '',
    options: [
      { value: 'in-office-whitening', label: 'In-Office Professional Whitening' },
      { value: 'take-home-trays', label: 'Custom Take-Home Whitening Trays' },
      { value: 'whitening-strips', label: 'Professional Whitening Strips' },
      { value: 'whitening-pen', label: 'Whitening Touch-Up Pen' },
      { value: 'led-accelerator', label: 'LED Whitening Accelerator' },
      { value: 'desensitizer', label: 'Post-Whitening Desensitizer' }
    ],
    usedByPatient: false,
    suggestedToPatient: false,
    instructions: ''
  }]);

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = [
    { id: 'hygieneTools', label: 'Hygiene Tools', hasSub: true },
    { id: 'patientSelfCare', label: 'Patient Self Care', hasTable: true },
    { id: 'environmentalTherapy', label: 'Environmental Therapy (Oral rinse)', hasTable: true },
    { id: 'fluoride', label: 'Fluoride', hasTable: true },
    { id: 'oralMalodor', label: 'Oral Malodor Management', hasTable: true },
    { id: 'cariesManagement', label: 'Caries management system', hasTable: true },
    { id: 'erosionManagement', label: 'Erosion management system', hasTable: true },
    { id: 'xerostomia', label: 'Xerostomia management system', hasTable: true },
    { id: 'functionalTherapy', label: 'Functional Therapy', hasSub: true, hasTable: true },
    { id: 'whitening', label: 'Whitening', hasTable: true },
  ];

  const hygieneSubCategories = [
    { id: 'toothbrush', label: 'Toothbrush', hasTable: true },
    { id: 'mechanicalToothbrush', label: 'Mechanical toothbrush', hasTable: true },
    { id: 'toothpaste', label: 'Toothpaste', hasTable: true },
    { id: 'floss', label: 'Floss', hasTable: true },
    { id: 'interdental', label: 'Interdental devices', hasTable: true },
  ];

  const functionalSubCategories = [
    { id: 'tdsMembership', label: 'TDS Membership', hasTable: true },
  ];

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <ClinicalNavbar />
      
      <Box sx={{ px: 4, py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
            Adjunctive Therapy
          </Typography>
        </Box>

        {/* Categories List */}
        <Box sx={{ borderTop: '1px solid #d1d5db' }}>
          {/* Lab Fee Section - Special Nested Structure */}
          <Box sx={{ borderBottom: '1px solid #d1d5db' }}>
            <Box 
              onClick={() => toggleSection('labFee')}
              sx={{ 
                display: 'flex', alignItems: 'center', py: 0.8, cursor: 'pointer',
                '&:hover': { bgcolor: '#f9fafb' }
              }}
            >
              {expanded['labFee'] ? 
                <KeyboardArrowDownIcon sx={{ fontSize: '1.2rem', color: '#5b84c1', mr: 0.5 }} /> : 
                <KeyboardArrowRightIcon sx={{ fontSize: '1.2rem', color: '#5b84c1', mr: 0.5 }} />
              }
              <Typography sx={{ fontSize: '0.85rem', color: '#2e3b84', fontWeight: 600 }}>
                Lab fee
              </Typography>
            </Box>

            {/* Nested Sub-Category: Lab Fee */}
            <Collapse in={expanded['labFee']} timeout="auto" unmountOnExit>
              <Box sx={{ ml: 2 }}>
                <Box 
                  onClick={() => toggleSection('subLabFee')}
                  sx={{ display: 'flex', alignItems: 'center', py: 0.5, cursor: 'pointer' }}
                >
                  {expanded['subLabFee'] ? 
                    <KeyboardArrowDownIcon sx={{ fontSize: '1.1rem', color: '#5b84c1', mr: 0.5 }} /> : 
                    <KeyboardArrowRightIcon sx={{ fontSize: '1.1rem', color: '#5b84c1', mr: 0.5 }} />
                  }
                  <Typography sx={{ fontSize: '0.8rem', color: '#2e3b84' }}>
                    Lab Fee
                  </Typography>
                </Box>

                {/* Lab Fee Table */}
                <Collapse in={expanded['subLabFee']} timeout="auto" unmountOnExit>
                  <Box sx={{ ml: 4, mb: 2, mt: 1 }}>
                    <ProductTable 
                      placeholderText="Select lab fee..."
                      rows={[{
                        choice: '',
                        options: [
                          { value: 'lab-1', label: 'Standard Lab Fee' },
                          { value: 'lab-2', label: 'Custom Lab Fee' }
                        ],
                        usedByPatient: false,
                        suggestedToPatient: false,
                        instructions: ''
                      }]}
                      onAddRow={(newRow) => {
                        console.log('New lab fee row added:', newRow);
                        // Add your custom logic here for lab fee
                      }}
                    />
                  </Box>
                </Collapse>
              </Box>
            </Collapse>
          </Box>

          {categories.map((cat) => (
            <Box key={cat.id} sx={{ borderBottom: '1px solid #d1d5db' }}>
              {/* Main Category Header */}
              <Box 
                onClick={() => toggleSection(cat.id)}
                sx={{ 
                  display: 'flex', alignItems: 'center', py: 0.8, cursor: 'pointer',
                  '&:hover': { bgcolor: '#f9fafb' }
                }}
              >
                {expanded[cat.id] ? 
                  <KeyboardArrowDownIcon sx={{ fontSize: '1.2rem', color: '#5b84c1', mr: 0.5 }} /> : 
                  <KeyboardArrowRightIcon sx={{ fontSize: '1.2rem', color: '#5b84c1', mr: 0.5 }} />
                }
                <Typography sx={{ fontSize: '0.85rem', color: '#2e3b84', fontWeight: 500 }}>
                  {cat.label}
                </Typography>
              </Box>

              {/* Sub-Category Collapse (Hygiene Tools) */}
              {cat.hasSub && cat.id === 'hygieneTools' && (
                <Collapse in={expanded[cat.id]} timeout="auto" unmountOnExit>
                  <Box sx={{ ml: 2 }}>
                    {hygieneSubCategories.map((sub) => (
                      <Box key={sub.id}>
                        <Box 
                          onClick={() => toggleSection(sub.id)}
                          sx={{ display: 'flex', alignItems: 'center', py: 0.5, cursor: 'pointer' }}
                        >
                          {expanded[sub.id] ? 
                            <KeyboardArrowDownIcon sx={{ fontSize: '1.1rem', color: '#5b84c1', mr: 0.5 }} /> : 
                            <KeyboardArrowRightIcon sx={{ fontSize: '1.1rem', color: '#5b84c1', mr: 0.5 }} />
                          }
                          <Typography sx={{ fontSize: '0.8rem', color: '#2e3b84' }}>
                            {sub.label}
                          </Typography>
                        </Box>

                        {/* Product Table (Mechanical Toothbrush and Toothbrush) */}
                        {sub.hasTable && (
                          <Collapse in={expanded[sub.id]} timeout="auto" unmountOnExit>
                            <Box sx={{ ml: 4, mb: 2, mt: 1 }}>
                              {sub.id === 'toothbrush' ? (
                                <ProductTable 
                                  placeholderText="Select toothbrush type..."
                                  rows={toothbrushRows}
                                  onAddRow={(newRow) => {
                                    setToothbrushRows([...toothbrushRows, newRow]);
                                    console.log('New toothbrush row added:', newRow);
                                  }}
                                />
                              ) : sub.id === 'mechanicalToothbrush' ? (
                                <ProductTable 
                                  placeholderText="Select mechanical toothbrush..."
                                  rows={mechanicalToothbrushRows}
                                  onAddRow={(newRow) => {
                                    setMechanicalToothbrushRows([...mechanicalToothbrushRows, newRow]);
                                    console.log('New mechanical toothbrush row added:', newRow);
                                  }}
                                />
                              ) : sub.id === 'toothpaste' ? (
                                <ProductTable 
                                  placeholderText="Select toothpaste..."
                                  rows={toothpasteRows}
                                  onAddRow={(newRow) => {
                                    setToothpasteRows([...toothpasteRows, newRow]);
                                    console.log('New toothpaste row added:', newRow);
                                  }}
                                />
                              ) : sub.id === 'floss' ? (
                                <ProductTable 
                                  placeholderText="Select floss..."
                                  rows={flossRows}
                                  onAddRow={(newRow) => {
                                    setFlossRows([...flossRows, newRow]);
                                    console.log('New floss row added:', newRow);
                                  }}
                                />
                              ) : (
                                <ProductTable 
                                  placeholderText="Select interdental device..."
                                  rows={interdentalRows}
                                  onAddRow={(newRow) => {
                                    setInterdentalRows([...interdentalRows, newRow]);
                                    console.log('New interdental device row added:', newRow);
                                  }}
                                />
                              )}
                            </Box>
                          </Collapse>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              )}

              {/* Sub-Category Collapse (Functional Therapy) */}
              {cat.hasSub && cat.id === 'functionalTherapy' && (
                <Collapse in={expanded[cat.id]} timeout="auto" unmountOnExit>
                  <Box sx={{ ml: 2 }}>
                    {functionalSubCategories.map((sub) => (
                      <Box key={sub.id}>
                        <Box 
                          onClick={() => toggleSection(sub.id)}
                          sx={{ display: 'flex', alignItems: 'center', py: 0.5, cursor: 'pointer' }}
                        >
                          {expanded[sub.id] ? 
                            <KeyboardArrowDownIcon sx={{ fontSize: '1.1rem', color: '#5b84c1', mr: 0.5 }} /> : 
                            <KeyboardArrowRightIcon sx={{ fontSize: '1.1rem', color: '#5b84c1', mr: 0.5 }} />
                          }
                          <Typography sx={{ fontSize: '0.8rem', color: '#2e3b84' }}>
                            {sub.label}
                          </Typography>
                        </Box>

                        {/* Product Table for TDS Membership */}
                        {sub.hasTable && (
                          <Collapse in={expanded[sub.id]} timeout="auto" unmountOnExit>
                            <Box sx={{ ml: 4, mb: 2, mt: 1 }}>
                              <ProductTable 
                                placeholderText="Select TDS membership..."
                                rows={tdsMembershipRows}
                                onAddRow={(newRow) => {
                                  setTdsMembershipRows([...tdsMembershipRows, newRow]);
                                  console.log('New TDS membership row added:', newRow);
                                }}
                              />
                            </Box>
                          </Collapse>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              )}

              {/* Direct Table for Functional Therapy (separate from subcategories) */}
              {cat.hasTable && cat.hasSub && cat.id === 'functionalTherapy' && (
                <Collapse in={expanded[cat.id]} timeout="auto" unmountOnExit>
                  <Box sx={{ ml: 2, mb: 2, mt: 2, borderTop: '2px solid #d1d5db', pt: 2 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#2e3b84', fontWeight: 600, mb: 1 }}>
                      Functional Therapy Products
                    </Typography>
                    <ProductTable 
                      placeholderText="Select functional therapy product..."
                      rows={functionalTherapyRows}
                      onAddRow={(newRow) => {
                        setFunctionalTherapyRows([...functionalTherapyRows, newRow]);
                        console.log('New functional therapy row added:', newRow);
                      }}
                    />
                  </Box>
                </Collapse>
              )}

              {/* Direct Table for Categories without Subcategories (e.g., Patient Self Care) */}
              {cat.hasTable && !cat.hasSub && (
                <Collapse in={expanded[cat.id]} timeout="auto" unmountOnExit>
                  <Box sx={{ ml: 2, mb: 2 }}>
                    {cat.id === 'patientSelfCare' ? (
                      <ProductTable 
                        placeholderText="Select self care product..."
                        rows={patientSelfCareRows}
                        onAddRow={(newRow) => {
                          setPatientSelfCareRows([...patientSelfCareRows, newRow]);
                          console.log('New patient self care row added:', newRow);
                        }}
                      />
                    ) : cat.id === 'environmentalTherapy' ? (
                      <ProductTable 
                        placeholderText="Select oral rinse..."
                        rows={environmentalTherapyRows}
                        onAddRow={(newRow) => {
                          setEnvironmentalTherapyRows([...environmentalTherapyRows, newRow]);
                          console.log('New environmental therapy row added:', newRow);
                        }}
                      />
                    ) : cat.id === 'fluoride' ? (
                      <ProductTable 
                        placeholderText="Select fluoride treatment..."
                        rows={fluorideRows}
                        onAddRow={(newRow) => {
                          setFluorideRows([...fluorideRows, newRow]);
                          console.log('New fluoride row added:', newRow);
                        }}
                      />
                    ) : cat.id === 'oralMalodor' ? (
                      <ProductTable 
                        placeholderText="Select malodor management product..."
                        rows={oralMalodorRows}
                        onAddRow={(newRow) => {
                          setOralMalodorRows([...oralMalodorRows, newRow]);
                          console.log('New oral malodor row added:', newRow);
                        }}
                      />
                    ) : cat.id === 'cariesManagement' ? (
                      <ProductTable 
                        placeholderText="Select caries management product..."
                        rows={cariesManagementRows}
                        onAddRow={(newRow) => {
                          setCariesManagementRows([...cariesManagementRows, newRow]);
                          console.log('New caries management row added:', newRow);
                        }}
                      />
                    ) : cat.id === 'erosionManagement' ? (
                      <ProductTable 
                        placeholderText="Select erosion management product..."
                        rows={erosionManagementRows}
                        onAddRow={(newRow) => {
                          setErosionManagementRows([...erosionManagementRows, newRow]);
                          console.log('New erosion management row added:', newRow);
                        }}
                      />
                    ) : cat.id === 'xerostomia' ? (
                      <ProductTable 
                        placeholderText="Select xerostomia management product..."
                        rows={xerostomiaRows}
                        onAddRow={(newRow) => {
                          setXerostomiaRows([...xerostomiaRows, newRow]);
                          console.log('New xerostomia row added:', newRow);
                        }}
                      />
                    ) : cat.id === 'whitening' ? (
                      <ProductTable 
                        placeholderText="Select whitening product..."
                        rows={whiteningRows}
                        onAddRow={(newRow) => {
                          setWhiteningRows([...whiteningRows, newRow]);
                          console.log('New whitening row added:', newRow);
                        }}
                      />
                    ) : null}
                  </Box>
                </Collapse>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AdjunctiveTherapyPage;