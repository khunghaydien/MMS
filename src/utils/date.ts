import { RangeDate } from '@/types'

const convertMonth = (month: number) => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return monthNames[month - 1]
}

export const convertToMonthYear = (month: number, year: number) => {
  const monthString = convertMonth(month)
  return `${monthString} - ${year}`
}

export const getOtHoursRangeTime = (start: string, end: string) => {
  let startParts = start.split(':')
  let endParts = end.split(':')

  let startHour = parseInt(startParts[0])
  let startMinute = parseInt(startParts[1])
  let endHour = parseInt(endParts[0])
  let endMinute = parseInt(endParts[1])

  let hours = endHour - startHour
  let minutes = endMinute - startMinute

  if (minutes < 0) {
    hours -= 1
    minutes += 60
  }

  let totalHours = hours + minutes / 60

  return totalHours
}

export const getYearWeekObject = (date: Date | null) => {
  if (!date) return { year: 0, week: 0 }
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const startOfWeek = startOfYear.getDay() === 0 ? 6 : startOfYear.getDay() - 1
  startOfYear.setDate(startOfYear.getDate() - startOfWeek)
  const daysDiff = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  )
  const weekNumber = Math.floor(daysDiff / 7) + 1
  const firstWeekStart = new Date(startOfYear)
  firstWeekStart.setDate(firstWeekStart.getDate() + (1 - startOfYear.getDay()))
  if (date < firstWeekStart) {
    return { year: date.getFullYear() - 1, week: weekNumber }
  }
  const endOfYear = new Date(date.getFullYear(), 11, 31)
  endOfYear.setDate(
    endOfYear.getDate() -
      (endOfYear.getDay() === 0 ? 6 : endOfYear.getDay() - 1)
  )
  if (date > endOfYear) {
    return { year: date.getFullYear() + 1, week: weekNumber - 1 }
  }
  return { year: date.getFullYear(), week: weekNumber }
}

export const getMonthsBetween = ({ startDate, endDate }: RangeDate) => {
  const months = []
  let currentDate = new Date(startDate || 0)
  const end = new Date(endDate || 0)
  const getFormattedMonth = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${year}`
  }
  end.setMonth(end.getMonth() + 1)
  end.setDate(0)
  while (currentDate <= end) {
    months.push({ month: getFormattedMonth(currentDate) })
    currentDate.setMonth(currentDate.getMonth() + 1)
  }
  return months
}
