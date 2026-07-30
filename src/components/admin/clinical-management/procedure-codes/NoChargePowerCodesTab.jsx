import { Box, Typography, Button, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { ChevronRight as ChevronRightIcon, KeyboardArrowDown as KeyboardArrowDownIcon, Check as CheckIcon, InfoOutlined as InfoIcon } from '@mui/icons-material';

const NoChargePowerCodesTab = ({
  includeInactive,
  setIncludeInactive,
  handleResetCategories,
  loadingCategories,
  categories,
  expandedCategories,
  toggleCategory,
  renderSubItem,
  handleAddPowerCode
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
              sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
            />
          }
          label={<Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Include Inactive Codes</Typography>}
        />
        <Button
          variant="outlined"
          onClick={handleResetCategories}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            height: 36,
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Reset Power Codes
        </Button>
      </Box>

      {loadingCategories ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Box sx={{ pl: 1 }}>
          {categories.map((cat, catIdx) => (
            <Box key={catIdx} sx={{ mb: 2 }}>
              {cat.isHeader ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, py: 1.5, mt: 1, borderBottom: '1px solid #e2e8f0' }}>
                  <Typography sx={{ color: '#0f172a', fontSize: '1rem', fontWeight: 700 }}>
                    {cat.name}
                  </Typography>
                  {cat.hasInfo && <InfoIcon sx={{ color: '#94a3b8', fontSize: '1.1rem', ml: 0.5 }} />}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.5,
                    px: 2,
                    cursor: 'pointer',
                    backgroundColor: expandedCategories.includes(cat.name) ? '#f8fafc' : '#fff',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: expandedCategories.includes(cat.name) ? '#e2e8f0' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': { backgroundColor: '#f8fafc' }
                  }}
                  onClick={() => toggleCategory(cat.name)}
                >
                  {expandedCategories.includes(cat.name) ? (
                    <KeyboardArrowDownIcon sx={{ color: '#64748b', fontSize: '1.3rem' }} />
                  ) : (
                    <ChevronRightIcon sx={{ color: '#64748b', fontSize: '1.3rem' }} />
                  )}
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#2563eb', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckIcon sx={{ color: '#fff', fontSize: '0.9rem' }} />
                  </Box>
                  <Typography sx={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 600 }}>{cat.name}</Typography>
                  {cat.hasInfo && <InfoIcon sx={{ color: '#94a3b8', fontSize: '1rem', ml: 0.5 }} />}
                </Box>
              )}

              {expandedCategories.includes(cat.name) && !cat.isHeader && (
                <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #e2e8f0', ml: 3 }}>
                  {cat.subItems?.map((item, itemIdx) => (
                    <Box key={itemIdx}>{renderSubItem(catIdx, itemIdx, item)}</Box>
                  ))}
                  {cat.subItems && (
                    <Box sx={{ mt: 2, mb: 1, pl: 3.5 }}>
                      <Button
                        variant="text"
                        onClick={() => handleAddPowerCode(catIdx)}
                        sx={{
                          fontFamily: "Inter", fontSize: "12px", fontWeight: 500,
                          textTransform: "none", borderRadius: "8px",
                          border: "1px solid #d0d5dd", color: "#374151",
                          px: "12px", py: "4px",
                          "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
                        }}
                      >
                        + Add Power Code
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default NoChargePowerCodesTab;
