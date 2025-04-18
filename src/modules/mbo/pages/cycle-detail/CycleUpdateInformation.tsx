import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import {
  CommonState,
  commonSelector,
  getPositionBranch,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box } from '@mui/material'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DURATION_DEFAULT } from '../../const'
import { getDurations } from '../../reducer/evaluation-process'

const CycleUpdateInformation = () => {
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const dispatch = useDispatch<AppDispatch>()
  const { listPositionBranch }: CommonState = useSelector(commonSelector)
  const [listDurations, setListDurations] = useState<OptionItem[]>([])
  useEffect(() => {
    dispatch(getPositionBranch({}))
  }, [])

  useEffect(() => {
    dispatch(getDurations(DURATION_DEFAULT))
      .unwrap()
      .then(res => {
        setListDurations(
          res.data.map((item: number) => ({
            id: item.toString(),
            label: item.toString(),
            value: item.toString(),
          }))
        )
      })
  }, [])
  return (
    <form>
      <Box className={clsx('scrollbar')}>
        <FormLayout gap={24}>
          <FormItem>
            <InputTextLabel
              required
              maxLength={100}
              error={false}
              errorMessage={''}
              keyName="name"
              label={i18Mbo('LB_CYCLE_NAME')}
              placeholder={i18('PLH_SELECT', {
                labelName: i18Mbo('LB_CYCLE_NAME'),
              })}
              value={''}
              onChange={() => {}}
            />
          </FormItem>
          <FormItem required label={i18('LB_START_DATE')}>
            <InputDatepicker
              views={['day', 'month', 'year']}
              isShowClearIcon={true}
              disabled={false}
              inputFormat={'DD/MM/YYYY'}
              value={1684986345376}
              error={false}
              errorMessage={''}
              width={'100%'}
              onChange={(value: Date) => {}}
            />
          </FormItem>
          <FormItem required label={i18('LB_END_DATE')}>
            <InputDatepicker
              views={['day', 'month', 'year']}
              isShowClearIcon={true}
              disabled={false}
              inputFormat={'DD/MM/YYYY'}
              value={1684986345376}
              error={false}
              errorMessage={''}
              width={'100%'}
              onChange={(value: Date) => {}}
            />
          </FormItem>
        </FormLayout>
        <FormLayout gap={24} top={24}>
          <InputDropdown
            keyName="duration"
            label={i18('LB_DURATION')}
            placeholder={i18('PLH_SELECT', {
              labelName: i18('LB_DURATION'),
            })}
            width={260}
            value={''}
            listOptions={listDurations}
            onChange={() => {}}
          />
          <FormItem required label={i18Mbo('LB_POSITION_APPLIED')}>
            <AutoCompleteSearchCustom
              multiple
              error={false}
              errorMessage={''}
              placeholder={i18('PLH_SELECT', {
                labelName: i18Mbo('LB_POSITION_APPLIED'),
              })}
              value={{}}
              listOptions={listPositionBranch}
              onChange={() => {}}
            />
          </FormItem>
        </FormLayout>
      </Box>
    </form>
  )
}

export default CycleUpdateInformation
