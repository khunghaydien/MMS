import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import CommonButton from '@/components/buttons/CommonButton'
import StatusItem, { IStatusType } from '@/components/common/StatusItem'
import InputRadioList from '@/components/inputs/InputRadioList'
import CommonTable from '@/components/table/CommonTable'
import { NS_MBO, NS_PROJECT } from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  ACCUMULATED,
  BONUS_PENALTY_STATUS_COLOR,
  KPI_COLS_LABELS,
  KPI_COLS_SECTIONS,
  KPI_SECTIONS,
  SEPARATE,
  SUCCESS_LEVEL_LABELS,
  SUCCESS_LEVEL_VALUES,
} from '@/modules/project/const'
import {
  projectSelector,
  setKpiRangeDateFilter,
  setProjectDashboardScreenDetail,
} from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { AppDispatch } from '@/store'
import { Pagination, RangeDate, TableHeaderColumn } from '@/types'
import informationImage from '@/ui/images/info.svg'
import { themeColors } from '@/ui/mui/v5'
import { formatAnyToDate, formatNumber } from '@/utils'
import { KeyboardDoubleArrowRight } from '@mui/icons-material'
import { Box, TableCell, TableRow, Theme, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getCostStatus } from '../project-kpi-information/KPICost/KPICost'
import { getTimelinessStatus } from '../project-kpi-information/KPIDelivery/KPIDelivery'
import { getProcessStatus } from '../project-kpi-information/KPIProcess/KPIProcess'
import { getQualityRateStatus } from '../project-kpi-information/KPIQualityCSS/BugRate/BugRate'
import { getCSSStatus } from '../project-kpi-information/KPIQualityCSS/CustomerSatisfaction/CustomerSatisfaction'
import KPIMetricsTooltip from './KPIMetricsTooltip'

export const ColTooltip = ({
  colName,
  section,
  resetBackground,
}: {
  colName?: string
  section: string
  resetBackground?: boolean
}) => {
  const classes = useStyles()

  return (
    <Box className={classes.RootColTooltip} onClick={e => e.stopPropagation()}>
      <Box className={classes.widthMaxContent}>{colName}</Box>
      <Tooltip
        classes={{ tooltip: !resetBackground ? classes.tooltipBox : '' }}
        title={<KPIMetricsTooltip section={section} />}
      >
        <img
          className={classes.iconI}
          src={informationImage}
          alt="information"
        />
      </Tooltip>
    </Box>
  )
}

interface PointDetailItem {
  keyUnique: number
  kpiPoint: number | null
  norm: number | null
  usl: number | null
  value: number | null
  weight: number | null
  status: {
    id: number
    name: string
  }
}

interface DataProjectPointApiItem {
  month: string
  totalWeight: number
  projectPoint: number
  successLevel: {
    id: number
    name: string
  }
  pointDetail: PointDetailItem[]
}

const getKPIStatusSummary = (item: PointDetailItem): IStatusType => {
  if (item.keyUnique === KPI_SECTIONS.CSS) {
    return getCSSStatus(item.status.id)
  }
  if (
    item.keyUnique === KPI_SECTIONS.BUG_RATE ||
    item.keyUnique === KPI_SECTIONS.LEAKAGE_RATE
  ) {
    return getQualityRateStatus(item.status.id)
  }
  if (
    item.keyUnique === KPI_SECTIONS.EE_FORECAST ||
    item.keyUnique === KPI_SECTIONS.EE_ACTUAL
  ) {
    return getCostStatus(item.status.id)
  }
  if (item.keyUnique === KPI_SECTIONS.TIMELINESS) {
    return getTimelinessStatus(item.status.id)
  }
  if (item.keyUnique === KPI_SECTIONS.PCV) {
    return getProcessStatus(item.status.id)
  }
  if (item.keyUnique === KPI_SECTIONS.BONUS_AND_PENALTY) {
    return {
      label: item.status.name,
      color: BONUS_PENALTY_STATUS_COLOR[item.status.id],
    }
  }
  return {
    color: 'grey',
    label: 'N/A',
  }
}

const getSuccessLevel = (statusValue: number) => {
  let status: IStatusType = {
    label: '',
    color: '',
  }
  switch (statusValue) {
    case SUCCESS_LEVEL_VALUES.EXCELLENT:
      status = {
        label: SUCCESS_LEVEL_LABELS[SUCCESS_LEVEL_VALUES.EXCELLENT],
        color: 'violet',
      }
      break
    case SUCCESS_LEVEL_VALUES.GOOD:
      status = {
        label: SUCCESS_LEVEL_LABELS[SUCCESS_LEVEL_VALUES.GOOD],
        color: 'green',
      }
      break
    case SUCCESS_LEVEL_VALUES.BAD:
      status = {
        label: SUCCESS_LEVEL_LABELS[SUCCESS_LEVEL_VALUES.BAD],
        color: 'red',
      }
      break
    default:
      status = {
        label: 'N/A',
        color: 'grey',
      }
  }
  return status
}

const getLastDayOfMonth = (date: Date) => {
  const daysInMonth = moment(date).daysInMonth()
  return new Date(date.getFullYear(), date.getMonth(), daysInMonth)
}

export const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const getKPIEndMonth = (projectEndDate: Date | null) => {
  if (!projectEndDate) return null
  const isProjecEndDateLessThanToday =
    new Date(moment(projectEndDate).format('MM/DD/YYYY')).getTime() -
      new Date(moment(new Date()).format('MM/DD/YYYY')).getTime() <
    0
  if (isProjecEndDateLessThanToday) {
    return projectEndDate
  } else {
    const lastDayOfMonth = getLastDayOfMonth(new Date())
    return lastDayOfMonth
  }
}

const ProjectKPIInformationTable = () => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { generalInfo, permissionProjectKPI, kpiRangeDateFilter } =
    useSelector(projectSelector)

  const radioListOptions = [
    {
      id: ACCUMULATED,
      value: ACCUMULATED,
      label: i18Project('LB_ACCUMULATED'),
    },
    {
      id: SEPARATE,
      value: SEPARATE,
      label: i18Project('LB_SEPARATE'),
    },
  ]

  const projectPointColumn: TableHeaderColumn[] = [
    {
      id: 'no',
      label: i18('LB_NO'),
    },
    {
      id: 'month',
      label: i18('LB_MONTH'),
    },
    {
      id: 'projectPoints',
      label: i18Project('TXT_PROJECT_POINTS'),
    },
    {
      id: 'successLevel',
      label: i18Project('TXT_SUCCESS_LEVEL'),
    },
  ]

  const [valueType, setValueType] = useState(SEPARATE)
  const [projectPointSelected, setProjectPointSelected] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [dataProjectPointApi, setDataProjectPointApi] = useState<
    DataProjectPointApiItem[]
  >([])
  const [pagination, setPagination] = useState<Pagination>({
    pageNum: PAGE_CURRENT_DEFAULT,
    pageSize: LIMIT_DEFAULT,
  })
  const [flagInit, setFlagInit] = useState(false)

  const kpiMetricsColumns: TableHeaderColumn[] = [
    {
      id: 'no',
      label: i18('LB_NO'),
    },
    {
      id: 'kpiMetrics',
      label: i18Project('LB_KPI_METRICS'),
    },
    {
      id: 'weight',
      label: i18Mbo('LB_WEIGHT'),
    },
    {
      id: 'norm',
      label: i18Project('TXT_NORM'),
    },
    {
      id: 'usl',
      label: i18Project('TXT_USL'),
    },
    {
      id: 'value',
      label: i18('LB_VALUE'),
    },
    {
      id: 'kpiPoint',
      label: i18Project('TXT_KPI_POINT'),
    },
    {
      id: 'status',
      label: i18('LB_STATUS'),
    },
  ]

  const titleRightContent = useMemo(() => {
    if (projectPointSelected.id) {
      return `${i18('LB_MONTH')}: ${projectPointSelected.month}`
    }
    return i18('LB_MONTH')
  }, [i18Project, projectPointSelected])

  const hideViewDetails = useMemo(() => {
    return (
      !permissionProjectKPI.viewSurveySummary &&
      !permissionProjectKPI.viewBugRate &&
      !permissionProjectKPI.viewLeakageRate &&
      !permissionProjectKPI.costEffortEfficiency &&
      !permissionProjectKPI.deliveryViewTimeliness &&
      !permissionProjectKPI.processView &&
      (!permissionProjectKPI.plusAndMinusViewOverallEvaluation ||
        !permissionProjectKPI.customerComplaintSummary)
    )
  }, [permissionProjectKPI])

  const projectPointsRows = useMemo(() => {
    return dataProjectPointApi
      .slice(
        (pagination.pageNum - 1) * pagination.pageSize,
        pagination.pageNum * pagination.pageSize
      )
      .map((item, index) => ({
        ...item,
        id: (pagination.pageNum - 1) * pagination.pageSize + index + 1,
        no: (pagination.pageNum - 1) * pagination.pageSize + index + 1,
        month: item.month,
        projectPoints: <Box component="b">{item.projectPoint}</Box>,
        successLevel: (
          <StatusItem typeStatus={getSuccessLevel(item.successLevel.id)} />
        ),
      }))
  }, [dataProjectPointApi, pagination])

  const kpiMetricsRows = useMemo(() => {
    const getColorValue = (value: number) => {
      return (value || 0) < 0 ? themeColors.color.error.primary : ''
    }
    const getPercentValue = (value: number | null, keyUnique: number) => {
      if (value === null) return 'N/A'
      if (
        keyUnique === KPI_SECTIONS.EE_FORECAST ||
        keyUnique === KPI_SECTIONS.EE_ACTUAL ||
        keyUnique === KPI_SECTIONS.TIMELINESS
      ) {
        return <Box color={getColorValue(value)}>{formatNumber(value)}%</Box>
      }
      return <Box color={getColorValue(value)}>{formatNumber(value)}</Box>
    }
    return (
      projectPointSelected?.pointDetail?.map(
        (item: PointDetailItem, index: number) => {
          return {
            id: index,
            no: index + 1,
            kpiMetrics: (
              <ColTooltip
                colName={KPI_COLS_LABELS[item.keyUnique]}
                section={KPI_COLS_SECTIONS[item.keyUnique]}
              />
            ),
            weight: item.weight !== null ? `${item.weight}%` : 'N/A',
            norm: getPercentValue(item.norm, item.keyUnique),
            usl: getPercentValue(item.usl, item.keyUnique),
            value:
              item.value === null ? (
                getPercentValue(item.value, item.keyUnique)
              ) : (
                <Box color={themeColors.color.blue.primary}>
                  {getPercentValue(item.value, item.keyUnique)}
                </Box>
              ),
            kpiPoint:
              item.kpiPoint !== null ? (
                <Box
                  color={
                    item.kpiPoint >= 0
                      ? themeColors.color.blue.primary
                      : getColorValue(item.kpiPoint)
                  }
                  sx={{ fontWeight: 700 }}
                >
                  {formatNumber(item.kpiPoint)}
                </Box>
              ) : (
                'N/A'
              ),
            status: item.status ? (
              <StatusItem typeStatus={getKPIStatusSummary(item)} />
            ) : (
              <></>
            ),
          }
        }
      ) || []
    )
  }, [projectPointSelected])

  const onRangeMonthPickerChange = (payload: RangeDate) => {
    dispatch(
      setKpiRangeDateFilter({
        ...payload,
        endDate: getLastDayOfMonth(payload.endDate as Date),
      })
    )
    setProjectPointSelected({})
  }

  const onProjectPointRowClick = (projectPoint: any) => {
    setProjectPointSelected(projectPoint)
  }

  const fillDataSummary = ({ data }: AxiosResponse) => {
    setDataProjectPointApi(data)
  }

  const getKPISummary = () => {
    setTimeout(() => {
      setLoading(true)
    })
    const payload = {
      projectId: params.projectId as string,
      queryParameters: {
        valueType,
        startMonth: (
          formatAnyToDate(kpiRangeDateFilter.startDate).getMonth() + 1
        ).toString(),
        startYear: formatAnyToDate(kpiRangeDateFilter.startDate)
          .getFullYear()
          .toString(),
        endMonth: (
          formatAnyToDate(kpiRangeDateFilter.endDate).getMonth() + 1
        ).toString(),
        endYear: formatAnyToDate(kpiRangeDateFilter.endDate)
          .getFullYear()
          .toString(),
      },
    }
    ProjectService.getSummaryProjectDashboard(payload)
      .then(fillDataSummary)
      .finally(() => {
        setLoading(false)
      })
  }

  const onPageChange = (newPage: number) => {
    setPagination({
      ...pagination,
      pageNum: newPage,
    })
  }

  const onPageSizeChange = (newPageSize: number) => {
    setPagination({
      pageSize: newPageSize,
      pageNum: 1,
    })
  }

  useEffect(() => {
    if (kpiRangeDateFilter.startDate && kpiRangeDateFilter.endDate) {
      getKPISummary()
    }
  }, [kpiRangeDateFilter, valueType])

  useEffect(() => {
    if (!flagInit && !!projectPointsRows.length) {
      setProjectPointSelected(projectPointsRows[0])
      setFlagInit(true)
    }
  }, [projectPointsRows, flagInit])

  useEffect(() => {
    if (generalInfo.startDate && !kpiRangeDateFilter.startDate) {
      dispatch(
        setKpiRangeDateFilter({
          startDate: getFirstDayOfMonth(generalInfo.startDate),
          endDate: getKPIEndMonth(generalInfo.endDate),
        })
      )
    }
  }, [generalInfo.startDate, generalInfo.endDate])

  return (
    <Box
      className={clsx(
        classes.RootProjectKPIInformationTable,
        !hideViewDetails && 'setMarginTop'
      )}
    >
      {!hideViewDetails && (
        <Box className={classes.containerViewKpiDetails}>
          <CommonButton
            lowercase
            className={classes.viewDetails}
            variant="outlined"
            onClick={() => {
              dispatch(setProjectDashboardScreenDetail('KPI_INFORMATION'))
              sessionStorage.setItem(
                'projectDashboardScreenDetail',
                'KPI_INFORMATION'
              )
            }}
            endIcon={<KeyboardDoubleArrowRight />}
          >
            {i18Project('TXT_VIEW_KPI_DETAILS')}
          </CommonButton>
        </Box>
      )}
      <Box className={classes.RootBody}>
        <CardFormSeeMore
          className={classes.projectPointContainer}
          title={i18Project('TXT_PROJECT_POINT')}
          hideSeeMore
        >
          <Box className={classes.bodyContent}>
            <RangeMonthPicker
              disabled={loading}
              title={{
                to: i18('LB_TO_V2'),
                from: i18('LB_FROM'),
              }}
              startDate={kpiRangeDateFilter.startDate}
              endDate={kpiRangeDateFilter.endDate}
              onChange={onRangeMonthPickerChange}
            />
            <InputRadioList
              disabed={loading}
              value={valueType}
              listOptions={radioListOptions}
              onChange={type => {
                setProjectPointSelected({})
                setValueType(type)
              }}
            />
            <CommonTable
              loading={loading}
              activeId={projectPointSelected.id}
              minWidth={400}
              columns={projectPointColumn}
              rows={projectPointsRows}
              onRowClick={onProjectPointRowClick}
              pagination={{
                ...pagination,
                totalElements: dataProjectPointApi.length,
                onPageChange,
                onPageSizeChange,
              }}
            />
          </Box>
        </CardFormSeeMore>
        <CardFormSeeMore
          className={classes.projectPointRightContainer}
          title={titleRightContent}
          hideSeeMore
        >
          <Box className={classes.bodyContent}>
            <Box className={classes.titleBodyRightContent}>
              {valueType === SEPARATE
                ? i18Project('TXT_SEPARATE_PROJECT_POINT')
                : i18Project('TXT_ACCUMULATED_PROJECT_POINT')}
            </Box>
            <CommonTable
              loading={loading}
              columns={kpiMetricsColumns}
              rows={kpiMetricsRows}
              LastRow={
                <TableRow>
                  <TableCell colSpan={1}></TableCell>
                  <TableCell colSpan={1}>
                    <Box className={classes.total}>{i18('LB_TOTAL')}</Box>
                  </TableCell>
                  <TableCell>
                    <Box component="b">{projectPointSelected.totalWeight}%</Box>
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                  <TableCell colSpan={1}>
                    <Box component="b">{projectPointSelected.projectPoint}</Box>
                  </TableCell>
                  <TableCell colSpan={1}>
                    {projectPointSelected.successLevel}
                  </TableCell>
                </TableRow>
              }
            />
          </Box>
        </CardFormSeeMore>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectKPIInformationTable: {
    display: 'flex',
    gap: theme.spacing(3),
    flexDirection: 'column',
    '&.setMarginTop': {
      marginTop: '-60px',
    },
  },
  containerViewKpiDetails: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  RootBody: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  total: {
    fontWeight: 700,
    fontSize: 16,
  },
  projectPointContainer: {
    width: '440px',
  },
  projectPointRightContainer: {
    width: 'calc(100% - 460px)',
  },
  viewDetails: {
    borderRadius: '20px !important',
  },
  bodyContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  titleBodyRightContent: {
    textAlign: 'center',
    color: theme.color.blue.primary,
    fontWeight: 700,
  },
  RootColTooltip: {
    display: 'flex',
  },
  iconI: {
    width: '18px',
    marginTop: '-10px',
    marginLeft: '5px',
    cursor: 'pointer',
  },
  tooltipBox: {
    backgroundColor: '#fff !important',
  },
  widthMaxContent: {
    width: 'max-content',
  },
}))

export default ProjectKPIInformationTable
