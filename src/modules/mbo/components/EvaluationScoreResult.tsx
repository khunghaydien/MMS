import CommonButton from '@/components/buttons/CommonButton'
import CardForm from '@/components/Form/CardForm'
import { NS_MBO } from '@/const/lang.const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

interface EvaluationScoreResultProps {
  title?: string
  jobResult?: number | string
  attitude?: number | string
  totalScore?: number | string
  useButtonFinalSubmit?: boolean
  buttonFinalSubmitDisabled?: boolean
  onSubmit?: () => void
}

const EvaluationScoreResult = ({
  title,
  jobResult,
  attitude,
  totalScore,
  useButtonFinalSubmit = false,
  buttonFinalSubmitDisabled = true,
  onSubmit,
}: EvaluationScoreResultProps) => {
  const classes = useStyles()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  return (
    <CardForm title={title || ''}>
      <Box className={classes.finalEvaluationBox}>
        <Box className={classes.option}>
          <Box className={classes.label}>{i18Mbo('LB_JOB_RESULT')}:</Box>
          <Box className={classes.value}>{jobResult}</Box>
        </Box>
        <Box className={classes.option}>
          <Box className={classes.label}>{i18Mbo('LB_ATTITUDE')}:</Box>
          <Box className={classes.value}>{attitude}</Box>
        </Box>
        <Box className={classes.option}>
          <Box className={clsx(classes.label, classes.totalScore)}>
            {i18Mbo('LB_TOTAL_SCORE')}:
          </Box>
          <Box className={clsx(classes.value, classes.totalScore)}>
            {totalScore}
          </Box>
        </Box>
      </Box>

      {useButtonFinalSubmit && (
        <Box className={clsx(classes.buttonWrapper)}>
          <CommonButton
            disabled={buttonFinalSubmitDisabled}
            onClick={() => {
              !!onSubmit && onSubmit()
            }}
          >
            {i18Mbo('LB_FINAL_SUBMIT')}
          </CommonButton>
        </Box>
      )}
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  finalEvaluationBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  label: {
    fontWeight: 700,
    fontSize: theme.spacing(2),
    width: theme.spacing(15),
    color: theme.color.black.primary,
  },
  value: {
    fontWeight: 700,
    fontSize: theme.spacing(2),
  },
  totalScore: {
    color: theme.color.blue.primary,
  },
  buttonWrapper: {
    marginTop: theme.spacing(2),
  },
}))

export default EvaluationScoreResult
