import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Sync as SyncIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

// Data for the top general section
const INITIAL_TOP_CATEGORIES = [
  { id: 't0_1', name: 'Patient Self Care', choices: [] },
  { id: 't0_2', name: 'Environmental Therapy (Oral rinse)', choices: [] },
  { id: 't0_3', name: 'Over-the-counter', choices: [] },
  { id: 't1', name: 'Toothpaste (1.1% NaF)', choices: [] },
  { id: 't2', name: 'Gel (1.1% NaF)', choices: [] },
  { id: 't3', name: 'Oral Malodor Management', choices: [] },
  { id: 't4', name: 'Caries management system', choices: [] },
  { id: 't5', name: 'Erosion management system', choices: [] },
  { id: 't6', name: 'Xerostomia management system', choices: [] },
  { id: 't7', name: 'Functional Therapy', choices: [] },
  { id: 't8', name: 'TDS Membership', choices: [] },
  { id: 't9', name: 'Whitening', choices: [] },
];

// Data for the Progress Notes section
const INITIAL_PROGRESS_CATEGORIES = [
  { id: '1', name: 'Resin Cement', choices: [] },
  {
    id: '2',
    name: 'Onlay Cement',
    choices: [
      { id: 'o1', name: 'Adherence Permanent Resin Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o2', name: 'Bifix QM Resin-Based Adhesive Luting System', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o3', name: 'BisCem Self-Adhesive Luting Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o4', name: 'Bistite II DC Adhesive Resin Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o5', name: 'Clearfil Esthetic Cement EX', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o6', name: 'Duo-Link Composite Luting Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o7', name: 'Duo-Link Universal Resin Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o8', name: 'G-CEM LinkForce Resin Cementation System', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o9', name: 'Insure Lite Automix Resin Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o10', name: 'Insure Regular and Insure Lite Resin Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'o11', name: 'IntegraCem Dual Cure Resin Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
    ],
  },
  {
    id: '3',
    name: 'Veneer Cement',
    choices: [
      { id: 'v1', name: 'Choice 2 Light-Cured Veneer Cement Disco', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'v2', name: 'Clearfil Esthetic Cement EX', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'v3', name: 'Da Vinci Resin Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'v4', name: 'eCEMENT Resin Cementation System', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'v5', name: 'Kleer-Veneer Light Cure Veneer Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'v6', name: 'Mojo Veneer Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'v7', name: 'PermaShade LC Veneer Luting Resin', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'v8', name: 'RelyX Veneer Cement', isDefault: true, quickList: true, isRecommended: true, price: '00.0', code: '' },
      { id: 'v9', name: 'UltraBond Clear Light-Cure Resin Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'v10', name: 'Variolink II Esthetic Cementation System', isDefault: false, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'v11', name: 'Vitique Veneer Cement', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
    ],
  },
  {
    id: '4',
    name: 'Bonding',
    choices: [
      { id: 'b1', name: 'Ace All-Bond SE Dental Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b2', name: 'Ace All-Bond TE (All-Bond SE)', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b3', name: 'AdheSE Dental Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b4', name: 'AdheSE One F', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b5', name: 'Admira Bond', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b6', name: 'Adper Easy Bond Self-Etch Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b7', name: 'Adper Prompt L Pop Self-Etch Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b8', name: 'Adper Scotchbond Multipurpose Plus Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b9', name: 'Adper Scotchbond SE Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b10', name: 'Adper Single Bond Plus Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b11', name: 'All-Bond 2 Dental Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b12', name: 'All-Bond Universal Dental Adhesive', isDefault: false, quickList: false, isRecommended: true, price: '00.0', code: '' },
      { id: 'b13', name: 'Amalgambond Plus', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b14', name: 'BeautiBond Dental Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b15', name: 'Bond-1 Primer/Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b16', name: 'Bond-1 SF Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b17', name: 'Bond-It System', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b18', name: 'BondLink', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b19', name: 'Brush&Bond Bonding System', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b20', name: 'Clearfil DC Bond', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b21', name: 'Clearfil Liner Bond 2V Adhesive', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b22', name: 'Clearfil New Bond', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b23', name: 'Clearfil Photo Bond', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'b24', name: 'Clearfil S3 Plus Bond', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
    ],
  },
  {
    id: '5',
    name: 'Zirconia primer',
    choices: [
      { id: 'z1', name: 'Clearfil Ceramic Primer', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'z2', name: 'Monobond Plus Universal Primer', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'z3', name: 'Z-PRIME Plus Silane Coupling Agent', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'z4', name: 'Zirconia Primer', isDefault: true, quickList: false, isRecommended: false, price: '00.0', code: '' },
    ],
  },
  {
    id: '6',
    name: 'Ceramic primer',
    choices: [
      { id: 'c1', name: 'Cerinate Primer & Porcelain Conditioner from DenMat', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'c2', name: 'Clearfil Ceramic Primer', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'c3', name: 'Ivoclar Monobond', isDefault: true, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'c4', name: 'Porcelain Primer Silane Coupling Agent', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'c5', name: 'RelyX Ceramic Primer', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'c6', name: 'Silanator from Cosmedent', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'c7', name: 'Ultradent Silane', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
    ],
  },
  {
    id: '7',
    name: 'PVS',
    choices: [
      { id: 'p1', name: 'Affinis Precious VPS Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p2', name: 'Aquasil Ultra Smart Wetting VPS Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p3', name: 'Chromaclone VPS', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p4', name: 'Cinch VPS Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p5', name: 'EXAFLEX VPS Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p6', name: 'Extrude VPS Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p7', name: 'Flexitime VPS Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p8', name: 'Genie Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p9', name: 'Impressiv Impression Material', isDefault: false, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'p10', name: 'Imprint 3 VPS Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p11', name: 'Imprint 4 VPS Impression Material', isDefault: true, quickList: true, isRecommended: true, price: '00.0', code: '' },
      { id: 'p12', name: 'Panasil Contact VPS', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p13', name: 'Paradigm VPS Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p14', name: 'President Putty VPS Impression Material', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'p15', name: 'Take 1 Advance VPS', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
    ],
  },
  {
    id: '8',
    name: 'Topical anesthetic',
    choices: [
      { id: 'ta1', name: 'Benzocaine', isDefault: true, quickList: true, isRecommended: true, price: '00.0', code: '' },
      { id: 'ta2', name: 'Dyclonine hydrochloride', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ta3', name: 'Ethocaine', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ta4', name: 'Gingicaine anesthetic gel', isDefault: false, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'ta5', name: 'Lidocaine ointment', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ta6', name: 'Lidocaine solution', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ta7', name: 'Lidocaine spray', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ta8', name: 'Oraqix', isDefault: false, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'ta9', name: 'Procaine', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ta10', name: 'Xylocaine', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
    ],
  },
  {
    id: '9',
    name: 'Infiltration Anesthetic',
    choices: [
      { id: 'i1', name: 'Articaine, 4% with Epinephrine 1:100,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i2', name: 'Articaine, 4% with Epinephrine 1:200,000', isDefault: true, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'i3', name: 'Bupivacaine, 0.5% with Epinephrine 1:200,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i4', name: 'Carbocaine, 3% plain', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i5', name: 'Citanest Forte, 4% with Epinephrine 1:200,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i6', name: 'Citanest Plain, 4% without Vasoconstriction', isDefault: false, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'i7', name: 'Duranest, 1.5% with Epinephrine 1:200,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i8', name: 'Lidocaine HCl, 2% with Epinephrine 1:100,000', isDefault: false, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'i9', name: 'Lidocaine HCl, 2% with Epinephrine 1:50,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i10', name: 'Lidocaine, 2% with Epinephrine 1:100,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i11', name: 'Marcaine, 0.5% with Epinephrine 1:200,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i12', name: 'Mepivacaine, 2% with Levonordefrin 1:20,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i13', name: 'Mepivacaine, 3% plain', isDefault: false, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'i14', name: 'Prilocaine, 4% plain', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i15', name: 'Prilocaine, 4% with Epinephrine 1:200,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i16', name: 'Septocaine, 4% with Epinephrine 1:100,000', isDefault: false, quickList: true, isRecommended: true, price: '00.0', code: '' },
      { id: 'i17', name: 'Xylocaine, 2% with Epinephrine 1:100,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'i18', name: 'Xylocaine, 2% with Epinephrine 1:50,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
    ],
  },
  {
    id: '10',
    name: 'IA Block Anesthetic',
    choices: [
      { id: 'ia1', name: 'Articaine, 4% with Epinephrine 1:100,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia2', name: 'Articaine, 4% with Epinephrine 1:200,000', isDefault: false, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia3', name: 'Bupivacaine, 0.5% with Epinephrine 1:200,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia4', name: 'Carbocaine, 3% plain', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia5', name: 'Citanest Forte, 4% with Epinephrine 1:200,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia6', name: 'Citanest Plain, 4% without Vasoconstriction', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia7', name: 'Duranest, 1.5% with Epinephrine 1:200,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia8', name: 'Lidocaine HCl, 2% with Epinephrine 1:100,000', isDefault: false, quickList: true, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia9', name: 'Lidocaine HCl, 2% with Epinephrine 1:50,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia10', name: 'Lidocaine, 2% with Epinephrine 1:100,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia11', name: 'Mepivacaine, 2% with Levonordefrin 1:20,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia12', name: 'Mepivacaine, 3% plain', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia13', name: 'Prilocaine, 4% plain', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia14', name: 'Prilocaine, 4% with Epinephrine 1:200,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia15', name: 'Septocaine, 4% with Epinephrine 1:100,000', isDefault: true, quickList: true, isRecommended: true, price: '00.0', code: '' },
      { id: 'ia16', name: 'Xylocaine, 2% with Epinephrine 1:100,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
      { id: 'ia17', name: 'Xylocaine, 2% with Epinephrine 1:50,000', isDefault: false, quickList: false, isRecommended: false, price: '00.0', code: '' },
    ],
  },
  {
    id: '11',
    name: 'FI - Varnish',
    choices: [
      { id: 'f1', name: '3M Varnish applied with brush chairside', isDefault: true, quickList: true, isRecommended: false, price: '35', code: 'PS7796260773125296886' },
    ],
  },
];

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [topCategories, setTopCategories] = useState(INITIAL_TOP_CATEGORIES);
  const [progressCategories, setProgressCategories] = useState(INITIAL_PROGRESS_CATEGORIES);
  const [expandedId, setExpandedId] = useState('11');
  const [isSyncDialogOpen, setSyncDialogOpen] = useState(false);

  // Inline Choice Draft State
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [inlineChoiceDraft, setInlineChoiceDraft] = useState({
    name: '',
    isDefault: false,
    quickList: false,
    isRecommended: false,
    price: '',
    code: '',
  });

  // Inline Product Draft State
  const [isAddingProductInSection, setIsAddingProductInSection] = useState(null); // 'top' or 'progress'
  const [productDraftName, setProductDraftName] = useState('');

  const handleToggleAccordion = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleCheckboxChange = (section, categoryId, choiceId, field) => {
    const setter = section === 'top' ? setTopCategories : setProgressCategories;
    setter(prevCategories =>
      prevCategories.map(cat => {
        if (cat.id !== categoryId) return cat;

        return {
          ...cat,
          choices: cat.choices.map(choice => {
            if (choice.id === choiceId) {
              return { ...choice, [field]: !choice[field] };
            }
            if (field === 'isDefault') {
              return { ...choice, isDefault: false };
            }
            return choice;
          }),
        };
      })
    );
  };

  const handleOpenSyncDialog = (e) => {
    e.stopPropagation();
    setSyncDialogOpen(true);
  };

  const handleCloseSyncDialog = () => {
    setSyncDialogOpen(false);
  };

  // Inline Choice Handlers
  const handleStartInlineChoice = (section, categoryId) => {
    setEditingSection(section);
    setEditingCategoryId(categoryId);
    setInlineChoiceDraft({
      name: '',
      isDefault: false,
      quickList: false,
      isRecommended: false,
      price: '',
      code: '',
    });
  };

  const handleCancelInlineChoice = () => {
    setEditingCategoryId(null);
    setEditingSection(null);
  };

  const handleSaveInlineChoice = () => {
    if (!inlineChoiceDraft.name) return;

    const setter = editingSection === 'top' ? setTopCategories : setProgressCategories;
    const newChoice = {
      id: Date.now().toString(),
      ...inlineChoiceDraft,
      price: inlineChoiceDraft.price || '00.0',
    };

    setter(prevCategories =>
      prevCategories.map(cat => {
        if (cat.id !== editingCategoryId) return cat;

        let updatedChoices = [...cat.choices];
        if (newChoice.isDefault) {
          updatedChoices = updatedChoices.map(c => ({ ...c, isDefault: false }));
        }
        updatedChoices.push(newChoice);

        return { ...cat, choices: updatedChoices };
      })
    );

    handleCancelInlineChoice();
  };

  // Inline Product Handlers
  const handleStartInlineProduct = (section) => {
    setIsAddingProductInSection(section);
    setProductDraftName('');
  };

  const handleCancelInlineProduct = () => {
    setIsAddingProductInSection(null);
    setProductDraftName('');
  };

  const handleSaveInlineProduct = () => {
    if (!productDraftName) return;

    const setter = isAddingProductInSection === 'top' ? setTopCategories : setProgressCategories;
    const newProduct = {
      id: Date.now().toString(),
      name: productDraftName,
      choices: [],
    };

    setter(prev => [...prev, newProduct]);
    setExpandedId(newProduct.id);
    handleCancelInlineProduct();
  };

  const renderCategoryList = (list, section) => (
    list.map((category) => (
      <Box key={category.id}>
        <Accordion
          expanded={expandedId === category.id}
          onChange={() => handleToggleAccordion(category.id)}
          sx={{
            boxShadow: 'none',
            '&:before': { display: 'none' },
            border: 'none',
            backgroundColor: 'transparent',
            '& .MuiAccordionSummary-root': {
              minHeight: 32,
              px: 0,
              borderBottom: '1px solid #e0e0e0',
            },
            '& .MuiAccordionSummary-content': {
              margin: '8px 0',
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color: '#1a3a6b',
                  fontSize: '1.2rem',
                  transform: expandedId === category.id ? 'rotate(0deg)' : 'rotate(-90deg)',
                }}
              />
            }
            sx={{
              flexDirection: 'row-reverse',
              gap: 1,
            }}
          >
            <Typography sx={{ color: '#1a3a6b', fontWeight: 500, fontSize: '0.85rem' }}>
              {category.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1, px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
              <Button
                size="small"
                onClick={handleOpenSyncDialog}
                startIcon={<SyncIcon sx={{ fontSize: '1rem' }} />}
                sx={{
                  textTransform: 'none',
                  color: '#1a3a6b',
                  fontSize: '0.75rem',
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                }}
              >
                Sync
              </Button>
              <Button
                size="small"
                variant="contained"
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#e57373',
                  '&:hover': { backgroundColor: '#d32f2f' },
                  fontSize: '0.75rem',
                  minWidth: 80,
                  borderRadius: '4px',
                }}
              >
                Deactivate
              </Button>
            </Box>

            <TableContainer>
              <Table size="small" sx={{ '& .MuiTableCell-root': { borderBottom: 'none', py: 0.5, px: 1 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#333', width: '30%' }}>Choice Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#333' }}>Is Default</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#333' }}>Quick List</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#333' }}>Is Recommended</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#333' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#333' }}>Code</TableCell>
                    <TableCell sx={{ width: 100 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {category.choices.map((choice) => (
                    <TableRow key={choice.id} sx={{ '&:hover': { backgroundColor: '#f5f7fb' } }}>
                      <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b' }}>{choice.name}</TableCell>
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={choice.isDefault}
                          onChange={() => handleCheckboxChange(section, category.id, choice.id, 'isDefault')}
                          sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: '1.1rem' } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={choice.quickList}
                          onChange={() => handleCheckboxChange(section, category.id, choice.id, 'quickList')}
                          sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: '1.1rem' } }}
                        />
                      </TableCell>
                      <TableCell>
                        {choice.isRecommended && (
                          <CheckIcon sx={{ color: '#81c784', fontSize: '1.1rem' }} />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>$ {choice.price}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{choice.code}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            backgroundColor: '#e57373',
                            '&:hover': { backgroundColor: '#d32f2f' },
                            fontSize: '0.65rem',
                            minWidth: 70,
                            height: 22,
                            borderRadius: '4px',
                          }}
                        >
                          Deactivate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Inline Choice Draft Row */}
                  {editingCategoryId === category.id && (
                    <TableRow sx={{ backgroundColor: '#f0f4f8' }}>
                      <TableCell>
                        <TextField
                          autoFocus
                          placeholder="Choice name"
                          size="small"
                          fullWidth
                          value={inlineChoiceDraft.name}
                          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, name: e.target.value })}
                          sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={inlineChoiceDraft.isDefault}
                          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, isDefault: e.target.checked })}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={inlineChoiceDraft.quickList}
                          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, quickList: e.target.checked })}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={inlineChoiceDraft.isRecommended}
                          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, isRecommended: e.target.checked })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          placeholder="00.0"
                          size="small"
                          value={inlineChoiceDraft.price}
                          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, price: e.target.value })}
                          sx={{ width: 60, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          placeholder="Code"
                          size="small"
                          value={inlineChoiceDraft.code}
                          onChange={(e) => setInlineChoiceDraft({ ...inlineChoiceDraft, code: e.target.value })}
                          sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" onClick={handleSaveInlineChoice} sx={{ color: '#4caf50' }}>
                            <SaveIcon sx={{ fontSize: '1.1rem' }} />
                          </IconButton>
                          <IconButton size="small" onClick={handleCancelInlineChoice} sx={{ color: '#e57373' }}>
                            <CloseIcon sx={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow>
                    <TableCell colSpan={7} sx={{ pt: 1 }}>
                      {!editingCategoryId && (
                        <Typography
                          variant="caption"
                          onClick={() => handleStartInlineChoice(section, category.id)}
                          sx={{
                            color: '#1a3a6b',
                            cursor: 'pointer',
                            fontWeight: 500,
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          +Add New Choice
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        <Divider sx={{ my: 0, borderColor: '#e0e0e0' }} />
      </Box>
    ))
  );

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          onClick={() => navigate('/admin/clinical-management')}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>
          Products
        </Typography>
      </Box>

      {/* Top Categories Section */}
      {renderCategoryList(topCategories, 'top')}

      {/* Inline Product Add for Top Section */}
      {isAddingProductInSection === 'top' ? (
        <Box sx={{ py: 1, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            autoFocus
            size="small"
            placeholder="Product Category Name"
            value={productDraftName}
            onChange={(e) => setProductDraftName(e.target.value)}
            sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' }, flex: 1 }}
          />
          <IconButton size="small" onClick={handleSaveInlineProduct} sx={{ color: '#4caf50' }}>
            <SaveIcon />
          </IconButton>
          <IconButton size="small" onClick={handleCancelInlineProduct} sx={{ color: '#e57373' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ mt: 1, mb: 3 }}>
          <Typography
            variant="caption"
            onClick={() => handleStartInlineProduct('top')}
            sx={{
              color: '#1a3a6b',
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' },
              fontSize: '0.75rem',
            }}
          >
            +Add New Product
          </Typography>
        </Box>
      )}

      {/* Progress Notes Section */}
      <Typography
        variant="body2"
        sx={{
          color: '#1a3a6b',
          mb: 1,
          cursor: 'pointer',
          textDecoration: 'underline',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        Progress Notes
      </Typography>
      {renderCategoryList(progressCategories, 'progress')}

      {/* Inline Product Add for Progress Section */}
      {isAddingProductInSection === 'progress' ? (
        <Box sx={{ py: 1, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            autoFocus
            size="small"
            placeholder="Product Category Name"
            value={productDraftName}
            onChange={(e) => setProductDraftName(e.target.value)}
            sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' }, flex: 1 }}
          />
          <IconButton size="small" onClick={handleSaveInlineProduct} sx={{ color: '#4caf50' }}>
            <SaveIcon />
          </IconButton>
          <IconButton size="small" onClick={handleCancelInlineProduct} sx={{ color: '#e57373' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            onClick={() => handleStartInlineProduct('progress')}
            sx={{
              color: '#1a3a6b',
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' },
              fontSize: '0.75rem',
            }}
          >
            +Add New Product
          </Typography>
        </Box>
      )}

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
            {/* Placeholder for Target Offices list */}
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

export default ProductsManagement;
