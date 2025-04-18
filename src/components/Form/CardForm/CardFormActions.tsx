import ConditionalRender from '@/components/ConditionalRender'
import DeleteIcon from '@/components/icons/DeleteIcon'
import { BorderColor, ExitToApp, SaveAs } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

interface CardFormActionsProps {
  useDetailEditMode?: boolean
  buttonUseDetailEditDisabled?: boolean
  useDetailViewMode?: boolean
  useDeleteIcon?: boolean
  useDetailCreateMode?: boolean
  onSaveAs?: () => void
  onCancelEditMode?: () => void
  onOpenEditMode?: () => void
  onDeleteIconClick?: () => void
  onCreateClick?: () => void
  isApproved?: boolean
}

const CardFormActions = ({
  buttonUseDetailEditDisabled,
  useDetailEditMode,
  useDetailViewMode,
  useDeleteIcon,
  onDeleteIconClick,
  onSaveAs,
  onCancelEditMode,
  onOpenEditMode,
  useDetailCreateMode,
  onCreateClick,
  isApproved,
}: CardFormActionsProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const handleSaveAs = () => {
    !!onSaveAs && onSaveAs()
  }

  const handleCancelEditMode = () => {
    !!onCancelEditMode && onCancelEditMode()
  }

  const handleOpenEditMode = () => {
    !!onOpenEditMode && onOpenEditMode()
  }

  const handleDeleteIconClick = () => {
    !!onDeleteIconClick && onDeleteIconClick()
  }

  const handleAddClick = () => {
    !!onCreateClick && onCreateClick()
  }
  return (
    <>
      {!isApproved && (
        <Box className={classes.cardFormActions}>
          <ConditionalRender conditional={!!useDetailEditMode}>
            <Fragment>
              <Box
                className={classes.buttonWrapper}
                onClick={handleCancelEditMode}
              >
                <ExitToApp />
                <Box>{i18('LB_CANCEL')}</Box>
              </Box>
              <Box
                className={clsx(
                  classes.buttonWrapper,
                  buttonUseDetailEditDisabled && 'disabled'
                )}
                onClick={handleSaveAs}
              >
                <SaveAs
                  className={clsx(
                    classes.buttonIcon,
                    buttonUseDetailEditDisabled ? 'disabled' : 'active'
                  )}
                />
                <Box
                  className={clsx(
                    classes.label,
                    buttonUseDetailEditDisabled ? 'disabled' : 'active'
                  )}
                >
                  {i18('LB_SAVE')}
                </Box>
              </Box>
            </Fragment>
          </ConditionalRender>
          <ConditionalRender conditional={!!useDetailCreateMode}>
            <Fragment>
              <Box className={classes.buttonWrapper} onClick={handleAddClick}>
                <SaveAs className={clsx(classes.buttonIcon, 'active')} />
                <Box className={clsx(classes.label, 'active')}>
                  {i18('LB_SAVE')}
                </Box>
              </Box>
              <Box
                className={clsx(classes.buttonWrapper, 'delete')}
                onClick={handleDeleteIconClick}
              >
                <DeleteIcon />
                <Box>{i18('LB_DELETE')}</Box>
              </Box>
            </Fragment>
          </ConditionalRender>
          <ConditionalRender conditional={!!useDetailViewMode}>
            <Box className={classes.buttonWrapper} onClick={handleOpenEditMode}>
              <BorderColor />
              <Box>{i18('LB_EDIT')}</Box>
            </Box>
          </ConditionalRender>
          <ConditionalRender conditional={!!useDeleteIcon}>
            <Box
              className={clsx(classes.buttonWrapper, 'delete')}
              onClick={handleDeleteIconClick}
            >
              <DeleteIcon />
              <Box>{i18('LB_DELETE')}</Box>
            </Box>
          </ConditionalRender>
        </Box>
      )}
    </>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonIcon: {
    cursor: 'pointer',
    '&.disabled': {
      pointerEvents: 'none',
    },
    '&.active': {
      color: theme.color.blue.primary,
    },
  },
  cardFormActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  buttonWrapper: {
    fontWeight: 700,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '50px',
    background: '#FFFFFF',
    cursor: 'pointer',
    color: theme.color.black.secondary,
    transition: 'all .1s',
    '&.disabled': {
      pointerEvents: 'none',
    },
    '& svg': {
      fontSize: 20,
    },
    '&:hover': {
      backgroundColor: theme.color.blue.primary,
      borderColor: theme.color.blue.primary,
      color: '#FFFFFF !important',
      '& *': {
        color: '#FFFFFF !important',
      },
    },
    '&.delete:hover': {
      backgroundColor: theme.color.error.primary,
      borderColor: theme.color.error.primary,
    },
  },
  label: {
    '&.active': {
      color: theme.color.blue.primary,
    },
  },
}))

export default CardFormActions
