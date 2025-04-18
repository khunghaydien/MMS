import StatusItem from '@/components/common/StatusItem'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant } from '@/const'
import { CycleQueryString } from '@/modules/mbo/models'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { IStatus, SortChangePayload, TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import { CYCLE_STATUS, EVALUATION_CYCLE_STATUS } from '../../const'
import {
  CycleState,
  cycleSelector,
  getCycleList,
  setCycleQueryString,
} from '../../reducer/cycle'

const headCellsCycle: TableHeaderColumn[] = [
  {
    id: 'no',
    align: 'left',
    label: i18next.t('common:LB_NO'),
    sortBy: 'code',
    orderBy: 'desc',
  },
  {
    id: 'name',
    align: 'left',
    label: i18next.t('mbo:LB_CYCLE_NAME'),
    sortBy: 'name',
    orderBy: 'desc',
  },
  {
    id: 'creator',
    align: 'left',
    label: i18next.t('mbo:LB_ORIGINATOR'),
  },
  {
    id: 'duration',
    align: 'left',
    label: i18next.t('common:LB_DURATION'),
    sortBy: 'duration',
    orderBy: 'desc',
  },
  {
    id: 'start',
    align: 'left',
    label: i18next.t('common:LB_START_DATE'),
    sortBy: 'startDate',
    orderBy: 'desc',
  },
  {
    id: 'end',
    align: 'left',
    label: i18next.t('common:LB_END_DATE'),
    sortBy: 'endDate',
    orderBy: 'desc',
  },
  {
    id: 'positionApplied',
    align: 'left',
    label: i18next.t('mbo:LB_POSITION_APPLIED'),
  },
  {
    id: 'status',
    align: 'left',
    label: i18next.t('common:LB_STATUS'),
  },
  {
    id: 'delete',
    align: 'left',
    label: i18next.t('common:LB_ACTION'),
  },
]

interface IProps {
  loading: boolean
  onDeleteCycle: (id: string) => void
}

export const convertEvaluationCycleStatus = (item: any): IStatus => {
  let _resultData: IStatus = { color: 'grey', label: '' }
  if (CYCLE_STATUS[item?.id]) {
    return CYCLE_STATUS[item?.id]
  }
  return _resultData
}

const TableCycles = ({ loading, onDeleteCycle }: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()
  const navigate = useNavigate()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { listCycle, totalCycleElements }: CycleState =
    useSelector(cycleSelector)
  const { cycleQueryString } = useSelector(cycleSelector)
  const { staff }: AuthState = useSelector(selectAuth)

  const [idSelectDelete, setIdSelectDelete] = useState<string | null>(null)

  const handleNavigateToDetailPage = (cycle: any) => {
    const url = StringFormat(PathConstant.MBO_CYCLE_DETAIL_FORMAT, cycle.id)
    navigate(url)
  }

  const handlePageChange = (newPage: number) => {
    dispatch(
      setCycleQueryString({
        ...cycleQueryString,
        pageNum: +newPage,
      })
    )
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(
      setCycleQueryString({
        ...cycleQueryString,
        pageNum: 1,
        pageSize: newPageSize,
      })
    )
  }

  const handleShowModalDeleteCycle = (cycle: any) => {
    setIdSelectDelete(cycle.id)
  }

  const handleCloseModalDeleteCycle = () => {
    setIdSelectDelete(null)
  }

  const handleSubmitModalDeleteCycle = () => {
    onDeleteCycle(idSelectDelete || '')
  }

  const rows = useMemo(() => {
    const startPage =
      (Number(cycleQueryString.pageNum) - 1) * Number(cycleQueryString.pageSize)
    const endPage =
      Number(cycleQueryString.pageNum) * Number(cycleQueryString.pageSize)
    let noArray: number[] = []
    for (let i = startPage; i < endPage; i++) {
      noArray.push(i + 1)
    }
    return listCycle?.map((item: any, index: number) => ({
      id: item.id,
      no: noArray[index],
      name: item?.isTemplate ? (
        <Box>
          <Box component="span">{item.name}</Box>
          <Box component="span" className={classes.tagDefault}>
            {i18('LB_TEMPLATE')}
          </Box>
        </Box>
      ) : (
        <Box>{item.name}</Box>
      ),
      duration: `${item.duration} ${i18next.t('common:LB_MONTHS')}`,
      start: formatDate(item.startDate),
      end: formatDate(item.endDate),
      positionApplied: i18('LB_ALL_POSITION'),
      status: (
        <StatusItem
          typeStatus={{ ...convertEvaluationCycleStatus(item.status) }}
        />
      ),
      isTemplate: item?.isTemplate,
      creator: item.createdBy?.name || '',
      useDeleteIcon:
        item.appraiser?.id === staff?.id &&
        (item.status?.id === EVALUATION_CYCLE_STATUS.NOT_START ||
          item.status?.id === EVALUATION_CYCLE_STATUS.UP_COMING),
    }))
  }, [listCycle, totalCycleElements, cycleQueryString])
  const formatPayloadQuery = (cycleQueryString: CycleQueryString) => {
    return {
      pageNum: cycleQueryString?.pageNum,
      pageSize: cycleQueryString?.pageSize,
      positionId:
        cycleQueryString?.positions?.map(item => item.id)?.toString() || '',
      duration: cycleQueryString?.duration,
      status: cycleQueryString?.status?.map(item => item.id)?.toString() || '',
      name: cycleQueryString?.name,
    }
  }
  const [loadingCycle, setLoading] = useState(false)
  const dispatchCycleList = (payload: any) => {
    setLoading(true)
    dispatch(getCycleList(payload))
      .unwrap()
      .finally(() => {
        setLoading(false)
      })
  }
  const [headCellsCycles, setHeadCellsCycles] = useState(headCellsCycle)
  const handleSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setHeadCellsCycles(newColumns)
    const newQueryParameters = {
      ...formatPayloadQuery(cycleQueryString),
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatchCycleList(newQueryParameters)
  }

  return (
    <Box className={classes.rootTableCycleList}>
      <CommonTable
        loading={loading || loadingCycle}
        columns={headCellsCycles}
        rows={rows}
        useOpenNewTab
        linkFormat={PathConstant.MBO_CYCLE_DETAIL_FORMAT}
        onSortChange={handleSortChange}
        onRowClick={handleNavigateToDetailPage}
        onDeleteClick={handleShowModalDeleteCycle}
        pagination={{
          totalElements: totalCycleElements,
          pageSize: cycleQueryString.pageSize as number,
          pageNum: cycleQueryString.pageNum as number,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
      {!!idSelectDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Mbo('TXT_DELETE_CYCLE')}
          subMessage={i18Mbo('MSG_CONFIRM_DELETE_CYCLE')}
          onClose={handleCloseModalDeleteCycle}
          onSubmit={handleSubmitModalDeleteCycle}
        />
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootTableCycleList: {
    marginTop: theme.spacing(4),
  },
  tagDefault: {
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(0.8),
    color: '#784c00',
    background: '#ffed91',
    borderColor: '#ffe58f',
    fontSize: '11px',
    marginLeft: theme.spacing(1),
  },
}))
export default TableCycles
