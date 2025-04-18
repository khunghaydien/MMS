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
  setIsCheckAllReportOT,
  setListCheckedReportOT,
  setReportOTTimesheetQueryParameters,
} from '../../reducer/project'
import { getListReportIds } from '../../reducer/thunk'
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
  onUpdateClick: (row: any) => void
  onCheckItem?: ({
    id,
    newListChecked,
  }: {
    id: string
    newListChecked: string[]
  }) => void
}

const TableTimesheetOTManagementList = ({
  params,
  headCells,
  rows,
  refactorQueryParameters,
  onRowClick,
  totalReportOT,
  onUpdateClick,
  onDeleteClick,
}: ITableTimesheetOTManagementList) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const {
    reportOTTotalElements,
    reportOTTimesheetQueryParameters,
    listCheckedReportOT,
    isCheckAllReportOT,
    isListReportOTFetching,
    listCheckedReportOTTemp,
  }: ProjectState = useSelector(projectSelector)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const [headCellsProject, setHeadCellsProject] = useState(headCells)

  const handlePageChange = (newPage: number) => {
    const newQueryParameters = {
      ...reportOTTimesheetQueryParameters,
      pageNum: newPage,
    }
    dispatch(setReportOTTimesheetQueryParameters(newQueryParameters))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const newQueryParameters = {
      ...reportOTTimesheetQueryParameters,
      pageNum: 1,
      pageSize: newPageSize,
    }
    dispatch(setReportOTTimesheetQueryParameters(newQueryParameters))
  }

  const handleCheckAll = () => {
    const newIsCheckAll = !isCheckAllReportOT
    if (newIsCheckAll) {
      const newParams = { ...params, myOT: true }
      const newQueryParameters = refactorQueryParameters(newParams)
      dispatch(getListReportIds(newQueryParameters))
    } else {
      dispatch(setListCheckedReportOT([]))
    }
    dispatch(setIsCheckAllReportOT(newIsCheckAll))
  }

  const handleCheckItem = ({
    newListChecked,
  }: {
    newListChecked: string[]
  }) => {
    dispatch(setListCheckedReportOT(newListChecked))
  }

  const handleSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setHeadCellsProject(newColumns)
    const newQueryParameters = {
      ...reportOTTimesheetQueryParameters,
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatch(setReportOTTimesheetQueryParameters(newQueryParameters))
  }

  return (
    <Box className={classes.rootTableProjectList}>
      <CommonTable
        useCheckbox
        linkFormat={PathConstant.PROJECT_DETAIL_FORMAT}
        checkAll={
          !!listCheckedReportOT.length &&
          listCheckedReportOT.length === listCheckedReportOTTemp.length
        }
        listChecked={listCheckedReportOT}
        loading={isListReportOTFetching}
        columns={headCellsProject}
        rows={rows}
        onCheckItem={handleCheckItem}
        onCheckAll={handleCheckAll}
        onSortChange={handleSortChange}
        onDeleteClick={onDeleteClick}
        onUpdateClick={onUpdateClick}
        onRowClick={onRowClick}
        pagination={{
          totalElements: reportOTTotalElements,
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
              <TableCell colSpan={5} style={{ paddingLeft: '80px' }}>
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
              <TableCell colSpan={5} style={{ paddingLeft: '80px' }}>
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
