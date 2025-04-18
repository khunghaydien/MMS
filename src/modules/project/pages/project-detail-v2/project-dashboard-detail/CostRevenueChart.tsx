import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectState } from '@/modules/project/types'
import { OptionItem, RangeDate } from '@/types'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface Filters extends RangeDate {
  currency: string | number
}

const VND = 1
const USD = 2
const EUR = 3
const JPY = 4

const CostRevenueChart = () => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { generalInfo }: ProjectState = useSelector(projectSelector)

  const getDefaultFilter = () => {
    const currentYear = new Date().getFullYear()
    const projectStartYear = generalInfo.startDate?.getFullYear() as number
    const projectEndYear = generalInfo.endDate?.getFullYear() as number
    if (currentYear >= projectStartYear && currentYear <= projectEndYear) {
      return {
        startDate: new Date(`${currentYear}-01-01`),
        endDate: new Date(`${currentYear}-12-31`),
        currency: VND,
      } as Filters
    }
    if (currentYear > projectEndYear) {
      return {
        startDate: new Date(`${projectEndYear}-01-01`),
        endDate: new Date(`${projectEndYear}-12-31`),
        currency: VND,
      } as Filters
    }
    return {
      startDate: null,
      endDate: null,
      currency: VND,
    } as Filters
  }

  const [filters, setFilters] = useState(() => getDefaultFilter())

  const listCurrency: OptionItem[] = [
    {
      id: VND,
      label: 'VND',
      value: VND,
    },
    {
      id: USD,
      label: 'USD',
      value: USD,
    },
    {
      id: EUR,
      label: 'EUR',
      value: EUR,
    },
    {
      id: JPY,
      label: 'JPY',
      value: JPY,
    },
  ]

  const categories = [
    '01/2024',
    '02/2024',
    '03/2024',
    '04/2024',
    '05/2024',
    '06/2024',
    '07/2024',
    '08/2024',
    '09/2024',
    '10/2024',
    '11/2024',
    '12/2024',
  ]
  const barData = [5, 10, 15, 20, 25, 5, 10, 15, 20, 25, 20, 30]
  const barData2 = [5, 2, 15, 20, 25, 5, 10, 15, 20, 25, 20, 47]
  const lineData = [1, 2, 10, 4, 5, 1, 2, 3, 4, 5, 54, 3]
  const lineData2 = [5, 2, 2, 8, 5, 5, 2, 2, 8, 5, 2, 87]

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    title: {
      text: `${i18Project('TXT_PROJECT_COST_AND_REVENUE')} (${
        listCurrency.find(cur => cur.value === filters.currency)?.label
      })`,
      style: {
        fontWeight: '700',
      },
    },
    xAxis: {
      categories: categories,
    },
    yAxis: [
      {
        title: {
          text: 'Expected Value',
          style: {
            fontWeight: '700',
            fontSize: '14px',
          },
        },
      },
      {
        title: {
          text: 'Actual Value',
          style: {
            fontWeight: '700',
            fontSize: '14px',
          },
        },
        opposite: true,
      },
    ],
    plotOptions: {
      column: {
        pointPadding: 0,
      },
    },
    tooltip: {
      formatter: function () {
        return `<b>${this.series.name}</b>: ${this.y} ${
          listCurrency.find(cur => cur.value === filters.currency)?.label
        }`
      },
    },
    series: [
      {
        name: 'Expected Cost',
        type: 'column',
        data: barData,
        color: '#FFCD3C',
      },
      {
        name: 'Expected Revenue',
        type: 'column',
        data: barData2,
        color: '#45B6FE',
      },
      {
        name: 'Actual Cost',
        type: 'line',
        data: lineData,
        yAxis: 1,
        color: '#EA4224',
      },
      {
        name: 'Actual Revenue',
        type: 'line',
        data: lineData2,
        color: '#34A853',
        yAxis: 1,
      },
    ],
  }

  const seeMore = () => {
    alert('Coming soon!')
  }

  const onRangeMonthPickerChange = (payload: RangeDate) => {
    setFilters({ ...filters, ...payload })
  }

  const onCurrencyChange = (value: string | number) => {
    setFilters({
      ...filters,
      currency: value,
    })
  }

  const setTransform = (className: string, isActual: boolean) => {
    const pointActualRevenue = document.querySelector(className) as HTMLElement
    const styles = window.getComputedStyle(pointActualRevenue)
    const transformValue = styles.getPropertyValue('transform')
    const translateX = Number(transformValue?.split(',')?.[4])
    const translateY = Number(
      transformValue?.split(',')?.[5]?.replaceAll(')', '')
    )
    pointActualRevenue.style.transform = `translate(${
      isActual ? translateX - 16 : translateX + 16
    }px, ${translateY}px)`
  }

  useEffect(() => {
    setTransform(
      '.highcharts-series.highcharts-series-2.highcharts-line-series',
      true
    )
    setTransform(
      '.highcharts-markers.highcharts-series-2.highcharts-line-series.highcharts-tracker',
      true
    )
    setTransform(
      '.highcharts-series.highcharts-series-3.highcharts-line-series',
      false
    )
    setTransform(
      '.highcharts-markers.highcharts-series-3.highcharts-line-series.highcharts-tracker',
      false
    )
  }, [])

  useEffect(() => {
    setFilters(getDefaultFilter())
  }, [generalInfo])

  return (
    <CardFormSeeMore
      hideSeeMore
      title={i18Project('TXT_COST_AND_REVENUE')}
      onSeeMore={seeMore}
    >
      <Box className={classes.bodyResourceAllocation}>
        <Box className={classes.filters}>
          <RangeMonthPicker
            startDate={filters.startDate}
            endDate={filters.endDate}
            onChange={onRangeMonthPickerChange}
          />
          <InputDropdown
            width={160}
            listOptions={listCurrency}
            value={filters.currency}
            isShowClearIcon={false}
            onChange={onCurrencyChange}
          />
        </Box>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </CardFormSeeMore>
  )
}

const useStyles = makeStyles(() => ({
  bodyResourceAllocation: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filters: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
  },
}))

export default CostRevenueChart
