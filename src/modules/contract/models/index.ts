import { OptionItem } from '@/types'

export interface GetListContractsQuery {
  pageSize: number
  pageNum: number
  //...
}

export interface ContractStaffInformationRequest {
  id?: string
  levelName?: string
  note?: string
  positionName?: string
  rate: string | number
  skillIds?: any
  staffId?: number | string
  staffName?: string
  unitOfTime?: number | string
  sourceStaff?: number | string
  level?: string
  startDate?: Date | null | number
  endDate?: Date | null | number
  currencyId?: string
  codeCurrency?: string
  price: string
  viewOnly?: boolean
}

export interface IListContractsParams {
  branchId?: string
  endDateFrom?: number | null
  endDateTo?: number | null
  contractGroup?: number | null
  startDateFrom?: number | null
  startDateTo?: number | null
  startDate?: Date | null
  endDate?: Date | null
  contractType?: number | null
  keyword?: string | null
  orderBy?: string | null
  pageNum?: number | null
  pageSize?: number | null
  person?: number | null
  sortBy?: string | null
  status?: string | null
  source?: number | null
  signDateFrom?: number | null
  signDateTo?: number | null
  contactPerson?: any
  buyerId?: any
  sellerId?: any
  createPerson?: any
}
export type PayloadContractGeneral = {
  id: string
  data: IContractGeneralRequest
}
export interface IContractGeneralRequest {
  branchId?: string
  buyerId?: string
  contactPerson?: number
  contractNumber?: string
  description?: string
  dueDatePayment?: number
  endDate?: number
  group?: number
  modifiedStatusDate?: number
  projectAbbreviationName?: string
  selectContractGroup?: string
  sellerId?: string
  signDate?: number
  source?: number
  startDate?: number
  status?: number
  type?: number
  value?: number
}

export interface RelatedContract {
  id?: string
  contractNumber?: string
  group?: number
  type?: number
  signDate?: number | null
  startDate?: number | null
  endDate?: number | null
  status?: number
}

export interface ProjectContractInformation {
  code?: string
  endDate?: number | null
  id?: number
  name?: string
  startDate?: number | null
  totalActualRevenue?: number | null
  totalExpectedRevenue?: number | null
}

export interface ContractHistoryItemResponse {
  historyId: number | string
  modifiedAt: number
  modifiedBy: OptionItem
  fields: string[]
  contract: OptionItem
  createBy: OptionItem
}

export interface ContractHistoryRenderItem {
  modifiedDate: string
  modifieldBy: string
  modifieldFields: string
}
