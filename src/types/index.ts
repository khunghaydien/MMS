import { ChangeEvent, ReactElement, ReactNode } from 'react'

export type TypographyStyles = {
  color?: string
  fontSize?: number
  fontWeight?: number
}

export type EventInput = ChangeEvent<HTMLInputElement>

export type LoginFormControls = {
  email: string
  password: string
}

export type LoginFormErrors = {
  emailError: boolean
  passwordError: boolean
}

export type LoginFormMessageErrors = {
  emailErrorMessage: string
  passwordErrorMessage: string
}

export type AlertInfo = {
  title: string
  message: string
  type: string
}

export type TokenApi = {
  accessToken: string
  refreshToken: string
  email: string
}

export enum StatusBinary {
  TRUE = 1,
  FALSE = 0,
}

export type LoginApiResponse = {
  data: TokenApi
  hasError: boolean
  message: string | null
  status: number
}

export type BackEndGlobalResponse = {
  data: any
  hasError: boolean
  message: string | null
  status: number
}

export type NavItem = {
  id: number
  label: string
  pathNavigate: string
  pathRoot: string
  activeChildren: string
}

export type IDateAssignStaff = {
  startDate: number
  endDate: number
}

export type OptionItem = {
  id?: number | string
  label?: string
  value?: number | string
  disabled?: boolean
  name?: string
  code?: string
  checked?: boolean
  note?: string
  description?: string
  effortUsedInMonth?: string
  email?: string
  positionName?: string
  comment?: string
  projectManagers?: IProjectManager[]
  dateAssignStaff?: IDateAssignStaff[]
  requestId?: string
  uuid?: string | number
  point?: string | number
}

export type Installment = {
  id?: number | string
  installmentNo: number
  date: number | null
  percentage: string
}

export type Branch = {
  id: string
  name: string
  note: string
}

export type Permission = {
  id: number
  module: string
  usableFunction: string
}

export type UserPermission = {
  useCustomerAndPartnerDashboard?: boolean
  useCustomerList?: boolean
  useCustomerDetail?: boolean
  useCustomerCreate?: boolean
  useCustomerUpdate?: boolean
  useCustomerDelete?: boolean
  usePartnerList?: boolean
  usePartnerDetail?: boolean
  usePartnerCreate?: boolean
  usePartnerUpdate?: boolean
  usePartnerDelete?: boolean
  useProjectDashboard?: boolean
  useProjectList?: boolean
  useProjectDetail?: boolean
  useProjectCreate?: boolean
  useProjectUpdate?: boolean
  useProjectDelete?: boolean
  useProjectUpdateGeneralInfo?: boolean
  useProjectUpdateHeadcountInfo?: boolean
  useProjectUpdateStaffInfo?: boolean
  useProjectUpdateProjectRevenueInfo?: boolean
  useProjectUpdateDivisionRevenueInfo?: boolean
  useProjectUpdateOutsourceCostInfo?: boolean
  useProjectUpdateDivisionCostInfo?: boolean
  useProjectViewHeadcountInfo?: boolean
  useProjectViewDivisionRevenueInfo?: boolean
  useProjectViewDivisionCostInfo?: boolean
  useStaffDashboard?: boolean
  useStaffList?: boolean
  useStaffOutsourcingList?: boolean
  useStaffOutsourcingDetail?: boolean
  useStaffDetail?: boolean
  useStaffCreate?: boolean
  useStaffUpdate?: boolean
  useStaffDelete?: boolean
  useFinanceDashboard?: boolean
  useFinanceKpiConfiguration?: boolean
  useContractList?: boolean
  useContractCreate?: boolean
  useContractUpdate?: boolean
  useContractDelete?: boolean
  useContractDashboard?: boolean
  useDailyReportGeneral?: boolean
  useDailyReportProjectManagerGeneral?: boolean
  useMBOCriteriaGeneral?: boolean
  useMBOCycleGeneral?: boolean
  useMBOMyEvaluation?: boolean
  useMBOProjectMemberEvaluation?: boolean
  useMBOTeamMemberEvaluation?: boolean
  useMBOEvaluationProcess?: boolean
  useMBOViewEvaluationManager?: boolean
  useMBOViewEvaluationInfo?: boolean
  useMBOAchievement?: boolean
  useSystemDashboard?: boolean
  useProjectExPortKpi?: boolean
}

export type MasterCommonType = {
  id: number
  name: string
}

export interface IEmployee {
  id: number | string
  name: any
  position: string
  employeeId: string
  no?: number
  action?: any
  email?: string
}
export interface IDivision {
  id?: number | string
  branchId: string
  divisionId: string
  name: string
  note: string | null
}

export type DivisionType = {
  branches: Branch
  divisions: IDivision[]
}

export type IDivisionByProjectType = {
  branchId: string
  divisionId: string
  name: string
  note: string
}

export interface ISkillSet {
  name: string
  note: string
  skillSetGroupId: number | string
  skillSetId: number | string
}

export type SkillSet = {
  id: number
  name: string
  note: string
  skillSets: ISkillSet[]
}

export type ErrorResponse = {
  field: string
  message: string
}

export type PayloadUpdate = {
  id: string
  requestBody: any
}

export type CurrencyOptions = {
  style?: string
  currency?: string
}

export type IQueries = {
  pageNum?: number
  pageSize?: number
  sortBy?: string
  orderBy?: 'desc' | 'asc'
}

export type IQueriesStaffAssignCycle = {
  templateId?: string
  name?: string
  positionId?: string
}

export type IQueriesStaffManager = {
  staffId: number | string
  sortBy?: string
  orderBy?: 'desc' | 'asc'
  pageNum?: number
  pageSize?: number
  keyword?: string
}

export type OrderBy = 'desc' | 'asc'
export type CustomerAndPartnerSortBy =
  | 'branchId'
  | 'collaborationStartDate'
  | 'contactName'
  | 'id'
  | 'market'
  | 'name'
  | 'noteStatus'
  | 'priority'
  | 'scale'
  | 'serviceIds '
  | 'latest'

export interface IStatus {
  color: IColor
  label: string
  type?: number
}

export interface IAction {
  type?: 'delete' | 'edit'
}

export type StepConfig = {
  step: number
  label: string
  isVisible?: boolean
  disabled?: boolean
  icon?: ReactElement
}

export type MarketType = {
  id?: number
  name?: string
  acronym?: string
  note?: string | null
}

export type IPosition = {
  id: string
  name: string
  note: string | null
}

export type PositionType = {
  division: IDivision
  positions: Array<IPosition>
}

export interface DateRange {
  startDate: Date | null | undefined
  endDate: Date | null | undefined
}

export interface Division {
  branchId: string
  divisionId: string
  name: string
  note?: string | null
}

export type CurrencyType = {
  id: number
  name: string
  ratio: number
  code: string
}

export type Province = {
  id: number
  code: string
  name: string
  note: any
  marketId: number
}

export type IStatusConstant = {
  label: string
  color: IColor
  type: number
}

export type IColor =
  | 'orange'
  | 'blue'
  | 'yellow'
  | 'red'
  | 'green'
  | 'grey'
  | 'violet'
  | 'earthy'
  | ''

export interface IProjectManager {
  code: string
  id: number | string
  name: string
  email: string
}
export interface IProject {
  code: string
  id: number | string
  name: string
  email: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export type Notification = {
  token: string
  type: string
}

export interface ForgotPassword {
  email: string
}

export interface ComfirmResetPassword {
  newPassword: string
  confirmNewPassword: string
  token: string
}

export interface IProjectStaff extends IProjectManager {}

export interface IStaffInfo {
  code: string
  id: number
  name: string
  branch: {
    id: string
    name: string
  }
  dateOfBirth: string
  directManager: {
    id: string
    name: string
    code: string
  }
  directLeader: {
    id: string
    name: string
    code: string
  }
  division: {
    id: string
    name: string
  }
  email: string
  positionName: string
  positionId: string | number
}

export interface IUserInfo {
  id: number | string
  email: string | number
  name: string | number
}

export interface Pagination {
  pageNum: number
  pageSize: number
}

export interface IFileUpload {
  file?: any
  status: 'success' | 'error' | 'loading' | string
  loading: number
  filename: string
  id: string | number
  lastUpdate: number
  uploadDate?: number
  size?: number
  type?: string
  url?: string
  maxFile?: number
  maxSize?: number
}

export interface IExportListToExcelBody {
  fieldNames?: string[]
  ids: string[]
  sortBy?: string
  orderBy?: string
}

export interface UploadAcceptFileTypes {
  [key: string]: string[]
}

export interface FileItem {
  FileObject: File
  id: string
  url?: string
}

export type ToggleDropDownSubMenu = {
  [key: string]: boolean
}

export interface TableHeaderColumn {
  id: string
  label: string
  subLabel?: string | ReactNode
  align?: 'left' | 'center' | 'right'
  sortBy?: string
  orderBy?: 'asc' | 'desc'
  checked?: boolean
  isVisible?: boolean
  ellipsisNumber?: number
  isHighlight?: boolean
  tooltip?: string | ReactNode
  editable?: boolean
  type?: string
  rowSpan?: number
  isBlueBackground?: boolean
  isWeekend?: boolean
  maxWidth?: string
  className?: string
}

export interface SortChangePayload {
  sortBy: string
  preOrderBy: string
  nextOrderBy: string
  newColumns: TableHeaderColumn[]
}

export interface TablePaginationProps {
  totalElements: number
  pageSize: number
  pageNum: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newPageSize: number) => void
}

export interface DynamicStringFields {
  [fieldName: string]: string
}

export interface RangeDate {
  startDate: Date | number | null
  endDate: Date | number | null
}

export interface WeekPayload {
  year: number
  week: number
}
