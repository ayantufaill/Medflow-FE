import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import {
  CheckCircle,
  KeyboardArrowDown,
  KeyboardArrowRight,
  CalendarTodayOutlined,
} from "@mui/icons-material";

import ButtonScheduleIcon from "../../assets/finance icons/Button - Schedule → SVG.svg";
import ButtonPaymentIcon from "../../assets/finance icons/Button - Payment → SVG.svg";
import ButtonAdjustIcon from "../../assets/finance icons/Button - Adjust → SVG.svg";
import ButtonPrintIcon from "../../assets/finance icons/Button - Print → SVG.svg";
import ButtonVoidIcon from "../../assets/finance icons/Button - Void → SVG.svg";

import LedgerSubRow from "./LedgerSubRow";

// Summary amounts arrive pre-formatted ("$12.50"). Parse them so a $0.00 cell
// can be told apart from a real amount before it gets a highlight colour.
const parseAmount = (val) =>
  Math.abs(Number(String(val || "$0").replace(/[^0-9.-]+/g, "")));

const LedgerItemCard = ({
  idx,
  displayItem,
  isExpanded,
  adjustmentTypeMap,
  handleItemClick,
  handleCalendarClick,
  handleVoidClick,
  handleEditClick,
  handleRefreshClick,
  setMagicStickAnchorEl,
  setTransferTarget,
  setEditInvoiceTarget,
  setShowEditInvoice,
  setAdjAnchorEl,
  setAdjItem,
  setPrintAnchorEl,
  setPrintItem,
  onEOBClick,
  onPrintClaimClick,
  onToggleClaimClosed,
  closedClaimOverrides,
  handleAddProcedureClick,
  handleAttachClick,
  onEditClaimClick,
  onSendClaimClick,
  onVoidAndRecreateClick,
  onRejectClaimClick,
  onLockClaimClick,
  onVoidClaimClick,
  onChangeClaimStatusClick,
  onDescriptionSave,
}) => {
  const isPatientDeposit = Boolean(
    displayItem?.isPatientDeposit ||
    displayItem?.depositType === "patient" ||
    displayItem?.depositType === "insurance" ||
    ["Patient Deposit", "PatientDeposit", "Deposit"].includes(
      displayItem.method,
    ) ||
    String(displayItem.method || "")
      .toLowerCase()
      .includes("deposit"),
  );

  const title =
    displayItem.method === "Invoice"
      ? `Invoice #${displayItem.invoiceNumber || displayItem.id} (${displayItem.date})`
      : displayItem.method === "Adjustment"
        ? `Adjustment #${displayItem.invoiceNumber || displayItem.id} (${displayItem.date})`
        : `Patient Deposit #${displayItem.id} (${displayItem.date})`;

  return (
    <Box
      sx={{
        border: "1px solid #DFE5EC",
        borderRadius: "18px",
        bgcolor: "#FFFFFF",
        mb: 2,
        overflow: "hidden",
      }}
    >
      <Box
        onClick={() => handleItemClick(idx)}
        sx={{
          display: "flex",
          alignItems: "center",
          p: "16px 24px",
          cursor: "pointer",
          bgcolor: displayItem.isVoided ? "#ef4444" : "#F8FAFC",
        }}
      >
        {/* Left: Icon & Title */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 320 }}
        >
          {(parseFloat(
            (displayItem.summary?.invBal || "0")
              .toString()
              .replace(/[^0-9.-]+/g, ""),
          ) || 0) === 0 ? (
            <CheckCircle sx={{ color: "#42C070", fontSize: "20px" }} />
          ) : (
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                bgcolor: "#ef4444",
              }}
            />
          )}
          {isExpanded ? (
            <KeyboardArrowDown
              sx={{ color: displayItem.isVoided ? "#E0E0E0" : "#6B778C" }}
            />
          ) : (
            <KeyboardArrowRight
              sx={{ color: displayItem.isVoided ? "#E0E0E0" : "#6B778C" }}
            />
          )}
          <Typography
            sx={{
              fontWeight: 600,
              color: displayItem.isVoided ? "#FFFFFF" : "#1A1A1A",
              fontSize: "14px",
              textTransform: "uppercase",
            }}
          >
            {displayItem.method === "Invoice"
              ? "INVOICE"
              : displayItem.method === "Adjustment"
                ? "ADJUSTMENT"
                : "PATIENT DEPOSIT"}{" "}
            #{displayItem.invoiceNumber || displayItem.id} ({displayItem.date}){" "}
            {displayItem.amount}
          </Typography>
        </Box>

        {!isPatientDeposit && (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {/* Column 1 */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                columnGap: 1,
                rowGap: 0.5,
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: displayItem.isVoided ? "#E0E0E0" : "#6B778C",
                  textAlign: "right",
                  fontSize: "11px",
                }}
              >
                Ins WO:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: displayItem.isVoided ? "#FFFFFF" : "#1A1A1A",
                  fontSize: "11px",
                }}
              >
                {displayItem.summary?.insWo || "$0.00"}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: displayItem.isVoided ? "#E0E0E0" : "#6B778C",
                  textAlign: "right",
                  fontSize: "11px",
                }}
              >
                Applied WO:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: displayItem.isVoided
                    ? "#FFFFFF"
                    : parseAmount(displayItem.summary?.appliedWo) > 0
                      ? "#7c3aed"
                      : "#1A1A1A",
                  fontSize: "11px",
                }}
              >
                {displayItem.summary?.appliedWo || "$0.00"}
              </Typography>
            </Box>

            {/* Column 2 */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                columnGap: 1,
                rowGap: 0.5,
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: displayItem.isVoided ? "#E0E0E0" : "#6B778C",
                  textAlign: "right",
                  fontSize: "11px",
                }}
              >
                Pt Balance:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: displayItem.isVoided ? "#FFFFFF" : "#1A1A1A",
                  fontSize: "11px",
                }}
              >
                {displayItem.summary?.ptBal || "$0.00"}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: displayItem.isVoided ? "#E0E0E0" : "#6B778C",
                  textAlign: "right",
                  fontSize: "11px",
                }}
              >
                Pt Paid:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: displayItem.isVoided
                    ? "#FFFFFF"
                    : parseAmount(displayItem.summary?.ptPaid) > 0
                      ? "#22c55e"
                      : "#1A1A1A",
                  fontSize: "11px",
                }}
              >
                {displayItem.summary?.ptPaid || "$0.00"}
              </Typography>
            </Box>

            {/* Column 3 */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                columnGap: 1,
                rowGap: 0.5,
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: displayItem.isVoided ? "#E0E0E0" : "#6B778C",
                  textAlign: "right",
                  fontSize: "11px",
                }}
              >
                Ins Balance:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: displayItem.isVoided ? "#FFFFFF" : "#1A1A1A",
                  fontSize: "11px",
                }}
              >
                {displayItem.summary?.insBal || "$0.00"}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: displayItem.isVoided ? "#E0E0E0" : "#6B778C",
                  textAlign: "right",
                  fontSize: "11px",
                }}
              >
                Ins Paid:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: displayItem.isVoided
                    ? "#FFFFFF"
                    : parseAmount(displayItem.summary?.insPaid) > 0
                      ? "#22c55e"
                      : "#1A1A1A",
                  fontSize: "11px",
                }}
              >
                {displayItem.summary?.insPaid || "$0.00"}
              </Typography>
            </Box>

            {/* Column 4: Invoice Balance & Claim */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                columnGap: 1,
                rowGap: 0.5,
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: displayItem.isVoided ? "#E0E0E0" : "#6B778C",
                  textAlign: "right",
                  fontSize: "11px",
                }}
              >
                Invoice Balance:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: displayItem.isVoided ? "#FFFFFF" : "#1A1A1A",
                  fontSize: "11px",
                  whiteSpace: "nowrap",
                }}
              >
                {displayItem.summary?.invBal || "$0.00"}
              </Typography>

              {displayItem.details?.some((d) => d.isClaim) && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      color: displayItem.isVoided ? "#E0E0E0" : "#6B778C",
                      textAlign: "right",
                      fontSize: "11px",
                    }}
                  >
                    Claim:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: "#f59e0b",
                      fontSize: "11px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {(() => {
                      const claim = displayItem.details.find((d) => d.isClaim);
                      const rawFormat = String(
                        claim?.claimFormat || claim?.ClaimFormat || "",
                      ).toLowerCase();
                      if (
                        rawFormat.includes("manual") ||
                        rawFormat.includes("paper")
                      )
                        return "Manual Claim";
                      return "Electronic Claim";
                    })()}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        )}

        {/* Right: Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
          {displayItem.isVoided ? null : (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                ml: "auto",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {isPatientDeposit ? (
                <>
                  <Box
                    component="img"
                    src={ButtonPrintIcon}
                    sx={{ width: 18, height: 18, cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrintAnchorEl(e.currentTarget);
                      setPrintItem(displayItem);
                    }}
                  />
                  <Box
                    component="img"
                    src={ButtonVoidIcon}
                    sx={{ width: 18, height: 18, cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVoidClick(displayItem);
                    }}
                  />
                </>
              ) : (
                <>
                  <Box
                    component="img"
                    src={ButtonScheduleIcon}
                    sx={{ width: 18, height: 18, cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCalendarClick(displayItem, e);
                    }}
                  />
                  <Box
                    component="img"
                    src={ButtonPaymentIcon}
                    sx={{ width: 18, height: 18, cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <Box
                    component="img"
                    src={ButtonAdjustIcon}
                    sx={{ width: 18, height: 18, cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAdjAnchorEl(e.currentTarget);
                      setAdjItem(displayItem);
                    }}
                  />
                  <Box
                    component="img"
                    src={ButtonPrintIcon}
                    sx={{ width: 18, height: 18, cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrintAnchorEl(e.currentTarget);
                      setPrintItem(displayItem);
                    }}
                  />
                </>
              )}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Expanded Content */}
      {isExpanded && (
        <Box sx={{ bgcolor: displayItem.isVoided ? "#ef4444" : "#FFFFFF" }}>
          {!displayItem.details ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#6B778C" }}>
                Loading details...
              </Typography>
            </Box>
          ) : displayItem.details.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{ color: "#6B778C", fontStyle: "italic", fontSize: "12px" }}
              >
                No procedures or adjustments are currently attached to this{" "}
                {displayItem.method?.toLowerCase() || "item"}.
              </Typography>
            </Box>
          ) : (
            displayItem.details.map((detail, dIdx) => (
              <LedgerSubRow
                key={dIdx}
                date={displayItem.date}
                title={detail.title}
                amount={detail.amount}
                id={detail.id}
                invoiceNumber={
                  detail.invoiceNumber || displayItem.invoiceNumber || displayItem.id
                }
                initials={detail.initials || displayItem.initials}
                createdByName={
                  detail.createdByName || displayItem.createdByName
                }
                createdAt={detail.createdAt || displayItem.rawDate}
                isPayment={detail.isPayment}
                isClaim={detail.isClaim}
                insuranceType={detail.insuranceType}
                isVoided={displayItem.isVoided || detail.isVoided}
                isLocked={detail.isLocked}
                hideClaimStatus={
                  detail.isClaim &&
                  detail.isVoided &&
                  displayItem.details.filter((d) => d.isClaim).length <= 1
                }
                showExtendedTools={
                  !isPatientDeposit &&
                  !detail.isClaim &&
                  !detail.title.includes("(uncollected)")
                }
                adjustmentType={
                  adjustmentTypeMap[`${displayItem.id}-${detail.id}`]
                }
                isPatientDeposit={isPatientDeposit}
                defaultExpanded={detail.defaultExpanded}
                onVoidClick={handleVoidClick}
                onEditClick={handleEditClick}
                onRefreshClick={handleRefreshClick}
                onEOBClick={onEOBClick}
                voidData={{
                  id: detail.id,
                  title: detail.title,
                  amount: detail.amount,
                  date: displayItem.date,
                  invoiceId: displayItem.id,
                  invoiceNumber: displayItem.invoiceNumber || displayItem.id,
                  isAdjustment: detail.isAdjustment || displayItem.isAdjustment,
                  isGrouped: detail.isGrouped,
                  isPayment: detail.isPayment,
                  // The invoice's own line items, so the void dialog can ask
                  // which of them to void instead of dropping them all at once.
                  procedures: detail.procedures,
                  claimedProcedureIds: [
                    ...new Set(
                      (displayItem.details || [])
                        .filter(
                          (row) =>
                            row.isClaim &&
                            !row.isVoided &&
                            String(row.status || "").toLowerCase() !== "void",
                        )
                        .flatMap((claim) => claim.procedures || [])
                        .map(
                          (proc) =>
                            proc.id ||
                            proc._id ||
                            proc.ProcNum ||
                            proc.procedureId ||
                            proc.itemId,
                        )
                        .filter(Boolean)
                        .map(String),
                    ),
                  ],
                }}
                editData={{
                  id: detail.id,
                  title: detail.title,
                  amount: detail.amount,
                  date: displayItem.date,
                  invoiceId: displayItem.id,
                  isAdjustment: detail.isAdjustment || displayItem.isAdjustment,
                }}
                refreshData={{
                  idx,
                  id: detail.id,
                  invoiceId: displayItem.id,
                  isAdjustment: displayItem.isAdjustment || detail.isAdjustment,
                  isPayment: detail.isPayment,
                }}
                eobData={{
                  ...detail,
                  invoiceId: detail.invoiceId || displayItem.id,
                }}
                onPrintClaimClick={onPrintClaimClick}
                onToggleClaimClosed={onToggleClaimClosed}
                onEditClaimClick={onEditClaimClick}
                onSendClaimClick={onSendClaimClick}
                onVoidAndRecreateClick={onVoidAndRecreateClick}
                onRejectClaimClick={onRejectClaimClick}
                onLockClaimClick={onLockClaimClick}
                onVoidClaimClick={onVoidClaimClick}
                onChangeClaimStatusClick={onChangeClaimStatusClick}
                isAdjustment={displayItem.isAdjustment}
                // Adjustment rows (standalone, or an invoice's own adjustment
                // detail) render one extra "Adjustment" column in their
                // procedure table showing the adjustment applied per line.
                showAdjustmentColumn={Boolean(
                  displayItem.isAdjustment || detail.isAdjustment,
                )}
                showPaymentColumn={Boolean(
                  detail.isPayment && !detail.isAdjustment,
                )}
                onMagicStickClick={(e) => {
                  setMagicStickAnchorEl(e.currentTarget);
                  setTransferTarget({ ...detail, invoiceId: displayItem.id });
                }}
                onSettingsClick={(data) => {
                  setEditInvoiceTarget({
                    ...data,
                    id: displayItem.id,
                    invoiceId: displayItem.id,
                  });
                  setShowEditInvoice(true);
                }}
                onAdjustmentSelect={(e) => {
                  setAdjAnchorEl(e.currentTarget);
                  setAdjItem(displayItem);
                }}
                onPrintClick={(e) => {
                  setPrintAnchorEl(e.currentTarget);
                  setPrintItem(displayItem);
                }}
                onAttachClick={handleAttachClick}
                attachData={detail}
                procedures={detail.procedures}
                claimStatus={detail.status}
                closedClaimOverrides={closedClaimOverrides}
                statusResponse={detail.statusResponse}
                isApproved={detail.isApproved}
                description={detail.description}
                onDescriptionSave={(description, options) =>
                  onDescriptionSave?.({
                    detail,
                    displayItem,
                    description,
                    options,
                  })
                }
              />
            ))
          )}

          {displayItem.method === "Invoice" && !displayItem.isVoided && (
            <Box
              sx={{
                mt: displayItem.details?.length > 0 ? 2 : 0,
                p: "0 24px 16px 24px",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  handleAddProcedureClick({
                    invoiceId: displayItem.id,
                    date: displayItem.date,
                  })
                }
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  color: "#2362EF",
                  borderColor: "#DFE5EC",
                }}
              >
                + Add Procedure
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LedgerItemCard;
