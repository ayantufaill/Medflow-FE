import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInstructionTemplates,
  addInstructionTemplate,
  updateInstructionTemplate,
  deleteInstructionTemplate,
  selectInstructionTemplates,
  selectLoadingInstructions
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { Box } from '@mui/material';

import PrePostOpsHeader from '../../components/admin/clinical-management/pre-post-ops/PrePostOpsHeader';
import PrePostOpsList from '../../components/admin/clinical-management/pre-post-ops/PrePostOpsList';
import PrePostOpsForm from '../../components/admin/clinical-management/pre-post-ops/PrePostOpsForm';

const mapBackendToFrontend = (backend) => {
  let contentData = {};
  try {
    if (backend.content) {
      contentData = JSON.parse(backend.content);
    }
  } catch (e) {
    contentData = { description: backend.content || '' };
  }
  return {
    id: backend.id || backend.TemplateId?.toString(),
    name: backend.name || '',
    type: backend.type || 'Post Operation',
    procedures: contentData.procedures || 'General',
    description: contentData.description || '',
    sendHours: contentData.sendHours || '',
    sendUnit: contentData.sendUnit || 'hours',
    fileOption: contentData.fileOption || 'Upload PDF'
  };
};

const PrePostOps = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog State
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [prePostOps, setPrePostOps] = useState([]);
  
  const instructionTemplates = useSelector(selectInstructionTemplates);
  const loading = useSelector(selectLoadingInstructions);
  
  const [editingId, setEditingId] = useState(null);

  // Form State for Add screen
  const [type, setType] = useState('Post Operation');
  const [sendHours, setSendHours] = useState('');
  const [sendUnit, setSendUnit] = useState('hours');
  const [fileOption, setFileOption] = useState('Upload PDF');
  const [docName, setDocName] = useState('');
  const [procedures, setProcedures] = useState('');

  useEffect(() => {
    dispatch(fetchInstructionTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (instructionTemplates) {
      setPrePostOps(instructionTemplates.map(mapBackendToFrontend));
    } else {
      setPrePostOps([]);
    }
  }, [instructionTemplates]);

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const handleDeleteOp = async (id) => {
    if (id && !id.toString().startsWith('m')) {
      try {
        await dispatch(deleteInstructionTemplate(id)).unwrap();
        dispatch(fetchInstructionTemplates());
        showSnackbar('Instruction template deleted successfully', 'success');
      } catch (e) {
        console.error(e);
        showSnackbar('Failed to delete template', 'error');
        return;
      }
    } else {
      setPrePostOps(prePostOps.filter(op => op.id !== id));
    }
  };

  const handleEditDocument = (op) => {
    setEditingId(op.id);
    setType(op.type);
    setSendHours(op.sendHours);
    setSendUnit(op.sendUnit);
    setFileOption(op.fileOption);
    setDocName(op.name);
    setProcedures(op.procedures);
    setAddDialogOpen(true);
  };

  const handleSaveDocument = async () => {
    if (!docName) return;
    const desc = `${type} instructions. Send ${sendHours || '0'} ${sendUnit} after appointment. Mode: ${fileOption}`;
    const contentObj = {
      procedures: procedures || 'General',
      description: desc,
      sendHours: sendHours,
      sendUnit: sendUnit,
      fileOption: fileOption
    };

    try {
      if (editingId && !editingId.toString().startsWith('m')) {
        await dispatch(updateInstructionTemplate({
          templateId: editingId,
          updates: {
            name: docName,
            type: type,
            content: JSON.stringify(contentObj)
          }
        })).unwrap();
        dispatch(fetchInstructionTemplates());
        showSnackbar('Instruction template updated successfully', 'success');
      } else {
        await dispatch(addInstructionTemplate({
          name: docName,
          type: type,
          content: JSON.stringify(contentObj)
        })).unwrap();
        dispatch(fetchInstructionTemplates());
        showSnackbar('Instruction template created successfully', 'success');
      }
      
      // Reset Form and return to list
      setEditingId(null);
      setDocName('');
      setProcedures('');
      setSendHours('');
      setType('Post Operation');
      setFileOption('Upload PDF');
      setAddDialogOpen(false);
    } catch (e) {
      console.error(e);
      showSnackbar('Failed to save instruction template', 'error');
    }
  };

  const filteredOps = prePostOps.filter(op => 
    op.name.toLowerCase().includes(searchQuery) || 
    op.procedures.toLowerCase().includes(searchQuery)
  );

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', p: 4 }}>
      <PrePostOpsHeader
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        setAddDialogOpen={setAddDialogOpen}
        navigate={navigate}
      />
      <PrePostOpsList
        filteredOps={filteredOps}
        handleEditDocument={handleEditDocument}
        handleDeleteOp={handleDeleteOp}
      />
      
      <PrePostOpsForm
        open={isAddDialogOpen}
        type={type}
        setType={setType}
        sendHours={sendHours}
        setSendHours={setSendHours}
        sendUnit={sendUnit}
        setSendUnit={setSendUnit}
        fileOption={fileOption}
        setFileOption={setFileOption}
        docName={docName}
        setDocName={setDocName}
        procedures={procedures}
        setProcedures={setProcedures}
        handleSaveDocument={handleSaveDocument}
        handleClose={() => setAddDialogOpen(false)}
        editingId={editingId}
      />
    </Box>
  );
};

export default PrePostOps;
