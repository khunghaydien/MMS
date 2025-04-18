import CardForm from '@/components/Form/CardForm'
import { FieldListOptions } from '@/components/Form/CardForm/CardFormModeView'
import NoData from '@/components/common/NoData'
import { LangConstant } from '@/const'
import { formatDate } from '@/utils'
import { Box } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { CycleState, cycleSelector } from '../../reducer/cycle'
import CycleUpdateInformation from './CycleUpdateInformation'

interface IProps {
  loadingInformation: boolean
}

const CycleInformation = ({ loadingInformation }: IProps) => {
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { evaluationCycle }: CycleState = useSelector(cycleSelector)

  const [isUpdateInformation, setIsUpdateInformation] = useState(false)

  const fieldViewListOptions = [
    {
      id: 1,
      value: evaluationCycle.name,
      label: i18Mbo('LB_CYCLE_NAME') || '',
    },
    {
      id: 2,
      value: `${evaluationCycle.duration} ${i18('LB_MONTHS')}`,
      label: i18('LB_DURATION') || '',
    },
    {
      id: 3,
      value: formatDate(evaluationCycle.startDate),
      label: i18('LB_START_DATE') || '',
    },
    {
      id: 4,
      value: formatDate(evaluationCycle.endDate),
      label: i18('LB_END_DATE') || '',
    },
    {
      id: 5,
      value: 'All',
      label: i18Mbo('LB_POSITIONS_APPLIED') || '',
    },
  ]

  return (
    <CardForm
      title={i18Mbo('TXT_CYCLE_INFORMATION')}
      useDeleteIcon={false}
      buttonUseDetailEditDisabled={false}
      useDetailViewMode={false}
      useDetailEditMode={false}
      onCancelEditMode={() => {
        setIsUpdateInformation(false)
      }}
      onOpenEditMode={() => {
        setIsUpdateInformation(true)
      }}
      onSaveAs={() => {
        setIsUpdateInformation(false)
      }}
      onDeleteIconClick={() => {}}
      isLoading={loadingInformation}
    >
      {!isUpdateInformation && (
        <Box>
          {!!evaluationCycle?.id ? (
            <FieldListOptions
              dataRendering={fieldViewListOptions}
              isVertical={false}
            />
          ) : (
            <NoData />
          )}
        </Box>
      )}
      {isUpdateInformation && <CycleUpdateInformation />}
    </CardForm>
  )
}

export default CycleInformation
