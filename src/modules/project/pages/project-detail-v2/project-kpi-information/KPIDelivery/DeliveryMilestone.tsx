import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import CommonButton from '@/components/buttons/CommonButton'
import StatusItem, { IStatusType } from '@/components/common/StatusItem'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { NS_PROJECT } from '@/const/lang.const'
import {
  MILESTONE_STATUS,
  MILESTONE_STATUS_LABELS,
} from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { RangeDate, SortChangePayload, TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, Fragment, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { MilestoneItemApi, MilestoneListQueryState } from './KPIDelivery'
import ModalAddNewMilestone from './ModalAddNewMilestone'
import ModalDeliveryMilestone from './ModalDeliveryMilestone'
import ModalDetailMilestone from './ModalDetailMilestone'

interface DeliveryMilestoneProps {
  totalValues: {
    totalMilestone: number
    totalDeliveredMilestone: number
    totalOnTimeDelivery: number
    timeliness: number
  }
  queries: MilestoneListQueryState
  setQueries: Dispatch<SetStateAction<MilestoneListQueryState>>
  milestoneList: MilestoneItemApi[]
  totalElements: number
  reloadApi: () => void
  loading: boolean
}

export const getMilestoneStatus = (status: number | null) => {
  let _status = status || MILESTONE_STATUS.NOT_DELIVER
  let statusItem: IStatusType = {
    color: '',
    label: '',
  }
  switch (_status) {
    case MILESTONE_STATUS.NOT_DELIVER:
      statusItem = {
        color: 'yellow',
        label: MILESTONE_STATUS_LABELS[MILESTONE_STATUS.NOT_DELIVER],
      }
      break
    case MILESTONE_STATUS.UP_COMING:
      statusItem = {
        color: 'blue',
        label: MILESTONE_STATUS_LABELS[MILESTONE_STATUS.UP_COMING],
      }
      break
    case MILESTONE_STATUS.FAIL:
      statusItem = {
        color: 'red',
        label: MILESTONE_STATUS_LABELS[MILESTONE_STATUS.FAIL],
      }
      break
    case MILESTONE_STATUS.PASS:
      statusItem = {
        color: 'green',
        label: MILESTONE_STATUS_LABELS[MILESTONE_STATUS.PASS],
      }
      break
    default:
      statusItem = {
        color: '',
        label: '',
      }
  }
  return statusItem
}

const DeliveryMilestone = ({
  totalValues,
  queries,
  setQueries,
  milestoneList,
  totalElements,
  reloadApi,
  loading,
}: DeliveryMilestoneProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const initColumns = useMemo(() => {
    return [
      {
        id: 'no',
        label: i18('LB_NO'),
      },
      {
        id: 'milestone',
        label: i18Project('TXT_MILESTONE'),
        sortBy: 'milestone',
        orderBy: 'desc',
      },
      {
        id: 'addedDateDDMMYYYY',
        label: i18Project('TXT_ADDED_DATE'),
        sortBy: 'addedDate',
        orderBy: 'desc',
      },
      {
        id: 'description',
        label: i18('LB_DESCRIPTION'),
      },
      {
        id: 'commitmentDeliveryDateDDMMYYYY',
        label: i18Project('TXT_COMMITMENT_DELIVERY_DATE'),
        sortBy: 'commitmentDeliveryDate',
        orderBy: 'desc',
      },
      {
        id: 'actualDeliveryDateDDMMYYYY',
        label: i18Project('TXT_ACTUAL_DELIVERY_DATE'),
        sortBy: 'actualDeliveryDate',
        orderBy: 'desc',
      },
      {
        id: 'statusComponent',
        label: i18('LB_STATUS'),
      },
      {
        id: 'deliverComponent',
        label: i18('LB_ACTION'),
      },
    ] as TableHeaderColumn[]
  }, [i18])

  const { permissionProjectKPI, generalInfo } = useSelector(projectSelector)
  const [columns, setColumns] = useState(initColumns)
  const [openModalAddNewMilestone, setOpenModalAddNewMilestone] =
    useState(false)
  const [openModalDetailMilestone, setOpenModalDetailMilestone] =
    useState(false)
  const [milestoneSelected, setMilestoneSelected] = useState<any>({})
  const [openModalDeleteMilestone, setOpenModalDeleteMilestone] =
    useState(false)
  const [openModalDeliver, setOpenModalDeliver] = useState(false)

  const rows = useMemo(() => {
    const onClickDeliverButton = (milestone: MilestoneItemApi) => {
      setOpenModalDeliver(true)
      setMilestoneSelected(milestone)
    }
    return milestoneList.map((milestone, index) => {
      return {
        id: milestone.id,
        no: (queries.pageNum - 1) * queries.pageSize + index + 1,
        milestone: milestone.name,
        name: milestone.name,
        addedDateDDMMYYYY: formatDate(milestone.addedDate as number),
        commitmentDeliveryDateDDMMYYYY: formatDate(
          milestone.commitmentDeliveryDate as number
        ),
        limitation: milestone.limitation,
        actualDeliveryDate: milestone.actualDeliveryDate
          ? new Date(milestone.actualDeliveryDate)
          : null,
        actualDeliveryDateDDMMYYYY: milestone.actualDeliveryDate
          ? formatDate(milestone.actualDeliveryDate)
          : '--',
        addedDate: milestone.addedDate ? new Date(milestone.addedDate) : null,
        commitmentDeliveryDate: milestone.commitmentDeliveryDate
          ? new Date(milestone.commitmentDeliveryDate)
          : null,
        description: milestone.description,
        status: milestone.status,
        statusComponent: (
          <StatusItem typeStatus={getMilestoneStatus(milestone.status)} />
        ),
        deliver: milestone.deliver,
        deliverComponent:
          !!permissionProjectKPI.useDeliveryDeliverMilestone &&
          (milestone.status === MILESTONE_STATUS.NOT_DELIVER ||
            milestone.status === MILESTONE_STATUS.UP_COMING) ? (
            <CommonButton onClick={() => onClickDeliverButton(milestone)}>
              {i18Project('TXT_DELIVER')}
            </CommonButton>
          ) : (
            <Fragment />
          ),
      }
    })
  }, [milestoneList, queries.pageSize, queries.pageNum])

  const onRangeMonthPickerChange = (payload: RangeDate) => {
    setQueries({
      ...queries,
      ...payload,
    } as MilestoneListQueryState)
  }

  const onPageChange = (newPage: number) => {
    setQueries({
      ...queries,
      pageNum: newPage,
    })
  }

  const onPageSizeChange = (newPageSize: number) => {
    setQueries({
      ...queries,
      pageSize: newPageSize,
      pageNum: 1,
    })
  }

  const onSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setColumns(newColumns)
    const newQueries = {
      ...queries,
      orderBy: nextOrderBy,
      sortBy,
    }
    setQueries(newQueries)
  }

  const onClickDeliveryMilestoneRow = (milestone: any) => {
    setMilestoneSelected(milestone)
    setOpenModalDetailMilestone(true)
  }

  const onDeleteDeliveryMilestone = (milestone: any) => {
    setMilestoneSelected(milestone)
    setOpenModalDeleteMilestone(true)
  }

  const onOpenModalDeleteMilestoneFromDetail = (milestone: any) => {
    setMilestoneSelected(milestone)
    setOpenModalDeleteMilestone(true)
  }
  const deleteMilestoneApi = () => {
    dispatch(updateLoading(true))
    ProjectService.deleteMilestone({
      projectId: params.projectId as string,
      milestoneId: milestoneSelected.id,
    })
      .then(() => {
        reloadApi()
        setOpenModalDetailMilestone(false)
        dispatch(
          alertSuccess({
            message: `${i18Project('TXT_MILESTONE')} ${i18(
              'MSG_DELETE_SUCCESS',
              {
                labelName: milestoneSelected.name,
              }
            )}`,
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }
  return (
    <Fragment>
      {openModalDeliver && (
        <ModalDeliveryMilestone
          onClose={() => setOpenModalDeliver(false)}
          initMilestone={milestoneSelected}
          reloadApi={() => {
            setOpenModalDeliver(false)
            reloadApi()
          }}
        />
      )}
      {openModalAddNewMilestone && (
        <ModalAddNewMilestone
          onClose={() => setOpenModalAddNewMilestone(false)}
          onAddedSuccessfully={() => {
            reloadApi()
          }}
        />
      )}
      {openModalDetailMilestone && (
        <ModalDetailMilestone
          initMilestone={milestoneSelected}
          onClose={() => setOpenModalDetailMilestone(false)}
          onOpenModalDeleteMilestoneFromDetail={
            onOpenModalDeleteMilestoneFromDetail
          }
          onUpdatedSuccessfully={() => {
            reloadApi()
          }}
        />
      )}
      {openModalDeleteMilestone && (
        <ModalDeleteRecords
          open
          titleMessage={i18Project('TXT_DELETE_MILESTONE')}
          subMessage={i18Project('MSG_CONFIRM_MILESTONE_DELETE', {
            labelName: milestoneSelected.name,
          })}
          onClose={() => setOpenModalDeleteMilestone(false)}
          onSubmit={deleteMilestoneApi}
        />
      )}
      <Box className={classes.RootDeliiveryMilestone}>
        <Box className={classes.filters}>
          <RangeMonthPicker
            disabled={loading}
            title={{
              from: i18Project('TXT_COMMITMENT_DELIVERY_DATE_FROM'),
              to: i18('LB_TO_V2'),
            }}
            startDate={queries.startDate}
            endDate={queries.endDate}
            onChange={onRangeMonthPickerChange}
          />
        </Box>
        {loading ? (
          <Box className={classes.boxLoadingTotals}>
            <LoadingSkeleton />
          </Box>
        ) : (
          <Box className={classes.totalList}>
            <Box className={classes.optionTotal}>
              <Box className={classes.labelTotal}>
                {i18Project('TXT_TOTAL_MILESTONE')}:
              </Box>
              <Box className={classes.valueTotal}>
                {totalValues.totalMilestone}
              </Box>
            </Box>
            <Box className={classes.optionTotal}>
              <Box className={classes.labelTotal}>
                {i18Project('TXT_TOTAL_DELIVERED_MILESTONE')}:
              </Box>
              <Box className={classes.valueTotal}>
                {totalValues.totalDeliveredMilestone}
              </Box>
            </Box>
            <Box className={classes.optionTotal}>
              <Box className={classes.labelTotal}>
                {i18Project('TXT_TOTAL_PASS_DELIVERY')}:
              </Box>
              <Box className={classes.valueTotal}>
                {totalValues.totalOnTimeDelivery}
              </Box>
            </Box>
            <Box className={classes.optionTotal}>
              <Box className={classes.labelTotal}>
                {i18Project('TXT_TIMELINESS')}:
              </Box>
              <Box className={classes.valueTotal}>
                {!totalValues.totalDeliveredMilestone &&
                !totalValues.totalOnTimeDelivery
                  ? '--'
                  : `${totalValues.timeliness}%`}
              </Box>
            </Box>
          </Box>
        )}
        <CommonTable
          loading={loading}
          columns={columns}
          rows={rows}
          onSortChange={onSortChange}
          onRowClick={onClickDeliveryMilestoneRow}
          onDeleteClick={onDeleteDeliveryMilestone}
          pagination={{
            pageNum: queries.pageNum,
            pageSize: queries.pageSize,
            totalElements: totalElements,
            onPageChange,
            onPageSizeChange,
          }}
          FooterActions={
            !!permissionProjectKPI.deliveryMilestoneCreate ? (
              <ButtonAddPlus
                label={i18Project('TXT_ADD_NEW_MILESTONE')}
                onClick={() => setOpenModalAddNewMilestone(true)}
              />
            ) : (
              <Fragment />
            )
          }
        />
      </Box>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootDeliiveryMilestone: {},
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  dateField: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
  },
  totalList: {
    display: 'flex',
    margin: theme.spacing(3, 0),
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  },
  optionTotal: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  labelTotal: {
    color: theme.color.blue.primary,
  },
  valueTotal: {
    fontWeight: 700,
    color: theme.color.blue.primary,
  },
  boxLoadingTotals: {
    margin: theme.spacing(1.5, 0),
    '& .root-loading-skeleton': {
      height: '115px',
    },
  },
}))

export default DeliveryMilestone
