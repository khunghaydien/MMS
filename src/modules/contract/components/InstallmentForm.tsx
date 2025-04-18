import ConditionalRender from '@/components/ConditionalRender'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import InputErrorMessage from '@/components/common/InputErrorMessage'
import { LangConstant } from '@/const'
import { Installment } from '@/types'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InstallmentField from './InstallmentField'

interface InstallmentFormProps {
  maxInstallmentField?: number
  value: Installment[]
  onChange: (value: Installment[]) => void
  errorMessage: { date: string; percentage: string }[]
  error: boolean
  dateRequired?: boolean
  percentRequired?: boolean
  contractStartDate: number | null
  contractEndDate: number | null
  percentageError: boolean
}

const InstallmentForm = ({
  value,
  errorMessage,
  error,
  onChange,
  maxInstallmentField = 10,
  dateRequired = false,
  percentRequired = false,
  contractStartDate,
  contractEndDate,
  percentageError,
}: InstallmentFormProps) => {
  const classes = useStyles()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const [installmentList, setInstallmentList] = useState<Installment[]>(value)

  const handleAddInstallment = () => {
    const tempInstallment: Installment = {
      id: uuid(),
      installmentNo: installmentList.length + 1,
      date: null,
      percentage: '',
    }
    onChange([...installmentList, tempInstallment])
  }

  const handleInstallmentPercentageChange = (
    index: number,
    value: string | undefined
  ) => {
    const installmentListTemp = cloneDeep(installmentList)
    installmentListTemp[index].percentage = value || ''
    onChange(installmentListTemp)
  }

  const handleDeleteInstallment = (installmentNo: number | string) => {
    const installmentListTemp = cloneDeep(installmentList).filter(
      (item: any) => item.installmentNo !== installmentNo
    )

    onChange(installmentListTemp)
  }

  const handleInstallmentDateChange = (index: number, value: Date | null) => {
    const installmentListTemp = cloneDeep(installmentList)
    installmentListTemp[index].date = value?.getTime() || null
    onChange(installmentListTemp)
  }

  const setInitialValue = () => {
    if (value.length) {
      setInstallmentList(value)
    } else {
      onChange([
        {
          installmentNo: installmentList.length + 1,
          date: null,
          percentage: '',
        },
      ])
      setInstallmentList([
        {
          installmentNo: installmentList.length + 1,
          date: null,
          percentage: '',
        },
      ])
    }
  }

  useEffect(() => {
    setInitialValue()
  }, [value])

  return (
    <Box className={classes.rootInstallmentForm}>
      {installmentList.map((item: any, index: number) => (
        <InstallmentField
          contractStartDate={contractStartDate}
          contractEndDate={contractEndDate}
          key={item.id || index}
          value={item}
          position={index + 1}
          dateRequired={dateRequired}
          percentRequired={percentRequired}
          disableDelete={installmentList.length < 2}
          error={error}
          errorMessage={
            !!errorMessage && {
              date: errorMessage[index]?.date || '',
              percentage: errorMessage[index]?.percentage || '',
            }
          }
          onDateChange={(dateSelected: Date | null) =>
            handleInstallmentDateChange(index, dateSelected)
          }
          onPercentageChange={(value: string | undefined) =>
            handleInstallmentPercentageChange(index, value)
          }
          onDelete={handleDeleteInstallment}
        />
      ))}
      <ConditionalRender conditional={percentageError}>
        <InputErrorMessage
          content={i18Contract('MSG_INSTALLMENT_PERCENTAGE_ERROR_MESSAGE')}
        />
      </ConditionalRender>
      <ConditionalRender
        conditional={installmentList.length < maxInstallmentField}
      >
        <Box>
          <ButtonAddPlus
            label={i18Contract('LB_ADD_INSTALLMENT')}
            onClick={handleAddInstallment}
          />
        </Box>
      </ConditionalRender>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInstallmentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}))

export default InstallmentForm
