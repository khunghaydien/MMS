export interface ListStaffParams {
  partnerId: any[]
  customerId: any[]
  branchId: any
  divisionIds: any
  startDate: null | Date
  endDate: null | Date
  jobType: any
  keyword: string
  orderBy: 'desc' | 'asc' | 'latest'
  sortBy: string
  status: any
  pageNum: number
  pageSize: number
  skillsId: any
  positionIds: any
}

export interface DeleteStaffPayload {
  code: string
  id: string
}
