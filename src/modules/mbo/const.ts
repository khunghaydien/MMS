import { IStatusConstant, OptionItem } from '@/types'

export const SCORE_LIST_OPTIONS = [
  {
    id: '1',
    label: '1',
    value: '1',
  },
  {
    id: '2',
    label: '2',
    value: '2',
  },
  {
    id: '3',
    label: '3',
    value: '3',
  },
  {
    id: '4',
    label: '4',
    value: '4',
  },
  {
    id: '5',
    label: '5',
    value: '5',
  },
  {
    id: '6',
    label: '6',
    value: '6',
  },
  {
    id: '7',
    label: '7',
    value: '7',
  },
  {
    id: '8',
    label: '8',
    value: '8',
  },
  {
    id: '9',
    label: '9',
    value: '9',
  },
  {
    id: '10',
    label: '10',
    value: '10',
  },
]
export const MAX_CRITERIA_REQUESTS = 20
export const MAX_EVALUATION_SCALE = 10
export const EMPLOYEE_WORK_TASKS = 1
export const MANAGERIAL_WORK_TASKS = 2
export const ATTITUDE = 3
export const CRITERIA_TEXT_MAX_LENGTH = 100
export const MAX_LENGTH_OPEN_DATA = 3
export const DETAIL_EVALUATION_PERIOD = 1
export const DETAIL_EVALUATION_ATTITUDE = 2

export const MY_EVALUATION = 1
export const MY_TEAM_MEMBER_EVALUATION = 2
export const MY_PROJECT_MEMBER_EVALUATION = 3
export const DURATION_DEFAULT = 0

export const ALL_CYCLE = 1
export const EVALUATE_AS_APPRAISER = 2
export const APPROVE_AS_REVIEWER = 3

export const CYCLE_STEP = {
  APPRAISEES_LIST: 1,
  APPRAISER_AND_REVIEWERS_LIST: 2,
  CRITERIA_INFORMATION: 3,
  ADVANCE_SETTING: 4,
}

export const EVALUATION_CYCLE_STATUS = {
  UP_COMING: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  DELAYED: 4,
  NOT_START: 5,
}

export const CYCLE_STATUS: { [key: number]: IStatusConstant } = {
  [EVALUATION_CYCLE_STATUS.UP_COMING]: {
    type: 1,
    label: 'Upcoming',
    color: 'yellow',
  },
  [EVALUATION_CYCLE_STATUS.IN_PROGRESS]: {
    type: 2,
    label: 'In Progress',
    color: 'blue',
  },
  [EVALUATION_CYCLE_STATUS.COMPLETED]: {
    type: 3,
    label: 'Completed',
    color: 'green',
  },
  [EVALUATION_CYCLE_STATUS.DELAYED]: {
    type: 4,
    label: 'Delayed',
    color: 'grey',
  },
  [EVALUATION_CYCLE_STATUS.NOT_START]: {
    type: 5,
    label: 'Not Started',
    color: 'orange',
  },
}

export const LIST_STATUS_CYCLE: OptionItem[] = [
  {
    id: EVALUATION_CYCLE_STATUS.NOT_START,
    label: CYCLE_STATUS[EVALUATION_CYCLE_STATUS.NOT_START].label,
    value: EVALUATION_CYCLE_STATUS.NOT_START,
  },
  {
    id: EVALUATION_CYCLE_STATUS.UP_COMING,
    label: CYCLE_STATUS[EVALUATION_CYCLE_STATUS.UP_COMING].label,
    value: EVALUATION_CYCLE_STATUS.UP_COMING,
  },
  {
    id: EVALUATION_CYCLE_STATUS.IN_PROGRESS,
    label: CYCLE_STATUS[EVALUATION_CYCLE_STATUS.IN_PROGRESS].label,
    value: EVALUATION_CYCLE_STATUS.IN_PROGRESS,
  },
  {
    id: EVALUATION_CYCLE_STATUS.COMPLETED,
    label: CYCLE_STATUS[EVALUATION_CYCLE_STATUS.COMPLETED].label,
    value: EVALUATION_CYCLE_STATUS.COMPLETED,
  },
  {
    id: EVALUATION_CYCLE_STATUS.DELAYED,
    label: CYCLE_STATUS[EVALUATION_CYCLE_STATUS.DELAYED].label,
    value: EVALUATION_CYCLE_STATUS.DELAYED,
  },
]

export const APPROVED = 1
export const NOT_APPROVED = 2
export const DRAFT = 3
export const REJECTED = 4
export const APPRAISEE_LIST = 'appraisee-list'
export const MBO_TAB_ALL = 4
export const EVALUATION_PERIOD_STEP = { JOB_RESULT: 0, ATTITUDE: 1 }
export const MAXIMUM_EFFORT = 100

export const APPRAISEES_EVALUATED = 1
export const APPRAISER_1_EVALUATED = 2
export const APPRAISER_2_EVALUATED = 3
export const REVIEWER_EVALUATED = 4

export const ACHIEVEMENT_STATUS = {
  DRAFT: 1,
  NOT_APPROVED: 2,
  APPROVED: 3,
  REJECT: 4,
}
