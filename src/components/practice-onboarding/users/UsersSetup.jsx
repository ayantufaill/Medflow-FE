import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  selectUserList,
  selectUserListLoading,
} from "../../../store/slices/userSlice";
import {
  fetchProviders,
  selectProviderList,
} from "../../../store/slices/providerSlice";
import AddUserForm from "./AddUserForm";

const UsersSetup = ({ onNext, onFinishLater }) => {
  const users = useSelector(selectUserList);
  const providers = useSelector(selectProviderList);
  const loading = useSelector(selectUserListLoading);
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 100 }));
    dispatch(fetchProviders({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleUserSaved = (created) => {
    setShowForm(false);
  };

  const getProviderName = (providerId) => {
    if (!providerId) return "—";
    const p = providers.find(p => (p._id || p.id) === providerId);
    if (!p) return "—";
    if (p.userId?.firstName || p.userId?.lastName)
      return `${p.userId.firstName || ""} ${p.userId.lastName || ""}`.trim();
    if (p.firstName || p.lastName)
      return `${p.firstName || ""} ${p.lastName || ""}`.trim();
    return "—";
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
        USERS
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
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Users</Typography>
          </Box>
          <Box sx={{ width: "25%" }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Emails</Typography>
          </Box>
          <Box sx={{ width: "25%" }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Provider</Typography>
          </Box>
          <Box sx={{ width: "25%" }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Role</Typography>
          </Box>
        </Box>

        {/* Table Body */}
        <Box sx={{ minHeight: "200px", borderBottom: showForm ? "none" : "1px solid #DFE5EC" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
              <CircularProgress size={32} />
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                No users added yet.
              </Typography>
            </Box>
          ) : (
            users.map((user, index) => {
              const isLast = index === users.length - 1;
              return (
                <Box
                  key={user._id || user.id || index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 3,
                    py: 2.5,
                    borderBottom: isLast ? "none" : "1px solid #DFE5EC",
                  }}
                >
                  <Box sx={{ width: "25%" }}>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                      {`${user.firstName || ""} ${user.lastName || ""}`.trim()}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "25%" }}>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>{user.email || "—"}</Typography>
                  </Box>
                  <Box sx={{ width: "25%" }}>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>{getProviderName(user.providerId)}</Typography>
                  </Box>
                  <Box sx={{ width: "25%" }}>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.875rem" }}>
                      {user.roles && user.roles.length > 0 ? user.roles.join(", ") : "—"}
                    </Typography>
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
              justifyContent: "center",
              mt: "-18px", // Pull the button up onto the border
              mb: 3,
              zIndex: 10,
              position: 'relative'
            }}
          >
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
              Add Users
            </Button>
          </Box>
        )}
      </Box>

      {/* Inline Form */}
      {showForm && (
        <AddUserForm
          onSave={handleUserSaved}
          onCancel={() => setShowForm(false)}
          providers={providers}
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

export default UsersSetup;
