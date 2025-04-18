import ConditionalRender from '@/components/ConditionalRender'
import FormItem from '@/components/Form/FormItem/FormItem'
import DeleteIcon from '@/components/icons/DeleteIcon'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { CommonState, commonSelector } from '@/reducer/common'
import { EventInput, IProjectManager, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { MAXIMUM_EFFORT } from '../../const'
import {
  EvaluationTaskForm,
  RowEvaluationCriteria,
  TypeOfWork,
} from '../../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../../reducer/evaluation-process'
import FormEvaluationComments from '../FormEvaluationComments'
import SelectEmployees from '../SelectEmployees'
import TableEvaluationCriteria from '../TableEvaluationCriteria'

const ATTITUDE_TYPE = 3
interface TaskFormItemProps {
  defaultAppraiser: string | number | undefined
  task: EvaluationTaskForm
  appraisersList: OptionItem[]
  typeOfWorkList: TypeOfWork[]
  index: number
  removable?: boolean
  errors: any
  touched: any
  disabled?: boolean
  onDelete: () => void
  setFieldValue: (keyName: string, value: any) => void
  isAddEvaluation: boolean
  directManager?: string
}

const TaskFormItem = ({
  task,
  index,
  errors,
  touched,
  onDelete,
  removable = true,
  setFieldValue,
  appraisersList,
  typeOfWorkList,
  disabled,
  defaultAppraiser,
  isAddEvaluation,
  directManager,
}: TaskFormItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const { projectsEvaluationCycle }: CommonState = useSelector(commonSelector)
  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )
  const { staff }: AuthState = useSelector(selectAuth)

  const [difficultyListOptions, setDifficultyListOptions] = useState<
    OptionItem[]
  >([])
  const [evaluationCriteriaRows, setEvaluationCriteriaRows] = useState<
    RowEvaluationCriteria[]
  >([])

  const [tmpAppraiserList, setTmpAppraiserList] = useState<OptionItem[]>()
  const getAppraisersList = useMemo(() => {
    return appraisersList
  }, [appraisersList])

  useEffect(() => {
    const projectManagers: OptionItem[] | undefined = projectsEvaluationCycle
      .find(item => item.id === task.projectId)
      ?.projectManagers?.map((item: IProjectManager) => ({
        code: item.code,
        description: item.email,
        email: item.email,
        id: item.id,
        label: item.name,
        value: item.id,
      }))
      ?.filter(
        projectManager => projectManager.id.toString() !== staff?.id.toString()
      )
    if (projectManagers && projectManagers.length > 0) {
      if (getAppraisersList) {
        setTmpAppraiserList(
          projectManagers?.concat(
            getAppraisersList.filter(
              appraiser =>
                !projectManagers.some(
                  (projectManager: OptionItem) =>
                    projectManager.id === appraiser.id
                )
            )
          )
        )
      }
    }
    if (task.projectId === 'none') {
      setFieldValue(`appraiserId`, directManager)
    }
    if (projectManagers && projectManagers.length > 1) {
      setFieldValue(`appraiserId`, '')
    }
  }, [task.projectId, appraisersList])

  useEffect(() => {
    setFieldValue(`appraiserId`, defaultAppraiser)
  }, [defaultAppraiser])

  const [meaning, setMeaning] = useState<string>('')
  const formEvaluationCommentsRef = useRef<any>(null)

  const isAppraisee = useMemo(() => {
    return +cycleInformation.staff?.id === staff?.id
  }, [cycleInformation, staff])

  const workType = useMemo(() => {
    return typeOfWorkList
      .filter((item: TypeOfWork) => item.type.id !== ATTITUDE_TYPE)
      .map((item: TypeOfWork) => ({
        ...item.type,
        value: item.type?.id,
        label: item.type?.name,
      }))
  }, [typeOfWorkList])

  const typeOfWork = typeOfWorkList.find(
    (item: TypeOfWork) => item.type.id == task?.typeOfWork
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

  const fillCriteriaByWorkType = () => {
    const typeOfWork = typeOfWorkList.find(
      (item: TypeOfWork) => item.type.id == task.typeOfWork
    )
    setFieldValue('criteriaGroupId', typeOfWork?.id || '')
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

  const handleDeleteTask = () => {
    onDelete()
  }

  const handleInputDropdownChange = (
    value: string,
    option: any,
    keyName?: string
  ) => {
    setFieldValue(`${keyName}` || '', value)
    switch (keyName) {
      case 'projectId': {
        const _listAppraisers =
          option.projectManagers?.map((pm: IProjectManager) => ({
            id: pm.id,
            value: pm.id,
            label: pm.name,
          })) || []
        if (_listAppraisers?.length === 1) {
          if (_listAppraisers[0]?.value?.toString() === staff?.id?.toString())
            setFieldValue(`appraiserId`, directManager)
          else setFieldValue(`appraiserId`, _listAppraisers[0].value)
        }
        break
      }
    }
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

  const handleChangeEffort = (value: string | undefined) => {
    if (Number(value) > MAXIMUM_EFFORT) {
      setFieldValue('effort', MAXIMUM_EFFORT.toString())
    } else {
      setFieldValue('effort', value)
    }
  }

  const onTypeOfWorkChange = () => {
    if (task?.typeOfWork) {
      fillCriteriaByWorkType()
    }
  }

  const onDifficultyChange = () => {
    if (task?.difficultyId) {
      const option = difficultyListOptions?.find(
        item => item.id === task.difficultyId + ''
      )
      setMeaning(option?.note || '')
    }
  }

  useEffect(() => {
    if (
      !task.taskEvaluationDetails?.length ||
      typeOfWork?.criteria.length !== task.taskEvaluationDetails?.length
    ) {
      setFieldValue(
        `taskEvaluationDetails`,
        typeOfWork?.criteria.map(() => ({
          criteriaDetailId: '',
          comment: '',
          commentType: '2',
        }))
      )
    }
  }, [task.taskEvaluationDetails, typeOfWork])

  useEffect(() => {
    onTypeOfWorkChange()
  }, [task?.typeOfWork])

  useEffect(() => {
    onDifficultyChange()
  }, [task?.difficultyId, difficultyListOptions])

  return (
    <Box className={classes.rootTaskFormItem}>
      <Box className={classes.formTitle}>
        <Box className={classes.titleBox}>
          <Box className="text">{i18Mbo('LB_TASK')}:</Box>
          <Box className={classes.order}>{`#${index + 1}`}</Box>
        </Box>
        <ConditionalRender conditional={removable && !disabled}>
          <DeleteIcon onClick={handleDeleteTask} />
        </ConditionalRender>
      </Box>

      <Box className={classes.body}>
        <Box className={classes.taskName}>
          <InputTextLabel
            required
            disabled={disabled}
            error={!!errorMessage('name') && isTouched('name')}
            errorMessage={errorMessage('name')}
            value={task?.name}
            label={i18Mbo('LB_TASK_NAME')}
            placeholder={i18Mbo('PLH_INPUT_TASK_NAME')}
            onChange={(e: EventInput) => setFieldValue(`name`, e.target.value)}
          />
        </Box>

        <Box className={classes.typeOfWork}>
          <InputDropdown
            required
            isDisable={disabled}
            width={270}
            error={!!errorMessage('typeOfWork') && isTouched('typeOfWork')}
            errorMessage={errorMessage('typeOfWork')}
            keyName="typeOfWork"
            label={i18Mbo('LB_TYPE_OF_WORK')}
            placeholder={i18Mbo('PLH_SELECT_TYPE_OF_WORK')}
            value={task?.typeOfWork || ''}
            listOptions={workType}
            onChange={handleInputDropdownChange}
          />
        </Box>

        <Box className={classes.project}>
          <InputDropdown
            required
            isDisable={disabled}
            error={!!errorMessage('projectId') && isTouched('projectId')}
            errorMessage={errorMessage('projectId')}
            keyName="projectId"
            label={i18('LB_PROJECT')}
            placeholder={i18('PLH_SELECT_PROJECT')}
            value={task?.projectId}
            listOptions={[
              {
                id: 'none',
                value: 'none',
                label: 'None',
              },
              ...projectsEvaluationCycle,
            ]}
            onChange={handleInputDropdownChange}
          />
        </Box>

        <SelectEmployees
          disabled={disabled}
          value={task?.appraiserId}
          error={errorMessage('appraiserId')}
          touched={isTouched('appraiserId')}
          setFieldValue={value => setFieldValue(`appraiserId`, value)}
          projectId={task?.projectId}
          appraisers={
            tmpAppraiserList
              ? tmpAppraiserList
              : appraisersList
              ? appraisersList
              : []
          }
        />

        <InputCurrency
          required
          disabled={disabled}
          suffix={'%'}
          error={!!errorMessage('effort') && isTouched('effort')}
          errorMessage={errorMessage('effort')}
          className={classes.inputEffort}
          label={i18Mbo('LB_EFFORT')}
          placeholder={i18Mbo('PLH_EFFORT')}
          value={task?.effort}
          onChange={value => handleChangeEffort(value)}
          maxLength={3}
        />

        {!isAppraisee && (
          <Box className={classes.difficultySelect}>
            <InputDropdown
              required
              error={
                !!errorMessage('difficultyId') &&
                isTouched('difficultyId') &&
                !!task?.typeOfWork
              }
              errorMessage={errorMessage('difficultyId')}
              isShowClearIcon={false}
              width={120}
              keyName="difficultyId"
              label={i18Mbo('LB_DIFFICULTY')}
              value={task?.difficultyId}
              listOptions={difficultyListOptions}
              onChange={handleInputDropdownChange}
              isDisable={!task?.typeOfWork || disabled}
              placeholder={i18Mbo('PLH_DIFFICULTY')}
            />
            <ConditionalRender conditional={!!task?.difficultyId}>
              <FormItem
                className={classes.meaningContainer}
                label={i18Mbo('LB_MEANING')}
              >
                <Box>{meaning}</Box>
              </FormItem>
            </ConditionalRender>
          </Box>
        )}

        <Box className={classes.tableEvaluation}>
          <TableEvaluationCriteria
            disabled={disabled}
            required={true}
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
            currentTaskEvaluationDetails={[]}
            rows={evaluationCriteriaRows}
            setLevelValues={handleLevelValuesChange}
            levelValues={levelValues || []}
          />
        </Box>

        <Box className={classes.tableEvaluation}>
          <FormEvaluationComments
            isDetail={false}
            error={commentError}
            errorMessage={commentErrorMessage}
            disabled={disabled}
            ref={formEvaluationCommentsRef}
            generalComment={task?.comment}
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
  titleBox: {
    display: 'flex',
    gap: theme.spacing(1),
    fontWeight: 500,
  },
  order: {
    color: theme.color.blue.primary,
  },
  title: {
    color: theme.color.blue.primary,
  },
  body: {
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateColumns: '1fr 1fr 1fr ',
  },
  inputEffort: {
    width: theme.spacing(10),
    justifyContent: 'space-between',
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
  },
}))
export default TaskFormItem
