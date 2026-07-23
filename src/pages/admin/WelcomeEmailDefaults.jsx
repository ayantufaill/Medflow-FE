import { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Link, Button, TextField, Checkbox, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, FormControlLabel,
} from '@mui/material';
import { Search as SearchIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const defaultFormsInitial = [
  { name: 'Confidential', type: 'Onyx Form' },
  { name: 'Dental History', type: 'Onyx Form' },
  { name: 'HIPAA', type: 'Onyx Form' },
  { name: 'Medical History', type: 'Onyx Form' },
  { name: 'Pediatric Dental Hx', type: 'Onyx Form' },
  { name: 'Pediatric Medical Hx', type: 'Onyx Form' },
  { name: 'TDS Financial Agreement', type: 'Custom Form' },
  { name: 'Elective to Self Pay', type: 'Custom Form' },
  { name: 'HIPAA 2026', type: 'Custom Form' },
];

const updateFormsInitial = [
  { name: 'Confidential', checked: true, type: 'Onyx Form' },
  { name: 'Dental History', checked: false, type: 'Onyx Form' },
  { name: 'HIPAA', checked: false, type: 'Onyx Form' },
  { name: 'Medical History', checked: true, type: 'Onyx Form' },
  { name: 'Pediatric Dental Hx', checked: false, type: 'Onyx Form' },
  { name: 'Pediatric Medical Hx', checked: true, type: 'Onyx Form' },
  { name: 'TDS Financial Agreement', checked: true, type: 'Custom Form' },
  { name: 'Elective to Self Pay', checked: false, type: 'Custom Form' },
  { name: 'HIPAA 2026', checked: false, type: 'Custom Form' },
];

const availableForms = [
  'COVID 19', 'KOR Whitening Informed Consent', 'Kor Whitening Post op sensitivity',
  'Composite (tooth colored restoration) Informed Consent', 'N2O (Nitrous Oxide) Sedation Informed Consent',
  'Acknowledgement of Non-Services Agreement', 'Biochar Rejuvenating Alternative Informed Consent',
  'TDS School Absence Form (returning to Work/school same day)', 'Patient Referral',
  'TDS School Absence Form (not returning)', 'Crown and Bridge Informed Consent',
  'Recement Permanent Crown Informed Consent', 'Tooth Extraction Informed Consent',
];

const SortableDefaultRow = ({ form, tCellSx }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: form.name });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging ? '#f8fafc' : undefined,
    zIndex: isDragging ? 10 : 0,
    position: isDragging ? 'relative' : undefined,
  };
  return (
    <TableRow ref={setNodeRef} style={style} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell sx={{ ...tCellSx, width: 40, pr: 0 }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'inline-flex' }}>
          <DragIndicatorIcon sx={{ fontSize: '1.1rem', color: '#CBD5E1' }} />
        </div>
      </TableCell>
      <TableCell sx={{ ...tCellSx, color: '#3B82F6', fontWeight: 500, fontSize: '0.85rem' }}>{form.name}</TableCell>
      <TableCell sx={{ ...tCellSx, color: '#64748B', fontSize: '0.85rem' }}>{form.type}</TableCell>
    </TableRow>
  );
};

const SortableUpdateRow = ({ form, tCellSx, onToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: form.name });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging ? '#f8fafc' : undefined,
    zIndex: isDragging ? 10 : 0,
    position: isDragging ? 'relative' : undefined,
  };
  return (
    <TableRow ref={setNodeRef} style={style} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell sx={{ ...tCellSx, width: 40, pr: 0 }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', display: 'inline-flex' }}>
          <DragIndicatorIcon sx={{ fontSize: '1.1rem', color: '#CBD5E1' }} />
        </div>
      </TableCell>
      <TableCell sx={{ ...tCellSx, color: '#3B82F6', fontWeight: 500, fontSize: '0.85rem' }}>{form.name}</TableCell>
      <TableCell sx={tCellSx}>
        <Checkbox 
          size="small" 
          checked={form.checked} 
          onChange={(e) => onToggle(e.target.checked)} 
          sx={{ p: 0.3, '&.Mui-checked': { color: '#2563EB' } }} 
          icon={<Box sx={{ width: 16, height: 16, border: '2px solid #CBD5E1', borderRadius: '4px' }} />}
          checkedIcon={<Box sx={{ width: 16, height: 16, bgcolor: '#2563EB', borderRadius: '4px' }} />}
        />
      </TableCell>
      <TableCell sx={{ ...tCellSx, color: '#64748B', fontSize: '0.85rem' }}>{form.type}</TableCell>
    </TableRow>
  );
};

const WelcomeEmailDefaults = ({ settings, setSettings }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [selectedForms, setSelectedForms] = useState([]);
  const [targetList, setTargetList] = useState('default');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!settings) return null;

  const currentSettings = settings.welcomeEmailDefaults || {
    pediatricAge: '12',
    defaultForms: defaultFormsInitial,
    updateForms: updateFormsInitial
  };

  const updateWelcomeSettings = (newPartial) => {
    setSettings(prev => {
      const current = prev.welcomeEmailDefaults || {
        pediatricAge: '12',
        defaultForms: defaultFormsInitial,
        updateForms: updateFormsInitial
      };
      return {
        ...prev,
        welcomeEmailDefaults: { ...current, ...newPartial }
      };
    });
  };

  const filteredForms = availableForms.filter(f => f.toLowerCase().includes(modalSearch.toLowerCase()));

  const toggleForm = (form) => {
    setSelectedForms(prev => prev.includes(form) ? prev.filter(f => f !== form) : [...prev, form]);
  };

  const handleAddForms = () => {
    if (targetList === 'default') {
      const newForms = selectedForms.map(name => ({ name, type: 'Custom Form' }));
      updateWelcomeSettings({ defaultForms: [...currentSettings.defaultForms, ...newForms] });
    } else {
      const newForms = selectedForms.map(name => ({ name, checked: false, type: 'Custom Form' }));
      updateWelcomeSettings({ updateForms: [...currentSettings.updateForms, ...newForms] });
    }
    setModalOpen(false);
    setSelectedForms([]);
    setModalSearch('');
  };

  const handleDragEndDefault = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = currentSettings.defaultForms.findIndex(f => f.name === active.id);
      const newIndex = currentSettings.defaultForms.findIndex(f => f.name === over.id);
      updateWelcomeSettings({ defaultForms: arrayMove(currentSettings.defaultForms, oldIndex, newIndex) });
    }
  };

  const handleDragEndUpdate = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = currentSettings.updateForms.findIndex(f => f.name === active.id);
      const newIndex = currentSettings.updateForms.findIndex(f => f.name === over.id);
      updateWelcomeSettings({ updateForms: arrayMove(currentSettings.updateForms, oldIndex, newIndex) });
    }
  };

  const toggleUpdateFormCheck = (index, checked) => {
    const arr = [...currentSettings.updateForms];
    arr[index].checked = checked;
    updateWelcomeSettings({ updateForms: arr });
  };

  const tHeadSx = { bgcolor: '#F4F7FB', color: '#334155', fontWeight: 700, fontSize: '0.7rem', py: 1.5, borderBottom: 'none' };
  const tCellSx = { fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #f1f5f9' };

  return (
    <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '8px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#F4F7FB', px: 3, py: 1.5, borderBottom: '1px solid #E5E9F2' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B' }}>Welcome/Update Email Defaults</Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Age filter */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 1.5 }}>Send pediatric forms to patients below the age of:</Typography>
          <TextField 
            size="small" 
            value={currentSettings.pediatricAge} 
            onChange={(e) => updateWelcomeSettings({ pediatricAge: e.target.value })} 
            sx={{ width: 60, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem', borderRadius: '6px' } }} 
          />
        </Box>

        {/* Two-column tables */}
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Left — Default Welcome Email Forms */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', mb: 0.5 }}>Default Welcome Email Forms</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 2 }}>Forms in the list will be sent out with the welcome email</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...tHeadSx, width: 40, borderTopLeftRadius: '6px' }}></TableCell>
                    <TableCell sx={tHeadSx}>WELCOME EMAIL FORMS</TableCell>
                    <TableCell sx={{ ...tHeadSx, borderTopRightRadius: '6px' }}>TYPE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndDefault}>
                    <SortableContext items={currentSettings.defaultForms.map(f => f.name)} strategy={verticalListSortingStrategy}>
                      {currentSettings.defaultForms.map((form) => (
                        <SortableDefaultRow key={form.name} form={form} tCellSx={tCellSx} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </TableBody>
              </Table>
            </TableContainer>
            <Link href="#" underline="hover" onClick={(e) => { e.preventDefault(); setTargetList('default'); setModalOpen(true); }}
              sx={{ fontSize: '0.85rem', color: '#3B82F6', fontWeight: 600, mt: 2, display: 'inline-flex', alignItems: 'center' }}>
              + Add More Forms
            </Link>
          </Box>

          {/* Right — Update Request Appearance */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', mb: 0.5 }}>Update Request Appearance</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 2 }}>Choose what forms appear under the update request option</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...tHeadSx, width: 40, borderTopLeftRadius: '6px' }}></TableCell>
                    <TableCell sx={tHeadSx}>INCLUDE IN UPDATE REQUEST LIST</TableCell>
                    <TableCell sx={tHeadSx}>CHECKED BY DEFAULT</TableCell>
                    <TableCell sx={{ ...tHeadSx, borderTopRightRadius: '6px' }}>TYPE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndUpdate}>
                    <SortableContext items={currentSettings.updateForms.map(f => f.name)} strategy={verticalListSortingStrategy}>
                      {currentSettings.updateForms.map((form, i) => (
                        <SortableUpdateRow 
                          key={form.name} 
                          form={form} 
                          tCellSx={tCellSx} 
                          onToggle={(checked) => toggleUpdateFormCheck(i, checked)} 
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </TableBody>
              </Table>
            </TableContainer>
            <Link href="#" underline="hover" onClick={(e) => { e.preventDefault(); setTargetList('update'); setModalOpen(true); }}
              sx={{ fontSize: '0.85rem', color: '#3B82F6', fontWeight: 600, mt: 2, display: 'inline-flex', alignItems: 'center' }}>
              + Add More Forms
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Add Custom Form Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: '#1a3a6b', color: '#fff', fontWeight: 700, fontSize: '0.95rem', py: 1.5 }}>
          Add Custom Form
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <TextField
            fullWidth size="small" placeholder="Search" value={modalSearch}
            onChange={(e) => setModalSearch(e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon sx={{ fontSize: '1rem', color: '#999' }} /></InputAdornment> }}
            sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { height: 36 } }}
          />
          <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
            {filteredForms.map((form, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 0.8, borderBottom: '1px solid #f0f0f0' }}>
                <Checkbox size="small" checked={selectedForms.includes(form)} onChange={() => toggleForm(form)} sx={{ p: 0.3, mr: 1 }} />
                <Typography sx={{ fontSize: '0.82rem' }}>{form}</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ textTransform: 'none', color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddForms}
            sx={{ bgcolor: '#2e7d32', textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b5e20' } }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WelcomeEmailDefaults;
