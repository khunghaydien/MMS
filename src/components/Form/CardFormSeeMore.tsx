import { KeyboardDoubleArrowRight } from '@mui/icons-material'
import { Box, Paper, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../buttons/CommonButton'

interface CardFormSeeMoreProps {
  title?: string | null
  onSeeMore?: () => void
  children: any
  className?: string
  hideSeeMore?: boolean
  hideHeader?: boolean
  CustomButton?: ReactElement
}

const CardFormSeeMore = ({
  title,
  onSeeMore,
  children,
  className,
  hideSeeMore,
  hideHeader,
  CustomButton,
}: CardFormSeeMoreProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const seeMore = () => {
    !!onSeeMore && onSeeMore()
  }

  return (
    <Paper
      elevation={2}
      className={clsx(classes.RootCardFormSeeMore, className)}
    >
      {!hideHeader && (
        <Box className={classes.header}>
          <Box className={classes.title}>{title}</Box>
          {!hideSeeMore && (
            <CommonButton
              lowercase
              className={classes.seeMore}
              variant="outlined"
              onClick={seeMore}
              endIcon={<KeyboardDoubleArrowRight />}
            >
              {i18('LB_SEE_MORE')}
            </CommonButton>
          )}
          {!!CustomButton && CustomButton}
        </Box>
      )}
      <Box className={classes.body}>{children}</Box>
    </Paper>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootCardFormSeeMore: {
    width: '100%',
    borderRadius: 0,
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
  seeMore: {
    borderRadius: '20px !important',
  },
}))

export default CardFormSeeMore
