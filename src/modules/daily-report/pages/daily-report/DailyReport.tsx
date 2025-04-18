import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import ListStaffSideBar from '@/modules/daily-report/components/ListStaffSideBar'
import ModalRequestOT from '@/modules/project/components/ModalRequestOT'
import { selectAuth } from '@/reducer/auth'
import { getProjectManagerStaffs } from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Calendar from '../../components/calendar/Calendar'
import ToolbarCalendar from '../../components/calendar/ToolbarCalendar'
import { IDay, useDate } from '../../hooks/useDate'
import {
  dailyReportSelector,
  getDailyReports,
  setIsOpenModalDetailDailyReport,
  setReportDate,
} from '../../reducer/dailyReport'
import { IReport } from '../../types'
import ModalAddDailyReport from './ModalAddDailyReport'
import ModalDetailDailyReport from './ModalDetailDailyReport'

const DailyReport = () => {
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()

  const { reports, isOpenModalDetailDailyReport, countReCallApiDailyReports } =
    useSelector(dailyReportSelector)
  const { staff } = useSelector(selectAuth)

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [staffSelected, setStaff] = useState<OptionItem | undefined | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const { days } = useDate(reports, month, year)
  const [listStaffs, setListStaffs] = useState<OptionItem[]>([])
  const [pageNumStaff, setPageNumStaff] = useState<number>(PAGE_CURRENT_DEFAULT)
  const [loadingStaffList, setLoadingStaffList] = useState(false)
  const [loadingScroll, setLoadingScroll] = useState(false)
  const { permissions, role } = useSelector(selectAuth)
  const [requestOTId, setRequestOTId] = useState<string | null>(null)
  const [valueSearch, setValueSearch] = useState('')
  const [isShowRequestOTFromGmailLink, setIsShowRequestOTFromGmailLink] =
    useState<boolean>(false)
  const [isOpenModalAddDailyReport, setIsOpenModalAddDailyReport] =
    useState(false)
  const [isAddDailyReport, setIsAddDailyReport] = useState(true)

  const isAdmin = useMemo(() => {
    return role.some((item: any) => item?.name === 'Admin')
  }, [role])

  const isViewOnly = useMemo(
    () => Boolean(staffSelected?.id) && staffSelected?.id != staff?.id,
    [staffSelected, staff]
  )

  const isUserManager = useMemo(
    () => permissions.useDailyReportProjectManagerGeneral,
    [permissions]
  )
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const requestOTId = queryParams.get('requestOtId')
    if (requestOTId) {
      setRequestOTId(requestOTId)
      setIsShowRequestOTFromGmailLink(true)
    }
  }, [])

  const onClickNewDailyReport = () => {
    setIsOpenModalAddDailyReport(true)
    setIsAddDailyReport(true)
  }

  const onClickNewOTReport = () => {
    setIsOpenModalAddDailyReport(true)
    setIsAddDailyReport(false)
  }

  const onCloseModalAddDailyReport = () => {
    dispatch(setReportDate(0))
    setIsOpenModalAddDailyReport(false)
  }

  const getReportFromApi = () => {
    setTimeout(() => {
      dispatch(updateLoading(true))
    })
    dispatch(
      getDailyReports({
        month: month,
        year: year,
        staffId: staffSelected?.id
          ? staffSelected?.id || null
          : staff?.id || null,
      })
    )
      .unwrap()
      .finally(() => dispatch(updateLoading(false)))
  }

  const getStaffFromManager = () => {
    setTimeout(() => {
      setLoadingStaffList(true)
    })
    dispatch(
      getProjectManagerStaffs({
        staffId: staff?.id || '',
        sortBy: 'code',
        orderBy: 'asc',
        pageNum: pageNumStaff,
        pageSize: LIMIT_DEFAULT_SELECT,
        keyword: valueSearch,
      })
    )
      .unwrap()
      .then((response: any) => {
        let _listStaffs = response?.data?.content?.map((staff: any) => ({
          ...staff,
          value: staff.id,
          label: staff.name,
          description: staff?.email,
        }))
        setListStaffs(_listStaffs)
        setLoadingStaffList(false)
      })
      .finally(() => {
        setLoadingStaffList(false)
      })
  }

  const handleChange = async (params: any) => {
    setPageNumStaff(params.page)
    setValueSearch(params.keyword)
    if (params.page !== pageNumStaff) {
      setLoadingScroll(true)
    } else {
      setTimeout(() => {
        setLoadingStaffList(true)
      })
    }
    await dispatch(
      getProjectManagerStaffs({
        staffId: staff?.id || '',
        sortBy: 'code',
        orderBy: 'asc',
        pageNum: params.keyword ? pageNumStaff : params.page,
        pageSize: LIMIT_DEFAULT_SELECT,
        keyword: params.keyword,
      })
    )
      .unwrap()
      .then((response: any) => {
        let _listStaffs = response?.data?.content?.map((staff: any) => ({
          ...staff,
          value: staff.id,
          label: staff.name,
          description: staff?.email,
        }))
        if (!params.keyword) setListStaffs(listStaffs.concat(_listStaffs))
        else setListStaffs(_listStaffs)
        setLoadingScroll(false)
        setLoadingStaffList(false)
      })
      .finally(() => {
        setLoadingScroll(false)
        setLoadingStaffList(false)
      })
  }

  const setMonthYear = ({ month, year }: { month: number; year: number }) => {
    setMonth(month)
    setYear(year)
  }

  const openModalAddDailyReport = (dayDetail: IDay) => {
    const dailyReportDate = dayDetail.event?.reportDate
    if (dailyReportDate) {
      const _report = reports.find((report: IReport) =>
        moment(report.reportDate).isSame(dailyReportDate, 'day')
      )
      if (!_report) return
    }
    dispatch(setReportDate(new Date(dayDetail.date).getTime()))
    setIsOpenModalAddDailyReport(true)
    setIsAddDailyReport(true)
  }

  const onCloseModalDetail = () => {
    dispatch(setIsOpenModalDetailDailyReport(false))
    dispatch(setReportDate(0))
  }

  useEffect(() => {
    if (countReCallApiDailyReports) {
      getReportFromApi()
    }
  }, [countReCallApiDailyReports])

  useEffect(() => {
    setTimeout(() => {
      setLoading(true)
    })
    dispatch(
      getDailyReports({
        month: month,
        year: year,
        staffId: staffSelected?.id
          ? staffSelected?.id || null
          : staff?.id || null,
      })
    )
      .unwrap()
      .finally(() => setLoading(false))
  }, [month, year, staffSelected, staff])

  useEffect(() => {
    if (isUserManager) {
      getStaffFromManager()
    }
  }, [staff])

  useEffect(() => {
    const pages = document.querySelector('.pages') as HTMLElement
    if (pages) {
      pages.style.overflow = 'hidden'
    }
    return () => {
      pages.style.overflow = 'scroll'
    }
  }, [])

  return (
    <Box className={clsx(classes.rootDailyReport, 'scrollbar')}>
      {isOpenModalAddDailyReport && (
        <ModalAddDailyReport
          calendarMonth={month}
          calendarYear={year}
          isAddDailyReport={isAddDailyReport}
          onClose={onCloseModalAddDailyReport}
          getReportFromApi={() => getReportFromApi()}
        />
      )}
      {isOpenModalDetailDailyReport && (
        <ModalDetailDailyReport
          calendarMonth={month}
          calendarYear={year}
          isViewOnly={isViewOnly}
          onClose={onCloseModalDetail}
        />
      )}
      <Box
        className={clsx(classes.wrapDailyReport, !staff && classes.fullHeight)}
      >
        <Box className={classes.dailyReport}>
          <ToolbarCalendar
            loading={loading}
            month={month}
            year={year}
            isAdmin={isAdmin}
            isViewOnlyAndConfirm={isViewOnly}
            onNewDailyReport={onClickNewDailyReport}
            onNewOTReport={onClickNewOTReport}
            staff={staffSelected || staff}
            isUserManager={isUserManager}
            setStaff={setStaff}
            setMonthYear={setMonthYear}
          />

          <Calendar
            days={days}
            loading={loading}
            isManagerPreviewStaff={isViewOnly}
            onOpenModalAddDailyReport={openModalAddDailyReport}
          />
        </Box>
      </Box>
      {isUserManager && (
        <ListStaffSideBar
          onSelectStaff={staff => {
            setStaff(staff)
          }}
          loading={loadingStaffList}
          listStaffs={listStaffs}
          staffSelected={staffSelected}
          loadingDailyReport={loading}
          params={{ page: pageNumStaff, keyword: valueSearch }}
          onChange={handleChange}
          loadingScroll={loadingScroll}
        />
      )}
      {requestOTId && isShowRequestOTFromGmailLink && (
        <ModalRequestOT
          open
          onCloseModal={() => setIsShowRequestOTFromGmailLink(false)}
          disabled={false}
          requestOTId={requestOTId}
        />
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootDailyReport: {
    display: 'flex',
    overflow: 'auto',
    height: '100%',
    position: 'relative',
  },
  wrapDailyReport: {
    padding: theme.spacing(3),
    flex: 1,
  },
  fullHeight: {
    height: '100% !important',
  },
  dailyReport: {
    paddingBottom: '24px',
  },
}))
export default DailyReport
