export const formatGA4Date = (
  d: string,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
): string => {
  const iso = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return new Date(iso).toLocaleDateString(
    locale ?? Intl.DateTimeFormat().resolvedOptions().locale,
    {
      timeZone,
      ...options,
    },
  )
}
