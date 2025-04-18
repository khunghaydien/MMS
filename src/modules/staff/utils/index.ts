import { FileItem, OptionItem } from '@/types'
import { isEmpty } from 'lodash'
import moment from 'moment'
import {
  JOB_TYPE_FREELANCER,
  JOB_TYPE_INTERN,
  JOB_TYPE_OFFICICAL,
  JOB_TYPE_PROBATION,
} from '../const'
import {
  IGeneralInformationStaffResponse,
  IGeneralInformationStaffState,
  IHROutSourcingResponse,
  IHROutsourcingState,
  ISkillSetStaffState,
} from '../types'

export const formatPayloadGeneralInfoStaff = (
  value: IGeneralInformationStaffState
) => ({
  name: value.staffName,
  gender: value.gender,
  dateOfBirth: moment(value.birthday).valueOf(),
  email: value.email?.trim(),
  companyBranchId: value.branchId,
  divisionId: value.divisionId,
  positionId: value.position,
  gradeId: value.gradeId,
  leaderGradeId: value.leaderGradeId,
  directManagerId: value.directManager.id,
  onboardDate:
    value.jobType === JOB_TYPE_PROBATION
      ? moment(value.onboardDate).valueOf()
      : null,
  freelancerPeriods:
    value.jobType === JOB_TYPE_FREELANCER
      ? value.freelancerPeriods?.map(({ startDate, endDate, id }) => {
          return {
            id,
            startDate: moment(startDate).valueOf(),
            endDate: moment(endDate).valueOf(),
          }
        })
      : null,
  jobStartDate:
    value.jobType === JOB_TYPE_INTERN || value.jobType === JOB_TYPE_OFFICICAL
      ? moment(value.jobStartDate).valueOf()
      : null,
  jobEndDate:
    value.jobType === JOB_TYPE_FREELANCER ||
    value.jobType === JOB_TYPE_OFFICICAL
      ? null
      : moment(value.jobEndDate).valueOf(),
  jobType: value.jobType,
  lastWorkingDate: moment(value.lastWorkingDate).valueOf(),
  jobChangeRequest: formatJobType(value.jobChangeRequest),
  workingTimeChanged: value.workingTimeChanged,
  phoneNumber: value.phoneNumber,
  // status: {
  //   status: value?.status?.status?.id,
  //   startDate: value?.status?.startDate
  //     ? moment(value?.status?.startDate).valueOf()
  //     : new Date().getTime(),
  //   endDate: moment(value?.status?.endDate).valueOf(),
  //   note: value?.status?.note,
  // },
})

export const formatPayloadGeneralInfoStaffOnboard = (
  value: IGeneralInformationStaffState
) => ({
  name: value.staffName,
  gender: value.gender,
  dateOfBirth: moment(value.birthday).valueOf(),
  email: value.email?.trim(),
  companyBranchId: value.branchId,
  divisionId: value.divisionId,
  positionId: value.position,
  gradeId: value.gradeId,
  leaderGradeId: value.leaderGradeId,
  directManagerId: value.directManager.id,
  onboardDate:
    value.jobType === JOB_TYPE_PROBATION
      ? moment(value.onboardDate).valueOf()
      : null,
  freelancerPeriods:
    value.jobType === JOB_TYPE_FREELANCER
      ? value.freelancerPeriods?.map(({ startDate, endDate, id }) => {
          return {
            id,
            startDate: moment(startDate).valueOf(),
            endDate: moment(endDate).valueOf(),
          }
        })
      : null,
  jobStartDate:
    value.jobType === JOB_TYPE_INTERN || value.jobType === JOB_TYPE_OFFICICAL
      ? moment(value.jobStartDate).valueOf()
      : null,
  jobEndDate:
    value.jobType === JOB_TYPE_FREELANCER ||
    value.jobType === JOB_TYPE_OFFICICAL
      ? null
      : moment(value.jobEndDate).valueOf(),
  jobType: value.jobType,
  lastWorkingDate: moment(value.lastWorkingDate).valueOf(),
  phoneNumber: value.phoneNumber,
  // status: {
  //   status: value?.status?.status?.id,
  //   startDate: moment(value?.onboardDate).valueOf(),
  //   endDate: moment(value?.status?.endDate).valueOf(),
  //   note: `${formatDate(moment(value?.onboardDate).valueOf())} : Onboard`,
  // },
})

export const formatJobType = (value?: {
  jobType?: string
  onboardDate?: Date | null
  jobEndDate?: Date | null
  jobStartDate?: Date | null
  freelancerPeriods?:
    | {
        id?: number | null
        endDate: number | Date | null | undefined
        startDate: number | Date | null | undefined
      }[]
    | null
    | undefined
}) => ({
  onboardDate:
    value?.jobType === JOB_TYPE_PROBATION && value?.onboardDate
      ? moment(value.onboardDate).valueOf()
      : null,
  freelancerPeriods:
    value?.jobType === JOB_TYPE_FREELANCER
      ? value?.freelancerPeriods?.map(({ startDate, endDate, id }) => {
          return {
            id,
            startDate: moment(startDate).valueOf(),
            endDate: moment(endDate).valueOf(),
          }
        })
      : null,
  jobStartDate:
    value?.jobType === JOB_TYPE_INTERN || value?.jobType === JOB_TYPE_OFFICICAL
      ? moment(value?.jobStartDate).valueOf()
      : null,
  jobEndDate:
    value?.jobType === JOB_TYPE_FREELANCER ||
    value?.jobType === JOB_TYPE_OFFICICAL
      ? null
      : moment(value?.jobEndDate).valueOf(),
  jobType: value?.jobType,
})
export const formatPayloadGeneralInfoStaffInactive = (
  value: IGeneralInformationStaffState
) => ({
  name: value.staffName,
  gender: value.gender,
  dateOfBirth: moment(value.birthday).valueOf(),
  email: value.email?.trim(),
  companyBranchId: value.branchId,
  divisionId: value.divisionId,
  positionId: value.position,
  gradeId: value.gradeId,
  leaderGradeId: value.leaderGradeId,
  directManagerId: value.directManager.id,
  onboardDate:
    value.jobType === JOB_TYPE_PROBATION
      ? moment(value.onboardDate).valueOf()
      : null,
  freelancerPeriods:
    value.jobType === JOB_TYPE_FREELANCER
      ? value.freelancerPeriods?.map(({ startDate, endDate, id }) => {
          return {
            id,
            startDate: moment(startDate).valueOf(),
            endDate: moment(endDate).valueOf(),
          }
        })
      : null,
  jobStartDate:
    value.jobType === JOB_TYPE_INTERN || value.jobType === JOB_TYPE_OFFICICAL
      ? moment(value.jobStartDate).valueOf()
      : null,
  jobEndDate:
    value.jobType === JOB_TYPE_FREELANCER ||
    value.jobType === JOB_TYPE_OFFICICAL
      ? null
      : moment(value.jobEndDate).valueOf(),
  jobType: value.jobType,
  jobChangeRequest: formatJobType(value.jobChangeRequest),
  workingTimeChanged: value.workingTimeChanged,
  lastWorkingDate: moment(value.lastWorkingDate).valueOf(),
  phoneNumber: value.phoneNumber,
  // status: {
  //   status: value?.status?.status?.id,
  //   startDate: moment(value.lastWorkingDate).valueOf(),
  //   endDate: moment(value?.status?.endDate).valueOf(),
  //   note: value?.status?.note,
  // },
})
export const formatPayloadHROutsourcingStaff = (
  value: IHROutsourcingState
) => ({
  divisionId: value.divisionId,
  customerId: value.customer.id,
  email: value.email?.trim(),
  contractExpiredDate: moment(value.contractExpiredDate).valueOf(),
  gender: value.gender,
  partnerId: value.partner.id,
  name: value.staffName,
  positionId: value.position,
  onboardDate: moment(value.onboardDate).valueOf(),
  status: value.status,
  phoneNumber: value.phoneNumber,
})

export const convertToOptionItem = (value: any): OptionItem => {
  return {
    id: value?.id,
    label: value?.name,
    value: value?.id,
    disabled: false,
    name: value?.name,
  }
}

export const convertGradeToOptionItem = (value: any): OptionItem => {
  return {
    id: value?.grade,
    label: value?.grade,
    value: value?.grade,
    disabled: false,
    name: value?.grade,
  }
}

export const convertSkillSetLevel = (value: any): OptionItem => {
  return {
    id: value,
    label: value,
    value: value,
    disabled: false,
    name: value,
  }
}

export const convertSkillSetGroup = (value: any): OptionItem => {
  return {
    id: value.id,
    label: value.name,
    value: value.id,
    disabled: false,
    name: value,
  }
}

export const convertGradeTitleToOptionItem = (value: any): OptionItem => {
  return {
    id: value?.id,
    label: value?.title,
    value: value?.id,
    disabled: false,
    name: value?.title,
  }
}

export const convertDivision = (value: any): OptionItem => {
  return {
    id: value?.id,
    label: value?.name,
    value: value?.divisionId,
    disabled: false,
    name: value?.name,
  }
}

export const convertBranch = (value: any): OptionItem => {
  return {
    id: value?.id,
    label: value?.name,
    value: value?.id,
    disabled: false,
    name: value?.name,
    note: value?.note,
  }
}

export const formatResponseGeneralInfoStaff = (
  value: IGeneralInformationStaffResponse
): IGeneralInformationStaffState => {
  return {
    code: value?.code || '',
    staffName: value.name || '',
    gender: value.gender.toString() || '',
    birthday: value.dateOfBirth ? new Date(value.dateOfBirth) : null,
    email: value.email || '',
    branchId: value.companyBranch?.id?.toString() || '',
    divisionId: value.division?.divisionId?.toString() || '',
    position: value.position?.id?.toString() || '',
    gradeId: value.grade?.id?.toString() || '',
    leaderGradeId: value.leaderGrade?.id?.toString() || '',
    directManager: value.directManager?.id?.toString()
      ? convertToOptionItem(value.directManager)
      : {},
    onboardDate: value.onboardDate ? new Date(value?.onboardDate) : null,
    jobEndDate: value.jobEndDate ? new Date(value?.jobEndDate) : null,
    jobStartDate: value.jobStartDate
      ? new Date(value?.jobStartDate)
      : value.jobType?.id?.toString() === JOB_TYPE_PROBATION &&
        value.onboardDate
      ? new Date(value?.onboardDate)
      : null,
    jobChangeRequest: {
      isChangeJobType: false,
      jobType: '',
      onboardDate: null,
      jobEndDate: null,
      jobStartDate: null,
      freelancerPeriods: [{ startDate: null, endDate: null }],
    },
    freelancerPeriods:
      value.freelancerPeriods && !isEmpty(value.freelancerPeriods)
        ? value.freelancerPeriods.map(({ endDate, startDate, id }) => {
            const validStartDate =
              startDate && typeof startDate === 'number'
                ? new Date(startDate)
                : null
            const validEndDate =
              endDate && typeof endDate === 'number' ? new Date(endDate) : null
            return {
              id,
              startDate: validStartDate,
              endDate: validEndDate,
            }
          })
        : [
            {
              endDate: null,
              startDate: null,
            },
          ],
    status: value.status,
    jobType: value.jobType?.id?.toString() || '',
    positionName: value.position?.name || '',
    division: convertDivision(value.division),
    branch: convertBranch(value.companyBranch),
    statusName: value.status?.name || '',
    jobTypeName: value.jobType?.name || '',
    lastWorkingDate: value.lastWorkingDate
      ? new Date(value.lastWorkingDate)
      : 0,
    phoneNumber: value.phoneNumber || '',
    customer: value?.customerStaff,
    partner: value?.partnerStaff,
    contractExpiredDate: value.contractExpiredDate
      ? new Date(value.contractExpiredDate)
      : null,
    createdBy: value?.createdBy,
    statusHistory: value?.statusHistory,
  }
}
export const formatResponseHROutsourcingStaff = (
  value: IHROutSourcingResponse
): IHROutsourcingState => {
  return {
    divisionId: value?.divisionId || '',
    code: value?.code || '',
    staffName: value.name || '',
    gender: value.gender.toString() || '',
    email: value.email || '',
    position: value.position?.id?.toString() || '',
    onboardDate: value.onboardDate ? new Date(value?.onboardDate) : null,
    status: value.status?.id?.toString() || '',
    positionName: value.position?.name || '',
    branch: convertBranch(value.companyBranch),
    statusName: value.status?.name || '',
    customer: value.customer?.id?.toString()
      ? convertToOptionItem(value.customer)
      : {},
    partner: value.partner?.id?.toString()
      ? convertToOptionItem(value.partner)
      : {},
    contractExpiredDate: value.contractExpiredDate
      ? new Date(value?.contractExpiredDate)
      : null,
  }
}

export const formatResponseSkillSet = (value: any): ISkillSetStaffState => ({
  id: value.id,
  skillGroup: convertSkillSetGroup(value.skillGroup),
  skillName: convertSkillSetGroup(value.skillName),
  yearsOfExperience: value.yearsOfExperience,
  level: convertSkillSetLevel(value.level),
  note: value.note || '',
})

export const formatPayloadSkillSet = (value: ISkillSetStaffState) => ({
  skillGroupId: value.skillGroup.id,
  skillId: value.skillName.id,
  yearsOfExperience: value.yearsOfExperience,
  level: value.level.id,
  note: value.note,
})

export const payloadCreateStaff = (payload: any) => {
  let formData = new FormData()
  payload.contract.forEach((item: any) => {
    formData.append('contract', item)
  })
  payload.certificate.forEach((item: any) => {
    formData.append('certificate', item)
  })
  formData.append('requestBody', JSON.stringify(payload.requestBody))
  return formData
}
export const payloadCreateHROutsourcing = (payload: any, cv: any) => {
  let formData = new FormData()
  const listCV = cv.map((file: FileItem) => file.FileObject)
  listCV.forEach((item: any) => {
    formData.append('cvs', item)
  })
  formData.append('requestBody', JSON.stringify(payload.requestBody))
  return formData
}

export const payloadUpdateStaff = (payload: any) => {
  let formData = new FormData()
  payload.certificate.forEach((item: any) => {
    formData.append('certificate', item)
  })
  formData.append('requestBody', JSON.stringify(payload.requestBody))
  if (payload.id) {
    formData.append('id', payload.id)
  }
  return formData
}
