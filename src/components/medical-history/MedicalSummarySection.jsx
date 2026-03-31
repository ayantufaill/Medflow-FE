import { useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Tabs, Tab } from "@mui/material";
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
          {summarySections.length ? (
            summarySections.map((section) => (
              <Paper
                key={`${section.number}-${section.question}`}
                variant="outlined"
                sx={{ p: 2, borderColor: "grey.300" }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {section.number ? `${section.number}. ` : ""}
                  {section.question}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  Answer: {section.answer || "—"}
                </Typography>
                {section.comment ? (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {section.comment}
                  </Typography>
                ) : null}
                {section.doctorNote ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    Doctor&apos;s Note: {section.doctorNote}
                  </Typography>
                ) : null}
              </Paper>
            ))
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