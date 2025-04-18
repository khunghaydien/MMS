import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import { commonSelector, CommonState, getGrades } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface SelectGradeProps {
  value?: any
  positionId: string
  required?: boolean
  disabled?: boolean
  onChange: (value: string) => void
}

const SelectGrade = ({
  required,
  positionId,
  value,
  onChange,
  disabled,
}: SelectGradeProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)

  const { listGrades }: CommonState = useSelector(commonSelector)

  useEffect(() => {
    if (positionId) {
      dispatch(getGrades({ positionId }))
    }
  }, [positionId])

  return (
    <InputDropdown
      keyName="gradeId"
      heightDropdown={300}
      isDisable={disabled}
      required={required}
      label={i18Staff('LB_GRADE')}
      placeholder={i18Staff('PLH_SELECT_GRADE')}
      value={value}
      listOptions={listGrades}
      onChange={onChange}
    />
  )
}

export default SelectGrade
