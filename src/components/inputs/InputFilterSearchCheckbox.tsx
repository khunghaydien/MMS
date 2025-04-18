import CommonButton from '@/components/buttons/CommonButton'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { OptionItem } from '@/types'
import { getTextEllipsis } from '@/utils'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Box, Popover, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NoData from '../common/NoData'
import LoadingSkeleton from '../loading/LoadingSkeleton'
import InputCheckbox from './InputCheckbox'
import InputSearch from './InputSearch'

interface InputFilterSearchCheckboxProps {
  label?: string | null
  widthInput?: string | number
  searchPlaceholder?: string | null
  loading?: boolean
  listOptions: OptionItem[]
  listOptionsChecked: OptionItem[]
  currentListOptionsChecked: OptionItem[]
  hideSearch?: boolean
  onFilter: () => void
  onClose: () => void
  onChange: (value: OptionItem[]) => void
}

const InputFilterSearchCheckbox = ({
  onFilter,
  onClose,
  label,
  widthInput,
  listOptions,
  searchPlaceholder,
  loading,
  listOptionsChecked,
  onChange,
  currentListOptionsChecked,
  hideSearch,
}: InputFilterSearchCheckboxProps) => {
  const classes = useStyles({ widthInput })
  const { t: i18 } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const [valueSearch, setValueSearch] = useState('')
  const [pageSize] = useState(LIMIT_DEFAULT)
  const [pageNum, setPageNum] = useState(PAGE_CURRENT_DEFAULT)
  const [listOptionsScrolled, setListOptionsScrolled] = useState<OptionItem[]>(
    []
  )

  const listOptionsFiltered = useMemo(() => {
    return listOptions.filter(option => {
      return option.label
        ?.toLowerCase()
        ?.replaceAll(' ', '')
        ?.includes(valueSearch.toLowerCase())
    })
  }, [listOptions, valueSearch])

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  const submitDisabled = useMemo(() => {
    return (
      JSON.stringify(currentListOptionsChecked) ===
      JSON.stringify(listOptionsChecked)
    )
  }, [currentListOptionsChecked, listOptionsChecked])

  const toggle = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const onChecked = (option: OptionItem) => {
    const indexOptionChecked = listOptionsChecked.findIndex(
      item => item.value == option.value
    )
    const newListOptionsChecked = [...listOptionsChecked]
    if (indexOptionChecked > -1) {
      newListOptionsChecked.splice(indexOptionChecked, 1)
    } else {
      newListOptionsChecked.push(option)
    }
    onChange(newListOptionsChecked)
  }

  const searchChangeValue = (newSearchValue: string) => {
    setValueSearch(newSearchValue)
  }

  const close = () => {
    setAnchorEl(null)
    onClose()
    setValueSearch('')
    setPageNum(PAGE_CURRENT_DEFAULT)
  }

  const cancel = () => {
    onClose()
    close()
  }

  const filter = () => {
    onFilter()
    setAnchorEl(null)
    setValueSearch('')
    setPageNum(PAGE_CURRENT_DEFAULT)
  }

  const onScroll = (event: any) => {
    const listboxNode = event.currentTarget
    const position = listboxNode.scrollTop + listboxNode.clientHeight
    if (listboxNode.scrollHeight - position <= 1) {
      const newPageNum = pageNum + 1
      setPageNum(newPageNum)
      setListOptionsScrolled([
        ...listOptionsScrolled,
        ...listOptions.slice(
          (newPageNum - 1) * pageSize,
          newPageNum * pageSize
        ),
      ])
    }
  }

  useEffect(() => {
    setListOptionsScrolled(listOptionsFiltered.slice(0, pageSize))
  }, [listOptionsFiltered])

  return (
    <Box className={classes.RootInputFilterSearchCheckbox}>
      <Box
        className={clsx(
          classes.InputFilterSearchCheckbox,
          !!currentListOptionsChecked.length && 'active'
        )}
        aria-describedby={id}
        onClick={toggle}
      >
        <Box className={classes.labelInput}>{label}</Box>
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
        <Box className={classes.body}>
          {!hideSearch && (
            <InputSearch
              placeholder={searchPlaceholder}
              value={valueSearch}
              onChange={searchChangeValue}
            />
          )}
          <Box className={classes.listOptions} onScroll={onScroll}>
            {!loading &&
              (listOptionsScrolled.length ? (
                listOptionsScrolled.map(option => (
                  <Box
                    className={clsx(
                      classes.option,
                      !!listOptionsChecked.find(
                        item => item.value == option.value
                      ) && 'checked'
                    )}
                    key={option.value}
                    onClick={() => onChecked(option)}
                    title={option.label}
                  >
                    <InputCheckbox
                      label={getTextEllipsis(option.label, 25)}
                      checked={
                        !!listOptionsChecked.find(
                          item => item.value == option.value
                        )
                      }
                    />
                  </Box>
                ))
              ) : (
                <NoData />
              ))}
            {loading && <LoadingSkeleton />}
          </Box>
        </Box>
        <Box className={classes.footer}>
          <CommonButton variant="outlined" color="inherit" onClick={cancel}>
            {i18('LB_CANCEL')}
          </CommonButton>
          <CommonButton disabled={submitDisabled} onClick={filter}>
            {i18('LB_FILTER')}
          </CommonButton>
        </Box>
      </Popover>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootInputFilterSearchCheckbox: {},
  InputFilterSearchCheckbox: {
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
    color: theme.color.blue.primary,
    fontWeight: 700,
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
  labelInput: {
    fontSize: 14,
  },
  body: {
    padding: theme.spacing(2),
  },
  listOptions: {
    marginTop: theme.spacing(1),
    maxHeight: 400,
    overflowY: 'auto',
    width: 320,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  option: {
    cursor: 'pointer',
    padding: theme.spacing(1),
    '&:hover': {
      background: theme.color.grey.tertiary,
    },
    '&.checked': {
      background: theme.color.blue.six,
    },
  },
}))

export default InputFilterSearchCheckbox
