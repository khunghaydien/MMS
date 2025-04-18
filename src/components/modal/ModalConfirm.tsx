import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import InputErrorMessage from '../common/InputErrorMessage'
import Modal from '../common/Modal'
import Typography from '../common/Typography'

interface ModalConfirmProps {
  open: boolean
  title: string
  description: string
  useNextStep?: boolean
  cancelDisabled?: boolean
  titleSubmit?: string | null
  labelButtonCustom?: string
  isButtonCustom?: boolean
  isHideButtonClose?: boolean
  isLabelCancel?: boolean
  colorButtonSubmit?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined
  colorButtonCustom?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined
  colorModal?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined
  onClose?: () => void
  onSubmit: () => void
  onDontSave?: () => void
  onSubmitCustom?: () => void
  warning?: string
  cancelOutlined?: boolean
}

const ModalConfirm = ({
  open,
  title,
  description,
  useNextStep,
  titleSubmit = 'Submit',
  labelButtonCustom,
  cancelDisabled = false,
  isButtonCustom = false,
  isHideButtonClose = false,
  colorButtonSubmit = 'primary',
  colorButtonCustom = 'primary',
  colorModal = 'primary',
  isLabelCancel = false,
  onClose,
  onSubmit,
  onDontSave,
  onSubmitCustom,
  warning,
  cancelOutlined,
}: ModalConfirmProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const handleClose = () => {
    !!onClose && onClose()
  }

  const handleSubmit = () => {
    handleClose()
    onSubmit()
  }

  const handleDontSave = () => {
    handleClose()
    !!onDontSave && onDontSave()
  }

  return (
    <Modal
      open={open}
      title={title}
      labelSubmit={
        (useNextStep
          ? titleSubmit
            ? titleSubmit
            : i18('LB_SAVE_CHANGES')
          : titleSubmit
          ? titleSubmit
          : i18('LB_SUBMIT')) || ''
      }
      isHideButtonClose={isHideButtonClose}
      labelButtonCustom={labelButtonCustom}
      isButtonCustom={isButtonCustom}
      useButtonCancel={isLabelCancel}
      useButtonDontSave={useNextStep}
      cancelDisabled={cancelDisabled}
      colorButtonSubmit={colorButtonSubmit}
      colorButtonCustom={colorButtonCustom}
      colorModal={colorModal}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onDontSave={handleDontSave}
      onSubmitCustom={onSubmitCustom}
      cancelOutlined={cancelOutlined}
    >
      <Box>
        <Box className={classes.foreground}>
          <Typography className={classes.description}>{description}</Typography>
        </Box>
        {!!warning && (
          <InputErrorMessage className={classes.warning} content={warning} />
        )}
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    fontSize: '16px !important',
  },
  foreground: {
    background: theme.color.black.porcelain,
    padding: theme.spacing(2, 3),
  },
  confirmed: {
    marginTop: theme.spacing(2),
  },
  warning: {
    marginTop: theme.spacing(1),
  },
}))

export default ModalConfirm
