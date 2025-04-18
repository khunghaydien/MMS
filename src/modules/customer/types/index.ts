import { Division, MasterCommonType, OptionItem, Province } from '@/types'

export type ICustomer = {
  signNda: boolean
  name: string
  branchId: string
  priority: string
  serviceIds: OptionItem[]
  collaborationStartDate: Date | null
  status: string
  scale: string
  website: string
  contactName: string
  contactPhoneNumber: string | null
  emailAddress: string
  contactNote: string | null
  contactPersonId: OptionItem
  marketId: string
  id?: string
  provinceIds: any
  workingTitle: string
  languageIds: string
  abbreviation: string
  divisionIds: any
  taxNumber: string
}

export interface ICustomerRequest {
  signNda: boolean
  name: string
  branchId: string
  priority: string
  serviceId: string[] | number[]
  collaborationStartDate: number | string
  status: number | string
  scale: string
  website: string
  contactName: string
  contactPhoneNumber: string
  emailAddress: string
  contactNote: string
  contactPersonId: string[] | number[]
}

export interface IContract {
  id?: string
  code: string
  type: OptionItem
  group: OptionItem
  startDate: Date | null
  endDate: Date | null
  status: OptionItem
  value: string
  expectedRevenue: string
  note: string
}

export interface IProject {
  endDate: Date | null
  id: string
  name: string
  startDate: Date | null
  status: any
  totalCurrentRevenue: number
  type: string
  technologies: ITechnology[]
}

export interface ITechnology {
  skillSetId: number | string | null
  skillSetGroupId: number | string | null
  name: string | null
  note: string | null
}

export type Optional<T> = {
  [K in keyof T]?: T[K]
}

export type ListPartnersParams = {
  branchId?: string
  collaborationStartDate?: string | number | null
  keyword?: string
  pageNum?: number
  pageSize?: number
  priority?: string | number | null
  skillSetIds?: any
  serviceIds?: any
  startDate?: Date | null
  endDate?: Date | null
  orderBy?: string
  sortBy?: string
  locationId?: string
  languageIds?: any
  divisionIds?: any
}

export type IListCustomersParams = {
  branchId?: string
  collaborationStartDate?: string | number | null
  keyword?: string
  pageNum?: number
  pageSize?: number
  priority?: string | number | null
  serviceId?: any
  skillSetIds?: any
  startDate?: Date | null | undefined
  endDate?: Date | null | undefined
  orderBy?: string
  sortBy?: string
  marketId?: string
  languageIds?: any
  divisionIds?: any
}

export type CommonEmitPayload = {
  value: any
  key: string
}

export interface IStatus {
  type: number
  name: string
}

export interface ICustomerRequest {
  contract: IContract[]
  customer: ICustomer
}

export type ICustomerValid = {
  [key in keyof ICustomer]: {
    error: boolean
    errorMessage: string
  }
}

export type ContractValid = {
  [key in keyof IContract]: {
    error: boolean
    errorMessage: string
  }
}

export interface OptionItemResponse {
  id?: string | number
  name?: string
  note?: any
}

export interface IPartnerGeneralRes {
  branch: OptionItemResponse
  collaborationStartDate: number
  id: string
  scale: string
  status: OptionItemResponse
  name: string
  signNda: boolean
  strengths: any[]
  website: string
  noteStatus: any
  priority: OptionItemResponse
  person: any
  location: {
    id: number
    acronym: string
    name: string
    note: any
  }
  cityId?: string
  provinces: Province[]
  contactPersons: OptionItem | null
  languageIds: string
  abbreviation: string
  divisions: Division[]
  taxNumber: string
}

export interface IPartnerContactRes {
  contactName: string
  emailAddress: string
  contactPhoneNumber: string
  contactNote: string
  workingTitle: string
}

export interface PartnerDetailResponse {
  general: IPartnerGeneralRes
  contact: IPartnerContactRes
  contracts: any[]
  projects: any[]
}

export interface IDataDashboard {
  customerBasedOnStatus: ICustomerHighChart
  partnerBasedOnStatus: IPartnerHighChart
  totalCustomerCost: ITotalCustomerCost
  totalPartnerCost: ITotalPartnerCost
}

export interface ICustomerHighChart {
  total: number
  ratio: IDashboardPercent[]
}

export interface IPartnerHighChart {
  total: number
  ratio: IDashboardPercent[]
}

export interface IDashboardPercent {
  percent: number
  status: {
    id: string | number
    name: string
  }
  count: number
}

export interface ITotalCustomerCost {
  total: number
  customers: Array<{
    id: string
    name: string
    revenue: number
    skillSets: string
  }>
}

export interface ITotalPartnerCost {
  total: number
  partners: Array<{
    id: string
    name: string
    cost: number
    strength: string
  }>
}

export interface ICreateContractPayload {
  id: string
  data: IContract
}

export interface IContractDetailPayload {
  id: string
  contractId: string
  data?: IContract
}

export interface IContractResponse {
  id: string
  code: string
  type: MasterCommonType
  group: MasterCommonType
  startDate: number
  endDate: number
  status: MasterCommonType
  value: number
  expectedRevenue: number
  note: string
}
