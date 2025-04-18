import ApiClientWithToken from '@/api/api'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import { KPIMetricQueries, ProjectAllocationQueries } from '../types'

export default {
  exportProjectAllocation(queries: ProjectAllocationQueries) {
    return ApiClientWithToken.post(
      `/dashboards/export-project-allocation`,
      queries
    )
  },
  getProjectAllocationSummary(
    queries: ProjectAllocationQueries,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/dashboards/project-allocation-summary', {
      params: cleanObject(queries),
      ...config,
    })
  },
  exportKPIMetricSummary(queries: KPIMetricQueries) {
    return ApiClientWithToken.post(
      `/dashboards/export-metrics`,
      queries
    )
  },
  getKPIMetricSummary(
    queries: KPIMetricQueries,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/dashboards/metrics', {
      params: cleanObject(queries),
      ...config,
    })
  },
  getProjectAllocationStaff(
    queries: ProjectAllocationQueries,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/dashboards/project-allocation', {
      params: cleanObject(queries),
      ...config,
    })
  },
}
