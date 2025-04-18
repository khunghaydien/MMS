import { TableConstant } from '@/const'
import { IStatusConstant } from '@/types'
import { StepConfig } from '../types'
import { ListStaffParams } from '../types/staff-list'

export const STAFF_STEP: { [key: string]: number } = {
  GENERAL_INFORMATION: 0,
  SKILL_SET: 1,
  CONTRACT: 2,
  PROJECT: 3,
}
export const STAFF_STEP_DETAIL: { [key: string]: number } = {
  GENERAL_INFORMATION: 0,
  SKILL_SET: 1,
  PROJECT: 2,
}

export const CONFIG_STAFF_STEP: StepConfig[] = [
  {
    step: STAFF_STEP.GENERAL_INFORMATION,
    label: 'General Information',
  },
  {
    step: STAFF_STEP.SKILL_SET,
    label: 'Skillset',
  },
  {
    step: STAFF_STEP.CONTRACT,
    label: 'Contract',
  },
]

export const genders = [
  {
    id: '1',
    label: 'Male',
    value: '1',
    disabled: false,
  },
  {
    id: '2',
    label: 'Female',
    value: '2',
    disabled: false,
  },
  {
    id: '3',
    label: 'Other',
    value: '3',
    disabled: false,
  },
]
export const statusOutsourcing = [
  {
    id: '1',
    label: 'Active',
    value: '1',
    disabled: false,
  },
  {
    id: '2',
    label: 'Inactive',
    value: '2',
    disabled: false,
  },
  {
    id: '3',
    label: 'Onsite',
    value: '3',
    disabled: false,
  },
]
export const status = [
  {
    id: '1',
    label: 'Active',
    value: '1',
    disabled: false,
  },
  {
    id: '2',
    label: 'Inactive',
    value: '2',
    disabled: false,
  },
  {
    id: '3',
    label: 'Onsite',
    value: '3',
    disabled: false,
  },
  {
    id: '4',
    label: 'Temporary Leave',
    value: '4',
    disabled: false,
  },
]

export const JOB_TYPE_PROBATION = '1'
export const JOB_TYPE_OFFICICAL = '2'
export const JOB_TYPE_INTERN = '3'
export const JOB_TYPE_FREELANCER = '4'

export const jobType = [
  {
    id: JOB_TYPE_FREELANCER,
    label: 'Freelancer',
    value: JOB_TYPE_FREELANCER,
    disabled: false,
  },
  {
    id: JOB_TYPE_INTERN,
    label: 'Intern',
    value: JOB_TYPE_INTERN,
    disabled: false,
  },
  {
    id: JOB_TYPE_PROBATION,
    label: 'Probation',
    value: JOB_TYPE_PROBATION,
    disabled: false,
  },
  {
    id: JOB_TYPE_OFFICICAL,
    label: 'Official',
    value: JOB_TYPE_OFFICICAL,
    disabled: false,
  },
]
export const jobTypeChange = [
  {
    id: JOB_TYPE_INTERN,
    label: 'Intern',
    value: JOB_TYPE_INTERN,
    disabled: false,
  },
  {
    id: JOB_TYPE_PROBATION,
    label: 'Probation',
    value: JOB_TYPE_PROBATION,
    disabled: false,
  },
  {
    id: JOB_TYPE_OFFICICAL,
    label: 'Official',
    value: JOB_TYPE_OFFICICAL,
    disabled: false,
  },
]

export const levels = [
  {
    id: 'S',
    label: 'S',
    value: 'S',
    disabled: false,
  },
  {
    id: 'A',
    label: 'A',
    value: 'A',
    disabled: false,
  },
  {
    id: 'B',
    label: 'B',
    value: 'B',
    disabled: false,
  },
  {
    id: 'C',
    label: 'C',
    value: 'C',
    disabled: false,
  },
  {
    id: 'D',
    label: 'D',
    value: 'D',
    disabled: false,
  },
]

export const STAFF_STATUS_TYPE = {
  ON_BOARD: 0,
  ACTIVE: 1,
  INACTIVE: 2,
  ON_SITE: 3,
  STATUS_TEMPORARY_LEAVE: 4,
  RE_ACTIVE: 5,
}
export const STAFF_STATUS: { [key: number]: IStatusConstant } = {
  [STAFF_STATUS_TYPE.ON_BOARD]: {
    type: 0,
    label: 'Active',
    color: 'green',
  },
  [STAFF_STATUS_TYPE.ACTIVE]: {
    type: 1,
    label: 'Active',
    color: 'green',
  },
  [STAFF_STATUS_TYPE.INACTIVE]: {
    type: 2,
    label: 'InActive',
    color: 'red',
  },
  [STAFF_STATUS_TYPE.ON_SITE]: {
    type: 3,
    label: 'On-site',
    color: 'blue',
  },
  [STAFF_STATUS_TYPE.STATUS_TEMPORARY_LEAVE]: {
    type: 4,
    label: 'Temporary Leave',
    color: 'yellow',
  },
}

export const GENERAL_INFO_STAFF_INIT = {
  staffName: '',
  gender: '',
  birthday: null,
  email: '',
  directManager: {},
  director: {},
  branchId: '',
  divisionId: '',
  position: '',
  onboardDate: null,
  gradeId: '',
  leaderGradeId: '',
  status: {
    status: {
      id: '',
    },
  },
  jobType: '',
  lastWorkingDate: 0,
  phoneNumber: '',
  contractExpiredDate: null,
  customer: {},
  partner: {},
  staffWorkingHistory: {},
  freelancerPeriods: [{ id: null, startDate: null, endDate: null }],
  jobChangeRequest: {
    isChangeJobType: false,
    jobType: '',
    onboardDate: null,
    jobEndDate: null,
    jobStartDate: null,
    freelancerPeriods: [{ id: null, startDate: null, endDate: null }],
  },
}
export const keyItemGeneralInformationStaff: any[] = [
  {
    key: 'Status',
    value: 'status',
  },
  {
    key: 'Branch',
    value: 'branchName',
  },
  {
    key: 'Division',
    value: 'divisionName',
  },
  {
    key: 'Direct Manager',
    value: 'directManager',
  },
  {
    key: 'Gender',
    value: 'gender',
  },
  {
    key: 'Phone Number',
    value: 'phoneNumber',
  },
  {
    key: 'Created person',
    value: 'createdBy',
  },
]

export const keyItemGeneralInformationStafOfficial: any[] = [
  {
    key: 'Job Type',
    value: 'jobType',
  },
  {
    key: 'Start Date',
    value: 'jobStartDate',
  },
]

export const keyItemGeneralInformationStafIntern: any[] = [
  {
    key: 'Job Type',
    value: 'jobType',
  },
  {
    key: 'Start Date',
    value: 'jobStartDate',
  },
  {
    key: 'End Date',
    value: 'jobEndDate',
  },
]

export const keyItemGeneralInformationStaffProbation: any[] = [
  {
    key: 'Job Type',
    value: 'jobType',
  },
  {
    key: 'Onboard Date',
    value: 'onboardDate',
  },
  {
    key: 'End Date',
    value: 'jobEndDate',
  },
]

export const keyItemGeneralInformationHROutsource: any[] = [
  {
    key: 'Created person',
    value: 'createdBy',
  },
  {
    key: 'Branch',
    value: 'branchName',
  },
  {
    key: 'Division',
    value: 'divisionName',
  },
  {
    key: 'Gender',
    value: 'gender',
  },
  {
    key: 'Phone Number',
    value: 'phoneNumber',
  },
  {
    key: 'Status',
    value: 'status',
  },
  {
    key: 'Onboard Date',
    value: 'onboardDate',
  },
  {
    key: 'Contract Expired Date',
    value: 'contractExpiredDate',
  },
  {
    key: 'Partner',
    value: 'partner',
  },
  {
    key: 'Customer',
    value: 'customer',
  },
]

export const DEFAULT_CONFIG_CHART: any = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  credits: {
    enabled: false,
  },
  colors: [
    '#F86868',
    '#0B68A2',
    '#2CB0ED',
    '#FADB61',
    '#BCCCDC',
    '#52D1DA',
    '#CF2D71',
    '#FE7E04',
    '#C1DB3C',
    '#FEC3C6',
    '#F6D001',
    '#C8E0E0',
    '#AB8266',
  ],
  title: {
    text: ``,
    style: {
      fontSize: '32px',
      fontWeight: '500',
    },
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
    series: {
      dataLabels: {
        enabled: true,
        connectorWidth: 0,
        connectorPadding: -5,
        padding: 0,
        format: '{point.name}: ({point.y}%)',
        style: {
          fontSize: '12px',
          fontWeight: '400',
        },
      },
    },
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        connectorWidth: 0,
        distance: 10,
        format: '{point.y}',
        filter: {
          property: 'percentage',
          operator: '>',
          value: 0,
        },
      },
      showInLegend: true,
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: <b>{point.percent}%</b> of total<br/>',
  },
  series: [
    {
      name: '',
      colorByPoint: true,
      data: [] as any,
    },
  ],
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
      },
    ],
  },
  legend: {
    align: 'left',
    verticalAlign: 'top',
    y: 100,
    layout: 'vertical',
    itemMarginBottom: 24,
    itemStyle: {
      fontSize: '1.1em',
    },
  },
}

export const DEFAULT_CONFIG_STAFF_STATISTIC = {
  chart: {
    type: 'column',
    zoomType: 'y',
  },
  title: {
    text: '',
  },
  subtitle: {
    text: '',
  },
  xAxis: {
    categories: [],
    title: {
      text: null,
    },
    accessibility: {
      description: '',
    },
  },
  yAxis: {
    min: 0,
    tickInterval: 2,
    title: {
      text: '',
    },
    labels: {
      overflow: 'justify',
      format: '{value}',
    },
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        format: '{y}',
      },
    },
    series: {
      pointWidth: 50,
    },
  },
  colors: [
    '#F86868',
    '#0B68A2',
    '#2CB0ED',
    '#FADB61',
    '#BCCCDC',
    '#52D1DA',
    '#CF2D71',
    '#FE7E04',
    '#C1DB3C',
    '#FEC3C6',
    '#F6D001',
    '#C8E0E0',
    '#AB8266',
  ],
  tooltip: {
    valueSuffix: '',
    stickOnContact: true,
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      name: '' as string,
      data: [] as any[],
    },
  ],
  accessibility: {
    enabled: false,
    announceNewData: {
      enabled: true,
    },
  },
  credits: {
    enabled: false,
  },
}

export const DEFAULT_CONFIG_CHART_BAR = {
  chart: {
    type: 'column',
    zoomType: 'y',
  },
  title: {
    text: '',
  },
  subtitle: {
    text: '',
  },
  xAxis: {
    categories: ['Previous Date', 'Current Date'],
    title: {
      text: null,
    },
    accessibility: {
      description: 'Countries',
    },
  },
  yAxis: {
    min: 0,
    tickInterval: 2,
    title: {
      text: '',
    },
    labels: {
      overflow: 'justify',
      format: '{value}',
    },
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        format: '{y}',
      },
    },
    series: {
      pointWidth: 115,
    },
  },
  colors: ['#F37421', '00BFFE'],
  tooltip: {
    valueSuffix: '',
    stickOnContact: true,
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      name: '' as string,
      data: [] as any[],
    },
  ],
  accessibility: {
    enabled: false,
    announceNewData: {
      enabled: true,
    },
  },
  credits: {
    enabled: false,
  },
}

export const initialFiltersDashboard = {
  branchId: '',
  startDate: new Date(new Date().getFullYear(), 0, 1),
  endDate: new Date(new Date().getFullYear(), 11, 31),
  divisionId: '',
}

export const staffQueryParameters: ListStaffParams = {
  branchId: [],
  divisionIds: [],
  startDate: null,
  endDate: null,
  jobType: [],
  keyword: '',
  orderBy: 'desc',
  sortBy: 'modifiedAt',
  status: [],
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  pageSize: TableConstant.LIMIT_DEFAULT,
  skillsId: [],
  partnerId: [],
  positionIds: [],
  customerId: [],
}
