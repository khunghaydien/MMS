import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import NoData from '../common/NoData'

interface SelectSingleToggleProps {
  field?: string
  label?: string | null
  listOptions: OptionItem[]
  value: string | number
  className?: string
  backgroundWhite?: boolean
  unToggle?: boolean
  onChange: (payload: {
    value: string | number
    option: OptionItem
    field: string
  }) => void
}

const SelectSingleToggle = ({
  label,
  listOptions,
  value,
  onChange,
  className,
  backgroundWhite,
  field,
  unToggle,
}: SelectSingleToggleProps) => {
  const classes = useStyles()

  const onChooseValue = (id: string | number) => {
    if (unToggle && value === id) return
    onChange({
      field: field || '',
      value: value != id ? id : '',
      option: listOptions.find(option => option.id === id) as OptionItem,
    })
  }

  return (
    <Box
      className={clsx(
        classes.RootSelectSingleToggle,
        backgroundWhite && classes.backgroundWhite,
        className
      )}
    >
      <Box className={classes.label}>{label}</Box>
      {listOptions.length ? (
        <Box className={classes.listOptions}>
          {listOptions?.map(option => (
            <Box
              key={option.value}
              className={clsx(classes.option, value == option.id && 'active')}
              onClick={() => onChooseValue(option.id || '')}
            >
              {option.label}
            </Box>
          ))}
        </Box>
      ) : (
        <NoData className={classes.noData} />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootSelectSingleToggle: {
    padding: theme.spacing(2),
    background: theme.color.blue.six,
    borderRadius: theme.spacing(1),
  },
  backgroundWhite: {
    background: theme.color.white,
  },
  label: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    fontSize: 14,
  },
  listOptions: {
    display: 'flex',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
  },
  option: {
    cursor: 'pointer',
    borderRadius: '4px',
    color: theme.color.black.tertiary,
    border: `1px solid ${theme.color.black.tertiary}`,
    padding: theme.spacing(0.5, 1),
    width: 'max-content',
    background: '#fff',
    fontSize: 12,
    userSelect: 'none',
    '&:hover': {
      color: theme.color.black.secondary,
      border: `1px solid ${theme.color.black.secondary}`,
    },
    '&.active': {
      color: theme.color.blue.primary,
      border: `1px solid ${theme.color.blue.primary}`,
      fontWeight: 500,
    },
  },
  noData: {
    height: 100,
    minHeight: 100,
  },
}))

export default SelectSingleToggle
