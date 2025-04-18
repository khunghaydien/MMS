import CommonButton from '@/components/buttons/CommonButton'
import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import { NS_DASHBOARD } from '@/const/lang.const'
import { dashboardSelector } from '@/modules/dashboard/reducer/dashboard'
import ProjectAllocationService from '@/modules/dashboard/services/projectAllocation.service'
import { alertError, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { downloadFileFromByteArr } from '@/utils'
import { CloudDownload } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ProjectAllocationStaff from './ProjectAllocationStaff'
import ProjectAllocationSummaryTable from './ProjectAllocationSummaryTable'

const ProjectAllocationSummary = ({}) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Dashboard } = useTranslation(NS_DASHBOARD)

  const {
    dataProjectAllocationStaff,
    dataProjectAllocationSummary,
    projectAllocationQueries,
  } = useSelector(dashboardSelector)

  const exportProjectAllocation = () => {
    dispatch(updateLoading(true))
    const startDate = projectAllocationQueries.startDate || {
      getMonth: () => 0,
      getFullYear: () => 0,
    }
    const endDate = projectAllocationQueries.endDate || {
      getMonth: () => 0,
      getFullYear: () => 0,
    }
    const queries = {
      divisionIds: projectAllocationQueries.divisionIds,
      startMonth: startDate.getMonth() + 1,
      endMonth: endDate.getMonth() + 1,
      startYear: startDate.getFullYear(),
      endYear: endDate.getFullYear(),
      status: projectAllocationQueries.status,
    }
    ProjectAllocationService.exportProjectAllocation(queries)
      .then((res: AxiosResponse) => {
        downloadFileFromByteArr(res.data)
      })
      .catch(() => {
        dispatch(
          alertError({
            message: i18('MSG_COMMON_ERROR_ALERT'),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <CardFormSeeMore
      hideSeeMore
      className={classes.RootBusyRate}
      title={i18Dashboard('TXT_SUMMARY')}
      CustomButton={
        <CommonButton
          lowercase
          variant="outlined"
          disabled={
            dataProjectAllocationStaff.loading ||
            dataProjectAllocationSummary.loading
          }
          startIcon={<CloudDownload />}
          onClick={exportProjectAllocation}
        >
          {i18('TXT_EXPORT')}
        </CommonButton>
      }
    >
      <Box className={classes.body}>
        <ProjectAllocationSummaryTable />
        <ProjectAllocationStaff />
      </Box>
    </CardFormSeeMore>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootBusyRate: {
    marginTop: theme.spacing(3),
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}))

export default ProjectAllocationSummary
