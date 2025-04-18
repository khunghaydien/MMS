import { LangConstant } from '@/const'
import { selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { WarningAmber } from '@mui/icons-material'
import { Box, Theme, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import moment from 'moment'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  STATUS_OT_REPORT_LABELS,
  STATUS_OT_REPORT_VALUES,
  WORK_TYPE_VALUE,
} from '../../const'
import { IDay } from '../../hooks/useDate'
import {
  dailyReportSelector,
  setDailyReportId,
  setIsOpenModalDetailDailyReport,
  setIsViewAllDailyReport,
  setReportDate,
  setReportListDetail,
} from '../../reducer/dailyReport'
import { IReport } from '../../types'

const STATUS_LABELS: any = {
  0: 'Report',
  2: 'No Report',
  3: 'Holiday Break',
  5: 'No Daily Report',
}

const STATUS_VALUES = {
  REPORT: 0,
  NO_REPORT: 2,
  HOLIDAY_BREAK: 3,
  NO_DAILY_REPORT: 5,
}

interface DailyReportDateCellProps {
  day: IDay
  isManagerPreviewStaff: boolean
  onOpenModalAddDailyReport: (day: IDay) => void
}

const DailyReportDateCell = ({
  day,
  isManagerPreviewStaff,
  onOpenModalAddDailyReport,
}: DailyReportDateCellProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const { reports } = useSelector(dailyReportSelector)
  const { role } = useSelector(selectAuth)

  const stylesClassName = `day ${day.isDisabled ? 'oldAndFutureDates' : ''} ${
    day.isCurrentDay ? 'currentDay' : ''
  } ${day.isWeekendDay ? 'weekend' : ''}`

  const isAdmin = useMemo(() => {
    return role.some((item: any) => item?.name === 'Admin')
  }, [role])

  const dataFormDaily = useMemo(() => {
    return reports.find((report: IReport) => {
      return (
        moment(new Date(report.reportDate)).format('DD/MM/YYYY') ===
        moment(new Date(day.date)).format('DD/MM/YYYY')
      )
    })
  }, [reports])

  const statusValue = dataFormDaily?.status?.id
  const useShowStatus =
    statusValue === STATUS_VALUES.NO_REPORT ||
    statusValue === STATUS_VALUES.NO_DAILY_REPORT ||
    statusValue === STATUS_VALUES.HOLIDAY_BREAK

  const isNoReport =
    !dataFormDaily?.dailyReportDetails?.length &&
    !dataFormDaily?.otReportDetails?.length

  const listDailyReport = dataFormDaily?.dailyReportDetails || []
  const listOtReport = dataFormDaily?.otReportDetails || []

  const allForm = [
    ...listOtReport,
    ...listDailyReport.map(item => ({ ...item, isWorking: true })),
  ]

  const listReportRender = useMemo(() => {
    return allForm.map(item => ({
      currentForm: {
        ...item,
      },
      id: item.id,
      isWorking: !!item.isWorking,
      name: item.project?.name || item.workType?.name,
      hours: item.workingHours || item.otHours,
      workType: item.workType?.id || '',
    }))
  }, [allForm])

  const totalHours = useMemo(() => {
    let total = 0
    listReportRender.forEach((item: any) => {
      if (item.isWorking) {
        total += +item.hours
      }
    })
    return total || 0
  }, [listReportRender])

  const disabled = useMemo(() => {
    if (isManagerPreviewStaff) {
      return isNoReport
    }
    return isAdmin
  }, [isManagerPreviewStaff, isAdmin])

  const moreReports = listReportRender.length - 3

  const idle = 8 - totalHours > 0 ? 8 - totalHours : 0

  const onCellClick = () => {
    if (disabled) return
    if (isNoReport) {
      onOpenModalAddDailyReport(day)
    } else {
      dispatch(setIsViewAllDailyReport(true))
      dispatch(setReportListDetail(allForm))
      dispatch(setIsOpenModalDetailDailyReport(true))
      const reportDate = dataFormDaily?.reportDate as any
      dispatch(setReportDate(reportDate.getTime() || 0))
      dispatch(setDailyReportId(dataFormDaily?.dailyReportId))
    }
  }

  const getReportNameClassName = (item: any) => {
    if (+item.workType === +WORK_TYPE_VALUE.PROJECT_REPORT) {
      return 'projectReport'
    }
    if (+item.workType === +WORK_TYPE_VALUE.GENERAL_REPORT) {
      return 'generalWork'
    }
    if (+item.workType === +WORK_TYPE_VALUE.TASK_REPORT) {
      return 'taskReport'
    }
    if (+item.workType === +WORK_TYPE_VALUE.DAY_OFF_HALF_DAY) {
      return 'offHalfDay'
    }
    if (+item.workType === +WORK_TYPE_VALUE.DAY_OFF_FULL_DAY) {
      return 'offFullDay'
    }
    return ''
  }

  const getOTIconClassName = (status: number) => {
    let color = ''
    switch (status) {
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
    return color
  }

  const onClickReportItem = (e: any, reportItem: any) => {
    e.stopPropagation()
    dispatch(setIsViewAllDailyReport(false))
    dispatch(setReportListDetail([reportItem.currentForm]))
    dispatch(setIsOpenModalDetailDailyReport(true))
    const reportDate = dataFormDaily?.reportDate as any
    dispatch(setReportDate(reportDate.getTime() || 0))
    dispatch(setDailyReportId(dataFormDaily?.dailyReportId))
  }

  const TooltipIconOTReport = ({ status }: { status: number }) => {
    return (
      <Tooltip
        title={
          <Box>
            <Box>{i18DailyReport('TXT_OT_REPORT')}</Box>
            <Box
              className={clsx(
                classes.tooltipStatus,
                getOTIconClassName(status)
              )}
            >
              {STATUS_OT_REPORT_LABELS[status]}
            </Box>
          </Box>
        }
      >
        <Box className={clsx(classes.otIcon, getOTIconClassName(status))}>
          OT
        </Box>
      </Tooltip>
    )
  }

  return (
    <Box
      className={clsx(
        classes.RootDailyReportDateCell,
        stylesClassName,
        disabled && 'disabled'
      )}
      onClick={onCellClick}
    >
      <Box>{day.value}</Box>
      {useShowStatus && (
        <Box
          className={clsx(
            classes.status,
            statusValue === STATUS_VALUES.HOLIDAY_BREAK && 'holiday'
          )}
        >
          {STATUS_LABELS[statusValue]}
        </Box>
      )}
      {idle > 0 && idle !== 8 && (
        <Box className={classes.boxIdle}>
          <WarningAmber />
          Idle: {idle?.toString()?.length > 3 ? idle?.toFixed(2) : idle}h
        </Box>
      )}
      {moreReports > 0 && (
        <Box className={classes.boxMoreReports}>And {moreReports} more...</Box>
      )}
      {!isNoReport && (
        <Box className={classes.listReport}>
          {listReportRender.slice(0, 3).map(item => (
            <Box
              key={item.id}
              className={clsx(
                classes.RootReportItem,
                getReportNameClassName(item)
              )}
              onClick={e => onClickReportItem(e, item)}
            >
              <Box className={classes.reportName}>
                <Box component="span" title={item.name}>
                  {item.name}
                </Box>
                {!!item.hours && <Box>:</Box>}
              </Box>
              {!!item.hours && (
                <Box className={classes.hours}>{item.hours}h</Box>
              )}
              {!item.workType && (
                <TooltipIconOTReport status={item.currentForm.status} />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootDailyReportDateCell: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    width: '100%',
    height: '100%',
    padding: theme.spacing(0.5, 1),
    color: theme.color.black.primary,
    cursor: 'pointer',
    '&.disabled': {
      cursor: 'default',
      pointerEvents: 'none',
    },
    '&.oldAndFutureDates': {
      color: '#B9B9C3',
      backgroundColor: theme.color.grey.grayE,
      cursor: 'default',
      pointerEvents: 'none',
    },
    '&.weekend': {
      color: theme.color.error.secondary,
    },
    '&.currentDay': {
      backgroundColor: '#8ec3f336',
    },
    '&:hover': {
      background: theme.color.blue.small,
    },
    '&.cursorPointer': {
      cursor: 'pointer !important',
    },
  },
  listReport: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(0.5),
    gap: theme.spacing(0.5),
  },
  RootReportItem: {
    height: theme.spacing(4),
    padding: theme.spacing(1, 1, 1, 1.5),
    position: 'relative',
    borderLeft: `4px solid ${theme.color.error.secondary}`,
    background: '#FBD9D3',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '&.projectReport': {
      borderColor: theme.color.blue.primary,
      background: '#C3DAFF',
    },
    '&.taskReport': {
      borderColor: '#9747FF',
      background: '#EADAFF',
    },
    '&.generalWork': {
      borderColor: theme.color.green.primary,
      background: '#D6EEDD',
    },
    '&.offHalfDay': {
      borderColor: theme.color.orange.primary,
      background: '#FFD8BC',
      '&:hover': {},
    },
    '&.offFullDay': {
      '&:hover': {},
    },
  },
  reportName: {
    display: 'flex',
    '& span': {
      display: 'inline-block',
      maxWidth: '105px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: 13,
    },
    color: theme.color.black.primary,
  },
  hours: {
    color: theme.color.black.primary,
  },
  otIcon: {
    position: 'absolute',
    right: '3px',
    top: '4.5px',
    borderRadius: '50%',
    padding: theme.spacing(0.6),
    fontSize: 10,
    color: theme.color.white,
    '&.orange': {
      background: theme.color.orange.primary,
    },
    '&.blue': {
      background: theme.color.blue.primary,
    },
    '&.red': {
      background: theme.color.error.primary,
    },
    '&.green': {
      background: theme.color.green.primary,
    },
  },
  boxIdle: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(0.2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.color.error.primary,
    fontSize: 12,
    '& svg': {
      fontSize: 20,
    },
  },
  boxMoreReports: {
    position: 'absolute',
    right: theme.spacing(1),
    bottom: theme.spacing(0.2),
    color: theme.color.black.secondary,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
  },
  viewAllBox: {
    position: 'absolute',
    left: theme.spacing(1),
    bottom: theme.spacing(0.2),
  },
  status: {
    fontSize: 12,
    color: theme.color.error.primary,
    '&.holiday': {
      color: theme.color.green.primary,
    },
  },
  tooltipStatus: {
    '&.orange': {
      color: theme.color.orange.primary,
    },
    '&.blue': {
      color: theme.color.blue.primary,
    },
    '&.red': {
      color: theme.color.error.primary,
    },
    '&.green': {
      color: theme.color.green.primary,
    },
  },
}))

export default DailyReportDateCell
