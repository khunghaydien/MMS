import { LangConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { getProjectStaff } from '@/modules/project/reducer/thunk'
import { commonSelector, CommonState } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
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
  value: OptionItem[] | OptionItem
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem[]) => void
  error?: boolean
  errorMessage?: string
  uniqueKey?: string
  label?: any
  required?: boolean
  disabled?: boolean
  projectId: string
  multiple?: boolean
  isSubProjectManager?: boolean
}

const initialParams = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: LIMIT_DEFAULT_SELECT,
}

const formatProjectManager = (item: any) => {
  return {
    id: item.id.toString(),
    value: item.id.toString(),
    label: item.name,
    description: item.email,
  }
}

const SelectMember = ({
  width = '100%',
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  disabled = false,
  projectId = '',
  multiple = true,
}: IProps) => {
  const classes = useStyles()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()

  const { totalProjectManagers }: CommonState = useSelector(commonSelector)

  const [params, setParams] = useState(initialParams)
  const [loading, setLoading] = useState(false)
  const [listProjectManagersLocal, setListProjectManagersLocal] = useState<
    any[]
  >([])

  const checkScrollLoading = useMemo(() => {
    if (!listProjectManagersLocal?.length) return false
    const totalPages = Math.ceil(totalProjectManagers / params.pageSize)
    return params.pageNum < totalPages
  }, [params, listProjectManagersLocal])

  const getListProjectManagersApi = (queryParams: any = {}) => {
    const _params = {
      ...queryParams,
      sortBy: 'name',
      orderBy: 'asc',
      projectId: projectId,
    }
    setLoading(true)
    dispatch(getProjectStaff({ ..._params }))
      .unwrap()
      .then(res => {
        if (queryParams.pageNum > PAGE_CURRENT_DEFAULT) {
          setListProjectManagersLocal([
            ...listProjectManagersLocal,
            ...res.data.content.map(formatProjectManager),
          ])
        } else {
          setListProjectManagersLocal(
            res.data.content.map(formatProjectManager)
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
    if (projectId) {
      getListProjectManagersApi(params)
    }
  }, [params, projectId])

  const handleSelectAll = useCallback(() => {
    if (!disabled) onChange(listProjectManagersLocal)
  }, [listProjectManagersLocal, disabled])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <Box className={classes.formSelect}>
          <AutoCompleteSearchCustom
            multiple={multiple}
            disabled={disabled}
            placeholder={disabled ? '' : i18nProject('PLH_SELECTED_OT_MEMBER')}
            listOptions={listProjectManagersLocal}
            onChange={handleChange}
            onInputChange={handleInputChange}
            value={value}
            error={error}
            errorMessage={errorMessage}
            width={width}
            loading={loading}
            onScroll={handleScroll}
            numberEllipsis={35}
          />
        </Box>
        <Box
          onClick={handleSelectAll}
          className={clsx(
            !disabled ? classes.formSelectAll : classes.formSelectAllDisable
          )}
        >
          Select All Members
        </Box>
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
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  formSelect: {
    width: '100%',
  },
  formSelectAll: {
    width: '161px',
    color: theme.color.blue.primary,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  formSelectAllDisable: {
    whiteSpace: 'nowrap',
    opacity: '0.7',
  },
}))

export default memo(SelectMember)
