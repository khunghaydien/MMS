import { CancelTokenSource } from 'axios'

export interface DashboardState {
  dataStaffAssignAllocation: {
    dataList: StaffAssignAllocationItemResponse[]
    totalElements: number
    loading: boolean
  }
  staffAllocationQueries: StaffAllocationQueries
  dataStaffBusyRate: {
    loading: boolean
    dataList: StaffBusyRateItemResponse[]
  }
  cancelGetStaffAssignAllocation: CancelTokenSource | null
  dataProjectAllocationStaff: {
    dataList: ProjectAllocationStaffItemResponse[]
    totalElements: number
    loading: boolean
  }
  projectAllocationQueries: ProjectAllocationQueries
  dataProjectAllocationSummary: {
    dataList: ProjectAllocationSummaryItemResponse[]
    loading: boolean
  }
  kpiMetricQueries: KPIMetricQueries
  dataKPIMetricSummary: {
    dataList: KPIMetricDetailResponse[]
    loading: boolean
  }
  cancelGetProjectAllocationStaff: CancelTokenSource | null
  cancelGetStaffBusyRate: CancelTokenSource | null
  cancelGetProjectAllocationSummary: CancelTokenSource | null
  cancelGetKPIMetricSummary: CancelTokenSource | null
}
export interface KPIMetricDetailResponse {
  divisionCode: string | null
  divisionId: string | null
  divisionName: string | null
  accumulatedBugRate: number | null
  accumulatedEeActual: number | null
  accumulatedEeForecast: number | null
  accumulatedLeakageRate: number | null
  accumulatedTimeliness: number | null
  averagePvc: number | null
  billableEffort: number | null
  bonusAndMinus: number | null
  cssAverage: number | null,
  totalActualEffort: number | null
  totalAssignEffort: number | null
  metricsDetail: KPIMetricDetailData[]
}
export interface KPIMetricDetailData {
  date: string | null
  accumulatedBugRate: number | null
  accumulatedEeActual: number | null
  accumulatedEeForecast: number | null
  accumulatedLeakageRate: number | null
  accumulatedTimeliness: number | null
  averagePvc: number | null
  billableEffort: number | null
  bonusAndMinus: number | null
  cssAverage: number | null,
  totalActualEffort: number | null
  totalAssignEffort: number | null
}

export interface KPIMetricQueries {
  pageSize?: number
  pageNum?: number
  keyword?: string
  branchId?: string | number
  startMonth: number
  endMonth: number
  startYear: number
  endYear: number
  startDate?: Date | null
  endDate?: Date | null
}

export interface ProjectAllocationQueries extends StaffAllocationQueries {
  status?: any
}

export interface ProjectAllocationSummaryItemResponse {
  totalProject: number
  totalStaff: number
  totalBillableMM: number
  totalAssignEffort: number
  totalActualEffort: number
  usageEfficiency: number
  year: number
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

export interface ProjectMonthItem {
  year: number
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  billableMM: number | null
  ee: number | null
  ue: number | null
  assignEffort: number | null
  actualEffort: number | null
  staffs: {
    staffCode: string
    staffName: string
    divisionName: string
    assignEffort: number | null
    actualEffort: number | null
  }[]
}

export interface ProjectAllocationStaffItemResponse {
  projectId: number
  projectCode: string
  projectName: string
  projectMonth: ProjectMonthItem[]
}

export interface StaffAllocationQueries {
  pageSize?: number
  pageNum?: number
  keyword?: string
  divisionIds?: any
  jobType?: any
  startMonth: number
  endMonth: number
  startYear: number
  endYear: number
  startDate?: Date | null
  endDate?: Date | null
}

export interface StaffAssignAllocationItemResponse {
  staffId: number
  staffCode: string
  staffName: string
  staffMonth: {
    year: number
    month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    projects: {
      name: string
      effort: number
    }[]
  }[]
}

export interface StaffBusyRateItemResponse {
  totalStaff: number
  assignEffort: number
  busyRate: number
  notAssignEffort: number
  year: number
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}
