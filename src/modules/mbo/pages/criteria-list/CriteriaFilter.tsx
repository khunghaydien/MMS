import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import FilterList from '@/components/common/FilterList'
import InputSearch from '@/components/inputs/InputSearch'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import CommonService from '@/services/common.service'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import InputDropdown from '@/components/inputs/InputDropdown'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { AppDispatch } from '@/store'
import { debounce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import useWorkType from '../../hooks/useWorkType'
import { CriteriaQueryString } from '../../models'
import {
  CriteriaState,
  criteriaSelector,
  setCriteriaQueryString,
} from '../../reducer/criteria'

interface IFilterData {
  type: string
  name: string
  positionId: string
}

const CriteriaFilter = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const { criteriaQueryString }: CriteriaState = useSelector(criteriaSelector)

  const [valueSearch, setValueSearch] = useState(criteriaQueryString.name || '')
  const [flagFilter, setFlagFilter] = useState(false)
  const [positionOptionsList, setPositionOptionsList] = useState<OptionItem[]>(
    []
  )
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [filters, setFilters] = useState<CriteriaQueryString>({
    type: criteriaQueryString.type || '',
    positionId: criteriaQueryString.positionId || '',
  })
  const [listWorkTypes] = useWorkType()
  const isButtonClearDisabled = useMemo(
    () => !filters.type && !filters.positionId,
    [filters]
  )

  const handleFilter = () => {
    setFlagFilter(true)
    dispatch(
      setCriteriaQueryString({
        ...criteriaQueryString,
        type: filters.type,
        positionId: filters.positionId,
        pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
        pageSize: TableConstant.LIMIT_DEFAULT,
      })
    )
  }

  const handleClearFilter = () => {
    setFilters({
      type: '',
      positionId: '',
      name: filters.name,
    })
    if (flagFilter) {
      dispatch(
        setCriteriaQueryString({
          name: filters.name,
          type: '',
          positionId: '',
          pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
          pageSize: TableConstant.LIMIT_DEFAULT,
        })
      )
    }
  }

  const handleToggleFilter = (isOpen: boolean) => {
    setIsOpenFilter(isOpen)
  }

  const debounceFn = useCallback(debounce(handleDebounceFn, INPUT_TIME_DELAY), [
    criteriaQueryString,
  ])

  function handleDebounceFn(value: string) {
    const newQueryString = {
      ...criteriaQueryString,
      name: value,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setCriteriaQueryString(newQueryString))
  }

  const handleNavigateToAddPage = () => {
    navigate(PathConstant.MBO_CRITERIA_CREATE)
  }

  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handleInputDropdownChange = (
    value: string,
    _?: OptionItem,
    keyName?: string
  ) => {
    setFilters({
      ...filters,
      [keyName || '']: value,
    })
  }

  const getPositionBranch = async () => {
    const res = await CommonService.getPositionBranch()
    setPositionOptionsList(
      res.data.map((ps: OptionItem) => ({
        id: ps.id,
        value: ps.id,
        label: ps.name,
      }))
    )
  }

  useEffect(() => {
    getPositionBranch()
  }, [])

  useEffect(() => {
    if (!isButtonClearDisabled) {
      setFlagFilter(true)
    }
  }, [])

  return (
    <Box className={classes.criteriaFilters}>
      <Box className={classes.flexGap24}>
        <InputSearch
          placeholder={i18Mbo('LB_CRITERIA_GROUP')}
          label={i18('LB_SEARCH')}
          value={valueSearch}
          onChange={handleSearchChange}
        />
        <FilterList
          title={i18Mbo('TXT_FILTER_CRITERIA_LIST')}
          clearDisabled={isButtonClearDisabled}
          onSubmit={handleFilter}
          onClear={handleClearFilter}
          onToggleFilter={handleToggleFilter}
        >
          {isOpenFilter ? (
            <Box className={classes.fieldFilters}>
              <InputDropdown
                keyName="type"
                label={i18Mbo('LB_CRITERIA_TYPE')}
                placeholder={i18('PLH_SELECT', {
                  labelName: i18Mbo('LB_CRITERIA_TYPE'),
                })}
                width={260}
                value={filters.type || ''}
                listOptions={listWorkTypes}
                onChange={handleInputDropdownChange}
              />
              <InputDropdown
                keyName="positionId"
                label={i18Mbo('LB_POSITION_APPLIED')}
                placeholder={i18('PLH_SELECT', {
                  labelName: i18Mbo('LB_POSITION_APPLIED'),
                })}
                value={filters.positionId || ''}
                width={260}
                listOptions={positionOptionsList}
                onChange={handleInputDropdownChange}
              />
            </Box>
          ) : (
            <Box />
          )}
        </FilterList>
      </Box>

      <Box className={classes.rightActions}>
        <ButtonAddWithIcon onClick={handleNavigateToAddPage}>
          {i18Mbo('LB_CREATE_NEW_CRITERIA')}
        </ButtonAddWithIcon>
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  criteriaFilters: {
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
export default CriteriaFilter
