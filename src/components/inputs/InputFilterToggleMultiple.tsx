import CommonButton from '@/components/buttons/CommonButton'
import SelectMultipleToggle from '@/components/select/SelectMultipleToggle'
import { OptionItem } from '@/types'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Box, Popover, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { MouseEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface InputFilterToggleMultipleProps {
  label?: string | null
  listIdActivated: string[] | number[]
  currentListIdActivated?: string[] | number[]
  listOptions: OptionItem[]
  widthInput?: string | number
  onChange: (payload: {
    listIdActivated: string[] | number[]
    option: OptionItem
  }) => void
  onFilter?: () => void
  onClose?: () => void
  hideFooter?: boolean
  useUpdateLabel?: boolean
  disabled?: boolean
}

const InputFilterToggleMultiple = ({
  listIdActivated,
  onChange,
  onFilter,
  currentListIdActivated,
  onClose,
  label,
  listOptions,
  widthInput,
  hideFooter,
  useUpdateLabel,
  disabled,
}: InputFilterToggleMultipleProps) => {
  const classes = useStyles({ widthInput })
  const { t: i18 } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  const submitDisabled = useMemo(() => {
    return (
      JSON.stringify(currentListIdActivated) === JSON.stringify(listIdActivated)
    )
  }, [currentListIdActivated, listIdActivated])

  const toggle = (event: MouseEvent<HTMLDivElement>) => {
    !disabled && setAnchorEl(event.currentTarget)
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
    <Box className={classes.RootInputFilterToggleMultiple}>
      <Box
        className={clsx(
          classes.InputFilterToggleMultiple,
          (!!currentListIdActivated?.length ||
            (!!useUpdateLabel && !!listIdActivated.length)) &&
            'active',
          disabled && 'disabled'
        )}
        aria-describedby={id}
        onClick={toggle}
      >
        {!useUpdateLabel && <Box className={classes.label}>{label}</Box>}
        {!!useUpdateLabel && (
          <Box className={classes.label}>
            {listOptions
              // @ts-ignore
              .filter(option => listIdActivated.includes(option.value))
              ?.map(option => option.label)
              .join(', ') || label}
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
        <SelectMultipleToggle
          backgroundWhite
          className={classes.select}
          listOptions={listOptions}
          listIdActivated={listIdActivated}
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
  RootInputFilterToggleMultiple: {},
  InputFilterToggleMultiple: {
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
    '&.disabled': {
      background: theme.color.grey.tertiary,
      cursor: 'default',
      border: `1px solid ${theme.color.grey.primary}`,
      color: theme.color.grey.primary,
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

export default InputFilterToggleMultiple
