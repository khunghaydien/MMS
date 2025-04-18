import ConditionalRender from '@/components/ConditionalRender'
import { FieldListOptions } from '@/components/Form/CardForm/CardFormModeView'
import FormItem from '@/components/Form/FormItem/FormItem'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { selectAuth } from '@/reducer/auth'
import { EventInput, IProjectManager, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { EVALUATION_PERIOD_STEP } from '../../const'
import { RowEvaluationCriteria, TypeOfWork } from '../../models'
import { evaluationProcessSelector } from '../../reducer/evaluation-process'
import FormEvaluationComments from '../FormEvaluationComments'
import TableEvaluationCriteria from '../TableEvaluationCriteria'

interface TaskFormItemProps {
  task: any
  index?: number
  errors: any
  touched: any
  setFieldValue: (keyName: string, value: any) => void
  typeOfWorkList: TypeOfWork[]
  evaluate: number
}

const TaskEvaluateItem = ({
  task,
  index = -1,
  errors,
  touched,
  setFieldValue,
  typeOfWorkList,
  evaluate,
}: TaskFormItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { cycleInformation } = useSelector(evaluationProcessSelector)
  const { staff } = useSelector(selectAuth)

  const [difficultyListOptions, setDifficultyListOptions] = useState<
    OptionItem[]
  >([])
  const [evaluationCriteriaRows, setEvaluationCriteriaRows] = useState<
    RowEvaluationCriteria[]
  >([])
  const [meaning, setMeaning] = useState<string>('')
  const formEvaluationCommentsRef = useRef<any>(null)

  const listTaskInformation = useMemo(
    () => [
      {
        id: 'taskName',
        label: i18Mbo('LB_TASK_NAME'),
        value: task.name,
      },
      {
        id: 'typeOfWork',
        label: i18Mbo('LB_TYPE_OF_WORK'),
        value: task.typeOfWork?.name,
      },
      {
        id: 'projectName',
        label: i18Project('LB_PROJECT_NAME'),
        value: task.projectId,
      },
      {
        id: 'efforts',
        label: i18Mbo('LB_EFFORT'),
        value: task.effort + '%',
      },
    ],
    [task]
  )

  const typeOfWork = typeOfWorkList.find(
    (item: TypeOfWork) => item.type.id == task.typeOfWork.id
  )

  const levelValues = useMemo(() => {
    return typeOfWork?.criteria?.map(
      (_: any, index: number) =>
        task.taskEvaluationDetails?.[index]?.criteriaDetailId?.toString() || ''
    )
  }, [typeOfWork, task.taskEvaluationDetails])

  const everyComment = useMemo(() => {
    return typeOfWork?.criteria?.map((item: any, index: number) => ({
      id: item.id.toString(),
      value: item.id.toString(),
      label: item.name,
      note: task.taskEvaluationDetails?.[index]?.comment || '',
    }))
  }, [typeOfWork, task.taskEvaluationDetails])

  // https://jira.morsoftware.com/browse/MMS2024-118
  const difficultyReasonRequired = useMemo(() => {
    const isAppraiser1 = staff?.id === +task.appraiser1Id
    const appraiser1Id = task.appraiser1Id
    const appraiser2Id = task.appraiser2Id
    if (appraiser1Id === appraiser2Id || isAppraiser1) {
      const scoreOption = difficultyListOptions.find(
        item => item.id == task.difficultyId
      )
      const scoreValue: any = scoreOption?.label
      return +scoreValue >= 3
    }
    return (
      !!task.difficultyId && +task.difficultyId !== +task.difficultyAppraiser1
    )
  }, [cycleInformation, staff, task, difficultyListOptions])

  const commentError = useMemo(() => {
    if (task.commentType === '1') {
      return !!errors?.comment && touched?.comment
    } else {
      return (
        !!errors?.taskEvaluationDetails?.some(
          (taskEvalError: any) => !!taskEvalError?.comment
        ) && touched.comment
      )
    }
  }, [task, errors, touched])

  const commentErrorMessage = useMemo(() => {
    if (task.commentType === '1') {
      return errors?.comment
    } else {
      const err = errors?.taskEvaluationDetails?.find(
        (taskEvalError: any) => !!taskEvalError?.comment
      )
      return err?.comment
    }
  }, [task, errors])

  const fillCriteriaByWorkType = () => {
    const _newDifficultyListOptions =
      typeOfWork?.type.difficultyWorkType?.map((option: any) => ({
        label: option.score.toString(),
        id: option.id.toString(),
        value: option.id.toString(),
        note: option.content,
      })) || []
    setDifficultyListOptions(_newDifficultyListOptions)
    const evaluationCriteriaRows =
      typeOfWork?.criteria?.map((item: any) => ({
        id: item.id,
        name: item.name,
        weight: item.weight,
        levelListOptions: item.criteriaDetail.map((item: any) => ({
          id: item.id.toString(),
          value: item.id.toString(),
          label: item.score.toString(),
          note: item.content,
        })),
      })) || []
    setEvaluationCriteriaRows(evaluationCriteriaRows)
  }

  const handleInputDropdownChange = (
    value: string,
    option: any,
    keyName?: string
  ) => {
    switch (keyName) {
      case 'projectId': {
        const _listAppraisers =
          option.projectManagers?.map((pm: IProjectManager) => ({
            id: pm.id,
            value: pm.id,
            label: pm.name,
          })) || []
        if (_listAppraisers?.length === 1) {
          setFieldValue(`appraiserId`, _listAppraisers[0].value)
        }
        break
      }
    }
    setFieldValue(`${keyName}` || '', value)
  }

  const handleLevelValuesChange = (value: any) => {
    const _taskEvaluationDetails = task.taskEvaluationDetails?.map(
      (item: any, index: number) => ({
        criteriaDetailId: value[index],
        comment: item.comment,
      })
    )
    setFieldValue(`taskEvaluationDetails`, _taskEvaluationDetails)
  }

  const handleEveryCommentChange = (newEveryComments: OptionItem[]) => {
    const _taskEvaluationDetails = task.taskEvaluationDetails?.map(
      (item: any, index: number) => ({
        criteriaDetailId: item.criteriaDetailId,
        comment: newEveryComments[index].note,
        commentType: item.commentType,
      })
    )
    setFieldValue(`taskEvaluationDetails`, _taskEvaluationDetails)
  }

  const errorMessage = (keyName: string) => {
    if (!!errors) {
      return errors[keyName]
    } else {
      return ''
    }
  }

  const isTouched = (keyName: string) => {
    if (!!touched) {
      return touched[keyName]
    } else {
      return false
    }
  }

  const onReasonDifficultyChange = (e: EventInput) => {
    setFieldValue('reasonDifficulty', e.target.value)
  }

  useEffect(() => {
    fillCriteriaByWorkType()
  }, [])

  useEffect(() => {
    if (!task.taskEvaluationDetails?.length) {
      setFieldValue(
        `taskEvaluationDetails`,
        typeOfWork?.criteria.map(() => ({
          criteriaDetailId: '',
          comment: '',
        }))
      )
    }
  }, [task.taskEvaluationDetails, typeOfWork])

  useEffect(() => {
    if (task.difficultyId) {
      const option = difficultyListOptions?.find(
        item => item.id === task.difficultyId + ''
      )
      setMeaning(option?.note || '')
    }
  }, [task.difficultyId, difficultyListOptions])

  return (
    <Box
      className={classes.rootTaskFormItem}
      sx={
        evaluate === EVALUATION_PERIOD_STEP.JOB_RESULT
          ? {}
          : { border: 'none', margin: '0', padding: '0' }
      }
    >
      <ConditionalRender
        conditional={evaluate === EVALUATION_PERIOD_STEP.JOB_RESULT}
      >
        <Box className={classes.formTitle}>
          <Box className={classes.titleBox}>
            <Box className="text">{i18Mbo('LB_TASK')}:</Box>
            <Box className={classes.order}>
              {index >= 0 ? `#${index + 1}` : ''}
            </Box>
          </Box>
        </Box>
      </ConditionalRender>
      <ConditionalRender
        conditional={evaluate === EVALUATION_PERIOD_STEP.JOB_RESULT}
      >
        <Box className={classes.fieldList}>
          <FieldListOptions
            dataRendering={listTaskInformation}
            isVertical={false}
          />
        </Box>
      </ConditionalRender>

      <Box className={classes.body}>
        <ConditionalRender
          conditional={evaluate === EVALUATION_PERIOD_STEP.JOB_RESULT}
        >
          <Box className={classes.difficultySelect}>
            <InputDropdown
              required
              error={
                !!errorMessage('difficultyId') &&
                isTouched('difficultyId') &&
                !!task.typeOfWork
              }
              errorMessage={errorMessage('difficultyId')}
              isShowClearIcon={false}
              width={120}
              keyName="difficultyId"
              label={i18Mbo('LB_DIFFICULTY')}
              value={task.difficultyId}
              listOptions={difficultyListOptions}
              onChange={handleInputDropdownChange}
              isDisable={!task.typeOfWork}
              placeholder={i18Mbo('PLH_DIFFICULTY')}
            />
            <ConditionalRender conditional={!!task.difficultyId}>
              <FormItem
                className={classes.meaningContainer}
                label={i18Mbo('LB_MEANING')}
              >
                <Box>{meaning}</Box>
              </FormItem>
            </ConditionalRender>
          </Box>
        </ConditionalRender>
        <ConditionalRender
          conditional={evaluate === EVALUATION_PERIOD_STEP.JOB_RESULT}
        >
          <InputTextLabel
            error={
              !!errorMessage('reasonDifficulty') &&
              isTouched('reasonDifficulty')
            }
            errorMessage={errorMessage('reasonDifficulty')}
            required={difficultyReasonRequired}
            label={i18Mbo('LB_DIFFICULTY_REASON')}
            placeholder={i18Mbo('PLH_DIFFICULTY_REASON')}
            value={task.reasonDifficulty}
            onChange={onReasonDifficultyChange}
          />
        </ConditionalRender>
        <Box className={classes.tableEvaluation}>
          <TableEvaluationCriteria
            required={true}
            currentTaskEvaluationDetails={[]}
            rows={evaluationCriteriaRows}
            setLevelValues={handleLevelValuesChange}
            levelValues={levelValues || []}
            error={
              !!errors?.taskEvaluationDetails &&
              Array.isArray(errors?.taskEvaluationDetails) &&
              errors?.taskEvaluationDetails?.filter(
                (item: any) => !!item?.criteriaDetailId
              )?.length > 0 &&
              touched?.taskEvaluationDetails
            }
            errorMessage={
              i18('MSG_SELECT_REQUIRE', {
                name: i18('LB_SCORE'),
              }) || ''
            }
          />
        </Box>
        <Box className={classes.tableEvaluation}>
          <FormEvaluationComments
            error={commentError}
            errorMessage={commentErrorMessage}
            isDetail={false}
            ref={formEvaluationCommentsRef}
            generalComment={task.comment}
            everyComments={everyComment || []}
            onGeneralCommentChange={(value: string) =>
              setFieldValue('comment', value)
            }
            onChangeType={(type: string) => setFieldValue('commentType', type)}
            onEveryCommentsChange={handleEveryCommentChange}
          />
        </Box>
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootTaskFormItem: {
    border: `1px ${theme.color.grey.secondary} solid`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0),
  },
  formTitle: {
    fontSize: 18,
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
  },
  fieldList: { marginBottom: theme.spacing(1) },
  titleBox: {
    display: 'flex',
    gap: theme.spacing(1),
    fontWeight: 500,
    borderRadius: '4px',
  },
  order: {
    color: theme.color.blue.primary,
  },
  title: {
    color: theme.color.blue.primary,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  inputEffort: {
    width: theme.spacing(10),
  },
  meaningContainer: {
    gridColumn: 'span 2',
  },
  tableEvaluation: {
    gridColumn: 'span 5',
  },
  taskName: {
    gridColumn: 'span 3',
  },
  typeOfWork: {
    gridColumn: 'span 2',
  },
  project: {
    gridColumn: 'span 2',
  },
  difficultySelect: {
    display: 'flex',
    gap: theme.spacing(3),
    gridColumn: 'span 5',
    marginTop: theme.spacing(1),
  },
}))
export default TaskEvaluateItem
