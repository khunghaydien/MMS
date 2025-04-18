import FormItem from '@/components/Form/FormItem/FormItem'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import { INPUT_TEXT_MAX_LENGTH } from '@/const/app.const'
import { NS_PROJECT } from '@/const/lang.const'
import { commonSelector } from '@/reducer/common'
import { EventInput, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import FormAddComplaintItem from './FormAddComplaintItem'
import { getColorPoint } from './KPIBonusAndPenalty'
import { BonusAndPenaltyQuestionItem } from './ModalBonusAndPenaltyEvaluation'

interface FormBonusPenaltyItemProps {
  bonusAndPenaltyItem: BonusAndPenaltyQuestionItem
  onChange: (field: string, value: any) => void
  errors: any
  touched: any
  questionIds: number[] | string[]
  evaluationMonth: Date | null
}

const FormBonusPenaltyItem = ({
  bonusAndPenaltyItem,
  onChange,
  errors,
  touched,
  questionIds,
  evaluationMonth,
}: FormBonusPenaltyItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { evaluateProjectQuestions } = useSelector(commonSelector)

  const bonusPenaltyListOptions: OptionItem[] = [
    {
      id: 1,
      value: 1,
      label: i18Project('TXT_BONUS') as string,
    },
    {
      id: 2,
      value: 2,
      label: i18Project('TXT_PENALTY') as string,
    },
  ]

  const questionOptions = useMemo(() => {
    const currentQuestionId = bonusAndPenaltyItem.questionId
    const questionOptionsByBonusPenaltyType = evaluateProjectQuestions.filter(
      (question: { bonusPenalty: number }) =>
        question.bonusPenalty === bonusAndPenaltyItem.bonusPenalty
    )
    // @ts-ignore
    const listQuestionsExistIgnore =
      // @ts-ignore
      questionIds
        // @ts-ignore
        ?.filter(
          (questionId: string | number) => questionId != currentQuestionId
        )
        // @ts-ignore
        ?.map((questionId: string | number) => +questionId) || []
    // @ts-ignore
    return questionOptionsByBonusPenaltyType.filter(
      (question: any) =>
        !listQuestionsExistIgnore.includes(question.id as number) ||
        question.complaint
    )
  }, [evaluateProjectQuestions, bonusAndPenaltyItem, questionIds])

  const onBonusPenaltyChange = (value: string) => {
    if (+value == 1) {
      onChange('complaint', false)
    }
    onChange('questionId', '')
    onChange('point', '')
    onChange('bonusPenalty', value)
  }

  const onQuestionChange = (value: string, option: any) => {
    onChange('point', option.point)
    onChange('complaint', option.complaint)
    onChange('questionId', value)
  }

  const onComplaintItemChange = ({
    keyName,
    value,
  }: {
    keyName: string
    value: any
  }) => {
    onChange(keyName, value)
  }

  return (
    <Box className={classes.RootFormBonusPenaltyItem}>
      <InputDropdown
        required
        width={140}
        listOptions={bonusPenaltyListOptions}
        label={i18Project('TXT_BONUS_PENALTY')}
        placeholder={i18Project('PLH_BONUS_PENALTY')}
        error={!!errors?.bonusPenalty && touched?.bonusPenalty}
        errorMessage={errors?.bonusPenalty}
        value={bonusAndPenaltyItem.bonusPenalty as string}
        onChange={onBonusPenaltyChange}
      />
      <Box className={classes.mainQuestion}>
        <Box className={classes.questionAndPoint}>
          <InputDropdown
            required
            width={740}
            maxEllipsis={100}
            listOptions={questionOptions}
            label={i18Project('TXT_TYPE')}
            placeholder={i18Project('PLH_SELECT_TYPE')}
            error={!!errors?.questionId && touched?.questionId}
            errorMessage={errors?.questionId}
            value={bonusAndPenaltyItem.questionId}
            onChange={onQuestionChange}
          />
          <Box width={76}>
            <FormItem label={i18Project('TXT_POINT')}>
              <Box
                className={classes.pointValue}
                sx={{
                  color: getColorPoint(bonusAndPenaltyItem.point),
                }}
              >
                {
                  // @ts-ignore
                  bonusAndPenaltyItem?.point
                    ? (+bonusAndPenaltyItem?.point)?.toFixed(2)
                    : '--'
                }
              </Box>
            </FormItem>
          </Box>
        </Box>
        {bonusAndPenaltyItem.complaint &&
        bonusAndPenaltyItem.bonusPenalty === 2 ? (
          <FormAddComplaintItem
            evaluationMonth={evaluationMonth}
            complaint={bonusAndPenaltyItem}
            errors={errors}
            touched={touched}
            onChange={onComplaintItemChange}
          />
        ) : (
          <InputTextArea
            height={80}
            maxLength={INPUT_TEXT_MAX_LENGTH}
            label={i18('LB_NOTE') as string}
            placeholder={i18('PLH_NOTE')}
            defaultValue={bonusAndPenaltyItem.note}
            onChange={(e: EventInput) => onChange('note', e.target.value)}
          />
        )}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormBonusPenaltyItem: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  mainQuestion: {
    flex: 1,
  },
  questionAndPoint: {
    display: 'flex',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  pointValue: {
    background: theme.color.grey.secondary,
    width: 'max-content',
    padding: theme.spacing(1.1, 3),
    borderRadius: '4px',
    fontWeight: 700,
  },
}))

export default FormBonusPenaltyItem
