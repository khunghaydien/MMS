import Modal from '@/components/common/Modal'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant } from '@/const'
import { BackEndGlobalResponse, TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CONTRACT_HISTORY_TYPE } from '../../const'
import {
  ContractHistoryItemResponse,
  ContractHistoryRenderItem,
} from '../../models'
import { ContractService } from '../../services'

interface ModalActivityContractGeneralProps {
  contractId: string
  historyType?: string | number
  onClose: () => void
}

const ModalActivityContractGeneral = ({
  onClose,
  contractId,
  historyType = CONTRACT_HISTORY_TYPE.GENERAL_INFORMATION,
}: ModalActivityContractGeneralProps) => {
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const columns: TableHeaderColumn[] = [
    {
      id: 'modifiedDate',
      label: i18('LB_MODIFIED_DATE'),
      isVisible: true,
    },
    {
      id: 'modifiedBy',
      label: i18('LB_MODIFIED_BY'),
      isVisible: true,
    },
    {
      id: 'modifiedFields',
      label: i18('LB_MODIFIED_FIELDS'),
      isVisible: historyType === CONTRACT_HISTORY_TYPE.GENERAL_INFORMATION,
    },
  ].filter(e => e.isVisible)

  const [isLoading, setIsLoading] = useState(false)
  const [historyList, setHistoryList] = useState<ContractHistoryRenderItem[]>(
    []
  )

  const fieldNamesByFieldKeys = useMemo<any>(
    () => ({
      source: i18Contract('LB_CONTRACT_SOURCE'),
      contractNumber: i18('LB_CONTRACT_NUMBER'),
      group: i18('LB_CONTRACT_GROUP'),
      type: i18('LB_CONTRACT_TYPE'),
      branchId: i18('LB_BRANCH'),
      startDate: i18Contract('LB_CONTRACT_START_DATE'),
      endDate: i18Contract('LB_CONTRACT_END_DATE'),
      signDate: i18Contract('LB_CONTRACT_SIGN_DATE'),
      contactPerson: i18Contract('LB_CONTACT_PERSON'),
      buyerId: i18Contract('LB_BUYER'),
      sellerId: i18Contract('LB_SELLER'),
      selectContractGroup: i18Contract('LB_RELATED_NDA_TEMPLATE'),
      value: i18('LB_EXPECTED_VALUE'),
      dueDatePayment: i18Contract('LB_DUE_DATE_PAYMENT'),
      projectAbbreviationName: i18Contract('LB_PROJECT_ABBREVIATION_NAME'),
      description: i18('LB_DESCRIPTION'),
      status: i18('LB_STATUS'),
      modifiedStatusDate: i18Contract('LB_MODIFIED_STATUS_DATE'),
      orderType: i18Contract('LB_ORDER_TYPE'),
      relatedOrders: i18Contract('LB_RELATED_ORDERS'),
      currencyId: i18('LB_CURRENCY'),
      rate: i18('LB_RATE'),
    }),
    [i18Contract, i18]
  )

  const getFieldModified = (fields: string[]) => {
    if (!fields.length) return ''
    return fields
      .map((field: string) => fieldNamesByFieldKeys[field])
      .join(', ')
  }

  const createData = (item: ContractHistoryItemResponse) => ({
    id: item.historyId,
    modifiedDate: formatDate(new Date(item.modifiedAt), 'DD/MM/YYYY hh:mm:ss'),
    modifiedBy: `${item.modifiedBy?.name} - ${item.modifiedBy?.code}`,
    modifiedFields: getFieldModified(item.fields),
  })

  const getContractGeneralHistory = async () => {
    setIsLoading(true)
    ContractService.getHistory(contractId, historyType)
      .then((res: BackEndGlobalResponse) => {
        const { content } = res.data
        setHistoryList(content.map(createData))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    getContractGeneralHistory()
  }, [])

  return (
    <Modal
      open
      title={i18('LB_ACTIVITY')}
      hideFooter
      onClose={onClose}
      width={900}
    >
      <CommonTable loading={isLoading} columns={columns} rows={historyList} />
    </Modal>
  )
}

export default ModalActivityContractGeneral
