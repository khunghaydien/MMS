import noDataImg from '@/ui/images/no-data.png'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

interface IProps {
  subTitle?: string
  className?: string
}
const NoData = ({ subTitle, className }: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  return (
    <Box className={clsx(classes.rootNoData, className)}>
      <img className={classes.noDataImg} src={noDataImg} />
      <Box className={classes.title}>{i18('MSG_NO_DATA')}</Box>
      {!!subTitle && <Box className={classes.subTitle}>{subTitle}</Box>}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootNoData: {
    width: '100%',
    height: '240px',
    minHeight: theme.spacing(30),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    rowGap: theme.spacing(1),
  },
  noDataImg: {
    width: '180px',
  },
  title: {
    fontWeight: 300,
    fontSize: 21,
    color: theme.color.black.secondary,
  },
  subTitle: {
    fontSize: theme.spacing(2),
    color: theme.color.black.tertiary,
  },
}))

export default NoData
