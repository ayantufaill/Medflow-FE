import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConsentTemplates,
  addConsentTemplate,
  deleteConsentTemplate,
  selectConsentTemplates,
  selectLoadingConsent
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { Box } from '@mui/material';

import InformedConsentsHeader from '../../components/admin/clinical-management/informed-consents/InformedConsentsHeader';
import InformedConsentsList from '../../components/admin/clinical-management/informed-consents/InformedConsentsList';
import AddConsentDialog from '../../components/admin/clinical-management/informed-consents/AddConsentDialog';
import ViewConsentDialog from '../../components/admin/clinical-management/informed-consents/ViewConsentDialog';

const mapBackendToFrontend = (backend) => {
  let contentData = {};
  try {
    if (backend.content) {
      contentData = JSON.parse(backend.content);
    }
  } catch (e) {
    contentData = { procedures: [] };
  }
  return {
    id: backend.id || backend.TemplateId?.toString(),
    name: backend.name || '',
    procedures: contentData.procedures || [],
    signatures: contentData.signatures || { guardian: false, office: false, patient: false, witness: false, doctor: false, other: false },
    fileType: contentData.fileType || 'Upload PDF',
    isSystem: contentData.isSystem || false
  };
};

const InformedConsent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const [customExpanded, setCustomExpanded] = useState(true);
  const [systemExpanded, setSystemExpanded] = useState(true);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const templates = useSelector(selectConsentTemplates);
  const loading = useSelector(selectLoadingConsent);

  const [customConsents, setCustomConsents] = useState([]);
  const [systemConsents, setSystemConsents] = useState([]);

  const [newConsentDraft, setNewConsentDraft] = useState({
    name: '',
    procedures: '',
    fileType: 'Upload PDF',
    selectedFile: null,
    signatures: { guardian: false, office: false, patient: false, witness: false, doctor: false, other: false }
  });

  useEffect(() => {
    dispatch(fetchConsentTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (templates && templates.length > 0) {
      const loaded = templates.map(mapBackendToFrontend);
      setCustomConsents(loaded.filter(c => !c.isSystem));
      setSystemConsents(loaded.filter(c => c.isSystem));
    } else {
      setCustomConsents([]);
      setSystemConsents([]);
    }
  }, [templates]);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNewConsentDraft({ ...newConsentDraft, selectedFile: file });
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const filteredCustom = customConsents.filter(c => c.name.toLowerCase().includes(searchQuery));
  const filteredSystem = systemConsents.filter(c => c.name.toLowerCase().includes(searchQuery));

  const handleDeleteCustom = async (idx) => {
    const item = customConsents[idx];
    if (item.id && !item.id.toString().startsWith('c_')) {
      try {
        await dispatch(deleteConsentTemplate(item.id)).unwrap();
        dispatch(fetchConsentTemplates());
        showSnackbar('Consent template deleted successfully', 'success');
      } catch (e) {
        console.error(e);
        showSnackbar('Failed to delete consent template', 'error');
        return;
      }
    }
    setCustomConsents(customConsents.filter((_, i) => i !== idx));
  };

  const handleDeleteSystem = async (idx) => {
    const item = systemConsents[idx];
    if (item.id && !item.id.toString().startsWith('s_')) {
      try {
        await dispatch(deleteConsentTemplate(item.id)).unwrap();
        dispatch(fetchConsentTemplates());
        showSnackbar('Consent template deleted successfully', 'success');
      } catch (e) {
        console.error(e);
        showSnackbar('Failed to delete consent template', 'error');
        return;
      }
    }
    setSystemConsents(systemConsents.filter((_, i) => i !== idx));
  };

  const handleViewConsent = (consent) => {
    setSelectedConsent(consent);
    setViewDialogOpen(true);
  };

  const handleSaveConsent = async () => {
    if (newConsentDraft.name) {
      try {
        const procedureParts = newConsentDraft.procedures.split('-').map(s => s.trim());
        const procs = [{ 
          code: procedureParts[0] || 'N/A', 
          desc: procedureParts[1] || procedureParts[0] || 'No description' 
        }];

        const contentObj = {
          procedures: procs,
          signatures: newConsentDraft.signatures,
          fileType: newConsentDraft.fileType,
          isSystem: false
        };

        await dispatch(addConsentTemplate({ name: newConsentDraft.name, content: JSON.stringify(contentObj) })).unwrap();
        dispatch(fetchConsentTemplates());
        setAddDialogOpen(false);
        showSnackbar('Consent template created successfully', 'success');

        // Reset state
        setNewConsentDraft({
          name: '',
          procedures: '',
          fileType: 'Upload PDF',
          selectedFile: null,
          signatures: { guardian: false, office: false, patient: false, witness: false, doctor: false, other: false }
        });
      } catch (e) {
        console.error(e);
        showSnackbar('Failed to create consent template', 'error');
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      <Box sx={{ px: 4, pt: 4 }}>
        <InformedConsentsHeader 
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          setAddDialogOpen={setAddDialogOpen}
          navigate={navigate}
        />

        <InformedConsentsList 
          customExpanded={customExpanded}
          setCustomExpanded={setCustomExpanded}
          systemExpanded={systemExpanded}
          setSystemExpanded={setSystemExpanded}
          filteredCustom={filteredCustom}
          filteredSystem={filteredSystem}
          handleDeleteCustom={handleDeleteCustom}
          handleDeleteSystem={handleDeleteSystem}
          handleViewConsent={handleViewConsent}
        />
      </Box>

      <AddConsentDialog 
        isAddDialogOpen={isAddDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        newConsentDraft={newConsentDraft}
        setNewConsentDraft={setNewConsentDraft}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        handleSaveConsent={handleSaveConsent}
      />

      <ViewConsentDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        consent={selectedConsent}
      />
    </Box>
  );
};

export default InformedConsent;
