import ApiClientWithToken from '@/api/api'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import { StaffAllocationQueries } from '../types'

export default {
  exportStaffAllocation(queries: StaffAllocationQueries) {
    return ApiClientWithToken.post(
      `/dashboards/export-staff-allocation`,
      queries
    )
  },
  getStaffBusyRate(
    queries: StaffAllocationQueries,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/dashboards/staff-allocation', {
      params: cleanObject(queries),
      ...config,
    })
  },
  getStaffAssignAllocation(
    queries: StaffAllocationQueries,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/dashboards/staff-assign-allocation', {
      params: cleanObject(queries),
      ...config,
    })
  },
}
