import { LangConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { getStaffsAssignment, getStaffsHeadCount } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { sortAtoZChartArray } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import { debounce, isEmpty } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import AutoCompleteSearchCustom from '../common/AutoCompleteSearchCustom'
import InputTitle from '../common/InputTitle'

interface IProps {
  value: OptionItem | null
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem) => void
  placeholder?: string
  error?: boolean
  errorMessage?: any
  uniqueKey?: string
  label?: any
  required?: boolean
  queries?: any
  disabled?: boolean
  isShowEffortUsed?: boolean
  blockStaff?: string | number
  callback?: Function
  customZIndex?: boolean
  staffIdsIgnore?: string[]
  isDesEmailAndPosition?: boolean
  isQueries?: boolean
  numberEllipsis?: number
  isStaffAssignment?: boolean
  staffCodesIgnore?: string[]
  useStaffCode?: boolean
}

const initialParams = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: LIMIT_DEFAULT_SELECT,
  keyword: '',
  sortBy: 'name',
  orderBy: 'asc',
}
const emptyObject = {}

const SelectStaff = ({
  width = '100%',
  value = emptyObject,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  placeholder = '',
  required = false,
  queries = emptyObject,
  disabled = false,
  isShowEffortUsed = false,
  blockStaff,
  callback,
  customZIndex,
  staffIdsIgnore = [],
  isDesEmailAndPosition = false,
  isQueries = false,
  numberEllipsis,
  isStaffAssignment,
  staffCodesIgnore = [],
  useStaffCode,
}: IProps) => {
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const [params, setParams] = useState({ ...initialParams })
  const [loading, setLoading] = useState<boolean>(false)
  const [listStaffLocal, setListStaffLocal] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)

  const listOptions: OptionItem[] = useMemo(() => {
    if (!listStaffLocal || !listStaffLocal.length) return []
    let _listOptions = listStaffLocal.map((item: any) => ({
      ...item,
      label: isShowEffortUsed
        ? `${
            item?.staffType?.name
              ? `[${item?.staffType?.name.toUpperCase()}]`
              : ''
          } ${item.name} - ${item.effortUsedInMonth}% Used`
        : item.name,
      value: item.id,
      id: item.id,
      description: isDesEmailAndPosition
        ? `${
            item?.partner?.abbreviation
              ? `${item?.partner?.abbreviation} - `
              : ''
          }${item?.email || ''} - ${item?.positionName}`
        : `${
            item?.partner?.abbreviation ? `${item?.partner?.abbreviation}` : ''
          }${item?.email && item?.partner?.abbreviation ? ' - ' : ''}${
            item?.email || ''
          }`,
    }))
    let listOptionsBlockStaff = blockStaff
      ? _listOptions.filter(
          (item: OptionItem) => item.code != blockStaff && item.id != blockStaff
        )
      : _listOptions
    if (!!staffIdsIgnore.length) {
      return listOptionsBlockStaff.filter(
        (item: OptionItem) =>
          !staffIdsIgnore.includes(item.value?.toString() || '*')
      )
    } else if (!!staffCodesIgnore.length) {
      return listOptionsBlockStaff.filter(
        (item: OptionItem) =>
          !staffCodesIgnore.includes(item.code?.toString() || '*')
      )
    } else {
      return sortAtoZChartArray(listOptionsBlockStaff)
    }
  }, [listStaffLocal, blockStaff, staffCodesIgnore])

  const listOptionsWithStaffCode = useMemo(() => {
    return listOptions.map(staff => ({
      ...staff,
      label: `${staff?.code} - ${staff?.label}`,
    }))
  }, [listOptions])

  const debounceFn = useCallback(debounce(handleDebounceFn, INPUT_TIME_DELAY), [
    params,
  ])

  function handleDebounceFn(keyword: string) {
    const _params = {
      ...params,
      ...queries,
      pageNum: PAGE_CURRENT_DEFAULT,
      keyword,
    }
    setParams(_params)
    getListStaffApi(_params)
  }

  const getListStaffApi = (queryParams: any = {}) => {
    const _params = {
      ...queryParams,
    }
    setTimeout(() => {
      setLoading(true)
    })
    dispatch(
      !!callback
        ? callback({ ..._params })
        : isStaffAssignment
        ? getStaffsAssignment({ ..._params })
        : getStaffsHeadCount({ ..._params })
    )
      .unwrap()
      .then((res: AxiosResponse) => {
        if (queryParams.pageNum > PAGE_CURRENT_DEFAULT) {
          setListStaffLocal((prev: any[]) => [
            ...prev,
            ...(res.data.content || res.data),
          ])
          setTotal(res.data.totalElements || 0)
        } else {
          setListStaffLocal(res.data.content || res.data)
          setTotal(res.data.totalElements || 0)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const checkScrollLoading = useMemo(() => {
    if (!listStaffLocal?.length) return false
    const totalPages = Math.ceil(total / params.pageSize)
    return params.pageNum < totalPages
  }, [params, listStaffLocal])

  const handleChange = (value: any) => {
    onChange(value || {})
  }

  const handleInputChange = useCallback(
    (valueSearch: string) => {
      if (isEmpty(valueSearch)) {
        debounceFn('')
      } else {
        debounceFn(valueSearch)
      }
    },
    [queries, params, listStaffLocal]
  )

  const handleScroll = (event: any) => {
    const listboxNode = event.currentTarget

    const position = listboxNode.scrollTop + listboxNode.clientHeight
    if (
      listboxNode.scrollHeight - position <= 1 &&
      !loading &&
      checkScrollLoading
    ) {
      getListStaffApi({ ...params, ...queries, pageNum: params.pageNum + 1 })
      setParams((prev: any) => ({
        ...prev,
        pageNum: prev.pageNum + 1,
      }))
    }
  }

  useEffect(() => {
    if (isQueries && queries) {
      setParams({ ...params, ...queries })
      setListStaffLocal([])
      getListStaffApi({ ...params, ...queries })
    }
  }, [isQueries, queries])

  useEffect(() => {
    if (!isQueries) {
      setParams({ ...params })
      getListStaffApi({ ...params })
    }
  }, [])

  return (
    <Box className={clsx(classes.rootFormItem)} style={{ width }}>
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          multiple={false}
          placeholder={
            placeholder ? placeholder : i18Common('PLH_SELECT_STAFF')
          }
          disabled={disabled}
          listOptions={useStaffCode ? listOptionsWithStaffCode : listOptions}
          onChange={handleChange}
          onInputChange={handleInputChange}
          onScroll={handleScroll}
          value={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
          isCustomFilter
          loading={loading}
          customZIndex={customZIndex}
          numberEllipsis={numberEllipsis}
        />
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: 14,
  },
  formContent: {
    width: '100%',
  },
}))

export default memo(SelectStaff)
