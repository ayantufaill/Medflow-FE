import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Select, MenuItem, Dialog, DialogContent
} from "@mui/material";

// Style constants for table cells
const headerStyle = {
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "#333",
  borderRight: "1px solid #e0e0e0",
  textAlign: "center",
  py: 1,
};

const subHeaderStyle = {
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "#555",
  borderBottom: "1px solid #e0e0e0",
  borderRight: "1px solid #e0e0e0",
  textAlign: "center",
  py: 0.5,
  bgcolor: "#fff"
};

const bodyCellStyle = {
  fontSize: "0.75rem",
  borderRight: "1px solid #e0e0e0",
  verticalAlign: "top",
  py: 1,
  px: 1,
};

const differenceCellStyle = {
  fontSize: "0.7rem",
  borderRight: "1px solid #f0f0f0",
  borderBottom: "1px solid #f0f0f0",
  py: 0.8,
  px: 1,
  wordBreak: "break-all"
};

/**
 * AuditPatientHistoryDialog Component
 * Displays audit history of patient updates in a modal dialog
 * 
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close dialog handler
 * @param {Array} props.auditData - Array of audit records (optional, uses sample data if not provided)
 * @param {String} props.patientId - Patient ID for fetching audit data (optional)
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
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
        }
      }}
    >
      <DialogContent sx={{ p: 0, maxHeight: 'calc(100vh - 96px)' }}>
        <Box sx={{ width: "100%", bgcolor: "#fff" }}>
          {/* Top Banner */}
          <Box sx={{ bgcolor: "#5c7cba", color: "#fff", py: 0.5, textAlign: "center", mb: 1 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Audit Patient History</Typography>
          </Box>

          {/* Filter Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2, gap: 1 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#1976d2", fontWeight: 600 }}>Filter list by:</Typography>
            <Typography sx={{ fontSize: "0.75rem",color: "#1976d2", ml: 2 }}>Action:</Typography>
            <Select size="small" defaultValue="Update" sx={{ height: 25, fontSize: "0.75rem", minWidth: 100 }}>
              <MenuItem value="Update">Update</MenuItem>
            </Select>
          </Box>

          {auditData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                No audit history available
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 0, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
              <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...headerStyle, width: "100px" }}>Date</TableCell>
                    <TableCell sx={{ ...headerStyle, width: "60px" }}>User</TableCell>
                    <TableCell sx={{ ...headerStyle, width: "100px" }}>Name</TableCell>
                    <TableCell sx={{ ...headerStyle, width: "60px" }}>Action</TableCell>
                    <TableCell colSpan={3} sx={{ ...headerStyle, borderRight: 0, p: 0 }}>
                      <Box sx={{ py: 1 }}>Difference</Box>
                      <Box sx={{ display: 'flex' }}>
                        <Box sx={{ ...subHeaderStyle, flex: 1 }}>Key</Box>
                        <Box sx={{ ...subHeaderStyle, flex: 1 }}>Old</Box>
                        <Box sx={{ ...subHeaderStyle, flex: 1, borderRight: 0 }}>New</Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditData.map((row, rowIndex) => (
                    <TableRow key={rowIndex} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell sx={bodyCellStyle}>{row.date}</TableCell>
                      <TableCell sx={bodyCellStyle}>{row.user}</TableCell>
                      <TableCell sx={bodyCellStyle}>{row.name}</TableCell>
                      <TableCell sx={bodyCellStyle}>{row.action}</TableCell>
                      {/* Nested Difference Content */}
                      <TableCell colSpan={3} sx={{ p: 0, borderRight: 0, verticalAlign: 'top' }}>
                        {row.differences.map((diff, diffIndex) => (
                          <Box key={diffIndex} sx={{ display: 'flex', width: '100%' }}>
                            <Box sx={{ ...differenceCellStyle, flex: 1 }}>{diff.key}</Box>
                            <Box sx={{ ...differenceCellStyle, flex: 1 }}>{diff.old}</Box>
                            <Box sx={{ ...differenceCellStyle, flex: 1, borderRight: 0 }}>{diff.new}</Box>
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
      </DialogContent>
    </Dialog>
  );
};

export default AuditPatientHistoryDialog;
