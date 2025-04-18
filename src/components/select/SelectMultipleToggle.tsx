import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

interface SelectMultipleToggleProps {
  disabled?: boolean
  label?: string | null
  listOptions: OptionItem[]
  listIdActivated: string[] | number[]
  className?: string
  backgroundWhite?: boolean
  onChange: (payload: {
    listIdActivated: string[] | number[]
    option: OptionItem
  }) => void
}

const SelectMultipleToggle = ({
  label,
  listOptions,
  listIdActivated,
  onChange,
  className,
  backgroundWhite,
  disabled,
}: SelectMultipleToggleProps) => {
  const classes = useStyles()

  const onChooseValue = (id: string | number) => {
    const newListIdActived = [...listIdActivated] as string[] | number[]
    // @ts-ignore
    if (listIdActivated.includes(id)) {
      const indexById = listIdActivated.findIndex(_id => _id === id)
      newListIdActived.splice(indexById, 1)
    } else {
      // @ts-ignore
      newListIdActived.push(id)
    }
    onChange({
      listIdActivated: newListIdActived,
      option: listOptions.find(option => option.id === id) as OptionItem,
    })
  }

  return (
    <Box
      className={clsx(
        classes.RootSelectMultipleToggle,
        backgroundWhite && classes.backgroundWhite,
        className
      )}
    >
      <Box
        className={clsx(
          classes.label,
          disabled ? classes.labelDisabled : classes.labelActive
        )}
      >
        {label}
      </Box>
      <Box className={classes.listOptions}>
        {listOptions?.map(option => (
          <Box
            key={option.value}
            className={clsx(
              classes.option,
              // @ts-ignore
              listIdActivated.includes(option.id) && 'active'
            )}
            onClick={() => !disabled && onChooseValue(option.id || '')}
          >
            {option.label}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootSelectMultipleToggle: {
    padding: theme.spacing(2),
    background: theme.color.blue.six,
    borderRadius: theme.spacing(1),
  },
  backgroundWhite: {
    background: theme.color.white,
  },
  labelDisabled: {
    color: theme.color.black.secondary,
  },
  labelActive: {
    color: theme.color.blue.primary,
  },
  label: {
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
}))

export default SelectMultipleToggle
