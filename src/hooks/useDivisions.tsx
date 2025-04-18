import { BRANCH_TYPE, SUB_MODULE_STAFF_FILTER } from '@/const/app.const'
import {
  commonSelector,
  CommonState,
  getDivisions,
  getDivisionsDashboard,
  getDivisionsFilterByProject,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import {
  DivisionType,
  IDivision,
  IDivisionByProjectType,
  OptionItem,
} from '@/types'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const useDivisions = ({
  branchId,
  isFullData = true,
  isProject = false,
  isFilterProject = false,
  listDivision = [],
  isDashboard = false,
  isMergeProjectGeneral,
  moduleConstant,
  subModuleConstant = SUB_MODULE_STAFF_FILTER,
}: {
  branchId?: string
  isFullData?: boolean
  isProject?: boolean
  isFilterProject?: boolean
  listDivision?: OptionItem[]
  isDashboard?: boolean
  isMergeProjectGeneral?: boolean
  moduleConstant: number
  subModuleConstant?: number
}) => {
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const { divisions, divisionByProject }: CommonState =
    useSelector(commonSelector)
  const listOptions: OptionItem[] = useMemo(() => {
    const result: any[] = []
    if (!branchId && isFullData && isProject) {
      return divisionByProject.map((item: IDivisionByProjectType) => ({
        label: item.name,
        value: item.divisionId,
        id: item.divisionId,
      }))
    }
    if (!branchId && isFullData && !isProject) {
      divisions.forEach((item: DivisionType) => {
        result.push(...item.divisions)
      })
      const newDivisions = result.map((item: IDivision) => ({
        ...item,
        label: item.name,
        value: item.divisionId,
        id: item.divisionId,
      }))
      if (isMergeProjectGeneral && listDivision.length) {
        const projectGeneralDivisionIds = listDivision.map(
          division => division.id
        )
        const divisionsFiltered = newDivisions.filter(item =>
          projectGeneralDivisionIds.includes(item.id)
        )
        return !!divisionsFiltered.length ? divisionsFiltered : newDivisions
      }
      return newDivisions
    } else if (branchId && !isProject) {
      divisions.forEach((item: DivisionType) => {
        if (branchId && branchId !== BRANCH_TYPE.ALL_BRANCH.id) {
          if (branchId === item.branches.id) {
            result.push(...item.divisions)
          }
        } else {
          result.push(...item.divisions)
        }
      })
      return result.map((item: IDivision) => ({
        ...item,
        label: item.name,
        value: item.divisionId,
        id: item.divisionId,
      }))
    } else if (branchId && isProject) {
      divisionByProject.forEach((item: IDivisionByProjectType) => {
        if (branchId && branchId !== BRANCH_TYPE.ALL_BRANCH.id) {
          if (branchId === item.branchId) {
            result.push(item)
          }
        } else {
          result.push(item)
        }
      })
      return result.map((item: IDivisionByProjectType) => ({
        label: item.name,
        value: item.divisionId,
        code: item.divisionId,
        id: item.divisionId,
      }))
    } else return listDivision || []
  }, [listDivision, branchId, divisionByProject, divisions])

  const isStaffModule = useMemo(() => {
    return location.pathname.split('/')[1] === 'staff'
  }, [location.pathname])

  useEffect(() => {
    if (isFilterProject) {
      dispatch(getDivisionsFilterByProject())
    } else if (!isProject && !isDashboard) {
      dispatch(
        getDivisions({
          moduleConstant,
          subModuleConstant,
        })
      )
    } else {
      dispatch(
        getDivisionsDashboard({
          moduleConstant,
          subModuleConstant,
        })
      )
    }
  }, [isStaffModule])
  return [listOptions]
}

export default useDivisions
