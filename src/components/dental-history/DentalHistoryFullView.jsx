import { Box, Typography, Grid, Paper, TextField } from "@mui/material";

const getRiskColor = (value) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "high") return "#d32f2f";
  if (normalized === "moderate") return "#f9a825";
  return "#43a047";
};

const DentalHistoryFullView = ({ 
  groupedHistory,
  gumAndBoneGrouped = [],
  biteAndJawJointGrouped = [],
  onUpdateItem 
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 1,
        border: "1px solid #e0e0e0",
        bgcolor: "#ffffff",
      }}
    >
      {/* Personal History Section */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#424242", mb: 2, mt: 2 }}>
        Personal History
      </Typography>
      {groupedHistory.map(([groupName, rows]) => (
        <Box key={groupName} sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #eeeeee",
              pb: 1,
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#424242" }}>
              {groupName}
            </Typography>
            <Typography variant="caption" sx={{ color: "#757575" }}>
              {rows.length} question{rows.length === 1 ? "" : "s"}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {rows.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    borderColor: "#e0e0e0",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600, color: "#424242", flex: 1 }}>
                      {item.number || ""}. {item.question}
                    </Typography>
                    <Box
                      sx={{
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 999,
                        bgcolor: `${getRiskColor(item.scale || "low")}15`,
                        color: getRiskColor(item.scale || "low"),
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.scale || "low"}
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Answer"
                        value={item.answer || ""}
                        onChange={(e) => onUpdateItem(item.id, "answer", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Scale"
                        value={item.scale || ""}
                        onChange={(e) => onUpdateItem(item.id, "scale", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Doctor's Note"
                        value={item.note || ""}
                        onChange={(e) => onUpdateItem(item.id, "note", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        size="small"
                        label="Additional Information"
                        value={item.additionalInfo || ""}
                        onChange={(e) => onUpdateItem(item.id, "additionalInfo", e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {!groupedHistory.length ? (
        <Typography color="text.secondary">No personal dental history is available yet.</Typography>
      ) : null}

      {/* Gum and Bone Section */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#424242", mb: 2, mt: 3 }}>
        GUM AND BONE
      </Typography>
      {gumAndBoneGrouped.map(([groupName, rows]) => (
        <Box key={groupName} sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #eeeeee",
              pb: 1,
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#424242" }}>
              {groupName}
            </Typography>
            <Typography variant="caption" sx={{ color: "#757575" }}>
              {rows.length} question{rows.length === 1 ? "" : "s"}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {rows.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    borderColor: "#e0e0e0",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600, color: "#424242", flex: 1 }}>
                      {item.number || ""}. {item.question}
                    </Typography>
                    <Box
                      sx={{
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 999,
                        bgcolor: `${getRiskColor(item.scale || "low")}15`,
                        color: getRiskColor(item.scale || "low"),
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.scale || "low"}
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Answer"
                        value={item.answer || ""}
                        onChange={(e) => onUpdateItem('gumAndBone', item.id, "answer", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Scale"
                        value={item.scale || ""}
                        onChange={(e) => onUpdateItem('gumAndBone', item.id, "scale", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Doctor's Note"
                        value={item.note || ""}
                        onChange={(e) => onUpdateItem('gumAndBone', item.id, "note", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        size="small"
                        label="Additional Information"
                        value={item.additionalInfo || ""}
                        onChange={(e) => onUpdateItem('gumAndBone', item.id, "additionalInfo", e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {!gumAndBoneGrouped.length ? (
        <Typography color="text.secondary">No gum and bone history is available yet.</Typography>
      ) : null}

      {/* Bite and Jaw Joint Section */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#424242", mb: 2, mt: 3 }}>
        bite and jaw joint
      </Typography>
      {biteAndJawJointGrouped.map(([groupName, rows]) => (
        <Box key={groupName} sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #eeeeee",
              pb: 1,
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#424242" }}>
              {groupName}
            </Typography>
            <Typography variant="caption" sx={{ color: "#757575" }}>
              {rows.length} question{rows.length === 1 ? "" : "s"}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {rows.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    borderColor: "#e0e0e0",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600, color: "#424242", flex: 1 }}>
                      {item.number || ""}. {item.question}
                    </Typography>
                    <Box
                      sx={{
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 999,
                        bgcolor: `${getRiskColor(item.scale || "low")}15`,
                        color: getRiskColor(item.scale || "low"),
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.scale || "low"}
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Answer"
                        value={item.answer || ""}
                        onChange={(e) => onUpdateItem('biteAndJawJoint', item.id, "answer", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Scale"
                        value={item.scale || ""}
                        onChange={(e) => onUpdateItem('biteAndJawJoint', item.id, "scale", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Doctor's Note"
                        value={item.note || ""}
                        onChange={(e) => onUpdateItem('biteAndJawJoint', item.id, "note", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        size="small"
                        label="Additional Information"
                        value={item.additionalInfo || ""}
                        onChange={(e) => onUpdateItem('biteAndJawJoint', item.id, "additionalInfo", e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {!biteAndJawJointGrouped.length ? (
        <Typography color="text.secondary">No bite and jaw joint history is available yet.</Typography>
      ) : null}
    </Paper>
  );
};

export default DentalHistoryFullView;
