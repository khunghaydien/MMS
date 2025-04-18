import PrivateRoute from '@/components/common/PrivateRoute'
import Processing from '@/components/common/Processing'
import { PathConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { Suspense, lazy } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'

const ModuleCustomer = lazy(() => import('../../../modules/customer'))
const ModuleProject = lazy(() => import('../../../modules/project'))
const ModuleStaff = lazy(() => import('../../../modules/staff'))
const ModuleMBO = lazy(() => import('../../../modules/mbo'))
const ModuleDailyReport = lazy(() => import('../../../modules/daily-report'))
const ModuleFinance = lazy(() => import('../../../modules/finance'))
const ModuleContract = lazy(() => import('../../../modules/contract'))
const ModuleSettings = lazy(() => import('../../../modules/settings'))
const ModuleDashboard = lazy(() => import('../../../modules/dashboard'))

const CustomerDashboard = lazy(
  () => import('../../../modules/customer/pages/customer-dashboard')
)
const CustomerList = lazy(
  () => import('../../../modules/customer/pages/customer-list')
)
const CustomerDetail = lazy(
  () => import('../../../modules/customer/pages/customer-detail')
)
const PartnerList = lazy(
  () => import('../../../modules/customer/pages/partner-list')
)
const PartnerDetail = lazy(
  () => import('../../../modules/customer/pages/partner-detail')
)
const ProjectList = lazy(
  () => import('../../../modules/project/pages/project-list')
)
const ProjectListRequestOT = lazy(
  () => import('../../../modules/project/pages/project-list-request-ot')
)
const ProjectCreate = lazy(
  () => import('../../../modules/project/pages/project-create/ProjectCreate')
)
const TimesheetOTManagement = lazy(
  () =>
    import(
      '../../../modules/project/pages/TimesheetOTManagement/RootTimesheetOTManagement'
    )
)
const ProjectDetail = lazy(
  () => import('../../../modules/project/pages/project-detail-v2/ProjectDetail')
)
const StaffDashboard = lazy(
  () => import('../../../modules/staff/pages/staff-dashboard')
)
const StaffList = lazy(() => import('../../../modules/staff/pages/staff-list'))
const HrOutsourcingList = lazy(
  () => import('../../../modules/staff/pages/hr-outsourcing')
)
const StaffDetail = lazy(
  () => import('../../../modules/staff/pages/staff-detail')
)
const ContractList = lazy(
  () => import('../../../modules/contract/pages/contract-list/ContractList')
)
const ContractDetail = lazy(
  () => import('../../../modules/contract/pages/contract-detail/ContractDetail')
)
const DailyReport = lazy(
  () => import('../../../modules/daily-report/pages/daily-report/DailyReport')
)
const DailyReportManagement = lazy(
  () =>
    import(
      '../../../modules/daily-report/pages/daily-report-management/DailyReportManagement'
    )
)
const FinanceDashBoard = lazy(
  () => import('../../../modules/finance/pages/finance-dashboard')
)

const CriteriaList = lazy(
  () => import('../../../modules/mbo/pages/criteria-list/CriteriaList')
)
const CriteriaDetail = lazy(
  () => import('../../../modules/mbo/pages/criteria-detail/CriteriaDetail')
)
const CycleList = lazy(() => import('../../../modules/mbo/pages/cycle-list'))
const CycleDetail = lazy(
  () => import('../../../modules/mbo/pages/cycle-detail/CycleDetail')
)
const EvaluationProcess = lazy(
  () => import('../../../modules/mbo/pages/evaluation-process')
)
const EvaluationCycleProcessDetail = lazy(
  () =>
    import(
      '../../../modules/mbo/pages/evaluation-process/EvaluationCycleProcessDetail'
    )
)
const EvaluationCycleProcessAppraiseeList = lazy(
  () =>
    import(
      '../../../modules/mbo/pages/evaluation-process/EvaluationCycleProcessAppraiseeList'
    )
)

const InitialRoute = lazy(
  () => import('../../../components/common/InitialRoute')
)

const AllRoutesOfFeatures = () => {
  const { permissions }: AuthState = useSelector(selectAuth)

  const useCustomerList = !!permissions.useCustomerList
  const useCustomerDetail = !!permissions.useCustomerDetail
  const useCustomerCreate = !!permissions.useCustomerCreate
  const usePartnerList = !!permissions.usePartnerList
  const usePartnerDetail = !!permissions.usePartnerDetail
  const usePartnerCreate = !!permissions.usePartnerCreate
  const useProjectList = !!permissions.useProjectList
  const otRequestList = !!permissions.otRequestList
  const useProjectDetail = !!permissions.useProjectDetail
  const useProjectCreate = !!permissions.useProjectCreate
  const useStaffList = !!permissions.useStaffList
  const useStaffOutsourcingList = !!permissions.useStaffOutsourcingList
  const useStaffDetail = !!permissions.useStaffDetail
  const useStaffOutsourcingDetail = !!permissions.useStaffOutsourcingDetail
  const useStaffCreate = !!permissions.useStaffCreate
  const useStaffOutsourcingCreate = !!permissions.useStaffOutsourcingCreate
  const useCustomerAndPartnerDashboard =
    !!permissions.useCustomerAndPartnerDashboard
  const useStaffDashboard = !!permissions.useStaffDashboard
  const useFinanceDashboard = !!permissions.useFinanceDashboard
  const useDailyReportGeneral = !!permissions.useDailyReportGeneral
  const useContractCreate = !!permissions.useContractCreate
  const useContractList = !!permissions.useContractList
  const useMBOCriteriaGeneral = !!permissions.useMBOCriteriaGeneral
  const useMBOCycleGeneral = !!permissions.useMBOCycleGeneral
  const useMBOTeamMemberEvaluation = !!permissions.useMBOTeamMemberEvaluation
  const useMBOViewEvaluationManager = !!permissions.useMBOViewEvaluationManager
  const useMBOAllCycle = !!permissions.useMBOAllCycle
  const useMBOEvaluateAsAppraiser = !!permissions?.useMBOEvaluateAsAppraiser
  const useMBOMyEvaluation = !!permissions?.useMBOMyEvaluation
  const useMBOProjectMemberEvaluation =
    !!permissions?.useMBOProjectMemberEvaluation
  const useMBOViewEvaluationInfo = !!permissions?.useMBOViewEvaluationInfo
  const useMBOViewEvaluation = !!permissions?.useMBOViewEvaluation
  const useMBOEvaluationProcess = !!permissions?.useMBOEvaluationProcess
  const useSystemDashboard = !!permissions?.useSystemDashboard

  return (
    <Suspense fallback={<Processing open />}>
      <Routes>
        <Route path={PathConstant.MAIN} element={<InitialRoute />} />
        {/* Module Customer */}
        <Route
          path={PathConstant.MODULE_CUSTOMER}
          element={
            <PrivateRoute
              isAuth={Boolean(
                useCustomerList ||
                  usePartnerList ||
                  useCustomerAndPartnerDashboard
              )}
            >
              <ModuleCustomer />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_DASHBOARD}
          element={
            <PrivateRoute isAuth={useCustomerAndPartnerDashboard}>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_LIST}
          element={
            <PrivateRoute isAuth={useCustomerList}>
              <CustomerList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_DETAIL}
          element={
            <PrivateRoute isAuth={useCustomerDetail}>
              <CustomerDetail />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_CREATE}
          element={
            <PrivateRoute isAuth={useCustomerCreate}>
              <CustomerDetail />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_PARTNER_LIST}
          element={
            <PrivateRoute isAuth={usePartnerList}>
              <PartnerList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_PARTNER_DETAIL}
          element={
            <PrivateRoute isAuth={usePartnerDetail}>
              <PartnerDetail isDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CUSTOMER_PARTNER_CREATE}
          element={
            <PrivateRoute isAuth={usePartnerCreate}>
              <PartnerDetail isDetailPage={false} />
            </PrivateRoute>
          }
        />
        {/* Module Project */}
        <Route
          path={PathConstant.MODULE_PROJECT}
          element={
            <PrivateRoute isAuth={Boolean(useProjectList)}>
              <ModuleProject />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.PROJECT_LIST}
          element={
            <PrivateRoute isAuth={useProjectList}>
              <ProjectList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.PROJECT_LIST_REQUEST_OT}
          element={
            <PrivateRoute isAuth={otRequestList}>
              <ProjectListRequestOT />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.PROJECT_CREATE}
          element={
            <PrivateRoute isAuth={useProjectCreate}>
              <ProjectCreate />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.PROJECT_DETAIL}
          element={
            <PrivateRoute isAuth={useProjectDetail}>
              <ProjectDetail />
            </PrivateRoute>
          }
        />

        <Route
          path={PathConstant.PROJECT_TIMESHEET_OT_MANAGEMENT}
          element={
            <PrivateRoute isAuth={useProjectList}>
              <TimesheetOTManagement />
            </PrivateRoute>
          }
        />

        {/* Module Staff */}
        <Route
          path={PathConstant.MODULE_STAFF}
          element={
            <PrivateRoute isAuth={Boolean(useStaffList || useStaffDashboard)}>
              <ModuleStaff />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_LIST}
          element={
            <PrivateRoute isAuth={useStaffList}>
              <StaffList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_LIST_HR_OUTSOURCING}
          element={
            <PrivateRoute isAuth={useStaffOutsourcingList}>
              <HrOutsourcingList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_DETAIL}
          element={
            <PrivateRoute isAuth={useStaffDetail}>
              <StaffDetail isDetailPage isOutsource={false} />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_CREATE}
          element={
            <PrivateRoute isAuth={useStaffCreate}>
              <StaffDetail isDetailPage={false} isOutsource={false} />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_CREATE_HR_OUTSOURCING}
          element={
            <PrivateRoute isAuth={useStaffOutsourcingCreate}>
              <StaffDetail isDetailPage={false} isOutsource />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_OUTSOURCE_DETAIL}
          element={
            <PrivateRoute isAuth={useStaffOutsourcingDetail}>
              <StaffDetail isDetailPage isOutsource />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.STAFF_DASHBOARD}
          element={
            <PrivateRoute isAuth={useStaffDashboard}>
              <StaffDashboard />
            </PrivateRoute>
          }
        />
        {/* Module Daily Report */}
        <Route
          path={PathConstant.MODULE_DAILY_REPORT}
          element={
            <PrivateRoute isAuth={useDailyReportGeneral}>
              <ModuleDailyReport />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.DAILY_REPORT}
          element={
            <PrivateRoute isAuth={useDailyReportGeneral}>
              <DailyReport />
            </PrivateRoute>
          }
        />
        {/* <Route
          path={PathConstant.DAILY_REPORT_MANAGEMENT}
          element={
            <PrivateRoute isAuth={useDailyReportGeneral}>
              <DailyReportManagement />
            </PrivateRoute>
          }
        /> */}
        {/* Module Finance */}
        <Route
          path={PathConstant.MODULE_FINANCE}
          element={
            <PrivateRoute isAuth={Boolean(useFinanceDashboard)}>
              <ModuleFinance />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.FINANCE_DASHBOARD}
          element={
            <PrivateRoute isAuth={useFinanceDashboard}>
              <FinanceDashBoard />
            </PrivateRoute>
          }
        />
        {/* Module Settings */}
        <Route
          path={PathConstant.MODULE_SETTINGS}
          element={
            <PrivateRoute isAuth>
              <ModuleSettings />
            </PrivateRoute>
          }
        />
        {/* Module Contract */}
        <Route
          path={PathConstant.MODULE_CONTRACT}
          element={
            <PrivateRoute isAuth={useContractList}>
              <ModuleContract />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CONTRACT_LIST}
          element={
            <PrivateRoute isAuth={useContractList}>
              <ContractList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CONTRACT_DETAIL}
          element={
            <PrivateRoute isAuth>
              <ContractDetail isDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.CONTRACT_CREATE}
          element={
            <PrivateRoute isAuth={useContractCreate}>
              <ContractDetail isDetailPage={false} />
            </PrivateRoute>
          }
        />
        {/* Module MBO */}
        <Route
          path={PathConstant.MODULE_MBO}
          element={
            <PrivateRoute
              isAuth={
                useMBOAllCycle ||
                useMBOCriteriaGeneral ||
                useMBOCycleGeneral ||
                useMBOEvaluateAsAppraiser ||
                useMBOMyEvaluation ||
                useMBOProjectMemberEvaluation ||
                useMBOTeamMemberEvaluation ||
                useMBOViewEvaluationInfo ||
                useMBOViewEvaluation
              }
            >
              <ModuleMBO />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.MBO_CRITERIA_LIST}
          element={
            <PrivateRoute isAuth={useMBOCriteriaGeneral}>
              <CriteriaList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.MBO_CRITERIA_DETAIL}
          element={
            <PrivateRoute isAuth={useMBOCriteriaGeneral}>
              <CriteriaDetail isDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.MBO_CRITERIA_CREATE}
          element={
            <PrivateRoute isAuth={useMBOCriteriaGeneral}>
              <CriteriaDetail isDetailPage={false} />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.MBO_CYCLE_LIST}
          element={
            <PrivateRoute isAuth={useMBOCycleGeneral}>
              <CycleList />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.MBO_CYCLE_DETAIL}
          element={
            <PrivateRoute isAuth={useMBOCycleGeneral}>
              <CycleDetail isDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.MBO_CYCLE_CREATE}
          element={
            <PrivateRoute isAuth={useMBOCycleGeneral}>
              <CycleDetail isDetailPage={false} />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.MBO_EVALUATION_PROCESS}
          element={
            <PrivateRoute isAuth={useMBOEvaluationProcess}>
              <EvaluationProcess />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.MBO_EVALUATION_PROCESS_DETAIL}
          element={
            <PrivateRoute isAuth={useMBOEvaluationProcess}>
              <EvaluationCycleProcessDetail />
            </PrivateRoute>
          }
        />
        <Route
          path={PathConstant.MBO_EVALUATION_PROCESS_APPRAISEE_LIST}
          element={
            <PrivateRoute
              isAuth={
                useMBOTeamMemberEvaluation ||
                useMBOViewEvaluationManager ||
                useMBOAllCycle
              }
            >
              <EvaluationCycleProcessAppraiseeList />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={PathConstant.PAGE_404} replace />}
        />

        {/* Module Dashboard */}
        <Route
          path={PathConstant.MODULE_DASHBOARD}
          element={
            <PrivateRoute isAuth={useSystemDashboard}>
              <ModuleDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}

export default AllRoutesOfFeatures
