import CommonTable from '@/components/table/CommonTable'
import { FAKE_LOADING_TIME_DELAY } from '@/const/app.const'
import { NS_DASHBOARD } from '@/const/lang.const'
import {
  dashboardSelector,
  getStaffAssignAllocation,
  setStaffAllocationQueries,
} from '@/modules/dashboard/reducer/dashboard'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatMonthFromSingleNumber, formatNumberDecimal } from '@/utils'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface StaffMonthValueProps {
  projects: {
    name: string
    effort: number
  }[]
  showAll: boolean
}

const StaffMonthValue = ({ projects, showAll }: StaffMonthValueProps) => {
  const classes = useStyles()
  const { t: i18Dashboard } = useTranslation(NS_DASHBOARD)

  const totalEffort = useMemo(() => {
    return projects.reduce((total, project) => {
      return total + project.effort
    }, 0)
  }, [projects])

  return (
    <Box className={classes.RootStaffMonthValue}>
      <Box
        className={clsx(
          classes.totalEffortProject,
          showAll && !!projects.length && classes.borderBottom
        )}
      >
        {showAll && !!projects.length && (
          <Box className={clsx(classes.label, classes.totalEffortProjectLabel)}>
            {i18Dashboard('TXT_TOTAL_EFFORT')}
          </Box>
        )}
        <Box className={classes.value}>
          {formatNumberDecimal(totalEffort, 2)}
        </Box>
      </Box>
      {showAll && !!projects.length && (
        <Box className={clsx(classes.projectList, 'scrollbar')}>
          {projects.map((project, index) => (
            <Box key={index} className={classes.projectItem}>
              <Box
                className={clsx(classes.projectName, classes.label)}
                title={project.name}
              >
                {project.name}
              </Box>
              <Box className={classes.value}>{project.effort}</Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

interface StaffAssignAllocationTableProps {
  useViewSummary: boolean
}

const StaffAssignAllocationTable = ({
  useViewSummary,
}: StaffAssignAllocationTableProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()

  const { dataStaffAssignAllocation, staffAllocationQueries } =
    useSelector(dashboardSelector)

  const [rowIdIsOpen, setRowIdIsOpen] = useState<string | number>('')

  const headCells = useMemo(() => {
    const dataHeadCells: TableHeaderColumn[] = [
      {
        id: 'code',
        label: i18('LB_STAFF_CODE'),
      },
      {
        id: 'staffName',
        label: i18('LB_STAFF_NAME'),
      },
    ]
    dataStaffAssignAllocation.dataList[0]?.staffMonth?.forEach(item => {
      const monthYear = `${formatMonthFromSingleNumber(item.month)}/${
        item.year
      }`
      dataHeadCells.push({
        id: monthYear,
        label: monthYear,
        align: 'center',
      })
    })
    return dataHeadCells
  }, [dataStaffAssignAllocation.dataList])

  const showRowItem = useCallback((id: string | number) => {
    dispatch(updateLoading(true))
    setTimeout(() => {
      setRowIdIsOpen(id)
      dispatch(updateLoading(false))
    }, FAKE_LOADING_TIME_DELAY)
  }, [])

  const rows = useMemo(() => {
    const dataRows = dataStaffAssignAllocation.dataList.map(item => {
      const isProjectExist = item.staffMonth.some(
        staffMonthItem => !!staffMonthItem.projects.length
      )
      const rowItem = {
        id: item.staffId,
        code: item.staffCode,
        staffName: (
          <Box className={classes.boxStaffName}>
            <Box className={classes.staffName}>{item.staffName}</Box>
            {useViewSummary && isProjectExist && (
              <Fragment>
                {item.staffId === rowIdIsOpen ? (
                  <RemoveCircleOutline onClick={() => setRowIdIsOpen('')} />
                ) : (
                  <AddCircleOutline onClick={() => showRowItem(item.staffId)} />
                )}
              </Fragment>
            )}
          </Box>
        ),
      }
      item.staffMonth.forEach(staffMonthItem => {
        // @ts-ignore
        rowItem[
          `${formatMonthFromSingleNumber(staffMonthItem.month)}/${
            staffMonthItem.year
          }`
        ] = (
          <StaffMonthValue
            projects={staffMonthItem.projects}
            showAll={!useViewSummary || item.staffId === rowIdIsOpen}
          />
        )
      })
      return rowItem
    })
    return dataRows
  }, [dataStaffAssignAllocation.dataList, useViewSummary, rowIdIsOpen])

  const onPageChange = (newPage: number) => {
    dispatch(
      setStaffAllocationQueries({
        pageNum: newPage,
      })
    )
    dispatch(
      getStaffAssignAllocation({ ...staffAllocationQueries, pageNum: newPage })
    )
  }

  const onPageSizeChange = (newPageSize: number) => {
    dispatch(
      setStaffAllocationQueries({
        pageSize: newPageSize,
        pageNum: 1,
      })
    )
    dispatch(
      getStaffAssignAllocation({
        ...staffAllocationQueries,
        pageSize: newPageSize,
        pageNum: 1,
      })
    )
  }

  useEffect(() => {
    setRowIdIsOpen('')
  }, [useViewSummary])

  return (
    <Box className={classes.RootStaffAssignAllocationTable}>
      <CommonTable
        rowClassName={classes.rowItemOutside}
        loading={dataStaffAssignAllocation.loading}
        columns={headCells}
        rows={rows}
        pagination={{
          totalElements: dataStaffAssignAllocation.totalElements,
          pageNum: staffAllocationQueries.pageNum || 0,
          pageSize: staffAllocationQueries.pageSize || 0,
          onPageChange,
          onPageSizeChange,
        }}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootStaffAssignAllocationTable: {
    '& thead tr th': {
      borderRight: `1px solid ${theme.color.grey.secondary}`,
    },
    '& tbody tr td': {
      borderRight: `1px solid ${theme.color.grey.secondary}`,
    },
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
      left: '160px',
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
      left: '160px',
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
  totalEffortProject: {
    display: 'flex',
    gap: theme.spacing(2),
    width: '100%',
    justifyContent: 'center',
    paddingRight: theme.spacing(0.5),
  },
  label: {
    color: theme.color.black.secondary,
    width: 200,
    textAlign: 'left',
  },
  value: {
    fontWeight: 700,
  },
  projectList: {
    marginTop: theme.spacing(1),
    width: '100%',
    height: '60px',
    overflowY: 'auto',
    paddingRight: theme.spacing(0.5),
  },
  projectItem: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  projectName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
  RootStaffMonthValue: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  totalEffortProjectLabel: {
    fontWeight: 700,
    flex: 1,
  },
  boxStaffName: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& svg': {
      cursor: 'pointer',
      fontSize: 18,
      color: theme.color.blue.primary,
    },
  },
  staffName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 170,
  },
  borderBottom: {
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    paddingBottom: theme.spacing(1),
  },
  rowItemOutside: {
    '& td:first-child': {
      minWidth: 160,
    },
  },
}))

export default StaffAssignAllocationTable
