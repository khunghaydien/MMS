import { formatPersonData, formatToOptionItem } from '@/utils'
import moment from 'moment'
import { CONTRACT_HEADCOUNT_TYPE } from '../const'
import { IGeneralProjectState } from '../types'
import { FileItem } from './../../../types/index'
export const createPlotLine = (
  value: number,
  color: string,
  width: number,
  id: string,
  label: string
) => {
  return {
    color: color,
    width: width,
    value: value,
    zIndex: 4,
    label: {
      useHTML: true,
      text: `<span id="${id}" style="display:none;
       color: ${color}; 
       box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
       font-weight: bold;">${label}</span>`,
    },
    events: {
      mouseover: function () {
        const label = document.getElementById(id)
        if (label) {
          label.style.display = 'block'
        }
      },
      mouseout: function () {
        const label = document.getElementById(id)
        if (label) {
          label.style.display = 'none'
        }
      },
    },
  }
}
export const convertPayloadCost = (value: any, invoices: FileItem[]) => {
  return {
    date: moment(value.date, 'MM/YYYY').valueOf(),
    note: value.note,
    sourceId: value?.source?.id,
    actualCost: value?.actualCost,
    costOrigin: value?.costOrigin?.toString(),
    contractId: value?.contractId?.id,
    expectedCost: value.expectedCost,
    actualRate: value?.actualRate,
    expectedRate: value?.expectedRate,
    actualCurrencyId: value.actualCurrency?.id,
    expectedCurrencyId: value.expectedCurrency?.id,
    indexFiles: value.files.map((file: FileItem) =>
      invoices.findIndex(invoice => invoice.id === file.id)
    ),
    invoiceNumber: value.invoiceNumber || '',
    costType: value.costType?.id || '',
  }
}
export const convertPayloadRequestOT = (value: any) => {
  return {
    divisionDirectorId: parseInt(value.divisionDirector.id, 10),
    endDate: moment(value.endDate, 'MM/YYYY').valueOf(),
    hours: parseInt(value.hours),
    members: value.members.map((item: any) => parseInt(item.id, 10)),
    projectId: parseInt(value.projectId, 10),
    reason: value.reason,
    requestName: value.requestName,
    startDate: moment(value.startDate, 'MM/YYYY').valueOf(),
  }
}
export const convertCurrency = (value: any) => ({
  id: value?.id,
  label: value?.code,
  value: value?.id,
  disabled: false,
})
export const convertStatusRevenue = (value: any) => ({
  id: value?.id,
  label: value?.name,
  value: value?.id,
  disabled: false,
})
export const formatPayloadRevenue = (value: any) => {
  return {
    id: value.id,
    actualRevenue: value?.actualRevenue,
    expectedRevenue: value?.expectedRevenue,
    date: new Date(value.date),
    division: {
      branchId: value.division?.branchId,
      divisionId: value.division?.divisionId,
      label: value.division?.name,
      id: value.division?.divisionId,
    },
    status: convertStatusRevenue(value?.status),
    actualRate: value.actualRate,
    actualCurrency: convertCurrency(value.actualCurrency),
    expectedRate: value.expectedRate,
    expectedCurrency: convertCurrency(value.expectedCurrency),
    note: value.note,
    contractId: {
      id: value.contract?.id || '',
      value: value.contract?.id || '',
      label: value.contract?.name || '',
    },
    invoiceNumber: value?.invoiceNumber,
    action: [{ type: 'delete' }],
  }
}
export const formatPayloadCost = (value: any) => {
  const newFilesLocal: FileItem[] = []
  value.files?.forEach((file: any) => {
    const FileObject = new File([''], file.filename, {
      type: file.type,
      lastModified: file.uploadDate,
    })
    newFilesLocal.push({
      FileObject,
      id: file.id.toString(),
      url: file.url,
    })
  })
  return {
    id: value.id,
    costOrigin: {
      id: value?.costOrigin?.id,
      label: value.costOrigin?.name,
      value: value.costOrigin?.id,
      disabled: false,
    },
    date: new Date(value.date),
    actualRate: value?.actualRate,
    expectedRate: value?.expectedRate,
    source: {
      id: value?.source?.id || '',
      label: value?.source?.name || '',
      value: value?.source?.id || '',
      disabled: false,
    },
    contractId: {
      id: value.contract?.id || '',
      value: value.contract?.id || '',
      label: value.contract?.name || '',
    },
    actualCurrency: convertCurrency(value.actualCurrency),
    expectedCurrency: convertCurrency(value.expectedCurrency),
    actualCost: value?.actualCost,
    expectedCost: value?.expectedCost,
    note: value?.note,
    action: [{ type: 'delete' }],
    invoiceNumber: value?.invoiceNumber || '',
    costType: {
      id: value.costType?.id || '',
      value: value.costType?.id || '',
      label: value.costType?.name || '',
    },
    files: newFilesLocal,
  }
}

export const convertPayloadRevenue = (value: any, invoices: FileItem[]) => {
  return {
    actualCurrencyId: value.actualCurrency.id,
    expectedCurrencyId: value.expectedCurrency.id,
    divisionId: value.division.id,
    status: value.status?.id || '',
    date: moment(value.date).valueOf(),
    note: value?.note,
    actualRevenue: value?.actualRevenue,
    expectedRevenue: value?.expectedRevenue,
    actualRate: value?.actualRate,
    expectedRate: value?.expectedRate,
    contractId: value?.contractId?.id || '',
    invoiceNumber: value.invoiceNumber,
    indexFiles: value.files.map((file: FileItem) =>
      invoices.findIndex(invoice => invoice.id === file.id)
    ),
  }
}

export const convertOptionItem = (option: any) => {
  return {
    id: option?.id,
    label: option?.label,
    value: option.value,
    disabled: false,
  }
}
export const convertProjectGeneralDataFromApi = (
  data: any
): IGeneralProjectState => {
  return {
    id: data.id,
    code: data.code,
    branchId: data.branch.id,
    customer: {
      ...data.customer,
      label: data.customer?.name,
      value: data.customer?.id,
    },
    divisionId: data.division.divisionId,
    subProjectManagers: data.subProjectManagers
      ? formatToOptionItem(data.subProjectManagers)
      : [],
    projectManager: data.projectManager
      ? formatPersonData(data.projectManager)
      : {},
    amSale: data.amSale ? formatPersonData(data.amSale) : {},
    productType: data.productType?.id,
    name: data.name,
    note: data.note || '',
    partners: data.partners ? formatToOptionItem(data.partners) : [],
    status: data.status.id,
    technologies: formatToOptionItem(data.technologies, {
      keyValue: 'skillSetId',
    }),
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    projectType: data.projectType?.id,
    description: data.description || '',
    subCustomer: data.subCustomer?.id || '',
    projectRank: data.projectRank?.id || '',
    billableMM: data.billableMM?.toString() || '',
    businessDomain: data.businessDomain,
    driveLink: data.driveLink,
    slackLink: data.slackLink,
    referenceLink: data.referenceLink,
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
    groupMail: data.groupMail || '',
    gitLink: data.gitLink || '',
    jiraLink: data.jiraLink || '',
  }
}

export const convertPayloadGeneralUpdate = (data: any) => ({
  amSale: data.amSale.id,
  billableMM: data.billableMM,
  branchId: data.branchId,
  businessDomain: data.businessDomain,
  customerId: data.customer?.id,
  description: data.description,
  divisionId: data.divisionId,
  driveLink: data.driveLink,
  endDate: data.endDate.getTime(),
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
  gitLink: data.gitLink,
  groupMail: data.groupMail,
  jiraLink: data.jiraLink,
  name: data.name,
  partnerIds: data.partners.map((par: { id: string }) => par.id),
  productType: data.productType,
  projectManager: data.projectManager.id,
  projectRank: data.projectRank,
  projectType: data.projectType,
  referenceLink: data.referenceLink,
  slackLink: data.slackLink,
  startDate: data.startDate.getTime(),
  status: data.status,
  subCustomer: data.subCustomer,
  subProjectManagers: data.subProjectManagers.map(
    (sPm: { id: string }) => sPm.id
  ),
  technologyIds: data.technologies.map((item: { id: string }) => item.id),
})

export const convertHeadcountRequest = (headcount: any) => ({
  ...headcount,
  type: headcount?.type?.id || CONTRACT_HEADCOUNT_TYPE,
})

export const convertPayloadAssignStaff = (value: any) => {
  return {
    endDate: moment(value.assignEndDate).valueOf(),
    startDate: moment(value.assignStartDate).valueOf(),
    headcount: value.projectHeadcount,
    staffId: value.staffId,
    role: value.role,
    note: value.note,
  }
}

export const getPercentColor = (percent: number) => {
  if (typeof percent !== 'number') return '#000'
  if (percent < 90) {
    return '#FF2719'
  } else if (percent <= 110) {
    return '#66BB6A'
  } else {
    return '#FADB61'
  }
}

export const getDateFromDayOfYear = (year: number, day: number) => {
  if (isNaN(year) || isNaN(day)) {
    return null
  } else {
    return new Date(Date.UTC(year, 0, day))
  }
}

export const isLessThan2023 = (date: Date | null) => {
  if (date) {
    return date.getFullYear() <= 2023
  }
  return false
}

export const isMoreThan2023 = (date: Date | null) => {
  if (date) {
    return date.getFullYear() > 2023
  }
  return false
}

export const getDefaultRangeMonthKPI = (generalInfo: IGeneralProjectState) => {
  const isProjecStartDateLessThanToday =
    new Date(moment(generalInfo.startDate).format('MM/DD/YYYY')).getTime() -
      new Date(moment(new Date()).format('MM/DD/YYYY')).getTime() <
    0

  return {
    startDate: isProjecStartDateLessThanToday
      ? generalInfo.startDate
      : new Date(),
    endDate: new Date(),
  }
}
