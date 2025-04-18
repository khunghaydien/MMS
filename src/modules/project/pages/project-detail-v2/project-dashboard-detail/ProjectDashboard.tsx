import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import { projectSelector } from '../../../reducer/project'
import { ProjectState } from '../../../types'
import ProjectKPIInformationDetail from '../project-kpi-information/ProjectKPIInformationDetail'
import ProjectKPIInformationTable from './ProjectKPIInformationTable'

const ProjectDashboard = () => {
  const classes = useStyles()
  const {
    projectDashboardScreenDetail: screenDetail,
    permissionProjectKPI,
  }: ProjectState = useSelector(projectSelector)

  return (
    <Grid
      className={classes.RootProjectDashboard}
      container
      rowSpacing={2}
      columnSpacing={2}
    >
      {screenDetail === 'KPI_INFORMATION_TABLE' &&
        !!permissionProjectKPI.viewKPISummary && (
          <Grid item xs={12}>
            <ProjectKPIInformationTable />
          </Grid>
        )}
      {screenDetail === 'KPI_INFORMATION' && (
        <Grid item xs={12}>
          <ProjectKPIInformationDetail />
        </Grid>
      )}
    </Grid>
  )
}

const useStyles = makeStyles(() => ({
  RootProjectDashboard: {},
}))

export default ProjectDashboard
