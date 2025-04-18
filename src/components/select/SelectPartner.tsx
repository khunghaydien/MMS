import { LangConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  commonSelector,
  CommonState,
  getCommonPartners,
  getOutsourcePartners,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import _ from 'lodash'
import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import AutoCompleteSearchCustom from '../common/AutoCompleteSearchCustom'
import InputTitle from '../common/InputTitle'

interface IProps {
  keyName?: string
  value: any
  width?: number | string
  onChange: (value: OptionItem[] | OptionItem, keyName?: string) => void
  error?: boolean
  errorMessage?: string
  uniqueKey?: string
  label?: any
  placeholder?: string
  required?: boolean
  isProject?: boolean
  multiple?: boolean
  disabled?: boolean
  isOutsource?: boolean
  numberEllipsis?: number
}

const initialParams = {
  pageNum: PAGE_CURRENT_DEFAULT,
  pageSize: 0,
}

const SelectPartner = ({
  width = '100%',
  value,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  isProject,
  keyName = 'partnerId',
  multiple = true,
  placeholder,
  disabled = false,
  isOutsource = false,
  numberEllipsis,
}: IProps) => {
  const classes = useStyles()
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const dispatch = useDispatch<AppDispatch>()

  const { listCommonPartners }: CommonState = useSelector(commonSelector)

  const [params, setParams] = useState(initialParams)
  const [loading, setLoading] = useState(false)

  const getListPartnersApi = (queryParams: any = {}) => {
    const _params = {
      ...queryParams,
      isProject,
    }
    setLoading(true)
    if (isOutsource) {
      dispatch(getOutsourcePartners({ ..._params }))
        .unwrap()
        .finally(() => setLoading(false))
    } else {
      dispatch(getCommonPartners({ ..._params }))
        .unwrap()
        .finally(() => setLoading(false))
    }
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
    getListPartnersApi(_params)
  }

  const handleChange = (value: any) => {
    onChange(value, keyName)
  }

  const handleInputChange = (valueSearch: string) => {
    debounceFn(valueSearch)
  }

  useEffect(() => {
    if (!listCommonPartners.length) {
      getListPartnersApi()
    }
  }, [])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      <InputTitle
        title={label || i18Common('LB_PARTNER')}
        required={required}
      />
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          disabled={disabled}
          multiple={multiple}
          placeholder={placeholder || i18Common('PLH_SELECT_PARTNER')}
          listOptions={listCommonPartners}
          onChange={handleChange}
          onInputChange={handleInputChange}
          value={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
          loading={loading}
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

export default memo(SelectPartner)
