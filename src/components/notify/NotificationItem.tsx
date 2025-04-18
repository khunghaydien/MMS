import { LangConstant } from '@/const'
import { NOTIFICATIONS_TYPE } from '@/const/app.const'
import { formatDate } from '@/utils'
import { WarningAmber } from '@mui/icons-material'
import { Box, Theme, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import NotificationMessage from './NotificationMessage'
import { INotificationsForUser } from './Notifications'

interface IProps {
  selectItem: (item: INotificationsForUser) => void
  item: INotificationsForUser
  type: number
}
const NotificationItem = ({ selectItem, item, type }: IProps) => {
  const classes = useStyles()
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const getDateTime = (time: any) => {
    const date = new Date(time)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
  }
  return (
    <Box
      className={clsx(
        classes.flexCenter,
        classes.notifyItemWrap,
        !item?.isReading && 'unRead'
      )}
      key={item.id}
      onClick={() => {
        selectItem(item)
      }}
    >
      <Box className={clsx(classes.notifyItem)}>
        <NotificationMessage
          sourceType={type}
          isReading={item?.isReading}
          statusApplication={
            item.sourceValue?.dailyReportApplication?.statusApplication
          }
          reportDate={formatDate(
            item.sourceValue?.dailyReportApplication?.reportDate
          )}
          approvedByName={
            item.sourceValue?.dailyReportApplication?.approvedBy?.name
          }
          staffName={
            type === NOTIFICATIONS_TYPE.DAILY_REPORT
              ? item.sourceValue?.dailyReportApplication?.staff?.name
              : type === NOTIFICATIONS_TYPE.STAFF.INACTIVE
              ? item.sourceValue?.name
              : item.sourceValue?.staff?.name
          }
          staffCode={item.sourceValue?.code}
          jobEndDate={item.sourceValue?.jobEndDate}
          currentJobType={item.sourceValue?.currentJobType}
          reviewerName={item.sourceValue?.reviewer?.name}
          cycleName={item.sourceValue?.evaluationCycle?.name}
          projectName={
            item.sourceValue?.project?.name || item.sourceValue?.name
          }
          projectManager={item.sourceValue?.projectManager?.name}
          divisionDirector={item.sourceValue?.divisionDirector?.name}
          projectStartDate={
            item.sourceValue?.project?.startDate
              ? formatDate(item.sourceValue?.project?.startDate)
              : ''
          }
          tools={item.sourceValue?.tools}
          otDate={formatDate(
            new Date(item.sourceValue?.otDate?.epochSecond * 1000)
          )}
          rejectReason={item.sourceValue?.rejectReason}
        />
        <Box className="notifyItem-bottom">
          <Box className={classes.breakWord}></Box>
          <Box className={classes.dateUpdated}>
            Updated: {getDateTime(item.createAt)}
          </Box>
        </Box>
      </Box>
      {item?.isReading &&
        item.sourceValue?.dailyReportApplication?.statusApplication === 1 && (
          <Tooltip
            title={
              <Box style={{ fontSize: 16 }}>
                {i18nDailyReport('MSG_WARNING_NOTIFY_REPORT')}
              </Box>
            }
          >
            <WarningAmber className={classes.unConfirm} />
          </Tooltip>
        )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakWord: {
    wordBreak: 'break-word',
  },
  title: {
    color: '#ffffff',
    background: '#205DCE',
    padding: '20px',
    textAlign: 'center',
    fontSize: '1.1em',
    fontWeight: '700',
  },
  notifyItemWrap: {
    borderBottom: ' 1px solid rgb(17 17 26 / 10%)',
    background: '#ecf9ff7a',
    position: 'relative',
    '&.unRead': {
      backgroundColor: '#bae9ff7a',
    },
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: '#205DCE',
    },
  },
  notifyItem: {
    padding: '15px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
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
  status: {
    '&.unReply': {
      color: 'yellow',
      width: '30px',
      height: '25px',
    },
  },
  unConfirm: {
    position: 'absolute',
    top: '12px',
    right: '15px',
    color: '#ed4a5cde',
  },
  dateUpdated: {
    minWidth: '107px',
    marginRight: '5px',
  },
  readOnly: {
    cursor: 'default',
  },
}))
export default NotificationItem
