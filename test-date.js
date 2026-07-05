const dayjs = require('dayjs');
const iso = "2026-06-30T17:05:00.000Z";
console.log("Raw ISO:", iso);
console.log("Parsed by dayjs:", dayjs(iso).format("YYYY-MM-DD"));
console.log("String split:", iso.includes("T") ? iso.split("T")[0] : iso.slice(0, 10));
