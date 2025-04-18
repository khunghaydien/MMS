import BackIcon from '@/components/icons/BackIcon'
import { LangConstant } from '@/const'
import {
  projectSelector,
  setKpiDetailMenu,
  setProjectDashboardScreenDetail,
} from '@/modules/project/reducer/project'
import { ProjectState } from '@/modules/project/types'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import KPIBonusAndPenalty from './KPIBonusAndPenalty/KPIBonusAndPenalty'
import KPICost from './KPICost/KPICost'
import KPIDelivery from './KPIDelivery/KPIDelivery'
import KPIInformationCategories from './KPIInformationCategories'
import KPIProcess from './KPIProcess/KPIProcess'
import KPIQualityCSS from './KPIQualityCSS/KPIQualityCSS'

const ProjectKPIInformationDetail = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { kpiDetailMenu }: ProjectState = useSelector(projectSelector)

  const onBackScreen = () => {
    sessionStorage.setItem('kpiDetailMenu', 'quality')
    sessionStorage.setItem(
      'projectDashboardScreenDetail',
      'KPI_INFORMATION_TABLE'
    )
    dispatch(setKpiDetailMenu('quality'))
    dispatch(setProjectDashboardScreenDetail('KPI_INFORMATION_TABLE'))
  }

  useEffect(() => {
    sessionStorage.setItem('kpiDetailMenu', kpiDetailMenu)
  }, [kpiDetailMenu])

  return (
    <Box className={classes.RootProjectKPIInformationDetail}>
      <BackIcon
        onClick={onBackScreen}
        label={i18Project('TXT_KPI_INFORMATION')}
      />
      <Box className={classes.kpiInformationMain}>
        <KPIInformationCategories />
        <Box className={classes.rightContent} id="kpi-right-content">
          {kpiDetailMenu === 'quality' && <KPIQualityCSS />}
          {kpiDetailMenu === 'cost' && <KPICost />}
          {kpiDetailMenu === 'delivery' && <KPIDelivery />}
          {kpiDetailMenu === 'process' && <KPIProcess />}
          {kpiDetailMenu === 'plusAndMinus' && <KPIBonusAndPenalty />}
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectKPIInformationDetail: {},
  kpiInformationMain: {
    display: 'flex',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  rightContent: {
    width: 'calc(100% - 110px)',
  },
}))

export default ProjectKPIInformationDetail
