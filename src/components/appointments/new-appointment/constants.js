export const STATUS_OPTIONS = [
  { value: "scheduled",              label: "Scheduled" },
  { value: "unconfirmed",            label: "Unconfirmed" },
  { value: "preconfirmed",           label: "Preconfirmed" },
  { value: "confirmed",              label: "Confirmed" },
  { value: "arrived",                label: "Arrived" },
  { value: "ready_to_be_seated",     label: "Ready To Be Seated" },
  { value: "seated",                 label: "Seated" },
  { value: "ready_for_doctor",       label: "Ready For Doctor" },
  { value: "in_treatment",           label: "In Treatment" },
  { value: "ready_for_checkout",     label: "Ready For Checkout" },
  { value: "checked_out_incomplete", label: "Checked Out Incomplete" },
  { value: "checked_out_complete",   label: "Checked Out Complete" },
  { value: "completed",              label: "Completed" },
  { value: "no_show",                label: "No Show" },
  { value: "call",                   label: "Call" },
  { value: "left_message",           label: "Left Message" },
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

import AsapSvg from "../../../assets/Tags/ASAP.svg";
import BalanceSvg from "../../../assets/Tags/Balance.svg";
import BotoxSvg from "../../../assets/Tags/Botox.svg";
import CreditSvg from "../../../assets/Tags/Credit.svg";
import DebitSvg from "../../../assets/Tags/Debit.svg";
import DeliveryReceivedSvg from "../../../assets/Tags/Delivery Received.svg";
import DeliverySentSvg from "../../../assets/Tags/Delivery Sent.svg";
import DeliverySvg from "../../../assets/Tags/Delivery.svg";
import DoctorSvg from "../../../assets/Tags/Doctor.svg";
import DoubleAppointmentSvg from "../../../assets/Tags/Double Appointment.svg";
import EmergencySvg from "../../../assets/Tags/Emergency.svg";
import ExamSvg from "../../../assets/Tags/Exam.svg";
import FamilySvg from "../../../assets/Tags/Family.svg";
import FillerSvg from "../../../assets/Tags/Filler.svg";
import HygieneSvg from "../../../assets/Tags/Hygiene.svg";
import MissingDocumentSvg from "../../../assets/Tags/Missing Document.svg";
import NeedsSedationSvg from "../../../assets/Tags/Needs Sedation.svg";
import NewPatientSvg from "../../../assets/Tags/New Patient.svg";
import PredeterminationSvg from "../../../assets/Tags/Predetermination.svg";
import SendDocumentSvg from "../../../assets/Tags/Send Document.svg";
import TreatmentPlanSvg from "../../../assets/Tags/Treatment Plan.svg";
import VerifiedSvg from "../../../assets/Tags/Verified.svg";
import RadiographSvg from "../../../assets/Tags/radiograph.svg";

export const ICON_TAGS = [
  { id: 'Delivery', label: 'Delivery', src: DeliverySvg },
  { id: 'Delivery Received', label: 'Delivery Received', src: DeliveryReceivedSvg },
  { id: 'Delivery Sent', label: 'Delivery Sent', src: DeliverySentSvg },
  { id: 'Emergency', label: 'Emergency', src: EmergencySvg },
  { id: 'Exam', label: 'Exam', src: ExamSvg },
  { id: 'Needs Sedation', label: 'Needs Sedation', src: NeedsSedationSvg },
  { id: 'New Patient', label: 'New Patient', src: NewPatientSvg },
  { id: 'radiograph', label: 'Radiograph', src: RadiographSvg },
  { id: 'ASAP', label: 'ASAP', src: AsapSvg },
  { id: 'Balance', label: 'Balance', src: BalanceSvg },
  { id: 'Double Appointment', label: 'Double Appointment', src: DoubleAppointmentSvg },
  { id: 'Doctor', label: 'Doctor', src: DoctorSvg },
  { id: 'Family', label: 'Family', src: FamilySvg },
  { id: 'Hygiene', label: 'Hygiene', src: HygieneSvg },
  { id: 'Missing Document', label: 'Missing Document', src: MissingDocumentSvg },
  { id: 'Predetermination', label: 'Predetermination', src: PredeterminationSvg },
  { id: 'Send Document', label: 'Send Document', src: SendDocumentSvg },
  { id: 'Treatment Plan', label: 'Treatment Plan', src: TreatmentPlanSvg },
  { id: 'Verified', label: 'Verified', src: VerifiedSvg },
  { id: 'Credit', label: 'Credit', src: CreditSvg },
  { id: 'Debit', label: 'Debit', src: DebitSvg },
  { id: 'Filler', label: 'Filler', src: FillerSvg },
  { id: 'Botox', label: 'Botox', src: BotoxSvg },
];

export const INITIAL_PROCEDURES = [];
