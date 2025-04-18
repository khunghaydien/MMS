import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const QUESTION_EXPLANATION_LABELS: any = {
  TITLE: {
    1: 'Question Explanation',
    2: '質問の説明',
    3: '질문 설명',
  },
  DESCRIPTION: {
    1: '※Please rate your satisfaction for these following aspects from 1 to 5',
    2: '※以下の点について満足度を 1 ～ 5 で評価してください。',
    3: '※다음 측면에 대한 만족도를 1에서 5까지 평가해 주십시오',
  },
  VALUES: {
    1: '(1 - Very Dissatisfied; 2 - Dissatisfied; 3 - Neutral; 4 - Satisfied; 5 - Very Satisfied)',
    2: '(1 - 非常に不満; 2 - 不満; 3 - どちらとも言えない; 4 - やや満足; 5 - 非常に満足)',
    3: '(1 - 매우 불만족, 2 - 불만족, 3 - 보통, 4 - 만족, 5 - 매우 만족)',
  },
}

interface SurveyQuestionExplanationProps {
  language: number
}

const SurveyQuestionExplanation = ({
  language,
}: SurveyQuestionExplanationProps) => {
  const classes = useStyles()

  return (
    <Box className={classes.RootSurveyQuestionExplanation}>
      <Box className={classes.title}>
        {QUESTION_EXPLANATION_LABELS.TITLE[language]}
      </Box>
      <Box className={classes.description}>
        {QUESTION_EXPLANATION_LABELS.DESCRIPTION[language]}
      </Box>
      <Box className={classes.values}>
        {QUESTION_EXPLANATION_LABELS.VALUES[language]}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootSurveyQuestionExplanation: {
    textAlign: 'center',
  },
  title: {
    fontWeight: 700,
    fontSize: 18,
    marginBottom: theme.spacing(1),
  },
  description: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: theme.spacing(1),
  },
  values: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    fontSize: 12,
  },
}))

export default SurveyQuestionExplanation
