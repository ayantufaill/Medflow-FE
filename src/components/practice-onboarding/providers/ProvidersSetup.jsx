import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProviders,
  selectProviderList,
  selectProviderListLoading,
} from "../../../store/slices/providerSlice";
import AddProviderForm from "./AddProviderForm";

const ProvidersSetup = ({ onNext, onFinishLater }) => {
  const providers = useSelector(selectProviderList);
  const loading = useSelector(selectProviderListLoading);
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProviders({ page: 1, limit: 100 }));
  }, [dispatch]);

  const getProviderName = (provider) => {
    if (provider.userId?.firstName || provider.userId?.lastName)
      return `${provider.userId.firstName || ""} ${provider.userId.lastName || ""}`.trim();
    if (provider.firstName || provider.lastName)
      return `${provider.firstName || ""} ${provider.lastName || ""}`.trim();
    return provider.displayName || provider.name || "Unknown Provider";
  };

  const handleProviderSaved = (created) => {
    setShowForm(false);
  };

  return (
    <Box sx={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: "1.1rem",
          mb: 2,
          textTransform: "uppercase",
          color: "#111827",
        }}
      >
        PROVIDERS
      </Typography>

      <Box
        sx={{
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Table Header */}
        <Box
          sx={{
            bgcolor: "#2362EF",
            height: 45,
            display: "flex",
            alignItems: "center",
            px: 3,
          }}
        >
          <Box sx={{ width: "25%" }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Provider</Typography>
          </Box>
          <Box sx={{ width: "25%" }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Speciality</Typography>
          </Box>
          <Box sx={{ width: "15%" }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Provider Type</Typography>
          </Box>
          <Box sx={{ width: "25%" }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Email</Typography>
          </Box>
          <Box sx={{ width: "10%" }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Telephone Number</Typography>
          </Box>
        </Box>

        {/* Table Body */}
        <Box sx={{ minHeight: "200px" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress size={32} />
            </Box>
          ) : providers.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                No providers added yet.
              </Typography>
            </Box>
          ) : (
            providers.map((provider, index) => {
              const isLast = index === providers.length - 1;
              return (
                <Box
                  key={provider._id || provider.id || index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 3,
                    py: 2.5,
                    borderBottom: "1px solid #DFE5EC",
                  }}
                >
                  <Box sx={{ width: "25%" }}>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>{getProviderName(provider)}</Typography>
                  </Box>
                  <Box sx={{ width: "25%" }}>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>{provider.specialty?.[0] || provider.specialty || "General Dentistry"}</Typography>
                  </Box>
                  <Box sx={{ width: "15%" }}>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>{provider.providerType || "DDS"}</Typography>
                  </Box>
                  <Box sx={{ width: "25%" }}>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>{provider.email || "—"}</Typography>
                  </Box>
                  <Box sx={{ width: "10%" }}>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>{provider.mobilePhone || "—"}</Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>

        {/* Action Area */}
        {!showForm && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 3,
              pt: 0,
              pb: 3,
            }}
          >
            <Box sx={{ width: "25%" }} />
            <Box sx={{ width: "25%" }} />
            <Box sx={{ width: "15%" }} />
            <Box sx={{ width: "25%", display: "flex", justifyContent: "flex-end", pr: 2 }}>
              <Box sx={{ mt: "-20px", zIndex: 10 }}>
              <Button
                variant="outlined"
                onClick={() => setShowForm(true)}
                sx={{
                  color: "#2362EF",
                  borderColor: "#2362EF",
                  bgcolor: "#FFFFFF",
                  textTransform: "none",
                  borderRadius: "6px",
                  px: 2,
                  py: 0.5,
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  "&:hover": {
                    borderColor: "#1D4ED8",
                    bgcolor: "#F9FAFB",
                  },
                }}
              >
                Add Providers
              </Button>
            </Box>
            </Box>
            <Box sx={{ width: "10%" }} />
          </Box>
        )}
      </Box>

      {/* Inline Form */}
      {showForm && (
        <AddProviderForm
          onSave={handleProviderSaved}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Footer Navigation */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onFinishLater}
          sx={{
            color: "#6B7280",
            borderColor: "#D1D5DB",
            textTransform: "none",
            borderRadius: "6px",
            px: 3,
            "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F3F4F6" },
          }}
        >
          Finish Later
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          sx={{
            bgcolor: "#2362EF",
            "&:hover": { bgcolor: "#1D4ED8" },
            textTransform: "none",
            borderRadius: "6px",
            px: 4,
            fontWeight: 500,
            boxShadow: "none",
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ProvidersSetup;
