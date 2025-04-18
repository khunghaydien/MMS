import CardFormEdit from '@/components/Form/CardFormEdit'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import StatusItem from '@/components/common/StatusItem'
import InputAutocompleteSingle from '@/components/inputs/InputAutocompleteSingle'
import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { createOTReport, updateReportOT } from '@/modules/project/reducer/thunk'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { IColor, OptionItem } from '@/types'
import { getOtHoursRangeTime } from '@/utils/date'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import {
  STATUS_OT_REPORT_LABELS,
  STATUS_OT_REPORT_VALUES,
  WORK_TYPE,
  WORK_TYPE_VALUE,
} from '../../const'
import {
  dailyReportSelector,
  setCountReCallApiDailyReports,
} from '../../reducer/dailyReport'
import OTReportFormItem from './OTReportFormItem'

export const ViewDetailOTReport = ({ report }: { report: any }) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const getStatus = () => {
    let color: IColor = 'orange'
    switch (report.status) {
      case STATUS_OT_REPORT_VALUES.IN_REVIEW:
        color = 'orange'
        break
      case STATUS_OT_REPORT_VALUES.CONFIRMED:
        color = 'blue'
        break
      case STATUS_OT_REPORT_VALUES.REJECTED:
        color = 'red'
        break
      case STATUS_OT_REPORT_VALUES.APPROVED:
        color = 'green'
        break
      default:
        color = 'orange'
    }
    return {
      color,
      label: STATUS_OT_REPORT_LABELS[report.status] || 'In Review',
    }
  }

  return (
    <Box className={classes.listFields}>
      <StatusItem typeStatus={getStatus()} />
      <FormLayout gap={24}>
        <Box className={classes.option}>
          <Box className={classes.label}>{i18Project('LB_PROJECT_NAME')}</Box>
          <Box className={classes.value}>{report.project?.name}</Box>
        </Box>
        <Box className={classes.option}>
          <Box className={classes.label}>{i18Project('LB_PROJECT_CODE')}</Box>
          <Box className={classes.value}>{report.project?.code}</Box>
        </Box>
      </FormLayout>
      {(!!report.confirmer?.name || !!report.approver?.name) && (
        <FormLayout gap={24}>
          {!!report.confirmer?.name && (
            <Box className={classes.option}>
              <Box className={classes.label}>
                {i18DailyReport('LB_CONFIRMER')}
              </Box>
              <Box className={classes.value}>{report.confirmer?.name}</Box>
            </Box>
          )}
          {!!report.approver?.name && (
            <Box className={classes.option}>
              <Box className={classes.label}>
                {i18DailyReport('LB_APPROVER')}
              </Box>
              <Box className={classes.value}>{report.approver?.name}</Box>
            </Box>
          )}
        </FormLayout>
      )}
      <FormLayout gap={24}>
        <Box className={classes.option}>
          <Box className={classes.label}>{i18('LB_FROM')}</Box>
          <Box className={classes.value}>{report.otFrom}</Box>
        </Box>
        <Box className={classes.option}>
          <Box className={classes.label}>{i18('LB_TO')}</Box>
          <Box className={classes.value}>{report.otTo}</Box>
        </Box>
        <Box className={classes.option}>
          <Box className={classes.label}>{i18DailyReport('LB_OT_HOURS')}</Box>
          <Box className={classes.value}>{report.otHours}</Box>
        </Box>
      </FormLayout>
      {!!report.reason && (
        <Box className={classes.option}>
          <Box className={classes.label}>
            {i18DailyReport('LB_REASON_FOR_OT')}
          </Box>
          <Box className={classes.value}>{report.reason}</Box>
        </Box>
      )}
    </Box>
  )
}

interface IProps {
  index: number
  report: any
  isViewOnly: boolean
  onDeleteForm: (payload: { report: any; index: number }) => void
  onCreateSuccess: (index: number, newOTReport: any) => void
}

const FormOTHoursItem = ({
  index,
  report,
  isViewOnly,
  onDeleteForm,
  onCreateSuccess,
}: IProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { listProjectOtRequest } = useSelector(projectSelector)
  const { countReCallApiDailyReports, reportDate } =
    useSelector(dailyReportSelector)

  const [useDetailViewMode, setUseDetailViewMode] = useState(
    report.mode === 'detail'
  )
  const [reportTemp, setReportTemp] = useState(report)

  const initProjectId = listProjectOtRequest.length ? report.project?.id : ''
  const initProjectName = listProjectOtRequest.length
    ? report.project?.name
    : ''
  const initProjectCode = listProjectOtRequest.length
    ? report.project?.code
    : ''

  const form = useFormik({
    initialValues: {
      projectId: initProjectId,
      otFrom: report.otFrom,
      otTo: report.otTo,
      reason: report.reason,
      otRequestId: report.otRequest.id,
      projectName: initProjectName,
      projectCode: initProjectCode,
    },
    validationSchema: Yup.object({
      projectId: Yup.string().required(
        i18('MSG_SELECT_REQUIRE', {
          name: i18Project('LB_PROJECT'),
        }) as string
      ),
      otFrom: Yup.string().required(
        i18('MSG_SELECT_REQUIRE', {
          name: i18DailyReport('LB_OT_FROM'),
        }) as string
      ),
      otTo: Yup.string().required(
        i18('MSG_SELECT_REQUIRE', {
          name: i18DailyReport('LB_TO'),
        }) as string
      ),
    }),
    onSubmit: values => {
      if (typeof report.id === 'number') {
        const requestBody = {
          hours: getOtHoursRangeTime(values.otFrom, values.otTo),
          id: report.id,
          otDate: moment(report.otDate).valueOf(),
          otFrom: values.otFrom,
          otRequestId: values.otRequestId,
          otTo: values.otTo,
          projectId: values.projectId,
          reason: values.reason,
        }
        dispatch(updateLoading(true))
        dispatch(updateReportOT({ id: report.id, data: requestBody }))
          .unwrap()
          .then((res: AxiosResponse) => {
            setReportTemp({
              ...reportTemp,
              otHours: getOtHoursRangeTime(values.otFrom, values.otTo),
              id: report.id,
              otDate: moment(report.otDate).valueOf(),
              otFrom: values.otFrom,
              otRequest: { id: values.otRequestId },
              otTo: values.otTo,
              project: {
                id: values.projectId,
                name: values.projectName,
                code: values.projectCode,
              },
              reason: values.reason,
              status: res.data?.status,
            })
            setUseDetailViewMode(true)
            dispatch(
              setCountReCallApiDailyReports(countReCallApiDailyReports + 1)
            )
          })
          .finally(() => {
            dispatch(updateLoading(false))
          })
      } else {
        const requestBody = {
          reportDate,
          reports: [
            {
              hours: getOtHoursRangeTime(values.otFrom, values.otTo),
              id: 0,
              otDate: reportDate,
              otFrom: values.otFrom,
              otRequestId: values.otRequestId,
              otTo: values.otTo,
              projectId: values.projectId,
              reason: values.reason,
            },
          ],
        }

        dispatch(updateLoading(true))
        dispatch(createOTReport(requestBody))
          .unwrap()
          .then((res: AxiosResponse) => {
            const newOTReport = {
              ...reportTemp,
              otHours: getOtHoursRangeTime(values.otFrom, values.otTo),
              id: res.data?.[0]?.id,
              otDate: reportDate,
              otFrom: values.otFrom,
              otRequest: { id: values.otRequestId },
              otTo: values.otTo,
              project: {
                id: values.projectId,
                name: values.projectName,
                code: values.projectCode,
              },
              reason: values.reason,
              confirmer: res.data?.[0]?.confirmer,
              approver: res.data?.[0]?.approver,
            }
            setReportTemp(newOTReport)
            dispatch(
              setCountReCallApiDailyReports(countReCallApiDailyReports + 1)
            )
            onCreateSuccess(index, newOTReport)
          })
          .finally(() => {
            dispatch(updateLoading(false))
          })
      }
    },
  })
  const { values, setFieldValue, errors, touched, setValues } = form

  const useActions = useMemo(() => {
    return (
      report.status !== STATUS_OT_REPORT_VALUES.CONFIRMED &&
      report.status !== STATUS_OT_REPORT_VALUES.APPROVED &&
      !isViewOnly
    )
  }, [report.status, isViewOnly])

  const buttonSubmitDisabled = useMemo(() => {
    return (
      JSON.stringify({
        projectId: initProjectId,
        otFrom: reportTemp.otFrom,
        otTo: reportTemp.otTo,
        reason: reportTemp.reason,
      }) ===
      JSON.stringify({
        projectId: values.projectId,
        otFrom: values.otFrom,
        otTo: values.otTo,
        reason: values.reason,
      })
    )
  }, [reportTemp, values])

  const onProjectChange = (projectId: string, option?: OptionItem | null) => {
    setFieldValue('projectId', projectId)
    setFieldValue('projectName', option?.label)
    setFieldValue('projectCode', option?.code)
    setFieldValue('otRequestId', option?.requestId)
  }

  const onCancel = () => {
    setValues({
      projectId: initProjectId,
      otFrom: report.otFrom,
      otTo: report.otTo,
      reason: report.reason,
      otRequestId: report.requestId,
      projectName: initProjectName,
      projectCode: initProjectCode,
    })
    setUseDetailViewMode(true)
  }

  const onDelete = () => {
    onDeleteForm({
      report,
      index,
    })
  }

  useEffect(() => {
    setReportTemp(report)
  }, [report])

  useEffect(() => {
    if (listProjectOtRequest.length) {
      setFieldValue('projectId', report.project?.id)
    }
  }, [listProjectOtRequest])

  return (
    <Box className={classes.RootFormOTHoursItem}>
      <Box className={classes.title}>
        {i18DailyReport('LB_REPORT_OT')}
        &nbsp; #{index + 1}
      </Box>
      {useActions && (
        <Box className={classes.actions}>
          {report.mode === 'detail' && (
            <CardFormEdit
              hideBorder
              buttonUseDetailEditDisabled={buttonSubmitDisabled}
              useDeleteMode={useDetailViewMode}
              useDetailEditMode={!useDetailViewMode}
              useDetailViewMode={useDetailViewMode}
              onOpenEditMode={() => setUseDetailViewMode(false)}
              onCancelEditMode={onCancel}
              onOpenDeleteMode={onDelete}
              onSaveAs={() => form.handleSubmit()}
            />
          )}
          {report.mode === 'add' && (
            <CardFormEdit
              hideBorder
              hideButtonCancel
              useDeleteMode
              buttonUseDetailEditDisabled={false}
              useDetailEditMode={!useDetailViewMode}
              onOpenDeleteMode={onDelete}
              onSaveAs={() => form.handleSubmit()}
            />
          )}
        </Box>
      )}
      {useDetailViewMode && <ViewDetailOTReport report={reportTemp} />}
      {!useDetailViewMode && (
        <Box className={classes.listFields}>
          <FormLayout gap={24} top={24}>
            <InputDropdown
              isDisable
              label={i18DailyReport('LB_WORKING_TYPE')}
              value={WORK_TYPE_VALUE.PROJECT_REPORT}
              listOptions={WORK_TYPE}
              onChange={() => {}}
            />
            <FormItem required label={i18('LB_PROJECT')}>
              <InputAutocompleteSingle
                width={'100%'}
                listOptions={listProjectOtRequest}
                placeholder={i18DailyReport('PLH_SELECT_PROJECT')}
                value={values.projectId}
                error={!!errors.projectId && !!touched.projectId}
                errorMessage={errors?.projectId}
                onChange={onProjectChange}
              />
            </FormItem>
          </FormLayout>
          <FormLayout gap={24}>
            <OTReportFormItem
              otFrom={values.otFrom}
              otTo={values.otTo}
              reason={values.reason}
              errors={errors}
              touched={touched}
              onChange={(newVal: string, field: string) =>
                setFieldValue(field, newVal)
              }
            />
          </FormLayout>
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormOTHoursItem: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '8px',
    padding: theme.spacing(2),
    position: 'relative',
  },
  reportOTBox: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
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
  noteOT: {
    fontWeight: 600,
    fontSize: 14,
  },
  title: {
    position: 'absolute',
    fontWeight: 700,
    color: theme.color.blue.primary,
    background: '#fff',
    top: '-10px',
  },
  actions: {
    position: 'absolute',
    right: theme.spacing(2),
  },
  listFields: {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
  option: {
    width: 'max-content',
    minWidth: '200px',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    whiteSpace: 'pre-line',
  },
}))

export default FormOTHoursItem
