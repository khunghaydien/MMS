import CardFormModeView from '@/components/Form/CardForm/CardFormModeView'
import StatusItem from '@/components/common/StatusItem'
import { LangConstant } from '@/const'
import { IColor, OptionItem } from '@/types'
import { countingDays } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'

interface CycleInformationSectionProps {
  dataRendering: OptionItem[]
  isLoading?: boolean
  statusItem: {
    color: IColor
    label: string
  }
}

const CycleInformationSection = ({
  dataRendering,
  isLoading,
  statusItem,
}: CycleInformationSectionProps) => {
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const classes = useStyles()
  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const numberDate = useMemo(
    () => Number(countingDays(new Date().getTime(), cycleInformation.endDate)),
    [cycleInformation]
  )
  const childrenEndHead = () => {
    return (
      <Box className={classes.wrapHeaderStatus}>
        {Number(numberDate) <= 5 && Number(numberDate) >= 1 && (
          <Box className={'notify'}>
            {Number(numberDate).toFixed(0)} {i18Mbo('LB_DAY_LEFT')}
          </Box>
        )}
        <StatusItem typeStatus={statusItem} />
      </Box>
    )
  }

  return (
    <CardFormModeView
      title={i18Mbo('TXT_CYCLE_INFORMATION') as string}
      dataRendering={dataRendering}
      isLoading={isLoading}
      isVertical={false}
      childrenEndHead={childrenEndHead()}
    />
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  wrapHeaderStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& .notify': {
      color: theme.color.orange.four,
      fontWeight: 700,
      fontSize: '1.1em',
    },
  },
}))
export default CycleInformationSection
