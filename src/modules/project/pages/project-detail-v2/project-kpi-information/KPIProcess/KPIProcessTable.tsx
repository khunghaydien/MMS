import { getWeekDates } from '@/components/Datepicker/InputWeekPicker'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import StatusItem from '@/components/common/StatusItem'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { NS_PROJECT } from '@/const/lang.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { deleteProcess } from '@/modules/project/reducer/thunk'
import { IProcessQueriesState, ProjectState } from '@/modules/project/types'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatNumber } from '@/utils'
import { Box, TableCell, TableRow, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, Fragment, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProcessStatus } from './KPIProcess'
import ModalAddNewReview from './ModalAddNewReview'
import ModalDetailReview from './ModalDetailReview'
type IKPIProcessTable = {
  loading: boolean
  onReload: () => void
  processStatus: number
  processQueries: IProcessQueriesState
  setProcessQueries: Dispatch<SetStateAction<IProcessQueriesState>>
}

export const getValueView = (value: string | number | null) => {
  if (value !== null) {
    return value ? formatNumber(value) : 0
  }
  return '--'
}

const createData = (payload: {
  item: any
  index: number
  pageNum: number
  pageSize: number
  useDeleteIcon: boolean
}) => {
  const { item, index, pageNum, pageSize } = payload

  return {
    ...item,
    id: item.id,
    no: (pageNum - 1) * pageSize + index + 1,
    weekColumn: (
      <Box sx={{ textAlign: 'center' }}>
        <Box>
          {item.week}/{item.yearWeek}
        </Box>
        <Box>
          (
          {getWeekDates(item.yearWeek as number, item.week as number).startDate}
          -{getWeekDates(item.yearWeek as number, item.week as number).endDate})
        </Box>
      </Box>
    ),
    weekText: `${item.week}/${item.yearWeek} (${
      getWeekDates(item.yearWeek as number, item.week as number).startDate
    }-${getWeekDates(item.yearWeek as number, item.week as number).endDate})`,
    pcRate: item.processComplianceRate,
    planning: item.planning,
    monitoring: item.monitoring,
    closing: item.closing,
    pcRateView: getValueView(item.processComplianceRate),
    planningView: getValueView(item.planning),
    monitoringView: getValueView(item.monitoring),
    closingView: getValueView(item.closing),
    status: <StatusItem typeStatus={getProcessStatus(item.weekStatus)} />,
    useDeleteIcon: payload.useDeleteIcon,
  }
}

const KPIProcessTable = ({
  loading,
  onReload,
  processStatus,
  processQueries,
  setProcessQueries,
}: IKPIProcessTable) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { projectId } = useParams()

  const {
    processList,
    processAveragePoints,
    totalProcessList,
    permissionProjectKPI,
  }: ProjectState = useSelector(projectSelector)

  const [openModalAddNewReview, setOpenModalAddNewReview] = useState(false)
  const [openModalDetailReview, setOpenModalDetailReview] = useState(false)
  const [reviewSelected, setReviewSelected] = useState<any>({})
  const [openModalDeleteReview, setOpenModalDeleteReview] = useState(false)
  const [currentLoading, setCurrentLoading] = useState(false)

  const columns: TableHeaderColumn[] = [
    {
      id: 'no',
      label: i18('LB_NO'),
    },
    {
      id: 'weekColumn',
      label: i18('TXT_WEEK'),
      align: 'center',
    },
    {
      id: 'pcRateView',
      label: i18Project('TXT_PC_RATE'),
    },
    {
      id: 'planningView',
      label: i18Project('TXT_PLANNING'),
    },
    {
      id: 'monitoringView',
      label: i18Project('TXT_MONITORING'),
    },
    {
      id: 'closingView',
      label: i18Project('TXT_CLOSING'),
    },
    {
      id: 'status',
      label: i18('LB_STATUS'),
    },
    {
      id: 'delete',
      label: i18('LB_ACTION'),
      align: 'center',
    },
  ]
  const rows = useMemo(() => {
    return (
      processList?.map((item: any, index: number) =>
        createData({
          item,
          index,
          pageNum: processQueries.pageNum,
          pageSize: processQueries.pageSize,
          useDeleteIcon: !!permissionProjectKPI.processDelete,
        })
      ) || []
    )
  }, [processList, processQueries.pageNum, permissionProjectKPI.processDelete])

  const onDelete = (row: any) => {
    setReviewSelected(row)
    setOpenModalDeleteReview(true)
  }

  const onPageChange = (newPage: number) => {
    setProcessQueries({
      ...processQueries,
      pageNum: newPage,
    })
  }

  const onPageSizeChange = (newPageSize: number) => {
    setProcessQueries({
      ...processQueries,
      pageSize: newPageSize,
      pageNum: 1,
    })
  }

  const onClickReviewRow = (review: any) => {
    setReviewSelected(review)
    setOpenModalDetailReview(true)
  }

  const deleteReviewApi = async () => {
    try {
      await dispatch(
        deleteProcess({ projectId: projectId, processId: reviewSelected.id })
      )
        .unwrap()
        .then(res => {
          dispatch(
            alertSuccess({
              message: res.message,
            })
          )
        })
    } catch {
    } finally {
      setCurrentLoading(false)
      onReload()
    }
  }

  return (
    <Fragment>
      {openModalAddNewReview && (
        <ModalAddNewReview
          onClose={() => setOpenModalAddNewReview(false)}
          onSubmit={onReload}
        />
      )}
      {openModalDetailReview && (
        <ModalDetailReview
          initReview={reviewSelected}
          onClose={() => setOpenModalDetailReview(false)}
          onSubmit={onReload}
          onDelete={() => setOpenModalDeleteReview(true)}
        />
      )}
      {openModalDeleteReview && (
        <ModalDeleteRecords
          open
          titleMessage={i18Project('TXT_DELETE_REVIEW')}
          subMessage={i18Project('MSG_CONFIRM_REVIEW_DELETE')}
          onClose={() => setOpenModalDeleteReview(false)}
          onSubmit={deleteReviewApi}
        />
      )}
      <CommonTable
        loading={loading || currentLoading}
        columns={columns}
        rows={rows}
        onRowClick={onClickReviewRow}
        onDeleteClick={onDelete}
        pagination={{
          pageNum: processQueries.pageNum,
          pageSize: processQueries.pageSize,
          totalElements: totalProcessList,
          onPageChange,
          onPageSizeChange,
        }}
        FooterActions={
          !!permissionProjectKPI.processCreate ? (
            <ButtonAddPlus
              label={i18Project('TXT_ADD_NEW_REVIEW')}
              onClick={() => setOpenModalAddNewReview(true)}
            />
          ) : (
            <Fragment />
          )
        }
        FirstRow={
          <TableRow>
            <TableCell colSpan={1}></TableCell>
            <TableCell colSpan={1}>
              <Box className={classes.averagePoint}>
                {i18Project('TXT_AVERAGE_POINT')}
              </Box>
            </TableCell>
            <TableCell>
              <Box component="b">
                {processAveragePoints?.averageProcessComplianceRate
                  ? formatNumber(
                      processAveragePoints?.averageProcessComplianceRate
                    )
                  : '--'}
              </Box>
            </TableCell>
            <TableCell>
              <Box component="b">
                {processAveragePoints?.averagePlanning
                  ? formatNumber(processAveragePoints?.averagePlanning)
                  : '--'}
              </Box>
            </TableCell>
            <TableCell>
              <Box component="b">
                {processAveragePoints?.averageMonitoring
                  ? formatNumber(processAveragePoints?.averageMonitoring)
                  : '--'}
              </Box>
            </TableCell>
            <TableCell>
              <Box component="b">
                {processAveragePoints?.averageClosing
                  ? formatNumber(processAveragePoints?.averageClosing)
                  : '--'}
              </Box>
            </TableCell>
            <TableCell>
              <Box>
                <StatusItem typeStatus={getProcessStatus(processStatus)} />
              </Box>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        }
      />
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  averagePoint: {
    fontWeight: 700,
    textAlign: 'center',
    fontSize: 16,
  },
}))

export default KPIProcessTable
