import { NS_MBO } from '@/const/lang.const'
import { EvaluationProgressColumn } from '@/modules/mbo/models'
import { CheckCircleOutline, RadioButtonUnchecked } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import TooltipWithWarningIcon from './TooltipWithWarningIcon'

interface ProgressColumnProps {
  progresses: EvaluationProgressColumn[]
}

const ProgressColumn = ({ progresses }: ProgressColumnProps) => {
  const classes = useStyles()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  return (
    <Box className={classes.RootProgressColumn}>
      {progresses.map((item, index) => (
        <Box className={classes.progressItem} key={index}>
          <Box>{`${i18Mbo('LB_EVALUATION')} #${item.number}`}</Box>
          <Box className={classes.checkProgress}>
            <Box
              className={clsx(
                classes.line,
                classes.line1,
                item.appraiser1 && classes.lineChecked
              )}
            />
            <Box
              className={clsx(
                classes.line,
                classes.line2,
                item.appraiser2 && classes.lineChecked
              )}
            />
            <TooltipWithWarningIcon
              content={i18Mbo('LB_APPRAISEE')}
              RootContainer={
                item.appraisees ? (
                  <CheckCircleOutline className={classes.checked} />
                ) : (
                  <RadioButtonUnchecked className={classes.unChecked} />
                )
              }
            />
            <TooltipWithWarningIcon
              content={i18Mbo('LB_APPRAISER_1')}
              RootContainer={
                item.appraiser1 ? (
                  <CheckCircleOutline className={classes.checked} />
                ) : (
                  <RadioButtonUnchecked className={classes.unChecked} />
                )
              }
            />
            <TooltipWithWarningIcon
              content={i18Mbo('LB_APPRAISER_2')}
              RootContainer={
                item.appraiser2 ? (
                  <CheckCircleOutline className={classes.checked} />
                ) : (
                  <RadioButtonUnchecked className={classes.unChecked} />
                )
              }
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProgressColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'flex-end',
  },
  progressItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  checkProgress: {
    display: 'flex',
    gap: theme.spacing(4),
    justifyContent: 'space-between',
    position: 'relative',
  },
  checked: {
    color: theme.color.green.primary,
  },
  unChecked: {
    color: theme.color.orange.primary,
  },
  checkItem: {
    textAlign: 'center',
  },
  role: {
    fontSize: 12,
  },
  line: {
    position: 'absolute',
    height: '2px',
    width: 'calc((100% - 64px) / 2)',
    top: '50%',
    backgroundColor: theme.color.orange.primary,
  },
  line1: {
    left: '22px',
  },
  line2: {
    right: '22px',
  },
  lineChecked: {
    backgroundColor: theme.color.green.primary,
  },
}))

export default ProgressColumn
