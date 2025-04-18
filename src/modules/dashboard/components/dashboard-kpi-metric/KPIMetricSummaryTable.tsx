import CommonTable from '@/components/table/CommonTable'
import { NS_PROJECT } from '@/const/lang.const'
import { dashboardSelector } from '@/modules/dashboard/reducer/dashboard'
import {
  KPIMetricDetailData,
  KPIMetricDetailResponse,
} from '@/modules/dashboard/types'
import { TableHeaderColumn } from '@/types'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { cloneDeep } from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
interface KPIMetricSummaryTableProps {}

const KPIMetricSummaryTable = ({}: KPIMetricSummaryTableProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { dataKPIMetricSummary } = useSelector(dashboardSelector)

  const [rowIdIsOpen, setRowIdIsOpen] = useState<string | number>('')

  const headCells = useMemo(() => {
    const dataHeadCells: TableHeaderColumn[] = [
      {
        id: 'divisionName',
        label: i18Project('LB_DIVISION'),
      },
      {
        id: 'cssAverage',
        label: i18Project('TXT_CSS'),
        subLabel: '(average)',
        align: 'center',
      },
      {
        id: 'accumulatedBugRate',
        label: i18Project('TXT_BUG_RATE'),
        subLabel: '(accumulated)',
        align: 'center',
      },
      {
        id: 'accumulatedLeakageRate',
        label: i18Project('TXT_LEAKAGE_RATE'),
        subLabel: '(accumulated)',
        align: 'center',
      },
      {
        id: 'billableEffort',
        label: i18Project('TXT_BILLABLE_MM'),
        subLabel: '(total)',
        align: 'center',
      },
      {
        id: 'totalAssignEffort',
        label: i18Project('TXT_ASSIGN_MM'),
        subLabel: '(total)',
        align: 'center',
      },
      {
        id: 'totalActualEffort',
        label: i18Project('TXT_ACTUAL_MM'),
        subLabel: '(total)',
        align: 'center',
      },
      {
        id: 'accumulatedEeForecast',
        label: i18Project('TXT_EE_FORECAST'),
        subLabel: '(accumulated)',
        align: 'center',
      },
      {
        id: 'accumulatedEeActual',
        label: i18Project('TXT_EE_ACTUAL'),
        subLabel: '(accumulated)',
        align: 'center',
      },
      {
        id: 'accumulatedTimeliness',
        label: i18Project('TXT_TIMELINESS'),
        subLabel: '(accumulated)',
        align: 'center',
      },
      {
        id: 'averagePvc',
        label: i18Project('TXT_PCV'),
        subLabel: '(average)',
        align: 'center',
      },
      {
        id: 'bonusAndMinus',
        label: i18Project('TXT_BONUS_MINUS'),
        subLabel: '(total)',
        align: 'center',
      },
    ]
    return dataHeadCells
  }, [dataKPIMetricSummary.dataList])

  const showRowItem = useCallback((id: string | number) => {
    setRowIdIsOpen(id)
  }, [])

  const rows = useMemo(() => {
    const dataRows = dataKPIMetricSummary?.dataList.map(
      (data: KPIMetricDetailResponse, index: number) => {
        const metricsMonthDetail = cloneDeep(data.metricsDetail)
        const rowItem = {
          index,
          id: data?.divisionId,
          divisionName: (
            <Box className={classes.flexCol}>
              <Box className={classes.boxDivisionName}>
                {data?.divisionName}
                {data?.divisionName && (
                  <Fragment>
                    {data.divisionId === rowIdIsOpen ? (
                      <RemoveCircleOutline onClick={() => setRowIdIsOpen('')} />
                    ) : (
                      <AddCircleOutline
                        onClick={() => showRowItem(data.divisionId ?? '')}
                      />
                    )}
                  </Fragment>
                )}
              </Box>
              {data.divisionId === rowIdIsOpen && (
                <Box
                  className={classes.flexCol}
                  style={{ alignItems: 'flex-end' }}
                >
                  {metricsMonthDetail?.map(
                    ({ date }: KPIMetricDetailData, index) => (
                      <Box key={index}>{date}</Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          accumulatedBugRate: (
            <Box className={classes.flexCol}>
              <Box>{data?.accumulatedBugRate?.toLocaleString() ?? '-'}</Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ accumulatedBugRate }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {accumulatedBugRate?.toLocaleString() ?? '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          accumulatedEeActual: (
            <Box className={classes.flexCol}>
              <Box>
                {data?.accumulatedEeActual?.toLocaleString()
                  ? data?.accumulatedEeActual?.toLocaleString() + ' %'
                  : '-'}
              </Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ accumulatedEeActual }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {accumulatedEeActual?.toLocaleString()
                          ? accumulatedEeActual?.toLocaleString() + ' %'
                          : '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          accumulatedEeForecast: (
            <Box className={classes.flexCol}>
              <Box>
                {data?.accumulatedEeForecast?.toLocaleString()
                  ? data?.accumulatedEeForecast?.toLocaleString() + ' %'
                  : '-'}
              </Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ accumulatedEeForecast }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {accumulatedEeForecast?.toLocaleString()
                          ? accumulatedEeForecast?.toLocaleString() + ' %'
                          : '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          accumulatedLeakageRate: (
            <Box className={classes.flexCol}>
              <Box>{data?.accumulatedLeakageRate?.toLocaleString() ?? '-'}</Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    (
                      { accumulatedLeakageRate }: KPIMetricDetailData,
                      index
                    ) => (
                      <Box key={index}>
                        {accumulatedLeakageRate?.toLocaleString() ?? '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          accumulatedTimeliness: (
            <Box className={classes.flexCol}>
              <Box>
                {data?.accumulatedTimeliness?.toLocaleString()
                  ? data?.accumulatedTimeliness?.toLocaleString() + ' %'
                  : '-'}
              </Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ accumulatedTimeliness }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {accumulatedTimeliness?.toLocaleString()
                          ? accumulatedTimeliness?.toLocaleString() + ' %'
                          : '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          averagePvc: (
            <Box className={classes.flexCol}>
              <Box>{data?.averagePvc?.toLocaleString() ?? '-'}</Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ averagePvc }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {averagePvc?.toLocaleString() ?? '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          billableEffort: (
            <Box className={classes.flexCol}>
              <Box>
                {data?.billableEffort?.toLocaleString()
                  ? data?.billableEffort?.toLocaleString() + ' MM'
                  : '-'}
              </Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ billableEffort }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {billableEffort?.toLocaleString()
                          ? billableEffort?.toLocaleString() + ' MM'
                          : '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          bonusAndMinus: (
            <Box className={classes.flexCol}>
              <Box>{data?.bonusAndMinus?.toLocaleString() ?? '-'}</Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ bonusAndMinus }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {bonusAndMinus?.toLocaleString() ?? '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          cssAverage: (
            <Box className={classes.flexCol}>
              <Box>{data?.cssAverage?.toLocaleString() ?? '-'}</Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ cssAverage }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {cssAverage?.toLocaleString() ?? '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          totalActualEffort: (
            <Box className={classes.flexCol}>
              <Box>
                {data?.totalActualEffort?.toLocaleString()
                  ? data?.totalActualEffort?.toLocaleString() + ' MM'
                  : '-'}
              </Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ totalActualEffort }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {totalActualEffort?.toLocaleString()
                          ? totalActualEffort?.toLocaleString() + ' MM'
                          : '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
          totalAssignEffort: (
            <Box className={classes.flexCol}>
              <Box>
                {data?.totalAssignEffort?.toLocaleString()
                  ? data?.totalAssignEffort?.toLocaleString() + ' MM'
                  : '-'}
              </Box>
              {data.divisionId === rowIdIsOpen && (
                <Box className={classes.flexCol}>
                  {metricsMonthDetail?.map(
                    ({ totalAssignEffort }: KPIMetricDetailData, index) => (
                      <Box key={index}>
                        {totalAssignEffort?.toLocaleString()
                          ? totalAssignEffort?.toLocaleString() + ' MM'
                          : '-'}
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Box>
          ),
        }
        return rowItem
      }
    )
    return dataRows
  }, [dataKPIMetricSummary, rowIdIsOpen])

  useEffect(() => {
    setRowIdIsOpen('')
  }, [])

  return (
    <Box className={classes.RootKPIMetricSummaryTable}>
      <CommonTable
        rootClassName={classes.tableOutside}
        rowClassName={classes.rowItemOutside}
        loading={dataKPIMetricSummary.loading}
        columns={headCells}
        rows={rows}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  RootKPIMetricSummaryTable: {
    '& thead tr th:nth-child(1)': {
      left: 0,
      position: 'sticky',
      backgroundColor: theme.color.grey.tertiary,
      zIndex: 9,
      '&::after': {
        content: '" "',
        position: 'absolute',
        width: 1,
        height: '100%',
        background: theme.color.grey.secondary,
        top: 0,
        right: '-1px',
      },
    },
    '& tbody tr td:nth-child(1)': {
      left: 0,
      position: 'sticky',
      backgroundColor: '#fff',
      zIndex: 9,
      '&::after': {
        content: '" "',
        position: 'absolute',
        width: 1,
        height: '100%',
        background: theme.color.grey.secondary,
        top: 0,
        right: '-1px',
      },
    },
  },
  boxDivisionName: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& svg': {
      cursor: 'pointer',
      fontSize: 18,
      color: theme.color.blue.primary,
    },
  },
  tableOutside: {
    '& thead th:not(:last-child)': {
      borderRight: `1px solid ${theme.color.grey.secondary}`,
    },
    '& tbody td:first-child': {
      width: 140,
    },
    '& tbody td:not(:last-child)': {
      borderRight: `1px solid ${theme.color.grey.secondary}`,
    },
  },
  rowItemOutside: {
    '& td:first-child': {
      minWidth: 170,
    },
  },
}))

export default KPIMetricSummaryTable
