export const useHumanDateTime = (val?: string | Date | null, fallback = "NA") => {
  if (!val) return fallback
  const date = new Date(val)
  return Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

export const useHumanDateTimeWithSeconds = (val?: string | Date | null, fallback = "NA") => {
  if (!val) return fallback
  const date = new Date(val)
  return Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date)
}
