import CommonButton from '@/components/buttons/CommonButton'
import { DateRange } from '@/types'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Box, Popover, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import moment from 'moment'
import { MouseEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputRangeDatePicker from './InputRangeDatePicker'

interface InputFilterRangeDatepickerProps {
  hideFooter?: boolean
  label?: string | null
  widthInput?: string | number
  values: DateRange
  currentValues?: DateRange
  inputFormat?: string
  views?: Array<'day' | 'month' | 'year'>
  openTo?: 'day' | 'month' | 'year'
  useUpdateLabel?: boolean
  required?: boolean
  readOnly?: boolean
  onChange: (dateRange: DateRange) => void
  onFilter?: () => void
  onClose?: () => void
}

const InputFilterRangeDatepicker = ({
  onChange,
  onFilter,
  onClose,
  label,
  widthInput,
  values,
  currentValues,
  hideFooter,
  inputFormat,
  openTo,
  views,
  useUpdateLabel,
  required,
  readOnly,
}: InputFilterRangeDatepickerProps) => {
  const classes = useStyles({ widthInput })
  const { t: i18 } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  const labelValue = useMemo(() => {
    const startDate = values.startDate
      ? moment(values.startDate).format('MM/YYYY')
      : i18('LB_FROM')
    const endDate = values.endDate
      ? moment(values.endDate).format('MM/YYYY')
      : i18('LB_TO_V2')
    return `${startDate} - ${endDate}`
  }, [values, i18])

  const active = useMemo(() => {
    return (
      (!!useUpdateLabel && (!!values.startDate || !!values.endDate)) ||
      !!currentValues?.startDate ||
      !!currentValues?.endDate
    )
  }, [useUpdateLabel, values, currentValues])

  const submitDisabled = useMemo(() => {
    return JSON.stringify(currentValues) === JSON.stringify(values)
  }, [values, currentValues])

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
    <Box className={classes.RootInputFilterRangeDatepicker}>
      <Box
        className={clsx(classes.InputFilterRangeDatepicker, active && 'active')}
        aria-describedby={id}
        onClick={toggle}
      >
        {!useUpdateLabel && <Box className={classes.label}>{label}</Box>}
        {!!useUpdateLabel && (
          <Box className={classes.label}>
            {labelValue}{' '}
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
          <Box className={classes.labelPrefix}>{i18('LB_FROM')} </Box>
          <InputRangeDatePicker
            readOnly={readOnly}
            views={views}
            openTo={openTo}
            inputFormat={inputFormat}
            spaceFix={i18('LB_TO_V2')}
            errorMessageDateRange="Project Start Date 'To' cannot have the date before Project Start Date 'From'"
            values={values}
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
  RootInputFilterRangeDatepicker: {},
  InputFilterRangeDatepicker: {
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

export default InputFilterRangeDatepicker
