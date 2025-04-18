import { TableConstant } from '@/const'
import { OptionItem, StepConfig } from '@/types'
import {
  ICustomerSatisfactionParams,
  IGeneralProjectState,
  IListProjectsParams,
  IListRequestParams,
  IProjectDashboard,
  IReportOTTimesheetParams,
  IRequestOTTimesheetParams,
} from '../types'

export const PROJECT_STEP: { [key: string]: number } = {
  GENERAL_INFORMATION: 0,
  HEAD_COUNT: 1,
  REVENUE: 2,
  COST: 3,
}

export const CONFIG_PROJECT_STEPS: StepConfig[] = [
  {
    step: PROJECT_STEP.GENERAL_INFORMATION,
    label: 'General Information',
  },
  {
    step: PROJECT_STEP.HEAD_COUNT,
    label: 'Headcount',
  },
  {
    step: PROJECT_STEP.REVENUE,
    label: 'Revenue',
  },
  {
    step: PROJECT_STEP.COST,
    label: 'Cost',
  },
]

export const generalInitialState: IGeneralProjectState = {
  name: '',
  branchId: '',
  divisionId: '',
  technologies: [],
  customer: {},
  partners: [],
  projectType: '',
  status: '',
  startDate: null,
  endDate: null,
  projectManager: {},
  productType: '',
  subProjectManagers: [],
  note: '',
  code: '',
  description: '',
  slackLink: '',
  amSale: {},
  generateBitbucket: {
    autoGenerate: false,
    name: '',
  },
  generateGroupMail: {
    autoGenerate: false,
    name: '',
  },
  generateJira: {
    autoGenerate: false,
    name: '',
  },
  groupMail: '',
  gitLink: '',
  jiraLink: '',
  subCustomer: '',
  projectRank: '',
  billableMM: 0,
  businessDomain: '',
  driveLink: '',
  referenceLink: '',
}

export const MONTH: { [key: string]: number } = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
}

export const MONTH_INSTANCE = {
  [MONTH.JAN]: {
    value: 0,
    label: 'Jan',
  },
  [MONTH.FEB]: {
    value: 1,
    label: 'Feb',
  },
  [MONTH.MAR]: {
    value: 2,
    label: 'Mar',
  },
  [MONTH.APR]: {
    value: 3,
    label: 'Apr',
  },
  [MONTH.MAY]: {
    value: 4,
    label: 'May',
  },
  [MONTH.JUN]: {
    value: 5,
    label: 'Jun',
  },
  [MONTH.JUL]: {
    value: 6,
    label: 'Jul',
  },
  [MONTH.AUG]: {
    value: 7,
    label: 'Aug',
  },
  [MONTH.SEP]: {
    value: 8,
    label: 'Sep',
  },
  [MONTH.OCT]: {
    value: 9,
    label: 'Oct',
  },
  [MONTH.NOV]: {
    value: 10,
    label: 'Nov',
  },
  [MONTH.DEC]: {
    value: 11,
    label: 'Dec',
  },
}

export const COST = {
  DIVISION: 1,
  PARTNER: 2,
}

export const CONTRACT_REVENUE_AND_COST = {
  REVENUE: 1,
  COST: 2,
}

export const CONTRACT_HEADCOUNT_TYPE = 1

export const PROJECT_CHART_CONFIG: any = {
  chart: {
    plotBorderWidth: 0,
    plotShadow: false,
    type: 'pie',
  },
  credits: {
    enabled: false,
  },
  colors: ['#2CB0ED', '#FADB61', '#0B68A2', '#F86868', '#BCCCDC', '#52D1DA '],
  title: {
    text: ``,
    align: 'center',
    verticalAlign: 'middle',
    style: {
      fontSize: '22px',
      fontWeight: '500',
    },
    x: 75,
    useHTML: true,
  },
  accessibility: {
    enabled: false,
    announceNewData: {
      enabled: true,
    },
    point: {
      valueSuffix: '%',
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        distance: 15,
        connectorWidth: 0,
        connectorPadding: -5,
        padding: 0,
        format: '{point.y}%',
        style: {
          fontSize: '12px',
          fontWeight: '400',
        },
      },
      startAngle: 0,
      endAngle: 0,
      center: ['50%', '50%'],
      size: '75%',
      innerSize: '0%',
      showInLegend: true,
      point: {
        events: {
          click: (e: any) => {},
        },
      },
    },
  },
  legend: {
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'middle',
    itemMarginBottom: 24,
  },
  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: <b>{point.count:.0f}</b> of total<br/>',
  },
  series: [
    {
      type: 'pie',
      name: '',
      colorByPoint: true,
      data: [],
    },
  ],
  responsive: {
    rules: [
      {
        condition: {
          // maxWidth: 500,
        },
      },
    ],
  },
}

export const DASHBOARD_TAB_STAFF_ASSIGNED = '?staff=assigned'
export const DASHBOARD_TAB_STAFF_AVAILABLE = '?staff=available'
export const DASHBOARD_LIVE_TAB_STAFF = ['assigned', 'available']

export const initialStateDashboard: IProjectDashboard = {
  totalProject: {
    percentStatus: [],
    totalProject: 0,
  },
  totalStaff: {
    percentStaff: [],
    totalStaff: 0,
  },
  health: {
    year: 0,
    contractEffort: [],
    percentage: [],
    staffAvailable: [],
    totalStaff: [],
  },
}

export const PROJECT_TYPES = [
  {
    id: '1',
    label: 'Labo',
    value: '1',
  },
  {
    id: '2',
    label: 'Project Base',
    value: '2',
  },
  {
    id: '3',
    label: 'Labo taskbased',
    value: '3',
  },
]

export const TAB_PROJECT_REVENUE_PROJECT = 0
export const TAB_PROJECT_REVENUE_DIVISION = 1
export const CONFIG_TAB_PROJECT_REVENUE: StepConfig[] = [
  {
    step: TAB_PROJECT_REVENUE_PROJECT,
    label: 'Project',
  },
  {
    step: TAB_PROJECT_REVENUE_DIVISION,
    label: 'Division',
  },
]

export const TAB_PROJECT_COST_DIVISION = 1
export const TAB_PROJECT_COST_OUTSOURCE = 2
export const CONFIG_TAB_PROJECT_COST: StepConfig[] = [
  {
    step: TAB_PROJECT_COST_OUTSOURCE,
    label: 'Outsource',
  },
  {
    step: TAB_PROJECT_COST_DIVISION,
    label: 'Internal',
  },
]

export const LIST_REVENUE_STATUS = [
  {
    id: 1,
    label: 'Invoice Not Published',
    value: 1,
    disabled: false,
  },
  {
    id: 2,
    label: 'Invoice Published',
    value: 2,
    disabled: false,
  },
  {
    id: 3,
    label: 'Payment Received',
    value: 3,
    disabled: false,
  },
]

export const INIT_DATA_REVENUE = {
  division: { id: '', label: '' },
  status: { id: '', label: '' },
  date: '',
  note: '',
  contractId: { id: '', value: '', label: '' },
  invoiceNumber: '',
  actualRate: '',
  expectedRate: '',
  actualRevenue: '',
  expectedRevenue: '',
  actualCurrency: { id: '', value: '', label: '' },
  expectedCurrency: { id: '', value: '', label: '' },
}

export const initProjectQueryParameters: IListProjectsParams = {
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  pageSize: TableConstant.LIMIT_DEFAULT,
  orderBy: 'desc',
  sortBy: 'modifiedAt',
  divisionIds: [],
  productType: [],
  customerIds: [],
  status: [],
  startDateFrom: null,
  endDateFrom: null,
  startDateTo: null,
  endDateTo: null,
}
export const requestOTQueryParameters: IListRequestParams = {
  pageSize: TableConstant.LIMIT_DEFAULT,
  divisionId: '',
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  requestStartDateFrom: null,
  requestStartDateTo: null,
  requestEndDateFrom: null,
  requestEndDateTo: null,
  sortBy: 'modifiedAt',
  orderBy: 'desc',
}
export const requestOTTimesheetQueryParameters: IRequestOTTimesheetParams = {
  pageSize: TableConstant.LIMIT_DEFAULT,
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  status: '',
  startDate: new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1
  ).getTime(),
  endDate: new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getTime(),
  sortBy: 'modifiedAt',
  orderBy: 'desc',
}
export const reportOTTimesheetQueryParameters: IReportOTTimesheetParams = {
  pageSize: TableConstant.LIMIT_DEFAULT,
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  status: '',
  otDateFrom: new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1
  ).getTime(),
  otDateTo: new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getTime(),
  sortBy: 'modifiedAt',
  orderBy: 'desc',
}
export const customerSatisfactionParameters: ICustomerSatisfactionParams = {
  pageSize: TableConstant.LIMIT_DEFAULT,
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  from: new Date().getTime(),
  to: new Date().getTime(),
  sortBy: 'modifiedAt',
  orderBy: 'desc',
}
export const COST_TYPE_LIST_OPTIONS = [
  {
    id: 1,
    value: 1,
    label: 'Staff Cost',
  },
  {
    id: 2,
    value: 2,
    label: 'Back Office Cost',
  },
  {
    id: 3,
    value: 3,
    label: 'Office Cost',
  },
]

export const ACCUMULATED = '1'
export const SEPARATE = '2'

export const initialOverallEvaluation = {
  name: 'Overall Evaluation',
  evaluators: [
    {
      id: '1',
      title: `In overall, how are you satisfied about project team, quality and everything based on your expectation?`,
      comment: '',
      score: '',
    },
  ],
}

export const STATUS_PROCESS_VALUES = {
  N_A: 1,
  NOT_GOOD: 2,
  CONCERNING: 3,
  ACCEPTABLE: 4,
  GOOD: 5,
  ABNORMAL: 6,
}

export const STATUS_PROCESS_LABELS: any = {
  1: 'N/A',
  2: 'Not Good',
  3: 'Concerning',
  4: 'Acceptable',
  5: 'Good',
  6: 'Abnormal',
}

export const COMPLAINT_LEVELS: OptionItem[] = [
  {
    id: 1,
    value: 1,
    label: 'H0',
  },
  {
    id: 2,
    value: 2,
    label: 'H1',
  },
  {
    id: 3,
    value: 3,
    label: 'H2',
  },
]

export const COMPLAINT_LEVELS_LABELS: any = {
  1: 'H0',
  2: 'H1',
  3: 'H2',
}

export const COMPLAINT_POINTS: any = {
  1: -5, // H0
  2: 0, // H1
  3: 0, // H2
}

export const COMPLAINT_STATUS = {
  RESOLVED: 1,
  NOT_RESOLVE: 2,
}

export const OVERALL_EVALUATION_TYPE = {
  BONUS: 1,
  PENALTY: 2,
}

export const BONUS_PENALTY_POINT_VALUES = {
  GOOD: 1,
  NA: 2,
  ACCEPTABLE: 3,
  NOT_GOOD: 4,
}

export const BONUS_PENALTY_STATUS_COLOR: any = {
  1: 'green',
  2: 'grey',
  3: 'blue',
  4: 'red',
}

export const BONUS_PENALTY_ORDINAL_NUMBERS = {
  CUSTOMER_COMPLAINT: 3,
}

export const COMPLAINT_LEVELS_VALUES = {
  H0: 1,
  H1: 2,
  H2: 3,
}

export const ACTIVITY_LOG_TIME_VALUES = {
  LAST_24_HOURS: 1,
  LAST_3_DAYS: 2,
  LAST_WEEK: 3,
  LAST_MONTH: 4,
  LAST_3_MONTHS: 5,
  LAST_6_MONTHS: 6,
  LAST_YEAR: 7,
}

export const DELIVERY_ACTIVITY_LOG_EVENT_VALUES = {
  EDIT: 1,
  ADD: 2,
  DELETE: 3,
  DELIVER: 4,
}

export const DELIVERY_ACTIVITY_LOG_EVENT_LABELS: any = {
  1: 'Edit',
  2: 'Add',
  3: 'Delete',
  4: 'Deliver',
}

export const DELIVERY_ACTIVITY_LOG_OBJECT_TYPE_LABELS: any = {
  1: 'Milestone',
  2: 'Milestone Name',
  3: 'Added Date',
  4: 'Description',
  5: 'Commitment Delivery Date',
  6: 'Actual Delivery Date',
  7: 'Status',
  8: 'Limitation',
}

export const TIMELINESS_STATUS_VALUES = {
  N_A: 1,
  ABNORMAL: 2,
  GOOD: 3,
  ACCEPTABLE: 4,
  CONCERNING: 5,
  NOT_GOOD: 6,
}

export const TIMELINESS_STATUS_LABELS: any = {
  1: 'N/A',
  2: 'Abnormal',
  3: 'Good',
  4: 'Acceptable',
  5: 'Concerning',
  6: 'Not good',
}

export const MILESTONE_STATUS = {
  NOT_DELIVER: 1,
  UP_COMING: 2,
  FAIL: 3,
  PASS: 4,
}

export const MILESTONE_STATUS_LABELS: any = {
  1: 'Not Deliver',
  2: 'Up-coming',
  3: 'Fail',
  4: 'Pass',
}

export const MILESTONE_BUTTON_DELIVER = {
  DELIVER: 1,
  DELIVERED: 2,
}

export const COST_STATUS_VALUES = {
  N_A: 1,
  ABNORMAL: 2,
  GOOD: 3,
  ACCEPTABLE: 4,
  CONCERNING: 5,
  NOT_GOOD: 6,
}

export const COST_STATUS_LABELS: any = {
  1: 'N/A',
  2: 'Abnormal',
  3: 'Good',
  4: 'Acceptable',
  5: 'Concerning',
  6: 'Not good',
}

export const PROJECT_QUALITY_LANGUAGES = [
  {
    id: 1,
    value: 1,
    label: 'English',
  },
  {
    id: 2,
    value: 2,
    label: 'Japanese',
  },
  {
    id: 3,
    value: 3,
    label: 'Korean',
  },
]

export const SATISFACTION_LABELS: any = {
  VERY_DISSATISFIED: {
    1: '1 - Very Dissatisfied',
    2: '1 - 非常に不満',
    3: '1 - 매우 불만족',
  },
  DISSATISFIED: {
    1: '2 - Dissatisfied',
    2: '2 - 不満',
    3: '2 - 불만족',
  },
  NEUTRAL: {
    1: '3 - Neutral',
    2: '3 - どちらとも言えない',
    3: '3 - 보통',
  },
  SATISFIED: {
    1: '4 - Satisfied',
    2: '4 - やや満足',
    3: '4 - 만족',
  },
  VERY_SATISFIED: {
    1: '5 - Very Satisfied',
    2: '5 - 非常に満足',
    3: '5 - 매우 만족',
  },
}

export const getProjectSatisFactionOptions = (language: number) => {
  return [
    {
      id: 1,
      value: 1,
      label: SATISFACTION_LABELS.VERY_DISSATISFIED[language],
    },
    {
      id: 2,
      value: 2,
      label: SATISFACTION_LABELS.DISSATISFIED[language],
    },
    {
      id: 3,
      value: 3,
      label: SATISFACTION_LABELS.NEUTRAL[language],
    },
    {
      id: 4,
      value: 4,
      label: SATISFACTION_LABELS.SATISFIED[language],
    },
    {
      id: 5,
      value: 5,
      label: SATISFACTION_LABELS.VERY_SATISFIED[language],
    },
  ]
}

export const PROJECT_SATISFACTION_VALUES = {
  VERY_DISSATISFIED: 1,
  DISSATISFIED: 2,
  NEUTRAL: 3,
  SATISFIED: 4,
  VERY_SATISFIED: 5,
}

export const SURVEY_TYPE_POINT_VALUES = {
  DROPDOWN: 1,
  RADIO: 2,
}

export const PROJECT_BASE_SECTION_SURVEY = {
  BRSE: 4,
  FEEDBACK: 5,
}

export const CSS_STATUS_VALUES = {
  N_A: 1,
  NOT_GOOD: 2,
  CONCERNING: 3,
  ACCEPTABLE: 4,
  GOOD: 5,
  ABNORMAL: 6,
}

export const CSS_STATUS_LABELS: any = {
  1: 'N/A',
  2: 'Not good',
  3: 'Concerning',
  4: 'Acceptable',
  5: 'Good',
  6: 'Abnormal',
}

export const SURVEY_FROM_STATE_VALUES = {
  OPEN: 1,
  CLOSED: 2,
}

export const SURVEY_FORM_STATE_LABELS: any = {
  1: 'Open',
  2: 'Closed',
}

export const SURVEY_TYPE_VALUES = {
  PROJECT_BASE: 1,
  PROJECT_LABO: 2,
}

export const FEEDBACK_LABELS: any = {
  1: {
    1: 'Sure',
    2: 'もちろん',
    3: '물론',
  },
  2: {
    1: 'Maybe',
    2: '多分',
    3: '아마',
  },
  3: {
    1: 'No',
    2: 'いいえ',
    3: '아니다',
  },
}

export const QUALITY_RATE_STATUS_VALUES = {
  N_A: 1,
  NOT_GOOD: 2,
  CONCERNING: 3,
  ACCEPTABLE: 4,
  GOOD: 5,
  ABNORMAL: 6,
}

export const QUALITY_RATE_STATUS_LABELS: any = {
  1: 'N/A',
  2: 'Not good',
  3: 'Concerning',
  4: 'Acceptable',
  5: 'Good',
  6: 'Abnormal',
}

export const KPI_COLS_SECTIONS: any = {
  1: 'css',
  2: 'bugRate',
  3: 'leakageRate',
  4: 'effortEfficiency',
  5: 'effortEfficiency',
  6: 'timeliness',
  7: 'pcv',
  8: 'bonusAndPenalty',
  9: 'effortEfficiencyProjectMerge',
}

export const KPI_COLS_LABELS: any = {
  1: 'CSS',
  2: 'Bug Rate',
  3: 'Leakage Rate',
  4: 'EE Forecast',
  5: 'EE Actual',
  6: 'Timeliness',
  7: 'PCV',
  8: 'Bonus & Penalty',
}

export const KPI_SECTIONS = {
  CSS: 1,
  BUG_RATE: 2,
  LEAKAGE_RATE: 3,
  EE_FORECAST: 4,
  EE_ACTUAL: 5,
  TIMELINESS: 6,
  PCV: 7,
  BONUS_AND_PENALTY: 8,
  EE_PROJECT_MERGE: 9,
}

export const PROJECT_RANK_OPTIONS = [
  {
    id: 1,
    value: 1,
    label: 'A',
  },
  {
    id: 2,
    value: 2,
    label: 'B',
  },
  {
    id: 3,
    value: 3,
    label: 'C',
  },
  {
    id: 4,
    value: 4,
    label: 'D',
  },
]

export const PRODUCT_TYPES_OPTIONS = [
  {
    id: 1,
    value: 1,
    label: 'New development',
  },
  {
    id: 2,
    value: 2,
    label: 'Maintain',
  },
  {
    id: 3,
    value: 3,
    label: 'Migration',
  },
  {
    id: 4,
    value: 4,
    label: 'Expand',
  },
  {
    id: 5,
    value: 5,
    label: 'Testing',
  },
  {
    id: 6,
    value: 6,
    label: 'R&D',
  },
]

export const SUCCESS_LEVEL_VALUES = {
  EXCELLENT: 1,
  GOOD: 2,
  BAD: 3,
}

export const SUCCESS_LEVEL_LABELS: any = {
  1: 'Excellent',
  2: 'Good',
  3: 'Bad',
}

export const PROJECT_ACTIVITY_LOG_EVENT_VALUES = {
  ADD: 1,
  UPDATE: 2,
  REMOVE: 3,
  DELIVER: 4,
}

export const PROJECT_ACTIVITY_LOG_EVENT_LABELS: any = {
  1: 'Add',
  2: 'Update',
  3: 'Remove',
  4: 'Deliver',
}

export const PROJECT_ACTIVITY_LOG_OBJECT_VALUES = {
  GENERAL_INFORMATION: 1,
  KPI_CSS: 2,
  KPI_TIMELINESS: 3,
  KPI_PCV: 4,
  KPI_BONUS_AND_PENALTY: 5,
  RESOURCE_ALLOCATION: 6,
}
