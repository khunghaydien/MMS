import { INPUT_TIME_DELAY } from '@/const/app.const'
import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { commonSelector, CommonState, getProjects } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { IProject, OptionItem } from '@/types'
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
  value: any
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem[]) => void
  error?: boolean
  errorMessage?: string
  uniqueKey?: string
  label?: any
  required?: boolean
  disabled?: boolean
  multiple?: boolean
  numberEllipsis?: number
}

const initialParams = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: LIMIT_DEFAULT_SELECT,
}

const formatProject = (item: IProject) => {
  return {
    id: item.id.toString(),
    value: item.id.toString(),
    label: item.name,
    description: item.email,
  }
}

const SelectAutoCompleteProject = ({
  width = '100%',
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  disabled = false,
  multiple = true,
  numberEllipsis,
}: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const { totalProjects }: CommonState = useSelector(commonSelector)

  const [params, setParams] = useState(initialParams)
  const [loading, setLoading] = useState(false)
  const [listProjectsLocal, setListProjectsLocal] = useState<any[]>([])

  const checkScrollLoading = useMemo(() => {
    if (!listProjectsLocal?.length) return false
    const totalElement = totalProjects
    const totalPages = Math.ceil(totalElement / params.pageSize)
    return params.pageNum < totalPages
  }, [params, listProjectsLocal])

  const getListProjectsApi = (queryParams: any = {}) => {
    const _params = {
      ...queryParams,
      sortBy: 'name',
      orderBy: 'asc',
    }
    setLoading(true)
    dispatch(getProjects({ ..._params }))
      .unwrap()
      .then(res => {
        if (queryParams.pageNum > PAGE_CURRENT_DEFAULT) {
          setListProjectsLocal([
            ...listProjectsLocal,
            ...res.data.content.map(formatProject),
          ])
        } else {
          setListProjectsLocal(res.data.content.map(formatProject))
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
    getListProjectsApi(params)
  }, [params])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          multiple={multiple}
          disabled={disabled}
          placeholder={i18('PLH_SELECT_PROJECT')}
          listOptions={listProjectsLocal}
          onChange={handleChange}
          onInputChange={handleInputChange}
          value={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
          loading={loading}
          onScroll={handleScroll}
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

export default memo(SelectAutoCompleteProject)
