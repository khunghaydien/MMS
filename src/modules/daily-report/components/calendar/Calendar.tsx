import ConditionalRender from '@/components/ConditionalRender'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { weekdayLabels } from '@/const/app.const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { IDay } from '../../hooks/useDate'
import DailyReportDateCell from '../../pages/daily-report/DailyReportDateCell'

export interface IProps {
  days: IDay[]
  loading: boolean
  isManagerPreviewStaff: boolean
  onOpenModalAddDailyReport: (day: IDay) => void
}

function Calendar({
  days,
  loading,
  onOpenModalAddDailyReport,
  isManagerPreviewStaff,
}: IProps) {
  const classes = useStyles()

  return (
    <Box className={classes.rootCalendar}>
      <div id="calendar" className="calendar-wrapper">
        <Box className="wrapper-calendar-cell">
          {weekdayLabels.map((day: string) => (
            <Box key={day} className="head-cell">
              <Box className={classes.after}></Box>
              {day}
            </Box>
          ))}
        </Box>
        <Box className="wrapper-calendar-body">
          <ConditionalRender
            conditional={!loading}
            fallback={<LoadingSkeleton height="50vh" />}
          >
            <Box className="wrapper-calendar-cell">
              {days.map((day: IDay, index: number) => (
                <Box key={index} className="calendar-cell">
                  <DailyReportDateCell
                    day={day}
                    isManagerPreviewStaff={isManagerPreviewStaff}
                    onOpenModalAddDailyReport={onOpenModalAddDailyReport}
                  />
                </Box>
              ))}
            </Box>
          </ConditionalRender>
        </Box>
      </div>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootCalendar: {
    '& .calendar-wrapper': {
      fontSize: 14,
      fontWeight: 700,
      color: theme.color.black.primary,
    },

    '& .wrapper-calendar-cell': {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat( 7, 1fr)',
      border: `1px solid ${theme.color.grey.secondary}`,
      borderBottom: 0,
      '&:nth-child(2)': {
        borderTop: 'unset',
      },
    },
    '& .wrapper-calendar-body': {
      width: '100%',
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
    },

    '& .head-cell': {
      padding: theme.spacing(1.5),
      textAlign: 'center',
      color: theme.color.black.primary,
      position: 'relative',
    },

    '& .calendar-cell': {
      minHeight: '170px',
      borderLeft: `1px solid ${theme.color.grey.secondary}`,
      borderBottom: `1px solid ${theme.color.grey.secondary}`,
      minWidth: '200px',
      '&:nth-child(7n + 1)': {
        borderLeft: 'unset',
      },
    },
  },
  after: {
    background: theme.color.grey.secondary,
    width: '1px',
    position: 'absolute',
    height: '41px',
    right: '-1px',
    top: 0,
  },
}))

export default Calendar
