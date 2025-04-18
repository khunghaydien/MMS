import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Modal from '../common/Modal'
import Typography from '../common/Typography'

interface ModalDeleteRecordsProps {
  titleMessage: string
  subMessage: string
  open: boolean
  labelSubmit?: any
  onClose: () => void
  onReview?: () => void
  onSubmit: (id?: any) => void
  isReviewButton?: boolean
  labelButtonCustom?: string
}

const ModalDeleteRecords = ({
  open,
  onClose,
  labelSubmit,
  onSubmit,
  onReview,
  titleMessage,
  subMessage,
  isReviewButton,
  labelButtonCustom,
}: ModalDeleteRecordsProps) => {
  const classes = useStyles()

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    handleClose()
    onSubmit()
  }

  const handleReview = () => {
    if (onReview) onReview()
  }
  return (
    <Modal
      open={open}
      title={titleMessage}
      labelSubmit={labelSubmit || 'Delete'}
      colorModal="error"
      onClose={handleClose}
      onSubmit={handleSubmit}
      isButtonCustom={isReviewButton}
      labelButtonCustom={labelButtonCustom}
      onSubmitCustom={handleReview}
    >
      <Box className={classes.foreground}>
        <Typography className={classes.description}>{subMessage}</Typography>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    fontSize: '16px !important',
    wordBreak: 'break-word',
  },
  foreground: {
    background: theme.color.black.porcelain,
    padding: theme.spacing(2, 3),
  },
  confirmed: {
    marginTop: theme.spacing(2),
  },
}))

export default ModalDeleteRecords
