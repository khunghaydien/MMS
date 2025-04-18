import NoData from '@/components/common/NoData'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import { CUSTOMER_STATUS } from '@/const/app.const'
import { ScreenState, selectScreen } from '@/reducer/screen'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import clsx from 'clsx'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DEFAULT_CONFIG_CHART } from '../../const'
import { CustomerState, selectCustomer } from '../../reducer/customer'

const TYPE_CHART = {
  CUSTOMER: 'customer',
  PARTNER: 'partner',
}

export default function DashboardChart({ isLoading }: { isLoading: boolean }) {
  const classes = useStyle()
  const { t: i18nCustomer } = useTranslation(LangConstant.NS_CUSTOMER)

  const { isShowSideBar }: ScreenState = useSelector(selectScreen)
  const { dataDashboard }: CustomerState = useSelector(selectCustomer)
  const { customerBasedOnStatus, partnerBasedOnStatus } = dataDashboard

  const customerChartRef = useRef<HighchartsReact.RefObject>(null)
  const partnerChartRef = useRef<HighchartsReact.RefObject>(null)

  const formatDataChart = (listData: any, type: string) => {
    const result: any = []
    listData?.forEach((item: any) => {
      if (item.percent > 0) {
        result.push({
          name: CUSTOMER_STATUS?.[item.status.id]?.label,
          y: +item.percent,
          count: +item.count,
          label:
            type === TYPE_CHART.CUSTOMER
              ? +item.count > 1
                ? i18nCustomer('TXT_CUSTOMERS')
                : i18nCustomer('TXT_CUSTOMER')
              : +item.count > 1
              ? i18nCustomer('TXT_PARTNERS')
              : i18nCustomer('TXT_PARTNER'),
        })
      }
    })
    return result
  }

  const customerOptions = useMemo(() => {
    const chartConfig = cloneDeep(DEFAULT_CONFIG_CHART)

    chartConfig.series = [
      {
        name: i18nCustomer('TXT_CUSTOMERS'),
        colorByPoint: true,
        data: formatDataChart(customerBasedOnStatus.ratio, TYPE_CHART.CUSTOMER),
      },
    ]

    return chartConfig
  }, [customerBasedOnStatus])

  const partnerOptions = useMemo(() => {
    const chartConfig = cloneDeep(DEFAULT_CONFIG_CHART)

    chartConfig.series = [
      {
        name: i18nCustomer('TXT_PARTNERS'),
        colorByPoint: true,
        data: formatDataChart(partnerBasedOnStatus.ratio, TYPE_CHART.PARTNER),
      },
    ]
    return chartConfig
  }, [partnerBasedOnStatus])

  useEffect(() => {
    const chartCustomer = customerChartRef.current?.chart
    const chartPartner = partnerChartRef.current?.chart
    setTimeout(() => {
      const chartCustomerContainer = document.getElementById('customer-chart')
      const chartPartnerContainer = document.getElementById('partner-chart')
      if (chartCustomerContainer && chartPartnerContainer) {
        chartCustomer?.setSize(
          chartCustomerContainer?.offsetWidth,
          chartCustomer?.chartHeight
        )
        chartPartner?.setSize(
          chartPartnerContainer?.offsetWidth,
          chartPartner?.chartHeight
        )
      }
    }, 300)
  }, [isShowSideBar])

  return (
    <Box className={clsx('space-between-root', classes.blockChart)}>
      <CardForm
        isLoading={isLoading}
        className="chart"
        title={i18nCustomer('TXT_CUSTOMERS')}
      >
        <ConditionalRender
          conditional={!!customerBasedOnStatus?.total}
          fallback={<NoData />}
        >
          <Box id="customer-chart">
            <HighchartsReact
              highcharts={Highcharts}
              options={customerOptions}
              ref={customerChartRef}
            />
          </Box>
          <Box className={classes.total}>
            <Box className="label">{i18nCustomer('TXT_TOTAL_CUSTOMERS')}:</Box>
            <Box>{customerBasedOnStatus?.total}</Box>
          </Box>
        </ConditionalRender>
      </CardForm>
      <CardForm
        isLoading={isLoading}
        className="chart"
        title={i18nCustomer('TXT_PARTNERS')}
      >
        <ConditionalRender
          conditional={!!partnerBasedOnStatus?.total}
          fallback={<NoData />}
        >
          <Box id="partner-chart">
            <HighchartsReact
              highcharts={Highcharts}
              options={partnerOptions}
              ref={partnerChartRef}
            />
          </Box>
          <Box className={classes.total}>
            <Box className="label">{i18nCustomer('TXT_TOTAL_PARTNERS')}:</Box>
            <Box>{partnerBasedOnStatus?.total}</Box>
          </Box>
        </ConditionalRender>
      </CardForm>
    </Box>
  )
}

const useStyle = makeStyles((theme: Theme) => ({
  total: {
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    fontSize: 17,
    '& .label': {
      fontWeight: 700,
    },
  },
  blockChart: {
    gap: theme.spacing(3),
    alignItems: 'stretch',
    paddingTop: theme.spacing(3),
    flexWrap: 'wrap',
    '& .root-loading-skeleton': {
      height: 'calc(100% - 52px)',
    },
    '& .chart': {
      flexShrink: 0,
      flex: 1,
      width: 'calc(50% - 12px)',
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
}))
