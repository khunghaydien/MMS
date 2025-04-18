import FormItem from '@/components/Form/FormItem/FormItem'
import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import { LangConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { OptionItem } from '@/types'
import { removeVietnameseTones } from '@/utils'
import { debounce, isEmpty } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  projectId?: string
  value?: string
  error: string | undefined
  touched: boolean | undefined
  appraisers: OptionItem[]
  setFieldValue: (value: any) => void
  disabled?: boolean
}

const SelectEmployees = ({
  value,
  error,
  touched,
  setFieldValue,
  appraisers,
  disabled,
}: IProps) => {
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const [appraiserSelected, setAppraiserSelected] = useState<OptionItem>({})
  const [loadingAppraisers, setLoadingAppraisers] = useState(false)
  const [valueSearch, setValueSearch] = useState('')

  const appraiserList = useMemo(
    () =>
      appraisers?.filter(
        item =>
          removeVietnameseTones(item?.label)
            ?.toLowerCase()
            .includes(
              removeVietnameseTones(valueSearch.toLowerCase())?.trim()
            ) ||
          item?.code
            ?.toString()
            ?.toLowerCase()
            .includes(valueSearch.toLowerCase()?.trim())
      ),
    [appraisers, valueSearch]
  )

  const handleSearch = useCallback((valueSearch: string) => {
    if (isEmpty(valueSearch)) {
      debounceFn('')
    } else {
      debounceFn(valueSearch)
    }
  }, [])

  const debounceFn = useCallback(
    debounce(handleDebounceFn, INPUT_TIME_DELAY),
    []
  )

  function handleDebounceFn(keyword: string) {
    setValueSearch(keyword)
  }

  useEffect(() => {
    let appraiser: OptionItem | undefined = undefined
    appraiser = appraiserList?.find(item => item.id == value + '')
    if (!!appraiser) {
      setAppraiserSelected(appraiser)
    } else if (!valueSearch) {
      setAppraiserSelected({})
    }
  }, [value, appraiserList])

  useEffect(() => {
    setLoadingAppraisers(true)
    if (appraiserList?.length || (valueSearch && appraiserList?.length == 0)) {
      setLoadingAppraisers(false)
    }
  }, [appraiserList, valueSearch])

  return (
    <FormItem label={i18Mbo('LB_APPRAISER')} required>
      <AutoCompleteSearchCustom
        disabled={disabled}
        width={260}
        loading={loadingAppraisers}
        multiple={false}
        placeholder={i18('PLH_SELECT', {
          labelName: i18Mbo('LB_APPRAISER'),
        })}
        value={appraiserSelected}
        listOptions={appraiserList ? appraiserList : []}
        error={!!error && touched}
        errorMessage={error}
        onChange={(value: OptionItem) => {
          setFieldValue(value?.id || '')
          setAppraiserSelected(value)
        }}
        onInputChange={handleSearch}
      />
    </FormItem>
  )
}

export default SelectEmployees
