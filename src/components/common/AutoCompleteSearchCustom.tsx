import { LangConstant } from '@/const'
import { useClickOutside2 } from '@/hooks'
import { EventInput, OptionItem } from '@/types'
import { filterFollowKeyword, getTextEllipsis } from '@/utils'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import { CircularProgress, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import clsx from 'clsx'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConditionalRender from '../ConditionalRender'
import InputErrorMessage from './InputErrorMessage'

interface IProps {
  multiple: boolean
  size?: 'small' | 'medium'
  width?: number | string
  placeholder?: any
  uniqueKey?: keyof OptionItem
  value: OptionItem[] | OptionItem | null
  listOptions: OptionItem[]
  error?: boolean
  errorMessage?: any
  onChange: (tags: any, keyName?: string) => void
  onScroll?: (event: any) => void
  onInputChange?: (value: string) => void
  isCustomFilter?: boolean
  disabled?: boolean
  loading?: boolean
  customZIndex?: boolean
  keyName?: string
  numberEllipsis?: number
}

export default function AutoCompleteSearchCustom({
  multiple,
  width = '100%',
  placeholder,
  uniqueKey = 'value',
  value,
  listOptions,
  error,
  errorMessage,
  onChange,
  onScroll,
  onInputChange = () => {},
  isCustomFilter = false,
  disabled = false,
  loading = false,
  customZIndex = false,
  keyName = '',
  numberEllipsis = 20,
}: IProps) {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles()
  const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false)
  const [listOptionDisplay, setListOptionDisplay] = useState<OptionItem[]>([])
  const [listSelected, setListSelected] = useState<OptionItem[]>([])
  const [valueSearch, setValueSearch] = useState<string>('')
  const [isFocusInput, setIsFocusInput] = useState<boolean>(false)
  const [inputReadOnly, setInputReadOnly] = useState(false)
  const [isShowCloseIcon, setIsShowCloseIcon] = useState(false)
  const [styleListDropdown, setStyleListDropdown] = useState<any>({})
  const [closeIconClick, setCloseIconClick] = useState<boolean>(false)

  const rootInputRef = useRef<any>(null)
  const inputRef = useRef<any>(null)
  const optionListRef = useRef<any>(null)
  const optionItemRef = useRef<any>(null)
  const isShowInput = useMemo(() => {
    return (
      multiple ||
      (!multiple &&
        (!!value
          ? Array.isArray(value)
            ? value.length === 0
            : !value?.value
          : true))
    )
  }, [value])

  const checkActiveOption = (option: OptionItem) => {
    const _listValueSelected = listSelected.map(
      (option: OptionItem) => option[uniqueKey]
    )
    return _listValueSelected.includes(option[uniqueKey])
  }

  const handleSetValueSearch = (value: string) => {
    setValueSearch(value)
    onInputChange(value.trim())
  }

  const handleInputChange = (event: EventInput) => {
    const { value } = event.target
    setIsShowDropdown(true)
    if (!isCustomFilter) {
      if (!multiple) {
        if (!value.trim()) {
          setListSelected([])
        } else {
          if (!listOptionDisplay.length) {
            setListOptionDisplay(listOptions)
          } else {
            const _listOptionDisplay = filterFollowKeyword(listOptions, value)
            setListOptionDisplay(_listOptionDisplay)
          }
        }
      } else {
        const _listOptionDisplay = filterFollowKeyword(listOptions, value)
        setListOptionDisplay(_listOptionDisplay)
      }
    }
    handleSetValueSearch(value)
  }

  const handleInputFocus = () => {
    if (!disabled) {
      setTimeout(() => {
        setCloseIconClick(current => {
          if (!current) {
            setIsShowDropdown(true)
          }
          return false
        })
      })
    }
    setIsFocusInput(true)
  }

  const handleClickOption = (option: OptionItem) => {
    const indexItemSelected = listSelected.findIndex(
      (item: OptionItem) => item[uniqueKey] === option[uniqueKey]
    )
    setIsShowDropdown(false)
    if (multiple) {
      if (indexItemSelected >= 0) {
        setCloseIconClick(true)
        const _newListSelected = [...listSelected]
        _newListSelected.splice(indexItemSelected, 1)
        setListSelected(_newListSelected)
        onChange(_newListSelected, keyName)
      } else {
        const _newListSelected = [...listSelected, option]
        setListSelected(_newListSelected)
        onChange(_newListSelected, keyName)
      }
      !!valueSearch && handleSetValueSearch('')
      setListOptionDisplay(listOptions)
    } else {
      if (indexItemSelected >= 0) return
      !!valueSearch && handleSetValueSearch('')
      setListSelected([option])
      onChange(option, keyName)
      setInputReadOnly(true)
    }
  }

  const handleClickIconArrow = () => {
    setIsShowDropdown(current => !current)
    if (!!inputRef.current?.focus) {
      inputRef.current.focus()
      setIsFocusInput(true)
    }
  }

  const handleClearAll = (event: any) => {
    event.stopPropagation()
    setListSelected([])
    setListOptionDisplay(listOptions)
    onChange(multiple ? [] : null, keyName)
    setInputReadOnly(false)
  }

  const handleMouseOver = () => setIsShowCloseIcon(true)
  const handleMouseOut = () => setIsShowCloseIcon(false)

  const handleScrollPage = () => {
    if (!customZIndex) return
    const rootElement = rootInputRef.current
    if (rootElement) {
      const { top, left, width, height } = rootElement.getBoundingClientRect()
      setStyleListDropdown({
        position: 'fixed',
        top: top + height + 2,
        left,
        width,
      })
    }
  }

  useLayoutEffect(() => {
    if (!value) return setListSelected([])
    if (Array.isArray(value)) {
      if (!value.length) return setListSelected([])
      setListSelected(value)
    } else {
      if (!value[uniqueKey]) {
        setInputReadOnly(false)
        return setListSelected([])
      } else {
        setInputReadOnly(true)
        setListSelected([value])
      }
    }
  }, [value])

  useEffect(() => {
    setListOptionDisplay(listOptions)
  }, [listOptions])

  useClickOutside2(rootInputRef, () => {
    setIsShowDropdown(false)
    setIsFocusInput(false)
    setIsShowCloseIcon(false)
  })

  useEffect(() => {
    const mainLayoutElement = document.getElementById('main__layout')
    if (customZIndex) {
      handleScrollPage()
      !!mainLayoutElement &&
        mainLayoutElement.addEventListener('scroll', handleScrollPage)
    }

    if (!isShowDropdown || !optionItemRef.current || !optionListRef.current)
      return
    const offsetTopItem = optionItemRef.current.offsetTop
    optionListRef.current.scrollTo(0, offsetTopItem - 100)

    return () => {
      if (customZIndex) {
        !!mainLayoutElement &&
          mainLayoutElement?.removeEventListener('scroll', handleScrollPage)
      }
    }
  }, [isShowDropdown])

  useEffect(() => {
    // @ts-ignore
    if (!value && !value?.id) {
      setValueSearch('')
      setInputReadOnly(false)
    }
  }, [value])

  return (
    <Box
      className={classes.rootInputAutocomplete}
      style={{ width }}
      ref={rootInputRef}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Box
        className={clsx(
          classes.inputWrapper,
          isFocusInput && 'highlight',
          disabled && 'disabled',
          error && classes.error
        )}
      >
        <Box className={classes.contentWrapper} onClick={handleInputFocus}>
          <ConditionalRender conditional={multiple && !!listSelected.length}>
            {listSelected.map((item: OptionItem, index) => (
              <ChipSelected
                disabled={disabled}
                key={`${item.value}_${index}`}
                item={item}
                onClickOption={handleClickOption}
                numberEllipsis={numberEllipsis}
              />
            ))}
          </ConditionalRender>
          <ConditionalRender
            conditional={isShowInput}
            fallback={
              <Box
                className={clsx(classes.selectedItem, classes.textInputWrapper)}
              >
                <Box
                  sx={{
                    fontSize: 16,
                  }}
                  component="span"
                  className={clsx(
                    classes.valueSingle,
                    'ellipsis',
                    disabled && 'disabled'
                  )}
                  title={
                    Array.isArray(value)
                      ? ''
                      : getTextEllipsis(value?.label, numberEllipsis) || ''
                  }
                >
                  {Array.isArray(value)
                    ? ''
                    : getTextEllipsis(value?.label, numberEllipsis) || ''}
                </Box>
              </Box>
            }
          >
            <input
              type="text"
              className={clsx(
                classes.input,
                multiple ? 'ellipsis' : 'single',
                multiple && !!listSelected.length && 'hadItem'
              )}
              disabled={disabled}
              placeholder={placeholder}
              value={valueSearch}
              onChange={handleInputChange}
              ref={inputRef}
              readOnly={inputReadOnly}
            />
            <ConditionalRender conditional={loading}>
              <CircularProgress
                color="inherit"
                size={20}
                className="iconCircle"
              />
            </ConditionalRender>
          </ConditionalRender>
        </Box>

        <Box className={classes.buttonWrapper}>
          {!!listSelected.length && isShowCloseIcon && !disabled && (
            <Box
              className={clsx(classes.iconClose, 'icon')}
              onClick={handleClearAll}
            >
              <CloseIcon />
            </Box>
          )}

          <Box
            className={clsx(
              classes.iconArrowDown,
              'icon',
              disabled && 'disable-select'
            )}
            onClick={!disabled ? handleClickIconArrow : () => {}}
          >
            <ArrowDropDownIcon />
          </Box>
        </Box>

        <Box className={classes.listWrapper} style={styleListDropdown}>
          <ConditionalRender conditional={isShowDropdown}>
            <Box
              component="ul"
              className={clsx(classes.listOptions, 'list-options')}
              onScroll={onScroll}
              ref={optionListRef}
            >
              {listOptionDisplay.map((option: OptionItem, index: number) => (
                <DropdownItem
                  option={option}
                  checkActiveOption={checkActiveOption}
                  optionItemRef={optionItemRef}
                  onClickOption={handleClickOption}
                  key={`${option[uniqueKey]}_${index}`}
                  numberEllipsis={numberEllipsis}
                />
              ))}
              {!!loading && (
                <Box className={classes.noData}>
                  {loading ? 'Loading...' : ''}
                </Box>
              )}
              {!loading && !listOptions?.length && (
                <Box className={classes.noData}>
                  {i18nCommon('MSG_NO_DATA_AVAILABLE')}
                </Box>
              )}
            </Box>
          </ConditionalRender>
        </Box>
      </Box>
      {error && (
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage}
        />
      )}
    </Box>
  )
}

const ChipSelected = ({
  item,
  onClickOption,
  disabled,
  numberEllipsis,
}: any) => {
  const classes = useStyles()
  return (
    <Box className={clsx(classes.selectedItem)}>
      <Box
        component="span"
        className={clsx(disabled && 'disabled', 'ellipsis')}
        title={item.label}
      >
        {getTextEllipsis(item.label, numberEllipsis)}
      </Box>
      <CloseIcon
        className={clsx(disabled && classes.closeIconDisabled, '')}
        onClick={() => onClickOption(item)}
      />
    </Box>
  )
}

const DropdownItem = ({
  option,
  checkActiveOption,
  optionItemRef,
  onClickOption,
  numberEllipsis,
}: any) => {
  const classes = useStyles()
  return (
    <Box
      component="li"
      className={clsx(
        classes.optionItem,
        checkActiveOption(option) && 'active'
      )}
      onClick={() => onClickOption(option)}
      {...(checkActiveOption(option) ? { ref: optionItemRef } : {})}
      title={option.label}
    >
      <Box className="ellipsis">
        {getTextEllipsis(option.label, numberEllipsis)}
      </Box>
      <ConditionalRender conditional={!!option?.description}>
        <Box className="ellipsis description">{option.description}</Box>
      </ConditionalRender>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputAutocomplete: {
    width: '270px',
    fontSize: 14,
    lineHeight: 1,
    '& .ellipsis': {
      lineClamp: 'unset !important',
    },
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '3px',
    '&:hover': {
      borderColor: 'black',
    },

    '&.highlight': {
      borderColor: theme.color.blue.primary,
      borderWidth: '2px',
    },
    '&.disabled': {
      border: `1px solid ${theme.color.grey.primary}`,
      backgroundColor: theme.color.grey.tertiary,
      borderRadius: '4px',
      '& input::placeholder': {
        color: `#8f8f8f !important`,
      },
    },

    '& .iconCircle': {
      position: 'absolute',
      right: 40,
    },
  },
  contentWrapper: {
    minHeight: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.75),
    maxWidth: 'calc(100% - 56px)',
  },
  selectedItem: {
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(3),
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: theme.spacing(2),
    whiteSpace: 'nowrap',
    fontSize: 13,
    padding: theme.spacing(0, 1),

    '& .disabled': {
      color: theme.color.black.tertiary,
    },

    '& span': {
      display: 'inline-block',
      lineHeight: theme.spacing(3),
    },

    '& svg': {
      cursor: 'pointer',
      width: theme.spacing(1.7),
      height: theme.spacing(1.7),
      marginLeft: theme.spacing(0.5),
      padding: theme.spacing(0.2),
      borderRadius: '50%',
      color: theme.color.white,
      backgroundColor: 'rgba(0, 0, 0, 0.26)',
      flexShrink: 0,
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      },
    },
  },
  textInputWrapper: {
    backgroundColor: 'unset',
    width: '100%',
    '& span': {
      display: 'inline-block',
      lineHeight: theme.spacing(3),
    },
  },
  input: {
    width: '100%',
    height: theme.spacing(3.5),
    padding: theme.spacing(0, 0.75),
    fontSize: 14,
    lineHeight: 1,
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    flexGrow: 1,

    '&.single': {
      with: '100%',
      minWidth: 'unset',
    },

    '&.hadItem': {
      width: 0,
      minWidth: theme.spacing(10),
    },

    '&::placeholder': {
      color: `${theme.color.grey.primary} !important`,
    },
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    width: theme.spacing(7),
    justifyContent: 'flex-end',
    '& .icon': {
      flexShrink: 0,
      cursor: 'pointer',
      borderRadius: '50%',
      width: theme.spacing(3.5),
      height: theme.spacing(3.5),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transitionDuration: '250ms',
      transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
  },
  iconClose: {
    '& svg': {
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
      color: 'rgba(0, 0, 0, 0.54)',
    },
  },
  iconArrowDown: {
    '& svg': {
      color: 'rgba(0, 0, 0, 0.54)',
    },

    '&.open': {
      transform: 'rotate(180deg)',
    },
    '&.disable-select': {
      pointerEvents: 'none',
      '& svg': {
        color: 'rgba(0, 0, 0, 0.26)',
      },
    },
  },
  listWrapper: {
    position: 'absolute',
    zIndex: 3,
    top: 'calc(100% + 2px)',
    left: 0,
    right: 0,
    background: theme.color.white,
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderRadius: theme.spacing(0.5),
    boxShadow:
      '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  listOptions: {
    overflow: 'auto',
    maxHeight: '32vh',
    padding: theme.spacing(1, 0),
  },
  noData: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    color: theme.color.black.secondary,
    minHeight: theme.spacing(6.5),
    fontSize: 16,
  },
  optionItem: {
    padding: theme.spacing(0.75, 2),
    minHeight: theme.spacing(4.5),
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.87)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)',
    },

    '&.active': {
      backgroundColor: 'rgba(32, 93, 206, 0.08)',
    },
    '& .description': {
      fontSize: '10px',
    },
  },
  active: {},
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  error: {
    borderColor: theme.color.error.primary,
  },
  valueSingle: {
    '&.disabled': {
      color: theme.color.black.tertiary,
    },
  },
  closeIconDisabled: {
    pointerEvents: 'none',
  },
}))
