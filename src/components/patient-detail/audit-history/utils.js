/**
 * Utility function to format key names (e.g. mouthCondition -> Mouth Condition)
 */
export const formatFieldKey = (key) => {
  if (!key || typeof key !== "string") return String(key || "");

  const knownMap = {
    mouthCondition: "Mouth Condition",
    previousDentist: "Previous Dentist",
    recentExamDate: "Recent Exam Date",
    recentTreatmentDate: "Recent Treatment Date",
    immediateConcern: "Immediate Concern",
    patientsSince: "Patients Since",
    recentXrayDate: "Recent X-Ray Date",
    dentistVisitFrequency: "Dentist Visit Frequency",
    generalInfo: "General Info",
    personalHistory: "Personal History",
    medicalHistory: "Medical History",
    dentalHistory: "Dental History",
    dental_history: "Dental History",
    dental_history_updated: "Dental History Updated",
    patient_updated: "Patient Updated",
    patient_created: "Patient Created",
    patient_profile: "Patient Profile",
    "fearful-treatment": "Fearful of Dental Treatment",
  };

  if (knownMap[key]) return knownMap[key];

  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

/**
 * Try parsing stringified JSON safely
 */
export const tryParseJson = (val) => {
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch (_) {
        return val;
      }
    }
  }
  return val;
};

/**
 * Format any value to human readable plain text
 */
export const formatValueToText = (val) => {
  if (
    val === null ||
    val === undefined ||
    val === "" ||
    val === "null" ||
    val === "undefined"
  ) {
    return "-";
  }
  if (typeof val === "boolean") {
    return val ? "Yes" : "No";
  }
  if (typeof val === "number") {
    return String(val);
  }
  if (typeof val === "string") {
    const parsed = tryParseJson(val);
    if (parsed !== val && typeof parsed === "object") {
      return formatValueToText(parsed);
    }
    // Format ISO dates if applicable
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(val)) {
      try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          if (val.includes("T")) {
            return d.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            });
          }
          return val;
        }
      } catch (_) {}
    }
    return val;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return "-";
    const items = val
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          if (item.question && item.answer !== undefined) {
            return `${item.question}: ${formatValueToText(item.answer)}`;
          }
          if (item.question) {
            return `${item.question}`;
          }
          if (item.label) return item.label;
          if (item.name) return item.name;
          return Object.entries(item)
            .filter(([k]) => k !== "id")
            .map(([k, v]) => `${formatFieldKey(k)}: ${formatValueToText(v)}`)
            .join(", ");
        }
        return formatValueToText(item);
      })
      .filter(Boolean);

    return items.length > 0 ? items.join("\n") : "-";
  }
  if (typeof val === "object") {
    const entries = Object.entries(val).filter(
      ([, v]) => v !== null && v !== undefined && v !== ""
    );
    if (entries.length === 0) return "-";
    return entries
      .map(([k, v]) => `${formatFieldKey(k)}: ${formatValueToText(v)}`)
      .join("\n");
  }
  return String(val);
};

/**
 * Extract clean key-old-new difference rows from object/value diffs
 */
export const extractDifferences = (oldVal, newVal, parentKey = "") => {
  const diffs = [];

  const oldParsed = tryParseJson(oldVal);
  const newParsed = tryParseJson(newVal);

  const isOldObj =
    oldParsed && typeof oldParsed === "object" && oldParsed !== null;
  const isNewObj =
    newParsed && typeof newParsed === "object" && newParsed !== null;

  if (isOldObj || isNewObj) {
    const o = isOldObj ? oldParsed : {};
    const n = isNewObj ? newParsed : {};

    const allKeys = Array.from(new Set([...Object.keys(o), ...Object.keys(n)]));

    allKeys.forEach((k) => {
      const oVal = o[k];
      const nVal = n[k];
      const fieldName = formatFieldKey(k);
      const subKey =
        parentKey &&
        !["General Info", "General Information", "Personal History"].includes(
          parentKey
        )
          ? `${parentKey} - ${fieldName}`
          : fieldName;

      if (JSON.stringify(oVal) !== JSON.stringify(nVal)) {
        if (
          (oVal && typeof oVal === "object" && !Array.isArray(oVal)) ||
          (nVal && typeof nVal === "object" && !Array.isArray(nVal))
        ) {
          diffs.push(...extractDifferences(oVal, nVal, fieldName));
        } else {
          diffs.push({
            key: subKey,
            old: formatValueToText(oVal),
            new: formatValueToText(nVal),
          });
        }
      }
    });
  } else {
    diffs.push({
      key: parentKey ? parentKey : "Value",
      old: formatValueToText(oldVal),
      new: formatValueToText(newVal),
    });
  }

  return diffs;
};

/**
 * Format ISO date string into readable date time
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (_) {
    return dateStr;
  }
};

export const normalizeAuditData = (payload) => {
  const list = Array.isArray(payload)
    ? payload
    : payload?.auditEvents || payload?.data?.auditEvents || [];

  return (list || []).map((entry, index) => {
    let differences = [];

    if (Array.isArray(entry?.differences)) {
      entry.differences.forEach((diff) => {
        const subDiffs = extractDifferences(
          diff?.old ?? diff?.previous,
          diff?.new ?? diff?.current,
          formatFieldKey(diff?.key || diff?.field || diff?.path || "")
        );
        differences.push(...subDiffs);
      });
    } else if (entry?.oldValue !== undefined || entry?.newValue !== undefined) {
      differences = extractDifferences(entry.oldValue, entry.newValue, "");
    }

    if (differences.length === 0) {
      differences.push({
        key: "Record Status",
        old: "-",
        new: "Updated",
      });
    }

    const rawActor = entry?.actor;
    const actorName =
      typeof rawActor === "object" && rawActor !== null
        ? `${rawActor.firstName || ""} ${rawActor.lastName || ""}`.trim() ||
          rawActor.email ||
          "System"
        : entry?.actorName || entry?.userName || entry?.user || "System";

    return {
      id: entry?._id || entry?.id || entry?.eventId || `audit-${index}`,
      date: formatDate(
        entry?.changedAt || entry?.createdAt || entry?.timestamp || entry?.date
      ),
      user: actorName || "System",
      name: formatFieldKey(
        entry?.name || entry?.section || entry?.patientName || "Patient"
      ),
      action: formatFieldKey(entry?.action || entry?.type || "Update"),
      rawAction: entry?.action || entry?.type || "Update",
      differences,
    };
  });
};
