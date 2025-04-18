import { NS_CUSTOMER } from '@/const/lang.const'
import { TableHeaderColumn } from '@/types'
import { formatNumberToCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import i18next from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import TableCustomerDashboard from '../../components/TableCustomerDashboard'
import { CustomerState, selectCustomer } from '../../reducer/customer'

const customerRevenueHeadConfigs: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: i18next.t('customer:TXT_CUSTOMER_CODE'),
  },
  {
    id: 'customerName',
    align: 'left',
    label: i18next.t('customer:LB_CUSTOMER_NAME'),
  },
  {
    id: 'service',
    align: 'left',
    label: i18next.t('customer:TXT_SERVICE'),
  },
  {
    id: 'revenue',
    align: 'left',
    label: i18next.t('customer:TXT_REVENUE'),
  },
]

const partnerCostHeadConfigs: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: i18next.t('customer:TXT_PARTNER_CODE'),
  },
  {
    id: 'partnerName',
    align: 'left',
    label: i18next.t('customer:TXT_PARTNER_NAME'),
  },
  {
    id: 'strength',
    align: 'left',
    label: i18next.t('customer:TXT_STRENGTH'),
  },
  {
    id: 'cost',
    align: 'left',
    label: i18next.t('customer:TXT_COST'),
  },
]

function createDataCustomer(item: any) {
  return {
    id: item.id,
    code: item.id,
    customerName: item.name,
    service: item.skillSets,
    revenue: formatNumberToCurrency(item.revenue),
  }
}
function createDataPartner(item: any) {
  return {
    id: item.id,
    code: item.id,
    partnerName: item.name,
    strength: item.strength,
    cost: formatNumberToCurrency(item.cost),
  }
}

function DashboardTable({ isLoading }: { isLoading: boolean }) {
  const classes = useStyles()
  const { t: i18Customer } = useTranslation(NS_CUSTOMER)

  const { dataDashboard }: CustomerState = useSelector(selectCustomer)
  const { totalCustomerCost, totalPartnerCost } = dataDashboard

  const tableCustomers: any = useMemo(() => {
    if (!totalCustomerCost?.customers) return []
    return totalCustomerCost?.customers.map(createDataCustomer)
  }, [totalCustomerCost?.customers])

  const tablePartners: any = useMemo(() => {
    if (!totalPartnerCost?.partners) return []
    return totalPartnerCost?.partners.map(createDataPartner)
  }, [totalPartnerCost?.partners])

  return (
    <Box className={clsx('space-between-root', classes.rootTableDashboard)}>
      <TableCustomerDashboard
        isLoading={isLoading}
        totalLabel={i18Customer('TXT_TOTAL_CUSTOMER_REVENUE')}
        title={i18Customer('TXT_TOP_CUSTOMER', { number: 5 })}
        headConfigs={customerRevenueHeadConfigs}
        dataList={tableCustomers}
        totalCount={totalCustomerCost.total || 0}
      />

      <TableCustomerDashboard
        isLoading={isLoading}
        totalLabel={i18Customer('TXT_TOTAL_PARTNER_COST')}
        title={i18Customer('TXT_TOP_PARTNER', { number: 5 })}
        headConfigs={partnerCostHeadConfigs}
        dataList={tablePartners}
        totalCount={totalPartnerCost.total || 0}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTableDashboard: {
    paddingTop: theme.spacing(3),
    gap: theme.spacing(3),
    alignItems: 'stretch',
    flexWrap: 'wrap',

    '& > div': {
      flex: 1,
      width: `calc(50% - ${theme.spacing(1.5)})`,
      minWidth: theme.spacing(60),
      marginTop: '0 !important',
    },
  },
}))

export default DashboardTable
