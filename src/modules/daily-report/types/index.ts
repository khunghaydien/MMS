import { OptionItem } from '@/types'

export interface IStaff {
  id: number
  code: string
  name: string
}

export interface IReport {
  approvedBy?: OptionItem
  dailyReportId: string
  reportDate: number
  improvement: string
  note: string
  noteWorkDescription?: string
  dailyReportDetails: Array<IReportDetail>
  otReportDetails: Array<any>
  status: {
    id: ReportStatus
    name: string
  }
}

export interface IReportRequest {
  dailyReportId?: string
  staffId?: number
  reportDate: number
  improvement: string
  dailyReportDetails: Array<IReportDetailRequest>
  statusReport?: number | null
  status?: any
  projectManager?: OptionItem
  note: string
}

export interface IReportAppRequest {
  approvedBy: string | number
  noteReport: string
  reportDate: number
  reportImprovement: string
  dailyReportApplicationDetail: Array<IReportDetailRequest>
  statusReport: number | null
}

export interface IReportDetail {
  id: string
  project: {
    id: string
    code: string
    name: string
  }
  workingHours: number | string
  workingDescription: string
  improvement: string
  suggestionForImprovement: string
  workType: any
}

export interface IReportDetailRequest {
  id?: string | number
  projectId: number | string | null
  workingHours: number
  workingDescription: string
  improvement: string
  suggestionForImprovement: string
  workType: string
}

export interface IGetDailyReportParams {
  month: number | null
  year: number | null
  staffId?: number | string | null
}

export interface IDailyReportResponse {
  dayOff: number
  noReport: number
  totalOtHours: number
  totalWorkingHours: number
  staff: IStaff
  dailyReport: IReport[]
}

export type ReportStatus = 0 | 1 | 2 | 3 | 4

export interface IReportDetailParams {
  date: number
  staffId: number
}

export interface AddDailyReportRequestBody {
  improvement: string
  note: string
  noteWorkDescription: string
  reportDate: number
  statusReport: number
  otReportDetails: {
    hours: number
    otDate: number
    otFrom: string
    otRequestId: number | string
    otTo: string
    projectId: string | number
    reason: string
  }[]
  dailyReportDetails: {
    dailyDetailId: number | null
    improvement: string
    projectId: number | string
    suggestionForImprovement: string
    workType: number | string
    workingDescription: string
    workingHours: number | string
  }[]
}
