import CommonTable from '@/components/table/CommonTable'
import { PathConstant } from '@/const'
import { AppDispatch } from '@/store'
import { SortChangePayload, TableHeaderColumn } from '@/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  setIsCheckAll,
  setListChecked,
  setStaffQueryParameters,
  staffSelector,
} from '../../reducer/staff'
import { getListIds } from '../../reducer/thunk'
import { StaffState } from '../../types'
import { ListStaffParams } from '../../types/staff-list'

interface TableStaffListProps {
  params: ListStaffParams
  headCells: TableHeaderColumn[]
  setHeadCells: Dispatch<SetStateAction<TableHeaderColumn[]>>
  rows: any
  refactorQueryParameters: Function
}

const TableStaffList = ({
  params,
  headCells,
  setHeadCells,
  rows,
  refactorQueryParameters,
}: TableStaffListProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const {
    total,
    staffQueryParameters,
    listChecked,
    isCheckAll,
    isListFetching,
  }: StaffState = useSelector(staffSelector)

  const handlePageChange = (newPage: number) => {
    const newQueryParameters = {
      ...staffQueryParameters,
      pageNum: newPage,
    }
    dispatch(setStaffQueryParameters(newQueryParameters))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const newQueryParameters = {
      ...staffQueryParameters,
      pageNum: 1,
      pageSize: newPageSize,
    }
    dispatch(setStaffQueryParameters(newQueryParameters))
  }

  const handleNavigateToDetailPage = (staff: any) => {
    const url = StringFormat(PathConstant.STAFF_DETAIL_FORMAT, staff.id)
    navigate(url)
  }

  const handleSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setHeadCells(newColumns)
    const newQueryParameters = {
      ...staffQueryParameters,
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatch(setStaffQueryParameters(newQueryParameters))
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
    <CommonTable
      useCheckbox
      useOpenNewTab
      rootClassName={classes.rootTableStaffList}
      listChecked={listChecked}
      loading={isListFetching}
      columns={headCells.filter(item => !!item.isVisible)}
      rows={rows}
      checkAll={listChecked.length === total}
      linkFormat={PathConstant.STAFF_DETAIL_FORMAT}
      onSortChange={handleSortChange}
      onCheckAll={handleCheckAll}
      onCheckItem={handleCheckItem}
      onRowClick={handleNavigateToDetailPage}
      pagination={{
        totalElements: total,
        pageSize: params.pageSize as number,
        pageNum: params.pageNum as number,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
      }}
    />
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTableStaffList: {
    marginTop: theme.spacing(4),
  },
}))

TableStaffList.defaultProps = {}

export default TableStaffList
