import InputTimepicker from '@/components/Datepicker/InputTimepicker'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputAutocompleteSingle from '@/components/inputs/InputAutocompleteSingle'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { EventInput, OptionItem } from '@/types'
import { getOtHoursRangeTime } from '@/utils/date'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { WORK_TYPE, WORK_TYPE_DAY_OFF, WORK_TYPE_VALUE } from '../../const'

interface FormAddOTReportProps {
  formItem: any
  index: number
  useDeleteIcon: boolean
  formik: any
  listProjectOtRequest: OptionItem[]
  onDeleteFormItem: (index: number) => void
}

const FormAddOTReport = ({
  formItem,
  index,
  onDeleteFormItem,
  useDeleteIcon,
  formik,
  listProjectOtRequest,
}: FormAddOTReportProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const errors = formik.errors?.listForm?.[index]
  const touched = formik.touched?.listForm?.[index]
  const { setFieldValue } = formik

  const title = useMemo(() => {
    return `${i18DailyReport('LB_REPORT_OT')} #${index + 1}`
  }, [index])

  const otHoursRangeTime = useMemo(() => {
    if (formItem.otFrom === '' || formItem.otTo === '') {
      return ''
    }
    return getOtHoursRangeTime(formItem.otFrom, formItem.otTo)
  }, [formItem.otFrom, formItem.otTo])

  const onOtRangeTimeChange = (value: string, field: string) => {
    setFieldValue(`listForm[${index}].${field}`, value)
  }

  const onProjectChange = (projectId: string, option?: OptionItem | null) => {
    setFieldValue(`listForm[${index}].otRequestId`, option?.requestId || 0)
    setFieldValue(`listForm[${index}].projectId`, projectId)
  }

  return (
    <Box className={classes.RootFormAddDailyReport}>
      <Box className={classes.title}>{title}</Box>
      {useDeleteIcon && (
        <Box className={classes.boxDeleteIcon}>
          <CardFormEdit
            hideBorder
            useDeleteMode
            onOpenDeleteMode={() => onDeleteFormItem(index)}
          />
        </Box>
      )}
      <Box className={classes.body}>
        <FormLayout gap={24}>
          <Box width={220}>
            <InputDropdown
              required
              isDisable
              value={WORK_TYPE_VALUE.PROJECT_REPORT}
              listOptions={[...WORK_TYPE, ...WORK_TYPE_DAY_OFF]}
              label={i18DailyReport('LB_WORKING_TYPE')}
              placeholder={i18DailyReport('PLH_SELECT_WORK_TYPE')}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormItem required label={i18('LB_PROJECT')}>
              <InputAutocompleteSingle
                width="100%"
                listOptions={listProjectOtRequest}
                placeholder={i18DailyReport('PLH_SELECT_PROJECT')}
                value={formItem.projectId}
                error={!!errors?.projectId && touched?.projectId}
                errorMessage={errors?.projectId}
                onChange={onProjectChange}
              />
            </FormItem>
          </Box>
        </FormLayout>
        <Box className={classes.RootOTReportFormItem}>
          <FormLayout gap={24}>
            <InputTimepicker
              required
              label={i18DailyReport('LB_OT_FROM')}
              maxTime={formItem.otTo}
              value={formItem.otFrom}
              error={!!errors?.otFrom && touched?.otFrom}
              errorMessage={errors?.otFrom}
              onChange={(value: string) => onOtRangeTimeChange(value, 'otFrom')}
            />
            <InputTimepicker
              required
              minTime={formItem.otFrom}
              label={i18DailyReport('LB_TO')}
              value={formItem.otTo}
              error={!!errors?.otTo && touched?.otTo}
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
              defaultValue={formItem.reason}
              onChange={(event: EventInput) =>
                setFieldValue(`listForm[${index}].reason`, event.target.value)
              }
            />
          </FormLayout>
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormAddDailyReport: {
    position: 'relative',
    padding: theme.spacing(3),
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
  },
  title: {
    position: 'absolute',
    color: theme.color.blue.primary,
    top: '-10px',
    left: '15px',
    fontWeight: 700,
    background: '#fff',
  },
  boxDeleteIcon: {
    position: 'absolute',
    top: '12px',
    right: '8px',
  },
  formChildDailyReport: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    backgroundColor: theme.color.blue.small,
    padding: theme.spacing(2),
  },
  RootOTReportFormItem: {
    backgroundColor: theme.color.blue.small,
    padding: theme.spacing(2),
    width: '100%',
    marginTop: theme.spacing(2),
  },
  body: {
    marginTop: theme.spacing(2),
  },
}))

export default FormAddOTReport
