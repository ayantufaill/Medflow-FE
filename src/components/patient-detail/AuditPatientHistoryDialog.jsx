import {
  Dialog, Box, Typography, IconButton, Button,
  Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius, roundedSelectMenuProps } from "../../constants/styles";

// Nested Key/Old/New sub-header for the "Difference" column group — same idea as
// before, restyled to match the table header convention (see below) instead of
// hardcoded hex colors.
const diffSubHeaderSx = {
  fontFamily: "Inter",
  fontSize: fontSize.xs,
  fontWeight: fontWeight.semibold,
  color: COLORS.TEXT_MUTED,
  letterSpacing: "0.3px",
  textTransform: "uppercase",
  py: 0.5,
  borderBottom: `1px solid ${COLORS.BORDER}`,
};

const diffCellSx = {
  fontFamily: "Inter",
  fontSize: fontSize.sm,
  color: COLORS.TEXT_BODY,
  py: 0.75,
  px: 1,
  wordBreak: "break-word",
};

/**
 * AuditPatientHistoryDialog — audit log of patient-record changes.
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {Array} [props.auditData] - defaults to sample data when not provided
 * @param {String} [props.patientId]
 */
const AuditPatientHistoryDialog = ({ open, onClose, auditData: propAuditData, patientId }) => {
  // Sample data - will be replaced with actual API data when available
  const defaultAuditData = [
    {
      date: "01/22/2026 01:23:19",
      user: "Cloud Temp",
      name: "SecurePatient",
      action: "Update",
      differences: [
        { key: "/lastUpdateDate", old: "01/19/2026 09:04 AM", new: "01/22/2026 01:23 PM" },
        { key: "/isHeadOfHouseHold", old: "true", new: "" },
        { key: "/externalInfo/importedUuid", old: "2c4ca9c2-a183-4337-a920-81b7be2b77b5", new: "" },
        { key: "/additionalInfo/hasPremed", old: "false", new: "" },
      ]
    },
    {
      date: "01/22/2026 01:23:26",
      user: "Cloud Temp",
      name: "SecurePatient",
      action: "Update",
      differences: [
        { key: "/patientInfo/preferredName/cipherS", old: "", new: "Anni" },
        { key: "/lastUpdateDate", old: "01/22/2026 01:23 PM", new: "01/22/2026 01:23 PM" },
      ]
    },
    {
      date: "01/21/2026 03:45:12",
      user: "Dr. Smith",
      name: "John Anderson",
      action: "Update",
      differences: [
        { key: "/patientInfo/firstName", old: "Jon", new: "John" },
        { key: "/contactInfo/phone", old: "555-1234", new: "555-5678" },
        { key: "/insuranceInfo/primaryCarrier", old: "Blue Cross", new: "Aetna" },
      ]
    },
    {
      date: "01/21/2026 10:15:33",
      user: "Admin User",
      name: "Sarah Miller",
      action: "Create",
      differences: [
        { key: "/patientInfo/firstName", old: "", new: "Sarah" },
        { key: "/patientInfo/lastName", old: "", new: "Miller" },
        { key: "/patientInfo/dateOfBirth", old: "", new: "03/15/1985" },
        { key: "/contactInfo/email", old: "", new: "sarah.miller@email.com" },
      ]
    },
    {
      date: "01/20/2026 02:30:45",
      user: "Nurse Jane",
      name: "Michael Chen",
      action: "Update",
      differences: [
        { key: "/medicalHistory/allergies", old: "Penicillin", new: "Penicillin, Sulfa" },
        { key: "/vitalSigns/bloodPressure", old: "120/80", new: "125/82" },
        { key: "/lastUpdateDate", old: "01/18/2026 11:00 AM", new: "01/20/2026 02:30 PM" },
      ]
    },
    {
      date: "01/20/2026 09:12:18",
      user: "Cloud Temp",
      name: "Emily Rodriguez",
      action: "Update",
      differences: [
        { key: "/contactInfo/address/street", old: "123 Main St", new: "456 Oak Ave" },
        { key: "/contactInfo/address/city", old: "Springfield", new: "Riverside" },
        { key: "/contactInfo/address/zipCode", old: "12345", new: "67890" },
      ]
    },
    {
      date: "01/19/2026 04:22:56",
      user: "Dr. Johnson",
      name: "Robert Taylor",
      action: "Update",
      differences: [
        { key: "/dentalHistory/lastExamDate", old: "06/15/2025", new: "01/19/2026" },
        { key: "/dentalHistory/nextAppointmentDate", old: "12/15/2025", new: "07/19/2026" },
      ]
    },
    {
      date: "01/19/2026 11:45:30",
      user: "Admin User",
      name: "Lisa Thompson",
      action: "Update",
      differences: [
        { key: "/insuranceInfo/policyNumber", old: "BC123456", new: "BC789012" },
        { key: "/insuranceInfo/groupNumber", old: "G100", new: "G200" },
        { key: "/insuranceInfo/effectiveDate", old: "01/01/2025", new: "01/01/2026" },
      ]
    },
    {
      date: "01/18/2026 03:18:42",
      user: "Dr. Smith",
      name: "David Wilson",
      action: "Update",
      differences: [
        { key: "/medicalHistory/currentMedications", old: "Lisinopril 10mg", new: "Lisinopril 20mg" },
        { key: "/medicalHistory/chronicConditions", old: "Hypertension", new: "Hypertension, Diabetes Type 2" },
      ]
    },
    {
      date: "01/18/2026 08:55:15",
      user: "Nurse Jane",
      name: "Jennifer Martinez",
      action: "Update",
      differences: [
        { key: "/contactInfo/employer", old: "ABC Corp", new: "XYZ Industries" },
        { key: "/contactInfo/workPhone", old: "555-9000", new: "555-8000" },
      ]
    },
    {
      date: "01/17/2026 01:33:27",
      user: "Cloud Temp",
      name: "Christopher Lee",
      action: "Update",
      differences: [
        { key: "/patientInfo/maritalStatus", old: "Single", new: "Married" },
        { key: "/emergencyContact/name", old: "", new: "Maria Lee" },
        { key: "/emergencyContact/relationship", old: "", new: "Spouse" },
        { key: "/emergencyContact/phone", old: "", new: "555-7000" },
      ]
    },
    {
      date: "01/17/2026 10:20:50",
      user: "Dr. Johnson",
      name: "Amanda White",
      action: "Update",
      differences: [
        { key: "/dentalHistory/treatmentPlan", old: "Root canal tooth #14", new: "Crown tooth #14" },
        { key: "/dentalHistory/notes", old: "Patient scheduled for RCT", new: "RCT completed, crown prep scheduled" },
      ]
    },
    {
      date: "01/16/2026 02:45:38",
      user: "Admin User",
      name: "Daniel Harris",
      action: "Update",
      differences: [
        { key: "/patientInfo/languagePreference", old: "English", new: "Spanish" },
        { key: "/contactInfo/mobilePhone", old: "555-6000", new: "555-6001" },
        { key: "/contactInfo/email", old: "d.harris@oldmail.com", new: "daniel.harris@newmail.com" },
      ]
    },
    {
      date: "01/16/2026 09:10:22",
      user: "Nurse Jane",
      name: "Jessica Clark",
      action: "Update",
      differences: [
        { key: "/vitalSigns/weight", old: "150 lbs", new: "148 lbs" },
        { key: "/vitalSigns/height", old: "5'6\"", new: "5'6\"" },
        { key: "/vitalSigns/bmi", old: "24.2", new: "23.9" },
      ]
    },
    {
      date: "01/15/2026 04:58:11",
      user: "Dr. Smith",
      name: "Matthew Lewis",
      action: "Update",
      differences: [
        { key: "/medicalHistory/surgicalHistory", old: "Appendectomy 2020", new: "Appendectomy 2020, Tonsillectomy 2015" },
        { key: "/medicalHistory/familyHistory", old: "Father: Heart Disease", new: "Father: Heart Disease, Mother: Diabetes" },
      ]
    },
    {
      date: "01/15/2026 11:35:47",
      user: "Cloud Temp",
      name: "Ashley Robinson",
      action: "Update",
      differences: [
        { key: "/patientInfo/gender", old: "F", new: "F" },
        { key: "/patientInfo/ssn", old: "***-**-1234", new: "***-**-5678" },
        { key: "/additionalInfo/occupation", old: "Teacher", new: "School Administrator" },
      ]
    }
  ];

  // Use provided auditData or fall back to default sample data
  const auditData = propAuditData || defaultAuditData;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: radius.lg, p: 0, maxHeight: "calc(80vh - 96px)" } }}
    >
      {/* Header — same SURFACE_TINT + close-X treatment as BlockSlotModal.jsx / AddCreditCardModal.jsx */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2.5,
        py: 1.25,
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
      }}>
        <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
          Audit Patient History
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: COLORS.TEXT_MUTED, p: "4px" }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Filter row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY }}>
            Filter list by:
          </Typography>
          <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
            Action:
          </Typography>
          <Select
            size="small"
            defaultValue="Update"
            MenuProps={roundedSelectMenuProps.PaperProps ? roundedSelectMenuProps : undefined}
            sx={{
              minWidth: 120,
              fontFamily: "Inter",
              fontSize: fontSize.md,
              "& .MuiSelect-select": { py: "6px" },
              borderRadius: radius.md,
            }}
          >
            <MenuItem value="Update" sx={{ fontFamily: "Inter", fontSize: fontSize.md }}>Update</MenuItem>
          </Select>
        </Box>

        {auditData.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, color: COLORS.TEXT_MUTED }}>
              No audit history available
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.lg, maxHeight: "calc(100vh - 280px)", overflow: "auto" }}>
            <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow sx={{
                  "& .MuiTableCell-head": {
                    fontFamily: "Inter",
                    fontSize: fontSize.sm,
                    fontWeight: fontWeight.semibold,
                    color: COLORS.TEXT_MUTED,
                    letterSpacing: "0.4px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    backgroundColor: COLORS.SURFACE_CARD,
                    borderBottom: `1px solid ${COLORS.BORDER}`,
                  },
                }}>
                  <TableCell sx={{ width: 130 }}>Date</TableCell>
                  <TableCell sx={{ width: 90 }}>User</TableCell>
                  <TableCell sx={{ width: 110 }}>Name</TableCell>
                  <TableCell sx={{ width: 80 }}>Action</TableCell>
                  <TableCell colSpan={3} sx={{ p: 0 }}>
                    <Box sx={{ py: 1, px: 1.5 }}>Difference</Box>
                    <Box sx={{ display: "flex", borderTop: `1px solid ${COLORS.BORDER}` }}>
                      <Box sx={{ ...diffSubHeaderSx, flex: 1, px: 1.5 }}>Key</Box>
                      <Box sx={{ ...diffSubHeaderSx, flex: 1, px: 1.5, borderLeft: `1px solid ${COLORS.BORDER}` }}>Old</Box>
                      <Box sx={{ ...diffSubHeaderSx, flex: 1, px: 1.5, borderLeft: `1px solid ${COLORS.BORDER}` }}>New</Box>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} hover>
                    <TableCell sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_BODY, verticalAlign: "top", borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>
                      {row.date}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_BODY, verticalAlign: "top", borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>
                      {row.user}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_BODY, verticalAlign: "top", borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_BODY, verticalAlign: "top", borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>
                      {row.action}
                    </TableCell>
                    <TableCell colSpan={3} sx={{ p: 0, verticalAlign: "top", borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>
                      {row.differences.map((diff, diffIndex) => (
                        <Box key={diffIndex} sx={{ display: "flex", width: "100%", borderTop: diffIndex > 0 ? `1px solid ${COLORS.BORDER_VERY_LIGHT}` : "none" }}>
                          <Box sx={{ ...diffCellSx, flex: 1 }}>{diff.key}</Box>
                          <Box sx={{ ...diffCellSx, flex: 1, borderLeft: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>{diff.old}</Box>
                          <Box sx={{ ...diffCellSx, flex: 1, borderLeft: `1px solid ${COLORS.BORDER_VERY_LIGHT}` }}>{diff.new}</Box>
                        </Box>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Footer — same treatment as AddCreditCardModal.jsx / AddBankAccountModal.jsx */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.BORDER}`,
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: COLORS.SURFACE_FOOTER,
      }}>
        <Button
          variant="outlined"
          size="small"
          onClick={onClose}
          sx={{
            borderRadius: radius.sm,
            textTransform: "none",
            fontSize: fontSize.md,
            fontWeight: fontWeight.medium,
            px: 2,
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            "&:hover": { borderColor: COLORS.TEXT_MUTED, backgroundColor: "rgba(0,0,0,0.02)" },
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default AuditPatientHistoryDialog;
