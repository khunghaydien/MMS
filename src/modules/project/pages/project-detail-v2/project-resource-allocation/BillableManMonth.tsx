import RangeYearPicker from '@/components/Datepicker/RangeYearPicker'
import CardFormEdit from '@/components/Form/CardFormEdit'
import CommonButton from '@/components/buttons/CommonButton'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import {
  getProjectHeadcount,
  updateProjectHeadcount,
} from '@/modules/project/reducer/thunk'
import { HeadcountOfYear, ProjectState } from '@/modules/project/types'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem, RangeDate } from '@/types'
import { getMonthsBetween } from '@/utils/date'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ProjectBillableManMonth } from '../../project-create/ProjectCreate'
import TableHeadcountDetail from './TableHeadcountDetail'
import TotalHeadcount from './TotalHeadcount'

interface BillableManMonthState {
  billableEffort: HeadcountOfYear[]
  assignEffort: HeadcountOfYear[]
  actualEffort: HeadcountOfYear[]
  shareEffort: HeadcountOfYear[]
}

interface BillableManMonthProps {}

const initBillableManMonthState: BillableManMonthState = {
  actualEffort: [],
  assignEffort: [],
  billableEffort: [],
  shareEffort: [],
}

const BillableManMonth = ({}: BillableManMonthProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)

  const {
    generalInfo,
    updateProjectHeadcountContractEffort,
    permissionResourceAllocation,
  }: ProjectState = useSelector(projectSelector)

  const getDefaultFilter = () => {
    const currentYear = new Date().getFullYear()
    const projectStartYear = generalInfo.startDate?.getFullYear() as number
    const projectEndYear = generalInfo.endDate?.getFullYear() as number
    if (currentYear >= projectStartYear && currentYear <= projectEndYear) {
      return {
        startDate: new Date(`${currentYear}-01-01`),
        endDate: new Date(`${currentYear}-12-31`),
      } as RangeDate
    }
    if (currentYear > projectEndYear) {
      return {
        startDate: new Date(`${projectEndYear}-01-01`),
        endDate: new Date(`${projectEndYear}-12-31`),
      } as RangeDate
    }
    return {
      startDate: null,
      endDate: null,
    } as RangeDate
  }

  const [editable, setEditable] = useState(false)
  const [filters, setFilters] = useState(() => getDefaultFilter())
  const [divisionError, setDivisionError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [divisionState, setDivisionState] = useState<OptionItem>({})
  const [divisionTemp, setDivisionTemp] = useState<OptionItem>({})
  const [billableManMonthState, setBillableManMonthState] =
    useState<BillableManMonthState>(initBillableManMonthState)
  const [billableManMonthTemp, setBillableManMonthTemp] = useState(
    initBillableManMonthState
  )
  const [countSubmit, setCountSubmit] = useState(0)

  const getEffort = (
    monthYear: string,
    field: keyof BillableManMonthState,
    editable: boolean
  ) => {
    const month = +monthYear.split('/')[0]
    const year = +monthYear.split('/')[1]
    const headcountOfYear = (
      editable ? billableManMonthTemp : billableManMonthState
    )[field].find(headcount => headcount.year === year)
    return headcountOfYear?.headcount[month - 1] || 0
  }

  const totalOfBillableManMonth = useMemo(() => {
    const getTotalByField = (field: keyof BillableManMonthState) => {
      let result = 0
      billableManMonthTemp[field].forEach(item => {
        item.headcount.forEach(effort => {
          result += +effort
        })
      })
      return result
    }
    let totalBillableEffort = getTotalByField('billableEffort')
    let totalAssignEffort = getTotalByField('assignEffort')
    let totalActualEffort = getTotalByField('actualEffort')
    let totalShareEffort = getTotalByField('shareEffort')
    return {
      totalBillableEffort,
      totalAssignEffort,
      totalActualEffort,
      totalShareEffort,
    }
  }, [billableManMonthTemp])

  const rows = useMemo(() => {
    const result: ProjectBillableManMonth[] = []
    const months = getMonthsBetween({
      startDate: generalInfo.startDate,
      endDate: generalInfo.endDate,
    })

    months.forEach(monthItem => {
      result.push({
        month: monthItem.month,
        billableEffort: getEffort(monthItem.month, 'billableEffort', editable),
        assignEffort: getEffort(monthItem.month, 'assignEffort', editable),
        actualEffort: getEffort(monthItem.month, 'actualEffort', editable),
        shareEffort: getEffort(monthItem.month, 'shareEffort', editable),
      })
    })
    return result.filter(item => {
      const year = +item.month.split('/')[1]
      return (
        // @ts-ignore
        year >= filters.startDate?.getFullYear() &&
        // @ts-ignore
        year <= filters.endDate?.getFullYear()
      )
    })
  }, [
    generalInfo,
    billableManMonthState,
    editable,
    billableManMonthTemp,
    filters,
  ])

  const buttonSaveAsDisabled = useMemo(() => {
    return (
      JSON.stringify(billableManMonthTemp) ===
        JSON.stringify(billableManMonthState) &&
      JSON.stringify(divisionTemp.id) === JSON.stringify(divisionState.id)
    )
  }, [billableManMonthTemp, billableManMonthState, divisionTemp, divisionState])

  const onBillableEffortChange = (value: string, monthYear: string) => {
    const newBillableEffortTemp = structuredClone(
      billableManMonthTemp.billableEffort
    )
    const indexByYear = newBillableEffortTemp.findIndex(
      item => item.year === +monthYear.split('/')[1]
    )
    const month = +monthYear.split('/')[0]
    newBillableEffortTemp[indexByYear].headcount[month - 1] = value
    setBillableManMonthTemp({
      ...billableManMonthTemp,
      billableEffort: newBillableEffortTemp,
    })
  }

  const onShareEffortChange = (value: string, monthYear: string) => {
    const newShareEffortTemp = structuredClone(billableManMonthTemp.shareEffort)
    const indexByYear = newShareEffortTemp.findIndex(
      item => item.year === +monthYear.split('/')[1]
    )
    const month = +monthYear.split('/')[0]
    newShareEffortTemp[indexByYear].headcount[month - 1] = value
    setBillableManMonthTemp({
      ...billableManMonthTemp,
      shareEffort: newShareEffortTemp,
    })
    setDivisionError(false)
  }

  const onRangeYearPickerChange = (payload: RangeDate) => {
    setFilters(payload)
  }

  const cancelEditable = () => {
    setEditable(false)
    setBillableManMonthTemp(billableManMonthState)
    setDivisionTemp(divisionState)
  }

  const saveHeadcount = () => {
    setCountSubmit(countSubmit + 1)
    if (!divisionTemp.id && rows.some(row => !!+row.shareEffort)) {
      setDivisionError(true)
      return
    }
    const requestBody = {
      billableEffort: billableManMonthTemp.billableEffort,
      shareEffort: divisionTemp.id
        ? [
            {
              divisionId: divisionTemp.id,
              effort: billableManMonthTemp.shareEffort,
            },
          ]
        : [],
      totalContractEffort: totalOfBillableManMonth.totalBillableEffort,
      totalShareEffort: totalOfBillableManMonth.totalShareEffort,
    }
    dispatch(
      updateProjectHeadcount({
        projectId: params.projectId || '',
        requestBody,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18nProject('MSG_UPDATE_PROJECT_INFORMATION_SUCCESS', {
              projectId: generalInfo.code || '',
            }),
          })
        )
        setDivisionError(false)
        getBillableManMonth()
        setEditable(false)
        setCountSubmit(0)
      })
  }

  const refactorInitBillableManMonthFromApi = (
    initBillableManMonthApi: BillableManMonthState
  ): BillableManMonthState => {
    const getInitHeadcountOfYear = (
      billableEffort: HeadcountOfYear[],
      field: keyof BillableManMonthState
    ) => {
      const result: HeadcountOfYear[] = []
      billableEffort.forEach(headcountOfYear => {
        result.push({
          year: headcountOfYear.year,
          headcount: initBillableManMonthApi[field]
            .find(r => r.year === headcountOfYear.year)
            ?.headcount?.map(effort => effort?.toString() || '0') || [
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
          ],
        })
      })
      return result
    }
    const result: BillableManMonthState = {
      billableEffort: getInitHeadcountOfYear(
        initBillableManMonthApi.billableEffort,
        'billableEffort'
      ),
      assignEffort: getInitHeadcountOfYear(
        initBillableManMonthApi.billableEffort,
        'assignEffort'
      ),
      actualEffort: getInitHeadcountOfYear(
        initBillableManMonthApi.billableEffort,
        'actualEffort'
      ),
      shareEffort: getInitHeadcountOfYear(
        initBillableManMonthApi.billableEffort,
        'shareEffort'
      ),
    }
    return result
  }

  const fillBillableManMonth = ({ data }: AxiosResponse) => {
    const billableManMonthFromApi = refactorInitBillableManMonthFromApi({
      billableEffort: data.contractEffort,
      assignEffort: data.assignEffort,
      actualEffort: data.actualEffort,
      shareEffort: data.shareEffort?.[0]?.effort || [],
    })
    const divisionFromApi: OptionItem = {
      id: data.shareEffort[0]?.division?.id || '',
      value: data.shareEffort[0]?.division?.id || '',
      label: data.shareEffort[0]?.division?.name || '',
    }
    setBillableManMonthState(billableManMonthFromApi)
    setBillableManMonthTemp(billableManMonthFromApi)
    setDivisionState(divisionFromApi)
    setDivisionTemp(divisionFromApi)
  }

  const getBillableManMonth = () => {
    setLoading(true)
    dispatch(getProjectHeadcount(params.projectId as string))
      .unwrap()
      .then(fillBillableManMonth)
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getBillableManMonth()
  }, [])

  return (
    <Box className={classes.flex16}>
      <Box className={classes.headcountLeft}>
        <Box className={classes.headerActions}>
          <RangeYearPicker
            startDate={filters.startDate}
            endDate={filters.endDate}
            onChange={onRangeYearPickerChange}
          />
          {!!updateProjectHeadcountContractEffort &&
            !editable &&
            !!permissionResourceAllocation.updateBillableEffort && (
              <CommonButton lowercase onClick={() => setEditable(true)}>
                {i18nProject('LB_UPDATE_BILLABLE_EFFORT')}
              </CommonButton>
            )}
          {editable && (
            <CardFormEdit
              hideBorder
              useDetailEditMode
              buttonUseDetailEditDisabled={buttonSaveAsDisabled}
              onCancelEditMode={cancelEditable}
              onSaveAs={saveHeadcount}
            />
          )}
        </Box>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <TableHeadcountDetail
            divisionError={divisionError}
            setDivisionError={setDivisionError}
            editable={editable}
            disabled={false}
            rows={rows}
            division={editable ? divisionTemp : divisionState}
            onDivisionChange={(division: OptionItem) => {
              setDivisionTemp(division)
              setDivisionError(false)
            }}
            onBillableEffortChange={onBillableEffortChange}
            onShareEffortChange={onShareEffortChange}
          />
        )}
      </Box>
      <TotalHeadcount totalOfBillableManMonth={totalOfBillableManMonth} />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  headcountLeft: {
    width: 'calc(100% - 320px)',
    maxWidth: '1200px',
  },
  buttonStepAction: {
    marginBottom: theme.spacing(3),
  },
  flex16: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  headerActions: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
  },
}))

export default BillableManMonth
