import { projectSelector } from '@/modules/project/reducer/project'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import BugRate from './BugRate/BugRate'
import CustomerSatisfaction from './CustomerSatisfaction/CustomerSatisfaction'
import LeakageRate from './LeakageRate/LeakageRate'

const KPIQualityCSS = () => {
  const classes = useStyles()

  const { permissionProjectKPI } = useSelector(projectSelector)

  return (
    <Box className={classes.RootKPIQualityCSS}>
      {!!permissionProjectKPI.viewSurveySummary && <CustomerSatisfaction />}
      {!!permissionProjectKPI.viewBugRate && <BugRate />}
      {!!permissionProjectKPI.viewLeakageRate && <LeakageRate />}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootKPIQualityCSS: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}))

export default KPIQualityCSS
