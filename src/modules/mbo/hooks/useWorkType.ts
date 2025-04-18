import { CommonState, commonSelector, getWorkTypeMbo } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useWorkType = (evaluationCycleId?: string, isMasterData?: boolean) => {
  const dispatch = useDispatch<AppDispatch>()
  const { workTypes }: CommonState = useSelector(commonSelector)

  useEffect(() => {
    dispatch(
      getWorkTypeMbo({
        isMasterData: isMasterData === undefined ? true : isMasterData,
        evaluationCycleId,
      })
    )
  }, [isMasterData])

  return [workTypes]
}
export default useWorkType
