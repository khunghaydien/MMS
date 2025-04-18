import { FileItem, OptionItem } from '@/types'
import { CancelTokenSource } from 'axios'
import { SkillSetListItem } from '../components/ModalExportSkillSets/ModalExportSkillSets'
import { ListStaffParams } from './staff-list'

export interface StaffProject {
  assignEndDate: number
  assignStartDate: number
  code: string
  endDate: number
  startDate: number
  headcount: number
  headcountUsed: number | null
  id: number
  name: string
  description: string | null
  role: string | null
  seeDetails: boolean | null
  teamSize: number | null
  viewProjects: boolean
  technologies: {
    name: string
    note: null | string
    skillSetGroupId: number | string
    skillSetId: number | string
  }[]
}
export interface StatusHistory {
  endDate?: number
  id?: number
  note?: string
  startDate?: number
  status?: {
    id?: number
    name?: string
  }
}

export interface StaffWorkingEvents {
  events: {
    date?: Date | number | undefined
    event?: string
    note?: string | null
    id?: number
  }[]
  title: string
}
export interface StaffState {
  staffWorkingHistory?: StaffWorkingEvents[]
  staffList: any[]
  staffListOutsource: any[]
  isLoadingStaffDetail: boolean
  generalInfoStaff: IGeneralInformationStaffState
  statusHistory: StatusHistory[]
  activeStep: number
  isRollbackGeneralStep: boolean
  skillSetStaffs: ISkillSetStaffState[]
  total: number
  totalHROutsource: number
  totalElementsStaff: number
  contracts: FileItem[]
  totalElementsContract: number
  totalElementsCertificate: number
  certificates: FileItem[]
  cvs: FileItem[]
  totalElementsCVs: number
  staffProject: {
    total?: number
    data?: StaffProject[]
  }
  staffHeadcounts: {
    monthly: string[] | number[]
    actual: string[] | number[]
    headcountUsedByMonth: boolean
  }
  skillSetList: SkillSetListItem[]
  staffDashboardStatisticPosition: any
  staffDashboardStatisticStatus: any
  staffDashboardComparison: any
  staffDashboardIdealStatsSE: any
  staffDashboardIdealStatsQC: any
  staffDashboardOnboardStatistic: any
  staffDashboardTurnoverRate: number
  isListFetching: boolean
  isListFetchingHROutsource: boolean
  cancelGetStaffList: CancelTokenSource | null
  cancelGetStaffListOutsource: CancelTokenSource | null
  staffQueryParameters: ListStaffParams
  hrOsQueryParameters: ListStaffParams
  fileName?: string
  fileContent?: string
  listChecked: string[]
  listHROutsouceChecked: string[]
  isCheckAll: boolean
  isCheckAllHROutsource: boolean
  isUpdateStaff: boolean
}

export interface StaffFilterDashboard {
  branchId: string
  startDate: Date | null | undefined
  endDate: Date | null | undefined
  divisionId: string
}
export interface StaffQueriesDashboard {
  branchId: string
  startDate: number | null | undefined
  endDate: number | null | undefined
  divisionId: string
}
export type StepConfig = {
  step: number
  label: string
  isVisible?: boolean
}

export type IGeneralInformationStaffState = {
  code?: string
  staffName: string
  gender: string
  birthday: Date | null
  email: string
  directManager: OptionItem
  branchId: string
  divisionId: string
  position: string
  onboardDate: Date | null
  gradeId: string
  leaderGradeId: string
  status: any
  jobType: string
  positionName?: string
  division?: OptionItem
  branch?: OptionItem
  statusName?: string
  jobTypeName?: string
  genderName?: string
  lastWorkingDate?: number | Date
  phoneNumber?: string
  customer: any
  partner: any
  contractExpiredDate: Date | null
  createdBy?: any
  statusHistory?: StatusHistory[]
  jobEndDate?: Date | null
  jobStartDate?: Date | null
  freelancerPeriods?:
    | {
        id?: number | null
        endDate: number | Date | null | undefined
        startDate: number | Date | null | undefined
      }[]
    | null
    | undefined
  workingTimeChanged?: boolean
  jobChangeRequest?: {
    isChangeJobType?: boolean
    jobType?: string
    onboardDate?: Date | null
    jobEndDate?: Date | null
    jobStartDate?: Date | null
    freelancerPeriods?:
      | {
          id?: number | null
          endDate: number | Date | null | undefined
          startDate: number | Date | null | undefined
        }[]
      | null
      | undefined
  }
}

export type IHROutsourcingState = {
  code?: string
  staffName: string
  gender: string
  email: string
  position?: string
  onboardDate: Date | null
  contractExpiredDate: Date | null
  status: StatusHistory
  positionName?: string
  branch?: OptionItem
  statusName?: string
  genderName?: string
  customer: OptionItem
  partner: OptionItem
  divisionId: string
  phoneNumber?: string
}

export type ISkillSetStaffState = {
  id?: string | number
  no?: number
  skillGroup: OptionItem
  skillName: OptionItem
  yearsOfExperience: string
  level: OptionItem
  note: string
  action?: [{ type: 'delete' }]
}

export type IParamsGrade = {
  positionId?: string
  gradeId?: string
}

export type IGeneralInformationStaffResponse = {
  code?: string
  name: string
  gender: string
  dateOfBirth: number
  email: string
  companyBranch: any
  division: any
  position: any
  grade: any
  leaderGrade: any
  directManager: any
  director: any
  onboardDate: number
  status: any
  jobType: any
  lastWorkingDate?: number
  phoneNumber: string
  contractExpiredDate: number
  customerStaff: any
  partnerStaff: any
  createdBy: any
  statusHistory: StatusHistory[]
  jobEndDate?: Date | null
  jobStartDate?: Date | null
  freelancerPeriods?:
    | {
        id: number | null
        endDate: number | Date | null
        startDate: number | Date | null
      }[]
    | null
    | undefined
  jobChangeRequest: {
    isChangeJobType?: boolean
    jobType?: string
    onboardDate?: Date | null
    jobEndDate?: Date | null
    jobStartDate?: Date | null
    freelancerPeriods?:
      | {
          id?: number | null
          endDate: number | Date | null | undefined
          startDate: number | Date | null | undefined
        }[]
      | null
      | undefined
  }
}
export type IHROutSourcingResponse = {
  code?: string
  name: string
  gender: string
  email: string
  companyBranch: any
  position: any
  onboardDate: number
  status: any
  contractExpiredDate: number
  customer: any
  partner: any
  divisionId: string
}

export type UpdateSkillSetStaffDetail = {
  skillGroupId: string | number
  skillSetLevels: {
    level: string
    note: string
    skillId: string | number
    yearsOfExperience: string
  }[]
}

export interface GradeResponse {
  id: number
  title: string
  grade: string
}
