import ConditionalRender from '@/components/ConditionalRender'
import InputTimepicker from '@/components/Datepicker/InputTimepicker'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputAutocompleteSingle from '@/components/inputs/InputAutocompleteSingle'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { commonSelector } from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import commonService from '@/services/common.service'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
import { getOtHoursRangeTime } from '@/utils/date'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { WORK_TYPE, WORK_TYPE_DAY_OFF, WORK_TYPE_VALUE } from '../../const'

interface FormAddDailyReportProps {
  formItem: any
  index: number
  useDeleteIcon: boolean
  formik: any
  onDeleteFormItem: (index: number) => void
}

const FormAddDailyReport = ({
  formItem,
  index,
  onDeleteFormItem,
  useDeleteIcon,
  formik,
}: FormAddDailyReportProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { projectStaffs } = useSelector(commonSelector)

  const errors = formik.errors?.listForm?.[index]
  const touched = formik.touched?.listForm?.[index]
  const { setFieldValue } = formik

  const [useIssuesAndSuggestions, setUseIssuesAndSuggestions] = useState(false)

  const isHalfDayOff = +formItem.workType === +WORK_TYPE_VALUE.DAY_OFF_HALF_DAY
  const isFullDayOff = +formItem.workType === +WORK_TYPE_VALUE.DAY_OFF_FULL_DAY

  const projectsListOptions = useMemo(() => {
    const dailyReportDetails = formik.values.listForm.filter(
      (item: any) => !!item.isWorking
    )
    const projectIds = dailyReportDetails
      .map((item: any) => item.projectId)
      .filter((projectId: string | number) => !!projectId)
      .filter((projectId: string) => projectId !== formItem.projectId)

    return projectStaffs.filter(item => !projectIds.includes(item.id))
  }, [projectStaffs, formik.values.listForm, formItem.projectId])

  const title = useMemo(() => {
    return `${i18DailyReport('LB_WORKING')} #${index + 1}`
  }, [index])

  const otHoursRangeTime = useMemo(() => {
    if (formItem.otFrom === '' || formItem.otTo === '') {
      return ''
    }
    return getOtHoursRangeTime(formItem.otFrom, formItem.otTo)
  }, [formItem.otFrom, formItem.otTo])

  const projectDisabled = useMemo(() => {
    return +formItem.workType !== +WORK_TYPE_VALUE.PROJECT_REPORT
  }, [formItem.workType])

  const onWorkTypeChange = (newWorkType: string | number) => {
    if (+newWorkType === +WORK_TYPE_VALUE.DAY_OFF_HALF_DAY) {
      setFieldValue(`listForm[${index}].workingHours`, 4)
      setFieldValue(`listForm[${index}].projectId`, '')
    } else if (+newWorkType === +WORK_TYPE_VALUE.DAY_OFF_FULL_DAY) {
      const newListForm = [{ ...formItem }]
      setFieldValue('listForm', newListForm)
      setFieldValue(`listForm[${index}].workingHours`, '')
    } else {
      setFieldValue(`listForm[${index}].workingHours`, '')
    }

    setFieldValue(`listForm[${index}].workType`, newWorkType)
  }

  const onProjectChange = (projectId: string) => {
    setFieldValue(`listForm[${index}].projectId`, projectId)

    if (projectId) {
      dispatch(updateLoading(true))
      commonService
        .validateProjectOTReport({
          otDate: formik.values.reportDate?.getTime(),
          projectId: projectId,
        })
        .then((res: AxiosResponse) => {
          if (typeof res.data === 'number') {
            setFieldValue(`listForm[${index}].isProjectOtRequest`, true)
            setFieldValue(`listForm[${index}].otRequestId`, res.data)
          } else {
            setFieldValue(`listForm[${index}].useReportOT`, false)
          }
        })
        .finally(() => {
          dispatch(updateLoading(false))
        })
    }
  }

  const onOtRangeTimeChange = (value: string, field: string) => {
    setFieldValue(`listForm[${index}].${field}`, value)
  }

  const toggleUseReportOT = () => {
    setFieldValue(`listForm[${index}].useReportOT`, !formItem.useReportOT)
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
          <Box
            width={
              formItem.workType === +WORK_TYPE_VALUE.PROJECT_REPORT
                ? 220
                : '100%'
            }
          >
            <InputDropdown
              required
              value={formItem.workType}
              error={!!errors?.workType && touched?.workType}
              errorMessage={errors?.workType}
              listOptions={[...WORK_TYPE, ...WORK_TYPE_DAY_OFF]}
              label={i18DailyReport('LB_WORKING_TYPE')}
              placeholder={i18DailyReport('PLH_SELECT_WORK_TYPE')}
              onChange={onWorkTypeChange}
            />
          </Box>
          {formItem.workType === +WORK_TYPE_VALUE.PROJECT_REPORT && (
            <Box sx={{ flex: 1 }}>
              <FormItem required label={i18('LB_PROJECT')}>
                <InputAutocompleteSingle
                  width="100%"
                  disabled={projectDisabled}
                  listOptions={projectsListOptions}
                  placeholder={i18DailyReport('PLH_SELECT_PROJECT')}
                  value={formItem.projectId}
                  error={!!errors?.projectId && touched?.projectId}
                  errorMessage={errors?.projectId}
                  onChange={onProjectChange}
                />
              </FormItem>
            </Box>
          )}
        </FormLayout>
        {!isFullDayOff && (
          <Box className={classes.formChildDailyReport}>
            <FormLayout gap={24}>
              <Box width={140}>
                <InputCurrency
                  suffix=""
                  required
                  disabled={isHalfDayOff}
                  className={classes.workingHour}
                  label={i18DailyReport('LB_WORKING_HOURS')}
                  placeholder={i18DailyReport('PLH_WORKING_HOURS')}
                  error={!!errors?.workingHours && touched?.workingHours}
                  errorMessage={errors?.workingHours}
                  value={formItem.workingHours}
                  onChange={(value: string | undefined) =>
                    setFieldValue(
                      `listForm[${index}].workingHours`,
                      value as string
                    )
                  }
                />
              </Box>
              <InputTextArea
                height={120}
                label={i18('LB_DESCRIPTION') as string}
                placeholder={i18DailyReport('PLH_WORKING_DESCRIPTION')}
                defaultValue={formItem.workingDescription}
                onChange={(event: EventInput) =>
                  setFieldValue(
                    `listForm[${index}].workingDescription`,
                    event.target.value
                  )
                }
              />
            </FormLayout>
            <ConditionalRender conditional={!isHalfDayOff}>
              <Fragment>
                <InputCheckbox
                  label={i18DailyReport('LB_ISSUES_AND_SUGGESTIONS')}
                  checked={useIssuesAndSuggestions}
                  onClick={() =>
                    setUseIssuesAndSuggestions(!useIssuesAndSuggestions)
                  }
                />
                {useIssuesAndSuggestions && (
                  <FormLayout gap={24}>
                    <InputTextArea
                      label={i18DailyReport('LB_ISSUES') as string}
                      placeholder={i18DailyReport('PLH_ISSUES')}
                      height={80}
                      defaultValue={formItem.improvement}
                      onChange={(event: EventInput) =>
                        setFieldValue(
                          `listForm[${index}].improvement`,
                          event.target.value
                        )
                      }
                    />
                    <InputTextArea
                      label={
                        i18DailyReport(
                          'LB_SUGGESTION_FOR_IMPROVEMENT'
                        ) as string
                      }
                      placeholder={i18DailyReport(
                        'PLH_SUGGESTION_FOR_IMPROVEMENT'
                      )}
                      height={80}
                      defaultValue={formItem.suggestionForImprovement}
                      onChange={(event: EventInput) =>
                        setFieldValue(
                          `listForm[${index}].suggestionForImprovement`,
                          event.target.value
                        )
                      }
                    />
                  </FormLayout>
                )}
              </Fragment>
            </ConditionalRender>
            <ConditionalRender conditional={formItem.isProjectOtRequest}>
              <Box className={classes.reportOTBox}>
                <Box className={classes.noteOT}>
                  {i18DailyReport('TXT_YOU_CAN_REPORT_OT_TODAY')}
                </Box>
                <InputCheckbox
                  checked={formItem.useReportOT}
                  label={i18DailyReport('LB_REPORT_OT')}
                  onClick={toggleUseReportOT}
                />
                {formItem.useReportOT && (
                  <Box className={classes.RootOTReportFormItem}>
                    <FormLayout gap={24}>
                      <InputTimepicker
                        required
                        maxTime={formItem.otTo}
                        label={i18DailyReport('LB_OT_FROM')}
                        value={formItem.otFrom}
                        error={!!errors?.otFrom && touched?.otFrom}
                        errorMessage={errors?.otFrom}
                        onChange={(value: string) =>
                          onOtRangeTimeChange(value, 'otFrom')
                        }
                      />
                      <InputTimepicker
                        required
                        minTime={formItem.otFrom}
                        label={i18DailyReport('LB_TO')}
                        value={formItem.otTo}
                        error={!!errors?.otTo && touched?.otTo}
                        errorMessage={errors?.otTo}
                        onChange={(value: string) =>
                          onOtRangeTimeChange(value, 'otTo')
                        }
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
                          setFieldValue(
                            `listForm[${index}].reason`,
                            event.target.value
                          )
                        }
                      />
                    </FormLayout>
                  </Box>
                )}
              </Box>
            </ConditionalRender>
          </Box>
        )}
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
  workingHour: {
    maxWidth: '100% !important',
  },
  reportOTBox: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  noteOT: {
    fontWeight: 600,
    fontSize: 14,
  },
  RootOTReportFormItem: {
    backgroundColor: theme.color.blue.small,
    padding: theme.spacing(2),
    width: '100%',
  },
  body: {
    marginTop: theme.spacing(2),
  },
}))

export default FormAddDailyReport
