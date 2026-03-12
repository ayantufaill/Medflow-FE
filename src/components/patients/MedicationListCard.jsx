import { Grid, Link, TextField, Typography } from "@mui/material";
import Card from "@mui/material/Paper";

const MedicationListCard = ({ title, rows, onChangeRow, onAddRow }) => (
  <Card
    elevation={0}
    sx={{
      p: 3,
      mb: 2,
      borderRadius: 1,
      border: "1px solid #e0e0e0",
      bgcolor: "#ffffff",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        mb: 2,
        fontWeight: 700,
        color: "#424242",
        fontSize: "1.05rem",
      }}
    >
      {title}
    </Typography>

    <Grid
      container
      spacing={0}
      sx={{
        borderBottom: "1px solid #eeeeee",
        pb: 1,
        mb: 1,
      }}
    >
      <Grid item xs={5}>
        <Typography
          variant="caption"
          sx={{ color: "#9e9e9e", fontWeight: 600 }}
        >
          Drug
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography
          variant="caption"
          sx={{ color: "#9e9e9e", fontWeight: 600 }}
        >
          Dosage
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="caption"
          sx={{ color: "#9e9e9e", fontWeight: 600 }}
        >
          Purpose
        </Typography>
      </Grid>
    </Grid>

    {rows.map((row) => (
      <Grid
        key={row.id}
        container
        spacing={0}
        sx={{
          py: 1,
          borderBottom: "1px solid #f0f0f0",
          fontSize: 14,
        }}
      >
        <Grid item xs={5}>
          <TextField
            fullWidth
            size="small"
            variant="standard"
            placeholder="Drug"
            value={row.drug}
            onChange={(e) => onChangeRow(row.id, "drug", e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ "& input": { py: 0.5, fontSize: 14 } }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            size="small"
            variant="standard"
            placeholder="Dosage"
            value={row.dosage}
            onChange={(e) => onChangeRow(row.id, "dosage", e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ "& input": { py: 0.5, fontSize: 14 } }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size="small"
            variant="standard"
            placeholder="Purpose"
            value={row.purpose}
            onChange={(e) => onChangeRow(row.id, "purpose", e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ "& input": { py: 0.5, fontSize: 14 } }}
          />
        </Grid>
      </Grid>
    ))}

    <Link
      component="button"
      variant="body2"
      onClick={onAddRow}
      sx={{
        mt: 1,
        color: "#1976d2",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      + add more
    </Link>
  </Card>
);

export default MedicationListCard;
