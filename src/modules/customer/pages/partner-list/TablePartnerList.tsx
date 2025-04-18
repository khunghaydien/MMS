import CommonTable from '@/components/table/CommonTable'
import { PathConstant } from '@/const'
import { AppDispatch } from '@/store'
import { SortChangePayload, TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  PartnerState,
  getListIds,
  selectPartner,
  setIsCheckAll,
  setListChecked,
  setPartnerQueryParameters,
} from '../../reducer/partner'
import { ListPartnersParams } from '../../types'

interface TablePartnerListProps {
  params: ListPartnersParams
  rows: any
  headCells: TableHeaderColumn[]
  setHeadCells: Dispatch<SetStateAction<TableHeaderColumn[]>>
  refactorQueryParameters: (
    queryParameters: ListPartnersParams
  ) => ListPartnersParams
}

const TablePartnerList = ({
  params,
  headCells,
  setHeadCells,
  rows,
  refactorQueryParameters,
}: TablePartnerListProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const {
    total,
    partnerQueryParameters,
    listChecked,
    isCheckAll,
    isListFetching,
  }: PartnerState = useSelector(selectPartner)

  const handlePageChange = (newPage: number) => {
    const newQueryParameters = {
      ...partnerQueryParameters,
      pageNum: newPage,
    }
    dispatch(setPartnerQueryParameters(newQueryParameters))
  }

  const handleRowsPerPageChange = (pageSize: number) => {
    const newQueryParameters = {
      ...partnerQueryParameters,
      pageNum: 1,
      pageSize,
    }
    dispatch(setPartnerQueryParameters(newQueryParameters))
  }

  const handleNavigateToDetailPage = (partner: any) => {
    const url = StringFormat(
      PathConstant.CUSTOMER_PARTNER_DETAIL_FORMAT,
      partner.id
    )
    navigate(url)
  }

  const handleSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setHeadCells(newColumns)
    const newQueryParameters = {
      ...partnerQueryParameters,
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatch(setPartnerQueryParameters(newQueryParameters))
  }

  const handleCheckAll = () => {
    const newIsCheckAll = !isCheckAll
    if (newIsCheckAll) {
      const newQueryParameters = refactorQueryParameters(params)
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

  return (
    <Box className={classes.rootTablePartnerList}>
      <CommonTable
        useOpenNewTab
        useCheckbox
        linkFormat={PathConstant.CUSTOMER_PARTNER_DETAIL_FORMAT}
        checkAll={listChecked.length === total}
        listChecked={listChecked}
        loading={isListFetching}
        columns={headCells}
        rows={rows}
        onCheckItem={handleCheckItem}
        onCheckAll={handleCheckAll}
        onSortChange={handleSortChange}
        onRowClick={handleNavigateToDetailPage}
        pagination={{
          totalElements: total,
          pageSize: params.pageSize as number,
          pageNum: params.pageNum as number,
          onPageChange: handlePageChange,
          onPageSizeChange: handleRowsPerPageChange,
        }}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTablePartnerList: {
    marginTop: theme.spacing(4),
  },
}))

TablePartnerList.defaultProps = {}

export default TablePartnerList
