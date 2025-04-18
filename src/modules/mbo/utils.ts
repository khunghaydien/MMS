import { IStatusType } from '@/components/common/StatusItem'
import { OptionItem } from '@/types'
import { countingDays } from '@/utils'
import i18next from 'i18next'
import { EMPLOYEE_WORK_TASKS } from './const'

export const formatCriteriaList = (value: any) => {
  return {
    ...value,
    useDeleteIcon: true,
    positionApplied: value.isAllPosition
      ? i18next.t('common:LB_ALL_POSITION')
      : value.positionApplied
          ?.map((item: OptionItem) => item.name)
          ?.join(', ') || '',
  }
}

export const criteriaType = (value: OptionItem): IStatusType => {
  if (value?.id == EMPLOYEE_WORK_TASKS) {
    return { color: 'green', label: value?.name || '' }
  } else {
    return { color: 'red', label: value?.name || '' }
  }
}

export const formatDataEvaluation = (jobResultAndAttitude: any) => {
  return {
    id: jobResultAndAttitude.id,
    name: jobResultAndAttitude.name,
    typeofWorkTask: jobResultAndAttitude.workType.name,
    projectName: jobResultAndAttitude.project?.name || '',
    projectId: jobResultAndAttitude.project?.id || '',
    startDate: jobResultAndAttitude.startDate,
    endDate: jobResultAndAttitude.endDate,
    criteria: jobResultAndAttitude.criteriaGroups?.criteria || [],
    status: jobResultAndAttitude.status,
    duration: jobResultAndAttitude.duration,
    days: countingDays(
      jobResultAndAttitude.startDate,
      jobResultAndAttitude.endDate
    ),
    difficulty: jobResultAndAttitude.difficulty,
    effort: jobResultAndAttitude.effort,
    evaluationDate: jobResultAndAttitude.evaluationDate,
    workTypeId: jobResultAndAttitude?.workType?.id,
    appraiserSelected: jobResultAndAttitude.appraiser,
    reviewer: {
      ...jobResultAndAttitude.reviewer,
      comment: jobResultAndAttitude.comment?.trim(),
    },
    appraisee: formatAppraiser(jobResultAndAttitude.evaluations[0]) || null,
    appraisers:
      jobResultAndAttitude.evaluations
        ?.filter((evaluation: any, index: number) => index > 0)
        .map((item: any) => formatAppraiser(item)) || [],
  }
}

export const formatAppraiser = (evaluation: any) => {
  return {
    evaluationId: evaluation?.id,
    id: evaluation?.appraiser?.id || '',
    code: evaluation?.appraiser?.code || '',
    name: evaluation?.appraiser?.name || '',
    email: evaluation?.appraiser?.email || '',
    comment: evaluation?.comment || '',
    finalScore: evaluation?.finalScore || 0,
    taskEvaluationDetails: evaluation?.taskEvaluationDetails?.map(
      (item: any) => ({
        criteriaId: item.criteria.id,
        criteriaName: item.criteria.name,
        criteriaWeight: item.criteria.weight,
        criteriaScore: item.criteriaDetail.score,
        criteriaContent: item.criteriaDetail.content,
        criteriaDetailId: item.criteriaDetail.id,
        criteriaComment: item.comment,
      })
    ),
  }
}

export const formatAppraiserAttitude = (evaluation: any) => {
  return {
    evaluationId: '',
    id: evaluation?.appraiser?.id || '',
    code: evaluation?.appraiser?.code || '',
    name: evaluation?.appraiser?.name || '',
    email: evaluation?.appraiser?.email || '',
    comment: '',
    finalScore: evaluation?.finalScore || 0,
    taskEvaluationDetails: evaluation?.evaluationDetails?.map((item: any) => ({
      criteriaId: item.criteria.id,
      criteriaName: item.criteria.name,
      criteriaWeight: item.criteria.weight,
      criteriaScore: item.finalScore || 0,
      criteriaContent: item.criteria.description,
      criteriaDetailId: '',
      criteriaComment: '',
    })),
  }
}
