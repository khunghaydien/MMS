export interface IDataFilter {
  branchId?: string
  divisionId?: string
  year?: Date | null | number
  date?: Date | null | number
}

export type IFinanceState = {
  finance?: any
  configKpi: IConfigKpi
  branchExpectedList?: IConfigBranchExpected[]
  configurations?: IConfigBranchExpected[]
}

export type IConfigKpi = {
  moduleId?: string
  year?: number | null
  configuration?: IConfigBranchExpected[]
}

export type IConfigBranchExpected = {
  id?: string | number
  branchId?: string
  division?: IConfigDivisionExpected[]
  expectedKPI?: string | number
}

export type IConfigDivisionExpected = {
  id?: string | number
  divisionId?: string
  expectedKPI?: string | number
}
