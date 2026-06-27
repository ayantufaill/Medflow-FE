export const STATUS_OPTIONS = [
  { value: "unconfirmed",            label: "Unconfirmed" },
  { value: "preconfirmed",           label: "Preconfirmed" },
  { value: "confirmed",              label: "Confirmed" },
  { value: "arrived",                label: "Arrived" },
  { value: "ready_to_be_seated",     label: "Ready To Be Seated" },
  { value: "seated",                 label: "Seated" },
  { value: "ready_for_doctor",       label: "Ready For Doctor" },
  { value: "in_treatment",           label: "In Treatment" },
  { value: "ready_for_checkout",     label: "Ready For Checkout" },
  { value: "checked_out_incomplete", label: "Checked out incomplete" },
  { value: "checked_out_complete",   label: "Checked out complete" },
  { value: "no_show",                label: "No Show" },
  { value: "call",                   label: "Call" },
  { value: "left_message",           label: "Left message" },
  { value: "running_late",           label: "Running Late" },
  { value: "sent_email_or_text",     label: "Sent Email Or Text" },
  { value: "late",                   label: "Late" },
  { value: "cancelled",              label: "Cancelled" },
  { value: "rescheduled",            label: "Rescheduled" },
];

export const DEFAULT_PROCEDURE_TAGS = [
  { label: "NP",    color: "#0d9488" },
  { label: "Exm",   color: "#92400e", font: "white" },
  { label: "Del",   color: "#4d7c0f", font: "white" },
  { label: "DFV",   color: "#1d4ed8", font: "white" },
  { label: "P-OP",  color: "#c2410c", font: "white" },
  { label: "P-OP",  color: "#ea580c", font: "white" },
  { label: "HYG",   color: "#16a34a", font: "white" },
  { label: "HYG",   color: "#059669", font: "white" },
  { label: "Perio", color: "#6b7280", font: "white" },
  { label: "LOE",   color: "#65a30d", font: "white" },
  { label: "HYG",   color: "#10b981" },
  { label: "POE",   color: "#374151", font: "white" },
  { label: "PA1",   color: "#f87171" },
  { label: "Pano",  color: "#1e293b", font: "white" },
  { label: "PAJ",   color: "#7c3aed", font: "white" },
  { label: "VEL",   color: "#0891b2", font: "white" },
  { label: "RCR",   color: "#1e40af", font: "white" },
  { label: "LTD",   color: "#d97706", font: "white" },
  { label: "FULL",  color: "#7f1d1d", font: "white" },
  { label: "FMD",   color: "#78350f", font: "white" },
];

export const TAG_DEFAULT_PROCEDURES = {
  NP:    { code: "D0150", treatment: "Comprehensive Evaluation",           charge: "$85.00"  },
  Exm:   { code: "D0120", treatment: "Periodic Oral Evaluation",           charge: "$55.00"  },
  FULL:  { code: "D2391", treatment: "Resin Composite – One Surface",      charge: "$185.00" },
  Pano:  { code: "D0330", treatment: "Panoramic Radiographic Image",       charge: "$120.00" },
  HYG:   { code: "D1110", treatment: "Prophy",                             charge: "$120.00" },
  Perio: { code: "D4341", treatment: "Periodontal Scaling & Root Planing", charge: "$220.00" },
  DFV:   { code: "D0220", treatment: "Periapical First Image",             charge: "$30.00"  },
  FMD:   { code: "D0210", treatment: "Complete Series of Radiographs",     charge: "$150.00" },
};

export const DUMMY_PROCEDURE_OPTIONS = [
  { code: "D0120", treatment: "Periodic Oral Evaluation",           tag: { label: "Exm",   color: "#92400e", font: "white" }, charge: "$55.00"  },
  { code: "D0150", treatment: "Comprehensive Evaluation",           tag: { label: "NP",    color: "#0d9488" },                charge: "$85.00"  },
  { code: "D0210", treatment: "Complete Series of Radiographs",     tag: { label: "FMD",   color: "#78350f", font: "white" }, charge: "$150.00" },
  { code: "D0220", treatment: "Periapical First Image",             tag: { label: "DFV",   color: "#1d4ed8", font: "white" }, charge: "$30.00"  },
  { code: "D0330", treatment: "Panoramic Radiographic Image",       tag: { label: "Pano",  color: "#1e293b", font: "white" }, charge: "$120.00" },
  { code: "D1110", treatment: "Prophy",                             tag: { label: "HYG",   color: "#16a34a", font: "white" }, charge: "$120.00" },
  { code: "D1206", treatment: "Fluoride",                           tag: { label: "HYG",   color: "#059669", font: "white" }, charge: "$45.00"  },
  { code: "D2391", treatment: "Resin Composite – One Surface",      tag: { label: "FULL",  color: "#7f1d1d", font: "white" }, charge: "$185.00" },
  { code: "D4341", treatment: "Periodontal Scaling & Root Planing", tag: { label: "Perio", color: "#6b7280", font: "white" }, charge: "$220.00" },
];

export const COLOR_TAGS = [
  "#0d9488", "#f97316", "#eab308",
  "#ef4444", "#8b5cf6", "#06b6d4",
  "#22c55e", "#ec4899",
];

export const INITIAL_PROCEDURES = [
  { id: 1, code: "D1110", site: "Adult",   treatment: "Prophy",             provider: "", charge: "$120.00", checked: true },
  { id: 2, code: "D1206", site: "Varnish", treatment: "Fluoride",           provider: "", charge: "$45.00",  checked: true },
  { id: 3, code: "D0330", site: "",        treatment: "Panoramic Xray",     provider: "", charge: "$120.00", checked: true },
  { id: 4, code: "D0274", site: "",        treatment: "Bitewing Four Xrays",provider: "", charge: "$65.00",  checked: true },
  { id: 5, code: "FMD",   site: "",        treatment: "FMD",                provider: "", charge: "$150.00", checked: true },
  { id: 6, code: "FULL",  site: "",        treatment: "FULL",               provider: "", charge: "$185.00", checked: true },
  { id: 7, code: "POP2",  site: "",        treatment: "P-OP",               provider: "", charge: "$95.00",  checked: true },
  { id: 8, code: "POP",   site: "",        treatment: "P-OP",               provider: "", charge: "$95.00",  checked: true },
  { id: 9, code: "DFV",   site: "",        treatment: "DFV",                provider: "", charge: "$30.00",  checked: true },
];
