import { getTextEllipsis } from '@/utils'
import { Box, Dialog, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../buttons/CommonButton'
import ConditionalRender from '../ConditionalRender'
import CloseIcon from '../icons/CloseIcon'
import LoadingSkeleton from '../loading/LoadingSkeleton'
import Typography from './Typography'

interface ModalProps {
  open: boolean
  title?: any
  width?: number | string
  maxWidth?: number
  isMinWidth?: boolean
  cancelDisabled?: boolean
  submitDisabled?: boolean
  labelSubmit?: string
  cancelOutlined?: boolean
  colorButtonCustom?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined

  colorButtonCustom2?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined

  labelButtonCustom?: string
  labelButtonCustom2?: string
  children: ReactNode
  useButtonCancel?: boolean
  useButtonDontSave?: boolean
  isButtonCustom?: boolean
  isButtonCustom2?: boolean
  className?: string
  useEditMode?: boolean
  onClose?: Function
  onSubmit?: Function
  onSubmitCustom?: Function
  onSubmitCustom2?: Function
  onDontSave?: Function
  colorButtonSubmit?:
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

  hideFooter?: boolean
  isHideButtonClose?: boolean
  loading?: boolean
  isBtnHorizontal?: boolean
  numberEllipsis?: number
  subTitle?: ReactNode
  fontSizeTitle?: number
}

export const showColorModal = (type: string, theme: Theme) => {
  switch (type) {
    case 'error':
      return theme.color.error.primary
    case 'primary':
      return theme.color.blue.primary
    case 'warning':
      return theme.color.orange.primary
    case 'success':
      return theme.color.green.primary
    default:
      return theme.color.blue.primary
  }
}

const Modal = ({
  colorButtonSubmit,
  open,
  title,
  width,
  submitDisabled,
  labelSubmit = '',
  colorButtonCustom,
  colorButtonCustom2,
  labelButtonCustom,
  labelButtonCustom2,
  children,
  onClose,
  onSubmit,
  onSubmitCustom,
  onSubmitCustom2,
  useButtonDontSave,
  isButtonCustom,
  isButtonCustom2,
  onDontSave,
  className,
  maxWidth,
  hideFooter,
  isHideButtonClose,
  colorModal,
  useButtonCancel,
  loading,
  isBtnHorizontal,
  numberEllipsis,
  subTitle,
  fontSizeTitle,
  isMinWidth,
  cancelOutlined,
}: ModalProps) => {
  const classes = useStyles({
    colorButtonSubmit,
    colorButtonCustom,
    colorModal,
    maxWidth,
  })
  const { t: i18 } = useTranslation()

  const handleSubmit = () => {
    !!onSubmit && onSubmit()
  }

  const handleClose = () => {
    !!onClose && onClose()
  }

  return (
    <Dialog
      className={clsx(classes.rootModal, className)}
      open={open}
      onClose={handleClose}
    >
      <Box
        className={clsx(
          classes.modal,
          'modal',
          isMinWidth ? classes.minWidth : ''
        )}
        style={{ width }}
      >
        <Box
          className={clsx(
            subTitle ? classes.modalHeaderWithSubTitle : classes.modalHeader
          )}
        >
          <Box>
            <Typography
              className={classes.title}
              title={title}
              styleProps={{ fontSize: fontSizeTitle }}
            >
              {getTextEllipsis(title, numberEllipsis)}
            </Typography>
            {subTitle && <Box className={classes.mt5}>{subTitle}</Box>}
          </Box>
          {!isHideButtonClose && (
            <CloseIcon
              onClick={() => {
                !!onClose && onClose()
              }}
            />
          )}
        </Box>
        <Box
          className={clsx(classes.modalContent, 'modal-content', 'scrollbar')}
        >
          {loading ? <LoadingSkeleton /> : children}
        </Box>
        <ConditionalRender conditional={!hideFooter}>
          <Box
            className={clsx(
              isBtnHorizontal
                ? classes.modalFooterHorizontal
                : classes.modalFooter
            )}
          >
            {!!useButtonDontSave && (
              <CommonButton
                variant={cancelOutlined ? 'outlined' : 'contained'}
                color="warning"
                className={clsx(classes.btnSubmit, useButtonCancel && 'cancel')}
                disabled={submitDisabled}
                onClick={() => {
                  !!onDontSave && onDontSave()
                }}
              >
                {useButtonCancel ? i18('LB_CANCEL') : i18('LB_DONT_SAVE')}
              </CommonButton>
            )}
            {isButtonCustom2 && (
              <CommonButton
                type="submit"
                className={classes.btnSubmit}
                color={colorButtonCustom2}
                disabled={submitDisabled}
                onClick={() => {
                  !!onSubmitCustom2 && onSubmitCustom2()
                }}
              >
                {labelButtonCustom2}
              </CommonButton>
            )}
            {isButtonCustom && (
              <CommonButton
                type="submit"
                className={classes.btnSubmit}
                color={colorButtonCustom}
                disabled={submitDisabled}
                onClick={() => {
                  !!onSubmitCustom && onSubmitCustom()
                }}
              >
                {labelButtonCustom}
              </CommonButton>
            )}

            <CommonButton
              type="submit"
              className={classes.btnSubmit}
              color={colorButtonSubmit}
              disabled={submitDisabled}
              onClick={handleSubmit}
            >
              {labelSubmit}
            </CommonButton>
          </Box>
        </ConditionalRender>
      </Box>
    </Dialog>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootModal: {
    '& .MuiPaper-root': {
      maxWidth: (props: any) => props.maxWidth,
    },
  },
  minWidth: {
    minWidth: '900px',
  },
  modal: {
    maxHeight: '100%',
    borderRadius: '4px',
    borderTop: (props: any) =>
      `6px solid ${showColorModal(props.colorModal, theme)}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'auto',
  },
  modalHeader: {
    height: theme.spacing(7),
    padding: theme.spacing(0, 1.5, 0, 3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.color.grey.tertiary,
    flexShrink: 0,
  },
  modalHeaderWithSubTitle: {
    height: theme.spacing(8),
    padding: theme.spacing(0, 1.5, 0, 3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.color.grey.tertiary,
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
  modalContent: {
    padding: theme.spacing(2, 3),
    fontSize: `${theme.spacing(2)}`,
    height: 'calc(100% - 120px)',
    overflow: 'auto',
    flex: 1,
  },
  modalFooter: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    background: theme.color.grey.tertiary,
  },
  modalFooterHorizontal: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    background: theme.color.grey.tertiary,
  },
  buttonCancel: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    color: `${theme.color.black.secondary} !important`,
    width: 'max-content',
  },
  btnSubmit: {
    width: 'max-content !important',
    '&.cancel': {
      borderColor: theme.color.black.secondary,
      color: theme.color.black.secondary,
    },
  },
  confirmed: {
    padding: theme.spacing(0, 3, 3, 3),
  },
  mt5: {
    marginTop: '5px',
  },
}))

Modal.defaultProps = {
  width: 600,
  maxWidth: '100vw',
  labelSubmit: 'Submit',
}

export default Modal
