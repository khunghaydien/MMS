import ConditionalRender from '@/components/ConditionalRender'
import DeleteIcon from '@/components/icons/DeleteIcon'
import { BorderColor, ExitToApp, SaveAs } from '@mui/icons-material'
import { Box, Paper, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

interface CardFormEditProps {
  useDetailEditMode?: boolean
  buttonUseDetailEditDisabled?: boolean
  useDetailViewMode?: boolean
  useDeleteMode?: boolean
  className?: string
  children?: any
  title?: string | undefined
  hideBorder?: boolean
  hideButtonCancel?: boolean
  hideIcons?: boolean
  onSaveAs?: () => void
  onCancelEditMode?: () => void
  onOpenEditMode?: () => void
  onOpenDeleteMode?: () => void
}

const CardFormEdit = ({
  buttonUseDetailEditDisabled = true,
  useDetailEditMode,
  useDetailViewMode,
  onSaveAs,
  onCancelEditMode,
  onOpenEditMode,
  className,
  children,
  title,
  hideBorder,
  useDeleteMode,
  onOpenDeleteMode,
  hideButtonCancel,
  hideIcons,
}: CardFormEditProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const saveAs = () => {
    !!onSaveAs && onSaveAs()
  }

  const cancelEditMode = () => {
    !!onCancelEditMode && onCancelEditMode()
  }

  const openEditMode = () => {
    !!onOpenEditMode && onOpenEditMode()
  }

  const openDeleteMode = () => {
    !!onOpenDeleteMode && onOpenDeleteMode()
  }

  return (
    <Paper
      elevation={2}
      className={clsx(
        classes.RootCardFormEdit,
        className,
        hideBorder && 'hideBorder'
      )}
    >
      <Box className={clsx(classes.header, 'header')}>
        <Box className={classes.title}>{title}</Box>
        <Box className={clsx(classes.actions, !useDetailViewMode && 'reverse')}>
          <ConditionalRender conditional={!!useDetailEditMode}>
            <Fragment>
              <Box
                className={clsx(
                  classes.buttonWrapper,
                  buttonUseDetailEditDisabled && 'disabled'
                )}
                onClick={saveAs}
              >
                {!hideIcons && <SaveAs />}
                <Box className={classes.label}>{i18('LB_SUBMIT')}</Box>
              </Box>
              {!hideButtonCancel && (
                <Box
                  className={clsx(classes.buttonWrapper, 'cancel')}
                  onClick={cancelEditMode}
                >
                  {!hideIcons && <ExitToApp />}
                  <Box className={classes.label}>{i18('LB_CANCEL')}</Box>
                </Box>
              )}
            </Fragment>
          </ConditionalRender>
          <ConditionalRender conditional={!!useDetailViewMode}>
            <Box className={classes.buttonWrapper} onClick={openEditMode}>
              {!hideIcons && <BorderColor />}
              <Box className={classes.label}>{i18('LB_EDIT')}</Box>
            </Box>
          </ConditionalRender>
          <ConditionalRender conditional={!!useDeleteMode}>
            <Box
              className={clsx(classes.buttonWrapper, 'delete')}
              onClick={openDeleteMode}
            >
              {!hideIcons && <DeleteIcon />}
              <Box className={classes.label}>{i18('LB_DELETE')}</Box>
            </Box>
          </ConditionalRender>
        </Box>
      </Box>
      <Box className={clsx(classes.body, 'body')}>{children}</Box>
    </Paper>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootCardFormEdit: {
    width: '100%',
    borderRadius: 0,

    '&.hideBorder': {
      border: 'none',
      boxShadow: 'none',
      width: 'max-content',
      '& .header': {
        padding: 0,
        minHeight: '0',
        borderBottom: 'none',
        display: 'inline-block',
      },
      '& .body': {
        display: 'none',
      },
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottom: `1px solid ${theme.color.grey.grayE}`,
    minHeight: '65px',
  },
  title: { fontSize: 18, fontWeight: 700, color: theme.color.blue.primary },
  body: {
    padding: 16,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&.reverse': {
      flexDirection: 'row-reverse',
    },
  },
  buttonWrapper: {
    fontWeight: 700,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    border: `1px solid ${theme.color.blue.primary}`,
    borderRadius: '50px',
    background: '#FFFFFF',
    cursor: 'pointer',
    color: theme.color.black.secondary,
    transition: 'all .1s',
    '&.cancel': {
      border: `1px solid ${theme.color.black.tertiary}`,
      '& svg, & div': {
        color: theme.color.black.tertiary,
      },
    },
    '&.delete': {
      borderColor: theme.color.error.primary,
      '& *': {
        color: theme.color.error.primary,
      },
    },
    '&.disabled': {
      pointerEvents: 'none',
      borderColor: theme.color.grey.primary,
      '& *': {
        color: theme.color.grey.primary,
      },
    },
    '& svg': {
      fontSize: 20,
      color: theme.color.blue.primary,
    },
    '&:hover': {
      backgroundColor: theme.color.blue.primary,
      borderColor: theme.color.blue.primary,
      color: '#FFFFFF !important',
      '& *': {
        color: '#FFFFFF !important',
      },
    },
  },
  label: {
    color: theme.color.blue.primary,
  },
}))

export default CardFormEdit
