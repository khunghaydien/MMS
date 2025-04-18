import CardForm from '@/components/Form/CardForm'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant } from '@/const'
import { TableHeaderColumn } from '@/types'
import { formatNumberToCurrencyBigInt } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

interface IProps {
  title: string
  dataList: any[]
  headConfigs: TableHeaderColumn[]
  totalCount: number
  isLoading: boolean
  totalLabel: string
}

function TableCustomerDashboard({
  title,
  dataList,
  headConfigs,
  totalCount,
  isLoading,
  totalLabel,
}: IProps) {
  const classes = useStyles()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)

  return (
    <CardForm isLoading={isLoading} title={title}>
      <Box className={classes.rootTableDashboard}>
        <Box className="table__wrapper">
          <CommonTable columns={headConfigs} rows={dataList} />
          <Box className={classes.total}>
            <Box className="label">{totalLabel}:</Box>
            <Box>{`${formatNumberToCurrencyBigInt(totalCount)} VND`}</Box>
          </Box>
        </Box>
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTableDashboard: {
    '& .title': {
      fontSize: '32px',
      fontWeight: 500,
      textAlign: 'center',
    },
    '& .currency': {
      padding: theme.spacing(3, 0),
    },

    '& .table__title': {
      color: theme.color.black.primary,
      fontSize: '14px',
      fontWeight: 500,
      paddingBottom: theme.spacing(2),
    },

    '& .MuiTable-root': {
      minWidth: '100%',
    },
  },
  total: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    fontSize: 17,
    '& .label': {
      fontWeight: 700,
    },
  },
}))

export default TableCustomerDashboard
