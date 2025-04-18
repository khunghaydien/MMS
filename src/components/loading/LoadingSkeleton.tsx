import { cleanObject } from '@/utils'
import { Box, CircularProgress, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import './loading.scss'

interface LoadingSkeletonProps {
  height?: string | number
  usePositionAbsolute?: boolean
}

const LoadingSkeleton = ({
  height,
  usePositionAbsolute = false,
}: LoadingSkeletonProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const sx = {
    ...cleanObject({ height: height ? `${height} !important` : null }),
    position: usePositionAbsolute ? 'absolute' : null,
    top: usePositionAbsolute ? 0 : null,
    left: usePositionAbsolute ? 0 : null,
  }

  return (
    <Box className="root-loading-skeleton" sx={sx}>
      <Box className={classes.loadingCircle}>
        <CircularProgress color="inherit" />
        <Box>{i18('MSG_LOADING_DATA')}</Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  loadingCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontWeight: 700,
    gap: theme.spacing(2),
  },
}))

export default LoadingSkeleton
