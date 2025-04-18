import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import DeleteIcon from '@/components/icons/DeleteIcon'
import InputCurrency from '@/components/inputs/InputCurrency'
import { LangConstant } from '@/const'
import { Installment } from '@/types'
import { convertTimestampToDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface InstallmentFieldProps {
  value: Installment
  error: boolean
  dateRequired?: boolean
  percentRequired?: boolean
  disableDelete: boolean
  position: number
  errorMessage: { date: string; percentage: string }
  contractStartDate: number | null
  contractEndDate: number | null
  onDelete: (installmentNo: string | number) => void
  onPercentageChange: (
    value?: string,
    keyName?: string,
    valueTemp?: string | number | undefined
  ) => void
  onDateChange: (dateSelected: Date | null) => void
}

const InstallmentField = ({
  value,
  error,
  dateRequired = false,
  percentRequired = false,
  disableDelete,
  position,
  errorMessage,
  onDelete,
  onPercentageChange,
  onDateChange,
  contractStartDate,
  contractEndDate,
}: InstallmentFieldProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  useEffect(() => {
    const dateValidation = () => {
      if (contractStartDate && contractEndDate && value.date) {
        if (contractStartDate > value.date) {
          onDateChange(null)
        }
        if (contractEndDate < value.date) {
          onDateChange(null)
        }
      }
    }
    dateValidation()
  }, [contractStartDate, value.date, contractEndDate])

  return (
    <Box className={classes.rootInstallmentField}>
      <Box className={classes.label}>{`${i18Contract(
        'LB_INSTALLMENT'
      )} #${position}`}</Box>
      <Box className={classes.inputContainer}>
        <InputDatepicker
          useResetOnErrorMui
          minDate={contractStartDate}
          maxDate={contractEndDate}
          width={'100%'}
          required={dateRequired}
          error={error && !!errorMessage?.date}
          errorMessage={errorMessage && errorMessage?.date}
          label={i18('LB_DATE')}
          placeholder={i18('PLH_SELECT_DATE') as string}
          value={convertTimestampToDate(value.date)}
          onChange={onDateChange}
          disabled={!(contractStartDate && contractEndDate)}
        />
        <InputCurrency
          maxLength={8}
          required={percentRequired}
          error={error && !!errorMessage?.percentage}
          errorMessage={errorMessage && errorMessage?.percentage}
          label={i18Contract('LB_PERCENTAGE')}
          placeholder={i18Contract('PLH_INPUT_PERCENTAGE')}
          keyName="percentage"
          value={value.percentage}
          onChange={onPercentageChange}
          suffix="%"
        />
        <ConditionalRender conditional={!disableDelete}>
          <Box className={classes.DeleteIcon}>
            <DeleteIcon onClick={() => onDelete(value.installmentNo)} />
          </Box>
        </ConditionalRender>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInstallmentField: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
  },
  DeleteIcon: {
    cursor: 'pointer',
    color: theme.color.grey.primary,
    marginTop: theme.spacing(4),
  },
  label: {
    color: theme.color.blue.primary,
    fontWeight: 700,
  },
}))

export default InstallmentField
