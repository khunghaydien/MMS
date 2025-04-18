import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import {
  createOTReport,
  getListProjectReportOT,
} from '@/modules/project/reducer/thunk'
import { selectAuth } from '@/reducer/auth'
import { getProjectStaffs } from '@/reducer/common'
import { alertSuccess, commonErrorAlert, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { formatDate, uuid } from '@/utils'
import { getOtHoursRangeTime } from '@/utils/date'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import moment from 'moment'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { WORK_TYPE_VALUE } from '../../const'
import {
  dailyReportSelector,
  getCurrentDailyReports,
  setCurrentReports,
  setIsOpenModalDetailDailyReport,
  setIsViewAllDailyReport,
  setReportDate,
} from '../../reducer/dailyReport'
import dailyReportService from '../../services/dailyReport.service'
import { AddDailyReportRequestBody, IReport } from '../../types'
import FormAddDailyReport from './FormAddDailyReport'
import FormAddOTReport from './FormAddOTReport'
import useDailyReportValidation from './useDailyReportValidation'

interface ModalAddDailyReportProps {
  isAddDailyReport: boolean
  calendarMonth: number
  calendarYear: number
  onClose: () => void
  getReportFromApi: Function
}

export interface FormAddDailyReportItem {
  id: string
  isWorking: boolean
  workType: string | number
  projectId: string | number
  workingHours: string | number
  workingDescription: string
  improvement: string
  suggestionForImprovement: string
  otFrom: string
  otTo: string
  reason: string
  hours: number
  otRequestId: string
  isProjectOtRequest: false
  useReportOT: boolean
}

const ModalAddDailyReport = ({
  isAddDailyReport,
  onClose,
  getReportFromApi,
  calendarMonth,
  calendarYear,
}: ModalAddDailyReportProps) => {
  const randomId = uuid()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const { reports, reportDate } = useSelector(dailyReportSelector)
  const { listProjectOtRequest } = useSelector(projectSelector)
  const { addDailyReportValidation } = useDailyReportValidation()
  const { staff } = useSelector(selectAuth)

  const form = useFormik({
    initialValues: {
      reportDate: reportDate ? new Date(reportDate) : null,
      listForm: [
        {
          id: '*',
          isWorking: isAddDailyReport,
          workType: isAddDailyReport ? '' : WORK_TYPE_VALUE.PROJECT_REPORT,
          projectId: '',
          workingHours: '',
          workingDescription: '',
          improvement: '',
          suggestionForImprovement: '',
          otFrom: '',
          otTo: '',
          reason: '',
          hours: 0,
          otRequestId: '',
          isProjectOtRequest: false,
          useReportOT: false,
        },
      ],
    } as {
      reportDate: Date | null
      listForm: FormAddDailyReportItem[]
    },
    validationSchema: addDailyReportValidation,
    onSubmit: values => {
      const dailyReportDetails = values.listForm.filter(
        (i: any) => !!i.isWorking
      )
      const otReportDetails = values.listForm.filter(
        (i: any) => !!i.otFrom && !!i.otTo
      )
      const onlyOTReport = !dailyReportDetails.length
      if (onlyOTReport) {
        const requestBody = {
          reportDate: values.reportDate?.getTime() as number,
          reports: otReportDetails.map(formItem => ({
            hours: getOtHoursRangeTime(formItem.otFrom, formItem.otTo),
            id: 0,
            otDate: new Date(values.reportDate || new Date()).getTime(),
            otFrom: formItem.otFrom,
            otRequestId: formItem.otRequestId,
            otTo: formItem.otTo,
            projectId: formItem.projectId,
            reason: formItem.reason,
          })),
        }
        addOTReport(requestBody)
      } else {
        const requestBody: AddDailyReportRequestBody = {
          improvement: '',
          note: '',
          noteWorkDescription: '',
          statusReport: 0,
          reportDate: values.reportDate?.getTime() as number,
          dailyReportDetails: dailyReportDetails.map(formItem => ({
            dailyDetailId: null,
            improvement: formItem.improvement,
            projectId: formItem.projectId,
            suggestionForImprovement: formItem.suggestionForImprovement,
            workType: +formItem.workType,
            workingDescription: formItem.workingDescription,
            workingHours: +formItem.workingHours,
          })),
          otReportDetails: otReportDetails.map(formItem => ({
            hours: getOtHoursRangeTime(formItem.otFrom, formItem.otTo),
            otDate: new Date(values.reportDate || new Date()).getTime(),
            otFrom: formItem.otFrom,
            otRequestId: formItem.otRequestId,
            otTo: formItem.otTo,
            projectId: formItem.projectId,
            reason: formItem.reason,
          })),
        }
        addDailyReport(requestBody)
      }
    },
  })
  const { values, setFieldValue, errors, touched } = form

  const useFooterActions = useMemo(() => {
    return values.listForm.every(
      item => item.workType !== +WORK_TYPE_VALUE.DAY_OFF_FULL_DAY
    )
  }, [values.listForm])

  const addOTReport = (requestBody: any) => {
    dispatch(updateLoading(true))
    dispatch(createOTReport(requestBody))
      .unwrap()
      .then((res: any) => {
        dispatch(
          alertSuccess({
            message: res?.message,
          })
        )
        getReportFromApi()
        onClose()
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const addDailyReport = (requestBody: AddDailyReportRequestBody) => {
    dispatch(updateLoading(true))
    dailyReportService
      .addDailyReport(requestBody)
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18DailyReport(
              'dailyReport:MSG_CREATE_DAILY_REPORT_SUCCESS',
              { date: formatDate(requestBody.reportDate) }
            ),
          })
        )
        getReportFromApi()
        onClose()
      })
      .catch(() => {
        dispatch(commonErrorAlert())
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const addFormItem = ({ isWorking }: { isWorking: boolean }) => {
    setFieldValue('listForm', [
      ...values.listForm,
      {
        id: randomId,
        isWorking,
        workType: !isWorking ? WORK_TYPE_VALUE.PROJECT_REPORT : '',
        projectId: '',
        workingHours: '',
        workingDescription: '',
        improvement: '',
        suggestionForImprovement: '',
        otFrom: '',
        otTo: '',
        reason: '',
        hours: 0,
        otRequestId: '',
        isProjectOtRequest: !isWorking,
        useReportOT: false,
      },
    ])
  }

  const openModalDetail = (
    date: Date | number | null,
    reportsParam: IReport[]
  ) => {
    dispatch(updateLoading(true))
    let _date = typeof date === 'number' ? new Date(date) : date
    if (_date) {
      const dailyReportSelected = reportsParam.find((report: IReport) => {
        return (
          moment(report.reportDate).format('DD/MM/YYYY') ===
          moment(_date).format('DD/MM/YYYY')
        )
      })
      const isDailyReportExisted =
        !!dailyReportSelected?.dailyReportDetails?.length ||
        !!dailyReportSelected?.otReportDetails?.length
      if (isDailyReportExisted) {
        onClose()
        dispatch(setIsViewAllDailyReport(true))
        dispatch(setReportDate(_date.getTime()))
        dispatch(setIsOpenModalDetailDailyReport(true))
      }
    }
    setTimeout(() => {
      dispatch(updateLoading(false))
    }, 200)
  }

  const onReportDateChange = (newReportDate: Date | null) => {
    setFieldValue(
      'listForm',
      values.listForm.map(item => ({ ...item, projectId: '' }))
    )
    setFieldValue('reportDate', newReportDate)
    if (newReportDate) {
      dispatch(updateLoading(true))
      dispatch(
        getCurrentDailyReports({
          month: newReportDate.getMonth() + 1,
          year: newReportDate.getFullYear(),
          staffId: staff?.id || '',
        })
      )
        .unwrap()
        .then((res: AxiosResponse) => {
          dispatch(setCurrentReports(res.data?.dailyReport || []))
          openModalDetail(newReportDate, res.data?.dailyReport || [])
        })
        .finally(() => {
          dispatch(updateLoading(false))
        })
    }
  }

  const handleSubmit = () => {
    form.handleSubmit()
  }

  const onDeleteFormItem = (index: number) => {
    const newListForm = [...values.listForm]
    newListForm.splice(index, 1)
    setFieldValue('listForm', newListForm)
  }

  const getProjectsOtReport = () => {
    dispatch(
      getListProjectReportOT({
        reportDate:
          typeof values.reportDate === 'object'
            ? values.reportDate?.getTime()
            : values.reportDate,
      })
    )
  }

  useEffect(() => {
    getProjectsOtReport()
  }, [values.reportDate])

  useEffect(() => {
    values.reportDate &&
      dispatch(
        getProjectStaffs(
          typeof values.reportDate === 'object'
            ? values.reportDate?.getTime()
            : values.reportDate
        )
      )
  }, [values.reportDate])

  return (
    <Modal
      open
      width={800}
      title={i18DailyReport('TXT_DAILY_REPORT')}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Box className={classes.body}>
        <InputDatepicker
          required
          label={i18DailyReport('LB_REPORT_DATE')}
          minDate={new Date('1-1-2024')}
          error={touched.reportDate && !!errors.reportDate}
          errorMessage={errors.reportDate}
          value={values.reportDate}
          isShowClearIcon={false}
          onChange={onReportDateChange}
        />
        <Box className={classes.listForm}>
          {values.listForm.map((item: any, index: number) =>
            item.isWorking ? (
              <FormAddDailyReport
                key={item.id}
                formItem={item}
                index={index}
                useDeleteIcon={values.listForm.length > 1}
                onDeleteFormItem={onDeleteFormItem}
                formik={form}
              />
            ) : (
              <FormAddOTReport
                listProjectOtRequest={listProjectOtRequest}
                key={item.id}
                formItem={item}
                index={index}
                useDeleteIcon={values.listForm.length > 1}
                onDeleteFormItem={onDeleteFormItem}
                formik={form}
              />
            )
          )}
        </Box>
        {useFooterActions && (
          <Box className={classes.footerActions}>
            <Box>
              <ButtonAddPlus
                label={i18DailyReport('TXT_ADD_PROJECT_WORKING_HOURS')}
                onClick={() => addFormItem({ isWorking: true })}
              />
            </Box>
            <Box>
              <ButtonAddPlus
                label={i18DailyReport('TXT_ADD_OT_REPORT')}
                onClick={() => addFormItem({ isWorking: false })}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {},
  listForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  footerActions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}))

export default ModalAddDailyReport
