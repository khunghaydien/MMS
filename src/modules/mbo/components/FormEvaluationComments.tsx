import FormItem from '@/components/Form/FormItem/FormItem'
import InputRadioList from '@/components/inputs/InputRadioList'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { INPUT_TEXTAREA_MAX_LENGTH } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { EventInput, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { IAppraiser, TaskEvaluationDetails } from '../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'

export const GENERAL = '1'
export const EVERY = '2'

interface FormEvaluationCommentsProps {
  currentTaskEvaluation?: IAppraiser
  generalComment: string
  isDetail: boolean
  everyComments: OptionItem[]
  onGeneralCommentChange?: (value: string) => void
  onEveryCommentsChange?: (everyComments: OptionItem[]) => void
  onChangeType: (type: string) => void
  disabled?: boolean
  error: boolean
  errorMessage: string
}

const FormEvaluationComments = (
  {
    currentTaskEvaluation,
    generalComment,
    isDetail = false,
    onGeneralCommentChange,
    everyComments,
    onEveryCommentsChange,
    disabled,
    onChangeType,
    error,
    errorMessage,
  }: FormEvaluationCommentsProps,
  ref: any
) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )
  const { staff }: AuthState = useSelector(selectAuth)

  const radioListOptions = [
    {
      id: GENERAL,
      value: GENERAL,
      label: i18('LB_GENERAL'),
      disabled: disabled,
    },
    {
      id: EVERY,
      value: EVERY,
      label: i18Mbo('TXT_ON_EVERY_EVALUATION_CRITERIA'),
      disabled: !everyComments.length || disabled,
    },
  ]

  const [type, setType] = useState(GENERAL)

  const isReviewer = useMemo(() => {
    return +cycleInformation.reviewer?.id === staff?.id
  }, [cycleInformation, staff])

  useImperativeHandle(ref, () => {
    return {
      commentType: type,
    }
  })

  useEffect(() => {
    if (isDetail) {
      const taskEvaluationDetails: TaskEvaluationDetails[] =
        currentTaskEvaluation?.taskEvaluationDetails || []
      !!onEveryCommentsChange &&
        onEveryCommentsChange(
          taskEvaluationDetails?.map(item => ({
            id: item.criteriaId,
            label: item.criteriaName,
            note: item.criteriaComment,
            value: item.criteriaId,
          }))
        )
      !!onGeneralCommentChange &&
        !!currentTaskEvaluation?.comment &&
        onGeneralCommentChange(currentTaskEvaluation.comment || '')
    }
    setType(everyComments.some(item => !!item.note) ? EVERY : GENERAL)
  }, [currentTaskEvaluation, isDetail])

  const handleGeneralCommentChange = (e: EventInput) => {
    !!onGeneralCommentChange && onGeneralCommentChange(e.target.value)
  }

  const handleEveryCommentsChange = (value: string, index: number) => {
    const newEveryComments = [...everyComments]
    newEveryComments[index].note = value
    !!onEveryCommentsChange && onEveryCommentsChange(newEveryComments)
  }

  useEffect(() => {
    onChangeType(type)
  }, [type])

  return (
    <FormItem
      label={i18('LB_COMMENT')}
      required={!isReviewer}
      error={error}
      errorMessage={errorMessage}
    >
      <InputRadioList
        value={type}
        listOptions={radioListOptions}
        onChange={type => setType(type)}
      />
      {type === GENERAL && (
        <InputTextArea
          disabled={disabled}
          maxLength={INPUT_TEXTAREA_MAX_LENGTH * 2}
          defaultValue={generalComment}
          placeholder={i18('PLH_NOTE')}
          onChange={handleGeneralCommentChange}
        />
      )}
      {type === EVERY && (
        <Box className={classes.table}>
          <Box className={classes.tableBox}>
            <Box className={classes.tableHeader}>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18Mbo('LB_EVALUATION_CRITERIA')}
                </Box>
                <Box className={classes.label}>{i18('LB_COMMENT')}</Box>
              </Box>
            </Box>
            {everyComments.map((item, index) => (
              <Box className={classes.option} key={item.id}>
                <Box className={classes.contentLabel}>{item.label}</Box>
                <Box className={classes.value}>
                  <InputTextLabel
                    disabled={disabled}
                    placeholder={i18('PLH_COMMENT')}
                    value={item.note}
                    onChange={(e: EventInput) =>
                      handleEveryCommentsChange(e.target.value, index)
                    }
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </FormItem>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
    padding: theme.spacing(2),
  },
  tableHeader: {
    marginBottom: theme.spacing(2),
    '& > div': {
      background: theme.color.grey.secondary,
      borderRadius: '4px',
      padding: theme.spacing(1),
    },
  },
  tableBox: {},
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  label: {
    fontWeight: 700,
    width: theme.spacing(30),
  },
  value: {
    flex: 1,
  },
  contentLabel: {
    width: theme.spacing(30),
  },
}))

export default forwardRef(FormEvaluationComments)
