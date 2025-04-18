import {
  FileItem,
  IPosition,
  IProjectManager,
  IStaffInfo,
  OptionItem,
} from '@/types'

export interface CriteriaQueryString {
  name?: string
  positionId?: string
  type?: string
  pageNum?: number
  pageSize?: number
}
export interface IPayloadCreateCycle {
  evaluationCycleTemplateId: string
  appraisees: number[] | string[]
  appraiser: number | string
  reviewer: number | string
}
export interface IPayloadUpdateAppraisees {
  appraisees: number[] | string[]
}
export interface IPayloadUpdateCycle {
  cycleId: string
  requestBody: {
    appraisees: number[] | string[]
  }
}

export interface ICriteriaGroupInformation {
  name: string
  type: string
  positionApplied: any
  description: string
  isAllPosition?: boolean
}

export interface ICriteriaDetailRequest {
  id: number
  score: string
  content: string
}

export interface CriteriaRequest {
  id: number
  name: string
  description: string
  criteriaDetail: ICriteriaDetailRequest[]
  draft?: boolean
  weight?: number
}

export interface ICriteriaGroupDataForm {
  id?: number
  name: string
  type: any
  positionApplied: any
  description: string
  isAllPosition?: boolean
  criteria: CriteriaRequest[]
}

export interface CycleQueryString {
  pageNum?: number
  pageSize?: number
  positions?: OptionItem[]
  duration?: string
  status?: OptionItem[]
  name?: string
}

export interface IPayloadCycleQueryString {
  pageNum?: number
  pageSize?: number
  positionId?: string
  duration?: string
  status?: string
  name?: string
}

export interface ICycleDetail {
  id: string
  name: string
  appraisees: OptionItem[]
  appraiser: OptionItem
  duration: number
  reviewer: OptionItem
  startDate: number
  endDate: number
  position: any[]
  status: any
  attitudeWeight: number
  jobCompetencyWeight: number
  isTemplate: boolean
}

export interface IWorkType {
  id: string | number
  name: string
  difficultyWorkType: IDifficultyWorkType[]
}

export interface IDifficultyWorkType {
  id: string
  score: string
  content: string
}

export interface ICriteriaGroup {
  criteria: CriteriaRequest[]
  description: string
  id: string | number
  name: string
  positionApplied: any
  type: IWorkType
  weight: number
}
export interface EvaluationCycleItem {
  name?: string
  duration?: number
  startDate?: number
  endDate?: number
  status?: OptionItem
  id?: number
  appraisees?: IStaffInfo[]
  position?: any
  reviewer?: IProjectManager
  appraiser?: IProjectManager
  isTemplate?: boolean
  evaluationCycleStaffId?: string | number
}

export interface ECListQueryParameters {
  duration?: number | null | undefined
  name?: string
  pageNum?: number
  pageSize?: number
  tab?: string
}

export interface ECListQueryParametersReviewer {
  duration?: number | null | undefined
  name?: string
  pageNum?: number
  pageSize?: number
  tab: number
}

export interface RowEvaluationCriteria {
  id: number
  name: string
  weight: number
  levelListOptions: OptionItem[]
}
export interface ICardAppraisee {
  id?: string | number
  fullName: string
  employeeID: string
  position: string
  email: string
  status?: {
    id: number
    name: string
  }
}

export interface EvaluationTaskForm {
  criteria?: CriteriaRequest[]
  id: string
  name: string
  criteriaGroupId?: string
  typeOfWork?: any
  projectId: string
  projectManagerId?: string
  appraiserId?: string
  difficultyId: string
  startDate?: number | null
  endDate?: number | null
  effort: string
  comment: string
  taskEvaluationDetails: any
  duration?: number
  processingStatus: number | null
  reasonDifficulty?: string
  commentType?: string
}

export interface EvaluationInformation {
  name: string
  startDate: number | null
  endDate: number | null
  evaluateDate: Date
  taskRequests: EvaluationTaskForm[]
  attitudes: EvaluationTaskForm
  status: number
  processingStatus: number | null
}

export interface EvaluatePeriodInformation {
  taskEvaluationList: {
    taskId: string
    comment: string
    difficultyId: string
    taskEvaluationDetails: { comment: string; criteriaDetailId: string }[]
  }[]
}

export interface IPayloadAddNewTaskEvaluation {
  comment: string
  taskEvaluations: any
}

export interface DataJobResultRow {
  id: number
  name: string
  difficulty: number | string
  finalScore: number | string
  weight: number
  finalAppraiser2?: number | string
}

export interface TabJobResultItem {
  id: number
  name: string
  workType: {
    difficultyWorkType: IDifficultyWorkType[]
    id: number
    name: string
  }
  project: any
  startDate: number
  endDate: number
  effort: number | string | null
  difficulty: IDifficultyWorkType
  evaluationResponses: any
  evaluationDate: number | null
}

export interface IQueryParametersTaskDetailByEvaluation {
  evaluationCycleId: string
  type: 1 | 2
  tab: number
  staffId: string
}

export interface IQueryParametersSummary {
  evaluationCycleId: string
  staffId: string
}

export interface TaskEvaluationDetails {
  criteriaId: string
  criteriaName: string
  criteriaWeight: string
  criteriaScore: string
  criteriaContent: string
  criteriaComment: string
  criteriaDetailId: string
}
export interface IAppraiser {
  id: string
  evaluationId: string
  name: string
  code: string
  email: string
  comment: string
  finalScore: string
  taskEvaluationDetails: TaskEvaluationDetails[]
  isDraft?: boolean
}

export interface IJobResultAndAttitude {
  id: string
  name: string
  typeofWorkTask: string
  projectId: string
  projectName: string
  startDate: number
  endDate: number
  duration: number
  criteria: CriteriaRequest[]
  days: string
  difficulty: any
  effort: string
  evaluationDate: string
  appraiserSelected: any
  reviewer: OptionItem
  appraisee: IAppraiser
  appraisers: IAppraiser[]
  workTypeId: string
  status: {
    id: number
    name: string
  }
}

export interface EvaluationCycleStaff {
  code: string
  email: string
  id: number
  name: string
  position: IPosition
}

export interface AppraiseeItem {
  evaluationCycleStaffId?: number
  staff: EvaluationCycleStaff
  status: {
    id: number
    name: string
  }
}

export interface EvaluationCycleProjectMember {
  evaluationCycle: EvaluationCycleItem
  evaluationCycleStaffId: number
  staff: EvaluationCycleStaff
  status: {
    id: number
    name: string
  }
  project: any
  progresses?: any
}

export interface IQueryEvaluationAppraisees {
  name: string
  pageNum: number
  pageSize: number
  projectId?: string
  status: string
}

export interface TaskTitle {
  no: number
  name: string
}

export interface AchievementListItemView {
  id?: string | number
  evaluationCycleStaffId?: number | string
  startDate?: number | null
  endDate?: number | null
  name?: string
  rateOverTotalScore?: string | number
  description?: string
  evidences?: FileItem[]
  dayAdded?: number
  status?: {
    id: number
    name: string
  }
  createdBy?: {
    id: string | number
  }
}
export interface TypeOfWork {
  criteria: CriteriaRequest[]
  description: string
  id: number
  weight: number
  isAllPosition: boolean
  name: string
  type: IWorkType
}

export interface UpdateAchievementPayload {
  preAchievementName: string
  achievementId: string | number
  evaluationCycleId: string | number
  evaluationCycleStaffId: string | number
  requestBody: {
    startDate: number
    endDate: number
    name: string
    rateOverTotalScore: string | number
    status: number
  }
  evidences: FileItem[]
}

export interface EvaluationPeriodSummaryResponseRowItem {
  id: number | string
  name: string
  jobResult: string
  attitude: string
  startDate: number
  endDate: number
  evaluateDate: number
  totalScore: string
}

export interface AchievementSummaryResponseRowItem {
  id: number
  name: string
  rate: number
  startDate: number
  endDate: number
  dayAdded: number
  finalScore: string | number
}

export interface SummaryState {
  jobResult: string
  attitude: string
  achievement: string
  finalEvaluationScore: string
  rate: string | number
  evaluationPeriods: EvaluationPeriodSummaryResponseRowItem[]
  achievements: AchievementSummaryResponseRowItem[]
  averageAttitude: string
  averageFinalScore: string
  averageJobResult: string
  totalAchievement: string
  totalRate: string
  isAbleToSubmit?: boolean
}

export interface EvaluationProgressColumn {
  appraisees: boolean
  appraiser1: boolean
  appraiser2: boolean
  number: number
}
