import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";

export const STORAGE_KEY = "medflow-lab-cases";

export const STATUS_OPTIONS = [
  "Draft",
  "Sent",
  "Received",
  "Returned",
  "Ready",
  "Complete",
];

export const STATUS_COLORS = {
  Draft: { bg: "rgba(154, 163, 174, 0.15)", color: COLORS.TEXT_SECONDARY },
  Sent: { bg: "rgba(35, 98, 239, 0.10)", color: COLORS.ACCENT },
  Received: { bg: "rgba(5, 150, 105, 0.10)", color: COLORS.STATUS_CONFIRMED },
  Returned: { bg: "rgba(239, 68, 68, 0.10)", color: COLORS.STATUS_ERROR },
  Ready: { bg: "rgba(217, 119, 6, 0.10)", color: COLORS.STATUS_UNCONFIRMED },
  Complete: { bg: "rgba(22, 163, 74, 0.10)", color: COLORS.STATUS_SUCCESS },
};

export const defaultLabCases = [
  {
    id: "sample-lab-1",
    date: "10/12/2026",
    type: "Crown",
    procedure: "PFM Crown #14",
    lab: "Elite Dental Lab",
    estReceiveDate: "10/26/2026",
    apptDate: "10/28/2026",
    provider: "Dr. Smith",
    status: "Sent",
  },
  {
    id: "sample-lab-2",
    date: "10/05/2026",
    type: "Bridge",
    procedure: "3-Unit Bridge #18-20",
    lab: "Precision Ceramics",
    estReceiveDate: "10/19/2026",
    apptDate: "10/21/2026",
    provider: "Dr. Johnson",
    status: "Ready",
  },
  {
    id: "sample-lab-3",
    date: "09/28/2026",
    type: "Denture",
    procedure: "Full Upper Denture",
    lab: "Elite Dental Lab",
    estReceiveDate: "10/12/2026",
    apptDate: "10/14/2026",
    provider: "Dr. Smith",
    status: "Received",
  },
  {
    id: "sample-lab-4",
    date: "09/15/2026",
    type: "Retainer",
    procedure: "Hawley Retainer",
    lab: "Ortho Works",
    estReceiveDate: "09/29/2026",
    apptDate: "10/01/2026",
    provider: "Dr. Lee",
    status: "Complete",
  },
];

export const actionButtonSx = {
  textTransform: "none",
  borderRadius: radius.md,
  fontFamily: "Inter",
  fontSize: fontSize.base,
  fontWeight: fontWeight.semibold,
};

export const menuPaperSx = (minWidth = 180) => ({
  mt: "4px",
  borderRadius: radius.md,
  border: `1px solid ${COLORS.BORDER}`,
  boxShadow: "0px 4px 20px rgba(0,0,0,0.12)",
  minWidth,
});

export const menuItemSx = { py: 0.75, "&:hover": { backgroundColor: COLORS.SURFACE_HOVER } };

export const money = (v) =>
  v != null && v !== "" && !Number.isNaN(Number(v)) ? `$${Number(v).toFixed(2)}` : "";

export const EXPORT_COLUMNS = [
  ["Date", (c) => c.date || ""],
  ["Type", (c) => c.type || ""],
  ["Procedure", (c) => c.procedure || ""],
  ["Lab", (c) => c.lab || ""],
  ["Tracking #", (c) => c.trackingNumber || ""],
  ["Est Receive Date", (c) => c.estReceiveDate || ""],
  ["Appt Date", (c) => c.apptDate || ""],
  ["Provider", (c) => c.provider || ""],
  ["Status", (c) => c.status || ""],
  ["Notes", (c) => c.notes || ""],
  ["Shipping", (c) => money(c.shipping)],
  ["Lab Fee", (c) => money(c.labFee)],
  ["Total", (c) => money(c.total)],
];
