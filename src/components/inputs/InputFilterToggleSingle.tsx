import CommonButton from '@/components/buttons/CommonButton'
import { OptionItem } from '@/types'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Box, Popover, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { MouseEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SelectSingleToggle from '../select/SelectSingleToggle'

interface InputFilterToggleSingleProps {
  hideFooter?: boolean
  useUpdateLabel?: boolean
  field?: string
  label?: string | null
  value: string | number
  currentValue?: string | number
  listOptions: OptionItem[]
  widthInput?: string | number
  unToggle?: boolean
  onChange: (payload: {
    value: string | number
    option: OptionItem
    field: string
  }) => void
  onFilter?: () => void
  onClose?: () => void
}

const InputFilterToggleSingle = ({
  value,
  onChange,
  onFilter,
  currentValue,
  onClose,
  label,
  listOptions,
  widthInput,
  field,
  hideFooter,
  useUpdateLabel,
  unToggle,
}: InputFilterToggleSingleProps) => {
  const classes = useStyles({ widthInput })
  const { t: i18 } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  const submitDisabled = useMemo(() => {
    return currentValue == value
  }, [currentValue, value])

  const toggle = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const close = () => {
    setAnchorEl(null)
    !!onClose && onClose()
  }

  const cancel = () => {
    !!onClose && onClose()
    close()
  }

  const filter = () => {
    !!onFilter && onFilter()
    setAnchorEl(null)
  }

  return (
    <Box className={classes.RootInputFilterToggleSingle}>
      <Box
        className={clsx(
          classes.InputFilterToggleSingle,
          (!!currentValue || (!!useUpdateLabel && !!value)) && 'active'
        )}
        aria-describedby={id}
        onClick={toggle}
      >
        {!useUpdateLabel && <Box className={classes.label}>{label}</Box>}
        {!!useUpdateLabel && (
          <Box className={classes.label}>
            {listOptions.find(option => option.value === value)?.label || label}
          </Box>
        )}
        {open ? <ArrowDropUp /> : <ArrowDropDown />}
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <SelectSingleToggle
          unToggle
          field={field}
          backgroundWhite
          className={classes.select}
          listOptions={listOptions}
          value={value}
          onChange={onChange}
        />
        {!hideFooter && (
          <Box className={classes.footer}>
            <CommonButton variant="outlined" color="inherit" onClick={cancel}>
              {i18('LB_CANCEL')}
            </CommonButton>
            <CommonButton disabled={submitDisabled} onClick={filter}>
              {i18('LB_FILTER')}
            </CommonButton>
          </Box>
        )}
      </Popover>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootInputFilterToggleSingle: {},
  InputFilterToggleSingle: {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: theme.spacing(3),
    padding: theme.spacing(0.5, 1, 0.5, 2),
    color: theme.color.black.secondary,
    cursor: 'pointer',
    '&:hover': {
      background: theme.color.blue.six,
    },
    '&.active': {
      border: `1px solid ${theme.color.blue.primary}`,
      color: theme.color.blue.primary,
      fontWeight: 500,
    },
  },
  label: {
    fontSize: 14,
  },
  select: {
    width: (props: any) => props.widthInput || 300,
  },
  footer: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.color.grey.secondary}`,
  },
}))

export default InputFilterToggleSingle
