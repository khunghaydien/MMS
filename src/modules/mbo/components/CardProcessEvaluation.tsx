import { countDateFromDateToEndDate, dateRange, formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'

const CardProcessEvaluation = () => {
  const classes = useStyles()

  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const progressList = useMemo(() => {
    const _processList = dateRange(
      new Date(cycleInformation.startDate),
      new Date(cycleInformation.endDate)
    )
    const totalDays = countDateFromDateToEndDate(
      new Date(cycleInformation.startDate),
      new Date(cycleInformation.endDate)
    )
    return _processList.map((item: string) => {
      const dateItem = item.split('/')
      const countDate = countDateFromDateToEndDate(
        new Date(cycleInformation.startDate),
        new Date([dateItem[1], dateItem[0], dateItem[2]].join('/'))
      )
      return {
        value: (countDate / totalDays) * 100,
        label: item,
      }
    })
  }, [cycleInformation])

  const percentProgress = useMemo(() => {
    const countDateToCurrent = countDateFromDateToEndDate(
      new Date(cycleInformation.startDate),
      new Date()
    )
    const totalDays = countDateFromDateToEndDate(
      new Date(cycleInformation.startDate),
      new Date(cycleInformation.endDate)
    )
    if (new Date(cycleInformation.endDate) < new Date()) {
      return 100
    } else if (new Date(cycleInformation.startDate) > new Date()) {
      return 0
    } else {
      return (countDateToCurrent / totalDays) * 100
    }
  }, [cycleInformation])

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 16,
    borderRadius: 15,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 15,
      backgroundColor: theme.color.green.shamrock,
    },
  }))
  return (
    <Box className={classes.rootCardProcessEvaluation}>
      <BorderLinearProgress
        className={classes.line}
        variant="determinate"
        value={percentProgress}
      />
      <Box className={classes.progressTitle}>
        {progressList.map((item: any, index: number) => (
          <Box
            className={classes.progressItem}
            key={item.label}
            style={{
              left: `calc(${item.value}% -
                2% -
                ${progressList[index + 1]?.value - item.value < 10 ? 0 : 0}px
              )`,
            }}
          >
            {formatDate(
              moment(item.label, 'DD/MM/YYYY').toDate(),
              'DD/MM/YYYY'
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  progressTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  progressItem: {
    position: 'absolute',
    fontSize: 12,
  },
  rootCardProcessEvaluation: {
    padding: theme.spacing(1, 5, 2, 5),
  },
  line: {
    height: theme.spacing(2),
  },
}))

export default CardProcessEvaluation
