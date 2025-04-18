import CommonButton from '@/components/buttons/CommonButton'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Box, Popover, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import moment from 'moment'
import { MouseEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputDatepicker from '../Datepicker/InputDatepicker'

interface InputFilterDatepickerProps {
  hideFooter?: boolean
  label?: string | null
  widthInput?: string | number
  value: Date | null
  currentValue?: Date | null
  inputFormat?: string
  views?: Array<'day' | 'month' | 'year'>
  openTo?: 'day' | 'month' | 'year'
  useUpdateLabel?: boolean
  required?: boolean
  readOnly?: boolean
  onChange: (date: Date | null) => void
  onFilter?: () => void
  onClose?: () => void
}

const InputFilterDatepicker = ({
  onChange,
  onFilter,
  onClose,
  label,
  widthInput,
  value,
  currentValue,
  hideFooter,
  inputFormat,
  openTo,
  views,
  useUpdateLabel,
  required,
  readOnly,
}: InputFilterDatepickerProps) => {
  const classes = useStyles({ widthInput })
  const { t: i18 } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  const labelValue = useMemo(() => {
    return value ? moment(value).format('MM/YYYY') : 'MM/YYYY'
  }, [value])

  const active = useMemo(() => {
    return (!!useUpdateLabel && !!value) || !!currentValue
  }, [useUpdateLabel, value, currentValue])

  const submitDisabled = useMemo(() => {
    return JSON.stringify(currentValue) === JSON.stringify(value)
  }, [value, currentValue])

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
    <Box className={classes.RootInputFilterDatepicker}>
      <Box
        className={clsx(classes.InputFilterDatepicker, active && 'active')}
        aria-describedby={id}
        onClick={toggle}
      >
        {!useUpdateLabel && <Box className={classes.label}>{label}</Box>}
        {!!useUpdateLabel && (
          <Box className={classes.label}>
            {labelValue}
            {!!required && (
              <Box className={classes.mark} component="span">
                *
              </Box>
            )}
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
        <Box className={classes.formRangeDate}>
          <InputDatepicker
            readOnly={readOnly}
            views={views}
            openTo={openTo}
            inputFormat={inputFormat}
            value={value}
            onChange={onChange}
          />
        </Box>
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
  RootInputFilterDatepicker: {},
  InputFilterDatepicker: {
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
  labelPrefix: {
    fontSize: 14,
    fontWeight: 700,
    color: theme.color.blue.primary,
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
  formRangeDate: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
  },
  labelInput: {
    fontSize: 14,
  },
  mark: {
    color: theme.color.error.secondary,
    marginLeft: theme.spacing(0.5),
  },
}))

export default InputFilterDatepicker
