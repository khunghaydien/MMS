import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import SelectBranch from '@/components/select/SelectBranch'
import { LangConstant } from '@/const'
import {
  BRANCH_ID_ALL,
  listMonths,
  MODULE_CUSTOMER_CONST,
  SUB_MODULE_STAFF_FILTER,
} from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { getArrayMinMax, queryStringParam } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getStatisticCustomerAndPartner } from '../../reducer/customer'
import DashboardChart from './DashboardChart'
import DashboardTable from './DashboardTable'

export default function CustomerDashboard() {
  const classes = useStyle()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nCustomer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { t: i18n } = useTranslation()

  const { staff }: AuthState = useSelector(selectAuth)

  const [isLoading, setIsLoading] = useState(false)
  const [branchId, setBranchId] = useState(staff?.branch?.id || BRANCH_ID_ALL)
  const [date, setDate] = useState<Date | null>(new Date())
  const [month, setMonth] = useState('')

  const handleSelectBranch = useCallback((value: string) => {
    setBranchId(value)
  }, [])

  const handleDateChange = useCallback((value: Date | null) => {
    setDate(value)
    if (!value) {
      setMonth('')
    }
  }, [])

  const handleMonthChange = useCallback((value: string) => {
    setMonth(value)
  }, [])

  useEffect(() => {
    const year = date?.getFullYear()
    const queryParams = '?' + queryStringParam({ branchId, year, month })
    setIsLoading(true)
    dispatch(getStatisticCustomerAndPartner(queryParams))
      .unwrap()
      .finally(() => setIsLoading(false))
  }, [branchId, date, month])

  return (
    <CommonScreenLayout title={i18nCustomer('TXT_DASHBOARD')}>
      <Box className={classes.filterBlock}>
        <SelectBranch
          moduleConstant={MODULE_CUSTOMER_CONST}
          subModuleConstant={SUB_MODULE_STAFF_FILTER}
          isDashboard
          width={180}
          label={i18nCustomer('LB_BRANCH')}
          value={branchId}
          onChange={handleSelectBranch}
          isShowClearIcon={false}
        />
        <InputDatepicker
          readOnly
          allowedYears={getArrayMinMax(2016, 2099)}
          width={180}
          value={date}
          label={i18n('LB_YEAR')}
          onChange={handleDateChange}
          views={['year']}
          openTo="year"
          inputFormat={'YYYY'}
        />
        <InputDropdown
          isDisable={!date}
          value={month}
          width={180}
          label={i18n('LB_MONTH')}
          placeholder={i18n('PLH_SELECT_MONTH')}
          listOptions={listMonths}
          onChange={handleMonthChange}
        />
      </Box>
      <DashboardChart isLoading={isLoading} />
      <DashboardTable isLoading={isLoading} />
    </CommonScreenLayout>
  )
}

const useStyle = makeStyles((theme: Theme) => ({
  rootDashboardLayout: {
    padding: theme.spacing(3, 5),
    backgroundColor: '#f1f2f7',
    // minHeight: '100vh',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  filterBlock: {
    display: 'flex',
    gap: theme.spacing(3),

    '& > div': {
      backgroundColor: theme.color.white,
    },
  },
  blockChart: {
    justifyContent: 'space-around',
    gap: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  chart: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(0.5),
    flexBasis: '50%',
    backgroundColor: theme.color.white,
  },
  blockTable: {},
}))
