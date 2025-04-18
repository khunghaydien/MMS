import CommonTable from '@/components/table/CommonTable'
import { PathConstant } from '@/const'
import { AppDispatch } from '@/store'
import { SortChangePayload, TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  projectSelector,
  setIsCheckAll,
  setListChecked,
  setProjectQueryParameters,
} from '../../reducer/project'
import { getListIds } from '../../reducer/thunk'
import { IListProjectsParams, ProjectState } from '../../types'

interface ITableProjectList {
  params: IListProjectsParams
  headCells: TableHeaderColumn[]
  rows: any
  refactorQueryParameters: (
    queryParameters: IListProjectsParams
  ) => IListProjectsParams
}

const TableProjectList = ({
  params,
  headCells,
  rows,
  refactorQueryParameters,
}: ITableProjectList) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const {
    projectsTotalElements,
    projectQueryParameters,
    listChecked,
    isCheckAll,
    isListFetching,
  }: ProjectState = useSelector(projectSelector)

  const [headCellsProject, setHeadCellsProject] = useState(headCells)

  const handlePageChange = (newPage: number) => {
    const newQueryParameters = {
      ...projectQueryParameters,
      pageNum: newPage,
    }
    dispatch(setProjectQueryParameters(newQueryParameters))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const newQueryParameters = {
      ...projectQueryParameters,
      pageNum: 1,
      pageSize: newPageSize,
    }
    dispatch(setProjectQueryParameters(newQueryParameters))
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

  const handleNavigateToDetailPage = (project: any) => {
    const url = StringFormat(PathConstant.PROJECT_DETAIL_FORMAT, project.id)
    navigate(url)
  }

  const handleSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setHeadCellsProject(newColumns)
    const newQueryParameters = {
      ...projectQueryParameters,
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatch(setProjectQueryParameters(newQueryParameters))
  }

  return (
    <Box className={classes.rootTableProjectList}>
      <CommonTable
        useOpenNewTab
        useCheckbox
        linkFormat={PathConstant.PROJECT_DETAIL_FORMAT}
        checkAll={listChecked.length === projectsTotalElements}
        listChecked={listChecked}
        loading={isListFetching}
        columns={headCellsProject}
        rows={rows}
        onCheckItem={handleCheckItem}
        onCheckAll={handleCheckAll}
        onSortChange={handleSortChange}
        onRowClick={handleNavigateToDetailPage}
        pagination={{
          totalElements: projectsTotalElements,
          pageSize: params.pageSize as number,
          pageNum: params.pageNum as number,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootTableProjectList: {
    marginTop: theme.spacing(4),
    '& thead th:nth-child(4) div': {
      width: 200,
    },
    '& thead th:nth-child(3) div': {
      width: 150,
    },
    '& .TableContainer': {
      overflowY: 'hidden',
    },
  },
}))
export default TableProjectList
