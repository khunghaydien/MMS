import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant } from '@/const'
import { AppDispatch } from '@/store'
import { SortChangePayload, TableHeaderColumn } from '@/types'
import { Box, TableCell, TableRow, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  projectSelector,
  setApprovalOTTimesheetQueryParameters,
  setIsCheckAllApprovalOT,
  setListCheckedApprovalOT,
} from '../../reducer/project'
import { getListReportApprovalIds } from '../../reducer/thunk'
import { IListProjectsParams, ProjectState } from '../../types'

interface ITableTimesheetOTManagementList {
  totalReportOT: {
    totalApprovedHours: number
    totalReportedHours: number
  }
  params: IListProjectsParams
  headCells: TableHeaderColumn[]
  rows: any
  refactorQueryParameters: (
    queryParameters: IListProjectsParams
  ) => IListProjectsParams
  onRowClick: (row: any) => void
  onDeleteClick: (row: any) => void
}

const TableTimesheetOTManagementList = ({
  params,
  headCells,
  rows,
  refactorQueryParameters,
  onRowClick,
  totalReportOT,
  onDeleteClick,
}: ITableTimesheetOTManagementList) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const {
    approvalOTTotalElements,
    approvalOTTimesheetQueryParameters,
    listCheckedApprovalOT,
    isCheckAllApprovalOT,
    isListApprovalOTFetching,
    listCheckedApprovalOTTemp,
  }: ProjectState = useSelector(projectSelector)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const [headCellsProject, setHeadCellsProject] = useState(headCells)

  const handlePageChange = (newPage: number) => {
    const newQueryParameters = {
      ...approvalOTTimesheetQueryParameters,
      pageNum: newPage,
    }
    dispatch(setApprovalOTTimesheetQueryParameters(newQueryParameters))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const newQueryParameters = {
      ...approvalOTTimesheetQueryParameters,
      pageNum: 1,
      pageSize: newPageSize,
    }
    dispatch(setApprovalOTTimesheetQueryParameters(newQueryParameters))
  }

  const handleCheckAll = () => {
    const newIsCheckAll = !isCheckAllApprovalOT
    if (newIsCheckAll) {
      const newParams = { ...params, myOT: false }
      const newQueryParameters = refactorQueryParameters(newParams)
      dispatch(getListReportApprovalIds(newQueryParameters))
    } else {
      dispatch(setListCheckedApprovalOT([]))
    }
    dispatch(setIsCheckAllApprovalOT(newIsCheckAll))
  }

  const handleCheckItem = ({
    newListChecked,
  }: {
    newListChecked: string[]
  }) => {
    dispatch(setListCheckedApprovalOT(newListChecked))
  }

  const handleSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setHeadCellsProject(newColumns)
    const newQueryParameters = {
      ...approvalOTTimesheetQueryParameters,
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatch(setApprovalOTTimesheetQueryParameters(newQueryParameters))
  }

  return (
    <Box className={classes.rootTableProjectList}>
      <CommonTable
        useCheckbox
        linkFormat={PathConstant.PROJECT_DETAIL_FORMAT}
        checkAll={
          !!listCheckedApprovalOT.length &&
          listCheckedApprovalOT.length === listCheckedApprovalOTTemp.length
        }
        listChecked={listCheckedApprovalOT}
        loading={isListApprovalOTFetching}
        columns={headCellsProject}
        rows={rows}
        onCheckItem={handleCheckItem}
        onCheckAll={handleCheckAll}
        onSortChange={handleSortChange}
        onDeleteClick={onDeleteClick}
        onRowClick={onRowClick}
        pagination={{
          totalElements: approvalOTTotalElements,
          pageSize: params.pageSize as number,
          pageNum: params.pageNum as number,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        LastRow={
          <>
            <TableRow>
              <TableCell
                colSpan={3}
                style={{ textAlign: 'center', fontWeight: 700 }}
              >
                {String(i18Project('LB_TOTAL_REPORTED_OT_HOURS'))}
              </TableCell>
              <TableCell colSpan={6} style={{ paddingLeft: '80px' }}>
                {totalReportOT?.totalReportedHours}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={3}
                style={{ textAlign: 'center', fontWeight: 700 }}
              >
                {String(i18Project('LB_TOTAL_APPROVED_OT_HOURS'))}
              </TableCell>
              <TableCell colSpan={6} style={{ paddingLeft: '80px' }}>
                {totalReportOT?.totalApprovedHours}
              </TableCell>
            </TableRow>
          </>
        }
      />
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootTableProjectList: {
    marginTop: theme.spacing(4),
  },
}))
export default TableTimesheetOTManagementList
