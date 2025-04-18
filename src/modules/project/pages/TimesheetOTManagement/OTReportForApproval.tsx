import StatusItem from '@/components/common/StatusItem'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { STATUS_OT_REPORT_VALUES } from '@/modules/daily-report/const'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem, TableHeaderColumn } from '@/types'
import { cleanObject, formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ModalRejectReport from '../../components/ModalRejectReportOT'
import ModalRequestOT from '../../components/ModalRequestOT'
import {
  projectSelector,
  setListCheckedApprovalOT,
} from '../../reducer/project'
import {
  getListApprovalOT,
  getListOTReportProject,
  getReportOTDetail,
  getTotalReportOT,
  updateOTReportStatus,
} from '../../reducer/thunk'
import { IListRequestParams, ProjectState } from '../../types'
import ModalDetailOTRequest from './ModalDetailOTRequest'
import { getOTReportStatus } from './MyOTReport'
import TableTimesheetOTManagementApprovalList from './TableTimesheetOTManagementApprovalList'
import TimesheetOTManagementListApprovalAction from './TimesheetOTManagementListApprovalAction'

const tmpApprovalOTListTimesheetHeadCells: TableHeaderColumn[] = [
  {
    id: 'staffCode',
    align: 'left',
    label: 'Staff Code',
    sortBy: 'staffCode',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'staffName',
    align: 'left',
    label: 'Staff Name',
    sortBy: 'staffName',
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
    align: 'center',
    label: 'Status',
    checked: false,
  },
  {
    id: 'action',
    align: 'center',
    label: 'Action',
    checked: false,
  },
]

const buttonStyle = cleanObject({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '20px',
  borderRadius: '8px',
})
const buttonApprove = cleanObject({
  ...buttonStyle,
  background: '#14AE5C',
  color: '#fff',
})
const buttonConfirm = cleanObject({
  ...buttonStyle,
  background: '#205DCE',
  color: '#fff',
})
const buttonReject = cleanObject({
  ...buttonStyle,
  border: '1px solid #EA4224',
  color: '#EA4224',
})
const createData = (
  item: any,
  onApprove?: (item: any) => void,
  onConfirm?: (item: any) => void,
  onReject?: (item: any) => void
) => {
  return {
    id: item.id,
    staffCode: item.staffCode,
    staffName: item.staffName,
    projectName: item.project.name,
    status: <StatusItem typeStatus={getOTReportStatus(item.status)} />,
    OTHours: item.otHours,
    OTDate: formatDate(item.otDate),
    reportDate: formatDate(item.reportDate),
    action: (
      <Box
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '5px',
        }}
      >
        {item.canApprove && (
          <Box
            onClick={event => {
              event.stopPropagation()
              !!onApprove && onApprove(item)
            }}
            style={buttonApprove}
          >
            Approve
          </Box>
        )}
        {item.canConfirm && (
          <Box
            onClick={event => {
              event.stopPropagation()
              !!onConfirm && onConfirm(item)
            }}
            style={buttonConfirm}
          >
            Confirm
          </Box>
        )}
        {item.canReject && (
          <Box
            onClick={event => {
              event.stopPropagation()
              !!onReject && onReject(item)
            }}
            style={buttonReject}
          >
            Reject
          </Box>
        )}
      </Box>
    ),
    disableRowCheckbox: !(item.canApprove || item.canConfirm || item.canReject),
  }
}

const refactorQueryParameters = (queryParameters: IListRequestParams) => {
  const newQueryParameters = {
    ...structuredClone(queryParameters),
  }
  return newQueryParameters
}
type IOTReportForApproval = {
  isDivisionDirector: boolean
  isAllReportOT?: boolean
}
const OTReportForApproval = ({
  isDivisionDirector,
  isAllReportOT,
}: IOTReportForApproval) => {
  let approvalOTListTimesheetHeadCells = [
    ...tmpApprovalOTListTimesheetHeadCells,
  ]
  if (isAllReportOT) {
    approvalOTListTimesheetHeadCells = approvalOTListTimesheetHeadCells.filter(
      item => item.id !== 'action'
    )
  }
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const [showConfirmRejectReport, setShowConfirmRejectReport] =
    useState<boolean>(false)
  const [ids, setIds] = useState<string[]>([])
  const [isModalRequestOT, setIsModalRequestOT] = useState(false)
  const [requestId, setRequestId] = useState('')
  const {
    totalReportOT,
    approvalOTList,
    approvalOTTimesheetQueryParameters,
    listCheckedApprovalOT,
  }: ProjectState = useSelector(projectSelector)
  const [isShowDetailReport, setIsShowDetailReport] = useState(false)
  const [reportOT, setReportOT] = useState(null)
  const [listOptions, setListOption] = useState<OptionItem[]>([])
  const [showConfirmReport, setShowConfirmReport] = useState<boolean>(false)
  const [showApproveReport, setShowApproveReport] = useState<boolean>(false)
  const rows = useMemo(() => {
    const onConfirm = (row: any) => {
      setShowConfirmReport(true)
      setIds([row.id])
    }
    const onApprove = (row: any) => {
      setShowApproveReport(true)
      setIds([row.id])
    }
    const onReject = (row: any) => {
      setShowConfirmRejectReport(true)
      setIds([row.id])
    }
    return (
      approvalOTList?.map((item: any) =>
        createData(item, onApprove, onConfirm, onReject)
      ) || []
    )
  }, [approvalOTList])
  const getListApprovalApi = async (params: IListRequestParams = {}) => {
    const newParams = {
      ...params,
      myOT: false,
    }
    const listQueryParameters = refactorQueryParameters(params)
    const totalQueryParameters = refactorQueryParameters(newParams)
    try {
      await Promise.all([
        dispatch(getListApprovalOT(listQueryParameters)),
        dispatch(getTotalReportOT(totalQueryParameters)),
      ])
    } catch (error) {
      // Xử lý lỗi ở đây nếu cần
      console.error('Error fetching reports:', error)
    }
  }
  useEffect(() => {
    getListApprovalApi(approvalOTTimesheetQueryParameters)
  }, [approvalOTTimesheetQueryParameters])

  const onRejectSelection = () => {
    setShowConfirmRejectReport(true)
    setIds(listCheckedApprovalOT)
  }
  const handleRowClick = async (row: any) => {
    try {
      await handleDetailOTReport(row)
      setIsShowDetailReport(true)
    } catch {}
  }
  const onDeleteClick = () => {}
  const onConfirmReportOT = async () => {
    try {
      await dispatch(
        updateOTReportStatus({
          ids: ids,
          status: STATUS_OT_REPORT_VALUES.CONFIRMED,
        })
      )
      getListApprovalApi(approvalOTTimesheetQueryParameters)
      listOTReportProject()
      setIds([])
      dispatch(setListCheckedApprovalOT([]))
    } catch {}
  }
  const onApproveReportOT = async () => {
    try {
      await dispatch(
        updateOTReportStatus({
          ids: ids,
          status: STATUS_OT_REPORT_VALUES.APPROVED,
        })
      )
      getListApprovalApi(approvalOTTimesheetQueryParameters)
      listOTReportProject()
      setIds([])
      dispatch(setListCheckedApprovalOT([]))
    } catch {}
  }
  const handleDetailOTReport = async (row: any) => {
    try {
      dispatch(updateLoading(true))
      const reportOT = await dispatch(
        getReportOTDetail({ otReportId: parseInt(row.id) })
      )
      setReportOT(reportOT.payload.data)
    } catch (error) {
      // Xử lý lỗi ở đây nếu cần
    } finally {
      dispatch(updateLoading(false))
    }
  }
  const listOTReportProject = async () => {
    const res = await dispatch(getListOTReportProject())
    const currentListProject: any[] = res.payload.data.map((item: any) => ({
      id: item.id,
      label: item.name,
      value: item.id,
    }))
    setListOption(currentListProject)
  }

  useEffect(() => {
    listOTReportProject()
  }, [])

  return (
    <Box className={classes.projectContainer}>
      <TimesheetOTManagementListApprovalAction
        listOptions={listOptions}
        isDivisionDirector={isDivisionDirector}
        isAllReportOT={isAllReportOT}
        onConfirmReportOT={() => {
          setIds(listCheckedApprovalOT)
          setShowConfirmReport(true)
        }}
        onApproveReportOT={() => {
          setIds(listCheckedApprovalOT)
          setShowApproveReport(true)
        }}
        onRejectSelection={onRejectSelection}
      />
      <TableTimesheetOTManagementApprovalList
        totalReportOT={totalReportOT}
        rows={rows}
        headCells={approvalOTListTimesheetHeadCells}
        params={approvalOTTimesheetQueryParameters}
        refactorQueryParameters={refactorQueryParameters}
        onDeleteClick={onDeleteClick}
        onRowClick={handleRowClick}
      />
      {showConfirmRejectReport && (
        <ModalRejectReport
          onClose={() => setShowConfirmRejectReport(false)}
          ids={ids}
          onSubmit={() => {
            getListApprovalApi(approvalOTTimesheetQueryParameters)
            listOTReportProject()
            setIds([])
            dispatch(setListCheckedApprovalOT([]))
          }}
        />
      )}
      {isShowDetailReport && (
        <ModalDetailOTRequest
          reportOTDetail={reportOT}
          isConfirmer
          handleReject={id => {
            setIds([id])
            setShowConfirmRejectReport(true)
          }}
          onClose={() => setIsShowDetailReport(false)}
          onUpdate={() => {
            getListApprovalApi(approvalOTTimesheetQueryParameters)
            listOTReportProject()
          }}
          onOpenRequestOT={(requestId: string) => {
            setRequestId(requestId)
            setIsModalRequestOT(true)
          }}
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
      {showConfirmReport && (
        <ModalConfirm
          open
          title={'Confirmation'}
          description={'Do you wish to confirm this report OT'}
          onClose={() => setShowConfirmReport(false)}
          onSubmit={onConfirmReportOT}
        ></ModalConfirm>
      )}
      {showApproveReport && (
        <ModalConfirm
          open
          title={'Confirmation'}
          description={'Do you wish to approve this report OT'}
          onClose={() => setShowApproveReport(false)}
          onSubmit={onApproveReportOT}
        ></ModalConfirm>
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
export default OTReportForApproval
