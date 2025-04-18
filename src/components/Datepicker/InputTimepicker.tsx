import InputErrorMessage from '@/components/common/InputErrorMessage'
import { LangConstant } from '@/const'
import { EventInput, OptionItem } from '@/types'
import { getTextEllipsis } from '@/utils'
import { AvTimer } from '@mui/icons-material'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputTitle from '../common/InputTitle'
import CloseIcon from '../icons/CloseIcon'
import { listTimePicker } from './timePicker'

interface InputTimePickerProps {
  width?: number | string
  value: string | number
  useLabel?: boolean
  label?: any
  placeholder?: any
  listOptions?: OptionItem[]
  error?: boolean
  errorMessage?: any
  isDisable?: boolean
  onChange?: (value: string, option?: OptionItem, keyName?: string) => void
  isShowInput?: boolean
  inputValue?: string
  onInputChange?: (value: string, event?: EventInput) => void
  inputError?: boolean
  ignoreOptionById?: string | number | undefined
  onOpen?: () => void
  isShowClearIcon?: boolean
  keyName?: string
  required?: boolean
  heightDropdown?: number
  minTime?: string
  maxTime?: string
}

const InputTimePicker = ({
  value,
  listOptions = listTimePicker,
  width,
  useLabel,
  placeholder = 'E.g: 00:00',
  label,
  error,
  errorMessage,
  isDisable = false,
  onChange,
  onInputChange = () => {},
  inputError = false,
  ignoreOptionById,
  onOpen,
  isShowClearIcon = true,
  keyName = '',
  required = false,
  heightDropdown = 500,
  minTime,
  maxTime,
}: InputTimePickerProps) => {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles()
  const [isShowCloseIcon, setIsShowCloseIcon] = useState(false)

  const conditionRenderPlaceholder = useMemo(() => {
    return (
      value !== '' &&
      listOptions
        .map((option: OptionItem) => option.id?.toString())
        .includes(value?.toString())
    )
  }, [value, listOptions])

  const valueLocal = useMemo(() => {
    const val = listOptions.find((option: OptionItem) => option.value == value)
    return val?.value?.toString() || ''
  }, [listOptions, value])

  const handleInputTimePickerChange = (e: SelectChangeEvent) => {
    const value = e.target.value as string
    !!onChange &&
      onChange(
        value,
        listOptions.find((option: OptionItem) => option.value == value),
        keyName || ''
      )
  }

  const handleMouseOver = () => {
    if (!isShowClearIcon) return
    setIsShowCloseIcon(true)
  }
  const handleMouseOut = () => {
    if (!isShowClearIcon) return
    setIsShowCloseIcon(false)
  }

  const handleClearValue = () => {
    !!onChange && onChange('', {}, keyName || '')
  }

  const handleInputChange = (event: EventInput) => {
    const { value } = event.target
    onInputChange(value, event)
  }

  const handleOpen = () => {
    !!onOpen && onOpen()
  }

  const handleBlur = () => {
    setIsShowCloseIcon(false)
  }

  function compareTimes(time1: string, time2: string) {
    const [hour1, minute1] = time1.split(':').map(Number)
    const [hour2, minute2] = time2.split(':').map(Number)

    if (hour1 < hour2) {
      return -1
    } else if (hour1 > hour2) {
      return 1
    } else {
      if (minute1 < minute2) {
        return -1
      } else if (minute1 > minute2) {
        return 1
      } else {
        return 0
      }
    }
  }

  const listTimePickerRangeDisabled = useMemo(() => {
    if (!minTime && !maxTime) {
      return listTimePicker
    }
    let listTime: OptionItem[] = [...listTimePicker]
    if (minTime) {
      listTime = listTime.map(item => ({
        ...item,
        disabled: compareTimes(item.value as string, minTime) <= 0,
      }))
    }
    if (maxTime) {
      listTime = listTime.map(item => ({
        ...item,
        disabled: compareTimes(item.value as string, maxTime) >= 0,
      }))
    }
    return listTime
  }, [minTime, maxTime])

  return (
    <Box className={classes.rootFormItem} style={{ width }}>
      {!!label && <InputTitle title={label} required={required} />}
      <Box
        className={clsx(
          classes.rootInputTimePicker,
          value && classes.valueExist
        )}
      >
        <FormControl
          className={error ? classes.error : ''}
          fullWidth
          error={error}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {useLabel && <InputLabel>{label}</InputLabel>}
          <Box
            className={clsx(
              isShowCloseIcon && value && !isDisable && isShowClearIcon
                ? classes.show
                : 'hidden',
              'custom-close-icon'
            )}
            onClick={handleClearValue}
          >
            <CloseIcon />
          </Box>
          <Select
            IconComponent={AvTimer}
            className={classes.select}
            value={valueLocal}
            label={useLabel && label}
            disabled={isDisable}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: heightDropdown,
                },
              },
            }}
            displayEmpty
            onChange={handleInputTimePickerChange}
            renderValue={
              conditionRenderPlaceholder
                ? undefined
                : () => <Box className={classes.placeholder}>{placeholder}</Box>
            }
            onClose={() => setIsShowCloseIcon(false)}
            onOpen={handleOpen}
            onBlur={handleBlur}
          >
            {listTimePickerRangeDisabled.map((option: OptionItem) => (
              <MenuItem
                disabled={!!option.disabled}
                key={option.id}
                value={option.id}
                className={option.id === ignoreOptionById ? 'hidden' : ''}
              >
                <Box title={option.label}>
                  {getTextEllipsis(option.label as string)}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {(error || inputError) && (
          <InputErrorMessage
            className={classes.errorMessage}
            content={errorMessage}
          />
        )}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 14,
  },
  rootInputTimePicker: {
    width: '120px',
    '& .MuiFormLabel-root': {
      transform: 'translate(14px, 10px) scale(1)',
      color: theme.color.black.tertiary,
      fontSize: 14,

      '&.Mui-focused': {
        transform: 'translate(14px, -9px) scale(0.75)',
        fontSize: 16,
      },
    },

    '& .MuiSelect-select > div': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },

    '& .input__text': {
      marginTop: theme.spacing(2),
      '& input': {
        height: theme.spacing(5),
        padding: theme.spacing(0, 2),
      },
    },
  },
  valueExist: {
    '& .MuiFormLabel-root': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
  clearValue: {
    fontWeight: '700 !important',
  },
  placeholder: {
    color: `${theme.color.grey.fourth} !important`,
    fontSize: 14,
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  error: {
    '& fieldset': {
      borderColor: theme.color.error.primary,
    },
  },
  select: {
    backgroundColor: '#FFFFFF',
    height: theme.spacing(5),
    '& .MuiSelect-select': {
      paddingRight: '30px !important',
    },
    '&.Mui-disabled': {
      textFillColor: 'rgb(0 0 0 / 80%) !important',
      backgroundColor: theme.color.grey.tertiary,
    },
  },
  show: {},
}))

export default memo(InputTimePicker)
