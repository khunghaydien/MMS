import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { BRANCH_ID_ALL } from '@/const/app.const'
import { FINANCE_DASHBOARD } from '@/const/path.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DashboardChartFinance from '../../components/DashboardChartFinance'
import ModalConfigKPI from '../../components/ModalConfigKPI'
import SelectBarFinance from '../../components/SelectBarFinance'
import { setConfigKpi, setConfigurations } from '../../reducer/finance'
import { getListFinanceDashBoard } from '../../reducer/thunk'
import { IDataFilter } from '../../types'

function FinanceDashBoard() {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nFinance } = useTranslation(LangConstant.NS_FINANCE)
  const { t: i18 } = useTranslation()

  const { permissions, staff }: AuthState = useSelector(selectAuth)

  const [isOpenConfigKpi, setIsOpenConfigKpi] = useState(false)
  const [dataFilter, setDataFilter] = useState<IDataFilter>({
    year: new Date().getFullYear(),
    branchId: staff?.branch?.id || BRANCH_ID_ALL,
    divisionId: staff?.division?.id || '',
  })
  const [branchId, setBranchId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCloseModal = () => {
    setBranchId('')
    dispatch(setConfigurations([]))
    setIsOpenConfigKpi(false)
    dispatch(
      setConfigKpi({
        moduleId: '',
        year: null,
        configuration: [],
      })
    )
  }

  const handleNavigateToAddPage = () => {
    setIsOpenConfigKpi(true)
  }

  const getFinanceDashboard = (queryParams: IDataFilter) => {
    setIsLoading(true)
    dispatch(
      getListFinanceDashBoard({
        ...queryParams,
        year: queryParams.year || new Date().getFullYear(),
      })
    )
      .unwrap()
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    getFinanceDashboard(dataFilter)
  }, [dataFilter])

  return (
    <CommonScreenLayout
      title={i18('TXT_FINANCE_DASHBOARD')}
      onBack={() => navigate(FINANCE_DASHBOARD)}
    >
      <Box className={classes.filterBlock}>
        <SelectBarFinance
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
        />
        {permissions.useFinanceKpiConfiguration && (
          <ButtonAddWithIcon onClick={handleNavigateToAddPage}>
            {i18nFinance('LB_KPI_CONFIGURATION')}
          </ButtonAddWithIcon>
        )}
      </Box>
      <DashboardChartFinance isLoading={isLoading} />
      {isOpenConfigKpi && (
        <ModalConfigKPI
          setBranchId={setBranchId}
          branchId={branchId}
          dataFilter={dataFilter}
          getFinanceDashboard={getFinanceDashboard}
          onCloseModal={handleCloseModal}
        />
      )}
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootDashboardFinance: {},
  filterBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
    alignItems: 'flex-end',
    '& > div': {
      backgroundColor: theme.color.white,
    },
    [theme.breakpoints.between('xs', 'sm')]: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
    },
    [theme.breakpoints.between('md', 'lg')]: {
      display: 'flex',
      gap: theme.spacing(1),
    },
  },
}))

export default FinanceDashBoard
