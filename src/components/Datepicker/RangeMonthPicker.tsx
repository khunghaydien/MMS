import { RangeDate } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import InputDatepicker from './InputDatepicker'

interface RangeMonthPickerProps {
  startDate: Date | number | null
  endDate: Date | number | null
  minStartDate?: Date | number | null
  maxStartDate?: Date | number | null
  minEndDate?: Date | number | null
  maxEndDate?: Date | number | null
  onChange: (payload: RangeDate) => void
  title?: {
    from: string
    to: string
  }
  disabled?: boolean
  error?: boolean
  required?: boolean
}

const RangeMonthPicker = ({
  startDate,
  endDate,
  onChange,
  title,
  minStartDate,
  maxStartDate,
  minEndDate,
  maxEndDate,
  disabled,
  error,
  required,
}: RangeMonthPickerProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const onStartDateChange = (date: Date) => {
    onChange({
      startDate: date,
      endDate,
    })
  }

  const onEndDateChange = (date: Date) => {
    onChange({
      startDate,
      endDate: date,
    })
  }

  return (
    <Box className={classes.RootRangeMonthPicker}>
      <Box className={classes.field}>
        {title && (
          <Box className={classes.labels}>
            {title?.from}
            {!!required && (
              <Box className={classes.mark} component="span">
                *
              </Box>
            )}
          </Box>
        )}
        <Box>
          <InputDatepicker
            readOnly
            error={error}
            disabled={!!disabled}
            minDate={minStartDate}
            maxDate={maxStartDate || endDate}
            isShowClearIcon={false}
            inputFormat="MM/YYYY"
            openTo="month"
            views={['year', 'month']}
            label={!title ? i18('LB_FROM_MONTH') : ''}
            value={startDate}
            onChange={onStartDateChange}
          />
        </Box>
      </Box>
      <Box className={classes.field}>
        {title && (
          <Box className={classes.labels}>
            {title?.to}
            {!!required && (
              <Box className={classes.mark} component="span">
                *
              </Box>
            )}
          </Box>
        )}
        <Box>
          <InputDatepicker
            readOnly
            error={error}
            disabled={!!disabled}
            minDate={minEndDate || startDate}
            maxDate={maxEndDate}
            isShowClearIcon={false}
            inputFormat="MM/YYYY"
            openTo="month"
            views={['year', 'month']}
            label={!title ? i18('LB_TO_MONTH') : ''}
            value={endDate}
            onChange={onEndDateChange}
          />
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootRangeMonthPicker: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  labels: {
    fontSize: 14,
    fontWeight: 600,
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  mark: {
    color: theme.color.error.secondary,
    marginLeft: theme.spacing(0.5),
  },
}))

export default RangeMonthPicker
