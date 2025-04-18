import { RangeDate } from '@/types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { projectSelector } from '../reducer/project'
import { ProjectState } from '../types'

const useRangeMonthPicker = () => {
  const { generalInfo }: ProjectState = useSelector(projectSelector)

  const getDefaultFilter = () => {
    const currentYear = new Date().getFullYear()
    const projectStartYear = generalInfo.startDate?.getFullYear() as number
    const projectEndYear = generalInfo.endDate?.getFullYear() as number
    if (currentYear >= projectStartYear && currentYear <= projectEndYear) {
      return {
        startDate: new Date(`${currentYear}-01-01`),
        endDate: new Date(`${currentYear}-12-31`),
      } as RangeDate
    }
    if (currentYear > projectEndYear) {
      return {
        startDate: new Date(`${projectEndYear}-01-01`),
        endDate: new Date(`${projectEndYear}-12-31`),
      } as RangeDate
    }
    return {
      startDate: null,
      endDate: null,
    } as RangeDate
  }

  const [filters, setFilters] = useState(() => getDefaultFilter())

  useEffect(() => {
    setFilters(getDefaultFilter())
  }, [generalInfo])

  return [filters, setFilters] as [
    RangeDate,
    Dispatch<SetStateAction<RangeDate>>
  ]
}

export default useRangeMonthPicker
