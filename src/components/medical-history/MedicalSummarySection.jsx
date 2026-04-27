import { useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Tabs, Tab, IconButton, Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Edit as EditIcon, Check as CheckIcon, InfoOutlined as InfoIcon } from "@mui/icons-material";
import Card from "../shared/Card";
import MedicationListCard from "../patients/MedicationListCard";

const MedicalSummarySection = ({
  historyTab,
  onChangeTab,
  summarySections,
  onSectionChange,
  medications,
  onChangeMedication,
  onAddMedication,
  supplements,
  onChangeSupplement,
  onAddSupplement,
}) => {
  const [editingSectionId, setEditingSectionId] = useState(null);

  const toggleEdit = (id) => {
    setEditingSectionId(editingSectionId === id ? null : id);
  };

  const lineStyle = {
    border: 'none',
    borderBottom: '1px solid #9e9e9e',
    outline: 'none',
    width: '200px',
    fontSize: '13px',
    padding: '0 4px',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    marginLeft: '8px'
  };

  const labelStyle = {
    fontSize: '12px',
    color: '#333',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
    fontWeight: 600
  };

  return (
    <Card>
      <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 2 }}>
        <Tabs
          value={historyTab}
          onChange={(_, v) => onChangeTab(v)}
          TabIndicatorProps={{ style: { height: 3 } }}
        >
          <Tab
            label="Summary"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              minHeight: 40,
            }}
          />
          <Tab
            label="Full Medical History"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              minHeight: 40,
            }}
          />
        </Tabs>
      </Box>

      {historyTab === 0 && (
        <Box>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              bgcolor: "#ffffff",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#fafafa" }}>
                  <TableCell sx={{ width: "55%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "#616161" }}
                      >
                        Personal History
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="caption">🟢 Low</Typography>
                        <Typography variant="caption">🟡 Moderate</Typography>
                        <Typography variant="caption">🔴 High</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "10%" }} align="center" />
                  <TableCell sx={{ width: "35%" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "#616161" }}
                    >
                      Additional information
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summarySections.map((section, index) => (
                  <TableRow
                    key={section.number || index}
                    sx={{
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#424242" }}
                      >
                        {section.number ? `${section.number}. ` : ""}
                        {section.question || "No question available"}
                      </Typography>
                      {section.scale && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color: "#9e9e9e",
                            mt: 0.5,
                          }}
                        >
                          on a scale of 1 to 10: {section.scale}
                        </Typography>
                      )}
                      
                      {/* Comment Field */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 0.5 }}>
                        <Typography sx={labelStyle}>Comment:</Typography>
                        <input 
                          style={lineStyle} 
                          value={section.comment || ""} 
                          onChange={(e) =>
                            onSectionChange(
                              section.id || section.number || index,
                              "comment",
                              e.target.value,
                            )
                          }
                        />
                      </Box>
                      
                      {/* Doctor's Notes Field */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                        <Typography sx={labelStyle}>Doctor's Note:</Typography>
                        <input 
                          style={lineStyle} 
                          value={section.doctorNote || ""} 
                          onChange={(e) =>
                            onSectionChange(
                              section.id || section.number || index,
                              "doctorNote",
                              e.target.value,
                            )
                          }
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        variant="standard"
                        size="small"
                        value={section.answer || ""}
                        onChange={(e) =>
                          onSectionChange(
                            section.id || section.number || index,
                            "answer",
                            e.target.value,
                          )
                        }
                        InputProps={{ disableUnderline: true }}
                        sx={{
                          minWidth: 120,
                          "& .MuiInputBase-input": {
                            textAlign: "center",
                            fontSize: 14,
                            py: 0,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "#f5f5f5",
                        maxHeight: 120,
                        overflow: "auto",
                        verticalAlign: "top",
                      }}
                    >
                      <TextField
                        variant="standard"
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={3}
                        size="small"
                        value={section.additionalInfo || ""}
                        onChange={(e) =>
                          onSectionChange(
                            section.id || section.number || index,
                            "additionalInfo",
                            e.target.value,
                          )
                        }
                        InputProps={{ disableUnderline: true }}
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 14,
                            py: 0.5,
                          },
                          bgcolor: "transparent",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {!summarySections.length && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      No medical history questions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {historyTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {/* Personal History Header with Risk Indicators */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, borderBottom: '1px solid #e0e0e0', pb: 1, mb: 1, px: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>
              Personal History
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #4CAF50' }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>Low</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #FFC107' }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>Moderate</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #F44336' }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>High</Typography>
              </Box>
            </Box>
          </Box>
          {summarySections.length ? (
            summarySections.map((section, index) => {
              const isAllergyQuestion = section.number === 2;
              
              if (isAllergyQuestion) {
                return (
                  <Paper
                    key={`${section.number}-${section.question}`}
                    variant="outlined"
                    sx={{ 
                      p: 2, 
                      borderColor: "grey.300",
                      bgcolor: '#f8fbff', // Light blue background for emphasis
                      position: 'relative',
                      mb: 1.5
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#333' }}>
                          {section.number}.
                        </Typography>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#4A90E2', mb: 1.5 }}>
                            {section.question}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: -1 }}>
                            {['aspirin', 'ibuprofen', 'acetaminophen', 'codeine', 'penicillin'].map((item) => (
                              <FormControlLabel
                                key={item}
                                control={<Checkbox size="small" sx={{ py: 0.25 }} />}
                                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>{item}</Typography>}
                                sx={{ mb: -0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InfoIcon sx={{ fontSize: '1rem', color: '#999' }} />
                          <RadioGroup row defaultValue="no">
                            <FormControlLabel 
                              value="yes" 
                              control={<Radio size="small" sx={{ p: 0.5 }} />} 
                              label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Yes</Typography>} 
                              labelPlacement="start"
                              sx={{ ml: 0, mr: 1 }}
                            />
                            <FormControlLabel 
                              value="no" 
                              control={<Radio size="small" sx={{ p: 0.5 }} />} 
                              label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>No</Typography>} 
                              labelPlacement="start"
                              sx={{ ml: 0 }}
                            />
                          </RadioGroup>
                        </Box>
                        <Typography sx={{ color: '#4A90E2', fontSize: '0.85rem', cursor: 'pointer', mt: 0.5 }}>
                          Done
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              }

              const isEditing = editingSectionId === (section.id || section.number || index);
              
              return (
                <Paper
                  key={`${section.number}-${section.question}`}
                  variant="outlined"
                  sx={{ 
                    p: 2, 
                    borderColor: isEditing ? "primary.main" : "grey.300",
                    transition: '0.2s',
                    position: 'relative',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <IconButton 
                    size="small" 
                    onClick={() => toggleEdit(section.id || section.number || index)}
                    sx={{ 
                      position: 'absolute', 
                      right: 8, 
                      top: 8,
                      color: isEditing ? 'primary.main' : 'grey.400'
                    }}
                  >
                    {isEditing ? <CheckIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                  </IconButton>

                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a3353', mb: 1.5, pr: 4 }}>
                    {section.number ? `${section.number}. ` : ""}
                    {section.question}
                  </Typography>
                  
                  {isEditing ? (
                    <>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {/* Answer Field */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '150px' }}>
                          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Answer:</Typography>
                          <TextField
                            variant="standard"
                            size="small"
                            autoFocus
                            value={section.answer || ""}
                            onChange={(e) =>
                              onSectionChange(
                                section.id || section.number || index,
                                "answer",
                                e.target.value,
                              )
                            }
                            InputProps={{ 
                              disableUnderline: true,
                              sx: { fontSize: '13px', fontWeight: 600, color: '#334155' }
                            }}
                            sx={{
                              borderBottom: '1px solid #e2e8f0',
                              '&:hover': { borderBottomColor: '#94a3b8' },
                              minWidth: 80
                            }}
                          />
                        </Box>

                        {/* Comment Field */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: '250px' }}>
                          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Comment:</Typography>
                          <input 
                            style={{ ...lineStyle, width: '100%', marginLeft: 0, fontSize: '13px' }} 
                            value={section.comment || ""} 
                            onChange={(e) =>
                              onSectionChange(
                                section.id || section.number || index,
                                "comment",
                                e.target.value,
                              )
                            }
                            placeholder="Add comment..."
                          />
                        </Box>
                      </Box>

                      {/* Doctor's Note Field */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Doctor's Note:</Typography>
                        <input 
                          style={{ ...lineStyle, width: '100%', marginLeft: 0, fontSize: '13px', color: '#64748b' }} 
                          value={section.doctorNote || ""} 
                          onChange={(e) =>
                            onSectionChange(
                              section.id || section.number || index,
                              "doctorNote",
                              e.target.value,
                            )
                          }
                          placeholder="Enter clinical notes..."
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          <span style={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginRight: '4px' }}>Answer:</span> 
                          {section.answer || "—"}
                        </Typography>
                        {section.comment && (
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            <span style={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginRight: '4px' }}>Comment:</span> 
                            {section.comment}
                          </Typography>
                        )}
                      </Box>
                      {section.doctorNote && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#94a3b8', fontStyle: 'italic' }}>
                          <span style={{ fontWeight: 700, textTransform: 'uppercase', marginRight: '4px' }}>Doctor's Note:</span> 
                          {section.doctorNote}
                        </Typography>
                      )}
                    </>
                  )}
                </Paper>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
              Full medical history is not available for this patient yet.
            </Typography>
          )}
        </Box>
      )}

      {/* Medication List Section */}
      <Box sx={{ mt: 3 }}>
        <MedicationListCard
          title="Medication List"
          rows={medications}
          onChangeRow={onChangeMedication}
          onAddRow={onAddMedication}
        />
      </Box>

      {/* Supplements & Vitamins Section */}
      <Box sx={{ mt: 2 }}>
        <MedicationListCard
          title="Supplements & Vitamins"
          rows={supplements}
          onChangeRow={onChangeSupplement}
          onAddRow={onAddSupplement}
        />
      </Box>
    </Card>
  );
};

export default MedicalSummarySection;