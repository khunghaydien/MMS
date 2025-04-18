import {
  CONTRACT_LIST,
  DAILY_REPORT,
  MBO_CRITERIA_LIST,
  MBO_CYCLE_LIST,
  MBO_EVALUATION_PROCESS,
  PROJECT_LIST,
  PROJECT_LIST_REQUEST_OT,
  PROJECT_TIMESHEET_OT_MANAGEMENT,
  STAFF_DASHBOARD,
  STAFF_LIST,
  STAFF_LIST_HR_OUTSOURCING,
} from '@/const/path.const'
import {
  Analytics,
  Dashboard,
  Diversity3,
  EventNote,
  LibraryBooks,
  PeopleAlt,
  RequestQuoteSharp,
  SportsScore,
} from '@mui/icons-material'
import ModuleContract from './contract'
import ModuleCustomer from './customer'
import ModuleDailyReport from './daily-report'
import ModuleDashboard from './dashboard'
import ModuleFinance from './finance'
import ModuleMBO from './mbo'
import ModuleProject from './project'
import ModuleStaff from './staff'

const modules = [
  {
    id: 9,
    name: 'system-dashboard',
    labelName: 'Dashboard',
    pathNavigate: 'system-dashboard',
    pathRoot: 'system-dashboard/*',
    Icon: Dashboard,
    Module: ModuleDashboard,
    roles: ['useSystemDashboard'],
  },
  {
    id: 5,
    name: 'daily-report',
    labelName: 'Daily Report',
    pathNavigate: 'daily-report',
    pathRoot: 'daily-report/*',
    Icon: EventNote,
    Module: ModuleDailyReport,
    roles: ['useDailyReportGeneral'],
    features: [
      {
        id: 1,
        label: 'Daily Report',
        pathNavigate: DAILY_REPORT,
        pathRoot: 'management',
        role: 'useDailyReportGeneral',
        activeChildren: '/daily-report/management',
      },
      // {
      //   id: 2,
      //   label: 'Daily Report Management',
      //   pathNavigate: DAILY_REPORT_MANAGEMENT,
      //   pathRoot: 'management',
      //   role: 'useDailyReportGeneral',
      //   activeChildren: '/daily-report/management',
      // },
    ],
  },
  {
    id: 1,
    name: 'customer',
    labelName: 'Customer',
    pathNavigate: 'customer',
    pathRoot: 'customer/*',
    roles: [
      'useCustomerList',
      'usePartnerList',
      'useCustomerAndPartnerDashboard',
    ],
    Icon: Diversity3,
    Module: ModuleCustomer,
    features: [
      {
        id: 1,
        label: 'Dashboard',
        pathNavigate: 'customer/dashboard',
        pathRoot: 'dashboard',
        role: 'useCustomerAndPartnerDashboard',
        activeChildren: '/customer/dashboard',
      },
      {
        id: 2,
        label: 'Customer Management',
        pathNavigate: 'customer/list-customers',
        pathRoot: 'list-customers',
        role: 'useCustomerList',
        activeChildren: '/customer/list-customers',
      },
      {
        id: 3,
        label: 'Partner Management',
        pathNavigate: 'customer/list-partners',
        pathRoot: 'list-partners',
        role: 'usePartnerList',
        activeChildren: '/customer/list-partners',
      },
    ],
  },
  {
    id: 2,
    name: 'project',
    labelName: 'Project',
    pathNavigate: 'project',
    pathRoot: 'project/*',
    Icon: Analytics,
    Module: ModuleProject,
    roles: ['useProjectList', 'useProjectDashboard'],
    features: [
      {
        id: 2,
        label: 'Project Management',
        pathNavigate: PROJECT_LIST,
        pathRoot: 'management',
        role: 'useProjectList',
        activeChildren: '/project/management',
      },
      {
        id: 3,
        label: 'Request OT Management',
        pathNavigate: PROJECT_LIST_REQUEST_OT,
        pathRoot: 'requestOT',
        role: 'otRequestList',
        activeChildren: '/project/request-ot',
      },
      {
        id: 4,
        label: 'Timesheet OT Management',
        pathNavigate: PROJECT_TIMESHEET_OT_MANAGEMENT,
        pathRoot: 'ot-report-list',
        role: 'useProjectList',
        activeChildren: '/project/ot-report-list',
      },
    ],
  },
  {
    id: 3,
    name: 'staff',
    labelName: 'Staff',
    pathNavigate: 'staff',
    pathRoot: 'staff/*',
    Icon: PeopleAlt,
    Module: ModuleStaff,
    roles: ['useStaffList', 'useStaffDashboard', 'useStaffOutsourcingList'],
    features: [
      {
        id: 1,
        label: 'Dashboard',
        pathNavigate: STAFF_DASHBOARD,
        pathRoot: 'dashboard',
        role: 'useStaffDashboard',
        activeChildren: '/staff/dashboard',
      },
      {
        id: 2,
        label: 'Staff Management',
        pathNavigate: STAFF_LIST,
        pathRoot: 'management/staff',
        role: 'useStaffList',
        activeChildren: '/staff/management/staff-management',
      },
      {
        id: 3,
        label: 'HR Outsourcing Management',
        pathNavigate: STAFF_LIST_HR_OUTSOURCING,
        pathRoot: 'management/hr-outsourcing',
        role: 'useStaffOutsourcingList',
        activeChildren: '/staff/management/hr-outsourcing',
      },
    ],
  },
  {
    id: 4,
    name: 'finance',
    labelName: 'Finance',
    pathNavigate: 'finance',
    pathRoot: 'finance/*',
    Icon: RequestQuoteSharp,
    Module: ModuleFinance,
    roles: ['useFinanceDashboard'],
    features: [],
  },
  {
    id: 7,
    name: 'contract',
    labelName: 'Contract',
    pathNavigate: 'contract',
    pathRoot: 'contract/*',
    Icon: LibraryBooks,
    Module: ModuleContract,
    roles: ['useContractList'],
    features: [
      {
        id: 1,
        label: 'Contract Management',
        pathNavigate: CONTRACT_LIST,
        pathRoot: 'management',
        role: 'useContractList',
        activeChildren: '/contract/management',
      },
    ],
  },
  {
    id: 8,
    name: 'mbo',
    labelName: 'MBO',
    pathNavigate: 'mbo',
    pathRoot: 'mbo/*',
    Icon: SportsScore,
    Module: ModuleMBO,
    roles: [
      'useMBOAllCycle',
      'useMBOCriteriaGeneral',
      'useMBOCycleGeneral',
      'useMBOEvaluateAsAppraiser',
      'useMBOMyEvaluation',
      'useMBOProjectMemberEvaluation',
      'useMBOTeamMemberEvaluation',
      'useMBOViewEvaluationInfo',
      'useMBOViewEvaluation',
    ],
    features: [
      {
        id: 1,
        label: 'Criteria Management',
        pathNavigate: MBO_CRITERIA_LIST,
        pathRoot: 'management/criteria',
        role: 'useMBOCriteriaGeneral',
        activeChildren: '/mbo/management/criteria',
      },
      {
        id: 2,
        label: 'Cycle Management',
        pathNavigate: MBO_CYCLE_LIST,
        pathRoot: 'management/cycle',
        role: 'useMBOCycleGeneral',
        activeChildren: '/mbo/management/cycle',
      },
      {
        id: 3,
        label: 'Evaluation Process',
        pathNavigate: MBO_EVALUATION_PROCESS,
        pathRoot: 'management/evaluation-process',
        role: 'useMBOEvaluationProcess',
        activeChildren: '/mbo/management/evaluation-process',
      },
    ],
  },
]

export default modules
