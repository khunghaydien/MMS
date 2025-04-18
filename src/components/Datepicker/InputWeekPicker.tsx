import { OptionItem, WeekPayload } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import moment from 'moment'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import InputErrorMessage from '../common/InputErrorMessage'
import InputTitle from '../common/InputTitle'
import InputDropdown from '../inputs/InputDropdown'

export const getWeekDates = (year: number, weekNumber: number) => {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysOffset = firstDayOfYear.getDay()
  const firstWeekDay = 1
  const firstWeekStartDate = new Date(year, 0, 1 + (firstWeekDay - daysOffset))

  const weekStartDate = new Date(firstWeekStartDate)
  weekStartDate.setDate(weekStartDate.getDate() + (weekNumber - 1) * 7)

  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 6)

  return {
    startDate: moment(weekStartDate).format('DD/MM'),
    endDate: moment(weekEndDate).format('DD/MM'),
  }
}

interface InputWeekPickerProps {
  label?: string
  keyName?: string
  flexDirectionRow?: boolean
  required?: boolean
  error?: boolean
  errorMessage?: string
  value: WeekPayload
  minWeek?: WeekPayload
  maxWeek?: WeekPayload
  onChange: (payload: { value: WeekPayload; keyName?: string }) => void
}

const InputWeekPicker = ({
  label,
  value,
  keyName,
  onChange,
  flexDirectionRow,
  required,
  error,
  errorMessage,
  minWeek,
  maxWeek,
}: InputWeekPickerProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const getSuffix = (week: number) => {
    let suffix = ''
    switch (week) {
      case 1:
        suffix = 'st'
        break
      case 2:
        suffix = 'nd'
        break
      case 3:
        suffix = 'rd'
        break
      case 51:
        suffix = 'st'
        break
      case 52:
        suffix = 'nd'
        break
      default:
        suffix = 'th'
    }
    return suffix
  }

  const listWeekOptions = useMemo(() => {
    const result: OptionItem[] = []
    const totalWeeks = moment(`${value.year}-12-31`).isoWeeksInYear()
    for (let week = 1; week <= totalWeeks; week++) {
      let disabled = false
      if (!!minWeek?.year || !!maxWeek?.year) {
        disabled =
          (value.year === minWeek?.year && week < (minWeek?.week as number)) ||
          (value.year === maxWeek?.year && week > (maxWeek?.week as number))
      }
      result.push({
        id: week.toString(),
        value: week.toString(),
        label: `${week}${getSuffix(week)} (${
          getWeekDates(+value.year, week).startDate
        } - ${getWeekDates(+value.year, week).endDate})`,
        disabled,
      })
    }
    return value.year ? result : []
  }, [value, minWeek, maxWeek])

  const yearListOptions = useMemo(() => {
    const result: OptionItem[] = []
    for (let i = 2016; i <= 2100; i++) {
      let disabled = false
      if (!!minWeek?.year || !!maxWeek?.year) {
        disabled =
          i < (minWeek?.year as number) || i > (maxWeek?.year as number)
      }
      result.push({
        id: i.toString(),
        value: i.toString(),
        label: i.toString(),
        disabled,
      })
    }
    return result
  }, [minWeek, maxWeek])

  const handleChange = (val: string) => {
    onChange({
      value: {
        year: value.year,
        week: +val,
      },
      keyName,
    })
  }

  const onYearChange = (year: string) => {
    onChange({
      value: {
        year: +year,
        week: 0,
      },
      keyName,
    })
  }

  return (
    <Box
      className={clsx(
        classes.RootInputWeekPicker,
        !!flexDirectionRow && 'flexDirectionRow'
      )}
    >
      {!!label && <InputTitle title={label} required={required} />}
      <Box className={classes.container}>
        <InputDropdown
          selectClassName={classes.yearSelect}
          width={80}
          paddingRight={10}
          isShowClearIcon={false}
          error={error}
          value={value.year ? value.year.toString() : ''}
          listOptions={yearListOptions}
          onChange={onYearChange}
          placeholder={i18('LB_YEAR')}
        />
        <InputDropdown
          selectClassName={classes.weekSelect}
          width={196}
          paddingRight={10}
          error={error}
          value={value.week ? value.week.toString() : ''}
          placeholder={i18('PLH_SELECT_WEEK')}
          listOptions={listWeekOptions}
          onChange={handleChange}
        />
      </Box>
      {error && <InputErrorMessage content={errorMessage || ''} />}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootInputWeekPicker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '&.flexDirectionRow': {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(2),
    },
    '& .label': {
      marginBottom: '8px',
      width: 'max-content',
    },
  },
  label: {
    fontWeight: 700,
    fontSize: 14,
  },
  container: {
    display: 'flex',
  },
  yearSelect: {
    borderRadius: '4px 0 0 4px !important',
  },
  weekSelect: {
    borderRadius: '0 4px 4px 0 !important',
  },
}))

export default InputWeekPicker
