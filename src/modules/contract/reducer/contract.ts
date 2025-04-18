import { IContractResponse } from '@/modules/customer/types'
import { RootState } from '@/store'
import { FileItem, OptionItem } from '@/types'
import { formatFilesResponse } from '@/utils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CancelTokenSource } from 'axios'
import { isEmpty } from 'lodash'
import { CONTRACT_STEP, contractQueryParameters } from '../const'
import {
  ContractStaffInformationRequest,
  IListContractsParams,
  ProjectContractInformation,
  RelatedContract,
} from '../models'
import { ContractService } from '../services'
import { fillContractGeneralInformation } from '../utils'
import {
  getContractGeneralInformation,
  getContractStaffInformation,
  getContractUploadDocuments,
  getListContracts,
} from './thunk'

export interface IContractState {
  activeStep: number
  listContracts: any[]
  total: number
  stateContracts: IContractResponse[]
  isListFetching: boolean
  cancelGetContractList: CancelTokenSource | null
  contractQueryParameters: IListContractsParams
  documents: FileItem[]
  staffList: ContractStaffInformationRequest[]
  totalDocs: 0
  generalInfo: any
  relatedContracts: RelatedContract[]
  projectInfo: ProjectContractInformation
  codeCurrency: string
  createdBy: string
  createPerson: OptionItem[]
}

const initialState: IContractState = {
  activeStep: CONTRACT_STEP.GENERAL_INFORMATION,
  listContracts: [],
  total: 0,
  stateContracts: [],
  isListFetching: false,
  cancelGetContractList: null,
  contractQueryParameters: structuredClone(contractQueryParameters),
  documents: [],
  staffList: [],
  totalDocs: 0,
  generalInfo: {},
  relatedContracts: [],
  projectInfo: {},
  codeCurrency: '',
  createdBy: '',
  createPerson: [],
}

export const getCreatePerson = createAsyncThunk(
  'contracts/getPerson',
  async (_, { rejectWithValue }) => {
    try {
      const res = await ContractService.getCreatePerson()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setInitialContract: () => initialState,
    setActiveStep(state, { payload }) {
      state.activeStep = payload
    },
    setDocuments(state, action) {
      state.documents = action.payload
    },
    setStateContracts(state, { payload }) {
      state.stateContracts = payload
    },
    setCancelGetContractList(state, { payload }) {
      state.cancelGetContractList = payload
    },
    setContractQueryParameters(state, { payload }) {
      state.contractQueryParameters = payload
    },
    setStaffList(state, { payload }) {
      state.staffList = payload
    },
    setGeneralInfo(state, { payload }) {
      state.generalInfo = payload
    },
    setCodeCurrency(state, { payload }) {
      state.codeCurrency = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getListContracts.pending, state => {
      state.isListFetching = true
      if (state.cancelGetContractList) {
        state.cancelGetContractList.cancel()
      }
    })
    builder.addCase(getListContracts.fulfilled, (state, { payload }) => {
      state.isListFetching = false
      state.listContracts = payload.data.content
      state.total = payload.data.totalElements
    })
    builder.addCase(getListContracts.rejected, state => {
      state.isListFetching = false
    })
    builder.addCase(
      getContractGeneralInformation.fulfilled,
      (state, { payload }) => {
        state.isListFetching = false
        const { data } = payload
        if (!isEmpty(data?.general)) {
          state.generalInfo = fillContractGeneralInformation(data?.general)
          state.codeCurrency = data?.general?.currency?.code
          state.relatedContracts = data?.relatedContracts || []
          state.projectInfo = data?.project || {}
          state.createdBy = data.general?.createdBy?.name || ''
        }
      }
    )
    builder.addCase(getContractGeneralInformation.rejected, state => {
      state.isListFetching = false
    })
    builder.addCase(
      getContractStaffInformation.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        if (data) {
          state.staffList = data.map((staff: any) => ({
            id: staff.id.toString(),
            levelName: staff.level,
            positionName: staff.positionName,
            rate: staff.rate || '',
            price: staff.price || '',
            note: staff.note || '',
            staffId: staff.staffId,
            unitOfTime: staff.unitOfTime.id,
            staffName: staff.staffName,
            sourceStaff: staff.sourceStaff.id,
            skillIds: staff.skillSets.map((skill: OptionItem) => ({
              id: skill.id,
              label: skill.name,
              value: skill.id,
            })),
            startDate: staff.startDate,
            endDate: staff.endDate,
            currencyId: staff.currency?.id || '',
            codeCurrency: staff.currency?.code || '',
            viewOnly: !!staff.viewOnly,
          }))
        }
      }
    )
    builder.addCase(
      getContractUploadDocuments.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        if (data) {
          state.documents = data.content.map(formatFilesResponse)
          state.totalDocs = data.totalElements
        }
      }
    )
    builder.addCase(getCreatePerson.fulfilled, (state, { payload }) => {
      state.createPerson = payload.data.map((person: OptionItem) => ({
        ...person,
        label: person.name,
        value: person.id,
      }))
    })
  },
})

export const {
  setInitialContract,
  setActiveStep,
  setCancelGetContractList,
  setStateContracts,
  setContractQueryParameters,
  setDocuments,
  setStaffList,
  setGeneralInfo,
  setCodeCurrency,
} = contractSlice.actions
export const contractSelector = (state: RootState) => state['contract']

export default contractSlice.reducer
