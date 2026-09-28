import { Box, Button, Typography } from "@mui/material";
import { PersonOutline, EmailOutlined, MessageOutlined, ScienceOutlined, HistoryOutlined } from "@mui/icons-material";
import dayjs from "dayjs";

const AppointmentFooter = ({ patient, patientDisplayName, patientId, onCancel, onSubmit, onSaveAsDraft, loading, showExtendedOptions, isEditMode, readOnly, onLabOrderClick, computedVisitType, hasConflict = false, isEditing, onEnterEdit, onToggleEdit, isRescheduling, createdBy, createdAt, onViewAuditHistory }) => (
  <Box sx={{ flexShrink: 0, borderTop: '1px solid #e0e5eb' }}>

    {/* Lab Order + Reminder strip — only when opened from PatientCard Book button */}
    {showExtendedOptions && (
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: '20px', py: '10px', borderBottom: '1px solid #f0f0f0',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#6b7280' }}>
            Send a reminder to "save the date" now:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
            <EmailOutlined sx={{ fontSize: '15px', color: '#374151' }} />
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#374151' }}>Via Email</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', '&:hover': { opacity: 0.75 } }}>
            <MessageOutlined sx={{ fontSize: '15px', color: '#374151' }} />
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#374151' }}>Via Text Message</Typography>
          </Box>
        </Box>
      </Box>
    )}

    {/* Save/Cancel row */}
    <Box sx={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      px: "20px", py: "12px",
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
       <Box onClick={onLabOrderClick} sx={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <ScienceOutlined sx={{ fontSize: '15px', color: '#2262ef' }} />
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#2262ef', '&:hover': { textDecoration: 'underline' } }}>
            + Lab Order
          </Typography>
        </Box>

        <PersonOutline sx={{ fontSize: "16px", color: "#9aa3ae" }} />
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#6b7280" }}>
          Booking for{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "#09121f" }}>
            {patientDisplayName || "—"}
          </Box>
          {patient && (
            <Box component="span" sx={{ color: "#9aa3ae" }}> · pt #{patientId || "—"}</Box>
          )}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {isEditMode && createdBy && (
          <Box
            onClick={onViewAuditHistory}
            sx={{
              display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
              px: '8px', py: '4px', borderRadius: '6px',
              border: '1px solid #e0e5eb',
              '&:hover': { backgroundColor: '#f0f4ff', borderColor: '#2262ef' },
              transition: 'all 0.15s',
            }}
          >
            <HistoryOutlined sx={{ fontSize: '13px', color: '#2262ef' }} />
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#374151' }}>
              Created by{' '}
              <Box component="span" sx={{ fontWeight: 600, color: '#09121f' }}>
                {(() => {
                  if (typeof createdBy !== 'object' || !createdBy) return createdBy || 'Unknown';
                  const fullName = `${createdBy.firstName || ''} ${createdBy.lastName || ''}`.trim();
                  const isEmail = (s) => s && s.includes('@');
                  // If firstName is actually an email (OpenDental UserName), prefer email field or show it as-is
                  if (isEmail(fullName)) return createdBy.email || fullName;
                  return fullName || createdBy.email || 'Unknown';
                })()}
              </Box>
              {createdAt && (
                <Box component="span" sx={{ color: '#9aa3ae' }}>
                  {' '}on {dayjs(createdAt).format('MM/DD/YYYY')} at {dayjs(createdAt).format('h:mmA')}
                </Box>
              )}
            </Typography>
          </Box>
        )}

        <Button
          variant="outlined"
          color="inherit"
          onClick={isEditing ? onToggleEdit : onCancel}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
{isEditMode && !isRescheduling && !isEditing && (
          <Button
            variant="contained"
            disableElevation
            onClick={onEnterEdit}
            sx={{
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              px: "20px", py: "7px",
              "&:hover": { backgroundColor: "#1a50cc" },
              "&.Mui-disabled": { backgroundColor: "#c5d3f8", color: "#fff", cursor: "not-allowed" },
            }}
          >
            Edit
          </Button>
        )}
        {!readOnly && (
          <Button
            variant="contained"
            disableElevation
            onClick={onSubmit}
            disabled={loading || !patient || hasConflict}
            sx={{
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              px: "20px", py: "7px",
              "&:hover": { backgroundColor: "#1a50cc" },
              "&.Mui-disabled": { backgroundColor: "#c5d3f8", color: "#fff", cursor: "not-allowed" },
            }}
          >
            {loading ? "Saving…" : (!isEditMode ? "Add appointment" : (computedVisitType ? `Add ${computedVisitType} appointment` : "Save"))}
          </Button>
        )}
      </Box>
    </Box>
  </Box>
);

export default AppointmentFooter;
