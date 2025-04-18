import CommonTabs from '@/components/tabs'
import { NS_DASHBOARD } from '@/const/lang.const'
import {
  getBranchDashboardList,
  getSystemDashboardDivisions,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { Analytics, PeopleAlt, Star } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import ProjectAllocation from './components/dashboard-project-allocation/ProjectAllocation'
import StaffAllocation from './components/dashboard-staff-allocation/StaffAllocation'
import KPIMetric from './components/dashboard-kpi-metric/KPIMetric'
import { MODULE_STAFF_CONST, SUB_MODULE_STAFF_FILTER } from '@/const/app.const'

const STAFF_ALLOCATION = 1
const PROJECT_ALLOCATION = 2
const KPI_METRIC = 3

const ModuleDashboard = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Dashboard } = useTranslation(NS_DASHBOARD)

  const [activeTab, setActiveTab] = useState(
    +(sessionStorage.getItem('dashboardTab') || '') || STAFF_ALLOCATION
  )

  const tabs = [
    {
      step: STAFF_ALLOCATION,
      label: i18Dashboard('TXT_STAFF_ALLOCATION'),
      icon: <PeopleAlt />,
    },
    {
      step: PROJECT_ALLOCATION,
      label: i18Dashboard('TXT_PROJECT_ALLOCATION'),
      icon: <Analytics />,
    },
    {
      step: KPI_METRIC,
      label: i18Dashboard('TXT_KPI_METRIC'),
      icon: <Star />,
    },
  ]

  const onTabChange = (value: number) => {
    setActiveTab(value)
  }

  useEffect(() => {
    sessionStorage.setItem('dashboardTab', activeTab.toString())
  }, [activeTab])

  useEffect(() => {
    dispatch(getSystemDashboardDivisions())
    dispatch(
      getBranchDashboardList({
        moduleConstant: MODULE_STAFF_CONST,
        subModuleConstant: SUB_MODULE_STAFF_FILTER,
      })
    )
    return () => {
      sessionStorage.removeItem('dashboardTab')
    }
  }, [])

  return (
    <Box>
      <CommonTabs
        activeTab={activeTab}
        configTabs={tabs}
        onClickTab={onTabChange}
      />
      <Box className={classes.features}>
        {activeTab === STAFF_ALLOCATION && <StaffAllocation />}
        {activeTab === PROJECT_ALLOCATION && <ProjectAllocation />}
        {activeTab === KPI_METRIC && <KPIMetric />}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  features: {
    padding: theme.spacing(0, 3, 3, 3),
  },
}))

export default ModuleDashboard
