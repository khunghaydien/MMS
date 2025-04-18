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
  setHrOsQueryParameters,
  setIsCheckAllHROutsource,
  setListHROutsouceChecked,
  staffSelector,
} from '../../reducer/staff'
import { getListHROutsourceIds } from '../../reducer/thunk'
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
    totalHROutsource,
    hrOsQueryParameters,
    listHROutsouceChecked,
    isCheckAllHROutsource,
    isListFetchingHROutsource,
  }: StaffState = useSelector(staffSelector)

  const handlePageChange = (newPage: number) => {
    const newQueryParameters = {
      ...hrOsQueryParameters,
      pageNum: newPage,
    }
    dispatch(setHrOsQueryParameters(newQueryParameters))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const newQueryParameters = {
      ...hrOsQueryParameters,
      pageNum: 1,
      pageSize: newPageSize,
    }
    dispatch(setHrOsQueryParameters(newQueryParameters))
  }

  const handleNavigateToDetailPage = (staff: any) => {
    const url = StringFormat(
      PathConstant.STAFF_OUTSOURCE_DETAIL_FORMAT,
      staff.id
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
      ...hrOsQueryParameters,
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatch(setHrOsQueryParameters(newQueryParameters))
  }

  const handleCheckAll = () => {
    const newIsCheckAll = !isCheckAllHROutsource
    if (newIsCheckAll) {
      const newQueryParameters = refactorQueryParameters(params)
      dispatch(getListHROutsourceIds(newQueryParameters))
    } else {
      dispatch(setListHROutsouceChecked([]))
    }
    dispatch(setIsCheckAllHROutsource(newIsCheckAll))
  }

  const handleCheckItem = ({
    newListChecked,
  }: {
    newListChecked: string[]
  }) => {
    dispatch(setListHROutsouceChecked(newListChecked))
  }

  return (
    <CommonTable
      useCheckbox
      useOpenNewTab
      rootClassName={classes.rootTableStaffList}
      listChecked={listHROutsouceChecked}
      loading={isListFetchingHROutsource}
      columns={headCells}
      rows={rows}
      checkAll={listHROutsouceChecked.length === totalHROutsource}
      linkFormat={PathConstant.STAFF_OUTSOURCE_DETAIL_FORMAT}
      onSortChange={handleSortChange}
      onCheckAll={handleCheckAll}
      onCheckItem={handleCheckItem}
      onRowClick={handleNavigateToDetailPage}
      pagination={{
        totalElements: totalHROutsource,
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
