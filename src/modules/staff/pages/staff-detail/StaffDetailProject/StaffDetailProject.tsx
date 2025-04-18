import CardForm from '@/components/Form/CardForm'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { resetStaffProject, staffSelector } from '@/modules/staff/reducer/staff'
import { getStaffProject } from '@/modules/staff/reducer/thunk'
import { StaffProject } from '@/modules/staff/types'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatDate, formatNumberToCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'

const headCells: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: i18next.t('project:LB_PROJECT_CODE'),
  },
  {
    id: 'name',
    align: 'left',
    label: i18next.t('project:LB_PROJECT_NAME'),
  },
  {
    id: 'projectStartDate',
    align: 'left',
    label: i18next.t('project:LB_PROJECT_START_DATE'),
  },
  {
    id: 'projectEndDate',
    align: 'left',
    label: i18next.t('project:LB_PROJECT_END_DATE'),
  },
  {
    id: 'technology',
    align: 'left',
    label: i18next.t('common:LB_TECHNOLOGY'),
  },
  {
    id: 'assignStartDate',
    align: 'left',
    label: i18next.t('project:LB_ASSIGN_START_DATE'),
  },
  {
    id: 'assignEndDate',
    align: 'left',
    label: i18next.t('project:LB_ASSIGN_END_DATE'),
  },
  {
    id: 'projectHeadcount',
    align: 'left',
    label: i18next.t('project:TXT_ASSIGN_EFFORT'),
  },
]

const createData = (item: StaffProject) => {
  return {
    id: item.id + item.startDate + item.assignEndDate + JSON.stringify(item),
    projectId: item.id,
    code: item.code,
    name: item.name,
    projectStartDate: formatDate(item.startDate),
    projectEndDate: formatDate(item.endDate),
    assignStartDate: formatDate(item.assignStartDate),
    assignEndDate: formatDate(item.assignEndDate),
    projectHeadcount: item.seeDetails
      ? `${formatNumberToCurrency(item.headcount)}%`
      : '',
    technology: item.technologies?.map(item => item.name)?.join(', ') || '',
    teamSize: item.teamSize || null,
    description: item.description || '',
    seeDetails: item.seeDetails && item.viewProjects,
    role: item.role || '',
  }
}

const StaffDetailProject = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)

  const { staffProject } = useSelector(staffSelector)

  const [queryParams, setQueryParams] = useState({
    pageSize: TableConstant.LIMIT_DEFAULT,
    pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    staffId: params.staffId || '',
  })

  const [projectLoading, setProjectLoading] = useState(false)

  const rows = useMemo(() => {
    if (!staffProject.data) return []
    return staffProject.data.map((item: StaffProject) => createData(item))
  }, [staffProject])

  const handlePageChange = (newPage: number) => {
    setQueryParams(prev => ({
      ...prev,
      pageNum: newPage,
    }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQueryParams(prev => ({
      ...prev,
      pageNum: 1,
      pageSize: newPageSize,
    }))
  }

  const handleClickProjectItem = (project: any) => {
    const url = StringFormat(
      PathConstant.PROJECT_DETAIL_FORMAT,
      project.projectId
    )
    window.open(url)
  }

  useEffect(() => {
    setProjectLoading(true)
    dispatch(getStaffProject(queryParams))
      .unwrap()
      .finally(() => {
        setProjectLoading(false)
      })
  }, [queryParams])

  useEffect(() => {
    dispatch(resetStaffProject())
  }, [])

  return (
    <Fragment>
      <Box className={classes.rootStaffProject}>
        <CardForm title={i18nStaff('TXT_PROJECT_INFORMATION')}>
          <CommonTable
            loading={projectLoading}
            columns={headCells}
            rows={rows}
            pagination={{
              totalElements: staffProject.total as number,
              pageSize: queryParams.pageSize,
              pageNum: queryParams.pageNum,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            onRowClick={handleClickProjectItem}
          />
        </CardForm>
      </Box>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootStaffProject: {
    '& .table-th': {
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: 500,
      position: 'sticky',
      left: 0,
      backgroundColor: theme.color.white,
    },

    '& .th__text': {
      minWidth: 'max-content',
    },

    '& .headcount-cell': {
      fontWeight: 'bolder',
    },

    '& .less-than': {
      color: theme.color.error.primary,
    },
    '& .equal-than': {
      color: theme.color.green.primary,
    },
    '& .more-than': {
      color: theme.color.orange.primary,
    },
  },
  tableHeadcount: {
    marginTop: theme.spacing(3),
    maxWidth: '100%',
    marginBottom: '10px',
    background: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E0E0E0',
    borderRadius: '4px',
    padding: theme.spacing(0.5, 0.5, 0, 0.5),
    position: 'relative',
  },
}))

export default StaffDetailProject
