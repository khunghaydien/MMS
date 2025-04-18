import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import { LangConstant } from '@/const'
import {
  deleteReportOT,
  getListProjectReportOT,
} from '@/modules/project/reducer/thunk'
import { getProjectStaffs } from '@/reducer/common'
import { alertSuccess, commonErrorAlert, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import moment from 'moment'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  dailyReportSelector,
  setCountReCallApiDailyReports,
  setDailyReportId,
  setIsViewAllDailyReport,
  setReportListDetail,
} from '../../reducer/dailyReport'
import dailyReportService from '../../services/dailyReport.service'
import { IReport } from '../../types'
import FormOTHoursItem from './FormOTHoursItem'
import FormWorkingHoursItem from './FormWorkingHoursItem'

interface ModalDetailDailyReportProps {
  onClose: () => void
  isViewOnly: boolean
  calendarMonth: number
  calendarYear: number
}

const ModalDetailDailyReport = ({
  isViewOnly,
  onClose,
  calendarMonth,
  calendarYear,
}: ModalDetailDailyReportProps) => {
  const randomId = uuid()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const {
    reportListDetail,
    reportDate,
    isViewAllDailyReport,
    countReCallApiDailyReports,
    reports,
    dailyReportId,
  } = useSelector(dailyReportSelector)

  const [reportList, setReportList] = useState<any>([])
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false)
  const [reportSelected, setReportSelected] = useState<any>({})

  const reportDateText = useMemo(() => {
    return moment(reportDate).format('DD/MM/YYYY')
  }, [reportDate])

  const timestamp = useMemo(() => {
    const parts = reportDateText.split('/')
    const dateObject = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
    return dateObject.getTime()
  }, [reportDateText])

  const isOnlyOneReportItem = useMemo(() => {
    return reportList.length === 1
  }, [reportList.length])

  const deleteReportListWithIndex = (index: number) => {
    const newReportList = [...reportList]
    newReportList.splice(index, 1)
    setReportList(newReportList)
  }

  const onDeleteForm = (payload: { report: any; index: number }) => {
    if (typeof payload.report.id === 'string') {
      deleteReportListWithIndex(payload.index)
    } else {
      setOpenModalConfirmDelete(true)
      setReportSelected(payload.report)
    }
  }

  const addWorkingHours = () => {
    setReportList([
      ...reportList,
      {
        id: randomId,
        workType: {
          id: '',
        },
        workingHours: '',
        workingDescription: '',
        improvement: '',
        suggestionForImprovement: '',
        project: {
          id: '',
        },
        otFrom: '',
        otTo: '',
        otHours: '',
        reason: '',
        isProjectOtRequest: false,
        useReportOT: false,
        mode: 'add',
        isWorking: true,
      },
    ])
  }

  const addOTReport = () => {
    setReportList([
      ...reportList,
      {
        id: randomId,
        project: {
          id: '',
        },
        otFrom: '',
        otTo: '',
        otHours: '',
        reason: '',
        isWorking: false,
        otRequest: {
          id: '',
        },
        mode: 'add',
        confirmer: {
          name: '',
        },
        approver: {
          name: '',
        },
      },
    ])
  }

  const onDeleteFormItemApi = () => {
    const indexById = reportList.findIndex(
      (report: any) => report.id === reportSelected.id
    )
    dispatch(updateLoading(true))
    if (reportSelected.isWorking) {
      const payload = {
        dailyReportId,
        workingId: reportSelected.id,
      }
      dailyReportService
        .deleteWorkingHours(payload)
        .then(() => {
          dispatch(
            setCountReCallApiDailyReports(countReCallApiDailyReports + 1)
          )
          dispatch(
            alertSuccess({
              message: i18DailyReport('MSG_DELETE_WORKING_SUCCESS'),
            })
          )
          if (isOnlyOneReportItem) {
            onClose()
          } else {
            deleteReportListWithIndex(indexById)
          }
          setOpenModalConfirmDelete(false)
        })
        .catch(() => {
          dispatch(commonErrorAlert())
        })
        .finally(() => {
          dispatch(updateLoading(false))
        })
    } else {
      dispatch(deleteReportOT({ id: reportSelected.id }))
        .unwrap()
        .then(() => {
          dispatch(
            setCountReCallApiDailyReports(countReCallApiDailyReports + 1)
          )
          dispatch(
            alertSuccess({
              message: i18DailyReport('MSG_DELETE_OT_REPORT_SUCCESS'),
            })
          )
          if (isOnlyOneReportItem) {
            onClose()
          } else {
            deleteReportListWithIndex(indexById)
          }
          setOpenModalConfirmDelete(false)
        })
        .finally(() => {
          dispatch(updateLoading(false))
        })
    }
  }

  const onCreateSuccess = (index: number, newDailyReport: any) => {
    const newReportList = [...reportList]
    newReportList[index] = {
      ...newDailyReport,
      mode: 'detail',
    }
    setReportList(newReportList)
  }

  const fillReportListViewAll = (reportsParam: IReport[]) => {
    const dataFormDaily = reportsParam.find((report: IReport) => {
      return (
        moment(new Date(report.reportDate)).format('DD/MM/YYYY') ===
        moment(new Date(reportDate || 0)).format('DD/MM/YYYY')
      )
    })
    dispatch(setDailyReportId(dataFormDaily?.dailyReportId || 0))
    const listDailyReport = dataFormDaily?.dailyReportDetails || []
    const listOtReport = dataFormDaily?.otReportDetails || []
    const allForm = [
      ...listOtReport,
      ...listDailyReport.map((item: any) => ({ ...item, isWorking: true })),
    ].map(item => ({
      ...item,
      mode: 'detail',
    }))
    setReportList(allForm)
  }

  useEffect(() => {
    const newReportList = reportListDetail.map((item: any) => ({
      ...item,
      mode: 'detail',
    }))
    setReportList(newReportList)
    return () => {
      dispatch(setIsViewAllDailyReport(false))
      dispatch(setReportListDetail([]))
    }
  }, [])

  useEffect(() => {
    if (isViewAllDailyReport) {
      fillReportListViewAll(reports)
    }
  }, [reportDate])

  useEffect(() => {
    dispatch(updateLoading(true))
    Promise.all([
      dispatch(
        getListProjectReportOT({
          reportDate,
        })
      ),
      dispatch(getProjectStaffs(timestamp)),
    ]).finally(() => {
      dispatch(updateLoading(false))
    })
  }, [timestamp])

  return (
    <Fragment>
      {openModalConfirmDelete && (
        <Modal
          open
          colorModal="error"
          title={i18DailyReport('TXT_CONFIRMATION') as string}
          colorButtonSubmit="error"
          labelSubmit={i18('LB_DELETE') as string}
          onClose={() => setOpenModalConfirmDelete(false)}
          onSubmit={onDeleteFormItemApi}
        >
          <Box>{i18DailyReport('MSG_DELETE_REPORT')}</Box>
        </Modal>
      )}
      <Modal
        open
        hideFooter
        width={700}
        className={classes.modal}
        title={i18DailyReport('TXT_DAILY_REPORT')}
        labelSubmit={i18('LB_UPDATE') as string}
        onClose={onClose}
      >
        <Box className={classes.body}>
          <Box className={clsx(classes.option, 'report-date')}>
            <Box className={classes.label}>
              {i18DailyReport('LB_REPORT_DATE')}
            </Box>
            <Box className={classes.value}>{reportDateText}</Box>
          </Box>
          <Box className={classes.reportList}>
            {reportList.map((report: any, index: number) =>
              report.isWorking ? (
                <FormWorkingHoursItem
                  currentReportList={reportList}
                  setCurrentReportList={setReportList}
                  key={report.id}
                  isViewOnly={isViewOnly}
                  index={index}
                  report={report}
                  onDeleteForm={onDeleteForm}
                  reportDate={timestamp}
                  onCreateSuccess={onCreateSuccess}
                />
              ) : (
                <FormOTHoursItem
                  key={report.id}
                  isViewOnly={isViewOnly}
                  report={report}
                  index={index}
                  onDeleteForm={onDeleteForm}
                  onCreateSuccess={onCreateSuccess}
                />
              )
            )}
          </Box>
          {isViewAllDailyReport && !isViewOnly && (
            <Box className={classes.footerActions}>
              <ButtonAddPlus
                label={i18DailyReport('TXT_ADD_PROJECT_WORKING_HOURS')}
                onClick={addWorkingHours}
              />
              <ButtonAddPlus
                label={i18DailyReport('TXT_ADD_OT_REPORT')}
                onClick={addOTReport}
              />
            </Box>
          )}
        </Box>
      </Modal>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  modal: {
    '& .modal-content': {
      overflowX: 'hidden',
    },
  },
  body: {
    '& .report-date': {
      marginBottom: theme.spacing(2),
    },
  },
  option: {
    width: 'max-content',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
  },
  reportList: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(3, 0, 3, 0),
    gap: theme.spacing(3),
  },
  footerActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}))

export default ModalDetailDailyReport
