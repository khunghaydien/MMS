import CommonTable from '@/components/table/CommonTable'
import { FAKE_LOADING_TIME_DELAY } from '@/const/app.const'
import { NS_PROJECT } from '@/const/lang.const'
import {
  dashboardSelector,
  getProjectAllocationStaff,
  setProjectAllocationQueries,
} from '@/modules/dashboard/reducer/dashboard'
import { ProjectMonthItem } from '@/modules/dashboard/types'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatMonthFromSingleNumber } from '@/utils'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface ProjectMonthValueProps {
  projectMonthItem: ProjectMonthItem
  showAll: boolean
}

const ProjectMonthValue = ({
  projectMonthItem,
  showAll,
}: ProjectMonthValueProps) => {
  const classes = useStyles()

  const showStaffInfo =
    projectMonthItem.assignEffort !== null ||
    projectMonthItem.actualEffort !== null

  return (
    <Box className={classes.RootProjectMonthValue}>
      <Box className={clsx(classes.rootProjectMonthDataValue)}>
        <Box className={clsx(classes.subProjectMonthColumnItem, classes.fw700)}>
          {projectMonthItem.billableMM}
        </Box>
        <Box className={clsx(classes.subProjectMonthColumnItem, classes.fw700)}>
          {projectMonthItem.ee}
        </Box>
        <Box className={clsx(classes.subProjectMonthColumnItem, classes.fw700)}>
          {projectMonthItem.ue}
        </Box>
        <Box className={clsx(classes.subProjectMonthColumnItem, classes.fw700)}>
          {projectMonthItem.assignEffort}
        </Box>
        <Box className={clsx(classes.subProjectMonthColumnItem, classes.fw700)}>
          {projectMonthItem.actualEffort}
        </Box>
      </Box>
      {showAll && !!projectMonthItem.staffs.length && (
        <Box className={classes.staffs}>
          {projectMonthItem.staffs.map(staffItem => (
            <Box
              key={staffItem.staffCode}
              className={clsx(
                classes.rootProjectMonthDataValue,
                classes.staffItem
              )}
            >
              <Box className={classes.staffInfo}>
                {showStaffInfo && (
                  <Box className={classes.staffCode}>
                    {staffItem.staffCode} - {staffItem.divisionName}
                  </Box>
                )}
                {showStaffInfo && (
                  <Box className={classes.staffName}>{staffItem.staffName}</Box>
                )}
              </Box>
              <Box className={classes.subProjectMonthColumnItem}>
                {staffItem.assignEffort}
              </Box>
              <Box className={classes.subProjectMonthColumnItem}>
                {staffItem.actualEffort}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

interface ProjectAllocationStaffTableProps {
  useViewSummary: boolean
}

const ProjectAllocationStaffTable = ({
  useViewSummary,
}: ProjectAllocationStaffTableProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { dataProjectAllocationStaff, projectAllocationQueries } =
    useSelector(dashboardSelector)

  const [rowIdIsOpen, setRowIdIsOpen] = useState<string | number>('')

  const headCells = useMemo(() => {
    const dataHeadCells: TableHeaderColumn[] = [
      {
        id: 'code',
        label: i18Project('LB_PROJECT_CODE'),
      },
      {
        id: 'projectName',
        label: i18Project('LB_PROJECT_NAME'),
      },
    ]
    dataProjectAllocationStaff.dataList[0]?.projectMonth?.forEach(item => {
      const monthYear = `${formatMonthFromSingleNumber(item.month)}/${
        item.year
      }`
      dataHeadCells.push({
        id: monthYear,
        label: monthYear,
        align: 'center',
        className: classes.rowItemTd,
        subLabel: (
          <Box className={classes.subMonthColumns}>
            <Box className={classes.subMonthColumnItem}>
              {i18Project('LB_BILLABLE_MM')}
            </Box>
            <Box className={classes.subMonthColumnItem}>
              EE <br /> (%)
            </Box>
            <Box className={classes.subMonthColumnItem}>
              UE <br /> (%)
            </Box>
            <Box className={classes.subMonthColumnItem}>
              {i18Project('TXT_ASSIGN_EFFORT')}
            </Box>
            <Box className={classes.subMonthColumnItem}>
              {i18Project('LB_ACTUAL_EFFORT')}
            </Box>
          </Box>
        ),
      })
    })
    return dataHeadCells
  }, [dataProjectAllocationStaff.dataList])

  const showRowItem = useCallback((id: string | number) => {
    dispatch(updateLoading(true))
    setTimeout(() => {
      setRowIdIsOpen(id)
      dispatch(updateLoading(false))
    }, FAKE_LOADING_TIME_DELAY)
  }, [])

  const rows = useMemo(() => {
    const dataRows = dataProjectAllocationStaff.dataList.map(item => {
      const isStaffExist = item.projectMonth.some(
        projectMonthItem => !!projectMonthItem.staffs.length
      )
      const rowItem = {
        id: item.projectId,
        code: item.projectCode,
        projectName: (
          <Box className={classes.boxProjectName}>
            <Box className={classes.projectName}>{item.projectName}</Box>
            {useViewSummary && isStaffExist && (
              <Fragment>
                {item.projectId === rowIdIsOpen ? (
                  <RemoveCircleOutline onClick={() => setRowIdIsOpen('')} />
                ) : (
                  <AddCircleOutline
                    onClick={() => showRowItem(item.projectId)}
                  />
                )}
              </Fragment>
            )}
          </Box>
        ),
      }
      item.projectMonth.forEach((projectMonthItem: ProjectMonthItem) => {
        // @ts-ignore
        rowItem[
          `${formatMonthFromSingleNumber(projectMonthItem.month)}/${
            projectMonthItem.year
          }`
        ] = (
          <ProjectMonthValue
            projectMonthItem={projectMonthItem}
            showAll={!useViewSummary || item.projectId === rowIdIsOpen}
          />
        )
      })
      return rowItem
    })
    return dataRows
  }, [dataProjectAllocationStaff.dataList, useViewSummary, rowIdIsOpen])

  const onPageChange = (newPage: number) => {
    dispatch(
      setProjectAllocationQueries({
        pageNum: newPage,
      })
    )
    dispatch(
      getProjectAllocationStaff({
        ...projectAllocationQueries,
        pageNum: newPage,
      })
    )
  }

  const onPageSizeChange = (newPageSize: number) => {
    dispatch(
      setProjectAllocationQueries({
        pageSize: newPageSize,
        pageNum: 1,
      })
    )
    dispatch(
      getProjectAllocationStaff({
        ...projectAllocationQueries,
        pageSize: newPageSize,
        pageNum: 1,
      })
    )
  }

  useEffect(() => {
    setRowIdIsOpen('')
  }, [useViewSummary])

  return (
    <Box className={classes.RootProjectAllocationStaffTable}>
      <CommonTable
        rootClassName={classes.tableOutside}
        rowClassName={classes.rowItemOutside}
        loading={dataProjectAllocationStaff.loading}
        columns={headCells}
        rows={rows}
        pagination={{
          totalElements: dataProjectAllocationStaff.totalElements,
          pageNum: projectAllocationQueries.pageNum || 0,
          pageSize: projectAllocationQueries.pageSize || 0,
          onPageChange,
          onPageSizeChange,
        }}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectAllocationStaffTable: {
    '& thead tr th:nth-child(1)': {
      left: 0,
      position: 'sticky',
      backgroundColor: '#fff',
      zIndex: 9,
      '&::after': {
        content: '" "',
        position: 'absolute',
        width: 1,
        height: '100%',
        background: theme.color.grey.secondary,
        top: 0,
        right: '-1px',
      },
    },
    '& thead tr th:nth-child(2)': {
      left: '115px',
      position: 'sticky',
      backgroundColor: '#fff',
      zIndex: 9,
      '&::after': {
        content: '" "',
        position: 'absolute',
        width: 1,
        height: '100%',
        background: theme.color.grey.secondary,
        top: 0,
        right: '-1px',
      },
    },
    '& tbody tr td:nth-child(1)': {
      left: 0,
      position: 'sticky',
      backgroundColor: '#fff',
      zIndex: 9,
      '&::after': {
        content: '" "',
        position: 'absolute',
        width: 1,
        height: '100%',
        background: theme.color.grey.secondary,
        top: 0,
        right: '-1px',
      },
    },
    '& tbody tr td:nth-child(2)': {
      left: '115px',
      position: 'sticky',
      backgroundColor: '#fff',
      zIndex: 9,
      '&::after': {
        content: '" "',
        position: 'absolute',
        width: 1,
        height: '100%',
        background: theme.color.grey.secondary,
        top: 0,
        right: '-1px',
      },
    },
  },
  label: {
    color: theme.color.black.secondary,
    minWidth: 200,
    textAlign: 'left',
  },
  value: {
    fontWeight: 700,
  },
  projectName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 200,
  },
  RootProjectMonthValue: {},
  boxProjectName: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& svg': {
      cursor: 'pointer',
      fontSize: 18,
      color: theme.color.blue.primary,
    },
  },
  borderBottom: {
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
  },
  tableOutside: {
    '& thead th:not(:last-child)': {
      borderRight: `1px solid ${theme.color.grey.secondary}`,
    },
    '& tbody td:first-child': {
      width: 140,
    },
    '& tbody td:not(:last-child)': {
      borderRight: `1px solid ${theme.color.grey.secondary}`,
    },
  },
  subMonthColumns: {
    display: 'flex',
    gap: theme.spacing(1),
    margin: theme.spacing(0, -2, -2, -2),
    borderTop: `1px solid ${theme.color.grey.secondary}`,
  },
  subMonthColumnItem: {
    width: 60,
    fontWeight: 500,
    lineHeight: '16px',
    padding: theme.spacing(1, 0),
    '&:not(:last-child)': {
      borderRight: `1px solid ${theme.color.grey.secondary}`,
    },
  },
  rootProjectMonthDataValue: {
    display: 'flex',
    gap: theme.spacing(1),
    width: '100%',
    height: '54px',
    justifyContent: 'center',
  },
  subProjectMonthColumnItem: {
    width: 60,
    padding: theme.spacing(1, 0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:not(:last-child)': {
      borderRight: `1px solid ${theme.color.grey.secondary}`,
    },
  },
  rowItemTd: {
    height: '100%',
    padding: '0 !important',
    '& .row-item-text': {
      height: '100%',
    },
  },
  staffs: {
    display: 'flex',
    flexDirection: 'column',
  },
  staffItem: {
    borderTop: `1px solid ${theme.color.grey.secondary}`,
  },
  staffInfo: {
    borderRight: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '196px',
  },
  staffCode: {
    fontSize: 11,
    color: theme.color.blue.primary,
    fontWeight: 500,
  },
  fw700: {
    fontWeight: 700,
  },
  rowItemOutside: {
    '& td:first-child': {
      minWidth: 115,
    },
  },
  staffName: {
    fontSize: 14,
  },
}))

export default ProjectAllocationStaffTable
