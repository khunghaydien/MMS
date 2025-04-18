import ModalConfirm from '@/components/modal/ModalConfirm'
import { PathConstant } from '@/const'
import { NOTIFICATIONS_TYPE } from '@/const/app.const'
import { MBO_EVALUATION_PROCESS_DETAIL_FORMAT } from '@/const/path.const'
import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { useClickOutside2 } from '@/hooks'
import { setOpenConfirmDaily } from '@/modules/daily-report/reducer/dailyReport'
import { APPRAISEE_LIST } from '@/modules/mbo/const'
import ModalRequestOT from '@/modules/project/components/ModalRequestOT'
import { AuthState, selectAuth } from '@/reducer/auth'
import {
  commonSelector,
  CommonState,
  getNotificationsForUser,
  getNumberOfNotification,
  readNotify,
  setItemNotify,
  setNotificationsForUser,
  setReCallNotify,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { IQueries } from '@/types'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Box, Paper, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { cloneDeep, isEmpty } from 'lodash'
import QueryString from 'query-string'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import String2Color from 'string-to-color'
import NoData from '../common/NoData'
import LoadingSkeleton from '../loading/LoadingSkeleton'
import {
  onMessageListener,
  requestPermission,
} from './FirebaseConfigNotifications'
import NotificationItem from './NotificationItem'

export interface INotificationsForUser {
  id: string | number
  createAt: string
  createdBy: string
  isReading: boolean
  sourceType: string
  sourceValue: any
  sourceValueId: string | number
  type: number
}

const initQueries = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: LIMIT_DEFAULT_SELECT,
}

const Notifications = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { staff }: AuthState = useSelector(selectAuth)
  const {
    notificationsForUser,
    numberOfNotification,
    reCallNotify,
  }: CommonState = useSelector(commonSelector)

  const classes = useStyles({ color: String2Color(staff?.name) })
  const wrapperRef = useRef<any>()
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const [hideNotify, setHideNotify] = useState(true)
  const [queries, setQueries] = useState<IQueries>(initQueries)
  const [numberOfNotificationTemp, setNumberOfNotificationTemp] = useState(0)
  const [isModalRequestOT, setIsModalRequestOT] = useState<boolean>(false)
  const [requestOTId, setRequestOTId] = useState<any>(null)
  const [notificationsForUserTemp, setNotificationsForUserTemp] = useState<
    INotificationsForUser[]
  >([])
  const [countToggle, setCountToggle] = useState(0)

  useClickOutside2(wrapperRef, () => {
    if (countToggle) {
      setHideNotify(true)
    }
  })

  const parseStringOrJSON = (input: any) => {
    try {
      return JSON.parse(input)
    } catch (error) {
      return {
        project: { name: input },
      }
    }
  }

  const formatNotify = (notify: any): INotificationsForUser => {
    return {
      id: notify.id,
      createAt: notify.createAt,
      createdBy: notify.createdBy,
      isReading: notify.isReading,
      sourceType: notify.sourceType,
      sourceValue: parseStringOrJSON(notify.sourceValue),
      sourceValueId: notify.sourceValueId,
      type: notify.sourceType,
    }
  }
  const handleReadNotification = (value: any) => {
    if (!value.isReading) {
      setLoading(true)
      dispatch(readNotify(value.id))
        .unwrap()
        .then(() => {
          const indexNotificationsForUserTemp =
            notificationsForUserTemp.findIndex(item => item.id === value.id)
          if (indexNotificationsForUserTemp > -1) {
            let _notificationsForUserTemp = cloneDeep(notificationsForUserTemp)
            _notificationsForUserTemp[indexNotificationsForUserTemp].isReading =
              true
            setNotificationsForUserTemp(_notificationsForUserTemp)
          } else {
            const indexNotificationsForUser = notificationsForUser.findIndex(
              item => item.id === value.id
            )
            if (indexNotificationsForUser > -1) {
              let _notificationsForUser = cloneDeep(notificationsForUser)
              _notificationsForUser[indexNotificationsForUser].isReading = true
              dispatch(setNotificationsForUser(_notificationsForUser))
            }
          }
          dispatch(getNumberOfNotification({}))
            .unwrap()
            .then(res => {
              setNumberOfNotificationTemp(0)
            })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleSelectDailyReport = (value: any) => {
    navigate(PathConstant.DAILY_REPORT)
    dispatch(setOpenConfirmDaily(true))
    dispatch(setItemNotify(value.sourceValue.dailyReportApplication))
    handleReadNotification(value)
  }

  const handleSelectUpcommmingEvaluation = (value: any) => {
    const url = StringFormat(
      PathConstant.MBO_CYCLE_DETAIL_FORMAT,
      value.sourceValue.evaluationCycle.id
    )
    navigate(url)
    setHideNotify(true)
    handleReadNotification(value)
    window.location.reload()
  }

  const handleSelectAppraisee = (value: any) => {
    navigate({
      pathname: StringFormat(
        MBO_EVALUATION_PROCESS_DETAIL_FORMAT,
        value.sourceValue.evaluationCycle.id
      ),
      search: QueryString.stringify({
        evaluationCycleStaffId: value.sourceValue.evaluationCycleStaffId,
        tab: '2',
        history: APPRAISEE_LIST,
      }),
    })
    setHideNotify(true)
    handleReadNotification(value)
    window.location.reload()
  }
  const handleSelectProject = (value: any) => {
    const url = StringFormat(
      PathConstant.PROJECT_DETAIL_FORMAT,
      value.sourceValue?.project?.id
    )
    setHideNotify(true)
    handleReadNotification(value)
    navigate(url)
    window.location.reload()
  }
  const handleSelectProjectOTRequest = (value: any) => {
    setIsModalRequestOT(true)
    setRequestOTId(value.sourceValue?.requestOtId)
    setHideNotify(true)
    handleReadNotification(value)
  }
  const handleSelectReportOT = (value: any) => {
    const url = StringFormat(PathConstant.PROJECT_TIMESHEET_OT_MANAGEMENT)
    setHideNotify(true)
    handleReadNotification(value)
    navigate(url)
    window.location.reload()
  }
  const handleSelectStaff = (value: any) => {
    const url = StringFormat(PathConstant.STAFF_LIST)
    setHideNotify(true)
    handleReadNotification(value)
    navigate(url)
    window.location.reload()
  }

  const notificationMBO = [
    NOTIFICATIONS_TYPE.MMO.APPRAISER_1_ABOUT_APPRAISEE_COMPLETE_EVALUATION,
    NOTIFICATIONS_TYPE.MMO.APPRAISER_2_ABOUT_APPRAISER_1_COMPLETE_EVALUATION,
    NOTIFICATIONS_TYPE.MMO.REVIEWER_ABOUT_APPRAISER_2_COMPLETE_EVALUATION,
    NOTIFICATIONS_TYPE.MMO.REVIEWER_REJECT_SCORE,
    NOTIFICATIONS_TYPE.MMO.FINAL_SCORE,
  ]
  const notificationProjectOTRequest = [
    NOTIFICATIONS_TYPE.PROJECT.REQUEST_OT_CREATED,
    NOTIFICATIONS_TYPE.PROJECT.REQUEST_OT_APPROVED,
    NOTIFICATIONS_TYPE.PROJECT.REQUEST_OT_REJECTED,
  ]
  const notificationProject = [
    NOTIFICATIONS_TYPE.PROJECT.BITBUCKET_GENERATED.PROJECT_KEY,
    NOTIFICATIONS_TYPE.PROJECT.BITBUCKET_GENERATED.PROJECT_NAME,
    NOTIFICATIONS_TYPE.PROJECT.BITBUCKET_UNSUCCESSFULLY,
    NOTIFICATIONS_TYPE.PROJECT.JIRA_GENERATED.PROJECT_KEY,
    NOTIFICATIONS_TYPE.PROJECT.JIRA_GENERATED.PROJECT_NAME,
    NOTIFICATIONS_TYPE.PROJECT.JIRA_UNSUCCESSFULLY,
    NOTIFICATIONS_TYPE.PROJECT.GROUP_MAIL_GENERATED,
    NOTIFICATIONS_TYPE.PROJECT.GROUP_MAIL_UNSUCCESSFULLY,
    NOTIFICATIONS_TYPE.PROJECT.GROUP_MAIL_UPDATED,
    NOTIFICATIONS_TYPE.PROJECT.JIRA_UPDATED,
    NOTIFICATIONS_TYPE.PROJECT.BITBUCKET_UPDATED,
    NOTIFICATIONS_TYPE.PROJECT.GENERATING_PROJECT_TOOLS_COMPLETED,
    NOTIFICATIONS_TYPE.PROJECT.MEMBER.ADD_NEW,
    NOTIFICATIONS_TYPE.PROJECT.MEMBER.REMOVE,
    NOTIFICATIONS_TYPE.PROJECT.MEMBER.ADD_NEW_SALE,
    NOTIFICATIONS_TYPE.PROJECT.MANAGER.ADD_NEW,
    NOTIFICATIONS_TYPE.PROJECT.MANAGER.ADD_NEW_SUB,
    NOTIFICATIONS_TYPE.PROJECT.CHANGES_THE_START_AND_DATE,
    NOTIFICATIONS_TYPE.PROJECT.CHANGES_STATUS_CANCELLED,
    NOTIFICATIONS_TYPE.PROJECT.CHANGES_STATUS_COMPLETED,
    NOTIFICATIONS_TYPE.PROJECT.PROJECT_CREATE_1,
    NOTIFICATIONS_TYPE.PROJECT.PROJECT_CREATE_2,
    NOTIFICATIONS_TYPE.PROJECT.PROJECT_CREATE_3,
    NOTIFICATIONS_TYPE.PROJECT.PROJECT_CREATE_4,
  ]
  const notificationReport = [
    NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_CREATED,
    NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_APPROVED,
    NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_REJECTED_DD,
    NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_REJECTED_PM,
    NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_CONFIRMED,
    NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_EDITED,
  ]
  const notificationStaff = [NOTIFICATIONS_TYPE.STAFF.INACTIVE]
  const selectItem = (value: any) => {
    if (value.type === NOTIFICATIONS_TYPE.DAILY_REPORT)
      return handleSelectDailyReport(value)
    else if (value.type === NOTIFICATIONS_TYPE.MMO.UPCOMMING_EVALUATION_PERIOD)
      return handleSelectUpcommmingEvaluation(value)
    else if (notificationMBO.includes(value.type))
      return handleSelectAppraisee(value)
    else if (notificationProject.includes(value.type))
      return handleSelectProject(value)
    else if (notificationProjectOTRequest.includes(value.type))
      return handleSelectProjectOTRequest(value)
    else if (notificationReport.includes(value.type))
      return handleSelectReportOT(value)
    else if (notificationStaff.includes(value.type))
      return handleSelectStaff(value)
    else return handleReadNotification(value)
  }

  const handleScroll = (event: any) => {
    const listboxNode = event.currentTarget
    const position = listboxNode.scrollTop + listboxNode.clientHeight
    const _queries = { ...queries, pageNum: Number(queries.pageNum) + 1 }
    if (
      listboxNode.scrollHeight - position <= 1 &&
      !loading &&
      totalPage >= _queries.pageNum
    ) {
      setLoading(true)
      setQueries(_queries)
      dispatch(getNotificationsForUser(_queries))
        .unwrap()
        .then(res => {
          if (res) {
            const listNotify = res.data.content?.map((item: any) =>
              formatNotify(item)
            )
            dispatch(
              setNotificationsForUser([...notificationsForUser, ...listNotify])
            )
            setTotalPage(res.data.totalPages)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const toggleNotify = () => {
    setHideNotify(prev => !prev)
    setCountToggle(prev => prev + 1)
  }

  useEffect(() => {
    setLoading(true)

    if (reCallNotify) {
      setQueries(initQueries)
    }

    dispatch(getNotificationsForUser(reCallNotify ? initQueries : queries))
      .unwrap()
      .then(res => {
        if (res) {
          const listNotify = res.data.content?.map((item: any) =>
            formatNotify(item)
          )
          dispatch(setNotificationsForUser(listNotify))
          setTotalPage(res.data.totalPages)

          if (reCallNotify) {
            setNotificationsForUserTemp([])
            dispatch(setReCallNotify(false))
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })

    if (!reCallNotify) {
      dispatch(getNumberOfNotification({}))
    }
  }, [reCallNotify, initQueries])

  const [isShowModalConfirmLogout, setIsShowModalConfirmLogout] =
    useState<boolean>(false)

  const handleLogout = () => {
    window.location.href = PathConstant.LOGIN
  }

  const foregroundMessage = async () => {
    if (!onMessageListener) return
    const message: any = await onMessageListener()
    if (message) {
      if (message?.notification?.title === '409') {
        setIsShowModalConfirmLogout(true)
      } else {
        setNotificationsForUserTemp(prev => [
          formatNotify(JSON.parse(message?.data?.notificationResponse)),
          ...prev,
        ])
        setNumberOfNotificationTemp(message?.data?.number)
      }
    }
  }
  useEffect(() => {
    !!requestPermission && requestPermission()
    const channel = new BroadcastChannel('notifications')
    channel.onmessage = event => {
      if (event?.data?.notification?.title === '409') {
        setIsShowModalConfirmLogout(true)
      } else {
        setNotificationsForUserTemp(prev => [
          formatNotify(JSON.parse(event?.data?.data?.notificationResponse)),
          ...prev,
        ])
        setNumberOfNotificationTemp(event?.data?.data?.number)
      }
    }
  }, [])

  useEffect(() => {
    foregroundMessage()
  }, [])

  const getNumberNotification = useMemo(() => {
    if (numberOfNotificationTemp) return numberOfNotificationTemp
    else return numberOfNotification
  }, [numberOfNotification, numberOfNotificationTemp])
  return (
    <Box className={classes.rootNotifications} ref={wrapperRef}>
      <Box className={classes.notifyIconWrap}>
        <Box
          className={clsx(
            classes.notifyIcon,
            classes.flexCenter,
            !hideNotify && classes.notifyActive
          )}
          onClick={toggleNotify}
        >
          <NotificationsIcon />
        </Box>
        {!!getNumberNotification && (
          <Box className={clsx('count', classes.flexCenter)}>
            {getNumberNotification || ''}
          </Box>
        )}
      </Box>

      {!hideNotify && (
        <Box
          className={clsx(
            classes.notifyDropdown,
            loading && classes.backgroundColorWhite
          )}
        >
          <Box className={classes.title}>Notifications</Box>
          <Paper
            className={clsx(
              classes.notifyList,
              loading && classes.overflowNone
            )}
            onScroll={handleScroll}
          >
            <Box className={clsx(loading && classes.blurBackground)}>
              {[...notificationsForUserTemp, ...notificationsForUser].map(
                (item: INotificationsForUser) => (
                  <NotificationItem
                    type={item.type}
                    selectItem={selectItem}
                    item={item}
                    key={item.id}
                  />
                )
              )}
              <Box
                className={clsx(
                  classes.backgroundColorWhite,
                  classes.overflowNone
                )}
              >
                {isEmpty(notificationsForUser) &&
                  isEmpty(notificationsForUserTemp) &&
                  !loading && <NoData />}
              </Box>
            </Box>
          </Paper>
          {loading && <LoadingSkeleton height="100%" />}
        </Box>
      )}
      {isModalRequestOT && (
        <ModalRequestOT
          open
          onCloseModal={() => setIsModalRequestOT(false)}
          disabled={false}
          requestOTId={requestOTId}
        />
      )}
      <ModalConfirm
        title={'Logged in another device'}
        description={
          'Your account has logged in somewhere else and made your session invalid!'
        }
        open={isShowModalConfirmLogout}
        onSubmit={handleLogout}
        isHideButtonClose={true}
        colorButtonSubmit={'error'}
        colorModal={'error'}
        titleSubmit={'OK'}
      />
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootNotifications: { position: 'relative' },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakWord: {
    wordBreak: 'break-word',
  },
  notifyIcon: {
    cursor: 'pointer',
    height: '44px',
    width: '44px',
    background: theme.color.blue.six,
    borderRadius: '50%',
    '&:hover': {
      background: theme.color.grey.secondary,
    },
    '& svg': {
      color: theme.color.black.secondary,
    },
  },
  notifyIconWrap: {
    position: 'relative',
    '& .count': {
      position: 'absolute',
      left: '76%',
      color: '#ffffff',
      padding: '3px',
      background: '#f83a3a',
      borderRadius: '100%',
      textAlign: 'center',
      fontSize: '10px',
      top: '0px',
      minWidth: '25px',
      minHeight: '25px',
    },
  },
  notifyActive: {
    background: theme.color.blue.primary,
    '& svg': {
      color: theme.color.white,
    },
    '&:hover': {
      background: theme.color.blue.primary,
    },
  },
  notifyDropdown: {
    position: 'absolute',
    top: '50px',
    left: theme.spacing(-10),
    width: '350px',
    height: 'calc(100vh - 72px)',
    minHeight: '200px',
    wordBreak: 'break-word',
    paddingBottom: '10px',
    zIndex: 10,
  },
  title: {
    color: '#ffffff',
    textAlign: 'center',
    borderRadius: theme.spacing(0.5, 0.5, 0, 0),
    backgroundColor: theme.color.blue.primary,
    padding: theme.spacing(1.5),
    fontWeight: 500,
  },
  notifyList: {
    background: '#ffffff',
    maxHeight: 'calc(100% - 44px)',
    overflowY: 'auto',
  },
  notifyItem: {
    padding: '15px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    '& .notifyItem-title': {
      width: 'calc(100% - 25px)',
    },
    '& .notifyItem-content': {
      fontSize: '0.9em',
    },
    '& .notifyItem-bottom': {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.7em',
      fontStyle: 'oblique',
    },
  },
  boldText: {
    fontWeight: '700',
  },
  status: {
    '&.unReply': {
      color: 'yellow',
      width: '30px',
      height: '25px',
    },
  },
  itemCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    opacity: '0.3',
    pointerEvents: 'none',
  },
  overflowNone: {
    overflow: 'hidden',
  },
  backgroundColorWhite: {
    background: '#ffffff',
  },
}))
export default Notifications
