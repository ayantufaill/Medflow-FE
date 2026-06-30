import dayjs from 'dayjs';
console.log("null:", dayjs(null).format("YYYY-MM-DD"));
console.log("undefined:", dayjs(undefined).format("YYYY-MM-DD"));
console.log("empty:", dayjs("").format("YYYY-MM-DD"));
