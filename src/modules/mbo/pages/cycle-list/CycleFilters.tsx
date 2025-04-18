import FormItem from '@/components/Form/FormItem/FormItem'
import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import FilterList from '@/components/common/FilterList'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputSearch from '@/components/inputs/InputSearch'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DURATION_DEFAULT, LIST_STATUS_CYCLE } from '../../const'
import { CycleQueryString } from '../../models'
import { cycleSelector, setCycleQueryString } from '../../reducer/cycle'
import { getDurations } from '../../reducer/evaluation-process'

const initDataFilter = { positions: [], duration: '', status: [], name: '' }
const CycleFilters = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const { cycleQueryString } = useSelector(cycleSelector)

  const [listDurations, setListDurations] = useState<OptionItem[]>([])
  const [filters, setFilters] = useState<CycleQueryString>(initDataFilter)
  const [valueSearch, setValueSearch] = useState('')
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const isActiveButtonFilter = useMemo(
    () =>
      !!filters.duration ||
      !!cycleQueryString.duration ||
      !!filters.positions?.length ||
      !!cycleQueryString.positions?.length ||
      !!filters.status?.length ||
      !!cycleQueryString.status?.length,
    [filters, cycleQueryString]
  )

  const handleNavigateToAddPage = () => {
    navigate(PathConstant.MBO_CYCLE_CREATE)
  }

  const debounceFn = useCallback(debounce(handleDebounceFn, INPUT_TIME_DELAY), [
    cycleQueryString,
    filters,
  ])

  function handleDebounceFn(value: string) {
    const newQueryString = {
      ...filters,
      name: value,
    }
    setFilters(newQueryString)
    dispatch(
      setCycleQueryString({
        ...cycleQueryString,
        ...newQueryString,
        pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
        pageSize: TableConstant.LIMIT_DEFAULT,
      })
    )
  }

  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handleFilter = () => {
    dispatch(
      setCycleQueryString({
        ...cycleQueryString,
        ...filters,
        name: cycleQueryString.name,
      })
    )
  }

  const handleClearFilter = () => {
    dispatch(
      setCycleQueryString({
        ...cycleQueryString,
        ...initDataFilter,
        name: cycleQueryString.name,
      })
    )
    setFilters(initDataFilter)
  }

  const handleToggleFilter = (isOpen: boolean) => {
    setIsOpenFilter(isOpen)
  }

  const handleInputDropdownChange = (value: OptionItem[], keyName?: string) => {
    setFilters({
      ...filters,
      [keyName || '']: value,
    })
  }

  const handleChangeDuration = (value?: string) => {
    setFilters({
      ...filters,
      duration: value,
    })
  }

  useEffect(() => {
    setValueSearch(cycleQueryString.name || '')
    setFilters(cycleQueryString)
  }, [])

  useEffect(() => {
    dispatch(getDurations(DURATION_DEFAULT))
      .unwrap()
      .then(res => {
        setListDurations(
          res.data.map((item: number) => ({
            id: item.toString(),
            label: `${item} ${i18next.t('common:LB_MONTHS')}`,
            value: item.toString(),
          }))
        )
      })
  }, [])

  return (
    <Box className={classes.cycleFilters}>
      <Box className={classes.flexGap24}>
        <InputSearch
          placeholder={`${i18('LB_SEARCH')} ${i18Mbo('LB_CYCLE_NAME')}`}
          label={i18('LB_SEARCH')}
          value={valueSearch || ''}
          onChange={handleSearchChange}
        />
        <FilterList
          title={i18Mbo('TXT_FILTER_CYCLE_LIST')}
          clearDisabled={!isActiveButtonFilter}
          submitDisabled={!isActiveButtonFilter}
          onSubmit={handleFilter}
          onClear={handleClearFilter}
          onToggleFilter={handleToggleFilter}
        >
          {isOpenFilter ? (
            <Box className={classes.fieldFilters}>
              <InputDropdown
                keyName="duration"
                label={i18('LB_DURATION')}
                placeholder={i18('PLH_SELECT', {
                  labelName: i18('LB_DURATION'),
                })}
                width={288}
                value={filters.duration || ''}
                listOptions={listDurations}
                onChange={handleChangeDuration}
              />
              <FormItem label={i18('LB_STATUS')}>
                <AutoCompleteSearchCustom
                  multiple
                  width={288}
                  keyName="status"
                  placeholder={i18('PLH_SELECT', {
                    labelName: i18('LB_STATUS'),
                  })}
                  value={filters.status || []}
                  listOptions={LIST_STATUS_CYCLE}
                  onChange={handleInputDropdownChange}
                />
              </FormItem>
            </Box>
          ) : (
            <Box />
          )}
        </FilterList>
      </Box>
      <Box className={classes.rightActions}>
        <ButtonAddWithIcon onClick={handleNavigateToAddPage}>
          {i18Mbo('LB_CREATE_NEW_CYCLE')}
        </ButtonAddWithIcon>
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  cycleFilters: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  flexGap24: {
    display: 'flex',
    gap: theme.spacing(3),
    flexWrap: 'wrap',
  },
  fieldFilters: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  rightActions: {
    display: 'flex',
    gap: theme.spacing(3),
  },
}))
export default CycleFilters
