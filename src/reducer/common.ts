import { IFeedBack } from '@/components/modal/ModalFeedBack'
import { ORDER } from '@/modules/contract/const'
import modules from '@/modules/routes'
import { GradeResponse, IParamsGrade } from '@/modules/staff/types'
import CommonService from '@/services/common.service'
import { RootState } from '@/store'
import {
  Branch,
  CurrencyType,
  DivisionType,
  IDivision,
  IDivisionByProjectType,
  IProjectStaff,
  IQueries,
  IQueriesStaffAssignCycle,
  IQueriesStaffManager,
  IStaffInfo,
  MarketType,
  MasterCommonType,
  OptionItem,
  PositionType,
  SkillSet,
  ToggleDropDownSubMenu,
} from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { CancelTokenSource } from 'axios'
import i18next from 'i18next'
import { uniqBy } from 'lodash'
import { alertError, alertSuccess } from './screen'

const getToggleDropDownSubMenu = () => {
  const result: ToggleDropDownSubMenu = {}
  modules.forEach(module => {
    result[module.name] = false
  })
  return result
}

export interface CommonState {
  listBranches: OptionItem[]
  isLoading: boolean
  contractGroups: OptionItem[]
  contractTypes: OptionItem[]
  divisions: DivisionType[]
  divisionByProject: IDivisionByProjectType[]
  workTypes: OptionItem[]
  priorities: OptionItem[]
  skillSets: SkillSet[]
  listStatus: OptionItem[]
  listPosition: PositionType[]
  listMarket: MarketType[]
  listCurrency: CurrencyType[]
  listProvinces: any
  listGrades: OptionItem[]
  listLeaderGrades: any[]
  staffContactPersons: OptionItem[]
  projectManagers: OptionItem[]
  listCommonCustomers: OptionItem[]
  listCommonPartners: OptionItem[]
  listCommonStaffs: OptionItem[]
  totalProjectManagers: number
  totalProjects: number
  totalProjectStaffs?: number
  projectStaffs: OptionItem[]
  cancelGetStaffs: CancelTokenSource | null
  cancelGetStaffsProjectManager: CancelTokenSource | null
  cancelGetProjects: CancelTokenSource | null
  cancelGetStaffsSubProjectManager: CancelTokenSource | null
  cancelGetProjectStaffList: CancelTokenSource | null
  cancelGetDirectManagerList: CancelTokenSource | null
  cancelGetStaffShareEffort: CancelTokenSource | null
  cancelGetStaffsHeadcount: CancelTokenSource | null
  cancelGetStaffsAssignment: CancelTokenSource | null
  listContractCode: OptionItem[]
  listDashboardBranches: OptionItem[]
  itemNotify: any
  notificationsForUser: any[]
  numberOfNotification: number
  reCallNotify: boolean
  listContractByGroup: OptionItem[]
  listContractOrder: OptionItem[]
  toggleDropDownSubMenu: ToggleDropDownSubMenu
  listPositionBranch: OptionItem[]
  projectsEvaluationCycle: OptionItem[]
  cancelGetCycleStaffs: CancelTokenSource | null
  totalSaleMember: number
  totalDivisionDirectors: number
  projectCode: any
  personInChargeProject: OptionItem[]
  morRepresentative: OptionItem[]
  loadingPICProject: boolean
  loadingMorRepresentative: boolean
  cancelPIC: CancelTokenSource | null
  cancelRepresentative: CancelTokenSource | null
  cancelMemberProject: CancelTokenSource | null
  memberProject: OptionItem[]
  loadingMemberProject: boolean
  allDivisions: OptionItem[]
  divisionsShareEffort: OptionItem[]
  evaluateProjectQuestions: any
  cancelSaleMember: CancelTokenSource | null
  cancelCommonCustomers: CancelTokenSource | null
  systemDashboardDivisions: OptionItem[]
  systemDashboardDivisionsLoading: boolean
}

const initialState: CommonState = {
  listBranches: [],
  isLoading: false,
  contractGroups: [],
  contractTypes: [],
  divisions: [],
  divisionByProject: [],
  workTypes: [],
  priorities: [],
  skillSets: [],
  listStatus: [],
  listPosition: [],
  listMarket: [],
  listCurrency: [],
  listProvinces: [],
  listGrades: [],
  listLeaderGrades: [],
  staffContactPersons: [],
  projectManagers: [],
  listCommonCustomers: [],
  listCommonPartners: [],
  listCommonStaffs: [],
  totalProjectManagers: 0,
  totalProjects: 0,
  totalProjectStaffs: 0,
  projectStaffs: [],
  cancelGetStaffs: null,
  cancelGetProjects: null,
  cancelGetStaffsAssignment: null,
  cancelGetDirectManagerList: null,
  cancelGetStaffShareEffort: null,
  cancelGetStaffsProjectManager: null,
  cancelGetProjectStaffList: null,
  cancelGetStaffsSubProjectManager: null,
  cancelGetStaffsHeadcount: null,
  listContractCode: [],
  listDashboardBranches: [],
  itemNotify: {},
  notificationsForUser: [],
  numberOfNotification: 0,
  reCallNotify: false,
  listContractByGroup: [],
  listContractOrder: [],
  toggleDropDownSubMenu: getToggleDropDownSubMenu(),
  listPositionBranch: [],
  projectsEvaluationCycle: [],
  cancelGetCycleStaffs: null,
  totalSaleMember: 0,
  totalDivisionDirectors: 0,
  projectCode: null,
  personInChargeProject: [],
  loadingPICProject: false,
  cancelPIC: null,
  cancelRepresentative: null,
  morRepresentative: [],
  loadingMorRepresentative: false,
  memberProject: [],
  loadingMemberProject: false,
  cancelMemberProject: null,
  allDivisions: [],
  divisionsShareEffort: [],
  evaluateProjectQuestions: [],
  cancelSaleMember: null,
  cancelCommonCustomers: null,
  systemDashboardDivisions: [],
  systemDashboardDivisionsLoading: false,
}

export const deleteFile = createAsyncThunk(
  'common/deleteFile',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await CommonService.deleteFile(payload.id)
      if (payload.fileName) {
        dispatch(
          alertSuccess({
            message: i18next.t('common:MSG_DELETE_FILE_SUCCESS', {
              fileName: payload.fileName,
            }),
          })
        )
      }
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('common:MSG_DELETE_FILE_ERROR'),
        })
      )
      return rejectWithValue(err)
    }
  }
)

export const getBranchList = createAsyncThunk(
  'common/getBranchList',
  async (
    {
      useAllBranches,
      moduleConstant,
      subModuleConstant,
    }: {
      useAllBranches: boolean
      moduleConstant: number
      subModuleConstant: number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getBranchList({
        useAllBranches,
        moduleConstant,
        subModuleConstant,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getBranchFilterListProject = createAsyncThunk(
  'common/getBranchList',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getBranchListFilterProject()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getBranchDashboardList = createAsyncThunk(
  'common/getBranchDashboardList',
  async (
    {
      moduleConstant,
      subModuleConstant,
    }: { moduleConstant: number; subModuleConstant: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getBranchDashboardList({
        moduleConstant,
        subModuleConstant,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContractGroups = createAsyncThunk(
  'common/getContractGroups',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getContractGroups()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContractTypes = createAsyncThunk(
  'common/getContractTypes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getContractTypes()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDivisions = createAsyncThunk(
  'common/getDivisions',
  async (
    {
      moduleConstant,
      subModuleConstant,
    }: { moduleConstant: number; subModuleConstant: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getDivisions(
        moduleConstant,
        subModuleConstant
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDivisionsDashboard = createAsyncThunk(
  'common/getDivisionsDashboard',
  async (
    {
      moduleConstant,
      subModuleConstant,
    }: { moduleConstant: number; subModuleConstant: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getDivisionsDashboard(
        moduleConstant,
        subModuleConstant
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDivisionsFilterByProject = createAsyncThunk(
  'master/division-filter-project',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getDivisionsFilterByProject()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getGrades = createAsyncThunk(
  'common/getGrades',
  async (params: IParamsGrade, { rejectWithValue }) => {
    try {
      const res = await CommonService.getGrades(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getWorkTypeMbo = createAsyncThunk(
  'common/getWorkTypeMbo',
  async (
    payload: {
      isMasterData: boolean
      evaluationCycleId?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getWorkTypeMbo(
        payload.isMasterData,
        payload.evaluationCycleId || ''
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getLeaderGrades = createAsyncThunk(
  'common/getLeaderGrades',
  async (params: IParamsGrade, { rejectWithValue }) => {
    try {
      const res = await CommonService.getLeaderGrades(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getSkillSets = createAsyncThunk(
  'common/getSkillSets',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getSkillSets()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStatus = createAsyncThunk(
  'common/getStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getStatus()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getPriorities = createAsyncThunk(
  'common/getPriorities',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getPriorities()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getPositions = createAsyncThunk(
  'common/getPositions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getPositions()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getMarkets = createAsyncThunk(
  'common/getMarkets',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getMarkets()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCurrencies = createAsyncThunk(
  'common/getCurrencies',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getCurrencies()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProvinces = createAsyncThunk(
  'common/getProvinces',
  async (_, { rejectWithValue }) => {
    try {
      const res = await await CommonService.getProvinces()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStaffContactPerson = createAsyncThunk(
  'common/getStaffContactPerson',
  async (
    payload: {
      branchId: string
      moduleConstant: number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await await CommonService.getStaffContactPerson(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const notification = createAsyncThunk(
  'fire-base',
  async (value: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.notification(value)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const sendFeedback = createAsyncThunk(
  'staff/sendFeedback',
  async (value: IFeedBack, { rejectWithValue }) => {
    try {
      const res = await CommonService.sendFeedback(value)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCommonCustomers = createAsyncThunk(
  'common/getCommonCustomers',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelCommonCustomers(source))
      const res = await CommonService.getCommonCustomers(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getOutsourceCustomers = createAsyncThunk(
  'common/getOutsourceCustomers',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getOutsourceCustomers(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCommonPartners = createAsyncThunk(
  'common/getCommonPartners',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getCommonPartners(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getOutsourcePartners = createAsyncThunk(
  'common/getOutsourcePartners',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getOutsourcePartners(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCommonStaffs = createAsyncThunk(
  'common/getCommonStaffs',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffs(source))
      const res = await CommonService.getCommonStaffs(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getStaffsHeadCount = createAsyncThunk(
  'common/getStaffsHeadCount',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffsHeadcount(source))
      const res = await CommonService.getStaffsHeadCount(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getStaffsAssignment = createAsyncThunk(
  'common/getStaffsAssignment',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffsAssignment(source))
      const res = await CommonService.getStaffsAssignment(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCommonApproverStaffs = createAsyncThunk(
  'common/getCommonApproverStaffs',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffs(source))
      const res = await CommonService.getCommonApproverStaffs(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectManagerStaffs = createAsyncThunk(
  'common/getProjectManagerStaffs',
  async (params: IQueriesStaffManager, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetProjectStaffList(source))
      const res = await CommonService.getProjectManagerStaffs(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectCode = createAsyncThunk(
  'common/getProjectCode',
  async (customerId: string, { rejectWithValue }) => {
    try {
      const res = await CommonService.getProjectCode(customerId)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getSaleMemberProject = createAsyncThunk(
  'common/getSaleMemberProject',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelSaleMember(source))
      const res = await CommonService.getSaleMemberProject(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectStaffs = createAsyncThunk(
  'common/getProjectStaffs',
  async (reportDate: number, { rejectWithValue }) => {
    try {
      const res = await CommonService.getProjectStaffs(reportDate)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getDirectManager = createAsyncThunk(
  'common/getDirectManager',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetDirectManagerList(source))
      const res = await CommonService.getDirectManager(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStaffShareEffort = createAsyncThunk(
  'common/getStaffShareEffort',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffShareEffort(source))
      const res = await CommonService.getStaffShareEffort(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDivisionDirector = createAsyncThunk(
  'common/getDivisionDirector',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getDivisionDirector(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectManagers = createAsyncThunk(
  'common/getProjectManagers',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffsProjectManager(source))
      const res = await CommonService.getProjectManagers(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getProjects = createAsyncThunk(
  'common/getProjects',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetProjects(source))
      const res = await CommonService.getProjects(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStaffsProject = createAsyncThunk(
  'common/getStaffsProject',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffsSubProjectManager(source))
      const res = await CommonService.getStaffsProject(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContractCodes = createAsyncThunk(
  'common/getContractCodes',
  async (
    params: {
      customerId: string | number
      projectId: string | number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getContractCodes(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectContractCodes = createAsyncThunk(
  'common/getProjectContractCodes',
  async (param: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getProjectContractCodes(param)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContractByGroup = createAsyncThunk(
  'common/getContractByGroup',
  async (
    queryParameters: {
      group: string | number
      branchId: string | number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getContractByGroup(queryParameters)
      return { ...res, group: queryParameters.group }
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getEmployeesEvaluation = createAsyncThunk(
  'common/getEmployeesEvaluation',
  async (payload: { projectId: string }, { rejectWithValue }) => {
    try {
      const res = await CommonService.getEmployeesEvaluation(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getNotificationsForUser = createAsyncThunk(
  'common/getNotificationsForUser',
  async (queries: IQueries, { rejectWithValue }) => {
    try {
      const res = await CommonService.getNotificationsForUser(queries)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getNumberOfNotification = createAsyncThunk(
  'common/getNumberOfNotification',
  async (_: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getNumberOfNotification()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getPositionBranch = createAsyncThunk(
  'common/getPositionBranch',
  async (_: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getPositionBranch()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const readNotify = createAsyncThunk(
  'common/readNotify',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const res = await CommonService.readNotify(id)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStaffAssignEvaluationCycle = createAsyncThunk(
  'common/getStaffAssignEvaluationCycle',
  async (queries: IQueriesStaffAssignCycle, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetCycleStaffs(source))
      const res = await CommonService.getStaffAssignEvaluationCycle(queries, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectsEvaluationCycle = createAsyncThunk(
  'common/getProjectsEvaluationCycle',
  async (
    payload: {
      evaluationCycleId: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getProjectsEvaluationCycle(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getWorkingDay = createAsyncThunk(
  'common/getWorkingDay',
  async (
    payload: { startDate: number; endDate: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getWorkingDay(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getPersonInChargeProject = createAsyncThunk(
  'common/getPersonInChargeProject',
  async (
    payload: { projectId: string; keyword?: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelPIC(source))
      const res = await CommonService.getPersonInChargeProject({
        ...payload,
        config: {
          cancelToken: source.token,
        },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getMorRepresentative = createAsyncThunk(
  'common/getMorRepresentative',
  async (
    payload: { projectId: string; keyword?: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelMorRepresentative(source))
      const res = await CommonService.getMorRepresentative({
        ...payload,
        config: {
          cancelToken: source.token,
        },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getMemberProject = createAsyncThunk(
  'common/getMemberProject',
  async (
    payload: { projectId: string; keyword?: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelMemberProject(source))
      const res = await CommonService.getMemberProject({
        ...payload,
        config: {
          cancelToken: source.token,
        },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getAllDivisions = createAsyncThunk(
  'common/getAllDivisions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getAllDivisions()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDivisionsShareEffort = createAsyncThunk(
  'common/getDivisionsShareEffort',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getDivisionsShareEffort()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getMasterQuestionProject = createAsyncThunk(
  'common/getMasterQuestionProject',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getMasterQuestionProject()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getSystemDashboardDivisions = createAsyncThunk(
  'common/getSystemDashboardDivisions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getSystemDashboardDivisions()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setCancelGetStaffs(state, { payload }) {
      state.cancelGetStaffs = payload
    },
    setCancelGetStaffsProjectManager(state, { payload }) {
      state.cancelGetStaffsProjectManager = payload
    },
    setCancelGetProjects(state, { payload }) {
      state.cancelGetProjects = payload
    },
    setCancelGetProjectStaffList(state, { payload }) {
      state.cancelGetProjectStaffList = payload
    },
    setCancelGetDirectManagerList(state, { payload }) {
      state.cancelGetDirectManagerList = payload
    },
    setCancelSaleMember(state, { payload }) {
      state.cancelSaleMember = payload
    },
    setCancelGetStaffShareEffort(state, { payload }) {
      state.cancelGetStaffShareEffort = payload
    },
    setCancelGetStaffsSubProjectManager(state, { payload }) {
      state.cancelGetStaffsSubProjectManager = payload
    },
    setCancelGetStaffsHeadcount(state, { payload }) {
      state.cancelGetStaffsHeadcount = payload
    },
    setCancelGetStaffsAssignment(state, { payload }) {
      state.cancelGetStaffsAssignment = payload
    },
    resetBranches(state) {
      state.listBranches = []
      state.listDashboardBranches = []
    },
    setItemNotify(state, { payload }) {
      state.itemNotify = payload
    },
    setNotificationsForUser(state, { payload }) {
      state.notificationsForUser = payload
    },
    setNumberOfNotification(state, { payload }) {
      state.numberOfNotification = payload
    },
    setReCallNotify(state, { payload }) {
      state.reCallNotify = payload
    },
    setToggleDropDown(state, { payload }) {
      state.toggleDropDownSubMenu[payload.key] = payload.value
    },
    resetToggleDropDown(state, { payload }) {
      for (const key in state.toggleDropDownSubMenu) {
        state.toggleDropDownSubMenu[key] =
          payload.key === key ? payload.value : false
      }
    },
    setWorkTypeMbo(state, { payload }) {
      state.workTypes = payload
    },
    setCancelGetCycleStaffs(state, { payload }) {
      state.cancelGetCycleStaffs = payload
    },
    setPersonInChargeProject(state, { payload }) {
      state.personInChargeProject = payload
    },
    setCancelPIC(state, { payload }) {
      state.cancelPIC = payload
    },
    setCancelMorRepresentative(state, { payload }) {
      state.cancelRepresentative = payload
    },
    setCancelMemberProject(state, { payload }) {
      state.cancelMemberProject = payload
    },
    setCancelCommonCustomers(state, { payload }) {
      state.cancelCommonCustomers = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getDirectManager.pending, (state, a) => {
      if (state.cancelGetDirectManagerList) {
        state.cancelGetDirectManagerList.cancel()
      }
    })
    builder.addCase(getStaffShareEffort.pending, state => {
      if (state.cancelGetStaffShareEffort) {
        state.cancelGetStaffShareEffort.cancel()
      }
    })
    builder.addCase(getStaffsAssignment.pending, (state, a) => {
      if (state.cancelGetStaffsAssignment) {
        state.cancelGetStaffsAssignment.cancel()
      }
    })
    builder.addCase(getProjectManagerStaffs.pending, (state, a) => {
      if (state.cancelGetProjectStaffList) {
        state.cancelGetProjectStaffList.cancel()
      }
    })
    builder.addCase(getBranchList.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getBranchList.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.listBranches = payload.data.map((item: Branch) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getBranchList.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getBranchDashboardList.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.listDashboardBranches = payload.data
        .map((item: Branch) => ({
          ...item,
          label: item.name,
          value: item.id,
        }))
        .reverse()
    })
    builder.addCase(getContractGroups.fulfilled, (state, { payload }) => {
      state.contractGroups = payload.data.map((item: MasterCommonType) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getContractTypes.fulfilled, (state, { payload }) => {
      state.contractTypes = payload.data.map((item: MasterCommonType) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getDivisions.fulfilled, (state, { payload }) => {
      state.divisions = payload.data
    })
    builder.addCase(
      getDivisionsFilterByProject.fulfilled,
      (state, { payload }) => {
        state.divisionByProject = payload.data
      }
    )
    builder.addCase(getDivisionsDashboard.fulfilled, (state, { payload }) => {
      state.divisions = payload.data
    })
    builder.addCase(getWorkTypeMbo.fulfilled, (state, { payload }) => {
      state.workTypes = payload.data.map((workType: OptionItem) => ({
        ...workType,
        label: workType.name,
        value: workType.id,
        id: workType.id,
      }))
    })
    builder.addCase(getPriorities.fulfilled, (state, { payload }) => {
      state.priorities = payload.data.map((item: MasterCommonType) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getSkillSets.fulfilled, (state, { payload }) => {
      state.skillSets = payload.data
    })
    builder.addCase(getStatus.fulfilled, (state, { payload }) => {
      state.listStatus = payload.data.map((item: MasterCommonType) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getPositions.fulfilled, (state, { payload }) => {
      state.listPosition = payload.data
    })
    builder.addCase(getMarkets.fulfilled, (state, { payload }) => {
      state.listMarket = payload.data
    })
    builder.addCase(getCurrencies.fulfilled, (state, { payload }) => {
      state.listCurrency = payload.data
    })
    builder.addCase(getProvinces.fulfilled, (state, { payload }) => {
      state.listProvinces = payload.data
    })
    builder.addCase(getGrades.fulfilled, (state, { payload }) => {
      state.listGrades = payload.data.map((item: GradeResponse) => ({
        id: item.id,
        label: item.title,
        grade: item.grade,
        value: item.id,
      }))
    })
    builder.addCase(getGrades.rejected, (state, action) => {
      state.listGrades = []
    })
    builder.addCase(getLeaderGrades.fulfilled, (state, { payload }) => {
      state.listLeaderGrades = payload.data.map((item: GradeResponse) => ({
        id: item.id,
        label: item.title,
        grade: item.grade,
        value: item.id,
      }))
    })
    builder.addCase(getLeaderGrades.rejected, (state, action) => {
      state.listLeaderGrades = []
    })
    builder.addCase(getNumberOfNotification.fulfilled, (state, { payload }) => {
      state.numberOfNotification = payload.data
    })
    builder.addCase(getStaffContactPerson.fulfilled, (state, { payload }) => {
      state.staffContactPersons = payload.data.map(
        (contactPerson: OptionItem) => ({
          ...contactPerson,
          label: contactPerson?.name || '',
          id: contactPerson.id?.toString(),
          value: contactPerson.id?.toString(),
        })
      )
    })

    builder.addCase(getCommonCustomers.pending, state => {
      if (state.cancelCommonCustomers) {
        state.cancelCommonCustomers.cancel()
      }
    })
    builder.addCase(getCommonCustomers.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listCommonCustomers = data.content.map((customer: any) => ({
        ...customer,
        value: customer.id,
        label: customer.name,
        description: customer.abbreviation,
      }))
    })
    builder.addCase(getOutsourceCustomers.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listCommonCustomers = data.content.map((customer: any) => ({
        ...customer,
        value: customer.id,
        label: customer.name,
        description: customer.abbreviation,
      }))
    })
    builder.addCase(getCommonPartners.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listCommonPartners = data.content.map((partner: any) => ({
        ...partner,
        value: partner.id,
        label: partner.name,
        description: partner.abbreviation,
      }))
    })
    builder.addCase(getOutsourcePartners.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listCommonPartners = data.content.map((partner: any) => ({
        ...partner,
        value: partner.id,
        label: partner.name,
        description: partner.abbreviation,
      }))
    })
    builder.addCase(getCommonStaffs.pending, (state, a) => {
      if (state.cancelGetStaffs) {
        state.cancelGetStaffs.cancel()
      }
    })
    builder.addCase(getCommonStaffs.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listCommonStaffs = data.content.map((staff: OptionItem) => ({
        ...staff,
        value: staff.id,
        label: staff.name,
        description: staff.id,
      }))
    })
    builder.addCase(getStaffsProject.pending, (state, a) => {
      if (state.cancelGetStaffsSubProjectManager) {
        state.cancelGetStaffsSubProjectManager.cancel()
      }
    })
    builder.addCase(getStaffsProject.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.totalProjectStaffs = data.totalElements
    })
    builder.addCase(getStaffsHeadCount.pending, (state, a) => {
      if (state.cancelGetStaffsHeadcount) {
        state.cancelGetStaffsHeadcount.cancel()
      }
    })
    builder.addCase(getCommonApproverStaffs.pending, (state, a) => {
      if (state.cancelGetStaffs) {
        state.cancelGetStaffs.cancel()
      }
    })
    builder.addCase(getProjectCode.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.projectCode = data
    })
    builder.addCase(getProjectManagers.pending, (state, a) => {
      if (state.cancelGetStaffsProjectManager) {
        state.cancelGetStaffsProjectManager.cancel()
      }
    })
    builder.addCase(getProjectManagers.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.totalProjectManagers = data.totalElements
    })
    builder.addCase(getProjects.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.totalProjects = data.totalElements
    })
    builder.addCase(getDivisionDirector.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.totalDivisionDirectors = data.totalElements
    })

    builder.addCase(getSaleMemberProject.pending, (state, { payload }) => {
      if (state.cancelSaleMember) {
        state.cancelSaleMember.cancel()
      }
    })

    builder.addCase(getSaleMemberProject.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.totalSaleMember = data?.totalElements
    })

    builder.addCase(getProjectStaffs.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.projectStaffs = data.map((item: IProjectStaff) => ({
        ...item,
        id: item.id.toString(),
        value: item.id.toString(),
        label: item.name,
      }))
    })
    builder.addCase(getContractCodes.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listContractCode =
        data?.content.map((option: any) => ({
          id: option.id,
          value: option.id,
          label: option.code,
          buyer: option?.buyer,
          seller: option?.seller,
          expectedValue: option?.expectedValue,
          orderType: option?.orderType,
          rate: option?.rate,
          currency: option?.currency,
        })) || []
    })
    builder.addCase(getContractCodes.rejected, (state, { payload }) => {
      state.listContractCode = []
    })
    builder.addCase(getContractByGroup.fulfilled, (state, { payload }) => {
      const { data } = payload
      state[
        payload.group == ORDER ? 'listContractOrder' : 'listContractByGroup'
      ] =
        data?.map((option: OptionItem) => ({
          ...option,
          id: option.id,
          value: option.id,
          label: option.code,
        })) || []
    })
    builder.addCase(getPositionBranch.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listPositionBranch = data.map((item: OptionItem) => ({
        id: item.id,
        value: item.id,
        label: item.name,
      }))
    })
    builder.addCase(getProjectContractCodes.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listContractCode =
        data?.map((option: any) => ({
          id: option.id,
          value: option.id,
          label: option.code,
          buyer: option?.buyer,
          seller: option?.seller,
          expectedValue: option?.expectedValue,
          orderType: option?.orderType,
          rate: option?.rate,
          currency: option?.currency,
        })) || []
    })
    builder.addCase(
      getProjectsEvaluationCycle.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        state.projectsEvaluationCycle = data.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.id,
        }))
      }
    )
    builder.addCase(getStaffAssignEvaluationCycle.pending, state => {
      if (state.cancelGetCycleStaffs) {
        state.cancelGetCycleStaffs.cancel()
      }
    })
    builder.addCase(getPersonInChargeProject.pending, state => {
      state.loadingPICProject = true
      if (state.cancelPIC) {
        state.cancelPIC.cancel()
      }
    })
    builder.addCase(
      getPersonInChargeProject.fulfilled,
      (state, { payload }) => {
        state.loadingPICProject = false
        const listUniqbyId: any = uniqBy(payload.data, 'id')
        state.personInChargeProject = listUniqbyId.map((item: IStaffInfo) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.name}`,
        }))
      }
    )
    builder.addCase(getPersonInChargeProject.rejected, (state, { payload }) => {
      setTimeout(() => {
        state.loadingPICProject = false
      })
    })

    builder.addCase(getMorRepresentative.pending, state => {
      state.loadingMorRepresentative = true
      if (state.cancelRepresentative) {
        state.cancelRepresentative.cancel()
      }
    })
    builder.addCase(getMorRepresentative.fulfilled, (state, { payload }) => {
      state.loadingMorRepresentative = false
      state.morRepresentative = payload.data.map((item: IStaffInfo) => ({
        ...item,
        value: item.id,
        label: item.name,
      }))
    })
    builder.addCase(getMorRepresentative.rejected, (state, { payload }) => {
      setTimeout(() => {
        state.loadingMorRepresentative = false
      })
    })

    builder.addCase(getMemberProject.pending, state => {
      state.loadingMemberProject = true
      if (state.cancelMemberProject) {
        state.cancelMemberProject.cancel()
      }
    })
    builder.addCase(getMemberProject.fulfilled, (state, { payload }) => {
      state.loadingMemberProject = false
      const listUniqbyId: any = uniqBy(payload.data, 'id')
      state.memberProject = listUniqbyId.map((item: IStaffInfo) => ({
        ...item,
        value: item.id,
        label: item.name,
      }))
    })
    builder.addCase(getMemberProject.rejected, (state, { payload }) => {
      setTimeout(() => {
        state.loadingMemberProject = false
      })
    })

    builder.addCase(getAllDivisions.fulfilled, (state, { payload }) => {
      const allDivisions: OptionItem[] = []
      payload.data.forEach(({ divisions }: any) => {
        divisions.forEach((division: any) => {
          allDivisions.push({
            id: division.divisionId,
            value: division.divisionId,
            label: division.name,
          })
        })
      })
      state.allDivisions = allDivisions
    })

    builder.addCase(getDivisionsShareEffort.fulfilled, (state, { payload }) => {
      const allDivisions: any = []
      payload.data.forEach(({ divisions, branches }: any) => {
        divisions.forEach((division: any) => {
          allDivisions.push({
            id: division.divisionId,
            value: division.divisionId,
            label: division.name,
            branchId: branches.id,
          })
        })
      })
      state.divisionsShareEffort = allDivisions
    })

    builder.addCase(
      getMasterQuestionProject.fulfilled,
      (state, { payload }) => {
        const result: any = []
        payload.data.forEach((item: any) => {
          item.question.forEach((questionItem: any) => {
            result.push({
              id: questionItem.id,
              value: questionItem.id,
              label: questionItem.name,
              point: questionItem.point,
              complaint: questionItem.complaint,
              bonusPenalty: item.typeQuestion.id,
            })
          })
        })
        state.evaluateProjectQuestions = result
      }
    )

    builder.addCase(getSystemDashboardDivisions.pending, state => {
      state.systemDashboardDivisionsLoading = true
    })

    builder.addCase(
      getSystemDashboardDivisions.fulfilled,
      (state, { payload }) => {
        state.systemDashboardDivisions = payload.data[0]?.divisions?.map(
          (item: IDivision) => ({
            id: item.divisionId,
            value: item.divisionId,
            label: item.name,
          })
        )
        state.systemDashboardDivisionsLoading = false
      }
    )

    builder.addCase(getSystemDashboardDivisions.rejected, state => {
      state.systemDashboardDivisionsLoading = false
    })
  },
})

export const {
  setCancelGetStaffs,
  setCancelGetStaffsProjectManager,
  setCancelGetProjects,
  setCancelGetProjectStaffList,
  setCancelGetDirectManagerList,
  setCancelGetStaffsSubProjectManager,
  setCancelGetStaffsHeadcount,
  setCancelGetStaffsAssignment,
  resetBranches,
  setItemNotify,
  setNotificationsForUser,
  setNumberOfNotification,
  setReCallNotify,
  setToggleDropDown,
  resetToggleDropDown,
  setWorkTypeMbo,
  setCancelGetCycleStaffs,
  setPersonInChargeProject,
  setCancelPIC,
  setCancelMorRepresentative,
  setCancelMemberProject,
  setCancelGetStaffShareEffort,
  setCancelSaleMember,
  setCancelCommonCustomers,
} = commonSlice.actions

export const commonSelector = (state: RootState) => state['common']

export default commonSlice.reducer
