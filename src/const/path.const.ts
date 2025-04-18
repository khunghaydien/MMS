export const MAIN = '/'
export const LOGIN = '/login'
export const FORGOT_PASSWORD = '/forgot-password/confirm-reset'
export const NOT_FOUND = '/not-found'
export const PAGE_404 = '/404-not-found'
export const PAGE_403 = '/403-forbidden'
export const CUSTOMER_SURVEY = '/survey/:surveyId/project/:projectId'

// Module Customer
export const MODULE_CUSTOMER = '/customer'
export const CUSTOMER_DASHBOARD = '/customer/dashboard'
export const CUSTOMER_LIST = '/customer/list-customers'
export const CUSTOMER_DETAIL = '/customer/list-customers/:customerId'
export const CUSTOMER_DETAIL_FORMAT = '/customer/list-customers/{0}'
export const CUSTOMER_CREATE = '/customer/list-customers/create'
export const CUSTOMER_PARTNER_LIST = '/customer/list-partners'
export const CUSTOMER_PARTNER_DETAIL = '/customer/list-partners/:partnerId'
export const CUSTOMER_PARTNER_DETAIL_FORMAT = '/customer/list-partners/{0}'
export const CUSTOMER_PARTNER_CREATE = '/customer/list-partners/create'

// Module Project
export const MODULE_PROJECT = '/project'
export const PROJECT_LIST = '/project/management/list-project'
export const PROJECT_TIMESHEET_OT_MANAGEMENT = '/project/ot-report-list'
export const PROJECT_LIST_REQUEST_OT = '/project/request-ot'
export const PROJECT_CREATE = '/project/management/create'
export const PROJECT_DETAIL = '/project/management/:projectId'
export const PROJECT_DETAIL_FORMAT = '/project/management/{0}'

// Module Staff
export const MODULE_STAFF = '/staff'
export const STAFF_LIST = '/staff/management/staff-management'
export const STAFF_LIST_HR_OUTSOURCING = '/staff/management/hr-outsourcing'
export const STAFF_CREATE = '/staff/management/staff-management/create'
export const STAFF_CREATE_HR_OUTSOURCING =
  '/staff/management/hr-outsourcing/create'
export const STAFF_DETAIL = '/staff/management/staff-management/:staffId'
export const STAFF_DETAIL_FORMAT = '/staff/management/staff-management/{0}'
export const STAFF_OUTSOURCE_DETAIL =
  '/staff/management/hr-outsourcing/:staffId'
export const STAFF_OUTSOURCE_DETAIL_FORMAT =
  '/staff/management/hr-outsourcing/{0}'
export const STAFF_DASHBOARD = '/staff/dashboard'

// Module Daily Report
export const MODULE_DAILY_REPORT = '/daily-report'
export const DAILY_REPORT = '/daily-report/management'
// export const DAILY_REPORT_MANAGEMENT = '/daily-report/management'

// Module Finance
export const MODULE_FINANCE = '/finance'
export const FINANCE_DASHBOARD = '/finance/dashboard'

// Module Settings
export const MODULE_SETTINGS = '/settings'

// Module Contract
export const MODULE_CONTRACT = '/contract'
export const CONTRACT_LIST = '/contract/management/list-contracts'
export const CONTRACT_DETAIL = '/contract/management/:contractId'
export const CONTRACT_CREATE = '/contract/management/create'
export const CONTRACT_DETAIL_FORMAT = '/contract/management/{0}'

// Module MBO
export const MODULE_MBO = '/mbo'

export const MBO_CRITERIA_LIST = '/mbo/management/criteria-list'
export const MBO_CRITERIA_DETAIL = '/mbo/management/criteria/:criteriaGroupId'
export const MBO_CRITERIA_CREATE = '/mbo/management/criteria/create'
export const MBO_CRITERIA_DETAIL_FORMAT = '/mbo/management/criteria/{0}'

export const MBO_CYCLE_LIST = '/mbo/management/cycle-list'
export const MBO_CYCLE_DETAIL = '/mbo/management/cycle/:cycleId'
export const MBO_CYCLE_CREATE = '/mbo/management/cycle/create'
export const MBO_CYCLE_DETAIL_FORMAT = '/mbo/management/cycle/{0}'

export const MBO_EVALUATION_PROCESS = '/mbo/management/evaluation-process'
export const MBO_EVALUATION_PROCESS_DETAIL =
  '/mbo/management/evaluation-process/:evaluationCycleId'
export const MBO_EVALUATION_PROCESS_DETAIL_FORMAT =
  '/mbo/management/evaluation-process/{0}'
export const MBO_EVALUATION_PROCESS_APPRAISEE_LIST =
  '/mbo/management/evaluation-process/:evaluationCycleId/appraisee-list'
export const MBO_EVALUATION_PROCESS_APPRAISEE_LIST_FORMAT =
  '/mbo/management/evaluation-process/{0}/appraisee-list'

// Module Dashboard
export const MODULE_DASHBOARD = '/system-dashboard'
