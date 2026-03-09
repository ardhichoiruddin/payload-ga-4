export const fillMissingDates = (timeseries: any[], startDate: string) => {
  // Hitung jumlah hari dari startDate string GA4
  const days = startDate === '7daysAgo' ? 7 : startDate === '90daysAgo' ? 90 : 30 // default 30daysAgo

  // Generate tanggal dari hari ini mundur sejumlah `days`
  const allDates: string[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    // Set ke UTC midnight agar konsisten di semua timezone server
    d.setUTCHours(0, 0, 0, 0)
    d.setUTCDate(d.getUTCDate() - i)

    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    allDates.push(`${yyyy}${mm}${dd}`)
  }

  // Map data yang ada
  const dataMap = new Map(timeseries.map((row) => [row.date, row]))

  // Debug — cek apakah tanggal GA ada di allDates
  timeseries.forEach((row) => {
    if (!allDates.includes(row.date)) {
      console.warn(`[GA] tanggal ${row.date} tidak ada di range yang di-generate`)
    }
  })

  return allDates.map(
    (date) =>
      dataMap.get(date) ?? {
        date,
        screenPageViews: 0,
        totalUsers: 0,
        newUsers: 0,
        sessions: 0,
        bounceRate: 0,
        averageSessionDuration: 0,
        engagementRate: 0,
        eventCount: 0,
        conversions: 0,
      },
  )
}
