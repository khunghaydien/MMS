import { LangConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  commonSelector,
  CommonState,
  getSaleMemberProject,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { IProjectManager, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import _ from 'lodash'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import AutoCompleteSearchCustom from '../common/AutoCompleteSearchCustom'
import InputTitle from '../common/InputTitle'

interface IProps {
  value?: OptionItem[] | OptionItem
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem[]) => void
  error?: boolean
  errorMessage?: string
  uniqueKey?: string
  label?: any
  required?: boolean
  disabled?: boolean
  branchId: string
  multiple?: boolean
  placeholder?: string
}

const initialParams = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: LIMIT_DEFAULT_SELECT,
}

const formatSaleMemberProject = (item: IProjectManager) => {
  return {
    id: item.id.toString(),
    value: item.id.toString(),
    label: item.name,
    description: item.email,
  }
}

const SelectSaleMemberProject = ({
  width = '100%',
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  disabled = false,
  branchId = '',
  multiple = true,
  placeholder,
}: IProps) => {
  const classes = useStyles()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()

  const { totalProjectManagers }: CommonState = useSelector(commonSelector)

  const [params, setParams] = useState(initialParams)
  const [loading, setLoading] = useState(false)
  const [listSaleMember, setListProjectManagersLocal] = useState<any[]>([])

  const checkScrollLoading = useMemo(() => {
    if (!listSaleMember?.length) return false
    const totalPages = Math.ceil(totalProjectManagers / params.pageSize)
    return params.pageNum < totalPages
  }, [params, listSaleMember])

  const getSaleMemberProjectApi = (queryParams: any = {}) => {
    const _params = {
      ...queryParams,
      sortBy: 'name',
      orderBy: 'asc',
      branchId: branchId,
    }
    setTimeout(() => {
      setLoading(true)
    })
    dispatch(getSaleMemberProject(_params))
      .unwrap()
      .then(res => {
        if (queryParams.pageNum > PAGE_CURRENT_DEFAULT) {
          setListProjectManagersLocal([
            ...listSaleMember,
            ...res.data.content.map(formatSaleMemberProject),
          ])
        } else {
          setListProjectManagersLocal(
            res.data.content.map(formatSaleMemberProject)
          )
        }
      })
      .finally(() => setLoading(false))
  }

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    []
  )
  function handleDebounceFn(keyword: string) {
    const _params = {
      ...params,
      pageNum: 1,
      keyword,
    }
    setParams(_params)
  }

  const handleChange = (value: any) => {
    onChange(value)
  }

  const handleInputChange = (valueSearch: string) => {
    debounceFn(valueSearch)
  }

  const handleScroll = (event: any) => {
    const listboxNode = event.currentTarget

    const position = listboxNode.scrollTop + listboxNode.clientHeight
    if (
      listboxNode.scrollHeight - position <= 1 &&
      !loading &&
      checkScrollLoading
    ) {
      setParams((prev: any) => ({
        ...prev,
        pageNum: prev.pageNum + 1,
      }))
    }
  }

  useEffect(() => {
    if (branchId) {
      getSaleMemberProjectApi(params)
    }
  }, [params, branchId])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          multiple={multiple}
          disabled={disabled}
          placeholder={placeholder || i18nProject('PLH_SELECT_SALE_MEMBER')}
          listOptions={listSaleMember}
          onChange={handleChange}
          onInputChange={handleInputChange}
          value={value || {}}
          error={error}
          errorMessage={errorMessage}
          width={width}
          loading={loading}
          onScroll={handleScroll}
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

export default memo(SelectSaleMemberProject)
