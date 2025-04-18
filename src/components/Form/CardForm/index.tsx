import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactNode } from 'react'
import CardFormActions from './CardFormActions'

interface PropTypes {
  title: string
  required?: boolean
  padding?: number
  children?: ReactNode
  childrenEndHead?: ReactNode
  className?: string
  classNameTitle?: string
  isLoading?: boolean
  useDetailEditMode?: boolean
  buttonUseDetailEditDisabled?: boolean
  useDetailViewMode?: boolean
  useDeleteIcon?: boolean
  titleIcon?: any
  hideCardForm?: boolean
  onSaveAs?: () => void
  onCancelEditMode?: () => void
  onOpenEditMode?: () => void
  onDeleteIconClick?: () => void
  onTitleIconClick?: () => void
}

function CardForm(props: PropTypes) {
  const {
    title,
    required,
    padding,
    children,
    childrenEndHead,
    classNameTitle,
    className,
    isLoading = false,
    useDetailEditMode,
    buttonUseDetailEditDisabled,
    useDetailViewMode,
    onSaveAs,
    onCancelEditMode,
    onOpenEditMode,
    useDeleteIcon,
    onDeleteIconClick,
    titleIcon,
    onTitleIconClick,
    hideCardForm = false,
  } = props
  const classes = useStyles()

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

  const handleTitleIconClick = () => {
    !!onTitleIconClick && onTitleIconClick()
  }

  return (
    <Box
      className={clsx(
        classes.wrapper,
        className,
        hideCardForm && 'hidden-card-form'
      )}
      style={{ padding }}
    >
      {!hideCardForm && (
        <Box className={clsx(classes.formTitle, classNameTitle)}>
          <Box className={classes.titleBox}>
            <Box className={clsx(classes.title, 'title')}>
              <Box
                dangerouslySetInnerHTML={{
                  __html: title,
                }}
              />
              {required && <span className={clsx(classes.mark)}>*</span>}
            </Box>
            {!!titleIcon && (
              <Box className={classes.iconBox} onClick={handleTitleIconClick}>
                {titleIcon}
              </Box>
            )}
          </Box>
          <CardFormActions
            useDeleteIcon={useDeleteIcon}
            useDetailEditMode={useDetailEditMode}
            buttonUseDetailEditDisabled={buttonUseDetailEditDisabled}
            useDetailViewMode={useDetailViewMode}
            onSaveAs={handleSaveAs}
            onCancelEditMode={handleCancelEditMode}
            onOpenEditMode={handleOpenEditMode}
            onDeleteIconClick={handleDeleteIconClick}
          />
          <>{childrenEndHead}</>
        </Box>
      )}
      {isLoading ? <LoadingSkeleton /> : children}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: theme.spacing(3),
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: theme.spacing(0.5),
    '&:not(:first-child)': {
      marginTop: theme.spacing(3),
    },
    position: 'relative',
    '&.hidden-card-form': {
      border: 'none',
      padding: 0,
    },
  },
  formTitle: {
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(0.5),
    color: theme.color.black.primary,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    background: theme.color.grey.tertiary,
  },
  titleBox: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
  iconBox: {
    '& svg': {
      cursor: 'pointer',
    },
    '& svg:hover': {
      color: theme.color.blue.primary,
    },
  },
  mark: {
    color: theme.color.error.secondary,
    marginLeft: theme.spacing(0.5),
  },
}))

export default CardForm
