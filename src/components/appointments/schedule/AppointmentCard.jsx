import { useRef, useState } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { fetchPatientById } from "../../../store/slices/patientSlice";
import {
  Phone,
  OpenInNew,
  Add,
  Description,
  AttachMoney,
  FiberManualRecord,
  MedicalServices,
  Tune,
  AcUnit,
  AssignmentOutlined,
  PhoneOutlined,
} from "@mui/icons-material";
import AppointmentHoverCard from "./AppointmentHoverCard";
import dayjs from "dayjs";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight, radius } from "../../../constants/styles";
import ToothSvg from "../../../assets/operatory icons/Vector (2).svg";
import { ICON_TAGS } from "../new-appointment/constants";

const getPrivacyName = (fullName) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0).toUpperCase()} ${parts[parts.length - 1].charAt(0).toUpperCase()}`;
};

const getAge = (dob) => {
  if (!dob) return "";
  const age = dayjs().diff(dayjs(dob), 'year');
  return Number.isNaN(age) ? "" : `(${age})`;
};

const STATUS_CONFIG = {
  PRECONFIRMED: { bg: COLORS.STATUS_PRECONFIRMED },
  UNCONFIRMED: { bg: COLORS.STATUS_UNCONFIRMED },
  CONFIRMED: { bg: COLORS.STATUS_CONFIRMED },
};

const getTagLabel = (tag) =>
  typeof tag === "object" && tag !== null ? tag.label : tag;

const TAG_STYLE = (tag) => {
  if (typeof tag === "object" && tag !== null && tag.color) {
    return { bg: tag.color, color: tag.font || COLORS.WHITE, border: "none" };
  }

  const label = getTagLabel(tag);
  if (label === "EXM" || label === "Exm")
    return { bg: "#92400e", color: COLORS.WHITE, border: "none" };
  if (label === "Xray")
    return { bg: "#1f2937", color: COLORS.WHITE, border: "none" };
  return { bg: COLORS.WHITE, color: "#374151", border: `1px solid #d1d5db` };
};

const TagCircle = ({ icon, bg }) => (
  <Box
    sx={{
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {icon}
  </Box>
);

const BlockCard = ({ title, blockId, block }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `block-${blockId}`,
    data: {
      isBlockSlot: true,
      blockId,
      block,
    },
  });

  const handleBlockClick = (e) => {
    if (e.defaultPrevented) return;
    window.dispatchEvent(new CustomEvent('block-card-clicked', {
      detail: { blockId, block },
    }));
  };

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleBlockClick}
      sx={{
        height: "100%",
      border: `1.5px dashed ${block.color ? "rgba(0,0,0,0.2)" : "#90caf9"}`,
      borderRadius: radius.sm,
      backgroundColor: block.color || "#eef4ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: "8px",
      cursor: "pointer"
    }}
  >
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: fontWeight.medium,
          color: '#1f2937', // dark gray, readable on pastel backgrounds
        }}
      >
      {title}
    </Typography>
  </Box>
  );
};

// Returns a size tier based on appointment duration in minutes:
//   'xs'     < 20 min  — header bar only
//   'sm'  20–44 min  — header + procedures line
//   'md'  45–74 min  — + status stripe + tags
//   'lg'    >= 75 min  — full card (description + footer)
const getSizeTier = (durationMinutes = 60) => {
  if (durationMinutes < 20) return "xs";
  if (durationMinutes < 45) return "sm";
  if (durationMinutes < 55) return "md";
  return "lg";
};

const AppointmentCard = ({ appointment, privacyMode }) => {
  const cardRef = useRef(null);
  const leaveTimer = useRef(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // When an appointment is clicked, update the Redux patient so the left panel
  // PatientCard and AppointmentChecklist react to the newly selected patient.
  const handleCardClick = (e) => {
    console.log("AppointmentCard: SINGLE CLICK FIRED");
    if (e.defaultPrevented) return;
    window.dispatchEvent(new CustomEvent('appointment-card-clicked', {
      detail: { ...appointment },
    }));
    if (appointment.patientId) {
      const pId = typeof appointment.patientId === 'object' 
        ? appointment.patientId._id || appointment.patientId.id || appointment.patientId.PatNum 
        : appointment.patientId;
      if (pId) dispatch(fetchPatientById(pId));
    }
  };

  const handleCardDoubleClick = (e) => {
    console.log("AppointmentCard: DOUBLE CLICK FIRED");
    if (e.defaultPrevented) return;
    window.dispatchEvent(new CustomEvent('appointment-card-double-clicked', {
      detail: { ...appointment },
    }));
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `appt-${appointment.id}`,
    data: {
      isAppointment: true,
      appointmentId: appointment.id,
      appointment,
    },
  });

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current);
    if (cardRef.current) setAnchorRect(cardRef.current.getBoundingClientRect());
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setAnchorRect(null), 200);
  };

  if (appointment.type === "block")
    return <BlockCard title={appointment.title} blockId={appointment.id} block={appointment} />;

  const statusCfg =
    STATUS_CONFIG[appointment.status] ?? STATUS_CONFIG.CONFIRMED;
  const tier = getSizeTier(appointment.durationMinutes);
  const colorTags = Array.isArray(appointment.colorTags)
    ? appointment.colorTags.filter(
        (color) => typeof color === "string" && color.trim(),
      )
    : [];

  const statusStr = String(appointment.status || '').toLowerCase();
  const isGhosted = statusStr === 'cancelled' || statusStr === 'no_show' || statusStr === 'no show' || statusStr === 'broken';

  // xs: just a coloured header bar with name + time, no body at all
  if (tier === "xs") {
    return (
      <>
        <Box
          ref={(node) => {
            setNodeRef(node);
            cardRef.current = node;
          }}
          {...listeners}
          {...attributes}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          onDoubleClick={handleCardDoubleClick}
          sx={{
            height: "100%",
            borderRadius: radius.sm,
            overflow: "hidden",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.10)",
            display: "flex",
            flexDirection: "row",
            cursor: "pointer",
            opacity: isGhosted ? 0.7 : 1,
          }}
        >
          <Box
            sx={{
              flex: 1,
              backgroundColor: appointment.headerColor,
              px: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontWeight: fontWeight.bold,
                fontSize: fontSize.xs,
                color: COLORS.WHITE,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {privacyMode ? getPrivacyName(appointment.patientName) : appointment.patientName} {getAge(appointment.dob)}
            </Typography>
            <Typography
              sx={{
                fontWeight: fontWeight.semibold,
                fontSize: fontSize.xs,
                color: COLORS.WHITE,
                flexShrink: 0,
                ml: "4px",
              }}
            >
              {appointment.time}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "22px",
              backgroundColor: "#dbeafe",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              flexShrink: 0,
            }}
          >
            <PhoneOutlined sx={{ fontSize: "13px", color: "#2563eb" }} />
            <OpenInNew sx={{ fontSize: "13px", color: "#2563eb" }} />
          </Box>
        </Box>
        {anchorRect && (
          <AppointmentHoverCard
            appointment={appointment}
            anchorRect={anchorRect}
            privacyMode={privacyMode}
            onMouseEnter={() => clearTimeout(leaveTimer.current)}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Box
        ref={(node) => {
          setNodeRef(node);
          cardRef.current = node;
        }}
        {...listeners}
        {...attributes}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        onDoubleClick={handleCardDoubleClick}
        sx={{
          height: "100%",
          borderRadius: radius.md,
          overflow: "hidden",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "row",
          cursor: "pointer",
          opacity: isGhosted ? 0.7 : 1,
        }}
      >
        {/* Main content column */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: appointment.headerColor,
              px: "8px",
              py: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontWeight: fontWeight.bold,
                fontSize: fontSize.xs,
                color: COLORS.WHITE,
                letterSpacing: "0.5px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {privacyMode ? getPrivacyName(appointment.patientName) : appointment.patientName} {getAge(appointment.dob)}
            </Typography>
            <Typography
              sx={{
                fontWeight: fontWeight.semibold,
                fontSize: fontSize.xs,
                color: COLORS.WHITE,
              }}
            >
              {appointment.time}
            </Typography>
          </Box>

          {/* Status stripe — hidden on sm to save vertical space */}
          {tier !== "sm" && (
            <Box
              sx={{
                backgroundColor: statusCfg.bg,
                py: appointment.durationMinutes < 75 ? "1px" : "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize:
                    appointment.durationMinutes < 75 ? "9px" : fontSize.xs,
                  fontWeight: fontWeight.bold,
                  color: COLORS.WHITE,
                  letterSpacing: "0.7px",
                }}
              >
                {appointment.status}
              </Typography>
            </Box>
          )}

          {/* Body */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: COLORS.WHITE,
              px: "8px",
              py: tier === "sm" ? "4px" : "6px",
              display: "flex",
              flexDirection: "column",
              gap: tier === "sm" ? "2px" : "4px",
              overflow: "hidden",
            }}
          >
            {/* Procedures + inline action icons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "4px",
              }}
            >
              <Typography
                sx={{
                  fontSize: fontSize.base,
                  fontWeight: fontWeight.medium,
                  color: "#111827",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: tier === "sm" ? 1 : 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.2,
                }}
              >
                {appointment.procedures}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  flexShrink: 0,
                  mt: "2px",
                }}
              >
                <FiberManualRecord
                  sx={{ fontSize: "13px", color: COLORS.ACCENT }}
                />
                <Add sx={{ fontSize: "14px", color: COLORS.STATUS_ERROR }} />
                <Description
                  sx={{
                    fontSize: "14px",
                    color: COLORS.ACCENT,
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (appointment.patientId)
                      navigate(
                        `/clinical/progress-notes?patientId=${appointment.patientId}`,
                      );
                    else navigate("/clinical/progress-notes");
                  }}
                />
                <AttachMoney
                  sx={{
                    fontSize: "14px",
                    color: COLORS.ACCENT,
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (appointment.patientId)
                      navigate(`/finance?patientId=${appointment.patientId}`);
                    else navigate("/finance");
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: fontWeight.bold,
                    color: COLORS.ACCENT,
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (appointment.patientId)
                      navigate(
                        `/clinical/treatment-plan?patientId=${appointment.patientId}`,
                      );
                    else navigate("/clinical/treatment-plan");
                  }}
                >
                  Tx
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", lineHeight: 1, cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (appointment.patientId)
                      navigate(
                        `/clinical/exam?patientId=${appointment.patientId}`,
                      );
                    else navigate("/clinical/exam");
                  }}
                >
                  🦷
                </Typography>
              </Box>
            </Box>

            {/* Description — only on lg */}
            {tier === "lg" && (
              <Typography
                sx={{
                  fontSize:
                    appointment.durationMinutes < 75 ? "10px" : fontSize.xs,
                  color: COLORS.TEXT_BODY,
                  lineHeight: 1.4,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: appointment.durationMinutes < 75 ? 1 : 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {appointment.description}
              </Typography>
            )}

            {/* Tags — md and lg */}
            {(tier === "md" || tier === "lg") &&
              (() => {
                const isCompact = appointment.durationMinutes < 75;
                const maxVisible = isCompact ? 3 : appointment.tags.length;
                const visibleTags = appointment.tags.slice(0, maxVisible);
                const hiddenCount =
                  appointment.tags.length - visibleTags.length;
                return (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "4px",
                      flexWrap: "wrap",
                      mt: tier === "lg" && !isCompact ? 1 : 0,
                    }}
                  >
                    {visibleTags.map((tag, i) => {
                      const { bg, color, border } = TAG_STYLE(tag);
                      const label = getTagLabel(tag);
                      return (
                        <Box
                          key={i}
                          sx={{
                            px: "8px",
                            py: "2px",
                            borderRadius: "4px",
                            backgroundColor: bg,
                            border,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color,
                              letterSpacing: "0.3px",
                            }}
                          >
                            {label}
                          </Typography>
                        </Box>
                      );
                    })}
                    {hiddenCount > 0 && (
                      <Box
                        sx={{
                          px: "6px",
                          py: "2px",
                          borderRadius: "4px",
                          backgroundColor: "#f3f4f6",
                          border: "1px solid #d1d5db",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#6b7280",
                          }}
                        >
                          +{hiddenCount}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })()}

            {/* Footer — only on lg */}
            {tier === "lg" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: "auto",
                  pt: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#dcfce7",
                    borderRadius: "20px",
                    px: "8px",
                    py: "3px",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}
                  >
                    {appointment.price}
                  </Typography>
                </Box>
                {colorTags.length > 0 &&
                  (() => {
                    const visibleColorTags = colorTags.slice(0, 3);
                    const hiddenCount = colorTags.length - visibleColorTags.length;
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {visibleColorTags.map((tagId, i) => {
                          const tagObj = ICON_TAGS.find(t => t.id.toLowerCase() === String(tagId).toLowerCase());
                          if (!tagObj) return null;
                          return (
                            <Tooltip key={`${tagId}-${i}`} title={tagObj.label} arrow placement="top" disableInteractive>
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "6px", // rounded square
                                  bgcolor: "#f3f4f6", // light background
                                  border: "1px solid #d1d5db",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  p: "2px",
                                }}
                              >
                                <img src={tagObj.src} alt={tagObj.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              </Box>
                            </Tooltip>
                          );
                        })}
                        {hiddenCount > 0 && (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "6px", // rounded square
                              bgcolor: "#f3f4f6",
                              border: "1px solid #d1d5db",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "10px",
                                fontWeight: 800,
                                color: "#6b7280",
                              }}
                            >
                              +{hiddenCount}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })()}
              </Box>
            )}

            {/* Compact footer — price only on md */}
            {tier === "md" && (
              <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
                <Box
                  sx={{
                    backgroundColor: "#dcfce7",
                    borderRadius: "20px",
                    px: "8px",
                    py: "2px",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "11px", fontWeight: 700, color: "#16a34a" }}
                  >
                    {appointment.price}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right icon strip */}
        <Box
          sx={{
            width: "28px",
            backgroundColor: "#dbeafe",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            pt: "8px",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <PhoneOutlined sx={{ fontSize: "16px", color: "#2563eb" }} />
          <OpenInNew sx={{ fontSize: "16px", color: "#2563eb" }} />

          {/* SS — hide on very compact cards */}
          {tier !== "sm" && (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#2563eb",
                mt: "auto",
                mb: "8px",
              }}
            >
              SS
            </Typography>
          )}
        </Box>
      </Box>

      {anchorRect && (
        <AppointmentHoverCard
          appointment={appointment}
          anchorRect={anchorRect}
          privacyMode={privacyMode}
          onMouseEnter={() => clearTimeout(leaveTimer.current)}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  );
};

export default AppointmentCard;
