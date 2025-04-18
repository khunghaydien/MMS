import NoData from '@/components/common/NoData'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { cloneDeep } from 'lodash'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DEFAULT_CONFIG_CHART } from '../../const'
import { staffSelector } from '../../reducer/staff'
import { StaffState } from '../../types'
const listPosition: OptionItem[] = [
  {
    id: 'software_engineer',
    label: 'Software Engineer',
    value: 'software_engineer',
    disabled: false,
  },
  {
    id: 'quality_control',
    label: 'Quality Control',
    value: 'quality_control',
    disabled: false,
  },
]

const convertData = (value: any) => {
  return {
    name: value.level,
    y: value.total,
    percent: value.totalRatio,
    actualHeadcount: value?.headcount?.actualHeadcount || 0,
    actualHeadcountRatio: value?.headcount?.actualHeadcountRatio || 0,
    idealHeadcount: value?.headcount?.idealHeadcount || 0,
    idealHeadcountRatio: value?.headcount?.idealHeadcountRatio || 0,
  }
}

const StaffIdealStats = ({ isLoading }: { isLoading: boolean }) => {
  const classes = useStyles()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)
  const { t: i18 } = useTranslation()
  const [position, setPosition] = useState('software_engineer')
  const { staffDashboardIdealStatsSE, staffDashboardIdealStatsQC }: StaffState =
    useSelector(staffSelector)

  const dataDashboard = useMemo(
    () =>
      position === 'software_engineer'
        ? staffDashboardIdealStatsSE?.map(convertData) || []
        : staffDashboardIdealStatsQC?.map(convertData) || [],
    [staffDashboardIdealStatsSE, staffDashboardIdealStatsQC, position]
  )
  const StaffIdealStatsOptions = useMemo(() => {
    const chartConfig = cloneDeep(DEFAULT_CONFIG_CHART)
    chartConfig.plotOptions.pie.dataLabels = {
      enabled: true,
      connectorWidth: 0,
      distance: 20,
      format: '{point.percent}%',
      filter: {
        property: 'percentage',
        operator: '>',
        value: 0,
      },
    }
    chartConfig.series = [
      {
        name: i18nStaff('TXT_IDEAL_STATS') || '',
        colorByPoint: true,
        data: dataDashboard || [],
      },
    ]
    chartConfig.tooltip = {
      headerFormat:
        '<span style="font-size:12px"> <b>{series.name} </b></span><br>',
      pointFormat:
        '<div><span style="color:{point.color}">{point.name}</span>: <b style="color:#C9C330;font-size:14px">{point.y}</b><br/><span>Actual Headcount</span>: <b style="color:#66BB6A;font-size:14px"> {point.actualHeadcount} </b> Employees <br /><span>Ideal Headcount</span>: <b  style="color:#C9C330;font-size:14px">{point.idealHeadcount}</b> Employees<br /><span>Actual Headcount Percentage</span>: <b  style="color:#66BB6A;font-size:14px">{point.actualHeadcountRatio}%</b><br /><span">Ideal Headcount Percentage</span>: <b style="color:#C9C330;font-size:14px">{point.idealHeadcountRatio}%</b><br /></div>',
    }
    return chartConfig
  }, [dataDashboard])

  return (
    <CardForm
      isLoading={isLoading}
      title={i18nStaff('TXT_IDEAL_STATS') || ''}
      className={classes.rootStaffIdealStats}
    >
      <InputDropdown
        label={i18('LB_POSITION')}
        value={position}
        width={260}
        onChange={(value: string) => {
          setPosition(value)
        }}
        isShowClearIcon={false}
        placeholder={i18nProject('LB_SELECT_POSITION') || ''}
        listOptions={listPosition}
      />
      <Box className={classes.chartContainerIdealStats}>
        <Box className={classes.chartIdealStats}>
          <ConditionalRender
            conditional={dataDashboard.length > 0}
            fallback={<NoData />}
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={StaffIdealStatsOptions}
            />
          </ConditionalRender>
        </Box>
      </Box>
    </CardForm>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  titleIdealStats: {
    fontSize: '20px',
    padding: '20px',
  },
  chartContainerIdealStats: {
    display: 'flex',
    justifyContent: 'center',
  },
  chartIdealStats: {
    maxWidth: '570px',
    width: '570px',
    minWidth: '250px',
  },
  rootStaffIdealStats: {
    height: '100%',
    width: '100%',
  },
}))
export default memo(StaffIdealStats)
