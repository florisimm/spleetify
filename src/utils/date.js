export const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const parse = (s) => {
  const [Y, M, D] = (s || "").split("-").map(Number);
  return isNaN(Y) ? new Date() : new Date(Y, M - 1, D);
};

export const shiftDays = (s, delta) => fmt(new Date(parse(s).getTime() + delta * 86400000));

export const last = (arr) => (Array.isArray(arr) && arr.length ? arr[arr.length - 1] : undefined);

export const safeMax = (vals, fallback = 1) => {
  const m = Math.max.apply(null, vals.length ? vals : [-Infinity]);
  return Number.isFinite(m) ? Math.max(fallback, m) : fallback;
};
