import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  addProductCategory,
  addProductChoice,
  updateProductChoice,
  deleteProductCategory,
  deleteProductChoice,
  selectProducts,
  selectLoadingProducts
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { CircularProgress, Box, Typography, Button, Divider } from '@mui/material';

import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';
import CategoryAccordion from '../../components/admin/clinical-management/products/CategoryAccordion';
import AddCategoryDialog from '../../components/admin/clinical-management/products/AddCategoryDialog';
import SyncOfficesDialog from '../../components/admin/clinical-management/products/SyncOfficesDialog';

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
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoadingProducts);

  const topCategories = products.filter(c => c.section === 'top');
  const progressCategories = products.filter(c => c.section === 'progress');

  const [expandedId, setExpandedId] = useState(null);
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0 && !expandedId) {
      setExpandedId(products[0].id);
    }
  }, [products, expandedId]);

  const handleToggleAccordion = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleCheckboxChange = async (section, categoryId, choiceId, field) => {
    const categoriesList = section === 'top' ? topCategories : progressCategories;
    const category = categoriesList.find(c => c.id === categoryId);
    if (!category) return;
    const choice = category.choices.find(c => c.id === choiceId);
    if (!choice) return;

    const updatedValue = !choice[field];
    
    try {
      const updates = { [field]: updatedValue };
      await dispatch(updateProductChoice({ choiceId, updates })).unwrap();
      dispatch(fetchProducts());
      showSnackbar('Choice updated successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to update choice', 'error');
    }
  };

  const handleDeactivateCategory = async (section, categoryId) => {
    try {
      await dispatch(deleteProductCategory(categoryId)).unwrap();
      showSnackbar('Category deactivated successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to deactivate category', 'error');
    }
  };

  const handleDeactivateChoice = async (section, categoryId, choiceId) => {
    try {
      await dispatch(deleteProductChoice(choiceId)).unwrap();
      showSnackbar('Choice deactivated successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to deactivate choice', 'error');
    }
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

  const handleSaveInlineChoice = async () => {
    if (!inlineChoiceDraft.name) return;

    try {
      await dispatch(addProductChoice({
        categoryId: editingCategoryId,
        choiceData: {
          name: inlineChoiceDraft.name,
          isDefault: inlineChoiceDraft.isDefault,
          quickList: inlineChoiceDraft.quickList,
          isRecommended: inlineChoiceDraft.isRecommended,
          price: inlineChoiceDraft.price || '0.0',
          code: inlineChoiceDraft.code || '',
        }
      })).unwrap();
      dispatch(fetchProducts());
      showSnackbar('Choice added successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to add choice', 'error');
    } finally {
      handleCancelInlineChoice();
    }
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

  const handleSaveInlineProduct = async () => {
    if (!productDraftName) return;

    try {
      const section = isAddingProductInSection;
      const created = await dispatch(addProductCategory({ name: productDraftName, section })).unwrap();
      setExpandedId(created.id);
      showSnackbar('Category created successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to create category', 'error');
    } finally {
      handleCancelInlineProduct();
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 4, pt: 4, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B', mb: 0.5 }}>Products</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Manage your clinical products and categories.</Typography>
        </Box>
      </Box>

      {/* Main Content Container */}
      <Box sx={{ px: 4 }}>
        
        {/* Top Categories Section */}
        <Typography variant="h6" sx={{ color: '#1e293b', mb: 2, fontWeight: 700, fontSize: '1.1rem' }}>
          Top Categories
        </Typography>
      {topCategories.map((category) => (
        <CategoryAccordion
          key={category.id}
          category={category}
          section="top"
          expandedId={expandedId}
          handleToggleAccordion={handleToggleAccordion}
          handleOpenSyncDialog={handleOpenSyncDialog}
          handleDeactivateCategory={handleDeactivateCategory}
          handleCheckboxChange={handleCheckboxChange}
          handleDeactivateChoice={handleDeactivateChoice}
          editingCategoryId={editingSection === 'top' ? editingCategoryId : null}
          inlineChoiceDraft={inlineChoiceDraft}
          setInlineChoiceDraft={setInlineChoiceDraft}
          handleSaveInlineChoice={handleSaveInlineChoice}
          handleCancelInlineChoice={handleCancelInlineChoice}
          handleStartInlineChoice={handleStartInlineChoice}
        />
      ))}

      {/* Add New Product for Top Section */}
      <Box sx={{ mt: 2, mb: 5 }}>
        <Button
          variant="outlined"
          onClick={() => handleStartInlineProduct('top')}
          sx={{
            textTransform: 'none',
            borderRadius: radius.md,
            fontFamily: 'Inter',
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: COLORS.ACCENT,
            borderColor: COLORS.ACCENT,
            '&:hover': { backgroundColor: COLORS.BACKGROUND, borderColor: COLORS.ACCENT_HOVER },
            px: 3,
          }}
        >
          + Add New Product
        </Button>
      </Box>

      {/* Progress Notes Section */}
      <Divider sx={{ my: 4, borderColor: '#f1f5f9' }} />
      <Typography
        variant="h6"
        sx={{
          color: '#1e293b',
          mb: 2,
          fontWeight: 700,
          fontSize: '1.1rem',
        }}
      >
        Progress Notes
      </Typography>
      {progressCategories.map((category) => (
        <CategoryAccordion
          key={category.id}
          category={category}
          section="progress"
          expandedId={expandedId}
          handleToggleAccordion={handleToggleAccordion}
          handleOpenSyncDialog={handleOpenSyncDialog}
          handleDeactivateCategory={handleDeactivateCategory}
          handleCheckboxChange={handleCheckboxChange}
          handleDeactivateChoice={handleDeactivateChoice}
          editingCategoryId={editingSection === 'progress' ? editingCategoryId : null}
          inlineChoiceDraft={inlineChoiceDraft}
          setInlineChoiceDraft={setInlineChoiceDraft}
          handleSaveInlineChoice={handleSaveInlineChoice}
          handleCancelInlineChoice={handleCancelInlineChoice}
          handleStartInlineChoice={handleStartInlineChoice}
        />
      ))}

      {/* Add New Product for Progress Section */}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleStartInlineProduct('progress')}
          sx={{
            textTransform: 'none',
            borderRadius: radius.md,
            fontFamily: 'Inter',
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: COLORS.ACCENT,
            borderColor: COLORS.ACCENT,
            '&:hover': { backgroundColor: COLORS.BACKGROUND, borderColor: COLORS.ACCENT_HOVER },
            px: 3,
          }}
        >
          + Add New Product
        </Button>
      </Box>
      
      </Box>

      {/* Sync Dialog */}
      <SyncOfficesDialog open={isSyncDialogOpen} onClose={handleCloseSyncDialog} />

      {/* Add Category Dialog */}
      <AddCategoryDialog
        open={Boolean(isAddingProductInSection)}
        productDraftName={productDraftName}
        setProductDraftName={setProductDraftName}
        handleSaveInlineProduct={handleSaveInlineProduct}
        handleCancelInlineProduct={handleCancelInlineProduct}
      />
    </Box>
  );
};

export default ProductsManagement;
