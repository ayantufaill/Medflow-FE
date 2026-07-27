export const MOCK_DAY_TASKS = [
  {
    id: "medicalHistory",
    title: "Medical History Updates",
    count: 3,
    total: 3,
    color: "#e2e8f0", // Using a muted slate blue background for header
    headerColor: "#334155",
    items: [
      { id: 1, name: "Jon Teschner", patientId: "#958", icons: ["history", "chat", "check"] },
      { id: 2, name: "Maxwell Landgraf", patientId: "#1300", icons: ["history", "chat", "check"] },
      { id: 3, name: "Marina Varga", patientId: "#1004", icons: ["history", "chat", "check"] },
    ],
  },
  {
    id: "consentForms",
    title: "Sign Consent Forms",
    count: 3,
    total: 6,
    color: "#ccfbf1", // Teal
    headerColor: "#0f766e",
    items: [
      { id: 4, name: "Kali Guy", patientId: "#1287", icons: ["document", "chat", "pending"] },
      { id: 5, name: "Bartlett Cooper", patientId: "#1283", icons: ["document", "chat", "pending"] },
      { id: 6, name: "Evan Carter", patientId: "#1286", icons: ["document", "chat", "pending"] },
      { id: 7, name: "Clarence Bolanos", patientId: "#1292", icons: ["document", "chat", "check"] },
      { id: 8, name: "Bartlett Cooper", patientId: "#1283", icons: ["document", "chat", "check"] },
    ],
  },
  {
    id: "outstandingBalance",
    title: "Outstanding Balance",
    count: 1,
    total: 1,
    color: "#ffe4e6", // Rose
    headerColor: "#be123c",
    items: [
      { id: 9, name: "Bartlett Cooper", patientId: "#1283", balance: "$2,074.00", payment: "$0.00", icons: ["dollar", "chat", "check"] },
    ],
  },
  {
    id: "unconfirmedAppts",
    title: "Unconfirmed Appointments",
    count: 5,
    total: 5,
    color: "#ffedd5", // Orange
    headerColor: "#c2410c",
    items: [
      { id: 10, name: "Jose Gomez", patientId: "#920", icons: ["chat", "check"] },
      { id: 11, name: "Marina Varga", patientId: "#1004", icons: ["chat", "check"] },
      { id: 12, name: "Kali Guy", patientId: "#1287", icons: ["chat", "check"] },
    ],
  },
  {
    id: "unscheduledTreatments",
    title: "Unscheduled Treatments",
    count: 0,
    total: 7,
    color: "#fce7f3", // Pink
    headerColor: "#be185d",
    items: [
      { id: 13, name: "Jose Gomez", patientId: "#920", icons: ["rx", "chat", "pending"] },
      { id: 14, name: "Jon Teschner", patientId: "#958", icons: ["rx", "chat", "pending"] },
      { id: 15, name: "Doug Heathman", patientId: "#414", icons: ["rx", "chat", "pending"] },
    ],
  },
  {
    id: "eligibilityChecks",
    title: "Eligibility Checks",
    count: 9,
    total: 11,
    color: "#e0f2fe", // Light Blue
    headerColor: "#0369a1",
    items: [
      { id: 16, name: "Kali Guy", patientId: "#1287", planId: "567", icons: ["warning", "shield", "shield-plus", "chat", "pending"] },
      { id: 17, name: "Ronda Minor", patientId: "#294", planId: "129", icons: ["warning", "shield", "shield-plus", "chat", "pending"] },
      { id: 18, name: "Jose Gomez", patientId: "#920", planId: "576", icons: ["shield", "chat", "check"] },
    ],
  },
];
