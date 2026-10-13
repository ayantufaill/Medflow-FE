import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import VisitDatesTimeline from './VisitDatesTimeline';
import HistoryTimelineEventDialog from './HistoryTimelineEventDialog';
import { formatHistoryTimestamp } from '../../utils/dateUtils';
import { historyEventAction } from '../../utils/patientHistoryTimeline';

export default function PatientHistoryTimeline({ timeline, historyLabel }) {
  const [selectedId, setSelectedId] = useState(null);
  const { events, isPending, isError, isFetching, refetch, timeZone, timeZoneFallback } = timeline;
  const selectedEvent = events.find((event) => event._id === selectedId) || null;
  if (isPending) return <Box role="status" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
    <CircularProgress size={18} /> Loading {historyLabel.toLowerCase()} history changes…
  </Box>;
  return <>
    {isError && <Alert severity="error" action={<Button color="inherit" disabled={isFetching} onClick={() => refetch()}>Retry</Button>}>
      Unable to load {historyLabel.toLowerCase()} history changes.{events.length > 0 ? ' Previously loaded events are shown below.' : ''}
    </Alert>}
    {isFetching && <Typography role="status" variant="caption">Refreshing history…</Typography>}
    {!isError && !events.length && <Typography variant="body2" color="text.secondary">
      No recorded {historyLabel.toLowerCase()} history changes yet.
    </Typography>}
    {events.length > 0 && <>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 1 }}>
        Recorded saves and reviews · {timeZoneFallback ? 'UTC (clinic timezone unavailable)' : `${timeZone} (clinic timezone)`}. Select a date to view changes.
      </Typography>
      <VisitDatesTimeline
        visitDates={events.map((event) => ({
          eventId: event._id,
          label: formatHistoryTimestamp(event.changedAt, timeZone, true),
          description: `${historyEventAction(event)} ${formatHistoryTimestamp(event.changedAt, timeZone)}`,
        }))}
        onEventClick={setSelectedId}
        activeEventId={selectedId}
      />
    </>}
    <HistoryTimelineEventDialog event={selectedEvent} historyLabel={historyLabel} timeZone={timeZone} onClose={() => setSelectedId(null)} />
  </>;
}
