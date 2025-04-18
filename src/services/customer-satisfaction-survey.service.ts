import ApiClientWithToken from '@/api/api'

export default {
  evaluateSurveyProject(payload: { surveyId: number; requestBody: any }) {
    return ApiClientWithToken.post(
      `/customer-satisfaction-survey/${payload.surveyId}`,
      payload.requestBody
    )
  },
  updateCustomerSurvey(payload: {
    customerSurveyId: number
    requestBody: any
  }) {
    return ApiClientWithToken.put(
      `/customer-satisfaction-survey/${payload.customerSurveyId}`,
      payload.requestBody
    )
  },
  deleteCustomerSurvey(customerSurveyId: number) {
    return ApiClientWithToken.delete(
      `/customer-satisfaction-survey/${customerSurveyId}`
    )
  },
  getSurveyDetails(surveyId: number) {
    return ApiClientWithToken.get(`/customer-satisfaction-survey/${surveyId}`)
  },
}
