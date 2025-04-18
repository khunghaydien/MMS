import { FieldListOptions } from '@/components/Form/CardForm/CardFormModeView'
import ToggleSectionIcon from '@/components/icons/ToggleSectionIcon'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { getTextEllipsis } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import EvaluationComments from '../EvaluationComments'
import TableTaskOrAttitudeEvaluation from '../TableTaskOrAttitudeEvaluation'

interface TaskAndEvaluationItemProps {
  index: number
  taskItem: any
  evaluationPeriodId: string
  onSubmitComment: (payload: {
    taskId: number | string
    comment: string
  }) => void
  isApproved: boolean
}

const TaskAndEvaluationItem = ({
  index,
  taskItem,
  evaluationPeriodId,
  onSubmitComment,
  isApproved,
}: TaskAndEvaluationItemProps) => {
  const classes = useStyles()
  const params = useParams()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { staff }: AuthState = useSelector(selectAuth)

  const isReviewerAppraiser2 =
    (staff?.id == taskItem.taskEvaluations?.appraiser_2?.appraiser?.id) ==
    taskItem.taskEvaluations?.reviewer?.appraiser?.id

  const [isShowMore, setIsShowMore] = useState(false)

  const listTaskInformation = useMemo(
    () => [
      {
        id: 'name',
        label: i18Mbo('LB_TASK_NAME'),
        value: taskItem.name,
      },
      {
        id: 'typeofWorkTask',
        label: i18Mbo('LB_TYPE_OF_WORK_TASK'),
        value: taskItem.workTask?.name,
      },
      {
        id: 'projectName',
        label: i18Project('LB_PROJECT_NAME'),
        value: !!taskItem.project?.name ? taskItem.project.name : 'None',
      },
      {
        id: 'effort',
        label: i18Mbo('LB_EFFORT'),
        value: `${taskItem.effort || 0}%`,
      },
    ],
    [taskItem]
  )

  const appraisees = useMemo(() => {
    return {
      code: taskItem.taskEvaluations.appraisees.appraiser.code,
      name: taskItem.taskEvaluations.appraisees.appraiser.name,
      id: taskItem.taskEvaluations.appraisees.id,
      comment: taskItem.taskEvaluations.appraisees.comment,
      difficulty: taskItem.taskEvaluations.appraisees.difficulty?.score || 0,
      averageScore: taskItem.taskEvaluations.appraisees.averageScore,
      taskEvaluationDetails:
        taskItem.taskEvaluations.appraisees.taskEvaluationDetails,
      difficultyLabel:
        taskItem.taskEvaluations.appraisees.difficulty?.content || '',
    }
  }, [taskItem.taskEvaluations?.appraisees])

  const listTableAppraiser = useMemo(() => {
    const appraiseesId = taskItem.taskEvaluations.appraisees.appraiser.id
    const _listTableAppraiser: any[] = []
    const uniqueId: any[] = [appraiseesId]
    for (const key in taskItem.taskEvaluations) {
      const item = taskItem.taskEvaluations[key]
      const isDuplicate = uniqueId.includes(item.appraiser?.id)
      if (!isDuplicate) {
        _listTableAppraiser.push({
          name: item.appraiser?.name,
          id: item?.id,
          difficulty: item.difficulty?.score || 0,
          reasonDifficulty: item.reasonDifficulty,
          taskEvaluationDetails: item?.taskEvaluationDetails,
          averageScore: item?.averageScore,
          isDraft: !!item?.isDraft,
          difficultyLabel: item.difficulty?.content || '',
        })
      }
    }
    return _listTableAppraiser
  }, [taskItem.taskEvaluation])

  const listAppraisersComment = useMemo(() => {
    const appraiseesId = taskItem.taskEvaluations.appraisees.appraiser.id
    const _listTableAppraiser: any[] = [appraisees]
    const uniqueId: any[] = [appraiseesId]
    for (const key in taskItem.taskEvaluations) {
      const item = taskItem.taskEvaluations[key]
      const isDuplicate = uniqueId.includes(item.appraiser?.id)
      if (!isDuplicate) {
        uniqueId.push(item.appraiser?.id)
        _listTableAppraiser.push({
          code: item.appraiser?.code,
          name: item.appraiser?.name,
          id: item?.id,
          taskEvaluationDetails: item?.taskEvaluationDetails,
          comment: item?.comment,
        })
      }
    }
    return _listTableAppraiser
  }, [taskItem.taskEvaluation, appraisees])

  useEffect(() => {
    if (!index) {
      setIsShowMore(true)
    }
  }, [])

  return (
    <Box className={classes.rootTaskAndEvaluationItem}>
      <Box className={classes.headerTaskAndEvaluationItem}>
        <Box className={classes.title}>
          <ToggleSectionIcon
            open={isShowMore}
            onToggle={() => {
              setIsShowMore(!isShowMore)
            }}
          />

          <Box className={classes.wrapTaskTitle}>
            <Box component="span" className={classes.taskAndEvaluationLabel}>
              {`${i18Mbo('LB_TASK')} #${index + 1}:`}
            </Box>

            <Box
              className={classes.taskAndEvaluationValue}
              component="span"
              title={taskItem.name}
            >
              {getTextEllipsis(taskItem.name, 80)}
            </Box>
          </Box>
        </Box>
        <Box className={classes.wrapButtonDeleteAndEdit}></Box>
      </Box>
      {isShowMore && (
        <Box className={classes.body}>
          <Box className={classes.taskInformation}>
            <FieldListOptions
              dataRendering={listTaskInformation}
              isVertical={false}
            />
          </Box>
          <TableTaskOrAttitudeEvaluation
            appraisers={listTableAppraiser || []}
            appraisee={appraisees}
            criteria={taskItem.criteriaGroup.criteria || []}
            showDifficultyRow={true}
          />
          <Box sx={{ marginTop: 3 }}>
            <EvaluationComments
              isApproved={isApproved}
              evaluationPeriodId={evaluationPeriodId}
              listAppraisers={listAppraisersComment || []}
              evaluationCycleId={params.evaluationCycleId || ''}
              taskId={taskItem.id || ''}
              commentReviewer={
                isReviewerAppraiser2
                  ? taskItem.taskEvaluations.appraiser_2
                  : {
                      ...taskItem.taskEvaluations.reviewer,
                      comment: taskItem.comment,
                    }
              }
              onSubmitComment={onSubmitComment}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTaskAndEvaluationItem: {
    borderRadius: '4px',
    border: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(2),
  },
  headerTaskAndEvaluationItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 700,
    color: theme.color.blue.primary,
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  wrapTaskTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  taskAndEvaluationLabel: {
    marginRight: theme.spacing(0.5),
  },
  taskAndEvaluationValue: {
    display: 'inline-block',
    color: theme.color.black.primary,
    fontSize: 18,
  },
  body: {
    marginTop: theme.spacing(3),
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(4),
  },
  taskInformation: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  label: {
    fontWeight: 700,
    fontSize: 14,
    maxWidth: theme.spacing(15),
  },
  taskScore: {
    border: '1px solid',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  toolTipScore: {
    padding: theme.spacing(0.5),
    '& .toolTipName': {
      fontWeight: 700,
      fontSize: 12,
    },
    '& .toolTipDescription': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '50px',
    cursor: 'pointer',
    backgroundColor: theme.color.blue.primary,
    borderColor: theme.color.blue.primary,
    color: '#FFFFFF !important',
    transition: 'all .1s',
    '&.disabled': {
      pointerEvents: 'none',
    },
    '& svg': {
      fontSize: 20,
    },
    '&:hover': {
      backgroundColor: theme.color.orange.primary,
      borderColor: theme.color.orange.primary,
      color: '#FFFFFF !important',
      '& *': {
        color: '#FFFFFF !important',
      },
    },
    '&.delete:hover': {
      backgroundColor: theme.color.error.primary,
      borderColor: theme.color.error.primary,
    },
  },
  status: {
    fontSize: 14,
    fontWeight: 700,
    '&.approved': {
      color: theme.color.green.primary,
    },
    '&.not-approved': {
      color: theme.color.error.primary,
    },
  },
  wrapButtonDeleteAndEdit: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}))

export default TaskAndEvaluationItem
