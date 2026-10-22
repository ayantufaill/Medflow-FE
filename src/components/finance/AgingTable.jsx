import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import apiClient from "../../config/api";
import { usePatient } from "../../hooks/redux/usePatient";
import AccountNotesDialog from "./AccountNotesDialog";
import AccountAdjustmentDialog from "./AccountAdjustmentDialog";

const commonCellSx = {
  py: 0,
  px: "12px",
  borderBottom: "1px solid #DFE5EC !important",
  fontSize: "12px",
  whiteSpace: "nowrap",
};

const blueCellSx = {
  ...commonCellSx,
  bgcolor: "#2362EF",
  color: "#FFFFFF",
  borderBottom: "1px solid #FFFFFF !important",
};

const totalCellSx = {
  ...commonCellSx,
  bgcolor: "#E5F8F7",
  color: "#00BBAB",
  fontWeight: "bold",
  borderBottom: "1px solid #DFE5EC !important",
  borderLeft: "1px solid #DFE5EC",
};

const headerSx = {
  ...commonCellSx,
  bgcolor: "#F8FAFC",
  color: "#6B778C",
  fontWeight: 600,
  fontSize: "11px",
  textTransform: "uppercase",
  borderBottom: "1px solid #DFE5EC !important",
};

const formatCurrency = (val) => `$${Number(val || 0).toFixed(2)}`;

const AgingTable = ({ view = "invoices", patientId, patient }) => {
  const { fetchById } = usePatient();
  const defaultBuckets = {
    "0_30": 0,
    "31_60": 0,
    "61_90": 0,
    "90_plus": 0,
    total: 0,
  };
  const [agingData, setAgingData] = useState({
    familyOutstanding: { ...defaultBuckets },
    familyBalance: { ...defaultBuckets },
    insuranceBalance: { ...defaultBuckets },
    patientAccountCredit: 0,
    insuranceAccountCredit: 0,
    courtesyCredit: 0,
    familyCredit: 0,
    familyCredits: [],
    accountCredit: 0,
    patientCredit: 0,
  });

  const [isFamilyExpanded, setIsFamilyExpanded] = useState(true);
  const [isAccountExpanded, setIsAccountExpanded] = useState(true);
  const [showAccountNotes, setShowAccountNotes] = useState(false);
  const [showAccountAdjustment, setShowAccountAdjustment] = useState(false);

  const courtesyCredit = agingData?.courtesyCredit ?? 0;
  const familyCredit = agingData?.familyCredit ?? agingData?.patientAccountCredit ?? 0;
  const accountCredit = agingData?.accountCredit ?? agingData?.patientAccountCredit ?? 0;
  const patientCredit = agingData?.patientCredit ?? agingData?.patientAccountCredit ?? 0;

  // Determine family members to display
  let familyMembersList = [];
  if (Array.isArray(agingData?.familyCredits) && agingData.familyCredits.length > 0) {
    const membersWithCredit = agingData.familyCredits.filter((m) => Number(m.credit) > 0);
    familyMembersList = membersWithCredit.length > 0 ? membersWithCredit : agingData.familyCredits;
  } else if (patient?.household && patient.household.length > 0) {
    familyMembersList = patient.household.map((m) => ({
      patNum: m._id || m.id || m.PatNum,
      name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Unknown',
      credit: 0,
    }));
  } else if (patient) {
    familyMembersList = [{
      patNum: patient._id || patient.id || patient.PatNum,
      name: `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient',
      credit: familyCredit,
    }];
  }

  const handleSelectPatient = (targetPatNum) => {
    if (fetchById && targetPatNum) {
      fetchById(targetPatNum);
    }
  };

  const handleAccountAdjustmentSave = async (adjData) => {
    try {
      const pid = patientId || patient?._id || patient?.id || patient?.PatNum;
      if (!pid) return;
      const amountVal = -Math.abs(adjData.amount);
      await apiClient.post("/adjustments", {
        patientId: pid.toString(),
        amount: amountVal,
        date: new Date(),
        type: adjData.typeId || undefined,
        notes: `Account Adjustment - Type: ${adjData.adjustmentType}${adjData.description ? ` (${adjData.description})` : ""}`,
      });
      fetchAgingData();
      window.dispatchEvent(new CustomEvent("add-ledger-item"));
      window.dispatchEvent(new CustomEvent("refresh-ledger"));
    } catch (err) {
      console.error("Error saving account adjustment:", err);
    }
    setShowAccountAdjustment(false);
  };

  const fetchAgingData = async () => {
    if (!patientId) return;
    try {
      const response = await apiClient.get(
        `/finance-dashboard/aging/${patientId}`,
      );
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        // Check if data is nested (new backend) or flat (old backend)
        if (data.familyOutstanding) {
          setAgingData(data);
        } else {
          // Fallback to old flat structure to prevent breaking while backend updates
          setAgingData({
            familyOutstanding: data,
            familyBalance: data,
            insuranceBalance: { ...defaultBuckets },
            patientAccountCredit: 0,
            insuranceAccountCredit: 0,
            courtesyCredit: 0,
            familyCredit: 0,
            familyCredits: [],
            accountCredit: 0,
            patientCredit: 0,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch aging data", error);
    }
  };

  useEffect(() => {
    fetchAgingData();
    window.addEventListener("add-ledger-item", fetchAgingData);
    window.addEventListener("refresh-ledger", fetchAgingData);
    return () => {
      window.removeEventListener("add-ledger-item", fetchAgingData);
      window.removeEventListener("refresh-ledger", fetchAgingData);
    };
  }, [patientId]);

  return (
    <Box
      sx={{ flex: 1, minHeight: "254px", height: "100%", position: "relative" }}
    >
      <TableContainer
        sx={{
          borderRadius: "22px",
          border: "1px solid #DFE5EC",
          bgcolor: "#FFFFFF",
          height: "100%",
        }}
      >
        <Table
          sx={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}
          size="small"
        >
          <TableHead>
            <TableRow sx={{ height: "32px" }}>
              <TableCell
                sx={{
                  ...headerSx,
                  width: "234px",
                  minWidth: "234px",
                  maxWidth: "234px",
                  p: 0,
                }}
              ></TableCell>
              <TableCell align="right" sx={headerSx}>
                AGING 0-30
              </TableCell>
              <TableCell align="right" sx={headerSx}>
                31-60
              </TableCell>
              <TableCell align="right" sx={headerSx}>
                61-90
              </TableCell>
              <TableCell align="right" sx={headerSx}>
                &gt;90
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  ...headerSx,
                  bgcolor: "#00BBAB",
                  color: "#FFF",
                  width: "80px",
                  minWidth: "80px",
                  maxWidth: "80px",
                  p: 0,
                  textAlign: "center",
                }}
              >
                TOTAL
              </TableCell>
              <TableCell
                sx={{
                  ...headerSx,
                  width: "40px",
                  borderLeft: "1px solid #DFE5EC",
                }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* White Rows */}
            <TableRow sx={{ height: "37px" }}>
              <TableCell
                align="right"
                sx={{ ...commonCellSx, color: "#6B778C" }}
              >
                Family Outstanding Bills
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyOutstanding["0_30"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyOutstanding["31_60"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyOutstanding["61_90"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyOutstanding["90_plus"])}
              </TableCell>
              <TableCell
                align="center"
                sx={{ ...totalCellSx, color: "#00BBAB" }}
              >
                {formatCurrency(agingData.familyOutstanding.total)}
              </TableCell>
              <TableCell
                sx={{ ...commonCellSx, borderLeft: "1px solid #DFE5EC" }}
              ></TableCell>
            </TableRow>
            <TableRow sx={{ height: "37px" }}>
              <TableCell
                align="right"
                sx={{ ...commonCellSx, color: "#6B778C" }}
              >
                Family Balance
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyBalance["0_30"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyBalance["31_60"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyBalance["61_90"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyBalance["90_plus"])}
              </TableCell>
              <TableCell
                align="center"
                sx={{ ...totalCellSx, color: "#00BBAB" }}
              >
                {formatCurrency(agingData.familyBalance.total)}
              </TableCell>
              <TableCell
                sx={{ ...commonCellSx, borderLeft: "1px solid #DFE5EC" }}
              ></TableCell>
            </TableRow>
            <TableRow sx={{ height: "37px" }}>
              <TableCell
                align="right"
                sx={{ ...commonCellSx, color: "#6B778C" }}
              >
                Insurance Balance
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.insuranceBalance["0_30"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.insuranceBalance["31_60"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.insuranceBalance["61_90"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.insuranceBalance["90_plus"])}
              </TableCell>
              <TableCell
                align="center"
                sx={{ ...totalCellSx, color: "#00BBAB" }}
              >
                {formatCurrency(agingData.insuranceBalance.total)}
              </TableCell>
              <TableCell
                sx={{ ...commonCellSx, borderLeft: "1px solid #DFE5EC" }}
              ></TableCell>
            </TableRow>

            {/* Blue Rows */}
            <TableRow sx={{ height: "37px" }}>
              <TableCell align="right" sx={{ ...blueCellSx, fontWeight: 500 }}>
                Outstanding Bills
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyOutstanding["0_30"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyOutstanding["31_60"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyOutstanding["61_90"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyOutstanding["90_plus"])}
              </TableCell>
              <TableCell
                align="center"
                sx={{ ...totalCellSx, bgcolor: "#E5F8F7" }}
              >
                {formatCurrency(agingData.familyOutstanding.total)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  ...commonCellSx,
                  borderLeft: "1px solid #DFE5EC",
                  color: "#6B778C",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
              >
                &gt;
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: "37px" }}>
              <TableCell align="right" sx={{ ...blueCellSx, fontWeight: 500 }}>
                Balance
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyBalance["0_30"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyBalance["31_60"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyBalance["61_90"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.familyBalance["90_plus"])}
              </TableCell>
              <TableCell
                align="center"
                sx={{ ...totalCellSx, bgcolor: "#E5F8F7" }}
              >
                {formatCurrency(agingData.familyBalance.total)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  ...commonCellSx,
                  borderLeft: "1px solid #DFE5EC",
                  color: "#2362EF",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                RESET
              </TableCell>
            </TableRow>
            <TableRow sx={{ height: "37px" }}>
              <TableCell align="right" sx={{ ...blueCellSx, fontWeight: 500 }}>
                Insurance Balance
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.insuranceBalance["0_30"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.insuranceBalance["31_60"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.insuranceBalance["61_90"])}
              </TableCell>
              <TableCell align="right" sx={commonCellSx}>
                {formatCurrency(agingData.insuranceBalance["90_plus"])}
              </TableCell>
              <TableCell
                align="center"
                sx={{ ...totalCellSx, bgcolor: "#E5F8F7" }}
              >
                {formatCurrency(agingData.insuranceBalance.total)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  ...commonCellSx,
                  borderLeft: "1px solid #DFE5EC",
                  color: "#6B778C",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
              >
                &lt;
              </TableCell>
            </TableRow>
            {view === "invoices" && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{
                    p: 0,
                    borderBottom: "none",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    {/* Top colored footer bar */}
                    <Box sx={{ display: "flex", width: "100%", alignItems: "stretch" }}>
                      {/* Left: Courtesy & Family Credit (Purple) */}
                      <Box
                        sx={{
                          bgcolor: "#7C4BB0",
                          color: "#FFFFFF",
                          px: 2,
                          py: 0.6,
                          flex: "0 0 50%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          gap: 0.25,
                        }}
                      >
                        <Typography sx={{ fontSize: "11px", fontWeight: "bold", color: "#FFFFFF", lineHeight: 1.2 }}>
                          Courtesy Credit: {formatCurrency(courtesyCredit)}
                        </Typography>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: "pointer",
                            width: "fit-content",
                            userSelect: "none",
                          }}
                          onClick={() => setIsFamilyExpanded(!isFamilyExpanded)}
                        >
                          <Typography sx={{ fontSize: "11px", fontWeight: "bold", color: "#FFFFFF", lineHeight: 1.2 }}>
                            Family Credit: {formatCurrency(familyCredit)}
                          </Typography>
                          {isFamilyExpanded ? (
                            <KeyboardArrowUpIcon sx={{ fontSize: 16, color: "#FFFFFF" }} />
                          ) : (
                            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#FFFFFF" }} />
                          )}
                        </Box>
                      </Box>

                      {/* Right: Account Credit (Slate Blue) */}
                      <Box
                        sx={{
                          bgcolor: "#4A74B2",
                          color: "#FFFFFF",
                          px: 2,
                          py: 0.6,
                          flex: 1,
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              cursor: "pointer",
                              userSelect: "none",
                            }}
                            onClick={() => setIsAccountExpanded(!isAccountExpanded)}
                          >
                            <Typography sx={{ fontSize: "11px", fontWeight: "bold", color: "#FFFFFF", lineHeight: 1.2 }}>
                              Account Credit: {formatCurrency(accountCredit)}
                            </Typography>
                            {isAccountExpanded ? (
                              <KeyboardArrowUpIcon sx={{ fontSize: 16, color: "#FFFFFF" }} />
                            ) : (
                              <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#FFFFFF" }} />
                            )}
                          </Box>
                          <Tooltip title="Account Adjustment">
                            <IconButton
                              size="small"
                              sx={{
                                p: 0.25,
                                color: "#FFFFFF",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
                              }}
                              onClick={() => setShowAccountAdjustment(true)}
                            >
                              <EditNoteOutlinedIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Account Notes">
                            <IconButton
                              size="small"
                              sx={{
                                p: 0.25,
                                color: "#FFFFFF",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
                              }}
                              onClick={() => setShowAccountNotes(true)}
                            >
                              <DescriptionOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>

                    {/* Bottom expanded sub-row */}
                    {(isFamilyExpanded || isAccountExpanded) && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 2,
                          py: 0.6,
                          bgcolor: "#FFFFFF",
                          minHeight: "30px",
                          borderTop: "1px solid #F1F5F9",
                        }}
                      >
                        {/* Family member breakdown on the left */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                          {isFamilyExpanded &&
                            familyMembersList.map((member, idx) => (
                              <Box key={member.patNum || idx} sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                                <Box
                                  onClick={() => member.patNum && handleSelectPatient(member.patNum)}
                                  sx={{
                                    bgcolor: "#1976D2",
                                    color: "#FFFFFF",
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    px: 0.8,
                                    py: 0.15,
                                    borderRadius: "3px",
                                    cursor: member.patNum ? "pointer" : "default",
                                    transition: "background-color 0.15s ease",
                                    "&:hover": member.patNum ? { bgcolor: "#1565C0" } : {},
                                  }}
                                >
                                  {member.name}:
                                </Box>
                                <Typography sx={{ fontSize: "11px", fontWeight: "bold", color: "#1976D2" }}>
                                  {formatCurrency(member.credit)}
                                </Typography>
                              </Box>
                            ))}
                        </Box>

                        {/* Patient credit on the right */}
                        {isAccountExpanded && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
                            <Typography sx={{ fontSize: "11px", fontWeight: "bold", color: "#1E293B" }}>
                              Patient Credit:
                            </Typography>
                            <Typography sx={{ fontSize: "11px", fontWeight: "bold", color: "#1976D2" }}>
                              {formatCurrency(patientCredit)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showAccountNotes && (
        <AccountNotesDialog
          patient={patient}
          onClose={() => setShowAccountNotes(false)}
        />
      )}

      {showAccountAdjustment && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 130000,
          }}
          onClick={() => setShowAccountAdjustment(false)}
        >
          <Box
            sx={{
              maxWidth: "600px",
              width: "95%",
              bgcolor: "#fff",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AccountAdjustmentDialog
              patient={patient}
              onClose={() => setShowAccountAdjustment(false)}
              onSave={handleAccountAdjustmentSave}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AgingTable;
