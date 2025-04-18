import { HttpStatusCode } from '@/api/types'
import { RootState } from '@/store'
import { downloadFileFromByteArr, formatFilesResponse } from '@/utils'
import { createSlice } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { SkillSetListItem } from '../components/ModalExportSkillSets/ModalExportSkillSets'
import {
  GENERAL_INFO_STAFF_INIT,
  STAFF_STEP,
  staffQueryParameters,
} from '../const'
import { StaffState } from '../types'
import {
  formatResponseGeneralInfoStaff,
  formatResponseSkillSet,
} from '../utils'
import {
  downLoadImageUrl,
  exportListHROutsourceToExcel,
  exportStaffList,
  getCVs,
  getCertificates,
  getContracts,
  getDashboardStaff,
  getDetailStaff,
  getDetailStaffOutsource,
  getListHROutsourceIds,
  getListIds,
  getListStaff,
  getListStaffOutsource,
  getSkillSets,
  getStaffProject,
} from './thunk'

interface SkillSetRes {
  id: number
  level: string
  note: string
  yearsOfExperience: number
  skillGroup: {
    id: number
    name: string
  }
  skillName: {
    id: number
    name: string
  }
}

export const refactorSkillSetList = (
  dataContentApi: SkillSetRes[]
): SkillSetListItem[] => {
  const result: SkillSetListItem[] = []
  const skillGroupIds: {
    id: number
    name: string
  }[] = uniqBy(
    dataContentApi.map((item: SkillSetRes) => ({
      id: item.skillGroup.id,
      name: item.skillGroup.name,
    })),
    'id'
  )
  skillGroupIds.forEach((skillGroup: { id: number; name: string }) => {
    result.push({
      id: skillGroup.id.toString(),
      skillGroupName: skillGroup.name,
      skillSetLevels: dataContentApi
        .filter((item: SkillSetRes) => item.skillGroup.id === skillGroup.id)
        .map((item: SkillSetRes) => ({
          id: item.skillName.id.toString(),
          level: item.level,
          skillName: item.skillName.name,
          yearOfExperience: item.yearsOfExperience.toString(),
          note: item.note,
        })),
    })
  })
  return result.reverse()
}

const initialState: StaffState = {
  staffList: [],
  staffListOutsource: [],
  skillSetStaffs: [],
  totalElementsStaff: 0,
  contracts: [],
  certificates: [],
  totalElementsCVs: 0,
  cvs: [],
  total: 0,
  totalElementsContract: 0,
  isListFetchingHROutsource: false,
  totalHROutsource: 0,
  totalElementsCertificate: 0,
  activeStep:
    +(sessionStorage.getItem('staffActiveTab') || '') ||
    STAFF_STEP.GENERAL_INFORMATION,
  isRollbackGeneralStep: false,
  generalInfoStaff: GENERAL_INFO_STAFF_INIT,
  staffProject: {
    total: 0,
    data: [],
  },
  staffHeadcounts: {
    monthly: [],
    actual: [],
    headcountUsedByMonth: false,
  },
  skillSetList: [],
  staffDashboardStatisticPosition: {},
  staffDashboardStatisticStatus: {},
  staffDashboardComparison: {},
  staffDashboardIdealStatsSE: [],
  staffDashboardIdealStatsQC: [],
  staffDashboardOnboardStatistic: {},
  staffDashboardTurnoverRate: 0,
  isListFetching: false,
  cancelGetStaffList: null,
  cancelGetStaffListOutsource: null,
  staffQueryParameters: structuredClone(staffQueryParameters),
  hrOsQueryParameters: structuredClone(staffQueryParameters),
  fileContent: '',
  fileName: '',
  listChecked: [],
  isCheckAll: false,
  isUpdateStaff: false,
  listHROutsouceChecked: [],
  isCheckAllHROutsource: false,
  isLoadingStaffDetail: false,
  statusHistory: [],
  staffWorkingHistory: [],
}

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setInitialStaff: () => initialState,
    setStaffs(state, action) {
      state.staffList = action.payload
    },
    setStaffOutsource(state, action) {
      state.staffListOutsource = action.payload
    },
    setSkillSetStaffs(state, action) {
      state.skillSetStaffs = action.payload
    },
    setSkillSetList(state, action) {
      state.skillSetList = action.payload
    },
    setContracts(state, action) {
      state.contracts = action.payload
    },
    setCertificates(state, action) {
      state.certificates = action.payload
    },
    setCVs(state, action) {
      state.cvs = action.payload
    },
    setGeneralInfoStaff(state, action) {
      state.generalInfoStaff = action.payload
    },
    setStatusHistory(state, action) {
      state.statusHistory = action.payload
    },
    setActiveStep(state, action) {
      if (
        action.payload === STAFF_STEP.GENERAL_INFORMATION &&
        state.activeStep === STAFF_STEP.SKILL_SET
      ) {
        state.isRollbackGeneralStep = true
      }
      state.activeStep = action.payload
    },
    resetFormStaff(state, action) {
      state.activeStep = STAFF_STEP.GENERAL_INFORMATION
      state.generalInfoStaff = GENERAL_INFO_STAFF_INIT
      state.skillSetStaffs = []
      state.certificates = []
      state.cvs = []
      state.contracts = []
      state.skillSetList = []
    },
    setCancelGetStaffList(state, { payload }) {
      state.cancelGetStaffList = payload
    },
    setCancelGetStaffListOutsource(state, { payload }) {
      state.cancelGetStaffListOutsource = payload
    },
    setStaffQueryParameters(state, { payload }) {
      state.staffQueryParameters = payload
    },
    setListChecked(state, { payload }) {
      state.listChecked = payload
    },
    setListHROutsouceChecked(state, { payload }) {
      state.listHROutsouceChecked = payload
    },
    setIsCheckAll(state, { payload }) {
      state.isCheckAll = payload
    },
    setIsCheckAllHROutsource(state, { payload }) {
      state.isCheckAllHROutsource = payload
    },
    setHrOsQueryParameters(state, { payload }) {
      state.hrOsQueryParameters = payload
    },
    resetStaffProject(state) {
      state.staffProject = {
        total: 0,
        data: [],
      }
    },
  },
  extraReducers: builder => {
    // getListStaff
    builder.addCase(getListStaff.pending, (state, _) => {
      state.isListFetching = true
      if (state.cancelGetStaffList) {
        state.cancelGetStaffList.cancel()
      }
    })
    builder.addCase(getListStaff.fulfilled, (state, { payload }) => {
      state.isListFetching = false
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.staffList = data.content
        state.total = data.totalElements
      }
    })
    builder.addCase(getListStaff.rejected, (state, _) => {
      setTimeout(() => {
        state.isListFetching = false
      })
    })
    // getListStaffHROutsource
    builder.addCase(getListStaffOutsource.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      state.isListFetchingHROutsource = false
      if (status === HttpStatusCode.OK) {
        state.staffListOutsource = data.content
        state.totalHROutsource = data.totalElements
      }
    })
    builder.addCase(getListStaffOutsource.pending, (state, _) => {
      state.isListFetchingHROutsource = true
      if (state.cancelGetStaffListOutsource) {
        state.cancelGetStaffListOutsource.cancel()
      }
    })
    builder.addCase(getListStaffOutsource.rejected, (state, _) => {
      setTimeout(() => {
        state.isListFetchingHROutsource = false
      })
    })
    // getStaffDetail
    builder.addCase(getDetailStaff.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      state.isLoadingStaffDetail = false
      if (status === HttpStatusCode.OK) {
        state.generalInfoStaff = formatResponseGeneralInfoStaff(data.general)
        state.statusHistory =
          formatResponseGeneralInfoStaff(data.general)?.statusHistory || []
        state.staffWorkingHistory = data.general?.staffWorkingHistory || []
        state.isUpdateStaff = data.isUpdateStaff
      }
    })
    builder.addCase(getDetailStaff.pending, (state, { payload }) => {
      state.isLoadingStaffDetail = true
    })
    builder.addCase(getDetailStaff.rejected, (state, { payload }) => {
      setTimeout(() => {
        state.isLoadingStaffDetail = false
      })
    })
    // getStaffOutsourcingDetail
    builder.addCase(getDetailStaffOutsource.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.generalInfoStaff = formatResponseGeneralInfoStaff(data)
        state.isUpdateStaff = data.isUpdateStaff
      }
    })
    //get skillSet
    builder.addCase(getSkillSets.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.skillSetList = refactorSkillSetList(data.content || [])
        state.skillSetStaffs = data.content.map(formatResponseSkillSet)
        state.totalElementsStaff = data.totalElements
      }
    })
    builder.addCase(getContracts.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.contracts = data.content.map(formatFilesResponse)
        state.totalElementsContract = data.totalElements
      }
    })

    builder.addCase(getCertificates.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.certificates = data.content.map(formatFilesResponse)
        state.totalElementsCertificate = data.totalElements
      }
    })
    builder.addCase(getCVs.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.cvs = data.map(formatFilesResponse)
        state.totalElementsCVs = data.totalElements
      }
    })

    builder.addCase(getStaffProject.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.staffProject = {
          total: data.totalElements || 0,
          data: data.content || [],
        }
      }
    })
    builder.addCase(getDashboardStaff.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.staffDashboardStatisticPosition = data.statisticsByType.POSITION
        state.staffDashboardStatisticStatus = data.statisticsByType.STATUS
        state.staffDashboardComparison = data.comparison
        state.staffDashboardIdealStatsSE = data.idealStats.SOFTWARE_ENGINEER
        state.staffDashboardIdealStatsQC = data.idealStats.QUALITY_CONTROL
        state.staffDashboardOnboardStatistic = data.onboardStatistic
        state.staffDashboardTurnoverRate = data.turnoverRate
      }
    })
    builder.addCase(downLoadImageUrl.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.fileContent = data?.fileContent || ''
        state.fileName = data?.fileName || ''
      }
    })
    builder.addCase(getListIds.fulfilled, (state, { payload }) => {
      if (payload.data) {
        const listIds = payload.data.map((id: number) => id.toString())
        state.listChecked = listIds
      }
    })
    builder.addCase(getListHROutsourceIds.fulfilled, (state, { payload }) => {
      if (payload.data) {
        const listHROutsouceIds = payload.data.map((id: number) =>
          id.toString()
        )
        state.listHROutsouceChecked = listHROutsouceIds
      }
    })
    builder.addCase(exportStaffList.fulfilled, (_, { payload }) => {
      const { data } = payload
      downloadFileFromByteArr(data)
    })
    builder.addCase(
      exportListHROutsourceToExcel.fulfilled,
      (_, { payload }) => {
        const { data } = payload
        downloadFileFromByteArr(data)
      }
    )
  },
})

export const {
  setInitialStaff,
  setStaffs,
  setStaffOutsource,
  setCancelGetStaffListOutsource,
  setSkillSetStaffs,
  setGeneralInfoStaff,
  setStatusHistory,
  setActiveStep,
  setCertificates,
  setCVs,
  setContracts,
  resetFormStaff,
  setSkillSetList,
  setCancelGetStaffList,
  setStaffQueryParameters,
  setListChecked,
  setIsCheckAll,
  setIsCheckAllHROutsource,
  setListHROutsouceChecked,
  setHrOsQueryParameters,
  resetStaffProject,
} = staffSlice.actions

export const staffSelector = (state: RootState) => state['staff']

export default staffSlice.reducer
