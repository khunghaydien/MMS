import { DateRange } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import InputErrorMessage from '../common/InputErrorMessage'
import InputDatePicker from '../Datepicker/InputDatepicker'
import FormItem from '../Form/FormItem/FormItem'

interface InputRangeDatePickerProps {
  error?: boolean
  title?: string | undefined | null
  values: DateRange
  isCustomLabel?: boolean
  titleStartDate?: string
  titleEndDate?: string
  errorMessage?: any
  errorMessageDateRange?: string
  flagReset?: boolean
  spaceFix?: string | null
  inputFormat?: string
  readOnly?: boolean
  views?: Array<'day' | 'month' | 'year'>
  openTo?: 'day' | 'month' | 'year'
  onChange: (dateRange: DateRange) => void
  onError?: (error: boolean) => void
  onOpen?: () => void
}

const InputRangeDatePicker = ({
  error,
  title,
  values,
  errorMessage,
  isCustomLabel = false,
  titleStartDate = 'Start Date',
  titleEndDate = 'End Date',
  onChange,
  onError,
  errorMessageDateRange,
  flagReset,
  spaceFix,
  onOpen,
  inputFormat,
  openTo,
  views,
  readOnly,
}: InputRangeDatePickerProps) => {
  const classes = useStyles()

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  })
  const [startDateInvalid, setStartDateInvalid] = useState(false)
  const [endDateInvalid, setEndDateInvalid] = useState(false)

  const handleDateChange = (date: DateRange, key: string) => {
    const newDateRange = {
      ...dateRange,
      [key]: date,
    }
    setDateRange(newDateRange)
    onChange(newDateRange)
  }

  const dateRangeInvalid = useMemo(() => {
    const { startDate, endDate } = dateRange
    return startDate && endDate && startDateInvalid && endDateInvalid
  }, [dateRange, startDateInvalid, endDateInvalid])

  const handleStartDateError = (error: string | null) => {
    setStartDateInvalid(!!error)
    !!onError && onError(!!error || endDateInvalid)
  }

  const handleEndDateError = (error: string | null) => {
    setEndDateInvalid(!!error)
    !!onError && onError(!!error || startDateInvalid)
  }

  useEffect(() => {
    if (!values.startDate && !values.endDate) {
      setDateRange({
        startDate: null,
        endDate: null,
      })
      return
    }
    if (values.startDate || values.endDate) {
      setDateRange(values)
    }
  }, [values])

  return (
    <Box className={classes.rootInputRangeDate}>
      <Box className={classes.container}>
        <FormItem label={isCustomLabel ? titleStartDate : title}>
          <InputDatePicker
            readOnly={readOnly}
            inputFormat={inputFormat}
            views={views}
            openTo={openTo}
            flagReset={flagReset}
            error={error}
            maxDate={dateRange.endDate}
            value={dateRange.startDate}
            onChange={(date: DateRange) => handleDateChange(date, 'startDate')}
            onError={handleStartDateError}
            onOpen={onOpen}
          />
        </FormItem>
        <Box className={classes.spaceFix}>{<Box>{spaceFix}</Box> || '-'}</Box>
        <FormItem label={isCustomLabel ? titleEndDate : ''}>
          <InputDatePicker
            readOnly={readOnly}
            inputFormat={inputFormat}
            views={views}
            openTo={openTo}
            flagReset={flagReset}
            error={error}
            minDate={dateRange.startDate}
            value={dateRange.endDate}
            onChange={(date: DateRange) => handleDateChange(date, 'endDate')}
            onError={handleEndDateError}
            onOpen={onOpen}
          />
        </FormItem>
      </Box>
      {(error || startDateInvalid || endDateInvalid || dateRangeInvalid) && (
        <InputErrorMessage
          className={classes.errorMessage}
          content={dateRangeInvalid ? errorMessageDateRange : errorMessage}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputRangeDate: {},
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing(2),
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  spaceFix: {
    marginBottom: theme.spacing(1.5),
    '& div': {
      color: theme.color.blue.primary,
      fontWeight: 700,
      fontSize: 14,
    },
  },
}))

InputRangeDatePicker.defaultProps = {
  dateLabel: {
    startDate: 'Start Date',
    endDate: 'End Date',
  },
}

export default InputRangeDatePicker
