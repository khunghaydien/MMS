import { AppConstant } from '@/const'
import {
  Alert,
  AlertTitle,
  Snackbar,
  Typography,
  useTheme,
} from '@mui/material'
import { MutableRefObject, useEffect } from 'react'

interface CommonAlertProps {
  isShow: boolean
  isAutoClose: boolean
  type: any
  message: string
  title: string
  anchorOrigin: any
  showAlertTimeout: MutableRefObject<NodeJS.Timeout | null>
  onClose: () => void
}

const CommonAlert = ({
  isShow,
  type,
  onClose,
  anchorOrigin,
  message,
  isAutoClose,
  showAlertTimeout,
  title,
}: CommonAlertProps) => {
  const theme = useTheme()
  useEffect(() => {
    return () => {
      clearTimeout(showAlertTimeout.current as NodeJS.Timeout)
    }
  }, [])
  return (
    <Snackbar
      open={isShow}
      autoHideDuration={isAutoClose ? AppConstant.SNACK_BAR_DURATION : null}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        variant="filled"
        severity={type}
        style={{ zIndex: theme.zIndex.appBar + 100 }}
      >
        {title && <AlertTitle color="inherit">{title}</AlertTitle>}
        <Typography
          sx={{
            maxWidth: 300,
            wordBreak: 'break-word',
          }}
          variant="body2"
          component="p"
          color="inherit"
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        />
      </Alert>
    </Snackbar>
  )
}

export default CommonAlert
