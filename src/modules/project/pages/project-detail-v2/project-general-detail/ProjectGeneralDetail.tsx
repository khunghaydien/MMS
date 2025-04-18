import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ProjectBasicInformation from './ProjectBasicInformation'
import ProjectToolsInformation from './ProjectToolsInformation'

const ProjectGeneralDetail = () => {
  const classes = useStyles()

  return (
    <Box className={classes.RootProjectGeneralDetail}>
      <ProjectBasicInformation />
      <ProjectToolsInformation />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectGeneralDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  flex24: {
    display: 'flex',
    gap: theme.spacing(3),
  },
}))

export default ProjectGeneralDetail
