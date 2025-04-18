import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import StatusItem from '@/components/common/StatusItem'
import { LangConstant } from '@/const'
import { PROJECT_STATUS } from '@/const/app.const'
import { AppDispatch } from '@/store'
import { IStatus, TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { KPI_COLS_SECTIONS, KPI_SECTIONS } from '../../const'
import { projectSelector, setIsListFetching } from '../../reducer/project'
import { getListProjects } from '../../reducer/thunk'
import { IListProjectsParams, ProjectState } from '../../types'
import { ColTooltip } from '../project-detail-v2/project-dashboard-detail/ProjectKPIInformationTable'
import { getCostStatus } from '../project-detail-v2/project-kpi-information/KPICost/KPICost'
import { getTimelinessStatus } from '../project-detail-v2/project-kpi-information/KPIDelivery/KPIDelivery'
import { getProcessStatus } from '../project-detail-v2/project-kpi-information/KPIProcess/KPIProcess'
import { getQualityRateStatus } from '../project-detail-v2/project-kpi-information/KPIQualityCSS/BugRate/BugRate'
import { getCSSStatus } from '../project-detail-v2/project-kpi-information/KPIQualityCSS/CustomerSatisfaction/CustomerSatisfaction'
import ProjectListAction from './ProjectListAction'
import TableProjectList from './TableProjectList'

const projectListHeadCells: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: 'Project Code',
    sortBy: 'code',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'projectName',
    align: 'left',
    label: 'Project Name',
    sortBy: 'name',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'customer',
    align: 'left',
    label: 'Customer',
    checked: false,
  },
  {
    id: 'productType',
    align: 'left',
    label: 'Product Type',
    checked: false,
  },
  {
    id: 'division',
    align: 'left',
    label: 'Division',
    checked: false,
  },
  {
    id: 'startDate',
    align: 'left',
    label: 'Start Date',
    sortBy: 'startDate',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'endDate',
    align: 'left',
    label: 'End Date',
    sortBy: 'endDate',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'css',
    align: 'left',
    label: 'CSS',
    subLabel: '(average)',
    checked: false,
    tooltip: <ColTooltip section={KPI_COLS_SECTIONS[KPI_SECTIONS.CSS]} />,
  },
  {
    id: 'bugRate',
    align: 'left',
    label: 'Bug Rate',
    subLabel: '(accumulated)',
    checked: false,
    tooltip: <ColTooltip section={KPI_COLS_SECTIONS[KPI_SECTIONS.BUG_RATE]} />,
  },
  {
    id: 'leakageRate',
    align: 'left',
    label: 'Leakage Rate',
    subLabel: '(accumulated)',
    checked: false,
    tooltip: (
      <ColTooltip section={KPI_COLS_SECTIONS[KPI_SECTIONS.LEAKAGE_RATE]} />
    ),
  },
  {
    id: 'eeForecast',
    align: 'left',
    label: 'EE Forecast',
    subLabel: '(accumulated)',
    checked: false,
    tooltip: (
      <ColTooltip section={KPI_COLS_SECTIONS[KPI_SECTIONS.EE_PROJECT_MERGE]} />
    ),
  },
  {
    id: 'eeActual',
    align: 'left',
    label: 'EE Actual',
    subLabel: '(accumulated)',
    checked: false,
    tooltip: (
      <ColTooltip section={KPI_COLS_SECTIONS[KPI_SECTIONS.EE_PROJECT_MERGE]} />
    ),
  },
  {
    id: 'timeliness',
    align: 'left',
    label: 'Timeliness',
    subLabel: '(accumulated)',
    checked: false,
    tooltip: (
      <ColTooltip section={KPI_COLS_SECTIONS[KPI_SECTIONS.TIMELINESS]} />
    ),
  },
  {
    id: 'pcv',
    align: 'left',
    label: 'PCV',
    subLabel: '(average)',
    checked: false,
    tooltip: <ColTooltip section={KPI_COLS_SECTIONS[KPI_SECTIONS.PCV]} />,
  },
  {
    id: 'projectStatus',
    align: 'left',
    label: 'Project Status',
    checked: false,
  },
]
export const convertProjectStatus = (item: any): IStatus => {
  let _resultData: IStatus = { color: 'grey', label: '' }
  if (PROJECT_STATUS[item?.id]) {
    return PROJECT_STATUS[item?.id]
  }
  return _resultData
}
const formatPercentage = (value: number | null) => {
  if (typeof value === 'number') return `${value}%`
  return '--'
}

const createData = (item: any, classes: any) => {
  return {
    code: item.code,
    id: item.id,
    projectName: item.name,
    customer: item.customer,
    productType: item.productType || '',
    startDate: formatDate(item.startDate),
    endDate: item.endDate != 0 ? formatDate(item.endDate) : '',
    projectStatus: (
      <StatusItem typeStatus={{ ...convertProjectStatus(item?.status) }} />
    ),
    division: item.division || '--',
    css: (
      <Box
        className={clsx(
          classes.kpiValueBox,
          getCSSStatus(item.cssAveragePoints.status).color
        )}
      >
        <Box className={classes.kpiValue}>
          {item.cssAveragePoints.value !== null
            ? item.cssAveragePoints.value
            : '--'}
        </Box>
        <Box className="statusItemBox">
          <StatusItem typeStatus={getCSSStatus(item.cssAveragePoints.status)} />
        </Box>
      </Box>
    ),
    bugRate: (
      <Box
        className={clsx(
          classes.kpiValueBox,
          getQualityRateStatus(item.accumulatedBugRate.status).color
        )}
      >
        <Box className={classes.kpiValue}>
          {item.accumulatedBugRate.value !== null
            ? item.accumulatedBugRate.value
            : '--'}
        </Box>
        <Box className="statusItemBox">
          <StatusItem
            typeStatus={getQualityRateStatus(item.accumulatedBugRate.status)}
          />
        </Box>
      </Box>
    ),
    leakageRate: (
      <Box
        className={clsx(
          classes.kpiValueBox,
          getQualityRateStatus(item.accumulatedLeakageRate.status).color
        )}
      >
        <Box className={classes.kpiValue}>
          {item.accumulatedLeakageRate.value !== null
            ? item.accumulatedLeakageRate.value
            : '--'}
        </Box>
        <Box className="statusItemBox">
          <StatusItem
            typeStatus={getQualityRateStatus(
              item.accumulatedLeakageRate.status
            )}
          />
        </Box>
      </Box>
    ),
    eeForecast: (
      <Box
        className={clsx(
          classes.kpiValueBox,
          getCostStatus(item.accumulatedEeForecast.status).color
        )}
      >
        <Box className={classes.kpiValue}>
          {formatPercentage(item.accumulatedEeForecast.value)}
        </Box>
        <Box className="statusItemBox">
          <StatusItem
            typeStatus={getCostStatus(item.accumulatedEeForecast.status)}
          />
        </Box>
      </Box>
    ),
    eeActual: (
      <Box
        className={clsx(
          classes.kpiValueBox,
          getCostStatus(item.accumulatedEeActual.status).color
        )}
      >
        <Box className={classes.kpiValue}>
          {formatPercentage(item.accumulatedEeActual.value)}
        </Box>
        <Box className="statusItemBox">
          <StatusItem
            typeStatus={getCostStatus(item.accumulatedEeActual.status)}
          />
        </Box>
      </Box>
    ),
    timeliness: (
      <Box
        className={clsx(
          classes.kpiValueBox,
          getTimelinessStatus(item.timeliness.status).color
        )}
      >
        <Box className={classes.kpiValue}>
          {formatPercentage(item.timeliness.value)}
        </Box>
        <Box className="statusItemBox">
          <StatusItem
            typeStatus={getTimelinessStatus(item.timeliness.status)}
          />
        </Box>
      </Box>
    ),
    pcv: (
      <Box
        className={clsx(
          classes.kpiValueBox,
          getProcessStatus(item.pcvAveragePoints.status).color
        )}
      >
        <Box className={classes.kpiValue}>
          {item.pcvAveragePoints.value !== null
            ? item.pcvAveragePoints.value
            : '--'}
        </Box>
        <Box className="statusItemBox">
          <StatusItem
            typeStatus={getProcessStatus(item.pcvAveragePoints.status)}
          />
        </Box>
      </Box>
    ),
  }
}

const refactorQueryParameters = (queryParameters: IListProjectsParams) => {
  const newQueryParameters = {
    ...structuredClone(queryParameters),
    divisionIds: !!queryParameters.divisionIds?.length
      ? queryParameters.divisionIds.join(',')
      : null,
    customerIds: !!queryParameters.customerIds?.length
      ? queryParameters.customerIds?.map((item: any) => item.value).join(',')
      : null,
    productType: !!queryParameters.productType?.length
      ? queryParameters.productType?.map((item: any) => item.value).join(',')
      : null,
    status: !!queryParameters.status?.length
      ? queryParameters.status.join(',')
      : null,
    keyword: queryParameters.keyword?.trim(),
  }
  return newQueryParameters
}

const ProjectList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { projectList, projectQueryParameters, listChecked }: ProjectState =
    useSelector(projectSelector)

  const rows = useMemo(() => {
    return projectList?.map((item: any) => createData(item, classes)) || []
  }, [projectList, classes, createData])

  const getListProjectsApi = (params: IListProjectsParams = {}) => {
    setTimeout(() => {
      dispatch(setIsListFetching(true))
    })
    const newQueryParameters = refactorQueryParameters(params)
    dispatch(getListProjects(newQueryParameters))
  }

  useEffect(() => {
    getListProjectsApi(projectQueryParameters)
  }, [projectQueryParameters])

  return (
    <CommonScreenLayout title={i18Project('TXT_PROJECT_MANAGEMENT_TITLE')}>
      <Box className={classes.projectContainer}>
        <ProjectListAction
          listChecked={listChecked}
          headCells={projectListHeadCells}
        />
        <TableProjectList
          rows={rows}
          headCells={projectListHeadCells}
          params={projectQueryParameters}
          refactorQueryParameters={refactorQueryParameters}
        />
      </Box>
    </CommonScreenLayout>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootProjectList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  projectContainer: {
    marginTop: theme.spacing(3),
  },
  kpiValueBox: {
    position: 'relative',
    '& .statusItemBox': {
      position: 'absolute',
      opacity: 0,
      transition: 'all .2s',
    },
    '&:hover .statusItemBox': {
      opacity: 1,
    },
    '&.green': {
      color: theme.color.green.primary,
    },
    '&.red': {
      color: theme.color.error.primary,
    },
    '&.grey': {
      color: theme.color.grey.primary,
    },
    '&.yellow': {
      color: theme.color.yellow.aesthetic,
    },
    '&.blue': {
      color: theme.color.blue.primary,
    },
    '&.orange': {
      color: theme.color.orange.third,
    },
    '&.violet': {
      color: theme.color.violet.primary,
    },
    '&.earthy': {
      color: theme.color.earthy.primary,
    },
  },
  kpiValue: {
    fontWeight: 500,
  },
}))
export default ProjectList
