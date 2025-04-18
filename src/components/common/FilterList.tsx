import FilterListIcon from '@mui/icons-material/FilterList'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../buttons/CommonButton'
import CloseIcon from '../icons/CloseIcon'

interface FilterListProps {
  className?: string
  children: ReactElement
  title: string
  submitDisabled?: boolean
  clearDisabled?: boolean
  onSubmit: () => void
  onClear?: () => void
  onToggleFilter?: (isOpen: boolean) => void
  width?: string | number
  useScroll?: boolean
}

const FilterList = ({
  title = 'Filter List',
  className,
  children,
  submitDisabled,
  clearDisabled,
  onSubmit,
  onClear,
  onToggleFilter,
  width,
  useScroll = false,
}: FilterListProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const [isShowFilter, setIsShowFilter] = useState(false)

  const handleToggleShowFilter = () => {
    setIsShowFilter(!isShowFilter)
    !!onToggleFilter && onToggleFilter(!isShowFilter)
  }

  const handleSubmit = () => {
    handleToggleShowFilter()
    onSubmit()
  }

  const handleClear = () => {
    !!onClear && onClear()
  }

  return (
    <Box className={clsx(classes.rootFilterList, 'center-root', className)}>
      <FilterListIcon
        className={classes.icon}
        onClick={handleToggleShowFilter}
      />
      <Box
        className={clsx(classes.filter, isShowFilter && classes.show)}
        sx={{ width }}
      >
        <Box className={classes.filterHeader}>
          <Box className={classes.title}>{title}</Box>
          <CloseIcon onClick={handleToggleShowFilter} />
        </Box>
        <Box
          className={clsx(
            classes.filterBody,
            useScroll && classes.scrollBody + ' scrollbar'
          )}
        >
          {children}
        </Box>
        <Box className={classes.filterFooter}>
          <CommonButton
            disabled={clearDisabled}
            width={50}
            color="error"
            onClick={handleClear}
          >
            {i18('LB_CLEAR')}
          </CommonButton>
          <CommonButton
            disabled={submitDisabled}
            width={60}
            onClick={handleSubmit}
          >
            {i18('LB_FILTER')}
          </CommonButton>
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootFilterList: {},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    cursor: 'pointer',
    color: theme.color.black.secondary,
  },
  filter: {
    background: '#ffffff',
    height: '100vh',
    position: 'fixed',
    zIndex: 3,
    top: 0,
    right: 0,
    borderLeft: `1px solid ${theme.color.grey.secondary}`,
    transform: 'translateX(100%)',
    transition: '0.2s',
    boxShadow: '1px 1px 5px',
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
  },
  filterBody: {
    padding: theme.spacing(2, 2, 0, 2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  scrollBody: {
    height: 'calc(100vh - 125px)',
    overflowY: 'auto',
  },
  filterFooter: {
    padding: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(2),
  },
  show: {
    width: 400,
    transition: '0.2s',
    transform: 'translateX(0%)',
    overflow: 'auto',
  },
}))

export default FilterList
