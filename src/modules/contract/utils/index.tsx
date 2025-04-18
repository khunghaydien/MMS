import { OptionItem } from '@/types'

export const fillContractGeneralInformation = (generalResponse: any) => ({
  // ...generalResponse,
  source: generalResponse?.source,
  contractNumber: generalResponse?.code || '',
  group: generalResponse.group?.id || '',
  type: generalResponse.type?.id || '',
  branchId: generalResponse.branch?.id || '',
  startDate: generalResponse?.startDate,
  endDate: generalResponse?.endDate,
  signDate: generalResponse?.signDate,
  currencyId: generalResponse?.currency?.id,
  contactPerson: {
    id: generalResponse.contactPerson?.id,
    value: generalResponse.contactPerson?.id,
    label: generalResponse.contactPerson?.name,
  },
  buyerId: generalResponse.buyer?.id
    ? {
        id: generalResponse.buyer?.id,
        value: generalResponse.buyer?.id,
        label: generalResponse.buyer?.name,
      }
    : null,
  sellerId: generalResponse.seller?.id
    ? {
        id: generalResponse.seller?.id,
        value: generalResponse.seller?.id,
        label: generalResponse.seller?.name,
      }
    : null,
  selectContractGroup: {
    id: generalResponse.selectContractGroup?.id,
    value: generalResponse.selectContractGroup?.id,
    label: generalResponse.selectContractGroup?.code,
  },
  value: generalResponse?.value || '',
  dueDatePayment: generalResponse?.dueDatePayment || '',
  projectAbbreviationName: generalResponse?.projectAbbreviationName || '',
  paymentMethod: generalResponse.paymentMethod?.id || '',
  installments: generalResponse?.installments || [],
  description: generalResponse?.description || '',
  status: generalResponse.status?.id,
  modifiedStatusDate: generalResponse?.modifiedStatusDate || null,
  orderType: generalResponse.orderType?.id || '',
  relatedOrders:
    generalResponse.relatedOrder?.map(
      (item: any): OptionItem => ({
        id: item?.id,
        label: item?.code,
        value: item?.id,
        name: item?.code,
        code: item?.code,
      })
    ) || [],
  rate: generalResponse?.rate || '',
})
