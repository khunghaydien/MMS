import { TableConstant } from '@/const'
import { IListContractsParams } from '../models'

export const CONTRACT_STEP = {
  GENERAL_INFORMATION: 0,
  STAFF_INFORMATION: 1,
}
// Due Date Method Type
export const DUE_DATE = 1
export const INSTALLMENT = 2
export const MAX_INSTALLMENTS = 10

// Contract Source
export const INTERNAL = 1
export const EXTERNAL = 2

export const CONTRACT_SOURCE_TYPE: { [key: number]: string } = {
  [INTERNAL]: 'Internal',
  [EXTERNAL]: 'External',
}
// Contract Group
export const NDA = 3
export const TEMPLATE = 1
export const ORDER = 2
export const CONTRACT_GROUP_TYPE: { [key: number]: string } = {
  [TEMPLATE]: 'Contract',
  [ORDER]: 'Sub-Contract',
  [NDA]: 'NDA/MOU',
}

// Contract Type
const LABO = 1
const PROJECT_BASE = 2

export const CONTRACT_SOURCE = [
  {
    id: INTERNAL,
    value: INTERNAL,
    label: 'Internal',
  },
  {
    id: EXTERNAL,
    value: EXTERNAL,
    label: 'External',
  },
]

// Order Type
export const REVENUE = 1
export const COST = 2

export const ORDER_TYPES = [
  {
    id: REVENUE,
    value: REVENUE,
    label: 'Revenue',
  },
  {
    id: COST,
    value: COST,
    label: 'Cost',
  },
]

export const CONTRACT_GROUP = [
  {
    id: NDA,
    value: NDA,
    label: 'NDA/MOU',
  },
  {
    id: TEMPLATE,
    value: TEMPLATE,
    label: 'Contract',
  },
  {
    id: ORDER,
    value: ORDER,
    label: 'Sub-Contract',
  },
]

export const CONTRACT_TYPE = [
  {
    id: PROJECT_BASE,
    value: PROJECT_BASE,
    label: 'Project Base',
  },
  {
    id: LABO,
    value: LABO,
    label: 'Labo',
  },
]

export const contractQueryParameters: IListContractsParams = {
  branchId: '',
  endDateFrom: null,
  endDateTo: null,
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  pageSize: TableConstant.LIMIT_DEFAULT,
  signDateFrom: null,
  signDateTo: null,
  contractGroup: null,
  startDateFrom: null,
  startDateTo: null,
  contractType: null,
  contactPerson: null,
  keyword: '',
  orderBy: '',
  person: null,
  sortBy: null,
  source: null,
  status: null,
  buyerId: null,
  sellerId: null,
}

export const CONTRACT_HISTORY_TYPE = {
  GENERAL_INFORMATION: 1,
  STAFF_INFORMATION: 2,
  UPLOAD_DOCUMENTS: 3,
}

export const DUE_DATE_METHOD_TYPE = [
  {
    id: DUE_DATE,
    value: DUE_DATE,
    label: 'Due Date',
  },
  {
    id: INSTALLMENT,
    value: INSTALLMENT,
    label: 'Installment',
  },
]
