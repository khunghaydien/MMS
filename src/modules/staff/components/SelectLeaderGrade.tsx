import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import { commonSelector, CommonState, getLeaderGrades } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface SelectLeaderGradeProps {
  value: string
  gradeId: string
  positionId: string
  required?: boolean
  disabled?: boolean
  onChange: (value: string) => void
}

const SelectLeaderGrade = ({
  required,
  positionId,
  gradeId,
  value,
  onChange,
  disabled,
}: SelectLeaderGradeProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)

  const { listLeaderGrades }: CommonState = useSelector(commonSelector)

  useEffect(() => {
    if (positionId && gradeId) {
      dispatch(getLeaderGrades({ positionId, gradeId }))
    }
  }, [positionId, gradeId])

  return (
    <InputDropdown
      keyName="leaderGradeId"
      heightDropdown={300}
      isDisable={disabled || !listLeaderGrades.length}
      required={required}
      label={i18Staff('LB_LEADER_GRADE')}
      placeholder={i18Staff('PLH_SELECT_LEADER_GRADE')}
      value={value}
      listOptions={listLeaderGrades}
      onChange={onChange}
    />
  )
}

export default SelectLeaderGrade
