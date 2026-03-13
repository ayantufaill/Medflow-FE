import dayjs from "dayjs";
import { Box, Paper, Typography, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import NotesIcon from "@mui/icons-material/Notes";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const OperatoryScheduleGrid = ({
  OPERATORY_COLUMNS,
  dayAppointments,
  START_HOUR,
  END_HOUR,
  SLOT_MINUTES,
  SLOT_HEIGHT,
  minutesSinceStart,
  clamp,
  getStatusColor,
  selectedDate,
  onSlotClick,
  onScheduleAppointmentClick,
  onAppointmentClick,
}) => {
  const gridTotalMinutes = (END_HOUR - START_HOUR) * 60;
  const gridHeight = (gridTotalMinutes / SLOT_MINUTES) * SLOT_HEIGHT;

  const timeLabels = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    timeLabels.push(dayjs().hour(h).minute(0).format("hA"));
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid #eef2f6",
        bgcolor: "#ffffff",
        overflow: "hidden",
      }}
    >
      <Box sx={{ overflowX: "auto" }}>
        {/* Header Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `80px repeat(${OPERATORY_COLUMNS.length}, 1fr)`,
            borderBottom: "2px solid #eef2f6",
            bgcolor: "#f8fafc",
            minWidth: 900,
          }}
        >
          <Box sx={{ p: 1.5, borderRight: "1px solid #eef2f6" }}>
            <Typography
              sx={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}
            >
              Time
            </Typography>
          </Box>
          {OPERATORY_COLUMNS.map((col) => (
            <Box
              key={col.id}
              sx={{
                p: 1.5,
                borderLeft: "1px solid #eef2f6",
                borderBottom: `3px solid ${col.color}20`,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                {col.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Body Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `80px 1fr`,
            height: 640,
            minWidth: 900,
          }}
        >
          {/* Time Axis */}
          <Box
            sx={{
              position: "relative",
              borderRight: "1px solid #eef2f6",
              bgcolor: "#ffffff",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                height: gridHeight,
              }}
            >
              {timeLabels.map((t, idx) => (
                <Box
                  key={`${t}-${idx}`}
                  sx={{
                    position: "absolute",
                    top: idx * 2 * SLOT_HEIGHT,
                    left: 0,
                    right: 0,
                    transform: "translateY(-50%)",
                    px: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#94a3b8",
                    }}
                  >
                    {t}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Columns Area */}
          <Box>
            <Box
              sx={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: `repeat(${OPERATORY_COLUMNS.length}, 1fr)`,
                width: "100%",
                height: gridHeight,
              }}
            >
              {OPERATORY_COLUMNS.map((col) => {
                const colAppointments = dayAppointments.filter(
                  (a) => a.columnId === col.id,
                );

                return (
                  <Box
                    key={col.id}
                    sx={{
                      position: "relative",
                      borderLeft: "1px solid #eef2f6",
                      bgcolor: "#ffffff",
                    }}
                  >
                    {/* Time Slots */}
                    {Array.from({
                      length: gridTotalMinutes / SLOT_MINUTES,
                    }).map((_, i) => (
                      <Box
                        key={`${col.id}-slot-${i}`}
                        onClick={() =>
                          onSlotClick && onSlotClick(col.id, i * SLOT_MINUTES)
                        }
                        sx={{
                          height: SLOT_HEIGHT,
                          borderBottom: "1px solid #f1f5f9",
                          cursor: "pointer",
                          transition: "background-color 0.1s",
                          "&:hover": {
                            bgcolor: "#f0f9ff",
                          },
                        }}
                      />
                    ))}

                    {/* Appointments */}
                    {colAppointments.map((a) => {
                      const startMin = minutesSinceStart(a.start);
                      const endMin = minutesSinceStart(a.end);
                      const topPx =
                        (clamp(startMin, 0, gridTotalMinutes) /
                          SLOT_MINUTES) *
                        SLOT_HEIGHT;
                      const heightPx =
                        ((clamp(endMin, 0, gridTotalMinutes) -
                          clamp(startMin, 0, gridTotalMinutes)) /
                          SLOT_MINUTES) *
                        SLOT_HEIGHT;

                      const statusColor = getStatusColor ? getStatusColor(a.status, a.color) : a.color;

                      return (
                        <Paper
                          key={a.id}
                          elevation={2}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick && onAppointmentClick(a);
                          }}
                          sx={{
                            position: "absolute",
                            left: 4,
                            right: 4,
                            top: topPx + 4,
                            height: Math.max(68, heightPx - 8),
                            borderRadius: 1.5,
                            bgcolor: "#ffffff",
                            color: "#000000",
                            p: 1,
                            cursor: "pointer",
                            transition: "transform 0.1s, box-shadow 0.1s",
                            overflow: "hidden",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            },
                            display: "flex",
                            flexDirection: "column",
                            border: "2px solid #e0e0e0",
                          }}
                        >
                          {/* Animated Zebra Stripe Band */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "12px",
                              background: `repeating-linear-gradient(
                                90deg,
                                ${statusColor} 0px,
                                ${statusColor} 12px,
                                transparent 12px,
                                transparent 24px
                              )`,
                              animation: "slide 1s linear infinite",
                              "@keyframes slide": {
                                "0%": {
                                  backgroundPosition: "0 0",
                                },
                                "100%": {
                                  backgroundPosition: "24px 0",
                                },
                              },
                            }}
                          />
                          <Box
                            sx={{
                              mb: 0.5,
                              px: 0.6,
                              py: 0.2,
                              borderRadius: 999,
                              border: "1px solid rgba(0,0,0,0.3)",
                              fontSize: 9,
                              fontWeight: 600,
                              letterSpacing: 0.4,
                              textTransform: "uppercase",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.3,
                              mt: 1.5,
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 10 }} />
                            {(a.status || "unconfirmed").toUpperCase()}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 0.25,
                            }}
                          >
                            <PersonIcon sx={{ fontSize: 12, color: "#757575" }} />
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 700,
                                lineHeight: 1.3,
                                color: "#212121",
                              }}
                            >
                              {a.patientName}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 0.25,
                            }}
                          >
                            <NotesIcon sx={{ fontSize: 12, color: "#757575" }} />
                            <Typography
                              sx={{
                                fontSize: 10,
                                lineHeight: 1.3,
                                color: "#424242",
                              }}
                            >
                              {a.title}
                            </Typography>
                          </Box>
                          {a.note && (
                            <Typography
                              sx={{
                                mt: 0.25,
                                fontSize: 9,
                                color: "#757575",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                              }}
                            >
                              <EventNoteIcon sx={{ fontSize: 9 }} />
                              {a.note}
                            </Typography>
                          )}
                          <Box
                            sx={{
                              mt: "auto",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <AccessTimeIcon sx={{ fontSize: 10 }} />
                            <Typography sx={{ fontSize: 9, opacity: 0.9 }}>
                              {dayjs(a.start).format("h:mm")} -{" "}
                              {dayjs(a.end).format("h:mm")}
                            </Typography>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Actions */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #eef2f6",
          bgcolor: "#f8fafc",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
      </Box>
    </Paper>
  );
};

export default OperatoryScheduleGrid;

