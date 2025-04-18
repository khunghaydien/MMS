import ApiClientWithToken from '@/api/api'

import { cleanObject, queryStringParam } from '@/utils'

export default {
  getListFinance(params: any) {
    const queryString = queryStringParam(cleanObject(params))
    const url = `/dashboards/finance?${queryString ? `${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  createNewConfigKpi(payload: any) {
    return ApiClientWithToken.post(`/dashboards/finance/kpi`, payload)
  },
  updateConfigKpi(payload: any) {
    return ApiClientWithToken.put(`/dashboards/finance/kpi`, payload)
  },
  getFinanceKpi(queries: any) {
    const queryString = queryStringParam(queries)
    const url = `/dashboards/finance/kpi${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
}
