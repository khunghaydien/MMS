import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import CommonTable from '@/components/table/CommonTable'
import { UNIT_OF_TIME } from '@/const/app.const'
import { OptionItem, TableHeaderColumn } from '@/types'
import {
  allowedYears as allowedYearsUtil,
  getFormatNumberDecimal,
} from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { isEmpty } from 'lodash'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ActualEffortQueryRA } from './AllocationDetails'

interface TableActualEffortProps {
  actualEffortQuery: ActualEffortQueryRA
  setActualEffortQuery: Dispatch<SetStateAction<ActualEffortQueryRA>>
  actualEffort: { data: any[]; total: number }
  isLoadingListActualEffort: boolean
}
interface YearData {
  [key: string]: number
}

const TableActualEffort = ({
  actualEffortQuery,
  setActualEffortQuery,
  actualEffort,
  isLoadingListActualEffort,
}: TableActualEffortProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const allowedYears = useMemo(() => {
    return allowedYearsUtil(2016, 2099)
  }, [])

  const refactorStaffActualEffort = (staffActualEffort: {
    staffCode: string
    staffName: string
    actualEffort: number
    totalOT: number
    effort: [
      {
        year: number
        headcount: number[]
      }
    ]
  }) => {
    const transformedEffort: { [key: string]: number | string }[] =
      staffActualEffort.effort.map(({ year, headcount }) => {
        const result: { [key: string]: number | string } = {}
        headcount.forEach((value, index) => {
          const month = index + 1
          const key = `${month}/${year}`
          result[key] = getFormatNumberDecimal(value)
        })
        return result
      })
    const combinedObject: { [key: string]: number | string } =
      transformedEffort.reduce((acc, obj) => {
        Object.assign(acc, obj)
        return acc
      }, {})
    return {
      id: staffActualEffort?.staffCode,
      staffName: staffActualEffort?.staffName,
      actualEffort: getFormatNumberDecimal(staffActualEffort?.actualEffort),
      totalOT: staffActualEffort?.totalOT,
      ...combinedObject,
    }
  }

  const headCellsMonth = useMemo(() => {
    const years: number[] =
      !isEmpty(actualEffort.data) &&
      actualEffort.data[0]?.effort.map((item: any) => item.year)
    const headCells: TableHeaderColumn[] = [
      {
        id: 'staffName',
        align: 'left',
        label: i18next.t('common:LB_STAFF_NAME'),
      },
      {
        id: 'actualEffort',
        align: 'left',
        label: i18next.t('common:LB_ACTUAL_EFFORT'),
      },
      {
        id: 'totalOT',
        align: 'left',
        label: i18next.t('common:LB_TOTAL_OT'),
      },
    ]

    if (!isEmpty(years))
      years.forEach(item => {
        for (let month = 1; month <= 12; month++) {
          headCells.push({
            id: `${month}/${item}`,
            align: 'center',
            label: `${month}/${item}`,
          })
        }
      })
    return headCells
  }, [actualEffort])

  const rows = useMemo(() => {
    const base = actualEffort.data.map((staff: any) =>
      refactorStaffActualEffort(staff)
    )
    return [...base]
  }, [actualEffort])

  const handlePageChange = (newPage: number) => {
    setActualEffortQuery((prev: ActualEffortQueryRA) => ({
      ...prev,
      pageNum: newPage,
    }))
  }
  const handlePageSizeChange = (newPageSize: number) => {
    setActualEffortQuery((prev: ActualEffortQueryRA) => ({
      ...prev,
      pageNum: 1,
      pageSize: newPageSize,
    }))
  }

  const handleYearChange = (date: Date | null, keyName: string) => {
    setActualEffortQuery((prev: ActualEffortQueryRA) => ({
      ...prev,
      [keyName]: date?.getTime() || null,
    }))
  }

  const handleUnitOfTimeChange = (unitOfTime: string, option?: OptionItem) => {
    setActualEffortQuery((prev: ActualEffortQueryRA) => ({
      ...prev,
      unitOfTime,
    }))
  }

  return (
    <Box>
      <Box className={classes.headerFilter}>
        <Box className={classes.fontBold}>{i18('LB_FROM_YEAR_V2')}</Box>
        <Box sx={{ width: 160 }}>
          <InputDatepicker
            keyName="fromYear"
            readOnly
            allowedYears={allowedYears}
            views={['year']}
            inputFormat="YYYY"
            value={
              actualEffortQuery.fromYear
                ? new Date(actualEffortQuery.fromYear)
                : null
            }
            maxDate={actualEffortQuery.toYear}
            onChange={handleYearChange}
          />
        </Box>
        <Box className={classes.fontBold}>{i18('LB_TO_V2')}</Box>
        <Box sx={{ width: 160 }}>
          <InputDatepicker
            readOnly
            keyName="toYear"
            allowedYears={allowedYears}
            views={['year']}
            inputFormat="YYYY"
            value={
              actualEffortQuery.toYear
                ? new Date(actualEffortQuery.toYear)
                : null
            }
            minDate={actualEffortQuery.fromYear}
            onChange={handleYearChange}
          />
        </Box>
        <FormLayout width={200}>
          <InputDropdown
            width={200}
            isShowClearIcon={false}
            value={actualEffortQuery.unitOfTime || ''}
            listOptions={UNIT_OF_TIME}
            placeholder={i18('PLH_SELECT_UNIT_OF_TIME')}
            onChange={handleUnitOfTimeChange}
          />
        </FormLayout>
      </Box>
      {isLoadingListActualEffort ? (
        <LoadingSkeleton />
      ) : (
        <CommonTable
          columns={headCellsMonth}
          rows={rows}
          pagination={{
            totalElements: actualEffort.total,
            pageSize: actualEffortQuery.pageSize as number,
            pageNum: actualEffortQuery.pageNum as number,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  headerFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  fontBold: {
    fontWeight: 'bold',
  },
}))

export default TableActualEffort
