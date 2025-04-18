import { formatDate } from '@/utils'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { IReport } from '../types'

export interface IDay {
  value: number
  event: IReport | null
  isCurrentDay: boolean
  date: string
  isDisabled: boolean
  isWeekendDay: boolean
}
export const useDate = (events: any, month: number, year: number) => {
  const [days, setDays] = useState<IDay[]>([])

  const getTotalDaysOfPreviousMonth = (month: number, year: number) => {
    const previousMonth = month === 1 ? 12 : month - 1
    const previousYear = month === 1 ? year - 1 : year
    const daysInPreviousMonth = new Date(
      previousYear,
      previousMonth,
      0
    ).getDate()
    return daysInPreviousMonth
  }

  useEffect(() => {
    const previousMonth = month === 1 ? 12 : month - 1
    const previousYear = month === 1 ? year - 1 : year
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year

    const currentDays: IDay[] = []
    const oldDays: IDay[] = []
    const futureDays: IDay[] = []

    const _nextMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(_nextMonth.getTime() - 86400000)
    const totalDaysInMonth = lastDayOfMonth.getDate()

    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateString = `${year}-${month}-${i}`
      const _report = events.find((event: any) => {
        const reportDate = formatDate(event.reportDate, 'YYYY-MM-DD')
        const _dateString = formatDate(new Date(dateString), 'YYYY-MM-DD')
        return moment(reportDate).isSame(_dateString)
      })
      currentDays.push({
        value: i,
        event: _report,
        isCurrentDay:
          new Date(dateString).toDateString() === new Date().toDateString(),
        date: dateString,
        isDisabled: false,
        isWeekendDay:
          new Date(dateString).getDay() === 0 ||
          new Date(dateString).getDay() === 6,
      })
    }
    const startDayOfWeek = new Date(year, month - 1, 1).getDay()
    const totalDaysInOldMonth = getTotalDaysOfPreviousMonth(month, year)
    for (let i = 1; i <= startDayOfWeek; i++) {
      oldDays.push({
        value: totalDaysInOldMonth - startDayOfWeek + i,
        event: null,
        isCurrentDay: false,
        date: '',
        isDisabled: true,
        isWeekendDay:
          new Date(
            `${previousYear}-${previousMonth}-${
              totalDaysInOldMonth - startDayOfWeek + i
            }`
          ).getDay() === 0,
      })
    }

    const totalRenderDate = oldDays.length + currentDays.length === 36 ? 42 : 35

    for (
      let i = 1;
      i < totalRenderDate + 1 - startDayOfWeek - totalDaysInMonth;
      i++
    ) {
      futureDays.push({
        value: i,
        event: null,
        isCurrentDay: false,
        date: '',
        isDisabled: true,
        isWeekendDay: new Date(`${nextYear}-${nextMonth}-${i}`).getDay() === 6,
      })
    }
    const days = [...oldDays, ...currentDays, ...futureDays]
    setDays(days)
  }, [events, month, year])

  return {
    days,
  }
}
