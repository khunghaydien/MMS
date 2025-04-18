import i18next from 'i18next'
import { ReportStatus } from '../types'

export const WORKING_HOURS_IN_DAY = 8
export const MAX_LENGTH_REPORT_DETAIL = 3
export const DAY_IN_WEEK = 7

export const REPORT_STATUS: { [key: string]: ReportStatus } = {
  REPORT: 0,
  DAY_OFF: 1,
  NO_REPORT: 2,
  HOLIDAY_BREAK: 3,
  LATE_REPORT: 4,
}
export const STATUS_CONFIRM = {
  PENDING: 1,
  APPROVED: 2,
  CANCEL: 3,
}

export const WORK_TYPE = [
  {
    id: 3,
    value: 3,
    label: 'Project Report',
  },
  {
    id: 1,
    value: 1,
    label: 'Task Report',
  },
  {
    id: 2,
    value: 2,
    label: 'General Work',
  },
]

export const WORK_TYPE_DAY_OFF = [
  {
    id: 4,
    value: 4,
    label: i18next.t('dailyReport:LB_DAY_OFF_HALF_DAY'),
    name: i18next.t('dailyReport:LB_DAY_OFF_HALF_DAY'),
  },
  {
    id: 5,
    value: 5,
    label: i18next.t('dailyReport:LB_DAY_OFF_FULL_DAY'),
    name: i18next.t('dailyReport:LB_DAY_OFF_FULL_DAY'),
  },
]

export const WORK_TYPE_VALUE = {
  TASK_REPORT: '1',
  GENERAL_REPORT: '2',
  PROJECT_REPORT: '3',
  DAY_OFF_HALF_DAY: '4',
  DAY_OFF_FULL_DAY: '5',
}

export const STATUS_OT_REPORT_VALUES = {
  IN_REVIEW: 1,
  CONFIRMED: 2,
  REJECTED: 3,
  APPROVED: 4,
}
export const STATUS_OT_REPORT_LABELS: any = {
  1: 'In Review',
  2: 'Confirmed',
  3: 'Rejected',
  4: 'Approved',
}
