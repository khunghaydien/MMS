import InputErrorMessage from '@/components/common/InputErrorMessage'
import { LangConstant } from '@/const'
import { CHANGE_TIME_DELAY } from '@/const/app.const'
import { EventInput, OptionItem } from '@/types'
import { getTextEllipsis } from '@/utils'
import { ArrowDropDown } from '@mui/icons-material'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputTitle from '../common/InputTitle'
import CloseIcon from '../icons/CloseIcon'

interface InputDropdownProps {
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
  selectClassName?: string
  paddingRight?: number
  maxEllipsis?: number
}

const defaultListOptions: OptionItem[] = []

const InputDropdown = ({
  value,
  listOptions = defaultListOptions,
  width = '100%',
  useLabel,
  placeholder,
  label,
  error,
  errorMessage,
  isDisable = false,
  onChange,
  isShowInput = false,
  inputValue,
  onInputChange = () => {},
  inputError = false,
  ignoreOptionById,
  onOpen,
  isShowClearIcon = true,
  keyName = '',
  required = false,
  heightDropdown = 500,
  selectClassName,
  paddingRight,
  maxEllipsis,
}: InputDropdownProps) => {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles({
    paddingRight: paddingRight || 60,
  })
  const [isShowCloseIcon, setIsShowCloseIcon] = useState(false)

  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  const handleInputDropdownChange = (e: SelectChangeEvent) => {
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current)
    }
    const value = e.target.value as string
    changeTimeoutRef.current = setTimeout(() => {
      !!onChange &&
        onChange(
          value,
          listOptions.find((option: OptionItem) => option.value == value),
          keyName || ''
        )
    }, CHANGE_TIME_DELAY)
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
  return (
    <Box className={classes.rootFormItem} style={{ width }}>
      {!!label && <InputTitle title={label} required={required} />}
      <Box
        className={clsx(classes.rootInputDropdown, value && classes.valueExist)}
      >
        <FormControl
          className={error ? classes.error : ''}
          fullWidth
          error={error}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {useLabel && <InputLabel className="label">{label}</InputLabel>}
          <Select
            IconComponent={() =>
              isShowCloseIcon && isShowClearIcon && value && !isDisable ? (
                <Box
                  className={clsx(classes.customIcon, classes.clearIcon)}
                  onClick={handleClearValue}
                >
                  <CloseIcon onClick={handleClearValue} />
                </Box>
              ) : (
                <Box className={classes.customIcon}>
                  <ArrowDropDown />
                </Box>
              )
            }
            className={clsx(classes.select, selectClassName)}
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
            onChange={handleInputDropdownChange}
            renderValue={
              conditionRenderPlaceholder
                ? undefined
                : () => <Box className={classes.placeholder}>{placeholder}</Box>
            }
            onClose={() => setIsShowCloseIcon(false)}
            onOpen={handleOpen}
            onBlur={handleBlur}
          >
            {!!listOptions.length ? (
              listOptions.map((option: OptionItem) => (
                <MenuItem
                  disabled={!!option.disabled}
                  key={option.id}
                  value={option.id}
                  className={option.id === ignoreOptionById ? 'hidden' : ''}
                >
                  <Box title={option.label}>
                    {getTextEllipsis(option.label as string, maxEllipsis)}
                  </Box>
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">
                <Box>{i18nCommon('MSG_NO_DATA_AVAILABLE')}</Box>
              </MenuItem>
            )}
          </Select>

          {isShowInput && false && (
            <TextField
              error={inputError}
              placeholder="Note"
              className="input__text"
              value={inputValue}
              onChange={handleInputChange}
            />
          )}
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
  rootInputDropdown: {
    width: '100%',
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
      paddingRight: (props: { paddingRight: number }) =>
        `${props.paddingRight}px !important`,
    },
    '&.Mui-disabled': {
      textFillColor: 'rgb(0 0 0 / 80%) !important',
      backgroundColor: theme.color.grey.tertiary,
    },
  },
  show: {},
  customIcon: {
    right: '4px',
    top: '7px',
    position: 'absolute',
  },
  clearIcon: {
    top: '10px',
    right: '6px',
    '& svg': {
      fontSize: 20,
    },
  },
}))

export default memo(InputDropdown)
