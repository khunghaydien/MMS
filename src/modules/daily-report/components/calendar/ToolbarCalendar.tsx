import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import ButtonActions from '@/components/buttons/ButtonActions'
import BackIcon from '@/components/icons/BackIcon'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import { formatNumber } from '@/utils'
import { convertToMonthYear } from '@/utils/date'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { Box, Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { dailyReportSelector } from '../../reducer/dailyReport'

interface IProps {
  isAdmin: boolean
  isViewOnlyAndConfirm: boolean
  isUserManager: boolean
  onNewDailyReport: () => void
  onNewOTReport: () => void
  staff: OptionItem | undefined | null
  setStaff: Dispatch<SetStateAction<OptionItem | null | undefined>>
  month: number
  year: number
  setMonthYear: (payload: { month: number; year: number }) => void
  loading: boolean
}

export const LIST_ACTIONS_KEY = {
  DAILY_REPORT: 1,
  OT_REPORT: 2,
}

const ToolbarCalendar = ({
  isAdmin,
  isViewOnlyAndConfirm,
  onNewDailyReport,
  staff,
  isUserManager,
  setStaff,
  setMonthYear,
  month,
  year,
  onNewOTReport,
  loading,
}: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { responseReport } = useSelector(dailyReportSelector)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [dateNav, setDateNav] = useState<Date | null>(new Date())

  const listActions = useMemo(() => {
    return [
      {
        id: 1,
        label: i18DailyReport('TXT_DAILY_REPORT'),
        value: LIST_ACTIONS_KEY.DAILY_REPORT,
      },
      {
        id: 2,
        label: i18DailyReport('TXT_OT_REPORT'),
        value: LIST_ACTIONS_KEY.OT_REPORT,
      },
    ]
  }, [])

  const reportStatistics = useMemo(() => {
    return [
      {
        label: `${i18DailyReport('TXT_TOTAL_WORKING_HOURS')}`,
        count: `${formatNumber(
          responseReport?.totalWorkingHours || 0
        )} ${i18DailyReport(
          Number(responseReport?.totalWorkingHours || 0) > 1
            ? 'TXT_HOURS'
            : 'TXT_HOUR'
        )}`,
        className: 'success',
      },
      {
        label: `${i18DailyReport('TXT_DAY_OFF')}`,
        count: `${formatNumber(responseReport?.dayOff || 0)} ${i18DailyReport(
          Number(responseReport?.dayOff || 0) > 1 ? 'TXT_DAYS' : 'TXT_DAY'
        )}`,
        className: 'day-off',
      },
      {
        label: `${i18DailyReport('TXT_NO_REPORT')}`,
        count: `${formatNumber(responseReport?.noReport || 0)} ${i18DailyReport(
          Number(responseReport?.noReport || 0) > 1 ? 'TXT_DAYS' : 'TXT_DAY'
        )}`,
        className: 'error',
      },
      {
        label: `${i18DailyReport('TXT_TOTAL_OT_HOURS')}`,
        count: `${formatNumber(
          responseReport?.totalOtHours || 0
        )} ${i18DailyReport(
          Number(responseReport?.totalOtHours || 0) > 1
            ? 'TXT_HOURS'
            : 'TXT_HOUR'
        )}`,
        className: 'ot-hours',
      },
    ]
  }, [responseReport])

  const handleNextNav = () => {
    const _dateNav = moment(dateNav).add(1, 'months').toDate()
    setDateNav(_dateNav)
    setMonthYear({
      month: month === 12 ? 1 : month + 1,
      year: month === 12 ? year + 1 : year,
    })
  }

  const handlePrevNav = () => {
    const _dateNav = moment(dateNav).subtract(1, 'months').toDate()
    setDateNav(_dateNav)
    setMonthYear({
      month: month === 1 ? 12 : month - 1,
      year: month === 1 ? year - 1 : year,
    })
  }

  const handleChangeDateNav = (date: Date | null) => {
    setDateNav(date)
    setMonthYear({
      month: (date?.getMonth() as number) + 1,
      year: date?.getFullYear() as number,
    })
  }

  const handleOpenCalendar = () => {
    setOpenCalendar((prev: boolean) => !prev)
  }

  const onBackYourSelf = () => {
    setStaff(null)
  }

  const onChooseAction = (option: OptionItem) => {
    if (option.value === LIST_ACTIONS_KEY.DAILY_REPORT) {
      onNewDailyReport()
    }
    if (option.value === LIST_ACTIONS_KEY.OT_REPORT) {
      onNewOTReport()
    }
  }

  return (
    <Box className={classes.rootCalendarToolbar}>
      <Box className="row row-wrapper">
        <Box className="row row-title">
          <Button className="btn" disabled={false} onClick={handlePrevNav}>
            <ArrowBackIosNew />
          </Button>
          <Box className="title step-calendar">
            <span onClick={handleOpenCalendar}>
              {convertToMonthYear(month, year)}
            </span>
            <InputDatepicker
              readOnly
              className={classes.rootInputDatepicker}
              defaultOpen={openCalendar}
              useLabel={true}
              label={''}
              isShowClearIcon={false}
              value={dateNav}
              onChange={handleChangeDateNav}
              views={['year', 'month']}
              openTo="month"
              inputFormat={'YYYY-MM'}
              minDate={new Date('1-1-2016')}
              onClose={() => setOpenCalendar(false)}
            />
          </Box>
          <Button className="btn" onClick={handleNextNav}>
            <ArrowForwardIos />
          </Button>
        </Box>
        {!isViewOnlyAndConfirm && !isAdmin && (
          <ButtonActions
            label={i18DailyReport('TXT_NEW_REPORT') as string}
            listOptions={listActions}
            onChooseOption={onChooseAction}
          />
        )}
        {isViewOnlyAndConfirm && (
          <Box className={classes.buttonBackYourSelf}>
            <BackIcon
              onClick={onBackYourSelf}
              label={i18DailyReport('LB_BACK_TO_DAILY_REPORT')}
              color={'#205DCE'}
            />
          </Box>
        )}
      </Box>

      {!!staff && isUserManager && (
        <Box>
          <Box className={classes.staffName}>
            <Box className={classes.label}>{i18('LB_STAFF_NAME')}</Box>
            <Box component="span">{staff?.name || ''}</Box>
          </Box>
          <Box className={classes.staffName}>
            <Box className={classes.label}>{i18('LB_EMAIL')}</Box>
            <Box component="span">{staff?.email || ''}</Box>
          </Box>
        </Box>
      )}

      {loading ? (
        <Box className={classes.boxLoadingTotals}>
          <LoadingSkeleton />
        </Box>
      ) : (
        <Box className={classes.totalList}>
          {reportStatistics.map((item, index) => (
            <Box className={classes.optionTotal} key={index}>
              <Box className={classes.labelTotal}>{item.label}:</Box>
              <Box className={classes.valueTotal}>{item.count}</Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootCalendarToolbar: {
    marginBottom: theme.spacing(3),
    '& .step-calendar': {
      cursor: 'pointer',
      height: theme.spacing(3),
    },

    '& .row': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      justifyContent: 'flex-end',
      flex: 1,
      '&.row-title': {
        justifyContent: 'center',
      },

      '&.row-wrapper': {
        position: 'relative',
      },
    },

    '& .head-title': {
      fontSize: 20,
      fontWeight: 700,
    },

    '& .title': {
      fontSize: 16,
      fontWeight: 700,
      color: theme.color.black.primary,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
    },

    '& .btn': {
      color: theme.color.black.primary,
      borderRadius: '50%',
      width: theme.spacing(5),
      minWidth: theme.spacing(5),
      height: theme.spacing(5),

      '&.disabled': {
        color: theme.color.grey.secondary,
      },

      '& > svg': {
        fontSize: 16,
      },
    },

    '& .row-report': {
      justifyContent: 'start',
      gap: theme.spacing(4),
      paddingTop: theme.spacing(4),
      fontSize: 18,
      lineHeight: 1,
    },

    '& .report-content': {
      fontWeight: 400,
      display: 'flex',
      padding: theme.spacing(1.5, 1),
      flexDirection: 'column',
      gap: '10px',
      fontSize: '16px',
      minWidth: '190px',
      boxShadow: '0 1px 4px rgb(0 0 0 / 20%)',
      borderRadius: '4px',
      '& .text': {
        color: theme.color.black.primary,
        fontSize: 15,
      },
      '& .report-count': {
        fontSize: 14,
        textTransform: 'lowercase',
      },
      '&.success': {
        background: theme.color.green.primary,
      },

      '&.day-off': {
        color: '#964109',
        background: theme.color.orange.primary,
      },

      '&.error': {
        color: '#fff',
        background: theme.color.error.primary,
        '& .text': {
          color: '#fff',
        },
      },

      '&.ot-hours': {
        color: '#65186a',
        background: '#d330d538',
      },
    },

    '& .report-count': {
      fontWeight: 700,
    },
  },
  rootInputDatepicker: {
    visibility: 'hidden',
    width: 0,
  },
  staffName: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontWeight: 700,
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
    fontWeight: 400,
    width: '120px',
  },
  buttonBackYourSelf: {
    color: theme.color.blue.primary,
    fontStyle: 'italic',
  },
  totalList: {
    display: 'flex',
    margin: theme.spacing(3, 0),
    // justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(5),
  },
  optionTotal: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  labelTotal: {
    fontSize: 14,
    color: theme.color.black.secondary,
    fontWeight: 400,
  },
  valueTotal: {
    fontWeight: 700,
    // color: theme.color.blue.primary,
    textTransform: 'lowercase',
  },
  boxLoadingTotals: {
    margin: theme.spacing(1.5, 0),
    '& .root-loading-skeleton': {
      height: '115px',
    },
  },
}))

export default ToolbarCalendar
