import { RangeDate } from '@/types'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import InputDatepicker from './InputDatepicker'

interface RangeYearPickerProps {
  startDate: Date | number | null
  endDate: Date | number | null
  onChange: (payload: RangeDate) => void
}

const RangeYearPicker = ({
  startDate,
  endDate,
  onChange,
}: RangeYearPickerProps) => {
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
    <Box className={classes.RootRangeYearPicker}>
      <Box>
        <InputDatepicker
          readOnly
          className={classes.rootDatepicker}
          isShowClearIcon={false}
          inputFormat="YYYY"
          openTo="year"
          views={['year']}
          label={i18('LB_FROM_YEAR')}
          value={startDate}
          onChange={onStartDateChange}
          maxDate={endDate}
        />
      </Box>
      <Box>
        <InputDatepicker
          readOnly
          className={classes.rootDatepicker}
          isShowClearIcon={false}
          inputFormat="YYYY"
          openTo="year"
          views={['year']}
          label={i18('LB_TO_V2')}
          value={endDate}
          onChange={onEndDateChange}
          minDate={startDate}
        />
      </Box>
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  RootRangeYearPicker: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  rootDatepicker: {
    flexDirection: 'unset',
    gap: 16,
    '& .label': {
      marginBottom: 0,
    },
  },
}))

export default RangeYearPicker
