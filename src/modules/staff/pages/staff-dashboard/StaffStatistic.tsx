import NoData from '@/components/common/NoData'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import { ScreenState, selectScreen } from '@/reducer/screen'
import { OptionItem } from '@/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'
import { DEFAULT_CONFIG_STAFF_STATISTIC } from '../../const'
import { staffSelector } from '../../reducer/staff'
import { StaffState } from '../../types'
const listType: OptionItem[] = [
  {
    id: 'position',
    label: 'Position',
    value: 'position',
    disabled: false,
  },
  {
    id: 'status',
    label: 'Status',
    value: 'status',
    disabled: false,
  },
]
const StaffStatistic = ({ isLoading }: { isLoading: boolean }) => {
  const classes = useStyles()
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)
  const { t: i18 } = useTranslation()

  const {
    staffDashboardStatisticPosition,
    staffDashboardStatisticStatus,
  }: StaffState = useSelector(staffSelector)
  const { isShowSideBar }: ScreenState = useSelector(selectScreen)

  const [type, setType] = useState('position')

  const chartRef = useRef<HighchartsReact.RefObject>(null)

  const convertData = (value: any) => {
    return {
      name: value.name,
      y: value.total,
      percent: value.totalRatio,
    }
  }

  const dataDashboard = useMemo(
    () =>
      type === 'position'
        ? staffDashboardStatisticPosition?.statistics?.map(convertData) || []
        : staffDashboardStatisticStatus?.statistics?.map(convertData) || [],
    [staffDashboardStatisticPosition, staffDashboardStatisticStatus, type]
  )
  const totalStaff = useMemo(
    () =>
      type === 'position'
        ? staffDashboardStatisticPosition?.totalStaff
        : staffDashboardStatisticStatus?.totalStaff,
    [staffDashboardStatisticStatus, staffDashboardStatisticPosition, type]
  )
  const StaffStatisticOptions = useMemo(() => {
    const chartConfig: any = cloneDeep(DEFAULT_CONFIG_STAFF_STATISTIC)
    chartConfig.series = [
      {
        name: i18('TXT_QUANTITY'),
        colorByPoint: true,
        data: dataDashboard || [],
      },
    ]
    chartConfig.xAxis.categories = dataDashboard.map((role: any) => role.name)
    return chartConfig
  }, [dataDashboard])

  useEffect(() => {
    const chart = chartRef.current?.chart

    setTimeout(() => {
      const chartContainer = document.getElementById('staff__chart-statistic')
      chart?.setSize(chartContainer?.offsetWidth, chart?.chartHeight)
    }, 250)
  }, [isShowSideBar])

  return (
    <CardForm
      title={i18nStaff('TXT_STAFF_STATISTIC') || ''}
      className={classes.rootStaffStatistic}
      isLoading={isLoading}
    >
      <Box sx={{ marginBottom: '24px' }}>
        <InputDropdown
          label={i18('LB_POSITION')}
          value={type}
          width={200}
          onChange={value => {
            setType(value)
          }}
          isShowClearIcon={false}
          placeholder={'Select type'}
          listOptions={listType}
        />
      </Box>
      <ConditionalRender
        conditional={dataDashboard.length > 0}
        fallback={<NoData />}
      >
        <Box id="staff__chart-statistic">
          <HighchartsReact
            highcharts={Highcharts}
            options={StaffStatisticOptions}
            ref={chartRef}
          />
        </Box>
        <Box className="chart-total-value">
          {StringFormat(i18nStaff('TXT_TOTAL_STAFF'), totalStaff)}
        </Box>
      </ConditionalRender>
    </CardForm>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffStatistic: {
    height: '100%',
    width: '100%',
    '& .chart-title': {
      fontSize: '20px',
      padding: '20px',
    },
    '& .chart-total-value': {
      textAlign: 'center',
      fontSize: '16px',
      padding: '20px',
    },
  },
}))
export default StaffStatistic
