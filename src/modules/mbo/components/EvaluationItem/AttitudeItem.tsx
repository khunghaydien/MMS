import { AuthState, selectAuth } from '@/reducer/auth'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import EvaluationComments from '../EvaluationComments'
import TableTaskOrAttitudeEvaluation from '../TableTaskOrAttitudeEvaluation'

interface AttitudeItemProps {
  taskItem: any
  evaluationPeriodId: string
  onSubmitComment: (payload: {
    taskId: number | string
    comment: string
  }) => void
  isApproved: boolean
}

const AttitudeItem = ({
  taskItem,
  evaluationPeriodId,
  onSubmitComment,
  isApproved,
}: AttitudeItemProps) => {
  const classes = useStyles()
  const params = useParams()

  const { staff }: AuthState = useSelector(selectAuth)

  const isReviewerAppraiser2 =
    (staff?.id == taskItem.taskEvaluations?.appraiser_2?.appraiser?.id) ==
    taskItem.taskEvaluations?.reviewer?.appraiser?.id

  const appraisees = useMemo(() => {
    return {
      code: taskItem.taskEvaluations.appraisees.appraiser.code,
      name: taskItem.taskEvaluations.appraisees.appraiser.name,
      id: taskItem.taskEvaluations.appraisees.appraiser.id,
      comment: taskItem.taskEvaluations.appraisees.comment,
      averageScore: taskItem.taskEvaluations.appraisees.averageScore,
      taskEvaluationDetails:
        taskItem.taskEvaluations.appraisees.taskEvaluationDetails,
    }
  }, [taskItem.taskEvaluations?.appraisees])

  const listTableAppraiser = useMemo(() => {
    const _listTableAppraiser: any[] = []
    const uniqueId: any[] = [appraisees.id]
    for (const key in taskItem.taskEvaluations) {
      const item = taskItem.taskEvaluations[key]
      const isDuplicate = uniqueId.includes(item.appraiser?.id)
      if (!isDuplicate) {
        uniqueId.push(item.id)
        _listTableAppraiser.push({
          name: item.appraiser?.name,
          id: item.appraiser?.id,
          taskEvaluationDetails: item.taskEvaluationDetails,
          averageScore: item.averageScore,
          isDraft: !!item.isDraft,
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
          id: item.id,
          taskEvaluationDetails: item.taskEvaluationDetails,
          comment: item.comment,
        })
      }
    }
    return _listTableAppraiser.filter(item => !!item.code)
  }, [taskItem.taskEvaluation, appraisees])

  return (
    <Box className={classes.rootAttitudeItem}>
      <TableTaskOrAttitudeEvaluation
        appraisers={listTableAppraiser || []}
        appraisee={appraisees}
        criteria={taskItem.criteriaGroup.criteria || []}
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
  )
}

const useStyles = makeStyles((theme: Theme) => ({ rootAttitudeItem: {} }))

export default AttitudeItem
