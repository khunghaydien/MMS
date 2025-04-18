import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import StatusItem from '@/components/common/StatusItem'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import CommonTabs from '@/components/tabs'
import { LangConstant, PathConstant } from '@/const'
import { MODULE_PROJECT_CONST } from '@/const/app.const'
import {
  getBranchList,
  getContractTypes,
  setPersonInChargeProject,
} from '@/reducer/common'
import { alertError } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { ErrorResponse } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  projectSelector,
  resetProjectDataStep,
  setKpiDetailMenu,
  setKpiRangeDateFilter,
  setProjectDashboardScreenDetail,
} from '../../reducer/project'
import {
  getPermissionProjectKPI,
  getPermissionResourceAllocation,
  getProjectGeneral,
} from '../../reducer/thunk'
import { ProjectState } from '../../types'
import { convertProjectStatus } from '../project-list'
import ProjectActivityLog from './project-activity-log/ProjectActivityLog'
import ProjectDashboard from './project-dashboard-detail/ProjectDashboard'
import ProjectGeneralDetail from './project-general-detail/ProjectGeneralDetail'
import ResourceAllocationDetail from './project-resource-allocation/ResourceAllocationDetail'

export const PROJECT_DASHBOARD_TAB = 1
export const PROJECT_GENERAL_INFORMATION_TAB = 2
export const PROJECT_RESOURCE_ALLOCATION_TAB = 3
export const PROJECT_ACTIVITY_LOG_TAB = 5

const ProjectDetail = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { generalInfo }: ProjectState = useSelector(projectSelector)

  const [activeTab, setActiveTab] = useState(
    Number(sessionStorage.getItem('rootProjectTab')) || PROJECT_DASHBOARD_TAB
  )

  const [loading, setLoading] = useState(false)
  const tabs = [
    {
      step: PROJECT_DASHBOARD_TAB,
      label: i18Project('TXT_PROJECT_DASHBOARD'),
      disabled: false,
    },
    {
      step: PROJECT_GENERAL_INFORMATION_TAB,
      label: i18('TXT_GENERAL_INFORMATION'),
      disabled: false,
    },
    {
      step: PROJECT_RESOURCE_ALLOCATION_TAB,
      label: i18Project('TXT_RESOURCE_ALLOCATION'),
      disabled: false,
    },
    {
      step: PROJECT_ACTIVITY_LOG_TAB,
      label: i18Project('TXT_ACTIVITY_LOG'),
      disabled: false,
    },
  ]

  const backToProjectList = () => {
    navigate(PathConstant.PROJECT_LIST)
    sessionStorage.removeItem('projectDashboardScreenDetail')
    sessionStorage.removeItem('kpiDetailMenu')
    sessionStorage.removeItem('rootProjectTab')
    dispatch(setKpiDetailMenu('quality'))
    dispatch(setProjectDashboardScreenDetail('KPI_INFORMATION_TABLE'))
  }

  const onTabChange = (newTab: number) => {
    setActiveTab(newTab)
  }

  const getProjectGeneralDetail = () => {
    setLoading(true)
    dispatch(
      getProjectGeneral({
        projectId: params.projectId as string,
      })
    )
      .unwrap()
      .catch((errs: ErrorResponse[]) => {
        if (errs[0]?.field === 'projectId') {
          dispatch(
            alertError({
              message: StringFormat(
                i18('MSG_SCREEN_NOT_FOUND'),
                i18('LB_PROJECT') as string
              ),
            })
          )
        } else {
          dispatch(
            alertError({
              message: errs[0]?.message || i18('MSG_COMMON_ERROR_ALERT'),
            })
          )
        }
        backToProjectList()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getProjectGeneralDetail()
  }, [params.projectId])

  useEffect(() => {
    dispatch(getContractTypes())
    return () => {
      dispatch(resetProjectDataStep(null))
      dispatch(setPersonInChargeProject([]))
      dispatch(
        setKpiRangeDateFilter({
          startDate: null,
          endDate: null,
        })
      )
    }
  }, [])

  useEffect(() => {
    dispatch(
      getPermissionResourceAllocation({ projectId: params.projectId as string })
    )
    dispatch(getPermissionProjectKPI(params.projectId as string))
  }, [])

  useEffect(() => {
    dispatch(
      getBranchList({
        useAllBranches: true,
        moduleConstant: MODULE_PROJECT_CONST,
        subModuleConstant: 1,
      })
    )
  }, [])

  useEffect(() => {
    sessionStorage.setItem('rootProjectTab', activeTab.toString())
  }, [activeTab])

  return (
    <CommonScreenLayout
      useBackPage
      backLabel={i18Project('LB_BACK_TO_PROJECT_LIST')}
      onBack={backToProjectList}
    >
      {loading && <LoadingSkeleton height="600px" />}
      {!loading && (
        <Fragment>
          <Box className={classes.projectDetailHeader}>
            <CommonTabs
              className={classes.tabs}
              configTabs={tabs}
              activeTab={activeTab}
              onClickTab={onTabChange}
            />
            <Box className={classes.boxStatus}>
              <StatusItem
                className={classes.statusItem}
                typeStatus={{
                  ...convertProjectStatus({ id: generalInfo.status }),
                }}
              />
            </Box>
          </Box>
          {!!generalInfo.name && (
            <Box className={classes.projectName}>
              <span className={classes.projectNameTitle}>
                {i18('LB_PROJECT')}:
              </span>
              <span> {generalInfo.name}</span>
            </Box>
          )}
          {activeTab === PROJECT_DASHBOARD_TAB && <ProjectDashboard />}
          {activeTab === PROJECT_RESOURCE_ALLOCATION_TAB && (
            <ResourceAllocationDetail />
          )}
          {activeTab === PROJECT_GENERAL_INFORMATION_TAB && (
            <ProjectGeneralDetail />
          )}
          {activeTab === PROJECT_ACTIVITY_LOG_TAB && (
            <ProjectActivityLog changeRootProjectTab={setActiveTab} />
          )}
        </Fragment>
      )}
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  projectDetailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
  },
  boxStatus: { display: 'flex', alignItems: 'flex-start' },
  statusItem: {
    padding: theme.spacing(1, 2),
  },
  tabs: {
    width: 'max-content !important',
  },
  requestOTBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  projectName: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  projectNameTitle: {
    color: '#205dce',
  },
}))

export default ProjectDetail
