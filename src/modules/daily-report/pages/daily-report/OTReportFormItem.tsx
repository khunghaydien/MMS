import InputTimepicker from '@/components/Datepicker/InputTimepicker'
import FormLayout from '@/components/Form/FormLayout'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { EventInput } from '@/types'
import { getOtHoursRangeTime } from '@/utils/date'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FormikErrors, FormikTouched } from 'formik'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  otFrom: string
  otTo: string
  reason: string
  errors: FormikErrors<any>
  touched: FormikTouched<any>
  onChange: (newVal: string, field: string) => void
}

const OTReportFormItem = ({
  otFrom,
  otTo,
  reason,
  errors,
  touched,
  onChange,
}: IProps) => {
  const classes = useStyles()
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const otHoursRangeTime = useMemo(() => {
    if (otFrom === '' || otTo === '') {
      return ''
    }
    return getOtHoursRangeTime(otFrom, otTo)
  }, [otFrom, otTo])

  const onOtRangeTimeChange = (value: string, field: string) => {
    onChange(value, field)
  }

  return (
    <Box className={classes.RootOTReportFormItem}>
      <FormLayout gap={24}>
        <InputTimepicker
          required
          label={i18DailyReport('LB_OT_FROM')}
          maxTime={otTo}
          value={otFrom}
          error={!!errors?.otFrom && !!touched?.otFrom}
          errorMessage={errors?.otFrom}
          onChange={(value: string) => onOtRangeTimeChange(value, 'otFrom')}
        />
        <InputTimepicker
          required
          minTime={otFrom}
          label={i18DailyReport('LB_TO')}
          value={otTo}
          error={!!errors?.otTo && !!touched?.otTo}
          errorMessage={errors?.otTo}
          onChange={(value: string) => onOtRangeTimeChange(value, 'otTo')}
        />
        <Box width={100}>
          <InputTextLabel
            disabled
            value={otHoursRangeTime as string}
            label={i18DailyReport('LB_OT_HOURS')}
            useCounter={false}
          />
        </Box>
      </FormLayout>
      <FormLayout top={24}>
        <InputTextArea
          height={80}
          label={i18DailyReport('LB_REASON_FOR_OT') as string}
          placeholder={i18DailyReport('PLH_REASON_FOR_OT')}
          defaultValue={reason}
          onChange={(event: EventInput) =>
            onChange(event.target.value, 'reason')
          }
        />
      </FormLayout>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootOTReportFormItem: {
    backgroundColor: theme.color.blue.small,
    padding: theme.spacing(2),
    width: '100%',
  },
}))

export default OTReportFormItem
