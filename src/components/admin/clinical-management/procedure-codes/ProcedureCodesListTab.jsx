import { Box, Typography, TextField, CircularProgress, Button } from '@mui/material';

const ProcedureCodesListTab = ({
  searchQuery,
  setSearchQuery,
  fetchProcedureCodes,
  loading,
  localCustomCodes,
  procedureCodes,
  INITIAL_CODES_TAB,
  handleToggleCodesCategory,
  expandedCodesCategories,
  handleOpenAddCustomCode,
  expandedSubTypes,
  handleToggleSubType,
  loadingSubTypes,
  getProcedureCodesForSubType
}) => {
  return (
    <Box sx={{ mt: 3, backgroundColor: '#fff', borderRadius: 3, p: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      {/* Search Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, pl: 1 }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Search Procedure</Typography>
        <TextField
          placeholder="Enter code or procedure"
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value) fetchProcedureCodes();
          }}
          sx={{
            width: 350,
            "& .MuiInputBase-root": { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#fff" },
            "& .MuiInputBase-input": { color: "#374151", py: "8.5px" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" }
          }}
        />
      </Box>

      {/* Categories or Search Results */}
      <Box sx={{ pl: 1 }}>
        {searchQuery ? (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>
            ) : [
               ...localCustomCodes.filter(c => 
                 c.ProcCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 c.Descript.toLowerCase().includes(searchQuery.toLowerCase())
               ),
               ...procedureCodes
             ].map((sub, subIdx) => (
                <Box key={subIdx} sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s', '&:hover': { backgroundColor: '#f8fafc' }, px: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                    <Typography sx={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: 600 }}>+</Typography>
                    <Typography sx={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 500 }}>
                      {sub.ProcCode} - {sub.Descript}
                    </Typography>
                  </Box>
                </Box>
             ))}
           </Box>
        ) : (
          INITIAL_CODES_TAB.map((category, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Box 
                onClick={() => handleToggleCodesCategory(category.name)}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  py: 1.2, 
                  cursor: 'pointer',
                  backgroundColor: expandedCodesCategories.includes(category.name) ? '#f8fafc' : '#fff',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: expandedCodesCategories.includes(category.name) ? '#e2e8f0' : 'transparent',
                  px: 2,
                  transition: 'all 0.2s',
                  '&:hover': { backgroundColor: '#f8fafc' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 600, width: 24, mr: 0.5 }}>
                    {expandedCodesCategories.includes(category.name) ? '−' : '+'}
                  </Typography>
                  <Typography sx={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 600, mr: 2 }}>
                    {category.name}
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAddCustomCode(category.name);
                    }}
                    sx={{
                      fontFamily: "Inter", fontSize: "12px", fontWeight: 500,
                      textTransform: "none", borderRadius: "8px",
                      border: "1px solid #d0d5dd", color: "#374151",
                      px: "12px", py: "4px",
                      "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
                    }}
                  >
                    + Add Custom Code
                  </Button>
                </Box>
              </Box>

              {expandedCodesCategories.includes(category.name) && (
                <Box sx={{ pl: 3, mt: 1, borderLeft: '2px solid #e2e8f0', ml: 2.5 }}>
                  {category.subItems && category.subItems.length > 0 ? (
                    category.subItems.map((subItem, subIdx) => {
                      const isSubTypeExpanded = expandedSubTypes.includes(subItem);
                      return (
                        <Box key={subIdx} sx={{ mb: 1 }}>
                          {/* SubType Header Row */}
                          <Box
                            onClick={() => handleToggleSubType(subItem)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              py: 1,
                              px: 1.5,
                              cursor: 'pointer',
                              borderRadius: 2,
                              backgroundColor: isSubTypeExpanded ? '#f8fafc' : 'transparent',
                              transition: 'background-color 0.2s',
                              '&:hover': { backgroundColor: '#f8fafc' },
                            }}
                          >
                            <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 600, width: 24, mr: 0.5 }}>
                              {isSubTypeExpanded ? '−' : '+'}
                            </Typography>
                            <Typography sx={{ color: '#334155', fontSize: '0.85rem', fontWeight: 600, mr: 2 }}>
                              {subItem}
                            </Typography>
                            <Button
                              variant="text"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenAddCustomCode(subItem);
                              }}
                              sx={{
                                fontFamily: "Inter", fontSize: "12px", fontWeight: 500,
                                textTransform: "none", borderRadius: "8px",
                                border: "1px solid #d0d5dd", color: "#374151",
                                px: "12px", py: "4px",
                                "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
                              }}
                            >
                              + Add Custom Code
                            </Button>
                          </Box>

                          {/* SubType Expanded Procedure Codes */}
                          {isSubTypeExpanded && (
                            <Box sx={{ pl: 3, borderLeft: '1px dashed #cbd5e1', ml: 1.5, mt: 0.5, mb: 1.5 }}>
                              {loadingSubTypes[subItem] ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                  <CircularProgress size={20} />
                                </Box>
                              ) : (
                                <Box>
                                  {(getProcedureCodesForSubType(subItem) || []).length === 0 ? (
                                    <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', py: 1 }}>
                                      No procedure codes
                                    </Typography>
                                  ) : (
                                    (getProcedureCodesForSubType(subItem) || []).map((sub, codeIdx) => (
                                      <Box key={codeIdx} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #f1f5f9' }}>
                                        <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem', mr: 1 }}>+</Typography>
                                        <Typography sx={{ color: '#475569', fontSize: '0.85rem', fontWeight: 500 }}>
                                          {sub.ProcCode} - {sub.Descript}
                                        </Typography>
                                      </Box>
                                    ))
                                  )}
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>
                      );
                    })
                  ) : (
                    <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', py: 1 }}>
                      No sub-items available
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ProcedureCodesListTab;
