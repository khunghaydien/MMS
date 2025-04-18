import { STAFF_STATUS_TYPE } from '@/modules/staff/const'
import { staffSelector } from '@/modules/staff/reducer/staff'
import { StaffState } from '@/modules/staff/types'
import { formatDate, getTextEllipsis } from '@/utils'
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone'
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone'
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone'
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
const StaffWorkingEvent = () => {
  const classes = useStyles()
  const { staffWorkingHistory }: StaffState = useSelector(staffSelector)
  return (
    <Box className={clsx(classes.rootStaffInformation, 'scrollbar')}>
      {!isEmpty(staffWorkingHistory) &&
        staffWorkingHistory?.map(({ events, title }, index) => (
          <Fragment key={index}>
            {events?.map(({ note, event, date, id }, index) => (
              <Box key={index} className={classes.statusItem}>
                {id?.toString() ===
                  STAFF_STATUS_TYPE.STATUS_TEMPORARY_LEAVE?.toString() && (
                  <Box className={clsx(classes.icons, classes.bgYellow)}>
                    <SendTwoToneIcon
                      className={clsx(classes.yellow, classes.icon)}
                    />
                  </Box>
                )}
                {(id?.toString() === STAFF_STATUS_TYPE.ACTIVE?.toString() ||
                  id?.toString() === STAFF_STATUS_TYPE.ON_BOARD?.toString() ||
                  id?.toString() ===
                    STAFF_STATUS_TYPE.RE_ACTIVE.toString()) && (
                  <Box className={clsx(classes.icons, classes.bgGreen)}>
                    <WorkTwoToneIcon
                      className={clsx(classes.green, classes.icon)}
                    />
                  </Box>
                )}
                {id?.toString() === STAFF_STATUS_TYPE.ON_SITE?.toString() && (
                  <Box className={clsx(classes.icons, classes.bgBlue)}>
                    <LocationOnTwoToneIcon
                      className={clsx(classes.blue, classes.icon)}
                    />
                  </Box>
                )}
                {id?.toString() === STAFF_STATUS_TYPE.INACTIVE?.toString() && (
                  <Box className={clsx(classes.icons, classes.bgRed)}>
                    <LogoutTwoToneIcon
                      className={clsx(classes.red, classes.icon)}
                    />
                  </Box>
                )}
                <Box className={classes.items}>
                  <Box
                    className={clsx(
                      classes.name,
                      (id?.toString() ===
                        STAFF_STATUS_TYPE.ACTIVE?.toString() ||
                        id?.toString() ===
                          STAFF_STATUS_TYPE.ON_BOARD?.toString() ||
                        id?.toString() ===
                          STAFF_STATUS_TYPE.RE_ACTIVE?.toString()) &&
                        classes.green,
                      id?.toString() ===
                        STAFF_STATUS_TYPE.ON_SITE?.toString() && classes.blue,
                      id?.toString() ===
                        STAFF_STATUS_TYPE.INACTIVE?.toString() && classes.red,
                      id?.toString() ===
                        STAFF_STATUS_TYPE.STATUS_TEMPORARY_LEAVE?.toString() &&
                        classes.yellow
                    )}
                  >
                    {event}
                  </Box>
                  <Box className={clsx(classes.blue, classes.font11)}>
                    {formatDate(date)}
                  </Box>
                  {note && (
                    <Box className={clsx(classes.black, classes.font11)}>
                      {note}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
            <div className={classes.name}>{getTextEllipsis(title, 30)}</div>
          </Fragment>
        ))}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffInformation: {
    width: '100%',
    minHeight: '560px',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    height: '580px',
    overflowY: 'auto',
  },
  name: {
    fontWeight: 'bold',
    color: 'rgba(23, 70, 159, 1)',
    fontSize: '14px',
  },
  green: {
    color: theme.color.green.primary,
  },
  blue: {
    color: theme.color.blue.primary,
  },
  yellow: {
    color: theme.color.yellow.primary,
  },
  red: {
    color: theme.color.error.primary,
  },
  bgRed: {
    background: 'rgba(234, 66, 36, 0.15)',
  },
  bgGreen: {
    background: 'rgba(52, 168, 83, 0.15)',
  },
  bgBlue: {
    background: 'rgba(66, 133, 244, 0.15)',
  },
  bgYellow: {
    background: 'rgba(248, 166, 41, 0.15)',
  },
  icon: {
    fontSize: '12px',
  },
  icons: {
    padding: '5px',
    width: '32px',
    height: '32px',
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  black: {
    color: theme.color.black.tertiary,
  },
  font11: {
    fontSize: 11,
    fontWeight: 500,
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
}))
export default StaffWorkingEvent
