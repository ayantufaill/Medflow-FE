import { Box, Typography, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";

const ACCENT_BLUE = "#2262EF";

const UserFiltersSection = ({ onAddFilter }) => (
  <Box
    sx={{
      mt: 3,
      bgcolor: "#ffffff",
      border: "1px solid #e8eaf0",
      borderRadius: 2,
      p: 2.5,
    }}
  >
    {/* Title bar: pulled flush to the card's edges, rounded only on top */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "#eef3fc",
        borderRadius: "8px 8px 0 0",
        px: 2.5,
        py: 1.25,
        mt: -2.5,
        mx: -2.5,
        mb: 2,
      }}
    >
      <PersonOutlineIcon
        sx={{
          fontSize: 18,
          color: ACCENT_BLUE,
        }}
      />

      <Typography
        variant="subtitle1"
        sx={{
          color: "#333",
          fontWeight: 600,
        }}
      >
        User Filters
      </Typography>
    </Box>

    {/* Add button row, above the content card */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        mb: 1.5,
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddFilter}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          px: 2.5,
          bgcolor: ACCENT_BLUE,
          boxShadow: "none",
          "&:hover": {
            bgcolor: "#1a4fc4",
            boxShadow: "none",
          },
        }}
      >
        Add Filter
      </Button>
    </Box>

    {/* Content card, nested inside the section like Operatories' table card */}
    <Box
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid #e8eaf0",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#1976d2",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        [User Display Name]
      </Typography>
    </Box>
  </Box>
);

export default UserFiltersSection;