import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";

export const STORAGE_KEY = "medflow-imaging-mounts";

export const patientKey = (patient) => patient?._id || patient?.id || patient?.PatNum;

export const patientName = (patient) =>
  [patient?.FName || patient?.firstName, patient?.LName || patient?.lastName].filter(Boolean).join(" ") ||
  "Selected Patient";

export const defaultMounts = [
  { id: "sample-bw", name: "4 BW", createdAt: "10/15/2026", content: "4 X-Rays", layout: "4 BW" },
  { id: "sample-grid", name: "Grid", createdAt: "10/17/2025", content: "2 X-Rays", layout: "Grid" },
  { id: "sample-old-grid", name: "Grid", createdAt: "10/17/2024", content: "4 X-Rays", layout: "Grid" },
];

export const LAYOUT_OPTIONS = [
  "Grid",
  "2 BW/PA",
  "4 BW",
  "4 PA",
  "4 BW/PA",
  "4 BW 2 PA",
  "4 BW 4 PA",
  "Pediatric 6",
  "FMX 14",
  "FMX 18",
  "FMX 20",
  "Mixed FMX",
  "Cross 5",
];

export const actionButtonSx = {
  textTransform: "none",
  borderRadius: radius.md,
  fontFamily: "Inter",
  fontSize: fontSize.base,
  fontWeight: fontWeight.semibold,
};

export const pillSelectSx = {
  minWidth: 150,
  height: "36px",
  fontFamily: "Inter",
  fontSize: fontSize.md,
  color: COLORS.TEXT_BODY,
  backgroundColor: COLORS.SURFACE_CARD,
  borderRadius: radius.md,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.BORDER },
  "& .MuiSelect-select": { py: "8px" },
};
