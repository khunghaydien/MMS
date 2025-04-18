import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import InputTimepicker from '@/components/Datepicker/InputTimepicker'
import FormLayout from '@/components/Form/FormLayout'
import DeleteIcon from '@/components/icons/DeleteIcon'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { updateLoading } from '@/reducer/screen'
import commonService from '@/services/common.service'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { OTDate } from './ModalCreateOTRequest'

interface FormProjectOTDateItemProps {
  otDate: OTDate
  index: number
  useDelete: boolean
  errors: any
  touched: any
  onDeleteOTForMoreDays: (index: number) => void
  onChange: (payload: {
    value: any
    field: string
    otDateIndex: number
  }) => void
  projectId: string | number
}
export const caculateHours = (from: string, to: string) => {
  const [startHoursStr, startMinutesStr] = from.split(':')
  const [endHoursStr, endMinutesStr] = to.split(':')

  const startHours = parseInt(startHoursStr, 10)
  const startMinutes = parseInt(startMinutesStr, 10)
  const endHours = parseInt(endHoursStr, 10)
  const endMinutes = parseInt(endMinutesStr, 10)

  const totalStartMinutes = startHours * 60 + startMinutes
  const totalEndMinutes = endHours * 60 + endMinutes
  return (totalEndMinutes - totalStartMinutes) / 60
}
const FormProjectOTDateItem = ({
  otDate,
  index,
  onDeleteOTForMoreDays,
  useDelete,
  onChange,
  errors,
  touched,
  projectId,
}: FormProjectOTDateItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const dispatch = useDispatch<AppDispatch>()
  const [isErrorOTDate, setIsErrorOTDate] = useState(false)
  const value = useMemo(() => {
    let totalDifference = 0
    if (otDate.from && otDate.to) {
      totalDifference = caculateHours(otDate.from, otDate.to)
    } else totalDifference = 0
    onChange({
      otDateIndex: index,
      value: totalDifference,
      field: 'hours',
    })
    return totalDifference
  }, [otDate.from, otDate.to])

  const handleChangeOTDate = async (value: Date | null) => {
    onChange({
      otDateIndex: index,
      value: value,
      field: 'otDate',
    })
    if (projectId && value) {
      dispatch(updateLoading(true))
      try {
        const res = await commonService.validateProjectOTReport({
          otDate: value?.getTime(),
          projectId: projectId.toString(),
        })
        if (typeof res.data === 'number') {
          onChange({
            otDateIndex: index,
            value: res.data,
            field: 'otRequestId',
          })
          setIsErrorOTDate(false)
        }
      } catch (error) {
        onChange({
          otDateIndex: index,
          value: null,
          field: 'otRequestId',
        })
        setIsErrorOTDate(true)
      } finally {
        dispatch(updateLoading(false))
      }
    }
  }
  return (
    <Box className={classes.RootFormProjectOTDateItem}>
      {useDelete && (
        <Box className={classes.actions}>
          <DeleteIcon onClick={() => onDeleteOTForMoreDays(index)} />
        </Box>
      )}
      <FormLayout gap={24}>
        <InputDatepicker
          required
          width={160}
          disabled={!projectId}
          label={i18Project('LB_OT_DATE')}
          error={(!!errors?.otDate && touched?.otDate) || isErrorOTDate}
          errorMessage={errors?.otDate || errors?.otRequestId}
          value={otDate.otDate}
          onChange={handleChangeOTDate}
        />
        <InputTimepicker
          isDisable={!projectId}
          required
          value={otDate.from}
          label={i18('LB_FROM')}
          error={!!errors?.from && touched?.from}
          errorMessage={errors?.from}
          maxTime={otDate.to}
          onChange={value =>
            onChange({
              otDateIndex: index,
              value,
              field: 'from',
            })
          }
        />
        <InputTimepicker
          isDisable={!projectId}
          required
          minTime={otDate.from}
          value={otDate.to}
          label={i18DailyReport('LB_TO')}
          error={!!errors?.to && touched?.to}
          errorMessage={errors?.to}
          onChange={value =>
            onChange({
              otDateIndex: index,
              value,
              field: 'to',
            })
          }
        />
        <Box width={100}>
          <InputTextLabel
            required
            disabled
            value={value.toString()}
            label={i18DailyReport('LB_OT_HOURS')}
            useCounter={false}
          />
        </Box>
      </FormLayout>
      <FormLayout top={24}>
        <InputTextArea
          height={80}
          defaultValue={otDate.reasonForOt}
          label={i18DailyReport('LB_REASON_FOR_OT') as string}
          placeholder={i18DailyReport('PLH_REASON_FOR_OT')}
          onChange={(e: EventInput) =>
            onChange({
              otDateIndex: index,
              value: e.target.value,
              field: 'reasonForOt',
            })
          }
        />
      </FormLayout>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormProjectOTDateItem: {
    backgroundColor: theme.color.blue.small,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    position: 'relative',
  },
  actions: {
    position: 'absolute',
    right: '12px',
  },
}))

export default FormProjectOTDateItem
