import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Sync as SyncIcon } from '@mui/icons-material';
import ChoiceTableRow from './ChoiceTableRow';
import ChoiceInlineForm from './ChoiceInlineForm';

const CategoryAccordion = ({
  category,
  section,
  expandedId,
  handleToggleAccordion,
  handleOpenSyncDialog,
  handleDeactivateCategory,
  handleCheckboxChange,
  handleDeactivateChoice,
  editingCategoryId,
  inlineChoiceDraft,
  setInlineChoiceDraft,
  handleSaveInlineChoice,
  handleCancelInlineChoice,
  handleStartInlineChoice
}) => {
  return (
    <Box sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', overflow: 'hidden', backgroundColor: '#fff' }}>
      <Accordion
        expanded={expandedId === category.id}
        onChange={() => handleToggleAccordion(category.id)}
        disableGutters
        sx={{
          boxShadow: 'none',
          '&:before': { display: 'none' },
          border: 'none',
          backgroundColor: 'transparent',
          '& .MuiAccordionSummary-root': {
            minHeight: 48,
            px: 2,
            backgroundColor: expandedId === category.id ? '#f8fafc' : 'transparent',
            borderBottom: expandedId === category.id ? '1px solid #e2e8f0' : 'none',
            transition: 'background-color 0.2s',
            '&:hover': { backgroundColor: '#f8fafc' }
          },
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: '#64748b',
                fontSize: '1.4rem',
                transform: expandedId === category.id ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.3s'
              }}
            />
          }
          sx={{
            flexDirection: 'row-reverse',
            gap: 1.5,
          }}
        >
          <Typography sx={{ color: '#0f172a', fontWeight: 600, fontSize: '0.95rem' }}>
            {category.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 2, px: 3, pb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
            <Button
              size="small"
              onClick={handleOpenSyncDialog}
              startIcon={<SyncIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.8rem',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#f1f5f9', color: '#0f172a' },
                px: 2
              }}
            >
              Sync
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleDeactivateCategory(section, category.id)}
              sx={{
                textTransform: 'none',
                color: '#ef4444',
                borderColor: '#fca5a5',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#fef2f2', borderColor: '#ef4444' },
                fontSize: '0.75rem',
                minWidth: 80,
                borderRadius: 2,
              }}
            >
              Deactivate
            </Button>
          </Box>

          <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small" sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f1f5f9', py: 1, px: 2 } }}>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748b', width: '30%', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Choice Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Is Default</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick List</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommended</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Code</TableCell>
                  <TableCell sx={{ width: 100 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {category.choices.map((choice) => (
                  <ChoiceTableRow
                    key={choice.id}
                    choice={choice}
                    section={section}
                    categoryId={category.id}
                    handleCheckboxChange={handleCheckboxChange}
                    handleDeactivateChoice={handleDeactivateChoice}
                  />
                ))}

                {/* Inline Choice Draft Row */}
                {editingCategoryId === category.id && (
                  <ChoiceInlineForm
                    inlineChoiceDraft={inlineChoiceDraft}
                    setInlineChoiceDraft={setInlineChoiceDraft}
                    handleSaveInlineChoice={handleSaveInlineChoice}
                    handleCancelInlineChoice={handleCancelInlineChoice}
                  />
                )}

                <TableRow>
                  <TableCell colSpan={7} sx={{ pt: 2, pb: 1, borderBottom: 'none' }}>
                    {!editingCategoryId && (
                      <Button
                        variant="text"
                        onClick={() => handleStartInlineChoice(section, category.id)}
                        sx={{
                          textTransform: 'none',
                          color: '#2563eb',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          borderRadius: 2,
                          '&:hover': { backgroundColor: '#eff6ff' },
                        }}
                      >
                        + Add New Choice
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CategoryAccordion;
