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
