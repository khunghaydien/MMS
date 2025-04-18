import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import { LangConstant, PathConstant } from '@/const'
import {
  CustomerState,
  deleteCustomers,
  getListCustomers,
  getListIds,
  selectCustomer,
  setIsCheckAll,
  setListChecked,
  setQueryParameters,
} from '@/modules/customer/reducer/customer'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import { IListCustomersParams } from '../../types'

import PriorityStatus from '@/components/common/PriorityStatus'
import StatusItem from '@/components/common/StatusItem'
import CommonTable from '@/components/table/CommonTable'
import { CUSTOMER_STATUS } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import {
  Division,
  IStatus,
  OptionItem,
  SortChangePayload,
  TableHeaderColumn,
} from '@/types'
import { convertKeyArrayToString } from '@/utils'
import i18next from 'i18next'
import { cloneDeep } from 'lodash'
import HeaderCustomer from './HeaderCustomer'

export interface DataTableCustomer {
  id: string
  customerCode: string
  customerName: string
  service: string
  contactName: string
  collaborationStartDate: string
  priority: string
  branch: string
  status: IStatus
  market: string
  division: string
  language: string
  customerAbbreviation: string
}

interface IShowModalDeleteCustomer {
  status: boolean
  idCustomer: string
}

export function convertDataStatus(item: any): IStatus {
  let _resultData: IStatus = { color: 'grey', label: '' }
  if (CUSTOMER_STATUS[item?.id]) {
    return CUSTOMER_STATUS[item?.id]
  }
  return _resultData
}
export function createData(item: any) {
  return {
    customerCode: item.id || '',
    id: item.id,
    priority: <PriorityStatus priority={item.priority?.id || ''} />,
    status: <StatusItem typeStatus={{ ...convertDataStatus(item.status) }} />,
    service: convertKeyArrayToString(item?.services) || '',
    contactName: item.contactName || '',
    collaborationStartDate: !!item.collaborationStartDate
      ? moment(item.collaborationStartDate).format('DD/MM/YYYY')
      : '',
    customerName: item?.name || '',
    branch: item?.branch?.name || '',
    market: item.market?.name || '',
    division: item.divisions.map((div: Division) => div.name).join(', ') || '',
    language:
      JSON.parse(item.languageIds || '[]')
        .join(', ')
        .toUpperCase() || '',
    customerAbbreviation: item.abbreviation || '',
  }
}

const refactorQueryParameters = (queryParameters: IListCustomersParams) => {
  const newQueryParameters = structuredClone(queryParameters)
  if (newQueryParameters.skillSetIds?.length) {
    newQueryParameters.skillSetIds = newQueryParameters.skillSetIds
      .map((skillSet: any) => skillSet.value)
      .join(',')
  }
  if (newQueryParameters.languageIds?.length) {
    newQueryParameters.languageIds = newQueryParameters.languageIds
      .map((lang: OptionItem) => lang.id)
      .join(',')
  }
  if (newQueryParameters.divisionIds?.length) {
    newQueryParameters.divisionIds = newQueryParameters.divisionIds
      .map((division: OptionItem) => division.id)
      .join(',')
  }
  return newQueryParameters
}

export const columns: TableHeaderColumn[] = [
  {
    id: 'id',
    align: 'left',
    label: i18next.t('customer:TXT_CUSTOMER_CODE'),
    sortBy: 'id',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'customerName',
    align: 'left',
    label: i18next.t('customer:LB_CUSTOMER_NAME'),
    checked: false,
  },
  {
    id: 'customerAbbreviation',
    align: 'left',
    label: i18next.t('customer:LB_CUSTOMER_ABBREVIATION'),
    checked: false,
  },
  {
    id: 'market',
    align: 'left',
    label: i18next.t('common:LB_MARKET'),
    orderBy: 'desc',
    sortBy: 'market',
    checked: false,
  },
  {
    id: 'language',
    align: 'left',
    label: i18next.t('common:LB_LANGUAGE'),
    checked: false,
  },
  {
    id: 'service',
    align: 'left',
    label: i18next.t('customer:TXT_SERVICE'),
    checked: false,
  },
  {
    id: 'branch',
    align: 'left',
    label: i18next.t('common:LB_BRANCH'),
    checked: false,
  },
  {
    id: 'division',
    align: 'left',
    label: i18next.t('common:LB_DIVISION'),
    checked: false,
  },
  {
    id: 'contactName',
    align: 'left',
    label: i18next.t('customer:LB_CONTACT_NAME'),
    checked: false,
  },
  {
    id: 'collaborationStartDate',
    align: 'left',
    label: i18next.t('customer:LB_COLLABORATION_START_DATE'),
    orderBy: 'desc',
    sortBy: 'collaborationStartDate',
    checked: false,
  },
  {
    id: 'priority',
    align: 'left',
    label: i18next.t('customer:LB_PRIORITY'),
    orderBy: 'desc',
    sortBy: 'priority',
    checked: false,
  },
  {
    id: 'status',
    align: 'left',
    label: i18next.t('common:LB_STATUS'),
    checked: false,
  },
]

const CustomerList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const {
    customerList,
    isListFetching,
    queryParameters,
    listChecked,
    isCheckAll,
  }: CustomerState = useSelector(selectCustomer)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [showModalDeleteCustomers, setShowModalDeleteCustomers] =
    useState<IShowModalDeleteCustomer>({ status: false, idCustomer: '' })
  const [headCells, setHeadCells] = useState(() => {
    const newCustomerListHeadCells = cloneDeep(columns)
    return permissions.useCustomerDelete
      ? columns
      : newCustomerListHeadCells.splice(0, newCustomerListHeadCells.length - 1)
  })

  const rows = useMemo(() => {
    if (customerList.content)
      return customerList.content.map((item: any) => createData(item))
    return []
  }, [customerList?.content])

  const getListCustomersApi = (params = {}) => {
    const newQueryParameters = refactorQueryParameters(params)
    if (isCheckAll) {
      dispatch(getListIds(newQueryParameters))
    }
    dispatch(getListCustomers(newQueryParameters))
  }

  const handlePageChange = (newPage: number) => {
    const newQueryParameters = {
      ...queryParameters,
      pageNum: +newPage,
    }
    dispatch(setQueryParameters(newQueryParameters))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const newQueryParameters = {
      ...queryParameters,
      pageNum: 1,
      pageSize: newPageSize,
    }
    dispatch(setQueryParameters(newQueryParameters))
  }

  const handleCheckAll = () => {
    const newIsCheckAll = !isCheckAll
    if (newIsCheckAll) {
      const newQueryParameters = refactorQueryParameters(queryParameters)
      dispatch(getListIds(newQueryParameters))
    } else {
      dispatch(setListChecked([]))
    }
    dispatch(setIsCheckAll(newIsCheckAll))
  }

  const handleCheckItem = ({
    newListChecked,
  }: {
    newListChecked: string[]
  }) => {
    dispatch(setListChecked(newListChecked))
  }

  const handleNavigateToDetailPage = (customer: any) => {
    navigate(`${PathConstant.CUSTOMER_LIST}/${customer.id}`)
  }

  const onDeleteCustomer = () => {
    dispatch(updateLoading(true))
    dispatch(deleteCustomers(showModalDeleteCustomers.idCustomer))
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: StringFormat(
              i18Customer('MSG_DELETE_CUSTOMER_ITEM_SUCCESS'),
              showModalDeleteCustomers.idCustomer
            ),
          })
        )
        getListCustomersApi(queryParameters)
      })
    dispatch(updateLoading(false))
  }

  const handleCloseModalDeleteCustomers = () => {
    setShowModalDeleteCustomers({ status: false, idCustomer: '' })
  }

  const handleSubmitModalDeleteCustomers = () => {
    onDeleteCustomer()
  }

  const handleDeleteCustomer = async (customerId: string) => {
    setShowModalDeleteCustomers({ status: true, idCustomer: customerId })
  }

  const handleSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setHeadCells(newColumns)
    const newQueryParameters = {
      ...queryParameters,
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatch(setQueryParameters(newQueryParameters))
  }

  const fillListAllChecked = () => {
    const ids: string[] = rows.map((item: any) => item.id)
    const newListChecked: string[] = [...listChecked]
    ids.forEach((id: string) => {
      if (!newListChecked.includes(id)) {
        newListChecked.push(id)
      }
    })
    dispatch(setListChecked(newListChecked))
  }

  useEffect(() => {
    getListCustomersApi(queryParameters)
  }, [queryParameters])

  useEffect(() => {
    if (!!rows.length && isCheckAll) {
      fillListAllChecked()
    }
  }, [rows])

  return (
    <CommonScreenLayout title={i18Customer('TXT_CUSTOMER_MANAGEMENT_TITLE')}>
      <ModalDeleteRecords
        titleMessage={i18Customer('TXT_DELETE_CUSTOMER')}
        subMessage={StringFormat(
          i18Customer('MSG_CONFIRM_CUSTOMER_DELETE'),
          showModalDeleteCustomers.idCustomer
        )}
        open={showModalDeleteCustomers.status}
        onClose={handleCloseModalDeleteCustomers}
        onSubmit={handleSubmitModalDeleteCustomers}
      />
      <Box className={classes.rootCustomerList}>
        <HeaderCustomer listChecked={listChecked} />
        <CommonTable
          useOpenNewTab
          useCheckbox
          linkFormat={PathConstant.CUSTOMER_DETAIL_FORMAT}
          checkAll={listChecked.length === customerList?.totalElements}
          listChecked={listChecked}
          loading={isListFetching}
          columns={headCells}
          rows={rows}
          onCheckItem={handleCheckItem}
          onCheckAll={handleCheckAll}
          onSortChange={handleSortChange}
          onRowClick={handleNavigateToDetailPage}
          pagination={{
            totalElements: customerList?.totalElements || 0,
            pageSize: queryParameters.pageSize as number,
            pageNum: queryParameters.pageNum as number,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      </Box>
    </CommonScreenLayout>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootCustomerList: {
    width: '100%',
    marginBottom: '10px',
  },
}))
export default CustomerList
