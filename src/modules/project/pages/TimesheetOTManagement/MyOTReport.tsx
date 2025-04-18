import StatusItem, { IStatusType } from '@/components/common/StatusItem'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import {
  STATUS_OT_REPORT_LABELS,
  STATUS_OT_REPORT_VALUES,
} from '@/modules/daily-report/const'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ModalRequestOT from '../../components/ModalRequestOT'
import { projectSelector, setListCheckedReportOT } from '../../reducer/project'
import {
  deleteReportOT,
  getListProjectReportOT,
  getListReportOT,
  getReportOTDetail,
  getTotalReportOT,
} from '../../reducer/thunk'
import { IListRequestParams, ProjectState } from '../../types'
import ModalCreateOTRequest from './ModalCreateOTRequest'
import ModalDetailOTRequest from './ModalDetailOTRequest'
import TableTimesheetOTManagementList from './TableTimesheetOTManagementList'
import TimesheetOTManagementListAction from './TimesheetOTManagementListAction'

const requestOTListTimesheetHeadCells: TableHeaderColumn[] = [
  {
    id: 'projectCode',
    align: 'left',
    label: 'Project Code',
    sortBy: 'projectCode',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'projectName',
    align: 'left',
    label: 'Project Name',
    sortBy: 'projectName',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'OTHours',
    align: 'center',
    label: 'OT Hours',
    checked: false,
  },
  {
    id: 'OTDate',
    align: 'center',
    label: 'OT Date',
    sortBy: 'otDate',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'reportDate',
    align: 'center',
    label: 'Report Date',
    sortBy: 'reportDate',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'status',
    align: 'left',
    label: 'Status',
    checked: false,
  },
  {
    id: 'delete',
    align: 'center',
    label: 'Action',
    checked: false,
  },
]

export const getOTReportStatus = (status: number) => {
  let result: IStatusType = {
    color: '',
    label: '',
  }
  switch (status) {
    case STATUS_OT_REPORT_VALUES.IN_REVIEW:
      result = {
        color: 'orange',
        label: STATUS_OT_REPORT_LABELS[STATUS_OT_REPORT_VALUES.IN_REVIEW],
      }
      break
    case STATUS_OT_REPORT_VALUES.CONFIRMED:
      result = {
        color: 'blue',
        label: STATUS_OT_REPORT_LABELS[STATUS_OT_REPORT_VALUES.CONFIRMED],
      }
      break
    case STATUS_OT_REPORT_VALUES.APPROVED:
      result = {
        color: 'green',
        label: STATUS_OT_REPORT_LABELS[STATUS_OT_REPORT_VALUES.APPROVED],
      }
      break
    case STATUS_OT_REPORT_VALUES.REJECTED:
      result = {
        color: 'red',
        label: STATUS_OT_REPORT_LABELS[STATUS_OT_REPORT_VALUES.REJECTED],
      }
      break
    default:
      result = {
        color: 'orange',
        label: STATUS_OT_REPORT_LABELS[STATUS_OT_REPORT_VALUES.IN_REVIEW],
      }
  }
  return result
}

const createData = (item: any) => {
  const useActions =
    item.status === STATUS_OT_REPORT_VALUES.REJECTED ||
    item.status === STATUS_OT_REPORT_VALUES.IN_REVIEW
  return {
    id: item.id,
    projectCode: item.project.code,
    projectName: item.project.name,
    status: <StatusItem typeStatus={getOTReportStatus(item.status)} />,
    OTHours: item.otHours,
    OTDate: formatDate(item.otDate),
    reportDate: formatDate(item.reportDate),
    useUpdateIcon: useActions,
    useDeleteIcon: useActions,
    disableRowCheckbox: !useActions,
  }
}

const refactorQueryParameters = (queryParameters: IListRequestParams) => {
  const newQueryParameters = {
    ...structuredClone(queryParameters),
  }
  return newQueryParameters
}

const ProjectList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const [isShowCreateReport, setIsShowCreateReport] = useState<boolean>(false)
  const [isShowDetailReport, setIsShowDetailReport] = useState<boolean>(false)
  const [reportOT, setReportOT] = useState(null)
  const [isOpenDeleteReport, setIsOpenDeleteReport] = useState(false)
  const [ids, setIds] = useState<string[]>([])
  const [isModalRequestOT, setIsModalRequestOT] = useState(false)
  const [requestId, setRequestId] = useState('')
  const {
    totalReportOT,
    reportOTList,
    reportOTTimesheetQueryParameters,
    listCheckedReportOT,
  }: ProjectState = useSelector(projectSelector)
  const [listProject, setListProject] = useState<any[]>([])
  const rows = useMemo(() => {
    return reportOTList?.map((item: any) => createData(item)) || []
  }, [reportOTList])
  const [isUpdateModal, setIsUpdateModal] = useState<boolean>(false)
  const getListReportApi = async (params: IListRequestParams = {}) => {
    const newParams = {
      ...params,
      myOT: true,
    }
    const listQueryParameters = refactorQueryParameters(params)
    const listQueryParametersTotal = refactorQueryParameters(newParams)
    try {
      dispatch(updateLoading(true))
      await Promise.all([
        dispatch(getListReportOT(listQueryParameters)),
        dispatch(getTotalReportOT(listQueryParametersTotal)),
      ])
    } catch (error) {
      // Xử lý lỗi ở đây nếu cần
      console.error('Error fetching reports:', error)
    } finally {
      dispatch(updateLoading(false))
    }
  }
  useEffect(() => {
    getListReportApi(reportOTTimesheetQueryParameters)
  }, [reportOTTimesheetQueryParameters])

  const handleDeleteSection = async () => {
    setIsOpenDeleteReport(true)
    setIds(listCheckedReportOT)
  }

  const handleDetailOTReport = async (row: any) => {
    try {
      dispatch(updateLoading(true))
      const [reportOT, reportListProject] = await Promise.all([
        dispatch(getReportOTDetail({ otReportId: parseInt(row.id) })),
        dispatch(getListProjectReportOT({})),
      ])
      const currentListProject: any[] = reportListProject.payload.data.map(
        (item: any) => ({
          id: item.project.id,
          label: item.project.name,
          value: item.project.id,
          requestId: item.requestId,
          requestStartDate: item.otRequestStartDate,
          requestEndDate: item.otRequestEndDate,
        })
      )
      setListProject(currentListProject)
      setReportOT(reportOT.payload.data)
    } catch (error) {
      // Xử lý lỗi ở đây nếu cần
    } finally {
      dispatch(updateLoading(false))
    }
  }
  const handleRowClick = async (row: any) => {
    try {
      await handleDetailOTReport(row)
      setIsShowDetailReport(true)
      setIsUpdateModal(false)
    } catch {}
  }

  const handleUpdateClick = async (row: any) => {
    try {
      await handleDetailOTReport(row)
      setIsShowDetailReport(true)
      setIsUpdateModal(true)
    } catch {}
  }

  const handleDeleteReport = async () => {
    try {
      await dispatch(deleteReportOT({ id: ids }))
      getListReportApi(reportOTTimesheetQueryParameters)
      setIds([])
      dispatch(setListCheckedReportOT([]))
    } catch {}
  }

  const onDeleteClick = (row: any) => {
    setIsOpenDeleteReport(true)
    setIds(row.id)
  }

  const handleAddReportOT = () => {
    setIsShowCreateReport(true)
  }

  const handleClose = (isReloadList?: boolean) => {
    setIsShowCreateReport(false)
    if (isReloadList) {
      getListReportApi(reportOTTimesheetQueryParameters)
    }
  }

  const onDeleteRequestOT = (reportOTDetail: any) => {
    setIsOpenDeleteReport(true)
    setIds(reportOTDetail.id)
  }

  return (
    <Box className={classes.projectContainer}>
      <TimesheetOTManagementListAction
        onAddReportOT={handleAddReportOT}
        onDeleteSelection={handleDeleteSection}
      />
      <TableTimesheetOTManagementList
        totalReportOT={totalReportOT}
        rows={rows}
        headCells={requestOTListTimesheetHeadCells}
        params={reportOTTimesheetQueryParameters}
        refactorQueryParameters={refactorQueryParameters}
        onDeleteClick={onDeleteClick}
        onUpdateClick={handleUpdateClick}
        onRowClick={handleRowClick}
      />
      {isShowCreateReport && <ModalCreateOTRequest onClose={handleClose} />}
      {isShowDetailReport && (
        <ModalDetailOTRequest
          onUpdate={() => getListReportApi(reportOTTimesheetQueryParameters)}
          listProject={listProject}
          reportOTDetail={reportOT}
          onClose={() => setIsShowDetailReport(false)}
          isUpdateModal={isUpdateModal}
          setIsUpdateModal={setIsUpdateModal}
          onOpenRequestOT={(requestId: string) => {
            setRequestId(requestId)
            setIsModalRequestOT(true)
          }}
          isMyOT
          onDeleteRequestOT={onDeleteRequestOT}
        />
      )}
      {isOpenDeleteReport && (
        <ModalDeleteRecords
          open
          titleMessage={'Delete Report OT'}
          subMessage={'Do you wish to delete this report OT'}
          onClose={() => setIsOpenDeleteReport(false)}
          onSubmit={handleDeleteReport}
        />
      )}
      {isModalRequestOT && (
        <ModalRequestOT
          open
          onCloseModal={() => setIsModalRequestOT(false)}
          disabled={false}
          requestOTId={requestId}
        />
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootProjectList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  projectContainer: {
    marginTop: theme.spacing(3),
  },
}))
export default ProjectList
