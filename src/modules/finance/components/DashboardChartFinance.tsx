import NoData from '@/components/common/NoData'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import { ScreenState, selectScreen } from '@/reducer/screen'
import { formatCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { optionFinanceConfig } from '../const'
import { financeSelector } from '../reducer/finance'
import { renderSeries } from '../utils'
import ProgressBarKPI from './ProgressBarKPI'

const DashboardChartFinance = ({ isLoading }: { isLoading: boolean }) => {
  const classes = useStyle()
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { finance } = useSelector(financeSelector)
  const { isShowSideBar }: ScreenState = useSelector(selectScreen)
  const financeChartRevenueRef = useRef<HighchartsReact.RefObject>(null)
  const financeChartCostRef = useRef<HighchartsReact.RefObject>(null)
  const financeChartProfitRef = useRef<HighchartsReact.RefObject>(null)
  const financeData = finance?.revenue?.finance || {}
  const costData = finance?.cost?.finance || {}
  const profitData = finance?.profit?.finance || {}

  const totalRevenue = finance?.revenue?.total
  const totalCost = finance?.cost?.total
  const totalProfit = finance?.profit?.total
  const { kpi } = finance
  const totalKpiRevenue = kpi?.totalRevenue
  const totalExpectedKpi = kpi?.expectedKpi
  const ratio = kpi?.ratio
  let RevenueConfig = {
    ...optionFinanceConfig,
    series: renderSeries(financeData),
  }
  let CostConfig = {
    ...optionFinanceConfig,
    series: renderSeries(costData),
  }
  let ProfitConfig = {
    ...optionFinanceConfig,
    series: renderSeries(profitData),
  }

  useEffect(() => {
    const chartRevenue = financeChartRevenueRef.current?.chart
    const chartCost = financeChartCostRef.current?.chart
    const chartProfit = financeChartProfitRef.current?.chart
    setTimeout(() => {
      const chartRevenueContainer = document.getElementById('revenue-chart')
      const chartCostContainer = document.getElementById('cost-chart')
      const chartProfitContainer = document.getElementById('profit-chart')
      if (chartRevenueContainer && chartCostContainer && chartProfitContainer) {
        chartRevenue?.setSize(
          chartRevenueContainer?.offsetWidth,
          chartRevenue?.chartHeight
        )
        chartCost?.setSize(
          chartCostContainer?.offsetWidth,
          chartCost?.chartHeight
        )
        chartProfit?.setSize(
          chartProfitContainer?.offsetWidth,
          chartProfit?.chartHeight
        )
      }
    }, 300)
  }, [isShowSideBar])

  return (
    <Box className={clsx(classes.blockChart)}>
      <CardForm
        title={i18nCommon('TITLE_REVENUE')}
        className="chart"
        isLoading={isLoading}
      >
        <ConditionalRender
          conditional={RevenueConfig.series?.length > 0 || totalRevenue}
          fallback={<NoData />}
        >
          <Box id="revenue-chart" className={clsx(classes.financeChart)}>
            <HighchartsReact
              ref={financeChartRevenueRef}
              highcharts={Highcharts}
              options={RevenueConfig}
            />
          </Box>
          <Box className={clsx(classes.total)}>
            <span>Total Revenue:</span>
            <span>{formatCurrency(+totalRevenue)}</span>
          </Box>
        </ConditionalRender>
      </CardForm>
      <CardForm title={i18nCommon('TITLE_COST')} isLoading={isLoading}>
        <ConditionalRender
          conditional={CostConfig.series?.length > 0 || totalCost}
          fallback={<NoData />}
        >
          <Box id="cost-chart">
            <HighchartsReact
              ref={financeChartCostRef}
              highcharts={Highcharts}
              options={CostConfig}
            />
            <Box className={clsx(classes.total)}>
              <span>Total Cost:</span>
              <span>{formatCurrency(+totalCost)}</span>
            </Box>
          </Box>
        </ConditionalRender>
      </CardForm>
      <CardForm title={i18nCommon('TITLE_PROFIT')} isLoading={isLoading}>
        <ConditionalRender
          conditional={ProfitConfig.series?.length > 0 || totalProfit}
          fallback={<NoData />}
        >
          <Box id="profit-chart">
            <HighchartsReact
              ref={financeChartProfitRef}
              highcharts={Highcharts}
              options={ProfitConfig}
            />
            <Box className={clsx(classes.total)}>
              <span>Total Profit:</span>
              <span>{formatCurrency(+totalProfit)}</span>
            </Box>
          </Box>
        </ConditionalRender>
      </CardForm>
      <CardForm title={i18nCommon('TITLE_KPI')} isLoading={isLoading}>
        <ConditionalRender
          conditional={kpi || totalKpiRevenue || totalKpiRevenue}
          fallback={<NoData />}
        >
          <Box className={clsx(classes.cardPadding)} id="kpi-chart">
            <Box className={clsx(classes.kpi)}>
              <Box className={clsx(classes.totalKpi)}>
                <span>Total Revenue: </span>
                <span className={clsx(classes.textTotal)}>
                  {formatCurrency(+totalKpiRevenue)}
                </span>
              </Box>
              <Box className={clsx(classes.totalKpi)}>
                <span>Expected KPI: </span>
                <span className={clsx(classes.textTotal)}>
                  {formatCurrency(+totalExpectedKpi)}
                </span>
              </Box>
            </Box>
            <ProgressBarKPI done={ratio} />
          </Box>
        </ConditionalRender>
      </CardForm>
    </Box>
  )
}

const useStyle = makeStyles((theme: Theme) => ({
  cardPadding: {
    paddingBottom: theme.spacing(3),
  },
  blockChart: {
    gap: theme.spacing(3),
    alignItems: 'stretch',
    paddingTop: theme.spacing(3),
    flexWrap: 'wrap',
    width: '100%',
    '& .chart': {
      flexShrink: 0,
      flex: 1,
      width: '100%',
      minWidth: theme.spacing(60),
      padding: theme.spacing(3),
      borderRadius: theme.spacing(0.5),
      marginTop: `0px !important`,
      minHeight: theme.spacing(64),

      [theme.breakpoints.down('lg')]: {
        minWidth: '100%',
      },

      '& > div:first-child': {
        marginBottom: 0,
      },
    },
  },
  financeChart: {
    width: '100%',
  },
  total: {
    margin: '10px 0',
    display: 'flex',
    '& span': {
      fontWeight: '700',
      fontSize: '15px',
      marginLeft: '10px',
      color: '#000',
    },
    '& span:first-child': {
      marginLeft: 0,
    },
  },
  kpi: {
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  textTotal: {
    color: `${theme.color.green.primary}!important`,
    fontSize: '26px!important',
    marginTop: '20px',
  },
  totalKpi: {
    margin: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      fontWeight: '700',
      fontSize: '17px',
      color: '#000',
    },
    '& span:first-child': {
      marginLeft: 0,
    },
  },
  [theme.breakpoints.down('md')]: {
    kpi: {
      flexDirection: 'column',
    },
    textTotal: {
      fontSize: '17px!important',
    },
  },
}))

export default DashboardChartFinance
