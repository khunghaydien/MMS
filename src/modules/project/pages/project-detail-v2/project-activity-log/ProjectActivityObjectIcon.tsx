import { NS_PROJECT } from '@/const/lang.const'
import { PROJECT_ACTIVITY_LOG_OBJECT_VALUES } from '@/modules/project/const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

const Dot = () => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.99992 6.66668C5.47269 6.66668 6.66659 5.47278 6.66659 4.00001C6.66659 2.52725 5.47269 1.33334 3.99992 1.33334C2.52716 1.33334 1.33325 2.52725 1.33325 4.00001C1.33325 5.47278 2.52716 6.66668 3.99992 6.66668Z"
        fill="white"
      />
    </svg>
  )
}

interface ProjectActivityObjectIconProps {
  object: number
}

const ProjectActivityObjectIcon = ({
  object,
}: ProjectActivityObjectIconProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  switch (object) {
    case PROJECT_ACTIVITY_LOG_OBJECT_VALUES.GENERAL_INFORMATION:
      return (
        <Box className={clsx(classes.object, classes.objectGeneralInformation)}>
          <Dot />
          <Box className={classes.objectName}>
            {i18('TXT_GENERAL_INFORMATION')}
          </Box>
        </Box>
      )
    case PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_CSS:
      return (
        <Box className={clsx(classes.object, classes.objectKPI)}>
          <Dot />
          <Box className={classes.objectName}>{i18Project('TXT_KPI_CSS')}</Box>
        </Box>
      )
    case PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_TIMELINESS:
      return (
        <Box className={clsx(classes.object, classes.objectKPI)}>
          <Dot />
          <Box className={classes.objectName}>
            {i18Project('TXT_KPI_TIMELINESS')}
          </Box>
        </Box>
      )
    case PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_PCV:
      return (
        <Box className={clsx(classes.object, classes.objectKPI)}>
          <Dot />
          <Box className={classes.objectName}>{i18Project('TXT_KPI_PCV')}</Box>
        </Box>
      )
    case PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_BONUS_AND_PENALTY:
      return (
        <Box className={clsx(classes.object, classes.objectKPI)}>
          <Dot />
          <Box className={classes.objectName}>
            {i18Project('TXT_KPI_BONUS_AND_PENALTY')}
          </Box>
        </Box>
      )
    case PROJECT_ACTIVITY_LOG_OBJECT_VALUES.RESOURCE_ALLOCATION:
      return (
        <Box className={clsx(classes.object, classes.objectResourceAllocation)}>
          <Dot />
          <Box className={classes.objectName}>
            {i18Project('TXT_RESOURCE_ALLOCATION')}
          </Box>
        </Box>
      )
    default:
      return <Fragment />
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  object: {
    fontSize: 12,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    padding: theme.spacing(0.5, 1),
    gap: theme.spacing(0.5),
    minWidth: 'max-content',
  },
  objectName: {
    fontWeight: 500,
  },
  objectGeneralInformation: {
    backgroundColor: theme.color.blue.primary,
  },
  objectKPI: {
    backgroundColor: theme.color.violet.primary,
  },
  objectResourceAllocation: {
    backgroundColor: theme.color.green.primary,
  },
}))

export default ProjectActivityObjectIcon
