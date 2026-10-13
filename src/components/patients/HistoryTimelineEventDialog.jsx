import {
  Box, Button, Dialog, IconButton, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatHistoryTimestamp } from '../../utils/dateUtils';
import { historyEventAction, historyEventActor, historyEventDifferences } from '../../utils/patientHistoryTimeline';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

export default function HistoryTimelineEventDialog({ event, historyLabel, timeZone, onClose }) {
  const differences = event ? historyEventDifferences(event, timeZone) : [];
  return (
    <Dialog 
      open={!!event} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md" 
      aria-labelledby="history-event-title"
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: {
          borderRadius: radius.lg,
          overflow: 'hidden',
        }
      }}
    >
      <Box sx={{
        boxSizing: "border-box",
        px: "25px",
        py: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        borderBottom: `1px solid ${COLORS.BORDER}`,
        backgroundColor: COLORS.SURFACE_TINT,
        m: 0,
        flexShrink: 0,
      }}>
        <Typography
          id="history-event-title"
          sx={{
            fontSize: "15px",
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_PRIMARY,
            flex: 1,
          }}
        >
          {historyLabel} history — recorded changes
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {event && <>
          <Box>
            <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
              {historyEventAction(event)}: {formatHistoryTimestamp(event.changedAt, timeZone)} ({timeZone})
            </Typography>
            <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
              Recorded by: {historyEventActor(event)}
            </Typography>
          </Box>

          {differences.length ? (
            <TableContainer sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, overflow: 'hidden' }}>
              <Table size="small" aria-label="Recorded history changes" sx={{ tableLayout: 'fixed' }}>
                <TableHead sx={{ bgcolor: COLORS.SURFACE_HOVER }}>
                  <TableRow>
                    <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold, borderBottom: `1px solid ${COLORS.BORDER}` }}>Field</TableCell>
                    <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold, borderBottom: `1px solid ${COLORS.BORDER}` }}>Before</TableCell>
                    <TableCell sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold, borderBottom: `1px solid ${COLORS.BORDER}` }}>After</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {differences.map((difference, index) => {
                    const isLast = index === differences.length - 1;
                    const cellBorder = isLast ? 'none' : `1px solid ${COLORS.BORDER}`;
                    return (
                      <TableRow key={difference.key} sx={{ '& td, & th': { overflowWrap: 'anywhere', whiteSpace: 'pre-wrap', verticalAlign: 'top', borderBottom: cellBorder } }}>
                        <TableCell component="th" scope="row" sx={{ color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium }}>{difference.key}</TableCell>
                        <TableCell sx={{ color: COLORS.TEXT_SECONDARY }}>{difference.before}</TableCell>
                        <TableCell sx={{ color: COLORS.TEXT_SECONDARY }}>{difference.after}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: COLORS.SURFACE_INPUT, borderRadius: radius.md, border: `1px dashed ${COLORS.BORDER}` }}>
              <Typography sx={{ color: COLORS.TEXT_MUTED, fontSize: fontSize.md }}>
                No field changes were recorded in this event.
              </Typography>
            </Box>
          )}
        </>}
      </Box>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, bgcolor: '#fff', borderTop: `1px solid ${COLORS.BORDER}`, flexShrink: 0 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ 
            minWidth: 112, 
            height: 38, 
            borderRadius: radius.md, 
            borderColor: COLORS.BORDER, 
            color: COLORS.TEXT_BODY, 
            textTransform: 'none', 
            fontWeight: fontWeight.semibold, 
            '&:hover': { borderColor: COLORS.TEXT_MUTED, bgcolor: COLORS.SURFACE_HOVER } 
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
}
