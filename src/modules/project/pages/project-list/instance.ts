import { PROJECT_STATUS, PROJECT_STATUS_TYPE } from '@/const/app.const'
import { OptionItem, TableHeaderColumn } from '@/types'

export const headCellProjectRevenueByProject: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: 'Code',
  },
  {
    id: 'date',
    align: 'left',

    label: 'Date',
  },
  {
    id: 'expectedRevenue',
    align: 'left',

    label: 'Expected Revenue (VND)',
  },
  {
    id: 'actualRevenue',
    align: 'left',

    label: 'Actual Revenue (VND)',
  },
  {
    id: 'statusRevenue',
    align: 'left',

    label: 'Revenue Status',
  },
  {
    id: 'note',
    align: 'left',
    label: 'Note',
  },
  {
    id: 'delete',
    align: 'left',
    label: 'Action',
  },
]

export const headCellProjectRevenueByDivision: TableHeaderColumn[] = [
  {
    id: 'no',
    align: 'left',
    label: 'Code',
  },
  {
    id: 'date',
    align: 'left',
    label: 'Date',
  },
  {
    id: 'division',
    align: 'left',
    label: 'Division',
  },
  {
    id: 'expectedRevenue',
    align: 'left',
    label: 'Expected Revenue (VND)',
  },
  {
    id: 'actualRevenue',
    align: 'left',
    label: 'Actual Revenue (VND)',
  },
  {
    id: 'statusRevenue',
    align: 'left',
    label: 'Revenue Status',
  },
  {
    id: 'note',
    align: 'left',
    label: 'Note',
  },
  {
    id: 'delete',
    align: 'left',
    label: 'Action',
  },
]

export const headCellProjectCost: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: 'Code',
  },
  {
    id: 'date',
    align: 'left',
    label: 'Date',
  },
  {
    id: 'source',
    align: 'left',
    label: 'Source',
  },
  {
    id: 'expectedCost',
    align: 'left',
    label: 'Expected Cost (VND)',
  },
  {
    id: 'actualCost',
    align: 'left',
    label: 'Actual Cost (VND)',
  },
  {
    id: 'note',
    align: 'left',
    label: 'Note',
  },
  {
    id: 'delete',
    align: 'left',
    label: 'Action',
  },
]

export const listCostOrigin = [
  {
    id: '1',
    label: 'Division',
    value: '1',
    disabled: false,
  },
  {
    id: '2',
    label: 'Partner',
    value: '2',
    disabled: false,
  },
]

export const listCurrency = [
  {
    id: '1',
    label: 'VND',
    value: 'vnd',
    disabled: false,
  },
  {
    id: '2',
    label: 'YEN',
    value: 'YEN',
    disabled: false,
  },
  {
    id: '3',
    label: 'USD',
    value: 'USD',
    disabled: false,
  },
]

export const projectStatus: OptionItem[] = [
  {
    id: PROJECT_STATUS_TYPE.NOT_STARTED,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.NOT_STARTED].label,
    value: PROJECT_STATUS_TYPE.NOT_STARTED,
  },
  {
    id: PROJECT_STATUS_TYPE.PENDING,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.PENDING].label,
    value: PROJECT_STATUS_TYPE.PENDING,
  },
  {
    id: PROJECT_STATUS_TYPE.IN_PROGRESS,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.IN_PROGRESS].label,
    value: PROJECT_STATUS_TYPE.IN_PROGRESS,
  },
  {
    id: PROJECT_STATUS_TYPE.COMPLETED,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.COMPLETED].label,
    value: PROJECT_STATUS_TYPE.COMPLETED,
  },
  {
    id: PROJECT_STATUS_TYPE.CANCELLED,
    label: PROJECT_STATUS[PROJECT_STATUS_TYPE.CANCELLED].label,
    value: PROJECT_STATUS_TYPE.CANCELLED,
  },
]
export const requestStatus: OptionItem[] = [
  {
    id: 1,
    label: 'Await Decision',
    value: '1',
  },
  {
    id: 2,
    label: 'Approved',
    value: '2',
  },
  {
    id: 3,
    label: 'Rejected',
    value: '3',
  },
]
export const effectStatus: OptionItem[] = [
  {
    id: 1,
    label: 'Not Start',
    value: '1',
  },
  {
    id: 2,
    label: 'In Effect',
    value: '2',
  },
  {
    id: 3,
    label: 'Terminated',
    value: '3',
  },
]
export const statusTimesheet: OptionItem[] = [
  {
    id: 1,
    label: 'In Review',
    value: '1',
  },
  {
    id: 2,
    label: 'Confirmed',
    value: '2',
  },
  {
    id: 3,
    label: 'Rejected',
    value: '3',
  },
  {
    id: 4,
    label: 'Approved',
    value: '4',
  },
]
